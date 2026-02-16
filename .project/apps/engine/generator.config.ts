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
import {
  generateRegistry,
  resolveDomainItems,
  type RegistryConfig,
  type RegistrySourceDir,
} from '../../packages/generator/src/scripts';
import { resolve } from 'path';
import { writeFileSync, mkdirSync } from 'fs';

// =============================================================================
// Configuration
// =============================================================================

type Engine = 'react' | 'liquid' | 'handlebars' | 'twig' | 'latte';

const VALID_ENGINES: Engine[] = ['react', 'liquid', 'handlebars', 'twig', 'latte'];

/** Domains for per-domain dist output */
const DOMAINS = ['website', 'admin'] as const;

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
  { path: './src/blocks/admin', type: 'registry:route', target: 'views', include: ['**/*PageView.tsx'], pathTemplate: 'views/{{name}}.tsx' },
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
  console.log(`  Output:  ${engineOutputDir.replace(appRoot, '.')} (per domain)`);
  console.log('');

  const logger = new Logger({ level: config.verbose ? 'debug' : 'info' });

  // -------------------------------------------------------------------------
  // Step 1: Generate full registry (in memory)
  // -------------------------------------------------------------------------

  const registryConfig: RegistryConfig = {
    sourceDirs: REGISTRY_SOURCE_DIRS.map(({ path: p, type, target, include, exclude, pathTemplate }) => ({
      path: resolve(appRoot, p),
      type,
      target,
      ...(include && { include }),
      ...(exclude && { exclude }),
      ...(pathTemplate && { pathTemplate }),
    })),
    outputPath: resolve(engineOutputDir, '_temp', 'registry.json'),
    registryName: 'ui8kit',
    version: '0.1.0',
    excludeDependencies: ['@ui8kit/template'],
    write: false,
  };

  console.log('  Registry (step 1)');
  console.log('  ─────────────────────────────────');
  const fullRegistry = await generateRegistry(registryConfig);
  console.log(`  Full registry: ${fullRegistry.items.length} items`);
  console.log('');

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

  let totalFiles = 0;
  let totalErrors = 0;

  // -------------------------------------------------------------------------
  // Step 2: For each domain, resolve deps, write registry, generate templates
  // -------------------------------------------------------------------------

  for (const domain of DOMAINS) {
    const domainOutputDir = resolve(engineOutputDir, domain);
    const domainRegistryPath = resolve(domainOutputDir, 'registry.json');

    console.log(`  Domain: ${domain}`);
    console.log('  ─────────────────────────────────');

    const domainItems = await resolveDomainItems(fullRegistry, domain);
    console.log(`  Items:   ${domainItems.length}`);

    mkdirSync(domainOutputDir, { recursive: true });
    const domainRegistry = {
      ...fullRegistry,
      items: domainItems,
    };
    writeFileSync(domainRegistryPath, JSON.stringify(domainRegistry, null, 2) + '\n', 'utf-8');

    const result = await service.execute({
      registryPath: domainRegistryPath,
      outputDir: domainOutputDir,
      engine: config.engine,
      verbose: config.verbose,
      passthroughComponents: config.passthroughComponents,
      excludeDependencies: config.excludeDependencies,
    });

    totalFiles += result.files.length;
    totalErrors += result.errors.length;

    if (result.files.length > 0) {
      for (const file of result.files) {
        const relativePath = file.output.replace(appRoot, '.').replace(/\\/g, '/');
        console.log(`    + ${file.componentName} → ${relativePath}`);
      }
    }
    if (result.errors.length > 0) {
      for (const error of result.errors) console.log(`    x ${error}`);
    }
    console.log('');
  }

  await service.dispose();

  console.log('  Summary');
  console.log('  ─────────────────────────────────');
  console.log(`  Domains:   ${DOMAINS.length}`);
  console.log(`  Templates: ${totalFiles}`);
  console.log(totalErrors === 0 ? '  Status:     OK' : '  Status:     FAILED');
  console.log('');

  process.exit(totalErrors > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('');
  console.error('  Generation failed:', err.message);
  if (config.verbose) {
    console.error(err.stack);
  }
  process.exit(1);
});
