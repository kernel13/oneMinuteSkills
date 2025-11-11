import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { FirebaseService } from './firebase.service';
import { User } from '../models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let firebaseServiceMock: jasmine.SpyObj<FirebaseService>;

  beforeEach(() => {
    const firebaseSpy = jasmine.createSpyObj('FirebaseService', [
      'getAuth',
      'getFirestore',
      'initialize',
      'isInitialized',
    ]);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: FirebaseService, useValue: firebaseSpy },
      ],
    });

    service = TestBed.inject(AuthService);
    firebaseServiceMock = TestBed.inject(FirebaseService) as jasmine.SpyObj<FirebaseService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have null currentUser initially', () => {
    expect(service.currentUser).toBeNull();
  });

  it('should not be authenticated initially', () => {
    expect(service.isAuthenticated).toBeFalsy();
  });

  it('should return null for currentUserId when no user', () => {
    expect(service.currentUserId).toBeNull();
  });

  describe('currentUser$ observable', () => {
    it('should emit null initially', (done) => {
      service.currentUser$.subscribe((user) => {
        expect(user).toBeNull();
        done();
      });
    });
  });

  describe('authInitialized$ observable', () => {
    it('should emit false initially', (done) => {
      service.authInitialized$.subscribe((initialized) => {
        expect(initialized).toBeFalsy();
        done();
      });
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when no user logged in', () => {
      expect(service.getCurrentUser()).toBeNull();
    });
  });

  describe('isAnonymous', () => {
    it('should return false when no user', () => {
      expect(service.isAnonymous).toBeFalsy();
    });
  });

  describe('waitForAuthInitialization', () => {
    it('should resolve immediately if already initialized', async () => {
      // Simulate auth already initialized
      (service as any).authInitializedSubject.next(true);

      const startTime = Date.now();
      await service.waitForAuthInitialization();
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(100); // Should resolve quickly
    });
  });

  it('should have methods for updating user profile', () => {
    expect(service.updateUserProfile).toBeDefined();
  });

  it('should have method to wait for auth initialization', () => {
    expect(service.waitForAuthInitialization).toBeDefined();
  });

  it('should have method to initialize auth', () => {
    expect(service.initializeAuth).toBeDefined();
  });
});
