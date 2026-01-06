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
  const { entryPath, routes = ['/'], outputDir, pureCss = false, verbose = false } = options;

  if (verbose) {
    console.log(`🔍 Generating CSS for routes: ${routes.join(', ')}`);
    console.log(`📍 Output directory: ${outputDir}`);
  }

  try {
    // Generate CSS for all specified routes
    const allApplyCss: string[] = [];
    const allPureCss: string[] = [];

    for (const routePath of routes) {
      if (verbose) {
        console.log(`\n📄 Processing route: ${routePath}`);
      }

      // 1. Use existing HTML snapshot for the route
      const snapshotPath = `packages/preprocessor/~snap/local/index.html`; // For now, use existing snapshot

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

  const options: PreprocessorOptions = {
    entryPath: './apps/local/src/main.tsx',
    routes,
    outputDir: './apps/local/dist',
    pureCss,
    verbose
  };

  preprocess(options);
}