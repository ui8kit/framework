import { Block, Grid, Stack, Box, Button, Title, Text  } from "@ui8kit/core";
import { useTheme } from '@/providers/theme';

const content = {
  title: "Welcome to the dashboard",
  description: "This is the dashboard description"
}

export function Blank() {
  const { rounded } = useTheme();
  return (
    <Block w="full" component="section">
      <Stack gap="6">
        <Title text="2xl" bg="secondary-foreground" mt="6" data-class="home-title">{content.title}</Title>
        <Grid cols="1-2-3" data-class="home-grid">
          <Box col="span-2" data-class="home-description">
            <Text bg="muted-foreground">{content.description}</Text>
          </Box>
          <Box col="span-1" flex="" justify="end" items="end" data-class="home-button">
            <Button onClick={() => console.log("Button clicked")}>Click me</Button>
          </Box>
        </Grid>
        <Box p="4" rounded="lg" shadow="none" bg="card" border="" aspect="video" w="full"></Box>
      </Stack>
    </Block>
  );
}
