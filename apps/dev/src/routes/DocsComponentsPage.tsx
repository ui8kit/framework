import { DashSidebar, DocsComponentsPageView } from '@/blocks';
import { context } from '@ui8kit/data';

/**
 * Docs Components container — resolves context and sidebar.
 */
export function DocsComponentsPage() {
  return (
    <DocsComponentsPageView
      sidebar={
        <DashSidebar
          label={context.docsSidebarLabel}
          links={context.getDocsSidebarLinks('/docs/components')}
        />
      }
      title={context.docsComponents.title}
      lead={context.docsComponents.lead}
    />
  );
}
