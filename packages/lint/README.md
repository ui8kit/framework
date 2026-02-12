# @ui8kit/lint

Linting and validation utilities for UI8Kit DSL props. Designed for both human developers and LLM consumption.

## Features

- **Prop Validation**: Validate DSL props against whitelist
- **Typo Detection**: Levenshtein-based closest match suggestions
- **className Validation**: Validate Tailwind classes against whitelist
- **data-class Enforcement**: Ensure className is paired with data-class
- **DSL Flow Validation**: Detect JS loops/conditionals and suggest `<Loop>/<If>`
- **Whitelist Sync**: Check ui8kit.map.json ↔ utility-props.map.ts consistency
- **Multiple Formats**: JSON, pretty console, compact CI, LLM-optimized output

## Installation

```bash
bun add @ui8kit/lint
```

## Usage

### Basic Prop Validation

```typescript
import { validateProps, formatPretty } from "@ui8kit/lint";
import { utilityPropsMap } from "@ui8kit/core";

const result = validateProps(
  { gap: "5", text: "center", bg: "primary" },
  utilityPropsMap
);

if (!result.valid) {
  console.log(formatPretty(result));
}
```

### LLM-Friendly Output

```typescript
import { validateProps, formatForLLM } from "@ui8kit/lint";

const result = validateProps({ gap: "5" }, propsMap);
console.log(formatForLLM(result));
// LINT_ERRORS:
// [{"code":"TYPO_DETECTED","prop":"gap","got":"5","fix":"gap=\"4\"","closest":"4"}]
```

### Single Value Validation

```typescript
import { validatePropValue } from "@ui8kit/lint";

const error = validatePropValue("gap", "5", propsMap);
if (error) {
  console.log(error.closest_match); // "4"
  console.log(error.suggested_fix); // 'gap="4"'
}
```

### className Validation

```typescript
import { validateClassName } from "@ui8kit/lint";

const whitelist = ["flex", "gap-4", "p-2", "bg-primary"];
const result = validateClassName("flex gap-5 p-2", whitelist);
// Error: gap-5 not in whitelist, closest: gap-4
```

### DSL Control Flow Validation

```typescript
import { validateDSL, formatPretty } from "@ui8kit/lint";

const source = `
  <Stack>
    {items.map((item) => <Text>{item.label}</Text>)}
    {isReady ? <Button>Go</Button> : null}
  </Stack>
`;

const result = validateDSL(source, { file: "Example.tsx" });
if (!result.valid) {
  console.log(formatPretty(result));
  // Suggests rewriting map/ternary to <Loop>/<If>
}
```

CLI:

```bash
# Default target: apps/engine/src
bun run packages/lint/src/cli/validate-dsl.ts

# Explicit target
bun run packages/lint/src/cli/validate-dsl.ts apps/engine/src/routes

# JSON output for tooling/LLM
bun run packages/lint/src/cli/validate-dsl.ts apps/engine/src --json
```

### Whitelist Sync Check

```typescript
import { validateWhitelistSync } from "@ui8kit/lint";
import classMap from "./ui8kit.map.json";
import { utilityPropsMap } from "./utility-props.map";

const result = validateWhitelistSync(classMap, utilityPropsMap);
if (!result.valid) {
  // Props generate classes not in whitelist
  // Or duplicates detected
}
```

## Error Format

All errors follow a structured format for machine processing:

```typescript
interface LintError {
  error_code: string;       // INVALID_PROP_VALUE, UNKNOWN_PROP, etc.
  message: string;          // Human-readable description
  severity: "error" | "warning" | "info";
  prop?: string;            // Prop name (gap, text, bg...)
  received: string;         // What was provided
  expected: string[];       // Valid values
  closest_match?: string;   // Levenshtein suggestion
  suggested_fix: string;    // Ready-to-apply fix
  autofix_available: boolean;
  rule_id: string;          // For ignore comments
  location?: { file, line, column };
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `INVALID_PROP_VALUE` | Value not in whitelist |
| `UNKNOWN_PROP` | Prop doesn't exist |
| `TYPO_DETECTED` | Likely typo, closest match found |
| `CLASSNAME_IN_PRIMITIVE` | className in UI primitive |
| `CLASSNAME_WITHOUT_DATACLASS` | className without data-class |
| `RESPONSIVE_IN_PROP` | Responsive modifier in prop |
| `DUPLICATE_PROP` | Same value appears multiple times |
| `INVALID_CLASS` | Class not in whitelist |
| `NON_DSL_LOOP` | JS loop in JSX (prefer `<Loop>`) |
| `NON_DSL_CONDITIONAL` | JS conditional in JSX (prefer `<If>`) |
| `UNWRAPPED_VAR` | `<Var>` not wrapped in `<If>` |
| `VAR_DIRECT_CHILD_OF_IF` | `<If>` wraps `<Var>` directly; use `<If><Wrapper><Var /></Wrapper></If>` |

## Output Formats

```typescript
import {
  formatJson,        // Full JSON (machine-readable)
  formatJsonCompact, // One JSON per line
  formatPretty,      // Console with colors
  formatCompact,     // Single line (CI)
  formatForLLM,      // Minimal tokens for LLM
} from "@ui8kit/lint";
```

## Levenshtein Utilities

```typescript
import { levenshtein, findClosestMatch, findAllMatches } from "@ui8kit/lint";

levenshtein("center", "cente"); // 1

findClosestMatch("cente", ["center", "left", "right"]); // "center"

findAllMatches("gap-3", ["gap-2", "gap-4", "gap-6"], 2);
// [{ value: "gap-2", distance: 1 }, { value: "gap-4", distance: 1 }]
```

## License

MIT
