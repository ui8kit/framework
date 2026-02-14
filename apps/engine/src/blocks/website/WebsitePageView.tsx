import type { ReactNode } from 'react';
import { MainLayout } from '@/layouts';
import { ValuePropositionBlock } from './ValuePropositionBlock';
import { HeroBlock } from '@ui8kit/blocks';
import type { HeroFixture, ValuePropositionFixture } from '@ui8kit/data';

export interface WebsitePageViewProps {
  mode?: 'full' | 'with-sidebar' | 'sidebar-left';
  navItems?: { id: string; title: string; url: string }[];
  sidebar?: ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
  hero: HeroFixture;
  valueProposition: ValuePropositionFixture;
}

/**
 * Home Page view — Hero + Value Proposition (props-only).
 */
export function WebsitePageView({
  mode,
  navItems,
  sidebar,
  headerTitle,
  headerSubtitle,
  hero,
  valueProposition,
}: WebsitePageViewProps) {
  return (
    <MainLayout
      mode={mode ?? 'full'}
      navItems={navItems ?? []}
      sidebar={sidebar}
      headerTitle={headerTitle}
      headerSubtitle={headerSubtitle}
    >
      <HeroBlock {...hero} />
      <ValuePropositionBlock {...valueProposition} />
    </MainLayout>
  );
}
