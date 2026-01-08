import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { Liquid } from 'liquidjs';
import { htmlConverter } from './html-converter.js';
import { renderRoute, type RouteConfig } from '@ui8kit/render';

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
  };
  assets?: {
    copy?: string[];
  };
}

// RouteConfig is now defined in @ui8kit/render package
export { type RouteConfig } from '@ui8kit/render';

export class Generator {
  private liquid: Liquid;

  constructor() {
    this.liquid = new Liquid({
      root: process.cwd(),
      extname: '.liquid'
    });

    this.registerFilters();
  }

  async generate(config: GeneratorConfig): Promise<void> {
    console.log(`🚀 Generating static site for ${config.app.name}`);

    // 1. Generate Liquid views from React components (with data-class attributes)
    await this.generateViews(config);

    // 2. Generate CSS from views (instead of snapshots)
    await this.generateCss(config);

    // 3. Generate final HTML from Liquid views
    await this.generateHtml(config);

    // 4. Copy assets
    await this.copyAssets(config);

    console.log('✅ Static site generation completed!');
  }

  private async generateCss(config: GeneratorConfig): Promise<void> {
    console.log('🎨 Generating CSS...');

    // Generate CSS for all routes that have views (use html.routes as source of truth)
    const allApplyCss: string[] = [];
    const allPureCss: string[] = [];

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

    // Merge and write CSS files
    const finalApplyCss = this.mergeCssFiles(allApplyCss);
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
          meta: this.buildMetaTags(route),
          ...config.app,
          ...route.data
        });

        // Save as final HTML
        const htmlFileName = routePath === '/' ? 'index.html' : `${routePath.slice(1)}/index.html`;
        const htmlPath = join(config.html.outputDir, htmlFileName);

        await this.ensureDir(dirname(htmlPath));
        await writeFile(htmlPath, html, 'utf-8');

        console.log(`  → ${htmlPath} (${html.length} bytes)`);
      } catch (error) {
        console.warn(`⚠️ Failed to generate HTML for ${routePath}:`, error);
      }
    }
  }

  private buildMetaTags(route: RouteConfig): Record<string, string> {
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

    return meta;
  }

  private async copyAssets(config: GeneratorConfig): Promise<void> {
    if (!config.assets?.copy) return;

    console.log('📁 Copying assets...');

    // Simple asset copying (in real implementation, use a proper copy utility)
    for (const asset of config.assets.copy) {
      console.log(`  → ${asset}`);
    }
  }

  private async ensureDir(dirPath: string): Promise<void> {
    try {
      await mkdir(dirPath, { recursive: true });
    } catch (error) {
      // Directory might already exist
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
}
