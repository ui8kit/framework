# AGENTS Guide (RestA Sample App)

This guide is the default instruction set for AI agents working on `resta-app`.

It reflects the current SDK-first architecture and restaurant domain goals.

## 1) Project Goal

Build a restaurant-themed sample application in English with these sections:

- Landing page (home)
- Menu (dish cards)
- Recipes (article-style recipe pages)
- Blog
- Promotions
- Admin area (local JSON import/export only; no backend required now)

Theme switching (light/dark) is required.

## 2) Architecture Model (SDK-first)

`resta-app` is a brand sample that validates SDK workflows.

Use this model:

- DSL source lives in app-local code:
  - `src/blocks/*`
  - `src/layouts/*`
  - `src/partials/*`
- Brand data lives in app-local fixtures:
  - `fixtures/*`
- Brand tokens live in:
  - `tokens/resta.css`
- Project config lives in:
  - `ui8kit.config.json`
- Build output goes to:
  - `dist/react` (or other configured out dir)

## 3) SDK Imports and Compatibility

In this repository (workspace mode), prefer SDK source imports:

- `@ui8kit/sdk/source/config`
- `@ui8kit/sdk/source/validate`
- `@ui8kit/sdk/source/build`
- `@ui8kit/sdk/source/data`

For published-package mode outside this monorepo, equivalent imports can use:

- `@ui8kit/sdk/config`
- `@ui8kit/sdk/validate`
- `@ui8kit/sdk/data`

Do not add new dependencies on `@ui8kit/data/fixtures/*` for this app.

## 4) Route and Domain Mapping (Restaurant)

Use these routes as source of truth for this sample:

| Route            | Domain Key  | Fixture File      | Context Key                |
|------------------|-------------|-------------------|----------------------------|
| `/`              | landing     | landing.json      | context.landing            |
| `/menu`          | menu        | menu.json         | context.menu               |
| `/recipes`       | recipes     | recipes.json      | context.recipes            |
| `/recipes/:slug` | recipes     | recipes.json      | context.recipes.items      |
| `/blog`          | blog        | blog.json         | context.blog               |
| `/promotions`    | promotions  | promotions.json   | context.promotions         |
| `/admin`         | admin       | admin.json        | context.admin              |

If routes change, update all matching fixtures, context mapping, and route components together.

## 5) Rose Palette + Dark Mode Rules

Color direction for RestA is rose-first.

Requirements:

- Base accent should use rose tokens in light mode.
- Dark mode must preserve contrast and readability.
- Keep a consistent semantic token strategy (surface, text, accent, muted, border).
- Verify both themes for:
  - button contrast
  - card background/readability
  - links and focus states
  - badges/promotion highlights

Primary token file for this app:

- `tokens/resta.css`

## 6) Required Reading Before Editing

Read these files before substantial edits:

- `resta-app/ui8kit.config.json`
- `resta-app/src/blocks/*`
- `resta-app/src/layouts/*`
- `resta-app/tokens/resta.css`
- `packages/sdk/src/config.ts`
- `packages/sdk/src/validate.ts`
- `packages/sdk/src/cli/inspect.ts`
- `packages/sdk/src/cli/validate.ts`
- `packages/generator/src/cli/generate.ts`

## 7) Recommended Work Order

1. Define or update route map + fixture contracts for one domain chunk.
2. Implement DSL blocks/layouts for that chunk.
3. Run validation/generation checks.
4. Move to next chunk only after checks are clean.
5. Verify rose palette in both light and dark mode.

## 8) Verification Checklist

Minimum checks:

- `bun packages/sdk/src/cli/inspect.ts --cwd "resta-app"`
- `bun packages/sdk/src/cli/validate.ts --cwd "resta-app"`
- `bun packages/generator/src/cli/generate.ts --cwd "resta-app" --target react --out-dir "./dist/react"`

Integration checks:

- `bun run check:sdk-integration`
- `bun run smoke:parity` (from repo root)

Output checks:

- generated files exist under `resta-app/dist/*`
- no DSL residue in generated output (`<If`, `<Loop`, `<Var`, `@ui8kit/dsl`)

## 9) Agent Output Format (Required)

When reporting implementation results, use:

1. PLAN
2. CHANGES (file-by-file)
3. VERIFICATION (commands + outcomes)
4. RISKS / FOLLOW-UPS

## 10) Anti-Hallucination Rules

- Do not invent files, scripts, or APIs.
- Do not claim checks were run if they were not.
- If uncertain, prefer minimal safe change and state assumptions.
