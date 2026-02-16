# Import Guide for @ui8kit/blocks

This guide explains how to properly import components from @ui8kit/blocks.

## Main Exports

### All Components
```typescript
import {
  // Blocks
  HeroBlock,
  FeaturesBlock,
  CTABlock,
  PricingBlock,
  TestimonialsBlock,
  DashboardBlock,
  
  // Layouts
  MainLayout,
  DashLayout,
  Dashboard,
  
  // Partials
  Header,
  Footer,
  Sidebar,
  
  // Types
  HeroBlockProps,
  FeaturesBlockProps,
  // ... other types
  MainLayoutProps,
  NavItem,
  FooterSection,
} from '@ui8kit/blocks';
```

### Specific Imports

```typescript
// Only blocks
import {
  HeroBlock,
  FeaturesBlock,
  CTABlock,
} from '@ui8kit/blocks/blocks';

// Only layouts
import { MainLayout, DashLayout } from '@ui8kit/blocks/layouts';

// Only partials
import { Header, Footer, Sidebar } from '@ui8kit/blocks/partials';
```

## Usage Examples

### Using HeroBlock with Fixtures
```typescript
import { HeroBlock } from '@ui8kit/blocks';
import { fixtures } from '@ui8kit/data';

export function MyPage() {
  return <HeroBlock {...fixtures.hero} />;
}
```

### Using MainLayout
```typescript
import { MainLayout } from '@ui8kit/blocks';

export function App() {
  return (
    <MainLayout
      headerTitle="My App"
      navItems={[
        { id: '1', title: 'Home', url: '/' },
        { id: '2', title: 'About', url: '/about' },
      ]}
    >
      <YourContent />
    </MainLayout>
  );
}
```

### Using Partials
```typescript
import { Header, Footer, Sidebar } from '@ui8kit/blocks';

export function Layout({ children }) {
  return (
    <>
      <Header title="My Site" />
      <main>{children}</main>
      <Footer copyright="© 2025" />
    </>
  );
}
```

## Type Definitions

All component types are exported with the component itself:

```typescript
import type {
  HeroBlockProps,
  FeaturesBlockProps,
  CTABlockProps,
  PricingBlockProps,
  PricingPlan,
  TestimonialsBlockProps,
  Testimonial,
  DashboardBlockProps,
  MainLayoutProps,
  LayoutMode,
  HeaderProps,
  NavItem,
  FooterProps,
  FooterSection,
  FooterLink,
  SidebarProps,
} from '@ui8kit/blocks';
```

## Notes

- All imports should use the main export point `@ui8kit/blocks`
- Use TypeScript for better type safety
- Types are automatically included in all imports
- Components are tree-shakeable for better bundle optimization
