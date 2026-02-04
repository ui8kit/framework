# @ui8kit/data

Shared data fixtures for UI8Kit framework.

This package provides typed data fixtures that can be used across applications (web, engine, docs) to ensure consistency.

## Usage

```tsx
import { fixtures } from '@ui8kit/data';
import { HeroBlock } from '@ui8kit/blocks';

export function HomePage() {
  return <HeroBlock {...fixtures.hero} />;
}
```

## Structure

- `fixtures/` - JSON files with fixture data
- `types.ts` - TypeScript interfaces for each fixture

## Adding New Fixtures

1. Create a JSON file in `src/fixtures/`
2. Add corresponding TypeScript interface in `src/types.ts`
3. Import and export in `src/index.ts`
