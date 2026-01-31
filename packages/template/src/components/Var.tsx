/**
 * Var - DSL component for variable output
 *
 * @example
 * ```tsx
 * <Var>user.name</Var>
 * <Var name="title" default="Untitled" />
 * <Var name="price" filter="currency" />
 * ```
 *
 * Generates (Liquid):
 * ```liquid
 * {{ user.name }}
 * {{ title | default: "Untitled" }}
 * {{ price | currency }}
 * ```
 */

import { type ReactNode, type FC } from 'react';

export interface VarProps {
  /** Variable path (can be passed as children or name prop) */
  name?: string;

  /** Variable path as children (alternative to name) */
  children?: ReactNode;

  /** Default value if variable is empty */
  default?: string;

  /** Filter to apply (e.g., "uppercase", "currency") */
  filter?: string;

  /** Raw output (no escaping) */
  raw?: boolean;

  /** Runtime value for dev mode */
  value?: unknown;
}

/**
 * Var component for variable output in templates
 */
export const Var: FC<VarProps> = ({
  name,
  children,
  default: defaultValue,
  filter,
  raw,
  value,
}) => {
  // Get variable name from children or name prop
  const varName = name || (typeof children === 'string' ? children : '');

  const markerProps = {
    'data-gen-var': varName,
    ...(defaultValue && { 'data-gen-default': defaultValue }),
    ...(filter && { 'data-gen-filter': filter }),
    ...(raw && { 'data-gen-raw': 'true' }),
  };

  // Dev mode: show runtime value or placeholder
  const displayValue = value !== undefined ? String(value) : `{{${varName}}}`;

  return (
    <span {...markerProps} style={{ display: 'contents' }}>
      {displayValue}
    </span>
  );
};

Var.displayName = 'GenVar';
