import { DashLayout } from '@/layouts';
import { DashSidebar } from '@/blocks';
import { context } from '@ui8kit/data';
import { Stack, Title, Text, Block } from '@ui8kit/core';
import { Fragment } from 'react';

interface DocsInstallationPageProps {
  length?: any;
}

export function DocsInstallationPage(props: DocsInstallationPageProps) {
  const { length } = props;
  return (
    <DashLayout sidebar={<DashSidebar
              label={context.docsSidebarLabel}
              links={context.getDocsSidebarLinks('/docs/installation')}
            />}>
      <Stack gap="8" data-class="docs-install-content">
        <Stack gap="4" data-class="docs-install-header">
          <Title fontSize="4xl" fontWeight="bold" data-class="docs-install-title">
            {context.docsInstallation.title ? (<>{context.docsInstallation.title}</>) : null}
          </Title>
          <Text fontSize="lg" textColor="muted-foreground" data-class="docs-install-lead">
            {context.docsInstallation.lead ? (<>{context.docsInstallation.lead}</>) : null}
          </Text>
        </Stack>
        <Stack gap="6" data-class="docs-install-sections">
          {(context.docsInstallation.sections ?? []).length > 0 ? (<>{context.docsInstallation.sections.map((section, index) => (
          <Fragment key={section.id}>
          <Stack gap="2" data-class="docs-install-section"><Title fontSize="xl" fontWeight="semibold" data-class="docs-install-section-title">{section.title ? (<>{section.title}</>) : null}</Title>{section.code ? (<><Block component="pre" p="4" rounded="md" bg="muted" data-class="docs-install-code"><Text fontSize="sm" component="code" data-class="docs-install-code-text">{section.code}</Text></Block></>) : null}{section.text ? (<>{!!section.code ? (<><Text fontSize="sm" textColor="muted-foreground" data-class="docs-install-desc">{section.text}</Text></>) : null}{!section.code ? (<><Text fontSize="base" textColor="muted-foreground" data-class="docs-install-text">{section.text}</Text></>) : null}</>) : null}</Stack>
          </Fragment>
          ))}</>) : null}
        </Stack>
      </Stack>
    </DashLayout>
  );
}
