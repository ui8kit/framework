#!/usr/bin/env bun
/**
 * Copy generated templates from apps/engine/dist/react to apps/dev/src.
 * Uses Node-style fs/path so it works the same on Windows and Unix.
 *
 * - Copies: blocks/, layouts/, partials/, routes/ (only .tsx and other non-registry files).
 * - Skips: registry.json (handled separately; not copied into src).
 * - Skips: any file named index.ts or index.tsx (do not overwrite dev’s index files).
 *
 * Run from repo root:
 *   bun run scripts/copy-templates-to-dev.ts
 */

import { copyFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { join, relative } from "path";

const REPO_ROOT = join(import.meta.dir, "..");
const SOURCE = join(REPO_ROOT, "apps", "engine", "dist", "react");
const ENGINE_SRC = join(REPO_ROOT, "apps", "engine", "src");
const TARGET = join(REPO_ROOT, "apps", "dev", "src");

/** From dist: blocks, partials (layouts/routes come from engine/src containers) */
const SUBDIRS = ["blocks", "partials"] as const;

const LAYOUT_VIEW_SUFFIX = "LayoutView.tsx";
const ROUTE_VIEW_SUFFIX = "PageView.tsx";

function shouldSkipFile(name: string): boolean {
  if (name === "registry.json") return true;
  if (name === "index.ts" || name === "index.tsx") return true;
  return false;
}

function copyDir(sourceDir: string, targetDir: string): void {
  if (!existsSync(sourceDir)) {
    console.warn(`  Skip (missing): ${relative(REPO_ROOT, sourceDir)}`);
    return;
  }
  mkdirSync(targetDir, { recursive: true });
  const entries = readdirSync(sourceDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = join(sourceDir, entry.name);
    const destPath = join(targetDir, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (entry.isFile() && !shouldSkipFile(entry.name)) {
      copyFileSync(srcPath, destPath);
      console.log(`  + ${relative(REPO_ROOT, destPath)}`);
    }
  }
}

function main(): void {
  console.log("Copy engine/dist/react → apps/dev/src");
  console.log("  Source:", relative(REPO_ROOT, SOURCE));
  console.log("  Target:", relative(REPO_ROOT, TARGET));
  console.log("  Skip: registry.json, index.ts, index.tsx\n");

  if (!existsSync(SOURCE)) {
    console.error("Source directory not found. Run: cd apps/engine && bun run generate");
    process.exit(1);
  }

  for (const subdir of SUBDIRS) {
    const src = join(SOURCE, subdir);
    const dest = join(TARGET, subdir);
    if (!existsSync(src)) continue;
    copyDir(src, dest);
  }

  // Copy generated views: *LayoutView -> layouts/views/, *PageView -> blocks/{domain}/
  const viewsDir = join(SOURCE, "views");
  const pageViewToDomain: Record<string, string> = {
    WebsitePageView: "website",
    DashboardPageView: "dashboard",
    DocsPageView: "docs",
    DocsInstallationPageView: "docs",
    DocsComponentsPageView: "docs",
    ExamplesPageView: "examples",
    ExamplesDashboardPageView: "examples",
    ExamplesTasksPageView: "examples",
    ExamplesPlaygroundPageView: "examples",
    ExamplesAuthPageView: "examples",
  };
  if (existsSync(viewsDir)) {
    const layoutViewsDir = join(TARGET, "layouts", "views");
    mkdirSync(layoutViewsDir, { recursive: true });
    const entries = readdirSync(viewsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith(".tsx") && !shouldSkipFile(entry.name)) {
        const srcPath = join(viewsDir, entry.name);
        if (entry.name.endsWith(LAYOUT_VIEW_SUFFIX)) {
          const destPath = join(layoutViewsDir, entry.name);
          copyFileSync(srcPath, destPath);
          console.log(`  + ${relative(REPO_ROOT, destPath)} (layout view)`);
        } else if (entry.name.endsWith(ROUTE_VIEW_SUFFIX)) {
          const baseName = entry.name.replace(".tsx", "");
          const domain = pageViewToDomain[baseName];
          if (domain) {
            const destDir = join(TARGET, "blocks", domain);
            mkdirSync(destDir, { recursive: true });
            const destPath = join(destDir, entry.name);
            copyFileSync(srcPath, destPath);
            console.log(`  + ${relative(REPO_ROOT, destPath)} (page view)`);
          }
        }
      }
    }
  }

  // Copy non-generated files from engine/src (containers + type files)
  const containerDirs = ["layouts", "routes"] as const;
  for (const subdir of containerDirs) {
    const srcDir = join(ENGINE_SRC, subdir);
    const destDir = join(TARGET, subdir);
    if (!existsSync(srcDir)) continue;
    mkdirSync(destDir, { recursive: true });
    const entries = readdirSync(srcDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith(".tsx") && !shouldSkipFile(entry.name)) {
        const srcPath = join(srcDir, entry.name);
        const destPath = join(destDir, entry.name);
        copyFileSync(srcPath, destPath);
        console.log(`  + ${relative(REPO_ROOT, destPath)} (container)`);
      }
    }
  }

  // Copy blocks type files (e.g. examples/types.ts) — not generated
  const blocksTypesSrc = join(ENGINE_SRC, "blocks", "examples", "types.ts");
  if (existsSync(blocksTypesSrc)) {
    const destPath = join(TARGET, "blocks", "examples", "types.ts");
    mkdirSync(join(TARGET, "blocks", "examples"), { recursive: true });
    copyFileSync(blocksTypesSrc, destPath);
    console.log(`  + ${relative(REPO_ROOT, destPath)} (types)`);
  }

  // Copy blocks index files from engine (exports for website, dashboard, docs, examples)
  const blocksIndexSrc = join(ENGINE_SRC, "blocks", "index.ts");
  if (existsSync(blocksIndexSrc)) {
    copyFileSync(blocksIndexSrc, join(TARGET, "blocks", "index.ts"));
    console.log(`  + ${relative(REPO_ROOT, join(TARGET, "blocks", "index.ts"))} (blocks index)`);
  }
  for (const domain of ["website", "dashboard", "docs", "examples"]) {
    const domainIndex = join(ENGINE_SRC, "blocks", domain, "index.ts");
    if (existsSync(domainIndex)) {
      mkdirSync(join(TARGET, "blocks", domain), { recursive: true });
      copyFileSync(domainIndex, join(TARGET, "blocks", domain, "index.ts"));
      console.log(`  + ${relative(REPO_ROOT, join(TARGET, "blocks", domain, "index.ts"))} (${domain} index)`);
    }
  }

  console.log("\nDone. registry.json was not copied (handle separately if needed).");
}

main();
