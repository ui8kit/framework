import React from 'react';
import { Block, Grid, Stack, Box, Title, Text, Button, Badge } from '@ui8kit/core';

interface PricingBlockProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  plans?: any[];
}

export function PricingBlock(props: PricingBlockProps) {
  const { title, subtitle, badge, plans } = props;
  return (
    <Block component="section" data-class="pricing-section">
      <Stack gap="8" py="16" items="center" data-class="pricing-container">
        <Stack gap="4" items="center" data-class="pricing-header">
          {badge ? (<><Badge variant="secondary" data-class="pricing-badge">{badge}</Badge></>) : null}
          {title ? (<><Title fontSize="3xl" fontWeight="bold" textAlign="center" data-class="pricing-title">{title}</Title></>) : null}
          {subtitle ? (<><Text fontSize="lg" textColor="muted-foreground" textAlign="center" max="w-xl" data-class="pricing-description">{subtitle}</Text></>) : null}
        </Stack>
        <Grid grid="cols-3" gap="6" data-class="pricing-grid">
          {plans.map((plan, index) => (
          <React.Fragment key={plan.id ?? index}>
          <Stack gap="6" p="6" rounded="xl" bg="card" border="" data-class="pricing-card">{plan.featured ? (<><Badge variant="secondary" data-class="pricing-featured-badge"> Most Popular </Badge></>) : null}<Stack gap="2" data-class="pricing-plan-header"><Title fontSize="xl" fontWeight="semibold" data-class="pricing-plan-name">{plan.name}</Title>{plan.description ? (<><Text fontSize="sm" textColor="muted-foreground" data-class="pricing-plan-description">{plan.description}</Text></>) : null}</Stack><Stack gap="1" data-class="pricing-price"><Box flex="" items="end" gap="1" data-class="pricing-price-wrapper"><Title fontSize="4xl" fontWeight="bold" data-class="pricing-amount">{plan.price}</Title>{plan.period ? (<><Text fontSize="sm" textColor="muted-foreground" data-class="pricing-period">{plan.period}</Text></>) : null}</Box></Stack><Stack gap="2" data-class="pricing-features">{plan.features.map((feature, index) => (
          <React.Fragment key={feature.id ?? index}>
          <Text fontSize="sm" data-class="pricing-feature"> ✓ {feature}</Text>
          </React.Fragment>
          ))}</Stack><Button variant="outline" w="full" data-class="pricing-cta"> Get Started </Button></Stack>
          </React.Fragment>
          ))}
        </Grid>
      </Stack>
    </Block>
  );
}
