#!/usr/bin/env bun
/**
 * Generate ui8kit.map.json from multiple sources
 * 
 * Usage:
 *   bun run scripts/generate-uikit-map.ts
 */

import { resolve } from 'path';
import { UiKitMapService } from '../packages/generator/src/services/uikit-map';
import type { IServiceContext } from '../packages/generator/src/core/interfaces';

const ROOT = resolve(import.meta.dir, '..');

// Paths
const PROPS_MAP_PATH = resolve(ROOT, 'packages/ui8kit/src/lib/utility-props.map.ts');
const TAILWIND_MAP_PATH = resolve(ROOT, 'packages/generator/src/assets/tailwind/tw-css-extended.json');
const SHADCN_MAP_PATH = resolve(ROOT, 'packages/generator/src/lib/shadcn.map.json');
const GRID_MAP_PATH = resolve(ROOT, 'packages/generator/src/lib/grid.map.json');
const OUTPUT_PATH = resolve(ROOT, 'packages/generator/src/lib/ui8kit.map.json');

/**
 * Simple console logger
 */
const logger = {
  info: (...args: unknown[]) => console.log('ℹ️ ', ...args),
  debug: (...args: unknown[]) => console.log('🔍', ...args),
  warn: (...args: unknown[]) => console.warn('⚠️ ', ...args),
  error: (...args: unknown[]) => console.error('❌', ...args),
  child: () => logger,
};

/**
 * Simple event bus (no-op for CLI)
 */
const eventBus = {
  emit: () => {},
  on: () => {},
  off: () => {},
};

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  UI8Kit Map Generator');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
  
  const service = new UiKitMapService();
  
  // Initialize with mock context
  const context: IServiceContext = {
    config: {},
    logger: logger as unknown as IServiceContext['logger'],
    eventBus: eventBus as unknown as IServiceContext['eventBus'],
    registry: {} as unknown as IServiceContext['registry'],
  };
  
  await service.initialize(context);
  
  console.log('Sources:');
  console.log(`  📄 Props map:    ${PROPS_MAP_PATH}`);
  console.log(`  📄 Tailwind map: ${TAILWIND_MAP_PATH}`);
  console.log(`  📄 Shadcn map:   ${SHADCN_MAP_PATH}`);
  console.log(`  📄 Grid map:     ${GRID_MAP_PATH}`);
  console.log('');
  
  const result = await service.execute({
    propsMapPath: PROPS_MAP_PATH,
    tailwindMapPath: TAILWIND_MAP_PATH,
    shadcnMapPath: SHADCN_MAP_PATH,
    gridMapPath: GRID_MAP_PATH,
    outputPath: OUTPUT_PATH,
  });
  
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  Result');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  📊 Total classes: ${result.totalClasses}`);
  console.log(`     ├─ Tailwind:   ${result.tailwindClasses}`);
  console.log(`     ├─ Shadcn:     ${result.shadcnClasses}`);
  console.log(`     └─ Grid:       ${result.gridClasses}`);
  console.log('');
  
  if (result.missingClasses.length > 0) {
    console.log(`  ⚠️  Missing classes (${result.missingClasses.length}):`);
    for (const cls of result.missingClasses) {
      console.log(`     - ${cls}`);
    }
    console.log('');
  }
  
  console.log(`  ✅ Output: ${result.outputPath}`);
  console.log('');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
