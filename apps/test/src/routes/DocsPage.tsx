import { useMemo } from 'react';
import { DashSidebar, DocsPageView } from '@/blocks';
import { context } from '@ui8kit/data';

const DOCS_PATH = context.page.docs[0]?.path ?? '/docs';
const DOCS_LINKS = context.getDocsSidebarLinks(DOCS_PATH);

export function DocsPage() {
  const sidebar = useMemo(() => <DashSidebar label={context.docsSidebarLabel} links={DOCS_LINKS} />, []);
  return <DocsPageView sidebar={sidebar} docsIntro={context.docsIntro} />;
}
