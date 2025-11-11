"use strict";
/**
 * Skill Model
 * Represents a technical skill that users can learn
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SKILL_CATEGORIES_CONFIG = exports.SkillDifficulty = exports.SkillCategory = void 0;
exports.createSkill = createSkill;
exports.getCategoryLabel = getCategoryLabel;
exports.getCategoryIcon = getCategoryIcon;
exports.getCategoryColor = getCategoryColor;
exports.sortSkillsByName = sortSkillsByName;
exports.groupSkillsByCategory = groupSkillsByCategory;
exports.filterSkillsByDifficulty = filterSkillsByDifficulty;
/**
 * Skill categories organized by DevOps/tech domains
 */
var SkillCategory;
(function (SkillCategory) {
    SkillCategory["GENERAL_CONCEPTS"] = "General Concepts";
    SkillCategory["OPERATING_SYSTEMS"] = "Operating Systems";
    SkillCategory["PROGRAMMING_LANGUAGES"] = "Programming Languages";
    SkillCategory["WEB_TECHNOLOGIES"] = "Web Technologies";
    SkillCategory["CI_CD_TOOLS"] = "CI/CD Tools";
    SkillCategory["CLOUD_PLATFORMS"] = "Cloud Platforms";
    SkillCategory["INFRASTRUCTURE_AS_CODE"] = "Infrastructure as Code";
    SkillCategory["CONTAINERIZATION"] = "Containerization & Orchestration";
    SkillCategory["SECURITY"] = "Security";
    SkillCategory["MONITORING_LOGGING"] = "Monitoring & Logging";
})(SkillCategory || (exports.SkillCategory = SkillCategory = {}));
/**
 * Skill difficulty levels
 */
var SkillDifficulty;
(function (SkillDifficulty) {
    SkillDifficulty["BEGINNER"] = "beginner";
    SkillDifficulty["INTERMEDIATE"] = "intermediate";
    SkillDifficulty["ADVANCED"] = "advanced";
})(SkillDifficulty || (exports.SkillDifficulty = SkillDifficulty = {}));
/**
 * Skill category display configuration
 */
exports.SKILL_CATEGORIES_CONFIG = {
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
function createSkill(id, name, description, category, difficulty = SkillDifficulty.BEGINNER, relatedTopics = []) {
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
        ...exports.SKILL_CATEGORIES_CONFIG[category],
    };
}
/**
 * Get category display label
 */
function getCategoryLabel(category) {
    return exports.SKILL_CATEGORIES_CONFIG[category]?.label || category;
}
/**
 * Get category icon
 */
function getCategoryIcon(category) {
    return exports.SKILL_CATEGORIES_CONFIG[category]?.icon;
}
/**
 * Get category color
 */
function getCategoryColor(category) {
    return exports.SKILL_CATEGORIES_CONFIG[category]?.color;
}
/**
 * Sort skills by name
 */
function sortSkillsByName(skills) {
    return [...skills].sort((a, b) => a.name.localeCompare(b.name));
}
/**
 * Group skills by category
 */
function groupSkillsByCategory(skills) {
    const grouped = new Map();
    skills.forEach((skill) => {
        if (!grouped.has(skill.category)) {
            grouped.set(skill.category, []);
        }
        grouped.get(skill.category).push(skill);
    });
    return grouped;
}
/**
 * Filter skills by difficulty level
 */
function filterSkillsByDifficulty(skills, difficulty) {
    return skills.filter((skill) => skill.difficulty === difficulty);
}
