// import React from 'react';
import { writeFile, mkdir, readdir, readFile, copyFile, stat } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { Liquid } from 'liquidjs';
import { htmlConverter } from './html-converter.js';
// Import render directly from source to avoid bundling issues
import { renderRoute, renderComponent } from '@ui8kit/render';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';

// @ts-ignore - uncss is CommonJS module without types
import uncss from 'uncss';
import { emitVariantElements } from './scripts/emit-variant-elements.js';

export interface GeneratorConfig {
  app: {
    name: string;
    lang?: string;
  };
  css: {
    entryPath: string;
    routes: string[];
    outputDir: string;
    pureCss?: boolean;
  };
  html: {
    viewsDir: string;
    routes: Record<string, RouteConfig>;
    outputDir: string;
    mode?: 'tailwind' | 'semantic' | 'inline'; // HTML processing mode
    /**
     * Optional: generate Liquid partial templates from React partial components.
     * When enabled, generator will render all components in `sourceDir` and write them to `${viewsDir}/${outputDir}`.
     */
    partials?: {
      /**
       * Directory containing React partial components (e.g. './src/partials').
       * Relative to the current working directory.
       */
      sourceDir: string;
      /**
       * Output directory under `viewsDir` (defaults to 'partials').
       */
      outputDir?: string;
      /**
       * Optional per-component props passed at render-time.
       * Keyed by component name (usually the filename without extension).
       */
      props?: Record<string, Record<string, any>>;
    };
    /**
     * Tailwind-only output tweak:
     * - when true, removes `data-class="..."` from the generated HTML
     * - keeps regular `class="..."` untouched
     */
    stripDataClassInTailwind?: boolean;
  };
  clientScript?: {
    /**
     * Generate client-side JavaScript for interactivity
     */
    enabled?: boolean;
    /**
     * Output directory for client script (defaults to './dist/assets/js')
     */
    outputDir?: string;
    /**
     * Name of the generated script file (defaults to 'main.js')
     */
    fileName?: string;
    /**
     * Dark mode toggle selector (defaults to '[data-toggle-dark]')
     */
    darkModeSelector?: string;
  };
  uncss?: {
    /**
     * Enable unused CSS removal with UnCSS
     */
    enabled?: boolean;
    /**
     * HTML files to analyze for used CSS classes
     */
    htmlFiles?: string[];
    /**
     * CSS file to process (relative to project root)
     */
    cssFile?: string;
    /**
     * Output directory for cleaned CSS files
     */
    outputDir?: string;
    /**
     * CSS selectors to ignore during cleanup (defaults to common interactive/dynamic selectors)
     */
    ignore?: string[];
    /**
     * Include media queries in analysis
     */
    media?: boolean;
    /**
     * Timeout for UnCSS processing in milliseconds
     */
    timeout?: number;
  };
  assets?: {
    copy?: string[];
  };
  /**
   * Generate reusable variant elements (React components with data-class attributes).
   */
  elements?: {
    /**
     * Enable generation of variant elements
     */
    enabled?: boolean;
    /**
     * Directory containing variant definitions (e.g. './src/variants')
     */
    variantsDir?: string;
    /**
     * Output directory for generated elements (e.g. './src/elements')
     */
    outputDir?: string;
    /**
     * Import path for components (e.g. '../components')
     */
    componentsImportPath?: string;
  };
  /**
   * MDX documentation generation configuration
   */
  mdx?: {
    /**
     * Enable MDX documentation generation
     */
    enabled: boolean;
    /**
     * Directory containing MDX documentation files
     * @example './docs'
     */
    docsDir: string;
    /**
     * Output directory for Liquid page templates
     * @example './views/pages/docs'
     */
    outputDir: string;
    /**
     * Output directory for demo partials
     * @example './views/partials/demos'
     */
    demosDir?: string;
    /**
     * Output path for navigation JSON (for sidebar)
     * @example './dist/docs-nav.json'
     */
    navOutput?: string;
    /**
     * Base URL path for documentation
     * @example '/docs'
     */
    basePath?: string;
    /**
     * Components available in MDX without explicit import
     */
    components?: Record<string, string>;
    /**
     * Directory containing TypeScript component sources for props extraction
     * @example './src/components'
     */
    propsSource?: string;
    /**
     * Table of Contents configuration
     */
    toc?: {
      minLevel?: number;
      maxLevel?: number;
    };
  };
}

// RouteConfig is now defined in @ui8kit/render package
export interface RouteConfig {
  title: string;
  seo?: {
    description?: string;
    keywords?: string[];
    image?: string;
  };
  data?: Record<string, any>;
}

export class Generator {
  private liquid: Liquid;
  private templatesDir: string;

  constructor() {
    this.liquid = new Liquid({
      root: process.cwd(),
      extname: '.liquid'
    });

    this.registerFilters();
    const pkgDir = dirname(fileURLToPath(import.meta.url));
    this.templatesDir = join(pkgDir, '../templates');
  }

  async generate(config: GeneratorConfig): Promise<void> {
    console.log(`🚀 Generating static site for ${config.app.name}`);

    await this.ensureLayouts(config);

    // 1. Generate Liquid views from React components (with data-class attributes)
    await this.generateViews(config);

    // 2. Generate CSS from views (instead of snapshots)
    await this.generateCss(config);

    // 3. Prepare production CSS assets
    await this.prepareProductionCss(config);

    // 4. Generate final HTML from Liquid views
    await this.generateHtml(config);

    // 5. Generate client script
    await this.generateClientScript(config);

    // 6. Clean unused CSS with UnCSS
    await this.runUncss(config);

    // 7. Copy assets
    await this.copyAssets(config);

    // 8. Generate variant elements (optional)
    await this.generateVariantElements(config);

    // 9. Generate MDX documentation (optional)
    await this.generateMdxDocs(config);

    console.log('✅ Static site generation completed!');
  }

  private async generateVariantElements(config: GeneratorConfig): Promise<void> {
    if (!config.elements?.enabled) return;

    console.log('🧩 Generating variant elements...');

    const variantsDir = config.elements.variantsDir ?? './src/variants';
    const outputDir = config.elements.outputDir ?? './src/elements';
    const componentsImportPath = config.elements.componentsImportPath ?? '../components';

    const absVariantsDir = join(process.cwd(), variantsDir);
    const absOutputDir = join(process.cwd(), outputDir);

    try {
      const result = await emitVariantElements({
        variantsDir: absVariantsDir,
        outputDir: absOutputDir,
        componentsImportPath,
      });

      // Ensure output directory exists
      await this.ensureDir(absOutputDir);

      // Write all generated files
      for (const [fileName, content] of result.files) {
        const filePath = join(absOutputDir, fileName);
        await writeFile(filePath, content, 'utf-8');
        console.log(`  → ${filePath}`);
      }

      console.log(`✅ Generated ${result.files.size} element files`);
    } catch (error) {
      console.warn('⚠️ Failed to generate variant elements:', error);
    }
  }

  private async generateMdxDocs(config: GeneratorConfig): Promise<void> {
    if (!config.mdx?.enabled) return;

    console.log('📚 Generating MDX documentation...');
    
    const docsDir = resolve(config.mdx.docsDir);
    const outputDir = config.mdx.outputDir || './dist/html';
    const basePath = config.mdx.basePath || '';

    try {
      // Scan docs folder for MDX files
      const mdxFiles = await this.scanMdxFiles(docsDir);
      console.log(`  Found ${mdxFiles.length} MDX files`);

      // For each MDX file, generate static HTML
      for (const file of mdxFiles) {
        // Use relative() to correctly strip the docs directory
        const relativePath = relative(docsDir, file);
        const urlPath = this.mdxFileToUrl(relativePath, basePath);
        const outputPath = this.urlToOutputPath(urlPath, outputDir);
        
        console.log(`  → ${relativePath} → ${urlPath}`);
        
        await this.generateMdxPlaceholder(file, outputPath, urlPath);
      }

      // Generate navigation JSON
      if (config.mdx.navOutput) {
        const nav = await this.generateDocsNav(mdxFiles, docsDir, basePath);
        await writeFile(config.mdx.navOutput, JSON.stringify(nav, null, 2));
        console.log(`  → ${config.mdx.navOutput}`);
      }

      console.log(`✅ Generated ${mdxFiles.length} documentation pages`);
    } catch (error) {
      console.warn('⚠️ Failed to generate MDX documentation:', error);
    }
  }

  private async scanMdxFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    
    const scan = async (currentDir: string) => {
      const entries = await readdir(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(currentDir, entry.name);
        
        if (entry.isDirectory()) {
          await scan(fullPath);
        } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
          files.push(fullPath);
        }
      }
    };
    
    await scan(dir);
    return files;
  }

  private mdxFileToUrl(relativePath: string, basePath: string): string {
    let url = relativePath
      .replace(/\.(mdx?|md)$/, '')
      .replace(/[\\]/g, '/');
    
    // Handle index files
    if (url.endsWith('/index') || url === 'index') {
      url = url.replace(/\/?index$/, '');
    }
    
    // Add base path
    const base = basePath.replace(/\/$/, '');
    return url ? `${base}/${url}` : base || '/';
  }

  private urlToOutputPath(urlPath: string, outputDir: string): string {
    // / → index.html
    // /components → components/index.html
    // /components/button → components/button/index.html
    if (urlPath === '/' || urlPath === '') {
      return join(outputDir, 'index.html');
    }
    return join(outputDir, urlPath, 'index.html');
  }

  private async generateMdxPlaceholder(
    mdxPath: string, 
    outputPath: string, 
    urlPath: string
  ): Promise<void> {
    // Read frontmatter from MDX file
    const content = await readFile(mdxPath, 'utf-8');
    const frontmatter = this.parseFrontmatter(content);
    
    // Create a simple HTML placeholder
    // Full rendering requires Vite SSG
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${frontmatter.title || 'Documentation'}</title>
  <meta name="description" content="${frontmatter.description || ''}">
  <link rel="stylesheet" href="/assets/css/styles.css">
</head>
<body>
  <div id="app">
    <div class="docs-page" data-class="docs-page">
      <article class="docs-content" data-class="docs-content">
        <h1>${frontmatter.title || urlPath}</h1>
        <p>${frontmatter.description || ''}</p>
        <p><em>This page requires JavaScript for full content. Enable JavaScript or use the dev server.</em></p>
      </article>
    </div>
  </div>
  <script type="module" src="/assets/js/main.js"></script>
</body>
</html>`;
    
    // Ensure directory exists
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, html);
  }

  private parseFrontmatter(content: string): Record<string, string> {
    const match = /^---\s*\n([\s\S]*?)\n---/.exec(content);
    if (!match) return {};
    
    const frontmatter: Record<string, string> = {};
    const lines = match[1].split('\n');
    
    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) continue;
      
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      
      // Remove quotes
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      frontmatter[key] = value;
    }
    
    return frontmatter;
  }

  private async generateDocsNav(
    files: string[], 
    docsDir: string, 
    basePath: string
  ): Promise<{ items: Array<{ title: string; path: string }> }> {
    const items: Array<{ title: string; path: string; order: number }> = [];
    const resolvedDocsDir = resolve(docsDir);
    
    for (const file of files) {
      const content = await readFile(file, 'utf-8');
      const frontmatter = this.parseFrontmatter(content);
      const relativePath = relative(resolvedDocsDir, file);
      const urlPath = this.mdxFileToUrl(relativePath, basePath);
      
      items.push({
        title: frontmatter.title || urlPath || 'Home',
        path: urlPath || '/',
        order: parseInt(frontmatter.order || '99', 10),
      });
    }
    
    // Sort by order
    items.sort((a, b) => a.order - b.order);
    
    return { 
      items: items.map(({ title, path }) => ({ title, path }))
    };
  }

  private async generateCss(config: GeneratorConfig): Promise<void> {
    console.log('🎨 Generating CSS...');

    // Generate CSS for all routes that have views (use html.routes as source of truth)
    const allApplyCss: string[] = [];
    const allPureCss: string[] = [];

    // 0) Emit semantic component variants CSS (independent of HTML snapshots)
    await this.emitVariantsApplyCss(config);

    for (const routePath of Object.keys(config.html.routes)) {
      console.log(`📄 Processing route: ${routePath}`);

      // Get view file path for the route
      const viewFileName = routePath === '/' ? 'index.liquid' : `${routePath.slice(1)}.liquid`;
      const viewPath = join(config.html.viewsDir, 'pages', viewFileName);

      // Convert Liquid view to CSS
      const { applyCss, pureCss: routePureCss } = await htmlConverter.convertHtmlToCss(
        viewPath,
        `${config.css.outputDir}/tailwind.apply.css`,
        config.css.pureCss ? `${config.css.outputDir}/ui8kit.local.css` : `${config.css.outputDir}/tailwind.apply.css`,
        { verbose: true }
      );

      allApplyCss.push(applyCss);
      if (config.css.pureCss) {
        allPureCss.push(routePureCss);
      }
    }

    // Also include shared layout and partial templates (so semantic mode can style them)
    const extraDirs = [
      join(config.html.viewsDir, 'partials'),
      join(config.html.viewsDir, 'layouts'),
    ];

    for (const dirPath of extraDirs) {
      let dirEntries: any[] = [];
      try {
        dirEntries = await readdir(dirPath, { withFileTypes: true } as any) as any[];
      } catch {
        continue;
      }

      for (const entry of dirEntries) {
        if (!entry?.isFile?.()) continue;
        if (!String(entry.name).toLowerCase().endsWith('.liquid')) continue;

        const filePath = join(dirPath, entry.name);
        console.log(`📄 Processing template: ${filePath}`);

        const { applyCss, pureCss: routePureCss } = await htmlConverter.convertHtmlToCss(
          filePath,
          `${config.css.outputDir}/tailwind.apply.css`,
          config.css.pureCss ? `${config.css.outputDir}/ui8kit.local.css` : `${config.css.outputDir}/tailwind.apply.css`,
          { verbose: true }
        );

        allApplyCss.push(applyCss);
        if (config.css.pureCss) {
          allPureCss.push(routePureCss);
        }
      }
    }

    // Write CSS files separately (no merging - developer imports what they need)
    // variants.apply.css - already written by emitVariantsApplyCss
    // tailwind.apply.css - layout/page specific selectors only
    const finalApplyCss = this.mergeCssFiles(allApplyCss.filter(Boolean));
    await Bun.write(`${config.css.outputDir}/tailwind.apply.css`, finalApplyCss);

    console.log(`✅ Generated ${config.css.outputDir}/tailwind.apply.css (${finalApplyCss.length} bytes)`);

    if (config.css.pureCss) {
      const finalPureCss = this.mergeCssFiles(allPureCss);
      await Bun.write(`${config.css.outputDir}/ui8kit.local.css`, finalPureCss);
      console.log(`✅ Generated ${config.css.outputDir}/ui8kit.local.css (${finalPureCss.length} bytes)`);
    }
  }


  private async generateViews(config: GeneratorConfig): Promise<void> {
    console.log('📄 Generating Liquid views...');

    // 0. Generate Liquid partials from React partial components (optional)
    await this.generatePartials(config);

    // Generate views for all HTML routes (not just CSS routes)
    for (const routePath of Object.keys(config.html.routes)) {
      const routeConfig = config.html.routes[routePath];
      const viewContent = await this.generateViewContent(config, routePath, routeConfig);
      const viewFileName = routePath === '/' ? 'index.liquid' : `${routePath.slice(1)}.liquid`;
      const viewPath = join(config.html.viewsDir, 'pages', viewFileName);

      await this.ensureDir(dirname(viewPath));
      await writeFile(viewPath, viewContent, 'utf-8');

      console.log(`  → ${viewPath}`);
    }
  }

  private async generatePartials(config: GeneratorConfig): Promise<void> {
    const partialsConfig = config.html.partials;
    if (!partialsConfig) return;

    console.log('🧩 Generating Liquid partials...');

    const absSourceDir = join(process.cwd(), partialsConfig.sourceDir);
    const outputDirName = partialsConfig.outputDir ?? 'partials';
    const absOutputDir = join(process.cwd(), config.html.viewsDir, outputDirName);
    const propsByComponent = partialsConfig.props ?? {};

    let entries: string[] = [];
    try {
      entries = await readdir(absSourceDir);
    } catch (error) {
      console.warn(`⚠️ Partials sourceDir not found: ${partialsConfig.sourceDir}`);
      return;
    }

    await this.ensureDir(absOutputDir);

    for (const fileName of entries) {
      const entryPath = join(absSourceDir, fileName);
      try {
        const stat = await Bun.file(entryPath).stat();
        if (!stat.isFile()) continue;
      } catch {
        continue;
      }
      const lower = fileName.toLowerCase();
      const isRenderable =
        lower.endsWith('.tsx') || lower.endsWith('.ts') || lower.endsWith('.jsx') || lower.endsWith('.js');
      if (!isRenderable) continue;

      const componentName = fileName.replace(/\.(tsx|ts|jsx|js)$/i, '');
      const modulePath = join(absSourceDir, fileName);
      const outFileName = `${componentName.toLowerCase()}.liquid`;
      const outPath = join(absOutputDir, outFileName);

      const props = propsByComponent[componentName] ?? {};

      try {
        // Prefer a named export that matches the filename, fall back to default export.
        let html: string;
        try {
          html = await renderComponent({ modulePath, exportName: componentName, props });
        } catch {
          html = await renderComponent({ modulePath, props });
        }

        // React escapes quotes inside text nodes, which breaks Liquid string literals.
        // Fix common HTML entities inside Liquid tags so templates remain valid.
        html = this.unescapeLiquidTags(html);

        const header = `{% comment %} Generated from ${partialsConfig.sourceDir}/${fileName} by @ui8kit/generator. Do not edit manually. {% endcomment %}\n`;
        await writeFile(outPath, header + html + '\n', 'utf-8');
        console.log(`  → ${join(config.html.viewsDir, outputDirName, outFileName)}`);
      } catch (error) {
        console.warn(`⚠️ Failed to generate partial from ${fileName}:`, error);
      }
    }
  }

  private unescapeLiquidTags(html: string): string {
    const decode = (s: string) =>
      s
        .replace(/&#x27;|&apos;/g, "'")
        .replace(/&quot;|&#34;/g, '"');

    // Unescape inside Liquid output tags: {{ ... }}
    html = html.replace(/\{\{[\s\S]*?\}\}/g, (m) => decode(m));
    // Unescape inside Liquid statement tags: {% ... %}
    html = html.replace(/\{%\s*[\s\S]*?\s*%\}/g, (m) => decode(m));
    return html;
  }

  private async generateViewContent(
    config: GeneratorConfig,
    routePath: string,
    routeConfig: GeneratorConfig['html']['routes'][string]
  ): Promise<string> {
    // Use the render package to convert React component to HTML
    // It will parse the router config from entryPath and render the correct component
    const html = await renderRoute({
      entryPath: config.css.entryPath,
      routePath
    });

    return html;
  }

  private async generateHtml(config: GeneratorConfig): Promise<void> {
    console.log('🏗️ Generating final HTML pages...');

    // Determine HTML mode (default to 'tailwind')
    const htmlMode = config.html.mode || 'tailwind';
    console.log(`📄 HTML mode: ${htmlMode}`);

    // For inline mode, load the CSS content to inject
    let cssContent: string | undefined;
    if (htmlMode === 'inline') {
      try {
        const cssPath = join(config.css.outputDir, 'ui8kit.local.css');
        cssContent = await Bun.file(cssPath).text();
        console.log(`📄 Loaded CSS for inline injection (${cssContent.length} bytes)`);
      } catch (error) {
        console.warn('⚠️ Could not load CSS for inline mode, falling back to semantic mode');
        // Fall back to semantic mode if CSS file is not available
      }
    }

    for (const [routePath, route] of Object.entries(config.html.routes)) {
      // Load the corresponding view
      const viewFileName = routePath === '/' ? 'index.liquid' : `${routePath.slice(1)}.liquid`;
      const viewPath = join(config.html.viewsDir, 'pages', viewFileName);

      try {
        // Read the view content (it's just HTML)
        const viewContent = await Bun.file(viewPath).text();

        // Set root to views directory for proper partials resolution
        this.liquid = new Liquid({
          root: config.html.viewsDir,
          extname: '.liquid'
        });

        // Render through layout template
        const html = await this.liquid.renderFile('layouts/layout.liquid', {
          content: viewContent,
          title: route.title,
          meta: this.buildMetaTags(route, config),
          ...config.app,
          ...route.data
        });

        // Process HTML content based on mode
        const processedHtml = this.processHtmlContent(
          html,
          htmlMode,
          cssContent,
          config.html.stripDataClassInTailwind
        );

        // Save as final HTML
        const htmlFileName = routePath === '/' ? 'index.html' : `${routePath.slice(1)}/index.html`;
        const htmlPath = join(config.html.outputDir, htmlFileName);

        await this.ensureDir(dirname(htmlPath));
        await writeFile(htmlPath, processedHtml, 'utf-8');

        console.log(`  → ${htmlPath} (${processedHtml.length} bytes)`);
      } catch (error) {
        console.warn(`⚠️ Failed to generate HTML for ${routePath}:`, error);
      }
    }
  }

  private async prepareProductionCss(config: GeneratorConfig): Promise<void> {
    console.log('📦 Preparing production CSS assets...');

    const sourceCssDir = join(process.cwd(), 'dist', 'assets');
    const targetCssDir = join(process.cwd(), 'dist', 'html', 'assets', 'css');
    const targetCssFile = join(targetCssDir, 'styles.css');

    try {
      // Ensure target directory exists
      await this.ensureDir(targetCssDir);

      // Find the hashed CSS file in dist/assets
      let sourceCssFile: string | null = null;
      try {
        const entries = await readdir(sourceCssDir);
        // Look for CSS files that match the pattern index-*.css
        const cssFile = entries.find(entry =>
          entry.startsWith('index-') &&
          entry.endsWith('.css') &&
          !entry.includes('.map')
        );
        if (cssFile) {
          sourceCssFile = join(sourceCssDir, cssFile);
        }
      } catch (error) {
        // dist/assets might not exist yet
      }

      if (sourceCssFile) {
        // Copy and rename the CSS file
        await copyFile(sourceCssFile, targetCssFile);
        console.log(`  → ${targetCssFile}`);
      } else {
        console.warn('⚠️ No production CSS file found in dist/assets, skipping CSS preparation');
      }
    } catch (error) {
      console.warn('⚠️ Failed to prepare production CSS:', error);
    }
  }

  private async generateClientScript(config: GeneratorConfig): Promise<void> {
    if (!config.clientScript?.enabled) return;

    console.log('📜 Generating client script...');

    const outputDir = config.clientScript.outputDir ?? './dist/assets/js';
    const fileName = config.clientScript.fileName ?? 'main.js';
    const darkModeSelector = config.clientScript.darkModeSelector ?? '[data-toggle-dark]';

    // Read the source client script
    const scriptPath = join(this.templatesDir, '..', 'src', 'scripts', 'entry-client.tsx');
    let scriptContent = await readFile(scriptPath, 'utf-8');

    // Replace the hardcoded selector with configured one
    scriptContent = scriptContent.replace(/\[data-toggle-dark\]/g, darkModeSelector);

    // For now, we'll output the script as-is (TypeScript will be transpiled by Bun)
    // In production, you might want to transpile this to plain JS
    const outputPath = join(process.cwd(), outputDir, fileName);
    await this.ensureDir(dirname(outputPath));
    await writeFile(outputPath, scriptContent, 'utf-8');

    console.log(`  → ${outputPath}`);
  }

  private async runUncss(config: GeneratorConfig): Promise<void> {
    if (!config.uncss?.enabled) return;

    console.log('🧹 Running UnCSS to remove unused styles...');

    // Application config takes precedence, then default values
    const htmlFiles = config.uncss.htmlFiles ?? ['dist/html/index.html'];
    const cssFile = config.uncss.cssFile ?? 'dist/html/assets/base.css';
    const outputDir = config.uncss.outputDir ?? 'dist/html/assets';
    const ignore = config.uncss.ignore ?? [
      ':hover',
      ':focus',
      ':active',
      ':visited',
      '.js-',
      '.is-',
      '.has-',
      '[]',
      '::before',
      '::after',
      '::placeholder',
      ':root',
      'html',
      'body',
      'button',
      '*',
      '@layer',
      '@property'
    ];
    const media = config.uncss.media ?? true;
    const timeout = config.uncss.timeout ?? 10000;

    try {
      // Ensure output directory exists
      await this.ensureDir(outputDir);

      // Read CSS content from configured file
      let cssContent = '';
      try {
        const cssPath = join(process.cwd(), cssFile);
        cssContent = await readFile(cssPath, 'utf-8');
      } catch (error) {
        console.warn(`⚠️ Could not read CSS file: ${cssFile}`);
        return;
      }

      // Process each HTML file separately to generate individual CSS files
      for (const htmlFile of htmlFiles) {
        const htmlPath = join(process.cwd(), htmlFile);
        try {
          let htmlContent = await readFile(htmlPath, 'utf-8');

          // Remove script tags from HTML to prevent UnCSS from trying to load them
          htmlContent = htmlContent.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

          // Run UnCSS with raw CSS and single HTML content, ignoring external resources
          const cleanedCss = await this.processWithUncss(cssContent, [htmlContent], {
            ignore,
            media,
            timeout
          });

          // Generate output filename: unused.css in the same directory as HTML file
          const htmlDir = dirname(join(process.cwd(), htmlFile));
          const outputPath = join(htmlDir, 'unused.css');

          await writeFile(outputPath, cleanedCss, 'utf-8');

          const originalSize = cssContent.length;
          const cleanedSize = cleanedCss.length;
          const savings = originalSize - cleanedSize;
          const percentage = originalSize > 0 ? ((savings / originalSize) * 100).toFixed(1) : '0';

          const relativePath = relative(process.cwd(), outputPath);
          console.log(`  → ${relativePath} (${cleanedSize} bytes, saved ${savings} bytes / ${percentage}%)`);
        } catch (error) {
          console.warn(`⚠️ Failed to process HTML file: ${htmlFile}`, error);
        }
      }

      console.log(`  📊 Generated ${htmlFiles.length} unused.css files for critical CSS analysis`);
    } catch (error) {
      console.warn('⚠️ UnCSS processing failed:', error);
    }
  }

  private async processWithUncss(cssContent: string, htmlContents: string[], options: any): Promise<string> {
    return new Promise((resolve, reject) => {
      uncss(htmlContents, {
        raw: cssContent,
        ignore: options.ignore,
        media: options.media,
        timeout: options.timeout,
        banner: false,
        ignoreSheets: [/.*/] // Ignore all external stylesheets, use only raw CSS
      }, (error: any, output: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(output);
        }
      });
    });
  }

  private buildMetaTags(route: RouteConfig, config: GeneratorConfig): Record<string, string> {
    const meta: Record<string, string> = {};

    if (route.seo?.description) {
      meta.description = route.seo.description;
      meta['og:description'] = route.seo.description;
    }

    if (route.seo?.keywords) {
      meta.keywords = route.seo.keywords.join(', ');
    }

    meta['og:title'] = route.title;
    meta['og:url'] = route.title.toLowerCase().replace(/\s+/g, '-');

    if (route.seo?.image) {
      meta['og:image'] = route.seo.image;
    }

    // Add shadcn CSS import for design tokens
    meta['shadcn-css-link'] = '<link rel="stylesheet" href="../css/shadcn.css">';

    // Add client script if enabled
    if (config.clientScript?.enabled) {
      const scriptPath = config.clientScript.outputDir?.replace('./dist', '') ?? '/assets/js';
      const scriptName = config.clientScript.fileName ?? 'main.js';
      meta['client-script'] = `<script src="${scriptPath}/${scriptName}"></script>`;
    }

    return meta;
  }

  private async copyAssets(config: GeneratorConfig): Promise<void> {
    if (!config.assets?.copy) return;

    console.log('📁 Copying assets...');

    for (const assetPattern of config.assets.copy) {
      try {
        // Handle glob patterns
        if (assetPattern.includes('*')) {
          const matches = await glob(assetPattern, { cwd: process.cwd() });
          for (const match of matches) {
            await this.copyAssetFile(match, config.html.outputDir, config.css.outputDir);
          }
        } else {
          // Handle direct file paths
          await this.copyAssetFile(assetPattern, config.html.outputDir, config.css.outputDir);
        }
      } catch (error) {
        console.warn(`⚠️ Failed to copy asset ${assetPattern}:`, error);
      }
    }
  }

  private async copyAssetFile(sourcePath: string, outputDir: string, cssOutputDir?: string): Promise<void> {
    const absoluteSourcePath = resolve(process.cwd(), sourcePath);

    let destPath: string;

    // For CSS assets from src/assets/css/, copy to the CSS output directory (dist/css)
    if (absoluteSourcePath.includes(join('src', 'assets', 'css'))) {
      const relativePath = relative(join(process.cwd(), 'src', 'assets', 'css'), absoluteSourcePath);
      destPath = join(cssOutputDir || join(outputDir, '..', 'css'), relativePath);
    } else {
      // For other assets, keep the relative structure
      const relativePath = relative(join(process.cwd(), 'src', 'assets'), absoluteSourcePath);
      destPath = join(outputDir, 'assets', relativePath);
    }

    try {
      // Check if source exists and is a file
      const stats = await stat(absoluteSourcePath);
      if (!stats.isFile()) {
        console.warn(`⚠️ Skipping ${sourcePath} - not a file`);
        return;
      }

      await this.ensureDir(dirname(destPath));
      await copyFile(absoluteSourcePath, destPath);
      console.log(`  → ${relative(destPath, outputDir)}`);
    } catch (error) {
      console.warn(`⚠️ Failed to copy ${sourcePath} to ${destPath}:`, error);
    }
  }

  private async ensureDir(dirPath: string): Promise<void> {
    try {
      await mkdir(dirPath, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
  }

  private async ensureLayouts(config: GeneratorConfig): Promise<void> {
    const layoutsDir = join(process.cwd(), config.html.viewsDir, 'layouts');
    await this.ensureDir(layoutsDir);

    const layoutFiles = ['layout.liquid', 'page.liquid'];

    for (const fileName of layoutFiles) {
      const destPath = join(layoutsDir, fileName);
      try {
        await readFile(destPath, 'utf-8');
        continue;
      } catch {
        // file missing, fall through to copy from templates
      }

      const templatePath = join(this.templatesDir, fileName);
      try {
        const template = await readFile(templatePath, 'utf-8');
        await writeFile(destPath, template, 'utf-8');
        console.log(`  → Layout template created: ${destPath}`);
      } catch (error) {
        console.warn(`⚠️ Unable to create layout ${fileName} from templates:`, error);
      }
    }
  }

  private registerFilters(): void {
    this.liquid.registerFilter('json', (value: any) => JSON.stringify(value));
    this.liquid.registerFilter('lowercase', (value: string) => value.toLowerCase());
    this.liquid.registerFilter('uppercase', (value: string) => value.toUpperCase());
  }

  private mergeCssFiles(cssFiles: string[]): string {
    if (cssFiles.length === 1) return cssFiles[0];

    // For now, just concatenate with headers
    const merged = cssFiles.join('\n\n/* === Next Route === */\n\n');

    // Update timestamp in header
    return merged.replace(/Generated on: .*/, `Generated on: ${new Date().toISOString()}`);
  }

  /**
   * Process HTML content based on the configured htmlMode
   */
  private processHtmlContent(
    htmlContent: string,
    mode: 'tailwind' | 'semantic' | 'inline',
    cssContent?: string,
    stripDataClassInTailwind?: boolean
  ): string {
    if (mode === 'tailwind') {
      if (stripDataClassInTailwind) {
        // Tailwind mode, but remove data-class attributes from final HTML
        return this.removeDataClassAttributes(htmlContent);
      }
      // No changes needed - keep data-class and class attributes
      return htmlContent;
    }

    if (mode === 'semantic' || mode === 'inline') {
      // Remove class attributes, convert data-class to class (remove data- prefix)
      htmlContent = this.removeClassAttributes(htmlContent);
      htmlContent = this.convertDataClassAttributesToClass(htmlContent);
    }

    if (mode === 'inline' && cssContent) {
      // Inject minified CSS into head
      const minifiedCss = this.minifyCss(cssContent);
      htmlContent = this.injectInlineStyles(htmlContent, minifiedCss);
    }

    return htmlContent;
  }

  /**
   * Remove class attributes from HTML, keep data-class
   */
  private removeClassAttributes(htmlContent: string): string {
    // Remove class="..." attributes but keep data-class
    return htmlContent.replace(/\s+class\s*=\s*["'][^"']*["']/g, '');
  }

  /**
   * Remove data-class attributes from HTML, keep class
   */
  private removeDataClassAttributes(htmlContent: string): string {
    return htmlContent.replace(/\s+data-class\s*=\s*["'][^"']*["']/g, '');
  }

  /**
   * Convert data-class attributes to class attributes
   */
  private convertDataClassToClass(htmlContent: string): string {
    // Convert data-class="value" to class="value"
    return htmlContent.replace(/data-class\s*=\s*["']([^"']*)["']/g, 'class="$1"');
  }

  /**
   * Convert data-class + data-classes attributes to a single class="" attribute.
   * - stable-dedupes tokens (keeps first appearance order)
   * - strips both data-class and data-classes from the final output
   */
  private convertDataClassAttributesToClass(htmlContent: string): string {
    const splitTokens = (v: string | undefined) =>
      (v ?? '')
        .trim()
        .split(/\s+/g)
        .map((t) => t.trim())
        .filter(Boolean);

    const stableDedupe = (tokens: string[]) => {
      const out: string[] = [];
      const seen = new Set<string>();
      for (const t of tokens) {
        if (!t) continue;
        if (seen.has(t)) continue;
        seen.add(t);
        out.push(t);
      }
      return out;
    };

    // Process opening tags only; keep inner HTML intact.
    return htmlContent.replace(
      /<([a-zA-Z][\w:-]*)([^>]*?)(\/?)>/g,
      (full, tagName: string, rawAttrs: string, selfClose: string) => {
        const dataClassMatch = rawAttrs.match(/\s+data-class\s*=\s*["']([^"']*)["']/);
        const dataClassesMatch = rawAttrs.match(/\s+data-classes\s*=\s*["']([^"']*)["']/);

        if (!dataClassMatch && !dataClassesMatch) return full;

        const tokens = stableDedupe([
          ...splitTokens(dataClassMatch?.[1]),
          ...splitTokens(dataClassesMatch?.[1]),
        ]);

        // Strip both data-attrs; class attr is removed earlier but strip again for safety.
        let attrs = rawAttrs
          .replace(/\s+data-class\s*=\s*["'][^"']*["']/g, '')
          .replace(/\s+data-classes\s*=\s*["'][^"']*["']/g, '')
          .replace(/\s+class\s*=\s*["'][^"']*["']/g, '');

        const classAttr = tokens.length ? ` class="${tokens.join(' ')}"` : '';
        return `<${tagName}${attrs}${classAttr}${selfClose}>`;
      }
    );
  }

  /**
   * Emit component semantic variants CSS from `apps/local/src/variants/*.ts`.
   * Writes `${config.css.outputDir}/variants.apply.css`.
   */
  private async emitVariantsApplyCss(config: GeneratorConfig): Promise<void> {
    try {
      await this.ensureDir(config.css.outputDir);
      const { emitVariantsApplyCss } = await import('./scripts/emit-variants-apply.js');
      const variantsDir = await this.resolveVariantsDir();
      if (!variantsDir) {
        console.warn('⚠️ variants directory not found (tried src/variants and apps/local/src/variants), skipping variants.apply.css');
        return;
      }
      const css = await emitVariantsApplyCss({
        variantsDir,
      });
      await Bun.write(`${config.css.outputDir}/variants.apply.css`, css);
      console.log(`✅ Generated ${config.css.outputDir}/variants.apply.css (${css.length} bytes)`);
    } catch (error) {
      console.warn('⚠️ Failed to emit variants.apply.css:', error);
    }
  }

  private async resolveVariantsDir(): Promise<string | null> {
    const candidates = [
      // When generator is executed from an app workspace (e.g. apps/local)
      join(process.cwd(), 'src', 'variants'),
      // When executed from monorepo root
      join(process.cwd(), 'apps', 'local', 'src', 'variants'),
    ];

    for (const p of candidates) {
      try {
        const entries = await readdir(p);
        if (Array.isArray(entries)) return p;
      } catch {
        // try next
      }
    }
    return null;
  }

  /**
   * Inject inline styles into HTML head
   */
  private injectInlineStyles(htmlContent: string, css: string): string {
    const styleTag = `<style>${css}</style>`;

    // Insert before closing </head>
    return htmlContent.replace('</head>', `  ${styleTag}\n  </head>`);
  }

  /**
   * Simple CSS minification for inline injection
   */
  private minifyCss(css: string): string {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/\s*{\s*/g, '{') // Remove spaces around braces
      .replace(/\s*}\s*/g, '}') // Remove spaces around closing braces
      .replace(/\s*;\s*/g, ';') // Remove spaces around semicolons
      .replace(/;\s*}/g, '}') // Remove trailing semicolons
      .trim();
  }
}
