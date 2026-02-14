// Main export for @ui8kit/data
// Unified context (site, menu, sidebars, blocks) for engine and apps

import { sidebarLinksCache } from './cache';

/** Clear sidebar links cache. Use for tests or explicit cleanup. */
export function clearCache(): void {
  sidebarLinksCache.clear();
}
import siteData from './fixtures/shared/site.json';
import navigationData from './fixtures/shared/navigation.json';
import pageData from './fixtures/shared/page.json';
import heroData from './fixtures/website/hero.json';
import featuresData from './fixtures/website/features.json';
import pricingData from './fixtures/website/pricing.json';
import testimonialsData from './fixtures/website/testimonials.json';
import ctaData from './fixtures/website/cta.json';
import dashboardData from './fixtures/dashboard/dashboard.json';
import docsIntroData from './fixtures/docs/intro.json';
import docsInstallationData from './fixtures/docs/installation.json';
import docsComponentsData from './fixtures/docs/components.json';
import examplesData from './fixtures/examples/examples.json';
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
  PageFixture,
  PageDomain,
  PageRecord,
} from './types';

// -----------------------------------------------------------------------------
// Unified context: one source for layout + block data (alias in apps via @ui8kit/data)
// -----------------------------------------------------------------------------

const site = siteData as SiteInfo;
const page = (pageData as PageFixture).page;

const navItems = navigationData.navItems as NavItem[];
const sidebarLinks = navigationData.sidebarLinks as SidebarLink[];
const dashboardSidebarLinks = navigationData.dashboardSidebarLinks as DashboardSidebarLink[];
const docsSidebarLinks = navigationData.docsSidebarLinks as DashboardSidebarLink[];
const examplesSidebarLinks = navigationData.examplesSidebarLinks as DashboardSidebarLink[];
const docsSidebarLabel = navigationData.labels.docsSidebarLabel;
const examplesSidebarLabel = navigationData.labels.examplesSidebarLabel;

const hero = heroData as HeroFixture;
const features = featuresData as FeaturesFixture;
const pricing = pricingData as PricingFixture;
const testimonials = testimonialsData as TestimonialsFixture;
const cta = ctaData as CTAFixture;
const dashboard = dashboardData as DashboardFixture;
const docsIntro = docsIntroData as DocsIntroFixture;
const docsInstallation = docsInstallationData as DocsInstallationFixture;
const docsComponents = docsComponentsData as DocsComponentsFixture;
const examples = examplesData as ExamplesFixture;

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

function getPagesByDomain(domain: PageDomain): PageRecord[] {
  return page[domain];
}

function getPageByPath(path: string): PageRecord | undefined {
  const normalizedPath = normalizeActiveHref(path);
  const domains: PageDomain[] = ['website', 'docs', 'examples', 'dashboard'];
  for (const domain of domains) {
    const matched = page[domain].find(
      (item) => normalizeActiveHref(item.path) === normalizedPath
    );
    if (matched) return matched;
  }
  return undefined;
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

// Domain namespaces (read-only views, aligned with shared page model)
const websiteDomain = Object.freeze({
  page: page.website,
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
  page: page.docs,
  docsIntro: docsIntro as DocsIntroFixture,
  docsInstallation: docsInstallation as DocsInstallationFixture,
  docsComponents: docsComponents as DocsComponentsFixture,
  docsSidebarLabel,
  getDocsSidebarLinks,
});
const examplesDomain = Object.freeze({
  page: page.examples,
  examples,
  examplesSidebarLabel,
  getExamplesSidebarLinks,
});
const dashboardDomain = Object.freeze({
  page: page.dashboard,
  dashboard: dashboard as DashboardFixture,
  dashboardSidebarLinks,
});

export const context = Object.freeze({
  page,
  /** @deprecated Use page instead. */
  routes: page,
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
  getPageByPath,
  getPagesByDomain,
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


export function getDataDiagnostics() {
  return Object.freeze({
    mode: 'local',
    domain: 'website',
    loadedDomains: Object.freeze(["website"]),
    cache: getSidebarCacheDiagnostics(),
  });
}
