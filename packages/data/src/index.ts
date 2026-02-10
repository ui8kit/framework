// Main export for @ui8kit/data
// Unified context (site, menu, sidebars, blocks) for engine and apps

import hero from './fixtures/hero.json';
import features from './fixtures/features.json';
import pricing from './fixtures/pricing.json';
import testimonials from './fixtures/testimonials.json';
import cta from './fixtures/cta.json';
import dashboard from './fixtures/dashboard.json';
import docsIntro from './fixtures/docs-intro.json';
import docsInstallation from './fixtures/docs-installation.json';
import docsComponents from './fixtures/docs-components.json';
import type {
  HeroFixture,
  FeaturesFixture,
  PricingFixture,
  TestimonialsFixture,
  CTAFixture,
  DashboardFixture,
  DocsIntroFixture,
  DocsInstallationFixture,
  DocsComponentsFixture,
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
  { id: 'examples', title: 'Examples', url: '/examples' },
  { id: 'dashboard', title: 'Dashboard', url: '/dashboard' },
  { id: 'docs', title: 'Docs', url: '/docs' },
];

const sidebarLinks: SidebarLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
];

const dashboardSidebarLinks: DashboardSidebarLink[] = [
  { label: 'Website', href: '/', active: false },
  { label: 'Dashboard', href: '/dashboard', active: true },
];

const docsSidebarLinks: DashboardSidebarLink[] = [
  { label: 'Introduction', href: '/docs', active: true },
  { label: 'Components', href: '/docs/components', active: false },
  { label: 'Installation', href: '/docs/installation', active: false },
];

const examplesSidebarLinks: DashboardSidebarLink[] = [
  { label: 'Examples', href: '/examples', active: true },
  { label: 'Dashboard', href: '/examples/dashboard', active: false },
  { label: 'Tasks', href: '/examples/tasks', active: false },
  { label: 'Playground', href: '/examples/playground', active: false },
  { label: 'Authentication', href: '/examples/authentication', active: false },
];

const site: SiteInfo = {
  title: 'UI8Kit',
  subtitle: 'Template Engine',
};

const docsSidebarLabel = 'Documentation';
const examplesSidebarLabel = 'Examples';

function getDocsSidebarLinks(activeHref: string): DashboardSidebarLink[] {
  return docsSidebarLinks.map((link) => ({
    ...link,
    active: link.href === activeHref,
  }));
}

function getExamplesSidebarLinks(activeHref: string): DashboardSidebarLink[] {
  return examplesSidebarLinks.map((link) => ({
    ...link,
    active: link.href === activeHref,
  }));
}

export const context = {
  site,
  navItems,
  sidebarLinks,
  dashboardSidebarLinks,
  docsSidebarLinks,
  examplesSidebarLinks,
  docsSidebarLabel,
  examplesSidebarLabel,
  getDocsSidebarLinks,
  getExamplesSidebarLinks,
  hero: hero as HeroFixture,
  features: features as FeaturesFixture,
  pricing: pricing as PricingFixture,
  testimonials: testimonials as TestimonialsFixture,
  cta: cta as CTAFixture,
  dashboard: dashboard as DashboardFixture,
  docsIntro: docsIntro as DocsIntroFixture,
  docsInstallation: docsInstallation as DocsInstallationFixture,
  docsComponents: docsComponents as DocsComponentsFixture,
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
