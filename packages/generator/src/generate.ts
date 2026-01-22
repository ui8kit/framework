/**
 * High-level generate() API using the new Orchestrator system.
 * 
 * This provides a simple interface similar to the legacy generator.generate(config)
 * but uses the modern service-based architecture internally.
 */

import { writeFile, mkdir, copyFile, readdir, stat, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';

import { Orchestrator } from './core/orchestrator';
import { Logger } from './core/logger';
import type { IServiceContext } from './core/interfaces';
import { 
  LayoutService,
  ViewService,
  CssService,
  HtmlService,
  AssetService,
  HtmlConverterService,
  RenderService,
} from './services';
import {
  LayoutStage,
  ViewStage,
  CssStage,
  HtmlStage,
  AssetStage,
} from './stages';
import { emitVariantsApplyCss } from './scripts/emit-variants-apply.js';
import { emitVariantElements } from './scripts/emit-variant-elements.js';
import type { GeneratorConfig, RouteConfig } from './core/interfaces';

// Re-export types for convenience
export type { GeneratorConfig, RouteConfig };

/**
 * Extended config with all options
 */
export interface GenerateConfig extends GeneratorConfig {
  /** Client script configuration */
  clientScript?: {
    enabled?: boolean;
    outputDir?: string;
    fileName?: string;
    darkModeSelector?: string;
  };
  /** UnCSS configuration */
  uncss?: {
    enabled?: boolean;
    htmlFiles?: string[];
    cssFile?: string;
    outputDir?: string;
    ignore?: string[];
    media?: boolean;
    timeout?: number;
  };
  /** Asset copying configuration */
  assets?: {
    copy?: string[];
  };
  /** Variant elements generation */
  elements?: {
    enabled?: boolean;
    variantsDir?: string;
    outputDir?: string;
    componentsImportPath?: string;
  };
  /** MDX documentation configuration */
  mdx?: {
    enabled: boolean;
    docsDir: string;
    outputDir: string;
    navOutput?: string;
    basePath?: string;
    components?: Record<string, string>;
    propsSource?: string;
    toc?: {
      minLevel?: number;
      maxLevel?: number;
    };
  };
}

/**
 * Generate result
 */
export interface GenerateResult {
  success: boolean;
  duration: number;
  errors: Array<{ stage: string; error: Error }>;
  generated: {
    views: number;
    partials: number;
    cssFiles: number;
    htmlPages: number;
    assets: number;
    elements: number;
  };
}

/**
 * Generate static site from configuration.
 * 
 * This is the main entry point for the generator, providing a simple API
 * that configures and runs the Orchestrator with all required services.
 * 
 * @example
 * ```typescript
 * import { generate } from '@ui8kit/generator';
 * 
 * await generate({
 *   app: { name: 'My App' },
 *   css: { entryPath: './src/main.tsx', routes: ['/'], outputDir: './dist/css' },
 *   html: { viewsDir: './views', routes: { '/': { title: 'Home' } }, outputDir: './dist/html' },
 * });
 * ```
 */
export async function generate(config: GenerateConfig): Promise<GenerateResult> {
  const startTime = performance.now();
  const logger = new Logger({ level: 'info' });
  const errors: Array<{ stage: string; error: Error }> = [];
  const generated = {
    views: 0,
    partials: 0,
    cssFiles: 0,
    htmlPages: 0,
    assets: 0,
    elements: 0,
  };
  
  try {
    logger.info(`🚀 Generating static site for ${config.app.name}`);
    
    // 1. Create and configure Orchestrator
    const orchestrator = new Orchestrator({ logger });
    
    // 2. Register services
    orchestrator.registerService(new LayoutService());
    orchestrator.registerService(new RenderService());
    orchestrator.registerService(new HtmlConverterService());
    orchestrator.registerService(new ViewService());
    orchestrator.registerService(new CssService({ htmlConverter: new HtmlConverterService() }));
    orchestrator.registerService(new HtmlService());
    orchestrator.registerService(new AssetService());
    
    // 3. Add pipeline stages
    orchestrator.addStage(new LayoutStage());
    orchestrator.addStage(new ViewStage());
    orchestrator.addStage(new CssStage());
    orchestrator.addStage(new HtmlStage());
    orchestrator.addStage(new AssetStage());
    
    // 4. Initialize layouts (copy templates if missing)
    logger.info('📐 Initializing layouts...');
    await initializeLayouts(config, logger);
    
    // 5. Generate views (Liquid files from React)
    logger.info('📄 Generating Liquid views...');
    const viewResult = await generateViews(config, logger);
    generated.views = viewResult.views;
    generated.partials = viewResult.partials;
    
    // 6. Generate CSS
    logger.info('🎨 Generating CSS...');
    const cssResult = await generateCss(config, logger);
    generated.cssFiles = cssResult.files;
    
    // 7. Generate HTML
    logger.info('📝 Generating HTML pages...');
    const htmlResult = await generateHtml(config, logger);
    generated.htmlPages = htmlResult.pages;
    
    // 8. Copy assets (CSS and other files)
    if (config.assets?.copy?.length) {
      logger.info('📦 Copying assets...');
      const assetResult = await copyAssets(config, logger);
      generated.assets = assetResult.copied;
    }
    
    // 9. Generate client script
    if (config.clientScript?.enabled) {
      logger.info('📜 Generating client script...');
      await generateClientScript(config, logger);
    }
    
    // 10. Run UnCSS (optional)
    if (config.uncss?.enabled) {
      logger.info('🔧 Running UnCSS optimization...');
      await runUncss(config, logger);
    }
    
    // 11. Generate variant elements (optional)
    if (config.elements?.enabled) {
      logger.info('🧩 Generating variant elements...');
      const elementsResult = await generateVariantElements(config, logger);
      generated.elements = elementsResult.generated;
    }
    
    // 12. Generate MDX documentation (optional)
    if (config.mdx?.enabled) {
      logger.info('📚 Generating MDX documentation...');
      await generateMdxDocs(config, logger);
    }
    
    const duration = performance.now() - startTime;
    logger.info(`✅ Static site generation completed in ${Math.round(duration)}ms!`);
    
    return {
      success: errors.length === 0,
      duration,
      errors,
      generated,
    };
    
  } catch (error) {
    const duration = performance.now() - startTime;
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error(`❌ Generation failed: ${err.message}`);
    errors.push({ stage: 'generate', error: err });
    
    return {
      success: false,
      duration,
      errors,
      generated,
    };
  }
}

// =============================================================================
// Internal generation functions
// =============================================================================

/**
 * Initialize layout templates by copying from generator's templates directory
 */
async function initializeLayouts(
  config: GenerateConfig,
  logger: Logger
): Promise<void> {
  const viewsDir = config.html.viewsDir;
  const layoutsDir = join(viewsDir, 'layouts');
  
  // Create layouts directory
  await mkdir(layoutsDir, { recursive: true });
  
  // Get path to generator's templates directory
  const generatorTemplatesDir = join(
    dirname(fileURLToPath(import.meta.url)),
    '..',
    'templates'
  );
  
  // Template files to copy
  const templateFiles = ['layout.liquid', 'page.liquid'];
  
  for (const templateFile of templateFiles) {
    const destPath = join(layoutsDir, templateFile);
    
    // Check if file already exists
    try {
      await stat(destPath);
      logger.debug(`  Layout exists: ${destPath}`);
      continue;
    } catch {
      // File doesn't exist, copy it
    }
    
    // Try to copy from generator templates
    const srcPath = join(generatorTemplatesDir, templateFile);
    
    try {
      const content = await readFile(srcPath, 'utf-8');
      await writeFile(destPath, content, 'utf-8');
      logger.info(`  → Created layout: ${destPath}`);
    } catch (error) {
      logger.warn(`  ⚠️ Could not copy template ${templateFile}: ${error}`);
    }
  }
}

async function generateViews(
  config: GenerateConfig, 
  logger: Logger
): Promise<{ views: number; partials: number }> {
  const renderService = new RenderService();
  const minimalContext = createMinimalContext(config, logger);
  await renderService.initialize(minimalContext);
  
  const viewsDir = config.html.viewsDir;
  const pagesDir = join(viewsDir, 'pages');
  await mkdir(pagesDir, { recursive: true });
  
  let viewCount = 0;
  let partialCount = 0;
  
  // Generate partials first
  if (config.html.partials) {
    const { sourceDir, outputDir = 'partials', props = {} } = config.html.partials;
    const partialsOutputDir = join(viewsDir, outputDir);
    await mkdir(partialsOutputDir, { recursive: true });
    
    try {
      const entries = await readdir(sourceDir);
      
      for (const entry of entries) {
        if (!entry.match(/\.(tsx?|jsx?)$/i)) continue;
        
        const componentName = entry.replace(/\.(tsx?|jsx?)$/i, '');
        const modulePath = join(sourceDir, entry);
        const componentProps = props[componentName] ?? {};
        
        try {
          const result = await renderService.execute({
            type: 'component',
            modulePath,
            exportName: componentName,
            props: componentProps,
          });
          
          // Fix Liquid escaping
          let html = unescapeLiquidTags(result.html);
          
          const outputFileName = `${componentName.toLowerCase()}.liquid`;
          const outputPath = join(partialsOutputDir, outputFileName);
          
          const header = `{% comment %} Auto-generated partial. Do not edit manually. {% endcomment %}\n`;
          await writeFile(outputPath, header + html + '\n', 'utf-8');
          
          logger.info(`  → ${outputPath}`);
          partialCount++;
        } catch (error) {
          logger.warn(`  ⚠️ Failed to generate partial ${componentName}: ${error}`);
        }
      }
    } catch (error) {
      logger.warn(`  ⚠️ Failed to read partials directory: ${error}`);
    }
  }
  
  // Generate page views from routes
  for (const [routePath] of Object.entries(config.html.routes)) {
    try {
      const result = await renderService.execute({
        type: 'route',
        entryPath: config.css.entryPath,
        routePath,
      });
      
      const viewFileName = routePath === '/' ? 'index.liquid' : `${routePath.slice(1)}.liquid`;
      const viewPath = join(pagesDir, viewFileName);
      
      await mkdir(dirname(viewPath), { recursive: true });
      await writeFile(viewPath, result.html, 'utf-8');
      
      logger.info(`  → ${viewPath}`);
      viewCount++;
    } catch (error) {
      logger.warn(`  ⚠️ Failed to generate view for ${routePath}: ${error}`);
    }
  }
  
  return { views: viewCount, partials: partialCount };
}

async function generateCss(
  config: GenerateConfig,
  logger: Logger
): Promise<{ files: number }> {
  const converterService = new HtmlConverterService();
  const minimalContext = createMinimalContext(config, logger);
  await converterService.initialize(minimalContext);
  
  const { viewsDir } = config.html;
  const { outputDir, pureCss = false } = config.css;
  
  await mkdir(outputDir, { recursive: true });
  
  // Emit variants.apply.css first
  const variantsCss = await emitVariantsApplyCss({
    variantsDir: config.elements?.variantsDir ?? './src/variants',
  });
  const variantsOutputPath = join(outputDir, 'variants.apply.css');
  await writeFile(variantsOutputPath, variantsCss, 'utf-8');
  logger.info(`✅ Generated ${variantsOutputPath} (${variantsCss.length} bytes)`);
  
  let fileCount = 1; // variants.apply.css
  
  const allApplyCss: string[] = [];
  const allPureCss: string[] = [];
  
  // Process page views
  for (const routePath of Object.keys(config.html.routes)) {
    const viewFileName = routePath === '/' ? 'index.liquid' : `${routePath.slice(1)}.liquid`;
    const viewPath = join(viewsDir, 'pages', viewFileName);
    
    try {
      const result = await converterService.execute({ htmlPath: viewPath, verbose: true });
      allApplyCss.push(result.applyCss);
      if (pureCss) {
        allPureCss.push(result.pureCss);
      }
    } catch (error) {
      logger.warn(`  ⚠️ Failed to process CSS for ${routePath}: ${error}`);
    }
  }
  
  // Process partials and layouts
  const templateDirs = [
    join(viewsDir, 'partials'),
    join(viewsDir, 'layouts'),
  ];
  
  for (const dirPath of templateDirs) {
    try {
      const entries = await readdir(dirPath);
      for (const entry of entries) {
        if (!entry.endsWith('.liquid')) continue;
        const filePath = join(dirPath, entry);
        
        logger.info(`📄 Processing template: ${filePath}`);
        
        try {
          const result = await converterService.execute({ htmlPath: filePath, verbose: true });
          allApplyCss.push(result.applyCss);
          if (pureCss) {
            allPureCss.push(result.pureCss);
          }
        } catch (error) {
          logger.warn(`  ⚠️ Failed to process CSS for ${filePath}: ${error}`);
        }
      }
    } catch {
      // Directory doesn't exist
    }
  }
  
  // Merge and write CSS files
  const mergedApplyCss = mergeCssFiles(allApplyCss.filter(Boolean));
  const applyCssPath = join(outputDir, 'tailwind.apply.css');
  await writeFile(applyCssPath, mergedApplyCss, 'utf-8');
  logger.info(`✅ Generated ${applyCssPath} (${mergedApplyCss.length} bytes)`);
  fileCount++;
  
  if (pureCss) {
    const mergedPureCss = mergeCssFiles(allPureCss.filter(Boolean));
    const pureCssPath = join(outputDir, 'ui8kit.local.css');
    await writeFile(pureCssPath, mergedPureCss, 'utf-8');
    logger.info(`✅ Generated ${pureCssPath} (${mergedPureCss.length} bytes)`);
    fileCount++;
  }
  
  return { files: fileCount };
}

async function generateHtml(
  config: GenerateConfig,
  logger: Logger
): Promise<{ pages: number }> {
  const { Liquid } = await import('liquidjs');
  const engine = new Liquid({ 
    root: [config.html.viewsDir],
    extname: '.liquid',
  });
  
  const { outputDir, mode = 'tailwind', stripDataClassInTailwind = false } = config.html;
  await mkdir(outputDir, { recursive: true });
  
  let pageCount = 0;
  
  // Load CSS for inline mode
  let cssContent: string | undefined;
  if (mode === 'inline') {
    try {
      const cssPath = join(config.css.outputDir, 'ui8kit.local.css');
      cssContent = await readFile(cssPath, 'utf-8');
    } catch {
      logger.warn('  ⚠️ Could not load CSS for inline mode');
    }
  }
  
  for (const [routePath, routeConfig] of Object.entries(config.html.routes)) {
    try {
      const viewFileName = routePath === '/' ? 'index.liquid' : `${routePath.slice(1)}.liquid`;
      const viewPath = join(config.html.viewsDir, 'pages', viewFileName);
      const viewContent = await readFile(viewPath, 'utf-8');
      
      const templateData = {
        content: viewContent,
        title: routeConfig.title,
        meta: buildMetaTags(routeConfig, config.app),
        lang: config.app.lang ?? 'en',
        name: config.app.name,
        ...routeConfig.data,
      };
      
      let html = await engine.renderFile('layouts/layout.liquid', templateData);
      
      // Process based on mode
      html = processHtmlContent(html, mode, cssContent, stripDataClassInTailwind);
      
      const htmlFileName = routePath === '/' ? 'index.html' : `${routePath.slice(1)}/index.html`;
      const htmlPath = join(outputDir, htmlFileName);
      
      await mkdir(dirname(htmlPath), { recursive: true });
      await writeFile(htmlPath, html, 'utf-8');
      
      logger.info(`  → ${htmlPath}`);
      pageCount++;
    } catch (error) {
      logger.error(`  ❌ Failed to generate HTML for ${routePath}: ${error}`);
    }
  }
  
  return { pages: pageCount };
}

async function copyAssets(
  config: GenerateConfig,
  logger: Logger
): Promise<{ copied: number }> {
  const patterns = config.assets?.copy ?? [];
  let copied = 0;
  
  for (const pattern of patterns) {
    const files = await glob(pattern, { nodir: true });
    
    for (const file of files) {
      // Normalize path separators
      const normalizedFile = file.replace(/\\/g, '/');
      
      // Get just the filename
      const fileName = normalizedFile.split('/').pop() ?? normalizedFile;
      
      // Determine output path based on file type
      let outputPath: string;
      
      if (normalizedFile.includes('/css/') || fileName.endsWith('.css')) {
        // CSS files go to css output directory
        outputPath = join(config.css.outputDir, fileName);
      } else if (normalizedFile.includes('/js/') || fileName.endsWith('.js')) {
        // JS files go to html assets/js
        outputPath = join(config.html.outputDir, 'assets', 'js', fileName);
      } else {
        // Other files go to html assets with just the filename
        outputPath = join(config.html.outputDir, 'assets', fileName);
      }
      
      await mkdir(dirname(outputPath), { recursive: true });
      await copyFile(file, outputPath);
      
      logger.info(`  → ${outputPath}`);
      copied++;
    }
  }
  
  logger.info(`  ✅ Copied ${copied} asset files`);
  return { copied };
}

async function generateClientScript(
  config: GenerateConfig,
  logger: Logger
): Promise<void> {
  const { outputDir = './dist/assets/js', fileName = 'main.js', darkModeSelector = '[data-toggle-dark]' } = config.clientScript ?? {};
  
  await mkdir(outputDir, { recursive: true });
  
  const script = `// Auto-generated client script
(function() {
  'use strict';
  
  // Dark mode toggle
  const toggles = document.querySelectorAll('${darkModeSelector}');
  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    });
  });
  
  // Apply saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
})();
`;
  
  const outputPath = join(outputDir, fileName);
  await writeFile(outputPath, script, 'utf-8');
  logger.info(`  → ${outputPath}`);
}

async function runUncss(
  config: GenerateConfig,
  logger: Logger
): Promise<void> {
  const uncssConfig = config.uncss;
  if (!uncssConfig) return;
  
  try {
    // @ts-ignore - uncss is CommonJS
    const uncss = (await import('uncss')).default;
    
    const result = await new Promise<string>((resolve, reject) => {
      uncss(uncssConfig.htmlFiles, {
        stylesheets: [uncssConfig.cssFile],
        ignore: uncssConfig.ignore,
        media: uncssConfig.media ?? true,
        timeout: uncssConfig.timeout ?? 10000,
      }, (error: Error | null, output: string) => {
        if (error) reject(error);
        else resolve(output);
      });
    });
    
    const outputPath = join(uncssConfig.outputDir ?? '.', 'optimized.css');
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, result, 'utf-8');
    
    logger.info(`  → ${outputPath}`);
  } catch (error) {
    logger.warn(`  ⚠️ UnCSS failed: ${error}`);
  }
}

async function generateVariantElements(
  config: GenerateConfig,
  logger: Logger
): Promise<{ generated: number }> {
  const elementsConfig = config.elements;
  if (!elementsConfig) return { generated: 0 };
  
  const outputDir = elementsConfig.outputDir ?? './src/elements';
  
  const result = await emitVariantElements({
    variantsDir: elementsConfig.variantsDir ?? './src/variants',
    outputDir,
    componentsImportPath: elementsConfig.componentsImportPath ?? '../components',
  });
  
  // Write files to disk
  await mkdir(outputDir, { recursive: true });
  
  for (const [fileName, content] of result.files.entries()) {
    const filePath = join(outputDir, fileName);
    await writeFile(filePath, content, 'utf-8');
    logger.info(`  → ${filePath}`);
  }
  
  logger.info(`✅ Generated ${result.files.size} element files`);
  
  return { generated: result.files.size };
}

/**
 * Generate MDX documentation using MdxService.
 * 
 * This function dynamically imports and uses the MdxService from @ui8kit/mdx-react
 * to generate static HTML documentation from MDX files.
 */
async function generateMdxDocs(
  config: GenerateConfig,
  logger: Logger
): Promise<{ pages: number }> {
  const mdxConfig = config.mdx;
  if (!mdxConfig) return { pages: 0 };
  
  try {
    // Try multiple import paths for MdxService
    let MdxService: any;
    
    // Try package import first
    try {
      const module = await import('@ui8kit/mdx-react/service');
      MdxService = module.MdxService;
    } catch {
      // Try relative workspace path (for monorepo development)
      try {
        const module = await import('../../mdx-react/src/service/index.js');
        MdxService = module.MdxService;
      } catch {
        // Try source path
        const module = await import('../../../packages/mdx-react/src/service/MdxService.js');
        MdxService = module.MdxService;
      }
    }
    
    if (!MdxService) {
      throw new Error('MdxService class not found');
    }
    
    const service = new MdxService();
    
    // Initialize service with minimal context
    await service.initialize({
      config: {
        html: { mode: config.html.mode ?? 'tailwind' },
      },
      logger: {
        debug: (msg: string) => logger.debug(msg),
        info: (msg: string) => logger.info(msg),
        warn: (msg: string) => logger.warn(msg),
        error: (msg: string) => logger.error(msg),
      },
    });
    
    // Execute MDX generation
    const result = await service.execute({
      docsDir: mdxConfig.docsDir,
      outputDir: mdxConfig.outputDir,
      basePath: mdxConfig.basePath,
      navOutput: mdxConfig.navOutput,
      components: mdxConfig.components,
      propsSource: mdxConfig.propsSource,
      toc: mdxConfig.toc,
      htmlMode: config.html.mode ?? 'tailwind',
      verbose: true,
    });
    
    // Cleanup
    await service.dispose();
    
    logger.info(`✅ Generated ${result.pages} documentation pages in ${Math.round(result.duration)}ms`);
    
    return { pages: result.pages };
  } catch (error) {
    // Fallback: if MdxService is not available, log warning
    logger.warn(`⚠️ MdxService not available: ${error}`);
    logger.info('📚 Skipping MDX generation (install @ui8kit/mdx-react for MDX support)');
    return { pages: 0 };
  }
}

// =============================================================================
// Helper functions
// =============================================================================

function createMinimalContext(config: GenerateConfig, logger: Logger): IServiceContext {
  return {
    config: config as any,
    logger: logger as any,
    eventBus: {
      emit: () => {},
      on: () => () => {},
      once: () => () => {},
      off: () => {},
      removeAllListeners: () => {},
      listenerCount: () => 0,
    },
    registry: {
      has: () => false,
      resolve: () => { throw new Error('Not implemented'); },
      register: () => {},
      getServiceNames: () => [],
      getInitializationOrder: () => [],
      initializeAll: async () => {},
      disposeAll: async () => {},
    },
  } as any;
}

function unescapeLiquidTags(html: string): string {
  const decode = (s: string) =>
    s.replace(/&#x27;|&apos;/g, "'").replace(/&quot;|&#34;/g, '"');
  
  html = html.replace(/\{\{[\s\S]*?\}\}/g, (m) => decode(m));
  html = html.replace(/\{%\s*[\s\S]*?\s*%\}/g, (m) => decode(m));
  
  return html;
}

function mergeCssFiles(cssFiles: string[]): string {
  if (cssFiles.length === 0) return '';
  if (cssFiles.length === 1) return cssFiles[0];
  
  return cssFiles.join('\n\n/* === Next Source === */\n\n')
    .replace(/Generated on: .*/, `Generated on: ${new Date().toISOString()}`);
}

function buildMetaTags(route: RouteConfig, app: { name: string }): Record<string, string> {
  const meta: Record<string, string> = {};
  
  if (route.seo?.description) {
    meta.description = route.seo.description;
    meta['og:description'] = route.seo.description;
  }
  
  if (route.seo?.keywords) {
    meta.keywords = route.seo.keywords.join(', ');
  }
  
  meta['og:title'] = route.title;
  
  if (route.seo?.image) {
    meta['og:image'] = route.seo.image;
  }
  
  return meta;
}

function processHtmlContent(
  html: string,
  mode: 'tailwind' | 'semantic' | 'inline',
  cssContent?: string,
  stripDataClass?: boolean
): string {
  if (mode === 'tailwind') {
    if (stripDataClass) {
      return html.replace(/\s+data-class\s*=\s*["'][^"']*["']/g, '');
    }
    return html;
  }
  
  if (mode === 'semantic' || mode === 'inline') {
    html = html.replace(/\s+class\s*=\s*["'][^"']*["']/g, '');
    html = html.replace(/data-class\s*=\s*["']([^"']*)["']/g, 'class="$1"');
  }
  
  if (mode === 'inline' && cssContent) {
    const minified = cssContent
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*{\s*/g, '{')
      .replace(/\s*}\s*/g, '}')
      .replace(/\s*;\s*/g, ';')
      .replace(/;\s*}/g, '}')
      .trim();
    html = html.replace('</head>', `  <style>${minified}</style>\n  </head>`);
  }
  
  return html;
}

/**
 * Create a generator instance (for backward compatibility)
 */
export function createGenerator() {
  return { generate };
}

// Default export for simple usage
export default { generate };
