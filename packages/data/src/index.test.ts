import { describe, it, expect, beforeEach } from 'vitest';
import { context, clearCache, EMPTY_ARRAY } from './index';

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
      expect(context.domains.website.hero).toBe(context.hero);
      expect(context.domains.docs.docsIntro).toBe(context.docsIntro);
      expect(context.domains.examples.examples).toBe(context.examples);
      expect(context.domains.dashboard.dashboard).toBe(context.dashboard);
    });
  });
});
