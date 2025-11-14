/**
 * TypeScript types for lesson generation
 */

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface GenerateLessonRequest {
  topicId: string;
  skillId?: string;
  difficulty: Difficulty;
  category?: string;
}

export interface GenerateLessonResponse {
  success: boolean;
  lessonId?: string;
  error?: string;
  tokensUsed?: number;
  cost?: number;
}

export interface AILessonContent {
  title: string;
  description: string;
  content: string;
  keyPoints: string[];
  examples: string[];
}

export interface FirestoreLesson {
  id?: string;
  title: string;
  description: string;
  content: string;
  skillId: string;
  topicId: string;
  category: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  xpReward: number;
  keyPoints: string[];
  examples: string[];
  isActive: boolean;
  sortOrder: number;
  createdAt: any; // Timestamp
  updatedAt: any; // Timestamp
  generatedBy: "openai" | "manual";
  model: "gpt-4o" | "gpt-4o-mini";
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface ContentModerationResult {
  flagged: boolean;
  categories: Record<string, boolean>;
}
