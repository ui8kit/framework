/**
 * Raw - DSL component for unescaped HTML output
 *
 * @example
 * ```tsx
 * <Raw>htmlContent</Raw>
 * ```
 *
 * Generates (Liquid):
 * ```liquid
 * {{ htmlContent }}
 * ```
 *
 * Generates (Twig):
 * ```twig
 * {{ htmlContent | raw }}
 * ```
 */

import { type ReactNode, type FC } from 'react';

export interface RawProps {
  /** Variable name containing HTML */
  children: ReactNode;

  /** Runtime value for dev mode */
  value?: string;
}

/**
 * Raw component for unescaped output
 */
export const Raw: FC<RawProps> = ({ children, value }) => {
  const varName = typeof children === 'string' ? children : '';

  return (
    <span data-gen-raw={varName} style={{ display: 'contents' }}>
      {value !== undefined ? (
        <span dangerouslySetInnerHTML={{ __html: value }} />
      ) : (
        `{{${varName}}}`
      )}
    </span>
  );
};

Raw.displayName = 'GenRaw';
