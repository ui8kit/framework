import React from 'react';
import { DashLayout } from '@/layouts';
import { DashSidebar } from '@/blocks';
import { context } from '@ui8kit/data';
import { Stack, Title, Text } from '@ui8kit/core';

interface DocsPageProps {
  lead?: any;
  sections?: any;
  title?: any;
}

export function DocsPage(props: DocsPageProps) {
  const { lead, sections, title } = props;
  return (
    <DashLayout sidebar={<DashSidebar
              label={context.docsSidebarLabel}
              links={context.getDocsSidebarLinks('/docs')}
            />}>
      <Stack gap="8" data-class="docs-content">
        <Stack gap="4" data-class="docs-header">
          <Title fontSize="4xl" fontWeight="bold" data-class="docs-title">
            {title}
          </Title>
          <Text fontSize="lg" textColor="muted-foreground" data-class="docs-lead">
            {lead}
          </Text>
        </Stack>
        <Stack gap="6" data-class="docs-sections">
          {sections.map((section, index) => (
          <React.Fragment key={section.id}>
          <Stack gap="2" data-class="docs-section"><Title fontSize="xl" fontWeight="semibold" data-class="docs-section-title">{section.title}</Title><Text fontSize="base" textColor="muted-foreground" data-class="docs-section-text">{section.text}</Text></Stack>
          </React.Fragment>
          ))}
        </Stack>
      </Stack>
    </DashLayout>
  );
}
