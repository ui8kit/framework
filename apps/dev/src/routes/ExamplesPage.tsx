import { Block, Container, Stack, Group, Title, Text, Button, Badge, Grid } from '@ui8kit/core';
import { Link } from 'react-router-dom';

export function ExamplesPage() {
  return (
    <Block component="section" py="12" data-class="examples-section">
      <Container max="w-6xl" flex="col" gap="8" data-class="examples-container">
        <Stack gap="2" items="center" data-class="examples-header">
          <Title fontSize="2xl" fontWeight="bold" textAlign="center" data-class="examples-title">
            Examples
          </Title>
          <Text fontSize="sm" textColor="muted-foreground" textAlign="center" max="w-xl" data-class="examples-description">
            Common UI components and patterns.
          </Text>
        </Stack>
        <Grid cols="1-2-4" gap="6" data-class="examples-grid">
          <Stack gap="4" p="4" rounded="lg" bg="card" border="" data-class="examples-card">
            <Text fontSize="sm" fontWeight="semibold" data-class="examples-card-title">
              Button
            </Text>
            <Group gap="2" items="center" data-class="examples-card-content">
              <Button size="sm" data-class="examples-btn">
                Default
              </Button>
              <Button variant="outline" size="sm" data-class="examples-btn">
                Outline
              </Button>
              <Button variant="ghost" size="sm" data-class="examples-btn">
                Ghost
              </Button>
            </Group>
          </Stack>
          <Stack gap="4" p="4" rounded="lg" bg="card" border="" data-class="examples-card">
            <Text fontSize="sm" fontWeight="semibold" data-class="examples-card-title">
              Badge
            </Text>
            <Group gap="2" items="center" data-class="examples-card-content">
              <Badge variant="default" data-class="examples-badge">
                Default
              </Badge>
              <Badge variant="secondary" data-class="examples-badge">
                Secondary
              </Badge>
              <Badge variant="outline" data-class="examples-badge">
                Outline
              </Badge>
            </Group>
          </Stack>
          <Stack gap="4" p="4" rounded="lg" bg="card" border="" data-class="examples-card">
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
          </Stack>
          <Stack gap="4" p="4" rounded="lg" bg="card" border="" data-class="examples-card">
            <Text fontSize="sm" fontWeight="semibold" data-class="examples-card-title">
              Routes
            </Text>
            <Stack gap="1" data-class="examples-card-content">
              <Link to="/examples/dashboard" className="text-sm text-primary hover:underline">
                Dashboard
              </Link>
              <Link to="/examples/tasks" className="text-sm text-primary hover:underline">
                Tasks
              </Link>
              <Link to="/examples/playground" className="text-sm text-primary hover:underline">
                Playground
              </Link>
              <Link to="/examples/authentication" className="text-sm text-primary hover:underline">
                Authentication
              </Link>
            </Stack>
          </Stack>
        </Grid>
      </Container>
    </Block>
  );
}
