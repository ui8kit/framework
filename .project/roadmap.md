# UI8Kit Framework — Roadmap

## Vision

**Template Factory**: React DSL → 18 production lines (6 engines × 3 modes).

*Один источник → любой формат: веб, email, PDF, социальные сети, печать.*

---

## Принципы

- **React = Source of Truth** — компоненты определяют структуру, props, slots
- **DSL Syntax** — `<If>`, `<Loop>`, `<Var>`, `<Slot>` для условной логики
- **Minimal Tailwind** — 90% покрытие дизайна без компилятора
- **Design Tokens** — shadcn для брендирования
- **Every Line Valid** — 18 линий всегда возвращают валидный синтаксис
- **Three Sources = Refactor** — рефакторинг при обнаружении дублирования

---

## Production Matrix

```
         │ tailwind │ css3   │ inline │
─────────┼──────────┼────────┼────────┤
React    │    ✓     │   ✓    │   ✓    │
HTML     │    ✓     │   ✓    │   ✓    │
Liquid   │    ✓     │   ✓    │   ✓    │
HBS      │    ✓     │   ✓    │   ✓    │
Twig     │    ✓     │   ✓    │   ✓    │
Latte    │    ✓     │   ✓    │   ✓    │
```

---

## Архитектура

```
packages/
├── core/         @ui8kit/core      — UI примитивы
├── template/     @ui8kit/template  — DSL компоненты
├── blocks/       @ui8kit/blocks    — Business blocks
├── generator/    @ui8kit/generator — SSG + Plugin System
├── lint/         @ui8kit/lint      — Whitelist validation
├── mdx-react/    @ui8kit/mdx-react — MDX docs
└── registry/     @ui8kit/registry  — [PLANNED] CDN + CLI

apps/
├── engine/   — Source of Truth: React DSL
├── web/      — Generated: production site
└── docs/     — Generated: documentation
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

## Phase 1: Production Lines Foundation (Feb 2026)

### Core Infrastructure

- [ ] PluginManager без хардкода
- [ ] Zod schemas для config/output
- [ ] Base plugin interface

### 6 Engine Plugins

- [ ] **HTML plugin** — static HTML output
- [ ] **React plugin** — JSX components
- [ ] **Liquid plugin** — Shopify/Jekyll
- [ ] **Handlebars plugin** — универсальный
- [ ] **Twig plugin** — Symfony/PHP
- [ ] **Latte plugin** — Nette/PHP

### 3 Mode Strategies

- [ ] **tailwind mode** — utility classes as-is
- [ ] **css3 mode** — mapped to CSS properties
- [ ] **inline mode** — style attribute

### Validation

- [ ] Snapshot tests для всех 18 линий
- [ ] CI: каждый PR проверяет все линии
- [ ] Output syntax validation per engine

---

## Phase 2: apps/web + apps/docs HTML Generation (Feb-Mar 2026)

### Static HTML Pipeline

- [ ] apps/web → static HTML (css3 mode)
- [ ] apps/docs → static HTML (css3 mode)
- [ ] Build script для full site generation
- [ ] Asset handling (images, fonts)

### Integration

- [ ] HTML output в `dist/` folder
- [ ] Preview server для static files
- [ ] Diff tool: React render vs HTML output

---

## Phase 3: Components & Blocks (Mar 2026)

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

## Phase 4: Registry CDN (Apr 2026)

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

## Phase 5: MCP Server (May 2026)

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

## Phase 6: Beyond Web (Q3 2026)

### Email Templates

- [ ] Inline mode optimization
- [ ] Email client compatibility
- [ ] MJML integration (optional)

### Print/PDF

- [ ] Fixed dimensions support
- [ ] Print CSS
- [ ] PDF generation pipeline

### Social Media

- [ ] OG image generation
- [ ] Story/post templates
- [ ] Fixed aspect ratios

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

### Testing

- [ ] 18-line snapshot suite
- [ ] PHP runtime tests
- [ ] Visual regression (optional)

### Future Ideas

- [ ] Visual block editor
- [ ] Figma plugin
- [ ] Tiptap integration

---

## Success Metrics

- **18 production lines**: all valid syntax
- **Test coverage**: 90%+
- **Source of truth**: 1 (apps/engine)
- **CSS reduction**: 78%+ (UnCSS)
- **Build time**: < 5s
- **Registry blocks**: 50+

---

## Next Actions

1. **PluginManager** — архитектура без хардкода
2. **HTML plugin** — первая линия production
3. **Snapshot tests** — валидация всех линий
4. **apps/web → HTML** — static site generation
5. **CI pipeline** — 18 линий в каждом PR
