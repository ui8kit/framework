# @ui8kit/mdx-react

## Project Overview

`@ui8kit/mdx-react` is a lightweight MDX processing package for UI8Kit documentation. It provides a unified interface for compiling MDX to React components with full UI8Kit design system integration.

## Core Dependencies

- `@mdx-js/mdx@^3.1.1` - Core MDX compiler
- `@mdx-js/rollup@^3.1.1` - Vite/Rollup integration
- `@mdx-js/react@^3.1.1` - React provider and hooks
- `react@^18.0.0` & `react-dom@^18.0.0` - React runtime

## Architecture

### File Structure
```
packages/mdx-react/
├── src/
│   ├── index.ts              # Main exports
│   ├── compiler.ts           # MDX compilation logic
│   ├── vite-plugin.ts        # Vite integration
│   ├── components/           # React components
│   │   ├── ComponentExample.tsx
│   │   ├── CodeBlock.tsx
│   │   ├── PropsTable.tsx
│   │   ├── Tabs.tsx
│   │   └── Callout.tsx
│   └── utils/                # Utility functions
├── test/                     # Unit tests
├── docs/                     # Documentation
├── package.json
├── tsconfig.json
└── README.md
```

### Key Components

1. **ComponentExample** - Interactive component demos with variant switching
2. **CodeBlock** - Syntax-highlighted code blocks
3. **PropsTable** - Auto-generated component props tables
4. **Tabs** - Content organization tabs
5. **Callout** - Highlighted informational blocks

### Compilation Flow

```
MDX Source → @mdx-js/mdx → React Component → Vite → Browser
```

## Development Setup

### Prerequisites
- Node.js 16+
- Bun 1.0+ (recommended)
- ESM support

### Installation
```bash
bun install
bun run dev
```

### Build
```bash
bun run build
bun run test
```

## Integration Points

### Vite Configuration
```typescript
import mdx from '@mdx-js/rollup'

export default defineConfig({
  plugins: [
    { enforce: 'pre', ...mdx({
      providerImportSource: '@mdx-js/react',
      jsxRuntime: 'automatic'
    })},
    react()
  ]
})
```

### Usage in MDX
```mdx
import { ComponentExample } from '@ui8kit/mdx-react'
import { Button } from '@ui8kit/core'

# Component

<ComponentExample
  component={Button}
  variants={['primary', 'secondary']}
/>
```

## Design Principles

1. **UI8Kit Native** - Full design system integration
2. **Lightweight** - <50KB gzipped bundle
3. **Performant** - <100ms compilation per file
4. **Extensible** - Custom components and plugins
5. **Type Safe** - Full TypeScript support

## Testing Strategy

- **Unit tests** for individual components
- **Integration tests** for MDX compilation
- **E2E tests** for documentation rendering
- **Performance tests** for bundle size and compilation speed

## Deployment

- **NPM package** for distribution
- **ESM only** for modern bundlers
- **Tree shaking** friendly
- **Zero runtime dependencies** for core functionality