# Nexus Skeleton - Complete Expo App Template

A production-ready Expo skeleton app with all essential libraries integrated and tested.

## 📋 Included Libraries

### Core Navigation
- ✅ **expo-router** (v6.0.10) - File-based routing with TypeScript
- ✅ react-native-safe-area-context
- ✅ react-native-screens

### State Management
- ✅ **zustand** - Lightweight client state management
- ✅ **@tanstack/react-query** - Server state & data fetching

### Storage
- ✅ **react-native-mmkv@2.12.2** - Fast key-value storage (v2 for old architecture)
- ✅ **react-native-sqlite-storage** - SQLite database with full SQL support

### UI Performance
- ✅ **@shopify/flash-list** - High-performance lists
- ✅ **expo-image** - Optimized image loading with blurhash

### Camera & Media
- ✅ **react-native-vision-camera** - Advanced camera functionality

### File System & Contacts
- ✅ **expo-contacts** - Contact access & management
- ✅ **expo-file-system** - File operations & storage
- ✅ **expo-document-picker** - Document selection
- ✅ **expo-sharing** - Native file sharing

### Document Processing
- ✅ **xlsx** - Excel file generation & parsing
- ✅ **pdf-lib** - PDF generation & manipulation
- ✅ **react-native-get-random-values** - Polyfill for pdf-lib
- ✅ **@craftzdog/react-native-buffer** - Buffer polyfill

## 🚀 Quick Start

### Prerequisites
- Node.js 21.x or higher
- npm 10.x or higher
- Expo SDK 54

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## 📁 Project Structure

```
nexus-skeleton/
├── app/                      # Expo Router screens
│   ├── (tabs)/              # Tab navigation
│   │   ├── home.tsx
│   │   ├── test.tsx         # Integration tests
│   │   └── settings.tsx
│   ├── _layout.tsx          # Root layout
│   ├── index.tsx            # Entry redirect
│   └── +not-found.tsx       # 404 screen
├── components/              # Reusable components
│   ├── CameraExample.tsx
│   ├── ExampleImage.tsx
│   └── ExampleList.tsx
├── stores/                  # Zustand stores
│   └── useExampleStore.ts
├── providers/               # Context providers
│   └── QueryProvider.tsx
├── utils/                   # Utility functions
│   ├── contacts.ts
│   ├── documentPicker.ts
│   ├── excel.ts
│   ├── fileSystem.ts
│   ├── pdf.ts
│   ├── sqlite.ts
│   └── storage.ts
├── types/                   # TypeScript types
│   └── global.d.ts
├── polyfills.ts            # React Native polyfills
├── app.json                # Expo configuration
├── eas.json                # EAS Build configuration
└── tsconfig.json           # TypeScript configuration
```

## 🧪 Testing Features

Navigate to the "Tests" tab to test all integrated libraries:

1. **Zustand** - State management counter
2. **MMKV** - Storage read/write
3. **SQLite** - Database operations (create, insert, query, update, delete)
4. **Document Picker** - File selection
5. **Contacts** - Contact access
6. **PDF Generation** - Create and share PDFs
7. **Excel Generation** - Create and share Excel files

## 🔧 Configuration

### App Configuration (`app.json`)
- Bundle identifiers configured for iOS & Android
- All required permissions declared
- Plugin configurations for native modules
- Typed routes enabled

### EAS Build (`eas.json`)
- Development, Preview, and Production profiles
- Optimized resource classes
- Platform-specific build configurations

### TypeScript (`tsconfig.json`)
- Strict mode enabled
- Path aliases configured
- Unused variables detection
- Complete type safety

## 🏗️ Build Commands

### Development Build
```bash
# iOS development build
eas build --profile development --platform ios

# Android development build (APK)
eas build --profile development --platform android
```

### Preview Build
```bash
# iOS preview build
eas build --profile preview --platform ios

# Android preview build (APK)
eas build --profile preview --platform android
```

### Production Build
```bash
# iOS production build
eas build --profile production --platform ios

# Android production build (AAB)
eas build --profile production --platform android

# All platforms
eas build --profile production --platform all
```

## 📱 Permissions

### iOS (Info.plist)
- NSCameraUsageDescription
- NSMicrophoneUsageDescription
- NSPhotoLibraryUsageDescription
- NSContactsUsageDescription

### Android (Manifest)
- CAMERA
- RECORD_AUDIO
- READ_EXTERNAL_STORAGE
- WRITE_EXTERNAL_STORAGE
- READ_CONTACTS

## 🐛 Known Issues

### Peer Dependencies
Some packages may show peer dependency warnings with React 19.1.0. These are resolved using `--legacy-peer-deps` flag and are safe to ignore.

### Vision Camera
- Requires physical device for testing (won't work in simulator)
- Ensure camera permissions are granted before use

### MMKV
- **Version 2.12.2** used for old architecture compatibility
- MMKV 3.x.x requires new architecture (TurboModules)
- Requires native rebuild after installation
- Run `npx expo prebuild --clean` if issues occur

### SQLite Storage
- Requires native rebuild after installation
- Database file stored in app's document directory
- Full SQL support with transactions
- Promise-based API for async operations

### PDF-lib
- Requires Buffer polyfill (included in `polyfills.ts`)
- Must be imported at app entry point

## 📚 Documentation

For detailed setup instructions, see:
- `docs/expo-skeleton-guide.md` - Complete setup guide
- `docs/library-integration-plan.md` - Integration strategy
- `docs/library-verification-checklist.md` - Library verification

## 🔄 Version Information

- **Expo SDK**: 54.0.12
- **React**: 19.1.0
- **React Native**: 0.81.4
- **Node**: 22.20.0+
- **npm**: 10.9.3+

## 🤝 Contributing

This is a skeleton/template project. Feel free to:
1. Fork and customize for your needs
2. Report issues or suggest improvements
3. Share your experience

## 📝 License

MIT

## ✅ Checklist

- [x] All 14 libraries installed
- [x] Expo Router configured
- [x] State management setup
- [x] Storage configured
- [x] All permissions declared
- [x] TypeScript configured
- [x] Integration tests created
- [x] Build configuration ready
- [x] Documentation complete

## 🎯 Next Steps

1. Test on physical devices (iOS & Android)
2. Run EAS development builds
3. Test all integrations thoroughly
4. Customize for your specific needs
5. Deploy to production

---

**Built with ❤️ using Expo SDK 54**

