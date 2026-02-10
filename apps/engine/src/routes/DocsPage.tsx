import { DashLayout } from '@/layouts';
import { DashSidebar } from '@/blocks';
import { context } from '@ui8kit/data';
import { Stack, Title, Text } from '@ui8kit/core';
import { If, Loop, Var } from '@ui8kit/template';

type DocsIntroSection = {
  id: string;
  title: string;
  text?: string;
};

/**
 * Docs Introduction — motivation and overview.
 * Data from context.docsIntro.
 */
export function DocsPage() {
  return (
    <DashLayout
      sidebar={
        <DashSidebar
          label={context.docsSidebarLabel}
          links={context.getDocsSidebarLinks('/docs')}
        />
      }
    >
      <Stack gap="8" data-class="docs-content">
        <Stack gap="4" data-class="docs-header">
          <Title fontSize="4xl" fontWeight="bold" data-class="docs-title">
            <Var name="docsIntro.title" value={context.docsIntro.title} />
          </Title>
          <Text fontSize="lg" textColor="muted-foreground" data-class="docs-lead">
            <Var name="docsIntro.lead" value={context.docsIntro.lead} />
          </Text>
        </Stack>
        <Stack gap="6" data-class="docs-sections">
          <If test="docsIntro.sections" value={(context.docsIntro.sections ?? []).length > 0}>
            <Loop
              each="docsIntro.sections"
              as="section"
              keyExpr="section.id"
              data={context.docsIntro.sections ?? []}
            >
              {(section: DocsIntroSection) => (
                <Stack gap="2" data-class="docs-section">
                  <Title fontSize="xl" fontWeight="semibold" data-class="docs-section-title">
                    <Var name="section.title" value={section.title} />
                  </Title>
                  <Text fontSize="base" textColor="muted-foreground" data-class="docs-section-text">
                    <Var name="section.text" value={section.text} />
                  </Text>
                </Stack>
              )}
            </Loop>
          </If>
        </Stack>
      </Stack>
    </DashLayout>
  );
}
