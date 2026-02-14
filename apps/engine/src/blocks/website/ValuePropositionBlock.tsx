import { Block, Container, Grid, Stack, Title, Text } from '@ui8kit/core';
import { If, Var, Loop } from '@ui8kit/template';
import type { ValuePropositionFixture } from '@ui8kit/data';

export interface ValuePropositionBlockProps extends ValuePropositionFixture {}

/**
 * Value proposition section — key benefits (props-only, DSL).
 */
export function ValuePropositionBlock({
  title,
  subtitle,
  items = [],
}: ValuePropositionBlockProps) {
  return (
    <Block component="section" py="16" bg="muted" data-class="value-proposition-section">
      <Container max="w-6xl" flex="col" gap="8" items="center" data-class="value-proposition-container">
        <If test="title" value={!!title}>
          <Title
            fontSize="3xl"
            fontWeight="bold"
            textAlign="center"
            data-class="value-proposition-title"
          >
            <Var name="title" value={title} />
          </Title>
        </If>
        <If test="subtitle" value={!!subtitle}>
          <Text
            fontSize="lg"
            textColor="muted-foreground"
            textAlign="center"
            max="w-2xl"
            data-class="value-proposition-subtitle"
          >
            <Var name="subtitle" value={subtitle} />
          </Text>
        </If>
        <Grid grid="cols-3" gap="6" data-class="value-proposition-grid">
          <Loop each="items" as="item" data={items}>
            {(item: { id: string; title: string; description: string }) => (
              <Stack
                p="6"
                rounded="lg"
                bg="card"
                border=""
                gap="4"
                data-class="value-proposition-card"
              >
                <If test="item.title" value={!!item.title}>
                  <Title fontSize="xl" fontWeight="semibold" data-class="value-proposition-card-title">
                    <Var name="item.title" value={item.title} />
                  </Title>
                </If>
                <If test="item.description" value={!!item.description}>
                  <Text fontSize="sm" textColor="muted-foreground" data-class="value-proposition-card-description">
                    <Var name="item.description" value={item.description} />
                  </Text>
                </If>
              </Stack>
            )}
          </Loop>
        </Grid>
      </Container>
    </Block>
  );
}
