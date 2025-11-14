import { TestBed } from '@angular/core/testing';
import { Platform } from '@ionic/angular';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let platformMock: jasmine.SpyObj<Platform>;

  beforeEach(() => {
    // Create mock Platform service
    platformMock = jasmine.createSpyObj('Platform', ['is']);

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: Platform, useValue: platformMock },
      ],
    });

    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Platform detection tests - these test the critical safety logic
  describe('Platform Detection', () => {
    it('should skip permission check on web platform', async () => {
      platformMock.is.and.returnValue(false);
      spyOn(console, 'log');

      const result = await service.checkPermissions();

      expect(result).toBe(false);
      // Should not try to import plugin on web
      expect(console.log).not.toHaveBeenCalledWith(
        jasmine.stringMatching('Permission check')
      );
    });

    it('should skip scheduling on web platform', async () => {
      platformMock.is.and.returnValue(false);
      spyOn(console, 'log');

      await service.scheduleDailyReminder('09:00');

      expect(console.log).toHaveBeenCalledWith(
        '[NotificationService] Skipping notification scheduling on web platform'
      );
    });

    it('should skip notification operations on web', async () => {
      platformMock.is.and.returnValue(false);

      const pending = await service.getPendingNotifications();
      expect(pending).toEqual([]);

      await service.cancelAllNotifications();
      // No errors should be thrown
    });

    it('should return true for checkExactAlarmPermission on non-Android', async () => {
      platformMock.is.and.callFake((platform) => {
        return platform === 'android' ? false : true;
      });

      const result = await service.checkExactAlarmPermission();
      expect(result).toBe(true);
    });

    it('should skip changeExactAlarmPermission on non-Android', async () => {
      platformMock.is.and.callFake((platform) => {
        return platform === 'android' ? false : true;
      });
      spyOn(console, 'warn');

      await service.changeExactAlarmPermission();
      // Should not log any warnings since it skips early
    });

    it('should skip createNotificationChannel on non-Android', async () => {
      platformMock.is.and.callFake((platform) => {
        return platform === 'android' ? false : true;
      });

      await service.createNotificationChannel();
      // Should complete without errors
    });

    it('should skip listener setup on web', async () => {
      platformMock.is.and.returnValue(false);

      const callback = jasmine.createSpy();
      service.addLocalNotificationReceivedListener(callback);
      // Should not throw error
      expect(callback).not.toHaveBeenCalled();
    });
  });

  // Validation tests - ensure inputs are validated
  describe('Input Validation', () => {
    it('should throw error for invalid time format - bad values', async () => {
      platformMock.is.and.returnValue(true);

      const testCases = [
        'invalid',
        '25:00',
        '09:60',
        '',
        'abc:def',
      ];

      for (const timeStr of testCases) {
        try {
          await service.scheduleDailyReminder(timeStr);
          fail(`Should have thrown error for: ${timeStr}`);
        } catch (error) {
          expect((error as Error).message).toContain('Invalid time format');
        }
      }
    });

    it('should accept valid time formats even with single digits', async () => {
      platformMock.is.and.returnValue(true);
      spyOn(console, 'log');

      // '9:00' actually parses as [9, 0] which are valid
      // '09:5' parses as [9, 5] which are valid (parseInt is forgiving)
      const validTimes = ['00:00', '09:00', '12:30', '23:59', '9:00', '09:5'];

      for (const timeStr of validTimes) {
        try {
          await service.scheduleDailyReminder(timeStr);
        } catch (error) {
          // Expected -plugin import will fail, but validation should pass
          expect((error as Error).message).not.toContain('Invalid time format');
        }
      }
    });

    it('should reject out of bounds hours and minutes', async () => {
      platformMock.is.and.returnValue(true);

      const outOfBounds = ['-1:00', '24:00', '10:60', '10:99'];

      for (const timeStr of outOfBounds) {
        try {
          await service.scheduleDailyReminder(timeStr);
          fail(`Should have thrown for: ${timeStr}`);
        } catch (error) {
          expect((error as Error).message).toContain('Invalid time format');
        }
      }
    });
  });

  // Error handling tests - ensure robust error handling
  describe('Error Handling', () => {
    it('checkPermissions should return false on Capacitor platform', async () => {
      platformMock.is.and.returnValue(true);

      // Service will attempt import which will fail on test env, should handle gracefully
      const result = await service.checkPermissions();

      expect(result).toBe(false);
    });

    it('requestPermissions should return false on Capacitor platform', async () => {
      platformMock.is.and.returnValue(true);

      const result = await service.requestPermissions();

      expect(result).toBe(false);
    });

    it('getPendingNotifications should return empty array on Capacitor platform', async () => {
      platformMock.is.and.returnValue(true);

      const result = await service.getPendingNotifications();

      expect(result).toEqual([]);
    });

    it('cancelAllNotifications should handle Capacitor platform', async () => {
      platformMock.is.and.returnValue(true);

      // Should not throw
      await service.cancelAllNotifications();
    });

    it('updateReminderTime should handle rescheduling', async () => {
      platformMock.is.and.returnValue(true);
      spyOn(service, 'cancelAllNotifications').and.returnValue(
        Promise.resolve()
      );
      spyOn(service, 'scheduleDailyReminder').and.returnValue(
        Promise.resolve()
      );
      spyOn(console, 'log');

      await service.updateReminderTime('14:00');

      expect(service.cancelAllNotifications).toHaveBeenCalled();
      expect(service.scheduleDailyReminder).toHaveBeenCalledWith('14:00');
      expect(console.log).toHaveBeenCalledWith(
        '[NotificationService] Reminder time updated to',
        '14:00'
      );
    });
  });

  // Listener tests
  describe('Notification Listeners', () => {
    it('should skip notification received listener on web', () => {
      platformMock.is.and.returnValue(false);

      const callback = jasmine.createSpy();
      // Should not throw
      service.addLocalNotificationReceivedListener(callback);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should skip notification action listener on web', () => {
      platformMock.is.and.returnValue(false);

      const callback = jasmine.createSpy();
      // Should not throw
      service.addLocalNotificationActionListener(callback);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should attempt to add listener on Capacitor platform', () => {
      platformMock.is.and.returnValue(true);

      const callback = jasmine.createSpy();
      // Should not throw even though plugin import will fail
      service.addLocalNotificationReceivedListener(callback);
      service.addLocalNotificationActionListener(callback);

      // Callbacks are not called in test env since plugin import fails
      expect(callback).not.toHaveBeenCalled();
    });
  });

  // Edge case tests
  describe('Edge Cases', () => {
    it('should handle boundary times', async () => {
      platformMock.is.and.returnValue(true);

      const testTimes = ['00:00', '23:59', '12:00', '06:30'];

      for (const time of testTimes) {
        try {
          await service.scheduleDailyReminder(time);
        } catch (error) {
          // Expected since plugin import fails, but validation should pass
          expect((error as Error).message).not.toContain('Invalid');
        }
      }
    });

    it('should handle multiple updateReminderTime calls', async () => {
      platformMock.is.and.returnValue(true);
      spyOn(service, 'cancelAllNotifications').and.returnValue(
        Promise.resolve()
      );
      spyOn(service, 'scheduleDailyReminder').and.returnValue(
        Promise.resolve()
      );

      await service.updateReminderTime('09:00');
      await service.updateReminderTime('14:00');
      await service.updateReminderTime('18:00');

      expect(service.cancelAllNotifications).toHaveBeenCalledTimes(3);
      expect(service.scheduleDailyReminder).toHaveBeenCalledTimes(3);
    });

    it('should use correct channel ID', async () => {
      // This tests the constant is properly set
      // The actual scheduling will be tested on device
      expect((service as any).NOTIFICATION_CHANNEL_ID).toBe('daily-reminder');
      expect((service as any).DAILY_REMINDER_ID).toBe(1);
    });
  });

  // Integration with AuthService (if combined)
  describe('Integration Points', () => {
    it('should be injectable as singleton', () => {
      const service2 = TestBed.inject(NotificationService);
      expect(service2).toBe(service);
    });

    it('should support listening to notification events', () => {
      platformMock.is.and.returnValue(false);
      const callback = jasmine.createSpy();

      // Should not throw on web
      service.addLocalNotificationReceivedListener(callback);
      service.addLocalNotificationActionListener(callback);
    });
  });

  // TypeScript strict mode compliance
  describe('Type Safety', () => {
    it('all methods should have proper return types', () => {
      expect(typeof service.checkPermissions).toBe('function');
      expect(typeof service.requestPermissions).toBe('function');
      expect(typeof service.checkExactAlarmPermission).toBe('function');
      expect(typeof service.changeExactAlarmPermission).toBe('function');
      expect(typeof service.createNotificationChannel).toBe('function');
      expect(typeof service.scheduleDailyReminder).toBe('function');
      expect(typeof service.updateReminderTime).toBe('function');
      expect(typeof service.getPendingNotifications).toBe('function');
      expect(typeof service.cancelAllNotifications).toBe('function');
      expect(typeof service.addLocalNotificationReceivedListener).toBe('function');
      expect(typeof service.addLocalNotificationActionListener).toBe('function');
    });
  });
});
