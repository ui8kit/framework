# UI8Kit CSS Preprocessor

A preprocessor that generates both `tailwind.apply.css` and `ui8kit.{app}.css` by analyzing React components:

- **tailwind.apply.css**: Utility props converted to `@apply` directives (for Tailwind CSS)
- **ui8kit.{app}.css**: Utility props converted to pure CSS3 properties (Tailwind-free)

## How It Works

1. **Scans** all TypeScript/React files in your source directory
2. **Extracts** `data-class` attributes and utility props from JSX elements
3. **Generates** CSS selectors with `@apply` directives
4. **Outputs** `tailwind.apply.css` for use with Tailwind CSS

## Usage

### Generate CSS with @apply (Tailwind)
```bash
bun run css:generate
```

### Generate Pure CSS3 (Tailwind-free)
```bash
bun run css:generate:pure
```

### Generate Critical CSS for Route (Ultimate Optimization)
```bash
# Generate critical CSS for specific route
bun run css:generate:critical

# Or specify custom route:
bun packages/preprocessor/src/index.ts -- --critical-route apps/local/src/routes/MyPage.tsx
```

### Watch Mode (Development)
```bash
bun run css:watch
```

## Output Types

### Tailwind @apply CSS (tailwind.apply.css)
**Input Component:**
```tsx
<Box p="4" bg="card" data-class="main-content">
  <Text size="lg" data-class="title">Hello</Text>
</Box>
```

**Output:**
```css
.main-content {
  @apply p-4 bg-card;
}

.title {
  @apply text-lg;
}
```

### Pure CSS3 (ui8kit.{app}.css)
**Same input produces:**
```css
.main-content {
  padding: calc(var(--spacing) * 4);
  /* Unknown class: bg-card */
}

.title {
  /* Unknown class: text-lg */
}
```

**Note**: Unknown classes (theme colors, text sizes, etc.) are commented out. Only CSS properties from `ui8kit.map.ts` are converted.

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

## When to Use Each Type

### Use `tailwind.apply.css` when:
- Your project uses Tailwind CSS
- You want access to all Tailwind utilities (colors, typography, etc.)
- You need responsive design utilities
- You're building with Tailwind's design system

### Use `ui8kit.{app}.css` when:
- You want to avoid Tailwind CSS dependency
- You need pure CSS3 for static sites or other frameworks
- You want semantic CSS without utility classes
- You're building with a different CSS framework or custom styles

### Use `critical.{route}.css` when:
- You need ultimate performance optimization
- Each page/route should have only its own styles
- You're building for mobile-first or critical rendering path
- Zero unused CSS is critical for your use case
- **Performance Impact**: Up to 70% CSS size reduction per route

## Integration

**For Tailwind projects:**
```css
@import './dist/tailwind.apply.css';
```

**For pure CSS projects:**
```css
@import './dist/ui8kit.local.css';
```

**For Critical CSS (React Router):**
```tsx
import { CriticalCSSInjector } from '@/components/CriticalCSSInjector';
// Import the generated critical CSS as raw text
import criticalCSS from '../dist/critical.HomePage.css?raw';

export function HomePage() {
  return (
    <>
      {/* Inject only the CSS needed for this specific page */}
      <CriticalCSSInjector css={criticalCSS} id="homepage-critical-css" />
      <HeroBlock />
      <FeaturesBlock />
    </>
  );
}
```

**Benefits:**
- ⚡ **Faster FCP (First Contentful Paint)**
- 📱 **Better mobile performance**
- 🎯 **Zero unused CSS per route**
- 🚀 **Critical rendering path optimization**

All CSS files can be included in your build process alongside other assets.
