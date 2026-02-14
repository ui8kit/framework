// Type definitions for fixtures and context

// -----------------------------------------------------------------------------
// Context: site, menu, sidebar (unified for engine + apps)
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

export interface PricingFixture {
  title?: string;
  subtitle?: string;
  plans?: Array<{
    id: string;
    name: string;
    price: string;
    period?: string;
    features: string[];
    ctaText?: string;
    ctaUrl?: string;
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

export interface ProductsFixture {
  products?: Array<{
    id: string;
    title: string;
    description?: string;
    price?: string;
    image?: string;
    url?: string;
  }>;
}

export interface DashboardFixture {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
}

export interface MenuDish {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  image?: string;
}

export interface MenuCategory {
  id: string;
  title: string;
}

export interface MenuFixture {
  title?: string;
  subtitle?: string;
  categories?: MenuCategory[];
  dishes?: MenuDish[];
}

export interface RecipeItem {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  image?: string;
  date?: string;
}

export interface RecipesFixture {
  title?: string;
  subtitle?: string;
  recipes?: RecipeItem[];
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

export interface PromotionItem {
  id: string;
  title: string;
  description: string;
  validUntil?: string;
  image?: string;
}

export interface PromotionsFixture {
  title?: string;
  subtitle?: string;
  promotions?: PromotionItem[];
}

export interface AdminFixture {
  exportSchema?: Record<string, string>;
}

export interface DocsSection {
  id: string;
  title: string;
  text?: string;
  code?: string;
}

export interface DocsIntroFixture {
  title?: string;
  lead?: string;
  sections?: DocsSection[];
}

export interface DocsInstallationFixture {
  title?: string;
  lead?: string;
  sections?: DocsSection[];
}

export interface DocsComponentsFixture {
  title?: string;
  lead?: string;
}

export interface ExamplesFixture {
  title?: string;
  description?: string;
  button?: {
    title?: string;
    defaultLabel?: string;
    outlineLabel?: string;
    ghostLabel?: string;
  };
  badge?: {
    title?: string;
    defaultLabel?: string;
    secondaryLabel?: string;
    outlineLabel?: string;
  };
  typography?: {
    title?: string;
    heading?: string;
    body?: string;
  };
  actions?: {
    explore?: string;
    allComponents?: string;
  };
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
  components: MenuFixture;
  guides: RecipesFixture;
  blog: BlogFixture;
  showcase: PromotionsFixture;
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
  components: MenuFixture;
  guides: RecipesFixture;
  blog: BlogFixture;
  showcase: PromotionsFixture;
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
