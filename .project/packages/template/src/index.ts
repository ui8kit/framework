/**
 * @ui8kit/template - DSL for React to Template Engine conversion
 *
 * Provides declarative components for defining template logic
 * that will be converted to various template engine syntax.
 *
 * Supported engines:
 * - Liquid (Shopify, Jekyll)
 * - Handlebars (JavaScript)
 * - Twig (PHP, Symfony)
 * - Latte (PHP, Nette)
 *
 * @example
 * ```tsx
 * import { Loop, If, Else, Var, Slot } from '@ui8kit/template';
 *
 * function ProductList({ items, isLoading }) {
 *   return (
 *     <div className="product-list">
 *       <If test="isLoading">
 *         <div>Loading...</div>
 *       </If>
 *       <Else>
 *         <Loop each="items" as="item">
 *           <article>
 *             <h2><Var>item.name</Var></h2>
 *             <p><Var name="item.price" filter="currency" /></p>
 *           </article>
 *         </Loop>
 *       </Else>
 *     </div>
 *   );
 * }
 * ```
 */

// DSL Components
export {
  Loop,
  If,
  Else,
  ElseIf,
  Var,
  Slot,
  Include,
  DefineBlock,
  Extends,
  Raw,
} from './components';

// Types
export type {
  LoopProps,
  IfProps,
  ElseProps,
  ElseIfProps,
  VarProps,
  SlotProps,
  IncludeProps,
  DefineBlockProps,
  ExtendsProps,
  RawProps,
} from './components';

/**
 * DSL marker attributes used by the generator
 */
export const DSL_MARKERS = {
  LOOP: 'data-gen-loop',
  LOOP_KEY: 'data-gen-key',
  LOOP_INDEX: 'data-gen-index',
  IF: 'data-gen-if',
  ELSE: 'data-gen-else',
  ELSE_IF: 'data-gen-elseif',
  VAR: 'data-gen-var',
  VAR_DEFAULT: 'data-gen-default',
  VAR_FILTER: 'data-gen-filter',
  VAR_RAW: 'data-gen-raw',
  SLOT: 'data-gen-slot',
  INCLUDE: 'data-gen-include',
  INCLUDE_PROPS: 'data-gen-props',
  BLOCK: 'data-gen-block',
  EXTENDS: 'data-gen-extends',
  RAW: 'data-gen-raw',
} as const;

export type DslMarker = typeof DSL_MARKERS[keyof typeof DSL_MARKERS];
