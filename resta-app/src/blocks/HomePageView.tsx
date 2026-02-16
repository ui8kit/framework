import { Block, Container, Stack, Title, Text, Button } from '@ui8kit/core';
import { If, Var } from '@ui8kit/template';

export interface HomePageViewProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaUrl?: string;
}

export function HomePageView({ title, subtitle, ctaText, ctaUrl }: HomePageViewProps) {
  return (
    <Block component="section" py="16" data-class="resta-hero">
      <Container max="w-5xl">
        <Stack gap="4" items="center">
          <If test="title" value={!!title}>
            <Title fontSize="5xl" textAlign="center">
              <Var name="title" value={title} />
            </Title>
          </If>
          <If test="subtitle" value={!!subtitle}>
            <Text textAlign="center">
              <Var name="subtitle" value={subtitle} />
            </Text>
          </If>
          <If test="ctaText" value={!!ctaText}>
            <Button href={ctaUrl}>
              <Var name="ctaText" value={ctaText} />
            </Button>
          </If>
        </Stack>
      </Container>
    </Block>
  );
}
