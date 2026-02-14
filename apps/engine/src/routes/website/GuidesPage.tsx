import { SidebarContent, GuidesPageView } from '@/blocks';
import { context } from '@ui8kit/data';

export function GuidesPage() {
  return (
    <GuidesPageView
      navItems={context.navItems}
      sidebar={<SidebarContent title="Quick Links" links={context.sidebarLinks} />}
      headerTitle={context.site.title}
      headerSubtitle={context.site.subtitle}
      guides={context.guides}
    />
  );
}
