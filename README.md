# UI8Kit Framework

**The Next Generation UI System for React & Liquid Templates**

UI8Kit is a comprehensive UI framework that bridges the gap between React development and semantic HTML5/CSS3. Build modern web applications with type-safe React components, then generate production-ready static sites using Liquid templates with semantic CSS classes.

## ✨ Features

- **🔧 React Components** — Type-safe UI components with strict prop validation
- **🎨 Liquid Templates** — Modern templating with layouts, partials, and semantic CSS
- **🎭 Semantic CSS** — Meaningful class names from `data-class` attributes (`.hero-content`, `.nav-menu`)
- **📱 Responsive Design** — Mobile-first approach with breakpoint-specific utilities
- **⚡ Static Generation** — Convert React routes to Liquid templates → HTML5/CSS3
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

# Generate only CSS
bun run generate:css

# Generate only HTML
bun run generate:html

# Preview generated site
bun run preview:static
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
│   ├── generator/      # Static site generator core
│   ├── preprocessor/   # CSS preprocessor for Liquid templates
│   └── ui8kit/         # Shared UI components
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

export const config: GeneratorConfig = {
  // App metadata
  app: {
    name: 'My UI8Kit App',
    lang: 'en'
  },

  // CSS generation settings
  css: {
    entryPath: './src/main.tsx',  // React entry point
    routes: ['/', '/about', '/blog'], // Routes to process
    outputDir: './dist/css',      // CSS output directory
    pureCss: true                 // Generate both @apply and pure CSS3
  },

  // HTML generation settings
  html: {
    viewsDir: './views',          // Templates directory
    routes: {
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
    },
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

### Creating Liquid Templates

#### Layout Template (`views/layouts/layout.liquid`)

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
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,...">
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
```

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
    "generate:css": "bun run --cwd ../../packages/preprocessor src/index.ts -- --routes /,/about --snapshots-dir ../../apps/local/views --output-dir ../../apps/local/dist/css --pure-css --verbose",
    "generate:html": "bun run generator.config.ts",
    "preview:static": "bun run generate && serve dist/html"
  }
}
```

### Advanced Configuration

#### Multiple Layouts

```typescript
// generator.config.ts
html: {
  templates: {
    layout: './views/layouts/layout.liquid',
    blog: './views/layouts/blog.liquid',    // Different layout for blog
    minimal: './views/layouts/minimal.liquid' // Minimal layout
  },
  routes: {
    '/': { template: 'layout' },           // Uses default layout
    '/blog': { template: 'blog' },         // Uses blog layout
    '/about': { template: 'minimal' }      // Uses minimal layout
  }
}
```

#### Custom Route Data

```typescript
routes: {
  '/blog/hello-world': {
    title: 'Hello World Blog Post',
    template: 'blog',
    data: {
      author: 'John Doe',
      published: '2024-01-15',
      tags: ['welcome', 'introduction']
    }
  }
}
```

#### SEO Optimization

```typescript
routes: {
  '/': {
    title: 'Home - My App',
    seo: {
      description: 'Welcome to my amazing app built with UI8Kit',
      keywords: ['ui', 'react', 'typescript', 'css3'],
      image: '/og-image.png',
      canonical: 'https://myapp.com/'
    }
  }
}
```

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
4. **Create Rules**: Generates both `@apply` and pure CSS3 rules

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