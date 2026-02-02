#!/usr/bin/env bun

/**
 * UI8Kit Docs Generator Configuration
 * 
 * Docs-first application where routes come from the docs/ folder.
 * Uses the new Orchestrator-based generator system.
 */

import { generate, type GenerateConfig } from '../../packages/generator/src/index';

type HtmlMode = NonNullable<GenerateConfig['html']['mode']>;

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

export const config: GenerateConfig = {
  app: {
    name: 'UI8Kit Docs',
    lang: 'en'
  },

  // CSS class mappings
  mappings: {
    ui8kitMap: '../../packages/core/src/lib/ui8kit.map.json',
  },

  // CSS Generation
  css: {
    entryPath: './src/main.tsx',
    routes: ['/'],
    outputDir: './dist/css',
    pureCss: true
  },

  // HTML Generation - routes come from MDX
  html: {
    viewsDir: './views',
    routes: {},
    outputDir: './dist/html',
    mode: 'tailwind',
  },

  // Client script for dark mode
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
    variantsDir: '../../packages/core/src/variants',
    outputDir: './src/elements',
    componentsImportPath: '../components'
  },

  // MDX Documentation - routes derived from docs/ folder
  mdx: {
    enabled: true,
    docsDir: './docs',
    outputDir: './dist/html',
    navOutput: './dist/docs-nav.json',
    basePath: '',
    
    // Import path aliases for resolving imports in MDX files
    // Same format as Vite's resolve.alias in vite.config.ts
    aliases: {
      '@ui8kit/core': '../../packages/core/src/index',
      '@': './src',
    },
    
    propsSource: './src/components',
    
    toc: {
      minLevel: 2,
      maxLevel: 3,
    },
  },
  
  // Copy Vite build CSS to HTML output
  viteBundle: {
    enabled: true,
    viteBuildDir: './dist/assets',
    cssFileName: 'styles.css',
  },

  // Class logging - tracks all used classes
  classLog: {
    enabled: true,
    outputDir: './dist/maps',
    baseName: 'ui8kit',
  },
};

// =============================================================================
// Run Generator
// =============================================================================

const { mode, pure } = parseCli(process.argv.slice(2));
config.html.mode = mode;
config.html.stripDataClassInTailwind = pure;

console.log('🛠️ UI8Kit Docs Generator');
console.log(`📄 Mode: ${mode}${pure ? ' (--pure)' : ''}`);
console.log(`📁 Source: ${config.mdx?.docsDir}`);
console.log(`📁 Output: ${config.mdx?.outputDir}`);

const result = await generate(config);

if (!result.success) {
  console.error('❌ Generation failed with errors:');
  for (const { stage, error } of result.errors) {
    console.error(`  - ${stage}: ${error.message}`);
  }
  process.exit(1);
}
