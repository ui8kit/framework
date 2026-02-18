# AGENTS Guide (English)

This document is the default instruction set for AI agents working in this repository, especially weaker/faster LLMs.

Use it when starting from a clean clone with minimal context.

---

## 1) Repository Baseline Assumptions

- The repository may be a fresh clone.
- `node_modules` may be missing.
- You may have only `apps/engine` and `packages/*` as active source of truth.
- `apps/dev` and `apps/test` may be absent or stale.
- Never assume scripts or files exist without checking.

---

## 2) Product Target: Restaurant Website

The target site should cover:

- Landing page (home)
- Menu (dish cards)
- Recipes (article-style recipe pages)
- Blog
- Promotions
- Admin area (local JSON import/export only; no backend required now)

---

## 3) Non-Negotiable Architecture Rules

1. **Route source of truth**
   - Internal page map must be defined in `apps/engine/src/data/src/fixtures/shared/page.json`.
   - Prefer `page` model. Keep `routes` only as backward-compatible alias.

2. **Domain-aware navigation**
   - Use `DomainNavButton` for internal links in components.
   - For custom behavior, use `context.resolveNavigation(href)` and/or `context.navigation.isEnabled(href)`.
   - Soft policy only:
     - available route -> normal navigation
     - unavailable route in current domain build -> disabled + tooltip `Not available in this domain build`

3. **Data contract parity**
   - Maintain compatibility for:
     - `context.page`
     - `getPageByPath`
     - `getPagesByDomain`
     - `resolveNavigation`
     - `navigation`

4. **Minimal, safe refactors**
   - Change only what is required for the task.
   - Avoid broad unrelated rewrites.
   - Preserve existing APIs unless migration is explicitly included.

---

## 4) Required Reading Before Changes

Read these files first:

- `apps/engine/PIPELINE.md`
- `apps/engine/src/data/src/index.ts`
- `apps/engine/src/data/src/types.ts`
- `apps/engine/src/data/src/fixtures/shared/page.json`
- `apps/engine/src/App.tsx`
- `apps/engine/src/layouts/*`
- `apps/engine/src/blocks/**/*`
- `apps/engine/src/partials/DomainNavButton.tsx` (if present)

---

## 5) Recommended Execution Order

1. Define/adjust restaurant page map in shared `page.json`.
2. Organize fixtures by shared vs domain data.
3. Update `@ui8kit/data` types/context only where needed.
4. Refactor Engine layouts/routes/blocks for restaurant sections.
5. Ensure internal navigation uses domain-aware soft policy.
6. Update docs with short maintainer notes.
7. Run verification commands and report outcomes.

---

## 6) Verification Checklist

Run what is available in the current clone:

- Typecheck affected packages/apps.
- Data bundle contract validation (if script exists).
- Spot-check internal links to ensure no hardcoded bypass around navigation policy.

If a command/script is missing, report it clearly and propose the closest safe alternative.

---

## 7) Output Format Required From Agent

When responding after implementation, use this structure:

1. **PLAN** (short numbered list)
2. **CHANGES** (file-by-file: what changed and why)
3. **VERIFICATION** (commands + outcomes)
4. **RISKS / FOLLOW-UPS** (only real unresolved items)
5. **BLOCKED** section only if truly blocked (with exact reason)

---

## 8) Anti-Hallucination Rules

- Do not invent files, commands, or package scripts.
- Do not assume runtime dependencies are installed.
- Do not claim verification that was not run.
- If uncertain, choose the safest minimal path and state assumptions explicitly.
