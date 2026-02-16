# UI8Kit Engine Pipeline Guide

This guide explains how to build, sync, and ship UI8Kit applications from the Engine DSL pipeline.

It is organized in this order:
1. Practical build/release workflows (commands first)
2. How the DSL + data pipeline works
3. Data caching and memory behavior
4. Troubleshooting
5. Recommended external references

---

## 1) Practical Workflows (Build First)

### Goal -> Command

| Goal | Command |
|---|---|
| Build `apps/dev` with local domain data (website) | `bun run pipeline:dev:local` |
| Build `apps/dev` with shared workspace data | `bun run pipeline:dev:shared` |
| Build `apps/test` for website | `bun run pipeline:test:website` |
| Build `apps/test` for docs | `bun run pipeline:test:docs` |
| Build `apps/test` for examples | `bun run pipeline:test:examples` |
| Build `apps/test` for dashboard | `bun run pipeline:test:dashboard` |
| Run sync flow for any domain/target | `bun run scripts/pipeline-app.ts sync --target <app> --domain <domain> --data-mode <local|shared>` |
| Run full flow for any domain/target | `bun run scripts/pipeline-app.ts all --target <app> --domain <domain> --data-mode <local|shared>` |
| Validate generated data bundle contract | `bun run validate:data-bundle -- --target <app>` |
| Apply soft navigation policy in UI | Use `DomainNavButton` + `context.resolveNavigation(href)` |
| Clean engine caches and stale build artifacts | `bun run clean:engine` |

### 1.1 Quick Start: Default website app (`engine -> apps/dev`)

Use this when you want the standard website domain in local data mode.

```bash
bun run pipeline:dev:local
```

What this does:
- scaffolds app infrastructure (if needed)
- runs engine generation (`apps/engine/dist/react/...`)
- syncs generated templates into `apps/dev/src`
- bundles domain-local data into `apps/dev/src/data`
- switches `@ui8kit/data` alias to local mode


### 1.2 Quick Start: Shared data mode (`engine -> apps/dev`)

Use this when you want `apps/dev` to consume shared workspace data directly.

```bash
bun run pipeline:dev:shared
```


### 1.3 Build target app by domain

For domain-specific apps in `apps/test`:

```bash
bun run pipeline:test:website
bun run pipeline:test:docs
bun run pipeline:test:examples
bun run pipeline:test:dashboard
```


### 1.4 Use the generic pipeline command

When you need explicit control:

```bash
# full pipeline
bun run scripts/pipeline-app.ts all --target test --domain docs --data-mode local

# sync-only pipeline (still runs generate + sync + data bundle + alias)
bun run scripts/pipeline-app.ts sync --target dev --domain website --data-mode local

# standalone stages
bun run scripts/pipeline-app.ts generate --target dev --domain website
bun run scripts/pipeline-app.ts bundle-data --target dev --domain website --data-mode local
bun run scripts/pipeline-app.ts alias-data --target dev --data-mode shared
```


### 1.5 Validate generated local data contract

```bash
bun run validate:data-bundle -- --target dev
bun run validate:data-bundle -- --target test
```

This verifies:
- required exports exist (`context`, `EMPTY_ARRAY`, `clearCache`, diagnostics)
- required context keys are present
- deterministic checksum can be observed for idempotency checks


### 1.6 Clean stale build artifacts before long sessions

```bash
bun run clean:engine
```

This removes:
- `apps/engine/node_modules/.vite`
- `apps/engine/dist`
- `packages/*/dist`
- `**/*.tsbuildinfo`

Useful when HMR or resource usage becomes unstable after many edits.

---

## 2) How the Pipeline Works

### 2.1 Source and artifact boundaries

- **DSL source of truth**: `apps/engine/src` + reusable package blocks
- **Fixture source of truth (SDK-first)**: `apps/engine/fixtures` (brand-owned data)
- **Generated artifacts**: `apps/engine/dist/react/{domain}`
- **Target runtime source**: `apps/<target>/src`

The pipeline is intentionally one-way:
- source DSL -> generated dist -> synced target app


### 2.2 Core stages

1. **Generate**
   - `apps/engine/generator.config.ts`
   - Produces per-domain registry and template output in `dist/react/{domain}`.

2. **Sync**
   - `scripts/copy-templates-to-dev.ts`
   - Syncs from dist into target app source folders.
   - Uses registry metadata + page model to organize route/page assets.

3. **Bundle Data**
   - `scripts/bundle-data.ts`
   - Creates `apps/<target>/src/data` from `packages/data` fixtures.
   - Supports:
     - `local`: domain slice + required shared data
     - `shared`: full context parity

4. **Alias Configuration**
   - `scripts/configure-data-alias.ts`
   - Rewrites `@ui8kit/data` alias in target app configs:
     - local -> `src/data/index.ts`
     - shared -> `../../packages/data/src/index.ts`


### 2.3 DSL page model and domain routing

The page model lives in:
- `packages/data/src/fixtures/shared/page.json`

It defines domain pages and is used by pipeline stages to:
- map components/layouts to domain outputs
- build domain app shell expectations
- keep route contracts predictable across generated apps

### 2.4 Navigation authoring rules (soft domain policy)

Use this rule set to keep navigation stable in domain-only builds.

1. **Declare routable pages in one place**
   - Add all internal pages to `packages/data/src/fixtures/shared/page.json`.
   - Keep `id`, `domain`, and `path` consistent with generated route containers.

2. **Build links from context data, not hardcoded strings**
   - Header/sidebar/tabs should come from context-backed lists (`navItems`, `sidebarLinks`, domain sidebars).
   - Internal links must point to paths that exist in the `page` model.

3. **Use the domain-aware UI adapter for internal navigation**
   - In components, prefer `DomainNavButton` from `apps/engine/src/partials/DomainNavButton.tsx`.
   - It applies soft behavior automatically:
     - available page -> normal link
     - unavailable page in current domain build -> `disabled` + tooltip `Not available in this domain build`

4. **Use low-level resolver only for custom flows**
   - If a custom component cannot use `DomainNavButton`, call:
     - `context.resolveNavigation(href)` for state
     - `context.navigation.isEnabled(href)` for simple checks
   - Keep the same soft UX contract (`disabled` + tooltip text from `context.navigation.unavailableTooltip`).

---

## 3) Data Strategy and Memory Behavior

### 3.1 Data modes

- **Local mode (`data-mode=local`)**
  - target app gets self-contained `src/data`
  - best for portability and domain isolation
  - recommended for deployed domain apps

- **Shared mode (`data-mode=shared`)**
  - target app reads shared workspace data package
  - best for rapid development and central edits


### 3.2 Context contract parity

Local `src/data/index.ts` is expected to preserve API compatibility with shared context, including:
- `context.page` and deprecated `context.routes` alias
- `getPageByPath`, `getPagesByDomain`
- `resolveNavigation`, `navigation`
- sidebar link resolvers
- cache diagnostics

This lets route/layout containers remain stable regardless of data mode.


### 3.3 Caching details (memory-aware behavior)

The data layer includes practical cache guards to reduce memory churn:

- **Normalized sidebar cache keys**
  - path normalization removes query/hash/trailing-slash variance
  - avoids fragmented cache keys

- **Frozen cached link arrays**
  - cached sidebar structures are immutable
  - prevents accidental mutation and reference churn

- **Pre-warm of known docs/examples paths**
  - avoids repetitive allocations during tab/route switching

- **Diagnostics**
  - runtime cache stats can be inspected to confirm hit/miss behavior

These choices are particularly important in long dev sessions with frequent route switching.

---

## 4) Troubleshooting Checklist

### Generation succeeds, but target app renders stale structures

1. run `bun run clean:engine`
2. re-run pipeline command (`pipeline:...` or `pipeline-app.ts ...`)
3. verify alias mode (`local` vs `shared`) matches your expectation


### Domain app shows unexpected pages/data

1. verify selected `--domain`
2. inspect `packages/data/src/fixtures/shared/page.json`
3. run `validate:data-bundle`
4. check generated `apps/<target>/src/data/fixtures/...`


### HMR instability after many updates

1. stop dev server
2. run `bun run clean:engine`
3. start dev server again
4. hard-reload browser/dev webview

---

## 5) External References

### DSL, templating, and frontend build systems
- Vite (build and dev server): https://vitejs.dev/
- React Router (route design patterns): https://reactrouter.com/
- TypeScript project references and path mapping: https://www.typescriptlang.org/docs/
- Turborepo pipelines and caching: https://turbo.build/repo/docs

### Data and runtime architecture
- JSON schema and data contracts (general practice): https://json-schema.org/
- Runtime performance profiling in Chromium DevTools: https://developer.chrome.com/docs/devtools/performance/
- Web memory diagnostics (Chromium docs): https://developer.chrome.com/docs/devtools/memory/

### CSS and design token systems
- CSS custom properties (MDN): https://developer.mozilla.org/docs/Web/CSS/Using_CSS_custom_properties
- Tailwind v4 docs: https://tailwindcss.com/docs

---

## Recommended Working Principle

Treat the pipeline as a production system:
- always generate from DSL source
- always sync from dist artifacts
- always validate local data contract when changing data mechanics
- choose data mode explicitly (`local` for isolated apps, `shared` for centralized development)
