import { Stack, Text } from '@ui8kit/core';
import { DomainNavButton } from '@/partials';
import { Fragment } from 'react';

interface DashSidebarProps {
  label?: string;
  links?: any[];
  dataClass?: string;
}

export function DashSidebar(props: DashSidebarProps) {
  const { label, links, dataClass } = props;

  return (
    <Stack gap="2" p="4" data-class={dataClass ?? 'dash-sidebar-nav'}>
      <Text fontSize="xs" fontWeight="semibold" textColor="muted-foreground" data-class="dash-sidebar-label">
        {label ? (<>{label}</>) : null}
      </Text>
      {(links ?? []).length > 0 ? (<>{links.map((link, index) => (
      <Fragment key={link.id ?? index}>
      {!!link.active ? (<><DomainNavButton href={link.href} size={"sm"} variant={"secondary"} justify={"start"} data-class={"dash-sidebar-link"}>{link.label}</DomainNavButton></>) : null}{!link.active ? (<><DomainNavButton href={link.href} size={"sm"} variant={"ghost"} justify={"start"} data-class={"dash-sidebar-link"}>{link.label}</DomainNavButton></>) : null}
      </Fragment>
      ))}</>) : null}
    </Stack>
  );
}
