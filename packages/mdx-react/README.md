# @ui8kit/mdx-react

MDX processing package for UI8Kit documentation. Provides isolated MDX → React → HTML pipeline.

## Architecture

This package focuses **only on content processing**:

- **MDX Compilation** — Convert MDX files to React components
- **Frontmatter & TOC** — Extract metadata and table of contents
- **Docs Scanner** — Build navigation tree from file structure
- **React Hooks** — Access page content in components

**What it does NOT do** (application responsibility):

- Routing
- Sidebar UI
- Layouts
- Theme/styling

## Installation

```bash
bun add @ui8kit/mdx-react
```

## Configuration

Create `mdx.config.ts` in your application:

```ts
import { defineConfig } from '@ui8kit/mdx-react'

export default defineConfig({
  docsDir: './docs',
  outputDir: './dist/docs',
  basePath: '/docs',
  
  site: {
    title: 'My Docs',
    description: 'Documentation site',
  },
  
  components: {
    Button: '@/components/ui/Button',
    Card: '@/components/Card',
  },
  
  toc: {
    minLevel: 2,
    maxLevel: 3,
  },
  
  sidebar: 'auto', // or manual array
})
```

## Usage

### In React Components

```tsx
import { usePageContent, useToc } from '@ui8kit/mdx-react'

function DocsPage() {
  const { Content, frontmatter, toc } = usePageContent()
  
  return (
    <article>
      <h1>{frontmatter.title}</h1>
      <nav>
        {toc.map(item => (
          <a key={item.slug} href={`#${item.slug}`}>
            {item.text}
          </a>
        ))}
      </nav>
      <Content />
    </article>
  )
}
```

### Scan Docs Tree (for Sidebar)

```tsx
import { scanDocsTree, buildSidebarFromTree } from '@ui8kit/mdx-react/utils'

// In your app setup or build script
const tree = await scanDocsTree('./docs', {
  basePath: '/docs',
  sort: 'frontmatter',
})

const sidebarItems = buildSidebarFromTree(tree)
```

### Static Generation

```ts
import { MdxGenerator } from '@ui8kit/mdx-react/generator'

const generator = new MdxGenerator({
  configPath: './mdx.config.ts',
  verbose: true,
})

await generator.generate()
// Outputs: dist/docs/index.html, dist/docs/components/button/index.html, etc.
```

## File Structure

```
docs/
├── index.mdx              → /docs
├── getting-started.mdx    → /docs/getting-started
└── components/
    ├── index.mdx          → /docs/components
    ├── button.mdx         → /docs/components/button
    └── card.mdx           → /docs/components/card
```

## MDX Files

```mdx
---
title: Button Component
description: Interactive button with variants
order: 1
---

# Button

The Button component provides interactive buttons.

## Usage

<Button variant="primary">Click me</Button>

## API

| Prop | Type | Default |
|------|------|---------|
| variant | string | 'default' |
```

## Exports

### Main (`@ui8kit/mdx-react`)

- `defineConfig()` — Create typed config
- `usePageContent()` — Access current page content
- `useToc()` — Access table of contents
- `useFrontmatter()` — Access frontmatter
- `PageContentProvider` — Context provider
- `MDXProvider`, `useMDXComponents` — From @mdx-js/react

### Generator (`@ui8kit/mdx-react/generator`)

- `MdxGenerator` — Generator class
- `generateMdxPages()` — Convenience function

### Utils (`@ui8kit/mdx-react/utils`)

- `scanDocsTree()` — Scan docs directory
- `flattenDocsTree()` — Flatten tree to list
- `buildSidebarFromTree()` — Convert tree to sidebar items
- `parseFrontmatter()` — Extract frontmatter from source
- `extractToc()` — Extract TOC from content
- `slugify()` — Convert text to URL slug

## License

MIT
