#!/usr/bin/env bun

/**
 * UI8Kit CSS Preprocessor
 *
 * Generates both tailwind.apply.css and ui8kit.{app}.css by analyzing components:
 * - data-class attributes as CSS selectors
 * - utility props as @apply directives (tailwind.apply.css)
 * - utility props as pure CSS3 properties (ui8kit.{app}.css)
 */

import { parseComponents } from './parser.js';
import { generateCSS } from './generator.js';
import { generatePureCSS } from './pure-css-generator.js';
import { generateCriticalCSS } from './critical-css-generator.js';
import { watchFiles } from './watcher.js';

interface PreprocessorOptions {
  /** Source directory containing components */
  srcDir: string;
  /** Output CSS file path for @apply directives */
  outputFile: string;
  /** Output CSS file path for pure CSS3 */
  pureCssFile?: string;
  /** Route file to generate critical CSS for */
  criticalRouteFile?: string;
  /** Output file for critical CSS */
  criticalCssFile?: string;
  /** Watch mode for development */
  watch?: boolean;
  /** Verbose logging */
  verbose?: boolean;
}

/**
 * Main preprocessor function
 */
export async function preprocess(options: PreprocessorOptions): Promise<void> {
  const { srcDir, outputFile, pureCssFile, watch = false, verbose = false } = options;

  if (verbose) {
    console.log(`🔍 Analyzing components in: ${srcDir}`);
  }

  try {
    // Parse components and extract data-class + props
    const components = await parseComponents(srcDir, { verbose });

    // Generate CSS with @apply directives
    const css = generateCSS(components);

    // Write @apply CSS output file
    await Bun.write(outputFile, css);

    if (verbose) {
      console.log(`✅ Generated ${outputFile} (${css.length} bytes)`);
      console.log(`📊 Found ${components.length} component styles`);
    }

    // Generate pure CSS3 if requested
    if (pureCssFile) {
      const pureCss = await generatePureCSS(outputFile, { verbose });
      await Bun.write(pureCssFile, pureCss);

      if (verbose) {
        console.log(`✅ Generated ${pureCssFile} (${pureCss.length} bytes)`);
      }
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
  const pureCss = args.includes('--pure-css');

  const appName = 'local'; // Could be extracted from path or args

  const options: PreprocessorOptions = {
    srcDir: './apps/local/src',
    outputFile: './apps/local/dist/tailwind.apply.css',
    pureCssFile: pureCss ? `./apps/local/dist/ui8kit.${appName}.css` : undefined,
    watch,
    verbose
  };

  preprocess(options);
}
