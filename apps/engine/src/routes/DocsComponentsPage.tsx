import { useMemo } from 'react';
import { DashSidebar, DocsComponentsPageView } from '@/blocks';
import { context } from '@ui8kit/data';

const COMPONENTS_LINKS = context.getDocsSidebarLinks('/docs/components');

/**
 * Docs Components container — resolves context and sidebar.
 */
export function DocsComponentsPage() {
  const sidebar = useMemo(
    () => (
      <DashSidebar label={context.docsSidebarLabel} links={COMPONENTS_LINKS} />
    ),
    []
  );
  return (
    <DocsComponentsPageView
      sidebar={sidebar}
      title={context.docsComponents.title}
      lead={context.docsComponents.lead}
    />
  );
}
