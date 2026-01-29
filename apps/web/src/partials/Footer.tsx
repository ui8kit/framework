import { Block, Container, Stack, Group, Text } from '@ui8kit/core'
import { Link } from 'react-router-dom'

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
  sections = []
}: FooterProps) {
  return (
    <Block 
      component="footer" 
      py="8" 
      border=""
      bg="card"
      data-class="footer"
    >
      <Container max="w-6xl" mx="auto" px="4" data-class="footer-container">
        <Stack gap="8" data-class="footer-content">
          {/* Footer Sections */}
          {sections.length > 0 && (
            <Group 
              gap="8" 
              justify="between" 
              flex="wrap"
              data-class="footer-sections"
            >
              {sections.map((section, idx) => (
                <Stack 
                  key={idx} 
                  gap="2" 
                  data-class="footer-section"
                >
                  <Text 
                    fontSize="sm" 
                    fontWeight="semibold"
                    textColor="foreground"
                    data-class="footer-section-title"
                  >
                    {section.title}
                  </Text>

                  <Stack gap="2" data-class="footer-section-links">
                    {section.links.map(link => (
                      <Link 
                        key={link.label}
                        to={link.href}
                        data-class="footer-link"
                      >
                        <Text 
                          fontSize="sm" 
                          textColor="muted-foreground"
                          data-class="footer-link-text"
                        >
                          {link.label}
                        </Text>
                      </Link>
                    ))}
                  </Stack>
                </Stack>
              ))}
            </Group>
          )}

          {/* Copyright */}
          <Group 
            justify="center" 
            items="center" 
            py="4"
            border=""
            data-class="footer-bottom"
          >
            <Text 
              fontSize="sm" 
              textColor="muted-foreground"
              textAlign="center"
              data-class="footer-copyright"
            >
              {copyright}
            </Text>
          </Group>
        </Stack>
      </Container>
    </Block>
  )
}
