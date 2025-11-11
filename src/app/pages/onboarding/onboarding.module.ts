import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { OnboardingRoutingModule } from './onboarding-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { SelectTopicsComponent } from './select-topics/select-topics.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    OnboardingRoutingModule,
    WelcomeComponent,
    SelectTopicsComponent,
  ],
})
export class OnboardingModule {}
