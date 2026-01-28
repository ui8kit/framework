# @ui8kit/core — LLM Development Guide

## Quick Start

```tsx
import { Block, Stack, Group, Box, Title, Text, Button, Badge, Image, Icon, Grid, Container } from "@ui8kit/core";
```

---

## Core Rules

### 1. Props = Tailwind Classes

Props map directly to Tailwind: `gap="6"` → `gap-6`, `bg="primary"` → `bg-primary`

```tsx
// ✅ Correct
<Stack gap="6" p="4" bg="muted" rounded="lg">

// ❌ Wrong - no responsive modifiers in props
<Stack gap="4 md:gap-6">
```

### 2. Component Variants (CVA)

Use `variant` and `size` props for styled components:

```tsx
// Button variants: default, primary, destructive, outline, secondary, ghost, link
// Button sizes: xs, sm, default, md, lg, xl, icon
<Button variant="primary" size="lg">Click</Button>

// Badge variants: default, secondary, destructive, outline
<Badge variant="secondary">New</Badge>
```

### 3. data-class Required

Every semantic element needs `data-class` for CSS generation:

```tsx
// ✅ Correct
<Block component="section" data-class="hero-section">
<Box data-class="feature-card">

// ❌ Wrong - missing data-class
<Block component="section">
```

---

## Component Reference

### Layout Primitives

| Component | Purpose | Default Props |
|-----------|---------|---------------|
| `Box` | Generic container | none |
| `Stack` | Vertical flex | `flex="col" gap="4" items="start"` |
| `Group` | Horizontal flex | `flex="row" gap="4" items="center"` |
| `Grid` | CSS Grid | `grid="" gap="4"` |
| `Container` | Centered max-width | `max="w-6xl" mx="auto" px="4"` |
| `Block` | Semantic section | use `component="section\|article\|aside"` |

### Content Primitives

| Component | Purpose | Key Variants |
|-----------|---------|--------------|
| `Title` | Headings | `fontSize`, `textColor`, `textAlign`, `fontWeight`, `order` |
| `Text` | Paragraphs | `fontSize`, `textColor`, `textAlign`, `fontWeight` |
| `Image` | Pictures | `fit="cover"` `aspect="video\|square"` |
| `Icon` | Icons | `size="sm\|md\|lg"` |

### Interactive Primitives

| Component | Variants | Sizes |
|-----------|----------|-------|
| `Button` | default, primary, destructive, outline, secondary, ghost, link | xs, sm, default, md, lg, xl, icon |
| `Badge` | default, secondary, destructive, outline | — |

---

## Common Props

### Spacing
```
p="0|1|2|4|6|8|12"      padding
px="0|1|2|4|6|8|12"     padding-x
py="0|2|4|8|16|32|48"   padding-y
m="0|1|2|4|6|8|12|auto" margin
gap="0|1|2|4|6|8|10|12" gap
```

### Layout
```
flex=""                  display: flex
flex="col|row|wrap"      flex-direction/wrap
items="start|center|end|stretch"
justify="start|center|end|between|around"
grid=""                  display: grid
grid="cols-1|cols-2|cols-3|cols-4|cols-6|cols-12"
col="span-1..12|span-full"
```

### Sizing
```
w="full|auto|fit|screen|3|4|5|6|8"
h="full|auto|fit|screen|3|4|5|6|8|10|11|12"
max="w-sm|w-md|w-lg|w-xl|w-2xl|w-4xl|w-6xl"
min="w-0|w-full|h-full|h-screen"
```

### Typography (Title & Text components)

**Semantic variants** (not utility props):
```
fontSize="xs|sm|base|lg|xl|2xl|3xl|4xl|5xl"
textColor="foreground|muted-foreground|primary|secondary|destructive|accent-foreground"
textAlign="left|center|right|justify"
fontWeight="normal|medium|semibold|bold"
lineHeight="tight|normal|relaxed"
letterSpacing="tighter|tight|normal|wide|wider|widest"
truncate={true|false}
```

**Title defaults**: `fontSize="xl"` `fontWeight="bold"`
**Text defaults**: `fontSize="base"` `fontWeight="normal"`

### Visual
```
bg="primary|secondary|muted|card|background|transparent"
rounded="none|sm|md|lg|xl|2xl|3xl|full"
shadow="none|sm|md|lg|xl|2xl"
border=""                border-1px
border="0|2|4"           border-width
```

### Position
```
relative=""
absolute=""
fixed=""
sticky=""
top="0|auto"
right="0|auto"
bottom="0|auto"
left="0|auto"
z="0|10|20|30|40|50|auto"
```

---

## Block Patterns

### Hero Section
```tsx
<Block component="section" data-class="hero-section">
  <Stack gap="6" items="center" py="16">
    <Title fontSize="4xl" fontWeight="bold" textAlign="center" data-class="hero-title">
      Welcome
    </Title>
    <Text fontSize="xl" textColor="muted-foreground" textAlign="center" max="w-2xl" data-class="hero-subtitle">
      Description text here
    </Text>
    <Group gap="4" data-class="hero-actions">
      <Button size="lg">Get Started</Button>
      <Button variant="outline" size="lg">Learn More</Button>
    </Group>
  </Stack>
</Block>
```

### Feature Grid
```tsx
<Block component="section" data-class="features-section">
  <Grid grid="cols-3" gap="6" data-class="features-grid">
    <Stack p="6" rounded="lg" bg="card" border="" gap="4" data-class="feature-card">
      <Icon lucideIcon={Star} size="lg" />
      <Title fontSize="xl" fontWeight="semibold">Feature</Title>
      <Text fontSize="sm" textColor="muted-foreground">Description</Text>
    </Stack>
    {/* more cards */}
  </Grid>
</Block>
```

### Card
```tsx
<Stack p="6" rounded="lg" bg="card" border="" shadow="sm" gap="4" data-class="card">
  <Image src="..." aspect="video" rounded="md" fit="cover" data-class="card-image" />
  <Title fontSize="lg" fontWeight="semibold" data-class="card-title">Title</Title>
  <Text fontSize="sm" textColor="muted-foreground" data-class="card-description">
    Description
  </Text>
  <Group gap="2" data-class="card-actions">
    <Button size="sm">Action</Button>
    <Badge variant="secondary">Tag</Badge>
  </Group>
</Stack>
```

---

## Validation

Use `@ui8kit/lint` to validate props:

```typescript
import { validateProps, formatForLLM } from "@ui8kit/lint";
import { utilityPropsMap } from "@ui8kit/core";

const result = validateProps({ gap: "5" }, utilityPropsMap);
// Error: gap="5" invalid, closest: "4" or "6"
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do Instead |
|----------|---------------|
| `className="bg-red-500"` | `bg="destructive"` |
| `gap="4 md:gap-6"` | Use Grid className for responsive |
| `<Box>` without data-class | `<Box data-class="name">` |
| Hardcoded colors | Use semantic tokens |
| `style={{ ... }}` | Use utility props |
