import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from './services/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  private firebaseService = inject(FirebaseService);

  ngOnInit(): void {
    this.initializeApp();
  }

  /**
   * Initialize app on startup
   */
  private async initializeApp(): Promise<void> {
    try {
      await this.firebaseService.initialize();
      console.log('[AppComponent] App initialized successfully');
    } catch (error) {
      console.error('[AppComponent] App initialization error:', error);
    }
  }
}
