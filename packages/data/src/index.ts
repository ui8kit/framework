// Main export for @ui8kit/data
// Unified context (site, menu, sidebars, blocks) for engine and apps

import { sidebarLinksCache } from './cache';

/** Clear sidebar links cache. Use for tests or explicit cleanup. */
export function clearCache(): void {
  sidebarLinksCache.clear();
}
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
  ExamplesFixture,
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

const examples: ExamplesFixture = {
  title: 'Examples',
  description: 'Common UI components and patterns.',
  button: {
    title: 'Button',
    defaultLabel: 'Default',
    outlineLabel: 'Outline',
    ghostLabel: 'Ghost',
  },
  badge: {
    title: 'Badge',
    defaultLabel: 'Default',
    secondaryLabel: 'Secondary',
    outlineLabel: 'Outline',
  },
  typography: {
    title: 'Typography',
    heading: 'Heading',
    body: 'Body text',
  },
  actions: {
    explore: 'Explore Examples',
    allComponents: 'All Components',
  },
};

const site: SiteInfo = {
  title: 'UI8Kit',
  subtitle: 'Template Engine',
};

const docsSidebarLabel = 'Documentation';
const examplesSidebarLabel = 'Examples';

/** Stable empty array to avoid `x ?? []` creating new arrays on every access. */
export const EMPTY_ARRAY: readonly never[] = Object.freeze([]) as readonly never[];

function normalizeActiveHref(activeHref: string): string {
  const raw = activeHref.trim();
  const noHash = raw.split('#', 1)[0] ?? '';
  const noQuery = noHash.split('?', 1)[0] ?? '';
  const withLeadingSlash = noQuery.startsWith('/') ? noQuery : `/${noQuery}`;
  const normalizedSlashes = withLeadingSlash.replace(/\/{2,}/g, '/');
  if (normalizedSlashes === '' || normalizedSlashes === '/') return '/';
  return normalizedSlashes.replace(/\/+$/, '');
}

function freezeSidebarLinks(
  links: DashboardSidebarLink[],
  activeHref: string
): DashboardSidebarLink[] {
  const frozen = links.map((link) =>
    Object.freeze({
      ...link,
      active: link.href === activeHref,
    })
  );
  return Object.freeze(frozen) as DashboardSidebarLink[];
}

function getDocsSidebarLinks(activeHref: string): DashboardSidebarLink[] {
  const normalizedHref = normalizeActiveHref(activeHref);
  const cached = sidebarLinksCache.get(`docs:${normalizedHref}`);
  if (cached) return cached;
  const result = freezeSidebarLinks(docsSidebarLinks, normalizedHref);
  sidebarLinksCache.set(`docs:${normalizedHref}`, result);
  return result;
}

function getExamplesSidebarLinks(activeHref: string): DashboardSidebarLink[] {
  const normalizedHref = normalizeActiveHref(activeHref);
  const cached = sidebarLinksCache.get(`examples:${normalizedHref}`);
  if (cached) return cached;
  const result = freezeSidebarLinks(examplesSidebarLinks, normalizedHref);
  sidebarLinksCache.set(`examples:${normalizedHref}`, result);
  return result;
}

/** Pre-warm cache for all docs and examples routes to avoid allocations during navigation. */
const DOCS_PATHS = ['/docs', '/docs/installation', '/docs/components'];
const EXAMPLES_PATHS = [
  '/examples',
  '/examples/dashboard',
  '/examples/tasks',
  '/examples/playground',
  '/examples/authentication',
];
for (const p of DOCS_PATHS) getDocsSidebarLinks(p);
for (const p of EXAMPLES_PATHS) getExamplesSidebarLinks(p);

export function getSidebarCacheDiagnostics() {
  const keys = sidebarLinksCache.keys();
  let docsEntries = 0;
  let examplesEntries = 0;
  for (const key of keys) {
    if (key.startsWith('docs:')) docsEntries += 1;
    else if (key.startsWith('examples:')) examplesEntries += 1;
  }
  return Object.freeze({
    stats: Object.freeze(sidebarLinksCache.stats()),
    totalEntries: keys.length,
    docsEntries,
    examplesEntries,
    otherEntries: keys.length - docsEntries - examplesEntries,
  });
}

// Domain namespaces (read-only views, aligned with routes.config.json)
const websiteDomain = Object.freeze({
  hero: hero as HeroFixture,
  features: features as FeaturesFixture,
  pricing: pricing as PricingFixture,
  testimonials: testimonials as TestimonialsFixture,
  cta: cta as CTAFixture,
  site,
  navItems,
  sidebarLinks,
});
const docsDomain = Object.freeze({
  docsIntro: docsIntro as DocsIntroFixture,
  docsInstallation: docsInstallation as DocsInstallationFixture,
  docsComponents: docsComponents as DocsComponentsFixture,
  docsSidebarLabel,
  getDocsSidebarLinks,
});
const examplesDomain = Object.freeze({
  examples,
  examplesSidebarLabel,
  getExamplesSidebarLinks,
});
const dashboardDomain = Object.freeze({
  dashboard: dashboard as DashboardFixture,
  dashboardSidebarLinks,
});

export const context = Object.freeze({
  site,
  navItems,
  sidebarLinks,
  dashboardSidebarLinks,
  docsSidebarLinks,
  examplesSidebarLinks,
  examples,
  docsSidebarLabel,
  examplesSidebarLabel,
  getDocsSidebarLinks,
  getExamplesSidebarLinks,
  getSidebarCacheDiagnostics,
  hero: hero as HeroFixture,
  features: features as FeaturesFixture,
  pricing: pricing as PricingFixture,
  testimonials: testimonials as TestimonialsFixture,
  cta: cta as CTAFixture,
  dashboard: dashboard as DashboardFixture,
  docsIntro: docsIntro as DocsIntroFixture,
  docsInstallation: docsInstallation as DocsInstallationFixture,
  docsComponents: docsComponents as DocsComponentsFixture,
  domains: Object.freeze({
    website: websiteDomain,
    docs: docsDomain,
    examples: examplesDomain,
    dashboard: dashboardDomain,
  }),
  clearCache,
});

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
