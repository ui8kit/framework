import { beforeEach, describe, expect, it } from 'vitest';
import { clearCache, context, getSidebarCacheDiagnostics } from '../index';

describe('@ui8kit/data contract', () => {
  beforeEach(() => {
    clearCache();
  });

  describe('API shape', () => {
    it('keeps stable top-level context keys', () => {
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

    it('exposes website and admin domain namespaces', () => {
      expect(Object.keys(context.domains).sort()).toEqual(['admin', 'website']);
    });

    it('keeps stable website domain keys', () => {
      expect(Object.keys(context.domains.website).sort()).toEqual([
        'blog',
        'components',
        'cta',
        'features',
        'guides',
        'hero',
        'navItems',
        'page',
        'showcase',
        'sidebarLinks',
        'site',
        'testimonials',
      ]);
    });

    it('keeps stable admin domain keys', () => {
      expect(Object.keys(context.domains.admin).sort()).toEqual([
        'admin',
        'adminSidebarLabel',
        'adminSidebarLinks',
        'getAdminSidebarLinks',
        'page',
      ]);
    });
  });

  describe('navigation resolution', () => {
    it('enables all static routes from availablePaths', () => {
      for (const path of context.navigation.availablePaths) {
        const result = context.resolveNavigation(path);
        expect(result.enabled).toBe(true);
        expect(result.mode).toBe('soft');
      }
    });

    it('enables dynamic routes for guides and blog details', () => {
      expect(context.resolveNavigation('/guides/getting-started').enabled).toBe(true);
      expect(context.resolveNavigation('/blog/architecture-principles').enabled).toBe(true);
    });

    it('disables unknown internal routes with unavailable reason', () => {
      const result = context.resolveNavigation('/foo');
      expect(result.enabled).toBe(false);
      expect(result.reason).toBe(context.navigation.unavailableTooltip);
    });

    it('keeps external navigation enabled', () => {
      const result = context.resolveNavigation('https://ui8kit.dev');
      expect(result.enabled).toBe(true);
      expect(result.href).toBe('https://ui8kit.dev');
    });
  });

  describe('cache behavior', () => {
    it('returns frozen arrays and frozen items for admin links', () => {
      const links = context.getAdminSidebarLinks('/admin');
      expect(Object.isFrozen(links)).toBe(true);
      for (const link of links) {
        expect(Object.isFrozen(link)).toBe(true);
      }
    });

    it('enforces max cache size with FIFO eviction', () => {
      for (let index = 0; index < 25; index += 1) {
        context.getAdminSidebarLinks(`/admin/path-${index}`);
      }
      const diagnostics = getSidebarCacheDiagnostics();
      expect(diagnostics.stats.maxSize).toBe(20);
      expect(diagnostics.stats.size).toBe(20);
      expect(diagnostics.stats.evictions).toBeGreaterThan(0);
      expect(diagnostics.totalEntries).toBe(20);
    });

    it('clearCache resets diagnostics counters', () => {
      context.getAdminSidebarLinks('/admin');
      context.getAdminSidebarLinks('/admin/dashboard');
      clearCache();
      const diagnostics = getSidebarCacheDiagnostics();
      expect(diagnostics.totalEntries).toBe(0);
      expect(diagnostics.stats.hits).toBe(0);
      expect(diagnostics.stats.misses).toBe(0);
      expect(diagnostics.stats.sets).toBe(0);
      expect(diagnostics.stats.evictions).toBe(0);
    });
  });
});
