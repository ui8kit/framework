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
            <If test="context.docsIntro.title" value={!!(context.docsIntro.title ?? '')}>
              <Var name="context.docsIntro.title" value={context.docsIntro.title ?? ''} />
            </If>
          </Title>
          <Text fontSize="lg" textColor="muted-foreground" data-class="docs-lead">
            <If test="context.docsIntro.lead" value={!!(context.docsIntro.lead ?? '')}>
              <Var name="context.docsIntro.lead" value={context.docsIntro.lead ?? ''} />
            </If>
          </Text>
        </Stack>
        <Stack gap="6" data-class="docs-sections">
          <If
            test="(context.docsIntro.sections ?? []).length > 0"
            value={(context.docsIntro.sections ?? []).length > 0}
          >
            <Loop
              each="context.docsIntro.sections"
              as="section"
              keyExpr="section.id"
              data={context.docsIntro.sections ?? []}
            >
              {(section: DocsIntroSection) => (
                <Stack gap="2" data-class="docs-section">
                  <Title fontSize="xl" fontWeight="semibold" data-class="docs-section-title">
                    <If test="section.title" value={!!(section.title ?? '')}>
                      <Var name="section.title" value={section.title ?? ''} />
                    </If>
                  </Title>
                  <Text fontSize="base" textColor="muted-foreground" data-class="docs-section-text">
                    <If test="section.text" value={!!(section.text ?? '')}>
                      <Var name="section.text" value={section.text ?? ''} />
                    </If>
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
