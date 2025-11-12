/**
 * Lesson Model
 * Represents a daily lesson/skill that users learn
 */
export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string; // Main lesson content (markdown/HTML)

  // Relationships
  skillId: string; // Reference to Skill/Topic
  topicId: string; // Reference to Topic
  category: string; // From SkillCategory

  // Metadata
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number; // e.g., 1-2 minutes
  xpReward: number; // XP earned on completion (e.g., 10-20)

  // Content structure
  keyPoints?: string[]; // Bullet points of key takeaways
  examples?: string[]; // Code examples or use cases

  // Status
  isActive: boolean;
  sortOrder?: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User Lesson Progress
 * Tracks individual user's progress on lessons
 */
export interface UserLessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completedAt?: Date;
  xpEarned: number;
  timeSpentSeconds?: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create a new lesson object with default values
 */
export function createLesson(
  id: string,
  title: string,
  topicId: string,
  category: string,
  difficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner',
  xpReward: number = 10
): Lesson {
  const now = new Date();
  return {
    id,
    title,
    description: '',
    content: '',
    skillId: id,
    topicId,
    category,
    difficulty,
    estimatedMinutes: 1,
    xpReward,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Create a new user lesson progress object
 */
export function createUserLessonProgress(
  userId: string,
  lessonId: string,
  xpEarned: number = 0
): UserLessonProgress {
  const now = new Date();
  return {
    id: `${userId}_${lessonId}`,
    userId,
    lessonId,
    status: 'not_started',
    xpEarned,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Mark a lesson as completed
 */
export function markLessonComplete(
  progress: UserLessonProgress,
  xpEarned: number
): UserLessonProgress {
  return {
    ...progress,
    status: 'completed',
    completedAt: new Date(),
    xpEarned,
    updatedAt: new Date(),
  };
}

/**
 * Get difficulty color for display
 */
export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'beginner':
      return '#10b981'; // green
    case 'intermediate':
      return '#f59e0b'; // amber
    case 'advanced':
      return '#ef4444'; // red
    default:
      return '#6b7280'; // gray
  }
}

/**
 * Get difficulty label with icon
 */
export function getDifficultyLabel(difficulty: string): string {
  switch (difficulty) {
    case 'beginner':
      return 'Beginner';
    case 'intermediate':
      return 'Intermediate';
    case 'advanced':
      return 'Advanced';
    default:
      return 'Unknown';
  }
}

/**
 * Get category label for display
 */
export function getCategoryLabel(category: string): string {
  const labels: { [key: string]: string } = {
    PERSONAL_DEVELOPMENT: 'Personal Development',
    TECHNOLOGY: 'Technology',
    BUSINESS: 'Business',
    HEALTH: 'Health',
    SCIENCE: 'Science',
    LANGUAGE: 'Language',
    CREATIVITY: 'Creativity',
    PRODUCTIVITY: 'Productivity',
    FINANCE: 'Finance',
    OTHER: 'Other',
  };
  return labels[category] || category;
}

/**
 * Get category icon
 */
export function getCategoryIcon(category: string): string {
  const icons: { [key: string]: string } = {
    PERSONAL_DEVELOPMENT: 'person',
    TECHNOLOGY: 'logo-github',
    BUSINESS: 'briefcase',
    HEALTH: 'fitness',
    SCIENCE: 'flask',
    LANGUAGE: 'chatbubbles',
    CREATIVITY: 'brush',
    PRODUCTIVITY: 'checkmark-circle',
    FINANCE: 'cash',
    OTHER: 'help-circle',
  };
  return icons[category] || 'help-circle';
}
