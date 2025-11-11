/**
 * Topic Model
 * Represents a skill/knowledge topic that users can learn
 *
 * Note: category field stores SkillCategory string values from the database,
 * not TopicCategory enum values. This aligns with how topics are generated
 * from skill categories.
 */
export interface Topic {
  id: string;
  name: string;
  description: string;
  category: string; // Stores SkillCategory values from skill.model
  icon?: string;
  color?: string;
  lessonsCount: number; // Number of lessons/skills in this topic
  isActive: boolean; // Whether topic is currently active
  sortOrder: number; // Display order for topics
  isFeatured: boolean; // Whether topic is featured on homepage
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
  category: string,
  lessonsCount: number = 0,
  icon?: string,
  color?: string
): Topic {
  const now = new Date();
  return {
    id,
    name,
    description,
    category,
    icon,
    color,
    lessonsCount,
    isActive: true,
    sortOrder: 0,
    isFeatured: false,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Get category display label
 * Note: Since topics now use SkillCategory strings, this returns the category as-is
 */
export function getCategoryLabel(category: string): string {
  return category;
}

/**
 * Sort topics by sortOrder, then by name
 */
export function sortTopics(topics: Topic[]): Topic[] {
  return [...topics].sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) {
      return a.sortOrder - b.sortOrder;
    }
    return a.name.localeCompare(b.name);
  });
}

/**
 * Sort topics by name only
 */
export function sortTopicsByName(topics: Topic[]): Topic[] {
  return [...topics].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Group topics by category
 */
export function groupTopicsByCategory(topics: Topic[]): Map<string, Topic[]> {
  const grouped = new Map<string, Topic[]>();

  topics.forEach((topic) => {
    if (!grouped.has(topic.category)) {
      grouped.set(topic.category, []);
    }
    grouped.get(topic.category)!.push(topic);
  });

  return grouped;
}

/**
 * Filter active topics only
 */
export function filterActiveTopics(topics: Topic[]): Topic[] {
  return topics.filter((topic) => topic.isActive);
}

/**
 * Filter featured topics only
 */
export function filterFeaturedTopics(topics: Topic[]): Topic[] {
  return topics.filter((topic) => topic.isFeatured);
}
