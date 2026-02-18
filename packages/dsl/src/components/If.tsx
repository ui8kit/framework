/**
 * If - DSL component for conditional rendering
 *
 * @example
 * ```tsx
 * <If test="isActive">
 *   <span>Active</span>
 * </If>
 * ```
 *
 * Generates (Liquid):
 * ```liquid
 * {% if isActive %}
 *   <span>Active</span>
 * {% endif %}
 * ```
 */

import { type ReactNode, type FC } from 'react';

export interface IfProps {
  /** Condition expression (variable name or expression) */
  test: string;

  /** Children to render when condition is true */
  children: ReactNode;

  /** Runtime value for dev mode (optional) */
  value?: boolean;
}

/**
 * If component for conditional template generation
 */
export const If: FC<IfProps> = ({ test, children, value }) => {
  const markerProps = {
    'data-gen-if': test,
  };

  // Dev mode: respect runtime value
  if (value === false) {
    return null;
  }

  return (
    <span {...markerProps} style={{ display: 'contents' }}>
      {children}
    </span>
  );
};

If.displayName = 'GenIf';
