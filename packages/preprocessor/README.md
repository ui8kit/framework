# UI8Kit CSS Preprocessor

A preprocessor that generates `tailwind.apply.css` by analyzing React components and converting utility props to CSS `@apply` directives.

## How It Works

1. **Scans** all TypeScript/React files in your source directory
2. **Extracts** `data-class` attributes and utility props from JSX elements
3. **Generates** CSS selectors with `@apply` directives
4. **Outputs** `tailwind.apply.css` for use with Tailwind CSS

## Usage

### Generate CSS Once
```bash
bun run css:generate
```

### Watch Mode (Development)
```bash
bun run css:watch
```

## Example

**Input Component:**
```tsx
<Box p="4" bg="card" data-class="main-content">
  <Text size="lg" data-class="title">Hello</Text>
</Box>
```

**Output CSS:**
```css
.main-content {
  @apply p-4 bg-card;
}

.title {
  @apply text-lg;
}
```

## Architecture

- **Parser**: Regex-based JSX analysis (no TypeScript AST for simplicity)
- **Extractor**: Filters utility props from component attributes
- **Generator**: Creates CSS with `@apply` directives
- **Watcher**: File system watcher for automatic regeneration

## Utility Props

Only props defined in `utility-props.map.ts` are converted to CSS classes:

- Layout: `flex`, `grid`, `block`, `hidden`, etc.
- Spacing: `p`, `m`, `gap`, etc.
- Colors: `bg`, `text`, `border`, etc.
- Typography: `font`, `text`, `leading`, etc.
- And many more...

## Excluded Props

The following props are ignored during CSS generation:
- `data-class`, `data-role` (used for selectors)
- `className` (handled separately)
- `component`, `children`, `key`, `ref` (React-specific)

## Integration

Add the generated CSS to your Tailwind configuration:

```css
@import './dist/tailwind.apply.css';
```

Or include it in your build process alongside other CSS files.
