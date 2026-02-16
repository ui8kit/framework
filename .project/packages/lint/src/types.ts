/**
 * UI8Kit Lint - Type Definitions
 * 
 * Structured error format for machine processing and LLM self-correction.
 */

/** Error severity levels */
export type LintSeverity = "error" | "warning" | "info";

/** Error codes for different validation failures */
export type LintErrorCode =
  | "INVALID_PROP_VALUE"       // Value not in whitelist
  | "UNKNOWN_PROP"             // Prop doesn't exist
  | "CLASSNAME_WITHOUT_DATACLASS" // className without data-class
  | "CLASSNAME_IN_PRIMITIVE"   // className used in UI primitive
  | "RESPONSIVE_IN_PROP"       // Responsive modifier in prop value
  | "DUPLICATE_PROP"           // Same prop specified multiple times
  | "EMPTY_PROP_VALUE"         // Prop with empty/null value
  | "INVALID_CLASS"            // Class not in whitelist (for className validation)
  | "TYPO_DETECTED"            // Likely typo, closest match found
  | "NON_DSL_LOOP"             // JS loops in JSX; prefer <Loop>
  | "NON_DSL_CONDITIONAL"      // JS conditionals in JSX; prefer <If>
  | "UNWRAPPED_VAR"            // Var not wrapped in If; wrap for safe generation
  | "VAR_DIRECT_CHILD_OF_IF";  // If > Var wrong; use If > Wrapper > Var

/** Location in source code */
export interface LintLocation {
  file: string;
  line: number;
  column: number;
}

/** Structured lint error for LLM consumption */
export interface LintError {
  /** Unique error code for categorization */
  error_code: LintErrorCode;
  
  /** Human-readable error message */
  message: string;
  
  /** Severity level */
  severity: LintSeverity;
  
  /** Prop name (if applicable) */
  prop?: string;
  
  /** Received invalid value */
  received: string;
  
  /** Array of valid values */
  expected: string[];
  
  /** Closest valid match (Levenshtein) */
  closest_match?: string;
  
  /** Ready-to-apply fix */
  suggested_fix: string;
  
  /** Whether autofix can be applied */
  autofix_available: boolean;
  
  /** Source location */
  location?: LintLocation;
  
  /** Code context (surrounding lines) */
  context?: string;
  
  /** Rule ID for ignoring */
  rule_id: string;
}

/** Result of validation */
export interface LintResult {
  /** Whether validation passed */
  valid: boolean;
  
  /** Array of errors (empty if valid) */
  errors: LintError[];
  
  /** Number of errors by severity */
  summary: {
    errors: number;
    warnings: number;
    info: number;
  };
}

/** Props map structure: prop -> allowed values */
export type PropsMap = Record<string, readonly string[]>;

/** Validation options */
export interface ValidateOptions {
  /** Strict mode - treat warnings as errors */
  strict?: boolean;
  
  /** File path for location info */
  file?: string;
  
  /** Line number offset */
  lineOffset?: number;
  
  /** Include context in errors */
  includeContext?: boolean;
}
