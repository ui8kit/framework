# Block Components

Semantic page sections wrapped in `Block` component with HTML5 semantic tags.

## Purpose

Blocks are the building blocks of your pages. Each block represents a semantic section of content and is wrapped in a `Block` component with appropriate HTML5 tags.

## Best Practices

### Parent Container Alignment
```tsx
// ✅ CORRECT - use parent container for alignment
<Block component="section" data-class="hero-section">
  <Stack gap="6" items="center"> {/* Parent handles centering */}
    <Title text="2xl">Centered Title</Title>
    <Text bg="muted-foreground">Centered text</Text>
  </Stack>
</Block>

// ❌ AVOID - duplicate props (HTML limitation)
<Title text="2xl" text="center">Title</Title> // Won't work!

// 🆘 FALLBACK - style only when absolutely necessary
<Title text="2xl" style={{ textAlign: 'center' }}>Title</Title>
```

## Structure

```tsx
// Block component with semantic HTML5 tag
<Block component="section" data-class="hero-section">
  <Stack gap="6">
    <Title text="2xl">Block Content</Title>
    <Text>Block description</Text>
  </Stack>
</Block>
```

## Rules

- **Always use `Block component="section"`** for semantic sections
- **Single responsibility** - each block has one clear purpose
- **Semantic `data-class`** attribute for styling identification
- **Can contain multiple UI components** but focuses on one content area

## Available Blocks

- `DashboardBlock` - Dashboard content section
- `HeroBlock` - Page hero/introduction section
- `FeaturesBlock` - Features showcase section

## Usage

```tsx
import { HeroBlock, FeaturesBlock } from '@/blocks';

// In route component
export function HomePage() {
  return (
    <>
      <HeroBlock />
      <FeaturesBlock />
    </>
  );
}
```

## File Structure

```
blocks/
├── HeroBlock.tsx        # Hero/intro sections
├── FeaturesBlock.tsx    # Feature showcases
├── DashboardBlock.tsx   # Dashboard content
└── index.ts            # Block exports
```</contents>
</xai:function_call">Created new file apps/local/src/blocks/README.md
