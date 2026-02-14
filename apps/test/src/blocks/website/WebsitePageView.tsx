import type { ReactNode } from 'react';
import { MainLayout } from '@/layouts';
import { SidebarContent, ExamplesBlock } from '@/blocks';
import { HeroBlock } from '@ui8kit/blocks';
import type { ExampleTab, ExamplesContent } from '@/blocks';

interface WebsitePageViewProps {
  mode?: 'full' | 'with-sidebar' | 'sidebar-left';
  navItems?: any[];
  sidebar: ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
  hero: any;
  examples: any;
  tabs: any[];
}

export function WebsitePageView(props: WebsitePageViewProps) {
  const { mode, navItems, sidebar, headerTitle, headerSubtitle, hero, examples, tabs } = props;

  return (
    <MainLayout mode={mode ?? 'full'} navItems={navItems} sidebar={sidebar} headerTitle={headerTitle} headerSubtitle={headerSubtitle}>
      <HeroBlock {...hero} />
      <ExamplesBlock tabs={tabs} examples={examples} />
    </MainLayout>
  );
}
