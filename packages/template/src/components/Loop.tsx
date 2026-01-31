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

export interface LoopProps {
  /** Collection variable name (e.g., "items", "users") */
  each: string;

  /** Iterator variable name (e.g., "item", "user") */
  as: string;

  /** Optional key expression for loop (e.g., "item.id") */
  keyExpr?: string;

  /** Optional index variable name */
  index?: string;

  /** Children to render for each iteration */
  children: ReactNode;

  /** Runtime data for dev mode (optional) */
  data?: unknown[];
}

/**
 * Loop component for template generation
 *
 * During React runtime (dev mode), renders children once or uses data prop.
 * During template generation, produces loop syntax.
 */
export const Loop: FC<LoopProps> = ({
  each,
  as,
  keyExpr,
  index,
  children,
  data,
}) => {
  // Mark for transformer detection
  const markerProps = {
    'data-gen-loop': `${as}:${each}`,
    ...(keyExpr && { 'data-gen-key': keyExpr }),
    ...(index && { 'data-gen-index': index }),
  };

  // Dev mode: if data provided, iterate
  if (data && Array.isArray(data)) {
    return (
      <>
        {data.map((_, i) => (
          <span key={i} {...markerProps} style={{ display: 'contents' }}>
            {children}
          </span>
        ))}
      </>
    );
  }

  // Generation mode or no data: render wrapper with marker
  return (
    <span {...markerProps} style={{ display: 'contents' }}>
      {children}
    </span>
  );
};

Loop.displayName = 'GenLoop';
