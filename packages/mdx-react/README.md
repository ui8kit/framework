# @ui8kit/mdx-react

MDX processing package for UI8Kit documentation with two modes:

- **Dev Mode** — Vite runtime with HMR for interactive component previews
- **Build Mode** — Generate Liquid templates and HTML for production

## Philosophy

```
UI8Kit = shadcn tokens + mantine props + spectre CSS-first
```

One source → React / Liquid / Pure HTML with identical design.
Zero JavaScript for interactivity (CSS-only toggles via `<details>`).

## Installation

```bash
bun add @ui8kit/mdx-react
```

## Configuration

### In generator.config.ts (Build Mode)

```ts
import type { GeneratorConfig } from '@ui8kit/generator'

export const config: GeneratorConfig = {
  app: { name: 'UI8Kit Docs' },
  
  html: {
    mode: 'semantic', // 'tailwind' | 'semantic' | 'inline'
    // ...
  },
  
  mdx: {
    enabled: true,
    docsDir: './docs',
    outputDir: './views/pages/docs',
    demosDir: './views/partials/demos',
    navOutput: './dist/docs-nav.json',
    basePath: '/docs',
    
    components: {
      Button: '@/components/ui/Button',
      Card: '@/components/Card',
    },
    
    propsSource: './src/components',
  },
}
```

### In vite.config.ts (Dev Mode)

```ts
import { mdxPlugin } from '@ui8kit/mdx-react/vite'
import react from '@vitejs/plugin-react-swc'

export default {
  plugins: [
    mdxPlugin(),
    react(),
  ],
}
```

## Documentation Components

### ComponentPreview

Shadcn-style interactive preview with CSS-only code toggle:

```mdx
<ComponentPreview title="Button Variants">
  <Button variant="primary">Primary</Button>
  <Button variant="secondary">Secondary</Button>
</ComponentPreview>
```

### PropsTable

Auto-generated props documentation from TypeScript:

```mdx
<PropsTable component="Button" />
```

### Callout

Info/warning/error boxes:

```mdx
<Callout type="warning" title="Deprecation Notice">
  This API will be removed in v2.0
</Callout>
```

### Steps

Step-by-step guides:

```mdx
<Steps>
  Install the package
  Import the component
  Use in your code
</Steps>
```

## Build Output

### HTML Modes

| Mode | Output |
|------|--------|
| `tailwind` | `class="flex gap-4"` + `data-class="preview"` |
| `semantic` | `class="preview"` (data-class → class) |
| `inline` | `class="preview"` + `<style>` CSS inlined |

### Generated Files

```
views/pages/docs/
├── index.liquid
├── components/
│   ├── button.liquid
│   └── card.liquid

views/partials/demos/
├── button-0.liquid
├── button-1.liquid

dist/
├── docs-nav.json
└── props-data.json
```

## Exports

### Main (`@ui8kit/mdx-react`)

- `defineConfig()` — Create typed MDX config
- `usePageContent()`, `useToc()`, `useFrontmatter()` — React hooks
- `ComponentPreview`, `PropsTable`, `Callout`, `Steps` — Doc components
- `parseFrontmatter()`, `extractToc()`, `scanDocsTree()` — Utilities

### Generator (`@ui8kit/mdx-react/generator`)

- `generateDocsFromMdx()` — Main generator function
- `compileMdxFile()` — Compile single MDX file
- `generatePropsData()` — Extract props from TypeScript

### Vite (`@ui8kit/mdx-react/vite`)

- `mdxPlugin()` — Vite plugin for dev mode

### Core (`@ui8kit/mdx-react/core`)

- All types and utilities

## License

MIT
