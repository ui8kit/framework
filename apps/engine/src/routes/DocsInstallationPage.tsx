import { DashLayout } from '@/layouts';
import { DashSidebar } from '@/blocks';
import { context } from '@ui8kit/data';
import { Stack, Title, Text, Block } from '@ui8kit/core';
import { If, Loop, Var } from '@ui8kit/template';

type DocsInstallationSection = {
  id: string;
  title: string;
  text?: string;
  code?: string;
};

/**
 * Docs Installation — setup guide.
 * Data from context.docsInstallation.
 */
export function DocsInstallationPage() {
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
            <Var name="docsInstallation.title" value={context.docsInstallation.title} />
          </Title>
          <Text fontSize="lg" textColor="muted-foreground" data-class="docs-install-lead">
            <Var name="docsInstallation.lead" value={context.docsInstallation.lead} />
          </Text>
        </Stack>
        <Stack gap="6" data-class="docs-install-sections">
          <If test="docsInstallation.sections" value={(context.docsInstallation.sections ?? []).length > 0}>
            <Loop
              each="docsInstallation.sections"
              as="section"
              keyExpr="section.id"
              data={context.docsInstallation.sections ?? []}
            >
              {(section: DocsInstallationSection) => (
                <Stack gap="2" data-class="docs-install-section">
                  <Title fontSize="xl" fontWeight="semibold" data-class="docs-install-section-title">
                    <Var name="section.title" value={section.title} />
                  </Title>
                  <If test="section.code" value={!!section.code}>
                    <Block component="pre" p="4" rounded="md" bg="muted" data-class="docs-install-code">
                      <Text fontSize="sm" component="code" data-class="docs-install-code-text">
                        <Var name="section.code" value={section.code} />
                      </Text>
                    </Block>
                  </If>
                  <If test="section.text" value={!!section.text}>
                    <>
                      <If test="section.codeForText" value={!!section.code}>
                        <Text
                          fontSize="sm"
                          textColor="muted-foreground"
                          data-class="docs-install-desc"
                        >
                          <Var name="section.text" value={section.text} />
                        </Text>
                      </If>
                      <If test="section.plainText" value={!section.code}>
                        <Text
                          fontSize="base"
                          textColor="muted-foreground"
                          data-class="docs-install-text"
                        >
                          <Var name="section.text" value={section.text} />
                        </Text>
                      </If>
                    </>
                  </If>
                </Stack>
              )}
            </Loop>
          </If>
        </Stack>
      </Stack>
    </DashLayout>
  );
}
