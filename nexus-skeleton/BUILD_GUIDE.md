# 🚀 Production Build Guide

## Quick Commands

### **For Production APK (Recommended for Direct Install)**
```bash
cd /Users/ayushpersonal/Documents/personal-projects/exp-expo-build-issue/nexus-skeleton

# Build production APK
eas build --profile production-apk --platform android
```

### **For Play Store AAB (Google Play Store)**
```bash
# Build production AAB
eas build --profile production --platform android
```

---

## 📋 Prerequisites

### 1. Install EAS CLI (if not already installed)
```bash
npm install -g eas-cli
```

### 2. Login to Expo
```bash
eas login
```

### 3. Configure EAS (first time only)
```bash
eas build:configure
```

---

## 🎯 Build Profiles Available

| Profile | Type | Purpose | Command |
|---------|------|---------|---------|
| **production-apk** | APK | Direct install on devices | `eas build --profile production-apk --platform android` |
| **production** | AAB | Google Play Store submission | `eas build --profile production --platform android` |
| **preview** | APK | Internal testing | `eas build --profile preview --platform android` |
| **development** | APK | Development with debugging | `eas build --profile development --platform android` |

---

## 🔨 Step-by-Step: Build Production APK

### Step 1: Make sure you're logged in
```bash
eas whoami
```
If not logged in:
```bash
eas login
```

### Step 2: Build the APK
```bash
cd /Users/ayushpersonal/Documents/personal-projects/exp-expo-build-issue/nexus-skeleton

eas build --profile production-apk --platform android
```

### Step 3: Wait for build to complete
- Build typically takes 10-20 minutes
- You'll see progress in terminal
- Or check status at: https://expo.dev/accounts/[your-account]/projects/nexus-skeleton/builds

### Step 4: Download the APK
Once complete, you'll get:
- ✅ Download link in terminal
- ✅ Download link in email
- ✅ Download from Expo dashboard

### Step 5: Install on Device
```bash
# Transfer to device and install
# Or use ADB
adb install path/to/your-app.apk
```

---

## 🌐 Build on Expo Servers (Cloud Build)

This is the **default and recommended** approach:

```bash
# Production APK (for distribution)
eas build --profile production-apk --platform android

# What happens:
# ✅ Builds on Expo's servers
# ✅ No local Android setup needed
# ✅ Automatic signing
# ✅ Download link provided
# ✅ Email notification
```

**Advantages:**
- ✅ No need for local Android Studio
- ✅ No need for Java/Gradle setup
- ✅ Consistent build environment
- ✅ Automatic code signing
- ✅ Build artifacts stored

---

## 💻 Build Locally (Optional)

If you want to build on your machine:

```bash
# Install Android Studio and SDK first

# Build locally
eas build --profile production-apk --platform android --local

# Requirements:
# - Android Studio installed
# - Android SDK configured
# - Java 17 installed
# - Sufficient disk space (10GB+)
```

---

## 📱 Build for iOS (Bonus)

```bash
# Production iOS build
eas build --profile production --platform ios

# Note: Requires:
# - Apple Developer account ($99/year)
# - App Store Connect setup
```

---

## 🔐 Code Signing

### Android (Automatic)

EAS handles code signing automatically:
- First build: EAS creates a keystore
- Subsequent builds: Reuses the same keystore
- Keystore stored securely on Expo servers

### Manual Keystore (Advanced)

If you want to use your own keystore:

```bash
# Generate keystore
keytool -genkeypair -v -keystore my-app.keystore \
  -alias my-app-alias -keyalg RSA -keysize 2048 -validity 10000

# Configure in eas.json
{
  "build": {
    "production-apk": {
      "android": {
        "buildType": "apk",
        "credentialsSource": "local"
      }
    }
  }
}
```

---

## 📊 Build Status & Logs

### Check build status
```bash
eas build:list
```

### View specific build
```bash
eas build:view [build-id]
```

### View build logs
- Available in terminal during build
- Also at: https://expo.dev
- Email notification with link

---

## 🐛 Common Build Issues

### Issue 1: "Not logged in"
```bash
eas login
```

### Issue 2: "No project found"
Make sure you're in the project directory:
```bash
cd /Users/ayushpersonal/Documents/personal-projects/exp-expo-build-issue/nexus-skeleton
```

### Issue 3: "Build failed"
Check the logs:
```bash
eas build:list
eas build:view [build-id]
```

Common causes:
- TypeScript errors
- Missing dependencies
- Native module configuration issues

### Issue 4: Native modules not working
Make sure you're NOT using Expo Go:
- ✅ Use production build
- ❌ Don't use Expo Go for native modules

---

## 📦 After Build Completes

### You'll receive:
1. **Download link** - Direct download URL
2. **Email notification** - With download link
3. **Expo dashboard** - View all builds

### Install Options:

**Option 1: Direct Install on Device**
1. Download APK to device
2. Enable "Install from Unknown Sources"
3. Tap APK to install

**Option 2: ADB Install**
```bash
adb install path/to/app.apk
```

**Option 3: Share via Link**
- Upload to Google Drive
- Share download link
- Others can install directly

---

## 🎯 Quick Reference

### Most Common Commands

```bash
# 1. Production APK (for sharing)
eas build --profile production-apk --platform android

# 2. Check build status
eas build:list

# 3. Download latest build
# Use link from terminal or Expo dashboard

# 4. Install on device
adb install app.apk
```

---

## 📝 Build Configuration Summary

Your `eas.json` now has:

```json
{
  "build": {
    "development": {
      "android": { "buildType": "apk" }
    },
    "preview": {
      "android": { "buildType": "apk" }
    },
    "production": {
      "android": { "buildType": "aab" }  // For Play Store
    },
    "production-apk": {
      "android": { "buildType": "apk" }  // For direct install ✅
    }
  }
}
```

---

## 🚀 Start Building Now!

**Single command to build production APK:**

```bash
cd /Users/ayushpersonal/Documents/personal-projects/exp-expo-build-issue/nexus-skeleton && eas build --profile production-apk --platform android
```

This will:
1. ✅ Build your app on Expo servers
2. ✅ Create a production-ready APK
3. ✅ Sign it automatically
4. ✅ Provide download link
5. ✅ Send email notification

**Estimated time:** 10-20 minutes

---

## 📚 Additional Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Android Build Configuration](https://docs.expo.dev/build-reference/android-builds/)
- [Code Signing](https://docs.expo.dev/app-signing/app-credentials/)

---

**Ready to build?** Run the command above! 🚀

