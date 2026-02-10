/**
 * UI8Kit Lint - Prop Validator
 * 
 * Core validation logic for DSL props.
 */

import type {
  LintError,
  LintResult,
  PropsMap,
  ValidateOptions,
} from "./types";
import { findClosestMatch } from "./levenshtein";

/**
 * Validate a single prop value against the props map.
 */
export function validatePropValue(
  prop: string,
  value: string | number | boolean | null | undefined,
  propsMap: PropsMap,
  options: ValidateOptions = {}
): LintError | null {
  // Skip null/undefined/false values (they're valid - means "don't apply")
  if (value === null || value === undefined || value === false) {
    return null;
  }

  // Check if prop exists
  if (!(prop in propsMap)) {
    const allProps = Object.keys(propsMap);
    const closest = findClosestMatch(prop, allProps);
    
    return {
      error_code: "UNKNOWN_PROP",
      message: `Unknown prop '${prop}'`,
      severity: "error",
      prop,
      received: prop,
      expected: allProps.slice(0, 10), // Show first 10 props
      closest_match: closest ?? undefined,
      suggested_fix: closest ? `${closest}="${value}"` : `Remove ${prop}`,
      autofix_available: !!closest,
      rule_id: "ui8kit/unknown-prop",
      location: options.file ? { file: options.file, line: options.lineOffset ?? 1, column: 1 } : undefined,
    };
  }

  const allowedValues = propsMap[prop];
  
  // Handle boolean true - means bare token (e.g., flex={true} -> "flex")
  if (value === true) {
    // Check if empty string is allowed (bare token)
    if (allowedValues.includes("")) {
      return null;
    }
    return {
      error_code: "INVALID_PROP_VALUE",
      message: `Prop '${prop}' doesn't support bare token (true). Use a value.`,
      severity: "error",
      prop,
      received: "true",
      expected: [...allowedValues],
      closest_match: allowedValues[0] || undefined,
      suggested_fix: `${prop}="${allowedValues[0]}"`,
      autofix_available: true,
      rule_id: "ui8kit/invalid-prop-value",
      location: options.file ? { file: options.file, line: options.lineOffset ?? 1, column: 1 } : undefined,
    };
  }

  // Convert to string for comparison
  const strValue = String(value).trim();
  
  // Empty string check
  if (!strValue) {
    if (allowedValues.includes("")) {
      return null;
    }
    return {
      error_code: "EMPTY_PROP_VALUE",
      message: `Prop '${prop}' requires a value`,
      severity: "error",
      prop,
      received: "",
      expected: [...allowedValues],
      closest_match: allowedValues[0] || undefined,
      suggested_fix: `${prop}="${allowedValues[0]}"`,
      autofix_available: true,
      rule_id: "ui8kit/empty-prop-value",
      location: options.file ? { file: options.file, line: options.lineOffset ?? 1, column: 1 } : undefined,
    };
  }

  // Check for responsive modifiers (e.g., "4 md:6" or "md:gap-6")
  if (strValue.includes(":") || strValue.includes(" ")) {
    return {
      error_code: "RESPONSIVE_IN_PROP",
      message: `Responsive modifiers not allowed in props. Use className for responsive.`,
      severity: "error",
      prop,
      received: strValue,
      expected: [...allowedValues],
      closest_match: undefined,
      suggested_fix: `className="md:${prop}-${strValue.split(" ")[0]}"`,
      autofix_available: false,
      rule_id: "ui8kit/responsive-in-prop",
      location: options.file ? { file: options.file, line: options.lineOffset ?? 1, column: 1 } : undefined,
    };
  }

  // Check if value is allowed
  if (allowedValues.includes(strValue)) {
    return null;
  }

  // Find closest match
  const closest = findClosestMatch(strValue, allowedValues);
  const isTypo = closest !== null;

  return {
    error_code: isTypo ? "TYPO_DETECTED" : "INVALID_PROP_VALUE",
    message: isTypo
      ? `Likely typo in '${prop}="${strValue}"'. Did you mean '${closest}'?`
      : `Invalid value '${strValue}' for prop '${prop}'`,
    severity: "error",
    prop,
    received: strValue,
    expected: [...allowedValues],
    closest_match: closest ?? undefined,
    suggested_fix: closest ? `${prop}="${closest}"` : `Remove ${prop}="${strValue}"`,
    autofix_available: !!closest,
    rule_id: isTypo ? "ui8kit/typo-detected" : "ui8kit/invalid-prop-value",
    location: options.file ? { file: options.file, line: options.lineOffset ?? 1, column: 1 } : undefined,
  };
}

/**
 * Validate multiple props at once.
 */
export function validateProps(
  props: Record<string, unknown>,
  propsMap: PropsMap,
  options: ValidateOptions = {}
): LintResult {
  const errors: LintError[] = [];

  for (const [prop, value] of Object.entries(props)) {
    const error = validatePropValue(prop, value as any, propsMap, options);
    if (error) {
      errors.push(error);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    summary: {
      errors: errors.filter((e) => e.severity === "error").length,
      warnings: errors.filter((e) => e.severity === "warning").length,
      info: errors.filter((e) => e.severity === "info").length,
    },
  };
}

/**
 * Validate a className string against the whitelist.
 */
export function validateClassName(
  className: string,
  whitelist: Set<string> | string[],
  options: ValidateOptions = {}
): LintResult {
  const errors: LintError[] = [];
  const whitelistArray = Array.isArray(whitelist) ? whitelist : [...whitelist];
  const whitelistSet = new Set(whitelistArray);
  
  const classes = className.split(/\s+/).filter(Boolean);

  for (const cls of classes) {
    if (!whitelistSet.has(cls)) {
      const closest = findClosestMatch(cls, whitelistArray);
      
      errors.push({
        error_code: closest ? "TYPO_DETECTED" : "INVALID_CLASS",
        message: closest
          ? `Class '${cls}' not in whitelist. Did you mean '${closest}'?`
          : `Class '${cls}' not in whitelist`,
        severity: "error",
        received: cls,
        expected: whitelistArray.slice(0, 5), // Show first 5 as hint
        closest_match: closest ?? undefined,
        suggested_fix: closest ?? `Remove '${cls}'`,
        autofix_available: !!closest,
        rule_id: "ui8kit/invalid-class",
        location: options.file ? { file: options.file, line: options.lineOffset ?? 1, column: 1 } : undefined,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    summary: {
      errors: errors.filter((e) => e.severity === "error").length,
      warnings: errors.filter((e) => e.severity === "warning").length,
      info: errors.filter((e) => e.severity === "info").length,
    },
  };
}

/**
 * Check if className is used with data-class attribute.
 */
export function validateDataClass(
  hasClassName: boolean,
  hasDataClass: boolean,
  isPrimitive: boolean,
  options: ValidateOptions = {}
): LintError | null {
  // In primitives, className is forbidden
  if (isPrimitive && hasClassName) {
    return {
      error_code: "CLASSNAME_IN_PRIMITIVE",
      message: "className is not allowed in UI primitives. Use utility props instead.",
      severity: "error",
      received: "className",
      expected: ["Use props like gap, p, bg, text instead"],
      suggested_fix: "Convert className to utility props",
      autofix_available: false,
      rule_id: "ui8kit/classname-in-primitive",
      location: options.file ? { file: options.file, line: options.lineOffset ?? 1, column: 1 } : undefined,
    };
  }

  // In composites, className requires data-class
  if (hasClassName && !hasDataClass && !isPrimitive) {
    return {
      error_code: "CLASSNAME_WITHOUT_DATACLASS",
      message: "className requires data-class attribute for semantic markup",
      severity: "error",
      received: "className without data-class",
      expected: ['Add data-class="semantic-name"'],
      suggested_fix: 'Add data-class="component-name"',
      autofix_available: false,
      rule_id: "ui8kit/classname-without-dataclass",
      location: options.file ? { file: options.file, line: options.lineOffset ?? 1, column: 1 } : undefined,
    };
  }

  return null;
}

/**
 * Validate source code for non-DSL conditions/loops in JSX/TSX.
 *
 * This helps guide developers (and LLMs) to prefer @ui8kit/template primitives:
 * - Loop => <Loop each="..." as="...">
 * - Conditions => <If test="...">
 */
export function validateDSL(
  source: string,
  options: ValidateOptions = {}
): LintResult {
  const errors: LintError[] = [];
  const lines = source.split(/\r?\n/);
  const lineOffset = options.lineOffset ?? 0;

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    const trimmed = line.trim();
    const lineNumber = lineOffset + index + 1;

    // JSX loops that are fragile for generator output.
    const hasJsxMapLoop = /\{[^}]*\.(map|forEach)\s*\(/.test(line);
    const hasMultilineMapLoop =
      (trimmed.startsWith(".map(") || trimmed.startsWith(".forEach(")) &&
      index > 0 &&
      lines[index - 1].includes("{");
    if (hasJsxMapLoop || hasMultilineMapLoop) {
      errors.push({
        error_code: "NON_DSL_LOOP",
        message: "Detected JS loop in JSX. Prefer @ui8kit/template <Loop> for stable generation.",
        severity: "warning",
        received: line.trim(),
        expected: ['<Loop each="items" as="item" keyExpr="item.id" data={items}>...</Loop>'],
        suggested_fix: 'Rewrite loop to <Loop each="..." as="..." data={...}>',
        autofix_available: false,
        rule_id: "ui8kit/non-dsl-loop",
        location: options.file
          ? { file: options.file, line: lineNumber, column: 1 }
          : undefined,
      });
    }

    // JSX conditionals that should use DSL primitives.
    const hasTernaryInJsx = /\{[^}]*\?[^}]*:[^}]*\}/.test(line);
    const hasLogicalAndConditionInJsx = /\{[^}]*&&[^}]*\}/.test(line);
    const hasTypeOptionalSyntax =
      trimmed.includes("?:") &&
      !trimmed.includes("{") &&
      !trimmed.includes("}");
    const hasTernary = hasTernaryInJsx && !hasTypeOptionalSyntax;
    const hasLogicalAndCondition = hasLogicalAndConditionInJsx;
    if (hasTernary || hasLogicalAndCondition) {
      errors.push({
        error_code: "NON_DSL_CONDITIONAL",
        message: "Detected JS conditional in JSX. Prefer @ui8kit/template <If> for stable generation.",
        severity: "warning",
        received: line.trim(),
        expected: ['<If test="condition" value={!!condition}>...</If>'],
        suggested_fix: 'Rewrite condition to <If test="..." value={...}>',
        autofix_available: false,
        rule_id: "ui8kit/non-dsl-conditional",
        location: options.file
          ? { file: options.file, line: lineNumber, column: 1 }
          : undefined,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    summary: {
      errors: errors.filter((e) => e.severity === "error").length,
      warnings: errors.filter((e) => e.severity === "warning").length,
      info: errors.filter((e) => e.severity === "info").length,
    },
  };
}
