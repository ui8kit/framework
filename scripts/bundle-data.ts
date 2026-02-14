#!/usr/bin/env bun
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const DATA_SRC_ROOT = join(REPO_ROOT, "packages", "data", "src");
const FIXTURES_SRC_ROOT = join(DATA_SRC_ROOT, "fixtures");
const DOMAINS = ["website"] as const;

type Domain = (typeof DOMAINS)[number];
type DataMode = "local" | "shared";

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

const DOMAIN_FIXTURE_FILES: Record<Domain, string[]> = {
  website: ["hero.json", "features.json", "components.json", "guides.json", "blog.json", "showcase.json"],
};

function parseArg(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx >= 0 && process.argv[idx + 1]) return process.argv[idx + 1];
  return undefined;
}

function normalizeDomain(raw: string | undefined): Domain {
  if (raw && DOMAINS.includes(raw as Domain)) return raw as Domain;
  return "website";
}

function normalizeDataMode(raw: string | undefined): DataMode {
  return raw === "shared" ? "shared" : "local";
}

function writeJson(path: string, data: unknown): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

function writeText(path: string, content: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf-8");
}

function copyOrCreateFixture(sourcePath: string, targetPath: string): void {
  mkdirSync(dirname(targetPath), { recursive: true });
  if (existsSync(sourcePath)) {
    copyFileSync(sourcePath, targetPath);
    return;
  }
  writeJson(targetPath, {});
}

function readPageModel(): PageModel {
  const pagePath = join(FIXTURES_SRC_ROOT, "shared", "page.json");
  return JSON.parse(readFileSync(pagePath, "utf-8")) as PageModel;
}

function slicePageModel(model: PageModel, domain: Domain, mode: DataMode): PageModel {
  if (mode === "shared") return model;
  return {
    page: {
      website: domain === "website" ? (model.page.website ?? []) : [],
    },
  };
}

function readDomainRegistryItems(domain: Domain): string[] {
  const registryPath = join(REPO_ROOT, "apps", "engine", "dist", "react", domain, "registry.json");
  if (!existsSync(registryPath)) return [];
  const parsed = JSON.parse(readFileSync(registryPath, "utf-8")) as { items?: RegistryItem[] };
  return (parsed.items ?? [])
    .filter((item) => item.type === "registry:route" && item.domain === domain)
    .map((item) => item.name);
}

function validatePageAgainstRegistry(pageModel: PageModel, domain: Domain): void {
  const routeItems = readDomainRegistryItems(domain);
  if (routeItems.length === 0) {
    console.warn(`  ! registry route items not found for domain "${domain}"`);
    return;
  }
  const requiredRouteViews = pageModel.page[domain]
    .map((entry) => entry.component)
    .filter((component): component is string => !!component)
    .map((component) => `${component}View`);
  const missing = requiredRouteViews.filter((name) => !routeItems.includes(name));
  if (missing.length > 0) {
    console.warn(`  ! registry is missing route views: ${missing.join(", ")}`);
  }
}

function buildLocalDataDiagnostics(mode: DataMode, domain: Domain, loadedDomains: Domain[]): string {
  return `
export function getDataDiagnostics() {
  return Object.freeze({
    mode: '${mode}',
    domain: '${domain}',
    loadedDomains: Object.freeze(${JSON.stringify(loadedDomains)}),
    cache: getSidebarCacheDiagnostics(),
  });
}
`;
}

function main(): void {
  const targetArg = parseArg("--target") ?? process.env.TARGET_APP ?? "dev";
  const domain = normalizeDomain(parseArg("--domain") ?? process.env.DOMAIN);
  const dataMode = normalizeDataMode(parseArg("--data-mode") ?? process.env.DATA_MODE);

  const targetDataRoot = join(REPO_ROOT, "apps", targetArg, "src", "data");
  rmSync(targetDataRoot, { recursive: true, force: true });
  mkdirSync(targetDataRoot, { recursive: true });

  console.log(`Bundle data for target=${targetArg}, domain=${domain}, mode=${dataMode}`);

  // Copy base implementation files for API parity.
  const sourceTypes = join(DATA_SRC_ROOT, "types.ts");
  const sourceCache = join(DATA_SRC_ROOT, "cache.ts");
  const sourceIndex = join(DATA_SRC_ROOT, "index.ts");
  const indexSourceText = readFileSync(sourceIndex, "utf-8");
  const loadedDomains = (dataMode === "shared" ? DOMAINS : [domain]) as Domain[];

  copyFileSync(sourceTypes, join(targetDataRoot, "types.ts"));
  copyFileSync(sourceCache, join(targetDataRoot, "cache.ts"));
  writeText(
    join(targetDataRoot, "index.ts"),
    `${indexSourceText}\n${buildLocalDataDiagnostics(dataMode, domain, loadedDomains)}`
  );

  // Shared fixtures.
  copyOrCreateFixture(
    join(FIXTURES_SRC_ROOT, "shared", "site.json"),
    join(targetDataRoot, "fixtures", "shared", "site.json")
  );
  copyOrCreateFixture(
    join(FIXTURES_SRC_ROOT, "shared", "navigation.json"),
    join(targetDataRoot, "fixtures", "shared", "navigation.json")
  );

  const fullPageModel = readPageModel();
  const slicedPageModel = slicePageModel(fullPageModel, domain, dataMode);
  writeJson(
    join(targetDataRoot, "fixtures", "shared", "page.json"),
    slicedPageModel
  );
  validatePageAgainstRegistry(slicedPageModel, domain);

  // Domain fixtures: keep real data for selected domains, stubs for others.
  for (const domainName of DOMAINS) {
    const includeDomain = dataMode === "shared" || domainName === domain;
    for (const fixtureFile of DOMAIN_FIXTURE_FILES[domainName]) {
      const source = join(FIXTURES_SRC_ROOT, domainName, fixtureFile);
      const target = join(targetDataRoot, "fixtures", domainName, fixtureFile);
      if (includeDomain) copyOrCreateFixture(source, target);
      else writeJson(target, {});
    }
  }

  console.log(`  + ${join("apps", targetArg, "src", "data").replace(/\\/g, "/")}`);
  console.log("Done.");
}

main();
