/**
 * UserProfile - Example with nested conditions
 */

import { Block, Stack, Group, Title, Text, Image, Button, Badge, Box } from '@ui8kit/core';
import { Var, If, Else, ElseIf, Slot } from '@ui8kit/template';

interface UserProfileProps {
  user?: {
    name: string;
    email: string;
    role: 'admin' | 'user' | 'guest';
    avatar?: string;
  };
  isLoggedIn?: boolean;
  children?: React.ReactNode;
}

export function UserProfile({ user, isLoggedIn, children }: UserProfileProps) {
  return (
    <Block rounded="lg" shadow="sm" p="6" bg="card" data-class="user-profile">
      <If test="isLoggedIn" value={isLoggedIn}>
        <Stack gap="4" data-class="user-profile-logged-in">
          <Group gap="4" items="center" data-class="user-profile-header">
            <If test="user.avatar" value={!!user?.avatar}>
              <Image
                src={user?.avatar || ''}
                alt="Avatar"
                w="8"
                h="8"
                rounded="full"
                data-class="user-profile-avatar"
              />
            </If>
            <Else>
              <Box
                w="8"
                h="8"
                rounded="full"
                bg="muted"
                flex=""
                items="center"
                justify="center"
                data-class="user-profile-avatar-placeholder"
              >
                <Title fontSize="2xl" fontWeight="bold" textColor="muted-foreground" data-class="user-profile-initial">
                  <Var name="user.name[0]" value={user?.name?.[0]} />
                </Title>
              </Box>
            </Else>

            <Stack gap="1" data-class="user-profile-info">
              <Title fontSize="xl" fontWeight="bold" data-class="user-profile-name">
                <Var name="user.name" value={user?.name} />
              </Title>
              <Text fontSize="sm" textColor="muted-foreground" data-class="user-profile-email">
                <Var name="user.email" value={user?.email} />
              </Text>

              <If test="user.role === 'admin'" value={user?.role === 'admin'}>
                <Badge variant="secondary" data-class="user-profile-role-admin">
                  Admin
                </Badge>
              </If>
              <ElseIf test="user.role === 'user'" value={user?.role === 'user'}>
                <Badge variant="secondary" data-class="user-profile-role-user">
                  User
                </Badge>
              </ElseIf>
              <Else>
                <Badge variant="outline" data-class="user-profile-role-guest">
                  Guest
                </Badge>
              </Else>
            </Stack>
          </Group>

          <Slot name="actions">{children}</Slot>
        </Stack>
      </If>

      <Else>
        <Stack gap="4" items="center" py="8" data-class="user-profile-guest">
          <Text textAlign="center" textColor="muted-foreground" data-class="user-profile-login-prompt">
            Please log in to view your profile
          </Text>
          <Button data-class="user-profile-login-button">Log In</Button>
        </Stack>
      </Else>
    </Block>
  );
}
