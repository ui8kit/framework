# @ui8kit/render

A specialized React static renderer for UI8Kit framework that converts React components to HTML with semantic `data-class` attributes for static site generation.

## Overview

This package provides utilities for rendering React components to static HTML markup during build time, specifically designed for the UI8Kit component system. It parses router configurations and renders components directly without context providers.

## Installation

```bash
# As a dependency in your monorepo
bun add @ui8kit/render
```

## Peer Dependencies

This package requires React and React Router DOM as peer dependencies:

```json
{
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0",
    "react-router-dom": "^6.0.0 || ^7.0.0"
  }
}
```

## API

### `renderRoute(options: RenderOptions): Promise<string>`

Renders a specific route to HTML by parsing the router configuration from an entry file.

```typescript
import { renderRoute } from '@ui8kit/render';

const html = await renderRoute({
  entryPath: './src/main.tsx',  // Path to router configuration
  routePath: '/'                // Route to render
});
```

**Parameters:**
- `entryPath`: Path to the main entry file containing router configuration
- `routePath`: Route path to render (e.g., '/', '/about')

**Returns:** HTML string with `data-class` attributes

### `renderComponent(options: RenderComponentOptions): Promise<string>`

Renders a single React component export to static HTML.

```typescript
import { renderComponent } from '@ui8kit/render';

const html = await renderComponent({
  modulePath: './src/components/Header.tsx',
  exportName: 'Header',  // Optional, uses default export if omitted
  props: { title: 'Welcome' }  // Optional props
});
```

**Parameters:**
- `modulePath`: Absolute or relative path to the component module
- `exportName`: Named export to render (optional, uses default export if omitted)
- `props`: Props to pass to the component (optional)

**Returns:** HTML string with `data-class` attributes

### `Renderer` Class

For advanced usage, you can instantiate the Renderer class directly:

```typescript
import { Renderer } from '@ui8kit/render';

const renderer = new Renderer();
const html = await renderer.renderRouteToHtml({
  entryPath: './src/main.tsx',
  routePath: '/about'
});
```

## Router Configuration Requirements

The renderer expects router configuration in a specific format using `createBrowserRouter` with a `children` array:

```typescript
// main.tsx
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter({
  children: [
    { index: true, element: <HomePage /> },
    { path: 'about', element: <AboutPage /> },
    { path: 'contact', element: <ContactPage /> }
  ]
});
```

## Component Requirements

Components must be designed for static rendering:

- **No context dependencies** during static generation (components are rendered directly without providers)
- **Semantic `data-class` attributes** for CSS generation
- **Optional context usage** with fallbacks:

```typescript
// ✅ Safe for static rendering
export function Component() {
  const theme = useTheme?.() ?? defaultTheme;  // Fallback provided
  return <div data-class="component">{theme.name}</div>;
}

// ❌ Will fail during static rendering
export function Component() {
  const { theme } = useTheme();  // No fallback, throws error
  return <div>{theme.name}</div>;
}
```

## Import Path Resolution

The renderer supports relative import paths:

- `@/` aliases (resolved relative to entry file directory)
- `./` and `../` relative imports
- File extensions: `.tsx`, `.ts`, `.jsx`, `.js`
- Index files: `index.tsx`, `index.ts`, etc.

## Use Cases

- **Static Site Generation**: Generate HTML pages from React routes
- **Component-to-HTML Conversion**: Convert individual components to markup
- **CSS Generation Pipeline**: Extract classes from rendered HTML for stylesheet generation

## Limitations

- Requires specific router configuration format
- No support for context providers during rendering
- Limited import path resolution (relative paths only)
- Designed specifically for UI8Kit component system

## Development

```bash
# Type checking
bun run typecheck

# Linting
bun run lint

# Testing
bun run test
```

## Architecture Notes

This renderer is part of the UI8Kit static generation pipeline:

1. **Route Parsing**: Extracts routes from `createBrowserRouter` configuration
2. **Component Loading**: Dynamically imports and renders React components
3. **HTML Generation**: Produces static markup with semantic `data-class` attributes
4. **CSS Extraction**: Generated HTML is used to extract utility classes for stylesheet generation