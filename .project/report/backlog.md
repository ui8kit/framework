# Backlog

## Architecture & Technical Debt

Critical issues that limit flexibility and scalability of the framework.
Discovered during React template generation pipeline implementation (Feb 2026).

---

### [ARCH-01] Hardcoded DSL component names in HAST Builder

**File:** `packages/generator/src/transformer/hast-builder.ts`
**Impact:** High — blocks extensibility

The `handleDslComponent()` method uses a 200-line `switch` statement with hardcoded names:
`Loop`, `If`, `Else`, `ElseIf`, `Var`, `Slot`, `Include`, `DefineBlock`, `Extends`, `Raw`.

Adding a new DSL component (e.g., `<Switch>`, `<Fragment>`, `<Await>`) requires modifying core transformer code.

- [ ] Extract DSL handlers into a registry/strategy pattern
- [ ] Define `IDslComponentHandler` interface
- [ ] Allow plugins to register custom DSL handlers
- [ ] Move each handler to a separate file for testability

---

### [ARCH-02] Magic string markers in ReactPlugin

**File:** `packages/generator/src/plugins/template/built-in/ReactPlugin.ts`
**Impact:** High — fragile parsing

Branch detection uses magic strings: `___REACT_ELSE___`, `___REACT_ELSEIF___`, `___REACT_SEP___`, `___REACT_END___`.

If user content contains these strings — parsing breaks. String manipulation in `buildIIFE()` and `buildTernary()` is error-prone.

- [ ] Replace string markers with structured data (AST nodes or typed objects)
- [ ] Pass branch info through HAST annotations instead of string injection
- [ ] Add safety checks/escaping for marker collision

---

### [ARCH-03] Tight coupling to filesystem in TemplateService

**File:** `packages/generator/src/services/template/TemplateService.ts`
**Impact:** High — testability, portability

Direct `fs/promises` imports, custom glob implementation (`simpleMatch()`), synchronous single-file processing.

- [ ] Abstract file operations behind `IFileSystem` interface
- [ ] Replace custom glob with `fast-glob` or `tinyglobby`
- [ ] Add parallel file processing with configurable concurrency
- [ ] Enable in-memory mode for testing (virtual filesystem)

---

### [ARCH-04] passthroughComponents list is manual and fragile

**File:** `apps/engine/generator.config.ts`
**Impact:** High — maintainability at scale

26 core component names are hardcoded in an array. Adding a component to `@ui8kit/core` without updating this list causes silent generation failures (component treated as include, children lost).

- [ ] Auto-detect passthrough list from `@ui8kit/core` exports at build time
- [ ] Or add `@passthrough` JSDoc annotation to core components
- [ ] Fail loudly if unknown PascalCase component is encountered

---

### [ARCH-05] No block registry or metadata system

**File:** `packages/blocks/src/blocks/index.ts`
**Impact:** High — won't scale to 100+ blocks

Blocks are manually exported in `index.ts`. No categories, tags, dependencies, preview metadata.

- [ ] Implement block registry with auto-discovery (scan `blocks/` directory)
- [ ] Add block metadata: `{ name, category, tags, dependencies, preview }`
- [ ] Generate registry JSON for BuildY integration
- [ ] Enable programmatic block import by name

---

### [ARCH-06] Hardcoded spacing, typography, container widths in blocks

**Files:** All files in `packages/blocks/src/blocks/`
**Impact:** Medium — duplication, inconsistency

Every block hardcodes: `py="24"`, `py="16"`, `gap="8"`, `fontSize="3xl"`, `max="w-7xl"`, etc.
No shared design token scale. Changing section spacing means touching every block.

- [ ] Define shared block token presets: `section.padding`, `section.gap`, `heading.size`
- [ ] Create block style configuration (JSON/TS) that all blocks reference
- [ ] Support block density variants: `compact` / `comfortable` / `spacious`

---

### [ARCH-07] Component type detection is pattern-based heuristic

**File:** `packages/generator/src/transformer/hast-builder.ts`
**Impact:** Medium — misclassification

`detectComponentType()` uses regex patterns like `/Layout$/i`, `/Block$/i`.
A component named `FeatureBlockCard` would be classified as "block" even if it's a component.

- [ ] Allow explicit type declaration via JSDoc: `/** @componentType partial */`
- [ ] Fall back to heuristic only when explicit annotation is missing
- [ ] Support custom patterns via `TransformOptions`

---

### [ARCH-08] Hardcoded file extension mapping

**File:** `packages/generator/src/services/template/TemplateService.ts`
**Impact:** Medium — extensibility

`getFileExtension()` has a hardcoded `Record<string, string>` mapping.
Each new engine requires a code change.

- [ ] Move extension to plugin metadata: `plugin.fileExtension`
- [ ] TemplateService reads from plugin instead of maintaining its own map
- [ ] Already done in ReactPlugin (`fileExtension = '.tsx'`) — just need wiring

---

### [ARCH-09] Expression analyzer handles limited patterns

**File:** `packages/generator/src/transformer/expression-analyzer.ts`
**Impact:** Medium — modern JS support

Only recognizes: variable, member, `.map()` loop, ternary/&&, children, template literal, literal.

Missing: optional chaining (`?.`), nullish coalescing (`??`), destructuring, `Array.from`, chained methods (`.filter().map()`), tagged templates.

- [ ] Add optional chaining support (`user?.name`)
- [ ] Add nullish coalescing support (`value ?? default`)
- [ ] Add chained iteration detection (`.filter().map()`)
- [ ] Document supported vs unsupported expression patterns

---

### [ARCH-10] Layout coupling and prop drilling

**Files:** `apps/engine/src/layouts/`, `apps/engine/src/partials/`
**Impact:** Medium — composition, multi-brand

`MainLayout` is tightly coupled to `Header`, `Footer`, `Sidebar` via direct imports.
Props drill through: `Page → Layout → Header/Footer/Sidebar`.
`DashLayout` duplicates sidebar logic instead of composing with `MainLayout`.

- [ ] Extract layout configuration to context/provider pattern
- [ ] Allow slot-based composition: `<Layout header={...} footer={...}>`
- [ ] Create layout registry similar to block registry
- [ ] Remove hardcoded defaults (`'UI8Kit'`, `'Design System'`, `© 2025...`)

---

### [ARCH-11] Generator config is code-only, no declarative format

**File:** `apps/engine/generator.config.ts`
**Impact:** Medium — tooling, CI/CD

Configuration is embedded in TypeScript. No support for JSON/YAML config files.
Can't have environment-specific configs (dev/prod), no schema validation.

- [ ] Support `generator.config.json` alongside `.ts`
- [ ] Add JSON schema for config validation
- [ ] Support `--config` CLI flag for custom config path
- [ ] Support environment variables: `UI8KIT_ENGINE`, `UI8KIT_OUTPUT`

---

### [ARCH-12] No incremental / watch mode for generation

**File:** `packages/generator/src/services/template/TemplateService.ts`
**Impact:** Medium — developer experience

Full rebuild every time. With 100+ blocks this becomes slow.

- [ ] Track source file hashes, skip unchanged files
- [ ] Add `--watch` mode for continuous generation during development
- [ ] Build dependency graph: changing `Header.tsx` regenerates `MainLayout.tsx`

---

### [ARCH-13] DSL template components lack validation

**File:** `packages/template/src/components/`
**Impact:** Low — runtime errors

`<If test="...">`, `<Var name="...">` accept any string without validation.
Invalid variable paths or expressions fail silently at generation time.

- [ ] Add compile-time prop validation for DSL components
- [ ] Validate variable paths against component props schema
- [ ] Warn on unused/unknown variables

---

### [ARCH-14] Hardcoded className and responsive breakpoints in core

**Files:** `packages/core/src/components/` — Sheet.tsx, Grid.tsx, DashLayout.tsx
**Impact:** Low — theme consistency

Some components bypass the utility prop system and hardcode Tailwind classes directly:
`"hidden md:flex w-64 shrink-0 border-r"`, `"fixed inset-0 z-50"`, etc.

- [ ] Audit all components for hardcoded className values
- [ ] Migrate to utility props where possible
- [ ] Document which classes are intentionally hardcoded (structural) vs themeable

---

### [ARCH-15] No shared JSX base class for React-family plugins

**File:** `packages/generator/src/plugins/template/built-in/ReactPlugin.ts`
**Impact:** Low — future engines

If Preact, Solid, or other JSX-based engines are added, they'll duplicate React-specific logic (Fragment, className, htmlFor, style objects).

- [ ] Extract `BaseJsxPlugin` with shared JSX conventions
- [ ] ReactPlugin, PreactPlugin, etc. extend from it
- [ ] Move attribute conversion, fragment handling, key strategy to base

---

## Current Tasks

- [ ] `--engine all` — parallel generation for all 5 engines into `dist/{engine}/`
- [ ] Generator output formatting: pretty-print with indentation
- [ ] `href={ctaUrl}` vs `href="ctaUrl"` — dynamic prop values are stringified
- [ ] Integrate 11ty for testing Liquid/HBS/Twig/Latte templates (+ local PHP for Latte)
- [ ] Базовые стили tw = css3 идентичный результат
- [ ] HTML5 input types (submit, checkbox, radio, etc.)
- [ ] variant elements — переделать под пропы вместо уникальных имен тегов
- [ ] MCP-сервер (отдельный проект)
- [ ] Руководство уровня 101

---

## Done

- [x] Генератор OOP Typescript + отд пакет react зависимый для render static markup (content)
- [x] bun run html вместо классов уставляиваются стили прямо в тег
- [x] не создаются остальные роуты, только главный
- [x] макет имеет не существующий в react тег `<main class="min-h-screen">`
- [x] `isValidTailwindClass` валидация по карте `ui8kit.map.json`
- [x] дублируются классы в local.css `.feature-description`
- [x] дублируются классы в селекторах apply `.feature-card-0`, `.feature-card-1`
- [x] добавить режимы генерации `html:tailwind, tailwind --pure, semantic`, `css:tailwind, css3, css3inline`
- [x] partials генерировать из реакт или пропускать
- [x] обработать дизайн токены shadcn для css3
- [x] поправить недостоющие классы в картах
- [x] grid tw -> css3
- [x] вынести ui8kit в пакет
- [x] исправить указанные ошибки и баги такие как tart-1 и др
- [x] terminal errors
- [x] рефачить конфиг доков под алисы после выноса либы в пакет
- [x] убедиться что в компонентах импортированы варианты и нет дедупов
- [x] лог фактических классов проекта списком ui8kit.log.json
- [x] протестировать конфиг mjs для tw4
- [x] обработчик карта dsl to ui8kit.map.json
- [x] shadcn.map.json в работе?
- [x] grid md:grid lg:grid
- [x] алиасы (`fontSize` → `text-{size}`)
- [x] разработать моб версию и darkMode
- [x] Задокументировать правило "или DSL, или className"
- [x] Добавить семантические алиасы (fontSize, textColor, textAlign)
- [x] Реализовать compact mode
- [x] DSL UI8Kit — План улучшений для LLM ~ 12 задач выполнено 100%
- [x] Создать preset-шаблоны в blocks/
- [x] реализовать моб меню и sheet `bun run generate`
- [x] причесать макеты и блоки до финала
- [x] начать разработку компонентов под семантику
- [x] ошибка терминала для `@ui8kit/template#dev`
- [x] для приложения `apps/web` удалить graphql подключение
- [x] переименовать и причесать `apps/engine`
- [x] продумать управление шаблонами и разметку DSL
- [x] как все организовать в трех приложениях?
- [x] React template plugin (DSL → JSX)
- [x] `passthroughComponents` для сохранения core-примитивов
- [x] Fix unwrap: true — лишние div-обёртки в условиях
- [x] Fix ternary JSX → proper if/else rendering
- [x] Fix Loop render-function body extraction
- [x] apps/engine — router, pages, vite dev server
