import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';

/**
 * Notification Setup Component
 * Final step of onboarding - configure daily reminders
 */
@Component({
  selector: 'app-notification-setup',
  templateUrl: './notification-setup.component.html',
  styleUrls: ['./notification-setup.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class NotificationSetupComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  notificationsEnabled = true;
  reminderTime = '09:00';

  ngOnInit(): void {
    // Initialize notification settings from user profile if available
    const user = this.authService.getCurrentUser();
    if (user) {
      this.notificationsEnabled = user.notificationsEnabled ?? true;
      this.reminderTime = user.notificationTime ?? '09:00';
    }
  }

  /**
   * Save notification preferences and complete onboarding
   */
  async completeOnboarding(): Promise<void> {
    try {
      // Update user profile with notification settings and mark onboarding complete
      await this.authService.updateUserProfile({
        notificationsEnabled: this.notificationsEnabled,
        notificationTime: this.reminderTime,
        onboardingComplete: true,
      });
      // Navigate to main app
      await this.router.navigate(['/tabs']);
    } catch (error) {
      console.error('[NotificationSetupComponent] Error completing onboarding:', error);
    }
  }

  /**
   * Skip notifications and complete onboarding
   */
  async skipNotifications(): Promise<void> {
    try {
      // Save that user skipped notifications and mark onboarding complete
      await this.authService.updateUserProfile({
        notificationsEnabled: false,
        onboardingComplete: true,
      });
      // Navigate to main app
      await this.router.navigate(['/tabs']);
    } catch (error) {
      console.error('[NotificationSetupComponent] Error skipping notifications:', error);
    }
  }

  /**
   * Toggle notifications on/off
   */
  toggleNotifications(): void {
    this.notificationsEnabled = !this.notificationsEnabled;
  }
}
