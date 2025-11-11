import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

/**
 * Welcome Component
 * First step of onboarding - welcome screen with app introduction
 */
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class WelcomeComponent {
  private router = inject(Router);

  /**
   * Navigate to topic selection
   */
  navigateToTopics(): void {
    this.router.navigate(['/onboarding/topics']);
  }
}
