import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NotificationSetupComponent } from './notification-setup.component';
import { AuthService } from '../../../services/auth.service';
import { createUser } from '../../../models/user.model';

describe('NotificationSetupComponent', () => {
  let component: NotificationSetupComponent;
  let fixture: ComponentFixture<NotificationSetupComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'getCurrentUser',
      'updateUserProfile',
    ]);

    await TestBed.configureTestingModule({
      imports: [NotificationSetupComponent, IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationSetupComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default notification settings', () => {
      mockAuthService.getCurrentUser.and.returnValue(null);

      component.ngOnInit();

      expect(component.notificationsEnabled).toBe(true);
      expect(component.reminderTime).toBe('09:00');
    });

    it('should load user notification preferences on init', () => {
      const user = createUser('user-123', true);
      user.notificationsEnabled = false;
      user.notificationTime = '18:00';
      mockAuthService.getCurrentUser.and.returnValue(user);

      component.ngOnInit();

      expect(component.notificationsEnabled).toBe(false);
      expect(component.reminderTime).toBe('18:00');
    });

    it('should handle missing user notification time gracefully', () => {
      const user = createUser('user-123', true);
      user.notificationsEnabled = true;
      mockAuthService.getCurrentUser.and.returnValue(user);

      component.ngOnInit();

      expect(component.notificationsEnabled).toBe(true);
      expect(component.reminderTime).toBe('09:00');
    });

    it('should handle null user gracefully', () => {
      mockAuthService.getCurrentUser.and.returnValue(null);

      component.ngOnInit();

      expect(component.notificationsEnabled).toBe(true);
      expect(component.reminderTime).toBe('09:00');
    });
  });

  describe('Notification Toggle', () => {
    it('should toggle notifications on/off', () => {
      component.notificationsEnabled = true;

      component.toggleNotifications();

      expect(component.notificationsEnabled).toBe(false);

      component.toggleNotifications();

      expect(component.notificationsEnabled).toBe(true);
    });
  });

  describe('Completing Onboarding', () => {
    it('should save notification preferences and navigate on complete', async () => {
      const user = createUser('user-123', true);
      mockAuthService.getCurrentUser.and.returnValue(user);
      mockAuthService.updateUserProfile.and.returnValue(Promise.resolve());
      mockRouter.navigate.and.returnValue(Promise.resolve(true));

      component.notificationsEnabled = true;
      component.reminderTime = '14:30';

      await component.completeOnboarding();

      expect(mockAuthService.updateUserProfile).toHaveBeenCalledWith({
        notificationsEnabled: true,
        notificationTime: '14:30',
        onboardingComplete: true,
      });
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/tabs']);
    });

    it('should handle error in completeOnboarding gracefully', async () => {
      const user = createUser('user-123', true);
      mockAuthService.getCurrentUser.and.returnValue(user);
      mockAuthService.updateUserProfile.and.returnValue(
        Promise.reject(new Error('Update failed'))
      );

      spyOn(console, 'error');

      await component.completeOnboarding();

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('Skipping Notifications', () => {
    it('should disable notifications and navigate on skip', async () => {
      const user = createUser('user-123', true);
      mockAuthService.getCurrentUser.and.returnValue(user);
      mockAuthService.updateUserProfile.and.returnValue(Promise.resolve());
      mockRouter.navigate.and.returnValue(Promise.resolve(true));

      await component.skipNotifications();

      expect(mockAuthService.updateUserProfile).toHaveBeenCalledWith({
        notificationsEnabled: false,
        onboardingComplete: true,
      });
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/tabs']);
    });

    it('should handle error in skipNotifications gracefully', async () => {
      const user = createUser('user-123', true);
      mockAuthService.getCurrentUser.and.returnValue(user);
      mockAuthService.updateUserProfile.and.returnValue(
        Promise.reject(new Error('Update failed'))
      );

      spyOn(console, 'error');

      await component.skipNotifications();

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('User Interactions', () => {
    it('should update reminder time when changed', () => {
      component.reminderTime = '09:00';

      component.reminderTime = '15:00';

      expect(component.reminderTime).toBe('15:00');
    });

    it('should maintain notification state across interactions', async () => {
      mockAuthService.getCurrentUser.and.returnValue(null);
      component.notificationsEnabled = false;

      component.toggleNotifications();

      expect(component.notificationsEnabled).toBe(true);

      const user = createUser('user-123', true);
      mockAuthService.getCurrentUser.and.returnValue(user);
      mockAuthService.updateUserProfile.and.returnValue(Promise.resolve());
      mockRouter.navigate.and.returnValue(Promise.resolve(true));

      await component.completeOnboarding();

      expect(mockAuthService.updateUserProfile).toHaveBeenCalledWith({
        notificationsEnabled: true,
        notificationTime: component.reminderTime,
        onboardingComplete: true,
      });
    });
  });

  describe('Navigation Flow', () => {
    it('should navigate to /tabs after completing onboarding with notifications', async () => {
      mockAuthService.getCurrentUser.and.returnValue(createUser('user-123', true));
      mockAuthService.updateUserProfile.and.returnValue(Promise.resolve());
      mockRouter.navigate.and.returnValue(Promise.resolve(true));
      component.notificationsEnabled = true;

      await component.completeOnboarding();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/tabs']);
    });

    it('should navigate to /tabs after skipping notifications', async () => {
      mockAuthService.getCurrentUser.and.returnValue(createUser('user-123', true));
      mockAuthService.updateUserProfile.and.returnValue(Promise.resolve());
      mockRouter.navigate.and.returnValue(Promise.resolve(true));

      await component.skipNotifications();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/tabs']);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid toggle clicks', () => {
      component.notificationsEnabled = true;

      component.toggleNotifications();
      component.toggleNotifications();
      component.toggleNotifications();

      expect(component.notificationsEnabled).toBe(false);
    });

    it('should handle user with no notification time set', () => {
      const user = createUser('user-123', true);
      mockAuthService.getCurrentUser.and.returnValue(user);

      component.ngOnInit();

      expect(component.reminderTime).toBe('09:00');
    });

    it('should save correct time format', async () => {
      const user = createUser('user-123', true);
      mockAuthService.getCurrentUser.and.returnValue(user);
      mockAuthService.updateUserProfile.and.returnValue(Promise.resolve());
      mockRouter.navigate.and.returnValue(Promise.resolve(true));
      component.reminderTime = '23:45';

      await component.completeOnboarding();

      expect(mockAuthService.updateUserProfile).toHaveBeenCalledWith({
        notificationsEnabled: true,
        notificationTime: '23:45',
        onboardingComplete: true,
      });
    });
  });
});
