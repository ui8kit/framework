import { useMemo } from 'react';
import { DashSidebar, DocsInstallationPageView } from '@/blocks';
import { context } from '@ui8kit/data';

const INSTALLATION_PATH =
  context.page.docs.find((entry) => entry.id === 'docs-installation')?.path ??
  '/docs/installation';
const INSTALLATION_LINKS = context.getDocsSidebarLinks(INSTALLATION_PATH);

export function DocsInstallationPage() {
  const sidebar = useMemo(() => <DashSidebar label={context.docsSidebarLabel} links={INSTALLATION_LINKS} />, []);
  return (
    <DocsInstallationPageView
      sidebar={sidebar}
      docsInstallation={context.docsInstallation}
    />
  );
}
