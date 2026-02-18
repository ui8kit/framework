import type { ReactNode } from 'react';
import { MainLayout } from '@/layouts';
import { SidebarContent } from '@/blocks';
import { HeroBlock } from './HeroBlock';
import { FeaturesBlock } from './FeaturesBlock';
import { CTABlock } from './CTABlock';

export interface WebsitePageViewProps {
  mode?: 'full' | 'with-sidebar' | 'sidebar-left';
  navItems?: { id: string; title: string; url: string }[];
  sidebar: ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
  hero: { title?: string; subtitle?: string; ctaText?: string; ctaUrl?: string; secondaryCtaText?: string; secondaryCtaUrl?: string };
  features: { title?: string; subtitle?: string; features?: { id: string; title: string; description: string }[] };
  cta: { title?: string; subtitle?: string; ctaText?: string; ctaUrl?: string; secondaryCtaText?: string; secondaryCtaUrl?: string };
}

/**
 * Home Page view — Hero + Features + CTA (UI8Kit landing).
 */
export function WebsitePageView({
  mode,
  navItems,
  sidebar,
  headerTitle,
  headerSubtitle,
  hero,
  features,
  cta,
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
      <FeaturesBlock {...features} />
      <CTABlock {...cta} />
    </MainLayout>
  );
}
