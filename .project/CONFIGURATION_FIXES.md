# Configuration Fixes and Updates

This document summarizes all configuration fixes and updates made to the UI8Kit framework.

## 1. TypeScript Path Aliases

### Updated Files

- **apps/web/tsconfig.json** - Added path aliases for all @ui8kit packages
- **apps/engine/tsconfig.json** - Added path aliases for all @ui8kit packages
- **packages/blocks/vite.config.ts** - Added `.ts` extensions to path aliases

### Path Configuration

All applications now have consistent path aliases:

```json
{
  "@/*": ["src/*"],
  "@ui8kit/core": ["../../packages/core/src/index.ts"],
  "@ui8kit/template": ["../../packages/template/src/index.ts"],
  "@ui8kit/blocks": ["../../packages/blocks/src/index.ts"],
  "@ui8kit/data": ["../../packages/data/src/index.ts"]
}
```

## 2. Vite Configuration Updates

### apps/web/vite.config.ts
- Added aliases for @ui8kit/blocks and @ui8kit/data
- Updated @ui8kit/core and @ui8kit/template to include `.ts` extensions

### apps/engine/vite.config.ts
- Added aliases for @ui8kit/blocks and @ui8kit/data
- Updated all aliases to include `.ts` extensions

## 3. Import Cleanup

### apps/web
- Updated `App.tsx` to use MainLayout from `@ui8kit/blocks` instead of local import
- Updated `src/layouts/MainLayout.tsx` to import partials from `@ui8kit/blocks`
- Deleted duplicate blocks (HeroBlock, FeaturesBlock, CTABlock, PricingBlock, TestimonialsBlock, DashboardBlock)
- Deleted duplicate partials (Header, Footer, Sidebar)
- Deleted duplicate layouts (DashLayout)

### apps/engine
- Maintained clean imports using packages
- Added comment to old components index to clarify they're examples

## 4. Package Configuration

### packages/blocks
- Fixed vite.config.ts path aliases to include `.ts` extensions
- Created IMPORTS.md documentation for proper import usage
- Updated blocks to fix type errors and hardcoded array references

### packages/data
- Updated build script to use TypeScript instead of shell commands (cross-platform compatibility)

## 5. Type Safety Fixes

### packages/blocks/src/blocks/

#### FeaturesBlock.tsx
- Removed undefined Icon component reference
- Removed hardcoded array indexing in conditionals
- Fixed type errors in Icon usage

#### TestimonialsBlock.tsx
- Fixed Image component src prop with fallback empty string
- Fixed alt prop to use literal string
- Improved type safety in conditional checks

#### PricingBlock.tsx
- Fixed hardcoded array indexing in featured and description conditionals
- Improved nested Loop data prop handling

## 6. Exported Types

All key types are now properly exported from @ui8kit/blocks:

```typescript
// Blocks
HeroBlockProps
FeaturesBlockProps, Feature
CTABlockProps
PricingBlockProps, PricingPlan
TestimonialsBlockProps, Testimonial
DashboardBlockProps

// Layouts
MainLayoutProps, LayoutMode
DashboardProps

// Partials
HeaderProps, NavItem
FooterProps, FooterSection, FooterLink
SidebarProps
```

## 7. Build and Development Workflow

### Build Process
```bash
npm run build          # Build all packages
npm run build:js      # Build TypeScript only
```

### Development
```bash
npm run dev           # Start dev servers
npm run typecheck     # Type checking
npm run lint          # Linting
```

### Template Generation
```bash
npm run generate      # Generate templates
npm run generate:web  # Generate for web
npm run generate:engine # Generate for engine
```

## 8. Migration Guide

If adding new applications, ensure:

1. **tsconfig.json** includes all path aliases
2. **vite.config.ts** includes all path aliases with `.ts` extensions
3. **package.json** includes dependencies:
   - `@ui8kit/blocks: workspace:*`
   - `@ui8kit/data: workspace:*`
   - `@ui8kit/core: workspace:*` (if using components directly)
   - `@ui8kit/template: workspace:*` (if using DSL)

4. Import blocks and data from packages, not locally:
   ```typescript
   import { HeroBlock, FeaturesBlock } from '@ui8kit/blocks';
   import { fixtures } from '@ui8kit/data';
   ```

## 9. Known Limitations

- Icon mapping in FeaturesBlock requires string-to-component conversion (requires plugin system)
- Nested Loop iteration context not directly accessible in DSL (requires generator support)
- Some type safety patterns may need adjustment as generator evolves

## 10. Next Steps

1. Test build process: `npm run build`
2. Run dev server: `npm run dev`
3. Generate templates: `npm run generate`
4. Validate generated output matches expected format
5. Add E2E tests for consistency between React and generated templates
