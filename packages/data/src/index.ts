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
import testimonialsData from './fixtures/website/testimonials.json';
import ctaData from './fixtures/website/cta.json';
import componentsData from './fixtures/website/components.json';
import guidesData from './fixtures/website/guides.json';
import blogData from './fixtures/website/blog.json';
import showcaseData from './fixtures/website/showcase.json';
import adminData from './fixtures/admin/admin.json';
import type {
  HeroFixture,
  FeaturesFixture,
  TestimonialsFixture,
  CTAFixture,
  MenuFixture,
  RecipesFixture,
  BlogFixture,
  PromotionsFixture,
  AdminFixture,
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
const page = (pageData as PageFixture).page;

const navItems = navigationData.navItems as NavItem[];
const sidebarLinks = navigationData.sidebarLinks as SidebarLink[];
const adminSidebarLinks = (navigationData.adminSidebarLinks ?? []) as DashboardSidebarLink[];
const adminSidebarLabel = navigationData.labels?.adminSidebarLabel ?? 'Admin';

const hero = heroData as HeroFixture;
const features = featuresData as FeaturesFixture;
const testimonials = testimonialsData as TestimonialsFixture;
const cta = ctaData as CTAFixture;
const components = componentsData as MenuFixture;
const guides = guidesData as RecipesFixture;
const blog = blogData as BlogFixture;
const showcase = showcaseData as PromotionsFixture;
const admin = adminData as AdminFixture;

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
  const domains: PageDomain[] = ['website', 'admin'];
  for (const domain of domains) {
    const matched = (page[domain] ?? []).find(
      (item) => normalizeActiveHref(item.path) === normalizedPath
    );
    if (matched) return matched;
  }
  // Match dynamic routes: /guides/:slug, /blog/:slug
  const guideMatch = normalizedPath.match(/^\/guides\/([^/]+)$/);
  if (guideMatch) {
    return (page.website ?? []).find((p) => p.path === '/guides/:slug') ?? undefined;
  }
  const blogMatch = normalizedPath.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) {
    return (page.website ?? []).find((p) => p.path === '/blog/:slug') ?? undefined;
  }
  return undefined;
}

const NAVIGATION_UNAVAILABLE_TOOLTIP = 'Not available in this domain build';

function isInternalPath(href: string): boolean {
  return href.startsWith('/');
}

/** Static paths from page model (exclude param paths for exact matching). */
const staticPaths = (['website', 'admin'] as const).flatMap((domain) =>
  (page[domain] ?? [])
    .filter((entry) => !entry.path.includes(':'))
    .map((entry) => normalizeActiveHref(entry.path))
);

const availablePaths = Object.freeze([...new Set(staticPaths)]) as readonly string[];

const availablePathSet = new Set(availablePaths);

/** Check if path matches dynamic route pattern (e.g. /guides/slug, /blog/slug). */
function matchesDynamicRoute(normalizedHref: string): boolean {
  return /^\/guides\/[^/]+$/.test(normalizedHref) || /^\/blog\/[^/]+$/.test(normalizedHref);
}

function resolveNavigation(href: string): NavigationState {
  if (!isInternalPath(href)) {
    return Object.freeze({
      href,
      enabled: true,
      mode: 'soft' as const,
    });
  }

  const normalizedHref = normalizeActiveHref(href);
  if (availablePathSet.has(normalizedHref) || matchesDynamicRoute(normalizedHref)) {
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
  const normalizedHref = normalizeActiveHref(activeHref);
  const frozen = links.map((link) =>
    Object.freeze({
      ...link,
      active: normalizeActiveHref(link.href) === normalizedHref,
    })
  );
  return Object.freeze(frozen) as DashboardSidebarLink[];
}

function getAdminSidebarLinks(activeHref: string): DashboardSidebarLink[] {
  const normalizedHref = normalizeActiveHref(activeHref);
  const cached = sidebarLinksCache.get(`admin:${normalizedHref}`);
  if (cached) return cached;
  const result = freezeSidebarLinks(adminSidebarLinks, normalizedHref);
  sidebarLinksCache.set(`admin:${normalizedHref}`, result);
  return result;
}

/** Pre-warm cache for admin routes. */
const ADMIN_PATHS = ['/admin', '/admin/dashboard'];
for (const p of ADMIN_PATHS) getAdminSidebarLinks(p);

export function getSidebarCacheDiagnostics() {
  const keys = sidebarLinksCache.keys();
  return Object.freeze({
    stats: Object.freeze(sidebarLinksCache.stats()),
    totalEntries: keys.length,
  });
}

// Domain namespaces (read-only views, aligned with shared page model)
const websiteDomain = Object.freeze({
  page: page.website ?? [],
  hero: hero as HeroFixture,
  features: features as FeaturesFixture,
  components: components as MenuFixture,
  guides: guides as RecipesFixture,
  blog: blog as BlogFixture,
  showcase: showcase as PromotionsFixture,
  testimonials: testimonials as TestimonialsFixture,
  cta: cta as CTAFixture,
  site,
  navItems,
  sidebarLinks,
});

const adminDomain = Object.freeze({
  page: page.admin ?? [],
  admin: admin as AdminFixture,
  adminSidebarLinks,
  adminSidebarLabel,
  getAdminSidebarLinks,
});

export const context = Object.freeze({
  page,
  /** @deprecated Use page instead. */
  routes: page,
  site,
  navItems,
  sidebarLinks,
  adminSidebarLinks,
  adminSidebarLabel,
  getAdminSidebarLinks,
  getPageByPath,
  getPagesByDomain,
  resolveNavigation,
  navigation,
  getSidebarCacheDiagnostics,
  hero: hero as HeroFixture,
  features: features as FeaturesFixture,
  components: components as MenuFixture,
  guides: guides as RecipesFixture,
  blog: blog as BlogFixture,
  showcase: showcase as PromotionsFixture,
  testimonials: testimonials as TestimonialsFixture,
  cta: cta as CTAFixture,
  admin: admin as AdminFixture,
  domains: Object.freeze({
    website: websiteDomain,
    admin: adminDomain,
  }),
  clearCache,
});

/** @deprecated Use context instead */
export const fixtures = {
  hero: context.hero,
  features: context.features,
  components: context.components,
  guides: context.guides,
  blog: context.blog,
  showcase: context.showcase,
  testimonials: context.testimonials,
  cta: context.cta,
};

export * from './types';
