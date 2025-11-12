import { Injectable, inject } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

/**
 * Onboarding Guard
 * Prevents users from accessing main app until onboarding is complete
 * - If user is not onboarded: allows access to /onboarding routes
 * - If user is onboarded: redirects to /tabs (prevents revisiting onboarding)
 * - Checks currentUser and onboardingComplete flag
 */
@Injectable({
  providedIn: 'root',
})
export class OnboardingGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  /**
   * Determines if navigation to onboarding routes is allowed
   * Returns true if user is not yet onboarded
   * Returns false and redirects to /tabs if user is already onboarded
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // Wait for auth to be initialized before checking user state
    return this.authService.authInitialized$.pipe(
      switchMap(() => this.authService.currentUser$),
      take(1),
      map((user) => {
        // No user or user not authenticated
        if (!user) {
          // Allow access to onboarding (user needs to sign in)
          return true;
        }

        // User exists but hasn't completed onboarding
        if (!user.onboardingComplete) {
          // Allow access to onboarding
          return true;
        }

        // User has completed onboarding - prevent re-access
        // Redirect to main app
        this.router.navigate(['/tabs']);
        return false;
      })
    );
  }
}
