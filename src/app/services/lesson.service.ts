import { Injectable, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { AuthService } from './auth.service';
import { Lesson, UserLessonProgress, createUserLessonProgress, markLessonComplete } from '../models/lesson.model';
import {
  Firestore,
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { getAllMockLessons, getMockLessonById, getDailyMockLesson } from '../data/mock-lessons';

/**
 * Lesson Service
 * Manages lessons and user lesson progress
 */
@Injectable({
  providedIn: 'root',
})
export class LessonService {
  private firebaseService = inject(FirebaseService);
  private authService = inject(AuthService);

  // State management
  private lessonsSubject = new BehaviorSubject<Lesson[]>([]);
  private dailyLessonSubject = new BehaviorSubject<Lesson | null>(null);
  private userProgressSubject = new BehaviorSubject<UserLessonProgress[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  // Observables
  lessons$: Observable<Lesson[]> = this.lessonsSubject.asObservable();
  dailyLesson$: Observable<Lesson | null> = this.dailyLessonSubject.asObservable();
  userProgress$: Observable<UserLessonProgress[]> = this.userProgressSubject.asObservable();
  loading$: Observable<boolean> = this.loadingSubject.asObservable();
  error$: Observable<string | null> = this.errorSubject.asObservable();

  /**
   * Get lessons synchronously
   */
  get lessons(): Lesson[] {
    return this.lessonsSubject.value;
  }

  /**
   * Get daily lesson synchronously
   */
  get dailyLesson(): Lesson | null {
    return this.dailyLessonSubject.value;
  }

  /**
   * Get user progress synchronously
   */
  get userProgress(): UserLessonProgress[] {
    return this.userProgressSubject.value;
  }

  /**
   * Load all lessons from Firestore (or mock data if not available)
   */
  async loadAllLessons(): Promise<void> {
    try {
      this.loadingSubject.next(true);
      this.errorSubject.next(null);

      const firestore = this.firebaseService.getFirestore();
      if (!firestore) {
        // Use mock lessons if Firestore not available
        this.lessonsSubject.next(getAllMockLessons());
        console.log('[LessonService] Using mock lessons (Firestore not available)');
        return;
      }

      const lessonsRef = collection(firestore, 'lessons');
      const lessonsSnapshot = await getDocs(lessonsRef);

      const lessons: Lesson[] = [];
      lessonsSnapshot.forEach((doc) => {
        const data = doc.data() as any;
        const lesson: Lesson = {
          ...data,
          id: doc.id,
          createdAt: data['createdAt']?.toDate?.() || new Date(data['createdAt']),
          updatedAt: data['updatedAt']?.toDate?.() || new Date(data['updatedAt']),
        };
        lessons.push(lesson);
      });

      // If no lessons in Firestore, use mock data
      if (lessons.length === 0) {
        this.lessonsSubject.next(getAllMockLessons());
        console.log('[LessonService] No lessons in Firestore, using mock data');
      } else {
        this.lessonsSubject.next(lessons);
        console.log('[LessonService] Loaded', lessons.length, 'lessons from Firestore');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load lessons';
      this.errorSubject.next(errorMessage);
      // Fall back to mock data
      this.lessonsSubject.next(getAllMockLessons());
      console.error('[LessonService] Error loading lessons:', error);
    } finally {
      this.loadingSubject.next(false);
    }
  }

  /**
   * Load daily lesson for user
   * Selects a lesson based on user's selected topics
   */
  async loadDailyLesson(): Promise<Lesson | null> {
    try {
      const user = this.authService.getCurrentUser();
      if (!user) {
        console.warn('[LessonService] No user logged in');
        return null;
      }

      // Check if we already have a cached daily lesson from today
      if (user.dailyLessonId) {
        const lastCompleted = user.lastLessonCompletedDate
          ? new Date(user.lastLessonCompletedDate).toDateString()
          : null;
        const today = new Date().toDateString();

        // If cached lesson is from today, use it
        if (lastCompleted !== today) {
          const cachedLesson = this.selectDailyLesson(user);
          if (cachedLesson) {
            this.dailyLessonSubject.next(cachedLesson);
            return cachedLesson;
          }
        }
      }

      // Select new daily lesson
      const dailyLesson = this.selectDailyLesson(user);
      this.dailyLessonSubject.next(dailyLesson);
      return dailyLesson;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load daily lesson';
      this.errorSubject.next(errorMessage);
      console.error('[LessonService] Error loading daily lesson:', error);
      return null;
    }
  }

  /**
   * Get lesson by ID
   */
  async getLessonById(id: string): Promise<Lesson | null> {
    try {
      // First check in loaded lessons
      const lesson = this.lessons.find((l) => l.id === id);
      if (lesson) {
        return lesson;
      }

      // Try to fetch from Firestore
      const firestore = this.firebaseService.getFirestore();
      if (!firestore) {
        // Use mock data
        return getMockLessonById(id) || null;
      }

      const lessonRef = doc(firestore, 'lessons', id);
      const lessonSnap = await getDoc(lessonRef);

      if (lessonSnap.exists()) {
        const data = lessonSnap.data() as any;
        const lesson: Lesson = {
          ...data,
          id: lessonSnap.id,
          createdAt: data['createdAt']?.toDate?.() || new Date(data['createdAt']),
          updatedAt: data['updatedAt']?.toDate?.() || new Date(data['updatedAt']),
        };
        return lesson;
      }

      // Fallback to mock data
      return getMockLessonById(id) || null;
    } catch (error) {
      console.error('[LessonService] Error getting lesson by ID:', error);
      return getMockLessonById(id) || null;
    }
  }

  /**
   * Mark lesson as completed and update user stats
   */
  async markLessonAsComplete(lessonId: string, xpEarned: number): Promise<void> {
    try {
      const user = this.authService.getCurrentUser();
      if (!user) {
        throw new Error('No user logged in');
      }

      const firestore = this.firebaseService.getFirestore();
      if (!firestore) {
        throw new Error('Firestore not initialized');
      }

      // Create user progress record
      const progressId = `${user.id}_${lessonId}`;
      const progressRef = doc(firestore, 'user_lesson_progress', progressId);

      // Check if lesson was already completed today
      const today = new Date().toDateString();
      const lastCompleted = user.lastLessonCompletedDate
        ? new Date(user.lastLessonCompletedDate).toDateString()
        : null;
      const isConsecutiveDay = lastCompleted === today ? false : true;

      // Save progress
      await setDoc(
        progressRef,
        {
          userId: user.id,
          lessonId,
          status: 'completed',
          completedAt: serverTimestamp(),
          xpEarned,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      // Update user stats using the helper function from user model
      const { updateUserStatsAfterLesson } = await import('../models/user.model');
      const updatedUser = updateUserStatsAfterLesson(user, xpEarned, isConsecutiveDay);
      updatedUser.lastLessonCompletedDate = new Date();
      updatedUser.dailyLessonId = lessonId;

      // Update user profile in Firestore
      await this.authService.updateUserProfile({
        xp: updatedUser.xp,
        level: updatedUser.level,
        currentStreak: updatedUser.currentStreak,
        longestStreak: updatedUser.longestStreak,
        totalLessonsCompleted: updatedUser.totalLessonsCompleted,
        lastLessonCompletedDate: updatedUser.lastLessonCompletedDate,
        dailyLessonId: lessonId,
      });

      // Update local state
      const updatedProgress = markLessonComplete(
        createUserLessonProgress(user.id, lessonId, xpEarned),
        xpEarned
      );
      const currentProgress = this.userProgressSubject.value;
      this.userProgressSubject.next([...currentProgress, updatedProgress]);

      console.log('[LessonService] Lesson completed:', {
        lessonId,
        xpEarned,
        newLevel: updatedUser.level,
        streak: updatedUser.currentStreak,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to complete lesson';
      this.errorSubject.next(errorMessage);
      console.error('[LessonService] Error marking lesson complete:', error);
      throw error;
    }
  }

  /**
   * Get user's completed lessons
   */
  async getUserCompletedLessons(userId: string): Promise<UserLessonProgress[]> {
    try {
      const firestore = this.firebaseService.getFirestore();
      if (!firestore) {
        return [];
      }

      const progressRef = collection(firestore, 'user_lesson_progress');
      const q = query(progressRef, where('userId', '==', userId), where('status', '==', 'completed'));
      const progressSnapshot = await getDocs(q);

      const progress: UserLessonProgress[] = [];
      progressSnapshot.forEach((doc) => {
        const data = doc.data() as any;
        const p: UserLessonProgress = {
          ...data,
          id: doc.id,
          createdAt: data['createdAt']?.toDate?.() || new Date(data['createdAt']),
          updatedAt: data['updatedAt']?.toDate?.() || new Date(data['updatedAt']),
          completedAt: data['completedAt']?.toDate?.() || data['completedAt'],
        };
        progress.push(p);
      });

      this.userProgressSubject.next(progress);
      return progress;
    } catch (error) {
      console.error('[LessonService] Error getting user completed lessons:', error);
      return [];
    }
  }

  /**
   * Select daily lesson based on user's selected topics
   * Simple algorithm: rotate through lessons matching user's topics
   * Fallback: use mock daily lesson if no user topics selected
   */
  private selectDailyLesson(user: any): Lesson | null {
    try {
      // Get all available lessons
      const allLessons = this.lessons.length > 0 ? this.lessons : getAllMockLessons();

      // If user has selected topics, filter by those
      let availableLessons = allLessons;
      if (user.selectedTopics && user.selectedTopics.length > 0) {
        // For simplicity, just use the first selected topic's category
        // In future, could map topics to lesson categories more intelligently
        const userTopics = user.selectedTopics;
        availableLessons = allLessons.filter(
          (l) =>
            l.category === 'TECHNOLOGY' || // Default to tech for now
            userTopics.some((t: any) => l.topicId === t)
        );
      }

      // If no lessons available, fall back to all lessons
      if (availableLessons.length === 0) {
        availableLessons = allLessons;
      }

      // Use simple rotation: select based on day of year
      const dayOfYear = this.getDayOfYear(new Date());
      const index = dayOfYear % availableLessons.length;
      return availableLessons[index];
    } catch (error) {
      console.error('[LessonService] Error selecting daily lesson:', error);
      // Fallback to random daily lesson from mock data
      return getDailyMockLesson();
    }
  }

  /**
   * Get day of year (1-365/366)
   */
  private getDayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }
}
