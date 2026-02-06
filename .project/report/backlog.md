# Backlog

## Current Tasks


- [x] 5 архитектурных проблем высокого уровня критичности
- [x] Generator output formatting: pretty-print with indentation
- [x] `href={ctaUrl}` vs `href="ctaUrl"` — dynamic prop values are stringified
- [ ] Что нужно чтобы вынести генератор и собирать html5 + css из:
- [ ] `--engine all` — parallel generation for all 5 engines into `dist/{engine}/`
- [ ] Тест сборки шаблонов и отд приложения для Liquid/HBS
- [ ] Базовые стили tw = css3 идентичный результат
- [ ] HTML5 input types (submit, checkbox, radio, etc.)
- [ ] variant elements — переделать под пропы вместо уникальных имен тегов
- [ ] MCP-сервер (отдельный проект)
- [ ] Тест сборки шаблонов и отд приложения для Twig/Latte
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

---

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

- [x] Extract DSL handlers into a registry/strategy pattern
- [x] Define `IDslComponentHandler` interface
- [x] Allow plugins to register custom DSL handlers
- [x] Move each handler to a separate file for testability

---

### [ARCH-02] Magic string markers in ReactPlugin

**File:** `packages/generator/src/plugins/template/built-in/ReactPlugin.ts`
**Impact:** High — fragile parsing

Branch detection uses magic strings: `___REACT_ELSE___`, `___REACT_ELSEIF___`, `___REACT_SEP___`, `___REACT_END___`.

If user content contains these strings — parsing breaks. String manipulation in `buildIIFE()` and `buildTernary()` is error-prone.

**Status:** Deferred to Phase 2

Current implementation works correctly (all 13 templates generate successfully).
Refactoring to structured branch objects requires:
1. Modify BasePlugin.transformChildren to preserve branch annotations during traversal
2. Pass `GenCondition[]` array instead of string-injected markers
3. Update ReactPlugin to consume branch array instead of parsing strings
4. Add branch context stacks for nested conditions

- [x] Refactor branch annotations to use array of `GenCondition` objects
- [x] Update BasePlugin to track branch context during transformation
- [x] Modify ReactPlugin to read from branch array instead of parsing strings
- [x] Add safety checks for branch scoping and nesting

---

### [ARCH-03] Tight coupling to filesystem in TemplateService

**File:** `packages/generator/src/services/template/TemplateService.ts`
**Impact:** High — testability, portability

Direct `fs/promises` imports, custom glob implementation (`simpleMatch()`), synchronous single-file processing.

- [x] Abstract file operations behind `IFileSystem` interface
- [x] Replace custom glob with `fast-glob` or `tinyglobby`
- [x] Add parallel file processing with configurable concurrency
- [x] Enable in-memory mode for testing (virtual filesystem)

---

### [ARCH-04] passthroughComponents list is manual and fragile

**File:** `apps/engine/generator.config.ts`
**Impact:** High — maintainability at scale

26 core component names are hardcoded in an array. Adding a component to `@ui8kit/core` without updating this list causes silent generation failures (component treated as include, children lost).

- [x] Auto-detect passthrough list from `@ui8kit/core` exports at build time
- [x] Or add `@passthrough` JSDoc annotation to core components
- [x] Fail loudly if unknown PascalCase component is encountered

---

### [ARCH-05] No block registry or metadata system

**File:** `packages/blocks/src/blocks/index.ts`
**Impact:** High — won't scale to 100+ blocks

Blocks are manually exported in `index.ts`. No categories, tags, dependencies, preview metadata.

- [x] Implement block registry with auto-discovery (scan `blocks/` directory)
- [x] Add block metadata: `{ name, category, tags, dependencies, preview }`
- [x] Generate registry JSON for BuildY integration
- [x] Enable programmatic block import by name

---