/**
 * User Model
 * Represents a user in the OneMinuteSkill application
 */
export interface User {
  id: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Profile data
  bio?: string;
  onboardingComplete: boolean;
  selectedTopics: string[];

  // Gamification
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  totalLessonsCompleted: number;

  // Preferences
  notificationTime?: string; // HH:mm format
  notificationsEnabled: boolean;
  theme?: 'light' | 'dark' | 'system';
  language?: string;

  // Lesson tracking
  lastLessonCompletedDate?: Date; // Date of last lesson completion
  dailyLessonId?: string; // ID of today's lesson (for caching)
}

/**
 * Create a new user object with default values
 */
export function createUser(id: string, isAnonymous: boolean = true): User {
  const now = new Date();
  return {
    id,
    isAnonymous,
    createdAt: now,
    updatedAt: now,
    onboardingComplete: false,
    selectedTopics: [],
    xp: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    totalLessonsCompleted: 0,
    notificationsEnabled: true,
  };
}

/**
 * Calculate user level based on XP
 * Level progression: every 100 XP = 1 level
 */
export function calculateLevel(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

/**
 * Calculate XP needed for next level
 */
export function calculateXpForNextLevel(currentXp: number): number {
  const currentLevel = calculateLevel(currentXp);
  const xpForCurrentLevel = (currentLevel - 1) * 100;
  const xpNeeded = currentLevel * 100;
  return xpNeeded - currentXp;
}

/**
 * Update user stats after completing a lesson
 */
export function updateUserStatsAfterLesson(
  user: User,
  lessonXp: number,
  isConsecutiveDay: boolean
): User {
  const updatedUser = { ...user };

  // Add XP
  updatedUser.xp += lessonXp;

  // Update level
  updatedUser.level = calculateLevel(updatedUser.xp);

  // Update streak
  if (isConsecutiveDay) {
    updatedUser.currentStreak += 1;
  } else {
    updatedUser.currentStreak = 1;
  }

  // Update longest streak
  if (updatedUser.currentStreak > updatedUser.longestStreak) {
    updatedUser.longestStreak = updatedUser.currentStreak;
  }

  // Update lesson count
  updatedUser.totalLessonsCompleted += 1;

  // Update timestamp
  updatedUser.updatedAt = new Date();

  return updatedUser;
}
