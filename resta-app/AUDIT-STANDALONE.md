# RestA — Audit for Standalone Repository

This document lists what resta-app needs when extracted to a **separate repository**, and what must be published or bundled.

---

## 1. Runtime Dependencies (Vite build + browser)

| Package | Used for | Install via | Published? |
|---------|----------|-------------|------------|
| **@ui8kit/core** | Block, Container, Button, Card, etc. | CDN Registry (you) | Yes |
| **@/blocks** | HeroBlock (LandingPageView) | Local `src/blocks/HeroBlock.tsx` | Yes |
| **@ui8kit/template** | If, Loop, Var (DSL) | npm | **No** |
| **@ui8kit/sdk** | createContext, types (context.ts) | npm | **No** |
| **@ui8kit/data-contracts** | createContext (SDK re-exports it) | npm | **No** |

### Current imports in resta-app

```
@ui8kit/core        → Block, Button, Card, Container, Grid, Stack, Text, Title, Icon, Field, etc.
@ui8kit/template    → If, Loop, Var
@/blocks            → HeroBlock (only in LandingPageView, local)
@ui8kit/sdk/source/data → createContext, EMPTY_ARRAY, types (NavItem, PageFixture, etc.)
```

### SDK cannot auto-load unpublished packages

The SDK is a normal npm package. It does **not** fetch or install dependencies at runtime. Its dependencies (`@ui8kit/data-contracts`, `@ui8kit/generator`, etc.) must be:

- Either **published to npm** and installed via `npm install @ui8kit/sdk`
- Or **bundled** into the SDK before publishing
- Or **inlined** into resta-app (copy createContext + types into app-local code)

---

## 2. Build-Time Paths (Vite config)

Current `vite.config.ts` uses **monorepo-relative aliases**:

```ts
alias: {
  '@': resolve(__dirname, './src'),
  '@ui8kit/core': resolve(__dirname, '../packages/core/src/index.ts'),
  '@ui8kit/template': resolve(__dirname, '../packages/template/src/index.ts'),
  '@ui8kit/data-contracts': resolve(__dirname, '../packages/data-contracts/src/index.ts'),
  '@ui8kit/sdk/source/data': resolve(__dirname, '../packages/sdk/src/data.ts'),
}
```

**In standalone repo:** Remove these aliases. Vite will resolve `@ui8kit/*` from `node_modules` (after you install published packages).

---

## 3. CSS / Tailwind

`src/css/index.css`:

```css
@source "../**/*.{ts,tsx}";
@source "../../../packages/generator/src/lib/ui8kit.map.json";
@source "../../../packages/core/src/**/*.{ts,tsx}";
```

- `../**/*.{ts,tsx}` — app source, OK in standalone
- `../../../packages/generator/...` — **broken** in standalone (no monorepo)
- `../../../packages/core/...` — **broken** in standalone

**Fix:** Either:

1. **Bundle ui8kit.map.json** into resta-app (copy or generate) and point `@source` to a local path
2. **Publish** a package that includes `ui8kit.map.json` and reference it from node_modules
3. **Generate** the map as part of the build (if you have generator available)

---

## 4. CLI (validate, generate)

Scripts in `package.json`:

```json
"validate": "bunx ui8kit-validate --cwd .",
"generate": "bunx ui8kit-generate --cwd . --target react"
```

These require the **ui8kit** CLI (`ui8kit` package). The CLI depends on:

- `@ui8kit/sdk` (config, validate, build)
- SDK depends on: `@ui8kit/data-contracts`, `@ui8kit/generator`, `@ui8kit/lint`, `@ui8kit/template`

**If packages are not published:** `bunx ui8kit-validate` will fail because `@ui8kit/sdk` and its deps won't resolve.

---

## 5. What to Publish (minimal set)

To run resta-app in a standalone repo **without** copying code:

| Package | Publish? | Reason |
|---------|----------|--------|
| **@ui8kit/core** | Yes (CDN) | You install via CDN Registry |
| **@/blocks** | Yes (local) | Blocks in `src/blocks/` |
| **@ui8kit/template** | **Yes** | If, Loop, Var — no alternative |
| **@ui8kit/data-contracts** | **Yes** | createContext, types — SDK re-exports it |
| **@ui8kit/sdk** | **Yes** | Or inline createContext in app |
| **ui8kit** (CLI) | Optional | Only if you need validate/generate |

### Option A: Publish SDK + data-contracts + template

- Publish: `@ui8kit/data-contracts`, `@ui8kit/template`, `@ui8kit/sdk`
- resta-app: `npm install @ui8kit/sdk @ui8kit/template`
- SDK will pull `@ui8kit/data-contracts` as its dependency

### Option B: Inline context (no SDK publish)

- Copy `createContext` + types from `@ui8kit/data-contracts` into resta-app (e.g. `src/lib/context.ts`)
- Remove `@ui8kit/sdk` dependency
- Still need: `@ui8kit/template`, `@ui8kit/core`; blocks are local in `src/blocks/`

---

## 6. ui8kit.map.json

Used by Tailwind `@source` for class whitelist. Options:

1. **Copy** `packages/generator/src/lib/ui8kit.map.json` into resta-app (e.g. `src/lib/ui8kit.map.json`) and update CSS
2. **Publish** a small package `@ui8kit/tailwind-map` (or bundle in SDK) with the JSON, then: `@source "../../node_modules/@ui8kit/tailwind-map/ui8kit.map.json"`
3. **Generate** it if you have generator (requires more deps)

---

## 7. Automation Checklist

| Task | How |
|------|-----|
| Publish `@ui8kit/data-contracts` | `npm publish` (or your registry) |
| Publish `@ui8kit/template` | `npm publish` |
| Publish `@ui8kit/sdk` | After data-contracts; ensure SDK's package.json deps use published versions |
| Bundle ui8kit.map.json | Copy or script in postinstall |
| Remove Vite aliases | When packages are installed from npm |
| Update CSS @source | Point to local `./src/lib/ui8kit.map.json` or node_modules path |

---

## 8. Summary

**Will be missing in standalone repo:**

1. All `@ui8kit/*` packages (except core/blocks via CDN)
2. `ui8kit.map.json` (CSS @source)
3. Monorepo Vite aliases (must be removed)

**SDK cannot auto-load unpublished packages** — you must either publish them or inline the needed code.

**Minimal publish set for full functionality:**

- `@ui8kit/data-contracts`
- `@ui8kit/template`
- `@ui8kit/sdk` (depends on data-contracts)

**Plus:** Bundle or publish `ui8kit.map.json` for Tailwind.

---

## 9. Suggested Automation

### Pre-extract script (run in monorepo)

```bash
# Copy ui8kit.map.json into resta-app
cp packages/generator/src/lib/ui8kit.map.json resta-app/src/lib/
```

Then update `resta-app/src/css/index.css`:

```css
@source "../**/*.{ts,tsx}";
@source "./lib/ui8kit.map.json";
@source "../../node_modules/@ui8kit/core/src/**/*.{ts,tsx}";
```

(Paths are relative to the CSS file at `src/css/index.css`; `../../` = project root.)

### Publish order (if publishing)

1. `@ui8kit/data-contracts` (no ui8kit deps)
2. `@ui8kit/template` (no ui8kit deps)
3. `@ui8kit/sdk` (depends on data-contracts; can drop generator/lint for runtime if only using data export)

### Standalone package.json (after extract)

```json
{
  "dependencies": {
    "@ui8kit/core": "^0.1.0",
    "@ui8kit/sdk": "^0.1.0",
    "@ui8kit/template": "^0.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.0.1",
    "..."
  }
}
```

Remove all Vite `resolve.alias` for `@ui8kit/*` — they resolve from node_modules.
