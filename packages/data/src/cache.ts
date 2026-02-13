/**
 * Simple LRU-style cache for derived data.
 * Used by getDocsSidebarLinks and getExamplesSidebarLinks to avoid memory churn.
 */

import type { DashboardSidebarLink } from './types';

const SIDEBAR_CACHE_MAX_SIZE = 20;

export interface Cache<K, V> {
  get(key: K): V | undefined;
  set(key: K, value: V): void;
  clear(): void;
}

/**
 * Create a cache with FIFO eviction when maxSize is exceeded.
 * Map preserves insertion order, so we evict the first (oldest) entry.
 */
export function createCache<K, V>(maxSize: number): Cache<K, V> {
  const map = new Map<K, V>();

  return {
    get(key: K): V | undefined {
      return map.get(key);
    },
    set(key: K, value: V): void {
      if (map.size >= maxSize && !map.has(key)) {
        const firstKey = map.keys().next().value;
        if (firstKey !== undefined) {
          map.delete(firstKey);
        }
      }
      map.set(key, value);
    },
    clear(): void {
      map.clear();
    },
  };
}

/** Shared cache for sidebar links (docs + examples routes). Key = activeHref. */
export const sidebarLinksCache = createCache<string, DashboardSidebarLink[]>(SIDEBAR_CACHE_MAX_SIZE);
