# UI8Kit Dev App

Runtime application used as the primary target for local pipeline sync from `apps/engine`.

## Internal Navigation Checklist (Domain Builds)

Use this checklist when changing routes, tabs, header links, or sidebars:

1. Update the page model in `packages/data/src/fixtures/shared/page.json`.
2. Keep links data-driven (`context.navItems`, domain sidebars), avoid hardcoded internal paths when possible.
3. In UI components, use `DomainNavButton` for internal navigation.
4. If a component cannot use `DomainNavButton`, use:
   - `context.resolveNavigation(href)`
   - `context.navigation.isEnabled(href)`
   and keep soft policy behavior (`disabled` + tooltip `Not available in this domain build`).
5. Re-run pipeline sync for the target domain/app and validate:
   - `bun run scripts/pipeline-app.ts sync --target dev --domain <domain> --data-mode <local|shared>`
   - `bun run validate:data-bundle -- --target dev`
