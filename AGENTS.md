# AGENTS.md

Instructions for AI coding agents working with this codebase.

---

## Critical Rules

### 1. Utility Props — Single Values Only

```tsx
// ✅ CORRECT
<Box bg="primary" text="lg" gap="6" />

// ❌ FORBIDDEN — no modifiers in props
<Box col="span-1 lg:span-3" />
<Stack gap="4 md:gap-6" />
```

Props map to Tailwind classes: `bg="primary"` → `bg-primary`. Only values from `utility-props.map.ts` are valid.

### 2. className Requires data-class

```tsx
// ✅ CORRECT — className with semantic data-class
<div className="custom-style" data-class="featured-card">

// ❌ FORBIDDEN — className without data-class
<div className="custom-style">
```

Exception: Grid components can use className for responsive modifiers without data-class.

### 3. No Hardcoded Paths in Generator

All paths must come from configuration:

```typescript
// ✅ CORRECT
const viewsDir = config.html.viewsDir;
const outputDir = config.css.outputDir;

// ❌ FORBIDDEN
const viewsDir = './views';
const outputPath = 'apps/web/dist';
```

### 4. Services Follow IService Interface

```typescript
interface IService<TInput, TOutput> {
  readonly name: string;
  readonly version: string;
  readonly dependencies: readonly string[];
  
  initialize(context: IServiceContext): Promise<void>;
  execute(input: TInput): Promise<TOutput>;
  dispose(): Promise<void>;
}
```

Every service must implement this interface for DI and lifecycle management.

### 5. Comments in English Only

All code comments must be in English, regardless of user's language.

---

## Project Structure

```
ui8kit-framework/
├── apps/
│   ├── web/                    # Static site (no MDX)
│   │   ├── generator.config.ts # Generation config
│   │   ├── src/
│   │   │   ├── components/ui/  # Strict utility props only
│   │   │   ├── components/     # className + data-class allowed
│   │   │   ├── blocks/         # Semantic HTML5 sections
│   │   │   ├── partials/       # React → Liquid partials
│   │   │   ├── variants/       # CVA variant definitions
│   │   │   └── lib/
│   │   │       ├── ui8kit.map.json     # Class → CSS mapping
│   │   │       └── utility-props.ts    # Smart props system
│   │   └── views/              # Generated Liquid templates
│   │
│   └── docs/                   # MDX documentation
│       ├── generator.config.ts
│       └── docs/               # MDX files → routes
│
└── packages/
    ├── generator/              # Static site generator
    │   ├── src/
    │   │   ├── core/           # Orchestrator, Pipeline, EventBus
    │   │   ├── services/       # LayoutService, CssService, etc.
    │   │   ├── stages/         # Pipeline stages
    │   │   └── generate.ts     # High-level API
    │   └── templates/          # Default Liquid layouts
    │
    └── mdx-react/              # MDX processing utilities
```

---

## Key Files to Understand

| File | Purpose |
|------|---------|
| `utility-props.ts` | Smart props → Tailwind class mapping |
| `ui8kit.map.json` | Tailwind class → Pure CSS mapping (~500 classes) |
| `shadcn.css` | Design tokens (CSS custom properties) |
| `generator.config.ts` | Static generation configuration |
| `generate.ts` | Main generation entry point |

---

## Generation Flow

```
1. initializeLayouts()     → Copy templates to views/layouts/
2. generateViews()         → React → Liquid templates
3. generateCss()           → Extract classes, generate @apply + pure CSS
4. generateHtml()          → Liquid → final HTML
5. copyAssets()            → Static files to dist/
6. generateClientScript()  → Dark mode, utilities
7. generateElements()      → Typed variant components
8. generateMdxDocs()       → MDX → HTML (docs app only)
```

---

## Testing

```bash
# Run all tests
cd packages/generator && bun run test

# Watch mode
bun run test:watch

# Coverage report
bun run test:coverage
```

All services have corresponding `.test.ts` files. Use `createMockContext()` and `createMockFileSystem()` from `test/setup.ts`.

---

## Common Tasks

### Adding a New Service

1. Create `src/services/my-service/MyService.ts`
2. Implement `IService<TInput, TOutput>`
3. Create `MyService.test.ts` with TDD approach
4. Export from `src/services/index.ts`
5. Register in `generate.ts` or via Orchestrator

### Adding a New Stage

1. Create `src/stages/MyStage.ts`
2. Implement `IPipelineStage`
3. Set `order`, `enabled`, `dependencies`
4. Add to `src/stages/index.ts`

### Modifying Class Whitelist

1. Edit `apps/web/src/lib/ui8kit.map.json`
2. Add new class → CSS property mapping
3. Run `bun run generate` to test

---

## Anti-Patterns to Avoid

| Don't | Do Instead |
|-------|------------|
| `className="bg-red-500"` on UI components | Use props: `bg="red-500"` |
| Responsive modifiers in props | Use className in Grid only |
| Import Node.js APIs in browser code | Check `@ui8kit/mdx-react` server/client separation |
| Hardcode file paths | Use config values |
| Skip data-class with className | Always pair them |
| Create services without tests | TDD approach required |

---

## Architecture Principles

- **SOLID** — Single responsibility, DI, interface segregation
- **Clean Architecture** — Dependencies point inward
- **TDD** — Tests before implementation
- **Zero unused code** — UnCSS removes unused CSS
- **Semantic HTML5** — Proper tags via Block component
- **CSS-first** — Prefer `:checked`, `:target` over JS

---

## Helpful Commands

```bash
# Development
cd apps/web && bun run dev          # Vite HMR
cd apps/docs && bun run dev         # Docs with MDX

# Generation
cd apps/web && bun run generate     # Static site
cd apps/docs && bun run generate    # Docs site

# Testing
cd packages/generator && bun run test:coverage

# Type checking
bun run typecheck
```

---

## Questions to Ask Before Changes

1. Does this prop value exist in `utility-props.map.ts`?
2. Will this work in both `@apply` and semantic CSS modes?
3. Is the path configurable or hardcoded?
4. Does the service have proper tests?
5. Is data-class present when using className?
6. Are comments in English?
