import { Block, Stack, Group, Title, Text, Button, Badge, Grid, Card } from '@ui8kit/core';
import { DomainNavButton } from '@/partials';

/**
 * Examples default page view — common components showcase.
 */
export function ExamplesPageView() {
  return (
    <Block component="section" py="16" data-class="examples-section">
      <Stack gap="8" w="full" min="w-0" max="w-7xl" data-class="examples-container">
        <Grid cols="1-2-3-4" gap="6" w="full" min="w-0" data-class="examples-grid">
          <Card gap="4" data-class="examples-card">
            <Text fontSize="sm" fontWeight="semibold" data-class="examples-card-title">
              Button
            </Text>
            <Group gap="2" items="center" data-class="examples-card-content">
              <Button size="sm" data-class="examples-btn">Default</Button>
              <Button variant="outline" size="sm" data-class="examples-btn">Outline</Button>
              <Button variant="ghost" size="sm" data-class="examples-btn">Ghost</Button>
            </Group>
          </Card>

          <Card gap="4" data-class="examples-card">
            <Text fontSize="sm" fontWeight="semibold" data-class="examples-card-title">
              Badge
            </Text>
            <Group gap="2" items="center" data-class="examples-card-content">
              <Badge variant="default" data-class="examples-badge">Default</Badge>
              <Badge variant="secondary" data-class="examples-badge">Secondary</Badge>
              <Badge variant="outline" data-class="examples-badge">Outline</Badge>
            </Group>
          </Card>

          <Card gap="4" data-class="examples-card">
            <Text fontSize="sm" fontWeight="semibold" data-class="examples-card-title">
              Typography
            </Text>
            <Stack gap="1" data-class="examples-card-content">
              <Title fontSize="lg" fontWeight="semibold" data-class="examples-typo-title">
                Heading
              </Title>
              <Text fontSize="sm" textColor="muted-foreground" data-class="examples-typo-text">
                Body text
              </Text>
            </Stack>
          </Card>

          <Card gap="4" data-class="examples-card">
            <Text fontSize="sm" fontWeight="semibold" data-class="examples-card-title">
              Routes
            </Text>
            <Stack gap="1" data-class="examples-card-content">
              <DomainNavButton
                href="/examples/dashboard"
                variant="link"
                size="sm"
                justify="start"
                className="text-sm text-primary hover:underline"
              >
                Dashboard
              </DomainNavButton>
              <DomainNavButton
                href="/examples/tasks"
                variant="link"
                size="sm"
                justify="start"
                className="text-sm text-primary hover:underline"
              >
                Tasks
              </DomainNavButton>
              <DomainNavButton
                href="/examples/playground"
                variant="link"
                size="sm"
                justify="start"
                className="text-sm text-primary hover:underline"
              >
                Playground
              </DomainNavButton>
              <DomainNavButton
                href="/examples/authentication"
                variant="link"
                size="sm"
                justify="start"
                className="text-sm text-primary hover:underline"
              >
                Authentication
              </DomainNavButton>
            </Stack>
          </Card>
        </Grid>
      </Stack>
    </Block>
  );
}
