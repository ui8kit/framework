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

### 3) Local quality gate (broader workspace checks)

From repo root:

```bash
bun run quality:local
```

This includes many package checks and also calls `check:sdk-integration` as an optional step.

## `smoke:parity` Explained

`smoke:parity` is a release-safety gate in `scripts/smoke-parity.mjs` with config-driven test cases (edit CONFIG at top of file).

### What it does

- builds CLI dist
- for CLI: runs same commands via source and dist, asserts parity
- for SDK: runs validate, inspect, generate binaries, asserts success

### How to run

From repo root:

```bash
bun run smoke:parity
```

### Why it matters

- catches regressions where dev/source runtime works but packaged CLI behaves differently
- blocks publish when parity is broken (`prepublishOnly` in CLI package)

## `check:sdk-integration` Explained

`check:sdk-integration` is a repository-level end-to-end check for brand flows using SDK-powered CLI commands.

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

Script location:
- `scripts/check-sdk-integration.sh`

## Typical Troubleshooting

### Parity check fails in `smoke:parity`

1. Run source command manually:
   - `bun packages/cli/src/index.ts scan --cwd "<project>"`
2. Run dist command manually:
   - `bun packages/cli/dist/index.js scan --cwd "<project>"`
3. Compare output and exit code behavior.
4. Rebuild CLI and rerun:
   - `bun run build` (in packages/cli)
   - `bun run smoke:parity` (from root)

### Integration check fails in `check:sdk-integration`

1. Run each failing command directly from root:
   - `bun packages/sdk/src/cli/inspect.ts --cwd "<project>"`
   - `bun packages/sdk/src/cli/validate.ts --cwd "<project>"`
   - `bun packages/sdk/src/cli/generate.ts --cwd "<project>" --target react --out-dir "dist/debug"`
2. Inspect generated files under `<project>/dist/...`.
3. Ensure no DSL artifacts remain and output folder exists.

## Release Checklist For CLI Package

From `packages/cli`:

```bash
bun run build
```

From repo root:

```bash
bun run smoke:parity
```

From repo root (recommended before publishing):

```bash
bun run check:sdk-integration
bun run quality:local
```

