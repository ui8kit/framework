# @ui8kit/sdk

UI8Kit SDK for app definition, validation, and DSL generation. Provides programmatic APIs and CLI binaries for config-driven template workflows.

## Requirements

- Node.js `>=18`
- Bun (recommended for CLI) or Node.js

## Installation

```bash
bun add @ui8kit/sdk
# or
npm install @ui8kit/sdk
```

## CLI Binaries

The SDK exposes three standalone binaries for app inspection, validation, and template generation.

### `ui8kit-validate`

Validate UI8Kit app config and DSL.

```bash
bunx ui8kit-validate
bunx ui8kit-validate --cwd ./apps/engine
```

### `ui8kit-inspect`

Inspect resolved UI8Kit app configuration.

```bash
bunx ui8kit-inspect
bunx ui8kit-inspect --cwd ./apps/engine
```

### `ui8kit-generate`

Generate target templates from DSL sources.

```bash
bunx ui8kit-generate
bunx ui8kit-generate --cwd ./apps/engine --target react
bunx ui8kit-generate --cwd ./apps/engine --target liquid --out-dir ./dist/liquid
```

Options:

- `--cwd <dir>` Working directory
- `--target <engine>` Target engine: `react`, `liquid`, `handlebars`, `twig`, `latte`
- `--out-dir <dir>` Output directory override

## Programmatic API

### Config

```typescript
import {
  loadAppConfig,
  loadAppConfigDetails,
  findAppConfigPath,
} from "@ui8kit/sdk";

// Load config (searches for ui8kit.config.* in cwd)
const config = await loadAppConfig("./apps/engine");

// Load with details (path, warnings)
const { config, configPath, warnings } = await loadAppConfigDetails("./apps/engine");

// Find config path without loading
const path = await findAppConfigPath("./apps/engine");
```

### Validation

```typescript
import { loadAppConfigDetails, validateProject } from "@ui8kit/sdk";

const { config } = await loadAppConfigDetails("./apps/engine");
const result = await validateProject(config, "./apps/engine");

if (!result.ok) {
  console.error(result.diagnostics);
  console.error(result.dslErrors);
}
```

### Build (Generate)

```typescript
import { loadAppConfig, buildProject } from "@ui8kit/sdk";

const config = await loadAppConfig("./apps/engine");
const result = await buildProject(config, "./apps/engine");

if (result.ok) {
  console.log(`Generated ${result.generated} files to ${result.outputDir}`);
}
```

## Typical Flow

1. **Inspect** — verify config loads correctly
2. **Validate** — check paths exist and DSL is valid
3. **Generate** — produce target templates (React, Liquid, etc.)

```bash
bunx ui8kit-inspect --cwd ./my-app
bunx ui8kit-validate --cwd ./my-app
bunx ui8kit-generate --cwd ./my-app --target react
```

## Exports

| Export | Description |
|--------|-------------|
| `@ui8kit/sdk` | Main entry (config, validate, build, types) |
| `@ui8kit/sdk/config` | Config loading only |
| `@ui8kit/sdk/validate` | Validation only |
| `@ui8kit/sdk/build` | Build/generate only |
| `@ui8kit/sdk/source` | Source TypeScript (for monorepo) |

## Local Development

From `packages/sdk`:

```bash
bun run build
bun run dev   # watch mode
```

Run CLI binaries from source:

```bash
bun src/cli/validate.ts --cwd apps/engine --help
bun src/cli/inspect.ts --cwd apps/engine --help
bun src/cli/generate.ts --cwd apps/engine --target react --help
```
