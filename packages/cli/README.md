# ui8kit CLI

Official CLI for bootstrapping and managing UI8Kit component workflows in Vite React projects.

## Requirements

- Node.js `>=18`
- A Vite React project (for `init` and `add`)

## Quick Start

```bash
bunx ui8kit@latest init
```

Initialize with defaults (non-interactive):

```bash
bunx ui8kit@latest init --yes
```

## Commands

### `init`

Initialize UI8Kit structure and config in the current project.

```bash
bunx ui8kit@latest init
bunx ui8kit@latest init --yes
bunx ui8kit@latest init --registry ui
```

Options:

- `-y, --yes` Skip prompts and use defaults
- `-r, --registry <type>` Registry type (default: `ui`)

### `add`

Install one or more components from the registry.

```bash
bunx ui8kit@latest add button
bunx ui8kit@latest add button card
bunx ui8kit@latest add --all
bunx ui8kit@latest add badge --force
bunx ui8kit@latest add button --dry-run
bunx ui8kit@latest add --all --retry
```

Options:

- `-a, --all` Install all available components
- `-f, --force` Overwrite existing files
- `-r, --registry <type>` Registry type (default: `ui`)
- `--dry-run` Show planned actions without writing files
- `--retry` Enable retry logic for unstable connections

### `scan`

Scan source files and generate a registry manifest.

```bash
bunx ui8kit@latest scan
bunx ui8kit@latest scan --cwd ./apps/engine
bunx ui8kit@latest scan --source ./src --output ./src/registry.json
```

Options:

- `-r, --registry <type|path>` Registry type/path (default: `ui`)
- `-o, --output <file>` Output registry file
- `-s, --source <dir>` Source directory to scan
- `--cwd <dir>` Working directory

### `build`

Build a publishable registry from a registry JSON file.

```bash
bunx ui8kit@latest build
bunx ui8kit@latest build ./src/registry.json
bunx ui8kit@latest build ./src/registry.json --output ./packages/registry/r
```

Options:

- `[registry]` Path to registry JSON (default: `./src/registry.json`)
- `-o, --output <path>` Output directory (default: `./packages/registry/r`)
- `-c, --cwd <cwd>` Working directory

### `dev`

Start Vite dev server for SDK-configured project.

```bash
bunx ui8kit@latest dev
```

### SDK binaries (validate, inspect, generate)

Validate, inspect, and generate are provided by `@ui8kit/sdk`:

```bash
bunx ui8kit-validate --cwd ./apps/engine
bunx ui8kit-inspect --cwd ./apps/engine
bunx ui8kit-generate --cwd ./apps/engine --target react
```

## Typical Flow

```bash
# 1) Initialize project
bunx ui8kit@latest init --yes

# 2) Add a component
bunx ui8kit@latest add button

# 3) Add everything from registry (optional)
bunx ui8kit@latest add --all
```

## Local Development (this package)

From `packages/cli`:

```bash
npm install
npm run dev
```

Build once:

```bash
npm run build
```

Run compiled CLI locally:

```bash
node dist/index.js --help
```

## Publish Precheck

Before publish, CLI runs a parity smoke gate via `scripts/smoke-parity.mjs`:

- builds CLI dist
- runs CLI and SDK commands (config-driven, see CONFIG at top of script)
- for CLI: asserts source vs dist parity
- for SDK: asserts binaries run successfully

Run from repo root:

```bash
bun run smoke:parity
```
