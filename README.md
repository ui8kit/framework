# UI8Kit Framework

**The Next Generation UI System for React & Liquid Templates**

UI8Kit is a comprehensive UI framework that bridges the gap between React development and semantic HTML5/CSS3. Build modern web applications with type-safe React components, then generate production-ready static sites using Liquid templates with semantic CSS classes.

## ✨ Features

- **🔧 React Components** — Type-safe UI components with strict prop validation
- **🎨 Liquid Templates** — Modern templating with layouts, partials, and semantic CSS
- **🎭 Semantic CSS** — Meaningful class names from `data-class` attributes (`.hero-content`, `.nav-menu`)
- **📱 Responsive Design** — Mobile-first approach with breakpoint-specific utilities
- **⚡ Static Generation** — Convert React routes to Liquid templates → HTML5/CSS3 with automatic CSS deduplication
- **🎯 Developer Experience** — Full TypeScript support, hot reloading, comprehensive docs
- **🏗️ Architecture** — Monorepo with Turbo orchestration, multiple deployment targets

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Start local development
bun run dev

# Generate static site (CSS + HTML)
bun run generate
```

## 📁 Project Structure

```
ui8kit-framework/
├── apps/
│   ├── local/          # Development environment (Vite + React)
│   │   ├── src/        # React components and logic
│   │   ├── views/      # Generated Liquid templates
│   │   │   ├── layouts/# Layout templates
│   │   │   ├── pages/  # Route-specific views
│   │   │   └── partials/# Reusable components
│   │   ├── generator.config.ts # Generation configuration
│   │   └── dist/       # Generated output
│   │       ├── css/    # CSS stylesheets
│   │       └── html/   # Static HTML pages
│   └── create-html/    # Legacy static generator (deprecated)
├── packages/
│   ├── generator/      # Static site generator orchestrator
│   ├── render/         # React component renderer (React → HTML)
│   └── core/           # Shared UI components (@ui8kit/core)
└── turbo.json          # Monorepo orchestration
```

## 🎯 Use Cases

- **Component Libraries** — Build and document reusable UI components
- **Static Sites** — Generate SEO-friendly HTML from React routes
- **Marketing Sites** — Create fast, accessible landing pages
- **Prototyping** — Rapid UI development with semantic constraints
- **Documentation** — Self-documenting component systems
- **Blog Platforms** — Content-focused sites with Liquid templating

## 🛠️ Creating Templates and Configuration

### App Structure Setup

Create the following structure in your app directory:

```bash
apps/your-app/
├── views/              # Liquid templates directory
│   ├── layouts/        # Layout templates
│   │   ├── layout.liquid
│   │   └── blog.liquid
│   ├── pages/          # Generated route views
│   │   ├── index.liquid
│   │   └── about.liquid
│   └── partials/       # Reusable components
│       ├── header.liquid
│       ├── footer.liquid
│       └── navigation.liquid
├── generator.config.ts # Generation configuration
└── dist/              # Generated output
    ├── css/
    └── html/
```

### Configuration File

Create `generator.config.ts` in your app root:

```typescript
// apps/local/generator.config.ts
import { generator, type GeneratorConfig } from '@ui8kit/generator';

// Define HTML routes first (for auto-syncing CSS routes)
const htmlRoutes = {
  '/': {
    title: 'Home - My App',
    seo: {
      description: 'Welcome to my amazing app',
      keywords: ['app', 'ui', 'react']
    }
  },
  '/about': {
    title: 'About - My App',
    seo: {
      description: 'Learn more about our mission'
    }
  }
};

export const config: GeneratorConfig = {
  // App metadata
  app: {
    name: 'My UI8Kit App',
    lang: 'en'
  },

  // CSS generation settings
  css: {
    entryPath: './src/main.tsx',  // React entry point (for router config)
    routes: Object.keys(htmlRoutes), // Auto-sync with HTML routes
    outputDir: './dist/css',      // CSS output directory
    pureCss: true                 // Generate both @apply and pure CSS3
  },

  // HTML generation settings
  html: {
    viewsDir: './views',          // Templates directory
    routes: htmlRoutes,           // Use the routes defined above
    outputDir: './dist/html'      // HTML output directory
  },

  // Optional: Asset copying
  assets: {
    copy: ['./public/**/*']
  }
};

// Auto-run when executed directly
if (import.meta.main) {
  console.log('🛠️ Starting static site generation...');
  await generator.generate(config);
}
```

**Router Configuration Requirement**: Your `main.tsx` must use `createBrowserRouter` with a `children` array:

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

### Creating Liquid Templates

#### Layout Template (`views/layouts/layout.liquid`)

```liquid
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
  <meta name="keywords" content="{{ meta.keywords }}">
  {% endif %}

  {% if meta.image %}
  <meta property="og:image" content="{{ meta.image }}">
  {% endif %}

  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  {% include 'partials/header.liquid' %}

  <main class="min-h-screen">
    {{ content | raw }}
  </main>

  {% include 'partials/footer.liquid' %}

  <script src="/js/main.js"></script>
</body>
</html>
```

**Important**: 
- Use `{{ content | raw }}` filter to prevent Liquid from escaping HTML entities in the generated content
- Your `main.tsx` must use `createBrowserRouter` with a `children` array for the renderer to discover routes (see router configuration example below)

#### Page Template (`views/layouts/page.liquid`)

```liquid
---
layout: layout
---

<article class="page max-w-4xl mx-auto px-4 py-8">
  <div class="page-content prose prose-lg">
    {{ content }}
  </div>
</article>
```

#### Partials

**Header (`views/partials/header.liquid`):**
```liquid
<header class="border-b bg-card">
  <div class="container mx-auto px-4 py-4">
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-primary rounded"></div>
        <span class="font-bold text-lg">{{ name | default: 'UI8Kit' }}</span>
      </div>
      <nav class="hidden md:flex items-center gap-6">
        <a href="/" class="text-sm hover:text-primary">Home</a>
        <a href="/about" class="text-sm hover:text-primary">About</a>
      </nav>
    </div>
  </div>
</header>
```

**Footer (`views/partials/footer.liquid`):**
```liquid
<footer class="border-t bg-card mt-16">
  <div class="container mx-auto px-4 py-8">
    <div class="text-center text-sm text-muted-foreground">
      <p>&copy; 2025 {{ name | default: 'UI8Kit' }}. Built with React & CSS3.</p>
    </div>
  </div>
</footer>
```

### React Components with data-class

Create React components that use `data-class` attributes:

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
        <Group gap="4" data-class="hero-actions">
          <Button size="lg" data-class="hero-cta-primary">
            Get Started
          </Button>
          <Button variant="outline" size="lg" data-class="hero-cta-secondary">
            Learn More
          </Button>
        </Group>
      </Stack>
    </Block>
  );
}
```

### Generated Output

#### CSS Files (`dist/css/`)

**tailwind.apply.css** (Semantic selectors):
```css
.hero-content {
  @apply flex flex-col gap-4 items-center;
}

.hero-title {
  @apply text-4xl font-bold;
}

.hero-description {
  @apply text-xl;
}

.hero-actions {
  @apply flex gap-4;
}

/* Automatic deduplication: identical selectors from loops are merged */
.feature-card-0, .feature-card-1, .feature-card-2, .feature-card-3 {
  @apply flex-col gap-4 items-start justify-start p-6 rounded-lg;
}
```

**ui8kit.local.css** (Pure CSS3):
```css
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

/* Automatic deduplication works for pure CSS3 too */
.features-header, .hero-content {
  flex-direction: column;
  gap: calc(var(--spacing) * 4);
  align-items: center;
  justify-content: flex-start;
}
```

**CSS Optimization**: The generator automatically merges selectors with identical class sets, reducing CSS file size by up to 25% for components with repeated patterns (loops, maps, etc.). This happens automatically - no configuration needed.

#### HTML Files (`dist/html/`)

**index.html** (Complete page):
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Home - My App</title>
  <meta name="description" content="Welcome to my amazing app">
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body class="bg-background text-foreground">
  <header class="border-b bg-card">
    <!-- Header content -->
  </header>

  <main class="min-h-screen">
    <div data-class="hero-section" class="relative">
      <div data-class="hero-content" class="flex flex-col gap-4 items-center">
        <h1 data-class="hero-title" class="text-4xl font-bold">Welcome to UI8Kit</h1>
        <p data-class="hero-description" class="text-xl">Build beautiful interfaces</p>
        <div data-class="hero-actions" class="flex gap-4">
          <button data-class="hero-cta-primary" class="px-4 py-2 bg-primary...">Get Started</button>
          <button data-class="hero-cta-secondary" class="px-4 py-2 border...">Learn More</button>
        </div>
      </div>
    </div>
  </main>

  <footer class="border-t bg-card mt-16">
    <!-- Footer content -->
  </footer>
</body>
</html>
```

### Commands

Add to your `package.json`:

```json
{
  "scripts": {
    "generate": "bun run generator.config.ts",
    "generate:html": "bun run generator.config.ts",
    "preview:static": "bun run generate && serve dist/html"
  }
}
```

**Note**: The `generate` command handles both CSS and HTML generation automatically. There's no separate `generate:css` command needed - CSS is generated from the Liquid views created during HTML generation.

### Advanced Configuration

#### Dynamic Route Synchronization

```typescript
// Automatically sync CSS routes with HTML routes
const htmlRoutes = {
  '/': { title: 'Home', seo: { ... } },
  '/about': { title: 'About', seo: { ... } },
  '/blog': { title: 'Blog', seo: { ... } }
};

export const config: GeneratorConfig = {
  css: {
    routes: Object.keys(htmlRoutes), // Always in sync!
    // ...
  },
  html: {
    routes: htmlRoutes,
    // ...
  }
};
```

#### Custom Route Data

```typescript
const htmlRoutes = {
  '/blog/hello-world': {
    title: 'Hello World Blog Post',
    seo: {
      description: 'My first blog post',
      keywords: ['blog', 'welcome']
    },
    data: {
      author: 'John Doe',
      published: '2024-01-15',
      tags: ['welcome', 'introduction']
    }
  }
};
```

**Note**: The `data` field is available in Liquid templates via `{{ data.author }}`, `{{ data.published }}`, etc.

#### SEO Optimization

```typescript
const htmlRoutes = {
  '/': {
    title: 'Home - My App',
    seo: {
      description: 'Welcome to my amazing app built with UI8Kit',
      keywords: ['ui', 'react', 'typescript', 'css3'],
      image: '/og-image.png'
    }
  }
};
```

**Note**: SEO meta tags are automatically generated from the `seo` configuration and available in Liquid templates via `{{ meta.description }}`, `{{ meta.keywords }}`, etc.

## 🎨 CSS Generation: @apply vs Pure CSS3

UI8Kit generates two types of CSS to give you flexibility in different deployment scenarios.

### @apply Directives (tailwind.apply.css)

Best for **Tailwind CSS projects** where you want to leverage the full Tailwind ecosystem:

```css
/* Generated from data-class="hero-content" */
.hero-content {
  @apply flex flex-col gap-4 items-center;
}

.hero-title {
  @apply text-4xl font-bold;
}
```

**Use when:**
- Your project uses Tailwind CSS
- You need access to all Tailwind utilities
- You want responsive design with breakpoints
- You're building with Tailwind's design system

### Pure CSS3 Properties (ui8kit.local.css)

Best for **Tailwind-free projects** or when you want pure CSS3 with CSS variables:

```css
/* Generated from same data-class attributes */
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
```

**Use when:**
- You want to avoid Tailwind CSS dependency
- You need pure CSS3 for static sites
- You're using a different CSS framework
- You want semantic CSS without utility classes

### How CSS Generation Works

1. **Extract Classes**: Parser extracts `class` attributes from Liquid templates
2. **Validate Classes**: Only valid Tailwind utilities go into `@apply`
3. **Generate Selectors**: Uses `data-class` attributes as CSS selectors
4. **Deduplicate**: Automatically merges selectors with identical class sets (e.g., from loops)
5. **Process HTML**: Applies selected HTML mode (tailwind/semantic/inline)
6. **Create Rules**: Generates both `@apply` and pure CSS3 rules

**Automatic Optimization**: When components use loops (e.g., `features.map()`), the generator detects identical class sets and merges them into group selectors, reducing CSS file size without any manual intervention.

### HTML Processing Modes

UI8Kit supports three HTML processing modes:

- **`tailwind`** (default): Preserves both `data-class` and `class` attributes for maximum compatibility
- **`semantic`**: Removes `class` attributes, keeps semantic `data-class` selectors (smaller HTML)
- **`inline`**: Injects CSS directly into HTML `<head>` for self-contained files

Configure via `generator.config.ts`:

```typescript
html: {
  mode: 'semantic', // 'tailwind' | 'semantic' | 'inline'
  // ...
}
```

### Example Workflow

```tsx
// 1. React Component (Development)
<Stack gap="4" items="center" data-class="hero-content">
  <Title text="4xl" data-class="hero-title">Hello</Title>
</Stack>

// 2. Generated Liquid Template
<div data-class="hero-content" class="flex flex-col gap-4 items-center">
  <h1 data-class="hero-title" class="text-4xl font-bold">Hello</h1>
</div>

// 3. Generated CSS
.hero-content {
  @apply flex flex-col gap-4 items-center;  /* @apply version */
}

.hero-content {
  display: flex;                           /* Pure CSS3 version */
  flex-direction: column;
  gap: calc(var(--spacing) * 4);
  align-items: center;
}
```

### Integration Examples

#### With Tailwind CSS
```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

/* Import generated semantic styles */
@import './dist/css/tailwind.apply.css';
```

#### With Pure CSS3
```css
/* Define CSS variables */
:root {
  --spacing: 0.25rem;
  --text-4xl: 2.25rem;
  --font-bold: 700;
}

/* Import pure CSS3 styles */
@import './dist/css/ui8kit.local.css';
```

#### With Custom CSS Framework
```css
/* Your custom framework */
@import './styles/custom-framework.css';

/* Add semantic overrides */
@import './dist/css/ui8kit.local.css';
```

## 💡 Philosophy

UI8Kit embraces the best of both worlds: the developer experience of React with the simplicity and performance of semantic HTML5/CSS3. Every component is designed to output clean, accessible markup that works without JavaScript.

## 📖 About UI8Kit Framework

UI8Kit is more than just a component library—it's a complete UI development paradigm that bridges modern React development with traditional semantic HTML5/CSS3 approaches.

See [DESCRIPTION.md](DESCRIPTION.md) for detailed technical overview.

### The Problem
Traditional React component libraries often generate complex DOM structures with CSS-in-JS, resulting in:
- Heavy JavaScript bundles
- Runtime performance overhead
- Inconsistent styling approaches
- Difficult static site generation

### The Solution
UI8Kit provides a triple approach:
1. **Development Phase**: Use type-safe React components with strict prop validation
2. **Template Phase**: Generate Liquid templates with semantic `data-class` attributes
3. **Production Phase**: Render Liquid templates to semantic HTML5/CSS3

### Key Innovations
- **Liquid Templating**: Modern template engine with layouts, partials, and filters
- **Semantic Selectors**: `data-class` attributes generate meaningful CSS selectors
- **Dual CSS Generation**: Both `@apply` directives and pure CSS3 properties
- **Automatic Deduplication**: Merges duplicate class sets to optimize CSS file size (up to 25% reduction)
- **Configuration-Driven**: Single config file controls all generation aspects
- **Component Variants**: Predefined variants for consistent design systems
- **Type Safety**: Full TypeScript support with compile-time validation

### Architecture Benefits
- **Performance**: Zero-runtime styling, Liquid template rendering
- **Accessibility**: Semantic HTML5 with meaningful CSS selectors
- **SEO**: Static content with proper meta tags and structured data
- **Developer Experience**: Hot reloading, TypeScript, comprehensive documentation
- **Flexibility**: Works for SPAs, static sites, and hybrid applications
- **Maintainability**: Semantic CSS classes instead of random utility combinations
- **Customization**: Liquid templates allow full control over HTML output

## 📄 License

GPL-3.0 License - see [LICENSE](LICENSE) file for details.