# @ui8kit/core

Core semantic UI primitives and composite components used by engine blocks and generated templates.

## Purpose

`@ui8kit/core` provides the reusable UI layer for UI8Kit:

- semantic layout primitives (`Block`, `Container`, `Stack`, `Group`, `Box`)
- typography primitives (`Title`, `Text`)
- interactive primitives (`Button`, `Badge`, `Field`)
- media primitives (`Image`, `Icon`)
- composite components (`Grid`, `Card`, `Sheet`, `Accordion`)

All components are exported from `packages/core/src/components/index.ts` and re-exported by `packages/core/src/index.ts`.

## Basic Usage

```tsx
import { Block, Stack, Title, Text, Button, Card, CardHeader, CardContent } from '@ui8kit/core';

export function ExampleSection() {
  return (
    <Block component="section" data-class="example-section">
      <Stack gap="6" data-class="example-stack">
        <Title data-class="example-title">UI8Kit Core</Title>
        <Text data-class="example-text">Semantic primitives with constrained props.</Text>
        <Card data-class="example-card">
          <CardHeader>
            <Title order={3} data-class="example-card-title">Card</Title>
          </CardHeader>
          <CardContent>
            <Button data-class="example-button">Action</Button>
          </CardContent>
        </Card>
      </Stack>
    </Block>
  );
}
```

## Component Inventory

- `Block`, `Container`, `Stack`, `Group`, `Box`
- `Title`, `Text`
- `Button`, `Badge`, `Field`
- `Image`, `Icon`
- `Grid`
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
- `Sheet`
- `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`

## Rules and Conventions

- Prefer semantic props over `className` and inline styles.
- Add `data-class` attributes on semantic elements.
- Keep comments and docs in English.

Detailed guidance: `../../.cursor/rules/ui8kit-architecture.mdc` and `../../.cursor/rules/best-practices.mdc`.
