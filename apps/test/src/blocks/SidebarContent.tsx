import { Stack, Text } from '@ui8kit/core';
import { DomainNavButton } from '@/partials';
import { Fragment } from 'react';

interface SidebarContentProps {
  title?: string;
  links?: any[];
  dataClass?: string;
}

export function SidebarContent(props: SidebarContentProps) {
  const { title, links, dataClass } = props;

  const normalizedLinks = (links ?? []) as SidebarLink[];

  return (
    <Stack gap="4" data-class={dataClass ?? 'sidebar-widgets'}>
      <Stack component="nav" data-class="sidebar-widget">
        <Text component="h3" fontSize="sm" fontWeight="semibold" data-class="sidebar-widget-title">
          {title ? (<>{title}</>) : null}
        </Text>
        {links ? (<><Stack gap="1" data-class="sidebar-links">{links.map((link, index) => (
        <Fragment key={link.id ?? index}>
        <DomainNavButton href={link.href} variant={"link"} size={"sm"} justify={"start"} data-class={"sidebar-link"}>{link.label}</DomainNavButton>
        </Fragment>
        ))}</Stack></>) : null}
      </Stack>
    </Stack>
  );
}
