import type { ReactNode } from 'react';
import { DashLayout } from '@/layouts';
import { Stack, Title, Text } from '@ui8kit/core';
import { Fragment } from 'react';

interface DocsPageViewProps {
  sidebar: ReactNode;
  docsIntro: {
    title?: string;
    lead?: string;
    sections?: { id: string; title?: string; text?: string }[];
  };
}

export function DocsPageView(props: DocsPageViewProps) {
  const { sidebar, docsIntro } = props;

  return (
    <DashLayout sidebar={sidebar}>
      <Stack gap="8" data-class="docs-content">
        <Stack gap="4" data-class="docs-header">
          {docsIntro.title ? (<><Title fontSize="4xl" fontWeight="bold" data-class="docs-title">{docsIntro.title}</Title></>) : null}
          {docsIntro.lead ? (<><Text fontSize="lg" textColor="muted-foreground" data-class="docs-lead">{docsIntro.lead}</Text></>) : null}
        </Stack>
        <Stack gap="6" data-class="docs-sections">
          {(docsIntro.sections ?? []).length > 0 ? (<>{(docsIntro.sections ?? []).map((section, index) => (
          <Fragment key={section.id}>
          <Stack gap="2" data-class="docs-section">{section.title ? (<><Title fontSize="xl" fontWeight="semibold" data-class="docs-section-title">{section.title}</Title></>) : null}{section.text ? (<><Text fontSize="base" textColor="muted-foreground" data-class="docs-section-text">{section.text}</Text></>) : null}</Stack>
          </Fragment>
          ))}</>) : null}
        </Stack>
      </Stack>
    </DashLayout>
  );
}
