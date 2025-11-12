# Firebase Connection Issues - Root Cause & Fix

## Problem Summary

Your app was failing to connect to Firebase emulator on iOS and Android:

### Android Error
```
FirebaseError: Firebase: Error (auth/network-request-failed)
```

### iOS Error
```
code: "unavailable"
Error loading user profile
Error checking user existence
```

---

## Root Cause Analysis

**The problem**: Hardcoded emulator host using `127.0.0.1` (localhost)

### Why It Failed

| Platform | Issue | Host Used |
|----------|-------|-----------|
| **Web** | Works fine | `127.0.0.1` ✅ |
| **Android** | Cannot reach emulator | `127.0.0.1` ❌ |
| **iOS** | Cannot reach emulator | `127.0.0.1` ❌ |

On mobile devices, `127.0.0.1` refers to the **device itself**, not your development machine. Your Firebase emulator runs on your dev machine, so the app couldn't reach it.

### Official Firebase Documentation

Per [Firebase Authentication Emulator Docs](https://firebase.google.com/docs/emulator-suite/connect_auth):

- **Android**: Must use `10.0.2.2` (special alias for host machine from Android emulator)
- **iOS**: Can use `127.0.0.1` (localhost through Capacitor bridge)
- **Web**: Uses `127.0.0.1` (localhost)

---

## Solution Implemented

### Changes Made

#### 1. **firebase.service.ts** - Added platform detection

```typescript
// New method to determine correct emulator host
private getEmulatorHost(): string {
  if (this.platform.is('android')) {
    console.log('[FirebaseService] Using Android emulator host: 10.0.2.2');
    return '10.0.2.2';
  }
  // iOS, web, and other platforms use localhost
  console.log('[FirebaseService] Using localhost for emulator: 127.0.0.1');
  return '127.0.0.1';
}
```

- Injected Ionic's `Platform` service
- Dynamically selects correct host based on platform
- Uses Firebase-recommended addresses

#### 2. **environment.ts** - Removed hardcoded host

```typescript
emulator: {
  authPort: 9099,
  firestorePort: 8080,
  storagePort: 9199
  // Host determined dynamically in FirebaseService
}
```

---

## How to Test the Fix

### 1. **Ensure Firebase emulator is running**
```bash
firebase emulators:start
```

### 2. **Android Testing**
```bash
ionic capacitor run android
```
- Check logs for: `Using Android emulator host: 10.0.2.2`
- Should see: `Auth connected to emulator at 10.0.2.2:9099`

### 3. **iOS Testing**
```bash
ionic capacitor run ios
```
- Check logs for: `Using localhost for emulator: 127.0.0.1`
- Should see: `Auth connected to emulator at 127.0.0.1:9099`

### 4. **Web Testing**
```bash
ionic serve
```
- Should work as before with `127.0.0.1`

---

## Expected Behavior After Fix

### Android Console
```
⚡️ [log] - [FirebaseService] Using Android emulator host: 10.0.2.2
⚡️ [log] - [FirebaseService] Auth connected to emulator at 10.0.2.2:9099
⚡️ [log] - [FirebaseService] Firestore connected to emulator at 10.0.2.2:8080
⚡️ [log] - [AuthService] Signed in anonymously: {uid}
⚡️ [log] - [AuthService] User profile loaded: {uid}
```

### iOS Console
```
⚡️ [log] - [FirebaseService] Using localhost for emulator: 127.0.0.1
⚡️ [log] - [FirebaseService] Auth connected to emulator at 127.0.0.1:9099
⚡️ [log] - [FirebaseService] Firestore connected to emulator at 127.0.0.1:8080
⚡️ [log] - [AuthService] Signed in anonymously: {uid}
⚡️ [log] - [AuthService] User profile loaded: {uid}
```

---

## Files Modified

1. `/src/app/services/firebase.service.ts`
   - Added `Platform` injection
   - Added `getEmulatorHost()` method
   - Updated `connectToEmulator()` to use dynamic host

2. `/src/environments/environment.ts`
   - Removed hardcoded `host: '127.0.0.1'` from emulator config
   - Added clarifying comment

---

## Additional Notes

### Physical Devices
If you test on physical devices (not emulators), you'll need to update `getEmulatorHost()` to detect and use your machine's local network IP:

```typescript
private getEmulatorHost(): string {
  if (this.platform.is('android')) {
    if (this.isPhysicalDevice()) {
      return '192.168.x.x'; // Your machine's local IP
    }
    return '10.0.2.2'; // Android emulator
  }
  return '127.0.0.1';
}
```

### Production Build
The fix uses `environment.useEmulator` flag, so production builds won't attempt emulator connections.

---

## References

- [Firebase Auth Emulator Docs](https://firebase.google.com/docs/emulator-suite/connect_auth)
- [Firestore Emulator Docs](https://firebase.google.com/docs/emulator-suite/connect_firestore)
- [Android Emulator Networking](https://developer.android.com/studio/run/emulator-networking)
