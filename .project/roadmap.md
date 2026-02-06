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
├── engine/   — Template Factory: DSL → dist/{engine}/ templates
├── web/      — Site Builder: templates → HTML + CSS (3 modes)
└── docs/     — Site Builder: templates → HTML + CSS (3 modes)
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
- [x] **ReactPlugin** — 5th official template plugin (DSL → React JSX)
- [x] Engine default changed: `--engine react` (was handlebars)

---

## Phase 1: React Template Pipeline (Feb 2026)

### Engine: DSL → React Templates

- [x] ReactPlugin implementation
- [ ] Achieve ideal React output for all blocks
- [ ] Engine generates to `dist/react/`
- [ ] Snapshot tests for React output
- [ ] Validate all blocks produce valid JSX

### apps/web + apps/docs: Templates → HTML + CSS

- [ ] Copy React templates from `engine/dist/react/`
- [ ] apps/web → static HTML + CSS generation
- [ ] apps/docs → static HTML + CSS generation
- [ ] Support static context and API data sources
- [ ] Build script for full site generation
- [ ] Asset handling (images, fonts, icons)

### Generator Architecture

- [ ] PluginManager без хардкода
- [ ] Zod schemas для config/output
- [ ] Mode strategies (tailwind, css3, inline)

### Web Standards Validation

- [ ] HTML5 semantic output validation
- [ ] W3C CSS validation в CI
- [ ] ARIA attributes checking

---

## Phase 2: All 5 Engines + `--engine all` (Mar 2026)

### Engine: Parallel Generation

- [ ] `--engine all` — generate all 5 engines in parallel
- [ ] Output to `dist/react/`, `dist/liquid/`, `dist/handlebars/`, `dist/twig/`, `dist/latte/`
- [ ] Validate all 5 engines produce correct syntax

### Engine Plugins (HTML + CSS from templates)

- [x] **React plugin** — DSL → JSX
- [ ] **Liquid plugin** — validate Liquid → HTML + CSS
- [ ] **Handlebars plugin** — validate HBS → HTML + CSS
- [ ] **Twig plugin** — validate Twig → HTML + CSS (PHP runtime)
- [ ] **Latte plugin** — validate Latte → HTML + CSS (PHP runtime)

### Validation

- [ ] Snapshot tests for all 15 lines
- [ ] CI: every PR checks all lines
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

## Phase 5: BuildY Integration + Registry (May 2026)

### BuildY Connection

- [ ] Copy `engine/dist/` to BuildY
- [ ] BuildY registers files in Registry JSON
- [ ] BuildY publishes to CDN
- [ ] Verify templates available via CDN

### CLI (future)

- [ ] Script to copy from `dist/` to apps/ (proto-CLI)
- [ ] CLI: `npx ui8kit add "url.json"` (via BuildY)
- [ ] Proof of concept: remove local → install from CDN → identical result

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

1. **React output quality** — добиться идеального JSX для всех блоков
2. **Engine → dist/react/** — генерация React шаблонов в dist/
3. **apps/web** — копировать из dist/, строить HTML + CSS
4. **Snapshot tests** — валидация React output
5. **`--engine all`** — параллельная генерация 5 engines (planned)
