import { Block, Grid, Stack, Group, Title, Text, Button, Badge } from '@ui8kit/core';
import { If, Loop, Var } from '@ui8kit/template';

export interface ExamplesBlockProps {
  tabs?: Array<{ href: string; label: string }>;
  examples?: {
    title?: string;
    description?: string;
    button?: {
      title?: string;
      defaultLabel?: string;
      outlineLabel?: string;
      ghostLabel?: string;
    };
    badge?: {
      title?: string;
      defaultLabel?: string;
      secondaryLabel?: string;
      outlineLabel?: string;
    };
    typography?: {
      title?: string;
      heading?: string;
      body?: string;
    };
    actions?: {
      explore?: string;
      allComponents?: string;
    };
  };
}

/**
 * Examples block — tabbed section with common components.
 * Tabs aligned from left; content below. Extensible for new sections.
 * Tabs passed via props (from context on engine; caller must provide in dev).
 */
export function ExamplesBlock({ tabs, examples }: ExamplesBlockProps) {
  const safeTabs = tabs ?? [];

  return (
    <Block component="section" py="16" data-class="examples-section">
      <Stack gap="8" data-class="examples-section-inner">
        <Stack gap="2" data-class="examples-header">
          <Title fontSize="2xl" fontWeight="bold" data-class="examples-title">
            <Var name="examples.title" value={examples?.title} />
          </Title>
          <Text
            fontSize="sm"
            textColor="muted-foreground"
            max="w-xl"
            data-class="examples-description"
          >
            <Var
              name="examples.description"
              value={examples?.description}
            />
          </Text>
        </Stack>

        <If test="tabs" value={safeTabs.length > 0}>
          <Group
            gap="0"
            justify="start"
            items="center"
            border="b"
            data-class="examples-tabs"
          >
            <Loop each="tabs" as="item" data={safeTabs}>
              {(item: { href: string; label: string }) => (
                <Button
                  href={item.href}
                  variant="ghost"
                  size="sm"
                  rounded="none"
                  data-class="examples-tab"
                >
                  <Var name="item.label" value={item.label} />
                </Button>
              )}
            </Loop>
          </Group>
        </If>

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
              <Var name="examples.button.title" value={examples?.button?.title} />
            </Text>
            <Group gap="2" items="center" data-class="examples-card-content">
              <Button size="sm" data-class="examples-btn">
                <Var name="examples.button.defaultLabel" value={examples?.button?.defaultLabel} />
              </Button>
              <Button variant="outline" size="sm" data-class="examples-btn">
                <Var name="examples.button.outlineLabel" value={examples?.button?.outlineLabel} />
              </Button>
              <Button variant="ghost" size="sm" data-class="examples-btn">
                <Var name="examples.button.ghostLabel" value={examples?.button?.ghostLabel} />
              </Button>
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
              <Var name="examples.badge.title" value={examples?.badge?.title} />
            </Text>
            <Group gap="2" items="center" data-class="examples-card-content">
              <Badge variant="default" data-class="examples-badge">
                <Var name="examples.badge.defaultLabel" value={examples?.badge?.defaultLabel} />
              </Badge>
              <Badge variant="secondary" data-class="examples-badge">
                <Var name="examples.badge.secondaryLabel" value={examples?.badge?.secondaryLabel} />
              </Badge>
              <Badge variant="outline" data-class="examples-badge">
                <Var name="examples.badge.outlineLabel" value={examples?.badge?.outlineLabel} />
              </Badge>
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
              <Var name="examples.typography.title" value={examples?.typography?.title} />
            </Text>
            <Stack gap="1" data-class="examples-card-content">
              <Title fontSize="lg" fontWeight="semibold" data-class="examples-typo-title">
                <Var name="examples.typography.heading" value={examples?.typography?.heading} />
              </Title>
              <Text fontSize="sm" textColor="muted-foreground" data-class="examples-typo-text">
                <Var name="examples.typography.body" value={examples?.typography?.body} />
              </Text>
            </Stack>
          </Stack>
        </Grid>

        <Group gap="4" justify="center" items="center" data-class="examples-actions">
          <Button href="/examples" data-class="examples-cta">
            <Var name="examples.actions.explore" value={examples?.actions?.explore} />
          </Button>
          <Button variant="outline" href="/docs/components" data-class="examples-cta">
            <Var name="examples.actions.allComponents" value={examples?.actions?.allComponents} />
          </Button>
        </Group>
      </Stack>
    </Block>
  );
}
