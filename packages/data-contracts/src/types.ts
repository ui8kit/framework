export interface NavItem {
  id: string;
  title: string;
  url: string;
}

export interface SidebarLink {
  label: string;
  href: string;
}

export interface DashboardSidebarLink extends SidebarLink {
  active?: boolean;
  [key: string]: unknown;
}

export interface SiteInfo {
  title?: string;
  subtitle?: string;
  description?: string;
}

export type PageDomain = string;

export interface PageRecord {
  id: string;
  domain: PageDomain;
  title: string;
  path: string;
  layout?: string;
  component?: string;
  parentId?: string;
}

export interface PageFixture {
  page: Record<PageDomain, PageRecord[]>;
}

export type NavigationPolicyMode = 'soft';

export interface NavigationState {
  href: string;
  enabled: boolean;
  mode: NavigationPolicyMode;
  reason?: string;
}

export interface NavigationPolicy {
  mode: NavigationPolicyMode;
  unavailableTooltip: string;
  availablePaths: readonly string[];
  resolve: (href: string) => NavigationState;
  isEnabled: (href: string) => boolean;
}

export interface SidebarCacheDiagnostics {
  stats: {
    hits: number;
    misses: number;
    sets: number;
    evictions: number;
    size: number;
    maxSize: number;
  };
  totalEntries: number;
}

export interface AppContextBase<TFixtures extends Record<string, unknown> = Record<string, unknown>> {
  site: SiteInfo;
  page: Record<PageDomain, PageRecord[]>;
  routes: Record<PageDomain, PageRecord[]>;
  navItems: NavItem[];
  sidebarLinks: SidebarLink[];
  adminSidebarLinks: DashboardSidebarLink[];
  adminSidebarLabel: string;
  getAdminSidebarLinks: (activeHref: string) => DashboardSidebarLink[];
  getPageByPath: (path: string) => PageRecord | undefined;
  getPagesByDomain: (domain: PageDomain) => PageRecord[];
  resolveNavigation: (href: string) => NavigationState;
  navigation: NavigationPolicy;
  getSidebarCacheDiagnostics: () => SidebarCacheDiagnostics;
  clearCache: () => void;
  fixtures: TFixtures;
}
