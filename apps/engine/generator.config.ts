#!/usr/bin/env bun

/**
 * Templetor Generator Configuration
 *
 * Test application for DSL-based template generation.
 * Minimal config focused on testing DSL → Template conversion.
 */

import { TemplateService, Logger } from '../../packages/generator/src/index';
import { resolve } from 'path';

// =============================================================================
// Configuration
// =============================================================================

type Engine = 'liquid' | 'handlebars' | 'twig' | 'latte';

interface TempletorConfig {
  engine: Engine;
  sourceDirs: string[];
  outputDir: string;
  include: string[];
  exclude: string[];
  verbose: boolean;
}

const config: TempletorConfig = {
  engine: 'handlebars',
  sourceDirs: ['../../packages/blocks/src'],
  outputDir: './dist/templates',
  include: ['**/*.tsx'],
  exclude: ['**/*.test.tsx', '**/*.meta.ts', '**/index.ts'],
  verbose: true,
};

// =============================================================================
// CLI Parsing
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
  if (!['liquid', 'handlebars', 'twig', 'latte'].includes(engineArg)) {
    console.error(`Invalid engine: ${engineArg}`);
    console.error('Valid engines: liquid, handlebars, twig, latte');
    process.exit(1);
  }
  config.engine = engineArg as Engine;
}

// =============================================================================
// Main Execution
// =============================================================================

async function main() {
  console.log('🚀 Templetor - Template Generator Demo');
  console.log(`📝 Engine: ${config.engine}`);
  console.log('');

  const appRoot = process.cwd();
  const logger = new Logger('info');

  // Create template service
  const service = new TemplateService();

  // Initialize service
  await service.initialize({
    appRoot,
    outputDir: resolve(appRoot, config.outputDir),
    logger,
    config: {},
  });

  // Execute template generation
  const result = await service.execute({
    sourceDirs: config.sourceDirs.map(dir => resolve(appRoot, dir)),
    outputDir: resolve(appRoot, config.outputDir),
    engine: config.engine,
    include: config.include,
    exclude: config.exclude,
    verbose: config.verbose,
  });

  // Report results
  console.log('');
  console.log('Generated files:');
  for (const file of result.files) {
    console.log(`  ✓ ${file.componentName} → ${file.output.replace(appRoot, '.')}`);
    
    if (config.verbose) {
      console.log(`    Variables: ${file.variables.join(', ') || 'none'}`);
      console.log(`    Dependencies: ${file.dependencies.join(', ') || 'none'}`);
    }
  }

  if (result.warnings.length > 0) {
    console.log('');
    console.log('⚠️  Warnings:');
    for (const warning of result.warnings) {
      console.log(`  - ${warning}`);
    }
  }

  if (result.errors.length > 0) {
    console.log('');
    console.log('❌ Errors:');
    for (const error of result.errors) {
      console.log(`  - ${error}`);
    }
  }

  console.log('');
  console.log('✅ Generation complete!');
  console.log(`   Components: ${result.componentsProcessed}`);
  console.log(`   Templates: ${result.files.length}`);
  console.log(`   Duration: ${result.duration}ms`);
}

main().catch((err) => {
  console.error('❌ Generation failed:', err.message);
  console.error(err.stack);
  process.exit(1);
});
