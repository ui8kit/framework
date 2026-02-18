/**
 * Shared cache utilities delegated to @ui8kit/contracts.
 */

import { createCache } from '@ui8kit/contracts/source';
import type { Cache, CacheStats, DashboardSidebarLink } from '@ui8kit/contracts/source';

const SIDEBAR_CACHE_MAX_SIZE = 20;

export type { Cache, CacheStats };

/** Shared cache for admin sidebar links. Key = "admin:${activeHref}". */
export const sidebarLinksCache = createCache<string, DashboardSidebarLink[]>(SIDEBAR_CACHE_MAX_SIZE);
