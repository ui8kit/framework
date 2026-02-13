/**
 * UI8Kit Lint - DSL Validation via Babel AST
 *
 * Reliable AST-based validation for @ui8kit/template DSL rules.
 * Uses a pattern table for easy rule extension.
 */

import { parse } from "@babel/parser";
import traverse, { type NodePath } from "@babel/traverse";
import type { JSXElement, JSXExpressionContainer } from "@babel/types";
import type { Node } from "@babel/types";
import type { LintError, LintResult, ValidateOptions } from "./types";

const PARSER_OPTIONS = {
  sourceType: "module" as const,
  plugins: ["jsx", "typescript", "decorators-legacy"] as const,
  errorRecovery: true,
};

// =============================================================================
// Helpers
// =============================================================================

function getLineColumn(source: string, pos: number): { line: number; column: number } {
  const before = source.slice(0, pos);
  const lines = before.split("\n");
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1,
  };
}

function getJsxElementName(node: { name: { name?: string; type: string } }): string | null {
  if (node.name.type === "JSXIdentifier") {
    return node.name.name ?? null;
  }
  return null;
}

function getVarNameAttr(
  node: { attributes: Array<{ type: string; name?: { name: string }; value?: { type: string; value?: string } }> }
): string {
  for (const attr of node.attributes) {
    if (attr.type === "JSXAttribute" && attr.name?.name === "name") {
      if (attr.value?.type === "StringLiteral" && "value" in attr.value) {
        return attr.value.value ?? "";
      }
    }
  }
  return "path";
}

// =============================================================================
// Rule Context
// =============================================================================

export interface RuleContext {
  source: string;
  file?: string;
  lineOffset: number;
  createError: (
    code: LintError["error_code"],
    message: string,
    received: string,
    expected: string[],
    suggestedFix: string,
    node: Node
  ) => LintError;
}

// =============================================================================
// Pattern Table
// =============================================================================

export type DSLRule =
  | {
      id: "NON_DSL_LOOP" | "NON_DSL_CONDITIONAL";
      visitor: "JSXExpressionContainer";
      check: (path: NodePath<JSXExpressionContainer>, ctx: RuleContext) => LintError | null;
    }
  | {
      id: "UNWRAPPED_VAR" | "VAR_DIRECT_CHILD_OF_IF";
      visitor: "JSXElement";
      check: (path: NodePath<JSXElement>, ctx: RuleContext) => LintError | null;
    };

const DSL_RULES: DSLRule[] = [
  {
    id: "NON_DSL_LOOP",
    visitor: "JSXExpressionContainer",
    check: (path, ctx) => {
      const expr = path.node.expression;
      if (expr.type !== "CallExpression") return null;
      const callee = expr.callee;
      if (callee.type !== "MemberExpression" || callee.property.type !== "Identifier") return null;
      const method = callee.property.name;
      if (method !== "map" && method !== "forEach") return null;
      return ctx.createError(
        "NON_DSL_LOOP",
        "Detected JS loop in JSX. Prefer @ui8kit/template <Loop> for stable generation.",
        ctx.source.slice(expr.start ?? 0, expr.end ?? 0).trim(),
        ['<Loop each="items" as="item" keyExpr="item.id" data={items}>...</Loop>'],
        'Rewrite loop to <Loop each="..." as="..." data={...}>',
        expr
      );
    },
  },
  {
    id: "NON_DSL_CONDITIONAL",
    visitor: "JSXExpressionContainer",
    check: (path, ctx) => {
      const expr = path.node.expression;
      if (expr.type === "ConditionalExpression") {
        return ctx.createError(
          "NON_DSL_CONDITIONAL",
          "Detected JS conditional in JSX. Prefer @ui8kit/template <If> for stable generation.",
          ctx.source.slice(expr.start ?? 0, expr.end ?? 0).trim(),
          ['<If test="condition" value={!!condition}>...</If>'],
          'Rewrite condition to <If test="..." value={...}>',
          expr
        );
      }
      if (expr.type === "LogicalExpression" && expr.operator === "&&") {
        return ctx.createError(
          "NON_DSL_CONDITIONAL",
          "Detected JS conditional in JSX. Prefer @ui8kit/template <If> for stable generation.",
          ctx.source.slice(expr.start ?? 0, expr.end ?? 0).trim(),
          ['<If test="condition" value={!!condition}>...</If>'],
          'Rewrite condition to <If test="..." value={...}>',
          expr
        );
      }
      return null;
    },
  },
  {
    id: "VAR_DIRECT_CHILD_OF_IF",
    visitor: "JSXElement",
    check: (path, ctx) => {
      const opening = path.node.openingElement;
      const name = getJsxElementName(opening as any);
      if (name !== "Var") return null;

      const parentPath = path.findParent((p) => p.isJSXElement());
      const parentElement = parentPath?.node as { openingElement?: { name?: { name?: string; type: string } } } | undefined;
      const parentName = parentElement?.openingElement ? getJsxElementName(parentElement.openingElement as any) : null;

      if (parentName !== "If") return null;

      const varName = getVarNameAttr(opening as any);
      return ctx.createError(
        "VAR_DIRECT_CHILD_OF_IF",
        "<Var> should not be direct child of <If>. Wrap Var in a semantic element (Text, Button, etc.): <If><Wrapper><Var /></Wrapper></If>",
        "<If>...<Var ... /></If>",
        [`<If test="${varName}" value={!!(${varName} ?? '')}><Text><Var name="${varName}" value={${varName} ?? ''} /></Text></If>`],
        "Move <If> to wrap the container element; put <Var> inside it",
        path.node
      );
    },
  },
  {
    id: "UNWRAPPED_VAR",
    visitor: "JSXElement",
    check: (path, ctx) => {
      const opening = path.node.openingElement;
      const name = getJsxElementName(opening as any);
      if (name !== "Var") return null;

      const parentPath = path.findParent((p) => p.isJSXElement());
      const parentElement = parentPath?.node as { openingElement?: { name?: { name?: string; type: string } } } | undefined;
      const parentName = parentElement?.openingElement ? getJsxElementName(parentElement.openingElement as any) : null;

      const hasIfAncestor = path.findParent((p) => {
        if (!p.isJSXElement()) return false;
        const n = getJsxElementName((p.node as any).openingElement);
        return n === "If";
      });

      if (hasIfAncestor) return null;
      if (parentName === "If") return null;

      const varName = getVarNameAttr(opening as any);
      return ctx.createError(
        "UNWRAPPED_VAR",
        "<Var> should be wrapped in <If> for optional values.",
        "<Var ... />",
        [`<If test="${varName}" value={!!(${varName} ?? '')}><Var name="${varName}" value={${varName} ?? ''} /></If>`],
        `Wrap in <If test="${varName}" value={!!(${varName} ?? '')}>`,
        path.node
      );
    },
  },
];

// =============================================================================
// Main Validation
// =============================================================================

/**
 * Validate DSL rules using Babel AST.
 * Only checks nodes inside JSX (component return trees), not in type/interface definitions.
 */
export function validateDSLWithAST(
  source: string,
  options: ValidateOptions = {}
): LintResult {
  const errors: LintError[] = [];
  const file = options.file;
  const lineOffset = options.lineOffset ?? 0;

  const createError = (
    code: LintError["error_code"],
    message: string,
    received: string,
    expected: string[],
    suggestedFix: string,
    node: Node
  ): LintError => {
    const pos = node.start ?? 0;
    const { line, column } = getLineColumn(source, pos);
    return {
      error_code: code,
      message,
      severity: "warning",
      received,
      expected,
      suggested_fix: suggestedFix,
      autofix_available: false,
      rule_id: `ui8kit/${code.toLowerCase().replace(/_/g, "-")}`,
      location: file ? { file, line: line + lineOffset, column } : undefined,
    };
  };

  const ctx: RuleContext = {
    source,
    file,
    lineOffset,
    createError,
  };

  const rulesByVisitor = {
    JSXExpressionContainer: DSL_RULES.filter((r): r is DSLRule & { visitor: "JSXExpressionContainer" } =>
      r.visitor === "JSXExpressionContainer"
    ),
    JSXElement: DSL_RULES.filter((r): r is DSLRule & { visitor: "JSXElement" } => r.visitor === "JSXElement"),
  };

  let ast;
  try {
    ast = parse(source, PARSER_OPTIONS as any);
  } catch {
    return {
      valid: true,
      errors: [],
      summary: { errors: 0, warnings: 0, info: 0 },
    };
  }

  traverse(ast, {
    JSXExpressionContainer(path) {
      for (const rule of rulesByVisitor.JSXExpressionContainer) {
        const err = rule.check(path as NodePath<JSXExpressionContainer>, ctx);
        if (err) errors.push(err);
      }
    },
    JSXElement(path) {
      for (const rule of rulesByVisitor.JSXElement) {
        const err = rule.check(path as NodePath<JSXElement>, ctx);
        if (err) errors.push(err);
      }
    },
  });

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
