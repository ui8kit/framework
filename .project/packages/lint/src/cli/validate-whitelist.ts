#!/usr/bin/env bun
/**
 * CLI script to validate whitelist synchronization.
 * 
 * Usage:
 *   bun run packages/lint/src/cli/validate-whitelist.ts
 *   bun run packages/lint/src/cli/validate-whitelist.ts --json
 *   bun run packages/lint/src/cli/validate-whitelist.ts --fix
 */

import { resolve } from "path";
import { readFileSync, existsSync } from "fs";
import { syncWhitelist, validateWhitelistSync } from "../whitelist-sync";
import { formatPretty, formatJson } from "../formatter";

// Find monorepo root by looking for package.json with workspaces
function findMonorepoRoot(): string {
  let dir = process.cwd();
  while (dir !== "/") {
    const pkgPath = resolve(dir, "package.json");
    if (existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
        if (pkg.workspaces) {
          return dir;
        }
      } catch {}
    }
    dir = resolve(dir, "..");
  }
  return process.cwd();
}

const MONOREPO_ROOT = findMonorepoRoot();
const UI8KIT_MAP_PATH = resolve(MONOREPO_ROOT, "packages/ui8kit/src/lib/ui8kit.map.json");
const PROPS_MAP_PATH = resolve(MONOREPO_ROOT, "packages/ui8kit/src/lib/utility-props.map.ts");

async function main() {
  const args = process.argv.slice(2);
  const jsonOutput = args.includes("--json");
  const showStats = args.includes("--stats");

  // Check files exist
  if (!existsSync(UI8KIT_MAP_PATH)) {
    console.error(`Error: ui8kit.map.json not found at ${UI8KIT_MAP_PATH}`);
    process.exit(1);
  }

  if (!existsSync(PROPS_MAP_PATH)) {
    console.error(`Error: utility-props.map.ts not found at ${PROPS_MAP_PATH}`);
    process.exit(1);
  }

  // Load class map
  const classMapContent = readFileSync(UI8KIT_MAP_PATH, "utf-8");
  const classMap = JSON.parse(classMapContent);

  // Load props map (dynamic import)
  const propsModule = await import(PROPS_MAP_PATH);
  const propsMap = propsModule.utilityPropsMap;

  // Run sync check
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
      // Group by prefix for readability
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
