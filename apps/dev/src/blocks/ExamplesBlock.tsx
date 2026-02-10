import React from 'react';
import { Block, Grid, Stack, Group, Title, Text, Button, Badge } from '@ui8kit/core';

interface ExamplesBlockProps {
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

export function ExamplesBlock(props: ExamplesBlockProps) {
  const { tabs, examples } = props;
  return (
    <Block component="section" py="16" data-class="examples-section">
      <Stack gap="8" data-class="examples-section-inner">
        <Stack gap="2" data-class="examples-header">
          <Title fontSize="2xl" fontWeight="bold" data-class="examples-title">
            {examples.title}
          </Title>
          <Text fontSize="sm" textColor="muted-foreground" max="w-xl" data-class="examples-description">
            {examples.description}
          </Text>
        </Stack>
        {tabs ? (<><Group gap="0" justify="start" items="center" border="b" data-class="examples-tabs">{tabs.map((item, index) => (
        <React.Fragment key={item.id ?? index}>
        <Button href={item.href} variant="ghost" size="sm" rounded="none" data-class="examples-tab">{item.label}</Button>
        </React.Fragment>
        ))}</Group></>) : null}
        <Grid cols="1-2-4" gap="6" max="w-6xl" data-class="examples-grid">
          <Stack gap="4" p="4" rounded="lg" bg="card" border="" data-class="examples-card">
            <Text fontSize="sm" fontWeight="semibold" data-class="examples-card-title">
              {examples.button.title}
            </Text>
            <Group gap="2" items="center" data-class="examples-card-content">
              <Button size="sm" data-class="examples-btn">
                {examples.button.defaultLabel}
              </Button>
              <Button variant="outline" size="sm" data-class="examples-btn">
                {examples.button.outlineLabel}
              </Button>
              <Button variant="ghost" size="sm" data-class="examples-btn">
                {examples.button.ghostLabel}
              </Button>
            </Group>
          </Stack>
          <Stack gap="4" p="4" rounded="lg" bg="card" border="" data-class="examples-card">
            <Text fontSize="sm" fontWeight="semibold" data-class="examples-card-title">
              {examples.badge.title}
            </Text>
            <Group gap="2" items="center" data-class="examples-card-content">
              <Badge variant="default" data-class="examples-badge">
                {examples.badge.defaultLabel}
              </Badge>
              <Badge variant="secondary" data-class="examples-badge">
                {examples.badge.secondaryLabel}
              </Badge>
              <Badge variant="outline" data-class="examples-badge">
                {examples.badge.outlineLabel}
              </Badge>
            </Group>
          </Stack>
          <Stack gap="4" p="4" rounded="lg" bg="card" border="" data-class="examples-card">
            <Text fontSize="sm" fontWeight="semibold" data-class="examples-card-title">
              {examples.typography.title}
            </Text>
            <Stack gap="1" data-class="examples-card-content">
              <Title fontSize="lg" fontWeight="semibold" data-class="examples-typo-title">
                {examples.typography.heading}
              </Title>
              <Text fontSize="sm" textColor="muted-foreground" data-class="examples-typo-text">
                {examples.typography.body}
              </Text>
            </Stack>
          </Stack>
        </Grid>
        <Group gap="4" justify="center" items="center" data-class="examples-actions">
          <Button href="/examples" data-class="examples-cta">
            {examples.actions.explore}
          </Button>
          <Button variant="outline" href="/docs/components" data-class="examples-cta">
            {examples.actions.allComponents}
          </Button>
        </Group>
      </Stack>
    </Block>
  );
}
