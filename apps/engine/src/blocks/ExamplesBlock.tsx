import type { ReactNode } from 'react';
import { Block, Grid, Stack, Group, Title, Text, Button, Badge, Card } from '@ui8kit/core';
import { If, Loop, Var } from '@ui8kit/template';
import { DomainNavButton } from '@/partials';

export interface ExampleTab {
  href: string;
  label: string;
  active?: boolean;
}

export interface ExamplesButtonContent {
  title?: string;
  defaultLabel?: string;
  outlineLabel?: string;
  ghostLabel?: string;
}

export interface ExamplesBadgeContent {
  title?: string;
  defaultLabel?: string;
  secondaryLabel?: string;
  outlineLabel?: string;
}

export interface ExamplesTypographyContent {
  title?: string;
  heading?: string;
  body?: string;
}

export interface ExamplesActionsContent {
  explore?: string;
  allComponents?: string;
}

export interface ExamplesContent {
  title?: string;
  description?: string;
  button?: ExamplesButtonContent;
  badge?: ExamplesBadgeContent;
  typography?: ExamplesTypographyContent;
  actions?: ExamplesActionsContent;
}

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
  return (
    <Block component="section" py="16" data-class="examples-section">
      <Stack gap="8" data-class="examples-section-inner">
        <Stack gap="2" data-class="examples-header">
          <If test="examples.title" value={!!(examples.title ?? '')}>
            <Title fontSize="2xl" fontWeight="bold" data-class="examples-title">
              <Var name="examples.title" value={examples.title} />
            </Title>
          </If>
          <Text
            fontSize="sm"
            textColor="muted-foreground"
            max="w-xl"
            data-class="examples-description"
          >
            <If test="examples.description" value={!!(examples.description ?? '')}>
              <Var name="examples.description" value={examples.description ?? ''} />
            </If>
          </Text>
        </Stack>

        <If test="tabs" value={(tabs ?? []).length > 0}>
          <Group
            gap="0"
            justify="start"
            items="center"
            border="b"
            data-class="examples-tabs"
          >
            <Loop each="tabs" as="item" keyExpr="item.href" data={tabs ?? []}>
              {(item: ExampleTab) => (
                <>
                  <If test="item.active" value={!!item.active}>
                    <DomainNavButton
                      href={item.href}
                      data-class="examples-tab"
                      data-state="active"
                      className="inline-flex items-center justify-center h-9 px-3 text-sm font-medium rounded-none text-accent-foreground bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:-mb-px data-[state=active]:text-foreground no-underline"
                    >
                      <If test="item.label" value={!!(item.label ?? '')}>
                        <Var name="item.label" value={item.label ?? ''} />
                      </If>
                    </DomainNavButton>
                  </If>
                  <If test="!item.active" value={!item.active}>
                    <DomainNavButton
                      href={item.href}
                      data-class="examples-tab"
                      className="inline-flex items-center justify-center h-9 px-3 text-sm font-medium rounded-none text-accent-foreground bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:-mb-px data-[state=active]:text-foreground no-underline"
                    >
                      <If test="item.label" value={!!(item.label ?? '')}>
                        <Var name="item.label" value={item.label ?? ''} />
                      </If>
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
            <Text fontSize="sm" fontWeight="semibold" data-class="examples-card-title">
              <If test="examples.button.title" value={!!(examples?.button?.title ?? '')}>
                <Var name="examples.button.title" value={examples?.button?.title ?? ''} />
              </If>
            </Text>
            <Group gap="2" items="center" data-class="examples-card-content">
              <Button size="sm" data-class="examples-btn">
                <If test="examples.button.defaultLabel" value={!!(examples?.button?.defaultLabel ?? '')}>
                  <Var name="examples.button.defaultLabel" value={examples?.button?.defaultLabel ?? ''} />
                </If>
              </Button>
              <Button variant="outline" size="sm" data-class="examples-btn">
                <If test="examples.button.outlineLabel" value={!!(examples?.button?.outlineLabel ?? '')}>
                  <Var name="examples.button.outlineLabel" value={examples?.button?.outlineLabel ?? ''} />
                </If>
              </Button>
              <Button variant="ghost" size="sm" data-class="examples-btn">
                <If test="examples.button.ghostLabel" value={!!(examples?.button?.ghostLabel ?? '')}>
                  <Var name="examples.button.ghostLabel" value={examples?.button?.ghostLabel ?? ''} />
                </If>
              </Button>
            </Group>
          </Card>

          {/* Badges */}
          <Card
            gap="4"
            data-class="examples-card"
          >
            <Text fontSize="sm" fontWeight="semibold" data-class="examples-card-title">
              <If test="examples.badge.title" value={!!(examples?.badge?.title ?? '')}>
                <Var name="examples.badge.title" value={examples?.badge?.title ?? ''} />
              </If>
            </Text>
            <Group gap="2" items="center" data-class="examples-card-content">
              <Badge variant="default" data-class="examples-badge">
                <If test="examples.badge.defaultLabel" value={!!(examples?.badge?.defaultLabel ?? '')}>
                  <Var name="examples.badge.defaultLabel" value={examples?.badge?.defaultLabel ?? ''} />
                </If>
              </Badge>
              <Badge variant="secondary" data-class="examples-badge">
                <If test="examples.badge.secondaryLabel" value={!!(examples?.badge?.secondaryLabel ?? '')}>
                  <Var name="examples.badge.secondaryLabel" value={examples?.badge?.secondaryLabel ?? ''} />
                </If>
              </Badge>
              <Badge variant="outline" data-class="examples-badge">
                <If test="examples.badge.outlineLabel" value={!!(examples?.badge?.outlineLabel ?? '')}>
                  <Var name="examples.badge.outlineLabel" value={examples?.badge?.outlineLabel ?? ''} />
                </If>
              </Badge>
            </Group>
          </Card>

          {/* Typography */}
          <Card
            gap="4"
            data-class="examples-card"
          >
            <Text fontSize="sm" fontWeight="semibold" data-class="examples-card-title">
              <If test="examples.typography.title" value={!!(examples?.typography?.title ?? '')}>
                <Var name="examples.typography.title" value={examples?.typography?.title ?? ''} />
              </If>
            </Text>
            <Stack gap="1" data-class="examples-card-content">
              <Title fontSize="lg" fontWeight="semibold" data-class="examples-typo-title">
                <If test="examples.typography.heading" value={!!(examples?.typography?.heading ?? '')}>
                  <Var name="examples.typography.heading" value={examples?.typography?.heading ?? ''} />
                </If>
              </Title>
              <Text fontSize="sm" textColor="muted-foreground" data-class="examples-typo-text">
                <If test="examples.typography.body" value={!!(examples?.typography?.body ?? '')}>
                  <Var name="examples.typography.body" value={examples?.typography?.body ?? ''} />
                </If>
              </Text>
            </Stack>
          </Card>
        </Grid>

        <Group gap="4" justify="center" items="center" data-class="examples-actions">
          <DomainNavButton href="/examples" data-class="examples-cta">
            <If test="examples.actions.explore" value={!!(examples?.actions?.explore ?? '')}>
              <Var name="examples.actions.explore" value={examples?.actions?.explore ?? ''} />
            </If>
          </DomainNavButton>
          <DomainNavButton variant="outline" href="/docs/components" data-class="examples-cta">
            <If test="examples.actions.allComponents" value={!!(examples?.actions?.allComponents ?? '')}>
              <Var name="examples.actions.allComponents" value={examples?.actions?.allComponents ?? ''} />
            </If>
          </DomainNavButton>
        </Group>
        </If>

        <If test="children" value={!!children}>
          {children}
        </If>
      </Stack>
    </Block>
  );
}
