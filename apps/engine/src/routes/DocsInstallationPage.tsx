import { useMemo } from 'react';
import { DashSidebar, DocsInstallationPageView } from '@/blocks';
import { context } from '@ui8kit/data';

const INSTALLATION_LINKS = context.getDocsSidebarLinks('/docs/installation');

/**
 * Docs Installation container — resolves context and sidebar.
 */
export function DocsInstallationPage() {
  const sidebar = useMemo(
    () => (
      <DashSidebar label={context.docsSidebarLabel} links={INSTALLATION_LINKS} />
    ),
    []
  );
  return (
    <DocsInstallationPageView
      sidebar={sidebar}
      docsInstallation={context.docsInstallation}
    />
  );
}
