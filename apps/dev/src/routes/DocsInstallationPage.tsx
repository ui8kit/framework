import React from 'react';
import { DashLayout } from '@/layouts';
import { DashSidebar } from '@/blocks';
import { context } from '@ui8kit/data';
import { Stack, Title, Text, Block } from '@ui8kit/core';

export function DocsInstallationPage() {
  return (
    <DashLayout sidebar={<DashSidebar
              label={context.docsSidebarLabel}
              links={context.getDocsSidebarLinks('/docs/installation')}
            />}>
      <Stack gap="8" data-class="docs-install-content">
        <Stack gap="4" data-class="docs-install-header">
          <Title fontSize="4xl" fontWeight="bold" data-class="docs-install-title">
            {context.docsInstallation.title}
          </Title>
          <Text fontSize="lg" textColor="muted-foreground" data-class="docs-install-lead">
            {context.docsInstallation.lead}
          </Text>
        </Stack>
        <Stack gap="6" data-class="docs-install-sections">
          {.map((section, index) => (
          <React.Fragment key={section.id}>
          <Stack gap="2" data-class="docs-install-section"><Title fontSize="xl" fontWeight="semibold" data-class="docs-install-section-title">{section.title}</Title>{section.code ? (<><Block component="pre" p="4" rounded="md" bg="muted" data-class="docs-install-code"><Text fontSize="sm" component="code" data-class="docs-install-code-text">{section.code}</Text></Block></>) : (<></>)}{section.text ? (<><Text fontSize={section.code ? 'sm' : 'base'} textColor="muted-foreground" data-class={section.code ? 'docs-install-desc' : 'docs-install-text'}>{section.text}</Text></>) : (<></>)}</Stack>
          </React.Fragment>
          ))}
        </Stack>
      </Stack>
    </DashLayout>
  );
}
