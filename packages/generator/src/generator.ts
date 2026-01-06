import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { Liquid } from 'liquidjs';
import { preprocess } from '@ui8kit/preprocessor';

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

    // Generate CSS for all routes using views instead of snapshots
    await preprocess({
      entryPath: config.css.entryPath,
      routes: config.css.routes,
      snapshotsDir: config.html.viewsDir, // Use views directory directly
      outputDir: config.css.outputDir,
      pureCss: config.css.pureCss,
      verbose: true
    });
  }


  private async generateViews(config: GeneratorConfig): Promise<void> {
    console.log('📄 Generating Liquid views...');

    // For now, we'll create simple placeholder views
    // In real implementation, this would render React components
    for (const routePath of config.css.routes) {
      const viewContent = await this.generateViewContent(routePath);
      const viewFileName = routePath === '/' ? 'index.liquid' : `${routePath.slice(1)}.liquid`;
      const viewPath = join(config.html.viewsDir, 'pages', viewFileName);

      await this.ensureDir(dirname(viewPath));
      await writeFile(viewPath, viewContent, 'utf-8');

      console.log(`  → ${viewPath}`);
    }
  }

  private async generateViewContent(routePath: string): Promise<string> {
    // Placeholder: in real implementation, this would render React component
    // For now, return HTML with proper data-class attributes for semantic selectors
    if (routePath === '/') {
      return `<div data-class="hero-section" class="relative">
  <div data-class="hero-content" class="flex flex-col gap-4 items-center">
    <h1 data-class="hero-title" class="text-4xl font-bold">Welcome to UI8Kit</h1>
    <p data-class="hero-description" class="text-lg text-muted-foreground">Build beautiful interfaces with React & CSS3</p>
    <div data-class="hero-actions" class="flex gap-4">
      <button data-class="hero-cta-primary" class="px-4 py-2 bg-primary text-primary-foreground rounded">Get Started</button>
      <button data-class="hero-cta-secondary" class="px-4 py-2 border border-border rounded">Learn More</button>
    </div>
  </div>
</div>

<div data-class="features-section" class="py-16">
  <div data-class="features-header" class="gap-4 items-center">
    <h2 data-class="features-title" class="text-3xl font-semibold">Features</h2>
    <p data-class="features-description" class="text-muted-foreground">Everything you need to build modern web applications</p>
  </div>
  <div data-class="features-grid" class="cols-1-2-4 gap-6">
    <div data-class="feature-card-0" class="p-6 border rounded-lg">
      <div data-class="feature-icon" class="text-2xl">🚀</div>
      <h3 data-class="feature-title" class="text-xl font-medium">Fast</h3>
      <p data-class="feature-description" class="text-muted-foreground">Lightning fast performance</p>
    </div>
    <div data-class="feature-card-1" class="p-6 border rounded-lg">
      <div data-class="feature-icon" class="text-2xl">🎨</div>
      <h3 data-class="feature-title" class="text-xl font-medium">Beautiful</h3>
      <p data-class="feature-description" class="text-muted-foreground">Stunning design system</p>
    </div>
  </div>
</div>`;
    }

    return `<div class="page"><h1>Page for ${routePath}</h1></div>`;
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
}
