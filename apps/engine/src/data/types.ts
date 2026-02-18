// Type definitions for fixtures and context

import type {
  AppContextBase,
  DashboardSidebarLink,
  NavItem,
  NavigationPolicy,
  NavigationState,
  PageDomain,
  PageFixture,
  PageRecord,
  SidebarCacheDiagnostics,
  SidebarLink,
  SiteInfo,
} from '@ui8kit/contracts/source';

export type {
  AppContextBase,
  DashboardSidebarLink,
  NavItem,
  NavigationPolicy,
  NavigationState,
  PageDomain,
  PageFixture,
  PageRecord,
  SidebarCacheDiagnostics,
  SidebarLink,
  SiteInfo,
} from '@ui8kit/contracts/source';

export interface HeroFixture {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaUrl?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  backgroundImage?: string;
}

export interface FeaturesFixture {
  title?: string;
  subtitle?: string;
  features?: Array<{
    id: string;
    title: string;
    description: string;
    icon?: string;
  }>;
}

export interface TestimonialsFixture {
  title?: string;
  testimonials?: Array<{
    id: string;
    name: string;
    role?: string;
    company?: string;
    content: string;
    avatar?: string;
  }>;
}

export interface CTAFixture {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaUrl?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
}

export interface ComponentItem {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  image?: string;
}

export interface ComponentCategory {
  id: string;
  title: string;
}

export interface ComponentsFixture {
  title?: string;
  subtitle?: string;
  categories?: ComponentCategory[];
  items?: ComponentItem[];
}

export interface GuideItem {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  image?: string;
  date?: string;
}

export interface GuidesFixture {
  title?: string;
  subtitle?: string;
  guides?: GuideItem[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  image?: string;
  date?: string;
  author?: string;
}

export interface BlogFixture {
  title?: string;
  subtitle?: string;
  posts?: BlogPost[];
}

export interface ShowcaseProject {
  id: string;
  title: string;
  description: string;
  validUntil?: string;
  image?: string;
}

export interface ShowcaseFixture {
  title?: string;
  subtitle?: string;
  projects?: ShowcaseProject[];
}

export interface AdminFixture {
  exportSchema?: Record<string, string>;
}
