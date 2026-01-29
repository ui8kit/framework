import { Block, Stack, Group, Title, Text, Button } from "@ui8kit/core";

// Hero Block - semantic page hero section
// Demonstrates: typography variants, semantic data-class, proper prop usage
export function HeroBlock() {
  return (
    <Block component="section" data-class="hero-section">
      <Stack gap="6" items="center" py="16">
        <Stack gap="4" items="center" data-class="hero-content">
          <Title
            fontSize="4xl"
            fontWeight="bold"
            textAlign="center"
            data-class="hero-title"
          >
            Welcome to UI8Kit
          </Title>

          <Text
            fontSize="xl"
            textColor="muted-foreground"
            textAlign="center"
            max="w-2xl"
            data-class="hero-description"
          >
            The next generation UI framework combining React development
            with semantic HTML5/CSS3 static generation.
          </Text>
        </Stack>

        <Group gap="4" data-class="hero-actions">
          <Button size="lg" data-class="hero-cta-primary">
            Get Started
          </Button>
          <Button variant="outline" size="lg" data-class="hero-cta-secondary">
            Learn More
          </Button>
        </Group>
      </Stack>
    </Block>
  );
}