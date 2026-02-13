import { describe, it, expect, beforeEach } from 'vitest';
import { context, clearCache, EMPTY_ARRAY, getSidebarCacheDiagnostics } from './index';

describe('module initialization prewarm', () => {
  it('prewarms known docs/examples routes on module load', () => {
    const diagnostics = getSidebarCacheDiagnostics();
    expect(diagnostics.docsEntries).toBe(3);
    expect(diagnostics.examplesEntries).toBe(5);
    expect(diagnostics.totalEntries).toBe(8);
  });
});

describe('context', () => {
  beforeEach(() => {
    clearCache();
  });

  describe('getDocsSidebarLinks', () => {
    it('returns same reference for same activeHref', () => {
      const a = context.getDocsSidebarLinks('/docs');
      const b = context.getDocsSidebarLinks('/docs');
      expect(a).toBe(b);
    });

    it('returns different reference for different activeHref', () => {
      const a = context.getDocsSidebarLinks('/docs');
      const b = context.getDocsSidebarLinks('/docs/components');
      expect(a).not.toBe(b);
    });

    it('returns correct active state', () => {
      const links = context.getDocsSidebarLinks('/docs/installation');
      const intro = links.find((l) => l.href === '/docs');
      const installation = links.find((l) => l.href === '/docs/installation');
      expect(intro?.active).toBe(false);
      expect(installation?.active).toBe(true);
    });

    it('normalizes equivalent docs URLs to the same cache entry', () => {
      const base = context.getDocsSidebarLinks('/docs');
      const withSlash = context.getDocsSidebarLinks('/docs/');
      const withQuery = context.getDocsSidebarLinks('/docs?tab=intro');
      const withHash = context.getDocsSidebarLinks('/docs#top');
      expect(withSlash).toBe(base);
      expect(withQuery).toBe(base);
      expect(withHash).toBe(base);
    });
  });

  describe('getExamplesSidebarLinks', () => {
    it('returns same reference for same activeHref', () => {
      const a = context.getExamplesSidebarLinks('/examples');
      const b = context.getExamplesSidebarLinks('/examples');
      expect(a).toBe(b);
    });

    it('returns different reference for different activeHref', () => {
      const a = context.getExamplesSidebarLinks('/examples');
      const b = context.getExamplesSidebarLinks('/examples/dashboard');
      expect(a).not.toBe(b);
    });

    it('normalizes equivalent examples URLs to the same cache entry', () => {
      const base = context.getExamplesSidebarLinks('/examples');
      const withSlash = context.getExamplesSidebarLinks('/examples/');
      const withQuery = context.getExamplesSidebarLinks('/examples?x=1');
      const withHash = context.getExamplesSidebarLinks('/examples#top');
      expect(withSlash).toBe(base);
      expect(withQuery).toBe(base);
      expect(withHash).toBe(base);
    });

    it('returns frozen links and frozen items', () => {
      const links = context.getExamplesSidebarLinks('/examples');
      expect(Object.isFrozen(links)).toBe(true);
      expect(Object.isFrozen(links[0]!)).toBe(true);
    });
  });

  describe('clearCache', () => {
    it('invalidates cached sidebar links', () => {
      const a = context.getDocsSidebarLinks('/docs');
      clearCache();
      const b = context.getDocsSidebarLinks('/docs');
      expect(a).not.toBe(b);
    });
  });

  describe('EMPTY_ARRAY', () => {
    it('is a frozen empty array', () => {
      expect(EMPTY_ARRAY).toEqual([]);
      expect(Object.isFrozen(EMPTY_ARRAY)).toBe(true);
    });

    it('is the same reference on every access', () => {
      expect(EMPTY_ARRAY).toBe(EMPTY_ARRAY);
    });
  });

  describe('domains', () => {
    it('exposes domain-scoped data', () => {
      expect(context.domains.website.page).toBe(context.page.website);
      expect(context.domains.website.hero).toBe(context.hero);
      expect(context.domains.docs.page).toBe(context.page.docs);
      expect(context.domains.docs.docsIntro).toBe(context.docsIntro);
      expect(context.domains.examples.page).toBe(context.page.examples);
      expect(context.domains.examples.examples).toBe(context.examples);
      expect(context.domains.dashboard.page).toBe(context.page.dashboard);
      expect(context.domains.dashboard.dashboard).toBe(context.dashboard);
    });
  });

  describe('page model', () => {
    it('keeps backward-compatible routes alias', () => {
      expect(context.routes).toBe(context.page);
    });

    it('returns normalized page metadata by path', () => {
      const docsPage = context.getPageByPath('/docs?tab=components#top');
      expect(docsPage?.id).toBe('docs-introduction');
    });

    it('returns pages by domain', () => {
      const examplesPages = context.getPagesByDomain('examples');
      expect(examplesPages.length).toBeGreaterThanOrEqual(5);
      expect(examplesPages.some((entry) => entry.id === 'examples-layout')).toBe(true);
    });
  });

  describe('cache diagnostics', () => {
    it('reports segmented cache entries and runtime stats', () => {
      context.getDocsSidebarLinks('/docs');
      context.getExamplesSidebarLinks('/examples');
      const diagnostics = getSidebarCacheDiagnostics();
      expect(diagnostics.docsEntries).toBeGreaterThanOrEqual(1);
      expect(diagnostics.examplesEntries).toBeGreaterThanOrEqual(1);
      expect(diagnostics.totalEntries).toBe(
        diagnostics.docsEntries + diagnostics.examplesEntries + diagnostics.otherEntries
      );
      expect(diagnostics.stats.size).toBe(diagnostics.totalEntries);
      expect(diagnostics.stats.maxSize).toBe(20);
    });
  });
});
