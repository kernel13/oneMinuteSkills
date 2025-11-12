import {
  createLesson,
  createUserLessonProgress,
  markLessonComplete,
  getDifficultyColor,
  getDifficultyLabel,
  getCategoryLabel,
  getCategoryIcon,
  Lesson,
  UserLessonProgress,
} from './lesson.model';

describe('Lesson Model', () => {
  describe('createLesson', () => {
    it('should create a lesson with default values', () => {
      const lesson = createLesson('lesson-1', 'Introduction to Docker', 'topic-1', 'TECHNOLOGY');

      expect(lesson.id).toBe('lesson-1');
      expect(lesson.title).toBe('Introduction to Docker');
      expect(lesson.topicId).toBe('topic-1');
      expect(lesson.category).toBe('TECHNOLOGY');
      expect(lesson.difficulty).toBe('beginner');
      expect(lesson.xpReward).toBe(10);
      expect(lesson.estimatedMinutes).toBe(1);
      expect(lesson.isActive).toBe(true);
      expect(lesson.createdAt).toBeInstanceOf(Date);
      expect(lesson.updatedAt).toBeInstanceOf(Date);
    });

    it('should create a lesson with custom difficulty and XP', () => {
      const lesson = createLesson(
        'lesson-2',
        'Advanced Kubernetes',
        'topic-2',
        'TECHNOLOGY',
        'advanced',
        25
      );

      expect(lesson.difficulty).toBe('advanced');
      expect(lesson.xpReward).toBe(25);
    });

    it('should set skillId equal to lesson id', () => {
      const lesson = createLesson('lesson-3', 'Test Lesson', 'topic-1', 'TECHNOLOGY');

      expect(lesson.skillId).toBe(lesson.id);
    });

    it('should have empty content and description by default', () => {
      const lesson = createLesson('lesson-4', 'Test', 'topic-1', 'TECHNOLOGY');

      expect(lesson.content).toBe('');
      expect(lesson.description).toBe('');
    });

    it('should create different timestamps for each call', (done) => {
      const lesson1 = createLesson('lesson-5', 'Test 1', 'topic-1', 'TECHNOLOGY');
      setTimeout(() => {
        const lesson2 = createLesson('lesson-6', 'Test 2', 'topic-1', 'TECHNOLOGY');
        expect(lesson2.createdAt.getTime()).toBeGreaterThan(lesson1.createdAt.getTime());
        done();
      }, 10);
    });
  });

  describe('createUserLessonProgress', () => {
    it('should create progress with not_started status', () => {
      const progress = createUserLessonProgress('user-1', 'lesson-1');

      expect(progress.userId).toBe('user-1');
      expect(progress.lessonId).toBe('lesson-1');
      expect(progress.status).toBe('not_started');
      expect(progress.xpEarned).toBe(0);
      expect(progress.completedAt).toBeUndefined();
    });

    it('should create progress with custom XP', () => {
      const progress = createUserLessonProgress('user-1', 'lesson-1', 15);

      expect(progress.xpEarned).toBe(15);
    });

    it('should create ID from userId and lessonId', () => {
      const progress = createUserLessonProgress('user-123', 'lesson-456');

      expect(progress.id).toBe('user-123_lesson-456');
    });

    it('should set createdAt and updatedAt timestamps', () => {
      const before = new Date();
      const progress = createUserLessonProgress('user-1', 'lesson-1');
      const after = new Date();

      expect(progress.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(progress.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
      expect(progress.updatedAt).toEqual(progress.createdAt);
    });
  });

  describe('markLessonComplete', () => {
    it('should mark lesson as completed', () => {
      const progress = createUserLessonProgress('user-1', 'lesson-1', 10);
      const completed = markLessonComplete(progress, 10);

      expect(completed.status).toBe('completed');
      expect(completed.xpEarned).toBe(10);
      expect(completed.completedAt).toBeInstanceOf(Date);
    });

    it('should preserve user and lesson IDs', () => {
      const progress = createUserLessonProgress('user-123', 'lesson-456', 20);
      const completed = markLessonComplete(progress, 20);

      expect(completed.userId).toBe('user-123');
      expect(completed.lessonId).toBe('lesson-456');
    });

    it('should update updatedAt timestamp', () => {
      const progress = createUserLessonProgress('user-1', 'lesson-1');
      const before = new Date();
      const completed = markLessonComplete(progress, 10);
      const after = new Date();

      expect(completed.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(completed.updatedAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('should not mutate original progress', () => {
      const progress = createUserLessonProgress('user-1', 'lesson-1');
      const originalStatus = progress.status;

      markLessonComplete(progress, 10);

      expect(progress.status).toBe(originalStatus);
      expect(progress.completedAt).toBeUndefined();
    });

    it('should handle custom XP values', () => {
      const progress = createUserLessonProgress('user-1', 'lesson-1', 5);
      const completed = markLessonComplete(progress, 25);

      expect(completed.xpEarned).toBe(25);
    });
  });

  describe('getDifficultyColor', () => {
    it('should return green for beginner', () => {
      expect(getDifficultyColor('beginner')).toBe('#10b981');
    });

    it('should return amber for intermediate', () => {
      expect(getDifficultyColor('intermediate')).toBe('#f59e0b');
    });

    it('should return red for advanced', () => {
      expect(getDifficultyColor('advanced')).toBe('#ef4444');
    });

    it('should return gray for unknown difficulty', () => {
      expect(getDifficultyColor('unknown')).toBe('#6b7280');
    });
  });

  describe('getDifficultyLabel', () => {
    it('should return Beginner label', () => {
      expect(getDifficultyLabel('beginner')).toBe('Beginner');
    });

    it('should return Intermediate label', () => {
      expect(getDifficultyLabel('intermediate')).toBe('Intermediate');
    });

    it('should return Advanced label', () => {
      expect(getDifficultyLabel('advanced')).toBe('Advanced');
    });

    it('should return Unknown for unknown difficulty', () => {
      expect(getDifficultyLabel('unknown')).toBe('Unknown');
    });
  });

  describe('getCategoryLabel', () => {
    it('should return proper labels for all categories', () => {
      const categories = [
        ['PERSONAL_DEVELOPMENT', 'Personal Development'],
        ['TECHNOLOGY', 'Technology'],
        ['BUSINESS', 'Business'],
        ['HEALTH', 'Health'],
        ['SCIENCE', 'Science'],
        ['LANGUAGE', 'Language'],
        ['CREATIVITY', 'Creativity'],
        ['PRODUCTIVITY', 'Productivity'],
        ['FINANCE', 'Finance'],
        ['OTHER', 'Other'],
      ];

      categories.forEach(([category, label]) => {
        expect(getCategoryLabel(category)).toBe(label);
      });
    });

    it('should return category name for unknown category', () => {
      expect(getCategoryLabel('UNKNOWN_CATEGORY')).toBe('UNKNOWN_CATEGORY');
    });
  });

  describe('getCategoryIcon', () => {
    it('should return appropriate icons for categories', () => {
      expect(getCategoryIcon('PERSONAL_DEVELOPMENT')).toBe('person');
      expect(getCategoryIcon('TECHNOLOGY')).toBe('logo-github');
      expect(getCategoryIcon('BUSINESS')).toBe('briefcase');
      expect(getCategoryIcon('HEALTH')).toBe('fitness');
      expect(getCategoryIcon('SCIENCE')).toBe('flask');
      expect(getCategoryIcon('LANGUAGE')).toBe('chatbubbles');
      expect(getCategoryIcon('CREATIVITY')).toBe('brush');
      expect(getCategoryIcon('PRODUCTIVITY')).toBe('checkmark-circle');
      expect(getCategoryIcon('FINANCE')).toBe('cash');
      expect(getCategoryIcon('OTHER')).toBe('help-circle');
    });

    it('should return help-circle for unknown category', () => {
      expect(getCategoryIcon('UNKNOWN')).toBe('help-circle');
    });
  });

  describe('Lesson Interface', () => {
    it('should validate lesson object structure', () => {
      const lesson: Lesson = {
        id: 'test-1',
        title: 'Test Lesson',
        description: 'A test lesson',
        content: 'Content here',
        skillId: 'test-1',
        topicId: 'topic-1',
        category: 'TECHNOLOGY',
        difficulty: 'beginner',
        estimatedMinutes: 2,
        xpReward: 15,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(lesson.id).toBe('test-1');
      expect(lesson.difficulty).toMatch(/(beginner|intermediate|advanced)/);
    });

    it('should support optional fields in lesson', () => {
      const lesson: Lesson = {
        id: 'test-2',
        title: 'Test',
        description: 'Test',
        content: 'Content',
        skillId: 'test-2',
        topicId: 'topic-1',
        category: 'TECHNOLOGY',
        difficulty: 'intermediate',
        estimatedMinutes: 1,
        xpReward: 10,
        isActive: true,
        keyPoints: ['Point 1', 'Point 2'],
        examples: ['Example 1'],
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(lesson.keyPoints).toEqual(['Point 1', 'Point 2']);
      expect(lesson.examples).toEqual(['Example 1']);
      expect(lesson.sortOrder).toBe(1);
    });
  });

  describe('UserLessonProgress Interface', () => {
    it('should validate progress object structure', () => {
      const progress: UserLessonProgress = {
        id: 'user-1_lesson-1',
        userId: 'user-1',
        lessonId: 'lesson-1',
        status: 'completed',
        completedAt: new Date(),
        xpEarned: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(progress.status).toMatch(/(not_started|in_progress|completed)/);
      expect(progress.xpEarned).toBeGreaterThanOrEqual(0);
    });

    it('should support optional fields in progress', () => {
      const progress: UserLessonProgress = {
        id: 'user-2_lesson-2',
        userId: 'user-2',
        lessonId: 'lesson-2',
        status: 'in_progress',
        xpEarned: 0,
        timeSpentSeconds: 45,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(progress.timeSpentSeconds).toBe(45);
      expect(progress.completedAt).toBeUndefined();
    });
  });
});
