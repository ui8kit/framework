# AGENTS.md

Instructions for AI coding agents working with this codebase.

---

## Project Overview

**UI8Kit Framework** — A comprehensive UI system providing both React components and semantic HTML5/CSS3 utilities. This monorepo uses Turbo for orchestration.

## Architecture

### Applications
- **`@ui8kit/vite-local`** — Local development environment for components, layouts, and documentation (not for web deployment)
- **`@ui8kit/generator`** — Static site generator orchestrator that coordinates React rendering, CSS extraction, and HTML assembly

### Packages
- **`@ui8kit/render`** — React component renderer that converts React components to static HTML with `data-class` attributes
- **`@ui8kit/generator`** — Orchestrates the complete static generation pipeline (views → CSS → HTML → assets)

### Framework Capabilities
- **React Components** — Type-safe UI components with utility props
- **HTML5/CSS3 Semantics** — Bootstrap/Uikit3-style semantic classes (e.g., `button button-primary`)
- **Utility Props System** — Strict validation via `utility-props.map.ts`
- **Component Variants** — Button, badge, card, grid, image variants only

## Development Workflow

### Docs-First Architecture

**Routes defined by file structure (no routing config):**

```
apps/local/docs/
├── index.mdx                    → /
├── components/
│   ├── index.mdx               → /components
│   ├── button.mdx              → /components/button
│   └── card.mdx                → /components/card
```

### Dev Mode (Vite with HMR)

1. `bun run dev` starts Vite server
2. MDX files loaded via `import.meta.glob` in DocsPage
3. React Router serves pages with full hydration
4. HMR updates MDX changes instantly

### Build Mode (Static Generation)

1. `bun run generate` scans `docs/` folder
2. Creates static HTML in `dist/html/` with matching structure
3. Generates `dist/docs-nav.json` for navigation
4. Deploys generated files for production

## Development Principles

### 1. Docs-First Routing

**No routing config needed — file structure defines routes**

- `docs/index.mdx` → `/`
- `docs/components/button.mdx` → `/components/button`
- Automatic in both dev (via glob) and build (via scanner)

### 2. Browser vs. Node.js Code Separation

**Strict isolation prevents Node.js APIs in browser bundle**

```typescript
// ✅ Main entry (@ui8kit/mdx-react) — browser-safe only
export { parseFrontmatter, usePageContent, ComponentPreview }

// ✅ Server entry (@ui8kit/mdx-react/server) — Node.js only
export { scanDocsTree, generateDocsFromMdx }

// ❌ Would break browser
import { scanDocsTree } from '@ui8kit/mdx-react'  // Uses fs!
```

### 3. UI8Kit Props Rules

**Follow these principles for all component usage:**

1. **Single Value Props Only** — No responsive modifiers in props
   - ✅ `<Box col="span-1" className="lg:col-span-3" />`
   - ❌ `<Box col="span-1 lg:span-3" />`

2. **className Restricted** — Only for responsive overrides or custom styling
   - Requires `data-class` attribute for semantic selectors

3. **data-class Attributes** — Mandatory for CSS generation
   - `<Button data-class="primary-button">Click</Button>`

See `.cursor/rules/ui8kit.mdc` for complete rules and examples.

---

## Package Guide

### `@ui8kit/mdx-react` — MDX Documentation

**Dual-mode MDX processor for docs-first applications**

- Dev mode: Vite + `import.meta.glob` for HMR
- Build mode: Static HTML generation with navigation JSON
- Strict browser/Node.js code separation
- Automatic route discovery from filesystem

**Key exports:**
```typescript
// Browser-safe (main entry)
import { usePageContent, useToc, ComponentPreview } from '@ui8kit/mdx-react'

// Node.js only (server entry)
import { scanDocsTree, generateDocsFromMdx } from '@ui8kit/mdx-react/server'
```

**Configuration:** `apps/local/generator.config.ts`
- `mdx.docsDir` — Source MDX folder (e.g., `./docs`)
- `mdx.outputDir` — HTML output folder (e.g., `./dist/html`)
- `mdx.components` — Available in MDX without imports

**See:** `packages/mdx-react/AGENTS.md` for development guide

### `@ui8kit/generator` — Static Site Generation

**Orchestrates complete generation pipeline**

- Scans `docs/` for MDX files
- Generates static HTML pages
- Extracts CSS from classes
- Copies assets

**See:** `packages/generator/.cursor/rules/generator.mdc` for rules

### `@ui8kit/render` — React Component Rendering

**Converts React components to static HTML**

- Direct component rendering (no context providers)
- Preserves `data-class` attributes
- Supports semantic CSS generation

**See:** `packages/render/.cursor/rules/render.mdc` for rules

---

## Working Patterns

### Adding a New Documentation Page

1. Create file in `docs/` folder
   ```
   docs/getting-started/installation.mdx
   ```

2. Add frontmatter with metadata
   ```mdx
   ---
   title: Installation
   description: How to install UI8Kit
   order: 1
   ---
   ```

3. Write content with markdown + JSX

4. In dev: Auto-loads at `/getting-started/installation`

5. In build: Generates `/getting-started/installation/index.html`

### Running Commands

```bash
# Dev mode (Vite + HMR)
bun run dev

# Build mode (Static generation)
bun run generate

# Both at once (in separate terminals)
bun run dev &
bun run generate
```

### Testing Changes

- Dev: http://localhost:5173 (auto-reload on MDX changes)
- Build: Check `dist/html/` and `dist/docs-nav.json`

---

## 📚 Additional Resources

- **@ui8kit/mdx-react README**: `packages/mdx-react/README.md`
- **@ui8kit/mdx-react AGENTS**: `packages/mdx-react/AGENTS.md`
- **@ui8kit/mdx-react Rules**: `packages/mdx-react/.cursor/rules/plugin.mdc`
- **Generator Rules**: `packages/generator/.cursor/rules/generator.mdc`
- **Renderer Rules**: `packages/render/.cursor/rules/render.mdc`
- **UI8Kit Props Rules**: `.cursor/rules/ui8kit.mdc`