# Block Components

Semantic page sections wrapped in `Block` component with HTML5 semantic tags.

## Purpose

Blocks are the building blocks of your pages. Each block represents a semantic section of content and is wrapped in a `Block` component with appropriate HTML5 tags.

## Best Practices

### Typography Variants
```tsx
// ✅ CORRECT - use semantic typography variants
<Title fontSize="2xl" fontWeight="bold" textAlign="center">
  Centered Title
</Title>
<Text fontSize="lg" textColor="muted-foreground" textAlign="center">
  Centered text with muted color
</Text>

// Available variants:
// fontSize: xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl
// textColor: foreground, muted-foreground, primary, secondary, destructive
// textAlign: left, center, right, justify
// fontWeight: normal, medium, semibold, bold
// lineHeight: tight, normal, relaxed
// letterSpacing: tighter, tight, normal, wide, wider, widest
```

## Structure

```tsx
// Block component with semantic HTML5 tag
<Block component="section" data-class="hero-section">
  <Stack gap="6">
    <Title fontSize="2xl" fontWeight="bold">Block Content</Title>
    <Text fontSize="base" textColor="muted-foreground">Block description</Text>
  </Stack>
</Block>
```

## Rules

- **Always use `Block component="section"`** for semantic sections
- **Single responsibility** - each block has one clear purpose
- **Semantic `data-class`** attribute for styling identification
- **Can contain multiple UI components** but focuses on one content area

## Available Blocks

| Block | Purpose | Key Components |
|-------|---------|----------------|
| `HeroBlock` | Page hero/introduction | Title, Text, Button Group |
| `FeaturesBlock` | Features showcase grid | Grid, Icon, Card pattern |
| `PricingBlock` | Pricing plans comparison | Grid, Badge, Button variants |
| `TestimonialsBlock` | Customer testimonials | Grid, Image, Quote pattern |
| `CTABlock` | Call-to-action section | Centered Stack, Button Group |
| `DashboardBlock` | Dashboard content | Grid layout, mixed content |

## Usage

```tsx
import { 
  HeroBlock, 
  FeaturesBlock, 
  PricingBlock,
  TestimonialsBlock,
  CTABlock 
} from '@/blocks';

// In route component
export function HomePage() {
  return (
    <>
      <HeroBlock />
      <FeaturesBlock />
      <PricingBlock />
      <TestimonialsBlock />
      <CTABlock />
    </>
  );
}
```

## Block Patterns

### Hero Pattern
```tsx
<Block component="section" data-class="hero-section">
  <Stack gap="6" items="center" py="16">
    <Title fontSize="4xl" fontWeight="bold" textAlign="center">...</Title>
    <Text fontSize="xl" textColor="muted-foreground" textAlign="center" max="w-2xl">...</Text>
    <Group gap="4">
      <Button size="lg">Primary</Button>
      <Button variant="outline" size="lg">Secondary</Button>
    </Group>
  </Stack>
</Block>
```

### Card Grid Pattern
```tsx
<Grid grid="cols-3" gap="6">
  <Stack p="6" rounded="lg" bg="card" border="" gap="4" data-class="card">
    <Icon lucideIcon={Star} size="lg" />
    <Title fontSize="xl" fontWeight="semibold">...</Title>
    <Text fontSize="sm" textColor="muted-foreground">...</Text>
  </Stack>
</Grid>
```

## File Structure

```
blocks/
├── HeroBlock.tsx         # Hero/intro sections
├── FeaturesBlock.tsx     # Feature showcases
├── PricingBlock.tsx      # Pricing comparison
├── TestimonialsBlock.tsx # Customer quotes
├── CTABlock.tsx          # Call-to-action
├── DashboardBlock.tsx    # Dashboard content
└── index.ts              # Block exports
```</contents>
</xai:function_call">Created new file apps/local/src/blocks/README.md
