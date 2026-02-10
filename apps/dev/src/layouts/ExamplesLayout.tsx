import { Outlet } from 'react-router-dom';
import { MainLayout } from './MainLayout';
import { HeroBlock } from '@ui8kit/blocks';
import { SidebarContent } from '@/blocks';
import { context } from '@ui8kit/data';

export function ExamplesLayout() {
  return (
    <MainLayout mode={"with-sidebar"} navItems={context.navItems} sidebar={<SidebarContent title="Examples" links={context.examplesSidebarLinks} />} headerTitle={context.site.title} headerSubtitle={context.site.subtitle}>
      <HeroBlock {...context.hero} />
      <Outlet />
    </MainLayout>
  );
}
