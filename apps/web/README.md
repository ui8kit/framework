# @ui8kit/vite-web

**Static Site Generator Application for UI8Kit Framework**

This application demonstrates the full power of UI8Kit's static site generation pipeline. It converts React components into semantic HTML with optimized CSS, ready for production deployment without JavaScript dependencies.

## Quick Start

```bash
# Install dependencies
bun install

# Start development server (Vite HMR)
bun run dev

# Generate static site
bun run generate

# Generate with specific mode
bun run generate --semantic
bun run generate --inline
bun run generate --tailwind --pure
```

## Generation Modes

The generator supports three HTML output modes:

| Mode | Command | Description |
|------|---------|-------------|
| **tailwind** | `--tailwind` | Keep both `class` and `data-class` attributes (default) |
| **semantic** | `--semantic` | Move `data-class` → `class`, remove Tailwind classes |
| **inline** | `--inline` | Like semantic + inject CSS directly into `<head>` |

### Additional Flags

- `--pure` — Remove `data-class` attributes from output (only with `--tailwind`)
- `--help` — Show usage information

## Configuration Reference

The generator is configured via `generator.config.ts`. Here's a complete breakdown:

### `app` — Application Metadata

```typescript
app: {
  name: 'UI8Kit App',  // Used in templates and meta tags
  lang: 'en'           // HTML lang attribute
}
```

### `mappings` — CSS Class Mappings

```typescript
mappings: {
  ui8kitMap: './src/lib/ui8kit.map.json',  // Tailwind → semantic class mapping
  // shadcnMap: '...'                       // Optional: shadcn component styles
}
```

The `ui8kit.map.json` file maps Tailwind utility classes to semantic CSS properties for pure CSS generation.

### `css` — CSS Generation

```typescript
css: {
  entryPath: './src/main.tsx',   // React app entry point
  routes: ['/', '/about'],        // Routes to process for CSS extraction
  outputDir: './dist/css',        // Output directory for generated CSS
  pureCss: true                   // Generate ui8kit.local.css (pure CSS3)
}
```

**Generated files:**
- `tailwind.apply.css` — Semantic selectors with `@apply` directives
- `ui8kit.local.css` — Pure CSS3 (when `pureCss: true`)
- `variants.apply.css` — Component variant styles

### `html` — HTML Generation

```typescript
html: {
  viewsDir: './views',           // Liquid templates directory
  routes: {                       // Route definitions with SEO metadata
    '/': {
      title: 'Page Title',
      seo: {
        description: 'Meta description',
        keywords: ['keyword1', 'keyword2']
      }
    }
  },
  outputDir: './dist/html',      // Final HTML output directory
  mode: 'tailwind',              // Default generation mode
  partials: {                     // React → Liquid partial generation
    sourceDir: './src/partials',
    outputDir: 'partials',
    props: {
      Header: { name: "{{ name | default: 'UI8Kit' }}" },
      Footer: { name: "{{ name | default: 'UI8Kit' }}" }
    }
  }
}
```

### `clientScript` — Client-Side JavaScript

```typescript
clientScript: {
  enabled: true,                       // Generate client script
  outputDir: './dist/assets/js',       // Output directory
  fileName: 'main.js',                 // Output filename
  darkModeSelector: '[data-toggle-dark]'  // Dark mode toggle selector
}
```

### `uncss` — CSS Optimization (Optional)

```typescript
uncss: {
  enabled: false,                      // Enable UnCSS processing
  htmlFiles: ['./dist/html/index.html'],  // HTML files to analyze
  cssFile: './dist/html/assets/css/styles.css',
  outputDir: './dist/html/assets',
  ignore: [':hover', ':focus', '.dark', ...],  // Selectors to preserve
  media: true,                         // Include media queries
  timeout: 10000                       // Processing timeout (ms)
}
```

### `assets` — Asset Copying

```typescript
assets: {
  copy: ['./src/assets/css/**/*']  // Glob patterns for files to copy
}
```

Files are copied to appropriate locations:
- CSS files → `dist/css/`
- JS files → `dist/html/assets/js/`
- Other files → `dist/html/assets/`

### `elements` — Variant Element Generation

```typescript
elements: {
  enabled: true,                      // Generate typed element components
  variantsDir: './src/variants',      // Source variant definitions
  outputDir: './src/elements',        // Output directory
  componentsImportPath: '../components'  // Import path in generated files
}
```

Generates pre-typed React components from variant definitions (e.g., `PrimaryButton`, `SecondaryBadge`).

## Output Structure

After running `bun run generate`:

```
dist/
├── assets/
│   └── js/
│       └── main.js           # Client-side script (dark mode, etc.)
├── css/
│   ├── index.css             # Copied from src/assets/css/
│   ├── shadcn.css            # Copied from src/assets/css/
│   ├── tailwind.apply.css    # Generated: @apply directives
│   ├── ui8kit.local.css      # Generated: pure CSS3
│   └── variants.apply.css    # Generated: component variants
└── html/
    ├── index.html            # Generated: home page
    └── about/
        └── index.html        # Generated: about page

views/
├── layouts/
│   ├── layout.liquid         # Main layout template
│   └── page.liquid           # Page wrapper template
├── pages/
│   ├── index.liquid          # Home page content
│   └── about.liquid          # About page content
└── partials/
    ├── header.liquid         # Generated from React Header component
    ├── footer.liquid         # Generated from React Footer component
    ├── navbar.liquid         # Generated from React Navbar component
    └── sidebar.liquid        # Generated from React Sidebar component

src/elements/
├── badge.tsx                 # Generated: Badge variants (PrimaryBadge, etc.)
├── button.tsx                # Generated: Button variants (PrimaryButton, etc.)
├── card.tsx                  # Generated: Card variants
├── grid.tsx                  # Generated: Grid variants
├── image.tsx                 # Generated: Image variants
└── index.ts                  # Barrel export
```

## Generation Pipeline

The generator executes the following stages:

1. **Initialize Layouts** — Copy templates from `@ui8kit/generator/templates/` if missing
2. **Generate Views** — Render React components to Liquid templates
3. **Generate Partials** — Convert React partials to Liquid includes
4. **Generate CSS** — Extract classes and generate `@apply` + pure CSS
5. **Generate HTML** — Render Liquid templates to final HTML
6. **Copy Assets** — Copy static files (CSS, images, etc.)
7. **Generate Client Script** — Create dark mode and utility JS
8. **Generate Elements** — Create typed variant components

## Development Workflow

### Adding a New Page

1. Add route to `htmlRoutes` in `generator.config.ts`:

```typescript
const htmlRoutes = {
  // ...existing routes...
  '/contact': {
    title: 'Contact Us',
    seo: {
      description: 'Get in touch with us',
      keywords: ['contact', 'support']
    }
  }
};
```

2. Create corresponding React route component
3. Run `bun run generate`

### Adding a New Partial

1. Create React component in `src/partials/`:

```tsx
// src/partials/Newsletter.tsx
export function Newsletter({ title }: { title: string }) {
  return (
    <section data-class="newsletter">
      <h3>{title}</h3>
      <form>...</form>
    </section>
  );
}
```

2. Add props mapping in `generator.config.ts`:

```typescript
partials: {
  props: {
    Newsletter: { title: "{{ newsletterTitle | default: 'Subscribe' }}" }
  }
}
```

3. Run `bun run generate`
4. Use in Liquid templates: `{% include 'partials/newsletter.liquid' %}`

## Related Documentation

- [UI8Kit Framework](../../README.md)
- [Generator Package](../../packages/generator/README.md)
- [UI8Kit Props Rules](../../.cursor/rules/ui8kit.mdc)
