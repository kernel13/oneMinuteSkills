import { Injectable, inject } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

/**
 * Main App Guard
 * Prevents users from accessing main app until onboarding is complete
 * - If user has completed onboarding: allows access to /tabs
 * - If user hasn't completed onboarding: redirects to /onboarding
 * - If no user exists: redirects to /onboarding (to start auth flow)
 */
@Injectable({
  providedIn: 'root',
})
export class MainAppGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  /**
   * Determines if navigation to main app routes is allowed
   * Returns true if user has completed onboarding
   * Returns false and redirects to /onboarding if user is not onboarded
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
        // No user exists - redirect to onboarding to start auth flow
        if (!user) {
          this.router.navigate(['/onboarding']);
          return false;
        }

        // User exists and has completed onboarding - allow access to main app
        if (user.onboardingComplete) {
          return true;
        }

        // User exists but hasn't completed onboarding - redirect back
        this.router.navigate(['/onboarding']);
        return false;
      })
    );
  }
}
