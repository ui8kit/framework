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
