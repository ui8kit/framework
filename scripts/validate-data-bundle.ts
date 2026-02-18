#!/usr/bin/env bun
import { createHash } from "crypto";
import { existsSync, readdirSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");

function parseArg(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx >= 0 && process.argv[idx + 1]) return process.argv[idx + 1];
  return undefined;
}

function listFilesRecursive(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFilesRecursive(full));
    else out.push(full);
  }
  return out.sort();
}

function hashDir(dir: string): string {
  const hash = createHash("sha256");
  for (const file of listFilesRecursive(dir)) {
    hash.update(file);
    hash.update(readFileSync(file));
  }
  return hash.digest("hex");
}

async function main(): Promise<void> {
  const target = parseArg("--target") ?? process.env.TARGET_APP ?? "dev";
  const appRoot = join(REPO_ROOT, "apps", target);
  const localDataPath = join(appRoot, "src", "data", "index.ts");
  const sharedDataPath = join(REPO_ROOT, "apps", "engine", "src", "data", "index.ts");

  if (!existsSync(localDataPath)) {
    throw new Error(`Local data bundle not found: apps/${target}/src/data/index.ts`);
  }

  const localMod = await import(pathToFileURL(localDataPath).href);
  const sharedMod = await import(pathToFileURL(sharedDataPath).href);

  const requiredExports = [
    "context",
    "EMPTY_ARRAY",
    "clearCache",
    "getSidebarCacheDiagnostics",
  ];
  for (const name of requiredExports) {
    if (!(name in localMod)) throw new Error(`Missing local export: ${name}`);
    if (!(name in sharedMod)) throw new Error(`Missing shared export: ${name}`);
  }

  const requiredContextKeys = [
    "page",
    "routes",
    "site",
    "navItems",
    "sidebarLinks",
    "adminSidebarLinks",
    "adminSidebarLabel",
    "getAdminSidebarLinks",
    "getPageByPath",
    "getPagesByDomain",
    "resolveNavigation",
    "navigation",
    "domains",
  ];
  for (const key of requiredContextKeys) {
    if (!(key in localMod.context)) throw new Error(`Missing local context key: ${key}`);
    if (!(key in sharedMod.context)) throw new Error(`Missing shared context key: ${key}`);
  }

  const dataDir = join(appRoot, "src", "data");
  const checksum = hashDir(dataDir);
  console.log(`Data bundle contract OK for apps/${target}`);
  console.log(`Checksum: ${checksum}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
