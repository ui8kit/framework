/**
 * @ui8kit/lint
 * 
 * Linting and validation utilities for UI8Kit DSL props.
 * 
 * Features:
 * - Prop value validation against whitelist
 * - Closest match suggestions for typos (Levenshtein)
 * - className validation against whitelist
 * - data-class requirement enforcement
 * - Whitelist synchronization checking
 * - Multiple output formats (JSON, pretty, compact, LLM)
 * 
 * @example
 * ```typescript
 * import { validateProps, formatForLLM } from "@ui8kit/lint";
 * import { utilityPropsMap } from "@ui8kit/core";
 * 
 * const result = validateProps({ gap: "5", text: "center" }, utilityPropsMap);
 * if (!result.valid) {
 *   console.log(formatForLLM(result));
 *   // LINT_ERRORS:
 *   // [{"code":"TYPO_DETECTED","prop":"gap","got":"5","fix":"gap=\"4\"","closest":"4"}]
 * }
 * ```
 */

// Types
export type {
  LintSeverity,
  LintErrorCode,
  LintLocation,
  LintError,
  LintResult,
  PropsMap,
  ValidateOptions,
} from "./types";

// Levenshtein utilities
export {
  levenshtein,
  findClosestMatch,
  findAllMatches,
} from "./levenshtein";

// Core validation
export {
  validatePropValue,
  validateProps,
  validateClassName,
  validateDataClass,
  validateDSL,
} from "./validator";

// Formatters
export {
  formatJson,
  formatJsonCompact,
  formatPretty,
  formatCompact,
  formatForLLM,
  formatSingleError,
  getQuickFix,
  getAllQuickFixes,
} from "./formatter";

// Whitelist synchronization
export type {
  ClassMap,
  SyncResult,
} from "./whitelist-sync";

export {
  syncWhitelist,
  syncResultToLintErrors,
  validateWhitelistSync,
} from "./whitelist-sync";

// Re-export commonly used type combinations
export type { PropsMap as UtilityPropsMap } from "./types";
