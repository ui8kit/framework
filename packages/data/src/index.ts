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
import valuePropositionData from './fixtures/website/value-proposition.json';
import blogData from './fixtures/website/blog.json';
import showcaseData from './fixtures/website/showcase.json';
import type {
  HeroFixture,
  ValuePropositionFixture,
  BlogFixture,
  ShowcaseFixture,
  NavItem,
  SidebarLink,
  DashboardSidebarLink,
  SiteInfo,
  PageFixture,
  PageDomain,
  PageRecord,
  NavigationState,
} from './types';

// -----------------------------------------------------------------------------
// Unified context: one source for layout + block data (alias in apps via @ui8kit/data)
// -----------------------------------------------------------------------------

const site = siteData as SiteInfo;
const pageRaw = (pageData as PageFixture).page;
const page = {
  website: pageRaw.website,
  docs: pageRaw.docs ?? [],
  examples: pageRaw.examples ?? [],
  dashboard: pageRaw.dashboard ?? [],
};

const navItems = navigationData.navItems as NavItem[];
const sidebarLinks = navigationData.sidebarLinks as SidebarLink[];
const dashboardSidebarLinks = navigationData.dashboardSidebarLinks as DashboardSidebarLink[];
const docsSidebarLinks = navigationData.docsSidebarLinks as DashboardSidebarLink[];
const examplesSidebarLinks = navigationData.examplesSidebarLinks as DashboardSidebarLink[];
const docsSidebarLabel = navigationData.labels.docsSidebarLabel;
const examplesSidebarLabel = navigationData.labels.examplesSidebarLabel;

const hero = heroData as HeroFixture;
const valueProposition = valuePropositionData as ValuePropositionFixture;
const blog = blogData as BlogFixture;
const showcase = showcaseData as ShowcaseFixture;

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
  return page[domain] ?? [];
}

function getPageByPath(path: string): PageRecord | undefined {
  const normalizedPath = normalizeActiveHref(path);
  const domains: PageDomain[] = ['website', 'docs', 'examples', 'dashboard'];
  for (const domain of domains) {
    const domainPages = page[domain];
    if (!domainPages) continue;
    const matched = domainPages.find(
      (item) => normalizeActiveHref(item.path) === normalizedPath
    );
    if (matched) return matched;
  }
  return undefined;
}

const NAVIGATION_UNAVAILABLE_TOOLTIP = 'Not available in this domain build';

function isInternalPath(href: string): boolean {
  return href.startsWith('/');
}

const availablePaths = Object.freeze(
  page.website.map((entry) => normalizeActiveHref(entry.path))
) as readonly string[];

const availablePathSet = new Set(availablePaths);

function resolveNavigation(href: string): NavigationState {
  if (!isInternalPath(href)) {
    return Object.freeze({
      href,
      enabled: true,
      mode: 'soft' as const,
    });
  }

  const normalizedHref = normalizeActiveHref(href);
  if (availablePathSet.has(normalizedHref)) {
    return Object.freeze({
      href: normalizedHref,
      enabled: true,
      mode: 'soft' as const,
    });
  }

  return Object.freeze({
    href: normalizedHref,
    enabled: false,
    mode: 'soft' as const,
    reason: NAVIGATION_UNAVAILABLE_TOOLTIP,
  });
}

const navigation = Object.freeze({
  mode: 'soft' as const,
  unavailableTooltip: NAVIGATION_UNAVAILABLE_TOOLTIP,
  availablePaths,
  resolve: resolveNavigation,
  isEnabled: (href: string) => resolveNavigation(href).enabled,
});

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
  valueProposition: valueProposition as ValuePropositionFixture,
  blog: blog as BlogFixture,
  showcase: showcase as ShowcaseFixture,
  site,
  navItems,
  sidebarLinks,
});
const docsDomain = Object.freeze({
  page: page.docs,
  docsIntro: Object.freeze({}),
  docsInstallation: Object.freeze({}),
  docsComponents: Object.freeze({}),
  docsSidebarLabel,
  getDocsSidebarLinks,
});
const examplesDomain = Object.freeze({
  page: page.examples,
  examples: Object.freeze({}),
  examplesSidebarLabel,
  getExamplesSidebarLinks,
});
const dashboardDomain = Object.freeze({
  page: page.dashboard,
  dashboard: Object.freeze({}),
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
  docsSidebarLabel,
  examplesSidebarLabel,
  getDocsSidebarLinks,
  getExamplesSidebarLinks,
  getPageByPath,
  getPagesByDomain,
  resolveNavigation,
  navigation,
  getSidebarCacheDiagnostics,
  hero: hero as HeroFixture,
  valueProposition: valueProposition as ValuePropositionFixture,
  blog: blog as BlogFixture,
  showcase: showcase as ShowcaseFixture,
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
  valueProposition: context.valueProposition,
  blog: context.blog,
  showcase: context.showcase,
};

export * from './types';
