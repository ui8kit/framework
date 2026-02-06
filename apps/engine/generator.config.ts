#!/usr/bin/env bun

/**
 * UI8Kit Engine — Template Generator Configuration
 *
 * Generates React (and other engine) templates from DSL components.
 * Source: apps/engine/src + packages/blocks/src
 * Output: apps/engine/dist/{engine}/
 *
 * Usage:
 *   bun run generate                    # default: react
 *   bun run generate --engine react
 *   bun run generate --engine liquid
 *   bun run generate -e handlebars
 */

import { TemplateService, Logger } from '../../packages/generator/src/index';
import { resolve } from 'path';

// =============================================================================
// Configuration
// =============================================================================

type Engine = 'react' | 'liquid' | 'handlebars' | 'twig' | 'latte';

const VALID_ENGINES: Engine[] = ['react', 'liquid', 'handlebars', 'twig', 'latte'];

interface EngineConfig {
  engine: Engine;
  sourceDirs: string[];
  outputDir: string;
  include: string[];
  exclude: string[];
  verbose: boolean;
  passthroughComponents: string[];
}

/**
 * @ui8kit/core component names — preserved as-is in generated templates.
 * These are UI primitives that remain as React component references.
 */
const CORE_COMPONENTS = [
  // Layout
  'Block', 'Container', 'Stack', 'Group', 'Box',
  // Typography
  'Title', 'Text',
  // Interactive
  'Button', 'Badge',
  // Media
  'Image', 'Icon',
  // Composite
  'Grid', 'Card', 'CardHeader', 'CardTitle', 'CardDescription',
  'CardContent', 'CardFooter', 'Sheet',
  'Accordion', 'AccordionItem', 'AccordionTrigger', 'AccordionContent',
];

const config: EngineConfig = {
  engine: 'react',
  sourceDirs: [
    // DSL blocks from shared library
    '../../packages/blocks/src/blocks',
    // Engine-specific layouts, partials, pages
    './src/layouts',
    './src/partials',
    './src/pages',
  ],
  outputDir: './dist',
  include: ['**/*.tsx'],
  exclude: ['**/*.test.tsx', '**/*.test.ts', '**/*.meta.ts', '**/index.ts'],
  verbose: true,
  passthroughComponents: CORE_COMPONENTS,
};

// =============================================================================
// CLI Argument Parsing
// =============================================================================

function parseArgs(): { engine?: string } {
  const args = process.argv.slice(2);
  let engine: string | undefined;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--engine' || args[i] === '-e') {
      engine = args[i + 1];
      i++;
    }
  }

  return { engine };
}

const { engine: engineArg } = parseArgs();

if (engineArg) {
  if (!VALID_ENGINES.includes(engineArg as Engine)) {
    console.error(`Invalid engine: ${engineArg}`);
    console.error(`Valid engines: ${VALID_ENGINES.join(', ')}`);
    process.exit(1);
  }
  config.engine = engineArg as Engine;
}

// =============================================================================
// Main Execution
// =============================================================================

async function main() {
  const appRoot = resolve(import.meta.dirname ?? process.cwd());
  const engineOutputDir = resolve(appRoot, config.outputDir, config.engine);

  console.log('');
  console.log('  UI8Kit Engine — Template Generator');
  console.log('  ─────────────────────────────────');
  console.log(`  Engine:  ${config.engine}`);
  console.log(`  Output:  ${engineOutputDir.replace(appRoot, '.')}`);
  console.log(`  Sources: ${config.sourceDirs.length} directories`);
  console.log('');

  const logger = new Logger({ level: config.verbose ? 'debug' : 'info' });

  // Create and initialize template service
  const service = new TemplateService();

  await service.initialize({
    config: {},
    logger: logger as any,
    eventBus: {
      emit: () => {},
      on: () => () => {},
      once: () => () => {},
      off: () => {},
      removeAllListeners: () => {},
      listenerCount: () => 0,
    },
    registry: null as any,
  });

  // Execute template generation
  const result = await service.execute({
    sourceDirs: config.sourceDirs.map(dir => resolve(appRoot, dir)),
    outputDir: engineOutputDir,
    engine: config.engine,
    include: config.include,
    exclude: config.exclude,
    verbose: config.verbose,
    passthroughComponents: config.passthroughComponents,
  });

  // Dispose service
  await service.dispose();

  // ==========================================================================
  // Report
  // ==========================================================================

  console.log('  ─────────────────────────────────');

  if (result.files.length > 0) {
    console.log('  Generated:');
    for (const file of result.files) {
      const relativePath = file.output.replace(appRoot, '.').replace(/\\/g, '/');
      console.log(`    + ${file.componentName} → ${relativePath}`);

      if (config.verbose) {
        if (file.variables.length > 0) {
          console.log(`      vars: ${file.variables.join(', ')}`);
        }
        if (file.dependencies.length > 0) {
          console.log(`      deps: ${file.dependencies.join(', ')}`);
        }
      }
    }
  }

  if (result.warnings.length > 0) {
    console.log('');
    console.log('  Warnings:');
    for (const warning of result.warnings) {
      console.log(`    ! ${warning}`);
    }
  }

  if (result.errors.length > 0) {
    console.log('');
    console.log('  Errors:');
    for (const error of result.errors) {
      console.log(`    x ${error}`);
    }
  }

  console.log('');
  console.log('  ─────────────────────────────────');
  console.log(`  Components: ${result.componentsProcessed}`);
  console.log(`  Templates:  ${result.files.length}`);
  console.log(`  Duration:   ${result.duration}ms`);
  console.log(result.errors.length === 0 ? '  Status:     OK' : '  Status:     FAILED');
  console.log('');

  process.exit(result.errors.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('');
  console.error('  Generation failed:', err.message);
  if (config.verbose) {
    console.error(err.stack);
  }
  process.exit(1);
});
