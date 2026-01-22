# @ui8kit/mdx-react

MDX processing package for UI8Kit documentation. Provides React components and utilities for dev-time interactive previews and build-time static HTML generation.

## Features

- **Dual-mode operation** — Interactive dev mode with HMR, static HTML generation for production
- **Docs-first routing** — Filesystem structure defines routes (no config needed)
- **React Context & Hooks** — `usePageContent()`, `useToc()`, `useFrontmatter()`
- **Documentation Components** — `ComponentPreview`, `PropsTable`, `Callout`, `Steps`
- **Generator Service** — `MdxService` for integration with `@ui8kit/generator`

## Installation

```bash
bun add @ui8kit/mdx-react
```

## Exports

| Entry Point | Environment | Description |
|-------------|-------------|-------------|
| `@ui8kit/mdx-react` | Browser | React context, hooks, components |
| `@ui8kit/mdx-react/server` | Node.js | Scanner, generator (uses fs) |
| `@ui8kit/mdx-react/service` | Node.js | IService adapter for Orchestrator |
| `@ui8kit/mdx-react/vite` | Node.js | Vite plugin for dev mode |

## Quick Start

### Dev Mode (Vite + HMR)

```tsx
// src/routes/DocsPage.tsx
import { PageContentProvider, usePageContent, useToc } from '@ui8kit/mdx-react'

// Load MDX files with Vite glob
const mdxModules = import.meta.glob('../docs/**/*.mdx')

function DocsPage() {
  const { Content, frontmatter } = usePageContent()
  const toc = useToc()
  
  return (
    <article>
      <h1>{frontmatter.title}</h1>
      <Content />
      <TableOfContents items={toc} />
    </article>
  )
}
```

### Build Mode (Static Generation)

```typescript
// generator.config.ts
import { generate } from '@ui8kit/generator'

await generate({
  mdx: {
    enabled: true,
    docsDir: './docs',
    outputDir: './dist/html',
    navOutput: './dist/docs-nav.json',
    basePath: '/docs',
  },
})
```

## Generator Integration

### Using MdxService Directly

```typescript
import { MdxService } from '@ui8kit/mdx-react/service'

const service = new MdxService()

await service.initialize({
  logger: console,
  config: { html: { mode: 'tailwind' } },
})

const result = await service.execute({
  docsDir: './docs',
  outputDir: './dist/html',
  basePath: '/docs',
  navOutput: './dist/docs-nav.json',
})

console.log(`Generated ${result.pages} pages`)
```

### Using MdxStage with Orchestrator

```typescript
import { Orchestrator, MdxStage } from '@ui8kit/generator'

const orchestrator = new Orchestrator({ logger })
orchestrator.addStage(new MdxStage())

// MdxStage runs automatically when mdx.enabled=true
await orchestrator.generate(config)
```

## Configuration Reference

### MDX Config in generator.config.ts

```typescript
mdx: {
  // Required
  enabled: true,
  docsDir: './docs',           // MDX source folder
  outputDir: './dist/html',    // HTML output folder
  
  // Optional
  basePath: '/docs',           // URL prefix for routes
  navOutput: './dist/nav.json', // Navigation JSON path
  
  // Components available in MDX
  components: {
    Button: '@/components/ui/Button',
    Card: '@/components/Card',
  },
  
  // TypeScript props extraction
  propsSource: './src/components',
  
  // Table of Contents
  toc: {
    minLevel: 2,  // Start from h2
    maxLevel: 3,  // Include up to h3
  },
}
```

### HTML Output Modes

| Mode | Output | Use Case |
|------|--------|----------|
| `tailwind` | `class` + `data-class` | Development, Tailwind processing |
| `semantic` | `class` only (from data-class) | Clean semantic HTML |
| `inline` | Semantic + inline `<style>` | Email templates, portability |

## Docs-First Routing

Routes are derived from the filesystem structure:

```
docs/
├── index.mdx                 → /
├── getting-started.mdx       → /getting-started
├── components/
│   ├── index.mdx             → /components
│   ├── button.mdx            → /components/button
│   └── card.mdx              → /components/card
└── tutorials/
    └── getting-started.mdx   → /tutorials/getting-started
```

## MDX Frontmatter

```mdx
---
title: Button Component
description: Interactive button with variants
order: 1
---

# Button

Content here...
```

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Page title, used in `<title>` and navigation |
| `description` | string | SEO description, meta tag |
| `order` | number | Sort order in navigation (lower = first) |

## React Hooks

### usePageContent()

```tsx
const { Content, frontmatter, toc, excerpt } = usePageContent()
```

### useToc()

```tsx
const toc = useToc()
// [{ depth: 2, text: 'Usage', slug: 'usage' }, ...]
```

### useFrontmatter()

```tsx
const { title, description } = useFrontmatter()
```

## Documentation Components

### ComponentPreview

```mdx
<ComponentPreview title="Primary Button">
  <Button variant="primary">Click me</Button>
</ComponentPreview>
```

### PropsTable

```mdx
<PropsTable component="Button" />
```

### Callout

```mdx
<Callout type="warning">
  This feature is experimental.
</Callout>
```

### Steps

```mdx
<Steps>
  1. Install the package
  2. Import the component
  3. Use in your code
</Steps>
```

## Generated Output

### HTML Pages

```
dist/html/
├── index.html
├── getting-started/
│   └── index.html
└── components/
    ├── index.html
    ├── button/
    │   └── index.html
    └── card/
        └── index.html
```

### Navigation JSON

```json
{
  "items": [
    { "title": "Home", "path": "/", "order": 0 },
    { "title": "Button", "path": "/components/button", "order": 1 }
  ],
  "generated": "2026-01-22T12:00:00.000Z"
}
```

## Browser vs Node.js Code Separation

**Critical:** Strict separation prevents Node.js APIs from being bundled for browser.

```typescript
// ✅ Browser-safe (main entry)
import { usePageContent, useToc } from '@ui8kit/mdx-react'

// ✅ Node.js only (server entry)
import { scanDocsTree, generateDocsFromMdx } from '@ui8kit/mdx-react/server'

// ✅ IService for generator
import { MdxService } from '@ui8kit/mdx-react/service'

// ❌ Would fail in browser
import { scanDocsTree } from '@ui8kit/mdx-react' // Uses fs!
```

## Vite Configuration

```typescript
// vite.config.ts
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

export default {
  plugins: [
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
    }),
  ],
  optimizeDeps: {
    exclude: ['@ui8kit/mdx-react/server'], // Don't bundle server code
  },
}
```

## License

MIT
