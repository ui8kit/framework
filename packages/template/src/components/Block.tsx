/**
 * DefineBlock - DSL component for template blocks (for inheritance)
 *
 * Named DefineBlock to avoid conflict with @ui8kit/core Block component.
 *
 * @example
 * ```tsx
 * <DefineBlock name="title">Default Title</DefineBlock>
 * ```
 *
 * Generates (Twig):
 * ```twig
 * {% block title %}Default Title{% endblock %}
 * ```
 */

import { type ReactNode, type FC } from 'react';

export interface DefineBlockProps {
  /** Block name */
  name: string;

  /** Default block content */
  children?: ReactNode;
}

/**
 * DefineBlock component for template inheritance
 */
export const DefineBlock: FC<DefineBlockProps> = ({ name, children }) => {
  return (
    <span data-gen-block={name} style={{ display: 'contents' }}>
      {children}
    </span>
  );
};

DefineBlock.displayName = 'GenDefineBlock';
