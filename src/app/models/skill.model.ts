/**
 * Skill Model
 * Represents a technical skill that users can learn
 */

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  difficulty: SkillDifficulty;
  relatedTopics: string[];
  icon?: string;
  color?: string;
  tags?: string[];
  sortOrder?: number;
  usageCount: number; // Number of times this skill has been accessed/used
  isActive: boolean; // Whether this skill is currently active/visible
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Skill categories organized by DevOps/tech domains
 */
export enum SkillCategory {
  GENERAL_CONCEPTS = 'General Concepts',
  OPERATING_SYSTEMS = 'Operating Systems',
  PROGRAMMING_LANGUAGES = 'Programming Languages',
  WEB_TECHNOLOGIES = 'Web Technologies',
  CI_CD_TOOLS = 'CI/CD Tools',
  CLOUD_PLATFORMS = 'Cloud Platforms',
  INFRASTRUCTURE_AS_CODE = 'Infrastructure as Code',
  CONTAINERIZATION = 'Containerization & Orchestration',
  SECURITY = 'Security',
  MONITORING_LOGGING = 'Monitoring & Logging',
}

/**
 * Skill difficulty levels
 */
export enum SkillDifficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

/**
 * Skill category display configuration
 */
export const SKILL_CATEGORIES_CONFIG: Record<SkillCategory, { label: string; icon?: string; color?: string }> = {
  [SkillCategory.GENERAL_CONCEPTS]: {
    label: 'General Concepts',
    icon: 'bulb-outline',
    color: '#6366f1',
  },
  [SkillCategory.OPERATING_SYSTEMS]: {
    label: 'Operating Systems',
    icon: 'desktop-outline',
    color: '#8b5cf6',
  },
  [SkillCategory.PROGRAMMING_LANGUAGES]: {
    label: 'Programming Languages',
    icon: 'code-slash-outline',
    color: '#ec4899',
  },
  [SkillCategory.WEB_TECHNOLOGIES]: {
    label: 'Web Technologies',
    icon: 'globe-outline',
    color: '#f59e0b',
  },
  [SkillCategory.CI_CD_TOOLS]: {
    label: 'CI/CD Tools',
    icon: 'git-merge-outline',
    color: '#10b981',
  },
  [SkillCategory.CLOUD_PLATFORMS]: {
    label: 'Cloud Platforms',
    icon: 'cloud-outline',
    color: '#06b6d4',
  },
  [SkillCategory.INFRASTRUCTURE_AS_CODE]: {
    label: 'Infrastructure as Code',
    icon: 'layers-outline',
    color: '#3b82f6',
  },
  [SkillCategory.CONTAINERIZATION]: {
    label: 'Containerization & Orchestration',
    icon: 'cube-outline',
    color: '#14b8a6',
  },
  [SkillCategory.SECURITY]: {
    label: 'Security',
    icon: 'shield-checkmark-outline',
    color: '#ef4444',
  },
  [SkillCategory.MONITORING_LOGGING]: {
    label: 'Monitoring & Logging',
    icon: 'analytics-outline',
    color: '#f97316',
  },
};

/**
 * Create a new skill object
 */
export function createSkill(
  id: string,
  name: string,
  description: string,
  category: SkillCategory,
  difficulty: SkillDifficulty = SkillDifficulty.BEGINNER,
  relatedTopics: string[] = []
): Skill {
  const now = new Date();
  return {
    id,
    name,
    description,
    category,
    difficulty,
    relatedTopics,
    usageCount: 0,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    ...SKILL_CATEGORIES_CONFIG[category],
  };
}

/**
 * Get category display label
 */
export function getCategoryLabel(category: SkillCategory): string {
  return SKILL_CATEGORIES_CONFIG[category]?.label || category;
}

/**
 * Get category icon
 */
export function getCategoryIcon(category: SkillCategory): string | undefined {
  return SKILL_CATEGORIES_CONFIG[category]?.icon;
}

/**
 * Get category color
 */
export function getCategoryColor(category: SkillCategory): string | undefined {
  return SKILL_CATEGORIES_CONFIG[category]?.color;
}

/**
 * Sort skills by name
 */
export function sortSkillsByName(skills: Skill[]): Skill[] {
  return [...skills].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Group skills by category
 */
export function groupSkillsByCategory(skills: Skill[]): Map<SkillCategory, Skill[]> {
  const grouped = new Map<SkillCategory, Skill[]>();

  skills.forEach((skill) => {
    if (!grouped.has(skill.category)) {
      grouped.set(skill.category, []);
    }
    grouped.get(skill.category)!.push(skill);
  });

  return grouped;
}

/**
 * Filter skills by difficulty level
 */
export function filterSkillsByDifficulty(skills: Skill[], difficulty: SkillDifficulty): Skill[] {
  return skills.filter((skill) => skill.difficulty === difficulty);
}
