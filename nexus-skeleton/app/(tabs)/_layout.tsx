import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: '#8E8E93',
      tabBarStyle: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E5EA',
      },
    }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ color }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="test"
        options={{
          title: 'Tests',
          tabBarIcon: ({ color }) => <Text style={{ color }}>🧪</Text>,
        }}
      />
      <Tabs.Screen
        name="gestures"
        options={{
          title: 'Gestures',
          tabBarIcon: ({ color }) => <Text style={{ color }}>👋</Text>,
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Camera',
          tabBarIcon: ({ color }) => <Text style={{ color }}>📷</Text>,
        }}
      />
      <Tabs.Screen
        name="theme-demo"
        options={{
          title: 'Theme',
          tabBarIcon: ({ color }) => <Text style={{ color }}>🎨</Text>,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Text style={{ color }}>⚙️</Text>,
        }}
      />
    </Tabs>
  );
}

