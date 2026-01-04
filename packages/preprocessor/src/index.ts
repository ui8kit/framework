#!/usr/bin/env bun

/**
 * UI8Kit CSS Preprocessor
 *
 * Generates tailwind.apply.css by analyzing components and extracting:
 * - data-class attributes as CSS selectors
 * - utility props as @apply directives
 * - component defaultProps as base styles
 */

import { parseComponents } from './parser.js';
import { generateCSS } from './generator.js';
import { watchFiles } from './watcher.js';

interface PreprocessorOptions {
  /** Source directory containing components */
  srcDir: string;
  /** Output CSS file path */
  outputFile: string;
  /** Watch mode for development */
  watch?: boolean;
  /** Verbose logging */
  verbose?: boolean;
}

/**
 * Main preprocessor function
 */
export async function preprocess(options: PreprocessorOptions): Promise<void> {
  const { srcDir, outputFile, watch = false, verbose = false } = options;

  if (verbose) {
    console.log(`🔍 Analyzing components in: ${srcDir}`);
  }

  try {
    // Parse components and extract data-class + props
    const components = await parseComponents(srcDir, { verbose });

    // Generate CSS with @apply directives
    const css = generateCSS(components);

    // Write output file
    await Bun.write(outputFile, css);

    if (verbose) {
      console.log(`✅ Generated ${outputFile} (${css.length} bytes)`);
      console.log(`📊 Found ${components.length} component styles`);
    }

    // Start watcher if requested
    if (watch) {
      console.log(`👀 Watching for changes in ${srcDir}...`);
      watchFiles(srcDir, () => preprocess(options), { verbose });
    }

  } catch (error) {
    console.error('❌ Preprocessing failed:', error);
    process.exit(1);
  }
}

/**
 * CLI entry point
 */
if (import.meta.main) {
  const args = process.argv.slice(2);
  const watch = args.includes('--watch');
  const verbose = args.includes('--verbose');

  const options: PreprocessorOptions = {
    srcDir: './apps/local/src',
    outputFile: './apps/local/dist/tailwind.apply.css',
    watch,
    verbose
  };

  preprocess(options);
}
