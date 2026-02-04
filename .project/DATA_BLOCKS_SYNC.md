# Data and Blocks Synchronization

This document outlines the synchronization between blocks, types, and fixtures in the UI8Kit framework.

## Synchronization Pattern

Each block must have a corresponding:
1. **Block Component** (`@ui8kit/blocks/src/blocks/[Name]Block.tsx`)
2. **Block Props Interface** (in the same file or exported separately)
3. **Fixture Type** (`@ui8kit/data/src/types.ts`)
4. **Fixture Data** (`@ui8kit/data/src/fixtures/[name].json`)
5. **Fixture Export** (`@ui8kit/data/src/index.ts`)

## Example: HeroBlock

### 1. Block Component & Props
**File:** `packages/blocks/src/blocks/HeroBlock.tsx`
```tsx
export interface HeroBlockProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaUrl?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  backgroundImage?: string;
  children?: React.ReactNode;
}

export function HeroBlock(props: HeroBlockProps) { ... }
```

### 2. Fixture Type
**File:** `packages/data/src/types.ts`
```tsx
export interface HeroFixture {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaUrl?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  backgroundImage?: string;
}
```

### 3. Fixture Data
**File:** `packages/data/src/fixtures/hero.json`
```json
{
  "title": "Welcome to UI8Kit",
  "subtitle": "The next generation UI framework...",
  "ctaText": "Get Started",
  "ctaUrl": "/docs/getting-started",
  "secondaryCtaText": "Learn More",
  "secondaryCtaUrl": "/about"
}
```

### 4. Fixture Export
**File:** `packages/data/src/index.ts`
```tsx
import hero from './fixtures/hero.json';

export const fixtures = {
  hero: hero as import('./types').HeroFixture,
  // ...
};
```

### 5. Usage in Routes
**File:** `apps/web/src/routes/HomePage.tsx`
```tsx
import { HeroBlock } from '@ui8kit/blocks';
import { fixtures } from '@ui8kit/data';

export function HomePage() {
  return <HeroBlock {...fixtures.hero} />;
}
```

## Current Blocks and Fixtures

### Blocks with Full Synchronization ✅

| Block | Props Interface | Type | Fixture Data | Usage |
|-------|-----------------|------|--------------|-------|
| HeroBlock | HeroBlockProps | HeroFixture | hero.json | HomePage |
| FeaturesBlock | FeaturesBlockProps | FeaturesFixture | features.json | HomePage |
| CTABlock | CTABlockProps | CTAFixture | cta.json | HomePage |
| PricingBlock | PricingBlockProps | PricingFixture | pricing.json | - |
| TestimonialsBlock | TestimonialsBlockProps | TestimonialsFixture | testimonials.json | - |
| DashboardBlock | DashboardBlockProps | DashboardFixture | dashboard.json | Blank |

### Layouts

| Layout | Props Interface | Usage |
|--------|-----------------|-------|
| MainLayout | MainLayoutProps | App.tsx wrapper |
| DashLayout | DashboardProps | - |

## Validation Checklist

When adding a new block:

- [ ] Create Block component in `packages/blocks/src/blocks/[Name]Block.tsx`
- [ ] Define `[Name]BlockProps` interface with all props
- [ ] Export `[Name]Block` function
- [ ] Add `[Name]Fixture` interface to `packages/data/src/types.ts`
- [ ] Create `packages/data/src/fixtures/[name].json` with sample data
- [ ] Add fixture to `fixtures` object in `packages/data/src/index.ts`
- [ ] Create route or component using `blocks` and `fixtures`
- [ ] Verify types match between Block, Fixture Type, and JSON data

## Type Safety Rules

1. **All optional props** should use `?:` in both interface and JSON
2. **JSON data** should NOT include undefined values
3. **Props with defaults** should be clearly documented
4. **Complex types** (arrays, objects) should be fully typed
5. **DSL components** (Var, If, Loop) should match prop names

## Common Issues

### Issue: Type Mismatch
```
Error: Type has no properties in common
```

**Solution:** Ensure fixture type matches block props interface exactly.

### Issue: Missing Property
```
Error: Property 'widgets' is missing
```

**Solution:** Check that fixture type and JSON data have the same structure.

### Issue: Import Error
```
Error: Cannot find module
```

**Solution:** Ensure fixture is exported in `packages/data/src/index.ts`

## DSL Component Integration

All blocks use DSL components for template generation:

```tsx
import { If, Var, Loop, Slot } from '@ui8kit/template';

// Conditional rendering
<If test="title" value={!!title}>
  <Var name="title" value={title} />
</If>

// Iteration
<Loop each="items" as="item" data={items}>
  <Var name="item.name" />
</Loop>

// Content slots
<Slot name="extra">{children}</Slot>
```

These components enable:
- Consistent rendering in React and generated templates
- Proper variable extraction for template generation
- Type-safe data binding

## Building New Blocks

### Step 1: Define Props
```tsx
export interface MyBlockProps {
  title?: string;
  content?: string;
  // ...
}
```

### Step 2: Implement with DSL
```tsx
export function MyBlock({ title, content }: MyBlockProps) {
  return (
    <Block component="section" data-class="my-section">
      <If test="title" value={!!title}>
        <Title data-class="my-title">
          <Var name="title" value={title} />
        </Title>
      </If>
      {/* ... */}
    </Block>
  );
}
```

### Step 3: Add Fixture Type
```tsx
export interface MyFixture {
  title?: string;
  content?: string;
  // ...
}
```

### Step 4: Add Fixture Data
```json
{
  "title": "Example Title",
  "content": "Example content"
}
```

### Step 5: Export Fixture
```tsx
import myFixture from './fixtures/my.json';

export const fixtures = {
  // ...
  my: myFixture as import('./types').MyFixture,
};
```

### Step 6: Use in Route
```tsx
import { MyBlock } from '@ui8kit/blocks';
import { fixtures } from '@ui8kit/data';

export function MyPage() {
  return <MyBlock {...fixtures.my} />;
}
```

## Maintenance

- Keep fixture types in sync with block props
- Update JSON fixtures when props change
- Use TypeScript strict mode to catch type errors early
- Run type checking: `npm run typecheck`
- Validate before generation: `npm run lint`
