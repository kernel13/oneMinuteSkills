import { TestBed } from '@angular/core/testing';
import { TopicService } from './topic.service';
import { FirebaseService } from './firebase.service';
import { Topic, TopicCategory, DifficultyLevel, createTopic } from '../models/topic.model';

describe('TopicService', () => {
  let service: TopicService;
  let firebaseServiceMock: jasmine.SpyObj<FirebaseService>;

  beforeEach(() => {
    const firebaseSpy = jasmine.createSpyObj('FirebaseService', [
      'getAuth',
      'getFirestore',
      'initialize',
      'isInitialized',
    ]);

    TestBed.configureTestingModule({
      providers: [
        TopicService,
        { provide: FirebaseService, useValue: firebaseSpy },
      ],
    });

    service = TestBed.inject(TopicService);
    firebaseServiceMock = TestBed.inject(FirebaseService) as jasmine.SpyObj<FirebaseService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have empty topics initially', () => {
    expect(service.topics).toEqual([]);
  });

  it('should have loading$ observable', (done) => {
    service.loading$.subscribe((loading) => {
      expect(loading).toBeFalsy();
      done();
    });
  });

  it('should have topics$ observable', (done) => {
    service.topics$.subscribe((topics) => {
      expect(Array.isArray(topics)).toBe(true);
      done();
    });
  });

  it('should have error$ observable', (done) => {
    service.error$.subscribe((error) => {
      expect(error).toBeNull();
      done();
    });
  });

  describe('searchTopics', () => {
    beforeEach(() => {
      const topics = [
        createTopic('1', 'React Basics', 'Learn React', TopicCategory.TECHNOLOGY),
        createTopic('2', 'Vue Fundamentals', 'Learn Vue', TopicCategory.TECHNOLOGY),
        createTopic('3', 'Angular Advanced', 'Advanced Angular', TopicCategory.TECHNOLOGY),
      ];
      // Manually set topics since we're not mocking Firestore
      (service as any).topicsSubject.next(topics);
    });

    it('should search topics by name (case-insensitive)', () => {
      const results = service.searchTopics('react');

      expect(results.length).toBe(1);
      expect(results[0].name).toBe('React Basics');
    });

    it('should search topics by description', () => {
      const results = service.searchTopics('Learn');

      expect(results.length).toBe(2);
    });

    it('should return empty array if no matches', () => {
      const results = service.searchTopics('Python');

      expect(results.length).toBe(0);
    });

    it('should be case-insensitive for both name and description', () => {
      const results = service.searchTopics('ANGULAR');

      expect(results.length).toBe(1);
      expect(results[0].name).toBe('Angular Advanced');
    });
  });

  describe('clearError', () => {
    it('should set error to null', (done) => {
      // Set an error first
      (service as any).errorSubject.next('Test error');

      // Clear it
      service.clearError();

      // Verify it's cleared
      service.error$.subscribe((error) => {
        expect(error).toBeNull();
        done();
      });
    });
  });

  describe('topics getter', () => {
    it('should return current topics synchronously', () => {
      const topics = [
        createTopic('1', 'Test', 'Test', TopicCategory.OTHER),
      ];
      (service as any).topicsSubject.next(topics);

      expect(service.topics).toEqual(topics);
    });
  });

  describe('getTopicById', () => {
    it('should have method to get topic by ID', () => {
      expect(service.getTopicById).toBeDefined();
    });
  });

  describe('getTopicsByCategory', () => {
    it('should have method to get topics by category', () => {
      expect(service.getTopicsByCategory).toBeDefined();
    });
  });

  describe('loadAllTopics', () => {
    it('should have method to load all topics', () => {
      expect(service.loadAllTopics).toBeDefined();
    });
  });
});
