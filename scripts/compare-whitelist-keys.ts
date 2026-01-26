#!/usr/bin/env bun
/**
 * Compare props class list with Tailwind extended map
 * 
 * Outputs classes from ui8kit.list.props.json that are NOT in tw-css-extended.json
 * These are semantic/custom classes that need CSS definitions.
 * 
 * Usage:
 *   bun run scripts/compare-whitelist-keys.ts
 */

import { readFileSync } from "fs";
import { resolve } from "path";

const ROOT = resolve(import.meta.dir, "..");

// Paths to compare
const PROPS_LIST_PATH = resolve(ROOT, "packages/ui8kit/src/lib/ui8kit.list.props.json");
const TW_EXTENDED_PATH = resolve(ROOT, "packages/generator/src/assets/tailwind/tw-css-extended.json");

/**
 * Load JSON array as Set
 */
function loadJsonArray(path: string): Set<string> {
  try {
    const content = readFileSync(path, "utf-8");
    const json = JSON.parse(content);
    return new Set(json as string[]);
  } catch (error) {
    console.error(`Error loading ${path}:`, error);
    process.exit(1);
  }
}

/**
 * Load JSON object keys as Set
 */
function loadJsonKeys(path: string): Set<string> {
  try {
    const content = readFileSync(path, "utf-8");
    const json = JSON.parse(content);
    return new Set(Object.keys(json));
  } catch (error) {
    console.error(`Error loading ${path}:`, error);
    process.exit(1);
  }
}

function main() {
  console.log("Comparing props classes with Tailwind...\n");
  
  // Load props list (array) and tailwind map (object keys)
  const propsClasses = loadJsonArray(PROPS_LIST_PATH);
  const twExtendedKeys = loadJsonKeys(TW_EXTENDED_PATH);
  
  console.log(`ui8kit.list.props.json: ${propsClasses.size} classes`);
  console.log(`tw-css-extended.json: ${twExtendedKeys.size} classes\n`);
  
  // Find classes in props that are NOT in tw-extended (semantic/custom)
  const missingInTailwind: string[] = [];
  const semanticKeys: string[] = [];
  
  for (const cls of propsClasses) {
    if (!twExtendedKeys.has(cls)) {
      // Check if it's a semantic color class
      if (
        cls.includes("foreground") ||
        cls.includes("primary") ||
        cls.includes("secondary") ||
        cls.includes("muted") ||
        cls.includes("destructive") ||
        cls.includes("accent") ||
        cls.includes("popover") ||
        cls.includes("card") ||
        cls.includes("input") ||
        cls.includes("background") ||
        cls.includes("ring")
      ) {
        semanticKeys.push(cls);
      } else {
        missingInTailwind.push(cls);
      }
    }
  }
  
  // Output results
  console.log("=" .repeat(60));
  console.log("CLASSES IN PROPS BUT NOT IN TAILWIND");
  console.log("=" .repeat(60));
  
  if (semanticKeys.length > 0) {
    console.log(`\n🎨 Semantic/Theme classes (${semanticKeys.length}):`);
    semanticKeys.sort().forEach(k => console.log(`   ${k}`));
  }
  
  if (missingInTailwind.length > 0) {
    console.log(`\n❓ Other missing classes (${missingInTailwind.length}):`);
    missingInTailwind.sort().forEach(k => console.log(`   ${k}`));
  }
  
  const totalMissing = semanticKeys.length + missingInTailwind.length;
  
  if (totalMissing === 0) {
    console.log("\n✅ All props classes exist in tw-css-extended.json");
  } else {
    console.log(`\n📊 Summary:`);
    console.log(`   Total missing: ${totalMissing}`);
    console.log(`   - Semantic: ${semanticKeys.length}`);
    console.log(`   - Other: ${missingInTailwind.length}`);
  }
}

main();
