import { DashLayout } from '@/layouts';
import { DashSidebar } from '@/blocks';
import { context } from '@ui8kit/data';
import { Stack, Title, Text, Block } from '@ui8kit/core';

/**
 * Docs Installation — setup guide.
 * Data from context.docsInstallation.
 */
export function DocsInstallationPage() {
  const { title, lead, sections = [] } = context.docsInstallation;
  return (
    <DashLayout
      sidebar={
        <DashSidebar
          label={context.docsSidebarLabel}
          links={context.getDocsSidebarLinks('/docs/installation')}
        />
      }
    >
      <Stack gap="8" data-class="docs-install-content">
        <Stack gap="4" data-class="docs-install-header">
          <Title fontSize="4xl" fontWeight="bold" data-class="docs-install-title">
            {title}
          </Title>
          <Text fontSize="lg" textColor="muted-foreground" data-class="docs-install-lead">
            {lead}
          </Text>
        </Stack>
        <Stack gap="6" data-class="docs-install-sections">
          {sections.map((section) => (
            <Stack key={section.id} gap="2" data-class="docs-install-section">
              <Title fontSize="xl" fontWeight="semibold" data-class="docs-install-section-title">
                {section.title}
              </Title>
              {section.code ? (
                <Block component="pre" p="4" rounded="md" bg="muted" data-class="docs-install-code">
                  <Text fontSize="sm" component="code" data-class="docs-install-code-text">
                    {section.code}
                  </Text>
                </Block>
              ) : null}
              {section.text ? (
                <Text
                  fontSize={section.code ? 'sm' : 'base'}
                  textColor="muted-foreground"
                  data-class={section.code ? 'docs-install-desc' : 'docs-install-text'}
                >
                  {section.text}
                </Text>
              ) : null}
            </Stack>
          ))}
        </Stack>
      </Stack>
    </DashLayout>
  );
}
