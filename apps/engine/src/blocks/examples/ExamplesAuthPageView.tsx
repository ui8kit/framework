import { Block, Container, Stack, Title, Text, Grid, Button, Field, Card } from '@ui8kit/core';

/**
 * Examples Authentication page view — auth forms and flows.
 */
export function ExamplesAuthPageView() {
  return (
    <Block component="section" py="16" data-class="examples-auth-section">
      <Container max="w-md" flex="col" gap="8" items="center" data-class="examples-auth-container">
        <Stack gap="2" items="center" data-class="examples-auth-header">
          <Title fontSize="2xl" fontWeight="bold" textAlign="center" data-class="examples-auth-title">
            Sign in
          </Title>
          <Text
            fontSize="sm"
            textColor="muted-foreground"
            textAlign="center"
            data-class="examples-auth-description"
          >
            Sign in to your account.
          </Text>
        </Stack>

        <Card
          gap="4"
          w="full"
          data-class="examples-auth-form"
        >
          <Stack gap="2" data-class="examples-auth-field">
            <Text fontSize="sm" fontWeight="medium" data-class="examples-auth-label">
              Email
            </Text>
            <Field
              type="email"
              placeholder="name@example.com"
              w="full"
              data-class="examples-auth-input"
            />
          </Stack>
          <Stack gap="2" data-class="examples-auth-field">
            <Text fontSize="sm" fontWeight="medium" data-class="examples-auth-label">
              Password
            </Text>
            <Field
              type="password"
              placeholder="••••••••"
              w="full"
              data-class="examples-auth-input"
            />
          </Stack>
          <Grid cols="1-2" gap="2" data-class="examples-auth-actions">
            <Button w="full" data-class="examples-auth-submit">
              Sign in
            </Button>
            <Button variant="outline" w="full" data-class="examples-auth-submit">
              Sign up
            </Button>
          </Grid>
        </Card>
      </Container>
    </Block>
  );
}
