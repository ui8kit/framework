#!/usr/bin/env bun
/**
 * CLI script to validate JSX control flow against @ui8kit/dsl DSL.
 *
 * Usage:
 *   bun run packages/lint/src/cli/validate-dsl.ts
 *   bun run packages/lint/src/cli/validate-dsl.ts apps/engine/src
 *   bun run packages/lint/src/cli/validate-dsl.ts apps/engine/src/routes --json
 */

import { resolve, relative, isAbsolute, extname } from "path";
import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import { validateDSL } from "../validator";
import { formatJson, formatPretty } from "../formatter";
import type { LintError, LintResult } from "../types";

function findMonorepoRoot(): string {
  let dir = process.cwd();
  while (true) {
    const pkgPath = resolve(dir, "package.json");
    if (existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
        if (pkg.workspaces) {
          return dir;
        }
      } catch {
        // Ignore invalid package.json and continue traversal.
      }
    }

    const parent = resolve(dir, "..");
    if (parent === dir) {
      break;
    }
    dir = parent;
  }

  return process.cwd();
}

function collectFilesRecursively(directoryPath: string, collected: string[]): void {
  const entries = readdirSync(directoryPath);

  for (const entry of entries) {
    const absolutePath = resolve(directoryPath, entry);
    const stats = statSync(absolutePath);

    if (stats.isDirectory()) {
      collectFilesRecursively(absolutePath, collected);
      continue;
    }

    const extension = extname(absolutePath);
    if (extension === ".tsx" || extension === ".jsx") {
      collected.push(absolutePath);
    }
  }
}

function resolveTargetPaths(monorepoRoot: string, rawTargets: string[]): string[] {
  const targets = rawTargets.length > 0 ? rawTargets : ["apps/engine/src"];
  return targets.map((target) => (isAbsolute(target) ? target : resolve(monorepoRoot, target)));
}

function collectTargetFiles(monorepoRoot: string, rawTargets: string[]): string[] {
  const files: string[] = [];
  const targets = resolveTargetPaths(monorepoRoot, rawTargets);

  for (const targetPath of targets) {
    if (!existsSync(targetPath)) {
      console.warn(`Warning: target does not exist: ${targetPath}`);
      continue;
    }

    const stats = statSync(targetPath);
    if (stats.isDirectory()) {
      collectFilesRecursively(targetPath, files);
      continue;
    }

    const extension = extname(targetPath);
    if (extension === ".tsx" || extension === ".jsx") {
      files.push(targetPath);
    }
  }

  // Deduplicate and sort for stable output.
  return [...new Set(files)].sort((a, b) => a.localeCompare(b));
}

function summarize(errors: LintError[]): LintResult {
  return {
    valid: errors.length === 0,
    errors,
    summary: {
      errors: errors.filter((error) => error.severity === "error").length,
      warnings: errors.filter((error) => error.severity === "warning").length,
      info: errors.filter((error) => error.severity === "info").length,
    },
  };
}

async function main() {
  const args = process.argv.slice(2);
  const jsonOutput = args.includes("--json");
  const fileTargets = args.filter((argument) => !argument.startsWith("--"));
  const monorepoRoot = findMonorepoRoot();

  const files = collectTargetFiles(monorepoRoot, fileTargets);
  if (files.length === 0) {
    console.error("Error: no .tsx/.jsx files found for DSL validation.");
    process.exit(1);
  }

  const allErrors: LintError[] = [];
  for (const filePath of files) {
    const source = readFileSync(filePath, "utf-8");
    const result = validateDSL(source, {
      file: relative(monorepoRoot, filePath),
      lineOffset: 0,
    });
    allErrors.push(...result.errors);
  }

  const finalResult = summarize(allErrors);
  if (jsonOutput) {
    console.log(formatJson(finalResult));
  } else if (finalResult.valid) {
    console.log(`✅ DSL validation passed for ${files.length} file(s).`);
  } else {
    console.log(formatPretty(finalResult));
  }

  process.exit(finalResult.valid ? 0 : 1);
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
