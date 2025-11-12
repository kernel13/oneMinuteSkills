import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { MainAppGuard } from './main-app.guard';
import { AuthService } from '../services/auth.service';
import { User, createUser } from '../models/user.model';

describe('MainAppGuard', () => {
  let guard: MainAppGuard;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let currentUserSubject: BehaviorSubject<User | null>;

  beforeEach(() => {
    currentUserSubject = new BehaviorSubject<User | null>(null);

    mockAuthService = jasmine.createSpyObj('AuthService', [], {
      currentUser$: currentUserSubject.asObservable(),
    });

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        MainAppGuard,
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    guard = TestBed.inject(MainAppGuard);
  });

  describe('Guard Activation', () => {
    it('should create the guard', () => {
      expect(guard).toBeTruthy();
    });

    it('should prevent access when user is not authenticated', (done) => {
      currentUserSubject.next(null);

      guard.canActivate(null as any, null as any).subscribe((result) => {
        expect(result).toBe(false);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/onboarding']);
        done();
      });
    });

    it('should prevent access when user has not completed onboarding', (done) => {
      const incompleteUser = createUser('user-123', true);
      incompleteUser.onboardingComplete = false;
      currentUserSubject.next(incompleteUser);

      guard.canActivate(null as any, null as any).subscribe((result) => {
        expect(result).toBe(false);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/onboarding']);
        done();
      });
    });

    it('should allow access when user has completed onboarding', (done) => {
      const completedUser = createUser('user-123', true);
      completedUser.onboardingComplete = true;
      currentUserSubject.next(completedUser);

      guard.canActivate(null as any, null as any).subscribe((result) => {
        expect(result).toBe(true);
        expect(mockRouter.navigate).not.toHaveBeenCalled();
        done();
      });
    });

    it('should redirect to /onboarding when user is incomplete', (done) => {
      const incompleteUser = createUser('user-456', true);
      incompleteUser.onboardingComplete = false;
      currentUserSubject.next(incompleteUser);

      guard.canActivate(null as any, null as any).subscribe((result) => {
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/onboarding']);
        done();
      });
    });

    it('should not redirect when user has completed onboarding', (done) => {
      const completedUser = createUser('user-789', true);
      completedUser.onboardingComplete = true;
      currentUserSubject.next(completedUser);

      guard.canActivate(null as any, null as any).subscribe((result) => {
        expect(mockRouter.navigate).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('Multiple Calls', () => {
    it('should handle status change from incomplete to complete', (done) => {
      // Start with incomplete user
      const user = createUser('user-123', true);
      user.onboardingComplete = false;
      currentUserSubject.next(user);

      // First call should prevent access
      guard.canActivate(null as any, null as any).subscribe((result) => {
        expect(result).toBe(false);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/onboarding']);

        // Reset mock
        mockRouter.navigate.calls.reset();

        // Update user to completed
        const completedUser = createUser('user-123', true);
        completedUser.onboardingComplete = true;
        currentUserSubject.next(completedUser);

        // Second call should allow access
        guard.canActivate(null as any, null as any).subscribe((result2) => {
          expect(result2).toBe(true);
          expect(mockRouter.navigate).not.toHaveBeenCalled();
          done();
        });
      });
    });

    it('should use take(1) to only evaluate once', (done) => {
      const user = createUser('user-123', true);
      user.onboardingComplete = false;
      currentUserSubject.next(user);

      const subscription = guard.canActivate(null as any, null as any).subscribe(() => {
        // After subscription, emit new value
        user.onboardingComplete = true;
        currentUserSubject.next(user);

        // Guard should not react to the new value (because of take(1))
        expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
        done();
      });

      return subscription;
    });
  });

  describe('Edge Cases', () => {
    it('should handle null user gracefully', (done) => {
      currentUserSubject.next(null);

      guard.canActivate(null as any, null as any).subscribe((result) => {
        expect(result).toBe(false);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/onboarding']);
        done();
      });
    });

    it('should handle undefined onboardingComplete as false', (done) => {
      const user = createUser('user-123', true);
      // Don't set onboardingComplete (defaults to false)
      (user as any).onboardingComplete = undefined;
      currentUserSubject.next(user);

      guard.canActivate(null as any, null as any).subscribe((result) => {
        expect(result).toBe(false);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/onboarding']);
        done();
      });
    });

    it('should prevent access for new user without onboardingComplete property', (done) => {
      const newUser = createUser('new-user', true);
      delete (newUser as any).onboardingComplete;
      currentUserSubject.next(newUser);

      guard.canActivate(null as any, null as any).subscribe((result) => {
        expect(result).toBe(false);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/onboarding']);
        done();
      });
    });
  });

  describe('Observable Behavior', () => {
    it('should complete after first emission (take(1))', (done) => {
      const user = createUser('user-123', true);
      user.onboardingComplete = true;
      currentUserSubject.next(user);

      let completed = false;

      guard.canActivate(null as any, null as any).subscribe(
        () => {},
        () => {},
        () => {
          completed = true;
        }
      );

      setTimeout(() => {
        expect(completed).toBe(true);
        done();
      }, 100);
    });
  });
});
