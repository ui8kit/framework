# Changelog: apps/dev — engine templates integration

What was added or changed in `apps/dev/src` to run the same UI as apps/engine using templates from `engine/dist/react`, and what is still missing for a full app launch.

---

## 1. Source of files

| Area        | Source              | Notes |
|------------|---------------------|--------|
| **blocks/** | engine/dist/react    | Copied; have props, React import, Link children. Some fixes applied after copy (see below). |
| **layouts/** | engine/dist/react   | MainLayout (inlined conditions), DashLayout (single component); Sidebar gets children in dist. |
| **partials/** | engine/dist/react   | Header, Footer, Sidebar — from dist with props. |
| **routes/** | engine/dist/react   | WebsitePage, DashboardPage — valid syntax (generator emits no invalid prop names); DashboardPage may need children added in JSX if not in source. |

Templates are synced from engine by running from repo root:

```bash
bun run scripts/copy-templates-to-dev.ts
```

Then manual fixes are applied in dev (this changelog and code comments).

---

## 2. Fixes applied in dev (this pass)

### Routes (syntax)

- **WebsitePage.tsx** — Generator had emitted invalid destructuring (`const { <SidebarContent ... } = props`). Replaced with no props: `export function WebsitePage() { return (...); }`.
- **DashboardPage.tsx** — Same fix for destructuring; added missing layout children: `<Stack><DashboardBlock {...context.dashboard} /></Stack>` inside `<DashLayout>`.

### MainLayout

- **Previous manual fixes** — Derived vars and Sidebar children are now emitted by the generator (engine MainLayout uses inlined expressions; Include keeps children). If you copied an older dist, you may have added `hasSidebar`/`isSidebarLeft` and `<Sidebar>{sidebar}</Sidebar>` in dev; newer copy from dist should already have them.

### DashLayout

- **Previous manual fix** — Engine now has a single `DashLayout` component with full body; dist is no longer a stub. If you have a hand-written DashLayout in dev, you can replace it by copying from `engine/dist/react/layouts/DashLayout.tsx`.

### Blocks (small fixes)

- **HeroBlock.tsx** — Added `extra` to destructured props (used in JSX as `extra ?? children`).
- **TestimonialsBlock.tsx** — Fixed concatenation: `{testimonial.role}at{testimonial.company}` → `{testimonial.role} at {testimonial.company}`.

---

## 3. Index and re-exports

- **partials/index.ts** — Exports `NavItem`, `FooterSection`, `FooterLink`, `Header`, `Footer`, `Sidebar`.
- **layouts/index.ts** — Exports `MainLayout`, `DashLayout`.
- **blocks/index.ts** — Re-exports all block components (CTABlock, DashboardBlock, DashSidebar, etc.).

---

## 4. App entry and routing

- **App.tsx** — Routes: `/` → `WebsitePage`, `/dashboard` → `DashboardPage`.
- **main.tsx** — `BrowserRouter`, `StrictMode`, `App`, CSS `@/css/index.css`, mount to `#app`.

---

## 5. Config and deps

- **vite.config.ts** — Alias `@` → `src` (so `@/layouts`, `@/blocks`, `@/routes`, `@/css` resolve).
- **package.json** — Dependencies include `@ui8kit/core`, `@ui8kit/blocks`, `@ui8kit/data`, `react`, `react-router-dom`.

---

## 6. Generator improvements (copy-paste ready)

Done in engine/generator/data pass:

- **Route props** — Only valid JS identifiers are emitted as prop names; invalid/JSX-like vars are filtered out, so route components get `export function Page()` with no broken destructuring.
- **MainLayout** — Derived logic inlined in JSX (`(mode === 'with-sidebar' || mode === 'sidebar-left') && sidebar`, `mode === 'sidebar-left'`), so no top-level `const` is needed in dist.
- **DashLayout** — Single component with full body in engine source; dist emits real layout (sidebar + main + Header/Footer + children).
- **Include children** — Partial components keep their children in HAST; React plugin emits `<Sidebar>{sidebar}</Sidebar>` so layout sidebar content is preserved.
- **Data** — `@ui8kit/data` exports `context` and type `AppContext`; README documents usage for generated templates.

### Second pass improvements

- **Spread attributes** — `{...context.hero}` preserved in generated includes; route children (HeroBlock, FeaturesBlock, etc.) keep their spread props in dist.
- **Component name casing** — `CTABlock` stays `CTABlock` (not `Ctablock`). Fixed PascalCase→kebab→PascalCase round-trip by storing `originalName` in `GenInclude` and using it in ReactPlugin.
- **Text nodes** — Spaces between expressions preserved: `{role} at {company}` no longer becomes `{role}at{company}`. Fixed `transformJsxText` to not trim meaningful whitespace.
- **TypeScript prop types** — Generated components now have typed interfaces: `interface CTABlockProps { title?: string; ... }` + `function CTABlock(props: CTABlockProps)`. Unknown external types (NavItem[], LayoutMode) are replaced with `any` so output compiles standalone.
- **Architecture** — `GenInclude.originalName` preserves component identity through the pipeline. Spread attributes stored as `__spread_*` keys in include props, emitted as `{...expr}` by ReactPlugin.

After copying from `engine/dist/react`, you still need: index re-exports, App.tsx routes, main.tsx, vite alias `@` → src, and `@/css/index.css`. Optional: registry.json for tooling.

---

## 7. Lint and typecheck

After copying templates and applying fixes, run:

```bash
cd apps/dev && bun run typecheck
# or project-wide lint if configured
```

Syntax and type issues found in this pass were fixed as listed in §2.
