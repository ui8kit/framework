#!/usr/bin/env bun
/**
 * Audit CLI packages before publish.
 *
 * Scans packages with a `cli` directory and verifies:
 * - bin entries point to dist/ (not src/)
 * - dist/cli/*.js files exist for each bin target
 * - Source CLI files have #!/usr/bin/env bun shebang
 * - Commander-based CLIs have .description() and support --help
 *
 * Usage:
 *   bun run scripts/audit-cli-publish.ts
 *   bun run audit:cli
 */

import { existsSync, readFileSync, readdirSync } from "fs";
import { join, dirname, relative } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");

interface Issue {
  level: "error" | "warn";
  code: string;
  message: string;
  path?: string;
  packageName?: string;
}

const issues: Issue[] = [];

function addIssue(issue: Issue): void {
  issues.push(issue);
}

function findPackagesWithCli(): Array<{ pkgPath: string; pkg: Record<string, unknown>; cliDir: string }> {
  const packagesDir = join(repoRoot, "packages");
  if (!existsSync(packagesDir)) return [];

  const result: Array<{ pkgPath: string; pkg: Record<string, unknown>; cliDir: string }> = [];
  const entries = readdirSync(packagesDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const pkgDir = join(packagesDir, entry.name);
    const pkgPath = join(pkgDir, "package.json");
    const cliSrc = join(pkgDir, "src", "cli");
    const cliRoot = join(pkgDir, "cli");

    if (!existsSync(pkgPath)) continue;
    const cliDir = existsSync(cliSrc) ? cliSrc : existsSync(cliRoot) ? cliRoot : null;
    if (!cliDir) continue;

    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8")) as Record<string, unknown>;
    result.push({ pkgPath, pkg, cliDir });
  }

  return result;
}

function getBinTargets(pkg: Record<string, unknown>): Array<{ name: string; target: string }> {
  const bin = pkg.bin;
  if (!bin || typeof bin !== "object") return [];

  if (typeof bin === "string") {
    return [{ name: pkg.name as string, target: bin }];
  }

  return Object.entries(bin).map(([name, target]) => ({
    name,
    target: typeof target === "string" ? target : "",
  }));
}

function checkBinPointsToDist(pkgName: string, binName: string, target: string, pkgDir: string): void {
  if (!target) {
    addIssue({ level: "error", code: "BIN_EMPTY", message: `bin "${binName}" has empty target`, packageName: pkgName });
    return;
  }

  if (target.includes("/src/") || target.endsWith(".ts")) {
    addIssue({
      level: "error",
      code: "BIN_SRC_NOT_DIST",
      message: `bin "${binName}" points to src/ or .ts — should point to dist/cli/*.js for publish`,
      path: target,
      packageName: pkgName,
    });
  } else if (!target.includes("/dist/")) {
    addIssue({
      level: "warn",
      code: "BIN_NOT_DIST",
      message: `bin "${binName}" does not point to dist/ — expected dist/cli/*.js`,
      path: target,
      packageName: pkgName,
    });
  }

  const absPath = join(pkgDir, target.replace(/^\.\//, ""));
  if (!existsSync(absPath)) {
    addIssue({
      level: "error",
      code: "BIN_FILE_MISSING",
      message: `bin "${binName}" target file does not exist (run build first)`,
      path: target,
      packageName: pkgName,
    });
  }
}

function checkShebang(pkgName: string, srcPath: string): void {
  if (!existsSync(srcPath)) return;

  const content = readFileSync(srcPath, "utf-8");
  const firstLine = content.split("\n")[0]?.trim() ?? "";

  if (!firstLine.startsWith("#!")) {
    addIssue({
      level: "warn",
      code: "SHEBANG_MISSING",
      message: `CLI source missing shebang (expected #!/usr/bin/env bun)`,
      path: relative(repoRoot, srcPath),
      packageName: pkgName,
    });
  } else if (!firstLine.includes("bun")) {
    addIssue({
      level: "warn",
      code: "SHEBANG_NOT_BUN",
      message: `CLI shebang should be #!/usr/bin/env bun`,
      path: relative(repoRoot, srcPath),
      packageName: pkgName,
    });
  }
}

function checkCommanderDescription(pkgName: string, srcPath: string): void {
  if (!existsSync(srcPath)) return;

  const content = readFileSync(srcPath, "utf-8");

  const hasCommander = content.includes("from \"commander\"") || content.includes("from 'commander'");
  if (!hasCommander) return;

  const hasDescription = /\.description\s*\(\s*["'`][^"'`]+["'`]\s*\)/.test(content);
  if (!hasDescription) {
    addIssue({
      level: "warn",
      code: "COMMANDER_NO_DESCRIPTION",
      message: `Commander CLI missing .description() on root command`,
      path: relative(repoRoot, srcPath),
      packageName: pkgName,
    });
  }

  const hasHelp = content.includes("addHelpText") || content.includes("--help") || content.includes("-h");
  if (!hasHelp && !content.includes(".option(")) {
    addIssue({
      level: "warn",
      code: "COMMANDER_NO_HELP",
      message: `Commander CLI: consider addHelpText('after', '...') or .option('--help') for user guidance`,
      path: relative(repoRoot, srcPath),
      packageName: pkgName,
    });
  }
}

function checkNonCommanderHelp(pkgName: string, srcPath: string): void {
  if (!existsSync(srcPath)) return;

  const content = readFileSync(srcPath, "utf-8");
  const hasCommander = content.includes("commander");
  if (hasCommander) return;

  const hasUsage = content.includes("Usage:") || content.includes("--help") || content.includes("-h");
  if (!hasUsage) {
    addIssue({
      level: "warn",
      code: "CLI_NO_USAGE",
      message: `CLI without Commander: add Usage in JSDoc or --help handling`,
      path: relative(repoRoot, srcPath),
      packageName: pkgName,
    });
  }
}

function main(): void {
  console.log("\n  UI8Kit — CLI Publish Audit");
  console.log("  ───────────────────────────\n");

  const packages = findPackagesWithCli();

  if (packages.length === 0) {
    console.log("  No packages with cli/ directory found.\n");
    process.exit(0);
  }

  for (const { pkgPath, pkg, cliDir } of packages) {
    const pkgDir = dirname(pkgPath);
    const pkgName = (pkg.name as string) ?? "unknown";

    console.log(`  Package: ${pkgName}`);

    const binTargets = getBinTargets(pkg);
    if (binTargets.length === 0) {
      addIssue({
        level: "warn",
        code: "CLI_NO_BIN",
        message: `Package has cli/ but no bin in package.json`,
        packageName: pkgName,
      });
    }

    for (const { name, target } of binTargets) {
      checkBinPointsToDist(pkgName, name, target, pkgDir);
    }

    const cliFiles = readdirSync(cliDir, { withFileTypes: true })
      .filter((e) => e.isFile() && (e.name.endsWith(".ts") || e.name.endsWith(".tsx")) && e.name !== "index.ts")
      .map((e) => join(cliDir, e.name));

    for (const srcPath of cliFiles) {
      checkShebang(pkgName, srcPath);
      checkCommanderDescription(pkgName, srcPath);
      checkNonCommanderHelp(pkgName, srcPath);
    }

    const distCliDir = join(pkgDir, "dist", "cli");
    if (binTargets.length > 0 && !existsSync(distCliDir)) {
      addIssue({
        level: "error",
        code: "DIST_CLI_MISSING",
        message: `dist/cli/ directory does not exist — run build before publish`,
        packageName: pkgName,
      });
    }

    console.log("");
  }

  const errors = issues.filter((i) => i.level === "error");
  const warnings = issues.filter((i) => i.level === "warn");

  if (errors.length > 0) {
    console.log("  Errors:");
    for (const e of errors) {
      console.log(`    x [${e.code}] ${e.message}${e.path ? ` (${e.path})` : ""}`);
    }
    console.log("");
  }

  if (warnings.length > 0) {
    console.log("  Warnings:");
    for (const w of warnings) {
      console.log(`    ! [${w.code}] ${w.message}${w.path ? ` (${w.path})` : ""}`);
    }
    console.log("");
  }

  console.log("  Summary");
  console.log("  ───────────────────────────");
  console.log(`  Packages audited: ${packages.length}`);
  console.log(`  Errors:   ${errors.length}`);
  console.log(`  Warnings: ${warnings.length}`);
  console.log("");

  if (errors.length > 0) {
    console.log("  Status: FAILED — fix errors before publish.\n");
    process.exit(1);
  }

  console.log("  Status: OK\n");
  process.exit(0);
}

main();
