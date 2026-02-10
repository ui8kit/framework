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

// -----------------------------------------------------------------------------
// Unified context shape (for copy-paste apps: install @ui8kit/data, use context)
// -----------------------------------------------------------------------------

export interface AppContext {
  site: SiteInfo;
  navItems: NavItem[];
  sidebarLinks: SidebarLink[];
  dashboardSidebarLinks: DashboardSidebarLink[];
  docsSidebarLinks: DashboardSidebarLink[];
  examplesSidebarLinks: DashboardSidebarLink[];
  hero: HeroFixture;
  features: FeaturesFixture;
  pricing: PricingFixture;
  testimonials: TestimonialsFixture;
  cta: CTAFixture;
  dashboard: DashboardFixture;
}
