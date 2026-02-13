import type { ReactNode } from 'react';
import { MainLayout } from '@/layouts';
import { HeroBlock } from '@ui8kit/blocks';
import { ExamplesBlock, type ExampleTab, type ExamplesContent } from '@/blocks';
import type { NavItem } from '../../partials';

export interface ExamplesLayoutViewProps {
  navItems?: NavItem[];
  headerTitle?: string;
  headerSubtitle?: string;
  hero: any;
  examples: ExamplesContent;
  tabs: ExampleTab[];
  children?: ReactNode;
}

/**
 * Examples layout view — Hero + horizontal tabs + children (Outlet).
 * Pure-props: no context or router hooks.
 */
export function ExamplesLayoutView({
  navItems,
  headerTitle,
  headerSubtitle,
  hero,
  examples,
  tabs,
  children,
}: ExamplesLayoutViewProps) {
  return (
    <MainLayout
      mode="full"
      navItems={navItems}
      headerTitle={headerTitle}
      headerSubtitle={headerSubtitle}
    >
      <HeroBlock {...hero} />
      <ExamplesBlock tabs={tabs} examples={examples}>
        {children}
      </ExamplesBlock>
    </MainLayout>
  );
}
