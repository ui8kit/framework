import { Block, Grid, Stack, Box, Button, Title, Text } from "@ui8kit/core";

// Dashboard Block - semantic dashboard section
// Demonstrates: Grid layout, typography variants, mixed content

const content = {
  title: "Welcome to the dashboard",
  description: "This is the dashboard description"
};

export function DashboardBlock() {
  return (
    <Block w="full" component="section" data-class="dashboard-section">
      <Stack gap="6">
        <Title fontSize="2xl" fontWeight="bold" mt="6" data-class="dashboard-title">
          {content.title}
        </Title>

        <Grid cols="1-2-3" data-class="dashboard-grid">
          <Box col="span-2" data-class="dashboard-description">
            <Text fontSize="base" textColor="muted-foreground">
              {content.description}
            </Text>
          </Box>

          <Box col="span-1" flex="" justify="end" items="end" data-class="dashboard-actions">
            <Button>Click me</Button>
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
