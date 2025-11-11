import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  connectAuthEmulator,
  Auth,
} from 'firebase/auth';
import {
  initializeFirestore,
  connectFirestoreEmulator,
  Firestore,
} from 'firebase/firestore';
import { environment } from '../../environments/environment';
import { getStorage, connectStorageEmulator, FirebaseStorage } from 'firebase/storage';
import { Platform } from '@ionic/angular';

/**
 * Firebase Service
 * Initializes Firebase with Firestore, Authentication, and Storage
 * Supports both emulator and production Firebase instances
 */
@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private auth: Auth | null = null;
  private firestore: Firestore | null = null;
  private storage: FirebaseStorage | null = null;
  private initialized = false;

  constructor(private platform: Platform) {}

  /**
   * Initialize Firebase
   * Must be called once on app startup
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Initialize Firebase app
      const app = initializeApp(environment.firebase);

      // Initialize Auth
      this.auth = initializeAuth(app);

      // Initialize Firestore with environment-specific settings
      if (environment.useEmulator && !environment.production) {
        // Emulator mode: disable cache to prevent offline mode issues
        // Use long polling for better emulator compatibility
        this.firestore = initializeFirestore(app, {
          experimentalForceLongPolling: true,
        });
      } else {
        // Production mode: enable cache for performance
        this.firestore = initializeFirestore(app, {
          cacheSizeBytes: 50 * 1024 * 1024, // 50MB cache
        });
      }

      // Initialize Storage
      this.storage = getStorage(app);

      // Setup emulator if enabled (development only)
      if (environment.useEmulator && !environment.production) {
        this.connectToEmulator();
      }

      this.initialized = true;
      console.log('[FirebaseService] Firebase initialized successfully');
    } catch (error) {
      console.error('[FirebaseService] Initialization error:', error);
      throw error;
    }
  }

  /**
   * Get the correct emulator host based on platform
   * Android emulator: 10.0.2.2 (special alias for host machine)
   * iOS/Web: 127.0.0.1 (localhost)
   * See: https://firebase.google.com/docs/emulator-suite/connect_auth
   */
  private getEmulatorHost(): string {
    if (this.platform.is('android')) {
      console.log('[FirebaseService] Using Android emulator host: 10.0.2.2');
      return '10.0.2.2';
    }
    // iOS, web, and other platforms use localhost
    console.log('[FirebaseService] Using localhost for emulator: 127.0.0.1');
    return '127.0.0.1';
  }

  /**
   * Connect to Firebase emulator
   * Only for development/testing
   */
  private connectToEmulator(): void {
    try {
      const { authPort, firestorePort, storagePort } = environment.emulator;
      const host = this.getEmulatorHost();
      const emulatorUrl = `http://${host}`;

      // Connect Auth to emulator
      if (this.auth && !this.isAuthEmulatorConnected()) {
        connectAuthEmulator(this.auth, `${emulatorUrl}:${authPort}`, {
          disableWarnings: true,
        });
        console.log(
          `[FirebaseService] Auth connected to emulator at ${host}:${authPort}`
        );
      }

      // Connect Firestore to emulator
      if (this.firestore) {
        connectFirestoreEmulator(this.firestore, host, firestorePort);
        console.log(
          `[FirebaseService] Firestore connected to emulator at ${host}:${firestorePort}`
        );
      }

      // Connect Storage to emulator
      if (this.storage && !this.isStorageEmulatorConnected()) {
        connectStorageEmulator(this.storage, host, storagePort);
        console.log(
          `[FirebaseService] Storage connected to emulator at ${host}:${storagePort}`
        );
      }
    } catch (error) {
      console.error('[FirebaseService] Emulator connection error:', error);
    }
  }

  /**
   * Check if Auth emulator is already connected
   */
  private isAuthEmulatorConnected(): boolean {
    if (!this.auth) return false;
    return (this.auth as any).emulatorConfig !== null;
  }

  /**
   * Check if Storage emulator is already connected
   */
  private isStorageEmulatorConnected(): boolean {
    if (!this.storage) return false;
    return (this.storage as any).host !== null;
  }

  /**
   * Get Firebase Auth instance
   */
  getAuth(): Auth | null {
    return this.auth;
  }

  /**
   * Get Firestore instance
   */
  getFirestore(): Firestore | null {
    return this.firestore;
  }

  /**
   * Get Storage instance
   */
  getStorage(): FirebaseStorage | null {
    return this.storage;
  }

  /**
   * Check if Firebase is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }
}
