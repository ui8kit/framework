# UI8Kit SDK — CLI Guide for Standalone Apps

This guide explains how to use the SDK CLI tools in a **standalone application** (not a monorepo). These commands help you develop DSL templates, validate configuration, and ensure your UI8Kit app is correctly set up.

## Prerequisites

- Node.js `>=18` or Bun
- A project with `ui8kit.config.ts` or `ui8kit.config.json` in the root

## Installation

```bash
bun add @ui8kit/sdk
# or
npm install @ui8kit/sdk
```

## CLI Commands

### `ui8kit-inspect` — Inspect Your Config

Shows the resolved UI8Kit configuration. Use this to verify that your config loads correctly and paths resolve as expected.

**What it does:**
- Loads `ui8kit.config.*` from your project
- Prints brand, framework, target engine, paths (blocks, layouts, partials, fixtures)
- Reports any config compatibility warnings

**Examples:**

```bash
# From project root (default)
bunx ui8kit-inspect

# From another directory
bunx ui8kit-inspect --cwd ./my-app

# With npm
npx ui8kit-inspect --cwd ./my-app
```

**Typical output:**
```
UI8Kit project inspection
Config path: /path/to/my-app/ui8kit.config.ts
Brand: my-brand
Framework: react
Target: react
Blocks: ./src/blocks
Layouts: ./src/layouts
Partials: ./src/partials
...
```

---

### `ui8kit-validate` — Validate Config and DSL

Validates your app configuration and DSL usage. Run this before generating templates or deploying.

**What it does:**
- Checks that required paths exist (blocks, layouts, partials, fixtures)
- Validates DSL syntax in your components (`<If>`, `<Loop>`, `<Var>`, etc.)
- Reports diagnostics (missing paths, invalid props, DSL errors)
- Exits with code 0 on success, 1 on failure (suitable for CI)

**Examples:**

```bash
# Validate from project root
bunx ui8kit-validate

# Validate a specific project
bunx ui8kit-validate --cwd ./my-app
```

**When validation fails:**
- Fix paths in `ui8kit.config.ts` (e.g. `blocksDir`, `layoutsDir`)
- Fix DSL errors in your `.tsx` files (use `<Loop>` instead of `.map()`, `<If>` instead of ternary)
- Run `ui8kit-lint-dsl` (from `@ui8kit/lint`) for detailed DSL suggestions

---

## Typical Workflow for DSL Development

1. **Inspect** — Confirm config loads:
   ```bash
   bunx ui8kit-inspect
   ```

2. **Validate** — Ensure project is valid:
   ```bash
   bunx ui8kit-validate
   ```

3. **Generate** — Build templates (requires `@ui8kit/generator`):
   ```bash
   bun add @ui8kit/generator
   bunx ui8kit-generate --target react
   ```

4. **Lint DSL** — Check control flow in components (requires `@ui8kit/lint`):
   ```bash
   bun add @ui8kit/lint
   bunx ui8kit-lint-dsl src
   ```

---

## Programmatic Usage

```typescript
import { loadAppConfigDetails, validateProject } from "@ui8kit/sdk";

const cwd = process.cwd();
const { config, configPath, warnings } = await loadAppConfigDetails(cwd);

const result = await validateProject(config, cwd);
if (!result.ok) {
  console.error(result.diagnostics);
  console.error(result.dslErrors);
}
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Config not found | Ensure `ui8kit.config.ts` or `ui8kit.config.json` exists in project root. Use `--cwd` to point to the correct directory. |
| MISSING_PATH | Check that `blocksDir`, `layoutsDir`, `partialsDir`, `fixtures` in config point to existing directories. |
| DSL validation errors | Run `ui8kit-lint-dsl src` for detailed suggestions. Prefer `<Loop>`, `<If>`, `<Var>` over raw JS. |

---

## Related Packages

| Package | Commands | Purpose |
|---------|----------|---------|
| `@ui8kit/sdk` | `ui8kit-validate`, `ui8kit-inspect` | Config validation and inspection |
| `@ui8kit/generator` | `ui8kit-generate` | Template generation from DSL components |
| `@ui8kit/lint` | `ui8kit-lint-dsl`, `ui8kit-lint` | DSL flow validation, whitelist sync |
