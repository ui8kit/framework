# AGENTS.md

Instructions for AI coding agents working with this codebase.

---

## Project Overview

**UI8Kit Framework** — A comprehensive UI system providing both React components and semantic HTML5/CSS3 utilities. This monorepo uses Turbo for orchestration.

## Architecture

### Applications
- **`@ui8kit/vite-local`** — Local development environment for components, layouts, and documentation (not for web deployment)
- **`@ui8kit/create-html`** — Static site generator that converts React routes to pure HTML5/CSS3 for web publishing

### Framework Capabilities
- **React Components** — Type-safe UI components with utility props
- **HTML5/CSS3 Semantics** — Bootstrap/Uikit3-style semantic classes (e.g., `button button-primary`)
- **Utility Props System** — Strict validation via `utility-props.map.ts`
- **Component Variants** — Button, badge, card, grid, image variants only

## Development Workflow

1. **Local Development** — Use `@ui8kit/vite-local` for component development and documentation
2. **Static Generation** — Run `bun run html` to generate pure HTML from React routes
3. **Web Publishing** — Deploy generated HTML files for production

## Three Rules to Follow

This project uses three Cursor rules in `.cursor/rules/`:

### ⚠️ UI8Kit Props Refactoring Notice
**After recent props updates, some components may have incorrect prop usage.**

**Quick Check**: Look for TypeScript errors like `"span-1 lg:col-span-1" cannot be assigned to UtilityPropInput<"col">`

**Fix**: Move responsive modifiers from props to className:
```tsx
// Wrong:
<Box col="span-1 lg:span-3" />

// Right:
<Box col="span-1" className="lg:col-span-3" />
```

### 🔧 UI8Kit Architecture Principles

**DECLARATIVE RULES - Follow these principles for all UI8Kit usage:**

1. **Single Value Props Only (Tailwind Mapping)**
   - All component props MUST contain single values from utility-props.map.ts
   - Props map directly to Tailwind classes: `col="span-1"` → `col-span-1`, `text="center"` → `text-center`
   - No responsive modifiers allowed in props (e.g., no `col="span-1 lg:span-3"`)
   - TypeScript will enforce this through UtilityPropInput validation

2. **className Usage Restriction**
   - className is FORBIDDEN on all components except Grid components
   - Grid components MAY use className ONLY for responsive layout modifiers
   - Custom styling requires className + mandatory data-class attribute

3. **Utility Props as Source of Truth**
   - Every visual property must come from utility-props.map.ts definitions
   - No custom variants creation for basic utility props
   - Component-specific variants exist only for button, badge, card, grid, image

4. **TypeScript Error Resolution**
   - TypeScript errors indicate prop validation failures
   - Always trust TypeScript over assumptions
   - Fix by using correct single values from utility-props.map.ts

5. **Grid Component Special Rules**
   - Grid components use cols prop for responsive grid definitions
   - Grid children may use className for breakpoint-specific overrides
   - Maintain semantic data-class attributes for all custom className usage

6. **Custom Styling Protocol**
   - When utility-props.map.ts lacks required property
   - Use className with semantic data-class attribute
   - Prefer utility props over custom className when possible

7. **Duplicate Prop Prevention**
   - HTML/React doesn't allow duplicate attributes in single element
   - Use parent containers for layout/alignment (e.g., `Stack items="center"`)
   - Use `style={{ }}` only as last resort for unsupported properties

**ENFORCEMENT**: These rules are validated by TypeScript compilation. Breaking them results in build failures.

See `.cursor/rules/ui8kit.mdc` for complete rules and examples.