// Type definitions for fixtures and context

// -----------------------------------------------------------------------------
// Context: site, components, guides, showcase (unified for engine + apps)
// -----------------------------------------------------------------------------

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
}

export interface SiteInfo {
  title?: string;
  subtitle?: string;
  description?: string;
}

export type PageDomain = 'website' | 'admin';

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

// -----------------------------------------------------------------------------
// Unified context shape (for copy-paste apps: install @ui8kit/data, use context)
// -----------------------------------------------------------------------------

export interface AppContext {
  site: SiteInfo;
  page: PageFixture['page'];
  /** @deprecated Use page instead. */
  routes: PageFixture['page'];
  navItems: NavItem[];
  sidebarLinks: SidebarLink[];
  adminSidebarLinks: DashboardSidebarLink[];
  hero: HeroFixture;
  features: FeaturesFixture;
  components: ComponentsFixture;
  guides: GuidesFixture;
  blog: BlogFixture;
  showcase: ShowcaseFixture;
  cta: CTAFixture;
  testimonials: TestimonialsFixture;
  admin: AdminFixture;
  adminSidebarLabel: string;
  getAdminSidebarLinks: (activeHref: string) => DashboardSidebarLink[];
  getPageByPath: (path: string) => PageRecord | undefined;
  getPagesByDomain: (domain: PageDomain) => PageRecord[];
  resolveNavigation: (href: string) => NavigationState;
  navigation: NavigationPolicy;
  getSidebarCacheDiagnostics: () => SidebarCacheDiagnostics;
  domains?: DomainsContext;
  clearCache?: () => void;
}

/** Domain-scoped context (context.domains.website, etc.) */
export interface DomainsContext {
  website: WebsiteDomainContext;
  admin: AdminDomainContext;
}

export interface WebsiteDomainContext {
  page: PageRecord[];
  hero: HeroFixture;
  features: FeaturesFixture;
  components: ComponentsFixture;
  guides: GuidesFixture;
  blog: BlogFixture;
  showcase: ShowcaseFixture;
  cta: CTAFixture;
  testimonials: TestimonialsFixture;
  site: SiteInfo;
  navItems: NavItem[];
  sidebarLinks: SidebarLink[];
}

export interface AdminDomainContext {
  page: PageRecord[];
  admin: AdminFixture;
  adminSidebarLinks: DashboardSidebarLink[];
  adminSidebarLabel: string;
}
