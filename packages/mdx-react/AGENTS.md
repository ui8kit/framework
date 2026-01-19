# @ui8kit/mdx-react — Agent Development Guide

## Quick Context

`@ui8kit/mdx-react` is a **dual-mode MDX processor**:

- **Dev Mode** (Vite runtime) — Interactive MDX with HMR for component testing
- **Build Mode** (Node.js) — Static HTML generation for production

**Key principle:** Docs-first routing (no config needed, filesystem defines routes)

## Architecture Overview

```
docs/ folder structure → routes
├── docs/index.mdx                    → /
├── docs/components/index.mdx         → /components
├── docs/components/button.mdx        → /components/button
```

**Dev:** Vite loads MDX with `import.meta.glob` → React Router → DocsPage displays content
**Build:** Generator scans `docs/`, generates HTML to `dist/html/`

## File Organization

```
packages/mdx-react/
├── src/
│   ├── index.ts                      # Main exports (browser-safe)
│   ├── server.ts                     # Node.js-only exports
│   ├── config.ts                     # defineConfig helper
│   ├── context/
│   │   └── PageContext.tsx           # React context for frontmatter/TOC
│   ├── components/
│   │   ├── ComponentPreview.tsx      # Shadcn-style preview
│   │   ├── PropsTable.tsx            # Auto-generated props
│   │   ├── Callout.tsx               # Info/warning boxes
│   │   └── Steps.tsx                 # Step-by-step guides
│   ├── core/
│   │   ├── types.ts                  # Type definitions
│   │   ├── parser.ts                 # MDX parsing (browser-safe)
│   │   ├── slugify.ts                # URL slug generation
│   │   └── scanner.ts                # Filesystem scanning (Node.js only)
│   ├── generator/
│   │   ├── index.ts                  # Main generator entry
│   │   ├── mdx-compiler.ts           # MDX to HTML compilation
│   │   ├── liquid-emitter.ts         # Liquid template generation
│   │   ├── nav-generator.ts          # Navigation JSON generation
│   │   └── props-extractor.ts        # TypeScript props parsing
│   └── vite/
│       └── plugin.ts                 # Vite plugin for dev
└── test/
    ├── setup.ts                      # Test environment setup
    └── *.test.ts                     # Unit tests
```

## Key Concepts

### 1. Docs-First Routing

No route config needed — filesystem structure IS the routing:

```
Input:  docs/components/button.mdx
→ /components/button
→ https://example.com/components/button
```

**Implementation:**
- Dev: DocsPage uses pathname to construct MDX path, loads with glob
- Build: Generator scans docs folder, generates HTML with matching structure

### 2. Browser vs. Node.js Code Separation

**CRITICAL:** Strict separation prevents Node.js APIs from being bundled for browser

```typescript
// ✅ index.ts (browser-safe, exported to main)
export { parseFrontmatter, extractToc }  // No fs, no dynamic imports

// ✅ server.ts (Node.js only, exported via /server)
export { scanDocsTree, generateDocsFromMdx }  // Can use fs, import()

// ❌ NOT in index.ts
export { scanDocsTree }  // Would fail: "node:fs/promises" not available
```

**Vite config enforces this:**
```typescript
optimizeDeps: {
  exclude: ['@ui8kit/mdx-react/server']  // Don't bundle server code
}
```

### 3. Frontmatter in MDX

Every MDX file starts with YAML:

```mdx
---
title: Button Component
description: Action button with variants
order: 1
---
```

**Used for:**
- Page title (HTML `<title>`)
- SEO description
- Sidebar ordering
- Navigation generation

### 4. Tree of Contents (TOC)

Automatically extracted from headings:

```mdx
# Button Component    → skipped (h1 is title)

## Basic Usage        → TOC entry
### Live Example      → TOC entry
```

Generated as `{ depth, text, slug }` and available via `useToc()` hook

## Development Tasks

### When Modifying Generator

**Goal:** Generate HTML pages from MDX files in `docs/` folder

**Current flow:**
1. Generator reads config from `generator.config.ts`
2. Calls `generateMdxDocs()` from `packages/generator/src/generator.ts`
3. Scanner finds all `.mdx` files in `docsDir`
4. For each file:
   - Parse frontmatter
   - Generate placeholder HTML
   - Write to `outputDir/path/index.html`
5. Generate navigation JSON

**If fixing path issues:**
- Use `path.relative()` for cross-platform paths
- Handle `/` → `index.html` mapping
- Preserve `/components` → `/components/index.html` structure

**If adding new features:**
- Scanner finds files: `scanMdxFiles(dir)`
- Convert to URLs: `mdxFileToUrl(relativePath, basePath)`
- Get output paths: `urlToOutputPath(urlPath, outputDir)`
- Generate content: `generateMdxPlaceholder(mdxPath, outputPath, urlPath)`

### When Modifying Dev Mode (DocsPage)

**Goal:** Load MDX dynamically and render with metadata

**Key patterns:**
```typescript
// 1. Load all MDX files
const mdxModules = import.meta.glob<MdxModule>('../../docs/**/*.mdx')

// 2. Convert pathname to module path
function getMdxPath(pathname: string): string {
  if (pathname === '/') return '../../docs/index.mdx'
  if (modules[`../../docs/${pathname}.mdx`]) return `../../docs/${pathname}.mdx`
  if (modules[`../../docs/${pathname}/index.mdx`]) return `../../docs/${pathname}/index.mdx`
  return null  // 404
}

// 3. Load module dynamically
const loader = mdxModules[mdxPath]
const { default: Content, frontmatter, toc } = await loader()

// 4. Provide to context
<PageContentProvider content={Content} frontmatter={frontmatter} toc={toc}>
  <DocsLayout />  // Can now use usePageContent(), useToc(), etc.
</PageContentProvider>
```

### When Modifying Components

**Rules:**
- Use `forwardRef` for consistent ref forwarding
- Include `displayName` for debugging
- Provide `data-class` attributes for semantic CSS
- Support both `className` and `data-class` rendering

**Example:**
```typescript
export const ComponentPreview = forwardRef<HTMLDivElement, ComponentPreviewProps>(
  ({ children, title, variant = 'default', className, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('component-preview', `component-preview-${variant}`, className)}
        data-class="component-preview"
        {...rest}
      >
        {title && <h3 data-class="component-preview-title">{title}</h3>}
        <div data-class="component-preview-content">
          {children}
        </div>
      </div>
    )
  }
)
ComponentPreview.displayName = 'ComponentPreview'
```

## Common Issues

### Issue: `Cannot access "node:fs/promises" in client code`

**Cause:** Node.js code imported into browser bundle

**Fix:** Move function to `server.ts`, export via `/server` entry

```typescript
// ❌ Wrong - in index.ts
export async function scanDocs() {
  const files = await readdir('./docs')  // ERROR: fs not available in browser
}

// ✅ Right - in server.ts
export async function scanDocs() {
  const files = await readdir('./docs')  // OK: only runs in Node.js
}
```

### Issue: MDX files not found in dev mode

**Cause:** Path mismatch or glob pattern issue

**Debug:**
```typescript
console.log('Available MDX paths:', Object.keys(mdxModules))
console.log('Looking for:', mdxPath)
```

**Common mismatches:**
- Windows paths use `\`, glob expects `/`
- Glob pattern must match exactly (including `../../`)
- Trailing/leading slashes matter

### Issue: `data-class` not appearing in output

**Cause:** Generator stripping attributes

**Check:** `generator.config.ts` mode setting
- `tailwind`: keeps both `class` and `data-class`
- `semantic`: only keeps `data-class` (renamed to `class`)
- `inline`: semantic + inlines CSS

## Typical Workflows

### Adding a New Documentation Page

1. Create `docs/new-feature/index.mdx`
2. Add frontmatter with `title`, `description`, `order`
3. Write content with markdown + JSX
4. Dev: Auto-loads via glob, accessible at `/new-feature`
5. Build: `bun run generate` creates `/new-feature/index.html`

### Modifying Component Behavior

1. Edit component file in `src/components/`
2. Update types in `src/core/types.ts` if needed
3. Add/update tests in `test/`
4. Run `bun run test` to verify
5. Rebuild: `bun run build`

### Debugging Build Output

1. Run `bun run generate`
2. Check `dist/html/` for generated files
3. Check `dist/docs-nav.json` for navigation
4. Open `dist/html/index.html` in browser
5. Check console for warnings/errors

## Testing Strategy

**Unit tests** for:
- Parser functions (frontmatter, TOC extraction)
- Slugify utility
- Component rendering

**Integration tests** for:
- MDX compilation
- File scanning
- Path generation

**Running tests:**
```bash
bun run test              # All tests
bun run test:watch       # Watch mode
bun test -- ComponentPreview  # Specific file
```

## Performance Notes

- Dev: `import.meta.glob` is fast (instant after first load)
- Build: Scanner is O(n) where n = number of MDX files
- Frontmatter parsing: regex-based, very fast
- MDX compilation: placeholder generation is fast (no rendering yet)

**Optimization opportunities:**
- Cache parsed frontmatter
- Parallel file scanning
- Incremental generation (only changed files)

## Resources

- **@mdx-js/mdx** — MDX compiler reference
- **Vite** — Module loading with `import.meta.glob`
- **AGENTS.md** — Main project guidelines
- **README.md** — User-facing documentation
- **generator.ts** — Generator implementation

## Key Files to Know

| File | Purpose |
|------|---------|
| `src/index.ts` | Main public API (browser-safe) |
| `src/server.ts` | Node.js-only exports |
| `src/context/PageContext.tsx` | React context for page metadata |
| `src/components/` | Doc components (ComponentPreview, PropsTable, etc.) |
| `src/generator/index.ts` | Main generator entry point |
| `packages/generator/src/generator.ts` | Static site generator (calls mdx generator) |
| `apps/local/src/routes/DocsPage.tsx` | Dev-time route handler |
| `apps/local/generator.config.ts` | Generator configuration |

## When to Switch to Plan Mode

Use Plan Mode when:
- Adding new export points (requires careful bundling strategy)
- Redesigning generator pipeline (large scope)
- Changing router implementation (impacts dev + build)
- Uncertain about architecture approach

Stay in Agent Mode for:
- Bug fixes
- Component updates
- Minor feature additions
- Documentation changes
