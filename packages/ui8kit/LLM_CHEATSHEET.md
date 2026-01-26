# UI8Kit Quick Reference for LLM

## Layers
- components/ui/* — ONLY props, NO className
- components/* — className + data-class required
- blocks/* — Block component="section|article|..."

## Top Props (use these 90% of time)
| prop | common values | example |
|------|---------------|---------|
| gap | 2, 4, 6, 8 | <Stack gap="4"> |
| p/px/py | 2, 4, 6, 8 | <Box p="4" px="6"> |
| text | sm, base, lg, xl, 2xl | <Text text="lg"> |
| bg | primary, muted, card | <Box bg="muted"> |
| rounded | sm, md, lg, xl, full | <Card rounded="lg"> |
| items/justify | start, center, end | <Stack items="center"> |

## Patterns
Hero: <Block component="section"><Stack gap="6" items="center" py="16">...</Stack></Block>
Card: <Card rounded="lg" p="6" bg="card">...</Card>
Grid 3-col: <Grid grid="cols-3" gap="6">...</Grid>

## Forbidden
- gap="5" (use 4 or 6)
- className without data-class on primitives
- responsive modifiers in props: gap="4 md:gap-6" ❌