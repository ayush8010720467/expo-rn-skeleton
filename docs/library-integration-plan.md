# Library Integration Plan - Systematic Approach

## Overview
This plan integrates all required libraries into the existing Nexus mobile app systematically, with validation at each step to catch build issues early.

## Prerequisites
- **Node.js 21.x** (Required for Expo SDK 54)
- **Expo SDK 54** (Latest stable)
- EAS CLI installed globally
- Clean git working directory

**Verify versions:**
```bash
node --version  # Should be v21.x.x
expo --version  # Should be 54.x.x
```

## Current State Analysis
- Expo SDK: Need to upgrade to 54.0.0 ✅
- Node.js: Should be 21.x for compatibility ✅
- newArchEnabled: true ⚠️ (may need to disable for compatibility)
- Missing: expo-router, tanstack-query, zustand, mmkv, flashlist, vision-camera, contacts, file-system, xlsx, pdf-lib, document-picker

## Strategy
Add libraries in dependency order, test builds incrementally, commit after each successful integration.

---

## Phase 1: Setup & Configuration (30 mins)

### Step 1.1: Create Feature Branch
```bash
cd /Users/ayushpersonal/Documents/personal-projects/nexus/apps/mobile
git checkout -b feature/add-essential-libraries
git push -u origin feature/add-essential-libraries
```

### Step 1.2: Create EAS Configuration
**Create: eas.json**
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
  }
}
```

### Step 1.3: Baseline Build Test
```bash
# Test current state builds
npm install
npx expo start --clear

# Try a development build
eas build --profile development --platform android
```

**Checkpoint:** If this fails, fix current issues first before proceeding.

```bash
git add eas.json
git commit -m "Add EAS build configuration"
```

---

## Phase 2: Core Navigation - Expo Router (2 hours)

### Step 2.1: Install Expo Router
```bash
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
```

### Step 2.2: Update app.json
```json
{
  "expo": {
    "name": "Nexus",
    "slug": "nexus",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": false,
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.anonymous.nexus",
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false
      }
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#5A4EC2"
      },
      "package": "com.anonymous.nexus"
    },
    "web": {
      "bundler": "metro"
    },
    "plugins": [
      "expo-router"
    ],
    "scheme": "nexus",
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "eas": {
        "projectId": "9cbf34e6-b253-417f-9f66-41c67516f8bc"
      }
    }
  }
}
```

**Key Changes:**
- `newArchEnabled: false` - Disable for compatibility
- `userInterfaceStyle: "automatic"` - Support dark mode
- `plugins: ["expo-router"]` - Enable expo-router
- `scheme: "nexus"` - Deep linking
- `experiments.typedRoutes: true` - Type-safe routing

### Step 2.3: Migrate to App Directory Structure
```bash
# Create app directory
mkdir -p app/(tabs)

# Move or create initial screens
```

**File: app/_layout.tsx**
```typescript
import { Stack } from 'expo-router';
import { ThemeProvider } from '@nexus/ui-mobile';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
```

**File: app/index.tsx**
```typescript
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/(tabs)/inventory" />;
}
```

**File: app/(tabs)/_layout.tsx**
```typescript
import { Tabs } from 'expo-router';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@nexus/ui-mobile';

export default function TabLayout() {
  const theme = useTheme<Theme>();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
      }}
    >
      <Tabs.Screen
        name="inventory"
        options={{
          title: 'Inventory',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="parties"
        options={{
          title: 'Parties',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reports',
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
```

**File: app/(tabs)/inventory.tsx**
```typescript
import { View, Text } from 'react-native';
import { Box, Typography } from '@nexus/ui-mobile';

export default function InventoryScreen() {
  return (
    <Box flex={1} justifyContent="center" alignItems="center">
      <Typography variant="heading1">Inventory</Typography>
    </Box>
  );
}
```

**Repeat for parties.tsx and reports.tsx**

### Step 2.4: Update Entry Point
**Update: index.js**
```javascript
import 'expo-router/entry';
```

### Step 2.5: Test
```bash
npm install
npx expo start --clear

# Test navigation works
# Ensure no errors in console
```

**Checkpoint:** App should run and navigate between tabs.

```bash
git add .
git commit -m "Add expo-router and migrate to app directory"
```

---

## Phase 3: State Management (1 hour)

### Step 3.1: Install Zustand & TanStack Query
```bash
npm install zustand @tanstack/react-query
```

### Step 3.2: Create Query Provider
**Create: src/infrastructure/providers/QueryProvider.tsx**
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
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

### Step 3.3: Create Example Store
**Create: src/infrastructure/stores/useInventoryStore.ts**
```typescript
import { create } from 'zustand';

interface InventoryState {
  items: any[];
  addItem: (item: any) => void;
  removeItem: (id: string) => void;
  clearAll: () => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id)
  })),
  clearAll: () => set({ items: [] }),
}));
```

### Step 3.4: Update Root Layout
**Update: app/_layout.tsx**
```typescript
import { Stack } from 'expo-router';
import { ThemeProvider } from '@nexus/ui-mobile';
import { QueryProvider } from '../src/infrastructure/providers/QueryProvider';

export default function RootLayout() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </QueryProvider>
  );
}
```

### Step 3.5: Test
```bash
npx expo start --clear

# Test that providers work
# No errors in console
```

```bash
git add .
git commit -m "Add zustand and tanstack-query"
```

---

## Phase 4: Storage - MMKV (30 mins)

### Step 4.1: Install MMKV
```bash
npx expo install react-native-mmkv
```

### Step 4.2: Create Storage Utility
**Create: src/infrastructure/storage/mmkv.ts**
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

### Step 4.3: Test
```bash
npx expo start --clear

# Test storage in app
# Try setting and getting values
```

```bash
git add .
git commit -m "Add MMKV storage"
```

---

## Phase 5: Lists - FlashList (30 mins)

### Step 5.1: Install FlashList
```bash
npm install @shopify/flash-list
```

### Step 5.2: Update Inventory Screen with FlashList
**Update: app/(tabs)/inventory.tsx**
```typescript
import { FlashList } from '@shopify/flash-list';
import { Box, Typography, Card } from '@nexus/ui-mobile';

const SAMPLE_DATA = Array.from({ length: 50 }, (_, i) => ({
  id: `item-${i}`,
  name: `Product ${i + 1}`,
  stock: Math.floor(Math.random() * 100),
}));

export default function InventoryScreen() {
  return (
    <Box flex={1}>
      <Box padding="m" backgroundColor="background">
        <Typography variant="heading1">Inventory</Typography>
      </Box>
      <FlashList
        data={SAMPLE_DATA}
        renderItem={({ item }) => (
          <Card margin="s" padding="m">
            <Typography variant="body1">{item.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              Stock: {item.stock}
            </Typography>
          </Card>
        )}
        estimatedItemSize={80}
      />
    </Box>
  );
}
```

### Step 5.3: Test
```bash
npx expo start --clear

# Test scrolling performance
# Should be smooth
```

```bash
git add .
git commit -m "Add FlashList for inventory"
```

---

## Phase 6: Images - Expo Image (30 mins)

### Step 6.1: Install Expo Image
```bash
npx expo install expo-image
```

### Step 6.2: Use in Components
**Example usage in inventory item:**
```typescript
import { Image } from 'expo-image';

<Image
  style={{ width: 50, height: 50, borderRadius: 8 }}
  source={{ uri: 'https://via.placeholder.com/150' }}
  placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
  contentFit="cover"
  transition={200}
/>
```

### Step 6.3: Test
```bash
npx expo start --clear

# Images should load smoothly
```

```bash
git add .
git commit -m "Add expo-image"
```

---

## Phase 7: Camera - Vision Camera (1-2 hours)

### Step 7.1: Install Vision Camera
```bash
npx expo install react-native-vision-camera
```

### Step 7.2: Update app.json with Permissions
```json
{
  "expo": {
    "plugins": [
      "expo-router",
      [
        "react-native-vision-camera",
        {
          "cameraPermissionText": "Nexus needs access to your camera to scan barcodes and capture photos.",
          "enableMicrophonePermission": true,
          "microphonePermissionText": "Nexus needs microphone access for video recording."
        }
      ]
    ],
    "ios": {
      "infoPlist": {
        "NSCameraUsageDescription": "Nexus needs access to your camera to scan barcodes and capture photos.",
        "NSMicrophoneUsageDescription": "Nexus needs microphone access for video recording."
      }
    },
    "android": {
      "permissions": [
        "CAMERA",
        "RECORD_AUDIO"
      ]
    }
  }
}
```

### Step 7.3: Create Camera Component
**Create: src/presentation/components/Camera/CameraScanner.tsx**
```typescript
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { Box, Button, Typography } from '@nexus/ui-mobile';
import { StyleSheet } from 'react-native';
import { useEffect } from 'react';

export function CameraScanner() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  if (!hasPermission) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" padding="l">
        <Typography variant="body1" marginBottom="m">
          Camera permission is required
        </Typography>
        <Button label="Grant Permission" onPress={requestPermission} />
      </Box>
    );
  }

  if (!device) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Typography variant="body1">No camera device found</Typography>
      </Box>
    );
  }

  return (
    <Box flex={1}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
      />
    </Box>
  );
}
```

### Step 7.4: Rebuild Native Code
```bash
# Vision camera requires native code rebuild
npx expo prebuild --clean

# Test on device (not simulator for camera)
```

**⚠️ WARNING: Camera requires physical device testing**

```bash
git add .
git commit -m "Add react-native-vision-camera"
```

---

## Phase 8: File System & Contacts (1 hour)

### Step 8.1: Install File System & Contacts
```bash
npx expo install expo-file-system expo-contacts expo-document-picker
```

### Step 8.2: Update app.json
```json
{
  "expo": {
    "plugins": [
      "expo-router",
      [
        "react-native-vision-camera",
        {
          "cameraPermissionText": "Nexus needs access to your camera.",
          "enableMicrophonePermission": true
        }
      ],
      [
        "expo-contacts",
        {
          "contactsPermission": "Allow Nexus to access your contacts."
        }
      ]
    ],
    "ios": {
      "infoPlist": {
        "NSCameraUsageDescription": "Nexus needs access to your camera.",
        "NSMicrophoneUsageDescription": "Nexus needs microphone access.",
        "NSContactsUsageDescription": "Nexus needs access to your contacts to help you manage parties."
      }
    },
    "android": {
      "permissions": [
        "CAMERA",
        "RECORD_AUDIO",
        "READ_CONTACTS"
      ]
    }
  }
}
```

### Step 8.3: Create Utilities
**Create: src/infrastructure/utils/contacts.ts**
```typescript
import * as Contacts from 'expo-contacts';

export const contactsUtils = {
  async requestPermission(): Promise<boolean> {
    const { status } = await Contacts.requestPermissionsAsync();
    return status === 'granted';
  },

  async getContacts() {
    const hasPermission = await this.requestPermission();

    if (!hasPermission) {
      throw new Error('Contacts permission denied');
    }

    const { data } = await Contacts.getContactsAsync({
      fields: [
        Contacts.Fields.Name,
        Contacts.Fields.PhoneNumbers,
        Contacts.Fields.Emails,
      ],
    });

    return data;
  },
};
```

**Create: src/infrastructure/utils/fileSystem.ts**
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

  async downloadFile(url: string, filename: string): Promise<string> {
    const uri = `${FileSystem.documentDirectory}${filename}`;
    const result = await FileSystem.downloadAsync(url, uri);
    return result.uri;
  },
};
```

**Create: src/infrastructure/utils/documentPicker.ts**
```typescript
import * as DocumentPicker from 'expo-document-picker';

export const documentPickerUtils = {
  async pickDocument() {
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
  },

  async pickMultipleDocuments() {
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
  },
};
```

### Step 8.4: Test
```bash
npx expo prebuild --clean
npx expo start --clear

# Test document picker
# Test contacts (on device)
```

```bash
git add .
git commit -m "Add file-system, contacts, and document-picker"
```

---

## Phase 9: Document Processing - XLSX & PDF (2 hours)

### Step 9.1: Install Libraries & Polyfills
```bash
npm install xlsx pdf-lib
npm install react-native-get-random-values @craftzdog/react-native-buffer
```

### Step 9.2: Setup Polyfills
**Create: src/infrastructure/polyfills.ts**
```typescript
import 'react-native-get-random-values';
import { Buffer } from '@craftzdog/react-native-buffer';

// Polyfill Buffer globally
if (typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer;
}

export {}; // Make this a module
```

**Update: app/_layout.tsx**
```typescript
import '../src/infrastructure/polyfills'; // Add at the very top

import { Stack } from 'expo-router';
import { ThemeProvider } from '@nexus/ui-mobile';
import { QueryProvider } from '../src/infrastructure/providers/QueryProvider';

// ... rest of the code
```

### Step 9.3: Create Excel Utility
**Create: src/infrastructure/utils/excel.ts**
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
      console.error('Error parsing Excel:', error);
      throw error;
    }
  },

  async createExcelFile(data: any[], filename: string): Promise<string> {
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
      console.error('Error creating Excel:', error);
      throw error;
    }
  },

  async exportInventoryToExcel(items: any[], filename: string = 'inventory.xlsx') {
    const data = items.map((item) => ({
      'Item Name': item.name,
      'Stock': item.stock,
      'Price': item.price,
      'Category': item.category,
    }));

    return await this.createExcelFile(data, filename);
  },
};
```

### Step 9.4: Create PDF Utility
**Create: src/infrastructure/utils/pdf.ts**
```typescript
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import * as FileSystem from 'expo-file-system';

export const pdfUtils = {
  async createPdf(content: string, filename: string): Promise<string> {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595, 842]); // A4 size
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      page.drawText(content, {
        x: 50,
        y: 800,
        size: 12,
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

  async createInvoicePdf(invoice: any, filename: string = 'invoice.pdf'): Promise<string> {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595, 842]);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      let yPosition = 800;

      // Title
      page.drawText('INVOICE', {
        x: 50,
        y: yPosition,
        size: 24,
        font: boldFont,
        color: rgb(0, 0, 0),
      });

      yPosition -= 40;

      // Invoice details
      page.drawText(`Invoice #: ${invoice.number}`, {
        x: 50,
        y: yPosition,
        size: 12,
        font,
      });

      yPosition -= 20;

      page.drawText(`Date: ${invoice.date}`, {
        x: 50,
        y: yPosition,
        size: 12,
        font,
      });

      yPosition -= 40;

      // Customer details
      page.drawText('Bill To:', {
        x: 50,
        y: yPosition,
        size: 14,
        font: boldFont,
      });

      yPosition -= 20;

      page.drawText(invoice.customer.name, {
        x: 50,
        y: yPosition,
        size: 12,
        font,
      });

      const pdfBytes = await pdfDoc.save();
      const pdfBase64 = Buffer.from(pdfBytes).toString('base64');
      const uri = `${FileSystem.documentDirectory}${filename}`;

      await FileSystem.writeAsStringAsync(uri, pdfBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return uri;
    } catch (error) {
      console.error('Error creating invoice PDF:', error);
      throw error;
    }
  },
};
```

### Step 9.5: Create Export Screen
**Create: app/export.tsx**
```typescript
import { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import { Box, Button, Typography, Card } from '@nexus/ui-mobile';
import { excelUtils } from '../src/infrastructure/utils/excel';
import { pdfUtils } from '../src/infrastructure/utils/pdf';
import * as Sharing from 'expo-sharing';

export default function ExportScreen() {
  const [loading, setLoading] = useState(false);

  const handleExportExcel = async () => {
    try {
      setLoading(true);
      const sampleData = [
        { name: 'Product 1', stock: 100, price: 29.99 },
        { name: 'Product 2', stock: 50, price: 49.99 },
      ];

      const uri = await excelUtils.createExcelFile(sampleData, 'test-export.xlsx');

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Success', `File saved at: ${uri}`);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to export: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setLoading(true);
      const uri = await pdfUtils.createPdf('Test PDF Content\n\nThis is a test PDF generated from the app.', 'test-export.pdf');

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Success', `File saved at: ${uri}`);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to export: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <Box padding="l">
        <Typography variant="heading1" marginBottom="l">
          Export Tools
        </Typography>

        <Card padding="m" marginBottom="m">
          <Typography variant="heading3" marginBottom="s">
            Excel Export
          </Typography>
          <Typography variant="body2" color="textSecondary" marginBottom="m">
            Export data to Excel spreadsheet format (.xlsx)
          </Typography>
          <Button
            label={loading ? 'Exporting...' : 'Export to Excel'}
            onPress={handleExportExcel}
            disabled={loading}
          />
        </Card>

        <Card padding="m">
          <Typography variant="heading3" marginBottom="s">
            PDF Export
          </Typography>
          <Typography variant="body2" color="textSecondary" marginBottom="m">
            Generate PDF documents with custom content
          </Typography>
          <Button
            label={loading ? 'Exporting...' : 'Export to PDF'}
            onPress={handleExportPDF}
            disabled={loading}
          />
        </Card>
      </Box>
    </ScrollView>
  );
}
```

### Step 9.6: Install Sharing
```bash
npx expo install expo-sharing
```

### Step 9.7: Test
```bash
npx expo start --clear

# Navigate to export screen
# Test Excel export
# Test PDF export
# Verify files can be shared/saved
```

```bash
git add .
git commit -m "Add xlsx and pdf-lib with export functionality"
```

---

## Phase 10: Build & Validate (2-3 hours)

### Step 10.1: Clean & Prebuild
```bash
# Clean everything
rm -rf node_modules
npm install

# Prebuild for native modules
npx expo prebuild --clean
```

### Step 10.2: Test Local Development
```bash
# iOS
npx expo run:ios

# Android
npx expo run:android

# Test all features work
```

### Step 10.3: Development Build via EAS
```bash
# Android development build
eas build --profile development --platform android --local

# If successful, try cloud build
eas build --profile development --platform android
```

### Step 10.4: iOS Build
```bash
# iOS development build
eas build --profile development --platform ios
```

### Step 10.5: Document Issues
Create a log of any issues encountered and solutions applied.

```bash
git add .
git commit -m "Complete library integration - all features working"
git push origin feature/add-essential-libraries
```

---

## Success Criteria

✅ All libraries installed and integrated
✅ No TypeScript errors
✅ Development server runs without errors
✅ Navigation works (expo-router)
✅ State management works (zustand, tanstack-query)
✅ Storage persists data (MMKV)
✅ Lists scroll smoothly (FlashList)
✅ Images load (expo-image)
✅ Camera works on device (vision-camera)
✅ Document picker opens
✅ Contacts accessible on device
✅ Excel export works
✅ PDF generation works
✅ Development build succeeds for Android
✅ Development build succeeds for iOS

---

## Rollback Plan

If at any step the build breaks:

1. **Identify the culprit**: Check the last commit before failure
2. **Revert**: `git revert HEAD` or `git reset --hard HEAD~1`
3. **Isolate**: Try adding the library in a separate minimal app
4. **Research**: Check library documentation and known issues
5. **Fix**: Apply solution and test
6. **Document**: Add to KNOWN_ISSUES.md

---

## Time Estimates

- Phase 1: 30 mins
- Phase 2: 2 hours (expo-router migration)
- Phase 3: 1 hour
- Phase 4: 30 mins
- Phase 5: 30 mins
- Phase 6: 30 mins
- Phase 7: 1-2 hours (camera is tricky)
- Phase 8: 1 hour
- Phase 9: 2 hours (document processing)
- Phase 10: 2-3 hours (builds and testing)

**Total: 10-13 hours**

---

## Next Steps After Completion

1. Create pull request for review
2. Test on multiple devices
3. Document any platform-specific quirks
4. Update shared package to use new features
5. Build production version
6. Create deployment checklist

