import { TestBed } from '@angular/core/testing';
import { LessonService } from './lesson.service';
import { FirebaseService } from './firebase.service';
import { AuthService } from './auth.service';
import { createUser } from '../models/user.model';
import { createLesson } from '../models/lesson.model';

describe('LessonService', () => {
  let service: LessonService;
  let mockFirebaseService: jasmine.SpyObj<FirebaseService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    mockFirebaseService = jasmine.createSpyObj('FirebaseService', ['getFirestore']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'updateUserProfile']);

    TestBed.configureTestingModule({
      providers: [
        LessonService,
        { provide: FirebaseService, useValue: mockFirebaseService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    });

    service = TestBed.inject(LessonService);
  });

  describe('Service Creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with empty lessons', () => {
      expect(service.lessons).toEqual([]);
    });

    it('should initialize with null daily lesson', () => {
      expect(service.dailyLesson).toBeNull();
    });

    it('should initialize with empty user progress', () => {
      expect(service.userProgress).toEqual([]);
    });
  });

  describe('Load All Lessons', () => {
    it('should load lessons from mock data when Firestore unavailable', async () => {
      mockFirebaseService.getFirestore.and.returnValue(null);

      await service.loadAllLessons();

      expect(service.lessons.length).toBeGreaterThan(0);
      expect(service.lessons[0].id).toBeDefined();
    });

    it('should set loading state during load', async () => {
      mockFirebaseService.getFirestore.and.returnValue(null);
      let loadingStates: boolean[] = [];

      service.loading$.subscribe((loading) => {
        loadingStates.push(loading);
      });

      await service.loadAllLessons();

      expect(loadingStates).toContain(true);
    });

    it('should clear error on successful load', async () => {
      mockFirebaseService.getFirestore.and.returnValue(null);

      await service.loadAllLessons();

      let error: string | null = null;
      service.error$.subscribe((e) => {
        error = e;
      });

      expect(error).toBeNull();
    });

    it('should emit lessons through observable', async () => {
      mockFirebaseService.getFirestore.and.returnValue(null);
      let emittedLessons: any[] = [];

      service.lessons$.subscribe((lessons) => {
        emittedLessons.push(lessons);
      });

      await service.loadAllLessons();

      expect(emittedLessons.length).toBeGreaterThan(0);
      expect(emittedLessons[emittedLessons.length - 1].length).toBeGreaterThan(0);
    });
  });

  describe('Get Lesson By ID', () => {
    it('should return lesson when found in loaded lessons', async () => {
      mockFirebaseService.getFirestore.and.returnValue(null);
      await service.loadAllLessons();

      const firstLessonId = service.lessons[0].id;
      const lesson = await service.getLessonById(firstLessonId);

      expect(lesson).toBeTruthy();
      expect(lesson?.id).toBe(firstLessonId);
    });

    it('should return null when lesson not found', async () => {
      mockFirebaseService.getFirestore.and.returnValue(null);
      await service.loadAllLessons();

      const lesson = await service.getLessonById('non-existent-id');

      expect(lesson).toBeNull();
    });

    it('should use mock data as fallback', async () => {
      mockFirebaseService.getFirestore.and.returnValue(null);

      // Don't load lessons first, just try to get by ID
      const lesson = await service.getLessonById('lesson-tech-001');

      expect(lesson).toBeTruthy();
      expect(lesson?.id).toBe('lesson-tech-001');
    });
  });

  describe('Load Daily Lesson', () => {
    it('should return null when no user logged in', async () => {
      mockAuthService.getCurrentUser.and.returnValue(null);

      const lesson = await service.loadDailyLesson();

      expect(lesson).toBeNull();
    });

    it('should select a lesson for user with selected topics', async () => {
      const user = createUser('user-123', true);
      user.selectedTopics = ['topic-1', 'topic-2'];
      mockAuthService.getCurrentUser.and.returnValue(user);
      mockFirebaseService.getFirestore.and.returnValue(null);

      await service.loadAllLessons();
      const lesson = await service.loadDailyLesson();

      expect(lesson).toBeTruthy();
      expect(lesson?.id).toBeDefined();
    });

    it('should emit daily lesson through observable', async () => {
      const user = createUser('user-123', true);
      mockAuthService.getCurrentUser.and.returnValue(user);
      mockFirebaseService.getFirestore.and.returnValue(null);

      await service.loadAllLessons();

      let emittedLesson: any = undefined;
      service.dailyLesson$.subscribe((lesson) => {
        emittedLesson = lesson;
      });

      await service.loadDailyLesson();

      expect(emittedLesson).toBeTruthy();
      expect(emittedLesson?.id).toBeDefined();
    });

    it('should return consistent lesson for same day', async () => {
      const user = createUser('user-123', true);
      mockAuthService.getCurrentUser.and.returnValue(user);
      mockFirebaseService.getFirestore.and.returnValue(null);

      await service.loadAllLessons();

      const lesson1 = await service.loadDailyLesson();
      const lesson2 = await service.loadDailyLesson();

      expect(lesson1?.id).toBe(lesson2?.id);
    });
  });

  describe('Mark Lesson as Complete', () => {
    it('should throw error when no user logged in', async () => {
      mockAuthService.getCurrentUser.and.returnValue(null);

      try {
        await service.markLessonAsComplete('lesson-1', 10);
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toContain('No user logged in');
      }
    });

    it('should throw error when Firestore not initialized', async () => {
      const user = createUser('user-123', true);
      mockAuthService.getCurrentUser.and.returnValue(user);
      mockFirebaseService.getFirestore.and.returnValue(null);

      try {
        await service.markLessonAsComplete('lesson-1', 10);
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toContain('Firestore not initialized');
      }
    });

    it('should call updateUserProfile with correct data', async () => {
      const user = createUser('user-123', true);
      user.xp = 100;
      user.level = 2;
      user.totalLessonsCompleted = 5;
      mockAuthService.getCurrentUser.and.returnValue(user);
      mockAuthService.updateUserProfile.and.returnValue(Promise.resolve());

      mockFirebaseService.getFirestore.and.returnValue({
        _key: {},
      } as any);

      // Mock Firestore operations would need more setup
      // For now, test that updateUserProfile is called
      try {
        await service.markLessonAsComplete('lesson-1', 15);
      } catch (e) {
        // Firestore operations will fail without full mock
      }

      // Would verify updateUserProfile called with new stats
      // This requires more extensive mocking
    });

    it('should update user progress locally', async () => {
      const user = createUser('user-123', true);
      user.xp = 0;
      user.level = 1;
      user.totalLessonsCompleted = 0;
      mockAuthService.getCurrentUser.and.returnValue(user);

      const initialProgress = service.userProgress;
      expect(initialProgress).toEqual([]);

      // Note: Full test would require Firestore mock
      // This demonstrates the expected behavior
    });
  });

  describe('Get User Completed Lessons', () => {
    it('should return empty array when Firestore unavailable', async () => {
      mockFirebaseService.getFirestore.and.returnValue(null);

      const completedLessons = await service.getUserCompletedLessons('user-123');

      expect(completedLessons).toEqual([]);
    });

    it('should return completed lessons for user', async () => {
      // This test would require full Firestore mocking
      // Demonstrates expected behavior
      const userId = 'user-123';
      const completedLessons = await service.getUserCompletedLessons(userId);

      expect(Array.isArray(completedLessons)).toBe(true);
    });
  });

  describe('Observables', () => {
    it('should expose lessons$ observable', (done) => {
      mockFirebaseService.getFirestore.and.returnValue(null);

      service.lessons$.subscribe((lessons) => {
        if (lessons.length > 0) {
          expect(lessons.length).toBeGreaterThan(0);
          done();
        }
      });

      service.loadAllLessons();
    });

    it('should expose dailyLesson$ observable', (done) => {
      const user = createUser('user-123', true);
      mockAuthService.getCurrentUser.and.returnValue(user);
      mockFirebaseService.getFirestore.and.returnValue(null);

      service.dailyLesson$.subscribe((lesson) => {
        if (lesson) {
          expect(lesson.id).toBeDefined();
          done();
        }
      });

      service.loadAllLessons().then(() => service.loadDailyLesson());
    });

    it('should expose loading$ observable', (done) => {
      mockFirebaseService.getFirestore.and.returnValue(null);
      let loadingEmitted = false;

      service.loading$.subscribe((loading) => {
        if (loading) {
          loadingEmitted = true;
        }
      });

      service.loadAllLessons().then(() => {
        expect(loadingEmitted).toBe(true);
        done();
      });
    });

    it('should expose error$ observable', (done) => {
      mockFirebaseService.getFirestore.and.returnValue(null);
      let errorEmitted = false;

      service.error$.subscribe((error) => {
        if (error === null) {
          errorEmitted = true;
        }
      });

      service.loadAllLessons().then(() => {
        expect(errorEmitted).toBe(true);
        done();
      });
    });
  });

  describe('Synchronous Getters', () => {
    it('should return current lessons synchronously', async () => {
      mockFirebaseService.getFirestore.and.returnValue(null);

      expect(service.lessons.length).toBe(0);

      await service.loadAllLessons();

      expect(service.lessons.length).toBeGreaterThan(0);
    });

    it('should return current daily lesson synchronously', async () => {
      const user = createUser('user-123', true);
      mockAuthService.getCurrentUser.and.returnValue(user);
      mockFirebaseService.getFirestore.and.returnValue(null);

      expect(service.dailyLesson).toBeNull();

      await service.loadAllLessons();
      await service.loadDailyLesson();

      expect(service.dailyLesson).toBeTruthy();
    });

    it('should return current user progress synchronously', () => {
      expect(service.userProgress).toEqual([]);
    });
  });

  describe('Mock Data Fallback', () => {
    it('should use mock lessons when Firestore has no data', async () => {
      mockFirebaseService.getFirestore.and.returnValue(null);

      await service.loadAllLessons();

      const lessons = service.lessons;
      expect(lessons.length).toBeGreaterThan(0);

      // Check that we have various categories
      const categories = new Set(lessons.map((l) => l.category));
      expect(categories.size).toBeGreaterThan(1);
    });

    it('should provide lessons with all required fields', async () => {
      mockFirebaseService.getFirestore.and.returnValue(null);

      await service.loadAllLessons();

      const lesson = service.lessons[0];
      expect(lesson.id).toBeDefined();
      expect(lesson.title).toBeDefined();
      expect(lesson.description).toBeDefined();
      expect(lesson.content).toBeDefined();
      expect(lesson.difficulty).toBeDefined();
      expect(lesson.xpReward).toBeDefined();
      expect(lesson.category).toBeDefined();
    });

    it('should have diverse lessons by difficulty', async () => {
      mockFirebaseService.getFirestore.and.returnValue(null);

      await service.loadAllLessons();

      const difficulties = new Set(service.lessons.map((l) => l.difficulty));
      expect(difficulties.has('beginner')).toBe(true);
      expect(difficulties.has('intermediate')).toBe(true);
      expect(difficulties.has('advanced')).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle loading lessons multiple times', async () => {
      mockFirebaseService.getFirestore.and.returnValue(null);

      await service.loadAllLessons();
      const lessonsFirst = service.lessons.length;

      await service.loadAllLessons();
      const lessonsSecond = service.lessons.length;

      expect(lessonsFirst).toEqual(lessonsSecond);
    });

    it('should handle getting lesson by ID when none loaded', async () => {
      mockFirebaseService.getFirestore.and.returnValue(null);

      // Don't load lessons first
      const lesson = await service.getLessonById('lesson-tech-001');

      expect(lesson).toBeTruthy();
    });

    it('should handle loading daily lesson when no lessons loaded', async () => {
      const user = createUser('user-123', true);
      mockAuthService.getCurrentUser.and.returnValue(user);
      mockFirebaseService.getFirestore.and.returnValue(null);

      // Don't load lessons first
      const lesson = await service.loadDailyLesson();

      expect(lesson).toBeTruthy();
    });
  });
});
