#!/usr/bin/env bun
/**
 * Sync generated templates from apps/engine/dist/react/{domain} to apps/{target}/src.
 * Source of truth: dist + page model + registry metadata.
 * No runtime template files are copied from apps/engine/src.
 *
 * Run from repo root:
 *   bun run scripts/copy-templates-to-dev.ts
 *   bun run scripts/copy-templates-to-dev.ts --target test --domain website
 *   TARGET_APP=dev DOMAIN=website bun run scripts/copy-templates-to-dev.ts
 */

import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { join, relative, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const DIST_REACT = join(REPO_ROOT, "apps", "engine", "dist", "react");
const PAGE_MODEL_PATH = join(REPO_ROOT, "packages", "data", "src", "fixtures", "shared", "page.json");

const DOMAINS = ["website"] as const;
type Domain = (typeof DOMAINS)[number];

interface PageEntry {
  id: string;
  domain: Domain;
  title: string;
  path: string;
  layout?: string;
  component?: string;
  parentId?: string;
}

interface PageModel {
  page: Record<Domain, PageEntry[]>;
}

interface RegistryItem {
  type: string;
  name: string;
  domain?: string;
}

const LAYOUT_VIEW_SUFFIX = "LayoutView.tsx";
const ROUTE_VIEW_SUFFIX = "PageView.tsx";

function parseArg(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx >= 0 && process.argv[idx + 1]) return process.argv[idx + 1];
  return undefined;
}

function resolveTargetAndDomain(): { targetApp: string; domain: Domain } {
  const targetFromArg = parseArg("--target");
  const domainFromArg = parseArg("--domain");

  const targetApp = targetFromArg ?? process.env.TARGET_APP ?? "dev";
  const domainEnv = domainFromArg ?? process.env.DOMAIN;

  if (domainEnv && DOMAINS.includes(domainEnv as Domain)) {
    return { targetApp, domain: domainEnv as Domain };
  }
  if (DOMAINS.includes(targetApp as Domain)) {
    return { targetApp, domain: targetApp as Domain };
  }
  return { targetApp, domain: "website" };
}

function relativePath(path: string): string {
  return relative(REPO_ROOT, path).replace(/\\/g, "/");
}

function shouldSkipFile(name: string): boolean {
  if (name === "registry.json") return true;
  if (name === "index.ts" || name === "index.tsx") return true;
  return false;
}

function copyDir(sourceDir: string, targetDir: string): void {
  if (!existsSync(sourceDir)) {
    console.warn(`  Skip (missing): ${relativePath(sourceDir)}`);
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
      console.log(`  + ${relativePath(destPath)}`);
    }
  }
}

function cleanManagedDirs(target: string): void {
  const managed = ["blocks", "partials", "layouts", "routes"];
  for (const dir of managed) {
    const full = join(target, dir);
    if (existsSync(full)) {
      rmSync(full, { recursive: true, force: true });
      console.log(`  - ${relativePath(full)} (clean)`);
    }
  }
}

function readPageModel(): PageModel {
  return JSON.parse(readFileSync(PAGE_MODEL_PATH, "utf-8")) as PageModel;
}

function readRegistryRouteDomainMap(registryPath: string): Record<string, Domain> {
  if (!existsSync(registryPath)) return {};
  const registry = JSON.parse(readFileSync(registryPath, "utf-8")) as { items?: RegistryItem[] };
  const routeItems = (registry.items ?? []).filter(
    (item) => item.type === "registry:route" && item.domain && DOMAINS.includes(item.domain as Domain)
  );
  return Object.fromEntries(routeItems.map((item) => [item.name, item.domain as Domain]));
}

function writeFile(targetPath: string, content: string): void {
  mkdirSync(dirname(targetPath), { recursive: true });
  writeFileSync(targetPath, content, "utf-8");
  console.log(`  + ${relativePath(targetPath)}`);
}

function createMainOrDashLayout(name: "MainLayout" | "DashLayout"): string {
  const viewName = `${name}View`;
  const propsType = `${name}Props`;
  return `import type { ComponentProps } from 'react';
import { ${viewName} } from './views/${viewName}';

export type ${propsType} = ComponentProps<typeof ${viewName}>;

export function ${name}(props: ${propsType}) {
  return <${viewName} {...props} />;
}
`;
}

function createRouteFile(componentName: string): string | null {
  switch (componentName) {
    case "WebsitePage":
      return `import { WebsitePageView } from '@/blocks';
import { context } from '@ui8kit/data';

export function WebsitePage() {
  return (
    <WebsitePageView
      mode="full"
      navItems={context.navItems}
      headerTitle={context.site.title}
      headerSubtitle={context.site.subtitle}
      hero={context.hero}
      valueProposition={context.valueProposition}
    />
  );
}
`;
    case "BlogPage":
      return `import { BlogPageView } from '@/blocks';
import { context } from '@ui8kit/data';

export function BlogPage() {
  return (
    <BlogPageView
      navItems={context.navItems}
      headerTitle={context.site.title}
      headerSubtitle={context.site.subtitle}
      blog={context.blog}
    />
  );
}
`;
    case "ShowcasePage":
      return `import { ShowcasePageView } from '@/blocks';
import { context } from '@ui8kit/data';

export function ShowcasePage() {
  return (
    <ShowcasePageView
      navItems={context.navItems}
      headerTitle={context.site.title}
      headerSubtitle={context.site.subtitle}
      showcase={context.showcase}
    />
  );
}
`;
    case "AdminPage":
      return `import { AdminPageView } from '@/blocks';
import { context } from '@ui8kit/data';

export function AdminPage() {
  return (
    <AdminPageView
      navItems={context.navItems}
      headerTitle={context.site.title}
      headerSubtitle={context.site.subtitle}
    />
  );
}
`;
    default:
      return null;
  }
}

function toDomainRelativePath(domainRoot: string, fullPath: string): string {
  if (fullPath === domainRoot) return "/";
  if (fullPath.startsWith(`${domainRoot}/`)) {
    const rest = fullPath.slice(domainRoot.length);
    return rest === "" ? "/" : rest;
  }
  return fullPath;
}

function createDomainApp(domain: Domain, pages: PageEntry[], routeComponents: string[]): string {
  const routeImports = routeComponents
    .map((name) => `import { ${name} } from '@/routes/${name}';`)
    .join("\n");

  const domainRoot = pages.find((entry) => !entry.parentId)?.path ?? pages[0]?.path ?? "/";
  const routeLines = pages
    .filter((entry) => entry.component && routeComponents.includes(entry.component))
    .sort((a, b) => a.path.length - b.path.length)
    .map((entry) => {
      const routePath = toDomainRelativePath(domainRoot, entry.path);
      return `      <Route path="${routePath}" element={<${entry.component} />} />`;
    })
    .join("\n");

  return `import { Routes, Route, Navigate } from 'react-router-dom';
${routeImports}

export function App() {
  return (
    <Routes>
${routeLines}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
`;
}

function writeDomainIndexes(target: string): void {
  const blocksDir = join(target, "blocks");
  mkdirSync(blocksDir, { recursive: true });

  const rootExports: string[] = [];
  const blockEntries = readdirSync(blocksDir, { withFileTypes: true });
  for (const entry of blockEntries) {
    const fullPath = join(blocksDir, entry.name);
    if (entry.isFile() && entry.name.endsWith(".tsx")) {
      const name = entry.name.replace(".tsx", "");
      rootExports.push(`export { ${name} } from './${name}';`);
      continue;
    }
    if (entry.isDirectory() && DOMAINS.includes(entry.name as Domain)) {
      const domainDir = fullPath;
      const exports: string[] = [];
      for (const file of readdirSync(domainDir, { withFileTypes: true })) {
        if (!file.isFile()) continue;
        if (file.name === "index.ts" || file.name === "index.tsx") continue;
        if (!file.name.endsWith(".ts") && !file.name.endsWith(".tsx")) continue;
        const base = file.name.replace(/\.(ts|tsx)$/, "");
        exports.push(`export * from './${base}';`);
      }
      exports.sort();
      writeFile(join(domainDir, "index.ts"), exports.join("\n") + (exports.length ? "\n" : ""));
      rootExports.push(`export * from './${entry.name}';`);
    }
  }
  writeFile(join(blocksDir, "index.ts"), rootExports.join("\n") + (rootExports.length ? "\n" : ""));
}

function writePartialsIndex(target: string): void {
  const partialsDir = join(target, "partials");
  mkdirSync(partialsDir, { recursive: true });
  const exports: string[] = [];
  for (const entry of readdirSync(partialsDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".tsx")) continue;
    const name = entry.name.replace(".tsx", "");
    exports.push(`export * from './${name}';`);
  }
  exports.sort();
  writeFile(join(partialsDir, "index.ts"), exports.join("\n") + (exports.length ? "\n" : ""));
}

function main(): void {
  const { targetApp, domain } = resolveTargetAndDomain();
  const source = join(DIST_REACT, domain);
  const target = join(REPO_ROOT, "apps", targetApp, "src");

  console.log(`Sync engine/dist/react/${domain} -> apps/${targetApp}/src`);
  console.log(`  Source: ${relativePath(source)}`);
  console.log(`  Target: ${relativePath(target)}\n`);

  if (!existsSync(source)) {
    console.error("Source directory not found. Run: cd apps/engine && bun run generate");
    process.exit(1);
  }

  cleanManagedDirs(target);

  for (const subdir of ["blocks", "partials"] as const) {
    const srcDir = join(source, subdir);
    const destDir = join(target, subdir);
    copyDir(srcDir, destDir);
  }

  const registryPath = join(source, "registry.json");
  const pageViewToDomain = readRegistryRouteDomainMap(registryPath);
  const pageModel = readPageModel();
  const pages = pageModel.page[domain] ?? [];

  const viewsDir = join(source, "views");
  const generatedLayoutViews = new Set<string>();
  if (existsSync(viewsDir)) {
    const layoutViewsDir = join(target, "layouts", "views");
    mkdirSync(layoutViewsDir, { recursive: true });
    const entries = readdirSync(viewsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith(".tsx") && !shouldSkipFile(entry.name)) {
        const srcPath = join(viewsDir, entry.name);
        if (entry.name.endsWith(LAYOUT_VIEW_SUFFIX)) {
          const destPath = join(layoutViewsDir, entry.name);
          copyFileSync(srcPath, destPath);
          generatedLayoutViews.add(entry.name.replace(".tsx", "").replace("View", ""));
          console.log(`  + ${relativePath(destPath)} (layout view)`);
        } else if (entry.name.endsWith(ROUTE_VIEW_SUFFIX)) {
          const baseName = entry.name.replace(".tsx", "");
          const viewDomain = pageViewToDomain[baseName];
          if (viewDomain) {
            const viewDestDir = join(target, "blocks", viewDomain);
            mkdirSync(viewDestDir, { recursive: true });
            const destPath = join(viewDestDir, entry.name);
            copyFileSync(srcPath, destPath);
            console.log(`  + ${relativePath(destPath)} (page view)`);
          }
        }
      }
    }
  }

  const generatedLayouts = new Set<string>();
  if (generatedLayoutViews.has("MainLayout") && domain === "website") {
    writeFile(join(target, "layouts", "MainLayout.tsx"), createMainOrDashLayout("MainLayout"));
    generatedLayouts.add("MainLayout");
  }
  if (generatedLayoutViews.has("DashLayout") && domain === "website") {
    writeFile(join(target, "layouts", "DashLayout.tsx"), createMainOrDashLayout("DashLayout"));
    generatedLayouts.add("DashLayout");
  }

  const layoutExports = Array.from(generatedLayouts)
    .sort()
    .map((name) => `export { ${name} } from './${name}';`);
  writeFile(join(target, "layouts", "index.ts"), layoutExports.join("\n") + (layoutExports.length ? "\n" : ""));

  const routeComponents = pages
    .map((entry) => entry.component)
    .filter((component): component is string => !!component)
    .filter((component) => createRouteFile(component) !== null);
  for (const componentName of routeComponents) {
    const content = createRouteFile(componentName);
    if (!content) continue;
    writeFile(join(target, "routes", `${componentName}.tsx`), content);
  }

  const routesIndexContent = routeComponents
    .sort()
    .map((name) => `export { ${name} } from './${name}';`)
    .join("\n");
  writeFile(join(target, "routes", "index.ts"), routesIndexContent + (routesIndexContent ? "\n" : ""));

  writeDomainIndexes(target);
  writePartialsIndex(target);

  writeFile(join(target, "App.tsx"), createDomainApp(domain, pages, routeComponents));
  console.log(`\nDone. Synced from dist/react/${domain}.`);
}

main();
