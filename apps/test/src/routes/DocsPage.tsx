import { DashSidebar, DocsPageView } from '@/blocks';
import { context } from '@ui8kit/data';

/**
 * Docs Introduction container — resolves context and sidebar.
 */
export function DocsPage() {
  return (
    <DocsPageView
      sidebar={
        <DashSidebar
          label={context.docsSidebarLabel}
          links={context.getDocsSidebarLinks('/docs')}
        />
      }
      docsIntro={context.docsIntro}
    />
  );
}
