#!/usr/bin/env bun
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { loadScaffoldConfig } from "./scaffold-config";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
type Domain = "website" | "docs" | "examples" | "dashboard";
type DataMode = "local" | "shared";
type Command = "generate" | "sync" | "scaffold" | "install" | "bundle-data" | "alias-data" | "all";

function parseArg(name: string): string | undefined {
  const idx = process.argv.indexOf(name);
  if (idx >= 0 && process.argv[idx + 1]) return process.argv[idx + 1];
  return undefined;
}

function parseCommand(): Command {
  const cmd = process.argv[2];
  if (!cmd || cmd.startsWith("-")) return "all";
  if (["generate", "sync", "scaffold", "install", "bundle-data", "alias-data", "all"].includes(cmd)) {
    return cmd as Command;
  }
  throw new Error(`Unknown command: ${cmd}`);
}

function run(command: string[], cwd = REPO_ROOT, env?: Record<string, string>): void {
  const [exe, ...args] = command;
  const proc = Bun.spawnSync([exe, ...args], {
    cwd,
    stdio: ["inherit", "inherit", "inherit"],
    env: env ? { ...process.env, ...env } : process.env,
  });
  if (proc.exitCode !== 0) {
    throw new Error(`Command failed: ${command.join(" ")}`);
  }
}

function normalizeDataMode(raw: string | undefined): DataMode {
  return raw === "shared" ? "shared" : "local";
}

async function resolveRuntimeConfig(): Promise<{ target: string; domain: Domain; dataMode: DataMode }> {
  const cfg = await loadScaffoldConfig();
  const target = parseArg("--target") ?? process.env.TARGET_APP ?? cfg.appName ?? "dev";
  const domainArg = parseArg("--domain") ?? process.env.DOMAIN ?? cfg.domain ?? "website";
  const dataModeArg = parseArg("--data-mode") ?? process.env.DATA_MODE ?? cfg.dataMode ?? "local";
  const domain = (["website", "docs", "examples", "dashboard"].includes(domainArg)
    ? domainArg
    : "website") as Domain;
  const dataMode = normalizeDataMode(dataModeArg);
  return { target, domain, dataMode };
}

async function main(): Promise<void> {
  const command = parseCommand();
  const { target, domain, dataMode } = await resolveRuntimeConfig();

  console.log("");
  console.log("  UI8Kit App Pipeline");
  console.log("  ───────────────────");
  console.log(`  command: ${command}`);
  console.log(`  target:  ${target}`);
  console.log(`  domain:  ${domain}`);
  console.log(`  data:    ${dataMode}`);
  console.log("");

  if (command === "scaffold" || command === "all") {
    run(["bun", "run", "scripts/scaffold-app.ts"]);
  }
  if (command === "install" || command === "all") {
    run(["bun", "install"]);
  }
  if (command === "generate" || command === "sync" || command === "all") {
    run(["bun", "run", "generate"], join(REPO_ROOT, "apps", "engine"));
  }
  if (command === "sync" || command === "all") {
    run(
      [
        "bun",
        "run",
        "scripts/copy-templates-to-dev.ts",
        "--target",
        target,
        "--domain",
        domain,
      ],
      REPO_ROOT,
      { TARGET_APP: target, DOMAIN: domain }
    );
  }
  if (command === "bundle-data" || command === "sync" || command === "all") {
    run(
      [
        "bun",
        "run",
        "scripts/bundle-data.ts",
        "--target",
        target,
        "--domain",
        domain,
        "--data-mode",
        dataMode,
      ],
      REPO_ROOT,
      { TARGET_APP: target, DOMAIN: domain, DATA_MODE: dataMode }
    );
  }
  if (command === "alias-data" || command === "sync" || command === "all") {
    run(
      [
        "bun",
        "run",
        "scripts/configure-data-alias.ts",
        "--target",
        target,
        "--data-mode",
        dataMode,
      ],
      REPO_ROOT,
      { TARGET_APP: target, DATA_MODE: dataMode }
    );
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
