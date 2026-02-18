/**
 * Else - DSL component for else branch
 *
 * Must follow an If component.
 *
 * @example
 * ```tsx
 * <If test="isLoading">
 *   <Spinner />
 * </If>
 * <Else>
 *   <Content />
 * </Else>
 * ```
 *
 * Generates (Liquid):
 * ```liquid
 * {% if isLoading %}
 *   ...
 * {% else %}
 *   ...
 * {% endif %}
 * ```
 */

import { type ReactNode, type FC } from 'react';

export interface ElseProps {
  /** Children to render in else branch */
  children: ReactNode;
}

/**
 * Else component for conditional template generation
 */
export const Else: FC<ElseProps> = ({ children }) => {
  return (
    <span data-gen-else style={{ display: 'contents' }}>
      {children}
    </span>
  );
};

Else.displayName = 'GenElse';
