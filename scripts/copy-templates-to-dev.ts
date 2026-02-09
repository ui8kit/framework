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
const TARGET = join(REPO_ROOT, "apps", "dev", "src");

const SUBDIRS = ["blocks", "layouts", "partials", "routes"] as const;

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

  console.log("\nDone. registry.json was not copied (handle separately if needed).");
}

main();
