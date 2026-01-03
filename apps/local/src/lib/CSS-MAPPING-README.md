# UI8Kit CSS Mapping System

## Overview

UI8Kit provides a complete CSS mapping system that converts UI8Kit utility classes to their corresponding CSS properties. This enables static HTML generation without JavaScript runtime dependencies.

## Generated Files

- **`all-ui8kit-classes.json`** - Array of all 556 UI8Kit class names
- **`ui8kit-css-mapping.json`** - Complete mapping of classes to CSS properties
- **`ui8kit-css-utils.ts`** - API utilities for working with CSS mappings

## API Usage

### Import utilities
```typescript
import {
  classToCss,
  classesToCss,
  hasCssMapping,
  generateStyleAttribute
} from './ui8kit-css-utils';
```

### Get CSS for single class
```typescript
// Your border-r-0 example
const css = classToCss('border-r-0');
// Result: "border-right-width: 0px;"

const textCss = classToCss('text-center');
// Result: "text-align: center;"

const complexCss = classToCss('truncate');
// Result: "overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
```

### Get CSS for multiple classes
```typescript
const combinedCss = classesToCss('border-r-0 text-center p-4 bg-primary');
// Result: "border-right-width: 0px; text-align: center; padding: 1rem; background-color: hsl(var(--primary));"
```

### Generate HTML style attributes
```typescript
const styleAttr = generateStyleAttribute('border-r-0 text-center');
// Result: "border-right-width: 0px; text-align: center;"

// Use in HTML generation
const html = `<div style="${styleAttr}">Content</div>`;
// Result: <div style="border-right-width: 0px; text-align: center;">Content</div>

// Grid examples (your question!)
const gridContainerCss = generateStyleAttribute('grid grid-cols-3 grid-rows-4 gap-4');
// Result: "display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-template-rows: repeat(4, minmax(0, 1fr)); gap: 1rem;"

const gridItemCss = generateStyleAttribute('col-span-2 row-start-1');
// Result: "grid-column: span 2 / span 2; grid-row-start: 1;"
```

### Check mapping availability
```typescript
const hasMapping = hasCssMapping('border-r-0');
// Result: true

const missingMapping = hasCssMapping('unknown-class');
// Result: false (with console warning)
```

## Static HTML Generation Example

```typescript
function generateStaticHTML() {
  // UI8Kit classes from your component
  const headerClasses = 'text-4xl font-bold text-center mb-8';
  const cardClasses = 'bg-card p-6 rounded-lg shadow-md border';

  // Convert to CSS
  const headerCss = generateStyleAttribute(headerClasses);
  const cardCss = generateStyleAttribute(cardClasses);

  // Generate HTML
  return `
    <div class="container mx-auto p-4">
      <h1 style="${headerCss}">Welcome to UI8Kit</h1>
      <div style="${cardCss}">
        <p>This card has no JavaScript dependencies!</p>
      </div>
    </div>
  `;
}
```

## CSS Mapping Coverage

### ✅ Fully Mapped Categories
- **Layout**: `absolute`, `relative`, `flex`, `grid`, etc.
- **Spacing**: `p-4`, `m-2`, `px-8`, `gap-6`, etc.
- **Colors**: `bg-primary`, `text-center`, `border-destructive`, etc.
- **Typography**: `text-lg`, `font-bold`, `leading-relaxed`, etc.
- **Borders**: `border`, `border-r-0`, `border-t-2`, `rounded-lg`, etc.
- **Shadows**: `shadow-md`, `shadow-lg`, etc.
- **Overflow**: `overflow-auto`, `truncate`, etc.
- **Grid System**:
  - **Grid containers**: `grid-cols-4`, `grid-rows-3`, `grid-flow-row-dense`
  - **Grid items**: `col-span-2`, `row-start-1`, `col-end-4`
  - **Auto sizing**: `auto-cols-fr`, `auto-rows-auto`
  - **CSS Output**: `grid-template-columns: repeat(4, minmax(0, 1fr))` for `grid-cols-4`
  - **Complete coverage**: All 556 classes mapped to CSS, including complex grid layouts

### 🎨 CSS Variables
UI8Kit uses CSS custom properties for theme colors:
```css
/* These map to your design system */
--primary: 221.2 83.2% 53.3%;
--muted: 210 40% 98%;
/* etc... */
```

### 🔧 Regenerating Mappings

To regenerate mappings after adding new utility classes:

```bash
# Regenerate all mappings
cd apps/local/src/lib
bun run generate-css-mapping.ts

# Check results
grep '"your-new-class"' ui8kit-css-mapping.json
```

## Integration with Static Generators

### Using in `@ui8kit/create-html`

```typescript
// In your HTML generation script
import { generateStyleAttribute } from './ui8kit-css-utils';

function convertComponentToHtml(componentClasses: string[]): string {
  const css = generateStyleAttribute(componentClasses.join(' '));
  return `<div style="${css}">${content}</div>`;
}
```

### Performance Benefits

- **Zero runtime**: No JavaScript needed for styling
- **SEO friendly**: Search engines see styled content immediately
- **Fast loading**: No CSS-in-JS overhead
- **Static hosting**: Works on any static hosting service

## Troubleshooting

### Class has no mapping?
```typescript
// Check if class exists
const exists = hasCssMapping('your-class');

// If false, add mapping to generate-css-mapping.ts
// Then regenerate: bun run generate-css-mapping.ts
```

### Need custom CSS?
```typescript
// For custom styles not in utility-props.map.ts
<div className="custom-style" data-class="my-custom-component">
  Content
</div>

// In CSS mapping, this becomes semantic data attribute
// data-class="my-custom-component"
```

This system enables true static HTML generation while maintaining the developer experience of utility-first CSS frameworks.
