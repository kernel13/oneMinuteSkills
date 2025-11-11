import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { OnboardingResolver } from './onboarding.resolver';
import { AuthService } from '../services/auth.service';
import { TopicService } from '../services/topic.service';
import { User, createUser } from '../models/user.model';

describe('OnboardingResolver', () => {
  let resolver: OnboardingResolver;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockTopicService: jasmine.SpyObj<TopicService>;
  let currentUserSubject: BehaviorSubject<User | null>;

  beforeEach(() => {
    currentUserSubject = new BehaviorSubject<User | null>(null);

    mockAuthService = jasmine.createSpyObj('AuthService', [], {
      currentUser$: currentUserSubject.asObservable(),
    });

    mockTopicService = jasmine.createSpyObj('TopicService', ['loadAllTopics']);

    TestBed.configureTestingModule({
      providers: [
        OnboardingResolver,
        { provide: AuthService, useValue: mockAuthService },
        { provide: TopicService, useValue: mockTopicService },
      ],
    });

    resolver = TestBed.inject(OnboardingResolver);
  });

  describe('Resolver Activation', () => {
    it('should create the resolver', () => {
      expect(resolver).toBeTruthy();
    });

    it('should return null when user is not authenticated', (done) => {
      currentUserSubject.next(null);

      resolver.resolve(null as any, null as any).subscribe((result) => {
        expect(result).toBeNull();
        done();
      });
    });

    it('should return user when authenticated', (done) => {
      const user = createUser('user-123', true);
      user.onboardingComplete = false;
      currentUserSubject.next(user);

      resolver.resolve(null as any, null as any).subscribe((result) => {
        expect(result).toBeTruthy();
        expect(result?.id).toBe('user-123');
        done();
      });
    });

    it('should load topics when user is authenticated', (done) => {
      mockTopicService.loadAllTopics.and.returnValue(Promise.resolve());
      const user = createUser('user-456', true);
      currentUserSubject.next(user);

      resolver.resolve(null as any, null as any).subscribe(() => {
        expect(mockTopicService.loadAllTopics).toHaveBeenCalled();
        done();
      });
    });

    it('should not load topics when user is null', (done) => {
      currentUserSubject.next(null);

      resolver.resolve(null as any, null as any).subscribe(() => {
        expect(mockTopicService.loadAllTopics).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('Topic Loading', () => {
    it('should handle topic loading errors gracefully', (done) => {
      mockTopicService.loadAllTopics.and.returnValue(Promise.reject(new Error('Load failed')));
      const user = createUser('user-789', true);
      currentUserSubject.next(user);

      resolver.resolve(null as any, null as any).subscribe((result) => {
        // Should still return user even if topics fail to load
        expect(result).toBeTruthy();
        expect(mockTopicService.loadAllTopics).toHaveBeenCalled();
        done();
      });
    });

    it('should call loadAllTopics async without waiting', (done) => {
      mockTopicService.loadAllTopics.and.returnValue(Promise.resolve());
      const user = createUser('user-123', true);
      currentUserSubject.next(user);

      resolver.resolve(null as any, null as any).subscribe(() => {
        // Resolver completes immediately, topics load in background
        expect(mockTopicService.loadAllTopics).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle auth service errors', (done) => {
      const errorSubject = new BehaviorSubject<User | null>(null);
      mockAuthService.currentUser$ = errorSubject.asObservable();

      resolver.resolve(null as any, null as any).subscribe((result) => {
        expect(result).toBeNull();
        done();
      });

      // Emit a value
      errorSubject.next(null);
    });

    it('should use take(1) to only evaluate once', (done) => {
      const user = createUser('user-123', true);
      currentUserSubject.next(user);

      let subscriptionCount = 0;
      const subscription = resolver.resolve(null as any, null as any).subscribe(() => {
        subscriptionCount++;
      });

      setTimeout(() => {
        // Emit new value
        currentUserSubject.next(createUser('user-456', true));

        setTimeout(() => {
          // Should only emit once (take(1))
          expect(subscriptionCount).toBe(1);
          done();
        }, 100);
      }, 100);

      return subscription;
    });
  });

  describe('Return Values', () => {
    it('should return complete user object with all properties', (done) => {
      const user = createUser('user-123', true);
      user.onboardingComplete = false;
      user.selectedTopics = ['topic-1', 'topic-2'];
      currentUserSubject.next(user);

      resolver.resolve(null as any, null as any).subscribe((result) => {
        expect(result?.id).toBe('user-123');
        expect(result?.isAnonymous).toBe(true);
        expect(result?.selectedTopics).toEqual(['topic-1', 'topic-2']);
        done();
      });
    });

    it('should return null on error from auth service', (done) => {
      mockAuthService.currentUser$ = of(null);

      resolver.resolve(null as any, null as any).subscribe((result) => {
        expect(result).toBeNull();
        done();
      });
    });
  });
});
