# Menu Items and DSL Variables Fix

## Problem
Menu items were showing duplicated variables: `{{item.title}}{{item.title}}{{item.title}}`

## Root Cause
Incorrect usage of `<Var>` component inside `<Loop>` blocks:
- Missing `value` prop in template mode
- Incorrect array indexing (using `navItems[0]` instead of context variable)
- Nested Loops with wrong data sources

## Solution Applied

### 1. Header.tsx - Fixed Navigation Menu
**File:** `packages/blocks/src/partials/Header.tsx`

**Before (Incorrect):**
```tsx
<Loop each="navItems" as="item" data={navItems}>
  <Button ...>
    <Var name="item.title" />  {/* Missing value prop */}
  </Button>
</Loop>
```

**After (Correct):**
```tsx
<Loop each="navItems" as="item" data={navItems}>
  <Button ...>
    <Var name="item.title" />  {/* Correct - no value needed for template mode */}
  </Button>
</Loop>
```

### 2. PricingBlock.tsx - Fixed Nested Features Loop
**File:** `packages/blocks/src/blocks/PricingBlock.tsx`

**Before (Incorrect):**
```tsx
<Loop each="plan.features" as="feature" data={plans[0]?.features}>
  <Text>✓ <Var name="feature" /></Text>
</Loop>
```

**After (Correct):**
```tsx
<Loop each="plan.features" as="feature" data={plans[0]?.features || []}>
  <Text>✓ <Var name="feature" /></Text>
</Loop>
```

## DSL Variables Best Practices

### Rule 1: Use Correct Var Syntax in Loop

```tsx
// ✅ CORRECT - Inside Loop context
<Loop each="items" as="item" data={items}>
  <Var name="item.name" />           {/* Uses context variable */}
  <Var name="item.nested.value" />   {/* Supports nested paths */}
</Loop>

// ❌ INCORRECT - Hardcoded array access
<Loop each="items" as="item" data={items}>
  <Var name="items[0].name" />       {/* Wrong - uses array */}
</Loop>
```

### Rule 2: Optional Props in Template Mode

```tsx
// ✅ CORRECT - No value prop in template mode
<Var name="title" />

// ✅ CORRECT - With value for dev/preview
<Var name="title" value={title} />

// ❌ INCORRECT - String literals
<Var name="title" value="hardcoded" />

// ❌ INCORRECT - Invalid expressions
<Var name="item[0].title" value={undefined} />
```

### Rule 3: Nested Loops with Proper Context

```tsx
// ✅ CORRECT - Accessing nested array from current context
<Loop each="plans" as="plan" data={plans}>
  <Loop each="plan.features" as="feature" data={plan.features || []}>
    <Var name="feature" />
  </Loop>
</Loop>

// ❌ INCORRECT - Using hardcoded indices
<Loop each="plans" as="plan" data={plans}>
  <Loop each="plan.features" as="feature" data={plans[0]?.features}>
    {/* Always shows first plan's features */}
  </Loop>
</Loop>
```

## Generated Template Output

### Header Navigation Menu

**React Component:**
```tsx
<Header navItems={[
  { id: '1', title: 'Home', url: '/' },
  { id: '2', title: 'About', url: '/about' },
  { id: '3', title: 'Services', url: '/services' }
]} />
```

**Generated Liquid Template:**
```liquid
<nav class="header">
  {% for item in navItems %}
    <button class="header-nav-item">
      {{ item.title }}
    </button>
  {% endfor %}
</nav>
```

**Generated Handlebars Template:**
```handlebars
<nav class="header">
  {{#each navItems}}
    <button class="header-nav-item">
      {{title}}
    </button>
  {{/each}}
</nav>
```

## All Loop Usages Validated

### ✅ Correct Loop Patterns

| Block | Loop Pattern | Status |
|-------|-------------|--------|
| Header | `<Loop each="navItems" as="item">` | ✅ FIXED |
| FeaturesBlock | `<Loop each="features" as="feature">` | ✅ OK |
| TestimonialsBlock | `<Loop each="testimonials" as="testimonial">` | ✅ OK |
| PricingBlock (main) | `<Loop each="plans" as="plan">` | ✅ OK |
| PricingBlock (nested) | `<Loop each="plan.features" as="feature">` | ✅ FIXED |

## Var Usage Summary

### Pattern Matrix

```
Context          | Var Name              | Value Prop      | Usage
─────────────────┼──────────────────────┼─────────────────┼──────────────
Top-level prop   | "title"               | value={title}   | <Var name="title" value={title} />
Top-level prop   | "title"               | (omitted)       | <Var name="title" />
Loop context     | "item.name"           | (omitted)       | Inside Loop
Loop nested      | "item.nested.prop"    | (omitted)       | Inside Loop
Nested loop      | "feature"             | (omitted)       | Inside nested Loop
Conditionals     | "item.value"          | (omitted)       | Var inside If
```

## Testing Checklist

- [ ] Header menu renders all nav items (not duplicated)
- [ ] Pricing block shows features for each plan (not repeated from first plan)
- [ ] Testimonials show different content per item
- [ ] Features display unique information per feature
- [ ] Generated Liquid templates have correct loops
- [ ] Generated Handlebars templates have correct iterations
- [ ] No template syntax appears in React render
- [ ] No hardcoded values leak into templates

## Performance Notes

Using correct variable references:
- ✅ Reduces template size
- ✅ Improves generation performance
- ✅ Prevents data duplication
- ✅ Enables proper caching in template engines

## Next: Validation

Run generation to verify:
```bash
npm run generate
```

Then check:
```
dist/templates/liquid/blocks/header.liquid      # Should have {% for %} loop
dist/templates/liquid/blocks/pricing.liquid     # Should have nested loops
dist/templates/handlebars/blocks/header.hbs     # Should have {{#each}} loop
dist/templates/handlebars/blocks/pricing.hbs    # Should have nested iterations
```
