# UI8Kit SDK Guide

This guide explains SDK usage: CLI binaries, programmatic API, and integration with workspace scripts.

## SDK vs CLI

| Package | Role | Commands |
|---------|------|----------|
| `ui8kit` (CLI) | Component registry and build | init, add, scan, build, dev |
| `@ui8kit/sdk` | App config, validation, generation | ui8kit-validate, ui8kit-inspect, ui8kit-generate |

Use **CLI** for registry workflows (install components, scan, build registry). Use **SDK** for app workflows (validate config, inspect, generate templates).

## Where To Run Commands

- **SDK CLI binaries** — run from repository root or project directory:
  - `bun packages/sdk/src/cli/validate.ts --cwd "apps/engine"` (monorepo)
  - `bunx ui8kit-validate --cwd ./apps/engine` (published package)
- **Root workspace scripts** — run from repository root:
  - `bun run check:sdk-integration`
  - `bun run smoke:parity`

## Main Development Chains

### 1) Quick local check for one brand project

From repo root:

```bash
bun packages/sdk/src/cli/inspect.ts --cwd "apps/engine"
bun packages/sdk/src/cli/validate.ts --cwd "apps/engine"
bun packages/sdk/src/cli/generate.ts --cwd "apps/engine" --target react --out-dir "dist/local-check"
```

### 2) Full SDK integration check

From repo root:

```bash
bun run check:sdk-integration
```

This runs:

- `inspect` + `validate` + `generate` for `apps/engine` (SDK binaries)
- output folder existence checks
- generated file count threshold checks
- DSL residue checks in generated output (`<If`, `<Loop`, `<Var`, `@ui8kit/template`, `data-gen-`)

### 3) Programmatic usage in scripts

```typescript
import { loadAppConfigDetails, validateProject, buildProject } from "@ui8kit/sdk";

const cwd = "./apps/engine";
const { config } = await loadAppConfigDetails(cwd);

const validation = await validateProject(config, cwd);
if (!validation.ok) throw new Error("Validation failed");

const build = await buildProject(config, cwd);
if (!build.ok) throw new Error("Build failed");
```

## `smoke:parity` and SDK

`scripts/smoke-parity.mjs` tests both CLI and SDK. For SDK it runs:

- `ui8kit-validate --cwd apps/engine`
- `ui8kit-inspect --cwd apps/engine`
- `ui8kit-generate --cwd apps/engine --target react`

Edit the CONFIG at the top of `scripts/smoke-parity.mjs` to add or change test cases.

## `check:sdk-integration` Explained

`scripts/check-sdk-integration.sh` is a repository-level end-to-end check for SDK workflows.

### What it validates

- engine config can be loaded (`inspect`)
- engine passes SDK validation (`validate`)
- engine can generate React output (`generate`)
- generated output looks like final transformed code (no DSL artifacts)

### How to run

From repo root:

```bash
bun run check:sdk-integration
```

## Typical Troubleshooting

### Integration check fails in `check:sdk-integration`

1. Run each command directly from root:
   - `bun packages/sdk/src/cli/inspect.ts --cwd "<project>"`
   - `bun packages/sdk/src/cli/validate.ts --cwd "<project>"`
   - `bun packages/sdk/src/cli/generate.ts --cwd "<project>" --target react --out-dir "dist/debug"`
2. Inspect generated files under `<project>/dist/...`.
3. Ensure no DSL artifacts remain and output folder exists.

### Config not found

- Ensure `ui8kit.config.ts`, `ui8kit.config.json`, or another supported config file exists in the project root.
- Use `--cwd` to point to the correct directory.

### Validation fails (MISSING_PATH)

- Check that `fixtures`, `tokens`, `componentsDir`, `blocksDir`, `layoutsDir`, `partialsDir`, `libDir` in config point to existing paths.

## Release Checklist For SDK Package

From repo root (recommended before publishing):

```bash
bun run smoke:parity
bun run check:sdk-integration
bun run quality:local
```

From `packages/sdk`:

```bash
bun run build
bun run test
```
