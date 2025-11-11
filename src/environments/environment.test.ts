export const environment = {
  production: false,
  firebase: {
    apiKey: 'test-api-key',
    authDomain: 'test.firebaseapp.com',
    projectId: 'test-project',
    storageBucket: 'test.appspot.com',
    messagingSenderId: 'test-sender-id',
    appId: 'test-app-id'
  },
  useEmulator: true,
  emulator: {
    authPort: 9099,
    firestorePort: 8080,
    storagePort: 9199,
    host: '127.0.0.1'
  }
};
