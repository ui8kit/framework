import { Block, Stack, Group, Title, Text, Button } from '@ui8kit/core';

interface CTABlockProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaUrl?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
}

export function CTABlock(props: CTABlockProps) {
  const { title, subtitle, ctaText, ctaUrl, secondaryCtaText, secondaryCtaUrl } = props;

  return (
    <Block component="section" data-class="cta-section">
      <Stack gap="6" items="center" py="16" px="6" rounded="2xl" bg="primary" data-class="cta-container">
        <Stack gap="4" items="center" data-class="cta-content">
          {title ? (<><Title fontSize="3xl" fontWeight="bold" textAlign="center" textColor="primary-foreground" data-class="cta-title">{title}</Title></>) : null}
          {subtitle ? (<><Text fontSize="lg" textAlign="center" textColor="primary-foreground" max="w-xl" data-class="cta-description">{subtitle}</Text></>) : null}
        </Stack>
        <Group gap="4" items="center" justify="center" data-class="cta-actions">
          {ctaText ? (<><Button variant="secondary" size="lg" href={ctaUrl} data-class="cta-primary-button">{ctaText}</Button></>) : null}
          {secondaryCtaText ? (<><Button variant="outline" size="lg" href={secondaryCtaUrl} data-class="cta-secondary-button">{secondaryCtaText}</Button></>) : null}
        </Group>
      </Stack>
    </Block>
  );
}
