import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { GamificationService } from '../services/gamification.service';
import { User } from '../models/user.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit, OnDestroy {
  currentUser: User | null = null;
  loading = true;
  error: string | null = null;

  // Gamification stats
  xpProgress: { current: number; needed: number; percent: number } = { current: 0, needed: 100, percent: 0 };
  xpForNextLevel = 100;
  streakEmoji = '';
  levelMilestones = [1, 5, 10, 25, 50, 100]; // Milestone levels to display

  // Expose Math for template
  Math = Math;

  // Private
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    public gamificationService: GamificationService
  ) {}

  ngOnInit() {
    this.loadUserStats();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load user stats from auth service
   */
  private loadUserStats() {
    try {
      this.loading = true;
      this.authService.currentUser$
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (user) => {
            if (user) {
              this.currentUser = user;
              this.updateGamificationStats(user);
              this.loading = false;
            } else {
              this.error = 'No user found';
              this.loading = false;
            }
          },
          error: (err) => {
            console.error('[Tab2Page] Error loading user:', err);
            this.error = 'Failed to load user stats';
            this.loading = false;
          },
        });
    } catch (err) {
      console.error('[Tab2Page] Error in loadUserStats:', err);
      this.error = 'Failed to load user stats';
      this.loading = false;
    }
  }

  /**
   * Update gamification-related stats
   */
  private updateGamificationStats(user: User) {
    this.xpProgress = this.gamificationService.getXPProgress(user.xp);
    this.xpForNextLevel = this.gamificationService.calculateXpForNextLevel(user.xp);
    this.streakEmoji = this.gamificationService.getStreakEmoji(user.currentStreak);
  }

  /**
   * Check if milestone is reached
   */
  isMilestoneReached(level: number): boolean {
    return this.currentUser ? this.currentUser.level >= level : false;
  }

  /**
   * Get milestone class (reached or not)
   */
  getMilestoneClass(level: number): string {
    return this.isMilestoneReached(level) ? 'milestone-reached' : 'milestone-pending';
  }

  /**
   * Get total lessons needed to reach a level
   */
  getLessonsNeededForLevel(level: number): number {
    const totalXpForLevel = this.gamificationService.getTotalXpForLevel(level);
    const lessonsNeeded = Math.ceil(totalXpForLevel / 10); // Assuming 10 XP per lesson
    return lessonsNeeded;
  }

  /**
   * Get completed lessons
   */
  getCompletedLessons(): number {
    return this.currentUser?.totalLessonsCompleted || 0;
  }

  /**
   * Get total XP to next level progress percentage
   */
  getXpProgressPercent(): number {
    return this.xpProgress.percent;
  }

  /**
   * Calculate lessons to next level
   */
  getLessonsToNextLevel(): number {
    const xpToNextLevel = this.gamificationService.calculateXpForNextLevel(
      this.currentUser?.xp || 0
    );
    return Math.ceil(xpToNextLevel / 10); // Assuming 10 XP per lesson
  }
}
