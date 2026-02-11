import type { ReactNode } from 'react';
import { Block, Grid, Stack, Group, Title, Text, Button, Badge, Card } from '@ui8kit/core';
import { Link } from 'react-router-dom';
import { Fragment } from 'react';

interface ExamplesBlockProps {
  tabs?: any[];
  examples: any;
  children?: ReactNode;
}

export function ExamplesBlock(props: ExamplesBlockProps) {
  const { tabs, examples, children } = props;
  return (
    <Block component="section" py="16" data-class="examples-section">
      <Stack gap="8" data-class="examples-section-inner">
        <Stack gap="2" data-class="examples-header">
          {examples.title ? (<><Title fontSize="2xl" fontWeight="bold" data-class="examples-title">{examples.title}</Title></>) : null}
          <Text fontSize="sm" textColor="muted-foreground" max="w-xl" data-class="examples-description">
            {examples.description}
          </Text>
        </Stack>
        {tabs ? (<><Group gap="0" justify="start" items="center" border="b" data-class="examples-tabs">{tabs.map((item, index) => (
        <Fragment key={item.href}>
        <Link to={item.href} data-class="examples-tab" data-state={item.active ? 'active' : undefined} className="inline-flex items-center justify-center h-9 px-3 text-sm font-medium rounded-none text-accent-foreground bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:-mb-px data-[state=active]:text-foreground no-underline">{item.label}</Link>
        </Fragment>
        ))}</Group></>) : null}
        {!children ? (<><Grid cols="1-2-3-4" gap="6" w="full" min="w-0" max="w-7xl" data-class="examples-grid"><Card gap="4" data-class="examples-card"><Text fontSize="sm" fontWeight="semibold" data-class="examples-card-title">{examples.button.title}</Text><Group gap="2" items="center" data-class="examples-card-content"><Button size="sm" data-class="examples-btn">{examples.button.defaultLabel}</Button><Button variant="outline" size="sm" data-class="examples-btn">{examples.button.outlineLabel}</Button><Button variant="ghost" size="sm" data-class="examples-btn">{examples.button.ghostLabel}</Button></Group></Card><Card gap="4" data-class="examples-card"><Text fontSize="sm" fontWeight="semibold" data-class="examples-card-title">{examples.badge.title}</Text><Group gap="2" items="center" data-class="examples-card-content"><Badge variant="default" data-class="examples-badge">{examples.badge.defaultLabel}</Badge><Badge variant="secondary" data-class="examples-badge">{examples.badge.secondaryLabel}</Badge><Badge variant="outline" data-class="examples-badge">{examples.badge.outlineLabel}</Badge></Group></Card><Card gap="4" data-class="examples-card"><Text fontSize="sm" fontWeight="semibold" data-class="examples-card-title">{examples.typography.title}</Text><Stack gap="1" data-class="examples-card-content"><Title fontSize="lg" fontWeight="semibold" data-class="examples-typo-title">{examples.typography.heading}</Title><Text fontSize="sm" textColor="muted-foreground" data-class="examples-typo-text">{examples.typography.body}</Text></Stack></Card></Grid><Group gap="4" justify="center" items="center" data-class="examples-actions"><Button href="/examples" data-class="examples-cta">{examples.actions.explore}</Button><Button variant="outline" href="/docs/components" data-class="examples-cta">{examples.actions.allComponents}</Button></Group></>) : null}
        {children ? (<>{children}</>) : null}
      </Stack>
    </Block>
  );
}
