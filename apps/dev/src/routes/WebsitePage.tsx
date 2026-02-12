import { SidebarContent } from '@/blocks';
import { context } from '@ui8kit/data';
import { WebsitePageView } from './views/WebsitePageView';

/**
 * Home Page container — resolves context.
 */
export function WebsitePage() {
  return (
    <WebsitePageView
      mode="full"
      navItems={context.navItems}
      sidebar={<SidebarContent title="Quick Links" links={context.sidebarLinks} />}
      headerTitle={context.site.title}
      headerSubtitle={context.site.subtitle}
      hero={context.hero}
      examples={context.examples}
      tabs={context.examplesSidebarLinks}
    />
  );
}
