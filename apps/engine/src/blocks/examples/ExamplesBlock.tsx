import type { ReactNode } from 'react';
import { Block, Grid, Stack, Group, Title, Text, Button, Badge, Card } from '@ui8kit/core';
import { If, Loop, Var } from '@ui8kit/template';
import type { ExampleTab, ExamplesContent } from './types';
import { DomainNavButton } from '@/partials';

export interface ExamplesBlockProps {
  tabs?: ExampleTab[];
  examples: ExamplesContent;
  /** When provided, renders header + tabs + children instead of grid + actions (for Examples layout) */
  children?: ReactNode;
}

/**
 * Examples block — tabbed section with common components.
 * Tabs aligned from left; content below. Extensible for new sections.
 * Tabs passed via props (from context on engine; caller must provide in dev).
 */
export function ExamplesBlock({ tabs, examples, children }: ExamplesBlockProps) {
  const normalizedTabs = (tabs ?? []) as ExampleTab[];

  return (
    <Block component="section" py="16" data-class="examples-section">
      <Stack gap="8" data-class="examples-section-inner">
        <Stack gap="2" data-class="examples-header">
          <If test="examples.title" value={!!(examples.title ?? '')}>
            <Title fontSize="2xl" fontWeight="bold" data-class="examples-title">
              <Var name="examples.title" value={examples.title} />
            </Title>
          </If>
          <If test="examples.description" value={!!(examples.description ?? '')}>
            <Text
              fontSize="sm"
              textColor="muted-foreground"
              max="w-xl"
              data-class="examples-description"
            >
              <Var name="examples.description" value={examples.description ?? ''} />
            </Text>
          </If>
        </Stack>

        <If test="tabs" value={normalizedTabs.length > 0}>
          <Group
            gap="0"
            justify="start"
            items="center"
            border="b"
            data-class="examples-tabs"
          >
            <Loop each="tabs" as="item" keyExpr="item.href" data={normalizedTabs}>
              {(item: ExampleTab) => (
                <>
                  <If test="item.active" value={!!item.active}>
                    <DomainNavButton
                      href={item.href}
                      variant="ghost"
                      data-class="examples-tab"
                      data-state="active"
                    >
                      <Text component="span">
                        <Var name="item.label" value={item.label ?? ''} />
                      </Text>
                    </DomainNavButton>
                  </If>
                  <If test="!item.active" value={!item.active}>
                    <DomainNavButton
                      href={item.href}
                      variant="ghost"
                      data-class="examples-tab"
                    >
                      <Text component="span">
                        <Var name="item.label" value={item.label ?? ''} />
                      </Text>
                    </DomainNavButton>
                  </If>
                </>
              )}
            </Loop>
          </Group>
        </If>

        <If test="!children" value={!children}>
          <Grid cols="1-2-3-4" gap="6" w="full" min="w-0" max="w-7xl" data-class="examples-grid">
            {/* Buttons */}
            <Card
              gap="4"
              data-class="examples-card"
            >
              <If test="examples.button.title" value={!!(examples?.button?.title ?? '')}>
                <Text fontSize="sm" fontWeight="semibold" data-class="examples-card-title">
                  <Var name="examples.button.title" value={examples?.button?.title ?? ''} />
                </Text>
              </If>
              <Group gap="2" items="center" data-class="examples-card-content">
                <If test="examples.button.defaultLabel" value={!!(examples?.button?.defaultLabel ?? '')}>
                  <Button size="sm" data-class="examples-btn">
                    <Var name="examples.button.defaultLabel" value={examples?.button?.defaultLabel ?? ''} />
                  </Button>
                </If>
                <If test="examples.button.outlineLabel" value={!!(examples?.button?.outlineLabel ?? '')}>
                  <Button variant="outline" size="sm" data-class="examples-btn">
                    <Var name="examples.button.outlineLabel" value={examples?.button?.outlineLabel ?? ''} />
                  </Button>
                </If>
                <If test="examples.button.ghostLabel" value={!!(examples?.button?.ghostLabel ?? '')}>
                  <Button variant="ghost" size="sm" data-class="examples-btn">
                    <Var name="examples.button.ghostLabel" value={examples?.button?.ghostLabel ?? ''} />
                  </Button>
                </If>
              </Group>
            </Card>

            {/* Badges */}
            <Card
              gap="4"
              data-class="examples-card"
            >
              <If test="examples.badge.title" value={!!(examples?.badge?.title ?? '')}>
                <Text fontSize="sm" fontWeight="semibold" data-class="examples-card-title">
                  <Var name="examples.badge.title" value={examples?.badge?.title ?? ''} />
                </Text>
              </If>
              <Group gap="2" items="center" data-class="examples-card-content">
                <If test="examples.badge.defaultLabel" value={!!(examples?.badge?.defaultLabel ?? '')}>
                  <Badge variant="default" data-class="examples-badge">
                    <Var name="examples.badge.defaultLabel" value={examples?.badge?.defaultLabel ?? ''} />
                  </Badge>
                </If>
                <If test="examples.badge.secondaryLabel" value={!!(examples?.badge?.secondaryLabel ?? '')}>
                  <Badge variant="secondary" data-class="examples-badge">
                    <Var name="examples.badge.secondaryLabel" value={examples?.badge?.secondaryLabel ?? ''} />
                  </Badge>
                </If>
                <If test="examples.badge.outlineLabel" value={!!(examples?.badge?.outlineLabel ?? '')}>
                  <Badge variant="outline" data-class="examples-badge">
                    <Var name="examples.badge.outlineLabel" value={examples?.badge?.outlineLabel ?? ''} />
                  </Badge>
                </If>
              </Group>
            </Card>

            {/* Typography */}
            <Card
              gap="4"
              data-class="examples-card"
            >
              <If test="examples.typography.title" value={!!(examples?.typography?.title ?? '')}>
                <Text fontSize="sm" fontWeight="semibold" data-class="examples-card-title">
                  <Var name="examples.typography.title" value={examples?.typography?.title ?? ''} />
                </Text>
              </If>
              <Stack gap="1" data-class="examples-card-content">
                <If test="examples.typography.heading" value={!!(examples?.typography?.heading ?? '')}>
                  <Title fontSize="lg" fontWeight="semibold" data-class="examples-typo-title">
                    <Var name="examples.typography.heading" value={examples?.typography?.heading ?? ''} />
                  </Title>
                </If>
                <If test="examples.typography.body" value={!!(examples?.typography?.body ?? '')}>
                  <Text fontSize="sm" textColor="muted-foreground" data-class="examples-typo-text">
                    <Var name="examples.typography.body" value={examples?.typography?.body ?? ''} />
                  </Text>
                </If>
              </Stack>
            </Card>
          </Grid>

          <Group gap="4" justify="center" items="center" data-class="examples-actions">
            <If test="examples.actions.explore" value={!!(examples?.actions?.explore ?? '')}>
              <DomainNavButton href="/examples" data-class="examples-cta">
                <Var name="examples.actions.explore" value={examples?.actions?.explore ?? ''} />
              </DomainNavButton>
            </If>
            <If test="examples.actions.allComponents" value={!!(examples?.actions?.allComponents ?? '')}>
              <DomainNavButton variant="outline" href="/docs/components" data-class="examples-cta">
                <Var name="examples.actions.allComponents" value={examples?.actions?.allComponents ?? ''} />
              </DomainNavButton>
            </If>
          </Group>
        </If>

        <If test="children" value={!!children}>
          {children}
        </If>
      </Stack>
    </Block>
  );
}
