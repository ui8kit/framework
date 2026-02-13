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

import { TemplateService } from '../../packages/generator/src/services/template/TemplateService';
import { Logger } from '../../packages/generator/src/core';
import { getFallbackCoreComponents } from '../../packages/generator/src/core/scanner/core-component-scanner';
import { generateRegistry, type RegistryConfig, type RegistrySourceDir } from '../../packages/generator/src/scripts';
import { resolve } from 'path';

// =============================================================================
// Configuration
// =============================================================================

type Engine = 'react' | 'liquid' | 'handlebars' | 'twig' | 'latte';

const VALID_ENGINES: Engine[] = ['react', 'liquid', 'handlebars', 'twig', 'latte'];

/**
 * Auto-load passthrough components from @ui8kit/core
 * Falls back to hardcoded list if import fails
 */
const PASSTHROUGH_COMPONENTS = getFallbackCoreComponents();

/** Single source of truth for registry (and thus template) sources. Paths relative to app root. */
const REGISTRY_SOURCE_DIRS: RegistrySourceDir[] = [
  { path: './src/blocks', type: 'registry:block', target: 'blocks', exclude: ['**/*PageView.tsx'] },
  { path: '../../packages/blocks/src/blocks', type: 'registry:block', target: 'blocks' },
  { path: './src/layouts/views', type: 'registry:layout', target: 'layouts' },
  { path: './src/partials', type: 'registry:partial', target: 'partials' },
  { path: './src/blocks/website', type: 'registry:route', target: 'views', include: ['**/*PageView.tsx'], pathTemplate: 'views/{{name}}.tsx' },
  { path: './src/blocks/docs', type: 'registry:route', target: 'views', include: ['**/*PageView.tsx'], pathTemplate: 'views/{{name}}.tsx' },
  { path: './src/blocks/examples', type: 'registry:route', target: 'views', include: ['**/*PageView.tsx'], pathTemplate: 'views/{{name}}.tsx' },
  { path: './src/blocks/dashboard', type: 'registry:route', target: 'views', include: ['**/*PageView.tsx'], pathTemplate: 'views/{{name}}.tsx' },
];

interface EngineConfig {
  engine: Engine;
  outputDir: string;
  include: string[];
  exclude: string[];
  verbose: boolean;
  passthroughComponents: string[];
  /** Exclude these modules from generated template imports (e.g. @ui8kit/template) */
  excludeDependencies: string[];
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
  outputDir: './dist',
  include: ['**/*.tsx'],
  exclude: ['**/*.test.tsx', '**/*.test.ts', '**/*.meta.ts', '**/index.ts'],
  verbose: true,
  passthroughComponents: [...PASSTHROUGH_COMPONENTS, 'Link'],
  excludeDependencies: ['@ui8kit/template'],
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
  console.log(`  Pipeline:  registry → ${engineOutputDir.replace(appRoot, '.')}`);
  console.log('');

  const logger = new Logger({ level: config.verbose ? 'debug' : 'info' });

  // -------------------------------------------------------------------------
  // Step 1: Generate registry into dist/react (single source of truth)
  // -------------------------------------------------------------------------

  const registryPath = resolve(engineOutputDir, 'registry.json');
  const registryConfig: RegistryConfig = {
    sourceDirs: REGISTRY_SOURCE_DIRS.map(({ path: p, type, target, include, exclude, pathTemplate }) => ({
      path: resolve(appRoot, p),
      type,
      target,
      ...(include && { include }),
      ...(exclude && { exclude }),
      ...(pathTemplate && { pathTemplate }),
    })),
    outputPath: registryPath,
    registryName: 'ui8kit',
    version: '0.1.0',
    excludeDependencies: ['@ui8kit/template'],
  };

  console.log('  Registry (step 1)');
  console.log('  ─────────────────────────────────');
  const registry = await generateRegistry(registryConfig);
  console.log(`  Items:   ${registry.items.length}`);
  for (const item of registry.items) {
    console.log(`    ${item.type.replace('registry:', '')}  ${item.name}`);
  }
  console.log(`  Output:  ${registryPath.replace(appRoot, '.')}`);
  console.log('');

  // -------------------------------------------------------------------------
  // Step 2: Generate templates from registry (path = dist/react/{item.files[0].path})
  // -------------------------------------------------------------------------

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

  const result = await service.execute({
    registryPath,
    outputDir: engineOutputDir,
    engine: config.engine,
    verbose: config.verbose,
    passthroughComponents: config.passthroughComponents,
    excludeDependencies: config.excludeDependencies,
  });

  await service.dispose();

  console.log('  Templates (step 2)');
  console.log('  ─────────────────────────────────');
  if (result.files.length > 0) {
    for (const file of result.files) {
      const relativePath = file.output.replace(appRoot, '.').replace(/\\/g, '/');
      console.log(`    + ${file.componentName} → ${relativePath}`);
      if (config.verbose) {
        if (file.variables.length > 0) console.log(`      vars: ${file.variables.join(', ')}`);
        if (file.dependencies.length > 0) console.log(`      deps: ${file.dependencies.join(', ')}`);
      }
    }
  }
  if (result.warnings.length > 0) {
    console.log('');
    for (const warning of result.warnings) console.log(`    ! ${warning}`);
  }
  if (result.errors.length > 0) {
    console.log('');
    for (const error of result.errors) console.log(`    x ${error}`);
  }
  console.log('');
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
