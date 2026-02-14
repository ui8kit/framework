#!/usr/bin/env bun
import { existsSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
type DataMode = "local" | "shared";

function parseArg(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx >= 0 && process.argv[idx + 1]) return process.argv[idx + 1];
  return undefined;
}

function normalizeDataMode(raw: string | undefined): DataMode {
  return raw === "shared" ? "shared" : "local";
}

function updateViteAlias(viteConfigPath: string, dataMode: DataMode): void {
  if (!existsSync(viteConfigPath)) return;
  const content = readFileSync(viteConfigPath, "utf-8");
  const replacementTarget =
    dataMode === "local"
      ? "path.resolve(__dirname, './src/data/index.ts')"
      : "path.resolve(__dirname, '../../packages/data/src/index.ts')";
  const updated = content.replace(
    /'@ui8kit\/data'\s*:\s*path\.resolve\(__dirname,\s*'[^']*'\)/,
    `'@ui8kit/data': ${replacementTarget}`
  );
  if (updated !== content) {
    writeFileSync(viteConfigPath, updated, "utf-8");
  }
}

function updateTsConfigAlias(tsConfigPath: string, dataMode: DataMode): void {
  if (!existsSync(tsConfigPath)) return;
  const parsed = JSON.parse(readFileSync(tsConfigPath, "utf-8")) as {
    compilerOptions?: { paths?: Record<string, string[]> };
  };
  if (!parsed.compilerOptions) parsed.compilerOptions = {};
  if (!parsed.compilerOptions.paths) parsed.compilerOptions.paths = {};
  parsed.compilerOptions.paths["@ui8kit/data"] =
    dataMode === "local"
      ? ["src/data/index.ts"]
      : ["../../packages/data/src/index.ts"];
  writeFileSync(tsConfigPath, JSON.stringify(parsed, null, 2) + "\n", "utf-8");
}

function main(): void {
  const target = parseArg("--target") ?? process.env.TARGET_APP ?? "dev";
  const dataMode = normalizeDataMode(parseArg("--data-mode") ?? process.env.DATA_MODE);
  const appRoot = join(REPO_ROOT, "apps", target);
  const viteConfigPath = join(appRoot, "vite.config.ts");
  const tsConfigPath = join(appRoot, "tsconfig.json");

  updateViteAlias(viteConfigPath, dataMode);
  updateTsConfigAlias(tsConfigPath, dataMode);

  console.log(`Configured @ui8kit/data alias for apps/${target} as ${dataMode}.`);
}

main();
