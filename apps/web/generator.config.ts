#!/usr/bin/env bun

/**
 * UI8Kit Web Generator Configuration
 * 
 * Uses the new Orchestrator-based generator system.
 */

import { generate, type GenerateConfig } from '../../packages/generator/src/index';

type HtmlMode = NonNullable<GenerateConfig['html']['mode']>;

// =============================================================================
// CLI Parsing
// =============================================================================

function usage(): string {
  return [
    'Usage:',
    '  bun run generate --tailwind [--pure]',
    '  bun run generate --semantic',
    '  bun run generate --inline',
    '',
    'Modes:',
    '  --tailwind   Keep both class and data-class (default)',
    '  --semantic   Output semantic HTML: class <- data-class, remove original class',
    '  --inline     Like --semantic, plus inject CSS into <head>',
    '',
    'Flags:',
    '  --pure       Tailwind-only: remove data-class from generated HTML output',
  ].join('\n');
}

function parseCli(argv: string[]): { mode: HtmlMode; pure: boolean } {
  const args = new Set(argv);

  const hasTailwind = args.has('--tailwind');
  const hasSemantic = args.has('--semantic');
  const hasInline = args.has('--inline');
  const pure = args.has('--pure');
  const help = args.has('--help') || args.has('-h');

  if (help) {
    console.log(usage());
    process.exit(0);
  }

  const modes = [
    hasTailwind ? 'tailwind' : null,
    hasSemantic ? 'semantic' : null,
    hasInline ? 'inline' : null
  ].filter(Boolean) as HtmlMode[];

  if (modes.length > 1) {
    throw new Error(`Multiple mode flags provided. Choose only one.\n\n${usage()}`);
  }

  const mode: HtmlMode = modes[0] ?? 'tailwind';

  if (pure && mode !== 'tailwind') {
    throw new Error(`--pure can only be used with --tailwind.\n\n${usage()}`);
  }

  return { mode, pure };
}

// =============================================================================
// Configuration
// =============================================================================

const htmlRoutes = {
  '/': {
    title: 'UI8Kit - Next Generation UI System',
    seo: {
      description: 'Build beautiful interfaces with React & CSS3. Type-safe components with semantic static generation.',
      keywords: ['ui', 'react', 'css3', 'typescript', 'components', 'design-system']
    }
  },
  '/about': {
    title: 'About UI8Kit',
    seo: {
      description: 'Learn more about UI8Kit - a comprehensive UI system for modern web development.',
      keywords: ['about', 'ui8kit', 'react', 'css3']
    }
  }
};

export const config: GenerateConfig = {
  app: {
    name: 'UI8Kit App',
    lang: 'en'
  },

  // CSS class mappings
  mappings: {
    ui8kitMap: '../../packages/ui8kit/src/lib/ui8kit.map.json',
  },

  css: {
    entryPath: './src/main.tsx',
    routes: Object.keys(htmlRoutes),
    outputDir: './dist/css',
    pureCss: true
  },

  html: {
    viewsDir: './views',
    routes: htmlRoutes,
    outputDir: './dist/html',
    mode: 'tailwind',
    partials: {
      sourceDir: './src/partials',
      outputDir: 'partials',
      props: {
        Header: { name: "{{ name | default: 'UI8Kit' }}" },
        Footer: { name: "{{ name | default: 'UI8Kit' }}" },
        Navbar: { brand: "{{ brand | default: name | default: 'App' }}" },
        Sidebar: { title: "{{ sidebarTitle | default: '' }}" }
      }
    }
  },

  clientScript: {
    enabled: true,
    outputDir: './dist/assets/js',
    fileName: 'main.js',
    darkModeSelector: '[data-toggle-dark]'
  },

  uncss: {
    enabled: false,
    htmlFiles: ['./dist/html/index.html', './dist/html/about/index.html'],
    cssFile: './dist/html/assets/css/styles.css',
    outputDir: './dist/html/assets',
    ignore: [
      ':hover', ':focus', ':active', ':visited',
      '.js-', '.is-', '.has-', '[]',
      '::before', '::after', '::placeholder',
      ':root', '.dark', '@theme',
      'html', 'body', 'button',
      '*', '@layer', '@property'
    ],
    media: true,
    timeout: 10000
  },

  assets: {
    copy: ['./src/assets/css/**/*']
  },

  // Copy Vite build CSS to HTML output
  viteBundle: {
    enabled: true,
    viteBuildDir: './dist/assets',
    cssFileName: 'styles.css',
    copyJs: false,  // We use our own client script
  },

  elements: {
    enabled: true,
    variantsDir: '../../packages/ui8kit/src/variants',
    outputDir: './src/elements',
    componentsImportPath: '../components'
  }
};

// =============================================================================
// Run Generation
// =============================================================================

const { mode, pure } = parseCli(process.argv.slice(2));
config.html.mode = mode;
config.html.stripDataClassInTailwind = pure;

console.log('🛠️ Starting static site generation...');
console.log(`📄 Mode: ${mode}${pure ? ' (--pure)' : ''}`);

const result = await generate(config);

if (!result.success) {
  console.error('❌ Generation failed with errors:');
  for (const { stage, error } of result.errors) {
    console.error(`  - ${stage}: ${error.message}`);
  }
  process.exit(1);
}
