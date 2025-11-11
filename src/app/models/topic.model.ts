/**
 * Topic Model
 * Represents a skill/knowledge topic that users can learn
 */
export interface Topic {
  id: string;
  name: string;
  description: string;
  category: TopicCategory;
  icon?: string;
  color?: string;
  difficulty: DifficultyLevel;
  lessonCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Topic categories for organization
 */
export enum TopicCategory {
  PERSONAL_DEVELOPMENT = 'personal-development',
  TECHNOLOGY = 'technology',
  BUSINESS = 'business',
  HEALTH = 'health',
  SCIENCE = 'science',
  LANGUAGE = 'language',
  CREATIVITY = 'creativity',
  PRODUCTIVITY = 'productivity',
  FINANCE = 'finance',
  OTHER = 'other',
}

/**
 * Difficulty levels for topics
 */
export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

/**
 * Topic category display information
 */
export const TOPIC_CATEGORIES_CONFIG: Record<TopicCategory, { label: string; icon?: string; color?: string }> = {
  [TopicCategory.PERSONAL_DEVELOPMENT]: {
    label: 'Personal Development',
    icon: 'person',
    color: '#8B5FBF',
  },
  [TopicCategory.TECHNOLOGY]: {
    label: 'Technology',
    icon: 'code',
    color: '#007AFF',
  },
  [TopicCategory.BUSINESS]: {
    label: 'Business',
    icon: 'briefcase',
    color: '#34C759',
  },
  [TopicCategory.HEALTH]: {
    label: 'Health',
    icon: 'heart',
    color: '#FF3B30',
  },
  [TopicCategory.SCIENCE]: {
    label: 'Science',
    icon: 'flask',
    color: '#FF9500',
  },
  [TopicCategory.LANGUAGE]: {
    label: 'Language',
    icon: 'language',
    color: '#5AC8FA',
  },
  [TopicCategory.CREATIVITY]: {
    label: 'Creativity',
    icon: 'brush',
    color: '#FF2D55',
  },
  [TopicCategory.PRODUCTIVITY]: {
    label: 'Productivity',
    icon: 'checkmark-circle',
    color: '#FFCC00',
  },
  [TopicCategory.FINANCE]: {
    label: 'Finance',
    icon: 'cash',
    color: '#00B894',
  },
  [TopicCategory.OTHER]: {
    label: 'Other',
    icon: 'more-vertical',
    color: '#95A5A6',
  },
};

/**
 * Create a new topic object
 */
export function createTopic(
  id: string,
  name: string,
  description: string,
  category: TopicCategory,
  difficulty: DifficultyLevel = DifficultyLevel.BEGINNER,
  lessonCount: number = 0
): Topic {
  const now = new Date();
  return {
    id,
    name,
    description,
    category,
    difficulty,
    lessonCount,
    createdAt: now,
    updatedAt: now,
    ...TOPIC_CATEGORIES_CONFIG[category],
  };
}

/**
 * Get category display label
 */
export function getCategoryLabel(category: TopicCategory): string {
  return TOPIC_CATEGORIES_CONFIG[category]?.label || category;
}

/**
 * Get category icon
 */
export function getCategoryIcon(category: TopicCategory): string | undefined {
  return TOPIC_CATEGORIES_CONFIG[category]?.icon;
}

/**
 * Get category color
 */
export function getCategoryColor(category: TopicCategory): string | undefined {
  return TOPIC_CATEGORIES_CONFIG[category]?.color;
}

/**
 * Sort topics by name
 */
export function sortTopicsByName(topics: Topic[]): Topic[] {
  return [...topics].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Group topics by category
 */
export function groupTopicsByCategory(topics: Topic[]): Map<TopicCategory, Topic[]> {
  const grouped = new Map<TopicCategory, Topic[]>();

  topics.forEach((topic) => {
    if (!grouped.has(topic.category)) {
      grouped.set(topic.category, []);
    }
    grouped.get(topic.category)!.push(topic);
  });

  return grouped;
}

/**
 * Filter topics by difficulty level
 */
export function filterTopicsByDifficulty(topics: Topic[], difficulty: DifficultyLevel): Topic[] {
  return topics.filter((topic) => topic.difficulty === difficulty);
}
