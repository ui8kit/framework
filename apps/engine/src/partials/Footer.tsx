import { Block, Container, Stack, Text } from '@ui8kit/core';
import { Var } from '@ui8kit/template';

export type FooterLink = {
  label: string;
  href: string;
};

export type FooterSection = {
  title: string;
  links: FooterLink[];
};

export type FooterProps = {
  copyright?: string;
  sections?: FooterSection[];
  'data-class'?: string;
};

export function Footer({ 
  copyright = '© 2025 UI8Kit Design System. All rights reserved.',
  sections = [],
  'data-class': dataClass,
}: FooterProps) {
  return (
    <Block 
      component="footer" 
      py="8" 
      border="t"
      bg="card"
      data-class={dataClass || "footer"}
    >
      <Container data-class="footer-container">
        <Stack flex="row" justify="center" items="center" gap="8" data-class="footer-content">
          <Text fontSize="sm" textColor="muted-foreground" data-class="footer-copyright">
            <Var name="copyright" value={copyright} />
          </Text>
        </Stack>
      </Container>
    </Block>
  );
}
