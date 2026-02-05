# UI8Kit Framework — Roadmap

## Vision

**Template Factory**: React DSL → 15 production lines (5 engines × 3 modes) → HTML + CSS.

*Шаблоны — это исходники. HTML + CSS — это результат.*

---

## Принципы

- **React = Source of Truth** — компоненты определяют структуру, props, slots
- **DSL Syntax** — `<If>`, `<Loop>`, `<Var>`, `<Slot>` для условной логики
- **Web Standards** — HTML5 semantic, W3C CSS, ARIA accessibility
- **Minimal Tailwind** — 90% покрытие дизайна без компилятора
- **Design Tokens** — shadcn для брендирования
- **Every Line Valid** — 15 линий всегда возвращают валидный синтаксис
- **Three Sources = Refactor** — рефакторинг при обнаружении дублирования

---

## Production Matrix

### 5 Template Engines

```
React    — JSX components
Liquid   — Shopify, Jekyll
HBS      — universal
Twig     — Symfony, PHP
Latte    — Nette, PHP
```

### 3 Output Modes

```
tailwind — utility classes as-is
css3     — mapped to CSS properties
inline   — style attribute
```

### 15 Lines = 5 × 3

```
         │ tailwind │ css3   │ inline │
─────────┼──────────┼────────┼────────┤
React    │    ✓     │   ✓    │   ✓    │
Liquid   │    ✓     │   ✓    │   ✓    │
HBS      │    ✓     │   ✓    │   ✓    │
Twig     │    ✓     │   ✓    │   ✓    │
Latte    │    ✓     │   ✓    │   ✓    │
```

**HTML + CSS** генерируется из любого engine в любом mode.

---

## Архитектура

```
packages/
├── core/         @ui8kit/core      — UI примитивы
├── template/     @ui8kit/template  — DSL компоненты
├── blocks/       @ui8kit/blocks    — Business blocks
├── generator/    @ui8kit/generator — SSG (будет standalone)
├── lint/         @ui8kit/lint      — Whitelist validation
├── mdx-react/    @ui8kit/mdx-react — MDX docs
└── registry/     @ui8kit/registry  — [PLANNED] CDN + CLI

apps/
├── engine/   — Source of Truth: React DSL + fixtures
├── web/      — Generated: React (no DSL) + own data
└── docs/     — Generated: React (no DSL) + own data
```

---

## Completed

- [x] Generator OOP architecture + React → HTML pipeline
- [x] Class mapping (Tailwind → CSS3)
- [x] Design tokens (shadcn) + dark mode
- [x] DSL components: `If`, `Loop`, `Var`, `Slot`, `Include`, `Block`
- [x] Multiple modes: tailwind, semantic, inline
- [x] Lint package with whitelist sync
- [x] `packages/blocks` — extracted from apps/web
- [x] `packages/data` — extracted fixtures

---

## Phase 1: Generator Refactor (Feb 2026)

### Current Focus: apps/web + apps/docs → HTML + CSS

- [ ] Refactor generator для работы с чистым React (без DSL)
- [ ] apps/web → static HTML + CSS generation
- [ ] apps/docs → static HTML + CSS generation
- [ ] Support static context и API data sources
- [ ] Build script для full site generation
- [ ] Asset handling (images, fonts, icons)

### Generator Architecture

- [ ] PluginManager без хардкода
- [ ] Zod schemas для config/output
- [ ] Base plugin interface
- [ ] Mode strategies (tailwind, css3, inline)

### Web Standards Validation

- [ ] HTML5 semantic output validation
- [ ] W3C CSS validation в CI
- [ ] ARIA attributes checking
- [ ] Lighthouse accessibility audit

---

## Phase 2: 5 Template Plugins (Mar 2026)

### Engine Plugins

- [ ] **React plugin** — JSX → HTML + CSS
- [ ] **Liquid plugin** — Liquid → HTML + CSS
- [ ] **Handlebars plugin** — HBS → HTML + CSS
- [ ] **Twig plugin** — Twig → HTML + CSS (PHP runtime)
- [ ] **Latte plugin** — Latte → HTML + CSS (PHP runtime)

### Validation

- [ ] Snapshot tests для всех 15 линий
- [ ] CI: каждый PR проверяет все линии
- [ ] Output syntax validation per engine

---

## Phase 3: Standalone Generator (Apr 2026)

### @ui8kit/generator as Isolated Package

- [ ] Extract to separate repository
- [ ] Zero dependencies on apps/*
- [ ] Works with any of 5 template engines
- [ ] NPM publish as standalone package

### Integration Example

```bash
# In any Handlebars app:
npm install @ui8kit/generator
npx ui8kit generate --engine=hbs --mode=css3
```

---

## Phase 4: Components & Blocks (Apr-May 2026)

### CSS-only Components

- [ ] Accordion, Tabs
- [ ] Dropdown, Modal, Tooltip
- [ ] Toast, Popover

### Business Blocks (shadcn parity)

- [ ] Dashboard blocks
- [ ] Auth blocks
- [ ] Data tables
- [ ] Marketing blocks
- [ ] E-commerce blocks

---

## Phase 5: Registry CDN (May 2026)

### packages/registry

- [ ] CLI: `npx ui8kit add "url.json"`
- [ ] Registry JSON schema
- [ ] CDN hosting
- [ ] Version management

### Proof of Concept

- [ ] Publish all blocks to registry
- [ ] Remove local templates from apps/web
- [ ] Install via CLI from CDN
- [ ] Verify identical result

---

## Phase 6: MCP Server (Jun 2026)

### packages/mcp

- [ ] MCP Server package
- [ ] Tool: list blocks
- [ ] Tool: add block
- [ ] Tool: configure props

### AI Integration

- [ ] Test with Cursor Agent
- [ ] Test with Claude Desktop
- [ ] LLM cheatsheet

---

## Phase 7: Beyond Web (Q3 2026)

### Email Templates

- [ ] Inline mode optimization
- [ ] Email client compatibility

### Print/PDF

- [ ] Fixed dimensions support
- [ ] Print CSS
- [ ] PDF generation pipeline

### Social Media

- [ ] OG image generation
- [ ] Story/post templates

---

## MDX React (`@ui8kit/mdx-react`)

### Completed

- [x] MDX v3.1.1 pipeline
- [x] Vite plugin
- [x] TypeScript + tests

### In Progress

- [ ] ComponentExample + CodeBlock
- [ ] PropsTable auto-generation
- [ ] Tabs, Callout

### Future

- [ ] Framework bridges (Next.js, Astro)
- [ ] Auto-generated API docs

---

## Backlog

### Documentation

- [ ] DSL template guide
- [ ] Getting Started (101)
- [ ] Production lines reference
- [ ] Generator standalone usage guide

### Testing

- [ ] 15-line snapshot suite
- [ ] PHP runtime tests
- [ ] HTML/CSS validators in CI
- [ ] Visual regression (optional)

### Future Ideas

- [ ] Visual block editor
- [ ] Figma plugin
- [ ] Tiptap integration

---

## Success Metrics

- **15 production lines**: all valid syntax
- **Web standards**: HTML5 + W3C CSS + ARIA
- **Test coverage**: 90%+
- **Source of truth**: 1 (apps/engine)
- **CSS reduction**: 78%+ (UnCSS)
- **Build time**: < 5s
- **Registry blocks**: 50+

---

## Next Actions

1. **Generator refactor** — работа с чистым React (apps/web, apps/docs)
2. **HTML + CSS generation** — static site из apps/web
3. **Web standards validation** — HTML5, W3C CSS, ARIA в CI
4. **Snapshot tests** — валидация output
5. **PluginManager** — архитектура без хардкода
