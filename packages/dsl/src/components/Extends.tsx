/**
 * Extends - DSL component for template inheritance
 *
 * @example
 * ```tsx
 * <Extends layout="base" />
 * ```
 *
 * Generates (Twig):
 * ```twig
 * {% extends "base.twig" %}
 * ```
 */

import { type FC } from 'react';

export interface ExtendsProps {
  /** Layout name to extend */
  layout: string;
}

/**
 * Extends component for template inheritance
 */
export const Extends: FC<ExtendsProps> = ({ layout }) => {
  return <span data-gen-extends={layout} style={{ display: 'none' }} />;
};

Extends.displayName = 'GenExtends';
