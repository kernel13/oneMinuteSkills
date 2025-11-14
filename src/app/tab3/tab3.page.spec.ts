import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AlertController, ToastController, IonicModule } from '@ionic/angular';
import { of, BehaviorSubject } from 'rxjs';

import { Tab3Page } from './tab3.page';
import { AuthService } from '../services/auth.service';
import { GamificationService } from '../services/gamification.service';
import { User, createUser } from '../models/user.model';

describe('Tab3Page', () => {
  let component: Tab3Page;
  let fixture: ComponentFixture<Tab3Page>;
  let authService: jasmine.SpyObj<AuthService>;
  let gamificationService: jasmine.SpyObj<GamificationService>;
  let router: jasmine.SpyObj<Router>;
  let alertController: jasmine.SpyObj<AlertController>;
  let toastController: jasmine.SpyObj<ToastController>;
  let mockUser: User;

  beforeEach(async () => {
    // Create mock user
    mockUser = {
      ...createUser('test-user-123', true),
      displayName: 'Test User',
      xp: 250,
      level: 3,
      currentStreak: 5,
      longestStreak: 10,
      totalLessonsCompleted: 15,
      selectedTopics: ['JavaScript', 'React'],
      notificationsEnabled: true,
    };

    // Create spy objects
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'updateUserProfile',
      'signOut',
    ]);
    authServiceSpy.currentUser$ = new BehaviorSubject<User | null>(mockUser);

    const gamificationServiceSpy = jasmine.createSpyObj('GamificationService', [
      'calculateLevel',
      'getXPProgress',
      'getLevelProgressText',
      'getStreakEmoji',
    ]);
    gamificationServiceSpy.calculateLevel.and.returnValue(3);
    gamificationServiceSpy.getXPProgress.and.returnValue({
      current: 50,
      needed: 100,
      percent: 50,
    });
    gamificationServiceSpy.getLevelProgressText.and.returnValue('50/100 XP to Level 4');
    gamificationServiceSpy.getStreakEmoji.and.returnValue('🔥');

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);
    const toastControllerSpy = jasmine.createSpyObj('ToastController', ['create']);

    await TestBed.configureTestingModule({
      declarations: [Tab3Page],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: GamificationService, useValue: gamificationServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: AlertController, useValue: alertControllerSpy },
        { provide: ToastController, useValue: toastControllerSpy },
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    gamificationService = TestBed.inject(
      GamificationService
    ) as jasmine.SpyObj<GamificationService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    alertController = TestBed.inject(AlertController) as jasmine.SpyObj<AlertController>;
    toastController = TestBed.inject(ToastController) as jasmine.SpyObj<ToastController>;

    fixture = TestBed.createComponent(Tab3Page);
    component = fixture.componentInstance;
  });

  // Component Initialization Tests
  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with null user', () => {
      expect(component.currentUser).toBeNull();
    });

    it('should have default loading state false', () => {
      expect(component.loading).toBeFalse();
    });

    it('should have default error state null', () => {
      expect(component.error).toBeNull();
    });

    it('should have default user level 1', () => {
      expect(component.userLevel).toBe(1);
    });
  });

  // User Profile Loading Tests
  describe('User Profile Loading', () => {
    it('should load user profile on init', () => {
      fixture.detectChanges();
      expect(component.currentUser).toEqual(mockUser);
    });

    it('should calculate stats when user loads', () => {
      fixture.detectChanges();
      expect(gamificationService.calculateLevel).toHaveBeenCalledWith(mockUser.xp);
      expect(gamificationService.getXPProgress).toHaveBeenCalledWith(mockUser.xp);
      expect(gamificationService.getLevelProgressText).toHaveBeenCalledWith(mockUser.xp);
    });

    it('should set userLevel from gamification service', () => {
      fixture.detectChanges();
      expect(component.userLevel).toBe(3);
    });

    it('should set xpProgress from gamification service', () => {
      fixture.detectChanges();
      expect(component.xpProgress).toEqual({
        current: 50,
        needed: 100,
        percent: 50,
      });
    });

    it('should set levelProgressText from gamification service', () => {
      fixture.detectChanges();
      expect(component.levelProgressText).toBe('50/100 XP to Level 4');
    });
  });

  // Helper Method Tests
  describe('Helper Methods', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should get streak emoji', () => {
      const emoji = component.getStreakEmoji();
      expect(gamificationService.getStreakEmoji).toHaveBeenCalledWith(
        mockUser.currentStreak
      );
      expect(emoji).toBe('🔥');
    });

    it('should get avatar initials', () => {
      const initials = component.getAvatarInitials();
      expect(initials).toBe('TU');
    });

    it('should return ? for avatar if no user', () => {
      component.currentUser = null;
      expect(component.getAvatarInitials()).toBe('?');
    });

    it('should get shortened user ID (last 8 chars)', () => {
      const shortened = component.getShortenedUserId();
      expect(shortened).toBe('r-123'); // last 8 of 'test-user-123'
    });

    it('should format account creation date', () => {
      const date = component.getAccountCreatedDate();
      expect(date).toMatch(/\w+\s\d+,\s\d{4}/);
    });
  });

  // Navigation Tests
  describe('Navigation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should navigate to topic selection on editTopics', () => {
      component.editTopics();
      expect(router.navigate).toHaveBeenCalledWith(
        ['/onboarding/select-topics'],
        { state: { editMode: true } }
      );
    });
  });

  // Notifications Toggle Tests
  describe('Notifications Toggle', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should toggle notifications enabled state', async () => {
      authService.updateUserProfile.and.returnValue(Promise.resolve());

      await component.toggleNotifications();

      expect(authService.updateUserProfile).toHaveBeenCalledWith({
        notificationsEnabled: false,
      });
    });

    it('should show success toast on toggle', async () => {
      const mockToast = jasmine.createSpyObj('IonToast', ['present']);
      toastController.create.and.returnValue(Promise.resolve(mockToast));
      authService.updateUserProfile.and.returnValue(Promise.resolve());

      await component.toggleNotifications();

      expect(toastController.create).toHaveBeenCalled();
      expect(mockToast.present).toHaveBeenCalled();
    });

    it('should handle toggle error gracefully', async () => {
      const mockToast = jasmine.createSpyObj('IonToast', ['present']);
      toastController.create.and.returnValue(Promise.resolve(mockToast));
      authService.updateUserProfile.and.returnValue(
        Promise.reject('Update failed')
      );

      await component.toggleNotifications();

      expect(toastController.create).toHaveBeenCalled();
    });
  });

  // Sign Out Tests
  describe('Sign Out', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should show sign out confirmation alert', async () => {
      const mockAlert = jasmine.createSpyObj('IonAlert', ['present']);
      alertController.create.and.returnValue(Promise.resolve(mockAlert));

      await component.signOut();

      expect(alertController.create).toHaveBeenCalled();
      const alertConfig = (alertController.create as jasmine.Spy).calls.mostRecent()
        .args[0] as any;
      expect(alertConfig.header).toBe('Sign Out');
      expect(alertConfig.message).toBe('Are you sure you want to sign out?');
    });

    it('should call authService.signOut on confirmation', async () => {
      const mockAlert = jasmine.createSpyObj('IonAlert', ['present']);
      let capturedButtons: any[] = [];
      alertController.create.and.callFake((config: any) => {
        capturedButtons = config.buttons || [];
        return Promise.resolve(mockAlert);
      });
      authService.signOut.and.returnValue(Promise.resolve());
      router.navigate.and.returnValue(Promise.resolve(true));

      await component.signOut();

      // Find the destructive button and call its handler
      const destructiveButton = capturedButtons.find(
        (btn: any) => btn.role === 'destructive'
      );
      if (destructiveButton && destructiveButton.handler) {
        await destructiveButton.handler();
      }

      expect(authService.signOut).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/onboarding']);
    });

    it('should handle sign out error', async () => {
      const mockAlert = jasmine.createSpyObj('IonAlert', ['present']);
      let capturedButtons: any[] = [];
      alertController.create.and.callFake((config: any) => {
        capturedButtons = config.buttons || [];
        return Promise.resolve(mockAlert);
      });
      const mockToast = jasmine.createSpyObj('IonToast', ['present']);
      toastController.create.and.returnValue(Promise.resolve(mockToast));
      authService.signOut.and.returnValue(Promise.reject('Sign out failed'));

      await component.signOut();

      const destructiveButton = capturedButtons.find(
        (btn: any) => btn.role === 'destructive'
      );
      if (destructiveButton && destructiveButton.handler) {
        await destructiveButton.handler();
      }

      expect(toastController.create).toHaveBeenCalled();
    });
  });

  // Cleanup Tests
  describe('Cleanup', () => {
    it('should unsubscribe on destroy', () => {
      fixture.detectChanges();
      const destroySpy = spyOn(component['destroy$'], 'next');
      component.ngOnDestroy();
      expect(destroySpy).toHaveBeenCalled();
    });
  });
});
