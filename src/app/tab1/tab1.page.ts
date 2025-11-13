import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LessonService } from '../services/lesson.service';
import { AuthService } from '../services/auth.service';
import { Lesson } from '../models/lesson.model';
import { User } from '../models/user.model';
import { getDifficultyColor, getDifficultyLabel, getCategoryLabel, getCategoryIcon } from '../models/lesson.model';

/**
 * Tab1Page (Home Page)
 * Displays daily lesson and user stats for learning
 */
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit, OnDestroy {
  private lessonService = inject(LessonService);
  private authService = inject(AuthService);
  private destroy$ = new Subject<void>();

  // Data
  currentUser: User | null = null;
  dailyLesson: Lesson | null = null;
  loading = false;
  error: string | null = null;
  isCompletingLesson = false;
  lessonCompleted = false;
  completionMessage = '';

  /**
   * Get difficulty color for display
   */
  getDifficultyColor(difficulty: string): string {
    return getDifficultyColor(difficulty);
  }

  /**
   * Get difficulty label
   */
  getDifficultyLabel(difficulty: string): string {
    return getDifficultyLabel(difficulty);
  }

  /**
   * Get category label
   */
  getCategoryLabel(category: string): string {
    return getCategoryLabel(category);
  }

  /**
   * Get category icon
   */
  getCategoryIcon(category: string): string {
    return getCategoryIcon(category);
  }

  ngOnInit(): void {
    this.loadPageData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load user data and daily lesson
   */
  private async loadPageData(): Promise<void> {
    try {
      this.loading = true;
      this.error = null;

      // Subscribe to user updates
      this.authService.currentUser$
        .pipe(takeUntil(this.destroy$))
        .subscribe((user) => {
          this.currentUser = user;
        });

      // Load lessons
      await this.lessonService.loadAllLessons();

      // Load and display daily lesson
      const lesson = await this.lessonService.loadDailyLesson();
      if (lesson) {
        this.dailyLesson = lesson;
      } else {
        this.error = 'No lesson available today. Please check back later.';
      }
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to load lesson';
      console.error('[Tab1Page] Error loading data:', error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Complete the daily lesson
   */
  async completeLesson(): Promise<void> {
    if (!this.currentUser || !this.dailyLesson || this.isCompletingLesson) {
      return;
    }

    try {
      this.isCompletingLesson = true;
      this.error = null;

      // Mark lesson as complete
      await this.lessonService.markLessonAsComplete(this.dailyLesson.id, this.dailyLesson.xpReward);

      // Show success message
      this.lessonCompleted = true;
      this.completionMessage = `🎉 Great job! You earned ${this.dailyLesson.xpReward} XP!`;

      // Log completion
      console.log('[Tab1Page] Lesson completed:', {
        lessonId: this.dailyLesson.id,
        xpEarned: this.dailyLesson.xpReward,
      });

      // Reset completion state after 3 seconds
      setTimeout(() => {
        this.lessonCompleted = false;
      }, 3000);
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to complete lesson';
      console.error('[Tab1Page] Error completing lesson:', error);
    } finally {
      this.isCompletingLesson = false;
    }
  }

  /**
   * Check if lesson can be completed (user exists, lesson exists)
   */
  get canCompleteLesson(): boolean {
    return !!(this.currentUser && this.dailyLesson && !this.isCompletingLesson && !this.lessonCompleted);
  }

  /**
   * Reload page data
   */
  async reloadData(): Promise<void> {
    this.lessonCompleted = false;
    await this.loadPageData();
  }
}
