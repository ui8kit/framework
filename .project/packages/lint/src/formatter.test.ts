import { describe, it, expect } from "vitest";
import {
  formatJson,
  formatJsonCompact,
  formatPretty,
  formatCompact,
  formatForLLM,
  formatSingleError,
  getQuickFix,
  getAllQuickFixes,
} from "./formatter";
import type { LintResult, LintError } from "./types";

const mockError: LintError = {
  error_code: "INVALID_PROP_VALUE",
  message: "Invalid value '5' for prop 'gap'",
  severity: "error",
  prop: "gap",
  received: "5",
  expected: ["0", "1", "2", "4", "6", "8"],
  closest_match: "4",
  suggested_fix: 'gap="4"',
  autofix_available: true,
  rule_id: "ui8kit/invalid-prop-value",
  location: { file: "test.tsx", line: 10, column: 5 },
};

const mockResult: LintResult = {
  valid: false,
  errors: [mockError],
  summary: { errors: 1, warnings: 0, info: 0 },
};

const validResult: LintResult = {
  valid: true,
  errors: [],
  summary: { errors: 0, warnings: 0, info: 0 },
};

describe("formatJson", () => {
  it("returns formatted JSON string", () => {
    const json = formatJson(mockResult);
    expect(() => JSON.parse(json)).not.toThrow();
    expect(JSON.parse(json)).toEqual(mockResult);
  });

  it("handles empty errors", () => {
    const json = formatJson(validResult);
    const parsed = JSON.parse(json);
    expect(parsed.valid).toBe(true);
  });
});

describe("formatJsonCompact", () => {
  it("returns one JSON object per line", () => {
    const output = formatJsonCompact(mockResult);
    const lines = output.split("\n");
    expect(lines).toHaveLength(1);
    expect(() => JSON.parse(lines[0])).not.toThrow();
  });

  it("returns empty string for valid result", () => {
    const output = formatJsonCompact(validResult);
    expect(output).toBe("");
  });
});

describe("formatPretty", () => {
  it("returns success message for valid result", () => {
    const output = formatPretty(validResult);
    expect(output).toContain("No errors found");
  });

  it("includes error details", () => {
    const output = formatPretty(mockResult);
    expect(output).toContain("INVALID_PROP_VALUE");
    expect(output).toContain("test.tsx:10:5");
    expect(output).toContain('gap="4"');
  });

  it("includes suggestion when available", () => {
    const output = formatPretty(mockResult);
    expect(output).toContain("4");
  });
});

describe("formatCompact", () => {
  it("returns empty string for valid result", () => {
    const output = formatCompact(validResult);
    expect(output).toBe("");
  });

  it("returns single line per error", () => {
    const output = formatCompact(mockResult);
    expect(output).toContain("test.tsx:10:5");
    expect(output).toContain("INVALID_PROP_VALUE");
  });
});

describe("formatForLLM", () => {
  it("returns LINT_OK for valid result", () => {
    const output = formatForLLM(validResult);
    expect(output).toBe("LINT_OK");
  });

  it("returns minimal JSON for errors", () => {
    const output = formatForLLM(mockResult);
    expect(output).toContain("LINT_ERRORS");
    expect(output).toContain("gap");
    // Check the fix is included (escaped quotes in JSON)
    expect(output).toContain('gap=\\"4\\"');
  });
});

describe("formatSingleError", () => {
  it("formats error with all parts", () => {
    const output = formatSingleError(mockError);
    expect(output).toContain("INVALID_PROP_VALUE");
    expect(output).toContain("Did you mean: 4?");
    expect(output).toContain('gap="4"');
  });
});

describe("getQuickFix", () => {
  it("returns fix when available", () => {
    expect(getQuickFix(mockError)).toBe('gap="4"');
  });

  it("returns null when not available", () => {
    const errorNoFix = { ...mockError, autofix_available: false };
    expect(getQuickFix(errorNoFix)).toBeNull();
  });
});

describe("getAllQuickFixes", () => {
  it("returns all fixable errors", () => {
    const fixes = getAllQuickFixes(mockResult);
    expect(fixes).toHaveLength(1);
    expect(fixes[0].fix).toBe('gap="4"');
    expect(fixes[0].original).toBe("5");
  });

  it("returns empty array for valid result", () => {
    const fixes = getAllQuickFixes(validResult);
    expect(fixes).toHaveLength(0);
  });
});
