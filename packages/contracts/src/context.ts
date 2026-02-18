import { createCache } from './cache';
import type {
  AppContextBase,
  DashboardSidebarLink,
  NavItem,
  PageDomain,
  PageRecord,
  SidebarLink,
  SiteInfo,
} from './types';

const SIDEBAR_CACHE_MAX_SIZE = 20;
const DEFAULT_TOOLTIP = 'Not available in this domain build';

export const EMPTY_ARRAY: readonly never[] = Object.freeze([]) as readonly never[];

export function normalizeActiveHref(activeHref: string): string {
  const raw = activeHref.trim();
  const noHash = raw.split('#', 1)[0] ?? '';
  const noQuery = noHash.split('?', 1)[0] ?? '';
  const withLeadingSlash = noQuery.startsWith('/') ? noQuery : `/${noQuery}`;
  const normalizedSlashes = withLeadingSlash.replace(/\/{2,}/g, '/');
  if (normalizedSlashes === '' || normalizedSlashes === '/') return '/';
  return normalizedSlashes.replace(/\/+$/, '');
}

function isInternalPath(href: string): boolean {
  return href.startsWith('/');
}

function buildDynamicRouteRegex(pathPattern: string): RegExp {
  const escaped = pathPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const withParams = escaped.replace(/:([a-zA-Z0-9_]+)/g, '[^/]+');
  return new RegExp(`^${withParams}$`);
}

function matchesDynamicRoute(path: string, patterns: readonly string[]): boolean {
  return patterns
    .map((pattern) => buildDynamicRouteRegex(pattern))
    .some((regex) => regex.test(path));
}

export interface CreateContextInput<TFixtures extends Record<string, unknown>> {
  site: SiteInfo;
  page: Record<PageDomain, PageRecord[]>;
  navItems?: NavItem[];
  sidebarLinks?: SidebarLink[];
  adminSidebarLinks?: DashboardSidebarLink[];
  adminSidebarLabel?: string;
  dynamicRoutePatterns?: readonly string[];
  navigationUnavailableTooltip?: string;
  fixtures?: TFixtures;
}

export function createContext<TFixtures extends Record<string, unknown>>(
  input: CreateContextInput<TFixtures>
): AppContextBase<TFixtures> {
  const sidebarLinksCache = createCache<string, DashboardSidebarLink[]>(SIDEBAR_CACHE_MAX_SIZE);
  const dynamicPatterns = input.dynamicRoutePatterns ?? [];
  const unavailableTooltip = input.navigationUnavailableTooltip ?? DEFAULT_TOOLTIP;
  const navItems = (input.navItems ?? EMPTY_ARRAY) as NavItem[];
  const sidebarLinks = (input.sidebarLinks ?? EMPTY_ARRAY) as SidebarLink[];
  const adminSidebarLinks = (input.adminSidebarLinks ?? EMPTY_ARRAY) as DashboardSidebarLink[];
  const adminSidebarLabel = input.adminSidebarLabel ?? 'Admin';
  const fixtures = (input.fixtures ?? {}) as TFixtures;

  function clearCache(): void {
    sidebarLinksCache.clear();
  }

  function getPagesByDomain(domain: PageDomain): PageRecord[] {
    return input.page[domain] ?? [];
  }

  function getPageByPath(path: string): PageRecord | undefined {
    const normalizedPath = normalizeActiveHref(path);
    const domains = Object.keys(input.page) as PageDomain[];
    for (const domain of domains) {
      const matched = (input.page[domain] ?? []).find(
        (item) => normalizeActiveHref(item.path) === normalizedPath
      );
      if (matched) return matched;
    }

    if (matchesDynamicRoute(normalizedPath, dynamicPatterns)) {
      for (const domain of domains) {
        const dynamicMatch = (input.page[domain] ?? []).find((item) =>
          dynamicPatterns.includes(item.path)
        );
        if (dynamicMatch) return dynamicMatch;
      }
    }

    return undefined;
  }

  const staticPaths = Object.keys(input.page).flatMap((domain) =>
    (input.page[domain] ?? [])
      .filter((entry) => !entry.path.includes(':'))
      .map((entry) => normalizeActiveHref(entry.path))
  );

  const availablePaths = Object.freeze([...new Set(staticPaths)]) as readonly string[];
  const availablePathSet = new Set(availablePaths);

  function resolveNavigation(href: string) {
    if (!isInternalPath(href)) {
      return Object.freeze({
        href,
        enabled: true,
        mode: 'soft' as const,
      });
    }

    const normalizedHref = normalizeActiveHref(href);
    if (availablePathSet.has(normalizedHref) || matchesDynamicRoute(normalizedHref, dynamicPatterns)) {
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
      reason: unavailableTooltip,
    });
  }

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
    const cacheKey = `admin:${normalizedHref}`;
    const cached = sidebarLinksCache.get(cacheKey);
    if (cached) return cached;
    const result = freezeSidebarLinks(adminSidebarLinks, normalizedHref);
    sidebarLinksCache.set(cacheKey, result);
    return result;
  }

  const navigation = Object.freeze({
    mode: 'soft' as const,
    unavailableTooltip,
    availablePaths,
    resolve: resolveNavigation,
    isEnabled: (href: string) => resolveNavigation(href).enabled,
  });

  const context: AppContextBase<TFixtures> = Object.freeze({
    site: input.site,
    page: input.page,
    routes: input.page,
    navItems,
    sidebarLinks,
    adminSidebarLinks,
    adminSidebarLabel,
    getAdminSidebarLinks,
    getPageByPath,
    getPagesByDomain,
    resolveNavigation,
    navigation,
    getSidebarCacheDiagnostics: () => {
      const keys = sidebarLinksCache.keys();
      return Object.freeze({
        stats: Object.freeze(sidebarLinksCache.stats()),
        totalEntries: keys.length,
      });
    },
    clearCache,
    fixtures,
  });

  return context;
}
