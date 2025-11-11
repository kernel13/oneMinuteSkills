import { Injectable, inject } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, catchError, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { TopicService } from '../services/topic.service';
import { User } from '../models/user.model';

/**
 * Onboarding Resolver
 * Preloads user data and topics before onboarding routes are activated
 * - Waits for Auth initialization
 * - Loads topics from Firestore
 * - Returns user object for component use
 */
@Injectable({
  providedIn: 'root',
})
export class OnboardingResolver implements Resolve<User | null> {
  private authService = inject(AuthService);
  private topicService = inject(TopicService);

  /**
   * Resolves onboarding route data
   * Ensures user is authenticated and topics are loaded
   */
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<User | null> {
    return this.authService.currentUser$.pipe(
      take(1),
      tap((user) => {
        // Preload topics while user is being displayed
        if (user) {
          this.topicService.loadAllTopics().catch((error) => {
            console.error('[OnboardingResolver] Failed to load topics:', error);
          });
        }
      }),
      catchError((error) => {
        console.error('[OnboardingResolver] Error resolving user:', error);
        return of(null);
      })
    );
  }
}
