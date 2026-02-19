# Standalone checklist for `resta-app` (npmjs)

## 1) What to extract from monorepo

- [ ] Copy `resta-app/` into a new repository.
- [ ] Copy `resta-app/fixtures/` as-is (app data source).
- [ ] Keep `resta-app/ui8kit.config.json` (required by SDK validate).
- [ ] Keep `resta-app/tokens/` and `resta-app/src/css/*` (theme/tokens).

Why: app must have local content/config and no dependency on monorepo folders.

## 2) Package dependencies (no `workspace:*`)

- [ ] In `resta-app/package.json`, replace all `workspace:*` with npm versions.
- [ ] Keep runtime dependencies:
  - `@ui8kit/core` - UI primitives/components
  - `@ui8kit/dsl` - DSL runtime/helpers for blocks
  - `@ui8kit/sdk` - config/validation/data contracts
- [ ] **Dev mode without generator**: remove `@ui8kit/generator` from dependencies.

Why: standalone repo should install only published packages from npmjs.

## 3) Scripts for dev mode (without generator)

- [ ] Keep:
  - `"dev": "vite"`
  - `"build": "vite build"`
  - `"preview": "vite preview"`
  - `"validate": "bunx ui8kit-validate --cwd ."`
- [ ] Remove script `"generate"` for now.

Why: local development should not depend on scaffold/generation pipeline.

## 4) Remove monorepo aliases/paths

- [ ] In `resta-app/vite.config.ts`, keep only local alias:
  - `'@': resolve(__dirname, './src')`
- [ ] Remove aliases to `../packages/*`.
- [ ] In code, avoid imports from monorepo source paths like `@ui8kit/*/source/*` unless package explicitly supports it in npm publish.

Why: `../packages/*` does not exist outside monorepo and breaks build.

## 5) Tailwind/CSS source paths

- [ ] In `resta-app/src/css/index.css`, remove `@source` entries that reference `../../../packages/*`.
- [ ] Keep only app-local source:
  - `@source "../**/*.{ts,tsx}";`
- [ ] Optional: if needed, include `node_modules/@ui8kit/*` sources only when package docs require it.

Why: standalone repo cannot scan monorepo directories.

## 6) Publish/consume package sanity checks

- [ ] Verify every consumed UI8Kit package on npm has:
  - `dist/` in `"files"`
  - valid `main/types/exports`
  - built JS + d.ts in `dist/`
- [ ] Quick test in clean folder:
  - `bun install`
  - `bun run dev`
  - `bun run build`

Why: most “Cannot resolve module” issues come from missing `dist` or broken exports.

## 7) Recommended install strategy in monorepo (while preparing extract)

- [ ] Use `npm:` specifiers in `resta-app/package.json`:
  - example: `"@ui8kit/sdk": "npm:@ui8kit/sdk@^0.1.0"`
- [ ] This forces npm registry resolution instead of workspace linking.

Why: helps simulate real standalone behavior before moving repo.

## 8) Minimal publish command (per package)

- [ ] Build package (`bun run build`)
- [ ] Check tarball (`npm pack --dry-run` or `bun pm pack`)
- [ ] Publish (`npm publish --access public`)

Why: publish only validated artifacts to avoid broken consumers.