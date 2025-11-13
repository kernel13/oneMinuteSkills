import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { Tab2Page } from './tab2.page';
import { AuthService } from '../services/auth.service';
import { GamificationService } from '../services/gamification.service';
import { BehaviorSubject } from 'rxjs';
import { User, createUser } from '../models/user.model';

describe('Tab2Page', () => {
  let component: Tab2Page;
  let fixture: ComponentFixture<Tab2Page>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockGamificationService: jasmine.SpyObj<GamificationService>;

  beforeEach(async () => {
    // Create mock user
    const mockUser = createUser('test-user');
    mockUser.xp = 250;
    mockUser.level = 3;
    mockUser.currentStreak = 5;
    mockUser.longestStreak = 10;
    mockUser.totalLessonsCompleted = 25;

    // Create mock AuthService
    mockAuthService = jasmine.createSpyObj('AuthService', [], {
      currentUser$: new BehaviorSubject<User | null>(mockUser),
    });

    // Create mock GamificationService
    mockGamificationService = jasmine.createSpyObj('GamificationService', [
      'getXPProgress',
      'calculateXpForNextLevel',
      'getStreakEmoji',
      'getTotalXpForLevel',
    ]);
    mockGamificationService.getXPProgress.and.returnValue({
      current: 50,
      needed: 100,
      percent: 50,
    });
    mockGamificationService.calculateXpForNextLevel.and.returnValue(100);
    mockGamificationService.getStreakEmoji.and.returnValue('🔥');
    mockGamificationService.getTotalXpForLevel.and.callFake((level: number) => (level - 1) * 100);

    await TestBed.configureTestingModule({
      declarations: [Tab2Page],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: GamificationService, useValue: mockGamificationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Tab2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load user stats on init', () => {
      expect(component.currentUser).toBeTruthy();
      expect(component.currentUser?.level).toBe(3);
      expect(component.currentUser?.xp).toBe(250);
    });

    it('should set loading to false after loading', () => {
      expect(component.loading).toBe(false);
    });

    it('should update gamification stats', () => {
      expect(mockGamificationService.getXPProgress).toHaveBeenCalledWith(250);
      expect(mockGamificationService.calculateXpForNextLevel).toHaveBeenCalledWith(250);
      expect(mockGamificationService.getStreakEmoji).toHaveBeenCalledWith(5);
    });
  });

  describe('Milestone Methods', () => {
    it('should determine if milestone is reached', () => {
      expect(component.isMilestoneReached(1)).toBe(true); // User is level 3
      expect(component.isMilestoneReached(3)).toBe(true);
      expect(component.isMilestoneReached(5)).toBe(false); // User is level 3
    });

    it('should return correct milestone class', () => {
      expect(component.getMilestoneClass(3)).toBe('milestone-reached');
      expect(component.getMilestoneClass(5)).toBe('milestone-pending');
    });
  });

  describe('Lesson Calculations', () => {
    it('should get completed lessons from current user', () => {
      expect(component.getCompletedLessons()).toBe(25);
    });

    it('should get XP progress percentage', () => {
      expect(component.getXpProgressPercent()).toBe(50);
    });

    it('should calculate lessons to next level', () => {
      const lessonsToNext = component.getLessonsToNextLevel();
      expect(lessonsToNext).toBeGreaterThan(0);
    });
  });

  describe('Cleanup', () => {
    it('should unsubscribe on destroy', () => {
      const destroySpy = spyOn(component['destroy$'], 'next');
      component.ngOnDestroy();
      expect(destroySpy).toHaveBeenCalled();
    });
  });
});
