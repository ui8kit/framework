import { DashLayout } from '@/layouts';
import { DashSidebar } from '@/blocks';
import { context } from '@ui8kit/data';
import { Stack, Title, Text } from '@ui8kit/core';
import { Fragment } from 'react';

interface DocsPageProps {
  length?: any;
}

export function DocsPage(props: DocsPageProps) {
  const { length } = props;

  return (
    <DashLayout sidebar={<DashSidebar
              label={context.docsSidebarLabel}
              links={context.getDocsSidebarLinks('/docs')}
            />}>
      <Stack gap="8" data-class="docs-content">
        <Stack gap="4" data-class="docs-header">
          <Title fontSize="4xl" fontWeight="bold" data-class="docs-title">
            {context.docsIntro.title ? (<>{context.docsIntro.title}</>) : null}
          </Title>
          <Text fontSize="lg" textColor="muted-foreground" data-class="docs-lead">
            {context.docsIntro.lead ? (<>{context.docsIntro.lead}</>) : null}
          </Text>
        </Stack>
        <Stack gap="6" data-class="docs-sections">
          {(context.docsIntro.sections ?? []).length > 0 ? (<>{context.docsIntro.sections.map((section, index) => (
          <Fragment key={section.id}>
          <Stack gap="2" data-class="docs-section"><Title fontSize="xl" fontWeight="semibold" data-class="docs-section-title">{section.title ? (<>{section.title}</>) : null}</Title><Text fontSize="base" textColor="muted-foreground" data-class="docs-section-text">{section.text ? (<>{section.text}</>) : null}</Text></Stack>
          </Fragment>
          ))}</>) : null}
        </Stack>
      </Stack>
    </DashLayout>
  );
}
