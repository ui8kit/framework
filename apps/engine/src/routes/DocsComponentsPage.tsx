import { DashLayout } from '@/layouts';
import { DashSidebar } from '@/blocks';
import { context } from '@ui8kit/data';
import {
  Stack,
  Group,
  Title,
  Text,
  Button,
  Badge,
  Block,
  Container,
  Grid,
  Field,
  Card,
} from '@ui8kit/core';

/**
 * Docs Components — showcase all UI8Kit components and variants.
 * Sidebar from context; showcase content (temporarily) inline.
 */
export function DocsComponentsPage() {
  const { title, lead } = context.docsComponents;
  return (
    <DashLayout
      sidebar={
        <DashSidebar
          label={context.docsSidebarLabel}
          links={context.getDocsSidebarLinks('/docs/components')}
        />
      }
    >
      <Stack gap="12" data-class="docs-components-content">
        <Stack gap="4" data-class="docs-components-header">
          <Title fontSize="4xl" fontWeight="bold" data-class="docs-components-title">
            {title}
          </Title>
          <Text fontSize="lg" textColor="muted-foreground" data-class="docs-components-lead">
            {lead}
          </Text>
        </Stack>

        {/* Button */}
        <Stack gap="4" data-class="component-showcase">
          <Title fontSize="2xl" fontWeight="semibold" data-class="component-showcase-title">
            Button
          </Title>
          <Stack gap="4" data-class="component-showcase-variants">
            <Stack gap="2" data-class="variant-group">
              <Text fontSize="sm" fontWeight="medium" textColor="muted-foreground">
                Variants
              </Text>
              <Group gap="2" items="center" data-class="variant-row">
                <Button variant="default" data-class="showcase-btn">Default</Button>
                <Button variant="primary" data-class="showcase-btn">Primary</Button>
                <Button variant="secondary" data-class="showcase-btn">Secondary</Button>
                <Button variant="destructive" data-class="showcase-btn">Destructive</Button>
                <Button variant="outline" data-class="showcase-btn">Outline</Button>
                <Button variant="ghost" data-class="showcase-btn">Ghost</Button>
                <Button variant="link" data-class="showcase-btn">Link</Button>
              </Group>
            </Stack>
            <Stack gap="2" data-class="variant-group">
              <Text fontSize="sm" fontWeight="medium" textColor="muted-foreground">
                Sizes
              </Text>
              <Group gap="2" items="center" data-class="variant-row">
                <Button size="xs" data-class="showcase-btn">xs</Button>
                <Button size="sm" data-class="showcase-btn">sm</Button>
                <Button size="default" data-class="showcase-btn">default</Button>
                <Button size="lg" data-class="showcase-btn">lg</Button>
                <Button size="xl" data-class="showcase-btn">xl</Button>
              </Group>
            </Stack>
          </Stack>
        </Stack>

        {/* Badge */}
        <Stack gap="4" data-class="component-showcase">
          <Title fontSize="2xl" fontWeight="semibold" data-class="component-showcase-title">
            Badge
          </Title>
          <Group gap="2" items="center" data-class="variant-row">
            <Badge variant="default" data-class="showcase-badge">Default</Badge>
            <Badge variant="secondary" data-class="showcase-badge">Secondary</Badge>
            <Badge variant="destructive" data-class="showcase-badge">Destructive</Badge>
            <Badge variant="outline" data-class="showcase-badge">Outline</Badge>
          </Group>
        </Stack>

        {/* Layout: Block, Stack, Group, Container, Box */}
        <Stack gap="4" data-class="component-showcase">
          <Title fontSize="2xl" fontWeight="semibold" data-class="component-showcase-title">
            Layout
          </Title>
          <Stack gap="4" data-class="layout-demo">
            <Block component="section" p="4" rounded="md" bg="muted" data-class="layout-demo-block">
              <Text fontSize="sm" data-class="layout-demo-label">Block (section)</Text>
            </Block>
            <Stack gap="2" p="4" rounded="md" bg="muted" data-class="layout-demo-stack">
              <Text fontSize="sm" data-class="layout-demo-label">Stack (vertical)</Text>
              <Text fontSize="xs" textColor="muted-foreground">gap="2"</Text>
            </Stack>
            <Group gap="4" items="center" p="4" rounded="md" bg="muted" data-class="layout-demo-group">
              <Text fontSize="sm" data-class="layout-demo-label">Group (horizontal)</Text>
              <Badge variant="secondary">Badge</Badge>
            </Group>
            <Container max="w-md" p="4" rounded="md" bg="muted" data-class="layout-demo-container">
              <Text fontSize="sm" data-class="layout-demo-label">Container (max-w-md)</Text>
            </Container>
          </Stack>
        </Stack>

        {/* Typography: Title, Text */}
        <Stack gap="4" data-class="component-showcase">
          <Title fontSize="2xl" fontWeight="semibold" data-class="component-showcase-title">
            Typography
          </Title>
          <Stack gap="4" data-class="typography-demo">
            <Stack gap="1" data-class="typography-item">
              <Title order={1} fontSize="4xl" data-class="typography-title">Title</Title>
              <Text fontSize="xs" textColor="muted-foreground">order=1 fontSize="4xl"</Text>
            </Stack>
            <Stack gap="1" data-class="typography-item">
              <Title order={2} fontSize="2xl" data-class="typography-title">Heading 2</Title>
              <Text fontSize="xs" textColor="muted-foreground">order=2 fontSize="2xl"</Text>
            </Stack>
            <Stack gap="1" data-class="typography-item">
              <Text fontSize="lg" data-class="typography-text">Body large</Text>
              <Text fontSize="xs" textColor="muted-foreground">fontSize="lg"</Text>
            </Stack>
            <Stack gap="1" data-class="typography-item">
              <Text fontSize="base" textColor="muted-foreground" data-class="typography-text">
                Muted foreground
              </Text>
              <Text fontSize="xs" textColor="muted-foreground">textColor="muted-foreground"</Text>
            </Stack>
          </Stack>
        </Stack>

        {/* Field */}
        <Stack gap="4" data-class="component-showcase">
          <Title fontSize="2xl" fontWeight="semibold" data-class="component-showcase-title">
            Field
          </Title>
          <Stack gap="4" data-class="field-demo">
            <Stack gap="2" data-class="field-demo-group">
              <Text fontSize="sm" fontWeight="medium" textColor="muted-foreground">
                Kinds
              </Text>
              <Group gap="4" items="center" flex="wrap" data-class="field-demo-row">
                <Field type="text" placeholder="Text input" w="max" data-class="field-demo-input" />
                <Field type="email" placeholder="Email" w="max" data-class="field-demo-input" />
                <Field component="textarea" placeholder="Textarea" rows={2} w="max" data-class="field-demo-textarea" />
                <Field type="checkbox" data-class="field-demo-checkbox" />
                <Field type="radio" name="demo" value="1" data-class="field-demo-radio" />
                <Field component="button" type="submit" data-class="field-demo-submit">Submit</Field>
              </Group>
            </Stack>
            <Stack gap="2" data-class="field-demo-group">
              <Text fontSize="sm" fontWeight="medium" textColor="muted-foreground">
                Variants
              </Text>
              <Group gap="2" items="center" flex="wrap" data-class="field-demo-row">
                <Field variant="default" placeholder="Default" w="max" data-class="field-demo-input" />
                <Field variant="outline" placeholder="Outline" w="max" data-class="field-demo-input" />
                <Field variant="ghost" placeholder="Ghost" w="max" data-class="field-demo-input" />
              </Group>
            </Stack>
            <Stack gap="2" data-class="field-demo-group">
              <Text fontSize="sm" fontWeight="medium" textColor="muted-foreground">
                Sizes
              </Text>
              <Group gap="2" items="center" data-class="field-demo-row">
                <Field size="sm" placeholder="Small" w="max" data-class="field-demo-input" />
                <Field size="default" placeholder="Default" w="max" data-class="field-demo-input" />
                <Field size="lg" placeholder="Large" w="max" data-class="field-demo-input" />
              </Group>
            </Stack>
          </Stack>
        </Stack>

        {/* Grid */}
        <Stack gap="4" data-class="component-showcase">
          <Title fontSize="2xl" fontWeight="semibold" data-class="component-showcase-title">
            Grid
          </Title>
          <Grid cols="1-2-4" gap="4" data-class="grid-demo">
            <Card data-class="grid-demo-cell">1</Card>
            <Card data-class="grid-demo-cell">2</Card>
            <Card data-class="grid-demo-cell">3</Card>
            <Card data-class="grid-demo-cell">4</Card>
          </Grid>
        </Stack>
      </Stack>
    </DashLayout>
  );
}
