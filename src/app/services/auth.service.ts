import { Injectable, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { User, createUser } from '../models/user.model';
import {
  signInAnonymously,
  signOut as firebaseSignOut,
  Auth,
  UserCredential,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  Firestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Auth Service
 * Handles user authentication and profile management
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private firebaseService = inject(FirebaseService);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private authInitializedSubject = new BehaviorSubject<boolean>(false);

  /**
   * Observable of current user
   */
  currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  /**
   * Observable of auth initialization status
   */
  authInitialized$: Observable<boolean> = this.authInitializedSubject.asObservable();

  /**
   * Get current user synchronously
   */
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Get current auth user ID
   */
  get currentUserId(): string | null {
    return this.currentUser?.id ?? null;
  }

  /**
   * Check if user is authenticated (anonymous or email)
   */
  get isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  /**
   * Check if current user is anonymous
   */
  get isAnonymous(): boolean {
    return this.currentUser?.isAnonymous ?? false;
  }

  /**
   * Check if current user has completed onboarding
   */
  get hasCompletedOnboarding(): boolean {
    return this.currentUser?.onboardingComplete ?? false;
  }

  /**
   * Initialize authentication
   * Should be called after Firebase is initialized
   */
  async initializeAuth(): Promise<void> {
    try {
      const auth = this.firebaseService.getAuth();
      if (!auth) {
        throw new Error('Firebase Auth not initialized');
      }

      // Set up auth state listener
      onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          // User is signed in, load their profile
          await this.loadUserProfile(firebaseUser.uid);
        } else {
          // No user logged in, sign in anonymously
          await this.signInAnonymously();
        }
        this.authInitializedSubject.next(true);
      });
    } catch (error) {
      console.error('[AuthService] Auth initialization error:', error);
      this.authInitializedSubject.next(true);
      throw error;
    }
  }

  /**
   * Sign in anonymously
   */
  private async signInAnonymously(): Promise<void> {
    try {
      const auth = this.firebaseService.getAuth();
      if (!auth) {
        throw new Error('Firebase Auth not initialized');
      }

      const credential: UserCredential = await signInAnonymously(auth);
      const firebaseUser = credential.user;

      // Check if user profile exists in Firestore
      const userExists = await this.userExistsInFirestore(firebaseUser.uid);

      if (!userExists) {
        // Create new user profile
        const newUser = createUser(firebaseUser.uid, true);
        await this.createUserProfile(newUser);
      } else {
        // Load existing user profile
        await this.loadUserProfile(firebaseUser.uid);
      }

      console.log('[AuthService] Signed in anonymously:', firebaseUser.uid);
    } catch (error) {
      console.error('[AuthService] Anonymous sign-in error:', error);
      throw error;
    }
  }

  /**
   * Check if user profile exists in Firestore
   */
  private async userExistsInFirestore(userId: string): Promise<boolean> {
    try {
      const firestore = this.firebaseService.getFirestore();
      if (!firestore) {
        throw new Error('Firestore not initialized');
      }

      const userRef = doc(firestore, 'users', userId);
      const userSnap = await getDoc(userRef);
      return userSnap.exists();
    } catch (error) {
      console.error('[AuthService] Error checking user existence:', error);
      return false;
    }
  }

  /**
   * Create user profile in Firestore
   */
  private async createUserProfile(user: User): Promise<void> {
    try {
      const firestore = this.firebaseService.getFirestore();
      if (!firestore) {
        throw new Error('Firestore not initialized');
      }

      const userRef = doc(firestore, 'users', user.id);
      await setDoc(userRef, {
        ...user,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      this.currentUserSubject.next(user);
      console.log('[AuthService] User profile created:', user.id);
    } catch (error) {
      console.error('[AuthService] Error creating user profile:', error);
      throw error;
    }
  }

  /**
   * Load user profile from Firestore
   */
  private async loadUserProfile(userId: string): Promise<void> {
    try {
      const firestore = this.firebaseService.getFirestore();
      if (!firestore) {
        throw new Error('Firestore not initialized');
      }

      const userRef = doc(firestore, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data() as User;
        // Convert Firestore timestamps to Date objects
        if (userData.createdAt && typeof userData.createdAt === 'object') {
          userData.createdAt = (userData.createdAt as any).toDate();
        }
        if (userData.updatedAt && typeof userData.updatedAt === 'object') {
          userData.updatedAt = (userData.updatedAt as any).toDate();
        }
        this.currentUserSubject.next(userData);
        console.log('[AuthService] User profile loaded:', userId);
      } else {
        console.warn('[AuthService] User profile not found:', userId);
      }
    } catch (error) {
      console.error('[AuthService] Error loading user profile:', error);
      throw error;
    }
  }

  /**
   * Update user profile in Firestore
   */
  async updateUserProfile(updates: Partial<User>): Promise<void> {
    try {
      const userId = this.currentUserId;
      if (!userId) {
        throw new Error('No user logged in');
      }

      const firestore = this.firebaseService.getFirestore();
      if (!firestore) {
        throw new Error('Firestore not initialized');
      }

      const userRef = doc(firestore, 'users', userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });

      // Update local state
      const updatedUser = { ...this.currentUser, ...updates } as User;
      this.currentUserSubject.next(updatedUser);

      console.log('[AuthService] User profile updated:', userId);
    } catch (error) {
      console.error('[AuthService] Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Get current user synchronously (doesn't wait for Firestore)
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Wait for auth to be initialized
   */
  async waitForAuthInitialization(): Promise<void> {
    return new Promise((resolve) => {
      if (this.authInitializedSubject.value) {
        resolve();
      } else {
        const subscription = this.authInitialized$.subscribe((initialized) => {
          if (initialized) {
            subscription.unsubscribe();
            resolve();
          }
        });
      }
    });
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    try {
      const auth = this.firebaseService.getAuth();
      if (!auth) {
        throw new Error('Firebase Auth not initialized');
      }

      await firebaseSignOut(auth);
      this.currentUserSubject.next(null);
      console.log('[AuthService] User signed out');
    } catch (error) {
      console.error('[AuthService] Error signing out:', error);
      throw error;
    }
  }
}
