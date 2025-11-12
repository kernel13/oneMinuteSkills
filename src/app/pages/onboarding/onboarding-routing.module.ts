import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { SelectTopicsComponent } from './select-topics/select-topics.component';
import { NotificationSetupComponent } from './notification-setup/notification-setup.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'welcome',
        component: WelcomeComponent,
      },
      {
        path: 'topics',
        component: SelectTopicsComponent,
      },
      {
        path: 'notifications',
        component: NotificationSetupComponent,
      },
      {
        path: '',
        redirectTo: 'welcome',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnboardingRoutingModule {}
