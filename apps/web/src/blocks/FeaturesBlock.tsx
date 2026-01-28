import { Block, Grid, Stack, Title, Text, Icon } from "@ui8kit/core";
import { Zap, Shield, Code, Globe } from "lucide-react";

// Features Block - semantic features section
const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Zero-runtime styling with static generation for optimal performance."
  },
  {
    icon: Shield,
    title: "Type Safe",
    description: "Full TypeScript support with strict prop validation at compile time."
  },
  {
    icon: Code,
    title: "Developer Friendly",
    description: "Modern React development with semantic HTML5/CSS3 output."
  },
  {
    icon: Globe,
    title: "SEO Optimized",
    description: "Clean semantic markup that search engines love."
  }
];

export function FeaturesBlock() {
  return (
    <Block component="section" data-class="features-section">
      <Stack gap="8" py="16">
        <Stack gap="4" items="center" data-class="features-header">
          <Title
            fontSize="3xl"
            fontWeight="bold"
            textAlign="center"
            data-class="features-title"
          >
            Why Choose UI8Kit?
          </Title>

          <Text
            fontSize="lg"
            textColor="muted-foreground"
            textAlign="center"
            max="w-xl"
            data-class="features-description"
          >
            Experience the best of both worlds: React development with semantic web standards.
          </Text>
        </Stack>

        <Grid cols="1-2-4" gap="6" data-class="features-grid">
          {features.map((feature, index) => (
            <Stack
              key={index}
              gap="4"
              p="6"
              rounded="lg"
              bg="card"
              border=""
              data-class={`feature-card-${index}`}
            >
              <Icon
                lucideIcon={feature.icon}
                size="lg"
                data-class="feature-icon"
              />

              <Title
                fontSize="xl"
                fontWeight="semibold"
                data-class="feature-title"
              >
                {feature.title}
              </Title>

              <Text
                fontSize="sm"
                textColor="muted-foreground"
                data-class="feature-description"
              >
                {feature.description}
              </Text>
            </Stack>
          ))}
        </Grid>
      </Stack>
    </Block>
  );
}
