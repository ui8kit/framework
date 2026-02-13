import type { ReactNode } from 'react';
import { DashLayout } from '@/layouts';
import { Stack, Title, Text, Block } from '@ui8kit/core';
import { Fragment } from 'react';

interface DocsInstallationPageViewProps {
  sidebar: ReactNode;
  docsInstallation: {
    title?: string;
    lead?: string;
    sections?: { id: string; title?: string; text?: string; code?: string }[];
  };
}

export function DocsInstallationPageView(props: DocsInstallationPageViewProps) {
  const { sidebar, docsInstallation } = props;

  return (
    <DashLayout sidebar={sidebar}>
      <Stack gap="8" data-class="docs-install-content">
        <Stack gap="4" data-class="docs-install-header">
          {docsInstallation.title ? (<><Title fontSize="4xl" fontWeight="bold" data-class="docs-install-title">{docsInstallation.title}</Title></>) : null}
          {docsInstallation.lead ? (<><Text fontSize="lg" textColor="muted-foreground" data-class="docs-install-lead">{docsInstallation.lead}</Text></>) : null}
        </Stack>
        <Stack gap="6" data-class="docs-install-sections">
          {(docsInstallation.sections ?? []).length > 0 ? (<>{(docsInstallation.sections ?? []).map((section, index) => (
          <Fragment key={section.id}>
          <Stack gap="2" data-class="docs-install-section">{section.title ? (<><Title fontSize="xl" fontWeight="semibold" data-class="docs-install-section-title">{section.title}</Title></>) : null}{section.code ? (<><Block component="pre" p="4" rounded="md" bg="muted" data-class="docs-install-code"><Text fontSize="sm" component="code" data-class="docs-install-code-text">{section.code}</Text></Block></>) : null}{section.text ? (<>{!!section.code ? (<><Text fontSize="sm" textColor="muted-foreground" data-class="docs-install-desc">{section.text}</Text></>) : null}{!section.code ? (<><Text fontSize="base" textColor="muted-foreground" data-class="docs-install-text">{section.text}</Text></>) : null}</>) : null}</Stack>
          </Fragment>
          ))}</>) : null}
        </Stack>
      </Stack>
    </DashLayout>
  );
}
