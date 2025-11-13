import { Injectable } from '@angular/core';

/**
 * GamificationService
 * Handles all gamification calculations and utilities
 * - Level progression (100 XP per level)
 * - XP calculations
 * - Streak management
 * - Progress tracking
 */
@Injectable({
  providedIn: 'root',
})
export class GamificationService {
  // XP per level (100 XP to advance 1 level)
  private readonly XP_PER_LEVEL = 100;

  constructor() {}

  /**
   * Calculate user level based on XP
   * Level progression: every 100 XP = 1 level
   * Level 1 at 0 XP, Level 2 at 100 XP, etc.
   */
  calculateLevel(xp: number): number {
    return Math.floor(xp / this.XP_PER_LEVEL) + 1;
  }

  /**
   * Calculate XP needed for next level
   * @param currentXp Current total XP
   * @returns XP remaining to next level
   */
  calculateXpForNextLevel(currentXp: number): number {
    const currentLevel = this.calculateLevel(currentXp);
    const xpForCurrentLevel = (currentLevel - 1) * this.XP_PER_LEVEL;
    const xpNeededForNextLevel = currentLevel * this.XP_PER_LEVEL;
    return xpNeededForNextLevel - currentXp;
  }

  /**
   * Get detailed XP progress information
   * @param currentXp Current total XP
   * @returns Object with current XP towards level, needed, and progress percentage
   */
  getXPProgress(currentXp: number): {
    current: number;
    needed: number;
    percent: number;
  } {
    const currentLevel = this.calculateLevel(currentXp);
    const levelStartXp = (currentLevel - 1) * this.XP_PER_LEVEL;
    const levelEndXp = currentLevel * this.XP_PER_LEVEL;

    const currentProgress = currentXp - levelStartXp;
    const levelTotalXp = levelEndXp - levelStartXp;
    const percent = Math.round((currentProgress / levelTotalXp) * 100);

    return {
      current: currentProgress,
      needed: levelTotalXp,
      percent: Math.min(100, percent), // Cap at 100%
    };
  }

  /**
   * Get level progress text for display
   * @param currentXp Current total XP
   * @returns String like "50/100 XP to Level 3"
   */
  getLevelProgressText(currentXp: number): string {
    const currentLevel = this.calculateLevel(currentXp);
    const nextLevel = currentLevel + 1;
    const levelStartXp = (currentLevel - 1) * this.XP_PER_LEVEL;
    const currentProgress = currentXp - levelStartXp;
    const levelTotalXp = this.XP_PER_LEVEL;

    return `${currentProgress}/${levelTotalXp} XP to Level ${nextLevel}`;
  }

  /**
   * Check if user leveled up
   * @param oldXp XP before the action
   * @param newXp XP after the action
   * @returns true if user advanced to a new level
   */
  checkLevelUp(oldXp: number, newXp: number): boolean {
    const oldLevel = this.calculateLevel(oldXp);
    const newLevel = this.calculateLevel(newXp);
    return newLevel > oldLevel;
  }

  /**
   * Get the new level achieved
   * @param oldXp XP before the action
   * @param newXp XP after the action
   * @returns The new level number (returns 0 if no level up)
   */
  getNewLevel(oldXp: number, newXp: number): number {
    if (this.checkLevelUp(oldXp, newXp)) {
      return this.calculateLevel(newXp);
    }
    return 0;
  }

  /**
   * Get streak emoji based on streak count
   * More fire emojis for longer streaks
   * @param streak Current streak count
   * @returns Emoji string (🔥, 🔥🔥, 🔥🔥🔥)
   */
  getStreakEmoji(streak: number): string {
    if (streak >= 30) {
      return '🔥🔥🔥'; // Hot streak (30+ days)
    }
    if (streak >= 14) {
      return '🔥🔥'; // Good streak (2+ weeks)
    }
    if (streak >= 1) {
      return '🔥'; // Starting streak
    }
    return '';
  }

  /**
   * Format completion message with XP and streak info
   * @param xpEarned XP gained from this action
   * @param currentStreak Current streak count after update
   * @param leveledUp Whether user leveled up
   * @param newLevel New level if leveled up
   * @returns Formatted completion message
   */
  getCompletionMessage(
    xpEarned: number,
    currentStreak: number,
    leveledUp: boolean,
    newLevel?: number
  ): string {
    const streakEmoji = this.getStreakEmoji(currentStreak);
    const streakText =
      currentStreak > 0
        ? ` | Streak: ${currentStreak} ${streakEmoji}`
        : '';

    if (leveledUp && newLevel) {
      return `🎉 Level up! You're now Level ${newLevel}!`;
    }

    return `+${xpEarned} XP${streakText}`;
  }

  /**
   * Calculate total XP needed to reach a specific level
   * @param level Target level
   * @returns Total XP required
   */
  getTotalXpForLevel(level: number): number {
    return (level - 1) * this.XP_PER_LEVEL;
  }

  /**
   * Get XP needed from level start to target level
   * @param level Target level
   * @returns XP needed for that level (always 100)
   */
  getXpNeededForLevel(level: number): number {
    return this.XP_PER_LEVEL;
  }
}
