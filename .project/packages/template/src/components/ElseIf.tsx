/**
 * ElseIf - DSL component for else-if branch
 *
 * @example
 * ```tsx
 * <If test="status === 'loading'">
 *   <Spinner />
 * </If>
 * <ElseIf test="status === 'error'">
 *   <Error />
 * </ElseIf>
 * <Else>
 *   <Content />
 * </Else>
 * ```
 */

import { type ReactNode, type FC } from 'react';

export interface ElseIfProps {
  /** Condition expression */
  test: string;

  /** Children to render when condition is true */
  children: ReactNode;

  /** Runtime value for dev mode */
  value?: boolean;
}

/**
 * ElseIf component for conditional template generation
 */
export const ElseIf: FC<ElseIfProps> = ({ test, children, value }) => {
  if (value === false) {
    return null;
  }

  return (
    <span data-gen-elseif={test} style={{ display: 'contents' }}>
      {children}
    </span>
  );
};

ElseIf.displayName = 'GenElseIf';
