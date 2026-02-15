import { beforeEach, describe, expect, it } from 'vitest';
import { clearCache, context, EMPTY_ARRAY, getSidebarCacheDiagnostics } from './index';

describe('context', () => {
  beforeEach(() => {
    clearCache();
  });

  describe('getAdminSidebarLinks', () => {
    it('returns same reference for equivalent admin paths', () => {
      const base = context.getAdminSidebarLinks('/admin/dashboard');
      const withSlash = context.getAdminSidebarLinks('/admin/dashboard/');
      const withQuery = context.getAdminSidebarLinks('/admin/dashboard?tab=content');
      const withHash = context.getAdminSidebarLinks('/admin/dashboard#top');

      expect(withSlash).toBe(base);
      expect(withQuery).toBe(base);
      expect(withHash).toBe(base);
    });

    it('returns different cache entries for different admin paths', () => {
      const a = context.getAdminSidebarLinks('/admin');
      const b = context.getAdminSidebarLinks('/admin/dashboard');
      expect(a).not.toBe(b);
    });

    it('returns frozen links and frozen items', () => {
      const links = context.getAdminSidebarLinks('/admin');
      expect(Object.isFrozen(links)).toBe(true);
      expect(Object.isFrozen(links[0]!)).toBe(true);
    });
  });

  describe('clearCache', () => {
    it('invalidates cached admin sidebar links', () => {
      const a = context.getAdminSidebarLinks('/admin');
      clearCache();
      const b = context.getAdminSidebarLinks('/admin');
      expect(a).not.toBe(b);
    });
  });

  describe('EMPTY_ARRAY', () => {
    it('is a frozen empty array with stable reference', () => {
      expect(EMPTY_ARRAY).toEqual([]);
      expect(Object.isFrozen(EMPTY_ARRAY)).toBe(true);
      expect(EMPTY_ARRAY).toBe(EMPTY_ARRAY);
    });
  });

  describe('domains', () => {
    it('exposes website and admin domain-scoped data', () => {
      expect(context.domains.website.page).toBe(context.page.website);
      expect(context.domains.website.hero).toBe(context.hero);
      expect(context.domains.website.guides).toBe(context.guides);
      expect(context.domains.admin.page).toBe(context.page.admin);
      expect(context.domains.admin.admin).toBe(context.admin);
      expect(context.domains.admin.adminSidebarLinks).toBe(context.adminSidebarLinks);
    });
  });

  describe('page model', () => {
    it('keeps backward-compatible routes alias', () => {
      expect(context.routes).toBe(context.page);
    });

    it('resolves dynamic page records by path', () => {
      const guidePage = context.getPageByPath('/guides/getting-started');
      const blogPage = context.getPageByPath('/blog/architecture-principles');

      expect(guidePage?.path).toBe('/guides/:slug');
      expect(blogPage?.path).toBe('/blog/:slug');
    });

    it('returns pages by active domains only', () => {
      const websitePages = context.getPagesByDomain('website');
      const adminPages = context.getPagesByDomain('admin');

      expect(websitePages.length).toBeGreaterThan(0);
      expect(adminPages.length).toBeGreaterThan(0);
      expect(websitePages.every((entry) => entry.domain === 'website')).toBe(true);
      expect(adminPages.every((entry) => entry.domain === 'admin')).toBe(true);
    });
  });

  describe('resolveNavigation', () => {
    it('enables static internal routes', () => {
      const result = context.resolveNavigation('/components');
      expect(result).toEqual({
        href: '/components',
        enabled: true,
        mode: 'soft',
      });
    });

    it('enables dynamic guide and blog routes', () => {
      const guide = context.resolveNavigation('/guides/getting-started');
      const blog = context.resolveNavigation('/blog/architecture-principles');
      expect(guide.enabled).toBe(true);
      expect(blog.enabled).toBe(true);
      expect(guide.mode).toBe('soft');
      expect(blog.mode).toBe('soft');
    });

    it('disables unknown internal routes with reason', () => {
      const result = context.resolveNavigation('/unknown-page');
      expect(result.enabled).toBe(false);
      expect(result.mode).toBe('soft');
      expect(result.reason).toBe('Not available in this domain build');
    });

    it('enables external links without modification', () => {
      const result = context.resolveNavigation('https://example.com');
      expect(result).toEqual({
        href: 'https://example.com',
        enabled: true,
        mode: 'soft',
      });
    });

    it('normalizes trailing slashes, query strings, and hash fragments', () => {
      const result = context.resolveNavigation('/guides/getting-started/?tab=1#intro');
      expect(result.href).toBe('/guides/getting-started');
      expect(result.enabled).toBe(true);
    });
  });

  describe('navigation policy', () => {
    it('exposes a frozen availablePaths array with required routes', () => {
      expect(Object.isFrozen(context.navigation.availablePaths)).toBe(true);
      expect(context.navigation.availablePaths).toEqual(
        expect.arrayContaining([
          '/',
          '/components',
          '/guides',
          '/blog',
          '/showcase',
          '/admin',
          '/admin/dashboard',
        ])
      );
    });

    it('isEnabled mirrors route availability', () => {
      expect(context.navigation.isEnabled('/components')).toBe(true);
      expect(context.navigation.isEnabled('/guides/getting-started')).toBe(true);
      expect(context.navigation.isEnabled('/missing')).toBe(false);
    });

    it('keeps soft mode and unavailable tooltip', () => {
      expect(context.navigation.mode).toBe('soft');
      expect(context.navigation.unavailableTooltip).toBe('Not available in this domain build');
    });
  });

  describe('public API contract', () => {
    it('exposes stable top-level context keys', () => {
      expect(Object.keys(context).sort()).toEqual([
        'admin',
        'adminSidebarLabel',
        'adminSidebarLinks',
        'blog',
        'clearCache',
        'components',
        'cta',
        'domains',
        'features',
        'getAdminSidebarLinks',
        'getPageByPath',
        'getPagesByDomain',
        'getSidebarCacheDiagnostics',
        'guides',
        'hero',
        'navItems',
        'navigation',
        'page',
        'resolveNavigation',
        'routes',
        'showcase',
        'sidebarLinks',
        'site',
        'testimonials',
      ]);
    });

    it('exposes website and admin domains only', () => {
      expect(Object.keys(context.domains).sort()).toEqual(['admin', 'website']);
    });
  });

  describe('fixture data integrity', () => {
    it('keeps expected content counts', () => {
      expect(context.blog.posts).toHaveLength(3);
      expect(context.showcase.projects).toHaveLength(3);
      expect(context.guides.guides).toHaveLength(3);
    });

    it('keeps required fields for guides and blog posts', () => {
      for (const guide of context.guides.guides ?? []) {
        expect(guide.slug).toBeTruthy();
        expect(guide.body).toBeTruthy();
      }
      for (const post of context.blog.posts ?? []) {
        expect(post.slug).toBeTruthy();
        expect(post.body).toBeTruthy();
      }
    });
  });

  describe('cache diagnostics', () => {
    it('reports total entries and runtime stats', () => {
      context.getAdminSidebarLinks('/admin');
      context.getAdminSidebarLinks('/admin/dashboard');
      const diagnostics = getSidebarCacheDiagnostics();

      expect(diagnostics.totalEntries).toBe(2);
      expect(diagnostics.stats.size).toBe(diagnostics.totalEntries);
      expect(diagnostics.stats.maxSize).toBe(20);
    });
  });
});
