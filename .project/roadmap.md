# UI8Kit Framework — Roadmap

## Vision
Zero-overhead UI framework: **React DX → semantic HTML5/CSS3**.  
*Every line of code must justify its existence.*

---

## Принципы
| Принцип | Описание |
|---------|----------|
| **React = Source of Truth** | Компоненты определяют структуру, props, slots |
| **No Hardcode** | Динамическое обнаружение layout/partials/blocks |
| **SSG First** | React → HTML по умолчанию, шаблонизаторы через плагины |
| **Schema-Driven** | Zod-контракты между ядром и расширениями |
| **Minimal Cognitive Load** | Один источник правды, convention over configuration |

---

## Архитектура (текущая)

```
packages/
├── core/         @ui8kit/core      — UI примитивы (Box, Stack, Button...)
├── template/     @ui8kit/template  — DSL компоненты (If, Loop, Var, Slot...)
├── generator/    @ui8kit/generator — SSG + Plugin System
├── lint/         @ui8kit/lint      — Валидация whitelist классов
└── mdx-react/    @ui8kit/mdx-react — MDX processing + docs

apps/
├── web/     — Production site (blocks, layouts, partials, ~data)
├── docs/    — MDX documentation (Vite HMR)
└── engine/  — Template generation playground
```

### Целевая архитектура (планируется)

```
packages/
├── core/         — UI примитивы
├── template/     — DSL компоненты
├── generator/    — SSG + Plugins (Liquid, Handlebars, Twig, Latte)
├── lint/         — Валидация классов
├── mdx-react/    — MDX docs
├── blocks/       — [NEW] Shared business blocks
└── data/         — [NEW] Shared fixtures + types
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

---

## Active (Q1 2026)

### Phase 1: Plugin System (Feb 2026)
| Task | Status | Priority |
|------|--------|----------|
| [ ] React → HTML as default mode | 🔄 | P0 |
| [ ] PluginManager без хардкода | 🔄 | P0 |
| [ ] Liquid plugin | 🔄 | P1 |
| [ ] Handlebars plugin | 🔄 | P1 |
| [ ] Zod schemas для config/output | 🔄 | P1 |
| [ ] Twig plugin (PHP) | ⏳ | P2 |
| [ ] Latte plugin (PHP) | ⏳ | P2 |
| [ ] MCP Server package | ⏳ | P2 |

### Phase 2: Components & DX (Mar 2026)
| Task | Status | Priority |
|------|--------|----------|
| [ ] CSS-only: Accordion, Tabs | 🔄 | P1 |
| [ ] CSS-only: Dropdown, Modal, Tooltip | 🔄 | P1 |
| [ ] shadcn examples: dashboard, auth | 🔄 | P2 |
| [ ] shadcn examples: data tables, marketing | 🔄 | P2 |
| [ ] UnCSS optimization | 🔄 | P2 |

---

## MDX React (`@ui8kit/mdx-react`)

> Подробный план: `.project/mdx-react/ROADMAP.md`

### Completed
- [x] Project setup + MDX v3.1.1 pipeline
- [x] Vite plugin integration
- [x] TypeScript + testing infra

### In Progress (Feb 2026)
- [ ] `ComponentExample` + `CodeBlock` (syntax highlighting)
- [ ] `PropsTable` auto-generation
- [ ] `Tabs`, `Callout` components
- [ ] Component integration tests

### Next (Mar 2026)
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

## Architectural Tasks

| Task | Description | Priority |
|------|-------------|----------|
| `packages/blocks` | Перенос блоков из `apps/web` в shared package | P1 |
| `packages/data` | Shared fixtures + TypeScript types | P1 |
| Sync web ↔ engine | Единые блоки и данные для обоих apps | P1 |
| Engine snapshot tests | Liquid/Handlebars output validation | P2 |
| Engine JS templates | Тестирование сгенерированных шаблонов | P3 |

## Migration Plan

- [ ] Create `packages/blocks` - move blocks from apps/web
- [ ] Create `packages/data` - extract fixtures
- [ ] Update apps/web - use @ui8kit/blocks
- [ ] Update apps/engine - generate from packages/blocks
- [ ] Configure tests - test/apps/liquid and test/apps/handlebars

---

## Backlog

### High Priority
- [x] Fix terminal error `@ui8kit/template#dev`
- [x] Remove GraphQL from `apps/web`
- [ ] Refactor `apps/engine` [structure + naming](./report/_sync_web_engine.md)

### Medium Priority
- [ ] DSL template management docs
- [ ] Getting Started guide (101 level)
- [ ] LLM cheatsheet for MCP

### Low Priority
- [ ] PHP runtime tests (Twig/Latte)
- [ ] MD files parser and tiptap integration packages

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Test coverage (generator) | 90%+ |
| Cognitive load | 1 source of truth |
| CSS reduction | 78%+ (UnCSS) |
| Plugin extensibility | 4 built-in + custom API |
| Build time | < 5s for typical site |

---

## Next Actions

1. **PluginManager** — завершить архитектуру без хардкода
2. **React → HTML** — сделать default mode
3. **packages/blocks** — вынести блоки из apps/web
4. **Zod schemas** — валидация config и output
5. **MCP Server** — отдельный пакет для AI/LLM