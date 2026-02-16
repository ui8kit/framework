import { createContext, EMPTY_ARRAY } from '@ui8kit/sdk/source/data';
import siteData from '../../fixtures/shared/site.json';
import navigationData from '../../fixtures/shared/navigation.json';
import pageData from '../../fixtures/shared/page.json';
import heroData from '../../fixtures/website/hero.json';
import featuresData from '../../fixtures/website/features.json';
import testimonialsData from '../../fixtures/website/testimonials.json';
import ctaData from '../../fixtures/website/cta.json';
import componentsData from '../../fixtures/website/components.json';
import guidesData from '../../fixtures/website/guides.json';
import blogData from '../../fixtures/website/blog.json';
import showcaseData from '../../fixtures/website/showcase.json';
import adminData from '../../fixtures/admin/admin.json';
import type {
  DashboardSidebarLink,
  NavItem,
  PageFixture,
  SidebarLink,
  SiteInfo,
} from '@ui8kit/sdk/source/data';

const site = siteData as SiteInfo;
const page = (pageData as PageFixture).page;
const navItems = navigationData.navItems as NavItem[];
const sidebarLinks = navigationData.sidebarLinks as SidebarLink[];
const adminSidebarLinks = (navigationData.adminSidebarLinks ?? EMPTY_ARRAY) as DashboardSidebarLink[];
const adminSidebarLabel = navigationData.labels?.adminSidebarLabel ?? 'Admin';

const baseContext = createContext<{
  hero: typeof heroData;
  features: typeof featuresData;
  testimonials: typeof testimonialsData;
  cta: typeof ctaData;
  components: typeof componentsData;
  guides: typeof guidesData;
  blog: typeof blogData;
  showcase: typeof showcaseData;
  admin: typeof adminData;
}>({
  site,
  page,
  navItems,
  sidebarLinks,
  adminSidebarLinks,
  adminSidebarLabel,
  dynamicRoutePatterns: ['/guides/:slug', '/blog/:slug'],
  fixtures: {
    hero: heroData,
    features: featuresData,
    testimonials: testimonialsData,
    cta: ctaData,
    components: componentsData,
    guides: guidesData,
    blog: blogData,
    showcase: showcaseData,
    admin: adminData,
  },
});

const websiteDomain = Object.freeze({
  page: page.website ?? [],
  hero: baseContext.fixtures.hero,
  features: baseContext.fixtures.features,
  components: baseContext.fixtures.components,
  guides: baseContext.fixtures.guides,
  blog: baseContext.fixtures.blog,
  showcase: baseContext.fixtures.showcase,
  testimonials: baseContext.fixtures.testimonials,
  cta: baseContext.fixtures.cta,
  site: baseContext.site,
  navItems: baseContext.navItems,
  sidebarLinks: baseContext.sidebarLinks,
});

const adminDomain = Object.freeze({
  page: page.admin ?? [],
  admin: baseContext.fixtures.admin,
  adminSidebarLinks: baseContext.adminSidebarLinks,
  adminSidebarLabel: baseContext.adminSidebarLabel,
  getAdminSidebarLinks: baseContext.getAdminSidebarLinks,
});

export const context = Object.freeze({
  ...baseContext,
  hero: baseContext.fixtures.hero,
  features: baseContext.fixtures.features,
  testimonials: baseContext.fixtures.testimonials,
  cta: baseContext.fixtures.cta,
  components: baseContext.fixtures.components,
  guides: baseContext.fixtures.guides,
  blog: baseContext.fixtures.blog,
  showcase: baseContext.fixtures.showcase,
  admin: baseContext.fixtures.admin,
  domains: Object.freeze({
    website: websiteDomain,
    admin: adminDomain,
  }),
});
