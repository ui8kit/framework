# AGENTS Guide (UI8Kit Framework Presentation)

Use this guide for AI agents (especially weaker/faster LLMs) to achieve high-quality results from the first prompt.

## 1) Project Goal

Build a presentation website for the UI8Kit framework in English:

- Home page (hero + key value proposition)
- **Components** section — core UI primitives and layout blocks (grid of cards)
- **Guides** section — step-by-step tutorials (list + detail pages with slug)
- Blog section with exactly 3 posts:
  - architecture principles
  - props-driven approach
  - constrained Tailwind classes + shadcn design tokens
- **Showcase** section with exactly 3 projects (single-page style cards with short descriptions)
- Admin area with local JSON import/export only
- Theme switching (light/dark) is required

**Domain terminology:** Use Components, Guides, Showcase — no restaurant/bar/menu/recipes/promotions terminology in user-facing content or layout fallbacks.

## 2) Route and Domain Mapping (Source of Truth)

| Route           | Domain Key   | Fixture File    | Context Key  |
|-----------------|--------------|-----------------|--------------|
| `/components`   | components   | components.json | context.components |
| `/guides`       | guides       | guides.json     | context.guides |
| `/guides/:slug` | guides       | guides.json     | context.guides.guides |
| `/blog`         | blog         | blog.json       | context.blog |
| `/blog/:slug`   | blog         | blog.json       | context.blog.posts |
| `/showcase`     | showcase     | showcase.json   | context.showcase |

When adding or renaming routes, update **all** of: `page.json`, `navigation.json`, `App.tsx`, route components, block views, `packages/data` context, `admin.json` exportSchema, `scripts/bundle-data.ts` DOMAIN_FIXTURE_FILES, and `AdminDashboardPageView` export keys.

## 3) Required Technical Constraints

1. Route/page source of truth: `packages/data/src/fixtures/shared/page.json` (`page` model first).
2. Internal links in UI should use domain-aware navigation patterns (`DomainNavButton` where applicable).
3. Theme toggle must integrate with `apps/engine/src/providers/theme.tsx`.
4. Color direction is violet-first and must be reflected in `apps/engine/src/css/shadcn.css`.
5. Keep compatibility of `@ui8kit/data` context APIs used by Engine.
6. Layout fallbacks (e.g. `MainLayoutView` headerSubtitle) must use "Design System" or similar — never "Restaurant & Bar" or other legacy labels.

## 4) Required Reading Before Editing

- `apps/engine/PIPELINE.md`
- `packages/data/src/index.ts`
- `packages/data/src/types.ts`
- `packages/data/src/fixtures/shared/page.json`
- `apps/engine/src/App.tsx`
- `apps/engine/src/layouts/*`
- `apps/engine/src/blocks/**/*`
- `apps/engine/src/providers/theme.tsx`
- `apps/engine/src/css/shadcn.css`

## 5) Recommended Work Order

1. Update page map and navigation data.
2. Add/adjust presentation content fixtures (components, guides, blog, showcase, admin).
3. Refactor Engine blocks/layouts/routes to match the new IA.
4. Wire and verify theme toggle behavior through provider.
5. Tune shadcn tokens to a violet tonal palette (light + dark).
6. Run lint/type checks and fix violations.
7. Update docs briefly if behavior/contracts changed.

## 5.1) Stage Gates for DSL + Lint Discipline (Required)

Use staged quality gates to keep high delivery speed and architectural cleanliness:

- **Start phase (fast delivery)**:
  - prioritize feature delivery and working user flows
  - avoid premature heavy cleanup that blocks momentum

- **After each meaningful chunk** (e.g. landing/components/guides/blog/showcase/admin):
  - run DSL lint and type checks
  - fix violations before moving to the next chunk

- **Before finalization**:
  - enforce strict mode: zero DSL lint violations
  - enforce whitelist utility props only

This staged gate model is mandatory because it balances speed and consistency.

### Prompt Policy (must be included in task prompts)

- "Use DSL markup by default for all UI blocks/layouts."
- "No custom/non-whitelist utility props."
- "Run lint/type checks after each domain chunk."
- "Do not proceed to next chunk until lint is clean (or explicitly report blockers)."

## 5.2) LLM Refactor Guardrails (Required)

When performing brand/domain refactors with AI agents, treat this as mandatory protocol:

1. Read and follow `.manual/_brand-migration-spec.md`.
2. Use dictionary-based replacements from `.manual/brand-mapping.json`.
3. Run:
   - `bun run quality:local`
   - `bun run audit:refactor`
   - `bun run validate:invariants`
4. Keep generated audit/invariant reports under `.cursor/reports/` for review.
5. Do not mark refactor complete if residual legacy terms remain without explicit justification.

## 6) Data Layer Consistency

When changing routes or domain names:

1. **Fixtures:** `components.json` (uses `items`), `guides.json` (uses `guides`), `showcase.json` (uses `projects`) — array names align with domain labels.
2. **Context:** `packages/data/src/index.ts` exposes `components`, `guides`, `showcase`; `getPageByPath` and `matchesDynamicRoute` must handle `/guides/:slug`.
3. **Admin:** `admin.json` exportSchema and `AdminDashboardPageView` handleExport must use the same keys as context.
4. **Bundle script:** `scripts/bundle-data.ts` DOMAIN_FIXTURE_FILES must list all domain fixtures used by the app.

### 6.1 Fixture Ownership Policy (SDK-first)

- New brand work should keep fixture JSON inside the app repository (for example `apps/engine/fixtures`).
- Treat `@ui8kit/data` fixtures as compatibility fallback, not as source of truth for new brands.
- Prefer app-local context wiring (`src/data/context.ts`) built via SDK/data contracts.

## 7) Verification Checklist

- No broken internal routes.
- Theme toggle works and persists correctly.
- Violet palette is applied consistently in light and dark modes.
- Blog has 3 posts, showcase has 3 projects.
- DSL/lint/type checks pass for changed scope.
- No restaurant/bar/menu/recipes/promotions terminology in UI or layout fallbacks.

If any script is unavailable, report it and provide the closest safe alternative command.

## 8) Response Format (Required)

1. PLAN
2. CHANGES (file-by-file)
3. VERIFICATION (commands + outcomes)
4. RISKS / FOLLOW-UPS

## 9) Anti-Hallucination Rules

- Do not invent files, scripts, or APIs.
- Do not claim checks were run if they were not.
- If uncertain, choose the minimal safe change and state assumptions clearly.

## 10) Example Task Prompts

For route/domain refactors (e.g. menu→components, recipes→guides, promotions→showcase):

> "Change routes: menu → components, recipes → guides, promotions → showcase. Update page.json, navigation.json, App.tsx, route components, block views, packages/data context, admin.json exportSchema, bundle-data.ts, and AdminDashboardPageView. Remove all restaurant-related terminology from layout fallbacks and UI. Use DSL markup. Run lint after each chunk."

For theme/terminology cleanup:

> "Replace any remaining restaurant/bar/menu/recipes/promotions references with UI8Kit domain terms (components, guides, showcase). Check MainLayoutView, AdminDashboardPageView, admin.json, and fixture content."
