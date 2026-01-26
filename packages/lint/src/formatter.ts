/**
 * UI8Kit Lint - Error Formatters
 * 
 * Multiple output formats for different consumers:
 * - JSON: Machine-readable for LLM
 * - Pretty: Human-readable for console
 * - Compact: Minimal output for CI
 */

import type { LintError, LintResult } from "./types";

/**
 * Format result as JSON (for LLM consumption)
 */
export function formatJson(result: LintResult): string {
  return JSON.stringify(result, null, 2);
}

/**
 * Format result as compact JSON (single line per error)
 */
export function formatJsonCompact(result: LintResult): string {
  return result.errors.map((e) => JSON.stringify(e)).join("\n");
}

/**
 * Format result for console output with colors
 */
export function formatPretty(result: LintResult): string {
  if (result.valid) {
    return "✓ No errors found";
  }

  const lines: string[] = [];
  
  lines.push(`Found ${result.errors.length} error(s):\n`);

  for (const error of result.errors) {
    const location = error.location
      ? `${error.location.file}:${error.location.line}:${error.location.column}`
      : "unknown";
    
    const icon = error.severity === "error" ? "✗" : error.severity === "warning" ? "⚠" : "ℹ";
    
    lines.push(`${icon} ${error.error_code}`);
    lines.push(`  Location: ${location}`);
    lines.push(`  Message: ${error.message}`);
    lines.push(`  Received: "${error.received}"`);
    
    if (error.closest_match) {
      lines.push(`  Suggestion: "${error.closest_match}"`);
    }
    
    if (error.autofix_available) {
      lines.push(`  Fix: ${error.suggested_fix}`);
    }
    
    lines.push("");
  }

  lines.push(`Summary: ${result.summary.errors} errors, ${result.summary.warnings} warnings`);

  return lines.join("\n");
}

/**
 * Format result as compact single-line errors (for CI)
 */
export function formatCompact(result: LintResult): string {
  if (result.valid) {
    return "";
  }

  return result.errors
    .map((error) => {
      const location = error.location
        ? `${error.location.file}:${error.location.line}:${error.location.column}`
        : "";
      return `${location} ${error.error_code}: ${error.message}`;
    })
    .join("\n");
}

/**
 * Format for LLM prompt injection (minimal tokens)
 */
export function formatForLLM(result: LintResult): string {
  if (result.valid) {
    return "LINT_OK";
  }

  const errors = result.errors.map((e) => ({
    code: e.error_code,
    prop: e.prop,
    got: e.received,
    fix: e.suggested_fix,
    closest: e.closest_match,
  }));

  return `LINT_ERRORS:\n${JSON.stringify(errors)}`;
}

/**
 * Format single error for quick display
 */
export function formatSingleError(error: LintError): string {
  const parts = [error.error_code, error.message];
  
  if (error.closest_match) {
    parts.push(`Did you mean: ${error.closest_match}?`);
  }
  
  if (error.autofix_available) {
    parts.push(`Suggested fix: ${error.suggested_fix}`);
  }

  return parts.join(" | ");
}

/**
 * Get quick fix suggestion from error
 */
export function getQuickFix(error: LintError): string | null {
  if (!error.autofix_available) {
    return null;
  }
  return error.suggested_fix;
}

/**
 * Get all quick fixes from result
 */
export function getAllQuickFixes(result: LintResult): Array<{
  original: string;
  fix: string;
  location?: { file: string; line: number };
}> {
  return result.errors
    .filter((e) => e.autofix_available)
    .map((e) => ({
      original: e.received,
      fix: e.suggested_fix,
      location: e.location ? { file: e.location.file, line: e.location.line } : undefined,
    }));
}
