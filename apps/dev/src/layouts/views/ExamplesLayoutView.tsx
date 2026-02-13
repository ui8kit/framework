import type { ReactNode } from 'react';
import { MainLayout } from '@/layouts';
import { HeroBlock } from '@ui8kit/blocks';
import { ExamplesBlock, ExampleTab, ExamplesContent } from '@/blocks';
import type { NavItem } from '../../partials';

interface ExamplesLayoutViewProps {
  navItems?: any[];
  headerTitle?: string;
  headerSubtitle?: string;
  hero: any;
  examples: any;
  tabs: any[];
  children?: ReactNode;
}

export function ExamplesLayoutView(props: ExamplesLayoutViewProps) {
  const { navItems, headerTitle, headerSubtitle, hero, examples, tabs, children } = props;

  return (
    <MainLayout mode={"full"} navItems={navItems} headerTitle={headerTitle} headerSubtitle={headerSubtitle}>
      <HeroBlock {...hero} />
      <ExamplesBlock tabs={tabs} examples={examples}>
        {children}
      </ExamplesBlock>
    </MainLayout>
  );
}
