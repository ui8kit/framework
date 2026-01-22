# @ui8kit/vite-docs

**Documentation Application for UI8Kit Framework**

A docs-first application where all routes are automatically derived from MDX files in the `docs/` folder. Features live development with Vite HMR and static generation for production deployment.

## Quick Start

```bash
# Install dependencies
bun install

# Start development server (Vite + HMR)
bun run dev

# Generate static documentation
bun run generate

# Preview generated static site
bun run serve
```

## Docs-First Architecture

Unlike `@ui8kit/vite-web`, this application uses **file-based routing from MDX**:

```
docs/
├── index.mdx                    → /
├── components/
│   ├── index.mdx               → /components
│   ├── button.mdx              → /components/button
│   └── card.mdx                → /components/card
└── tutorials/
    └── getting-started.mdx     → /tutorials/getting-started
```

**No route configuration needed** — the generator scans `docs/` and creates routes automatically.

## Development Modes

### Dev Mode (Vite + HMR)

```bash
bun run dev
```

- Full React hydration
- MDX hot module replacement
- Live component preview
- Fast refresh on file changes

### Static Generation

```bash
bun run generate
```

- Scans `docs/` folder for MDX files
- Generates static HTML pages
- Creates navigation JSON (`docs-nav.json`)
- Outputs pure CSS for production

## Configuration Reference

### Key Differences from `@ui8kit/vite-web`

| Feature | vite-web | vite-docs |
|---------|----------|-----------|
| Route source | `config.html.routes` | `docs/` folder (MDX) |
| HTML routes | Defined manually | Auto-discovered |
| MDX support | No | Yes |
| Navigation | Manual | Auto-generated JSON |

### `mdx` — MDX Documentation Config

```typescript
mdx: {
  enabled: true,                    // Enable MDX processing
  docsDir: './docs',                // Source MDX folder
  outputDir: './dist/html',         // Output HTML folder
  navOutput: './dist/docs-nav.json', // Navigation structure
  basePath: '',                     // URL prefix (empty = root)
  
  // Components available in MDX without imports
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
  
  propsSource: './src/components',  // Source for props extraction
  
  toc: {
    minLevel: 2,                    // Min heading level for TOC
    maxLevel: 3,                    // Max heading level for TOC
  },
}
```

### `html.routes` — Empty by Design

```typescript
html: {
  viewsDir: './views',
  routes: {},           // Empty! Routes come from MDX
  outputDir: './dist/html',
  mode: 'tailwind',
}
```

## Writing Documentation

### MDX File Structure

```mdx
---
title: Button Component
description: Interactive button with multiple variants
order: 1
---

# Button

A versatile button component for user interactions.

## Usage

<Button variant="primary">Click me</Button>

## Variants

### Primary

<Button variant="primary">Primary</Button>

### Secondary

<Button variant="secondary">Secondary</Button>
```

### Frontmatter Options

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Page title (used in nav and `<title>`) |
| `description` | string | Meta description for SEO |
| `order` | number | Sort order in navigation (lower = first) |

### Using Components

Components defined in `mdx.components` are available without imports:

```mdx
{/* These work automatically */}
<Button variant="primary">Click</Button>
<Card>Content</Card>
<Stack gap="md">
  <Box>Item 1</Box>
  <Box>Item 2</Box>
</Stack>
```

## Output Structure

After `bun run generate`:

```
dist/
├── assets/
│   └── js/
│       └── main.js              # Client script
├── css/
│   ├── index.css                # Copied styles
│   ├── shadcn.css               # Copied styles
│   ├── tailwind.apply.css       # Generated @apply CSS
│   ├── ui8kit.local.css         # Generated pure CSS
│   └── variants.apply.css       # Component variants
├── docs-nav.json                # Navigation structure
└── html/
    ├── index.html               # /
    ├── components/
    │   ├── index.html           # /components
    │   ├── button/
    │   │   └── index.html       # /components/button
    │   └── card/
    │       └── index.html       # /components/card
    └── tutorials/
        └── getting-started/
            └── index.html       # /tutorials/getting-started
```

### Navigation JSON

The generated `docs-nav.json` provides navigation structure:

```json
[
  { "title": "Home", "path": "/", "order": 0 },
  { "title": "Components", "path": "/components", "order": 1 },
  { "title": "Button Component", "path": "/components/button", "order": 2 },
  { "title": "Card Component", "path": "/components/card", "order": 3 },
  { "title": "Getting Started", "path": "/tutorials/getting-started", "order": 10 }
]
```

## Generation Pipeline

1. **Initialize Layouts** — Copy templates if missing
2. **Generate CSS** — Extract and generate stylesheets
3. **Copy Assets** — Static files to `dist/`
4. **Generate Client Script** — Dark mode, utilities
5. **Generate Elements** — Typed variant components
6. **Generate MDX Docs** — Scan `docs/`, create HTML + nav JSON

## Dependencies

### Runtime
- `react`, `react-dom` — React 19
- `react-router-dom` — Client-side routing (dev mode)
- `lucide-react` — Icons

### MDX Processing
- `@mdx-js/react`, `@mdx-js/rollup` — MDX compiler
- `rehype-slug` — Auto-generate heading IDs
- `remark-frontmatter` — Parse YAML frontmatter
- `remark-gfm` — GitHub Flavored Markdown
- `remark-mdx-frontmatter` — Expose frontmatter in MDX

### Build
- `@ui8kit/generator` — Static generation
- `@ui8kit/mdx-react` — MDX utilities and components

## Adding New Documentation

1. Create MDX file in `docs/`:

```bash
# New component doc
touch docs/components/accordion.mdx

# New tutorial
touch docs/tutorials/styling.mdx
```

2. Add frontmatter:

```mdx
---
title: Accordion
description: Expandable content sections
order: 5
---

# Accordion

...content...
```

3. Generate:

```bash
bun run generate
```

The new page automatically appears in navigation.

## Related Documentation

- [UI8Kit Framework](../../README.md)
- [Generator Package](../../packages/generator/README.md)
- [MDX-React Package](../../packages/mdx-react/README.md)
- [@ui8kit/vite-web](../web/README.md) — Static site without MDX
