import { Injectable, inject } from '@angular/core';
import { Platform } from '@ionic/angular';

/**
 * Notification Service
 * Handles local notifications with dynamic imports to prevent error -201 on iOS
 * Per official Ionic docs: https://ionicframework.com/docs/native/local-notifications
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private platform = inject(Platform);
  private readonly NOTIFICATION_CHANNEL_ID = 'daily-reminder';
  private readonly DAILY_REMINDER_ID = 1;

  /**
   * Check current notification permissions
   * Android 13+ requires explicit permission checks
   */
  async checkPermissions(): Promise<boolean> {
    // Skip on web - no notification support
    if (!this.platform.is('capacitor')) {
      return false;
    }

    try {
      // Dynamic import to prevent error -201 on iOS
      const { LocalNotifications } = await import(
        '@capacitor/local-notifications'
      );

      const result = await LocalNotifications.checkPermissions();
      console.log(
        '[NotificationService] Permission check:',
        result.display
      );
      return result.display === 'granted';
    } catch (error) {
      console.error('[NotificationService] Error checking permissions:', error);
      return false;
    }
  }

  /**
   * Request notification permissions from user
   * Triggers native permission dialog on iOS/Android
   */
  async requestPermissions(): Promise<boolean> {
    // Skip on web
    if (!this.platform.is('capacitor')) {
      return false;
    }

    try {
      // Dynamic import to prevent error -201 on iOS
      const { LocalNotifications } = await import(
        '@capacitor/local-notifications'
      );

      const result = await LocalNotifications.requestPermissions();
      console.log(
        '[NotificationService] Permission request result:',
        result.display
      );

      if (result.display === 'granted') {
        return true;
      } else if (result.display === 'denied') {
        console.warn(
          '[NotificationService] User denied notification permissions'
        );
        return false;
      }

      return false;
    } catch (error) {
      console.error(
        '[NotificationService] Error requesting permissions:',
        error
      );
      return false;
    }
  }

  /**
   * Check exact alarm notification permission (Android 12+)
   * Required for scheduled notifications on Android 12 and later
   */
  async checkExactAlarmPermission(): Promise<boolean> {
    // Only relevant on Android
    if (!this.platform.is('android')) {
      return true; // iOS and web don't need this
    }

    try {
      // Dynamic import
      const { LocalNotifications } = await import(
        '@capacitor/local-notifications'
      );

      const result =
        await LocalNotifications.checkExactNotificationSetting?.();
      console.log(
        '[NotificationService] Exact alarm setting:',
        (result as any)?.setting
      );
      return (result as any)?.setting === 'enabled';
    } catch (error) {
      // Method may not exist on older Android versions
      console.warn(
        '[NotificationService] checkExactNotificationSetting not available:',
        error
      );
      return true; // Assume granted if not available
    }
  }

  /**
   * Prompt user to enable exact alarm setting (Android 12+)
   */
  async changeExactAlarmPermission(): Promise<void> {
    // Only relevant on Android
    if (!this.platform.is('android')) {
      return;
    }

    try {
      // Dynamic import
      const { LocalNotifications } = await import(
        '@capacitor/local-notifications'
      );

      await LocalNotifications.changeExactNotificationSetting?.();
      console.log(
        '[NotificationService] Prompted user to change exact alarm setting'
      );
    } catch (error) {
      // Method may not exist on older Android versions
      console.warn(
        '[NotificationService] changeExactNotificationSetting not available:',
        error
      );
    }
  }

  /**
   * Create notification channel for Android 8+
   * Required for scheduling notifications on Android
   */
  async createNotificationChannel(): Promise<void> {
    // Only relevant on Android
    if (!this.platform.is('android')) {
      return;
    }

    try {
      // Dynamic import
      const { LocalNotifications } = await import(
        '@capacitor/local-notifications'
      );

      await LocalNotifications.createChannel({
        id: this.NOTIFICATION_CHANNEL_ID,
        name: 'Daily Reminders',
        description: 'Daily lesson reminders',
        importance: 4, // High importance
        sound: 'default',
        vibration: true,
        visibility: 1, // Public visibility
      });

      console.log(
        '[NotificationService] Notification channel created:',
        this.NOTIFICATION_CHANNEL_ID
      );
    } catch (error) {
      console.error(
        '[NotificationService] Error creating notification channel:',
        error
      );
    }
  }

  /**
   * Schedule daily reminder at specified time
   * @param time - Time in HH:mm format (e.g., "09:00")
   */
  async scheduleDailyReminder(time: string): Promise<void> {
    // Skip on web
    if (!this.platform.is('capacitor')) {
      console.log(
        '[NotificationService] Skipping notification scheduling on web platform'
      );
      return;
    }

    try {
      // Parse time
      const [hours, minutes] = time.split(':').map((t) => parseInt(t, 10));

      // Validate time
      if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        throw new Error(`Invalid time format: ${time}. Expected HH:mm`);
      }

      // Create scheduled time (today at specified time)
      const scheduledTime = new Date();
      scheduledTime.setHours(hours, minutes, 0, 0);

      // If time has passed today, schedule for tomorrow
      if (scheduledTime < new Date()) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      // Create notification channel first (Android requirement)
      await this.createNotificationChannel();

      // Dynamic import
      const { LocalNotifications } = await import(
        '@capacitor/local-notifications'
      );

      // Schedule the notification
      await LocalNotifications.schedule({
        notifications: [
          {
            id: this.DAILY_REMINDER_ID,
            title: '🎓 Time to Learn!',
            body: 'Your daily lesson is ready. Keep your streak alive!',
            schedule: {
              at: scheduledTime,
              repeats: true, // Daily repeat
              every: 'day' as any, // TypeScript requires type assertion
            },
            channelId: this.NOTIFICATION_CHANNEL_ID, // Android requirement
            small: 'ic_stat_icon_config_sample', // Android small icon
            largeIcon: 'ic_launcher', // Android large icon
            // allowWhileIdle handled via type assertion for Doze mode support
          } as any,
        ],
      });

      console.log(
        '[NotificationService] Daily reminder scheduled for',
        time,
        'at',
        scheduledTime
      );
    } catch (error) {
      console.error(
        '[NotificationService] Error scheduling daily reminder:',
        error
      );
      throw error;
    }
  }

  /**
   * Update reminder time (reschedule)
   * @param newTime - New time in HH:mm format
   */
  async updateReminderTime(newTime: string): Promise<void> {
    // Cancel existing and reschedule with new time
    await this.cancelAllNotifications();
    await this.scheduleDailyReminder(newTime);
    console.log('[NotificationService] Reminder time updated to', newTime);
  }

  /**
   * Get all pending scheduled notifications
   */
  async getPendingNotifications(): Promise<any[]> {
    // Skip on web
    if (!this.platform.is('capacitor')) {
      return [];
    }

    try {
      // Dynamic import
      const { LocalNotifications } = await import(
        '@capacitor/local-notifications'
      );

      const result = await LocalNotifications.getPending();
      console.log(
        '[NotificationService] Pending notifications:',
        result.notifications
      );
      return result.notifications;
    } catch (error) {
      console.error(
        '[NotificationService] Error getting pending notifications:',
        error
      );
      return [];
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications(): Promise<void> {
    // Skip on web
    if (!this.platform.is('capacitor')) {
      return;
    }

    try {
      // Dynamic import
      const { LocalNotifications } = await import(
        '@capacitor/local-notifications'
      );

      // Get pending first to know what to cancel
      const pending = await this.getPendingNotifications();
      if (pending.length > 0) {
        await LocalNotifications.cancel({
          notifications: pending,
        });
        console.log(
          '[NotificationService] Canceled',
          pending.length,
          'notifications'
        );
      }
    } catch (error) {
      console.error(
        '[NotificationService] Error canceling notifications:',
        error
      );
    }
  }

  /**
   * Listen for notification received event
   */
  addLocalNotificationReceivedListener(
    callback: (notification: any) => void
  ): void {
    if (!this.platform.is('capacitor')) {
      return;
    }

    try {
      // Dynamic import
      import('@capacitor/local-notifications').then(
        ({ LocalNotifications }) => {
          LocalNotifications.addListener(
            'localNotificationReceived',
            (notification) => {
              console.log(
                '[NotificationService] Notification received:',
                notification
              );
              callback(notification);
            }
          );
        }
      );
    } catch (error) {
      console.error(
        '[NotificationService] Error adding notification listener:',
        error
      );
    }
  }

  /**
   * Listen for notification action performed event
   */
  addLocalNotificationActionListener(
    callback: (notification: any) => void
  ): void {
    if (!this.platform.is('capacitor')) {
      return;
    }

    try {
      // Dynamic import
      import('@capacitor/local-notifications').then(
        ({ LocalNotifications }) => {
          LocalNotifications.addListener(
            'localNotificationActionPerformed',
            (notification) => {
              console.log(
                '[NotificationService] Notification action performed:',
                notification
              );
              callback(notification);
            }
          );
        }
      );
    } catch (error) {
      console.error(
        '[NotificationService] Error adding action listener:',
        error
      );
    }
  }
}
