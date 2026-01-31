/**
 * HAST Builder - Builds GenHAST tree from JSX AST
 *
 * Transforms Babel JSX AST into GenHAST with annotations for:
 * - Loops (items.map)
 * - Conditions (&& and ternary)
 * - Variables
 * - Slots (children)
 * - Includes (component references)
 */

import traverse from '@babel/traverse';
import type * as t from '@babel/types';
import type { File } from '@babel/types';
import {
  element,
  text,
  root,
  annotate,
  type GenRoot,
  type GenElement,
  type GenChild,
  type GenText,
  type GenAnnotations,
  type GenComponentMeta,
} from '../hast';
import { analyzeExpression, extractVariables } from './expression-analyzer';
import { getNodeSource } from './jsx-parser';
import type { TransformOptions, AnalyzedComponent, DEFAULT_COMPONENT_PATTERNS } from './types';

// =============================================================================
// Main Builder
// =============================================================================

/**
 * Build GenHAST tree from Babel AST
 */
export function buildHast(
  ast: File,
  source: string,
  options: TransformOptions = {}
): GenRoot {
  const builder = new HastBuilder(ast, source, options);
  return builder.build();
}

// =============================================================================
// Builder Class
// =============================================================================

class HastBuilder {
  private ast: File;
  private source: string;
  private options: TransformOptions;
  private variables = new Set<string>();
  private dependencies = new Set<string>();
  private warnings: string[] = [];
  private componentInfo: AnalyzedComponent | null = null;
  
  constructor(ast: File, source: string, options: TransformOptions) {
    this.ast = ast;
    this.source = source;
    this.options = options;
  }
  
  build(): GenRoot {
    // Find the component to transform
    const componentNode = this.findMainComponent();
    
    if (!componentNode) {
      return root([], this.createMeta());
    }
    
    // Get the JSX return
    const jsxRoot = this.findJsxReturn(componentNode);
    
    if (!jsxRoot) {
      return root([], this.createMeta());
    }
    
    // Transform JSX to HAST
    const children = this.transformJsxNode(jsxRoot);
    
    return root(
      Array.isArray(children) ? children : [children].filter(Boolean) as GenChild[],
      this.createMeta()
    );
  }
  
  // ===========================================================================
  // Component Discovery
  // ===========================================================================
  
  /**
   * Find the main component to transform
   */
  private findMainComponent(): t.Node | null {
    let foundComponent: t.Node | null = null;
    const targetName = this.options.componentName;
    
    traverse(this.ast, {
      // Function declaration: function MyComponent() {}
      FunctionDeclaration: (path) => {
        if (this.isValidComponent(path.node, targetName)) {
          foundComponent = path.node;
          this.componentInfo = this.analyzeComponent(path.node);
          path.stop();
        }
      },
      
      // Variable declaration: const MyComponent = () => {}
      VariableDeclarator: (path) => {
        if (path.node.id.type === 'Identifier') {
          const name = path.node.id.name;
          if (targetName ? name === targetName : this.looksLikeComponent(name)) {
            const init = path.node.init;
            if (init && (init.type === 'ArrowFunctionExpression' || init.type === 'FunctionExpression')) {
              foundComponent = init;
              this.componentInfo = {
                name,
                type: this.detectComponentType(name),
                props: [],
                exportType: 'named',
                isFunctionComponent: true,
                usesForwardRef: false,
                sourceFile: this.options.sourceFile,
              };
              path.stop();
            }
          }
        }
      },
      
      // Export default: export default function MyComponent() {}
      ExportDefaultDeclaration: (path) => {
        const decl = path.node.declaration;
        if (decl.type === 'FunctionDeclaration' && decl.id) {
          foundComponent = decl;
          this.componentInfo = this.analyzeComponent(decl);
          path.stop();
        } else if (decl.type === 'ArrowFunctionExpression' || decl.type === 'FunctionExpression') {
          foundComponent = decl;
          this.componentInfo = {
            name: this.options.componentName || 'Component',
            type: 'component',
            props: [],
            exportType: 'default',
            isFunctionComponent: true,
            usesForwardRef: false,
            sourceFile: this.options.sourceFile,
          };
          path.stop();
        }
      },
    });
    
    return foundComponent;
  }
  
  /**
   * Check if a function is a valid React component
   */
  private isValidComponent(node: t.FunctionDeclaration, targetName?: string): boolean {
    if (!node.id) return false;
    const name = node.id.name;
    
    if (targetName) {
      return name === targetName;
    }
    
    return this.looksLikeComponent(name);
  }
  
  /**
   * Check if name looks like a component (PascalCase)
   */
  private looksLikeComponent(name: string): boolean {
    return /^[A-Z][a-zA-Z0-9]*$/.test(name);
  }
  
  /**
   * Analyze component info
   */
  private analyzeComponent(node: t.FunctionDeclaration): AnalyzedComponent {
    const name = node.id?.name || 'Component';
    
    return {
      name,
      type: this.detectComponentType(name),
      props: this.extractPropsFromParams(node.params),
      exportType: 'named',
      isFunctionComponent: true,
      usesForwardRef: false,
      sourceFile: this.options.sourceFile,
    };
  }
  
  /**
   * Detect component type from name
   */
  private detectComponentType(name: string): 'layout' | 'partial' | 'page' | 'block' | 'component' {
    const patterns = this.options.componentPatterns || {
      layouts: [/Layout$/i],
      partials: [/^Header$/i, /^Footer$/i, /^Nav(bar)?$/i, /^Sidebar$/i],
      pages: [/Page$/i],
      blocks: [/Block$/i, /Section$/i],
    };
    
    for (const pattern of patterns.layouts || []) {
      if (pattern.test(name)) return 'layout';
    }
    for (const pattern of patterns.partials || []) {
      if (pattern.test(name)) return 'partial';
    }
    for (const pattern of patterns.pages || []) {
      if (pattern.test(name)) return 'page';
    }
    for (const pattern of patterns.blocks || []) {
      if (pattern.test(name)) return 'block';
    }
    
    return 'component';
  }
  
  /**
   * Extract props from function parameters
   */
  private extractPropsFromParams(params: t.FunctionDeclaration['params']): AnalyzedComponent['props'] {
    const props: AnalyzedComponent['props'] = [];
    
    if (params.length === 0) return props;
    
    const firstParam = params[0];
    
    if (firstParam.type === 'ObjectPattern') {
      for (const prop of firstParam.properties) {
        if (prop.type === 'ObjectProperty' && prop.key.type === 'Identifier') {
          const name = prop.key.name;
          const hasDefault = prop.value.type === 'AssignmentPattern';
          
          props.push({
            name,
            type: 'unknown',
            required: !hasDefault,
            defaultValue: hasDefault && prop.value.type === 'AssignmentPattern'
              ? getNodeSource(this.source, prop.value.right)
              : undefined,
          });
        }
      }
    }
    
    return props;
  }
  
  // ===========================================================================
  // JSX Return Discovery
  // ===========================================================================
  
  /**
   * Find the JSX return statement in a component
   */
  private findJsxReturn(componentNode: t.Node): t.JSXElement | t.JSXFragment | null {
    // Handle arrow function with implicit JSX return
    if (componentNode.type === 'ArrowFunctionExpression') {
      const body = componentNode.body;
      if (body.type === 'JSXElement' || body.type === 'JSXFragment') {
        return body;
      }
      if (body.type === 'ParenthesizedExpression') {
        const expr = body.expression;
        if (expr.type === 'JSXElement' || expr.type === 'JSXFragment') {
          return expr;
        }
      }
    }
    
    // Search for return statement
    let jsxReturn: t.JSXElement | t.JSXFragment | null = null;
    
    const searchNode = (node: t.Node): void => {
      if (jsxReturn) return;
      
      if (node.type === 'ReturnStatement') {
        const arg = node.argument;
        if (arg && (arg.type === 'JSXElement' || arg.type === 'JSXFragment')) {
          jsxReturn = arg;
          return;
        } else if (arg && arg.type === 'ParenthesizedExpression') {
          const expr = arg.expression;
          if (expr.type === 'JSXElement' || expr.type === 'JSXFragment') {
            jsxReturn = expr;
            return;
          }
        }
      }
      
      // Recurse into child nodes
      for (const key of Object.keys(node)) {
        if (key === 'loc' || key === 'start' || key === 'end') continue;
        const child = (node as any)[key];
        if (child && typeof child === 'object') {
          if (Array.isArray(child)) {
            for (const item of child) {
              if (item && typeof item.type === 'string') {
                searchNode(item);
                if (jsxReturn) return;
              }
            }
          } else if (typeof child.type === 'string') {
            searchNode(child);
            if (jsxReturn) return;
          }
        }
      }
    };
    
    searchNode(componentNode);
    return jsxReturn;
  }
  
  // ===========================================================================
  // JSX Transformation
  // ===========================================================================
  
  /**
   * Transform JSX node to HAST
   */
  private transformJsxNode(node: t.JSXElement | t.JSXFragment | t.JSXText | t.JSXExpressionContainer): GenChild | GenChild[] | null {
    if (node.type === 'JSXElement') {
      return this.transformJsxElement(node);
    }
    
    if (node.type === 'JSXFragment') {
      return this.transformJsxFragment(node);
    }
    
    if (node.type === 'JSXText') {
      return this.transformJsxText(node);
    }
    
    if (node.type === 'JSXExpressionContainer') {
      return this.transformJsxExpression(node);
    }
    
    return null;
  }
  
  /**
   * Transform JSX element to HAST element
   */
  private transformJsxElement(node: t.JSXElement): GenElement {
    const tagName = this.getTagName(node);
    const properties = this.transformAttributes(node.openingElement.attributes);
    const children = this.transformChildren(node.children);
    
    // Check for DSL components first
    const dslResult = this.handleDslComponent(tagName, node, children);
    if (dslResult) {
      return dslResult;
    }
    
    // Check if this is a component reference
    if (this.isComponentTag(tagName)) {
      // Add include annotation
      const annotations: GenAnnotations = {
        include: {
          partial: this.componentToPartialPath(tagName),
          props: this.extractComponentProps(node.openingElement.attributes),
        },
      };
      
      this.dependencies.add(tagName);
      
      return element('div', { ...properties, _gen: annotations }, []);
    }
    
    return element(tagName, properties, children);
  }
  
  /**
   * Get string attribute value safely
   */
  private getStringAttr(attrs: Record<string, string | boolean>, key: string): string | undefined {
    const value = attrs[key];
    return typeof value === 'string' ? value : undefined;
  }

  /**
   * Handle DSL components (Loop, If, Var, etc.)
   */
  private handleDslComponent(
    tagName: string,
    node: t.JSXElement,
    children: GenChild[]
  ): GenElement | null {
    const attrs = this.getJsxAttributeMap(node.openingElement.attributes);
    
    switch (tagName) {
      case 'Loop': {
        const each = this.getStringAttr(attrs, 'each');
        const as = this.getStringAttr(attrs, 'as');
        const keyExpr = this.getStringAttr(attrs, 'keyExpr');
        const index = this.getStringAttr(attrs, 'index');
        
        if (!each || !as) {
          this.warnings.push(`Loop requires 'each' and 'as' props`);
          return element('div', {}, children);
        }
        
        return annotate(
          element('div', {}, children),
          {
            loop: {
              item: as,
              collection: each,
              key: keyExpr,
              index: index,
            },
            unwrap: true,
          }
        );
      }
      
      case 'If': {
        const test = this.getStringAttr(attrs, 'test');
        if (!test) {
          this.warnings.push(`If requires 'test' prop`);
          return element('div', {}, children);
        }
        
        this.variables.add(test.split(/[.\s]/)[0]);
        
        return annotate(
          element('div', {}, children),
          {
            condition: { expression: test },
            unwrap: true,
          }
        );
      }
      
      case 'Else': {
        return annotate(
          element('div', {}, children),
          {
            condition: { expression: '', isElse: true },
            unwrap: true,
          }
        );
      }
      
      case 'ElseIf': {
        const test = this.getStringAttr(attrs, 'test');
        if (!test) {
          this.warnings.push(`ElseIf requires 'test' prop`);
          return element('div', {}, children);
        }
        
        return annotate(
          element('div', {}, children),
          {
            condition: { expression: test, isElseIf: true },
            unwrap: true,
          }
        );
      }
      
      case 'Var': {
        const name = this.getStringAttr(attrs, 'name');
        const defaultVal = this.getStringAttr(attrs, 'default');
        const filter = this.getStringAttr(attrs, 'filter');
        const raw = attrs.raw === 'true' || attrs.raw === true;
        
        // Get variable name from 'name' prop or children
        let varName = name;
        if (!varName && children.length === 1) {
          const child = children[0];
          if (child.type === 'text') {
            varName = child.value.trim();
          }
        }
        
        if (!varName) {
          this.warnings.push(`Var requires 'name' prop or text children`);
          return element('span', {}, []);
        }
        
        this.variables.add(varName.split('.')[0]);
        
        return annotate(
          element('span', {}, []),
          {
            variable: {
              name: varName,
              default: defaultVal,
              filter: filter,
            },
            raw: raw,
            unwrap: true,
          }
        );
      }
      
      case 'Slot': {
        const name = this.getStringAttr(attrs, 'name') || 'content';
        
        return annotate(
          element('div', {}, children),
          {
            slot: { name },
            unwrap: true,
          }
        );
      }
      
      case 'Include': {
        const partial = this.getStringAttr(attrs, 'partial');
        const propsStr = this.getStringAttr(attrs, 'props');
        
        if (!partial) {
          this.warnings.push(`Include requires 'partial' prop`);
          return element('div', {}, []);
        }
        
        let props: Record<string, string> = {};
        if (propsStr) {
          try {
            props = JSON.parse(propsStr);
          } catch {
            // Try to parse as object expression
          }
        }
        
        this.dependencies.add(partial);
        
        return annotate(
          element('div', {}, []),
          {
            include: {
              partial,
              props,
            },
            unwrap: true,
          }
        );
      }
      
      case 'DefineBlock': {
        const name = this.getStringAttr(attrs, 'name');
        if (!name) {
          this.warnings.push(`DefineBlock requires 'name' prop`);
          return element('div', {}, children);
        }
        
        return annotate(
          element('div', {}, children),
          {
            block: { name },
            unwrap: true,
          }
        );
      }
      
      case 'Extends': {
        const layout = this.getStringAttr(attrs, 'layout');
        if (!layout) {
          this.warnings.push(`Extends requires 'layout' prop`);
          return element('div', {}, []);
        }
        
        return annotate(
          element('div', {}, []),
          {
            block: { name: '__extends__', extends: layout },
          }
        );
      }
      
      case 'Raw': {
        let varName = '';
        if (children.length === 1) {
          const child = children[0];
          if (child.type === 'text') {
            varName = child.value.trim();
          }
        }
        
        return annotate(
          element('span', {}, []),
          {
            variable: { name: varName },
            raw: true,
            unwrap: true,
          }
        );
      }
      
      default:
        return null;
    }
  }
  
  /**
   * Get JSX attributes as a simple key-value map
   */
  private getJsxAttributeMap(
    attributes: (t.JSXAttribute | t.JSXSpreadAttribute)[]
  ): Record<string, string | boolean> {
    const map: Record<string, string | boolean> = {};
    
    for (const attr of attributes) {
      if (attr.type !== 'JSXAttribute') continue;
      if (attr.name.type !== 'JSXIdentifier') continue;
      
      const name = attr.name.name;
      const value = attr.value;
      
      if (!value) {
        map[name] = true;
        continue;
      }
      
      if (value.type === 'StringLiteral') {
        map[name] = value.value;
      } else if (value.type === 'JSXExpressionContainer') {
        const expr = value.expression;
        if (expr.type === 'StringLiteral') {
          map[name] = expr.value;
        } else if (expr.type === 'BooleanLiteral') {
          map[name] = expr.value;
        } else {
          // For complex expressions, get source
          map[name] = getNodeSource(this.source, expr);
        }
      }
    }
    
    return map;
  }
  
  /**
   * Get tag name from JSX element
   */
  private getTagName(node: t.JSXElement): string {
    const name = node.openingElement.name;
    
    if (name.type === 'JSXIdentifier') {
      return name.name;
    }
    
    if (name.type === 'JSXMemberExpression') {
      // e.g., Header.Nav
      return this.getJsxMemberName(name);
    }
    
    return 'div';
  }
  
  /**
   * Get member expression name
   */
  private getJsxMemberName(node: t.JSXMemberExpression): string {
    const parts: string[] = [];
    let current: t.JSXMemberExpression | t.JSXIdentifier = node;
    
    while (current.type === 'JSXMemberExpression') {
      if (current.property.type === 'JSXIdentifier') {
        parts.unshift(current.property.name);
      }
      current = current.object;
    }
    
    if (current.type === 'JSXIdentifier') {
      parts.unshift(current.name);
    }
    
    return parts.join('.');
  }
  
  /**
   * Check if tag is a component (PascalCase)
   */
  private isComponentTag(tagName: string): boolean {
    return /^[A-Z]/.test(tagName);
  }
  
  /**
   * Convert component name to partial path
   */
  private componentToPartialPath(componentName: string): string {
    // Convert PascalCase to kebab-case
    const kebab = componentName
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase();
    
    return `partials/${kebab}`;
  }
  
  /**
   * Transform JSX attributes to HAST properties
   */
  private transformAttributes(attributes: (t.JSXAttribute | t.JSXSpreadAttribute)[]): GenElement['properties'] {
    const properties: GenElement['properties'] = {};
    
    for (const attr of attributes) {
      if (attr.type === 'JSXSpreadAttribute') {
        // Can't handle spread in static templates
        this.warnings.push(`Spread attribute not supported in templates: ${getNodeSource(this.source, attr)}`);
        continue;
      }
      
      const name = attr.name.type === 'JSXIdentifier' 
        ? attr.name.name 
        : `${attr.name.namespace.name}:${attr.name.name.name}`;
      
      // Skip key prop (used for React reconciliation only)
      if (name === 'key') continue;
      
      const value = this.getAttributeValue(attr);
      
      // Convert className
      if (name === 'className') {
        if (typeof value === 'string') {
          properties.className = value.split(/\s+/).filter(Boolean);
        }
        continue;
      }
      
      properties[name] = value;
    }
    
    return properties;
  }
  
  /**
   * Get attribute value
   */
  private getAttributeValue(attr: t.JSXAttribute): unknown {
    const value = attr.value;
    
    if (!value) {
      // Boolean true
      return true;
    }
    
    if (value.type === 'StringLiteral') {
      return value.value;
    }
    
    if (value.type === 'JSXExpressionContainer') {
      const expr = value.expression;
      
      if (expr.type === 'StringLiteral') {
        return expr.value;
      }
      
      if (expr.type === 'NumericLiteral') {
        return expr.value;
      }
      
      if (expr.type === 'BooleanLiteral') {
        return expr.value;
      }
      
      // Dynamic value - return as template expression
      return getNodeSource(this.source, expr);
    }
    
    return undefined;
  }
  
  /**
   * Extract props passed to component
   */
  private extractComponentProps(attributes: (t.JSXAttribute | t.JSXSpreadAttribute)[]): Record<string, string> {
    const props: Record<string, string> = {};
    
    for (const attr of attributes) {
      if (attr.type === 'JSXSpreadAttribute') continue;
      if (attr.name.type !== 'JSXIdentifier') continue;
      
      const name = attr.name.name;
      if (name === 'key') continue;
      
      const value = attr.value;
      
      if (!value) {
        props[name] = 'true';
      } else if (value.type === 'StringLiteral') {
        props[name] = `"${value.value}"`;
      } else if (value.type === 'JSXExpressionContainer') {
        props[name] = getNodeSource(this.source, value.expression);
      }
    }
    
    return props;
  }
  
  /**
   * Transform JSX children
   */
  private transformChildren(children: t.JSXElement['children']): GenChild[] {
    const result: GenChild[] = [];
    
    for (const child of children) {
      const transformed = this.transformJsxNode(child as any);
      
      if (transformed === null) continue;
      
      if (Array.isArray(transformed)) {
        result.push(...transformed);
      } else {
        result.push(transformed);
      }
    }
    
    return result;
  }
  
  /**
   * Transform JSX fragment
   */
  private transformJsxFragment(node: t.JSXFragment): GenChild[] {
    return this.transformChildren(node.children);
  }
  
  /**
   * Transform JSX text
   */
  private transformJsxText(node: t.JSXText): GenText | null {
    const value = node.value.trim();
    
    if (!value) {
      return null;
    }
    
    // Normalize whitespace
    const normalized = value.replace(/\s+/g, ' ');
    
    return text(normalized);
  }
  
  /**
   * Transform JSX expression container
   */
  private transformJsxExpression(node: t.JSXExpressionContainer): GenChild | GenChild[] | null {
    const expr = node.expression;
    
    if (expr.type === 'JSXEmptyExpression') {
      return null;
    }
    
    // Analyze the expression
    const analyzed = analyzeExpression(expr, this.source);
    
    // Track variables
    const vars = extractVariables(expr);
    for (const v of vars) {
      this.variables.add(v);
    }
    
    switch (analyzed.type) {
      case 'variable':
      case 'member':
        return this.createVariableElement(analyzed.path || analyzed.raw);
      
      case 'loop':
        return this.createLoopElement(expr as t.CallExpression, analyzed);
      
      case 'conditional':
        return this.createConditionalElement(expr, analyzed);
      
      case 'children':
        return this.createSlotElement('default');
      
      case 'literal':
        return text(analyzed.raw);
      
      case 'template':
        // Template literals need special handling
        return this.createTemplateElement(expr as t.TemplateLiteral);
      
      default:
        this.warnings.push(`Unknown expression type: ${analyzed.raw}`);
        return null;
    }
  }
  
  /**
   * Create variable element with annotation
   */
  private createVariableElement(path: string): GenElement {
    return annotate(
      element('span', {}, []),
      {
        variable: { name: path },
        unwrap: true,
      }
    );
  }
  
  /**
   * Create loop element with annotation
   */
  private createLoopElement(expr: t.CallExpression, analyzed: ReturnType<typeof analyzeExpression>): GenElement {
    // Get the callback and transform its body
    const callback = expr.arguments[0];
    let loopContent: GenChild[] = [];
    
    if (callback && (callback.type === 'ArrowFunctionExpression' || callback.type === 'FunctionExpression')) {
      const body = callback.body;
      
      if (body.type === 'JSXElement') {
        const transformed = this.transformJsxElement(body);
        loopContent = [transformed];
      } else if (body.type === 'BlockStatement') {
        // Find return statement
        for (const stmt of body.body) {
          if (stmt.type === 'ReturnStatement' && stmt.argument) {
            if (stmt.argument.type === 'JSXElement') {
              const transformed = this.transformJsxElement(stmt.argument);
              loopContent = [transformed];
              break;
            }
          }
        }
      }
    }
    
    return annotate(
      element('div', {}, loopContent),
      {
        loop: {
          item: analyzed.loopItem!,
          collection: analyzed.loopCollection!,
          key: analyzed.loopKey,
        },
        unwrap: true,
      }
    );
  }
  
  /**
   * Create conditional element with annotation
   */
  private createConditionalElement(expr: t.Expression, analyzed: ReturnType<typeof analyzeExpression>): GenElement | GenChild[] {
    if (analyzed.isTernary && expr.type === 'ConditionalExpression') {
      // Ternary: condition ? consequent : alternate
      const consequent = expr.consequent;
      const alternate = expr.alternate;
      
      const ifContent = consequent.type === 'JSXElement' 
        ? [this.transformJsxElement(consequent)]
        : [];
      
      const elseContent = alternate.type === 'JSXElement'
        ? [this.transformJsxElement(alternate)]
        : [];
      
      // Create if element
      const ifElement = annotate(
        element('div', {}, ifContent),
        {
          condition: { expression: analyzed.condition! },
          unwrap: true,
        }
      );
      
      // Create else element
      const elseElement = annotate(
        element('div', {}, elseContent),
        {
          condition: { expression: '', isElse: true },
          unwrap: true,
        }
      );
      
      return [ifElement, elseElement];
    }
    
    // Logical AND: condition && content
    if (expr.type === 'LogicalExpression' && expr.operator === '&&') {
      const right = expr.right;
      let content: GenChild[] = [];
      
      if (right.type === 'JSXElement') {
        content = [this.transformJsxElement(right)];
      } else if (right.type === 'JSXFragment') {
        content = this.transformJsxFragment(right);
      }
      
      return annotate(
        element('div', {}, content),
        {
          condition: { expression: analyzed.condition! },
          unwrap: true,
        }
      );
    }
    
    return element('div', {}, []);
  }
  
  /**
   * Create slot element with annotation
   */
  private createSlotElement(name: string): GenElement {
    return annotate(
      element('div', {}, []),
      {
        slot: { name },
        unwrap: true,
      }
    );
  }
  
  /**
   * Create template literal element
   */
  private createTemplateElement(node: t.TemplateLiteral): GenChild[] {
    const result: GenChild[] = [];
    
    for (let i = 0; i < node.quasis.length; i++) {
      const quasi = node.quasis[i];
      
      // Add text part
      if (quasi.value.cooked) {
        result.push(text(quasi.value.cooked));
      }
      
      // Add expression part
      if (i < node.expressions.length) {
        const expr = node.expressions[i];
        const path = getNodeSource(this.source, expr);
        result.push(this.createVariableElement(path));
      }
    }
    
    return result;
  }
  
  // ===========================================================================
  // Metadata
  // ===========================================================================
  
  /**
   * Create component metadata
   */
  private createMeta(): GenComponentMeta {
    return {
      sourceFile: this.options.sourceFile || 'unknown',
      componentName: this.componentInfo?.name || 'Component',
      exports: this.componentInfo ? [this.componentInfo.name] : [],
      dependencies: Array.from(this.dependencies),
      componentType: this.componentInfo?.type,
      props: this.componentInfo?.props.map(p => ({
        name: p.name,
        type: p.type,
        required: p.required,
        defaultValue: p.defaultValue,
      })),
    };
  }
}
