import { Block, Container, Text } from "@ui8kit/core";

export function Footer({ name = "UI8Kit" }: { name?: string }) {
  return (
    <Block
      component="footer"
      className="border-t bg-card mt-16"
      data-class="site-footer"
    >
      <Container className="container mx-auto px-4 py-8" data-class="site-footer-container">
        <Text text="sm" className="text-center text-muted-foreground">
          &copy; 2025 {name}. Built with React & CSS3.
        </Text>
      </Container>
    </Block>
  );
}
