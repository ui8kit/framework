#!/usr/bin/env bun

/**
 * UI8Kit Docs Generator Configuration
 * 
 * This is a docs-first application where all routes come from the docs/ folder.
 * The generator scans MDX files and generates static HTML pages.
 */

import { generator, type GeneratorConfig } from '../../packages/generator/src/index';

type HtmlMode = NonNullable<GeneratorConfig['html']['mode']>;

// =============================================================================
// CLI Parsing
// =============================================================================

function parseCli(argv: string[]): { mode: HtmlMode; pure: boolean } {
  const args = new Set(argv);
  
  const help = args.has('--help') || args.has('-h');
  if (help) {
    console.log(`
Usage: bun run generate [options]

Options:
  --tailwind   Keep Tailwind classes (default)
  --semantic   Output semantic HTML only
  --inline     Semantic + inline CSS
  --pure       Remove data-class attributes
`);
    process.exit(0);
  }

  const mode: HtmlMode = args.has('--semantic') ? 'semantic' 
    : args.has('--inline') ? 'inline' 
    : 'tailwind';
  
  const pure = args.has('--pure');

  return { mode, pure };
}

// =============================================================================
// Configuration
// =============================================================================

export const config: GeneratorConfig = {
  app: {
    name: 'UI8Kit Docs',
    lang: 'en'
  },

  // CSS class mappings (auto-detected from ./src/lib/ if not specified)
  mappings: {
    ui8kitMap: './src/lib/ui8kit.map.json',
    // shadcnMap uses generator's built-in by default
  },

  // CSS Generation - uses docs/ as source
  css: {
    entryPath: './src/main.tsx',
    routes: ['/'],  // Will scan docs/ for all routes
    outputDir: './dist/css',
    pureCss: true
  },

  // HTML Generation - docs-first approach
  html: {
    viewsDir: './views',
    routes: {},  // Routes come from MDX, not this object
    outputDir: './dist/html',
    mode: 'tailwind',
  },

  // Client script for dark mode toggle
  clientScript: {
    enabled: true,
    outputDir: './dist/assets/js',
    fileName: 'main.js',
    darkModeSelector: '[data-toggle-dark]'
  },

  // CSS optimization (disabled by default)
  uncss: {
    enabled: false,
    htmlFiles: [],
    cssFile: './dist/html/assets/css/styles.css',
    outputDir: './dist/html/assets',
    ignore: [':hover', ':focus', ':active', ':root', '.dark', '*'],
    media: true,
    timeout: 10000
  },

  // Asset copying
  assets: {
    copy: ['./src/assets/css/**/*']
  },

  // Variant elements generation
  elements: {
    enabled: true,
    variantsDir: './src/variants',
    outputDir: './src/elements',
    componentsImportPath: '../components'
  },

  // MDX Documentation - THE MAIN CONFIG
  // Routes are derived from docs/ folder structure:
  //   docs/index.mdx           → /
  //   docs/components/index.mdx → /components
  //   docs/components/button.mdx → /components/button
  mdx: {
    enabled: true,
    docsDir: './docs',
    outputDir: './dist/html',  // Output directly to HTML folder
    navOutput: './dist/docs-nav.json',
    basePath: '',  // No prefix since docs IS the app
    
    // Components available in MDX
    components: {
      Button: '@/components/ui/Button',
      Card: '@/components/Card',
      Badge: '@/components/ui/Badge',
      Stack: '@/components/ui/Stack',
      Box: '@/components/ui/Box',
      Grid: '@/components/Grid',
      Text: '@/components/ui/Text',
      Title: '@/components/ui/Title',
    },
    
    propsSource: './src/components',
    
    toc: {
      minLevel: 2,
      maxLevel: 3,
    },
  },
};

// =============================================================================
// Run Generator
// =============================================================================

if (import.meta.url === new URL(import.meta.url).href) {
  const { mode, pure } = parseCli(process.argv.slice(2));
  config.html.mode = mode;
  config.html.stripDataClassInTailwind = pure;

  console.log('🛠️ UI8Kit Docs Generator');
  console.log(`📄 Mode: ${mode}${pure ? ' (--pure)' : ''}`);
  console.log(`📁 Source: ${config.mdx?.docsDir}`);
  console.log(`📁 Output: ${config.mdx?.outputDir}`);
  
  await generator.generate(config);
}
