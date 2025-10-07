import '../polyfills';

import { Stack } from 'expo-router';
import { QueryProvider } from '../providers/QueryProvider';

export default function RootLayout() {
  return (
    <QueryProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </QueryProvider>
  );
}

