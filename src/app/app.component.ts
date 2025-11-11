import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from './services/firebase.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  private firebaseService = inject(FirebaseService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.initializeApp();
  }

  /**
   * Initialize app on startup
   * 1. Initialize Firebase
   * 2. Initialize Authentication
   */
  private async initializeApp(): Promise<void> {
    try {
      // Initialize Firebase first
      await this.firebaseService.initialize();
      console.log('[AppComponent] Firebase initialized');

      // Then initialize Auth (which depends on Firebase)
      await this.authService.initializeAuth();
      console.log('[AppComponent] Auth initialized');

      // Wait for auth to be fully set up
      await this.authService.waitForAuthInitialization();
      console.log('[AppComponent] App initialized successfully');
    } catch (error) {
      console.error('[AppComponent] App initialization error:', error);
    }
  }
}
