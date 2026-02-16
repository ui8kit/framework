#!/usr/bin/env bun

/**
 * @ui8kit/blocks — Generator Configuration
 *
 * Minimal config for generating registry metadata from the blocks library.
 * This is used independently when you only need to scan the blocks package
 * (e.g. for publishing to BuildY CDN registry).
 *
 * Usage:
 *   bun run packages/blocks/generator.config.ts
 */

import { generateRegistry, type RegistryConfig } from '../generator/src/scripts';
import { resolve } from 'path';

const ROOT = resolve(import.meta.dirname ?? process.cwd());

const config: RegistryConfig = {
  sourceDirs: [
    {
      path: resolve(ROOT, './src/blocks'),
      type: 'registry:block',
      target: 'blocks',
    },
  ],
  outputPath: resolve(ROOT, './dist/registry.json'),
  registryName: 'ui8kit-blocks',
  version: '0.1.0',
  include: ['**/*.tsx'],
  exclude: ['**/*.test.tsx', '**/*.test.ts', '**/*.meta.ts', '**/index.ts'],
  /** DSL/build-only: not used in consuming apps; exclude from registry deps */
  excludeDependencies: ['@ui8kit/template'],
};

async function main() {
  console.log('');
  console.log('  @ui8kit/blocks — Registry Generator');
  console.log('  ─────────────────────────────────');

  const registry = await generateRegistry(config);

  console.log(`  Items: ${registry.items.length}`);
  for (const item of registry.items) {
    console.log(`    ${item.type.replace('registry:', '')}  ${item.name}`);
  }
  console.log(`  Output: ${config.outputPath.replace(ROOT, '.')}`);
  console.log('');
}

main().catch((err) => {
  console.error('  Registry generation failed:', err.message);
  console.error(err.stack);
  process.exit(1);
});
