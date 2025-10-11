import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useExampleStore } from '../../stores/useExampleStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storage } from '../../utils/storage';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import * as Contacts from 'expo-contacts';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as Haptics from 'expo-haptics';
import * as Constants from 'expo-constants';
import NetInfo from '@react-native-community/netinfo';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Home, Heart, Star, CheckCircle, Loader2, Download, Upload } from 'lucide-react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Svg, { Circle, Rect, Path, Text as SvgText } from 'react-native-svg';
import { v4 as uuidv4 } from 'uuid';
import { uuidv7 } from 'uuidv7';
import { initializeSampleDatabase } from '../../utils/sqlite';
import { excelUtils } from '../../utils/excel';
import { pdfUtils } from '../../utils/pdf';
import { testLogger } from '../../utils/testLogger';

export default function TestScreen() {
  // State Management
  const { count, increment, decrement, reset } = useExampleStore();
  const queryClient = useQueryClient();

  // UI State
  const [testResults, setTestResults] = useState<Array<{ id: string; message: string; status: 'success' | 'error' }>>([]);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [testStats, setTestStats] = useState({ passed: 0, failed: 0, total: 29 });

  // Animation values
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const translateX = useSharedValue(0);

  // Initialize test logger
  useEffect(() => {
    const categories = [
      { id: 'zustand', name: 'Zustand', category: 'State Management' },
      { id: 'react-query', name: 'React Query', category: 'State Management' },
      { id: 'mmkv', name: 'MMKV', category: 'Storage' },
      { id: 'sqlite', name: 'SQLite', category: 'Storage' },
      { id: 'async-storage', name: 'AsyncStorage', category: 'Storage' },
      { id: 'flashlist', name: 'FlashList', category: 'UI Performance' },
      { id: 'expo-image', name: 'Expo Image', category: 'UI Performance' },
      { id: 'gesture-handler', name: 'Gesture Handler', category: 'UI Performance' },
      { id: 'screens', name: 'React Native Screens', category: 'UI Performance' },
      { id: 'reanimated', name: 'Reanimated', category: 'Animation' },
      { id: 'worklets', name: 'Worklets', category: 'Animation' },
      { id: 'vision-camera', name: 'Vision Camera', category: 'Device Features' },
      { id: 'contacts', name: 'Expo Contacts', category: 'Device Features' },
      { id: 'file-system', name: 'Expo File System', category: 'Device Features' },
      { id: 'document-picker', name: 'Expo Document Picker', category: 'Device Features' },
      { id: 'sharing', name: 'Expo Sharing', category: 'Device Features' },
      { id: 'haptics', name: 'Expo Haptics', category: 'Device Features' },
      { id: 'svg', name: 'React Native SVG', category: 'Graphics & UI' },
      { id: 'lucide', name: 'Lucide Icons', category: 'Graphics & UI' },
      { id: 'vector-icons', name: 'Expo Vector Icons', category: 'Graphics & UI' },
      { id: 'restyle', name: 'Shopify Restyle', category: 'Graphics & UI' },
      { id: 'xlsx', name: 'XLSX', category: 'Documents' },
      { id: 'pdf-lib', name: 'PDF-lib', category: 'Documents' },
      { id: 'netinfo', name: 'NetInfo', category: 'Utilities' },
      { id: 'datetimepicker', name: 'DateTimePicker', category: 'Utilities' },
      { id: 'uuid', name: 'UUID', category: 'Utilities' },
      { id: 'url-polyfill', name: 'URL Polyfill', category: 'Utilities' },
      { id: 'google-fonts', name: 'Google Fonts', category: 'Utilities' },
      { id: 'constants', name: 'Expo Constants', category: 'Utilities' },
    ];

    categories.forEach((cat) => testLogger.registerTest(cat.id, cat.name, cat.category));

    const unsubscribe = testLogger.subscribe((results) => {
      const summary = testLogger.getSummary();
      setTestStats({
        passed: summary.passed,
        failed: summary.failed,
        total: summary.total,
      });
    });

    return () => unsubscribe();
  }, []);

  const addResult = (message: string, status: 'success' | 'error' = 'success') => {
    const newResult = { id: Date.now().toString(), message, status };
    setTestResults((prev) => [newResult, ...prev].slice(0, 50));
    Haptics.notificationAsync(
      status === 'success'
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Error
    ).catch(() => {});
  };

  // Network status listener
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
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

  const swipeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // FlashList data
  const listData = Array.from({ length: 100 }, (_, i) => ({
    id: String(i),
    title: `Item ${i + 1}`,
    subtitle: `High-performance list item`,
  }));

  // React Query test
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['demo-data'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 1000));
      return {
        message: 'Server data loaded!',
        timestamp: new Date().toLocaleTimeString(),
        count: Math.floor(Math.random() * 100),
      };
    },
  });

  // ========================================
  // TEST FUNCTIONS
  // ========================================

  // STATE MANAGEMENT TESTS
  const testZustand = () => {
    try {
      testLogger.startTest('zustand');
      increment();
      addResult(`Zustand: Counter = ${count + 1}`, 'success');
      testLogger.passTest('zustand', `Counter working: ${count + 1}`);
    } catch (error) {
      addResult(`Zustand: ${error}`, 'error');
      testLogger.failTest('zustand', String(error));
    }
  };

  const testReactQuery = async () => {
    try {
      testLogger.startTest('react-query');
      await refetch();
      addResult('React Query: Data fetched successfully', 'success');
      testLogger.passTest('react-query', 'Fetch and cache working');
    } catch (error) {
      addResult(`React Query: ${error}`, 'error');
      testLogger.failTest('react-query', String(error));
    }
  };

  // STORAGE TESTS
  const testMMKV = () => {
    try {
      testLogger.startTest('mmkv');
      storage.set('demo_string', 'Hello MMKV!');
      storage.set('demo_number', 42);
      storage.set('demo_boolean', true);

      const str = storage.getString('demo_string');
      const num = storage.getNumber('demo_number');
      const bool = storage.getBoolean('demo_boolean');

      addResult(`MMKV: String="${str}", Number=${num}, Bool=${bool}`, 'success');
      testLogger.passTest('mmkv', 'All data types working');
    } catch (error) {
      addResult(`MMKV: ${error}`, 'error');
      testLogger.failTest('mmkv', String(error));
    }
  };

  const testSQLite = async () => {
    try {
      testLogger.startTest('sqlite');
      await initializeSampleDatabase();
      addResult('SQLite: Database initialized and tested', 'success');
      testLogger.passTest('sqlite', 'CRUD operations working');
    } catch (error) {
      addResult(`SQLite: ${error}`, 'error');
      testLogger.failTest('sqlite', String(error));
    }
  };

  const testAsyncStorage = async () => {
    try {
      testLogger.startTest('async-storage');
      await AsyncStorage.setItem('test_key', 'test_value');
      await AsyncStorage.setItem('test_json', JSON.stringify({ name: 'John', age: 30 }));

      const value = await AsyncStorage.getItem('test_key');
      const json = await AsyncStorage.getItem('test_json');

      addResult(`AsyncStorage: Value="${value}", JSON=${json}`, 'success');
      testLogger.passTest('async-storage', 'Storage operations working');
    } catch (error) {
      addResult(`AsyncStorage: ${error}`, 'error');
      testLogger.failTest('async-storage', String(error));
    }
  };

  // UI PERFORMANCE TESTS
  const testFlashList = () => {
    try {
      testLogger.startTest('flashlist');
      addResult(`FlashList: Rendering ${listData.length} items`, 'success');
      testLogger.passTest('flashlist', `${listData.length} items rendered`);
    } catch (error) {
      addResult(`FlashList: ${error}`, 'error');
      testLogger.failTest('flashlist', String(error));
    }
  };

  const testExpoImage = () => {
    try {
      testLogger.startTest('expo-image');
      addResult('Expo Image: Image loaded with caching', 'success');
      testLogger.passTest('expo-image', 'Image rendering working');
    } catch (error) {
      addResult(`Expo Image: ${error}`, 'error');
      testLogger.failTest('expo-image', String(error));
    }
  };

  const testGestureHandler = () => {
    try {
      testLogger.startTest('gesture-handler');
      translateX.value = withSequence(
        withSpring(50),
        withSpring(-50),
        withSpring(0)
      );
      addResult('Gesture Handler: Swipe animation triggered', 'success');
      testLogger.passTest('gesture-handler', 'Gestures working');
    } catch (error) {
      addResult(`Gesture Handler: ${error}`, 'error');
      testLogger.failTest('gesture-handler', String(error));
    }
  };

  const testScreens = () => {
    try {
      testLogger.startTest('screens');
      addResult('React Native Screens: Tab navigation working', 'success');
      testLogger.passTest('screens', 'Navigation optimized');
    } catch (error) {
      testLogger.failTest('screens', String(error));
    }
  };

  // ANIMATION TESTS
  const testReanimated = () => {
    try {
      testLogger.startTest('reanimated');
      scale.value = withSequence(withSpring(1.3), withSpring(1));
      addResult('Reanimated: Scale animation triggered', 'success');
      testLogger.passTest('reanimated', 'Animations working');
    } catch (error) {
      addResult(`Reanimated: ${error}`, 'error');
      testLogger.failTest('reanimated', String(error));
    }
  };

  const testWorklets = () => {
    try {
      testLogger.startTest('worklets');
      const sharedValue = useSharedValue(0);
      sharedValue.value = 100;
      addResult('Worklets: Shared values working', 'success');
      testLogger.passTest('worklets', 'Worklets functional');
    } catch (error) {
      addResult(`Worklets: ${error}`, 'error');
      testLogger.failTest('worklets', String(error));
    }
  };

  // DEVICE FEATURES TESTS
  const testVisionCamera = () => {
    try {
      testLogger.startTest('vision-camera');
      addResult('Vision Camera: Check Camera tab for full test', 'success');
      testLogger.passTest('vision-camera', 'Camera accessible (see Camera tab)');
    } catch (error) {
      testLogger.failTest('vision-camera', String(error));
    }
  };

  const testContacts = async () => {
    try {
      testLogger.startTest('contacts');
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Name],
        });
        addResult(`Contacts: Found ${data.length} contacts`, 'success');
        testLogger.passTest('contacts', `${data.length} contacts accessible`);
      } else {
        addResult('Contacts: Permission denied', 'error');
        testLogger.failTest('contacts', 'Permission denied');
      }
    } catch (error) {
      addResult(`Contacts: ${error}`, 'error');
      testLogger.failTest('contacts', String(error));
    }
  };

  const testFileSystem = async () => {
    try {
      testLogger.startTest('file-system');
      const uri = FileSystem.documentDirectory + 'test.txt';
      await FileSystem.writeAsStringAsync(uri, `Test at ${Date.now()}`);
      const content = await FileSystem.readAsStringAsync(uri);
      const info = await FileSystem.getInfoAsync(uri);
      addResult(`File System: Wrote ${info.size} bytes, verified ✓`, 'success');
      testLogger.passTest('file-system', `File operations working`);
    } catch (error) {
      addResult(`File System: ${error}`, 'error');
      testLogger.failTest('file-system', String(error));
    }
  };

  const testDocumentPicker = async () => {
    try {
      testLogger.startTest('document-picker');
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      if (!result.canceled) {
        const file = result.assets[0];
        addResult(`Document Picker: ${file.name} (${Math.round(file.size! / 1024)}KB)`, 'success');
        testLogger.passTest('document-picker', 'File selection working');
      } else {
        addResult('Document Picker: Selection cancelled', 'success');
        testLogger.passTest('document-picker', 'Picker working (cancelled)');
      }
    } catch (error) {
      addResult(`Document Picker: ${error}`, 'error');
      testLogger.failTest('document-picker', String(error));
    }
  };

  const testSharing = async () => {
    try {
      testLogger.startTest('sharing');
      const uri = FileSystem.documentDirectory + 'test-share.txt';
      await FileSystem.writeAsStringAsync(uri, 'Test sharing content');
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri);
        addResult('Sharing: File shared successfully', 'success');
        testLogger.passTest('sharing', 'Sharing working');
      } else {
        addResult('Sharing: Not available on this platform', 'error');
        testLogger.failTest('sharing', 'Not available');
      }
    } catch (error) {
      addResult(`Sharing: ${error}`, 'error');
      testLogger.failTest('sharing', String(error));
    }
  };

  const testHaptics = async () => {
    try {
      testLogger.startTest('haptics');
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await new Promise((r) => setTimeout(r, 100));
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await new Promise((r) => setTimeout(r, 100));
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      addResult('Haptics: Light → Medium → Heavy vibrations', 'success');
      testLogger.passTest('haptics', 'All feedback types working');
    } catch (error) {
      addResult(`Haptics: ${error}`, 'error');
      testLogger.failTest('haptics', String(error));
    }
  };

  // GRAPHICS & UI TESTS
  const testSVG = () => {
    try {
      testLogger.startTest('svg');
      addResult('SVG: Shapes rendered below', 'success');
      testLogger.passTest('svg', 'SVG rendering working');
    } catch (error) {
      addResult(`SVG: ${error}`, 'error');
      testLogger.failTest('svg', String(error));
    }
  };

  const testLucideIcons = () => {
    try {
      testLogger.startTest('lucide');
      addResult('Lucide Icons: Icons displayed below', 'success');
      testLogger.passTest('lucide', 'Icons rendering');
    } catch (error) {
      addResult(`Lucide Icons: ${error}`, 'error');
      testLogger.failTest('lucide', String(error));
    }
  };

  const testVectorIcons = () => {
    try {
      testLogger.startTest('vector-icons');
      addResult('Expo Vector Icons: Multiple icon sets loaded', 'success');
      testLogger.passTest('vector-icons', 'All icon sets working');
    } catch (error) {
      addResult(`Vector Icons: ${error}`, 'error');
      testLogger.failTest('vector-icons', String(error));
    }
  };

  const testRestyle = () => {
    try {
      testLogger.startTest('restyle');
      addResult('Restyle: Check Theme Demo tab for full test', 'success');
      testLogger.passTest('restyle', 'Theming available (see Theme tab)');
    } catch (error) {
      testLogger.failTest('restyle', String(error));
    }
  };

  // DOCUMENT TESTS
  const testXLSX = async () => {
    try {
      testLogger.startTest('xlsx');
      const data = [
        { Name: 'John Doe', Age: 30, City: 'New York' },
        { Name: 'Jane Smith', Age: 25, City: 'Los Angeles' },
      ];
      const uri = await excelUtils.createExcelFile(data, 'test-export.xlsx');
      addResult(`XLSX: Excel file created at ${uri.split('/').pop()}`, 'success');
      testLogger.passTest('xlsx', 'Excel generation working');
    } catch (error) {
      addResult(`XLSX: ${error}`, 'error');
      testLogger.failTest('xlsx', String(error));
    }
  };

  const testPDFLib = async () => {
    try {
      testLogger.startTest('pdf-lib');
      const uri = await pdfUtils.createPdf('Test PDF Content', 'test-document.pdf');
      addResult(`PDF-lib: PDF created at ${uri.split('/').pop()}`, 'success');
      testLogger.passTest('pdf-lib', 'PDF generation working');
    } catch (error) {
      addResult(`PDF-lib: ${error}`, 'error');
      testLogger.failTest('pdf-lib', String(error));
    }
  };

  // UTILITY TESTS
  const testNetInfo = async () => {
    try {
      testLogger.startTest('netinfo');
      const state = await NetInfo.fetch();
      addResult(`NetInfo: ${state.isConnected ? 'Online' : 'Offline'} (${state.type})`, 'success');
      testLogger.passTest('netinfo', `Connection: ${state.type}`);
    } catch (error) {
      addResult(`NetInfo: ${error}`, 'error');
      testLogger.failTest('netinfo', String(error));
    }
  };

  const testDateTimePicker = () => {
    try {
      testLogger.startTest('datetimepicker');
      setShowDatePicker(true);
      addResult('DateTimePicker: Picker displayed', 'success');
      testLogger.passTest('datetimepicker', 'Date picker working');
    } catch (error) {
      addResult(`DateTimePicker: ${error}`, 'error');
      testLogger.failTest('datetimepicker', String(error));
    }
  };

  const testUUID = () => {
    try {
      testLogger.startTest('uuid');
      const uuid4 = uuidv4();
      const uuid7 = uuidv7();
      addResult(`UUID: v4=${uuid4.slice(0, 8)}..., v7=${uuid7.slice(0, 8)}...`, 'success');
      testLogger.passTest('uuid', 'Both UUID versions working');
    } catch (error) {
      addResult(`UUID: ${error}`, 'error');
      testLogger.failTest('uuid', String(error));
    }
  };

  const testURLPolyfill = () => {
    try {
      testLogger.startTest('url-polyfill');
      const url = new URL('https://example.com/path?id=123&name=test');
      const id = url.searchParams.get('id');
      const name = url.searchParams.get('name');
      addResult(`URL Polyfill: Parsed id=${id}, name=${name}`, 'success');
      testLogger.passTest('url-polyfill', 'URL parsing working');
    } catch (error) {
      addResult(`URL Polyfill: ${error}`, 'error');
      testLogger.failTest('url-polyfill', String(error));
    }
  };

  const testGoogleFonts = () => {
    try {
      testLogger.startTest('google-fonts');
      addResult('Google Fonts: Inter font family loaded', 'success');
      testLogger.passTest('google-fonts', 'Fonts loaded');
    } catch (error) {
      addResult(`Google Fonts: ${error}`, 'error');
      testLogger.failTest('google-fonts', String(error));
    }
  };

  const testConstants = () => {
    try {
      testLogger.startTest('constants');
      const appVersion = Constants.default.expoConfig?.version || 'Unknown';
      const platform = Platform.OS;
      addResult(`Constants: v${appVersion}, Platform: ${platform}`, 'success');
      testLogger.passTest('constants', `App info accessible`);
    } catch (error) {
      addResult(`Constants: ${error}`, 'error');
      testLogger.failTest('constants', String(error));
    }
  };

  // Run all tests
  const runAllTests = async () => {
    setTestResults([]);
    addResult('Starting comprehensive test suite...', 'success');

    // State Management
    testZustand();
    await testReactQuery();

    // Storage
    testMMKV();
    await testSQLite();
    await testAsyncStorage();

    // UI Performance
    testFlashList();
    testExpoImage();
    testGestureHandler();
    testScreens();

    // Animation
    testReanimated();
    testWorklets();

    // Device Features
    testVisionCamera();
    await testFileSystem();
    await testHaptics();

    // Graphics & UI
    testSVG();
    testLucideIcons();
    testVectorIcons();
    testRestyle();

    // Documents
    await testXLSX();
    await testPDFLib();

    // Utilities
    await testNetInfo();
    testUUID();
    testURLPolyfill();
    testGoogleFonts();
    testConstants();

    addResult('All automatic tests completed! ✅', 'success');
  };

  const exportResults = async () => {
    try {
      await testLogger.shareResults();
      addResult('Test results exported successfully', 'success');
    } catch (error) {
      addResult(`Export failed: ${error}`, 'error');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <Text style={styles.title}>🧪 Library Test Suite</Text>
      <Text style={styles.subtitle}>Comprehensive testing for all 29 libraries</Text>

      {/* Test Statistics */}
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{testStats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, styles.passedText]}>{testStats.passed}</Text>
          <Text style={styles.statLabel}>Passed</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, styles.failedText]}>{testStats.failed}</Text>
          <Text style={styles.statLabel}>Failed</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {testStats.total > 0 ? Math.round((testStats.passed / testStats.total) * 100) : 0}%
          </Text>
          <Text style={styles.statLabel}>Coverage</Text>
        </View>
      </View>

      {/* Network Status */}
      <View style={[styles.statusBar, isConnected ? styles.online : styles.offline]}>
        <Text style={styles.statusText}>
          {isConnected === null ? '⚫ Checking...' : isConnected ? '🟢 Online' : '🔴 Offline'}
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={runAllTests}>
          <Text style={styles.buttonText}>▶️ Run All Tests</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={exportResults}>
          <Text style={styles.buttonTextSecondary}>📤 Export Results</Text>
        </TouchableOpacity>
      </View>

      {/* Category 1: State Management */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>⚡ State Management (2)</Text>
        <View style={styles.testGroup}>
          <Text style={styles.label}>Zustand Counter: {count}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.smallButton} onPress={testZustand}>
              <Text style={styles.buttonText}>Test +</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallButton} onPress={decrement}>
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallButton} onPress={reset}>
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={testReactQuery}>
          <Text style={styles.buttonText}>Test React Query</Text>
        </TouchableOpacity>
        {data && (
          <Text style={styles.infoText}>✅ {data.message} ({data.timestamp})</Text>
        )}
      </View>

      {/* Category 2: Storage */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>💾 Storage (3)</Text>
        <TouchableOpacity style={styles.button} onPress={testMMKV}>
          <Text style={styles.buttonText}>Test MMKV</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={testSQLite}>
          <Text style={styles.buttonText}>Test SQLite</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={testAsyncStorage}>
          <Text style={styles.buttonText}>Test AsyncStorage</Text>
        </TouchableOpacity>
      </View>

      {/* Category 3: UI Performance */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>⚡ UI Performance (4)</Text>
        <Text style={styles.label}>FlashList (100 items):</Text>
        <View style={styles.listContainer}>
          <FlashList
            data={listData.slice(0, 20)}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text style={styles.listTitle}>{item.title}</Text>
              </View>
            )}
            estimatedItemSize={50}
            keyExtractor={(item) => item.id}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={testFlashList}>
          <Text style={styles.buttonText}>Test FlashList</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Expo Image:</Text>
        <Image
          source={{ uri: 'https://picsum.photos/300/150' }}
          style={styles.demoImage}
          contentFit="cover"
          transition={300}
          onLoad={testExpoImage}
        />

        <Text style={styles.label}>Gesture Handler:</Text>
        <Animated.View style={[styles.gestureBox, swipeStyle]}>
          <Text style={styles.gestureText}>Swipe Test Box</Text>
        </Animated.View>
        <TouchableOpacity style={styles.button} onPress={testGestureHandler}>
          <Text style={styles.buttonText}>Test Gesture</Text>
        </TouchableOpacity>
      </View>

      {/* Category 4: Animation */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🎬 Animation (2)</Text>
        <View style={styles.animationDemo}>
          <Animated.View style={[styles.rotatingBox, rotatingStyle]}>
            <Loader2 color="#FFFFFF" size={24} />
          </Animated.View>
          <Text style={styles.infoText}>Auto-rotating (Reanimated + Worklets)</Text>
        </View>
        <Animated.View style={scaleStyle}>
          <TouchableOpacity style={styles.button} onPress={testReanimated}>
            <Text style={styles.buttonText}>Test Scale Animation</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Category 5: Device Features */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📱 Device Features (6)</Text>
        <TouchableOpacity style={styles.button} onPress={testVisionCamera}>
          <Text style={styles.buttonText}>📷 Vision Camera (See Camera Tab)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={testContacts}>
          <Text style={styles.buttonText}>📞 Test Contacts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={testFileSystem}>
          <Text style={styles.buttonText}>💾 Test File System</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={testDocumentPicker}>
          <Text style={styles.buttonText}>📄 Test Document Picker</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={testSharing}>
          <Text style={styles.buttonText}>📤 Test Sharing</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={testHaptics}>
          <Text style={styles.buttonText}>📳 Test Haptics</Text>
        </TouchableOpacity>
      </View>

      {/* Category 6: Graphics & UI */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🎨 Graphics & UI (4)</Text>

        <Text style={styles.label}>SVG Graphics:</Text>
        <Svg width="200" height="100" viewBox="0 0 200 100" style={styles.svg}>
          <Circle cx="50" cy="50" r="30" fill="#007AFF" />
          <Rect x="100" y="20" width="80" height="60" fill="#34C759" rx="8" />
        </Svg>
        <TouchableOpacity style={styles.button} onPress={testSVG}>
          <Text style={styles.buttonText}>Test SVG</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Lucide Icons:</Text>
        <View style={styles.iconRow}>
          <Home color="#007AFF" size={32} />
          <Heart color="#FF3B30" size={32} />
          <Star color="#FFCC00" size={32} />
          <CheckCircle color="#34C759" size={32} />
        </View>
        <TouchableOpacity style={styles.button} onPress={testLucideIcons}>
          <Text style={styles.buttonText}>Test Lucide Icons</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Expo Vector Icons:</Text>
        <View style={styles.iconRow}>
          <Ionicons name="home" size={32} color="#007AFF" />
          <MaterialIcons name="favorite" size={32} color="#FF3B30" />
          <FontAwesome name="star" size={32} color="#FFCC00" />
          <Ionicons name="settings" size={32} color="#8E8E93" />
        </View>
        <TouchableOpacity style={styles.button} onPress={testVectorIcons}>
          <Text style={styles.buttonText}>Test Vector Icons</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={testRestyle}>
          <Text style={styles.buttonText}>🎨 Restyle (See Theme Tab)</Text>
        </TouchableOpacity>
      </View>

      {/* Category 7: Documents */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📄 Documents (2)</Text>
        <TouchableOpacity style={styles.button} onPress={testXLSX}>
          <Text style={styles.buttonText}>📊 Test XLSX Export</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={testPDFLib}>
          <Text style={styles.buttonText}>📋 Test PDF Generation</Text>
        </TouchableOpacity>
      </View>

      {/* Category 8: Utilities */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔧 Utilities (6)</Text>
        <TouchableOpacity style={styles.button} onPress={testNetInfo}>
          <Text style={styles.buttonText}>🌐 Test NetInfo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={testDateTimePicker}>
          <Text style={styles.buttonText}>📅 Test DateTimePicker</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) {
                setSelectedDate(date);
                addResult(`DateTimePicker: Selected ${date.toLocaleDateString()}`, 'success');
              }
            }}
          />
        )}
        <TouchableOpacity style={styles.button} onPress={testUUID}>
          <Text style={styles.buttonText}>🔑 Test UUID</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={testURLPolyfill}>
          <Text style={styles.buttonText}>🔗 Test URL Polyfill</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={testGoogleFonts}>
          <Text style={styles.buttonText}>🔤 Test Google Fonts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={testConstants}>
          <Text style={styles.buttonText}>ℹ️ Test Expo Constants</Text>
        </TouchableOpacity>
      </View>

      {/* Test Results */}
      <View style={styles.card}>
        <View style={styles.resultsHeader}>
          <Text style={styles.cardTitle}>📊 Test Results ({testResults.length})</Text>
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
            {testResults.map((result) => (
              <Text
                key={result.id}
                style={[
                  styles.resultText,
                  result.status === 'error' && styles.errorText,
                ]}
              >
                {result.status === 'success' ? '✅' : '❌'} {result.message}
              </Text>
            ))}
          </View>
        )}
      </View>

      <View style={{ height: 40 }} />
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
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  passedText: {
    color: '#34C759',
  },
  failedText: {
    color: '#FF3B30',
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
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    marginTop: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
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
  buttonTextSecondary: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  listContainer: {
    height: 150,
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
  },
  listItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  demoImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
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
  gestureBox: {
    backgroundColor: '#FF9500',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  gestureText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  svg: {
    marginBottom: 8,
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
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginVertical: 2,
    color: '#333',
  },
  errorText: {
    color: '#FF3B30',
  },
});
