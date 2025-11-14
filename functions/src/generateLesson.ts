/**
 * Core lesson generation logic using OpenAI API
 */

import * as admin from "firebase-admin";
import { openai, GENERATION_CONFIG, SYSTEM_PROMPT, getXpReward, estimateReadTime } from "./config";
import {
  GenerateLessonRequest,
  AILessonContent,
  FirestoreLesson,
  ValidationResult,
  ContentModerationResult,
} from "./types/lesson.types";

/**
 * Build the user prompt for lesson generation
 */
export function buildUserPrompt(
  topic: string,
  difficulty: "beginner" | "intermediate" | "advanced",
  skill?: string
): string {
  const xpReward = getXpReward(difficulty);
  return `Generate a ${difficulty}-level lesson about ${topic}.
${skill ? `Focus specifically on: ${skill}` : ""}

Target audience: Professionals learning new skills in 1-2 minutes daily.
Estimated read time: 1-2 minutes
XP reward: ${xpReward}`;
}

/**
 * Validate AI-generated lesson content
 */
export async function validateAIResponse(content: AILessonContent): Promise<ValidationResult> {
  const errors: string[] = [];

  // Validate required fields
  if (!content.title || content.title.trim().length === 0) {
    errors.push("Title is required");
  }
  if (!content.description || content.description.trim().length === 0) {
    errors.push("Description is required");
  }
  if (!content.content || content.content.trim().length === 0) {
    errors.push("Content is required");
  }
  if (!Array.isArray(content.keyPoints) || content.keyPoints.length === 0) {
    errors.push("At least one key point is required");
  }
  if (!Array.isArray(content.examples) || content.examples.length === 0) {
    errors.push("At least one example is required");
  }

  // Validate content length
  const wordCount = content.content.split(/\s+/).length;
  if (wordCount < 200) {
    errors.push("Content is too short (minimum 200 words)");
  }
  if (wordCount > 1000) {
    errors.push("Content is too long (maximum 1000 words)");
  }

  // Validate title length
  if (content.title.length > 100) {
    errors.push("Title is too long (maximum 100 characters)");
  }

  // Validate description length
  if (content.description.length > 200) {
    errors.push("Description is too long (maximum 200 characters)");
  }

  // Validate keyPoints count
  if (content.keyPoints.length < 3 || content.keyPoints.length > 5) {
    errors.push("Key points should be between 3 and 5");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Check content for inappropriate material using OpenAI Moderation API
 */
export async function moderateContent(content: string): Promise<ContentModerationResult> {
  try {
    const result = await openai.moderations.create({
      input: content,
    });

    const moderation = result.results[0];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const categories = (moderation.categories || {}) as any;
    return {
      flagged: moderation.flagged,
      categories: categories as Record<string, boolean>,
    };
  } catch (error) {
    console.error("[Moderation] Error checking content:", error);
    // Return safe default on error
    return {
      flagged: false,
      categories: {},
    };
  }
}

/**
 * Generate lesson content using OpenAI API
 */
export async function generateLessonContent(
  topic: string,
  difficulty: "beginner" | "intermediate" | "advanced",
  skill?: string
): Promise<AILessonContent> {
  const userPrompt = buildUserPrompt(topic, difficulty, skill);

  console.log(`[GenerateLesson] Starting generation for topic: ${topic}, difficulty: ${difficulty}`);

  try {
    const completion = await openai.chat.completions.create({
      model: GENERATION_CONFIG.model,
      temperature: GENERATION_CONFIG.temperature,
      max_tokens: GENERATION_CONFIG.maxTokens,
      response_format: GENERATION_CONFIG.responseFormat,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const messageContent = completion.choices[0].message.content;
    if (!messageContent) {
      throw new Error("Empty response from OpenAI");
    }

    const aiContent: AILessonContent = JSON.parse(messageContent);

    // Validate response structure
    const validationResult = await validateAIResponse(aiContent);
    if (!validationResult.isValid) {
      throw new Error(`Validation failed: ${validationResult.errors.join(", ")}`);
    }

    // Check for inappropriate content
    const moderationResult = await moderateContent(
      `${aiContent.title} ${aiContent.description} ${aiContent.content}`
    );
    if (moderationResult.flagged) {
      console.warn("[GenerateLesson] Content flagged as inappropriate");
      // Don't throw - allow manual review, just log warning
    }

    console.log(`[GenerateLesson] Successfully generated content for ${topic}`);
    return aiContent;
  } catch (error) {
    console.error("[GenerateLesson] Error generating content:", error);
    throw error;
  }
}

/**
 * Store generated lesson in Firestore
 */
export async function storeLessonInFirestore(
  db: admin.firestore.Firestore,
  topic: string,
  difficulty: "beginner" | "intermediate" | "advanced",
  aiContent: AILessonContent,
  skillId?: string,
  category?: string
): Promise<string> {
  try {
    const lesson: Omit<FirestoreLesson, "id"> = {
      title: aiContent.title,
      description: aiContent.description,
      content: aiContent.content,
      skillId: skillId || topic.toLowerCase(),
      topicId: topic.toLowerCase(),
      category: category || topic,
      difficulty,
      estimatedMinutes: estimateReadTime(aiContent.content),
      xpReward: getXpReward(difficulty),
      keyPoints: aiContent.keyPoints,
      examples: aiContent.examples,
      isActive: true,
      sortOrder: Date.now(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      generatedBy: "openai",
      model: GENERATION_CONFIG.model as "gpt-4o" | "gpt-4o-mini",
    };

    const docRef = await db.collection("lessons").add(lesson);
    console.log(`[StoreLesson] Stored lesson with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error("[StoreLesson] Error storing lesson:", error);
    throw error;
  }
}

/**
 * Main function to generate and store a lesson
 */
export async function generateAndStoreLesson(
  request: GenerateLessonRequest
): Promise<{ success: boolean; lessonId?: string; error?: string }> {
  try {
    // Initialize Firestore
    if (!admin.apps.length) {
      admin.initializeApp();
    }
    const db = admin.firestore();

    // Generate content
    const aiContent = await generateLessonContent(
      request.topicId,
      request.difficulty,
      request.skillId
    );

    // Store in Firestore
    const lessonId = await storeLessonInFirestore(
      db,
      request.topicId,
      request.difficulty,
      aiContent,
      request.skillId,
      request.category
    );

    return {
      success: true,
      lessonId,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[GenerateAndStoreLesson] Failed:", errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}
