/**
 * Loop - DSL component for iteration
 *
 * Renders children for each item in collection.
 * In dev mode: uses actual data
 * In generation mode: detected by transformer → template loop syntax
 *
 * @example
 * ```tsx
 * <Loop each="items" as="item" key="item.id">
 *   <li><Var>item.name</Var></li>
 * </Loop>
 * ```
 *
 * Generates (Liquid):
 * ```liquid
 * {% for item in items %}
 *   <li>{{ item.name }}</li>
 * {% endfor %}
 * ```
 */

import { type ReactNode, type FC } from 'react';

export interface LoopProps<T = unknown> {
  /** Collection variable name (e.g., "items", "users") */
  each: string;

  /** Iterator variable name (e.g., "item", "user") */
  as: string;

  /** Optional key expression for loop (e.g., "item.id") */
  keyExpr?: string;

  /** Optional index variable name */
  index?: string;

  /** 
   * Children to render for each iteration.
   * Can be a render function receiving (item, index) for dev mode preview.
   */
  children: ReactNode | ((item: T, index: number) => ReactNode);

  /** Runtime data for dev mode (optional) */
  data?: T[];
}

/**
 * Loop component for template generation
 *
 * During React runtime (dev mode), renders children for each item.
 * During template generation, produces loop syntax.
 * 
 * Supports two patterns:
 * 1. Static children: <Loop ...><Var name="item.title" /></Loop>
 * 2. Render function: <Loop ...>{(item) => <Var name="item.title" value={item.title} />}</Loop>
 */
export const Loop = <T,>({
  each,
  as,
  keyExpr,
  index,
  children,
  data,
}: LoopProps<T>) => {
  // Mark for transformer detection
  const markerProps = {
    'data-gen-loop': `${as}:${each}`,
    ...(keyExpr && { 'data-gen-key': keyExpr }),
    ...(index && { 'data-gen-index': index }),
  };

  // Check if children is a render function
  const isRenderFunction = typeof children === 'function';

  // Dev mode: if data provided, iterate with actual values
  if (data && Array.isArray(data)) {
    return (
      <>
        {data.map((item, i) => (
          <span key={i} {...markerProps} style={{ display: 'contents' }}>
            {isRenderFunction ? (children as (item: T, index: number) => ReactNode)(item, i) : children}
          </span>
        ))}
      </>
    );
  }

  // Generation mode or no data: render wrapper with marker (once)
  return (
    <span {...markerProps} style={{ display: 'contents' }}>
      {isRenderFunction ? (children as (item: T, index: number) => ReactNode)({} as T, 0) : children}
    </span>
  );
};

Loop.displayName = 'GenLoop';
