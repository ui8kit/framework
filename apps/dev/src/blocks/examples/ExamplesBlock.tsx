import type { ReactNode } from 'react';
import { Block, Grid, Stack, Group, Title, Text, Button, Badge, Card } from '@ui8kit/core';
import type { ExampleTab, ExamplesContent } from './types';
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
          {examples.description ? (<><Text fontSize="sm" textColor="muted-foreground" max="w-xl" data-class="examples-description">{examples.description}</Text></>) : null}
        </Stack>
        {tabs ? (<><Group gap="0" justify="start" items="center" border="b" data-class="examples-tabs">{tabs.map((item, index) => (
        <Fragment key={item.href}>
        {item.active ? (<><Button href={item.href} variant="ghost" data-class="examples-tab" data-state="active"><Text component="span">{item.label}</Text></Button></>) : null}{!item.active ? (<><Button href={item.href} variant="ghost" data-class="examples-tab"><Text component="span">{item.label}</Text></Button></>) : null}
        </Fragment>
        ))}</Group></>) : null}
        {!children ? (<><Grid cols="1-2-3-4" gap="6" w="full" min="w-0" max="w-7xl" data-class="examples-grid"><Card gap="4" data-class="examples-card">{examples.button.title ? (<><Text fontSize="sm" fontWeight="semibold" data-class="examples-card-title">{examples.button.title}</Text></>) : null}<Group gap="2" items="center" data-class="examples-card-content">{examples.button.defaultLabel ? (<><Button size="sm" data-class="examples-btn">{examples.button.defaultLabel}</Button></>) : null}{examples.button.outlineLabel ? (<><Button variant="outline" size="sm" data-class="examples-btn">{examples.button.outlineLabel}</Button></>) : null}{examples.button.ghostLabel ? (<><Button variant="ghost" size="sm" data-class="examples-btn">{examples.button.ghostLabel}</Button></>) : null}</Group></Card><Card gap="4" data-class="examples-card">{examples.badge.title ? (<><Text fontSize="sm" fontWeight="semibold" data-class="examples-card-title">{examples.badge.title}</Text></>) : null}<Group gap="2" items="center" data-class="examples-card-content">{examples.badge.defaultLabel ? (<><Badge variant="default" data-class="examples-badge">{examples.badge.defaultLabel}</Badge></>) : null}{examples.badge.secondaryLabel ? (<><Badge variant="secondary" data-class="examples-badge">{examples.badge.secondaryLabel}</Badge></>) : null}{examples.badge.outlineLabel ? (<><Badge variant="outline" data-class="examples-badge">{examples.badge.outlineLabel}</Badge></>) : null}</Group></Card><Card gap="4" data-class="examples-card">{examples.typography.title ? (<><Text fontSize="sm" fontWeight="semibold" data-class="examples-card-title">{examples.typography.title}</Text></>) : null}<Stack gap="1" data-class="examples-card-content">{examples.typography.heading ? (<><Title fontSize="lg" fontWeight="semibold" data-class="examples-typo-title">{examples.typography.heading}</Title></>) : null}{examples.typography.body ? (<><Text fontSize="sm" textColor="muted-foreground" data-class="examples-typo-text">{examples.typography.body}</Text></>) : null}</Stack></Card></Grid><Group gap="4" justify="center" items="center" data-class="examples-actions">{examples.actions.explore ? (<><Button href="/examples" data-class="examples-cta">{examples.actions.explore}</Button></>) : null}{examples.actions.allComponents ? (<><Button variant="outline" href="/docs/components" data-class="examples-cta">{examples.actions.allComponents}</Button></>) : null}</Group></>) : null}
        {children ? (<>{children}</>) : null}
      </Stack>
    </Block>
  );
}
