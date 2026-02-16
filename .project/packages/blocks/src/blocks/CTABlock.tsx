import { Block, Stack, Group, Title, Text, Button } from '@ui8kit/core';
import { If, Var } from '@ui8kit/template';

export interface CTABlockProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaUrl?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
}

export function CTABlock({
  title,
  subtitle,
  ctaText,
  ctaUrl,
  secondaryCtaText,
  secondaryCtaUrl,
}: CTABlockProps) {
  return (
    <Block component="section" data-class="cta-section">
      <Stack gap="6" items="center" py="16" px="6" rounded="2xl" bg="primary" data-class="cta-container">
        <Stack gap="4" items="center" data-class="cta-content">
          <If test="title" value={!!title}>
            <Title
              fontSize="3xl"
              fontWeight="bold"
              textAlign="center"
              textColor="primary-foreground"
              data-class="cta-title"
            >
              <Var name="title" value={title} />
            </Title>
          </If>

          <If test="subtitle" value={!!subtitle}>
            <Text
              fontSize="lg"
              textAlign="center"
              textColor="primary-foreground"
              max="w-xl"
              data-class="cta-description"
            >
              <Var name="subtitle" value={subtitle} />
            </Text>
          </If>
        </Stack>

        <Group gap="4" items="center" justify="center" data-class="cta-actions">
          <If test="ctaText" value={!!ctaText}>
            <Button variant="secondary" size="lg" href={ctaUrl} data-class="cta-primary-button">
              <Var name="ctaText" value={ctaText} />
            </Button>
          </If>
          
          <If test="secondaryCtaText" value={!!secondaryCtaText}>
            <Button variant="outline" size="lg" href={secondaryCtaUrl} data-class="cta-secondary-button">
              <Var name="secondaryCtaText" value={secondaryCtaText} />
            </Button>
          </If>
        </Group>
      </Stack>
    </Block>
  );
}
