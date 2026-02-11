import { Outlet, useLocation } from 'react-router-dom';
import { MainLayout } from './MainLayout';
import { HeroBlock } from '@ui8kit/blocks';
import { ExamplesBlock } from '@/blocks';
import { context } from '@ui8kit/data';

/**
 * Examples layout — Hero + horizontal tabs + Outlet (like main page).
 * Tabs are route links; content switches per route. No sidebar.
 */
export function ExamplesLayout() {
  const location = useLocation();
  const tabs = context.getExamplesSidebarLinks(location.pathname);

  return (
    <MainLayout
      mode="full"
      navItems={context.navItems}
      headerTitle={context.site.title}
      headerSubtitle={context.site.subtitle}
    >
      <HeroBlock {...context.hero} />
      <ExamplesBlock
        tabs={tabs}
        examples={context.examples}
      >
        <Outlet />
      </ExamplesBlock>
    </MainLayout>
  );
}
