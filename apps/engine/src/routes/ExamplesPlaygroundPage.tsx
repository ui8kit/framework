import { Block, Container, Stack, Title, Text, Group, Button, Badge } from '@ui8kit/core';

/**
 * Examples Playground page — interactive experimentation.
 */
export function ExamplesPlaygroundPage() {
  return (
    <Block component="section" py="12" data-class="examples-playground-section">
      <Container max="w-6xl" flex="col" gap="8" data-class="examples-playground-container">
        <Stack gap="2" data-class="examples-playground-header">
          <Title fontSize="2xl" fontWeight="bold" data-class="examples-playground-title">
            Playground
          </Title>
          <Text fontSize="sm" textColor="muted-foreground" data-class="examples-playground-description">
            Experiment with components and variants.
          </Text>
        </Stack>

        <Stack gap="6" p="6" rounded="lg" bg="card" border="" data-class="examples-playground-content">
          <Stack gap="2" data-class="examples-playground-group">
            <Text fontSize="sm" fontWeight="semibold" data-class="examples-playground-label">
              Buttons
            </Text>
            <Group gap="2" items="center" data-class="examples-playground-buttons">
              <Button size="sm" data-class="examples-playground-btn">Small</Button>
              <Button size="default" data-class="examples-playground-btn">Default</Button>
              <Button size="lg" data-class="examples-playground-btn">Large</Button>
            </Group>
          </Stack>
          <Stack gap="2" data-class="examples-playground-group">
            <Text fontSize="sm" fontWeight="semibold" data-class="examples-playground-label">
              Badges
            </Text>
            <Group gap="2" items="center" data-class="examples-playground-badges">
              <Badge variant="default" data-class="examples-playground-badge">Default</Badge>
              <Badge variant="secondary" data-class="examples-playground-badge">Secondary</Badge>
              <Badge variant="outline" data-class="examples-playground-badge">Outline</Badge>
            </Group>
          </Stack>
        </Stack>
      </Container>
    </Block>
  );
}
