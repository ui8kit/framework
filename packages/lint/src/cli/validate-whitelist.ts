#!/usr/bin/env bun
/**
 * CLI script to validate whitelist synchronization.
 *
 * Paths are resolved from ui8kit.config (lint.ui8kitMapPath, lint.utilityPropsMapPath)
 * or defaults: ./src/ui8kit.map.json, ./src/lib/utility-props.map.ts
 *
 * Usage:
 *   bunx ui8kit-lint
 *   bunx ui8kit-lint --cwd ./my-app
 *   bunx ui8kit-lint --json
 *   bunx ui8kit-lint --stats
 */

import { resolve } from "path";
import { readFileSync, existsSync } from "fs";
import { syncWhitelist, validateWhitelistSync } from "../whitelist-sync";
import { formatPretty, formatJson } from "../formatter";

const DEFAULT_UI8KIT_MAP = "./src/ui8kit.map.json";
const DEFAULT_PROPS_MAP = "./src/lib/utility-props.map.ts";

interface LintConfig {
  ui8kitMapPath?: string;
  utilityPropsMapPath?: string;
}

function loadLintConfig(cwd: string): LintConfig {
  const configPath = resolve(cwd, "ui8kit.config.json");
  if (existsSync(configPath)) {
    try {
      const raw = JSON.parse(readFileSync(configPath, "utf-8"));
      const lint = raw.lint ?? {};
      return {
        ui8kitMapPath: lint.ui8kitMapPath ?? DEFAULT_UI8KIT_MAP,
        utilityPropsMapPath: lint.utilityPropsMapPath ?? DEFAULT_PROPS_MAP,
      };
    } catch {
      // Invalid JSON, use defaults
    }
  }
  return {
    ui8kitMapPath: DEFAULT_UI8KIT_MAP,
    utilityPropsMapPath: DEFAULT_PROPS_MAP,
  };
}

function parseCwd(args: string[]): string {
  const idx = args.indexOf("--cwd");
  if (idx >= 0 && args[idx + 1]) {
    return resolve(process.cwd(), args[idx + 1]);
  }
  return process.cwd();
}

async function main() {
  const args = process.argv.slice(2);
  const cwd = parseCwd(args);
  const jsonOutput = args.includes("--json");
  const showStats = args.includes("--stats");

  const lintConfig = loadLintConfig(cwd);
  const ui8kitMapPath = resolve(cwd, lintConfig.ui8kitMapPath!);
  const propsMapPath = resolve(cwd, lintConfig.utilityPropsMapPath!);

  if (!existsSync(ui8kitMapPath)) {
    console.error(`Error: ui8kit.map.json not found at ${ui8kitMapPath}`);
    console.error(`  Configure lint.ui8kitMapPath in ui8kit.config (default: ${DEFAULT_UI8KIT_MAP})`);
    console.error(`  Copy from @ui8kit/generator or generate it, then place in your project.`);
    process.exit(1);
  }

  if (!existsSync(propsMapPath)) {
    console.error(`Error: utility-props.map.ts not found at ${propsMapPath}`);
    console.error(`  Configure lint.utilityPropsMapPath in ui8kit.config (default: ${DEFAULT_PROPS_MAP})`);
    process.exit(1);
  }

  const classMapContent = readFileSync(ui8kitMapPath, "utf-8");
  const classMap = JSON.parse(classMapContent);

  const propsModule = await import(propsMapPath);
  const propsMap = propsModule.utilityPropsMap;

  const syncResult = syncWhitelist(classMap, propsMap);
  const lintResult = validateWhitelistSync(classMap, propsMap);

  if (jsonOutput) {
    console.log(formatJson(lintResult));
  } else {
    if (showStats || syncResult.synced) {
      console.log("\n📊 Whitelist Statistics:");
      console.log(`   Total classes: ${syncResult.stats.totalClasses}`);
      console.log(`   Total props: ${syncResult.stats.totalProps}`);
      console.log(`   Total prop values: ${syncResult.stats.totalPropValues}`);
      console.log(`   Coverage: ${syncResult.stats.coverage}%`);
      console.log("");
    }

    if (syncResult.synced) {
      console.log("✅ Whitelist is in sync with props map");
    } else {
      console.log(formatPretty(lintResult));
    }

    if (syncResult.missingInProps.length > 0) {
      console.log(`\n⚠️  ${syncResult.missingInProps.length} classes not covered by props (className-only):`);
      const grouped = new Map<string, string[]>();
      for (const cls of syncResult.missingInProps.slice(0, 20)) {
        const prefix = cls.split("-")[0];
        if (!grouped.has(prefix)) grouped.set(prefix, []);
        grouped.get(prefix)!.push(cls);
      }
      for (const [prefix, classes] of grouped) {
        console.log(`   ${prefix}: ${classes.join(", ")}`);
      }
      if (syncResult.missingInProps.length > 20) {
        console.log(`   ... and ${syncResult.missingInProps.length - 20} more`);
      }
    }
  }

  process.exit(lintResult.valid ? 0 : 1);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
