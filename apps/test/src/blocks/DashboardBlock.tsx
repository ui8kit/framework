import { Block, Grid, Stack, Box, Button, Title, Text } from '@ui8kit/core';

interface DashboardBlockProps {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
}

export function DashboardBlock(props: DashboardBlockProps) {
  const { title, description, ctaText, ctaUrl } = props;

  return (
    <Block w="full" component="section" data-class="dashboard-section">
      <Stack gap="6">
        {title ? (<><Title fontSize="2xl" fontWeight="bold" mt="6" data-class="dashboard-title">{title}</Title></>) : null}
        <Grid cols="1-2-3" data-class="dashboard-grid">
          <Box col="span-2" data-class="dashboard-description">
            {description ? (<><Text fontSize="base" textColor="muted-foreground">{description}</Text></>) : null}
          </Box>
          <Box col="span-1" flex="" justify="end" items="end" data-class="dashboard-actions">
            {ctaText ? (<><Button href={ctaUrl} data-class="dashboard-cta">{ctaText}</Button></>) : null}
          </Box>
        </Grid>
        <Box p="4" rounded="lg" shadow="none" bg="card" border="" aspect="video" w="full" data-class="dashboard-preview">
        </Box>
      </Stack>
    </Block>
  );
}
