#!/usr/bin/env bun

// Import directly from source to avoid bundling issues
import { generator, type GeneratorConfig } from '../../packages/generator/src/index';

type HtmlMode = NonNullable<GeneratorConfig['html']['mode']>;

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
    // eslint-disable-next-line no-console
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

// Define HTML routes first
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

export const config: GeneratorConfig = {
  app: {
    name: 'UI8Kit App',
    lang: 'en'
  },

  css: {
    entryPath: './src/main.tsx',
    routes: Object.keys(htmlRoutes), // Generate CSS for all HTML routes
    outputDir: './dist/css',
    pureCss: true
  },

  html: {
    viewsDir: './views',
    routes: htmlRoutes,
    outputDir: './dist/html',
    mode: 'tailwind', // 'tailwind' | 'semantic' | 'inline'
    partials: {
      sourceDir: './src/partials',
      outputDir: 'partials',
      props: {
        Header: {
          name: "{{ name | default: 'UI8Kit' }}"
        },
        Footer: {
          name: "{{ name | default: 'UI8Kit' }}"
        },
        Navbar: {
          brand: "{{ brand | default: name | default: 'App' }}"
        },
        Sidebar: {
          title: "{{ sidebarTitle | default: '' }}"
        }
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
      // Interactive states
      ':hover',
      ':focus',
      ':active',
      ':visited',
      // Dynamic classes
      '.js-',
      '.is-',
      '.has-',
      '[]',
      // Pseudo-elements
      '::before',
      '::after',
      '::placeholder',
      // Theme support (light/dark mode)
      ':root',    // Light theme CSS variables
      '.dark',    // Dark theme CSS variables
      '@theme',   // Tailwind theme variables
      // Base elements
      'html',
      'body',
      'button',
      // Universal selectors
      '*',
      '@layer',
      '@property'
    ],
    media: true,
    timeout: 10000
  },

  assets: {
    copy: ['./src/assets/css/**/*']
  },

  elements: {
    enabled: true,
    variantsDir: './src/variants',
    outputDir: './src/elements',
    componentsImportPath: '../components'
  }

  // Note: No render section needed - renderer works without context providers
};

// Run generation if this file is executed directly
if (import.meta.url === new URL(import.meta.url).href) {
  const { mode, pure } = parseCli(process.argv.slice(2));
  config.html.mode = mode;
  config.html.stripDataClassInTailwind = pure;

  console.log('🛠️ Starting static site generation...');
  console.log(`📄 Mode: ${mode}${pure ? ' (--pure)' : ''}`);
  await generator.generate(config);
}