"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLesson = createLesson;
exports.createUserLessonProgress = createUserLessonProgress;
exports.markLessonComplete = markLessonComplete;
exports.getDifficultyColor = getDifficultyColor;
exports.getDifficultyLabel = getDifficultyLabel;
exports.getCategoryLabel = getCategoryLabel;
exports.getCategoryIcon = getCategoryIcon;
/**
 * Create a new lesson object with default values
 */
function createLesson(id, title, topicId, category, difficulty = 'beginner', xpReward = 10) {
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
function createUserLessonProgress(userId, lessonId, xpEarned = 0) {
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
function markLessonComplete(progress, xpEarned) {
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
function getDifficultyColor(difficulty) {
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
function getDifficultyLabel(difficulty) {
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
function getCategoryLabel(category) {
    const labels = {
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
function getCategoryIcon(category) {
    const icons = {
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
//# sourceMappingURL=lesson.model.js.map