// Main export for @ui8kit/data
// Unified context (site, menu, sidebars, blocks) for engine and apps

import hero from './fixtures/hero.json';
import features from './fixtures/features.json';
import pricing from './fixtures/pricing.json';
import testimonials from './fixtures/testimonials.json';
import cta from './fixtures/cta.json';
import dashboard from './fixtures/dashboard.json';
import type {
  HeroFixture,
  FeaturesFixture,
  PricingFixture,
  TestimonialsFixture,
  CTAFixture,
  DashboardFixture,
  NavItem,
  SidebarLink,
  DashboardSidebarLink,
  SiteInfo,
} from './types';

// -----------------------------------------------------------------------------
// Unified context: one source for layout + block data (alias in apps via @ui8kit/data)
// -----------------------------------------------------------------------------

const navItems: NavItem[] = [
  { id: 'home', title: 'Home', url: '/' },
  { id: 'pricing', title: 'Pricing', url: '#pricing' },
  { id: 'dashboard', title: 'Dashboard', url: '/dashboard' },
];

const sidebarLinks: SidebarLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
];

const dashboardSidebarLinks: DashboardSidebarLink[] = [
  { label: 'Website', href: '/', active: false },
  { label: 'Dashboard', href: '/dashboard', active: true },
];

const site: SiteInfo = {
  title: 'UI8Kit',
  subtitle: 'Template Engine',
};

export const context = {
  site,
  navItems,
  sidebarLinks,
  dashboardSidebarLinks,
  hero: hero as HeroFixture,
  features: features as FeaturesFixture,
  pricing: pricing as PricingFixture,
  testimonials: testimonials as TestimonialsFixture,
  cta: cta as CTAFixture,
  dashboard: dashboard as DashboardFixture,
} as const;

/** @deprecated Use context instead */
export const fixtures = {
  hero: context.hero,
  features: context.features,
  pricing: context.pricing,
  testimonials: context.testimonials,
  cta: context.cta,
  dashboard: context.dashboard,
};

export * from './types';
