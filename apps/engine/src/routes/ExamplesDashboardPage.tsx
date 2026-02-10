import { Block, Container, Stack, Title, Text, Grid } from '@ui8kit/core';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@ui8kit/core';

/**
 * Examples Dashboard page — dashboard-style components.
 */
export function ExamplesDashboardPage() {
  return (
    <Block component="section" py="12" data-class="examples-dashboard-section">
      <Container max="w-6xl" flex="col" gap="8" data-class="examples-dashboard-container">
        <Stack gap="2" data-class="examples-dashboard-header">
          <Title fontSize="2xl" fontWeight="bold" data-class="examples-dashboard-title">
            Dashboard
          </Title>
          <Text fontSize="sm" textColor="muted-foreground" data-class="examples-dashboard-description">
            Dashboard layout and card patterns.
          </Text>
        </Stack>

        <Grid cols="1-2-3" gap="6" data-class="examples-dashboard-grid">
          <Card data-class="examples-dashboard-card">
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description text.</CardDescription>
            </CardHeader>
            <CardContent>
              <Text fontSize="sm" data-class="examples-dashboard-card-text">
                Card content goes here.
              </Text>
            </CardContent>
          </Card>
          <Card data-class="examples-dashboard-card">
            <CardHeader>
              <CardTitle>Stats</CardTitle>
              <CardDescription>Metric overview.</CardDescription>
            </CardHeader>
            <CardContent>
              <Text fontSize="sm" data-class="examples-dashboard-card-text">
                Stats content.
              </Text>
            </CardContent>
          </Card>
          <Card data-class="examples-dashboard-card">
            <CardHeader>
              <CardTitle>Activity</CardTitle>
              <CardDescription>Recent activity.</CardDescription>
            </CardHeader>
            <CardContent>
              <Text fontSize="sm" data-class="examples-dashboard-card-text">
                Activity feed.
              </Text>
            </CardContent>
          </Card>
        </Grid>
      </Container>
    </Block>
  );
}
