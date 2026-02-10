# UI8Kit Engine — Plan

> apps/engine = source of truth for 15 production lines.  
> Public output: generated React (enterprise-grade, shadcn-style theming).  
> DSL: internal tech, not documented publicly.

---

## Vision

- **engine** — full suite of layouts and components covering apps/web + apps/docs needs
- **Output** — dist/react/ → CDN registry.json → MCP server
- **apps/dev** — temporary comparison app during development; eventually apps built from CDN
- **DSL** — internal only; future: separate BSL product, white-label for framework builders

---

## 1. MainLayout (future apps/web)

Landing site with Hero + navigation sections.

### 1.1 Home page `/`

- [ ] Hero block (welcome)
- [ ] Second block: Examples section with common components
- [ ] Header + Footer partials
- [ ] Hint: `context.navItems` for main nav links

### 1.2 Section routes (SPA, Vite Router)

- [ ] `/examples` — default: Examples
- [ ] `/examples/dashboard` — Dashboard examples
- [ ] `/examples/tasks` — Tasks examples
- [ ] `/examples/playground` — Playground
- [ ] `/examples/authentication` — Auth examples
- [ ] Hint: same Hero on all; only content differs; use `<Outlet />` or nested routes

### 1.3 Blocks showcase `/blocks`

- [ ] `/blocks` — dedicated page with all blocks
- [ ] Hint: grid of block cards with preview + props summary

---

## 2. DashLayout (future apps/docs)

Documentation site with sidebar + main content.

### 2.1 Docs routes

- [ ] `/docs` — Introduction, motivation
- [ ] `/docs/components` — All UI8Kit components, all variants
- [ ] Hint: pure React, no MDX for now; Block, Stack, Group, Button, Badge, etc.
- [ ] `/docs/installation` — Installation guide
- [ ] Hint: static content; later can migrate to MDX

### 2.2 Theme / Create builder `/create`

- [ ] Visual builder for design tokens: spacing, radii, colors
- [ ] Output: Tailwind 3/4 config
- [ ] Theme: root / dark; HSL / RGB / HEX
- [ ] Real-time preview in apps/engine (dev mode)
- [ ] Export: copy-paste CSS config for apps/dev

```css
:root {
  --background: hsl(0 0% 97.2549%);
  --foreground: hsl(240 3.3333% 11.7647%);
}

.dark {
  --background: hsl(0 0% 7.0588%);
  --foreground: hsl(0 0% 87.8431%);
}
```

- [ ] Hint: sync with shadcn.css; use CSS variables; live preview via `:root` injection

---

## 3. Later (Phase 2+)

- [ ] `/docs/registry` — CDN registry documentation
- [ ] `/docs/mcp` — MCP server usage

---

## 4. React output quality

- [ ] All blocks → `dist/react/` — no DSL, clean JSX
- [ ] Typed props: `export interface XProps { ... }`
- [ ] shadcn-style theming: CSS variables, tokens
- [ ] `data-class` on all elements for CSS generation
- [ ] Hint: `bun run generate`; validate output manually

---

## 5. Component inventory

### Blocks (page sections)

- [x] HeroBlock
- [x] FeaturesBlock
- [x] CTABlock
- [x] PricingBlock
- [x] TestimonialsBlock
- [x] DashboardBlock
- [ ] ExamplesBlock (hero + examples grid)
- [ ] TasksBlock
- [ ] PlaygroundBlock
- [ ] AuthBlock (login, register, forgot password)

### Layouts

- [x] MainLayout
- [x] DashLayout

### Partials

- [x] Header
- [x] Footer
- [x] Sidebar

### Core components to showcase (from @ui8kit/core)

- [ ] Block, Stack, Group, Box, Container
- [ ] Grid, Card
- [ ] Title, Text
- [ ] Button, Badge
- [ ] Image, Icon
- [ ] Accordion, Sheet

---

## 6. Checklist by priority

### Phase 1: MainLayout + routing

| # | Task | Hint |
|---|------|------|
| 1 | Add nested routes: /examples, /examples/dashboard, etc. | React Router, nested routes, Layout wrapper |
| 2 | Create ExamplesBlock | Hero + grid of common components |
| 3 | Add /blocks route | Dedicated blocks showcase page |
| 4 | Update navItems in @ui8kit/data | Include all sections |

### Phase 2: DashLayout + docs

| # | Task | Hint |
|---|------|------|
| 5 | /docs route | Introduction, motivation |
| 6 | /docs/components | All core components, variants |
| 7 | /docs/installation | Static content |

### Phase 3: Theme builder

| # | Task | Hint |
|---|------|------|
| 8 | /create page | Visual builder UI |
| 9 | Design token controls | Spacing, radii, colors |
| 10 | CSS output | Copy-paste :root / .dark |
| 11 | Live preview | Inject styles in dev mode |

### Phase 4: CDN + MCP

| # | Task | Hint |
|---|------|------|
| 12 | registry.json format | From generator output |
| 13 | MCP server tools | list blocks, add block, configure props |
| 14 | docs/registry, docs/mcp | Documentation pages |

---

## 7. File structure (apps/engine)

```
src/
├── App.tsx              # Routes: /, /examples/*, /blocks, /docs/*, /create
├── blocks/
│   ├── ExamplesBlock.tsx
│   ├── TasksBlock.tsx
│   ├── PlaygroundBlock.tsx
│   ├── AuthBlock.tsx
│   └── ...
├── layouts/
│   ├── MainLayout.tsx    # Landing
│   └── DashLayout.tsx    # Docs
├── partials/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Sidebar.tsx
├── routes/
│   ├── HomePage.tsx
│   ├── ExamplesPage.tsx
│   ├── BlocksPage.tsx
│   ├── DocsPage.tsx
│   ├── DocsComponentsPage.tsx
│   ├── DocsInstallationPage.tsx
│   ├── CreatePage.tsx
│   └── ...
└── main.tsx
```

---

## 8. Pipeline summary

```
apps/engine (DSL + @ui8kit/core)
    │
    ├── bun run generate --engine react
    │
    ▼
dist/react/ (enterprise React, shadcn-style theming)
    │
    ├── CDN registry.json
    │
    ▼
MCP server → apps/web, apps/docs

apps/dev (temporary) → 1:1 comparison during development
```
