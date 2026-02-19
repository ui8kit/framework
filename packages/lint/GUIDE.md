# @ui8kit/lint — CLI Guide for Standalone Apps

This guide explains how to use the lint CLI tools in a **standalone application** when developing UI8Kit DSL templates. These commands help you enforce DSL patterns and catch control-flow issues before generation.

## Prerequisites

- Node.js `>=18` or Bun
- React/JSX components using UI8Kit DSL (`<If>`, `<Loop>`, `<Var>`, etc.)

## Installation

```bash
bun add @ui8kit/lint
# or
npm install @ui8kit/lint
```

## CLI Commands

### `ui8kit-lint-dsl` — Validate DSL Control Flow

Scans your `.tsx`/`.jsx` files and checks that you use DSL components instead of raw JavaScript control flow. This ensures consistent, template-friendly output when generating to Liquid, Handlebars, or other engines.

**What it does:**
- Finds `{items.map(...)}` and suggests `<Loop>`
- Finds `{condition ? <A /> : <B />}` and suggests `<If>` / `<If><Else /></If>`
- Detects `<Var>` misuse (e.g. direct child of `<If>`)
- Reports severity (error, warning, info) with file and line
- Supports `--json` for CI or tooling

**Examples:**

```bash
# Scan src/ (default: current directory structure)
bunx ui8kit-lint-dsl src

# Scan specific directories
bunx ui8kit-lint-dsl src/blocks src/layouts

# JSON output for scripts or LLMs
bunx ui8kit-lint-dsl src --json
```

**Typical output:**
```
✅ DSL validation passed for 42 file(s).
```

Or when issues are found:
```
NON_DSL_LOOP (error)
  File: src/blocks/HeroBlock.tsx:12
  Use <Loop> instead of .map()
  Suggested: <Loop collection={items}><Text>{item.label}</Text></Loop>

NON_DSL_CONDITIONAL (warning)
  File: src/layouts/MainLayout.tsx:8
  Use <If> instead of ternary
  Suggested: <If condition={isReady}><Button>Go</Button></If>
```

**Why this matters:**
- DSL components (`<Loop>`, `<If>`, `<Var>`) compile to template syntax (e.g. Liquid `{% for %}`, `{% if %}`)
- Raw JS (`map`, ternary) does not translate to templates
- Running `ui8kit-lint-dsl` before `ui8kit-generate` reduces generation errors

---

### `ui8kit-lint` — Whitelist Sync Check

Validates that your design token whitelist (`ui8kit.map.json`) is in sync with your utility props map (`utility-props.map.ts`). Use this when you maintain a constrained Tailwind/utility class system.

**Requirements:**
- `ui8kit.map.json` — class whitelist
- `utility-props.map.ts` — maps props (e.g. `gap`, `text`) to classes

**Note:** This tool expects these files in your project or in a linked `@ui8kit/core`-style package. In a standalone app, ensure these paths exist or configure your project accordingly.

**Examples:**

```bash
# From project root (looks for packages/ui8kit in monorepo, or project-local paths)
bunx ui8kit-lint

# JSON output
bunx ui8kit-lint --json

# Show statistics
bunx ui8kit-lint --stats
```

**Typical output:**
```
📊 Whitelist Statistics:
   Total classes: 120
   Total props: 45
   Coverage: 98%

✅ Whitelist is in sync with props map
```

---

## Typical Workflow for DSL Development

1. **Write components** using `<Block>`, `<Stack>`, `<If>`, `<Loop>`, `<Var>`.

2. **Lint DSL** before generating:
   ```bash
   bunx ui8kit-lint-dsl src
   ```

3. **Fix issues** — replace `.map()` with `<Loop>`, ternary with `<If>`.

4. **Validate config** (SDK):
   ```bash
   bunx ui8kit-validate
   ```

5. **Generate templates** (generator):
   ```bash
   bunx ui8kit-generate --target react
   ```

---

## Error Codes Reference

| Code | Description |
|------|-------------|
| `NON_DSL_LOOP` | JS `.map()` in JSX — use `<Loop>` |
| `NON_DSL_CONDITIONAL` | Ternary or `&&` in JSX — use `<If>` |
| `UNWRAPPED_VAR` | `<Var>` not wrapped in `<If>` |
| `VAR_DIRECT_CHILD_OF_IF` | `<If>` wraps `<Var>` directly; add a wrapper element |

---

## Programmatic Usage

```typescript
import { validateDSL, formatPretty } from "@ui8kit/lint";

const source = `
  <Stack>
    {items.map((item) => <Text>{item.label}</Text>)}
  </Stack>
`;

const result = validateDSL(source, { file: "Example.tsx" });
if (!result.valid) {
  console.log(formatPretty(result));
}
```

---

## Related Packages

| Package | Commands | Purpose |
|---------|----------|---------|
| `@ui8kit/lint` | `ui8kit-lint-dsl`, `ui8kit-lint` | DSL flow validation, whitelist sync |
| `@ui8kit/sdk` | `ui8kit-validate`, `ui8kit-inspect` | Config validation |
| `@ui8kit/generator` | `ui8kit-generate` | Template generation |
