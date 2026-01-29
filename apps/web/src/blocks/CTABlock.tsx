import { Block, Stack, Group, Title, Text, Button } from "@ui8kit/core";

// CTA Block - semantic call-to-action section
// Demonstrates: Typography variants, background styling, button group

export function CTABlock() {
  return (
    <Block component="section" data-class="cta-section">
      <Stack gap="6" items="center" py="16" px="6" rounded="2xl" bg="primary" data-class="cta-container">
        <Stack gap="4" items="center" data-class="cta-content">
          <Title
            fontSize="3xl"
            fontWeight="bold"
            textAlign="center"
            textColor="primary-foreground"
            data-class="cta-title"
          >
            Ready to Get Started?
          </Title>

          <Text
            fontSize="lg"
            textAlign="center"
            textColor="primary-foreground"
            max="w-xl"
            data-class="cta-description"
          >
            Join thousands of developers building better interfaces with UI8Kit.
            Start for free, upgrade when you need.
          </Text>
        </Stack>

        <Group gap="4" items="center" justify="center" data-class="cta-actions">
          <Button variant="secondary" size="lg" data-class="cta-primary-button">
            Start Free Trial
          </Button>
          <Button variant="outline" size="lg" data-class="cta-secondary-button">
            View Documentation
          </Button>
        </Group>
      </Stack>
    </Block>
  );
}
