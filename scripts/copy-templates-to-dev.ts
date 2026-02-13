#!/usr/bin/env bun
/**
 * Copy generated templates from apps/engine/dist/react/{domain} to apps/{target}/src.
 * Per-domain dist: SOURCE = dist/react/{domain}/. For dev/test, defaults to website.
 *
 * - Copies: blocks/, layouts/, partials/, routes/ (only .tsx and other non-registry files).
 * - Skips: registry.json (handled separately; not copied into src).
 * - Skips: any file named index.ts or index.tsx (do not overwrite dev’s index files).
 *
 * Run from repo root:
 *   bun run scripts/copy-templates-to-dev.ts              # apps/dev from website
 *   bun run scripts/copy-templates-to-dev.ts -- test       # apps/test from website
 *   TARGET_APP=website bun run scripts/copy-templates-to-dev.ts
 *   TARGET_APP=docs bun run scripts/copy-templates-to-dev.ts
 */

import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { join, relative, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const DIST_REACT = join(REPO_ROOT, "apps", "engine", "dist", "react");
const ENGINE_SRC = join(REPO_ROOT, "apps", "engine", "src");

const DOMAINS = ["website", "docs", "examples", "dashboard"] as const;

/** Routes and layouts to copy per domain (domain-specific app) */
const DOMAIN_ROUTES: Record<string, string[]> = {
  website: ["WebsitePage"],
  docs: ["DocsPage", "DocsComponentsPage", "DocsInstallationPage"],
  dashboard: ["DashboardPage"],
  examples: ["ExamplesPage", "ExamplesDashboardPage", "ExamplesTasksPage", "ExamplesPlaygroundPage", "ExamplesAuthPage"],
};
const DOMAIN_LAYOUTS: Record<string, string[]> = {
  website: ["MainLayout"],
  docs: ["DashLayout"],
  dashboard: ["DashLayout"],
  examples: ["ExamplesLayout"],
};

function getTargetApp(): string {
  const env = process.env.TARGET_APP;
  if (env) return env;
  const idx = process.argv.indexOf("--");
  if (idx >= 0 && process.argv[idx + 1]) return process.argv[idx + 1];
  return "dev";
}

function getSourceDir(targetApp: string): string {
  const domainOverride = process.env.DOMAIN;
  if (domainOverride && DOMAINS.includes(domainOverride as (typeof DOMAINS)[number])) {
    return join(DIST_REACT, domainOverride);
  }
  if (DOMAINS.includes(targetApp as (typeof DOMAINS)[number])) {
    return join(DIST_REACT, targetApp);
  }
  return join(DIST_REACT, "website");
}

const TARGET_APP = getTargetApp();
const SOURCE = getSourceDir(TARGET_APP);
const TARGET = join(REPO_ROOT, "apps", TARGET_APP, "src");

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
  const domainUsed = SOURCE.endsWith("website")
    ? "website"
    : SOURCE.split(/[/\\]/).pop() ?? "website";
  console.log(`Copy engine/dist/react/${domainUsed} → apps/${TARGET_APP}/src`);
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
  const registryPath = join(SOURCE, "registry.json");
  let pageViewToDomain: Record<string, string> = {};
  if (existsSync(registryPath)) {
    const registry = JSON.parse(readFileSync(registryPath, "utf-8"));
    const routeItems = (registry.items || []).filter(
      (i: { type: string; name: string; domain?: string }) =>
        i.type === "registry:route" && i.domain
    );
    pageViewToDomain = Object.fromEntries(
      routeItems.map((i: { name: string; domain: string }) => [i.name, i.domain])
    );
  } else {
    console.warn("  ! registry.json not found; skipping PageView copy");
  }
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

  // Copy domain-specific routes and layouts from engine/src
  const routesToCopy = DOMAIN_ROUTES[domainUsed] ?? DOMAIN_ROUTES.website;
  const layoutsToCopy = DOMAIN_LAYOUTS[domainUsed] ?? DOMAIN_LAYOUTS.website;

  for (const name of routesToCopy) {
    const srcPath = join(ENGINE_SRC, "routes", `${name}.tsx`);
    if (existsSync(srcPath)) {
      mkdirSync(join(TARGET, "routes"), { recursive: true });
      copyFileSync(srcPath, join(TARGET, "routes", `${name}.tsx`));
      console.log(`  + ${relative(REPO_ROOT, join(TARGET, "routes", `${name}.tsx`))} (route)`);
    }
  }
  for (const name of layoutsToCopy) {
    const srcPath = join(ENGINE_SRC, "layouts", `${name}.tsx`);
    if (existsSync(srcPath)) {
      mkdirSync(join(TARGET, "layouts"), { recursive: true });
      copyFileSync(srcPath, join(TARGET, "layouts", `${name}.tsx`));
      console.log(`  + ${relative(REPO_ROOT, join(TARGET, "layouts", `${name}.tsx`))} (layout)`);
    }
  }

  // Copy App.{domain}.tsx as App.tsx
  const appSrc = join(ENGINE_SRC, `App.${domainUsed}.tsx`);
  const appFallback = join(ENGINE_SRC, "App.tsx");
  if (existsSync(appSrc)) {
    copyFileSync(appSrc, join(TARGET, "App.tsx"));
    console.log(`  + ${relative(REPO_ROOT, join(TARGET, "App.tsx"))} (app)`);
  } else if (existsSync(appFallback)) {
    copyFileSync(appFallback, join(TARGET, "App.tsx"));
    console.log(`  + ${relative(REPO_ROOT, join(TARGET, "App.tsx"))} (app fallback)`);
  }

  // Copy index files: generate domain-specific layouts and routes index
  const layoutsIndexContent = layoutsToCopy
    .map((n) => `export { ${n} } from './${n}';`)
    .join("\n");
  mkdirSync(join(TARGET, "layouts"), { recursive: true });
  writeFileSync(join(TARGET, "layouts", "index.ts"), layoutsIndexContent + "\n", "utf-8");
  console.log(`  + ${relative(REPO_ROOT, join(TARGET, "layouts", "index.ts"))} (layouts index)`);

  const routesIndexContent = routesToCopy
    .map((n) => `export { ${n} } from './${n}';`)
    .join("\n");
  mkdirSync(join(TARGET, "routes"), { recursive: true });
  writeFileSync(join(TARGET, "routes", "index.ts"), routesIndexContent + "\n", "utf-8");
  console.log(`  + ${relative(REPO_ROOT, join(TARGET, "routes", "index.ts"))} (routes index)`);

  const partialsIndexSrc = join(ENGINE_SRC, "partials", "index.ts");
  if (existsSync(partialsIndexSrc)) {
    mkdirSync(join(TARGET, "partials"), { recursive: true });
    copyFileSync(partialsIndexSrc, join(TARGET, "partials", "index.ts"));
    console.log(`  + ${relative(REPO_ROOT, join(TARGET, "partials", "index.ts"))} (partials index)`);
  }

  // Copy blocks type files when examples domain is used
  if (domainUsed === "examples") {
    const blocksTypesSrc = join(ENGINE_SRC, "blocks", "examples", "types.ts");
    if (existsSync(blocksTypesSrc)) {
      const destPath = join(TARGET, "blocks", "examples", "types.ts");
      mkdirSync(join(TARGET, "blocks", "examples"), { recursive: true });
      copyFileSync(blocksTypesSrc, destPath);
      console.log(`  + ${relative(REPO_ROOT, destPath)} (types)`);
    }
  }

  // Copy blocks index: export root blocks (from dist) + domain
  mkdirSync(join(TARGET, "blocks"), { recursive: true });
  const blocksTargetDir = join(TARGET, "blocks");
  const rootBlockExports: string[] = [];
  if (existsSync(blocksTargetDir)) {
    const entries = readdirSync(blocksTargetDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith(".tsx")) {
        const name = entry.name.replace(".tsx", "");
        rootBlockExports.push(`export { ${name} } from './${name}';`);
      }
    }
  }
  const domainIndexSrc = join(ENGINE_SRC, "blocks", domainUsed, "index.ts");
  if (existsSync(domainIndexSrc)) {
    mkdirSync(join(TARGET, "blocks", domainUsed), { recursive: true });
    copyFileSync(domainIndexSrc, join(TARGET, "blocks", domainUsed, "index.ts"));
    console.log(`  + ${relative(REPO_ROOT, join(TARGET, "blocks", domainUsed, "index.ts"))} (${domainUsed} index)`);
    rootBlockExports.push(`export * from './${domainUsed}';`);
  }
  const blocksIndexContent = rootBlockExports.join("\n") + "\n";
  writeFileSync(join(TARGET, "blocks", "index.ts"), blocksIndexContent, "utf-8");
  console.log(`  + ${relative(REPO_ROOT, join(TARGET, "blocks", "index.ts"))} (blocks index)`);

  console.log("\nDone. registry.json was not copied (handle separately if needed).");
}

main();
