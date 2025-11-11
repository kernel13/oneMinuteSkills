import {
  Topic,
  createTopic,
  getCategoryLabel,
  sortTopics,
  sortTopicsByName,
  groupTopicsByCategory,
  filterActiveTopics,
  filterFeaturedTopics,
} from './topic.model';

describe('Topic Model', () => {
  describe('createTopic', () => {
    it('should create a new topic with all properties', () => {
      const topic = createTopic(
        'topic-1',
        'React Basics',
        'Learn the fundamentals of React',
        'Programming Languages',
        5,
        'code-slash-outline',
        '#ec4899'
      );

      expect(topic.id).toBe('topic-1');
      expect(topic.name).toBe('React Basics');
      expect(topic.description).toBe('Learn the fundamentals of React');
      expect(topic.category).toBe('Programming Languages');
      expect(topic.lessonsCount).toBe(5);
      expect(topic.icon).toBe('code-slash-outline');
      expect(topic.color).toBe('#ec4899');
      expect(topic.isActive).toBe(true);
      expect(topic.sortOrder).toBe(0);
      expect(topic.isFeatured).toBe(false);
    });

    it('should set default lessonsCount to 0', () => {
      const topic = createTopic(
        'topic-2',
        'Test Topic',
        'Test description',
        'General Concepts'
      );

      expect(topic.lessonsCount).toBe(0);
    });

    it('should set timestamps', () => {
      const beforeCreate = new Date();
      const topic = createTopic('topic-3', 'Test', 'Test', 'Security');
      const afterCreate = new Date();

      expect(topic.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
      expect(topic.createdAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
      expect(topic.updatedAt).toEqual(topic.createdAt);
    });

    it('should set default active state to true', () => {
      const topic = createTopic('topic-4', 'Tech', 'Tech', 'Cloud Platforms');

      expect(topic.isActive).toBe(true);
    });

    it('should set default featured state to false', () => {
      const topic = createTopic('topic-5', 'DevOps', 'DevOps', 'CI/CD Tools');

      expect(topic.isFeatured).toBe(false);
    });
  });

  describe('getCategoryLabel', () => {
    it('should return the category string as-is', () => {
      expect(getCategoryLabel('Programming Languages')).toBe('Programming Languages');
      expect(getCategoryLabel('Cloud Platforms')).toBe('Cloud Platforms');
      expect(getCategoryLabel('Security')).toBe('Security');
    });
  });

  describe('sortTopics', () => {
    let topics: Topic[];

    beforeEach(() => {
      topics = [
        { ...createTopic('1', 'Zebra', 'Z', 'Other'), sortOrder: 3 },
        { ...createTopic('2', 'Apple', 'A', 'Other'), sortOrder: 1 },
        { ...createTopic('3', 'Monkey', 'M', 'Other'), sortOrder: 2 },
      ];
    });

    it('should sort topics by sortOrder first', () => {
      const sorted = sortTopics(topics);

      expect(sorted[0].sortOrder).toBe(1);
      expect(sorted[1].sortOrder).toBe(2);
      expect(sorted[2].sortOrder).toBe(3);
    });

    it('should sort by name when sortOrder is equal', () => {
      topics = [
        { ...createTopic('1', 'Zebra', 'Z', 'Other'), sortOrder: 1 },
        { ...createTopic('2', 'Apple', 'A', 'Other'), sortOrder: 1 },
        { ...createTopic('3', 'Monkey', 'M', 'Other'), sortOrder: 1 },
      ];

      const sorted = sortTopics(topics);

      expect(sorted[0].name).toBe('Apple');
      expect(sorted[1].name).toBe('Monkey');
      expect(sorted[2].name).toBe('Zebra');
    });

    it('should not mutate original array', () => {
      const originalOrder = topics.map((t) => t.id);
      sortTopics(topics);

      expect(topics.map((t) => t.id)).toEqual(originalOrder);
    });
  });

  describe('sortTopicsByName', () => {
    let topics: Topic[];

    beforeEach(() => {
      topics = [
        createTopic('1', 'Zebra Learning', 'Z', 'Other'),
        createTopic('2', 'Apple Picking', 'A', 'Other'),
        createTopic('3', 'Monkey Business', 'M', 'Other'),
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
        createTopic('1', 'React', 'React', 'Programming Languages'),
        createTopic('2', 'Angular', 'Angular', 'Programming Languages'),
        createTopic('3', 'Docker', 'Docker', 'Containerization & Orchestration'),
        createTopic('4', 'AWS', 'AWS', 'Cloud Platforms'),
      ];
    });

    it('should group topics by category', () => {
      const grouped = groupTopicsByCategory(topics);

      expect(grouped.get('Programming Languages')?.length).toBe(2);
      expect(grouped.get('Containerization & Orchestration')?.length).toBe(1);
      expect(grouped.get('Cloud Platforms')?.length).toBe(1);
    });

    it('should return Map structure', () => {
      const grouped = groupTopicsByCategory(topics);

      expect(grouped instanceof Map).toBe(true);
    });

    it('should contain correct topics in each group', () => {
      const grouped = groupTopicsByCategory(topics);
      const techTopics = grouped.get('Programming Languages');

      expect(techTopics).toContain(topics[0]);
      expect(techTopics).toContain(topics[1]);
    });
  });

  describe('filterActiveTopics', () => {
    let topics: Topic[];

    beforeEach(() => {
      topics = [
        { ...createTopic('1', 'Active 1', 'Active', 'Other'), isActive: true },
        { ...createTopic('2', 'Inactive 1', 'Inactive', 'Other'), isActive: false },
        { ...createTopic('3', 'Active 2', 'Active', 'Other'), isActive: true },
        { ...createTopic('4', 'Inactive 2', 'Inactive', 'Other'), isActive: false },
      ];
    });

    it('should filter only active topics', () => {
      const filtered = filterActiveTopics(topics);

      expect(filtered.length).toBe(2);
      expect(filtered[0].name).toBe('Active 1');
      expect(filtered[1].name).toBe('Active 2');
    });

    it('should return empty array if no active topics', () => {
      const inactiveTopics = topics.map((t) => ({ ...t, isActive: false }));
      const filtered = filterActiveTopics(inactiveTopics);

      expect(filtered.length).toBe(0);
    });
  });

  describe('filterFeaturedTopics', () => {
    let topics: Topic[];

    beforeEach(() => {
      topics = [
        { ...createTopic('1', 'Featured 1', 'Featured', 'Other'), isFeatured: true },
        { ...createTopic('2', 'Normal 1', 'Normal', 'Other'), isFeatured: false },
        { ...createTopic('3', 'Featured 2', 'Featured', 'Other'), isFeatured: true },
        { ...createTopic('4', 'Normal 2', 'Normal', 'Other'), isFeatured: false },
      ];
    });

    it('should filter only featured topics', () => {
      const filtered = filterFeaturedTopics(topics);

      expect(filtered.length).toBe(2);
      expect(filtered[0].name).toBe('Featured 1');
      expect(filtered[1].name).toBe('Featured 2');
    });

    it('should return empty array if no featured topics', () => {
      const normalTopics = topics.map((t) => ({ ...t, isFeatured: false }));
      const filtered = filterFeaturedTopics(normalTopics);

      expect(filtered.length).toBe(0);
    });
  });
});
