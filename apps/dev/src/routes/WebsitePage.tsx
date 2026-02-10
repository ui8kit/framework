import { MainLayout } from '@/layouts';
import { SidebarContent, ExamplesBlock } from '@/blocks';
import { HeroBlock } from '@ui8kit/blocks';
import { context } from '@ui8kit/data';

export function WebsitePage() {
  return (
    <MainLayout mode={"full"} navItems={context.navItems} sidebar={<SidebarContent title="Quick Links" links={context.sidebarLinks} />} headerTitle={context.site.title} headerSubtitle={context.site.subtitle}>
      <HeroBlock {...context.hero} />
      <ExamplesBlock tabs={context.examplesSidebarLinks ?? []} />
    </MainLayout>
  );
}
