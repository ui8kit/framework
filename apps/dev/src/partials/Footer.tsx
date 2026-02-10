import { Block, Container, Text } from '@ui8kit/core';

interface FooterProps {
  copyright?: string;
  sections?: any[];
  dataClass?: string;
}

export function Footer(props: FooterProps) {
  const { copyright, sections, dataClass } = props;
  return (
    <Block component="footer" py="8" border="t" bg="card" data-class={dataClass || 'footer'}>
      <Container flex="" justify="center" items="center" gap="8" data-class="footer-container">
        <Text fontSize="sm" textColor="muted-foreground" data-class="footer-copyright">
          {copyright}
        </Text>
      </Container>
    </Block>
  );
}
