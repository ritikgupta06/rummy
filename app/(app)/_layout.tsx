import { Stack } from 'expo-router';
import { useAuthStore } from '@/src/store';
import { Redirect } from 'expo-router';
import { View } from 'react-native';
import { colors } from '@/src/theme';

export default function AppLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Redirect href="/welcome" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="create-room" />
      <Stack.Screen name="join-room" />
      <Stack.Screen name="lobby" />
      <Stack.Screen name="game" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
