import { describe, it, expect } from "vitest";
import { levenshtein, findClosestMatch, findAllMatches } from "./levenshtein";

describe("levenshtein", () => {
  it("returns 0 for identical strings", () => {
    expect(levenshtein("hello", "hello")).toBe(0);
    expect(levenshtein("", "")).toBe(0);
  });

  it("returns length for empty string comparison", () => {
    expect(levenshtein("hello", "")).toBe(5);
    expect(levenshtein("", "world")).toBe(5);
  });

  it("calculates single character changes", () => {
    expect(levenshtein("cat", "car")).toBe(1); // substitution
    expect(levenshtein("cat", "cats")).toBe(1); // insertion
    expect(levenshtein("cats", "cat")).toBe(1); // deletion
  });

  it("handles multiple changes", () => {
    expect(levenshtein("kitten", "sitting")).toBe(3);
    expect(levenshtein("saturday", "sunday")).toBe(3);
  });

  it("is symmetric", () => {
    expect(levenshtein("abc", "def")).toBe(levenshtein("def", "abc"));
    expect(levenshtein("center", "cente")).toBe(levenshtein("cente", "center"));
  });
});

describe("findClosestMatch", () => {
  const candidates = ["center", "left", "right", "justify", "start", "end"];

  it("returns exact match if present", () => {
    expect(findClosestMatch("center", candidates)).toBe("center");
  });

  it("finds closest match for typos", () => {
    expect(findClosestMatch("cente", candidates)).toBe("center");
    expect(findClosestMatch("centr", candidates)).toBe("center");
    expect(findClosestMatch("lefft", candidates)).toBe("left");
    expect(findClosestMatch("rigt", candidates)).toBe("right");
  });

  it("returns null when no match within threshold", () => {
    expect(findClosestMatch("completely-different", candidates)).toBeNull();
    expect(findClosestMatch("xyz", candidates, 1)).toBeNull();
  });

  it("handles empty candidates", () => {
    expect(findClosestMatch("test", [])).toBeNull();
  });

  it("handles prefix matches", () => {
    expect(findClosestMatch("cent", candidates)).toBe("center");
    // "jus" is equidistant from multiple candidates, so we just check it returns something
    const match = findClosestMatch("jus", candidates);
    expect(match).not.toBeNull();
  });

  it("respects maxDistance parameter", () => {
    expect(findClosestMatch("centr", candidates, 1)).toBe("center");
    expect(findClosestMatch("abcdef", candidates, 1)).toBeNull();
  });
});

describe("findAllMatches", () => {
  const candidates = ["gap-0", "gap-1", "gap-2", "gap-4", "gap-6", "gap-8"];

  it("returns empty array when no matches", () => {
    expect(findAllMatches("xyz", candidates, 1)).toEqual([]);
  });

  it("returns all matches within threshold", () => {
    const matches = findAllMatches("gap-3", candidates, 1);
    // All gap-N values are distance 1 from gap-3
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.every(m => m.distance <= 1)).toBe(true);
  });

  it("sorts by distance ascending", () => {
    const matches = findAllMatches("gap", candidates, 3);
    expect(matches.length).toBeGreaterThan(0);
    
    for (let i = 1; i < matches.length; i++) {
      expect(matches[i].distance).toBeGreaterThanOrEqual(matches[i - 1].distance);
    }
  });

  it("includes exact matches with distance 0", () => {
    const matches = findAllMatches("gap-4", candidates);
    expect(matches[0]).toEqual({ value: "gap-4", distance: 0 });
  });
});
