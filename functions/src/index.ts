/**
 * Firebase Cloud Functions for OneMinuteSkills
 * Exports lesson generation functions
 */

import * as functions from "firebase-functions";
import { generateAndStoreLesson } from "./generateLesson";
import { GenerateLessonRequest } from "./types/lesson.types";

/**
 * HTTP Callable function to generate a single lesson
 * Requires authentication
 *
 * Request payload:
 * {
 *   topicId: string (required) - e.g., "technology", "business"
 *   difficulty: "beginner" | "intermediate" | "advanced" (required)
 *   skillId?: string (optional)
 *   category?: string (optional)
 * }
 *
 * Response:
 * {
 *   success: boolean
 *   lessonId?: string (if successful)
 *   error?: string (if failed)
 * }
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generateDailyLesson = functions.https.onCall(async (request: any) => {
  // Extract data from request
  const data = request.data as GenerateLessonRequest;
  const auth = request.auth;

  // Verify authentication
  if (!auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated to generate lessons"
    );
  }

  // Validate request data
  if (!data.topicId) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "topicId is required"
    );
  }

  if (!["beginner", "intermediate", "advanced"].includes(data.difficulty)) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "difficulty must be beginner, intermediate, or advanced"
    );
  }

  // Log the request
  console.log("[generateDailyLesson] Called by user:", auth.uid);
  console.log("[generateDailyLesson] Request:", {
    topicId: data.topicId,
    difficulty: data.difficulty,
    skillId: data.skillId,
    category: data.category,
  });

  try {
    // Generate and store lesson
    const result = await generateAndStoreLesson(data);

    if (!result.success) {
      throw new functions.https.HttpsError(
        "internal",
        result.error || "Failed to generate lesson"
      );
    }

    console.log("[generateDailyLesson] Success! Lesson ID:", result.lessonId);
    return {
      success: true,
      lessonId: result.lessonId,
      message: "Lesson generated successfully",
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[generateDailyLesson] Error:", errorMessage);

    // Don't expose sensitive error details to client
    if (errorMessage.includes("API")) {
      throw new functions.https.HttpsError(
        "internal",
        "Error calling OpenAI API. Check function logs for details."
      );
    }

    throw new functions.https.HttpsError("internal", errorMessage);
  }
});

/**
 * OPTIONAL: Scheduled function to generate lessons daily
 * Schedule: 2:00 AM UTC daily
 * Uncomment to enable
 */
/*
export const scheduledLessonGeneration = functions
  .region("us-central1")
  .pubsub.schedule("0 2 * * *") // Daily at 2 AM UTC
  .timeZone("UTC")
  .onRun(async (context) => {
    console.log("[scheduledLessonGeneration] Starting daily lesson generation");

    const topics = ["technology", "business", "science", "health", "arts"];
    const difficulties: Array<"beginner" | "intermediate" | "advanced"> = [
      "beginner",
      "intermediate",
      "advanced",
    ];

    const generatedLessons = [];
    const failedTopics = [];

    for (const topic of topics) {
      // Randomly select difficulty
      const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];

      try {
        const result = await generateAndStoreLesson({
          topicId: topic,
          difficulty,
        });

        if (result.success) {
          generatedLessons.push({
            topic,
            difficulty,
            lessonId: result.lessonId,
          });
          console.log(`[scheduledLessonGeneration] Generated lesson for ${topic}`);
        } else {
          failedTopics.push({ topic, error: result.error });
          console.error(`[scheduledLessonGeneration] Failed for ${topic}:`, result.error);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        failedTopics.push({ topic, error: errorMessage });
        console.error(`[scheduledLessonGeneration] Error generating for ${topic}:`, error);
      }
    }

    console.log("[scheduledLessonGeneration] Summary:", {
      generated: generatedLessons.length,
      failed: failedTopics.length,
      lessons: generatedLessons,
      failures: failedTopics,
    });

    return {
      success: generatedLessons.length > 0,
      generatedCount: generatedLessons.length,
      failedCount: failedTopics.length,
    };
  });
*/
