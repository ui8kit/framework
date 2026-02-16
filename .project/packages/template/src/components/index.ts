/**
 * DSL Components for Template Generation
 *
 * These components provide a declarative way to define template logic
 * that will be converted to template engine syntax (Liquid, Handlebars, Twig, Latte).
 */

export { Loop, type LoopProps } from './Loop';
export { If, type IfProps } from './If';
export { Else, type ElseProps } from './Else';
export { ElseIf, type ElseIfProps } from './ElseIf';
export { Var, type VarProps } from './Var';
export { Slot, type SlotProps } from './Slot';
export { Include, type IncludeProps } from './Include';
export { DefineBlock, type DefineBlockProps } from './Block';
export { Extends, type ExtendsProps } from './Extends';
export { Raw, type RawProps } from './Raw';
