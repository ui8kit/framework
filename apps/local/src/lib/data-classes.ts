import type { SemanticSelector } from "./semantic-selectors.generated";

type MaybeToken = SemanticSelector | false | null | undefined;

/**
 * Build a `data-classes` string from semantic selector tokens.
 * - stable dedupe (keeps first appearance order)
 * - filters falsy values (supports conditional tokens)
 */
export function dataClasses(...tokens: MaybeToken[]): string {
  const out: string[] = [];
  const seen = new Set<string>();

  for (const t of tokens) {
    if (!t) continue;
    if (seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }

  return out.join(" ");
}

