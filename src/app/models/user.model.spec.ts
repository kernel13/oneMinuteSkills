import {
  User,
  createUser,
  calculateLevel,
  calculateXpForNextLevel,
  updateUserStatsAfterLesson,
} from './user.model';

describe('User Model', () => {
  describe('createUser', () => {
    it('should create a new user with default values', () => {
      const user = createUser('user-123', true);

      expect(user.id).toBe('user-123');
      expect(user.isAnonymous).toBe(true);
      expect(user.onboardingComplete).toBe(false);
      expect(user.selectedTopics).toEqual([]);
      expect(user.xp).toBe(0);
      expect(user.level).toBe(1);
      expect(user.currentStreak).toBe(0);
      expect(user.totalLessonsCompleted).toBe(0);
    });

    it('should set timestamps for createdAt and updatedAt', () => {
      const beforeCreate = new Date();
      const user = createUser('user-456', false);
      const afterCreate = new Date();

      expect(user.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
      expect(user.createdAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
      expect(user.updatedAt.getTime()).toBe(user.createdAt.getTime());
    });

    it('should create authenticated (non-anonymous) user', () => {
      const user = createUser('auth-user', false);

      expect(user.isAnonymous).toBe(false);
    });
  });

  describe('calculateLevel', () => {
    it('should return level 1 for 0 XP', () => {
      expect(calculateLevel(0)).toBe(1);
    });

    it('should return level 1 for 99 XP', () => {
      expect(calculateLevel(99)).toBe(1);
    });

    it('should return level 2 for 100 XP', () => {
      expect(calculateLevel(100)).toBe(2);
    });

    it('should return level 5 for 400 XP', () => {
      expect(calculateLevel(400)).toBe(5);
    });

    it('should return level 10 for 900 XP', () => {
      expect(calculateLevel(900)).toBe(10);
    });
  });

  describe('calculateXpForNextLevel', () => {
    it('should return 100 for 0 XP (level 1)', () => {
      expect(calculateXpForNextLevel(0)).toBe(100);
    });

    it('should return 50 for 50 XP (level 1)', () => {
      expect(calculateXpForNextLevel(50)).toBe(50);
    });

    it('should return 100 for 100 XP (level 2)', () => {
      expect(calculateXpForNextLevel(100)).toBe(100);
    });

    it('should return 50 for 150 XP (level 2)', () => {
      expect(calculateXpForNextLevel(150)).toBe(50);
    });
  });

  describe('updateUserStatsAfterLesson', () => {
    let user: User;

    beforeEach(() => {
      user = createUser('user-789', true);
    });

    it('should increment XP', () => {
      const updatedUser = updateUserStatsAfterLesson(user, 50, false);

      expect(updatedUser.xp).toBe(50);
      expect(user.xp).toBe(0); // Original unchanged
    });

    it('should update level based on new XP total', () => {
      const updatedUser = updateUserStatsAfterLesson(user, 100, false);

      expect(updatedUser.level).toBe(2);
    });

    it('should increment lesson count', () => {
      const updatedUser = updateUserStatsAfterLesson(user, 50, false);

      expect(updatedUser.totalLessonsCompleted).toBe(1);
    });

    it('should set streak to 1 for first lesson (non-consecutive)', () => {
      const updatedUser = updateUserStatsAfterLesson(user, 50, false);

      expect(updatedUser.currentStreak).toBe(1);
    });

    it('should increment streak for consecutive day', () => {
      let updatedUser = updateUserStatsAfterLesson(user, 50, false);
      updatedUser = updateUserStatsAfterLesson(updatedUser, 50, true);

      expect(updatedUser.currentStreak).toBe(2);
    });

    it('should reset streak to 1 for non-consecutive day', () => {
      let updatedUser = updateUserStatsAfterLesson(user, 50, false);
      updatedUser = updateUserStatsAfterLesson(updatedUser, 50, true); // streak = 2
      updatedUser = updateUserStatsAfterLesson(updatedUser, 50, false); // reset

      expect(updatedUser.currentStreak).toBe(1);
    });

    it('should update longest streak correctly', () => {
      let updatedUser = updateUserStatsAfterLesson(user, 50, false); // streak = 1
      updatedUser = updateUserStatsAfterLesson(updatedUser, 50, true); // streak = 2
      updatedUser = updateUserStatsAfterLesson(updatedUser, 50, true); // streak = 3

      expect(updatedUser.longestStreak).toBe(3);
      expect(updatedUser.currentStreak).toBe(3);
    });

    it('should not decrease longest streak', () => {
      let updatedUser = updateUserStatsAfterLesson(user, 50, false); // streak = 1
      updatedUser = updateUserStatsAfterLesson(updatedUser, 50, true); // streak = 2
      updatedUser = updateUserStatsAfterLesson(updatedUser, 50, true); // streak = 3, longest = 3
      updatedUser = updateUserStatsAfterLesson(updatedUser, 50, false); // streak = 1, longest stays 3

      expect(updatedUser.longestStreak).toBe(3);
      expect(updatedUser.currentStreak).toBe(1);
    });

    it('should update timestamp', () => {
      const beforeUpdate = new Date();
      const updatedUser = updateUserStatsAfterLesson(user, 50, false);
      const afterUpdate = new Date();

      expect(updatedUser.updatedAt.getTime()).toBeGreaterThanOrEqual(beforeUpdate.getTime());
      expect(updatedUser.updatedAt.getTime()).toBeLessThanOrEqual(afterUpdate.getTime());
    });

    it('should not mutate original user object', () => {
      const originalXp = user.xp;
      const originalLessons = user.totalLessonsCompleted;

      updateUserStatsAfterLesson(user, 50, false);

      expect(user.xp).toBe(originalXp);
      expect(user.totalLessonsCompleted).toBe(originalLessons);
    });
  });
});
