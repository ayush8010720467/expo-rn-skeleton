# 🏠 Local Build Guide - Build on Your Machine

## Overview

Instead of building on Expo's cloud servers, you can build the APK locally on your machine. This gives you more control but requires more setup.

---

## 📋 Prerequisites

### 1. **Java Development Kit (JDK) 17**

```bash
# Check if Java is installed
java -version

# If not installed, download from:
# https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html

# Or use Homebrew (macOS)
brew install openjdk@17

# Add to PATH
echo 'export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### 2. **Android Studio & Android SDK**

```bash
# Download Android Studio from:
# https://developer.android.com/studio

# After installation, open Android Studio and:
# 1. Go to Preferences → Appearance & Behavior → System Settings → Android SDK
# 2. Install Android SDK Platform 34 (or latest)
# 3. Install Android SDK Build-Tools
# 4. Install Android SDK Platform-Tools
```

### 3. **Set Android Environment Variables**

Add to `~/.zshrc` or `~/.bash_profile`:

```bash
# Android SDK
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin

# Apply changes
source ~/.zshrc
```

### 4. **Verify Setup**

```bash
# Check Java
java -version
# Should show: openjdk version "17.x.x"

# Check Android SDK
echo $ANDROID_HOME
# Should show: /Users/[your-username]/Library/Android/sdk

# Check ADB
adb --version
# Should show: Android Debug Bridge version X.X.X
```

---

## 🚀 Local Build Commands

### **Basic Local Build (Production APK)**

```bash
cd /Users/ayushpersonal/Documents/personal-projects/exp-expo-build-issue/nexus-skeleton

# Build locally
eas build --profile production-apk --platform android --local
```

### **What Happens:**
- ✅ Builds on your machine (not Expo servers)
- ✅ Uses your local Android SDK
- ✅ Generates APK in your project directory
- ✅ Takes 10-20 minutes
- ✅ No cloud upload needed

---

## 🎯 Local Build Profiles

### **1. Production APK (Local)**
```bash
eas build --profile production-apk --platform android --local
```

### **2. Preview APK (Local)**
```bash
eas build --profile preview --platform android --local
```

### **3. Development APK (Local)**
```bash
eas build --profile development --platform android --local
```

---

## 📦 Alternative: Using Expo Prebuild + Gradle

If you want even more control, you can build directly with Gradle:

### **Step 1: Generate Native Code**
```bash
cd /Users/ayushpersonal/Documents/personal-projects/exp-expo-build-issue/nexus-skeleton

# Generate android/ directory
npx expo prebuild --platform android
```

### **Step 2: Build with Gradle**
```bash
cd android

# Clean build
./gradlew clean

# Build release APK
./gradlew assembleRelease

# Build debug APK
./gradlew assembleDebug
```

### **Step 3: Find Your APK**
```bash
# Release APK location:
android/app/build/outputs/apk/release/app-release.apk

# Debug APK location:
android/app/build/outputs/apk/debug/app-debug.apk
```

### **Step 4: Install APK**
```bash
# Install on connected device
adb install android/app/build/outputs/apk/release/app-release.apk
```

---

## 🔐 Code Signing for Local Builds

### **Option 1: Let EAS Handle It**
```bash
# EAS will use your cloud credentials even for local builds
eas build --profile production-apk --platform android --local
```

### **Option 2: Use Your Own Keystore**

#### Create Keystore:
```bash
keytool -genkeypair -v -storetype PKCS12 \
  -keystore my-release-key.keystore \
  -alias my-key-alias \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

#### Configure in android/gradle.properties:
```properties
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=your-store-password
MYAPP_RELEASE_KEY_PASSWORD=your-key-password
```

#### Configure in android/app/build.gradle:
```gradle
android {
    signingConfigs {
        release {
            storeFile file(MYAPP_RELEASE_STORE_FILE)
            storePassword MYAPP_RELEASE_STORE_PASSWORD
            keyAlias MYAPP_RELEASE_KEY_ALIAS
            keyPassword MYAPP_RELEASE_KEY_PASSWORD
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

---

## 💾 Disk Space Requirements

Local builds require significant disk space:

- **Android SDK**: ~3-5 GB
- **Gradle Cache**: ~2-3 GB
- **Node Modules**: ~1 GB
- **Build Output**: ~500 MB
- **Total**: ~8-10 GB

Make sure you have enough free space!

---

## ⚡ Performance: Cloud vs Local

| Aspect | Cloud Build | Local Build |
|--------|-------------|-------------|
| **Setup** | None required | JDK + Android Studio |
| **Build Time** | 10-20 mins | 10-20 mins |
| **Internet** | Upload code | No upload |
| **Disk Space** | 0 GB | ~8-10 GB |
| **Debugging** | Limited | Full access |
| **Cost** | Free tier available | Local resources |

---

## 🐛 Common Local Build Issues

### **Issue 1: Java version mismatch**
```bash
# Error: "Unsupported class file major version"
# Solution: Install JDK 17
brew install openjdk@17
```

### **Issue 2: ANDROID_HOME not set**
```bash
# Error: "SDK location not found"
# Solution: Set environment variable
export ANDROID_HOME=$HOME/Library/Android/sdk
```

### **Issue 3: Gradle daemon fails**
```bash
# Error: "Gradle daemon disappeared unexpectedly"
# Solution: Increase heap size
echo "org.gradle.jvmargs=-Xmx4096m" >> android/gradle.properties
```

### **Issue 4: Out of memory**
```bash
# Error: "Java heap space"
# Solution: Increase memory
export GRADLE_OPTS="-Xmx4096m -XX:MaxPermSize=512m"
```

### **Issue 5: SDK not found**
```bash
# Error: "Failed to find target with hash string 'android-34'"
# Solution: Install SDK via Android Studio
# SDK Manager → Android 14.0 (API 34)
```

---

## 🔄 Build Cache Management

### **Clear Gradle Cache**
```bash
cd android
./gradlew clean
./gradlew cleanBuildCache
```

### **Clear Expo Cache**
```bash
npx expo start --clear
```

### **Clear Node Modules**
```bash
rm -rf node_modules
npm install
```

### **Nuclear Clean**
```bash
# Clean everything
rm -rf node_modules android/.gradle android/app/build
npm install
npx expo prebuild --clean
```

---

## 📊 Build Output Locations

### **EAS Local Build**
```
Output APK:
/Users/[username]/Documents/personal-projects/exp-expo-build-issue/nexus-skeleton/build-[timestamp].apk
```

### **Gradle Build**
```
Release APK:
android/app/build/outputs/apk/release/app-release.apk

Debug APK:
android/app/build/outputs/apk/debug/app-debug.apk

AAB (Bundle):
android/app/build/outputs/bundle/release/app-release.aab
```

---

## 🚀 Quick Start Commands

### **Method 1: EAS Local Build (Recommended)**
```bash
# One command build
cd /Users/ayushpersonal/Documents/personal-projects/exp-expo-build-issue/nexus-skeleton
eas build --profile production-apk --platform android --local

# APK will be in project root
```

### **Method 2: Direct Gradle Build**
```bash
# Generate native code first
npx expo prebuild --platform android

# Build with Gradle
cd android
./gradlew assembleRelease

# Find APK
open app/build/outputs/apk/release/
```

---

## 📝 Comparison: Which Method to Use?

### **Use Cloud Build (Default) When:**
- ✅ You don't want to install Android Studio
- ✅ You want simple one-command builds
- ✅ You're okay with 10-20 min wait time
- ✅ You want EAS to handle signing

### **Use Local Build When:**
- ✅ You need faster iteration (after first build)
- ✅ You want full control over build process
- ✅ You need to debug build issues
- ✅ You want to keep builds private
- ✅ You have good internet but limited upload speed

---

## 🎯 Recommended Workflow

### **For Development:**
```bash
# Use local Gradle builds for fast iteration
npx expo prebuild
cd android && ./gradlew assembleDebug
```

### **For Testing:**
```bash
# Use EAS local build
eas build --profile preview --platform android --local
```

### **For Production:**
```bash
# Use EAS cloud build (signing is handled)
eas build --profile production-apk --platform android
```

---

## 📚 Additional Resources

- [EAS Local Builds](https://docs.expo.dev/build-reference/local-builds/)
- [Android Build Configuration](https://docs.expo.dev/build-reference/android-builds/)
- [Gradle Build Guide](https://docs.gradle.org/current/userguide/userguide.html)

---

## ✅ Setup Checklist

Before your first local build:

- [ ] Java 17 installed and in PATH
- [ ] Android Studio installed
- [ ] Android SDK 34 (or latest) installed
- [ ] ANDROID_HOME environment variable set
- [ ] ADB accessible from terminal
- [ ] At least 10GB free disk space
- [ ] Project node_modules installed

Once setup is complete, run:
```bash
eas build --profile production-apk --platform android --local
```

---

**Your APK will be generated locally on your machine!** 🎉

