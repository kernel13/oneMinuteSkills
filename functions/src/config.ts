/**
 * Configuration for OpenAI and Cloud Functions
 */

import * as dotenv from "dotenv";
import { OpenAI } from "openai";

// Load .env file for local development
dotenv.config();

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const GENERATION_CONFIG = {
  model: "gpt-4o-mini",
  temperature: 0.7,
  maxTokens: 1000,
  responseFormat: { type: "json_object" as const },
};

export const SYSTEM_PROMPT = `You are an expert educator creating bite-sized learning content for professionals.
Generate a 1-2 minute lesson following this exact JSON structure:

{
  "title": "Engaging, specific title (max 60 chars)",
  "description": "One-sentence summary (max 150 chars)",
  "content": "Main lesson content in Markdown (300-500 words)",
  "keyPoints": ["3-5 bullet points of key takeaways"],
  "examples": ["1-2 practical examples or code snippets"]
}

Requirements:
- Content must be accurate, beginner-friendly, and engaging
- Use clear language, avoid jargon unless explained
- Include real-world applications
- Format code examples in markdown code blocks
- Focus on practical understanding, not theory
- Return ONLY valid JSON, no additional text`;

export const RATE_LIMITS = {
  maxRequestsPerHour: 10,
  maxRequestsPerDay: 50,
};

export const FIRESTORE_CONFIG = {
  lessonsCollection: "lessons",
  topicsCollection: "topics",
  skillsCollection: "skills",
  usersCollection: "users",
};

// Calculate XP reward based on difficulty
export function getXpReward(difficulty: "beginner" | "intermediate" | "advanced"): number {
  const rewards = {
    beginner: 10,
    intermediate: 15,
    advanced: 20,
  };
  return rewards[difficulty];
}

// Calculate estimated time based on word count
export function estimateReadTime(content: string): number {
  const wordCount = content.split(/\s+/).length;
  const wordsPerMinute = 200;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}
