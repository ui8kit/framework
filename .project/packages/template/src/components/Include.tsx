/**
 * Include - DSL component for partial inclusion
 *
 * @example
 * ```tsx
 * <Include partial="header" />
 * <Include partial="card" props={{ title: "item.title", active: "isActive" }} />
 * ```
 *
 * Generates (Liquid):
 * ```liquid
 * {% include 'header.liquid' %}
 * {% include 'card.liquid', title: item.title, active: isActive %}
 * ```
 */

import { type FC } from 'react';

export interface IncludeProps {
  /** Partial name (without extension) */
  partial: string;

  /** Props to pass to partial (variable names as strings) */
  props?: Record<string, string>;
}

/**
 * Include component for partial inclusion
 */
export const Include: FC<IncludeProps> = ({ partial, props }) => {
  const propsJson = props ? JSON.stringify(props) : undefined;

  return (
    <span
      data-gen-include={partial}
      data-gen-props={propsJson}
      style={{ display: 'contents' }}
    />
  );
};

Include.displayName = 'GenInclude';
