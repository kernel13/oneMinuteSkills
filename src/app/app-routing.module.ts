import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { OnboardingGuard } from './guards/onboarding.guard';
import { OnboardingResolver } from './guards/onboarding.resolver';
import { MainAppGuard } from './guards/main-app.guard';

const routes: Routes = [
  {
    path: 'onboarding',
    loadChildren: () => import('./pages/onboarding/onboarding.module').then(m => m.OnboardingModule),
    canActivate: [OnboardingGuard],
    resolve: { user: OnboardingResolver }
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [MainAppGuard]
  },
  {
    path: '',
    redirectTo: 'onboarding',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
