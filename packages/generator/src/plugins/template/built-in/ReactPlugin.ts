/**
 * ReactPlugin - Template Plugin for React JSX Output
 *
 * Transforms GenHAST trees into React JSX markup.
 * Fifth official template plugin alongside Liquid, Handlebars, Twig, and Latte.
 *
 * DSL → React transformation rules:
 * - Var       → {value} or {value ?? "default"}
 * - If        → {condition ? (<>content</>) : null}
 * - If/Else   → {condition ? (<>ifContent</>) : (<>elseContent</>)}
 * - If/ElseIf → IIFE {(() => { if (c1) return ...; if (c2) return ...; return null; })()}
 * - Loop      → {collection.map((item, index) => (<React.Fragment key=...>content</React.Fragment>))}
 * - Slot      → {name ?? (<>default</>)} or {children}
 * - Include   → <ComponentName prop={value} />
 *
 * @see https://react.dev/
 */

import { BasePlugin } from '../BasePlugin';
import type {
  TemplatePluginFeatures,
  FilterDefinition,
  StandardFilter,
} from '../ITemplatePlugin';
import type {
  GenLoop,
  GenCondition,
  GenVariable,
  GenSlot,
  GenInclude,
  GenBlock,
  GenElement,
} from '../../../hast';

// =============================================================================
// Branch Markers
// =============================================================================

/**
 * Internal markers for condition branch detection.
 * Used to communicate between renderCondition calls
 * (else/elseif branches → parent if block).
 */
const MARKERS = {
  ELSE: '___REACT_ELSE___',
  ELSEIF: '___REACT_ELSEIF___',
  SEP: '___REACT_SEP___',
  END: '___REACT_END___',
} as const;

// =============================================================================
// ReactPlugin Implementation
// =============================================================================

export class ReactPlugin extends BasePlugin {
  // ===========================================================================
  // Identity
  // ===========================================================================

  readonly name = 'react';
  readonly version = '1.0.0';
  readonly runtime = 'js' as const;
  readonly fileExtension = '.tsx';
  readonly description = 'React JSX template plugin for apps/web, apps/docs';

  // ===========================================================================
  // Features
  // ===========================================================================

  readonly features: TemplatePluginFeatures = {
    supportsInheritance: false,
    supportsPartials: true,
    supportsFilters: false, // React uses JS expressions, not template filters
    supportsMacros: false,
    supportsAsync: true,
    supportsRaw: true,
    supportsComments: true,
  };

  // ===========================================================================
  // Filter Mappings (React uses native JS methods)
  // ===========================================================================

  protected override initializeFilterMappings(): void {
    // React doesn't use template filters.
    // Transformations use JS expressions: value.toUpperCase(), etc.
  }

  // ===========================================================================
  // Annotation Renderers
  // ===========================================================================

  /**
   * Render loop construct
   *
   * Key strategy:
   * 1. Explicit key field from DSL → item.{key}
   * 2. Auto-detect item.id → item.id
   * 3. Fallback → index
   *
   * @example
   * {items.map((item, index) => (
   *   <React.Fragment key={item.id ?? index}>
   *     <div>{item.name}</div>
   *   </React.Fragment>
   * ))}
   */
  renderLoop(loop: GenLoop, content: string): string {
    const { item, collection, key, index: indexVar } = loop;
    const idx = indexVar ?? 'index';

    // Key resolution: explicit key → auto id → fallback index
    let keyExpr: string;
    if (key) {
      keyExpr = `${item}.${key}`;
    } else {
      keyExpr = `${item}.id ?? ${idx}`;
    }

    const lines = [
      `{${collection}.map((${item}, ${idx}) => (`,
      `<React.Fragment key={${keyExpr}}>`,
      content,
      '</React.Fragment>',
      '))}',
    ];

    return lines.join('\n');
  }

  /**
   * Render conditional construct
   *
   * Strategy (decided by architecture review):
   * - Simple if         → ternary: {expr ? (<>content</>) : null}
   * - If/Else           → ternary: {expr ? (<>A</>) : (<>B</>)}
   * - If/ElseIf[/Else]  → IIFE (teaches junior devs real JS patterns)
   *
   * Else/ElseIf branches emit markers that the parent if block consumes.
   */
  renderCondition(condition: GenCondition, content: string): string {
    const { expression, isElse, isElseIf } = condition;

    // Else branch: emit marker for parent if to consume
    if (isElse) {
      return `${MARKERS.ELSE}${content}${MARKERS.END}`;
    }

    // ElseIf branch: emit marker with expression and content
    if (isElseIf) {
      return `${MARKERS.ELSEIF}${expression}${MARKERS.SEP}${content}${MARKERS.END}`;
    }

    // Main if: analyze content for branch markers and build output
    return this.buildConditionOutput(expression, content);
  }

  /**
   * Render standalone else/elseif tag
   */
  renderElse(condition?: string): string {
    if (condition) {
      return `${MARKERS.ELSEIF}${condition}${MARKERS.SEP}`;
    }
    return MARKERS.ELSE;
  }

  /**
   * Render variable output
   *
   * @example
   * {title}
   * {title ?? "Untitled"}
   * {price.toFixed(2)}
   */
  renderVariable(variable: GenVariable): string {
    const { name, default: defaultValue, filter, filterArgs } = variable;

    let expr = name;

    // Apply default with nullish coalescing
    if (defaultValue !== undefined) {
      expr = `${expr} ?? ${this.formatJsValue(defaultValue)}`;
    }

    // Apply filter as JS method
    if (filter) {
      expr = this.applyJsFilter(expr, filter, filterArgs);
    }

    return `{${expr}}`;
  }

  /**
   * Render slot placeholder
   *
   * - Default slot → {children} or {children ?? (<>fallback</>)}
   * - Named slot  → {slotName} or {slotName ?? (<>fallback</>)}
   *
   * @example
   * {children}
   * {header ?? (<>Default Header</>)}
   */
  renderSlot(slot: GenSlot, defaultContent: string): string {
    const { name } = slot;

    // Default slot uses children prop
    if (name === 'default' || name === 'children') {
      if (defaultContent.trim()) {
        return `{children ?? (<>${defaultContent}</>)}`;
      }
      return '{children}';
    }

    // Named slot uses prop
    if (defaultContent.trim()) {
      return `{${name} ?? (<>${defaultContent}</>)}`;
    }

    return `{${name}}`;
  }

  /**
   * Render include/partial as React component import
   *
   * Converts partial paths to PascalCase component names:
   * - "partials/header" → <Header />
   * - "components/user-card" → <UserCard />
   *
   * @example
   * <Header />
   * <Card title={cardTitle} image={cardImage} />
   */
  renderInclude(include: GenInclude): string {
    const { partial, props } = include;

    // Convert path to PascalCase component name
    const componentName = this.toComponentName(partial);

    if (!props || Object.keys(props).length === 0) {
      return `<${componentName} />`;
    }

    // Format props as JSX attributes
    const propsString = Object.entries(props)
      .map(([key, value]) => `${key}={${value}}`)
      .join(' ');

    return `<${componentName} ${propsString} />`;
  }

  /**
   * Render block (React uses comment markers for documentation)
   */
  renderBlock(block: GenBlock, content: string): string {
    return `{/* block: ${block.name} */}\n${content}\n{/* /block: ${block.name} */}`;
  }

  /**
   * Render extends (not supported in React — use composition)
   */
  renderExtends(parent: string): string {
    this.addWarning('React does not support template inheritance. Use composition instead.');
    return `{/* extends: ${parent} — use composition instead */}`;
  }

  /**
   * Render JSX comment
   */
  renderComment(comment: string): string {
    return `{/* ${comment} */}`;
  }

  // ===========================================================================
  // JSX Attribute Rendering (overrides)
  // ===========================================================================

  /**
   * Override: Keep className (not class) and style as object for React/JSX
   */
  protected override getHtmlAttributes(properties: GenElement['properties']): Record<string, unknown> {
    const attributes: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(properties)) {
      if (key === '_gen') continue;

      if (key === 'className' && Array.isArray(value)) {
        // React uses className, not class
        attributes['className'] = value.join(' ');
      } else if (key === 'style' && typeof value === 'object') {
        // React uses style as object
        attributes['style'] = value;
      } else if (key === 'for') {
        // React uses htmlFor
        attributes['htmlFor'] = value;
      } else {
        attributes[key] = value;
      }
    }

    return attributes;
  }

  /**
   * Override: Format attributes in JSX syntax
   *
   * - String props: name="value"
   * - Boolean props: disabled (true) / omitted (false)
   * - Object props: style={{ ... }}
   * - Expression props: count={42}
   */
  protected override formatAttributes(attributes: Record<string, unknown>): string {
    const parts: string[] = [];

    for (const [key, value] of Object.entries(attributes)) {
      if (value === true) {
        parts.push(key);
      } else if (value === false || value === undefined || value === null) {
        continue;
      } else if (key === 'style' && typeof value === 'object') {
        const styleStr = this.formatStyleJsx(value as Record<string, string>);
        parts.push(`style={${styleStr}}`);
      } else if (typeof value === 'string') {
        parts.push(`${key}="${this.escapeJsxAttributeValue(value)}"`);
      } else {
        parts.push(`${key}={${JSON.stringify(value)}}`);
      }
    }

    return parts.join(' ');
  }

  // ===========================================================================
  // Output Filename (React convention: PascalCase.tsx)
  // ===========================================================================

  /**
   * Override: React components use PascalCase filenames
   */
  protected override getOutputFilename(tree: import('../../../hast').GenRoot): string {
    const componentName = tree.meta?.componentName ?? 'Template';
    return `${componentName}${this.fileExtension}`;
  }

  // ===========================================================================
  // Filter Application (JS-native)
  // ===========================================================================

  override applyFilter(expression: string, filter: string, args?: string[]): string {
    return this.applyJsFilter(expression, filter, args);
  }

  // ===========================================================================
  // Validation
  // ===========================================================================

  override validate(output: string): { valid: boolean; errors?: string[] } {
    const errors: string[] = [];

    // Check for leftover branch markers (indicates broken condition chain)
    if (output.includes(MARKERS.ELSE) || output.includes(MARKERS.ELSEIF)) {
      errors.push('Unprocessed condition branch markers found in output');
    }

    // Check balanced JSX expression braces
    let braceDepth = 0;
    for (const char of output) {
      if (char === '{') braceDepth++;
      if (char === '}') braceDepth--;
      if (braceDepth < 0) {
        errors.push('Unbalanced JSX expression braces: extra closing brace');
        break;
      }
    }

    if (braceDepth > 0) {
      errors.push(`Unbalanced JSX expression braces: ${braceDepth} unclosed`);
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  // ===========================================================================
  // Private: Condition Builders
  // ===========================================================================

  /**
   * Build condition output based on branch complexity:
   * - No branches     → ternary with null
   * - Else only       → ternary
   * - ElseIf present  → IIFE
   */
  private buildConditionOutput(expression: string, content: string): string {
    const hasElseIf = content.includes(MARKERS.ELSEIF);
    const hasElse = content.includes(MARKERS.ELSE);

    if (!hasElseIf && !hasElse) {
      // Simple: {expr ? (<>content</>) : null}
      return `{${expression} ? (<>${content}</>) : null}`;
    }

    if (!hasElseIf && hasElse) {
      // Ternary: {expr ? (<>A</>) : (<>B</>)}
      return this.buildTernary(expression, content);
    }

    // IIFE: {(() => { if... })()}
    return this.buildIIFE(expression, content);
  }

  /**
   * Build ternary for if/else
   */
  private buildTernary(expression: string, content: string): string {
    const elseStart = content.indexOf(MARKERS.ELSE);
    const elseEndMarker = content.indexOf(MARKERS.END, elseStart);

    const ifContent = content.substring(0, elseStart).trim();
    const elseContent = content
      .substring(elseStart + MARKERS.ELSE.length, elseEndMarker)
      .trim();

    return `{${expression} ? (<>${ifContent}</>) : (<>${elseContent}</>)}`;
  }

  /**
   * Build IIFE for if/elseif/else chains
   *
   * Output:
   * {(() => {
   *   if (cond1) return (<>content1</>);
   *   if (cond2) return (<>content2</>);
   *   return (<>elseContent</>);
   * })()}
   */
  private buildIIFE(expression: string, content: string): string {
    const lines: string[] = ['{(() => {'];

    // Main if branch: everything before first marker
    const firstMarkerPos = this.findFirstMarkerPos(content);
    const mainContent = content.substring(0, firstMarkerPos).trim();
    lines.push(`  if (${expression}) return (<>${mainContent}</>);`);

    // Parse remaining content for elseif and else branches
    let remaining = content.substring(firstMarkerPos);

    // Process elseif branches
    while (remaining.includes(MARKERS.ELSEIF)) {
      const markerStart = remaining.indexOf(MARKERS.ELSEIF);
      const exprStart = markerStart + MARKERS.ELSEIF.length;
      const sepIdx = remaining.indexOf(MARKERS.SEP, exprStart);
      const contentStart = sepIdx + MARKERS.SEP.length;
      const endIdx = remaining.indexOf(MARKERS.END, contentStart);

      const expr = remaining.substring(exprStart, sepIdx);
      const branchContent = remaining.substring(contentStart, endIdx).trim();

      lines.push(`  if (${expr}) return (<>${branchContent}</>);`);
      remaining = remaining.substring(endIdx + MARKERS.END.length);
    }

    // Process else branch (if present)
    if (remaining.includes(MARKERS.ELSE)) {
      const elseStart = remaining.indexOf(MARKERS.ELSE) + MARKERS.ELSE.length;
      const endIdx = remaining.indexOf(MARKERS.END, elseStart);
      const elseContent = remaining.substring(elseStart, endIdx).trim();
      lines.push(`  return (<>${elseContent}</>);`);
    } else {
      // No else branch: return null as fallback
      lines.push('  return null;');
    }

    lines.push('})()}');
    return lines.join('\n');
  }

  /**
   * Find position of first branch marker in content
   */
  private findFirstMarkerPos(content: string): number {
    const elseIfPos = content.indexOf(MARKERS.ELSEIF);
    const elsePos = content.indexOf(MARKERS.ELSE);

    if (elseIfPos === -1 && elsePos === -1) return content.length;
    if (elseIfPos === -1) return elsePos;
    if (elsePos === -1) return elseIfPos;

    return Math.min(elseIfPos, elsePos);
  }

  // ===========================================================================
  // Private: Helpers
  // ===========================================================================

  /**
   * Convert partial path to PascalCase React component name
   *
   * "partials/header"      → "Header"
   * "components/user-card"  → "UserCard"
   * "layout/main_footer"    → "MainFooter"
   */
  private toComponentName(partial: string): string {
    const basename = partial.split('/').pop() || partial;
    const name = basename.replace(/\.\w+$/, '');

    return name
      .split(/[-_]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
  }

  /**
   * Format value as JS literal
   */
  private formatJsValue(value: string): string {
    if (!isNaN(Number(value)) && value.trim() !== '') return value;
    if (value === 'true' || value === 'false') return value;
    return `"${value}"`;
  }

  /**
   * Apply filter as native JS method
   */
  private applyJsFilter(expression: string, filter: string, args?: string[]): string {
    const jsFilters: Record<string, (e: string, a?: string[]) => string> = {
      uppercase: (e) => `${e}.toUpperCase()`,
      lowercase: (e) => `${e}.toLowerCase()`,
      capitalize: (e) => `${e}.charAt(0).toUpperCase() + ${e}.slice(1)`,
      trim: (e) => `${e}.trim()`,
      json: (e) => `JSON.stringify(${e})`,
      length: (e) => `${e}.length`,
      join: (e, a) => `${e}.join(${a?.[0] ? `"${a[0]}"` : '", "'})`,
      split: (e, a) => `${e}.split(${a?.[0] ? `"${a[0]}"` : '","'})`,
      reverse: (e) => `[...${e}].reverse()`,
      sort: (e) => `[...${e}].sort()`,
      first: (e) => `${e}[0]`,
      last: (e) => `${e}[${e}.length - 1]`,
      slice: (e, a) => `${e}.slice(${a?.join(', ') ?? '0'})`,
      truncate: (e, a) => `${e}.substring(0, ${a?.[0] ?? '50'})`,
    };

    const transformer = jsFilters[filter];
    if (transformer) {
      return transformer(expression, args);
    }

    // Unknown filter — warn and pass as method call
    this.addWarning(`Unknown filter "${filter}" — passing as method call`);
    return args?.length
      ? `${expression}.${filter}(${args.join(', ')})`
      : `${expression}.${filter}()`;
  }

  /**
   * Format style object for JSX: style={{ color: "red", fontSize: "16px" }}
   */
  private formatStyleJsx(style: Record<string, string>): string {
    const entries = Object.entries(style)
      .map(([prop, value]) => {
        const camelProp = prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
        return `${camelProp}: "${value}"`;
      })
      .join(', ');

    return `{ ${entries} }`;
  }

  /**
   * Escape attribute value for JSX string props
   */
  private escapeJsxAttributeValue(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}
