import { TestBed } from '@angular/core/testing';
import { GamificationService } from './gamification.service';

describe('GamificationService', () => {
  let service: GamificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GamificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('calculateLevel', () => {
    it('should return level 1 for 0 XP', () => {
      expect(service.calculateLevel(0)).toBe(1);
    });

    it('should return level 2 for 100 XP', () => {
      expect(service.calculateLevel(100)).toBe(2);
    });

    it('should return level 3 for 200 XP', () => {
      expect(service.calculateLevel(200)).toBe(3);
    });

    it('should return level 10 for 900 XP', () => {
      expect(service.calculateLevel(900)).toBe(10);
    });

    it('should floor level for partial progress', () => {
      expect(service.calculateLevel(150)).toBe(2); // 150 XP = level 2 (not 2.5)
      expect(service.calculateLevel(250)).toBe(3); // 250 XP = level 3 (not 3.5)
    });

    it('should handle large XP values', () => {
      expect(service.calculateLevel(5000)).toBe(51);
    });
  });

  describe('calculateXpForNextLevel', () => {
    it('should return 100 for 0 XP (level 1 needs 100 to reach level 2)', () => {
      expect(service.calculateXpForNextLevel(0)).toBe(100);
    });

    it('should return 100 for 50 XP (level 1, needs 50 more)', () => {
      expect(service.calculateXpForNextLevel(50)).toBe(50);
    });

    it('should return 100 for 100 XP (level 2, needs 100 to reach level 3)', () => {
      expect(service.calculateXpForNextLevel(100)).toBe(100);
    });

    it('should return 50 for 150 XP (level 2, needs 50 more)', () => {
      expect(service.calculateXpForNextLevel(150)).toBe(50);
    });

    it('should return 1 for 199 XP (level 2, needs 1 more)', () => {
      expect(service.calculateXpForNextLevel(199)).toBe(1);
    });
  });

  describe('getXPProgress', () => {
    it('should return progress 0/100 for 0 XP', () => {
      const progress = service.getXPProgress(0);
      expect(progress.current).toBe(0);
      expect(progress.needed).toBe(100);
      expect(progress.percent).toBe(0);
    });

    it('should return progress 50/100 for 50 XP', () => {
      const progress = service.getXPProgress(50);
      expect(progress.current).toBe(50);
      expect(progress.needed).toBe(100);
      expect(progress.percent).toBe(50);
    });

    it('should return progress 100/100 for 100 XP', () => {
      const progress = service.getXPProgress(100);
      expect(progress.current).toBe(0);
      expect(progress.needed).toBe(100);
      expect(progress.percent).toBe(0);
    });

    it('should return progress 50/100 for 150 XP (level 2)', () => {
      const progress = service.getXPProgress(150);
      expect(progress.current).toBe(50);
      expect(progress.needed).toBe(100);
      expect(progress.percent).toBe(50);
    });

    it('should cap progress at 100%', () => {
      const progress = service.getXPProgress(199);
      expect(progress.percent).toBeLessThanOrEqual(100);
    });
  });

  describe('getLevelProgressText', () => {
    it('should return progress text for 0 XP', () => {
      expect(service.getLevelProgressText(0)).toBe('0/100 XP to Level 2');
    });

    it('should return progress text for 50 XP', () => {
      expect(service.getLevelProgressText(50)).toBe('50/100 XP to Level 2');
    });

    it('should return progress text for 100 XP (level 2)', () => {
      expect(service.getLevelProgressText(100)).toBe('0/100 XP to Level 3');
    });

    it('should return progress text for 250 XP (level 3)', () => {
      expect(service.getLevelProgressText(250)).toBe('50/100 XP to Level 4');
    });
  });

  describe('checkLevelUp', () => {
    it('should return false if level does not change', () => {
      expect(service.checkLevelUp(0, 50)).toBe(false); // 0 XP → 50 XP (level 1 → 1)
    });

    it('should return true if level increases by 1', () => {
      expect(service.checkLevelUp(50, 100)).toBe(true); // 50 XP → 100 XP (level 1 → 2)
    });

    it('should return true if level increases by more than 1', () => {
      expect(service.checkLevelUp(50, 250)).toBe(true); // 50 XP → 250 XP (level 1 → 3)
    });

    it('should return false at exact level boundary', () => {
      expect(service.checkLevelUp(99, 100)).toBe(true); // 99 XP → 100 XP (level 1 → 2)
    });

    it('should return true for large XP increases', () => {
      expect(service.checkLevelUp(500, 1000)).toBe(true); // level 6 → 11
    });
  });

  describe('getNewLevel', () => {
    it('should return 0 if no level up', () => {
      expect(service.getNewLevel(0, 50)).toBe(0);
    });

    it('should return new level if level up occurs', () => {
      expect(service.getNewLevel(50, 100)).toBe(2);
    });

    it('should return new level for multi-level jump', () => {
      expect(service.getNewLevel(50, 250)).toBe(3);
    });

    it('should return level 1 for 0 XP with no level up', () => {
      expect(service.getNewLevel(0, 0)).toBe(0);
    });
  });

  describe('getStreakEmoji', () => {
    it('should return empty string for 0 streak', () => {
      expect(service.getStreakEmoji(0)).toBe('');
    });

    it('should return single fire emoji for streak 1-13', () => {
      expect(service.getStreakEmoji(1)).toBe('🔥');
      expect(service.getStreakEmoji(7)).toBe('🔥');
      expect(service.getStreakEmoji(13)).toBe('🔥');
    });

    it('should return double fire emoji for streak 14-29', () => {
      expect(service.getStreakEmoji(14)).toBe('🔥🔥');
      expect(service.getStreakEmoji(20)).toBe('🔥🔥');
      expect(service.getStreakEmoji(29)).toBe('🔥🔥');
    });

    it('should return triple fire emoji for streak 30+', () => {
      expect(service.getStreakEmoji(30)).toBe('🔥🔥🔥');
      expect(service.getStreakEmoji(100)).toBe('🔥🔥🔥');
    });
  });

  describe('getCompletionMessage', () => {
    it('should format standard completion message', () => {
      const msg = service.getCompletionMessage(10, 5, false);
      expect(msg).toContain('+10 XP');
      expect(msg).toContain('Streak: 5');
      expect(msg).toContain('🔥');
    });

    it('should format completion with no streak', () => {
      const msg = service.getCompletionMessage(10, 0, false);
      expect(msg).toBe('+10 XP');
    });

    it('should format level up message', () => {
      const msg = service.getCompletionMessage(10, 5, true, 3);
      expect(msg).toContain('🎉 Level up!');
      expect(msg).toContain('Level 3');
    });

    it('should show higher streak emoji for long streaks', () => {
      const msg30 = service.getCompletionMessage(10, 30, false);
      expect(msg30).toContain('🔥🔥🔥');
    });
  });

  describe('getTotalXpForLevel', () => {
    it('should return 0 for level 1', () => {
      expect(service.getTotalXpForLevel(1)).toBe(0);
    });

    it('should return 100 for level 2', () => {
      expect(service.getTotalXpForLevel(2)).toBe(100);
    });

    it('should return 500 for level 6', () => {
      expect(service.getTotalXpForLevel(6)).toBe(500);
    });

    it('should return 1000 for level 11', () => {
      expect(service.getTotalXpForLevel(11)).toBe(1000);
    });
  });

  describe('getXpNeededForLevel', () => {
    it('should always return 100 (XP per level)', () => {
      expect(service.getXpNeededForLevel(1)).toBe(100);
      expect(service.getXpNeededForLevel(5)).toBe(100);
      expect(service.getXpNeededForLevel(10)).toBe(100);
    });
  });
});
