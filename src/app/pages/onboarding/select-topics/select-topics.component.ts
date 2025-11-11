import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IonicModule } from '@ionic/angular';
import { TopicService } from '../../../services/topic.service';
import { AuthService } from '../../../services/auth.service';
import { Topic, getCategoryLabel } from '../../../models/topic.model';

/**
 * Select Topics Component
 * Second step of onboarding - user selects topics of interest
 */
@Component({
  selector: 'app-select-topics',
  templateUrl: './select-topics.component.html',
  styleUrls: ['./select-topics.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
})
export class SelectTopicsComponent implements OnInit, OnDestroy {
  private topicService = inject(TopicService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  topics: Topic[] = [];
  selectedTopicIds: Set<string> = new Set();
  loading = false;
  error: string | null = null;

  readonly MIN_TOPICS_REQUIRED = 3;

  /**
   * Get the minimum number of topics required
   */
  get minTopicsMessage(): string {
    const remaining = this.MIN_TOPICS_REQUIRED - this.selectedTopicIds.size;
    if (remaining <= 0) {
      return 'Great! Ready to start learning';
    }
    return `Select ${remaining} more topic${remaining > 1 ? 's' : ''}`;
  }

  /**
   * Check if user can proceed
   */
  get canProceed(): boolean {
    return this.selectedTopicIds.size >= this.MIN_TOPICS_REQUIRED;
  }

  /**
   * Get selected topics
   */
  get selectedTopics(): Topic[] {
    return this.topics.filter((t) => this.selectedTopicIds.has(t.id));
  }

  ngOnInit(): void {
    this.loadTopics();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load topics from service
   * Public to allow retry from template error state
   */
  async loadTopics(): Promise<void> {
    try {
      this.loading = true;
      this.error = null;
      await this.topicService.loadAllTopics();

      this.topicService.topics$
        .pipe(takeUntil(this.destroy$))
        .subscribe((topics) => {
          this.topics = topics;
          this.loading = false;
        });
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to load topics';
      this.loading = false;
    }
  }

  /**
   * Toggle topic selection
   */
  toggleTopic(topicId: string): void {
    if (this.selectedTopicIds.has(topicId)) {
      this.selectedTopicIds.delete(topicId);
    } else {
      this.selectedTopicIds.add(topicId);
    }
  }

  /**
   * Check if topic is selected
   */
  isSelected(topicId: string): boolean {
    return this.selectedTopicIds.has(topicId);
  }

  /**
   * Get category label for display
   */
  getCategoryLabel(category: string): string {
    return getCategoryLabel(category);
  }

  /**
   * Complete onboarding and navigate to main app
   */
  async completeOnboarding(): Promise<void> {
    try {
      const selectedTopicIds = Array.from(this.selectedTopicIds);

      // Update user profile with selected topics
      await this.authService.updateUserProfile({
        selectedTopics: selectedTopicIds,
        onboardingComplete: true,
      });

      // Navigate to main app
      await this.router.navigate(['/tabs']);
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to complete onboarding';
      console.error('[SelectTopicsComponent] Error completing onboarding:', error);
    }
  }

  /**
   * Go back to welcome screen
   */
  goBack(): void {
    this.router.navigate(['/onboarding/welcome']);
  }
}
