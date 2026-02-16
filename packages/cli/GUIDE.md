# UI8Kit CLI Guide

This guide explains the main command chains for daily development, release safety, and integration checks.

## Where To Run Commands

- If command starts with `ui8kit ...`, run from repository root using:
  - `bun "packages/cli/src/index.ts" <command> ...` (source runtime)
- If command is an npm script from `packages/cli/package.json`, run inside `packages/cli`.
- If command is a root workspace script (for example `check:sdk-integration`), run from repository root.

## Main Development Chains

### 1) Quick local check for one brand project

From repo root:

```bash
bun "packages/cli/src/index.ts" inspect --cwd "apps/engine"
bun "packages/cli/src/index.ts" validate --cwd "apps/engine"
bun "packages/cli/src/index.ts" generate --cwd "apps/engine" --target react --out-dir "dist/local-check"
```

Use the same chain for `resta-app` by replacing `--cwd`.

### 2) Full SDK integration check for both brands

From repo root:

```bash
bun run check:sdk-integration
```

This runs:
- `inspect` + `validate` + `generate` for `apps/engine`
- `inspect` + `validate` + `generate` for `resta-app`
- output folder existence checks
- generated file count threshold checks
- DSL residue checks in generated output (`<If`, `<Loop`, `<Var`, `@ui8kit/template`, `data-gen-`)

### 3) Local quality gate (broader workspace checks)

From repo root:

```bash
bun run quality:local
```

This includes many package checks and also calls `check:sdk-integration` as an optional step.

## `smoke:parity` Explained

`smoke:parity` is a CLI release-safety gate that verifies behavior parity between:
- source CLI entrypoint: `bun src/index.ts ...`
- built CLI entrypoint: `bun dist/index.js ...`

### What it does

From `packages/cli/scripts/smoke-parity.mjs`:
- builds CLI dist (`bun run build`)
- runs the same smoke commands in both source and dist runtimes:
  - `inspect --cwd apps/engine`
  - `validate --cwd apps/engine`
  - `inspect --cwd resta-app`
  - `validate --cwd resta-app`
  - `generate --cwd resta-app --target react --out-dir resta-app/dist/parity`
- compares exit codes between source and dist
- fails fast if any command fails or parity is broken

### How to run

From `packages/cli`:

```bash
npm run smoke:parity
```

### Why it matters

- catches regressions where dev/source runtime works but packaged CLI behaves differently
- blocks publish when parity is broken (`prepublishOnly` runs `smoke:parity`)

## `check:sdk-integration` Explained

`check:sdk-integration` is a repository-level end-to-end check for brand flows using SDK-powered CLI commands.

### What it validates

- both brand configs can be loaded (`inspect`)
- both brands pass SDK validation (`validate`)
- both brands can generate React output (`generate`)
- generated output looks like final transformed code (no DSL artifacts)

### How to run

From repo root:

```bash
bun run check:sdk-integration
```

Script location:
- `scripts/check-sdk-integration.sh`

## Typical Troubleshooting

### Parity check fails in `smoke:parity`

1. Run source command manually:
   - `bun src/index.ts inspect --cwd "<project>"`
2. Run dist command manually:
   - `bun dist/index.js inspect --cwd "<project>"`
3. Compare output and exit code behavior.
4. Rebuild CLI and rerun:
   - `bun run build`
   - `npm run smoke:parity`

### Integration check fails in `check:sdk-integration`

1. Run each failing command directly from root:
   - `bun "packages/cli/src/index.ts" inspect --cwd "<project>"`
   - `bun "packages/cli/src/index.ts" validate --cwd "<project>"`
   - `bun "packages/cli/src/index.ts" generate --cwd "<project>" --target react --out-dir "dist/debug"`
2. Inspect generated files under `<project>/dist/...`.
3. Ensure no DSL artifacts remain and output folder exists.

## Release Checklist For CLI Package

From `packages/cli`:

```bash
bun run build
npm run smoke:parity
```

From repo root (recommended before publishing):

```bash
bun run check:sdk-integration
bun run quality:local
```

