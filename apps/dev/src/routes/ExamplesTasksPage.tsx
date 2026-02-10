import { Block, Container, Stack, Title, Text, Group, Button, Badge } from '@ui8kit/core';

export function ExamplesTasksPage() {
  return (
    <Block component="section" py="16" data-class="examples-tasks-section">
      <Container max="w-6xl" flex="col" gap="8" data-class="examples-tasks-container">
        <Stack gap="2" data-class="examples-tasks-header">
          <Title fontSize="2xl" fontWeight="bold" data-class="examples-tasks-title">
            Tasks
          </Title>
          <Text fontSize="sm" textColor="muted-foreground" data-class="examples-tasks-description">
            Task list and checklist examples.
          </Text>
        </Stack>
        <Stack gap="4" p="4" rounded="lg" bg="card" border="" data-class="examples-tasks-list">
          <Group justify="between" items="center" p="2" rounded="md" bg="muted" data-class="examples-task-item">
            <Text fontSize="sm" fontWeight="medium" data-class="examples-task-title">
              Task 1
            </Text>
            <Badge variant="default" data-class="examples-task-badge">
              Done
            </Badge>
          </Group>
          <Group justify="between" items="center" p="2" rounded="md" bg="muted" data-class="examples-task-item">
            <Text fontSize="sm" fontWeight="medium" data-class="examples-task-title">
              Task 2
            </Text>
            <Badge variant="secondary" data-class="examples-task-badge">
              In Progress
            </Badge>
          </Group>
          <Group justify="between" items="center" p="2" rounded="md" bg="muted" data-class="examples-task-item">
            <Text fontSize="sm" fontWeight="medium" data-class="examples-task-title">
              Task 3
            </Text>
            <Badge variant="outline" data-class="examples-task-badge">
              Todo
            </Badge>
          </Group>
        </Stack>
        <Group gap="2" data-class="examples-tasks-actions">
          <Button size="sm" data-class="examples-tasks-btn">
            Add Task
          </Button>
          <Button variant="outline" size="sm" data-class="examples-tasks-btn">
            Clear
          </Button>
        </Group>
      </Container>
    </Block>
  );
}
