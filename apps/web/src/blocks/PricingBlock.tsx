import { Block, Grid, Stack, Box, Title, Text, Button, Badge } from "@ui8kit/core";

// Pricing Block - semantic pricing section
// Demonstrates: Grid layout, typography variants, Badge component

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for trying out UI8Kit",
    features: ["5 components", "Basic support", "Community access"],
    featured: false,
    buttonVariant: "outline" as const,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For professional developers",
    features: ["Unlimited components", "Priority support", "Source code access", "Custom themes"],
    featured: true,
    buttonVariant: "primary" as const,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large teams and organizations",
    features: ["Everything in Pro", "Dedicated support", "SLA guarantee", "Custom integrations"],
    featured: false,
    buttonVariant: "outline" as const,
  },
];

export function PricingBlock() {
  return (
    <Block component="section" data-class="pricing-section">
      <Stack gap="8" py="16" items="center">
        <Stack gap="4" items="center" data-class="pricing-header">
          <Badge variant="secondary" data-class="pricing-badge">
            Pricing
          </Badge>

          <Title fontSize="3xl" fontWeight="bold" textAlign="center" data-class="pricing-title">
            Simple, Transparent Pricing
          </Title>

          <Text fontSize="lg" textColor="muted-foreground" textAlign="center" max="w-xl" data-class="pricing-description">
            Choose the plan that fits your needs. No hidden fees.
          </Text>
        </Stack>

        <Grid grid="cols-3" gap="6" data-class="pricing-grid">
          {plans.map((plan, index) => (
            <Stack
              key={index}
              gap="6"
              p="6"
              rounded="xl"
              bg={plan.featured ? "primary" : "card"}
              border=""
              data-class={`pricing-card-${plan.name.toLowerCase()}`}
            >
              {plan.featured && (
                <Badge variant="secondary" data-class="pricing-featured-badge">
                  Most Popular
                </Badge>
              )}

              <Stack gap="2" data-class="pricing-plan-header">
                <Title fontSize="xl" fontWeight="semibold" data-class="pricing-plan-name">
                  {plan.name}
                </Title>
                <Text fontSize="sm" textColor="muted-foreground" data-class="pricing-plan-description">
                  {plan.description}
                </Text>
              </Stack>

              <Stack gap="1" data-class="pricing-price">
                <Box flex="" items="end" gap="1">
                  <Title fontSize="4xl" fontWeight="bold" data-class="pricing-amount">
                    {plan.price}
                  </Title>
                  {plan.period && (
                    <Text fontSize="sm" textColor="muted-foreground" data-class="pricing-period">
                      {plan.period}
                    </Text>
                  )}
                </Box>
              </Stack>

              <Stack gap="2" data-class="pricing-features">
                {plan.features.map((feature, featureIndex) => (
                  <Text key={featureIndex} fontSize="sm" data-class="pricing-feature">
                    ✓ {feature}
                  </Text>
                ))}
              </Stack>

              <Button
                variant={plan.buttonVariant}
                w="full"
                data-class={`pricing-cta-${plan.name.toLowerCase()}`}
              >
                Get Started
              </Button>
            </Stack>
          ))}
        </Grid>
      </Stack>
    </Block>
  );
}
