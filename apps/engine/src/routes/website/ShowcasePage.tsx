import { SidebarContent, ShowcasePageView } from '@/blocks';
import { context } from '@/data/context';

export function ShowcasePage() {
  return (
    <ShowcasePageView
      navItems={context.navItems}
      sidebar={<SidebarContent title="Quick Links" links={context.sidebarLinks} />}
      headerTitle={context.site.title}
      headerSubtitle={context.site.subtitle}
      showcase={context.showcase}
    />
  );
}
