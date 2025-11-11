import {
  Topic,
  TopicCategory,
  DifficultyLevel,
  TOPIC_CATEGORIES_CONFIG,
  createTopic,
  getCategoryLabel,
  getCategoryIcon,
  getCategoryColor,
  sortTopicsByName,
  groupTopicsByCategory,
  filterTopicsByDifficulty,
} from './topic.model';

describe('Topic Model', () => {
  describe('createTopic', () => {
    it('should create a new topic with all properties', () => {
      const topic = createTopic(
        'topic-1',
        'React Basics',
        'Learn the fundamentals of React',
        TopicCategory.TECHNOLOGY,
        DifficultyLevel.BEGINNER,
        5
      );

      expect(topic.id).toBe('topic-1');
      expect(topic.name).toBe('React Basics');
      expect(topic.description).toBe('Learn the fundamentals of React');
      expect(topic.category).toBe(TopicCategory.TECHNOLOGY);
      expect(topic.difficulty).toBe(DifficultyLevel.BEGINNER);
      expect(topic.lessonCount).toBe(5);
    });

    it('should set default difficulty to BEGINNER', () => {
      const topic = createTopic(
        'topic-2',
        'Test Topic',
        'Test description',
        TopicCategory.SCIENCE
      );

      expect(topic.difficulty).toBe(DifficultyLevel.BEGINNER);
    });

    it('should set timestamps', () => {
      const beforeCreate = new Date();
      const topic = createTopic('topic-3', 'Test', 'Test', TopicCategory.HEALTH);
      const afterCreate = new Date();

      expect(topic.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
      expect(topic.createdAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
      expect(topic.updatedAt).toEqual(topic.createdAt);
    });

    it('should include category config (icon and color)', () => {
      const topic = createTopic('topic-4', 'Tech', 'Tech', TopicCategory.TECHNOLOGY);

      expect(topic.icon).toBe('code');
      expect(topic.color).toBe('#007AFF');
    });
  });

  describe('getCategoryLabel', () => {
    it('should return correct label for each category', () => {
      expect(getCategoryLabel(TopicCategory.TECHNOLOGY)).toBe('Technology');
      expect(getCategoryLabel(TopicCategory.BUSINESS)).toBe('Business');
      expect(getCategoryLabel(TopicCategory.HEALTH)).toBe('Health');
    });

    it('should return label for OTHER category', () => {
      expect(getCategoryLabel(TopicCategory.OTHER)).toBe('Other');
    });
  });

  describe('getCategoryIcon', () => {
    it('should return correct icon for each category', () => {
      expect(getCategoryIcon(TopicCategory.TECHNOLOGY)).toBe('code');
      expect(getCategoryIcon(TopicCategory.BUSINESS)).toBe('briefcase');
      expect(getCategoryIcon(TopicCategory.HEALTH)).toBe('heart');
    });
  });

  describe('getCategoryColor', () => {
    it('should return correct color for each category', () => {
      expect(getCategoryColor(TopicCategory.TECHNOLOGY)).toBe('#007AFF');
      expect(getCategoryColor(TopicCategory.BUSINESS)).toBe('#34C759');
      expect(getCategoryColor(TopicCategory.HEALTH)).toBe('#FF3B30');
    });
  });

  describe('sortTopicsByName', () => {
    let topics: Topic[];

    beforeEach(() => {
      topics = [
        createTopic('1', 'Zebra Learning', 'Z', TopicCategory.OTHER),
        createTopic('2', 'Apple Picking', 'A', TopicCategory.OTHER),
        createTopic('3', 'Monkey Business', 'M', TopicCategory.OTHER),
      ];
    });

    it('should sort topics alphabetically by name', () => {
      const sorted = sortTopicsByName(topics);

      expect(sorted[0].name).toBe('Apple Picking');
      expect(sorted[1].name).toBe('Monkey Business');
      expect(sorted[2].name).toBe('Zebra Learning');
    });

    it('should not mutate original array', () => {
      const originalNames = topics.map((t) => t.name);
      sortTopicsByName(topics);

      expect(topics.map((t) => t.name)).toEqual(originalNames);
    });
  });

  describe('groupTopicsByCategory', () => {
    let topics: Topic[];

    beforeEach(() => {
      topics = [
        createTopic('1', 'React', 'React', TopicCategory.TECHNOLOGY),
        createTopic('2', 'Angular', 'Angular', TopicCategory.TECHNOLOGY),
        createTopic('3', 'Yoga', 'Yoga', TopicCategory.HEALTH),
        createTopic('4', 'Finance 101', 'Finance', TopicCategory.FINANCE),
      ];
    });

    it('should group topics by category', () => {
      const grouped = groupTopicsByCategory(topics);

      expect(grouped.get(TopicCategory.TECHNOLOGY)?.length).toBe(2);
      expect(grouped.get(TopicCategory.HEALTH)?.length).toBe(1);
      expect(grouped.get(TopicCategory.FINANCE)?.length).toBe(1);
    });

    it('should return Map structure', () => {
      const grouped = groupTopicsByCategory(topics);

      expect(grouped instanceof Map).toBe(true);
    });

    it('should contain correct topics in each group', () => {
      const grouped = groupTopicsByCategory(topics);
      const techTopics = grouped.get(TopicCategory.TECHNOLOGY);

      expect(techTopics).toContain(topics[0]);
      expect(techTopics).toContain(topics[1]);
    });
  });

  describe('filterTopicsByDifficulty', () => {
    let topics: Topic[];

    beforeEach(() => {
      topics = [
        createTopic('1', 'Beginner Topic', 'Beginner', TopicCategory.OTHER, DifficultyLevel.BEGINNER),
        createTopic('2', 'Intermediate Topic', 'Intermediate', TopicCategory.OTHER, DifficultyLevel.INTERMEDIATE),
        createTopic('3', 'Advanced Topic', 'Advanced', TopicCategory.OTHER, DifficultyLevel.ADVANCED),
        createTopic('4', 'Another Beginner', 'Beginner', TopicCategory.OTHER, DifficultyLevel.BEGINNER),
      ];
    });

    it('should filter topics by BEGINNER difficulty', () => {
      const filtered = filterTopicsByDifficulty(topics, DifficultyLevel.BEGINNER);

      expect(filtered.length).toBe(2);
      expect(filtered[0].name).toBe('Beginner Topic');
      expect(filtered[1].name).toBe('Another Beginner');
    });

    it('should filter topics by INTERMEDIATE difficulty', () => {
      const filtered = filterTopicsByDifficulty(topics, DifficultyLevel.INTERMEDIATE);

      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('Intermediate Topic');
    });

    it('should filter topics by ADVANCED difficulty', () => {
      const filtered = filterTopicsByDifficulty(topics, DifficultyLevel.ADVANCED);

      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('Advanced Topic');
    });

    it('should return empty array if no matches', () => {
      const emptyTopics: Topic[] = [];
      const filtered = filterTopicsByDifficulty(emptyTopics, DifficultyLevel.BEGINNER);

      expect(filtered.length).toBe(0);
    });
  });

  describe('TOPIC_CATEGORIES_CONFIG', () => {
    it('should have configuration for all categories', () => {
      Object.values(TopicCategory).forEach((category) => {
        expect(TOPIC_CATEGORIES_CONFIG[category as TopicCategory]).toBeDefined();
        expect(TOPIC_CATEGORIES_CONFIG[category as TopicCategory].label).toBeDefined();
      });
    });

    it('should have icon for each category', () => {
      Object.values(TopicCategory).forEach((category) => {
        expect(TOPIC_CATEGORIES_CONFIG[category as TopicCategory].icon).toBeDefined();
      });
    });

    it('should have color for each category', () => {
      Object.values(TopicCategory).forEach((category) => {
        expect(TOPIC_CATEGORIES_CONFIG[category as TopicCategory].color).toBeDefined();
      });
    });
  });
});
