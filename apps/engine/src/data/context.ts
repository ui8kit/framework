// Unified context (site, components, guides, showcase, sidebars, blocks) for engine
// Source of truth: apps/engine. Fixtures live in ./fixtures (future: DB/GraphQL)

import {
  createContext,
  EMPTY_ARRAY as BASE_EMPTY_ARRAY,
} from '@ui8kit/data-contracts/source';
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
  ComponentsFixture,
  GuidesFixture,
  BlogFixture,
  ShowcaseFixture,
  AdminFixture,
  NavItem,
  SidebarLink,
  DashboardSidebarLink,
  SiteInfo,
  PageFixture,
} from './types';

const site = siteData as SiteInfo;
const page = (pageData as PageFixture).page;

const navItems = navigationData.navItems as NavItem[];
const sidebarLinks = navigationData.sidebarLinks as SidebarLink[];
const adminSidebarLinks = (navigationData.adminSidebarLinks ?? BASE_EMPTY_ARRAY) as DashboardSidebarLink[];
const adminSidebarLabel = navigationData.labels?.adminSidebarLabel ?? 'Admin';

const hero = heroData as HeroFixture;
const features = featuresData as FeaturesFixture;
const testimonials = testimonialsData as TestimonialsFixture;
const cta = ctaData as CTAFixture;
const components = componentsData as ComponentsFixture;
const guides = guidesData as GuidesFixture;
const blog = blogData as BlogFixture;
const showcase = showcaseData as ShowcaseFixture;
const admin = adminData as AdminFixture;

/** Stable empty array to avoid `x ?? []` creating new arrays on every access. */
export const EMPTY_ARRAY: readonly never[] = BASE_EMPTY_ARRAY;

const baseContext = createContext({
  site,
  page,
  navItems,
  sidebarLinks,
  adminSidebarLinks,
  adminSidebarLabel,
  dynamicRoutePatterns: ['/guides/:slug', '/blog/:slug'],
  fixtures: {
    hero: hero as HeroFixture,
    features: features as FeaturesFixture,
    components: components as ComponentsFixture,
    guides: guides as GuidesFixture,
    blog: blog as BlogFixture,
    showcase: showcase as ShowcaseFixture,
    testimonials: testimonials as TestimonialsFixture,
    cta: cta as CTAFixture,
    admin: admin as AdminFixture,
  },
});

const websiteDomain = Object.freeze({
  page: page.website ?? [],
  hero: baseContext.fixtures.hero as HeroFixture,
  features: baseContext.fixtures.features as FeaturesFixture,
  components: baseContext.fixtures.components as ComponentsFixture,
  guides: baseContext.fixtures.guides as GuidesFixture,
  blog: baseContext.fixtures.blog as BlogFixture,
  showcase: baseContext.fixtures.showcase as ShowcaseFixture,
  testimonials: baseContext.fixtures.testimonials as TestimonialsFixture,
  cta: baseContext.fixtures.cta as CTAFixture,
  site: baseContext.site,
  navItems: baseContext.navItems,
  sidebarLinks: baseContext.sidebarLinks,
});

const adminDomain = Object.freeze({
  page: page.admin ?? [],
  admin: baseContext.fixtures.admin as AdminFixture,
  adminSidebarLinks: baseContext.adminSidebarLinks,
  adminSidebarLabel: baseContext.adminSidebarLabel,
  getAdminSidebarLinks: baseContext.getAdminSidebarLinks,
});

export const context = Object.freeze({
  page: baseContext.page,
  /** @deprecated Use page instead. */
  routes: baseContext.routes,
  site: baseContext.site,
  navItems: baseContext.navItems,
  sidebarLinks: baseContext.sidebarLinks,
  adminSidebarLinks: baseContext.adminSidebarLinks,
  adminSidebarLabel: baseContext.adminSidebarLabel,
  getAdminSidebarLinks: baseContext.getAdminSidebarLinks,
  getPageByPath: baseContext.getPageByPath,
  getPagesByDomain: baseContext.getPagesByDomain,
  resolveNavigation: baseContext.resolveNavigation,
  navigation: baseContext.navigation,
  getSidebarCacheDiagnostics: baseContext.getSidebarCacheDiagnostics,
  hero: baseContext.fixtures.hero as HeroFixture,
  features: baseContext.fixtures.features as FeaturesFixture,
  components: baseContext.fixtures.components as ComponentsFixture,
  guides: baseContext.fixtures.guides as GuidesFixture,
  blog: baseContext.fixtures.blog as BlogFixture,
  showcase: baseContext.fixtures.showcase as ShowcaseFixture,
  testimonials: baseContext.fixtures.testimonials as TestimonialsFixture,
  cta: baseContext.fixtures.cta as CTAFixture,
  admin: baseContext.fixtures.admin as AdminFixture,
  domains: Object.freeze({
    website: websiteDomain,
    admin: adminDomain,
  }),
  clearCache: baseContext.clearCache,
});

export function clearCache(): void {
  baseContext.clearCache();
}

export function getSidebarCacheDiagnostics() {
  return baseContext.getSidebarCacheDiagnostics();
}

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
