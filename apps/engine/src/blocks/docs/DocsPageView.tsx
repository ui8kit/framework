import type { ReactNode } from 'react';
import { DashLayout } from '@/layouts';
import { Stack, Title, Text } from '@ui8kit/core';
import { If, Loop, Var } from '@ui8kit/template';

export interface DocsPageViewProps {
  sidebar: ReactNode;
  docsIntro: {
    title?: string;
    lead?: string;
    sections?: { id: string; title?: string; text?: string }[];
  };
}

/**
 * Docs Introduction view — props-only.
 */
export function DocsPageView({ sidebar, docsIntro }: DocsPageViewProps) {
  return (
    <DashLayout sidebar={sidebar}>
      <Stack gap="8" data-class="docs-content">
        <Stack gap="4" data-class="docs-header">
          <If test="docsIntro.title" value={!!(docsIntro.title ?? '')}>
            <Title fontSize="4xl" fontWeight="bold" data-class="docs-title">
              <Var name="docsIntro.title" value={docsIntro.title ?? ''} />
            </Title>
          </If>
          <If test="docsIntro.lead" value={!!(docsIntro.lead ?? '')}>
            <Text fontSize="lg" textColor="muted-foreground" data-class="docs-lead">
              <Var name="docsIntro.lead" value={docsIntro.lead ?? ''} />
            </Text>
          </If>
        </Stack>
        <Stack gap="6" data-class="docs-sections">
          <If
            test="(docsIntro.sections ?? []).length > 0"
            value={(docsIntro.sections ?? []).length > 0}
          >
            <Loop
              each="docsIntro.sections"
              as="section"
              keyExpr="section.id"
              data={docsIntro.sections ?? []}
            >
              {(section: { id: string; title?: string; text?: string }) => (
                <Stack gap="2" data-class="docs-section">
                  <If test="section.title" value={!!(section.title ?? '')}>
                    <Title fontSize="xl" fontWeight="semibold" data-class="docs-section-title">
                      <Var name="section.title" value={section.title ?? ''} />
                    </Title>
                  </If>
                  <If test="section.text" value={!!(section.text ?? '')}>
                    <Text fontSize="base" textColor="muted-foreground" data-class="docs-section-text">
                      <Var name="section.text" value={section.text ?? ''} />
                    </Text>
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
