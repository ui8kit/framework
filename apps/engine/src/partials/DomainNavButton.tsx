import type { ReactNode } from 'react';
import { Button } from '@ui8kit/core';
import { context } from '@ui8kit/data';

type DomainNavButtonProps = {
  href: string;
  children: ReactNode;
  unavailableTitle?: string;
  [key: string]: unknown;
};

export function DomainNavButton({
  href,
  children,
  unavailableTitle,
  ...buttonProps
}: DomainNavButtonProps) {
  const state = context.resolveNavigation(href);
  if (state.enabled) {
    return (
      <Button href={state.href} {...(buttonProps as Record<string, unknown>)}>
        {children}
      </Button>
    );
  }

  return (
    <Button
      disabled
      title={unavailableTitle ?? state.reason ?? context.navigation.unavailableTooltip}
      aria-label={unavailableTitle ?? state.reason ?? context.navigation.unavailableTooltip}
      {...(buttonProps as Record<string, unknown>)}
    >
      {children}
    </Button>
  );
}
