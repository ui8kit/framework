# UI8Kit DSL Workflow (Vite + React)

Step-by-step instructions on how to create **any** new Vite + React application and integrate the UI8Kit DSL approach.

## 1) Create project

```bash
bun create vite my-app --template react-ts
cd my-app
bun add react react-dom
```

## 2) Initialize UI8Kit in project

You can use `npx` (as you wrote) or `bunx`.

```bash
npx ui8kit init
```

or

```bash
bunx ui8kit init
```

What `init` does:
- verifies that this is a Vite + React project;
- creates `ui8kit.config.json` (in root and a compatibility copy in `src/`);
- creates base directories:
  - `src/lib`
  - `src/components`
  - `src/components/ui`
  - `src/layouts`
  - `src/blocks`
  - `src/variants`

## 3) Install starter pieces from registry

Install a specific registry item:

```bash
npx ui8kit add <component-name>
```

Example:

```bash
npx ui8kit add blank
```

To install everything from the registry:

```bash
npx ui8kit add all
```

## 4) Add SDK config for DSL build/validate/generate

`ui8kit init` configures the CLI config, but for SDK mode you need a full app config.

Create in the project root a `ui8kit.config.json` file (if it does not exist yet in the required form) with these fields:
- `brand`
- `framework`
- `target`
- `outDir`
- `fixtures`
- `tokens`
- `componentsDir`
- `blocksDir`
- `layoutsDir`
- `partialsDir`
- `libDir`
- `lint`

Minimal example:

```json
{
  "$schema": "https://ui.buildy.tw/schema.json",
  "configVersion": "1",
  "brand": "my-app",
  "framework": "vite-react",
  "typescript": true,
  "target": "react",
  "outDir": "./dist/react",
  "aliases": {
    "@": "./src",
    "@/components": "./src/components",
    "@/ui": "./src/components/ui",
    "@/layouts": "./src/layouts",
    "@/blocks": "./src/blocks",
    "@/lib": "./src/lib",
    "@/variants": "./src/variants"
  },
  "fixtures": "./fixtures",
  "tokens": "./src/index.css",
  "componentsDir": "./src/components",
  "blocksDir": "./src/blocks",
  "layoutsDir": "./src/layouts",
  "partialsDir": "./src/partials",
  "libDir": "./src/lib",
  "registry": "@ui8kit",
  "lint": {
    "strict": true,
    "dsl": true
  }
}
```

## 5) Create minimal DSL source

Create:
- `src/layouts/MainLayout.tsx`
- `src/blocks/HomePageView.tsx`

Use DSL primitives (`If`, `Var`, `Loop`) from `@ui8kit/template` at the block level.

## 6) Validate and generate

From the project root:

```bash
npx ui8kit-inspect --cwd .
npx ui8kit-validate --cwd .
npx ui8kit-generate --cwd . --target react --out-dir ./dist/react
```

After that, `dist/react` will contain the generated React code without DSL artifacts.

## 7) Run app in dev mode

For standard Vite runtime:

```bash
bun run dev
```

For CLI dev check:

```bash
npx ui8kit dev --cwd .
```

---

## Quick command chain (copy/paste)

```bash
bun create vite my-app --template react-ts
cd my-app
bun add react react-dom
npx ui8kit init
npx ui8kit add blank
npx ui8kit-inspect --cwd .
npx ui8kit-validate --cwd .
npx ui8kit-generate --cwd . --target react --out-dir ./dist/react
bun run dev
```

---

## Monorepo mode (clone this repo and create an app in `apps/`)

This variant is for working directly inside the UI8Kit monorepo.

### 1) Clone and install workspace dependencies

```bash
git clone https://github.com/<your-org>/<your-ui8kit-repo>.git
cd <your-ui8kit-repo>
bun install
```

### 2) Create a new Vite React app under `apps/`

```bash
bun create vite apps/my-brand --template react-ts
cd apps/my-brand
bun add react react-dom
```

### 3) Initialize UI8Kit from monorepo CLI source

Run CLI from repo root (recommended in monorepo mode):

```bash
cd ../..
bun "packages/cli/src/index.ts" init --cwd "apps/my-brand"
```

Install your starter registry item:

```bash
bun "packages/cli/src/index.ts" add blank --cwd "apps/my-brand"
```

### 4) Add SDK-ready config for generation workflow

Ensure `apps/my-brand/ui8kit.config.json` contains app-level fields such as:
- `brand`
- `target`
- `outDir`
- `fixtures`
- `tokens`
- `blocksDir`
- `layoutsDir`
- `partialsDir`
- `lint`

### 5) Validate and generate from monorepo root

```bash
bun packages/sdk/src/cli/inspect.ts --cwd "apps/my-brand"
bun packages/sdk/src/cli/validate.ts --cwd "apps/my-brand"
bun packages/generator/src/cli/generate.ts --cwd "apps/my-brand" --target react --out-dir "./dist/react"
```

### 6) Run app locally

```bash
cd apps/my-brand
bun run dev
```

### Monorepo quick chain (copy/paste)

```bash
git clone https://github.com/<your-org>/<your-ui8kit-repo>.git
cd <your-ui8kit-repo>
bun install
bun create vite apps/my-brand --template react-ts
cd apps/my-brand
bun add react react-dom
cd ../..
bun "packages/cli/src/index.ts" init --cwd "apps/my-brand"
bun "packages/cli/src/index.ts" add blank --cwd "apps/my-brand"
bun packages/sdk/src/cli/inspect.ts --cwd "apps/my-brand"
bun packages/sdk/src/cli/validate.ts --cwd "apps/my-brand"
bun packages/generator/src/cli/generate.ts --cwd "apps/my-brand" --target react --out-dir "./dist/react"
cd apps/my-brand
bun run dev
```

