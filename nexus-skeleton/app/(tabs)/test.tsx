import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useExampleStore } from '../../stores/useExampleStore';
import { useQuery } from '@tanstack/react-query';
import { storage } from '../../utils/storage';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import * as Contacts from 'expo-contacts';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Haptics from 'expo-haptics';
import NetInfo from '@react-native-community/netinfo';
import { Home, Heart, Star, CheckCircle, Loader2 } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { initializeSampleDatabase } from '../../utils/sqlite';

export default function TestScreen() {
  const { count, increment, decrement, reset } = useExampleStore();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  // Animation values
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const addResult = (message: string) => {
    setTestResults((prev) => [`✅ ${message}`, ...prev].slice(0, 50));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  };

  const addError = (message: string) => {
    setTestResults((prev) => [`❌ ${message}`, ...prev].slice(0, 50));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
  };

  // Network status listener
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  // Rotation animation
  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 2000 }), -1);
  }, []);

  const rotatingStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Flash List data
  const listData = Array.from({ length: 50 }, (_, i) => ({
    id: String(i),
    title: `Item ${i + 1}`,
    subtitle: `High-performance list item`,
  }));

  // React Query test
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['demo-data'],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 1000));
      return {
        message: 'Server data loaded!',
        timestamp: new Date().toLocaleTimeString(),
        count: Math.floor(Math.random() * 100),
      };
    },
  });

  // Test functions
  const testMMKV = () => {
    try {
      storage.set('demo_string', 'Hello MMKV!');
      storage.set('demo_number', 42);
      storage.set('demo_boolean', true);
      
      const str = storage.getString('demo_string');
      const num = storage.getNumber('demo_number');
      const bool = storage.getBoolean('demo_boolean');
      
      addResult(`MMKV: String="${str}", Number=${num}, Bool=${bool}`);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    } catch (error) {
      addError(`MMKV: ${error}`);
    }
  };

  const testSQLite = async () => {
    try {
      await initializeSampleDatabase();
      addResult('SQLite: Database initialized');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    } catch (error) {
      addError(`SQLite: ${error}`);
    }
  };

  const testContacts = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Name],
        });
        addResult(`Contacts: Found ${data.length} contacts`);
      } else {
        addError('Contacts: Permission denied');
      }
    } catch (error) {
      addError(`Contacts: ${error}`);
    }
  };

  const testDocumentPicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      if (!result.canceled) {
        const file = result.assets[0];
        addResult(`Document: ${file.name} (${Math.round(file.size! / 1024)}KB)`);
      }
    } catch (error) {
      addError(`Document: ${error}`);
    }
  };

  const testFileSystem = async () => {
    try {
      const uri = FileSystem.documentDirectory + 'test.txt';
      await FileSystem.writeAsStringAsync(uri, `Test at ${Date.now()}`);
      const content = await FileSystem.readAsStringAsync(uri);
      const info = await FileSystem.getInfoAsync(uri);
      addResult(`File: Wrote ${info.size} bytes, verified ✓`);
    } catch (error) {
      addError(`File: ${error}`);
    }
  };

  const testAnimations = () => {
    scale.value = withSequence(
      withSpring(1.3),
      withSpring(1)
    );
    addResult('Reanimated: Scale animation triggered');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  };

  const testHaptics = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await new Promise(r => setTimeout(r, 100));
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await new Promise(r => setTimeout(r, 100));
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      addResult('Haptics: Light → Medium → Heavy vibrations');
    } catch (error) {
      addError(`Haptics: ${error}`);
    }
  };

  const testNetwork = async () => {
    const state = await NetInfo.fetch();
    addResult(`Network: ${state.isConnected ? 'Online' : 'Offline'} (${state.type})`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>🧪 Library Test Suite</Text>
      <Text style={styles.subtitle}>Test all 29 integrated libraries</Text>

      {/* Network Status Bar */}
      <View style={[styles.statusBar, isConnected ? styles.online : styles.offline]}>
        <Text style={styles.statusText}>
          {isConnected === null ? '⚫ Checking...' : isConnected ? '🟢 Online' : '🔴 Offline'}
        </Text>
      </View>

      {/* State Management */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>⚡ State Management</Text>
        
        <View style={styles.testGroup}>
          <Text style={styles.label}>Zustand Counter: {count}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.smallButton} onPress={increment}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallButton} onPress={decrement}>
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallButton} onPress={reset}>
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.testGroup}>
          <Text style={styles.label}>React Query:</Text>
          {isLoading ? (
            <Text style={styles.infoText}>⏳ Loading...</Text>
          ) : data ? (
            <>
              <Text style={styles.infoText}>✅ {data.message}</Text>
              <Text style={styles.infoText}>Count: {data.count} | {data.timestamp}</Text>
            </>
          ) : null}
          <TouchableOpacity style={styles.button} onPress={() => refetch()}>
            <Text style={styles.buttonText}>Refetch Data</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Storage */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>💾 Storage</Text>
        <TouchableOpacity style={styles.button} onPress={testMMKV}>
          <Text style={styles.buttonText}>Test MMKV Storage</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={testSQLite}>
          <Text style={styles.buttonText}>Test SQLite Database</Text>
        </TouchableOpacity>
      </View>

      {/* UI Performance */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>⚡ UI Performance</Text>
        
        <Text style={styles.label}>FlashList (50 items):</Text>
        <View style={styles.listContainer}>
          <FlashList
            data={listData}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text style={styles.listTitle}>{item.title}</Text>
                <Text style={styles.listSubtitle}>{item.subtitle}</Text>
              </View>
            )}
            estimatedItemSize={60}
            keyExtractor={(item) => item.id}
          />
        </View>

        <Text style={styles.label}>Expo Image:</Text>
        <Image
          source={{ uri: 'https://picsum.photos/300/150' }}
          style={styles.demoImage}
          contentFit="cover"
          transition={300}
        />
      </View>

      {/* Animations */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🎬 Animations (Reanimated)</Text>
        <View style={styles.animationDemo}>
          <Animated.View style={[styles.rotatingBox, rotatingStyle]}>
            <Loader2 color="#FFFFFF" size={24} />
          </Animated.View>
          <Text style={styles.infoText}>Auto-rotating loader</Text>
        </View>
        <Animated.View style={scaleStyle}>
          <TouchableOpacity style={styles.button} onPress={testAnimations}>
            <Text style={styles.buttonText}>Test Scale Animation</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Icons */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🎨 Lucide Icons</Text>
        <View style={styles.iconRow}>
          <Home color="#007AFF" size={32} />
          <Heart color="#FF3B30" size={32} />
          <Star color="#FFCC00" size={32} />
          <CheckCircle color="#34C759" size={32} />
        </View>
      </View>

      {/* Device Features */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📱 Device Features</Text>
        <TouchableOpacity style={styles.button} onPress={testContacts}>
          <Text style={styles.buttonText}>📞 Access Contacts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={testDocumentPicker}>
          <Text style={styles.buttonText}>📄 Pick Document</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={testFileSystem}>
          <Text style={styles.buttonText}>💾 Test File System</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={testHaptics}>
          <Text style={styles.buttonText}>📳 Test Haptics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={testNetwork}>
          <Text style={styles.buttonText}>🌐 Check Network</Text>
        </TouchableOpacity>
      </View>

      {/* Test Results */}
      <View style={styles.card}>
        <View style={styles.resultsHeader}>
          <Text style={styles.cardTitle}>✅ Results ({testResults.length})</Text>
          {testResults.length > 0 && (
            <TouchableOpacity onPress={() => setTestResults([])}>
              <Text style={styles.clearButton}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
        {testResults.length === 0 ? (
          <Text style={styles.infoText}>Run tests to see results here</Text>
        ) : (
          <View style={styles.resultsContainer}>
            {testResults.map((result, index) => (
              <Text key={index} style={styles.resultText}>
                {result}
              </Text>
            ))}
          </View>
        )}
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  statusBar: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  online: {
    backgroundColor: '#D1F2EB',
  },
  offline: {
    backgroundColor: '#F8D7DA',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  testGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  smallButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  listContainer: {
    height: 200,
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
  },
  listItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  listSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  demoImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginTop: 8,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  animationDemo: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  rotatingBox: {
    width: 60,
    height: 60,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clearButton: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
    maxHeight: 300,
  },
  resultText: {
    fontSize: 13,
    fontFamily: 'monospace',
    marginVertical: 2,
    color: '#333',
  },
});
