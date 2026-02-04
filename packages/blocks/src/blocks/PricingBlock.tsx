import { Block, Grid, Stack, Box, Title, Text, Button, Badge } from '@ui8kit/core';
import { If, Var, Loop } from '@ui8kit/template';

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  featured?: boolean;
}

export interface PricingBlockProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  plans?: PricingPlan[];
}

export function PricingBlock({
  title,
  subtitle,
  badge,
  plans = [],
}: PricingBlockProps) {
  return (
    <Block component="section" data-class="pricing-section">
      <Stack gap="8" py="16" items="center" data-class="pricing-container">
        <Stack gap="4" items="center" data-class="pricing-header">
          <If test="badge" value={!!badge}>
            <Badge variant="secondary" data-class="pricing-badge">
              <Var name="badge" value={badge} />
            </Badge>
          </If>

          <If test="title" value={!!title}>
            <Title fontSize="3xl" fontWeight="bold" textAlign="center" data-class="pricing-title">
              <Var name="title" value={title} />
            </Title>
          </If>

          <If test="subtitle" value={!!subtitle}>
            <Text fontSize="lg" textColor="muted-foreground" textAlign="center" max="w-xl" data-class="pricing-description">
              <Var name="subtitle" value={subtitle} />
            </Text>
          </If>
        </Stack>

        <Grid grid="cols-3" gap="6" data-class="pricing-grid">
          <Loop each="plans" as="plan" data={plans}>
            <Stack
              gap="6"
              p="6"
              rounded="xl"
              bg="card"
              border=""
              data-class="pricing-card"
            >
              <If test="plan.featured" value={plans[0]?.featured}>
                <Badge variant="secondary" data-class="pricing-featured-badge">
                  Most Popular
                </Badge>
              </If>

              <Stack gap="2" data-class="pricing-plan-header">
                <Title fontSize="xl" fontWeight="semibold" data-class="pricing-plan-name">
                  <Var name="plan.name" />
                </Title>
                <If test="plan.description" value={!!plans[0]?.description}>
                  <Text fontSize="sm" textColor="muted-foreground" data-class="pricing-plan-description">
                    <Var name="plan.description" />
                  </Text>
                </If>
              </Stack>

              <Stack gap="1" data-class="pricing-price">
                <Box flex="" items="end" gap="1" data-class="pricing-price-wrapper">
                  <Title fontSize="4xl" fontWeight="bold" data-class="pricing-amount">
                    <Var name="plan.price" />
                  </Title>
                  <If test="plan.period" value={!!plans[0]?.period}>
                    <Text fontSize="sm" textColor="muted-foreground" data-class="pricing-period">
                      <Var name="plan.period" />
                    </Text>
                  </If>
                </Box>
              </Stack>

              <Stack gap="2" data-class="pricing-features">
                <Loop each="plan.features" as="feature" data={plans[0]?.features}>
                  <Text fontSize="sm" data-class="pricing-feature">
                    ✓ <Var name="feature" />
                  </Text>
                </Loop>
              </Stack>

              <Button
                variant="outline"
                w="full"
                data-class="pricing-cta"
              >
                Get Started
              </Button>
            </Stack>
          </Loop>
        </Grid>
      </Stack>
    </Block>
  );
}
