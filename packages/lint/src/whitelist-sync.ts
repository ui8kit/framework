/**
 * UI8Kit Lint - Whitelist Synchronization
 * 
 * Validates that ui8kit.map.json and utility-props.map.ts are in sync.
 * Detects:
 * - Classes in map but not in props
 * - Props values that don't resolve to valid classes
 * - Duplicate entries
 * - Typos via Levenshtein distance
 */

import type { PropsMap, LintResult, LintError } from "./types";
import { findClosestMatch } from "./levenshtein";

/** Class map structure: class -> CSS definition */
export type ClassMap = Record<string, string>;

export interface SyncResult {
  /** Whether maps are in sync */
  synced: boolean;
  
  /** Classes in whitelist but missing from props */
  missingInProps: string[];
  
  /** Prop values that don't resolve to valid classes */
  invalidPropValues: Array<{ prop: string; value: string; expectedClass: string }>;
  
  /** Duplicate entries in props map */
  duplicates: Array<{ prop: string; value: string; count: number }>;
  
  /** Likely typos detected */
  typos: Array<{ found: string; suggestion: string; location: string }>;
  
  /** Summary statistics */
  stats: {
    totalClasses: number;
    totalProps: number;
    totalPropValues: number;
    coverage: number;
  };
}

/**
 * Build class name from prop and value.
 * Handles bare tokens (value="") -> just prop name
 */
function buildClassName(prop: string, value: string): string {
  if (value === "") {
    return prop;
  }
  return `${prop}-${value}`;
}

/**
 * Synchronize and validate whitelist against props map.
 */
export function syncWhitelist(
  classMap: ClassMap,
  propsMap: PropsMap
): SyncResult {
  const result: SyncResult = {
    synced: true,
    missingInProps: [],
    invalidPropValues: [],
    duplicates: [],
    typos: [],
    stats: {
      totalClasses: Object.keys(classMap).length,
      totalProps: Object.keys(propsMap).length,
      totalPropValues: 0,
      coverage: 0,
    },
  };

  const allClassNames = Object.keys(classMap);
  const generatedClasses = new Set<string>();
  const seenValues = new Map<string, Map<string, number>>();

  // Build set of all classes that props would generate
  for (const [prop, values] of Object.entries(propsMap)) {
    seenValues.set(prop, new Map());
    
    for (const value of values) {
      result.stats.totalPropValues++;
      
      // Track duplicates
      const propValueMap = seenValues.get(prop)!;
      const count = (propValueMap.get(value) || 0) + 1;
      propValueMap.set(value, count);
      
      if (count > 1) {
        result.duplicates.push({ prop, value, count });
        result.synced = false;
      }

      const className = buildClassName(prop, value);
      generatedClasses.add(className);

      // Check if this class exists in whitelist
      if (!classMap[className]) {
        // Check for typo
        const closest = findClosestMatch(className, allClassNames, 2);
        
        if (closest) {
          result.typos.push({
            found: className,
            suggestion: closest,
            location: `propsMap["${prop}"] contains "${value}"`,
          });
        }
        
        result.invalidPropValues.push({
          prop,
          value,
          expectedClass: className,
        });
        result.synced = false;
      }
    }
  }

  // Find classes in whitelist not covered by props
  for (const className of allClassNames) {
    // Skip responsive variants (md:, lg:, etc.) - they're handled differently
    if (className.includes(":")) {
      continue;
    }
    
    if (!generatedClasses.has(className)) {
      result.missingInProps.push(className);
      // Not marking as not synced - these might be intentionally className-only
    }
  }

  // Calculate coverage
  const coveredClasses = allClassNames.filter(
    (c) => !c.includes(":") && generatedClasses.has(c)
  ).length;
  const nonResponsiveClasses = allClassNames.filter((c) => !c.includes(":")).length;
  result.stats.coverage = nonResponsiveClasses > 0
    ? Math.round((coveredClasses / nonResponsiveClasses) * 100)
    : 100;

  return result;
}

/**
 * Convert sync result to lint errors for consistent output.
 */
export function syncResultToLintErrors(syncResult: SyncResult): LintError[] {
  const errors: LintError[] = [];

  // Invalid prop values
  for (const { prop, value, expectedClass } of syncResult.invalidPropValues) {
    errors.push({
      error_code: "INVALID_PROP_VALUE",
      message: `Prop value '${prop}="${value}"' generates class '${expectedClass}' which is not in whitelist`,
      severity: "error",
      prop,
      received: value,
      expected: [],
      suggested_fix: `Add '${expectedClass}' to ui8kit.map.json or remove from propsMap`,
      autofix_available: false,
      rule_id: "ui8kit/whitelist-sync",
    });
  }

  // Duplicates
  for (const { prop, value, count } of syncResult.duplicates) {
    errors.push({
      error_code: "DUPLICATE_PROP",
      message: `Duplicate value '${value}' in prop '${prop}' (appears ${count} times)`,
      severity: "warning",
      prop,
      received: `${value} (x${count})`,
      expected: [`${value} (once)`],
      suggested_fix: `Remove duplicate '${value}' from propsMap["${prop}"]`,
      autofix_available: true,
      rule_id: "ui8kit/duplicate-prop-value",
    });
  }

  // Typos
  for (const { found, suggestion, location } of syncResult.typos) {
    errors.push({
      error_code: "TYPO_DETECTED",
      message: `Likely typo: '${found}' should be '${suggestion}' (${location})`,
      severity: "error",
      received: found,
      expected: [suggestion],
      closest_match: suggestion,
      suggested_fix: `Replace '${found}' with '${suggestion}'`,
      autofix_available: true,
      rule_id: "ui8kit/typo-in-props",
    });
  }

  return errors;
}

/**
 * Full validation returning LintResult.
 */
export function validateWhitelistSync(
  classMap: ClassMap,
  propsMap: PropsMap
): LintResult {
  const syncResult = syncWhitelist(classMap, propsMap);
  const errors = syncResultToLintErrors(syncResult);

  return {
    valid: syncResult.synced,
    errors,
    summary: {
      errors: errors.filter((e) => e.severity === "error").length,
      warnings: errors.filter((e) => e.severity === "warning").length,
      info: 0,
    },
  };
}
