import { DashLayout } from '@/layouts';
import { DashSidebar } from '@/blocks';
import { context } from '@ui8kit/data';
import { Stack, Title, Text, Block } from '@ui8kit/core';

const docsLinks = context.docsSidebarLinks.map((link) => ({
  ...link,
  active: link.href === '/docs/installation',
}));

/**
 * Docs Installation — setup guide.
 */
export function DocsInstallationPage() {
  return (
    <DashLayout sidebar={<DashSidebar label="Documentation" links={docsLinks} />}>
      <Stack gap="8" data-class="docs-install-content">
        <Stack gap="4" data-class="docs-install-header">
          <Title fontSize="4xl" fontWeight="bold" data-class="docs-install-title">
            Installation
          </Title>
          <Text fontSize="lg" textColor="muted-foreground" data-class="docs-install-lead">
            Add UI8Kit to your project.
          </Text>
        </Stack>
        <Stack gap="6" data-class="docs-install-sections">
          <Stack gap="2" data-class="docs-install-section">
            <Title fontSize="xl" fontWeight="semibold" data-class="docs-install-section-title">
              From monorepo
            </Title>
            <Block component="pre" p="4" rounded="md" bg="muted" data-class="docs-install-code">
              <Text fontSize="sm" component="code" data-class="docs-install-code-text">
                {`import { Button, Stack, Group } from '@ui8kit/core';`}
              </Text>
            </Block>
            <Text fontSize="sm" textColor="muted-foreground" data-class="docs-install-desc">
              Workspace packages resolve via Turborepo. Use @ui8kit/core for components.
            </Text>
          </Stack>
          <Stack gap="2" data-class="docs-install-section">
            <Title fontSize="xl" fontWeight="semibold" data-class="docs-install-section-title">
              Design tokens
            </Title>
            <Text fontSize="base" textColor="muted-foreground" data-class="docs-install-text">
              Copy shadcn.css or your theme variables. CSS variables power the
              semantic tokens (primary, secondary, muted, destructive, etc.).
            </Text>
          </Stack>
          <Stack gap="2" data-class="docs-install-section">
            <Title fontSize="xl" fontWeight="semibold" data-class="docs-install-section-title">
              Generator
            </Title>
            <Text fontSize="base" textColor="muted-foreground" data-class="docs-install-text">
              Run <code>bun run generate</code> in apps/engine to build React templates.
              Output goes to dist/react/. Copy to your app or use via CDN registry.
            </Text>
          </Stack>
        </Stack>
      </Stack>
    </DashLayout>
  );
}
