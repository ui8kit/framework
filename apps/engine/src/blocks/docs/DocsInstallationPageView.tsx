import type { ReactNode } from 'react';
import { DashLayout } from '@/layouts';
import { Stack, Title, Text, Block } from '@ui8kit/core';
import { If, Loop, Var } from '@ui8kit/template';

export interface DocsInstallationPageViewProps {
  sidebar: ReactNode;
  docsInstallation: {
    title?: string;
    lead?: string;
    sections?: { id: string; title?: string; text?: string; code?: string }[];
  };
}

/**
 * Docs Installation view — setup guide (props-only).
 */
export function DocsInstallationPageView({
  sidebar,
  docsInstallation,
}: DocsInstallationPageViewProps) {
  return (
    <DashLayout sidebar={sidebar}>
      <Stack gap="8" data-class="docs-install-content">
        <Stack gap="4" data-class="docs-install-header">
          <If test="docsInstallation.title" value={!!(docsInstallation.title ?? '')}>
            <Title fontSize="4xl" fontWeight="bold" data-class="docs-install-title">
              <Var
                name="docsInstallation.title"
                value={docsInstallation.title ?? ''}
              />
            </Title>
          </If>
          <If test="docsInstallation.lead" value={!!(docsInstallation.lead ?? '')}>
            <Text fontSize="lg" textColor="muted-foreground" data-class="docs-install-lead">
              <Var
                name="docsInstallation.lead"
                value={docsInstallation.lead ?? ''}
              />
            </Text>
          </If>
        </Stack>
        <Stack gap="6" data-class="docs-install-sections">
          <If
            test="(docsInstallation.sections ?? []).length > 0"
            value={(docsInstallation.sections ?? []).length > 0}
          >
            <Loop
              each="docsInstallation.sections"
              as="section"
              keyExpr="section.id"
              data={docsInstallation.sections ?? []}
            >
              {(section: { id: string; title?: string; text?: string; code?: string }) => (
                <Stack gap="2" data-class="docs-install-section">
                  <If test="section.title" value={!!(section.title ?? '')}>
                    <Title fontSize="xl" fontWeight="semibold" data-class="docs-install-section-title">
                      <Var name="section.title" value={section.title ?? ''} />
                    </Title>
                  </If>
                  <If test="section.code" value={!!section.code}>
                    <Block component="pre" p="4" rounded="md" bg="muted" data-class="docs-install-code">
                      <Text fontSize="sm" component="code" data-class="docs-install-code-text">
                        <Var name="section.code" value={section.code} />
                      </Text>
                    </Block>
                  </If>
                  <If test="section.text" value={!!section.text}>
                    <>
                      <If test="!!section.code" value={!!section.code}>
                        <Text
                          fontSize="sm"
                          textColor="muted-foreground"
                          data-class="docs-install-desc"
                        >
                          <Var name="section.text" value={section.text} />
                        </Text>
                      </If>
                      <If test="!section.code" value={!section.code}>
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
