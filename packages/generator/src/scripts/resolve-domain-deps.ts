/**
 * Domain Dependency Resolution
 *
 * Resolves which registry items belong to a given domain by:
 * 1. Seeding with PageViews (registry:route) where domain === D
 * 2. Recursively adding blocks/layouts/partials from imports
 * 3. Adding shared items (domain === undefined)
 * 4. Deduplicating by name
 */

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import type { RegistryItem, Registry } from './generate-registry';

/** Map layout container names to their view names (registry layout items) */
const LAYOUT_CONTAINER_TO_VIEW: Record<string, string> = {
  MainLayout: 'MainLayoutView',
};

/** Import specifiers that may reference registry items */
const REGISTRY_IMPORT_SPECIFIERS = [
  '@/blocks',
  '@/layouts',
  '@/partials',
  '@ui8kit/blocks',
  '@ui8kit/core',
];

/**
 * Extract imported identifiers from a source file.
 * Returns component/block/layout/partial names that might be in the registry.
 */
function extractImportedNames(source: string): string[] {
  const names = new Set<string>();

  // import { A, B, type C } from '...'
  const namedImportRegex =
    /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g;
  // import A from '...'
  const defaultImportRegex = /import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g;

  let match: RegExpExecArray | null;

  while ((match = namedImportRegex.exec(source)) !== null) {
    const specifier = match[2];
    if (!isRegistryRelevantImport(specifier)) continue;

    const bindings = match[1];
    for (const part of bindings.split(',')) {
      const trimmed = part.trim();
      if (trimmed.startsWith('type ') || trimmed.startsWith('interface ')) continue;
      const name = trimmed.split(/\s+as\s+/)[0].trim();
      if (name && /^[A-Z]/.test(name)) names.add(name);
    }
  }

  while ((match = defaultImportRegex.exec(source)) !== null) {
    const specifier = match[2];
    if (!isRegistryRelevantImport(specifier)) continue;
    const name = match[1];
    if (name && /^[A-Z]/.test(name)) names.add(name);
  }

  // Relative imports: from '../../partials/Header' etc.
  const relativeImportRegex = /import\s+\{([^}]+)\}\s+from\s+['"](\.\.[^'"]+)['"]/g;
  while ((match = relativeImportRegex.exec(source)) !== null) {
    const bindings = match[1];
    for (const part of bindings.split(',')) {
      const trimmed = part.trim();
      if (trimmed.startsWith('type ') || trimmed.startsWith('interface ')) continue;
      const name = trimmed.split(/\s+as\s+/)[0].trim();
      if (name && /^[A-Z]/.test(name)) names.add(name);
    }
  }

  return Array.from(names);
}

function isRegistryRelevantImport(specifier: string): boolean {
  if (
    specifier === '@/blocks' ||
    specifier === '@/layouts' ||
    specifier === '@/partials' ||
    specifier.startsWith('@ui8kit/blocks') ||
    specifier.startsWith('@ui8kit/core')
  ) {
    return true;
  }
  if (specifier.startsWith('./') || specifier.startsWith('../')) {
    return true;
  }
  return false;
}

/**
 * Resolve an imported name to a registry item name.
 * Handles layout container -> view mapping.
 */
function resolveToRegistryName(importedName: string, nameToItem: Map<string, RegistryItem>): string | null {
  const viewName = LAYOUT_CONTAINER_TO_VIEW[importedName];
  if (viewName && nameToItem.has(viewName)) return viewName;
  if (nameToItem.has(importedName)) return importedName;
  return null;
}

/**
 * Resolve all registry items needed for a given domain.
 *
 * @param registry Full registry (all items)
 * @param domain Domain name (e.g. "website", "docs")
 * @returns Filtered registry items for the domain
 */
export async function resolveDomainItems(
  registry: Registry,
  domain: string
): Promise<RegistryItem[]> {
  const items = registry.items;
  const nameToItem = new Map<string, RegistryItem>();
  for (const item of items) {
    nameToItem.set(item.name, item);
  }

  const result = new Map<string, RegistryItem>();

  // 1. Shared: add all items with domain === undefined
  for (const item of items) {
    if (item.domain === undefined) {
      result.set(item.name, item);
    }
  }

  // 2. Seeds: PageViews (registry:route) with domain === D
  const seeds = items.filter(
    (i) => i.type === 'registry:route' && i.domain === domain
  );
  for (const item of seeds) {
    result.set(item.name, item);
  }

  // 3. Recurse: for each item in result, parse imports and add dependencies
  const toProcess = [...result.values()];
  const processed = new Set<string>();

  while (toProcess.length > 0) {
    const item = toProcess.pop()!;
    if (processed.has(item.name)) continue;
    processed.add(item.name);

    const sourcePath = item.sourcePath;
    if (!sourcePath || !existsSync(sourcePath)) continue;

    const source = await readFile(sourcePath, 'utf-8');
    const importedNames = extractImportedNames(source);

    for (const name of importedNames) {
      const resolved = resolveToRegistryName(name, nameToItem);
      if (resolved && !result.has(resolved)) {
        const dep = nameToItem.get(resolved)!;
        result.set(resolved, dep);
        toProcess.push(dep);
      }
    }
  }

  return Array.from(result.values());
}
