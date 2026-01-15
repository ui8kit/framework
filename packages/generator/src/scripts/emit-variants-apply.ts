import { readdir, readFile } from "node:fs/promises";
import { basename, join } from "node:path";
import ts from "typescript";

export interface EmitVariantsApplyCssOptions {
  /**
   * Absolute path to variants directory (e.g. .../apps/local/src/variants)
   */
  variantsDir: string;
}

type Tokens = string[];

type Entity = {
  baseTokens: Tokens;
  rules: Map<string, Tokens>; // selector -> tokens
};

const OMIT_KEY_FOR: Record<string, true> = {
  variant: true,
  size: true,
  rounded: true,
  intent: true,
  tone: true,
  state: true,
};

const ENTITY_AGGREGATORS = new Set([
  "Style",
  "Size",
  "Variant",
  "Content",
  "ContentAlign",
  "Base",
  "Fit",
  "Position",
  "AspectRatio",
]);

function kebabCase(input: string): string {
  return input
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/_/g, "-")
    .toLowerCase();
}

function splitTokens(s: string): string[] {
  return s
    .trim()
    .split(/\s+/g)
    .map((t) => t.trim())
    .filter(Boolean);
}

function stableDedupe(tokens: string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const t of tokens) {
    if (!t) continue;
    if (seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out;
}

function getStringLiteral(node: ts.Expression | undefined): string | undefined {
  if (!node) return undefined;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  return undefined;
}

function getObjectProperty(obj: ts.ObjectLiteralExpression, name: string): ts.ObjectLiteralElementLike | undefined {
  return obj.properties.find((p) => {
    if (!ts.isPropertyAssignment(p)) return false;
    const key = p.name;
    if (ts.isIdentifier(key)) return key.text === name;
    if (ts.isStringLiteral(key)) return key.text === name;
    return false;
  });
}

function readExportedStringConst(sourceFile: ts.SourceFile, constName: string): string | undefined {
  for (const stmt of sourceFile.statements) {
    if (!ts.isVariableStatement(stmt)) continue;
    const isExported = stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
    if (!isExported) continue;
    for (const decl of stmt.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name)) continue;
      if (decl.name.text !== constName) continue;
      return getStringLiteral(decl.initializer);
    }
  }
  return undefined;
}

function isCvaCall(expr: ts.Expression): expr is ts.CallExpression {
  if (!ts.isCallExpression(expr)) return false;
  // cva(...) or something.cva(...)
  if (ts.isIdentifier(expr.expression)) return expr.expression.text === "cva";
  if (ts.isPropertyAccessExpression(expr.expression)) return expr.expression.name.text === "cva";
  return false;
}

function deriveEntityName(
  semanticPrefix: string,
  exportConstName: string
): string {
  const baseName = exportConstName.replace(/Variants$/i, "");
  // If export starts with prefix and suffix is one of the common aggregators, collapse to prefix.
  if (baseName.startsWith(semanticPrefix)) {
    const rest = baseName.slice(semanticPrefix.length);
    if (ENTITY_AGGREGATORS.has(rest)) return semanticPrefix;
  }
  return kebabCase(baseName);
}

export async function emitVariantsApplyCss(options: EmitVariantsApplyCssOptions): Promise<string> {
  const { variantsDir } = options;
  const entries = await readdir(variantsDir);
  const variantFiles = entries
    .filter((f) => f.toLowerCase().endsWith(".ts"))
    .filter((f) => f.toLowerCase() !== "index.ts")
    .sort();

  const entities = new Map<string, Entity>();

  for (const fileName of variantFiles) {
    const absPath = join(variantsDir, fileName);
    const code = await readFile(absPath, "utf-8");
    const sf = ts.createSourceFile(absPath, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

    const defaultPrefix = basename(fileName).replace(/\.ts$/i, "");
    const semanticPrefix = readExportedStringConst(sf, "semanticPrefix") ?? defaultPrefix;

    for (const stmt of sf.statements) {
      if (!ts.isVariableStatement(stmt)) continue;
      const isExported = stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
      if (!isExported) continue;

      for (const decl of stmt.declarationList.declarations) {
        if (!ts.isIdentifier(decl.name)) continue;
        const exportName = decl.name.text;
        const init = decl.initializer;
        if (!init || !isCvaCall(init)) continue;

        const entityName = deriveEntityName(semanticPrefix, exportName);
        const entity = entities.get(entityName) ?? { baseTokens: [], rules: new Map() };
        entities.set(entityName, entity);

        // Base tokens (arg0)
        const base = getStringLiteral(init.arguments[0]) ?? "";
        entity.baseTokens.push(...splitTokens(base));

        // Options (arg1)
        const optsNode = init.arguments[1];
        if (!optsNode || !ts.isObjectLiteralExpression(optsNode)) continue;

        // Collect variants mappings: key -> valueKey -> tokens
        const variantsProp = getObjectProperty(optsNode, "variants");
        const defaultVariantsProp = getObjectProperty(optsNode, "defaultVariants");

        const defaultVariants: Record<string, string> = {};
        if (defaultVariantsProp && ts.isPropertyAssignment(defaultVariantsProp) && ts.isObjectLiteralExpression(defaultVariantsProp.initializer)) {
          for (const p of defaultVariantsProp.initializer.properties) {
            if (!ts.isPropertyAssignment(p)) continue;
            const k = ts.isIdentifier(p.name) ? p.name.text : ts.isStringLiteral(p.name) ? p.name.text : undefined;
            const v = getStringLiteral(p.initializer);
            if (k && v) defaultVariants[k] = v;
          }
        }

        if (!variantsProp || !ts.isPropertyAssignment(variantsProp) || !ts.isObjectLiteralExpression(variantsProp.initializer)) {
          continue;
        }

        for (const variantGroup of variantsProp.initializer.properties) {
          if (!ts.isPropertyAssignment(variantGroup)) continue;
          const variantKey =
            ts.isIdentifier(variantGroup.name) ? variantGroup.name.text :
            ts.isStringLiteral(variantGroup.name) ? variantGroup.name.text :
            undefined;
          if (!variantKey) continue;
          if (!ts.isObjectLiteralExpression(variantGroup.initializer)) continue;

          for (const valueEntry of variantGroup.initializer.properties) {
            if (!ts.isPropertyAssignment(valueEntry)) continue;
            const valueKey =
              ts.isIdentifier(valueEntry.name) ? valueEntry.name.text :
              ts.isStringLiteral(valueEntry.name) ? valueEntry.name.text :
              undefined;
            if (!valueKey) continue;

            const classString = getStringLiteral(valueEntry.initializer) ?? "";
            const valueTokens = splitTokens(classString);

            // Include default variant tokens into the entity base.
            if ((defaultVariants[variantKey] ?? "default") === valueKey) {
              entity.baseTokens.push(...valueTokens);
              continue;
            }

            if (valueTokens.length === 0) continue;

            const suffix =
              OMIT_KEY_FOR[variantKey] ? valueKey : `${variantKey}-${valueKey}`;
            const selector = `${entityName}-${suffix}`;

            const existing = entity.rules.get(selector) ?? [];
            existing.push(...valueTokens);
            entity.rules.set(selector, existing);
          }
        }
      }
    }
  }

  // Build CSS
  const cssRules: string[] = [];
  const entityNames = Array.from(entities.keys()).sort();

  for (const entityName of entityNames) {
    const e = entities.get(entityName)!;
    const baseTokens = stableDedupe(e.baseTokens);
    if (baseTokens.length) {
      cssRules.push(`.${entityName} {\n  @apply ${baseTokens.join(" ")};\n}`);
    }

    const selectors = Array.from(e.rules.keys()).sort();
    for (const sel of selectors) {
      const tokens = stableDedupe(e.rules.get(sel)!);
      if (!tokens.length) continue;
      cssRules.push(`.${sel} {\n  @apply ${tokens.join(" ")};\n}`);
    }
  }

  const header = `/*
 * Generated by @ui8kit/generator - variants.apply.css
 * Do not edit manually - this file is auto-generated
 * Generated on: ${new Date().toISOString()}
 */

`;

  return header + cssRules.join("\n\n") + "\n";
}

