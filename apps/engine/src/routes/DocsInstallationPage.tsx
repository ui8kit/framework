import { DashSidebar } from '@/blocks';
import { context } from '@ui8kit/data';
import { DocsInstallationPageView } from './views/DocsInstallationPageView';

/**
 * Docs Installation container — resolves context and sidebar.
 */
export function DocsInstallationPage() {
  return (
    <DocsInstallationPageView
      sidebar={
        <DashSidebar
          label={context.docsSidebarLabel}
          links={context.getDocsSidebarLinks('/docs/installation')}
        />
      }
      docsInstallation={context.docsInstallation}
    />
  );
}
