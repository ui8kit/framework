#!/usr/bin/env bun

/**
 * UI8Kit CSS Preprocessor
 *
 * Generates CSS by creating HTML snapshots of routes and converting them to styles:
 * - HTML snapshots using React static rendering
 * - Extracts classes from HTML using htmlToCss logic
 * - Generates @apply directives and pure CSS3 properties
 */

import { snapshotGenerator } from './snapshot-generator.js';
import { htmlConverter } from './html-converter.js';

interface PreprocessorOptions {
  /** Entry file path (e.g., apps/local/src/main.tsx) */
  entryPath: string;
  /** Routes to generate CSS for */
  routes?: string[];
  /** Directory containing HTML snapshots */
  snapshotsDir?: string;
  /** Output directory for CSS files */
  outputDir: string;
  /** Generate pure CSS3 in addition to @apply */
  pureCss?: boolean;
  /** Verbose logging */
  verbose?: boolean;
}

/**
 * Main preprocessor function - uses HTML snapshots approach
 */
export async function preprocess(options: PreprocessorOptions): Promise<void> {
  const { entryPath, routes = ['/'], snapshotsDir = 'packages/preprocessor/~snap/local', outputDir, pureCss = false, verbose = false } = options;

  if (verbose) {
    console.log(`🔍 Generating CSS for routes: ${routes.join(', ')}`);
    console.log(`📍 Output directory: ${outputDir}`);
    console.log(`📂 Snapshots directory: ${snapshotsDir}`);
  }

  try {
    // Generate CSS for all specified routes
    const allApplyCss: string[] = [];
    const allPureCss: string[] = [];

    for (const routePath of routes) {
      if (verbose) {
        console.log(`\n📄 Processing route: ${routePath}`);
      }

      // 1. Find HTML snapshot for the route
      const snapshotPath = getSnapshotPath(routePath, snapshotsDir);

      // 2. Convert HTML to CSS
      const { applyCss, pureCss: routePureCss } = await htmlConverter.convertHtmlToCss(
        snapshotPath,
        `${outputDir}/tailwind.apply.css`,
        pureCss ? `${outputDir}/ui8kit.local.css` : `${outputDir}/tailwind.apply.css`,
        { verbose }
      );

      allApplyCss.push(applyCss);
      if (pureCss) {
        allPureCss.push(routePureCss);
      }
    }

    // 3. Merge CSS from all routes and write output files
    const finalApplyCss = mergeCssFiles(allApplyCss);
    await Bun.write(`${outputDir}/tailwind.apply.css`, finalApplyCss);

    if (verbose) {
      console.log(`✅ Generated ${outputDir}/tailwind.apply.css (${finalApplyCss.length} bytes)`);
    }

    if (pureCss) {
      const finalPureCss = mergeCssFiles(allPureCss);
      await Bun.write(`${outputDir}/ui8kit.local.css`, finalPureCss);

      if (verbose) {
        console.log(`✅ Generated ${outputDir}/ui8kit.local.css (${finalPureCss.length} bytes)`);
      }
    }

  } catch (error) {
    console.error('❌ Preprocessing failed:', error);
    process.exit(1);
  }
}

/**
 * Get snapshot file path for a route
 */
function getSnapshotPath(routePath: string, snapshotsDir: string): string {
  // Normalize route path for filesystem (remove leading slash, handle root)
  const normalizedPath = routePath === '/' ? 'index' : routePath.slice(1);
  return `${snapshotsDir}/${normalizedPath}.html`;
}

/**
 * Merge multiple CSS files, removing duplicate rules
 */
function mergeCssFiles(cssFiles: string[]): string {
  if (cssFiles.length === 1) return cssFiles[0];

  // For now, just concatenate with headers
  // In a full implementation, we'd deduplicate rules
  const merged = cssFiles.join('\n\n/* === Next Route === */\n\n');

  // Update timestamp in header
  return merged.replace(/Generated on: .*/, `Generated on: ${new Date().toISOString()}`);
}

/**
 * CLI entry point
 */
if (typeof process !== 'undefined' && process.argv[1]?.endsWith('index.ts')) {
  const args = process.argv.slice(2);
  const verbose = args.includes('--verbose');
  const pureCss = args.includes('--pure-css');

  // Check for routes argument: --routes /,/about,/dashboard
  const routesIndex = args.indexOf('--routes');
  const routesArg = routesIndex !== -1 ? args[routesIndex + 1] : '/';
  const routes = routesArg.split(',').map(r => r.trim());

  // Check for snapshots directory: --snapshots-dir ./apps/local/snapshots
  const snapshotsIndex = args.indexOf('--snapshots-dir');
  const snapshotsDir = snapshotsIndex !== -1 ? args[snapshotsIndex + 1] : 'packages/preprocessor/~snap/local';

  const options: PreprocessorOptions = {
    entryPath: './apps/local/src/main.tsx',
    routes,
    snapshotsDir,
    outputDir: './apps/local/dist',
    pureCss,
    verbose
  };

  preprocess(options);
}