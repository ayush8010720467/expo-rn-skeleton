# 🚀 Quick Start: Library Testing Suite

**Get testing in 2 minutes!**

---

## 📱 Running the App

```bash
cd /Users/ayushpersonal/Documents/personal-projects/exp-expo-build-issue/nexus-skeleton
npm run start
```

Then press:
- `a` for Android
- `i` for iOS
- `w` for Web

---

## 🧪 Testing All 29 Libraries

### Option 1: Automatic (Recommended)

1. Open the app
2. Go to **Tests** tab (🧪)
3. Tap **"▶️ Run All Tests"** button
4. Watch results appear in real-time
5. Check statistics at the top (Passed/Failed/Coverage)

**Time:** ~30 seconds

### Option 2: Manual

Test each library individually by tapping its test button:

**Tests Tab (🧪):**
- State Management: Zustand, React Query
- Storage: MMKV, SQLite, AsyncStorage
- UI: FlashList, Expo Image
- Animation: Reanimated
- Device: Contacts, File System, Document Picker, Sharing, Haptics
- Graphics: SVG, Lucide Icons, Vector Icons
- Documents: XLSX, PDF-lib
- Utilities: NetInfo, DateTimePicker, UUID, URL, Constants, Fonts

**Gestures Tab (👋):**
- Swipe to delete
- Pinch to zoom
- Pan gesture
- Long press
- Pull to refresh
- Tap & double-tap

**Camera Tab (📷):**
- Live camera preview
- Take photos
- Switch cameras
- Flash modes
- Share photos

**Theme Tab (🎨):**
- Toggle light/dark mode
- View themed components
- Test Restyle theming system

---

## 📊 Understanding Results

### Status Indicators

- **✅ Green** = Test passed
- **❌ Red** = Test failed
- **Numbers at top** = Live statistics

### Test Coverage

Located at top of Tests screen:
- **Total**: 29 libraries
- **Passed**: Number of successful tests
- **Failed**: Number of failed tests
- **Coverage**: Percentage (Passed/Total × 100)

### Result Log

Scroll down to see detailed results:
- Most recent at top
- Shows success/error messages
- Auto-limited to 50 entries

---

## 💾 Exporting Results

1. Run tests (automatic or manual)
2. Tap **"📤 Export Results"** button
3. Choose app to share with
4. Results saved as JSON file

**Use cases:**
- Documentation
- Bug reports
- Team sharing
- Build verification

---

## 🔍 Verifying Before Build

Before creating a production build, verify all libraries are installed:

```bash
cd /Users/ayushpersonal/Documents/personal-projects/exp-expo-build-issue/nexus-skeleton
npx ts-node scripts/verify-libraries.ts
```

**Output:**
- ✅ Lists all 29 libraries
- Shows installed versions
- Warns about mismatches
- Flags missing libraries
- Exports verification-results.json

---

## 📋 Using the Checklist

For formal testing/QA:

1. Open `LIBRARY_TESTING_CHECKLIST.md`
2. Follow step-by-step instructions for each library
3. Fill in actual results
4. Note any issues
5. Sign off when complete

**Perfect for:**
- QA testing
- Pre-release verification
- Integration validation
- Documentation

---

## 🎯 Testing Priority

### Critical (Test First)
1. **Storage** - MMKV, SQLite, AsyncStorage
2. **Documents** - XLSX, PDF-lib
3. **State** - Zustand, React Query

### Important
4. **Camera** - Vision Camera (physical device only)
5. **Gestures** - All gesture types
6. **Device** - File System, Sharing, Contacts

### Nice to Have
7. **UI** - Icons, SVG, Theme
8. **Utilities** - UUID, NetInfo, Constants

---

## 🐛 Common Issues

### Camera Not Working
- **Cause:** Running in simulator
- **Solution:** Test on physical device

### Permission Denied (Contacts, Camera)
- **Cause:** Permission not granted
- **Solution:** Tap permission prompt or check device settings

### Network Tests Fail
- **Cause:** No internet connection
- **Solution:** Connect to WiFi/cellular

### Library Not Found
- **Cause:** Dependencies not installed
- **Solution:** Run `npm install`

---

## 📱 Platform-Specific Notes

### iOS
- Camera: Requires physical device
- Haptics: Full support
- Sharing: Native share sheet

### Android
- Camera: Requires physical device
- Haptics: May vary by device
- Sharing: Native share sheet
- File System: Full access

### Web (Limited)
- Camera: Not supported
- Haptics: Not supported
- Many device features unavailable
- Good for UI/State testing only

---

## 🎓 Tips & Tricks

### Efficient Testing
1. Use **"Run All Tests"** for quick verification
2. Test individual libraries when debugging
3. Export results before builds
4. Fill checklist for formal QA

### Debugging Failed Tests
1. Check error message in result log
2. Verify permissions granted
3. Test on physical device if needed
4. Check network connection
5. Reinstall dependencies if necessary

### Best Practices
- ✅ Test on physical device for camera/haptics
- ✅ Test on both iOS and Android
- ✅ Document any failures
- ✅ Re-test after fixing issues
- ✅ Export results for records

---

## 📞 Support

### Check Documentation
1. `LIBRARY_USE_CASES.md` - Detailed examples
2. `LIBRARY_TESTING_CHECKLIST.md` - Formal testing
3. `IMPLEMENTATION_SUMMARY.md` - Technical details
4. `TROUBLESHOOTING.md` - Common issues

### Verification
Run verification script if tests fail unexpectedly:
```bash
npx ts-node scripts/verify-libraries.ts
```

---

## ⏱️ Time Estimates

| Task | Time |
|------|------|
| Run all automatic tests | 30 sec |
| Test all gestures | 2 min |
| Test camera features | 3 min |
| Test theme system | 1 min |
| Export results | 10 sec |
| Fill checklist (formal) | 15 min |
| **Total quick test** | **~7 min** |
| **Total formal test** | **~20 min** |

---

## ✅ Quick Checklist

Before considering libraries "verified":

- [ ] Ran "Run All Tests" successfully
- [ ] Tested gestures (all 6 types)
- [ ] Tested camera on physical device
- [ ] Toggled theme (light/dark)
- [ ] Exported test results
- [ ] Ran verification script
- [ ] No critical failures
- [ ] Documented any issues

---

**Happy Testing! 🎉**

For detailed information, see:
- Technical: `IMPLEMENTATION_SUMMARY.md`
- QA: `LIBRARY_TESTING_CHECKLIST.md`
- Examples: `LIBRARY_USE_CASES.md`



