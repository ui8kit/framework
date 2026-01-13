# UI8Kit Static Site Generator

A comprehensive static site generator that converts React components to Liquid templates and generates complete HTML/CSS sites.

- **React → Liquid**: Transforms JSX components into Liquid template views using `@ui8kit/render`
- **Semantic Selectors**: Uses `data-class` attributes for meaningful CSS selectors
- **CSS Generation**: Extracts classes from generated views and generates `@apply` directives and pure CSS3
- **Liquid Templating**: Full Liquid.js support with layouts, partials, and helpers
- **Configuration-Driven**: Single config file controls all generation aspects
- **Framework Agnostic**: Generator delegates React rendering to `@ui8kit/render` package

## Architecture

```
📁 packages/generator/
├── src/
│   ├── generator.ts      # Main generation orchestrator
│   └── index.ts          # Public API
├── templates/            # Base Liquid templates
│   ├── layout.liquid     # Main layout template
│   ├── page.liquid       # Page template
│   └── partials/         # Reusable components
│       ├── header.liquid
│       └── footer.liquid
└── dist/                 # Compiled package

📁 apps/local/
├── views/                # Generated Liquid views
│   ├── layouts/          # App-specific layouts
│   ├── pages/            # Route-specific views
│   │   ├── index.liquid  # /
│   │   └── about.liquid  # /about
│   └── partials/         # App-specific partials
├── generator.config.ts   # Generation configuration
└── dist/                 # Generated output
    ├── css/              # Generated stylesheets
    └── html/             # Generated HTML pages
```

## How It Works

1. **Render React Components**: Delegates to `@ui8kit/render` to convert React components to HTML
   - Parses router configuration from `main.tsx`
   - Loads and renders route components directly (no context providers)
   - Preserves all `data-class` attributes in output HTML

2. **Generate Liquid Views**: Creates `.liquid` template files from rendered HTML
   - Stores HTML with `data-class` attributes in `views/pages/`
   - One view file per route (e.g., `index.liquid`, `about.liquid`)

3. **Generate Liquid Partials**: Converts React partial components to Liquid templates
   - Renders individual React components to HTML using `@ui8kit/render`
   - Saves as reusable `.liquid` partials for inclusion in layouts
   - Supports component props for runtime customization

4. **Extract CSS Classes**: Parses generated views and generates semantic selectors
   - Extracts classes and `data-class` attributes from HTML
   - Generates `@apply` CSS with semantic selectors (e.g., `.hero-section { @apply ... }`)
   - Optionally generates pure CSS3 from Tailwind classes

5. **Apply Liquid Templates**: Renders final HTML using layouts and partials
   - Combines views with layout templates
   - Applies route metadata (title, SEO, etc.)
   - Includes partials (header, footer, etc.)

6. **Generate Client Script**: Creates client-side JavaScript for interactivity
   - Generates dark mode toggle functionality
   - Outputs configurable script file (e.g., `main.js`)
   - Automatically injected into HTML layouts

7. **Clean Unused CSS**: Removes unused styles with UnCSS
   - Analyzes generated HTML for used CSS selectors
   - Removes unused CSS rules to reduce file size (up to 77% reduction)
   - Outputs cleaned CSS files (e.g., `index-uncss.css`)

8. **Generate Stylesheets**: Creates merged CSS files from all routes
   - Combines CSS from multiple routes into single files
   - Outputs `tailwind.apply.css` and optionally `ui8kit.local.css`

## Installation

The generator is part of the UI8Kit monorepo and uses source files directly (no build step required):

```bash
# Install all dependencies
bun install

# The generator uses source files directly via workspace imports
# No build step needed - TypeScript files are executed directly by Bun
```

**Note**: The generator uses `peerDependencies` for React, so React must be installed in your application.

## Usage

### Basic Configuration

Create `generator.config.ts` in your app directory:

```typescript
// apps/local/generator.config.ts
import { generator, type GeneratorConfig } from '@ui8kit/generator';

// Define HTML routes first
const htmlRoutes = {
  '/': {
    title: 'Home Page',
    seo: {
      description: 'Welcome to my app',
      keywords: ['app', 'react']
    }
  },
  '/about': {
    title: 'About Page',
    seo: {
      description: 'Learn more about us',
      keywords: ['about', 'company']
    }
  }
};

export const config: GeneratorConfig = {
  app: {
    name: 'My App',
    lang: 'en'
  },

  css: {
    entryPath: './src/main.tsx',  // Path to your React entry file
    routes: Object.keys(htmlRoutes), // Generate CSS for all HTML routes
    outputDir: './dist/css',
    pureCss: true  // Generate pure CSS3 in addition to @apply
  },

  html: {
    viewsDir: './views',
    routes: htmlRoutes,
    outputDir: './dist/html'
  },

  assets: {
    copy: ['./public/**/*']  // Copy static assets
  }
};

// Run generation
if (import.meta.main) {
  console.log('🛠️ Starting static site generation...');
  await generator.generate(config);
}
```

**Important**: Your `main.tsx` must use `createBrowserRouter` with a `children` array for the renderer to discover routes:

```typescript
// src/main.tsx
import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '@/routes/HomePage';
import { Blank } from '@/routes/Blank';

export const router = createBrowserRouter({
  children: [
    { index: true, element: <HomePage /> },
    { path: 'about', element: <Blank /> }
  ]
});
```

### Commands

```bash
# Generate everything
bun run generate

# Generate only CSS
bun run generate:css

# Generate only HTML
bun run generate:html

# Preview generated site
bun run preview:static
```

### Advanced Configuration

```typescript
import { generator, type GeneratorConfig } from '@ui8kit/generator';

const htmlRoutes = {
  '/': {
    title: 'Home - UI8Kit',
    seo: {
      description: 'Next generation UI framework',
      keywords: ['ui', 'react', 'typescript'],
      image: '/og-image.png'
    },
    data: {
      hero: {
        title: 'Welcome',
        subtitle: 'Build amazing interfaces'
      }
    }
  },
  '/about': {
    title: 'About - UI8Kit',
    seo: {
      description: 'Learn about UI8Kit framework'
    }
  },
  '/contact': {
    title: 'Contact - UI8Kit',
    seo: {
      description: 'Get in touch with us'
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
    routes: Object.keys(htmlRoutes), // Auto-sync with HTML routes
    outputDir: './dist/css',
    pureCss: true
  },

  html: {
    viewsDir: './views',  // Directory for Liquid views and templates
    routes: htmlRoutes,
    outputDir: './dist/html'
  },

  clientScript: {
    enabled: true,
    outputDir: './dist/assets/js',
    fileName: 'main.js',
    darkModeSelector: '[data-toggle-dark]'
  },

  uncss: {
    enabled: true,
    htmlFiles: ['./dist/html/index.html', './dist/html/about/index.html'],
    cssFile: './dist/html/assets/css/styles.css',
    outputDir: './dist/html/assets',
    ignore: [
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
    ],
    media: true,
    timeout: 10000
  },

  assets: {
    copy: ['./public/**/*', './src/assets/**/*']
  }
};
```

## Liquid Templates

### Layout Template (`views/layouts/layout.liquid`)

```liquid
---
layout: false
---

<!DOCTYPE html>
<html lang="{{ lang | default: 'en' }}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ title }}</title>

  {% if meta.description %}
  <meta name="description" content="{{ meta.description }}">
  {% endif %}

  {% if meta.keywords %}
  <meta name="keywords" content="{{ meta.keywords | join: ', ' }}">
  {% endif %}

  <link rel="stylesheet" href="/css/styles.css">
</head>
<body class="bg-background text-foreground">
  {% include 'partials/header.liquid' %}

  <main class="min-h-screen">
    {{ content }}
  </main>

  {% include 'partials/footer.liquid' %}

  <script src="/js/main.js"></script>
</body>
</html>
```

### Page Template (`views/layouts/page.liquid`)

```liquid
---
layout: layout
---

<article class="page">
  <div class="page-content">
    {{ content }}
  </div>
</article>
```

### Generated View (`views/pages/index.liquid`)

The generator creates Liquid view files from rendered React components:

```liquid
<section data-class="hero-section" class="relative">
  <div data-class="hero-content" class="flex flex-col gap-4 items-center">
    <h1 data-class="hero-title" class="text-4xl font-bold">Welcome to UI8Kit</h1>
    <p data-class="hero-description" class="text-lg text-muted-foreground">
      Build beautiful interfaces with React & CSS3
    </p>
  </div>
</section>
<section data-class="features-section" class="">
  <!-- FeaturesBlock content -->
</section>
```

**Note**: Views are generated automatically from your React components. The renderer:
- Parses router configuration from `main.tsx`
- Loads route components dynamically
- Renders them to HTML with preserved `data-class` attributes
- Saves HTML as `.liquid` files

## CSS Generation

### Input React Component

```tsx
// src/blocks/HeroBlock.tsx
export function HeroBlock() {
  return (
    <Block component="section" data-class="hero-section">
      <Stack gap="6" items="center" py="16">
        <Stack gap="4" items="center" data-class="hero-content">
          <Title text="4xl" font="bold" data-class="hero-title">
            Welcome to UI8Kit
          </Title>
          <Text text="xl" data-class="hero-description">
            Build beautiful interfaces
          </Text>
        </Stack>
      </Stack>
    </Block>
  );
}
```

### Generated CSS

#### `tailwind.apply.css` (Semantic selectors with @apply)
```css
.hero-section {
  @apply relative;
}

.hero-content {
  @apply flex flex-col gap-4 items-center;
}

.hero-title {
  @apply text-4xl font-bold;
}

.hero-description {
  @apply text-lg text-muted-foreground;
}
```

**Automatic Deduplication**: When multiple selectors have identical class sets (e.g., from loops), they are automatically merged:

```css
/* Before: Duplicate rules */
.feature-card-0 {
  @apply flex-col gap-4 items-start justify-start p-6 rounded-lg;
}

.feature-card-1 {
  @apply flex-col gap-4 items-start justify-start p-6 rounded-lg;
}

/* After: Merged selector */
.feature-card-0, .feature-card-1, .feature-card-2, .feature-card-3 {
  @apply flex-col gap-4 items-start justify-start p-6 rounded-lg;
}
```

#### `ui8kit.local.css` (Pure CSS3)
```css
.hero-section {
  position: relative;
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: calc(var(--spacing) * 4);
  align-items: center;
}

.hero-title {
  font-size: var(--text-4xl);
  font-weight: 700;
}

.hero-description {
  font-size: var(--text-lg);
  color: hsl(var(--muted-foreground));
}
```

**Automatic Deduplication**: Works for pure CSS3 as well:

```css
/* Merged selectors with identical properties */
.features-header, .hero-content {
  flex-direction: column;
  gap: calc(var(--spacing) * 4);
  align-items: center;
  justify-content: flex-start;
}
```

This optimization reduces CSS file size by up to 25% for components with repeated patterns (loops, maps, etc.).

## Configuration Options

### App Configuration

```typescript
app: {
  name: string;        // App name
  lang?: string;       // Default language (default: 'en')
}
```

### CSS Configuration

```typescript
css: {
  entryPath: string;   // Path to React entry file
  routes: string[];    // Routes to generate CSS for
  outputDir: string;   // CSS output directory
  pureCss?: boolean;   // Generate pure CSS3 in addition to @apply
}
```

### HTML Configuration

```typescript
html: {
  viewsDir: string;    // Directory containing views and templates
  routes: {            // Route-specific configuration
    [path: string]: {
      title: string;
      seo?: {
        description?: string;
        keywords?: string[];
        image?: string;
      };
      data?: Record<string, any>; // Additional template data
    }
  };
  outputDir: string;   // HTML output directory
  mode?: 'tailwind' | 'semantic' | 'inline'; // HTML processing mode (default: 'tailwind')
  partials?: {         // Optional: generate Liquid partials from React components
    sourceDir: string; // Directory containing React partial components
    outputDir?: string; // Output directory under viewsDir (defaults to 'partials')
    props?: Record<string, Record<string, any>>; // Per-component props
  };
  stripDataClassInTailwind?: boolean; // Remove data-class in tailwind mode
}
```

### Client Script Configuration

```typescript
clientScript?: {
  enabled?: boolean;          // Enable client script generation
  outputDir?: string;         // Output directory (defaults to './dist/assets/js')
  fileName?: string;          // Script filename (defaults to 'main.js')
  darkModeSelector?: string;  // Dark mode toggle selector (defaults to '[data-toggle-dark]')
}
```

### UnCSS Configuration (CSS Cleanup)

```typescript
uncss?: {
  enabled?: boolean;          // Enable unused CSS removal
  htmlFiles?: string[];       // HTML files to analyze for used selectors
  cssFile?: string;           // CSS file to process (relative to project root)
  outputDir?: string;         // Output directory for cleaned CSS (fallback)
  ignore?: string[];          // CSS selectors to ignore during cleanup
  media?: boolean;            // Include media queries in analysis
  timeout?: number;           // Processing timeout in milliseconds
}
```

**Note**: UnCSS creates `unused.css` files in the same directory as each `index.html` for easy testing with `<link rel="stylesheet" href="unused.css">`.

### Assets Configuration

```typescript
assets?: {
  copy?: string[];     // Files/directories to copy to output
}
```

## Liquid Features

### Built-in Filters

- `json` - Convert object to JSON string
- `lowercase` - Convert to lowercase
- `uppercase` - Convert to uppercase

### Custom Filters

You can extend Liquid with custom filters in your templates.

### Partials

Use `{% include 'path/to/partial.liquid' %}` to include reusable components.

### Layouts

Use frontmatter to specify layouts:

```liquid
---
layout: custom-layout
---

<!-- Page content -->
```

## API Reference

### Generator Class

```typescript
import { generator, Generator, GeneratorConfig } from '@ui8kit/generator';

// Use singleton instance
await generator.generate(config);

// Or create new instance
const gen = new Generator();
await gen.generate(config);
```

### Types

```typescript
interface GeneratorConfig {
  app: {
    name: string;
    lang?: string;
  };
  css: {
    entryPath: string;      // Path to React entry file (main.tsx)
    routes: string[];       // Routes to generate CSS for
    outputDir: string;      // CSS output directory
    pureCss?: boolean;      // Generate pure CSS3 in addition to @apply
  };
  html: {
    viewsDir: string;       // Directory for Liquid views and templates
    routes: Record<string, RouteConfig>;  // Route configurations
    outputDir: string;      // HTML output directory
  };
  clientScript?: {
    enabled?: boolean;      // Enable client script generation
    outputDir?: string;     // Client script output directory
    fileName?: string;      // Client script filename
    darkModeSelector?: string; // Dark mode toggle selector
  };
  assets?: {
    copy?: string[];        // Files/directories to copy
  };
}

interface RouteConfig {
  title: string;
  seo?: {
    description?: string;
    keywords?: string[];
    image?: string;
  };
  data?: Record<string, any>;  // Additional template data
}
```

### Render Integration

The generator uses `@ui8kit/render` internally:

```typescript
// Generator calls renderer for each route
import { renderRoute } from '@ui8kit/render';

const html = await renderRoute({
  entryPath: config.css.entryPath,  // './src/main.tsx'
  routePath: '/'                    // Route to render
});
// Returns: HTML string with data-class attributes
```

## Integration

### With Tailwind CSS

```css
/* styles.css */
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

/* Generated semantic styles */
@import './dist/css/tailwind.apply.css';
```

### With Build Tools

```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        // Include generated HTML pages
        ...glob('./dist/html/**/*.html')
      }
    }
  }
});
```

## Troubleshooting

### Common Issues

**Q: CSS files are not generated**
A: Ensure `css.routes` contains valid routes matching `html.routes` keys, and `css.outputDir` is writable.

**Q: HTML pages are empty or missing components**
A: 
- Check that React components are properly exported (default or named)
- Verify router configuration in `main.tsx` uses `createBrowserRouter` with `children` array
- Ensure components don't require React context (ThemeProvider, RouterProvider) - they won't work in static generation
- Check console output for rendering errors

**Q: Components not found during rendering**
A:
- Verify import paths in `main.tsx` are correct
- Ensure `@/` alias resolves to `src/` directory
- Check that component files exist and have correct extensions (`.tsx`, `.ts`)

**Q: Liquid templates not rendering**
A: 
- Verify layout template exists at `views/layouts/layout.liquid`
- Check that `viewsDir` path is correct in configuration
- Ensure Liquid template uses `{{ content | raw }}` filter to prevent HTML escaping

**Q: Partials not found**
A: Ensure partials are in the correct directory structure under `viewsDir/partials/` and use correct paths in `{% include %}` statements.

**Q: React version conflicts**
A: The generator uses `peerDependencies` for React. Ensure your app has React installed and versions are compatible (React 18 or 19).

### Debug Mode

Enable verbose logging:

```bash
bun run generate:css -- --verbose
bun run generate:html -- --verbose
```

## Architecture Details

### Rendering Process

1. **Component Discovery**: Renderer parses `main.tsx` to find router configuration
2. **Route Matching**: Maps route paths to component names from router config
3. **Component Loading**: Dynamically imports components using resolved paths
4. **Direct Rendering**: Renders components directly without context providers
5. **HTML Output**: Returns HTML string with preserved `data-class` attributes

### HTML Processing Modes

UI8Kit supports three HTML processing modes to give you flexibility in how the generated HTML is structured:

#### `tailwind` Mode (Default)
- **HTML Output**: Preserves both `data-class` and `class` attributes
- **CSS Usage**: Requires linking to generated CSS files (`tailwind.apply.css`, `ui8kit.local.css`)
- **Best For**: Projects using Tailwind CSS, development environments, maximum compatibility

```html
<div data-class="hero-content" class="flex flex-col gap-4 items-center">
  <h1 data-class="hero-title" class="text-4xl font-bold">Hello</h1>
</div>
```

#### `semantic` Mode
- **HTML Output**: Removes `class` attributes, converts `data-class` to `class` (removes `data-` prefix)
- **CSS Usage**: Requires linking to generated CSS files (styles applied via semantic selectors)
- **Best For**: Production sites, semantic HTML, smaller HTML file sizes

```html
<div class="hero-content">
  <h1 class="hero-title">Hello</h1>
</div>
```

#### `inline` Mode
- **HTML Output**: Removes `class` attributes, converts `data-class` to `class` (removes `data-` prefix), injects CSS directly into `<head>`
- **CSS Usage**: Self-contained HTML files, no external CSS dependencies
- **Best For**: Email templates, static hosting without CSS files, single-file deployment

```html
<head>
  <style>.hero-content{display:flex;...}.hero-title{font-size:2.25rem;...}</style>
</head>
<body>
  <div class="hero-content">
    <h1 class="hero-title">Hello</h1>
  </div>
</body>
```

### CSS Generation Process

1. **View Analysis**: Reads generated `.liquid` view files
2. **Class Extraction**: Parses HTML to extract classes and `data-class` attributes
3. **Selector Generation**: Creates semantic selectors using `data-class` values
4. **Deduplication**: Automatically merges selectors with identical class sets (e.g., from loops)
5. **CSS Creation**: Generates `@apply` directives and optionally pure CSS3
6. **HTML Processing**: Applies selected mode (tailwind/semantic/inline)
7. **File Merging**: Combines CSS from all routes into single files

**Deduplication Example**: If `feature-card-0`, `feature-card-1`, `feature-card-2`, and `feature-card-3` all have the same classes, they are automatically combined into a single group selector: `.feature-card-0, .feature-card-1, .feature-card-2, .feature-card-3 { ... }`

### Key Design Decisions

- **No Context Providers**: Components are rendered directly without ThemeProvider or RouterProvider for simplicity
- **Semantic Selectors**: Uses `data-class` instead of random class names for better CSS maintainability
- **Automatic Deduplication**: Merges duplicate class sets to reduce CSS file size (up to 25% reduction)
- **Configuration-Driven**: All paths and options come from configuration, no hardcoded values
- **Framework Agnostic**: Generator delegates React rendering to `@ui8kit/render` package

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Ensure TypeScript types are correct
5. Follow the architecture rules in `.cursor/rules/generator.mdc`

## Related Packages

- **`@ui8kit/render`**: React component renderer (see `packages/render/.cursor/rules/render.mdc`)
- **`@ui8kit/core`**: UI components with utility props

## License

MIT
