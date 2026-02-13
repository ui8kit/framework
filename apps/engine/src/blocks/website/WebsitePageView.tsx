import type { ReactNode } from 'react';
import { MainLayout } from '@/layouts';
import { SidebarContent, ExamplesBlock } from '@/blocks';
import { HeroBlock } from '@ui8kit/blocks';
import type { ExampleTab, ExamplesContent } from '@/blocks';

export interface WebsitePageViewProps {
  mode?: 'full' | 'with-sidebar' | 'sidebar-left';
  navItems?: any[];
  sidebar: ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
  hero: any;
  examples: ExamplesContent;
  tabs: ExampleTab[];
}

/**
 * Home Page view — Hero + Examples block (props-only).
 */
export function WebsitePageView({
  mode,
  navItems,
  sidebar,
  headerTitle,
  headerSubtitle,
  hero,
  examples,
  tabs,
}: WebsitePageViewProps) {
  return (
    <MainLayout
      mode={mode ?? 'full'}
      navItems={navItems}
      sidebar={sidebar}
      headerTitle={headerTitle}
      headerSubtitle={headerSubtitle}
    >
      <HeroBlock {...hero} />
      <ExamplesBlock tabs={tabs} examples={examples} />
    </MainLayout>
  );
}
