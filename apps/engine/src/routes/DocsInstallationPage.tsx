import { DashSidebar, DocsInstallationPageView } from '@/blocks';
import { context } from '@ui8kit/data';

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
