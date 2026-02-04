# @ui8kit/blocks

Business blocks with DSL for UI8Kit framework.

This package contains reusable React components (blocks, layouts, partials) that use DSL components from `@ui8kit/template` for template engine generation.

## Structure

- `blocks/` - Page sections (Hero, Features, CTA, Pricing, etc.)
- `layouts/` - Page layouts (MainLayout, DashLayout, etc.)
- `partials/` - Reusable fragments (Header, Footer, Sidebar, etc.)
- `components/` - Smaller reusable components (Cards, Lists, etc.)

## Usage

```tsx
import { HeroBlock, FeaturesBlock } from '@ui8kit/blocks';
import { fixtures } from '@ui8kit/data';

export function HomePage() {
  return (
    <>
      <HeroBlock {...fixtures.hero} />
      <FeaturesBlock {...fixtures.features} />
    </>
  );
}
```

## DSL Components

All blocks use DSL components from `@ui8kit/template`:
- `<If>` - Conditional rendering
- `<Var>` - Variable interpolation
- `<Loop>` - Iteration
- `<Slot>` - Content slots

## data-class Convention

Every semantic element must have a `data-class` attribute following the pattern:
`[block-name]-[element-type]`

Example: `hero-section`, `hero-title`, `hero-cta-primary`
