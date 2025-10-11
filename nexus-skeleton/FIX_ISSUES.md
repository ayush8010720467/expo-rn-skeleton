# 🔧 Fixing Current Issues

## Issue 1: MMKV Native Module Error

**Error:** `[Error: Failed to create a new MMKV instance! Make sure you rebuilt the app.]`

**Cause:** MMKV is a native module that requires rebuilding the app after installation.

### Solution:

```bash
# Stop the current dev server (Ctrl+C)

# Clean and prebuild
cd /Users/ayushpersonal/Documents/personal-projects/exp-expo-build-issue/nexus-skeleton
npx expo prebuild --clean

# Rebuild for Android
npm run android

# OR for iOS
npm run ios
```

**Alternative (if prebuild doesn't work):**

```bash
# For Android
cd android
./gradlew clean
cd ..
npm run android

# For iOS
cd ios
rm -rf Pods
pod install
cd ..
npm run ios
```

---

## Issue 2: Missing Routes Warning

**Warning:** `No route named "gestures" exists in nested children`

**Cause:** Metro bundler cache or dev server needs restart.

### Solution:

```bash
# Clear Metro cache and restart
npx expo start --clear

# Then press 'a' for Android or 'i' for iOS
```

**If that doesn't work:**

```bash
# Delete metro cache manually
rm -rf node_modules/.cache
rm -rf .expo

# Restart dev server
npm start
```

---

## Quick Fix (Do This Now):

**Step 1:** Stop the dev server (Ctrl+C in terminal)

**Step 2:** Run these commands:

```bash
cd /Users/ayushpersonal/Documents/personal-projects/exp-expo-build-issue/nexus-skeleton

# Clean everything
npx expo prebuild --clean

# Clear cache
npx expo start --clear
```

**Step 3:** When Metro is ready, press:
- `a` for Android (or)
- `i` for iOS

**Step 4:** Wait for rebuild to complete

---

## Why This Happens

### Native Modules
Libraries like MMKV, SQLite, Vision Camera, and others require **native code** that must be compiled into your app. Installing them via npm only adds the JavaScript/TypeScript code, but the native iOS/Android code needs to be built.

### Routes Not Found
Expo Router uses the file system for routing. When you add new files, sometimes Metro bundler's cache doesn't pick them up immediately. Clearing the cache fixes this.

---

## After Rebuild

Once the app rebuilds successfully:

1. ✅ All tabs should appear (Home, Tests, Gestures, Camera, Theme, Settings)
2. ✅ MMKV storage will work
3. ✅ All native modules will be functional
4. ✅ Camera will work (on physical device)

---

## Troubleshooting

### If prebuild fails:

```bash
# Remove existing native folders
rm -rf android ios

# Prebuild again
npx expo prebuild
```

### If Android build fails:

```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

### If iOS build fails:

```bash
cd ios
pod deintegrate
pod install
cd ..
npx expo run:ios
```

### If routes still missing:

1. Check files exist: `ls app/(tabs)/`
2. Should see: `gestures.tsx`, `camera.tsx`, `theme-demo.tsx`
3. Restart Metro with `--clear` flag
4. Try restarting computer if Metro cache persists

---

## Expected Timeline

- **Prebuild:** 2-3 minutes
- **Android build:** 3-5 minutes (first time)
- **iOS build:** 4-6 minutes (first time)
- **Subsequent builds:** 1-2 minutes

---

## Verify Success

After rebuild, you should see:

```
✅ App starts without errors
✅ 6 tabs visible in tab bar
✅ Tests tab loads without MMKV error
✅ Can navigate to all tabs
✅ No route warnings in console
```

---

## Need Help?

If issues persist:

1. Share the full error message
2. Note which step failed
3. Check if it's a simulator or physical device
4. Try on opposite platform (iOS vs Android)

---

**TL;DR:** Run these commands:

```bash
# Stop dev server (Ctrl+C)
npx expo prebuild --clean
npm run android
```

That's it! 🚀



