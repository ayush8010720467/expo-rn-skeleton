import '../polyfills';

import { Stack } from 'expo-router';
import { QueryProvider } from '../providers/QueryProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}

