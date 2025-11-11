import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'oneMinuteSkills',
  webDir: 'www',
  // Development-only: Allow HTTP connections to Firebase emulator
  server: {
    androidScheme: 'http', // Use HTTP scheme for Android emulator compatibility
    cleartext: true, // Allow cleartext HTTP traffic (localhost/emulator only)
  },
  android: {
    allowMixedContent: true, // Allow mixed HTTP/HTTPS content for emulator
  },
};

export default config;
