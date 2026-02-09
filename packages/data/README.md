# @ui8kit/data

Shared data fixtures and unified context for UI8Kit framework.

This package provides typed fixtures and a single `context` object used by engine templates and apps. Use it so that copied-generated templates work out of the box: install `@ui8kit/data`, point routes at `context`, run.

## Usage

**Unified context (recommended for apps using engine-generated templates):**

```tsx
import { context } from '@ui8kit/data';
import { MainLayout } from '@/layouts';
import { HeroBlock, FeaturesBlock } from '@ui8kit/blocks';

export function WebsitePage() {
  return (
    <MainLayout
      navItems={context.navItems}
      sidebar={<SidebarContent title="Quick Links" links={context.sidebarLinks} />}
      headerTitle={context.site.title}
      headerSubtitle={context.site.subtitle}
    >
      <HeroBlock {...context.hero} />
      <FeaturesBlock {...context.features} />
    </MainLayout>
  );
}
```

**Typing:** Import `AppContext` from `@ui8kit/data` when you need to type your own context object to match the expected shape.

**Legacy fixtures (deprecated):**

```tsx
import { fixtures } from '@ui8kit/data';
import { HeroBlock } from '@ui8kit/blocks';

export function HomePage() {
  return <HeroBlock {...fixtures.hero} />;
}
```

## Structure

- `fixtures/` — JSON files with fixture data
- `types.ts` — TypeScript interfaces (`NavItem`, `HeroFixture`, `AppContext`, etc.)
- `context` — Single export: `{ site, navItems, sidebarLinks, dashboardSidebarLinks, hero, features, pricing, testimonials, cta, dashboard }`

## Adding New Fixtures

1. Create a JSON file in `src/fixtures/`
2. Add corresponding TypeScript interface in `src/types.ts`
3. Add the fixture to `context` and to `AppContext` in `src/index.ts` and `src/types.ts`
