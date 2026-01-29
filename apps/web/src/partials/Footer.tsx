import { Block, Container, Stack, Text } from '@ui8kit/core'

type FooterLink = {
  label: string
  href: string
}

type FooterSection = {
  title: string
  links: FooterLink[]
}

type FooterProps = {
  copyright?: string
  sections?: FooterSection[]
}

export function Footer({ 
  copyright = '© 2025 UI8Kit Design System. All rights reserved.',
}: FooterProps) {
  return (
    <Block 
      component="footer" 
      py="8" 
      border="t"
      bg="card"
      data-class="footer"
    >
      <Container data-class="footer-container">
        <Stack flex="row" justify="center" items="center" gap="8" data-class="footer-content">
          <Text fontSize="sm" textColor="muted-foreground" data-class="footer-copyright">
            {copyright}
          </Text>
        </Stack>
      </Container>
    </Block>
  )
}
