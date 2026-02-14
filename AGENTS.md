# AGENTS Guide (UI8Kit Framework Presentation)

Use this guide for AI agents (especially weaker/faster LLMs) to achieve high-quality results from the first prompt.

## 1) Project Goal

Build a presentation website for the UI8Kit framework in English:

- Home page (hero + key value proposition)
- Blog section with exactly 3 posts:
  - architecture principles
  - props-driven approach
  - constrained Tailwind classes + shadcn design tokens
- Showcase section with exactly 3 projects (single-page style cards with short descriptions)
- Admin area with local JSON import/export only
- Theme switching (light/dark) is required

## 2) Required Technical Constraints

1. Route/page source of truth: `packages/data/src/fixtures/shared/page.json` (`page` model first).
2. Internal links in UI should use domain-aware navigation patterns (`DomainNavButton` where applicable).
3. Theme toggle must integrate with `apps/engine/src/providers/theme.tsx`.
4. Color direction is violet-first and must be reflected in `apps/engine/src/css/shadcn.css`.
5. Keep compatibility of `@ui8kit/data` context APIs used by Engine.

## 3) Required Reading Before Editing

- `apps/engine/PIPELINE.md`
- `packages/data/src/index.ts`
- `packages/data/src/types.ts`
- `packages/data/src/fixtures/shared/page.json`
- `apps/engine/src/App.tsx`
- `apps/engine/src/layouts/*`
- `apps/engine/src/blocks/**/*`
- `apps/engine/src/providers/theme.tsx`
- `apps/engine/src/css/shadcn.css`

## 4) Recommended Work Order

1. Update page map and navigation data.
2. Add/adjust presentation content fixtures (home, blog, showcase, admin).
3. Refactor Engine blocks/layouts/routes to match the new IA.
4. Wire and verify theme toggle behavior through provider.
5. Tune shadcn tokens to a violet tonal palette (light + dark).
6. Run lint/type checks and fix violations.
7. Update docs briefly if behavior/contracts changed.

## 4.1) Stage Gates for DSL + Lint Discipline (Required)

Use staged quality gates to keep high delivery speed and architectural cleanliness:

- **Start phase (fast delivery)**:
  - prioritize feature delivery and working user flows
  - avoid premature heavy cleanup that blocks momentum

- **After each meaningful chunk** (for example: landing/menu/recipes/blog/admin):
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

## 5) Verification Checklist

- No broken internal routes.
- Theme toggle works and persists correctly.
- Violet palette is applied consistently in light and dark modes.
- Blog has 3 posts, showcase has 3 projects.
- DSL/lint/type checks pass for changed scope.

If any script is unavailable, report it and provide the closest safe alternative command.

## 6) Response Format (Required)

1. PLAN
2. CHANGES (file-by-file)
3. VERIFICATION (commands + outcomes)
4. RISKS / FOLLOW-UPS

## 7) Anti-Hallucination Rules

- Do not invent files, scripts, or APIs.
- Do not claim checks were run if they were not.
- If uncertain, choose the minimal safe change and state assumptions clearly.
