/**
 * UI8Kit Lint - Levenshtein Distance
 * 
 * Fast implementation for finding closest matches on typos.
 */

/**
 * Calculate Levenshtein distance between two strings.
 * Uses optimized single-row DP approach.
 */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  // Ensure a is the shorter string for memory optimization
  if (a.length > b.length) {
    [a, b] = [b, a];
  }

  const aLen = a.length;
  const bLen = b.length;

  // Single row DP
  let prev = new Array(aLen + 1);
  let curr = new Array(aLen + 1);

  // Initialize first row
  for (let i = 0; i <= aLen; i++) {
    prev[i] = i;
  }

  // Fill matrix
  for (let j = 1; j <= bLen; j++) {
    curr[0] = j;

    for (let i = 1; i <= aLen; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[i] = Math.min(
        prev[i] + 1,      // deletion
        curr[i - 1] + 1,  // insertion
        prev[i - 1] + cost // substitution
      );
    }

    // Swap rows
    [prev, curr] = [curr, prev];
  }

  return prev[aLen];
}

/**
 * Find the closest match from a list of candidates.
 * Returns null if no candidate is within the threshold.
 * 
 * @param input - The input string to match
 * @param candidates - List of valid candidates
 * @param maxDistance - Maximum allowed distance (default: 3)
 * @returns Closest match or null
 */
export function findClosestMatch(
  input: string,
  candidates: readonly string[],
  maxDistance: number = 3
): string | null {
  if (candidates.length === 0) return null;
  if (candidates.includes(input)) return input;

  let closest: string | null = null;
  let minDistance = Infinity;

  for (const candidate of candidates) {
    // Skip empty candidates
    if (!candidate) continue;
    
    // Early exit for exact prefix/suffix matches
    if (candidate.startsWith(input) || input.startsWith(candidate)) {
      const dist = Math.abs(candidate.length - input.length);
      if (dist < minDistance && dist <= maxDistance) {
        minDistance = dist;
        closest = candidate;
      }
      continue;
    }

    const distance = levenshtein(input, candidate);
    
    if (distance < minDistance && distance <= maxDistance) {
      minDistance = distance;
      closest = candidate;
    }
  }

  return closest;
}

/**
 * Find all matches within threshold, sorted by distance.
 * 
 * @param input - The input string to match
 * @param candidates - List of valid candidates
 * @param maxDistance - Maximum allowed distance (default: 3)
 * @returns Array of matches with distances, sorted ascending
 */
export function findAllMatches(
  input: string,
  candidates: readonly string[],
  maxDistance: number = 3
): Array<{ value: string; distance: number }> {
  const matches: Array<{ value: string; distance: number }> = [];

  for (const candidate of candidates) {
    if (!candidate) continue;
    
    const distance = levenshtein(input, candidate);
    
    if (distance <= maxDistance) {
      matches.push({ value: candidate, distance });
    }
  }

  return matches.sort((a, b) => a.distance - b.distance);
}
