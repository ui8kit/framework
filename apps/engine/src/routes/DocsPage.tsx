import { DashSidebar } from '@/blocks';
import { context } from '@ui8kit/data';
import { DocsPageView } from './views/DocsPageView';

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
