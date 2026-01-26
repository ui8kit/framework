import { describe, it, expect } from "vitest";
import {
  syncWhitelist,
  syncResultToLintErrors,
  validateWhitelistSync,
} from "./whitelist-sync";
import type { PropsMap, ClassMap } from "./whitelist-sync";

const mockClassMap: ClassMap = {
  "flex": "display: flex;",
  "flex-col": "flex-direction: column;",
  "flex-row": "flex-direction: row;",
  "gap-0": "gap: 0;",
  "gap-2": "gap: 0.5rem;",
  "gap-4": "gap: 1rem;",
  "gap-6": "gap: 1.5rem;",
  "p-2": "padding: 0.5rem;",
  "p-4": "padding: 1rem;",
  "text-center": "text-align: center;",
  "text-lg": "font-size: 1.125rem;",
  "md:gap-4": "@media (min-width: 768px) { gap: 1rem; }",
};

const mockPropsMap: PropsMap = {
  flex: ["", "col", "row"],
  gap: ["0", "2", "4", "6"],
  p: ["2", "4"],
  text: ["center", "lg"],
};

describe("syncWhitelist", () => {
  it("reports synced when all props match classes", () => {
    const result = syncWhitelist(mockClassMap, mockPropsMap);
    expect(result.synced).toBe(true);
    expect(result.invalidPropValues).toHaveLength(0);
  });

  it("detects invalid prop values", () => {
    const propsWithInvalid: PropsMap = {
      ...mockPropsMap,
      gap: ["0", "2", "3", "4"], // gap-3 doesn't exist
    };
    
    const result = syncWhitelist(mockClassMap, propsWithInvalid);
    expect(result.synced).toBe(false);
    expect(result.invalidPropValues).toContainEqual({
      prop: "gap",
      value: "3",
      expectedClass: "gap-3",
    });
  });

  it("detects duplicate values", () => {
    const propsWithDupes: PropsMap = {
      gap: ["0", "2", "4", "2"], // duplicate "2"
    };
    
    const result = syncWhitelist(mockClassMap, propsWithDupes);
    expect(result.synced).toBe(false);
    expect(result.duplicates).toHaveLength(1);
    expect(result.duplicates[0]).toMatchObject({
      prop: "gap",
      value: "2",
      count: 2,
    });
  });

  it("finds classes not covered by props", () => {
    const limitedProps: PropsMap = {
      flex: ["", "col"],
      // Missing gap, p, text
    };
    
    const result = syncWhitelist(mockClassMap, limitedProps);
    expect(result.missingInProps).toContain("gap-0");
    expect(result.missingInProps).toContain("p-2");
    expect(result.missingInProps).toContain("text-center");
  });

  it("ignores responsive classes in missing check", () => {
    const result = syncWhitelist(mockClassMap, mockPropsMap);
    expect(result.missingInProps).not.toContain("md:gap-4");
  });

  it("calculates coverage correctly", () => {
    const result = syncWhitelist(mockClassMap, mockPropsMap);
    // All non-responsive classes should be covered
    expect(result.stats.coverage).toBe(100);
  });

  it("reports stats correctly", () => {
    const result = syncWhitelist(mockClassMap, mockPropsMap);
    expect(result.stats.totalClasses).toBe(12); // including md:gap-4
    expect(result.stats.totalProps).toBe(4);
    expect(result.stats.totalPropValues).toBe(11); // 3 + 4 + 2 + 2
  });
});

describe("syncResultToLintErrors", () => {
  it("converts invalid prop values to errors", () => {
    const syncResult = {
      synced: false,
      missingInProps: [],
      invalidPropValues: [{ prop: "gap", value: "3", expectedClass: "gap-3" }],
      duplicates: [],
      typos: [],
      stats: { totalClasses: 0, totalProps: 0, totalPropValues: 0, coverage: 0 },
    };
    
    const errors = syncResultToLintErrors(syncResult);
    expect(errors).toHaveLength(1);
    expect(errors[0].error_code).toBe("INVALID_PROP_VALUE");
    expect(errors[0].prop).toBe("gap");
  });

  it("converts duplicates to warnings", () => {
    const syncResult = {
      synced: false,
      missingInProps: [],
      invalidPropValues: [],
      duplicates: [{ prop: "gap", value: "2", count: 2 }],
      typos: [],
      stats: { totalClasses: 0, totalProps: 0, totalPropValues: 0, coverage: 0 },
    };
    
    const errors = syncResultToLintErrors(syncResult);
    expect(errors).toHaveLength(1);
    expect(errors[0].error_code).toBe("DUPLICATE_PROP");
    expect(errors[0].severity).toBe("warning");
  });

  it("converts typos to errors with suggestions", () => {
    const syncResult = {
      synced: false,
      missingInProps: [],
      invalidPropValues: [],
      duplicates: [],
      typos: [{ found: "gap-5", suggestion: "gap-4", location: 'propsMap["gap"]' }],
      stats: { totalClasses: 0, totalProps: 0, totalPropValues: 0, coverage: 0 },
    };
    
    const errors = syncResultToLintErrors(syncResult);
    expect(errors).toHaveLength(1);
    expect(errors[0].error_code).toBe("TYPO_DETECTED");
    expect(errors[0].closest_match).toBe("gap-4");
    expect(errors[0].autofix_available).toBe(true);
  });
});

describe("validateWhitelistSync", () => {
  it("returns valid result when synced", () => {
    const result = validateWhitelistSync(mockClassMap, mockPropsMap);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("returns errors when not synced", () => {
    const propsWithInvalid: PropsMap = {
      gap: ["0", "2", "3", "4"],
    };
    
    const result = validateWhitelistSync(mockClassMap, propsWithInvalid);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
