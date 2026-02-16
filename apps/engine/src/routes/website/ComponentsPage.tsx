import { SidebarContent, ComponentsPageView } from '@/blocks';
import { context } from '@/data/context';

export function ComponentsPage() {
  return (
    <ComponentsPageView
      navItems={context.navItems}
      sidebar={<SidebarContent title="Quick Links" links={context.sidebarLinks} />}
      headerTitle={context.site.title}
      headerSubtitle={context.site.subtitle}
      components={context.components}
    />
  );
}
