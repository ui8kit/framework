# AGENTS.md

Instructions for AI coding agents working with this codebase.

---

## Project Overview

**UI8Kit Framework** — A comprehensive UI system providing both React components and semantic HTML5/CSS3 utilities. This monorepo uses Turbo for orchestration.

## Architecture

### Applications
- **`@ui8kit/vite-local`** — Local development environment for components, layouts, and documentation (not for web deployment)
- **`@ui8kit/generator`** — Static site generator orchestrator that coordinates React rendering, CSS extraction, and HTML assembly

### Packages
- **`@ui8kit/render`** — React component renderer that converts React components to static HTML with `data-class` attributes
- **`@ui8kit/generator`** — Orchestrates the complete static generation pipeline (views → CSS → HTML → assets)

### Framework Capabilities
- **React Components** — Type-safe UI components with utility props
- **HTML5/CSS3 Semantics** — Bootstrap/Uikit3-style semantic classes (e.g., `button button-primary`)
- **Utility Props System** — Strict validation via `utility-props.map.ts`
- **Component Variants** — Button, badge, card, grid, image variants only

## Development Workflow

1. **Local Development** — Use `@ui8kit/vite-local` for component development and documentation
2. **Static Generation** — Run `bun run generate` to generate pure HTML from React routes
   - Generator calls `@ui8kit/render` to convert React components to HTML
   - Generates Liquid views with `data-class` attributes
   - Extracts CSS and generates stylesheets
   - Assembles final HTML pages using Liquid templates
3. **Web Publishing** — Deploy generated HTML files from `dist/html/` for production

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

---

## 🏗️ Static Site Generation Architecture

### Key Components

**`@ui8kit/render` Package:**
- Converts React components to static HTML markup
- Parses router configuration from `main.tsx` to discover routes
- Renders components **directly without context providers** (no RouterProvider, ThemeProvider)
- Preserves all `data-class` attributes in output HTML
- Uses `peerDependencies` for React (no direct dependencies)

**`@ui8kit/generator` Package:**
- Orchestrates the complete generation pipeline
- Delegates React rendering to `@ui8kit/render`
- Generates CSS from rendered HTML views
- Assembles final HTML using Liquid templates
- Configuration-driven (all paths from `generator.config.ts`)

### Generation Pipeline

1. **View Generation**: `generator` → `renderRoute()` → HTML with `data-class` → `.liquid` files
2. **CSS Generation**: Parse `.liquid` views → Extract classes → Generate `@apply` CSS + pure CSS3
3. **HTML Assembly**: Combine `.liquid` views with layouts → Final HTML pages
4. **Asset Copying**: Copy static files to output directories

### Critical Constraints for Agents

#### ⚠️ Component Rendering Limitations

**Components MUST NOT require React context during static generation:**

```tsx
// ❌ WON'T WORK - Requires ThemeProvider context
export function Component() {
  const { theme } = useTheme();  // Throws error without ThemeProvider
  return <div>{theme.name}</div>;
}

// ✅ WORKS - No context dependencies
export function Component() {
  return <div>Static content</div>;
}

// ✅ WORKS - Conditional context usage
export function Component() {
  const theme = useTheme?.() ?? defaultTheme;  // Fallback for static generation
  return <div>{theme.name}</div>;
}
```

**Why?** The renderer renders components directly without wrapping them in context providers:
```typescript
// Renderer implementation (simplified)
const Component = await loadComponent(entryPath, componentName);
const element = React.createElement(Component);  // No providers!
return renderToStaticMarkup(element);
```

#### 📋 Router Configuration Requirements

**`main.tsx` MUST use `createBrowserRouter` with `children` array:**

```tsx
// ✅ CORRECT - Renderer can parse this
export const router = createBrowserRouter({
  children: [
    { index: true, element: <HomePage /> },
    { path: 'about', element: <Blank /> }
  ]
});

// ❌ WON'T WORK - Renderer can't parse this
export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> }
]);
```

#### 🎯 Data-Class Attribute Requirements

**All components MUST use semantic `data-class` attributes:**

```tsx
// ✅ CORRECT - Semantic selectors for CSS generation
<Block component="section" data-class="hero-section">
  <Stack gap="6" items="center" data-class="hero-content">
    <Title text="4xl" data-class="hero-title">Welcome</Title>
  </Stack>
</Block>

// Generated CSS:
.hero-section { @apply relative; }
.hero-content { @apply flex flex-col gap-6 items-center; }
.hero-title { @apply text-4xl font-bold; }
```

#### 🔧 Configuration Structure

**`generator.config.ts` structure (no `render` section):**

```typescript
export const config: GeneratorConfig = {
  app: { name: string; lang?: string },
  css: {
    entryPath: './src/main.tsx',  // Router config source
    routes: string[],              // Routes to generate CSS for
    outputDir: './dist/css',
    pureCss?: boolean
  },
  html: {
    viewsDir: './views',
    routes: Record<string, RouteConfig>,  // Route configurations
    outputDir: './dist/html'
  },
  assets?: { copy?: string[] }
  // NO render section - renderer doesn't need provider config
};
```

### Common Pitfalls to Avoid

1. **❌ Don't use RouterProvider or ThemeProvider in renderer** - Components are rendered directly
2. **❌ Don't add `render` section to config** - Removed in refactoring, not needed
3. **❌ Don't use components with context hooks** - They won't work without providers
4. **❌ Don't hardcode paths** - All paths come from configuration
5. **❌ Don't forget `data-class` attributes** - Required for semantic CSS generation

### When Adding New Features

**For Generator (`@ui8kit/generator`):**
- ✅ Read from `GeneratorConfig` - no hardcoded values
- ✅ Delegate React rendering to `@ui8kit/render`
- ✅ Use peerDependencies for React (not direct dependencies)
- ✅ See `packages/generator/.cursor/rules/generator.mdc` for detailed rules

**For Renderer (`@ui8kit/render`):**
- ✅ Keep rendering simple - direct component rendering only
- ✅ No context providers - components must work standalone
- ✅ Parse router config from entry file
- ✅ See `packages/render/.cursor/rules/render.mdc` for detailed rules

**For Components:**
- ✅ Use `data-class` attributes for semantic CSS selectors
- ✅ Avoid context hooks (`useTheme`, `useRouter`) or provide fallbacks
- ✅ Export components properly (default or named)
- ✅ Follow UI8Kit props rules (see above)

---

## 📚 Additional Resources

- **Generator Rules**: `packages/generator/.cursor/rules/generator.mdc`
- **Renderer Rules**: `packages/render/.cursor/rules/render.mdc`
- **UI8Kit Rules**: `.cursor/rules/ui8kit.mdc`
- **Recent Refactoring**: `.project/report/render-refactoring-2025-01.md`
- **Generator README**: `packages/generator/README.md`