import type { ReactNode } from 'react';
import { Button } from '@ui8kit/core';
import { context } from '@ui8kit/data';

interface DomainNavButtonProps {
  href: string;
  children: ReactNode;
  unavailableTitle?: string;
}

export function DomainNavButton(props: DomainNavButtonProps) {
  const { href, children, unavailableTitle } = props;

  const state = context.resolveNavigation(href);

  return (
    <Button href={state.href}>
      {children}
    </Button>
  );
}
