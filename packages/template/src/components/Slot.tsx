/**
 * Slot - DSL component for content slots
 *
 * @example
 * ```tsx
 * <Slot name="header" />
 * <Slot>{children}</Slot>
 * ```
 *
 * Generates (Liquid):
 * ```liquid
 * {{ header }}
 * {{ content }}
 * ```
 */

import { type ReactNode, type FC } from 'react';

export interface SlotProps {
  /** Slot name (default: "content") */
  name?: string;

  /** Default content (React children) */
  children?: ReactNode;
}

/**
 * Slot component for content injection
 */
export const Slot: FC<SlotProps> = ({ name = 'content', children }) => {
  return (
    <span data-gen-slot={name} style={{ display: 'contents' }}>
      {children}
    </span>
  );
};

Slot.displayName = 'GenSlot';
