import { useState, useCallback } from 'react';
import { MainLayout } from '@/layouts';
import { Block, Container, Stack, Title, Text, Button } from '@ui8kit/core';
import { If, Var } from '@ui8kit/template';
import { context } from '@ui8kit/data';

export interface AdminPageViewProps {
  navItems?: { id: string; title: string; url: string }[];
  headerTitle?: string;
  headerSubtitle?: string;
}

/**
 * Admin page — local JSON import/export (props-only structure, local state for I/O).
 */
export function AdminPageView({
  navItems,
  headerTitle,
  headerSubtitle,
}: AdminPageViewProps) {
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [importPreview, setImportPreview] = useState<string | null>(null);

  const handleExport = useCallback(() => {
    const data = {
      page: context.page,
      site: context.site,
      navItems: context.navItems,
      hero: context.hero,
      valueProposition: context.valueProposition,
      blog: context.blog,
      showcase: context.showcase,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ui8kit-data.json';
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result as string;
        const parsed = JSON.parse(text);
        setImportPreview(text.slice(0, 500) + (text.length > 500 ? '...' : ''));
        setImportStatus('Import successful. Data preview above.');
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('ui8kit:admin-import', text);
        }
      } catch {
        setImportStatus('Invalid JSON.');
        setImportPreview(null);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }, []);

  return (
    <MainLayout
      mode="full"
      navItems={navItems ?? []}
      headerTitle={headerTitle}
      headerSubtitle={headerSubtitle}
    >
      <Block component="section" py="8" data-class="admin-section">
        <Container max="w-2xl" flex="col" gap="8" data-class="admin-container">
          <Title fontSize="2xl" fontWeight="bold" data-class="admin-title">
            Admin — JSON Import/Export
          </Title>
          <Text fontSize="sm" textColor="muted-foreground" data-class="admin-description">
            Export site data as JSON or import from a file. Local only, no server.
          </Text>

          <Stack gap="6" data-class="admin-actions">
            <Stack gap="2" data-class="admin-export">
              <Text fontSize="sm" fontWeight="medium" data-class="admin-export-label">
                Export
              </Text>
              <Button onClick={handleExport} data-class="admin-export-button">
                Download JSON
              </Button>
            </Stack>

            <Stack gap="2" data-class="admin-import">
              <Text fontSize="sm" fontWeight="medium" data-class="admin-import-label">
                Import
              </Text>
              <Block component="div" data-class="admin-import-input-wrapper">
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImport}
                  data-class="admin-import-input"
                />
              </Block>
            </Stack>

            <If test="importStatus" value={!!importStatus}>
              <Stack gap="2" data-class="admin-import-status">
                <Text fontSize="sm" data-class="admin-import-status-text">
                  <Var name="importStatus" value={importStatus} />
                </Text>
                <If test="importPreview" value={!!importPreview}>
                  <Block
                    component="pre"
                    p="4"
                    rounded="md"
                    bg="muted"
                    data-class="admin-import-preview"
                  >
                    <Var name="importPreview" value={importPreview} />
                  </Block>
                </If>
              </Stack>
            </If>
          </Stack>
        </Container>
      </Block>
    </MainLayout>
  );
}
