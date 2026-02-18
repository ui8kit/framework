// Main export for engine data layer
// Re-exports context and types. Source of truth: apps/engine (fixtures, future: DB/GraphQL)

export {
  context,
  EMPTY_ARRAY,
  clearCache,
  getSidebarCacheDiagnostics,
  fixtures,
} from './context';
export * from './types';
