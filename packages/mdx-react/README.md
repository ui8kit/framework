# @ui8kit/mdx-react

Lightweight MDX processing package for UI8Kit documentation. Provides React components and utilities for dev-time interactive previews and build-time static HTML generation.

## Philosophy

```
One source → React (dev) → Static HTML (prod)
```

**Design principles:**
- **Docs-First Routing** — File structure defines routes (no config)
- **Zero JS in production** — CSS-only interactivity (`<details>` toggles)
- **Type-safe exports** — Strict separation of browser vs. Node.js code
- **Design system integration** — Shadcn tokens + Mantine props + Spectre CSS

## Installation

```bash
bun add @ui8kit/mdx-react
```

## Quick Start

### Dev Mode (Vite with HMR)

MDX files in `docs/` folder are automatically loaded with `import.meta.glob`:

```typescript
// apps/local/src/routes/DocsPage.tsx
const mdxModules = import.meta.glob<MdxModule>('../../docs/**/*.mdx')

const mdxPath = getMdxPath(pathname)  // /components/button → docs/components/button.mdx
const module = await mdxModules[mdxPath]()

const { default: Content, frontmatter, toc } = await module
```

### Build Mode (Static Generation)

Generator automatically:
1. Scans `docs/` folder
2. Generates HTML pages in `dist/html/`
3. Creates navigation JSON in `dist/docs-nav.json`

```bash
bun run generate
```

## File Structure

```
apps/local/
├── docs/                          # Docs-first routing
│   ├── index.mdx                 # / → /index.html
│   ├── components/
│   │   ├── index.mdx             # /components → /components/index.html
│   │   ├── button.mdx            # /components/button → /components/button/index.html
│   │   └── card.mdx              # /components/card → /components/card/index.html

apps/local/src/routes/
└── DocsPage.tsx                  # Single route handles all paths

apps/local/dist/
├── html/                         # Static output
│   ├── index.html
│   ├── components/
│   │   ├── index.html
│   │   ├── button/index.html
│   │   └── card/index.html
└── docs-nav.json                 # Navigation metadata
```

## Configuration

### generator.config.ts (Build Mode)

```typescript
import { generator, type GeneratorConfig } from '@ui8kit/generator'

export const config: GeneratorConfig = {
  app: { name: 'UI8Kit Docs' },
  
  mdx: {
    enabled: true,
    docsDir: './docs',           // Source MDX folder
    outputDir: './dist/html',    // Generate HTML here
    navOutput: './dist/docs-nav.json',
    
    components: {                 // Available in MDX without import
      Button: '@/components/ui/Button',
      Card: '@/components/Card',
    },
    
    toc: {
      minLevel: 2,
      maxLevel: 3,
    },
  },
}

await generator.generate(config)
```

### vite.config.ts (Dev Mode)

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import mdx from '@mdx-js/rollup'

export default defineConfig({
  plugins: [
    {
      ...mdx({
        remarkPlugins: [
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: 'frontmatter' }],
        ],
        rehypePlugins: [rehypeSlug],
        providerImportSource: '@mdx-js/react',
      }),
      enforce: 'pre',
    },
    react(),
  ],
  resolve: {
    alias: {
      '@ui8kit/mdx-react': './packages/mdx-react/src/index.ts',
    },
  },
  optimizeDeps: {
    exclude: ['@ui8kit/mdx-react/server'],  // Server-only modules
  },
})
```

## MDX Frontmatter

Each MDX file starts with YAML frontmatter:

```mdx
---
title: Button Component
description: Action button with variants and sizes
order: 1
---

# Button

Your content here...
```

**Fields:**
- `title` — Page title (required)
- `description` — SEO description
- `order` — Sidebar sort order (default: 99)

## React Hooks (Dev Mode)

Use in components to access page metadata:

```typescript
import { usePageContent, useToc, useFrontmatter } from '@ui8kit/mdx-react'

function Layout() {
  const { Content, frontmatter } = usePageContent()
  const toc = useToc()
  const fm = useFrontmatter()
  
  return (
    <article>
      <h1>{frontmatter.title}</h1>
      <Content />
      <aside>
        {toc.map(entry => <a href={`#${entry.slug}`}>{entry.text}</a>)}
      </aside>
    </article>
  )
}
```

## Utilities

### Core (Browser-safe)

```typescript
import {
  parseFrontmatter,      // Extract YAML frontmatter
  extractToc,            // Get headings as TOC
  buildHierarchicalToc,  // Organize TOC by depth
  extractExcerpt,        // Get first paragraph
  parseMdxFile,          // Parse MDX to AST
  slugify,               // Convert text to URL slug
} from '@ui8kit/mdx-react'
```

### Server (Node.js-only)

```typescript
import {
  scanDocsTree,          // Scan docs folder
  flattenDocsTree,       // Flatten tree to array
  buildSidebarFromTree,  // Generate nav structure
  generateDocsFromMdx,   // Main generator function
  loadConfig,            // Load config from file
  resolveConfigPath,     // Find config.ts location
} from '@ui8kit/mdx-react/server'
```

## Export Structure

### Main entry (`@ui8kit/mdx-react`)
Browser-safe only — no fs, no dynamic imports

```typescript
// React hooks for dev mode
export { PageContentProvider, usePageContent, useToc, useFrontmatter }

// Documentation components
export { ComponentPreview, PropsTable, Callout, Steps }

// Browser-safe utilities
export { parseFrontmatter, extractToc, buildHierarchicalToc, ... }
```

### Server entry (`@ui8kit/mdx-react/server`)
Node.js-only — fs access, dynamic imports allowed

```typescript
// Scanner
export { scanDocsTree, flattenDocsTree, buildSidebarFromTree }

// Generator
export { generateDocsFromMdx }

// Config
export { loadConfig, resolveConfigPath }
```

## Build Output

### HTML Structure

**Tailwind mode** (default):
```html
<div class="button-group" data-class="button-group">
  <!-- class from utility-props.map.ts + data-class for semantic selectors -->
</div>
```

**Semantic mode** (`--semantic`):
```html
<div class="button-group">
  <!-- class from data-class attribute, original class removed -->
</div>
```

**Inline mode** (`--inline`):
```html
<div class="button-group">
  <!-- Semantic + CSS inlined in <head> -->
</div>
```

### Generated Files

```
dist/html/
├── index.html                         # Home page
├── components/
│   ├── index.html                    # Components list
│   ├── button/
│   │   └── index.html               # Button docs
│   └── card/
│       └── index.html               # Card docs
└── assets/
    └── css/
        └── styles.css               # Generated CSS
```

## Architecture

### Separation of Concerns

**Browser (dev-time via Vite):**
- MDX loaded with `import.meta.glob`
- Full React hydration
- HMR support
- Interactive components

**Build-time (Node.js via generator):**
- MDX scanned from filesystem
- Components rendered to static HTML
- CSS extracted to separate file
- Navigation generated as JSON

### Memory & Performance

- Dev mode: Source directly via alias (no build needed)
- Build mode: Simplified static generation (placeholder HTML)
- Future: Vite SSG for full MDX rendering

## Known Limitations

### Build Mode
- Current: Placeholder HTML with frontmatter only
- Future: Full MDX rendering via Vite SSG
- Components require JS fallback message in HTML

### Dev Mode
- All routes must be files in `docs/` folder
- `@/` imports work in MDX via Vite alias
- Components must not require context providers

## License

MIT
