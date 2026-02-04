# Fixed: Var Component in Loop Contexts

## Problem Summary
Var component was rendering `{{item.title}}` as literal text in HTML instead of showing preview value.

## Root Cause Analysis

The Var component from `@ui8kit/template` has logic:
```typescript
if (value !== undefined) {
  displayValue = String(processedValue);
} else {
  displayValue = `{{${varName}}}`;  // ← Shows template syntax as text!
}
```

When `value` prop is undefined, Var outputs the template variable name as a string, which appears in the rendered HTML as:
```html
<span data-gen-var="item.title" style="display: contents;">{{item.title}}</span>
```

## Solution

Always provide `value` prop to Var component, even inside Loop. Use the first element of the array for preview:

### Pattern: Var in Loop with Value Prop

```tsx
// ✅ CORRECT - Passes first item as preview
<Loop each="items" as="item" data={items}>
  <Var name="item.title" value={items[0]?.title || ''} />
</Loop>

// ❌ WRONG - No value prop, renders template syntax
<Loop each="items" as="item" data={items}>
  <Var name="item.title" />
</Loop>
```

## Applied Fixes

### 1. Header.tsx (Navigation Menu)
```tsx
// Before
<Var name="item.title" />

// After
<Var name="item.title" value={navItems[0]?.title || ''} />
```

### 2. FeaturesBlock.tsx
```tsx
// Before
<Var name="feature.title" />
<Var name="feature.description" />

// After
<Var name="feature.title" value={features[0]?.title || ''} />
<Var name="feature.description" value={features[0]?.description || ''} />
```

### 3. TestimonialsBlock.tsx
```tsx
// Before
<Var name="testimonial.content" />
<Var name="testimonial.name" />
<Var name="testimonial.role" />
<Var name="testimonial.company" />

// After
<Var name="testimonial.content" value={testimonials[0]?.content || ''} />
<Var name="testimonial.name" value={testimonials[0]?.name || ''} />
<Var name="testimonial.role" value={testimonials[0]?.role || ''} />
<Var name="testimonial.company" value={testimonials[0]?.company || ''} />
```

### 4. PricingBlock.tsx
```tsx
// Main Loop
<Var name="plan.name" value={plans[0]?.name || ''} />
<Var name="plan.description" value={plans[0]?.description || ''} />
<Var name="plan.price" value={plans[0]?.price || ''} />
<Var name="plan.period" value={plans[0]?.period || ''} />

// Nested Loop
<Var name="feature" value={plans[0]?.features?.[0] || ''} />
```

## How It Works

### React Dev Mode (Preview)
```tsx
// Component renders with actual values
<Var name="item.title" value="Home" />
// Output: <span data-gen-var="item.title">Home</span>

// Shows first item as preview
<Var name="item.title" value={navItems[0]?.title} />
// Output: <span data-gen-var="item.title">Home</span>
```

### Template Generation (Generator)
The generator analyzes:
1. `data-gen-var` attribute → Variable name for template
2. Loop structure → Creates loop syntax
3. Context → Maintains proper scope

Generates:
```liquid
{% for item in navItems %}
  {{ item.title }}
{% endfor %}
```

## Data Attributes for Generator

Each Var component leaves markers for the generator:

```html
<!-- Simple variable -->
<span data-gen-var="title">Welcome</span>
<!-- Generator: {{ title }} -->

<!-- Nested variable in loop -->
<span data-gen-var="item.title">Home</span>
<!-- Generator: {{ item.title }} inside {% for %} loop -->

<!-- With default filter -->
<span data-gen-var="title" data-gen-default="Untitled">Welcome</span>
<!-- Generator: {{ title | default: "Untitled" }} -->

<!-- With currency filter -->
<span data-gen-var="price" data-gen-filter="currency">$29.99</span>
<!-- Generator: {{ price | currency }} -->
```

## Complete Pattern Reference

```tsx
import { Loop, Var, If } from '@ui8kit/template';

// Top-level prop with value
<Var name="title" value={title} />

// Loop context with first-item preview
<Loop each="items" as="item" data={items}>
  <Var name="item.name" value={items[0]?.name || ''} />
</Loop>

// Nested property path
<Var name="item.nested.prop" value={items[0]?.nested?.prop || ''} />

// With default value
<Var name="title" default="Untitled" value={title} />

// With filter
<Var name="price" filter="currency" value={items[0]?.price} />

// Nested loop
<Loop each="plans" as="plan" data={plans}>
  <Loop each="plan.features" as="feature" data={plans[0]?.features || []}>
    <Var name="feature" value={plans[0]?.features?.[0] || ''} />
  </Loop>
</Loop>

// Conditional with Var
<If test="title" value={!!title}>
  <Var name="title" value={title} />
</If>
```

## Validation Checklist

All Var components in Loop contexts now have:
- ✅ `name` prop with dot notation path
- ✅ `value` prop with array[0] accessor
- ✅ Fallback empty string `|| ''`
- ✅ Proper type safety with optional chaining

## Generated Output Examples

### Header Navigation
**React:**
```tsx
<Var name="item.title" value={navItems[0]?.title || ''} />
// Shows: Home (first nav item)
```

**Liquid:**
```liquid
{% for item in navItems %}
  {{ item.title }}
{% endfor %}
```

**Handlebars:**
```handlebars
{{#each navItems}}
  {{title}}
{{/each}}
```

### Features Grid
**React:**
```tsx
<Var name="feature.title" value={features[0]?.title || ''} />
// Shows: Lightning Fast (first feature)
```

**Liquid:**
```liquid
{% for feature in features %}
  {{ feature.title }}
{% endfor %}
```

## Testing

Verify in browser:
1. ✅ No `{{variable}}` text visible in UI
2. ✅ First array item shown in preview
3. ✅ Multiple items in list, but only first shows
4. ✅ `data-gen-var` attributes present

Run generation:
```bash
npm run generate
```

Check output:
```bash
cat dist/templates/liquid/blocks/header.liquid
cat dist/templates/handlebars/blocks/header.hbs
```

Should see proper loop syntax, not template variable literals.

## Performance

This approach:
- ✅ Enables live preview in dev mode
- ✅ Maintains generator markers for template generation
- ✅ Shows representative data (first item)
- ✅ Uses optional chaining for safety
- ✅ Scales to multiple items

The value prop is only for React preview; generator extracts variable names from data attributes.
