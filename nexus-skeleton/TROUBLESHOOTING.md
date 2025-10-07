# Troubleshooting Guide

## Common Issues and Solutions

### ✅ FIXED: MMKV TurboModules Error

**Error:**
```
Failed to create a new MMKV instance: react-native-mmkv 3.x.x requires TurboModules,
but the new architecture is not enabled!
```

**Solution:**
We downgraded MMKV from 3.x.x to 2.12.2 for compatibility with the old architecture.

**Why:**
- MMKV 3.x.x requires React Native's new architecture (TurboModules)
- Our app.json has `newArchEnabled: false` (or not set)
- MMKV 2.x.x works perfectly with the old architecture

**Current Version:** `react-native-mmkv@2.12.2` ✅

**If you need MMKV 3.x.x:**
1. Enable new architecture in `app.json`:
   ```json
   {
     "expo": {
       "newArchEnabled": true
     }
   }
   ```
2. Rebuild native code: `npx expo prebuild --clean`

---

### ✅ FIXED: FlashList Version Warning

**Warning:**
```
The following packages should be updated for best compatibility with the installed expo version:
  @shopify/flash-list@2.1.0 - expected version: 2.0.2
```

**Solution:**
Downgraded FlashList to the Expo SDK 54 compatible version.

**Current Version:** `@shopify/flash-list@2.0.2` ✅

---

### Route Not Found Warning

**Warning:**
```
WARN  [Layout children]: No route named "test" exists in nested children
```

**Solution:**
This is a metro bundler cache issue. The fix:

1. Stop the dev server (Ctrl+C)
2. Clear cache and restart:
   ```bash
   npx expo start --clear
   ```

The test route exists in `app/(tabs)/test.tsx` and is properly registered in `app/(tabs)/_layout.tsx`.

---

## Native Module Issues

### General Native Module Errors

If you encounter errors with native modules (MMKV, SQLite, Vision Camera, etc.):

**Solution:**
```bash
# 1. Clear node_modules and reinstall
rm -rf node_modules
npm install

# 2. Clear Metro cache
npx expo start --clear

# 3. If still not working, prebuild native code
npx expo prebuild --clean

# 4. For development build
eas build --profile development --platform ios
# or
eas build --profile development --platform android
```

---

## Expo Go Limitations

### Native Modules Don't Work in Expo Go

**Affected Libraries:**
- ❌ react-native-mmkv
- ❌ react-native-sqlite-storage
- ❌ react-native-vision-camera
- ✅ expo-contacts (works in Expo Go)
- ✅ expo-file-system (works in Expo Go)
- ✅ expo-image (works in Expo Go)

**Solution:**
Use a **development build** instead of Expo Go:

```bash
# Build for your device
eas build --profile development --platform ios
eas build --profile development --platform android

# Or run locally
npx expo run:ios
npx expo run:android
```

---

## Build Errors

### iOS Build Issues

**Error:** CocoaPods installation fails

**Solution:**
```bash
# Update CocoaPods
sudo gem install cocoapods

# Clear pod cache
cd ios
pod deintegrate
pod install
cd ..
```

---

### Android Build Issues

**Error:** Gradle build timeout or memory issues

**Solution:**
Add to `android/gradle.properties`:
```properties
org.gradle.jvmargs=-Xmx4096m -XX:MaxPermSize=512m
org.gradle.daemon=true
org.gradle.parallel=true
```

---

## TypeScript Errors

### Type errors with SQLite or other libraries

**Solution:**
```bash
# Reinstall node_modules
rm -rf node_modules package-lock.json
npm install

# Clear TypeScript cache
rm -rf .expo
```

---

## Performance Issues

### App Slow or Crashing

**Check:**
1. **FlashList** - Ensure `estimatedItemSize` is provided
2. **Images** - Use `expo-image` with proper `contentFit`
3. **Database** - Close unused SQLite connections
4. **Storage** - Don't store large objects in MMKV (use SQLite or FileSystem)

---

## Package Version Conflicts

### Peer Dependency Warnings

**Solution:**
Use `--legacy-peer-deps` flag when installing:

```bash
npm install <package> --legacy-peer-deps
```

This is safe and necessary due to React 19 early adoption.

---

## Clean Slate Reset

If all else fails, start fresh:

```bash
# 1. Remove all generated files
rm -rf node_modules package-lock.json
rm -rf ios android .expo

# 2. Reinstall everything
npm install

# 3. Clear all caches
npx expo start --clear

# 4. Prebuild native code
npx expo prebuild --clean
```

---

## Getting Help

### Check These First:
1. ✅ All native modules require development build (not Expo Go)
2. ✅ MMKV 2.x.x for old architecture, 3.x.x for new architecture
3. ✅ Run `npx expo start --clear` after any native module changes
4. ✅ Check EAS build logs for specific errors

### Useful Commands:
```bash
# Check versions
node --version
npm --version
expo --version

# Check package versions
npm list react-native-mmkv
npm list @shopify/flash-list

# View expo diagnostics
npx expo-doctor

# Check for outdated packages
npm outdated
```

### Resources:
- [Expo Documentation](https://docs.expo.dev/)
- [React Native MMKV](https://github.com/mrousavy/react-native-mmkv)
- [SQLite Storage](https://github.com/andpor/react-native-sqlite-storage)
- [Vision Camera](https://react-native-vision-camera.com/)

---

**Last Updated:** October 7, 2025
**Status:** All known issues resolved ✅

