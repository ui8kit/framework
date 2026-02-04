import { Block, Grid, Stack, Box, Button, Title, Text } from '@ui8kit/core';
import { If, Var } from '@ui8kit/template';

export interface DashboardBlockProps {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
}

export function DashboardBlock({
  title,
  description,
  ctaText,
  ctaUrl,
}: DashboardBlockProps) {
  return (
    <Block w="full" component="section" data-class="dashboard-section">
      <Stack gap="6">
        <If test="title" value={!!title}>
          <Title fontSize="2xl" fontWeight="bold" mt="6" data-class="dashboard-title">
            <Var name="title" value={title} />
          </Title>
        </If>

        <Grid cols="1-2-3" data-class="dashboard-grid">
          <Box col="span-2" data-class="dashboard-description">
            <If test="description" value={!!description}>
              <Text fontSize="base" textColor="muted-foreground">
                <Var name="description" value={description} />
              </Text>
            </If>
          </Box>

          <Box col="span-1" flex="" justify="end" items="end" data-class="dashboard-actions">
            <If test="ctaText" value={!!ctaText}>
              <Button href={ctaUrl} data-class="dashboard-cta">
                <Var name="ctaText" value={ctaText} />
              </Button>
            </If>
          </Box>
        </Grid>

        <Box
          p="4"
          rounded="lg"
          shadow="none"
          bg="card"
          border=""
          aspect="video"
          w="full"
          data-class="dashboard-preview"
        />
      </Stack>
    </Block>
  );
}
