# Expo Skeleton App Setup Guide

## Purpose
This document outlines the step-by-step process to create a React Native Expo skeleton app with all essential libraries. The goal is to:
1. Test build generation in isolation
2. Identify and resolve build issues before they affect the main project
3. Create a reusable template for future projects
4. Document working configurations and solutions

## Prerequisites
- Node.js >= 18.x
- npm or yarn
- Xcode (for iOS builds) - Latest stable version
- Android Studio (for Android builds) - Latest stable version
- EAS CLI: `npm install -g eas-cli`
- Expo CLI: `npm install -g expo-cli`
- EAS account (sign up at expo.dev)

## Phase 1: Initial Project Setup

### Step 1: Create New Expo App
```bash
# Create new expo app with TypeScript template
npx create-expo-app@latest nexus-skeleton --template expo-template-blank-typescript

# Navigate to project
cd nexus-skeleton

# Initialize git
git init
git add .
git commit -m "Initial commit: Expo TypeScript template"
```

### Step 2: Configure EAS Build
```bash
# Login to EAS
eas login

# Configure EAS
eas build:configure
```

**Expected Files Created:**
- `eas.json` - EAS build configuration
- `app.json` - App configuration

### Step 3: Update app.json Configuration
```json
{
  "expo": {
    "name": "Nexus Skeleton",
    "slug": "nexus-skeleton",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.nexus.skeleton",
      "infoPlist": {
        "NSCameraUsageDescription": "This app uses the camera to scan documents and capture photos.",
        "NSMicrophoneUsageDescription": "This app uses the microphone for video recording.",
        "NSPhotoLibraryUsageDescription": "This app accesses your photo library to select and upload images.",
        "NSContactsUsageDescription": "This app needs access to your contacts to help you connect with others."
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.nexus.skeleton",
      "permissions": [
        "CAMERA",
        "RECORD_AUDIO",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "READ_CONTACTS"
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png",
      "bundler": "metro"
    },
    "plugins": [
      "expo-router",
      [
        "expo-image-picker",
        {
          "photosPermission": "The app accesses your photos to let you share them with your friends."
        }
      ],
      [
        "react-native-vision-camera",
        {
          "cameraPermissionText": "$(PRODUCT_NAME) needs access to your Camera.",
          "enableMicrophonePermission": true,
          "microphonePermissionText": "$(PRODUCT_NAME) needs access to your Microphone."
        }
      ],
      [
        "expo-contacts",
        {
          "contactsPermission": "Allow $(PRODUCT_NAME) to access your contacts."
        }
      ]
    ],
    "scheme": "nexus-skeleton",
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

### Step 4: Update eas.json Configuration
```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "resourceClass": "m-medium"
      },
      "android": {
        "buildType": "apk"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false,
        "resourceClass": "m-medium"
      },
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "ios": {
        "resourceClass": "m-medium"
      },
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

## Phase 2: Install Core Navigation

### Step 5: Install Expo Router
```bash
# Install expo-router and dependencies
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar

# Commit
git add .
git commit -m "Add expo-router and dependencies"
```

### Step 6: Setup Expo Router File Structure
Create the following file structure:
```
nexus-skeleton/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── home.tsx
│   │   └── settings.tsx
│   └── +not-found.tsx
```

**File: app/_layout.tsx**
```typescript
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
```

**File: app/index.tsx**
```typescript
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/(tabs)/home" />;
}
```

**File: app/(tabs)/_layout.tsx**
```typescript
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ color }}>🏠</Text>,
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
```

**File: app/(tabs)/home.tsx**
```typescript
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});
```

**File: app/(tabs)/settings.tsx**
```typescript
import { View, Text, StyleSheet } from 'react-native';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});
```

**File: app/+not-found.tsx**
```typescript
import { Link, Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Text style={styles.title}>This screen doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
```

### Step 7: Update package.json Scripts
```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "test": "jest"
  }
}
```

**Update index.js (entry point)**
```javascript
import 'expo-router/entry';
```

```bash
# Commit
git add .
git commit -m "Setup expo-router file structure"
```

## Phase 3: Install State Management

### Step 8: Install Zustand
```bash
npm install zustand

# Commit
git add .
git commit -m "Add Zustand state management"
```

**Create: stores/useExampleStore.ts**
```typescript
import { create } from 'zustand';

interface ExampleState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export const useExampleStore = create<ExampleState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));
```

### Step 9: Install TanStack Query
```bash
npm install @tanstack/react-query

# Commit
git add .
git commit -m "Add TanStack Query"
```

**Create: providers/QueryProvider.tsx**
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export function QueryProvider({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

**Update: app/_layout.tsx** to include QueryProvider
```typescript
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
```

## Phase 4: Install Storage

### Step 10: Install MMKV
```bash
npx expo install react-native-mmkv

# Commit
git add .
git commit -m "Add MMKV storage"
```

**Create: utils/storage.ts**
```typescript
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export const storageUtils = {
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
  getItem: (key: string): string | undefined => {
    return storage.getString(key);
  },
  setObject: <T>(key: string, value: T) => {
    storage.set(key, JSON.stringify(value));
  },
  getObject: <T>(key: string): T | undefined => {
    const value = storage.getString(key);
    return value ? JSON.parse(value) : undefined;
  },
  removeItem: (key: string) => {
    storage.delete(key);
  },
  clearAll: () => {
    storage.clearAll();
  },
};
```

## Phase 5: Install List Components

### Step 11: Install FlashList
```bash
npm install @shopify/flash-list

# Commit
git add .
git commit -m "Add FlashList"
```

**Create: components/ExampleList.tsx**
```typescript
import { FlashList } from '@shopify/flash-list';
import { View, Text, StyleSheet } from 'react-native';

interface Item {
  id: string;
  title: string;
}

const DATA: Item[] = Array.from({ length: 100 }, (_, i) => ({
  id: `item-${i}`,
  title: `Item ${i + 1}`,
}));

export function ExampleList() {
  return (
    <FlashList
      data={DATA}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.title}>{item.title}</Text>
        </View>
      )}
      estimatedItemSize={50}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 16,
  },
});
```

## Phase 6: Install Image & Media Libraries

### Step 12: Install Expo Image
```bash
npx expo install expo-image

# Commit
git add .
git commit -m "Add expo-image"
```

**Create: components/ExampleImage.tsx**
```typescript
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

export function ExampleImage() {
  return (
    <Image
      style={styles.image}
      source="https://picsum.photos/seed/696/3000/2000"
      placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
      contentFit="cover"
      transition={1000}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 200,
  },
});
```

### Step 13: Install React Native Vision Camera
```bash
npx expo install react-native-vision-camera

# Commit
git add .
git commit -m "Add react-native-vision-camera"
```

**Create: components/CameraExample.tsx**
```typescript
import { Camera, useCameraDevices, useCameraPermission } from 'react-native-vision-camera';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useEffect } from 'react';

export function CameraExample() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const devices = useCameraDevices();
  const device = devices.back;

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>Camera permission is required</Text>
        <Button title="Request Permission" onPress={requestPermission} />
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text>No camera device found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

## Phase 7: Install File System & Contacts

### Step 14: Install Expo Contacts
```bash
npx expo install expo-contacts

# Commit
git add .
git commit -m "Add expo-contacts"
```

**Create: utils/contacts.ts**
```typescript
import * as Contacts from 'expo-contacts';

export async function requestContactsPermission(): Promise<boolean> {
  const { status } = await Contacts.requestPermissionsAsync();
  return status === 'granted';
}

export async function getContacts() {
  const hasPermission = await requestContactsPermission();

  if (!hasPermission) {
    throw new Error('Contacts permission denied');
  }

  const { data } = await Contacts.getContactsAsync({
    fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
  });

  return data;
}
```

### Step 15: Install Expo File System
```bash
npx expo install expo-file-system

# Commit
git add .
git commit -m "Add expo-file-system"
```

**Create: utils/fileSystem.ts**
```typescript
import * as FileSystem from 'expo-file-system';

export const fileSystemUtils = {
  documentDirectory: FileSystem.documentDirectory,
  cacheDirectory: FileSystem.cacheDirectory,

  async readFile(uri: string): Promise<string> {
    return await FileSystem.readAsStringAsync(uri);
  },

  async writeFile(uri: string, content: string): Promise<void> {
    await FileSystem.writeAsStringAsync(uri, content);
  },

  async deleteFile(uri: string): Promise<void> {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  },

  async getFileInfo(uri: string) {
    return await FileSystem.getInfoAsync(uri);
  },

  async downloadFile(url: string, filename: string) {
    const uri = `${FileSystem.documentDirectory}${filename}`;
    const downloadResult = await FileSystem.downloadAsync(url, uri);
    return downloadResult.uri;
  },
};
```

### Step 16: Install Expo Document Picker
```bash
npx expo install expo-document-picker

# Commit
git add .
git commit -m "Add expo-document-picker"
```

**Create: utils/documentPicker.ts**
```typescript
import * as DocumentPicker from 'expo-document-picker';

export async function pickDocument() {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    });

    if (!result.canceled) {
      return result.assets[0];
    }

    return null;
  } catch (error) {
    console.error('Error picking document:', error);
    throw error;
  }
}

export async function pickMultipleDocuments() {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
      multiple: true,
    });

    if (!result.canceled) {
      return result.assets;
    }

    return null;
  } catch (error) {
    console.error('Error picking documents:', error);
    throw error;
  }
}
```

## Phase 8: Install Document Processing Libraries

### Step 17: Install XLSX
```bash
npm install xlsx

# Commit
git add .
git commit -m "Add xlsx library"
```

**Create: utils/excel.ts**
```typescript
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';

export const excelUtils = {
  async parseExcelFile(uri: string) {
    try {
      const fileContent = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const workbook = XLSX.read(fileContent, { type: 'base64' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      return data;
    } catch (error) {
      console.error('Error parsing Excel file:', error);
      throw error;
    }
  },

  async createExcelFile(data: any[], filename: string) {
    try {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

      const wbout = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
      const uri = `${FileSystem.documentDirectory}${filename}`;

      await FileSystem.writeAsStringAsync(uri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return uri;
    } catch (error) {
      console.error('Error creating Excel file:', error);
      throw error;
    }
  },
};
```

### Step 18: Install pdf-lib
```bash
npm install pdf-lib

# For React Native polyfills
npm install react-native-get-random-values
npm install @craftzdog/react-native-buffer

# Commit
git add .
git commit -m "Add pdf-lib and polyfills"
```

**Create: utils/pdf.ts**
```typescript
import 'react-native-get-random-values';
import { Buffer } from '@craftzdog/react-native-buffer';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import * as FileSystem from 'expo-file-system';

// Polyfill Buffer globally
global.Buffer = Buffer;

export const pdfUtils = {
  async createPdf(text: string, filename: string) {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 400]);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      page.drawText(text, {
        x: 50,
        y: 350,
        size: 20,
        font,
        color: rgb(0, 0, 0),
      });

      const pdfBytes = await pdfDoc.save();
      const pdfBase64 = Buffer.from(pdfBytes).toString('base64');
      const uri = `${FileSystem.documentDirectory}${filename}`;

      await FileSystem.writeAsStringAsync(uri, pdfBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return uri;
    } catch (error) {
      console.error('Error creating PDF:', error);
      throw error;
    }
  },

  async readPdf(uri: string) {
    try {
      const pdfBase64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const pdfBytes = Buffer.from(pdfBase64, 'base64');
      const pdfDoc = await PDFDocument.load(pdfBytes);

      return {
        pageCount: pdfDoc.getPageCount(),
        title: pdfDoc.getTitle(),
        author: pdfDoc.getAuthor(),
      };
    } catch (error) {
      console.error('Error reading PDF:', error);
      throw error;
    }
  },
};
```

**Update: app/_layout.tsx** to include polyfills
```typescript
import 'react-native-get-random-values';
import { Buffer } from '@craftzdog/react-native-buffer';

// Polyfill Buffer globally
if (typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer;
}

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
```

## Phase 9: TypeScript Configuration

### Step 19: Update TypeScript Configuration
**Update: tsconfig.json**
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./components/*"],
      "@utils/*": ["./utils/*"],
      "@stores/*": ["./stores/*"],
      "@providers/*": ["./providers/*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ]
}
```

**Create: types/global.d.ts**
```typescript
/// <reference types="expo-router" />

declare global {
  namespace NodeJS {
    interface Global {
      Buffer: typeof Buffer;
    }
  }
  var Buffer: typeof Buffer;
}

export {};
```

```bash
# Commit
git add .
git commit -m "Update TypeScript configuration"
```

## Phase 10: Testing & Validation

### Step 20: Test Local Development
```bash
# Start development server
npx expo start

# Test on iOS simulator
npx expo start --ios

# Test on Android emulator
npx expo start --android

# Ensure no errors in console
# Navigate through all screens
# Test basic functionality
```

### Step 21: Create Integration Test Screen
**Create: app/(tabs)/test.tsx**
```typescript
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useExampleStore } from '../../stores/useExampleStore';
import { storageUtils } from '../../utils/storage';
import { pickDocument } from '../../utils/documentPicker';
import { getContacts } from '../../utils/contacts';
import { excelUtils } from '../../utils/excel';
import { pdfUtils } from '../../utils/pdf';

export default function TestScreen() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const { count, increment, decrement } = useExampleStore();

  const addResult = (result: string) => {
    setTestResults((prev) => [...prev, result]);
  };

  const testZustand = () => {
    increment();
    addResult(`✅ Zustand: Count is ${count + 1}`);
  };

  const testMMKV = () => {
    storageUtils.setItem('test', 'Hello MMKV');
    const value = storageUtils.getItem('test');
    addResult(`✅ MMKV: ${value}`);
  };

  const testDocumentPicker = async () => {
    try {
      const result = await pickDocument();
      addResult(`✅ Document Picker: ${result?.name || 'Cancelled'}`);
    } catch (error) {
      addResult(`❌ Document Picker: ${error}`);
    }
  };

  const testContacts = async () => {
    try {
      const contacts = await getContacts();
      addResult(`✅ Contacts: Found ${contacts.length} contacts`);
    } catch (error) {
      addResult(`❌ Contacts: ${error}`);
    }
  };

  const testPDF = async () => {
    try {
      const uri = await pdfUtils.createPdf('Test PDF Content', 'test.pdf');
      addResult(`✅ PDF: Created at ${uri}`);
    } catch (error) {
      addResult(`❌ PDF: ${error}`);
    }
  };

  const testExcel = async () => {
    try {
      const data = [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 },
      ];
      const uri = await excelUtils.createExcelFile(data, 'test.xlsx');
      addResult(`✅ Excel: Created at ${uri}`);
    } catch (error) {
      addResult(`❌ Excel: ${error}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Integration Tests</Text>

      <View style={styles.buttonContainer}>
        <Button title="Test Zustand" onPress={testZustand} />
        <Button title="Test MMKV" onPress={testMMKV} />
        <Button title="Test Document Picker" onPress={testDocumentPicker} />
        <Button title="Test Contacts" onPress={testContacts} />
        <Button title="Test PDF" onPress={testPDF} />
        <Button title="Test Excel" onPress={testExcel} />
        <Button
          title="Clear Results"
          onPress={() => setTestResults([])}
          color="red"
        />
      </View>

      <View style={styles.resultsContainer}>
        {testResults.map((result, index) => (
          <Text key={index} style={styles.result}>
            {result}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    gap: 10,
    marginBottom: 20,
  },
  resultsContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
  },
  result: {
    fontSize: 14,
    marginVertical: 5,
    fontFamily: 'monospace',
  },
});
```

**Update: app/(tabs)/_layout.tsx** to include test tab
```typescript
import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs>
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
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Text style={{ color }}>⚙️</Text>,
        }}
      />
    </Tabs>
  );
}
```

```bash
# Commit
git add .
git commit -m "Add integration test screen"
```

## Phase 11: Build Generation

### Step 22: Pre-build Check
```bash
# Install all dependencies
npm install

# Clear cache
npx expo start --clear

# Run prebuild to generate native folders
npx expo prebuild --clean

# Commit native folders
git add android ios
git commit -m "Add native folders from prebuild"
```

### Step 23: iOS Build (Development)
```bash
# Build for iOS simulator (for testing)
eas build --profile development --platform ios

# Build for iOS device (internal testing)
eas build --profile preview --platform ios

# Monitor build status
# Download and test the build
```

**Common iOS Issues & Solutions:**

1. **CocoaPods Installation Issues**
   - Solution: Update CocoaPods: `sudo gem install cocoapods`
   - Clear pod cache: `pod cache clean --all`

2. **Vision Camera Build Errors**
   - Solution: Ensure iOS deployment target is 13.0 or higher
   - Update Podfile: `platform :ios, '13.0'`

3. **Swift Version Mismatch**
   - Solution: Add to eas.json iOS config: `"cocoapods": "1.13.0"`

4. **Permission Descriptions Missing**
   - Solution: Verify all NSUsageDescription keys in app.json

### Step 24: Android Build (Development)
```bash
# Build for Android (APK for testing)
eas build --profile development --platform android

# Build for Android (AAB for production)
eas build --profile production --platform android

# Monitor build status
# Download and test the build
```

**Common Android Issues & Solutions:**

1. **Gradle Build Timeout**
   - Solution: Increase timeout in eas.json:
   ```json
   {
     "build": {
       "development": {
         "android": {
           "buildType": "apk",
           "gradleCommand": ":app:assembleDebug"
         }
       }
     }
   }
   ```

2. **Memory Issues During Build**
   - Solution: Add to android/gradle.properties:
   ```
   org.gradle.jvmargs=-Xmx4096m -XX:MaxPermSize=512m
   org.gradle.daemon=true
   org.gradle.parallel=true
   ```

3. **Vision Camera Native Module Not Found**
   - Solution: Ensure proper linking in android/app/build.gradle
   - Add to android/settings.gradle if needed

4. **MMKV Native Module Issues**
   - Solution: Rebuild native modules: `cd android && ./gradlew clean`

### Step 25: Production Build
```bash
# iOS Production
eas build --profile production --platform ios

# Android Production
eas build --profile production --platform android

# All platforms
eas build --profile production --platform all
```

## Phase 12: Documentation & Handoff

### Step 26: Document Known Issues
**Create: KNOWN_ISSUES.md**

```markdown
# Known Issues and Solutions

## Build Issues

### iOS
1. **Issue**: CocoaPods installation fails
   - **Solution**: Update Xcode Command Line Tools
   - **Command**: `xcode-select --install`

2. **Issue**: Vision Camera requires Camera permission
   - **Solution**: Added NSCameraUsageDescription to Info.plist via app.json

### Android
1. **Issue**: MMKV requires minSdkVersion 21
   - **Solution**: Set minSdkVersion in app.json android config

2. **Issue**: Vision Camera requires compileSdkVersion 33
   - **Solution**: EAS build automatically handles this

## Runtime Issues

### MMKV
- **Issue**: Storage not persisting between app restarts
- **Solution**: Ensure proper initialization before any storage calls

### PDF-lib
- **Issue**: Buffer not defined error
- **Solution**: Import polyfills at app entry point

### Vision Camera
- **Issue**: Camera not starting
- **Solution**: Ensure permissions are granted before using camera

## Performance Issues

### FlashList
- **Issue**: Warning about missing estimatedItemSize
- **Solution**: Always provide estimatedItemSize prop

### Expo Image
- **Issue**: Large images causing memory issues
- **Solution**: Use contentFit="cover" and proper image sizes
```

### Step 27: Create Usage Guide
**Create: USAGE_GUIDE.md**

```markdown
# Nexus Skeleton Usage Guide

## Quick Start
1. Clone the repository
2. Run `npm install`
3. Run `npx expo start`
4. Press `i` for iOS or `a` for Android

## Building for Production

### iOS
1. Ensure you have an Apple Developer account
2. Configure signing in eas.json
3. Run `eas build --profile production --platform ios`
4. Submit to App Store: `eas submit --platform ios`

### Android
1. Configure keystore in eas.json
2. Run `eas build --profile production --platform android`
3. Submit to Play Store: `eas submit --platform android`

## Adding New Libraries

### Native Libraries
1. Install using `npx expo install <package>`
2. Update app.json with required permissions
3. Run `npx expo prebuild --clean`
4. Test on both platforms

### JavaScript-only Libraries
1. Install using `npm install <package>`
2. No prebuild required
3. Test functionality

## Testing Checklist
- [ ] All navigation routes work
- [ ] State management (Zustand) works
- [ ] Storage (MMKV) persists data
- [ ] Document picker opens
- [ ] Contacts permission and access works
- [ ] Camera permission and access works
- [ ] PDF creation works
- [ ] Excel creation works
- [ ] Images load properly
- [ ] Lists scroll smoothly

## Troubleshooting

### Development Build Issues
1. Clear cache: `npx expo start --clear`
2. Clear node modules: `rm -rf node_modules && npm install`
3. Clear pods (iOS): `cd ios && pod deintegrate && pod install`
4. Rebuild: `npx expo prebuild --clean`

### Production Build Issues
1. Check EAS build logs for specific errors
2. Verify all required permissions are in app.json
3. Ensure all native dependencies are compatible
4. Test development build first
```

### Step 28: Final Verification Checklist
```bash
# Create checklist
```

**Create: BUILD_CHECKLIST.md**

```markdown
# Build Verification Checklist

## Pre-Build Checks
- [ ] All dependencies installed successfully
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] Development server starts without errors
- [ ] App runs on iOS simulator
- [ ] App runs on Android emulator
- [ ] All navigation works
- [ ] Integration tests pass

## Build Configuration
- [ ] app.json properly configured
- [ ] eas.json properly configured
- [ ] All permissions declared
- [ ] Bundle identifiers set
- [ ] Version numbers updated
- [ ] App icons and splash screens present

## iOS Build
- [ ] Development build succeeds
- [ ] Preview build succeeds
- [ ] Production build succeeds
- [ ] All permissions work on device
- [ ] No crashes on launch
- [ ] All features functional

## Android Build
- [ ] Development build succeeds
- [ ] Preview build succeeds
- [ ] Production build succeeds
- [ ] All permissions work on device
- [ ] No crashes on launch
- [ ] All features functional

## Post-Build Validation
- [ ] Install development build on physical device
- [ ] Test all critical user flows
- [ ] Test offline functionality
- [ ] Test permission requests
- [ ] Test file operations
- [ ] Test camera functionality
- [ ] Monitor for crashes

## Documentation
- [ ] README.md updated
- [ ] KNOWN_ISSUES.md created
- [ ] USAGE_GUIDE.md created
- [ ] BUILD_CHECKLIST.md completed
- [ ] All code committed to git
```

## Phase 13: Applying Learnings to Main Project

### Step 29: Document Differences
After successfully building the skeleton app, document any differences between the skeleton and the main project:

1. **Dependency Versions**: Compare package.json
2. **Configuration**: Compare app.json and eas.json
3. **Native Code**: Compare android/ and ios/ folders
4. **Permissions**: Compare permission declarations
5. **Build Settings**: Compare EAS build configurations

### Step 30: Migration Strategy
**Create: MIGRATION_STRATEGY.md**

```markdown
# Migration Strategy from Skeleton to Main Project

## Preparation
1. Backup main project: `git checkout -b backup-before-skeleton-migration`
2. Document current build issues
3. List all custom native modules in main project
4. Note any custom configurations

## Step-by-Step Migration

### Phase 1: Update Dependencies
1. Compare package.json versions
2. Update dependencies one at a time
3. Test after each major update
4. Commit after each successful update

### Phase 2: Update Configuration
1. Update app.json with working skeleton config
2. Update eas.json with working build profiles
3. Update tsconfig.json if needed
4. Test development build

### Phase 3: Update Native Code
1. Run `npx expo prebuild --clean`
2. Compare generated native code with skeleton
3. Merge any custom native modifications
4. Test on both platforms

### Phase 4: Validation
1. Run all tests
2. Build development version
3. Test on physical devices
4. Build production version
5. Final validation

## Rollback Plan
If migration fails:
1. `git checkout backup-before-skeleton-migration`
2. Review errors from migration attempt
3. Apply fixes to skeleton first
4. Retry migration with updated skeleton
```

## Expected Timeline

- **Phase 1-2**: Initial setup and navigation (1-2 hours)
- **Phase 3-5**: State management and storage (1 hour)
- **Phase 6-8**: Media, files, and documents (2-3 hours)
- **Phase 9-10**: Configuration and testing (1-2 hours)
- **Phase 11**: Build generation (2-4 hours)
- **Phase 12-13**: Documentation and migration (2-3 hours)

**Total Estimated Time**: 9-15 hours

## Success Criteria

✅ Skeleton app builds successfully for iOS
✅ Skeleton app builds successfully for Android
✅ All libraries integrated and functional
✅ All permissions work correctly
✅ No crashes or critical errors
✅ Documentation complete
✅ Migration strategy defined

## Next Steps

Once skeleton is verified:
1. Use skeleton as reference for fixing main project
2. Apply learnings systematically
3. Document any additional issues found
4. Update skeleton if new solutions discovered
5. Use skeleton as template for future projects

## Notes

- Always test on physical devices, not just simulators
- Keep skeleton updated with latest Expo SDK
- Document any workarounds or hacks
- Share learnings with team
- Consider this as living documentation

