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

      // Initialize Firestore
      this.firestore = initializeFirestore(app, {
        cacheSizeBytes: 50 * 1024 * 1024, // 50MB cache
      });

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
   * Connect to Firebase emulator
   * Only for development/testing
   */
  private connectToEmulator(): void {
    try {
      const { host, authPort, firestorePort, storagePort } = environment.emulator;
      const emulatorUrl = `http://${host}`;

      // Connect Auth to emulator
      if (this.auth && !this.isAuthEmulatorConnected()) {
        connectAuthEmulator(this.auth, `${emulatorUrl}:${authPort}`, {
          disableWarnings: true,
        });
        console.log(`[FirebaseService] Auth connected to emulator at port ${authPort}`);
      }

      // Connect Firestore to emulator
      if (this.firestore && !this.isFirestoreEmulatorConnected()) {
        connectFirestoreEmulator(this.firestore, host, firestorePort);
        console.log(
          `[FirebaseService] Firestore connected to emulator at port ${firestorePort}`
        );
      }

      // Connect Storage to emulator
      if (this.storage && !this.isStorageEmulatorConnected()) {
        connectStorageEmulator(this.storage, host, storagePort);
        console.log(
          `[FirebaseService] Storage connected to emulator at port ${storagePort}`
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
   * Check if Firestore emulator is already connected
   */
  private isFirestoreEmulatorConnected(): boolean {
    if (!this.firestore) return false;
    return (this.firestore as any)._databaseId?.database === '(default)';
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
