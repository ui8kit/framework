import { describe, it, expect } from "vitest";
import {
  validatePropValue,
  validateProps,
  validateClassName,
  validateDataClass,
} from "./validator";
import type { PropsMap } from "./types";

// Mock props map for testing
const mockPropsMap: PropsMap = {
  gap: ["0", "1", "2", "4", "6", "8", "10", "12"],
  flex: ["", "1", "col", "row", "wrap"],
  text: ["xs", "sm", "base", "lg", "xl", "center", "left", "right"],
  bg: ["primary", "secondary", "muted", "card"],
  p: ["0", "1", "2", "4", "6", "8"],
  items: ["start", "center", "end", "stretch"],
};

describe("validatePropValue", () => {
  it("returns null for valid prop values", () => {
    expect(validatePropValue("gap", "4", mockPropsMap)).toBeNull();
    expect(validatePropValue("text", "center", mockPropsMap)).toBeNull();
    expect(validatePropValue("bg", "primary", mockPropsMap)).toBeNull();
  });

  it("returns null for null/undefined/false values", () => {
    expect(validatePropValue("gap", null, mockPropsMap)).toBeNull();
    expect(validatePropValue("gap", undefined, mockPropsMap)).toBeNull();
    expect(validatePropValue("gap", false, mockPropsMap)).toBeNull();
  });

  it("returns null for valid boolean true (bare token)", () => {
    expect(validatePropValue("flex", true, mockPropsMap)).toBeNull();
  });

  it("returns error for invalid boolean true on non-bare props", () => {
    const error = validatePropValue("gap", true, mockPropsMap);
    expect(error).not.toBeNull();
    expect(error?.error_code).toBe("INVALID_PROP_VALUE");
  });

  it("returns error for invalid prop value", () => {
    const error = validatePropValue("gap", "5", mockPropsMap);
    expect(error).not.toBeNull();
    expect(error?.error_code).toBe("TYPO_DETECTED");
    expect(error?.received).toBe("5");
    // All single-digit gaps are distance 1 from "5", closest_match can be any of them
    expect(error?.closest_match).toBeDefined();
    expect(mockPropsMap.gap).toContain(error?.closest_match);
    expect(error?.autofix_available).toBe(true);
  });

  it("returns error for unknown prop", () => {
    const error = validatePropValue("gapp", "4", mockPropsMap);
    expect(error).not.toBeNull();
    expect(error?.error_code).toBe("UNKNOWN_PROP");
    expect(error?.closest_match).toBe("gap");
  });

  it("detects responsive modifiers in props", () => {
    const error = validatePropValue("gap", "4 md:6", mockPropsMap);
    expect(error).not.toBeNull();
    expect(error?.error_code).toBe("RESPONSIVE_IN_PROP");
  });

  it("handles numeric values", () => {
    expect(validatePropValue("gap", 4, mockPropsMap)).toBeNull();
    expect(validatePropValue("gap", 5, mockPropsMap)).not.toBeNull();
  });

  it("includes location when file is provided", () => {
    const error = validatePropValue("gap", "5", mockPropsMap, {
      file: "test.tsx",
      lineOffset: 10,
    });
    expect(error?.location).toEqual({ file: "test.tsx", line: 10, column: 1 });
  });
});

describe("validateProps", () => {
  it("returns valid result for all valid props", () => {
    const result = validateProps(
      { gap: "4", text: "center", bg: "primary" },
      mockPropsMap
    );
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("returns errors for invalid props", () => {
    const result = validateProps(
      { gap: "5", gapp: "4", text: "center" },
      mockPropsMap
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(2);
    expect(result.summary.errors).toBe(2);
  });

  it("handles mixed valid and invalid props", () => {
    const result = validateProps(
      { gap: "4", text: "invalid", bg: "primary" },
      mockPropsMap
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].prop).toBe("text");
  });

  it("skips null/undefined values", () => {
    const result = validateProps(
      { gap: null, text: undefined, bg: "primary" },
      mockPropsMap
    );
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

describe("validateClassName", () => {
  const whitelist = ["flex", "gap-4", "p-2", "bg-primary", "text-center"];

  it("returns valid for all whitelisted classes", () => {
    const result = validateClassName("flex gap-4 p-2", whitelist);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("returns error for non-whitelisted classes", () => {
    const result = validateClassName("flex gap-5 p-2", whitelist);
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].received).toBe("gap-5");
  });

  it("finds closest match for typos", () => {
    const result = validateClassName("flx gap-4", whitelist);
    expect(result.errors[0].closest_match).toBe("flex");
  });

  it("handles empty className", () => {
    const result = validateClassName("", whitelist);
    expect(result.valid).toBe(true);
  });

  it("handles multiple spaces", () => {
    const result = validateClassName("flex   gap-4  p-2", whitelist);
    expect(result.valid).toBe(true);
  });
});

describe("validateDataClass", () => {
  it("returns error for className in primitive", () => {
    const error = validateDataClass(true, false, true);
    expect(error).not.toBeNull();
    expect(error?.error_code).toBe("CLASSNAME_IN_PRIMITIVE");
  });

  it("returns error for className without data-class in composite", () => {
    const error = validateDataClass(true, false, false);
    expect(error).not.toBeNull();
    expect(error?.error_code).toBe("CLASSNAME_WITHOUT_DATACLASS");
  });

  it("returns null when className has data-class", () => {
    const error = validateDataClass(true, true, false);
    expect(error).toBeNull();
  });

  it("returns null when no className", () => {
    const error = validateDataClass(false, false, false);
    expect(error).toBeNull();
  });

  it("returns null for primitive without className", () => {
    const error = validateDataClass(false, false, true);
    expect(error).toBeNull();
  });
});
