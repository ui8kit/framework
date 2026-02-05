# UI8Kit Framework — Roadmap

## Vision

**React-to-All-Engines Framework**: единая кодовая база на React DSL → генерация в любой шаблонизатор.

*Разработка в `apps/engine` (React DSL) → генерация для `apps/web`, `apps/docs` (React) + Liquid, Handlebars, Twig, Latte → публикация в Registry CDN → установка через `npx ui8kit add "url.json"` → MCP для AI-агентов.*

---

## Принципы

- **React = Source of Truth** — компоненты определяют структуру, props, slots
- **DSL Syntax** — `<If>`, `<Loop>`, `<Var>`, `<Slot>` для условной логики
- **No Hardcode** — динамическое обнаружение layout/partials/blocks
- **SSG First** — React → HTML по умолчанию, шаблонизаторы через плагины
- **Schema-Driven** — Zod-контракты между ядром и расширениями
- **App Isolation** — каждое приложение полностью изолировано

---

## Архитектура

```
packages/
├── core/         @ui8kit/core      — UI примитивы (Box, Stack, Button...)
├── template/     @ui8kit/template  — DSL компоненты (If, Loop, Var, Slot...)
├── blocks/       @ui8kit/blocks    — Shared business blocks (Hero, CTA, Features...)
├── generator/    @ui8kit/generator — SSG + Plugin System
├── lint/         @ui8kit/lint      — Валидация whitelist классов
├── mdx-react/    @ui8kit/mdx-react — MDX processing + docs
└── registry/     @ui8kit/registry  — [PLANNED] CDN registry + CLI

apps/
├── engine/   — Source of Truth: React DSL разработка
├── web/      — Generated: React templates (from engine)
└── docs/     — Generated: React templates (from engine)
```

---

## Completed

- [x] Generator OOP architecture + React → HTML pipeline
- [x] Class mapping + validation (Tailwind → CSS3)
- [x] Design tokens (shadcn-style) + dark mode
- [x] Mobile components (menu, sheet)
- [x] DSL components: `If`, `Loop`, `Var`, `Slot`, `Include`, `Block`
- [x] Grid conversion (Tailwind → CSS3)
- [x] Multiple generation modes: tailwind, semantic, inline
- [x] Lint package with whitelist sync
- [x] Create `packages/blocks` — moved blocks from apps/web
- [x] Create `packages/data` — extracted fixtures
- [x] Fix terminal error `@ui8kit/template#dev`
- [x] Remove GraphQL from `apps/web`
- [x] Refactor `apps/engine`

---

## Phase 1: Plugin System (Feb 2026)

### Core Generator

- [ ] React → HTML as default mode
- [ ] PluginManager без хардкода
- [ ] Zod schemas для config/output

### Template Plugins (5 официальных)

- [ ] **React plugin** — для apps/web, apps/docs
- [ ] Liquid plugin
- [ ] Handlebars plugin
- [ ] Twig plugin (PHP)
- [ ] Latte plugin (PHP)

### apps/engine Setup

- [ ] Настроить apps/engine как Source of Truth
- [ ] DSL синтаксис для всех блоков
- [ ] Генерация React шаблонов для apps/web
- [ ] Генерация React шаблонов для apps/docs

---

## Phase 2: Components & Blocks (Mar 2026)

### CSS-only Components

- [ ] Accordion, Tabs
- [ ] Dropdown, Modal, Tooltip
- [ ] Toast, Popover

### Business Blocks (shadcn-style coverage)

- [ ] Dashboard blocks
- [ ] Auth blocks (login, register, forgot password)
- [ ] Data tables
- [ ] Marketing blocks (pricing, testimonials, FAQ)
- [ ] E-commerce blocks (product card, cart, checkout)

### Optimization

- [ ] UnCSS optimization
- [ ] Build time < 5s

---

## Phase 3: Registry CDN (Apr 2026)

### packages/registry

- [ ] CLI: `npx ui8kit add "url.json"`
- [ ] Registry JSON schema
- [ ] CDN hosting setup
- [ ] Version management

### Integration

- [ ] Публикация всех блоков в registry
- [ ] Тест: удалить локальные шаблоны из apps/web
- [ ] Тест: установить через `npx ui8kit add` из CDN
- [ ] Документация по установке

---

## Phase 4: MCP Server (May 2026)

### packages/mcp

- [ ] MCP Server package
- [ ] Tool: list available blocks
- [ ] Tool: add block via CLI
- [ ] Tool: configure block props
- [ ] LLM cheatsheet

### AI Integration

- [ ] Тест с Cursor Agent
- [ ] Тест с Claude Desktop
- [ ] Автоматическая установка блоков через MCP

---

## MDX React (`@ui8kit/mdx-react`)

### Completed

- [x] Project setup + MDX v3.1.1 pipeline
- [x] Vite plugin integration
- [x] TypeScript + testing infra

### In Progress

- [ ] `ComponentExample` + `CodeBlock` (syntax highlighting)
- [ ] `PropsTable` auto-generation
- [ ] `Tabs`, `Callout` components
- [ ] Component integration tests

### Next

- [ ] MDX compilation utilities + caching
- [ ] Theme integration
- [ ] Browser-safe runtime (`/runtime` entry)
- [ ] LiveDemo, ComponentGrid, ThemeSwitcher

### Future

- [ ] Framework bridges (Next.js, Astro, Remix)
- [ ] Auto-generated API docs
- [ ] VS Code / IntelliSense integration
- [ ] i18n support

---

## Backlog

### Documentation

- [ ] DSL template management docs
- [ ] Getting Started guide (101 level)
- [ ] LLM cheatsheet for MCP
- [ ] Registry usage guide

### Testing

- [ ] Engine snapshot tests (Liquid/Handlebars output validation)
- [ ] PHP runtime tests (Twig/Latte)
- [ ] E2E tests for CLI

### Future Ideas

- [ ] MD files parser and tiptap integration
- [ ] Visual block editor
- [ ] Figma plugin

---

## Success Metrics

- Test coverage (generator): 90%+
- Cognitive load: 1 source of truth (apps/engine)
- CSS reduction: 78%+ (UnCSS)
- Plugin extensibility: 5 built-in (React, Liquid, HBS, Twig, Latte) + custom API
- Build time: < 5s for typical site
- Registry blocks: 50+ (shadcn parity)

---

## Next Actions

1. **apps/engine** — настроить как Source of Truth с DSL
2. **React plugin** — генерация для apps/web и apps/docs
3. **PluginManager** — завершить архитектуру без хардкода
4. **Zod schemas** — валидация config и output
5. **Registry planning** — спроектировать JSON schema и CLI
