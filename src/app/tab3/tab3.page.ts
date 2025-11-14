import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { GamificationService } from '../services/gamification.service';
import { NotificationService } from '../services/notification.service';
import { User } from '../models/user.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit, OnDestroy {
  // Services
  private authService = inject(AuthService);
  private gamificationService = inject(GamificationService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private alertController = inject(AlertController);
  private toastController = inject(ToastController);

  // State
  currentUser: User | null = null;
  loading = false;
  error: string | null = null;

  // Gamification stats
  userLevel = 1;
  xpProgress: { current: number; needed: number; percent: number } = {
    current: 0,
    needed: 100,
    percent: 0,
  };
  levelProgressText = '';

  // Notification state
  notificationsEnabled = false;
  reminderTime = '09:00';
  hasPermission = false;

  // Lifecycle
  private destroy$ = new Subject<void>();

  constructor() {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.checkNotificationStatus();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load user profile and calculate gamification stats
   */
  private loadUserProfile(): void {
    this.loading = true;
    this.error = null;

    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user: User | null) => {
          if (user) {
            this.currentUser = user;
            this.calculateStats();
            this.notificationsEnabled = user.notificationsEnabled || false;
            this.loading = false;
          }
        },
        error: (error) => {
          console.error('[Tab3Page] Error loading user profile:', error);
          this.error = 'Failed to load profile';
          this.loading = false;
        },
      });
  }

  /**
   * Calculate gamification stats from user data
   */
  private calculateStats(): void {
    if (!this.currentUser) return;

    this.userLevel = this.gamificationService.calculateLevel(
      this.currentUser.xp
    );
    this.xpProgress = this.gamificationService.getXPProgress(
      this.currentUser.xp
    );
    this.levelProgressText = this.gamificationService.getLevelProgressText(
      this.currentUser.xp
    );
  }

  /**
   * Get streak emoji based on current streak
   */
  getStreakEmoji(): string {
    if (!this.currentUser) return '';
    return this.gamificationService.getStreakEmoji(this.currentUser.currentStreak);
  }

  /**
   * Format account creation date
   */
  getAccountCreatedDate(): string {
    if (!this.currentUser) return '';
    const date = new Date(this.currentUser.createdAt);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  /**
   * Get user avatar initials
   */
  getAvatarInitials(): string {
    if (!this.currentUser) return '?';
    const name = this.currentUser.displayName || 'Anonymous User';
    const initials = name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
    return initials;
  }

  /**
   * Get shortened user ID (last 8 characters)
   */
  getShortenedUserId(): string {
    if (!this.currentUser) return '';
    return this.currentUser.id.substring(
      this.currentUser.id.length - 8
    );
  }

  /**
   * Navigate to topic selection for editing
   */
  editTopics(): void {
    this.router.navigate(['/onboarding/select-topics'], {
      state: { editMode: true },
    });
  }

  /**
   * Check notification permission status
   */
  async checkNotificationStatus(): Promise<void> {
    this.hasPermission = await this.notificationService.checkPermissions();
  }

  /**
   * Enable notifications and schedule daily reminder
   */
  async enableNotifications(): Promise<void> {
    const granted = await this.notificationService.requestPermissions();
    if (granted) {
      this.hasPermission = true;
      this.notificationsEnabled = true;
      await this.notificationService.scheduleDailyReminder(this.reminderTime);

      // Save to Firestore
      try {
        await this.authService.updateUserProfile({
          notificationsEnabled: true,
        });
        await this.showToast('Notifications enabled');
      } catch (error) {
        console.error('[Tab3Page] Error saving notification state:', error);
      }
    }
  }

  /**
   * Disable notifications
   */
  async disableNotifications(): Promise<void> {
    this.notificationsEnabled = false;
    this.hasPermission = false;
    await this.notificationService.cancelAllNotifications();

    // Save to Firestore
    try {
      await this.authService.updateUserProfile({
        notificationsEnabled: false,
      });
      await this.showToast('Notifications disabled');
    } catch (error) {
      console.error('[Tab3Page] Error disabling notifications:', error);
    }
  }

  /**
   * Update reminder time and reschedule
   */
  async updateReminderTime(): Promise<void> {
    if (this.notificationsEnabled && this.hasPermission) {
      try {
        await this.notificationService.updateReminderTime(this.reminderTime);
        await this.showToast(`Reminder set to ${this.reminderTime}`);
      } catch (error) {
        console.error('[Tab3Page] Error updating reminder time:', error);
        await this.showToast('Failed to update reminder time');
      }
    }
  }

  /**
   * Show sign out confirmation and sign out user
   */
  async signOut(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Sign Out',
      message: 'Are you sure you want to sign out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Sign Out',
          role: 'destructive',
          handler: async () => {
            await this.performSignOut();
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * Perform actual sign out
   */
  private async performSignOut(): Promise<void> {
    try {
      this.loading = true;
      await this.authService.signOut();
      await this.router.navigate(['/onboarding']);
      this.loading = false;
    } catch (error) {
      console.error('[Tab3Page] Error signing out:', error);
      this.error = 'Failed to sign out';
      this.loading = false;
      await this.showToast('Failed to sign out');
    }
  }

  /**
   * Show toast message
   */
  private async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }
}
