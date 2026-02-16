# Shared Components

Components used by 2+ blocks within apps/engine.

## When to use shared vs keep in block

- **Keep in block**: Component used only by one block. Place it inside the block folder (e.g. `blocks/examples/components/ExampleTab.tsx`).
- **Extract to shared**: Component used by 2+ blocks within engine. Place here.
- **Extract to packages/blocks/components**: Component used across engine and other apps (e.g. apps/web). Place in `packages/blocks/src/components/` for reuse across the monorepo.

## Current contents

- `components/` — empty placeholder. Add shared components when duplication appears.
