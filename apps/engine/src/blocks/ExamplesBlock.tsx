import { Block, Grid, Stack, Group, Title, Text, Button, Badge } from '@ui8kit/core';
import { NavLink } from 'react-router-dom';

export interface ExamplesBlockProps {
  tabs?: Array<{ href: string; label: string }>;
}

/**
 * Examples block — tabbed section with common components.
 * Tabs aligned from left; content below. Extensible for new sections.
 * Tabs passed via props (from context on engine; caller must provide in dev).
 */
export function ExamplesBlock({ tabs = [] }: ExamplesBlockProps) {
  return (
    <Block component="section" py="16" data-class="examples-section">
      <Stack gap="8" data-class="examples-section-inner">
        <Stack gap="2" data-class="examples-header">
          <Title fontSize="2xl" fontWeight="bold" data-class="examples-title">
            Examples
          </Title>
          <Text
            fontSize="sm"
            textColor="muted-foreground"
            max="w-xl"
            data-class="examples-description"
          >
            Common UI components and patterns.
          </Text>
        </Stack>

        {/* Tabs — left-aligned; routes from context.examplesSidebarLinks */}
        <Group
          gap="0"
          justify="start"
          items="center"
          border="b"
          data-class="examples-tabs"
        >
          {tabs.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                isActive
                  ? 'inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-t-md transition-colors -mb-px border-b-2 border-primary text-foreground'
                  : 'inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-t-md transition-colors -mb-px border-b-2 border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }
              data-class="examples-tab"
            >
              {item.label}
            </NavLink>
          ))}
        </Group>

        <Grid cols="1-2-4" gap="6" max="w-6xl" data-class="examples-grid">
          {/* Buttons */}
          <Stack
            gap="4"
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
            gap="4"
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

          {/* Typography */}
          <Stack
            gap="4"
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
          <Button href="/examples" data-class="examples-cta">
            Explore Examples
          </Button>
          <Button variant="outline" href="/docs/components" data-class="examples-cta">
            All Components
          </Button>
        </Group>
      </Stack>
    </Block>
  );
}
