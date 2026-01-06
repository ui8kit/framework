# UI8Kit Static Site Generator

A comprehensive static site generator that converts React components to Liquid templates and generates complete HTML/CSS sites.

- **React → Liquid**: Transforms JSX components into Liquid template views
- **Semantic Selectors**: Uses `data-class` attributes for meaningful CSS selectors
- **CSS Generation**: Extracts classes and generates `@apply` directives and pure CSS3
- **Liquid Templating**: Full Liquid.js support with layouts, partials, and helpers
- **Configuration-Driven**: Single config file controls all generation aspects

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

1. **Analyze React Components**: Extracts JSX structure and `data-class` attributes
2. **Generate Liquid Views**: Creates `.liquid` template files from component HTML
3. **Extract CSS Classes**: Parses class attributes and generates semantic selectors
4. **Apply Liquid Templates**: Renders final HTML using layouts and partials
5. **Generate Stylesheets**: Creates `@apply` CSS and pure CSS3 from extracted classes

## Installation

The generator is part of the UI8Kit monorepo:

```bash
# Install all dependencies
bun install

# Build the generator
bunx turbo run build --filter=@ui8kit/generator
```

## Usage

### Basic Configuration

Create `generator.config.ts` in your app directory:

```typescript
// apps/local/generator.config.ts
import { generator } from '@ui8kit/generator';

export const config = {
  app: {
    name: 'My App',
    lang: 'en'
  },

  css: {
    entryPath: './src/main.tsx',
    routes: ['/', '/about'],
    outputDir: './dist/css',
    pureCss: true
  },

  html: {
    viewsDir: './views',
    routes: {
      '/': {
        title: 'Home Page',
        seo: {
          description: 'Welcome to my app',
          keywords: ['app', 'react']
        }
      }
    },
    outputDir: './dist/html'
  }
};

// Run generation
if (import.meta.main) {
  await generator.generate(config);
}
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
export const config = {
  app: {
    name: 'UI8Kit App',
    lang: 'en'
  },

  css: {
    entryPath: './src/main.tsx',
    routes: ['/', '/about', '/contact'],
    outputDir: './dist/css',
    pureCss: true
  },

  html: {
    viewsDir: './views',
    templates: {
      layout: './views/layouts/main.liquid',
      page: './views/layouts/page.liquid'
    },
    routes: {
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
      }
    },
    outputDir: './dist/html'
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

```liquid
<div data-class="hero-section" class="relative">
  <div data-class="hero-content" class="flex flex-col gap-4 items-center">
    <h1 data-class="hero-title" class="text-4xl font-bold">Welcome to UI8Kit</h1>
    <p data-class="hero-description" class="text-lg text-muted-foreground">
      Build beautiful interfaces with React & CSS3
    </p>
  </div>
</div>
```

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
}
```

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
class Generator {
  async generate(config: GeneratorConfig): Promise<void>
}
```

### Types

```typescript
interface GeneratorConfig {
  app: AppConfig;
  css: CssConfig;
  html: HtmlConfig;
  assets?: AssetsConfig;
}

interface RouteConfig {
  title: string;
  seo?: SeoConfig;
  data?: Record<string, any>;
}
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
A: Ensure `css.routes` contains valid routes and `css.outputDir` is writable.

**Q: HTML pages are empty**
A: Check that React components have proper `data-class` attributes and are exported.

**Q: Liquid templates not rendering**
A: Verify template paths in `html.templates` configuration.

**Q: Partials not found**
A: Ensure partials are in the correct directory structure under `viewsDir/partials/`.

### Debug Mode

Enable verbose logging:

```bash
bun run generate:css -- --verbose
bun run generate:html -- --verbose
```

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Ensure TypeScript types are correct

## License

MIT
