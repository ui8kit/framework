import React from 'react';
import { Block, Grid, Stack, Title, Text } from '@ui8kit/core';

interface FeaturesBlockProps {
  title?: string;
  subtitle?: string;
  features?: any[];
}

export function FeaturesBlock(props: FeaturesBlockProps) {
  const { title, subtitle, features } = props;
  return (
    <Block component="section" data-class="features-section">
      <Stack gap="8" py="16">
        <Stack gap="4" items="center" data-class="features-header">
          {title ? (<><Title fontSize="3xl" fontWeight="bold" textAlign="center" data-class="features-title">{title}</Title></>) : null}
          {subtitle ? (<><Text fontSize="lg" textColor="muted-foreground" textAlign="center" max="w-xl" data-class="features-description">{subtitle}</Text></>) : null}
        </Stack>
        <Grid cols="1-2-4" gap="6" data-class="features-grid">
          {features.map((feature, index) => (
          <React.Fragment key={feature.id ?? index}>
          <Stack gap="4" p="6" rounded="lg" bg="card" border="" data-class="feature-card"><Title fontSize="xl" fontWeight="semibold" data-class="feature-title">{feature.title}</Title><Text fontSize="sm" textColor="muted-foreground" data-class="feature-description">{feature.description}</Text></Stack>
          </React.Fragment>
          ))}
        </Grid>
      </Stack>
    </Block>
  );
}
