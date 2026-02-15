# UI8Kit Framework

**Zero-Overhead UI System for Rapid Prototyping & Static Site Generation**

A design-system-first React component library with strict utility props, semantic CSS output, and brandbook-ready static generation. Inspired by shadcn's component philosophy and Spectre CSS's minimal JavaScript approach.

## Philosophy

> **Every line of code must justify its existence.**

UI8Kit is built on three core principles:

1. **Constrained by Design** — Limited Tailwind subset, no arbitrary values
2. **CSS-First Interactivity** — `:checked`, `:target`, `:focus-within` over JavaScript
3. **Semantic Output** — `data-class` attributes for meaningful CSS selectors

## Key Features

### Smart Utility Props

Props map directly to Tailwind classes with strict TypeScript validation:

```tsx
// Props are the first part of the Tailwind class (before the hyphen)
<Box bg="primary" text="lg" p="4" rounded="lg" />
//    ↓           ↓         ↓      ↓
// bg-primary  text-lg    p-4   rounded-lg

// Only values from utility-props.map.ts are allowed
<Stack gap="6" items="center" justify="between" />
//     ↓          ↓              ↓
//   gap-6   items-center   justify-between
```

**No modifiers. No arbitrary values. No exceptions.**

```tsx
// ❌ FORBIDDEN - modifiers in props
<Box col="span-1 lg:span-3" />

// ✅ CORRECT - single values only
<Box col="span-1" className="lg:col-span-3" />
```

### Curated Class Whitelist

Instead of Tailwind's 1000+ utilities, UI8Kit uses a ~500-class whitelist:

```json
{
  "border-l": "border-left-width: 1px;",
  "bg-primary": "background-color: var(--primary);",
  "text-muted-foreground": "color: var(--muted-foreground);",
  "gap-6": "gap: calc(var(--spacing) * 6);"
}
```

Every class is:
- Mapped to pure CSS3 properties
- Available in both `@apply` and semantic modes
- Validated at compile time

### Design Tokens (shadcn-style)

CSS custom properties for consistent theming:

```css
:root {
  --background: hsl(0 0% 97.2549%);
  --foreground: hsl(240 3.3333% 11.7647%);
  --primary: hsl(187.4739 173.4032% 31.3580%);
  --primary-foreground: hsl(0 0% 100%);
  --muted: hsl(0 0% 94.1176%);
  --accent: hsl(203.9916 96.5418% 93.6698%);
  --radius: 0.625rem;
  --spacing: 0.25rem;
}

.dark {
  --background: hsl(0 0% 7.0588%);
  --foreground: hsl(0 0% 87.8431%);
  /* ... dark mode overrides */
}
```

### CSS-Only Interactivity

Following Spectre CSS's philosophy — minimal JavaScript, maximum CSS:

```css
/* Accordion using :checked */
.accordion-toggle:checked ~ .accordion-content {
  max-height: 500px;
  opacity: 1;
}

/* Tabs using :target */
.tab-content:target {
  display: block;
}

/* Dropdown using :focus-within */
.dropdown:focus-within .dropdown-menu {
  opacity: 1;
  visibility: visible;
}
```

### Semantic HTML5 Architecture

```tsx
// Blocks generate proper semantic HTML
<Block component="section" data-class="hero-section">
  <Stack gap="6" items="center">
    <Title text="4xl">Welcome</Title>
    <Text text="muted-foreground">Description</Text>
  </Stack>
</Block>
```

Output:
```html
<section data-class="hero-section" class="relative">
  <div data-class="stack" class="flex flex-col gap-6 items-center">
    <h1 data-class="title" class="text-4xl font-bold">Welcome</h1>
    <p data-class="text" class="text-muted-foreground">Description</p>
  </div>
</section>
```

## Dual CSS Output

### Mode 1: Tailwind `@apply`

```css
.hero-section {
  @apply relative;
}

.hero-title {
  @apply text-4xl font-bold;
}
```

### Mode 2: Pure CSS3 (Semantic)

```css
.hero-section {
  position: relative;
}

.hero-title {
  font-size: var(--text-4xl);
  font-weight: 700;
}
```

Both modes are generated from the same `ui8kit.map.json` class mapping.

## Zero Unused CSS

The generator includes UnCSS integration:

```typescript
uncss: {
  enabled: true,
  htmlFiles: ['./dist/html/**/*.html'],
  ignore: [':hover', ':focus', '.dark', ':root'],
}
```

Result: **Only CSS actually used in your HTML** — up to 77% reduction.

## Component Architecture

```
src/
├── components/ui/     # Primitives (strict props only)
│   ├── Box.tsx        # Base container
│   ├── Stack.tsx      # Flex column layout
│   ├── Text.tsx       # Typography
│   ├── Button.tsx     # Interactive button
│   └── ...
├── components/        # Composites (className + data-class allowed)
│   ├── Card.tsx
│   ├── Accordion.tsx
│   └── Sheet.tsx
├── blocks/            # Page sections (semantic HTML5)
│   ├── HeroBlock.tsx
│   └── FeaturesBlock.tsx
├── layouts/           # Page structure
│   └── DashLayout.tsx
└── variants/          # CVA variant definitions
    ├── button.ts
    └── badge.ts
```

## Quick Start (Local UNIX)

```bash
# Clone and install
git clone https://github.com/user/ui8kit-framework
cd ui8kit-framework
bun install

# Development (Vite + HMR)
cd apps/engine
bun run dev

# Run local quality checks
cd ../..
bun run quality:local
```

## Roadmap

### shadcn-Style Examples

We plan to provide extensive copy-paste examples like shadcn/ui:

- Dashboard layouts
- Authentication forms
- Data tables
- Marketing sections
- E-commerce components

### CSS-Only Components

Following Spectre CSS's minimal-JS philosophy:

- [ ] Accordion (`:checked`)
- [ ] Tabs (`:target`)
- [ ] Dropdown (`:focus-within`)
- [ ] Modal (`:target`)
- [ ] Tooltip (`:hover` + `::after`)
- [ ] Toggle (`:checked` + `::before`)

## Project Structure

```
ui8kit-framework/
├── apps/
│   └── engine/        # Main presentation app + generator source
├── packages/
│   ├── data/          # Source-of-truth fixtures + typed context
│   ├── generator/     # Static site generator pipeline
│   ├── blocks/        # UI blocks and page views
│   ├── core/          # Core primitives and helpers
│   ├── lint/          # DSL and repository linting
│   ├── mdx-react/     # MDX processing
│   └── template/      # Template primitives
└── .cursor/rules/     # Architecture documentation
```

## Why UI8Kit?

| Feature | UI8Kit | Tailwind | shadcn/ui |
|---------|--------|----------|-----------|
| Curated classes | ✅ ~500 | ❌ 1000+ | N/A |
| Pure CSS output | ✅ | ❌ | ❌ |
| Smart props | ✅ | ❌ | ❌ |
| Semantic selectors | ✅ | ❌ | ❌ |
| CSS-only interactivity | ✅ | ❌ | ❌ |
| Static generation | ✅ | ❌ | ❌ |
| Design tokens | ✅ | ✅ | ✅ |
| TypeScript validation | ✅ | ❌ | ✅ |

## Use Cases

- **Rapid Prototyping** — Constrained props prevent bikeshedding
- **Brand Guidelines** — Curated whitelist enforces consistency
- **Static Sites** — Semantic HTML + optimized CSS
- **Design Systems** — Token-based theming
- **Email Templates** — Pure CSS3 output (inline mode)

## Related Documentation

- [Generator Package](packages/generator/README.md)
- [Engine Pipeline Guide](apps/engine/PIPELINE.md)
- [Engine README](apps/engine/README.md)
- [Architecture Rules](.cursor/rules/ui8kit-architecture.mdc)
- [UI8Kit Best Practices](.cursor/rules/best-practices.mdc)

## Domain Navigation Rules (Internal)

For domain-specific builds (`website`, `admin`), keep navigation deterministic:

- Route source of truth: `packages/data/src/fixtures/shared/page.json`
- UI internal links: use `DomainNavButton` (engine partial)
- Custom checks: `context.resolveNavigation(href)` / `context.navigation.isEnabled(href)`
- Policy mode: soft only -> render disabled state with tooltip `Not available in this domain build`
- Validate after sync: `bun run validate:data-bundle -- --target <app>`

## Domain Model And Invariants

- Domain set is fixed to `website` and `admin` in `packages/data/src/fixtures/shared/page.json`.
- Dynamic routes are explicitly modeled as `/guides/:slug` and `/blog/:slug`.
- `@ui8kit/data` is the only source for runtime context consumed by engine blocks/layouts/routes.
- Route/domain changes must be applied consistently in fixtures, context exports, scripts, and tests.

## License

GPL-3.0
