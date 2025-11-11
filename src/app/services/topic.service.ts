import { Injectable, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Topic, TopicCategory } from '../models/topic.model';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  QueryConstraint,
} from 'firebase/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Topic Service
 * Manages topic data and Firestore operations
 */
@Injectable({
  providedIn: 'root',
})
export class TopicService {
  private firebaseService = inject(FirebaseService);
  private topicsSubject = new BehaviorSubject<Topic[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  /**
   * Observable of all topics
   */
  topics$: Observable<Topic[]> = this.topicsSubject.asObservable();

  /**
   * Observable of loading state
   */
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  /**
   * Observable of error state
   */
  error$: Observable<string | null> = this.errorSubject.asObservable();

  /**
   * Get topics synchronously
   */
  get topics(): Topic[] {
    return this.topicsSubject.value;
  }

  /**
   * Load all topics from Firestore
   */
  async loadAllTopics(): Promise<void> {
    try {
      this.loadingSubject.next(true);
      this.errorSubject.next(null);

      const firestore = this.firebaseService.getFirestore();
      if (!firestore) {
        throw new Error('Firestore not initialized');
      }

      const topicsRef = collection(firestore, 'topics');
      const snapshot = await getDocs(topicsRef);

      const topics: Topic[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Topic;
        // Convert Firestore timestamps to Date objects
        if (data.createdAt && typeof data.createdAt === 'object') {
          data.createdAt = (data.createdAt as any).toDate();
        }
        if (data.updatedAt && typeof data.updatedAt === 'object') {
          data.updatedAt = (data.updatedAt as any).toDate();
        }
        topics.push(data);
      });

      this.topicsSubject.next(topics);
      console.log('[TopicService] Loaded', topics.length, 'topics');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('[TopicService] Error loading topics:', errorMsg);
      this.errorSubject.next(errorMsg);
      throw error;
    } finally {
      this.loadingSubject.next(false);
    }
  }

  /**
   * Get topics by category
   */
  async getTopicsByCategory(category: TopicCategory): Promise<Topic[]> {
    try {
      const firestore = this.firebaseService.getFirestore();
      if (!firestore) {
        throw new Error('Firestore not initialized');
      }

      const topicsRef = collection(firestore, 'topics');
      const constraints: QueryConstraint[] = [where('category', '==', category)];
      const q = query(topicsRef, ...constraints);

      const snapshot = await getDocs(q);
      const topics: Topic[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data() as Topic;
        // Convert Firestore timestamps to Date objects
        if (data.createdAt && typeof data.createdAt === 'object') {
          data.createdAt = (data.createdAt as any).toDate();
        }
        if (data.updatedAt && typeof data.updatedAt === 'object') {
          data.updatedAt = (data.updatedAt as any).toDate();
        }
        topics.push(data);
      });

      return topics;
    } catch (error) {
      console.error('[TopicService] Error getting topics by category:', error);
      throw error;
    }
  }

  /**
   * Get a single topic by ID
   */
  async getTopicById(topicId: string): Promise<Topic | null> {
    try {
      const firestore = this.firebaseService.getFirestore();
      if (!firestore) {
        throw new Error('Firestore not initialized');
      }

      const topicRef = doc(firestore, 'topics', topicId);
      const snapshot = await getDoc(topicRef);

      if (snapshot.exists()) {
        const data = snapshot.data() as Topic;
        // Convert Firestore timestamps to Date objects
        if (data.createdAt && typeof data.createdAt === 'object') {
          data.createdAt = (data.createdAt as any).toDate();
        }
        if (data.updatedAt && typeof data.updatedAt === 'object') {
          data.updatedAt = (data.updatedAt as any).toDate();
        }
        return data;
      }

      return null;
    } catch (error) {
      console.error('[TopicService] Error getting topic by ID:', error);
      throw error;
    }
  }

  /**
   * Search topics by name (case-insensitive)
   */
  searchTopics(searchTerm: string): Topic[] {
    const lowerSearch = searchTerm.toLowerCase();
    return this.topics.filter(
      (topic) =>
        topic.name.toLowerCase().includes(lowerSearch) ||
        topic.description.toLowerCase().includes(lowerSearch)
    );
  }

  /**
   * Clear error state
   */
  clearError(): void {
    this.errorSubject.next(null);
  }
}
