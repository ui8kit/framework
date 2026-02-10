import { Block, Grid, Stack, Title, Text } from '@ui8kit/core';
import { If, Var, Loop } from '@ui8kit/template';

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface FeaturesBlockProps {
  title?: string;
  subtitle?: string;
  features?: Feature[];
}

export function FeaturesBlock({
  title,
  subtitle,
  features = [],
}: FeaturesBlockProps) {
  return (
    <Block component="section" data-class="features-section">
      <Stack gap="8" py="16">
        <Stack gap="4" items="center" data-class="features-header">
          <If test="title" value={!!title}>
            <Title
              fontSize="3xl"
              fontWeight="bold"
              textAlign="center"
              data-class="features-title"
            >
              <Var name="title" value={title} />
            </Title>
          </If>

          <If test="subtitle" value={!!subtitle}>
            <Text
              fontSize="lg"
              textColor="muted-foreground"
              textAlign="center"
              max="w-xl"
              data-class="features-description"
            >
              <Var name="subtitle" value={subtitle} />
            </Text>
          </If>
        </Stack>

        <Grid cols="1-2-4" gap="6" data-class="features-grid">
          <Loop each="features" as="feature" data={features}>
            {(feature: Feature) => (
              <Stack
                component="article"
                gap="4"
                p="6"
                rounded="lg"
                bg="card"
                border=""
                data-class="feature-card"
              >
                <Title
                  fontSize="xl"
                  fontWeight="semibold"
                  data-class="feature-title"
                >
                  <Var name="feature.title" value={feature.title} />
                </Title>

                <Text
                  fontSize="sm"
                  textColor="muted-foreground"
                  data-class="feature-description"
                >
                  <Var name="feature.description" value={feature.description} />
                </Text>
              </Stack>
            )}
          </Loop>
        </Grid>
      </Stack>
    </Block>
  );
}
