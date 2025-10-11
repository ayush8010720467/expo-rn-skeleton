# 🔨 Gradle vs Expo CLI: Build Comparison

## Quick Answer: Yes, Gradlew Can Build Both!

| What | Debug | Release |
|------|-------|---------|
| **Gradle Command** | `./gradlew assembleDebug` | `./gradlew assembleRelease` |
| **Output Location** | `android/app/build/outputs/apk/debug/` | `android/app/build/outputs/apk/release/` |
| **File Name** | `app-debug.apk` | `app-release.apk` |

---

## 🎯 All Gradle Build Commands

### APK Builds (Installable Files):

```bash
cd /path/to/your/project/android

# Debug APK only
./gradlew assembleDebug

# Release APK only
./gradlew assembleRelease

# Both Debug AND Release APKs
./gradlew assemble

# Clean then build
./gradlew clean assembleRelease
```

### AAB Builds (Google Play Store):

```bash
# Debug bundle
./gradlew bundleDebug

# Release bundle (for Play Store)
./gradlew bundleRelease

# Both bundles
./gradlew bundle
```

---

## ⚠️ Issue with Release Builds in Expo Projects

### The Problem You Encountered:

```
Failed to write file: index.android.bundle.hbc
Process 'hermesc' finished with non-zero exit value 6
```

**Why this happens:**
- Expo projects have special Metro bundler configuration
- `./gradlew assembleRelease` doesn't always trigger Metro correctly
- Metro needs to bundle JavaScript before Gradle can package it

---

## ✅ Recommended: Use Expo CLI Instead

### Why Expo CLI is Better for Expo Projects:

| Feature | `./gradlew` | `expo run:android` |
|---------|-------------|-------------------|
| Metro bundling | Manual | Automatic ✅ |
| Native modules | Need to prebuild first | Handles automatically ✅ |
| Error handling | Raw Gradle errors | User-friendly ✅ |
| Development workflow | Slower | Faster ✅ |

### Expo CLI Commands:

```bash
cd /path/to/your/project

# Debug build (what you have now)
npx expo run:android

# Release build (optimized, smaller)
npx expo run:android --variant release

# Development build + install + run
npx expo run:android --device
```

---

## 📊 Build Comparison

### Method 1: Expo CLI (Recommended)

#### Debug Build:
```bash
npx expo run:android
```

**What it does:**
1. ✅ Starts Metro bundler
2. ✅ Runs `./gradlew assembleDebug` internally
3. ✅ Installs APK on device/emulator
4. ✅ Launches app automatically

#### Release Build:
```bash
npx expo run:android --variant release
```

**What it does:**
1. ✅ Bundles JavaScript with Metro
2. ✅ Runs `./gradlew assembleRelease` internally
3. ✅ Compiles with Hermes
4. ✅ Creates optimized APK

---

### Method 2: Direct Gradle (Advanced)

#### Debug Build:
```bash
cd android
./gradlew assembleDebug
cd ..
```

**Output:** `android/app/build/outputs/apk/debug/app-debug.apk`

**Pros:**
- ✅ Faster if Metro is already running
- ✅ More control over build process
- ✅ Can customize gradle options

**Cons:**
- ❌ Need to manually start Metro
- ❌ Need to manually install APK
- ❌ Need to ensure native modules are built

#### Release Build:
```bash
# You need to bundle JavaScript first!
cd android
./gradlew bundleReleaseJsAndAssets  # This step often fails in Expo
./gradlew assembleRelease
cd ..
```

**Pros:**
- ✅ Direct control
- ✅ Can customize ProGuard rules
- ✅ Can add custom build steps

**Cons:**
- ❌ Metro bundling often fails
- ❌ More complex troubleshooting
- ❌ Need to handle Hermes compilation manually

---

## 🎯 Recommended Workflow

### For Development (Debug):

**Option A: Expo CLI (Easiest)**
```bash
cd /Users/ayushpersonal/Documents/personal-projects/exp-expo-build-issue/nexus-skeleton
npx expo run:android
```

**Option B: Gradle (If you know what you're doing)**
```bash
# Terminal 1: Start Metro
npx expo start

# Terminal 2: Build & install
cd android
./gradlew installDebug
cd ..
```

---

### For Production (Release):

**Option A: Expo CLI (Recommended)**
```bash
cd /Users/ayushpersonal/Documents/personal-projects/exp-expo-build-issue/nexus-skeleton
npx expo run:android --variant release
```

**Option B: Manual Bundle + Gradle**
```bash
# 1. Bundle JavaScript
npx react-native bundle \
  --platform android \
  --dev false \
  --entry-file index.js \
  --bundle-output android/app/src/main/assets/index.android.bundle \
  --assets-dest android/app/src/main/res

# 2. Build with Gradle
cd android
./gradlew assembleRelease
cd ..
```

**Option C: EAS Build (Cloud)**
```bash
npx eas build --platform android --profile production
```

---

## 🔧 Your Current Situation

### What You Have:
✅ Working debug APK: `~/Desktop/nexus-skeleton-debug.apk` (62MB)
✅ App runs on emulator
✅ All native modules linked

### What Happened:
❌ `./gradlew assembleRelease` failed with Metro bundling error
❌ Clean also failed due to corrupted CMake cache

### Solution:

**For immediate release APK**, use Expo CLI:

```bash
cd /Users/ayushpersonal/Documents/personal-projects/exp-expo-build-issue/nexus-skeleton
npx expo run:android --variant release
```

This will:
1. Handle Metro bundling correctly
2. Build release APK
3. Install on emulator
4. Give you: `android/app/build/outputs/apk/release/app-release.apk`

---

## 📋 Complete Build Matrix

| Command | Type | Size | Install | Metro | Use Case |
|---------|------|------|---------|-------|----------|
| `npx expo run:android` | Debug | ~62MB | Auto | Auto | Development ✅ |
| `npx expo run:android --variant release` | Release | ~45MB | Auto | Auto | Testing/Distribution ✅ |
| `./gradlew assembleDebug` | Debug | ~62MB | Manual | Manual | Advanced users |
| `./gradlew assembleRelease` | Release | ~45MB | Manual | **Often fails** | Not recommended for Expo |
| `npx eas build` | Release | ~45MB | Manual | Cloud | Production/Play Store ✅ |

---

## 🎓 Understanding the Build Process

### What Happens in a React Native/Expo Build:

```
1. Metro Bundler
   ↓ Bundles JavaScript into index.android.bundle
   ↓ Processes assets (images, fonts)

2. Hermes Compiler (Release only)
   ↓ Converts JS bundle to bytecode (.hbc)
   ↓ Optimizes performance

3. Gradle Build
   ↓ Compiles native code (C++, Kotlin, Java)
   ↓ Links native modules (MMKV, Camera, etc.)
   ↓ Packages everything into APK

4. Output
   → app-debug.apk or app-release.apk
```

### Why `./gradlew assembleRelease` Failed:

**Step 1 (Metro) didn't run properly:**
- Gradle tried to find the bundled JavaScript
- File didn't exist: `index.android.bundle.hbc`
- Gradle expects Expo/Metro to create this first
- Build failed before even compiling native code

**Solution:**
- Use `expo run:android --variant release`
- It handles Step 1 automatically
- Then runs Gradle with correct paths

---

## 🚀 Quick Commands Summary

### Development:
```bash
# Fastest (recommended)
npx expo run:android

# Get debug APK location
ls -lh android/app/build/outputs/apk/debug/app-debug.apk
```

### Production:
```bash
# Local release build (recommended)
npx expo run:android --variant release

# Get release APK location
ls -lh android/app/build/outputs/apk/release/app-release.apk

# Copy to desktop
cp android/app/build/outputs/apk/release/app-release.apk ~/Desktop/
```

### Using Gradle Directly (Advanced):
```bash
# Only if you know Metro is configured correctly
cd android

# Debug
./gradlew assembleDebug

# Release (may fail in Expo projects)
./gradlew assembleRelease

# Install debug APK
./gradlew installDebug

# Uninstall
./gradlew uninstallDebug
```

---

## ✅ Recommendation for You

**For your project, use:**

```bash
# Development testing
npx expo run:android

# Release APK (when ready to share/distribute)
npx expo run:android --variant release
```

**Avoid:**
```bash
# These are problematic in Expo projects:
./gradlew assembleRelease  # Metro bundling issues
./gradlew clean            # CMake cache issues
```

---

## 🎯 Final Answer

**Q: Can gradlew build both debug and release?**

**A: Yes, technically:**
```bash
./gradlew assembleDebug    # Debug APK
./gradlew assembleRelease  # Release APK
./gradlew assemble         # Both
```

**But for Expo projects, use this instead:**
```bash
npx expo run:android                  # Debug
npx expo run:android --variant release  # Release
```

**Why?** Because Expo CLI handles Metro bundling, native modules, and Hermes compilation automatically. Direct Gradle commands often fail in Expo projects due to bundling issues (as you just experienced).

---

## 📖 Additional Resources

- [React Native Build Process](https://reactnative.dev/docs/signed-apk-android)
- [Expo Build Documentation](https://docs.expo.dev/build/setup/)
- [Gradle Android Plugin](https://developer.android.com/build/releases)

---

**TL;DR:** Use `npx expo run:android --variant release` for release builds in Expo projects. It just works. ✅

