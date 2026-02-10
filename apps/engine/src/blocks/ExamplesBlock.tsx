import { Block, Grid, Stack, Group, Title, Text, Button, Badge } from '@ui8kit/core';
import { Link } from 'react-router-dom';

/**
 * Examples block — compact shadcn-style component showcase.
 * Fits in a grid, shows design elements side by side.
 */
export function ExamplesBlock() {
  return (
    <Block component="section" py="16" data-class="examples-section">
      <Stack gap="8" items="center">
        <Stack gap="2" items="center" data-class="examples-header">
          <Title fontSize="2xl" fontWeight="bold" textAlign="center" data-class="examples-title">
            Components
          </Title>
          <Text
            fontSize="sm"
            textColor="muted-foreground"
            textAlign="center"
            max="w-xl"
            data-class="examples-description"
          >
            Common UI elements. Click to explore.
          </Text>
        </Stack>

        <Grid cols="1-2-4" gap="6" max="w-6xl" data-class="examples-grid">
          {/* Buttons */}
          <Stack
            gap="3"
            p="4"
            rounded="lg"
            bg="card"
            border=""
            data-class="examples-card"
          >
            <Text fontSize="sm" fontWeight="semibold" data-class="examples-card-title">
              Button
            </Text>
            <Group gap="2" items="center" data-class="examples-card-content">
              <Button size="sm" data-class="examples-btn">Default</Button>
              <Button variant="outline" size="sm" data-class="examples-btn">Outline</Button>
              <Button variant="ghost" size="sm" data-class="examples-btn">Ghost</Button>
            </Group>
          </Stack>

          {/* Badges */}
          <Stack
            gap="3"
            p="4"
            rounded="lg"
            bg="card"
            border=""
            data-class="examples-card"
          >
            <Text fontSize="sm" fontWeight="semibold" data-class="examples-card-title">
              Badge
            </Text>
            <Group gap="2" items="center" data-class="examples-card-content">
              <Badge variant="default" data-class="examples-badge">Default</Badge>
              <Badge variant="secondary" data-class="examples-badge">Secondary</Badge>
              <Badge variant="outline" data-class="examples-badge">Outline</Badge>
            </Group>
          </Stack>

          {/* Links */}
          <Stack
            gap="3"
            p="4"
            rounded="lg"
            bg="card"
            border=""
            data-class="examples-card"
          >
            <Text fontSize="sm" fontWeight="semibold" data-class="examples-card-title">
              Examples
            </Text>
            <Stack gap="1" data-class="examples-card-content">
              <Link to="/examples" className="text-sm text-primary hover:underline">
                Examples
              </Link>
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

          {/* Typography */}
          <Stack
            gap="3"
            p="4"
            rounded="lg"
            bg="card"
            border=""
            data-class="examples-card"
          >
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
        </Grid>

        <Group gap="4" justify="center" items="center" data-class="examples-actions">
          <Button as={Link} to="/examples" data-class="examples-cta">
            Explore Examples
          </Button>
          <Button variant="outline" as={Link} to="/docs/components" data-class="examples-cta">
            All Components
          </Button>
        </Group>
      </Stack>
    </Block>
  );
}
