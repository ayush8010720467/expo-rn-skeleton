# 📦 Local APK Build Guide (Without EAS)

## ✅ Current Status

**You already have a Debug APK built!**

**Location:** `android/app/build/outputs/apk/debug/app-debug.apk`
**Size:** 62MB
**Copied to Desktop:** `~/Desktop/nexus-skeleton-debug.apk`

---

## 🔨 Build Commands

### 1. Debug APK (Development)

**When to use:** Testing, development, debugging

```bash
cd /Users/ayushpersonal/Documents/personal-projects/exp-expo-build-issue/nexus-skeleton

# Option A: Using Expo CLI
npx expo run:android

# Option B: Direct Gradle
cd android
./gradlew assembleDebug
cd ..
```

**Output:** `android/app/build/outputs/apk/debug/app-debug.apk`

**Features:**
- ✅ Includes debugging tools
- ✅ Larger file size (~60-70MB)
- ✅ Can install alongside other apps
- ✅ No signing required
- ✅ Metro bundler connection

---

### 2. Release APK (Production - Unsigned)

**When to use:** Testing release performance, smaller file size

```bash
cd /Users/ayushpersonal/Documents/personal-projects/exp-expo-build-issue/nexus-skeleton

# Option A: Using Expo CLI
npx expo run:android --variant release

# Option B: Direct Gradle
cd android
./gradlew assembleRelease
cd ..
```

**Output:** `android/app/build/outputs/apk/release/app-release.apk`

**Features:**
- ✅ Optimized code (ProGuard/R8)
- ✅ Smaller file size (~40-50MB)
- ✅ Better performance
- ⚠️ Needs signing for Google Play
- ❌ No debugging tools

---

### 3. Release APK (Production - Signed)

**When to use:** Distribution, Google Play Store, sharing with users

#### Step 1: Generate Signing Key (One-time setup)

```bash
cd /Users/ayushpersonal/Documents/personal-projects/exp-expo-build-issue/nexus-skeleton/android/app

keytool -genkeypair -v -storetype PKCS12 \
  -keystore nexus-skeleton.keystore \
  -alias nexus-skeleton-key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**You'll be asked:**
- Password (choose something secure, save it!)
- Name, Organization, City, State, Country
- Confirm password

**⚠️ IMPORTANT:** Save the password! You'll need it for all future builds.

#### Step 2: Configure Gradle Signing

Create `android/gradle.properties` and add (replace with your password):

```properties
NEXUS_RELEASE_STORE_FILE=nexus-skeleton.keystore
NEXUS_RELEASE_KEY_ALIAS=nexus-skeleton-key
NEXUS_RELEASE_STORE_PASSWORD=your-password-here
NEXUS_RELEASE_KEY_PASSWORD=your-password-here
```

**⚠️ SECURITY:** Add `gradle.properties` to `.gitignore` to keep passwords private!

#### Step 3: Update `android/app/build.gradle`

Add signing config before `buildTypes`:

```gradle
android {
    ...

    signingConfigs {
        release {
            if (project.hasProperty('NEXUS_RELEASE_STORE_FILE')) {
                storeFile file(NEXUS_RELEASE_STORE_FILE)
                storePassword NEXUS_RELEASE_STORE_PASSWORD
                keyAlias NEXUS_RELEASE_KEY_ALIAS
                keyPassword NEXUS_RELEASE_KEY_PASSWORD
            }
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release  // Add this line
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

#### Step 4: Build Signed Release APK

```bash
cd /Users/ayushpersonal/Documents/personal-projects/exp-expo-build-issue/nexus-skeleton
cd android
./gradlew assembleRelease
cd ..
```

**Output:** `android/app/build/outputs/apk/release/app-release.apk` (signed!)

---

## 🎯 Quick Reference Table

| Type | Command | Output | Size | Use Case |
|------|---------|--------|------|----------|
| **Debug** | `npx expo run:android` | `app-debug.apk` | ~62MB | Development, testing |
| **Release (unsigned)** | `npx expo run:android --variant release` | `app-release.apk` | ~45MB | Performance testing |
| **Release (signed)** | `cd android && ./gradlew assembleRelease` | `app-release.apk` | ~45MB | Distribution, Play Store |

---

## 📲 Installing APK on Device

### Method 1: USB (ADB)

```bash
# Install on connected device
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Or for release
adb install android/app/build/outputs/apk/release/app-release.apk

# To reinstall (if already installed)
adb install -r path/to/app.apk
```

### Method 2: Share File

1. Copy APK to Desktop (already done ✅)
2. Upload to Google Drive / Dropbox / Email
3. Download on Android device
4. Tap to install (enable "Install from Unknown Sources")

### Method 3: QR Code

Use a tool like `qrcode-terminal`:

```bash
npm install -g qrcode-terminal
qrcp android/app/build/outputs/apk/debug/app-debug.apk
```

Scan QR code with Android device to download.

---

## 🆚 Debug vs Release Comparison

### Debug APK Features:
✅ Hot reloading
✅ Chrome DevTools
✅ Error overlay
✅ Metro bundler connection
✅ Fast rebuilds
❌ Larger file size
❌ Slower performance

### Release APK Features:
✅ Optimized code
✅ Smaller file size
✅ Better performance
✅ Production-ready
❌ No hot reloading
❌ No debugging tools
❌ Slower rebuilds

---

## 🚀 Your Current APK

**File:** `~/Desktop/nexus-skeleton-debug.apk`
**Type:** Debug build
**Status:** Ready to install ✅

**To test on a device:**

```bash
# Connect Android device via USB
adb devices

# Install APK
adb install ~/Desktop/nexus-skeleton-debug.apk
```

**To share with others:**
- Upload to Google Drive
- Share download link
- They can install directly (after enabling "Unknown Sources")

---

## 📊 Build Optimization Tips

### Reduce APK Size:

1. **Enable ProGuard/R8** (already in release builds)
2. **Remove unused resources:**
   ```gradle
   android {
       buildTypes {
           release {
               shrinkResources true
               minifyEnabled true
           }
       }
   }
   ```

3. **Use APK Splits (by ABI):**
   ```gradle
   android {
       splits {
           abi {
               enable true
               reset()
               include 'armeabi-v7a', 'arm64-v8a', 'x86', 'x86_64'
               universalApk true
           }
       }
   }
   ```

### Build Bundle (AAB) for Play Store:

```bash
cd android
./gradlew bundleRelease
cd ..
```

**Output:** `android/app/build/outputs/bundle/release/app-release.aab`
**Smaller download:** Google Play generates optimized APKs per device

---

## 🔧 Troubleshooting

### Build Fails?

```bash
# Clean build
cd android
./gradlew clean
./gradlew assembleDebug
cd ..
```

### Signing Issues?

```bash
# Verify keystore
keytool -list -v -keystore android/app/nexus-skeleton.keystore

# Check gradle.properties
cat android/gradle.properties
```

### APK Won't Install?

```bash
# Uninstall old version first
adb uninstall com.nexus.skeleton

# Then install fresh
adb install -r path/to/app.apk
```

---

## 📋 Checklist for Distribution

Before sharing your APK:

- [ ] Built release APK (not debug)
- [ ] Signed with production keystore
- [ ] Tested on multiple devices
- [ ] Verified all 29 libraries work
- [ ] Updated version in package.json
- [ ] Updated versionCode in build.gradle
- [ ] Tested installation flow
- [ ] Checked APK size (<50MB ideal)
- [ ] Disabled remote debugger for testing
- [ ] Created release notes

---

## 🎉 Summary

**You have a working Debug APK on your Desktop!**

**Next Steps:**
1. ✅ Test the APK on a device
2. ⏳ Reload app to fix gestures/theme tabs
3. ⏳ Disable remote debugger for full functionality
4. ⏳ Test all 29 libraries
5. 🔜 Build signed release APK when ready for distribution

**Build Commands to Remember:**
- **Debug:** `npx expo run:android`
- **Release:** `npx expo run:android --variant release`
- **Signed Release:** `cd android && ./gradlew assembleRelease`

---

**Your APK is ready! No EAS needed!** 🚀

