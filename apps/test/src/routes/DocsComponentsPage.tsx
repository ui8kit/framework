import { useMemo } from 'react';
import { DashSidebar, DocsComponentsPageView } from '@/blocks';
import { context } from '@ui8kit/data';

const COMPONENTS_PATH =
  context.page.docs.find((entry) => entry.id === 'docs-components')?.path ??
  '/docs/components';
const COMPONENTS_LINKS = context.getDocsSidebarLinks(COMPONENTS_PATH);

export function DocsComponentsPage() {
  const sidebar = useMemo(() => <DashSidebar label={context.docsSidebarLabel} links={COMPONENTS_LINKS} />, []);
  return (
    <DocsComponentsPageView
      sidebar={sidebar}
      title={context.docsComponents.title}
      lead={context.docsComponents.lead}
    />
  );
}
