import { Outlet, useLocation } from 'react-router-dom';
import { MainLayout } from './MainLayout';
import { HeroBlock } from '@ui8kit/blocks';
import { ExamplesBlock } from '@/blocks';
import { context } from '@ui8kit/data';

interface ExamplesLayoutProps {
  tabs?: any;
}

export function ExamplesLayout(props: ExamplesLayoutProps) {
  const { tabs } = props;
  return (
    <MainLayout mode={"full"} navItems={context.navItems} headerTitle={context.site.title} headerSubtitle={context.site.subtitle}>
      <HeroBlock {...context.hero} />
      <ExamplesBlock tabs={tabs} examples={context.examples}>
        <Outlet />
      </ExamplesBlock>
    </MainLayout>
  );
}
