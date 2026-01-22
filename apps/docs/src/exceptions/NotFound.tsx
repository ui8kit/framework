import { Block, Stack, Title, Text } from '@ui8kit/core'

export default function NotFound() {
  return (
    <Block component="main" py="8">
      <Stack gap="6">
        <Stack gap="4">
          <Title order={1} text="2xl">Page not found</Title>
          <Text bg="secondary-foreground">Try searching for what you need:</Text>
        </Stack>
      </Stack>
    </Block>
  )
}


