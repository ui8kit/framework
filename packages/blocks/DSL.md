# DSL Guide for @ui8kit/blocks

This guide explains how to use DSL (Domain-Specific Language) components from `@ui8kit/template` in blocks to enable template generation.

## DSL Components

All DSL components are imported from `@ui8kit/template`:

- `<If>` - Conditional rendering
- `<Var>` - Variable interpolation
- `<Loop>` - Iteration over collections
- `<Slot>` - Content slots

## Basic Usage

### Var Component

Use `<Var>` to output dynamic content:

```tsx
import { Var } from '@ui8kit/template';
import { Title } from '@ui8kit/core';

<Title data-class="hero-title">
  <Var name="title" value={props.title} />
</Title>
```

**Generated Liquid:**
```liquid
<h1 class="hero-title">{{ title }}</h1>
```

**Generated Handlebars:**
```handlebars
<h1 class="hero-title">{{ title }}</h1>
```

### If Component

Use `<If>` for conditional rendering:

```tsx
import { If, Var } from '@ui8kit/template';
import { Text } from '@ui8kit/core';

<If test="subtitle" value={!!props.subtitle}>
  <Text data-class="hero-subtitle">
    <Var name="subtitle" value={props.subtitle} />
  </Text>
</If>
```

**Generated Liquid:**
```liquid
{% if subtitle %}
  <p class="hero-subtitle">{{ subtitle }}</p>
{% endif %}
```

**Generated Handlebars:**
```handlebars
{{#if subtitle}}
  <p class="hero-subtitle">{{ subtitle }}</p>
{{/if}}
```

### Loop Component

Use `<Loop>` to iterate over collections:

```tsx
import { Loop, Var } from '@ui8kit/template';
import { Stack } from '@ui8kit/core';

<Loop each="features" as="feature" data={props.features}>
  <Stack data-class="feature-card">
    <Title data-class="feature-title">
      <Var name="feature.title" />
    </Title>
    <Text data-class="feature-description">
      <Var name="feature.description" />
    </Text>
  </Stack>
</Loop>
```

**Generated Liquid:**
```liquid
{% for feature in features %}
  <div class="feature-card">
    <h2 class="feature-title">{{ feature.title }}</h2>
    <p class="feature-description">{{ feature.description }}</p>
  </div>
{% endfor %}
```

**Generated Handlebars:**
```handlebars
{{#each features}}
  <div class="feature-card">
    <h2 class="feature-title">{{ title }}</h2>
    <p class="feature-description">{{ description }}</p>
  </div>
{{/each}}
```

### Slot Component

Use `<Slot>` for content injection:

```tsx
import { Slot } from '@ui8kit/template';

<Slot name="extra">
  {props.children}
</Slot>
```

**Generated Liquid:**
```liquid
{{ extra }}
```

## data-class Convention

Every semantic element MUST have a `data-class` attribute following this pattern:

```
[block-name]-[element-type]
```

### Examples:

- `hero-section` - Main block container
- `hero-title` - Title element
- `hero-subtitle` - Subtitle element
- `hero-actions` - Action buttons container
- `hero-cta-primary` - Primary CTA button
- `hero-cta-secondary` - Secondary CTA button
- `feature-card` - Individual feature card
- `feature-card-title` - Feature card title
- `pricing-card-pro` - Specific pricing card

### Rules:

1. Use kebab-case (lowercase with hyphens)
2. Start with block name
3. Use descriptive element type
4. Add modifiers for variants (e.g., `-primary`, `-secondary`)
5. Be consistent across similar blocks

## Complete Block Example

```tsx
import { Block, Stack, Container, Title, Text, Button, Group } from '@ui8kit/core';
import { If, Var, Slot } from '@ui8kit/template';

export interface HeroBlockProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaUrl?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  children?: React.ReactNode;
}

export function HeroBlock(props: HeroBlockProps) {
  return (
    <Block component="section" py="24" bg="background" data-class="hero-section">
      <Container max="w-7xl">
        <Stack gap="8" items="center">
          <Stack gap="4" items="center" max="w-3xl">
            <Title fontSize="5xl" fontWeight="bold" textAlign="center" data-class="hero-title">
              <Var name="title" value={props.title} />
            </Title>
            
            <If test="subtitle" value={!!props.subtitle}>
              <Text fontSize="xl" textColor="muted-foreground" textAlign="center" data-class="hero-subtitle">
                <Var name="subtitle" value={props.subtitle} />
              </Text>
            </If>
          </Stack>
          
          <Group gap="4" data-class="hero-actions">
            <If test="ctaText" value={!!props.ctaText}>
              <Button size="lg" href={props.ctaUrl} data-class="hero-cta-primary">
                <Var name="ctaText" value={props.ctaText} />
              </Button>
            </If>
            
            <If test="secondaryCtaText" value={!!props.secondaryCtaText}>
              <Button variant="outline" size="lg" href={props.secondaryCtaUrl} data-class="hero-cta-secondary">
                <Var name="secondaryCtaText" value={props.secondaryCtaText} />
              </Button>
            </If>
          </Group>
          
          <Slot name="extra">
            {props.children}
          </Slot>
        </Stack>
      </Container>
    </Block>
  );
}
```

## Best Practices

1. **Always use DSL components** for dynamic content that needs template generation
2. **Provide runtime values** via `value` prop for dev mode preview
3. **Use data-class consistently** - follow the naming convention
4. **Keep props typed** - define TypeScript interfaces for all block props
5. **Test in dev mode** - ensure blocks render correctly with actual data
6. **Document variables** - use JSDoc comments to describe expected data structure

## Migration Checklist

When migrating existing blocks:

- [ ] Import DSL components from `@ui8kit/template`
- [ ] Replace hardcoded text with `<Var>` components
- [ ] Wrap conditional content with `<If>` components
- [ ] Replace `.map()` with `<Loop>` components
- [ ] Add `data-class` to all semantic elements
- [ ] Update TypeScript interfaces with proper prop types
- [ ] Test with actual data in dev mode
- [ ] Verify generated templates match expected output
