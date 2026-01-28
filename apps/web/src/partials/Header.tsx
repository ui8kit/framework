import { Box, Group, Text } from "@ui8kit/core";

export function Header({ name = "Welcome to UI8Kit", greeting = "Hello!" }: { name?: string; greeting?: string }) {
  return (
    <Group gap="2" items="center" className="py-6" data-class="page-header">
      <Box
        w="8"
        h="8"
        rounded="full"
        bg="primary"
        data-class="page-header-icon"
      />
      <div data-class="page-header-content">
        <Text font="bold" text="lg" data-class="page-header-greeting">
          {greeting}
        </Text>
        <Text text="sm" className="text-muted-foreground" data-class="page-header-name">
          {name}
        </Text>
      </div>
    </Group>
  );
}
