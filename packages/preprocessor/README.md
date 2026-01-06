# UI8Kit CSS Preprocessor

A CSS preprocessor that extracts classes from Liquid template files and generates semantic stylesheets:

- **Liquid Template Analysis**: Parses `.liquid` template files for classes and `data-class` attributes
- **Semantic Selectors**: Generates meaningful CSS selectors from `data-class` attributes
- **tailwind.apply.css**: `@apply` directives for Tailwind CSS projects
- **ui8kit.local.css**: Pure CSS3 properties for Tailwind-free projects
- **Configuration-Driven**: All paths and settings controlled by generator config

## Architecture

```
📁 packages/preprocessor/
├── tsconfig.json              # TypeScript configuration
├── package.json               # Package configuration
└── src/
    ├── html-converter.ts     # Liquid → CSS conversion
    └── index.ts              # Main orchestrator

📁 apps/local/
├── views/pages/              # Liquid template files (input)
│   ├── index.liquid          # Route templates with data-class
│   └── about.liquid
└── dist/css/                 # Generated CSS files (output)
    ├── tailwind.apply.css     # @apply directives for Tailwind
    └── ui8kit.local.css       # Pure CSS3 properties

📁 tsconfig.json               # Root TypeScript config for monorepo
```

## How It Works

1. **Parses** Liquid template files (`.liquid`) generated from React components
2. **Extracts** `data-class` attributes for semantic selectors and `class` attributes for utility classes
3. **Filters** valid Tailwind classes for `@apply` directives
4. **Generates** CSS selectors with `@apply` directives and pure CSS3 properties
5. **Outputs** `tailwind.apply.css` and `ui8kit.local.css` files

## Usage

The preprocessor is primarily used through the `@ui8kit/generator` package. For manual usage:

### Direct CLI Usage
```bash
# Generate CSS from Liquid templates
bun packages/preprocessor/src/index.ts \
  --routes /,/about \
  --snapshots-dir ./views \
  --output-dir ./dist/css \
  --pure-css \
  --verbose
```

### Programmatic Usage
```typescript
import { preprocess } from '@ui8kit/preprocessor';

await preprocess({
  routes: ['/', '/about'],
  snapshotsDir: './views',
  outputDir: './dist/css',
  pureCss: true,
  verbose: true
});
```

### Integration with Generator
The preprocessor is automatically called by the generator with proper configuration:

```typescript
// apps/local/generator.config.ts
import { generator } from '@ui8kit/generator';

const config = {
  css: {
    routes: ['/', '/about'],
    outputDir: './dist/css',
    pureCss: true
  },
  // ... other config
};

await generator.generate(config); // Calls preprocessor internally
```

## Output Types

### Tailwind @apply CSS (tailwind.apply.css)
**Input Liquid Template:**
```liquid
<div data-class="main-content" class="p-4 bg-card">
  <h1 data-class="title" class="text-lg font-bold">Hello</h1>
</div>
```

**Output:**
```css
.main-content {
  @apply p-4 bg-card;
}

.title {
  @apply text-lg font-bold;
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

- **Parser**: Regex-based Liquid template analysis
- **Extractor**: Extracts `data-class` and `class` attributes from HTML elements
- **Filter**: Validates Tailwind classes for `@apply` directives
- **Generator**: Creates semantic CSS selectors with `@apply` and pure CSS3 properties

## Supported Classes

### Tailwind Classes
The preprocessor recognizes standard Tailwind CSS utility classes:

- **Layout**: `flex`, `grid`, `block`, `hidden`, `relative`, `absolute`, etc.
- **Spacing**: `p-*`, `m-*`, `gap-*`, `space-*`, etc.
- **Colors**: `bg-*`, `text-*`, `border-*` (when defined in `ui8kit.map.json`)
- **Typography**: `text-*`, `font-*`, `leading-*`, etc.
- **Flexbox/Grid**: `items-*`, `justify-*`, `col-span-*`, etc.
- **And many more**: All standard Tailwind utilities

### Custom Classes
Classes not recognized as valid Tailwind utilities are marked as comments in the output.

## Processing Logic

### Extracted Attributes
- **`data-class`**: Used as semantic CSS selectors (e.g., `.hero-content`)
- **`class`**: Contains utility classes for `@apply` directives

### Ignored Attributes
- **`id`**, **`style`**: Not processed for CSS generation
- **`data-*`** (except `data-class`): Ignored during parsing
- **Event handlers**: `onclick`, `onchange`, etc.

### Class Filtering
- Only valid Tailwind utility classes are included in `@apply`
- Invalid classes are excluded from `@apply` output
- All classes are processed for pure CSS3 generation

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

## Migration Notes

**From v1.0 to v2.0:**
- ❌ **Removed**: Direct JSX/React component parsing
- ❌ **Removed**: HTML snapshots (`~snap/` directory)
- ✅ **Added**: Liquid template file parsing (`.liquid` files)
- ✅ **Added**: Semantic selectors from `data-class` attributes
- ✅ **Added**: Configuration-driven architecture
- ✅ **Added**: Integration with `@ui8kit/generator`

**Architecture Changes:**
- **Input**: Liquid template files instead of React components
- **Processing**: HTML attribute parsing instead of JSX prop extraction
- **Output**: Semantic CSS selectors instead of random suffixes
- **Control**: Generator config instead of hardcoded paths

**Benefits:**
- 🎯 **Semantic CSS**: `data-class` attributes create meaningful selectors
- 🔧 **Maintainable**: No more random class names like `button-BCDt2DO`
- ⚙️ **Configurable**: All paths and settings controlled by generator config
- 🚀 **Integrated**: Works seamlessly with the generator pipeline

## TypeScript Configuration

The preprocessor includes proper TypeScript configuration:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "types": ["node", "bun"],
    "strict": true
  }
}
```

## Monorepo Setup

- **Root `tsconfig.json`** - Shared TypeScript config for all packages
- **Turbo tasks** - `build`, `lint`, and `test` tasks configured
- **Workspace dependencies** - Proper module resolution across packages

## Test Results

**Input**: Liquid template file with 20 elements, semantic `data-class` attributes, and Tailwind utility classes
**Output** (generated in `apps/local/dist/css/`):
- **tailwind.apply.css**: 1,063 bytes, 15 semantic `@apply` rules
- **ui8kit.local.css**: 2,254 bytes, 47 CSS properties

**Sample Generated CSS**:
```css
/* tailwind.apply.css - Semantic selectors from data-class */
.hero-content {
  @apply flex flex-col gap-4 items-center;
}

.hero-title {
  @apply text-4xl font-bold;
}

.hero-description {
  @apply text-lg text-muted-foreground;
}

/* ui8kit.local.css - Pure CSS3 with fallbacks */
.hero-content {
  display: flex;
  flex-direction: column;
  gap: calc(var(--spacing) * 4);
  align-items: center;
}

.hero-title {
  font-size: var(--text-4xl);
  font-weight: 700;
}

.hero-description {
  font-size: var(--text-lg);
  color: hsl(var(--muted-foreground));
}
```

All CSS files can be included in your build process alongside other assets.
