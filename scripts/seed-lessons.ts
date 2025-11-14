#!/usr/bin/env ts-node
/**
 * Lessons Seeding Script
 *
 * This script populates the Firestore 'lessons' collection with initial lesson data.
 * Lessons are seeded from the mock lessons data used in the app.
 * It can be run multiple times safely (idempotent).
 *
 * Usage:
 *   npm run seed:lessons
 *
 * Environment Variables:
 *   - FIREBASE_PROJECT_ID (optional, defaults to 'oneminuteskill-792b7')
 *   - FIRESTORE_EMULATOR_HOST (optional, for emulator usage)
 */

import * as admin from 'firebase-admin';

// Initialize Firebase Admin
const projectId = process.env['FIREBASE_PROJECT_ID'] || 'oneminuteskill-792b7';

let app: admin.app.App;
if (process.env['FIRESTORE_EMULATOR_HOST']) {
  console.log('🔧 Using Firestore Emulator:', process.env['FIRESTORE_EMULATOR_HOST']);
  app = admin.initializeApp({
    projectId: projectId,
  });
} else if (process.env['GOOGLE_APPLICATION_CREDENTIALS']) {
  console.log('🔑 Using Service Account credentials');
  app = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: projectId,
  });
} else {
  console.log('📝 Using Application Default Credentials');
  app = admin.initializeApp({
    projectId: projectId,
  });
}

const db = admin.firestore();

/**
 * Map lesson categories to topic IDs
 * Generic categories map to corresponding topic documents
 */
function getCategoryToTopicMapping(): Record<string, string> {
  return {
    TECHNOLOGY: 'technology',
    BUSINESS: 'business',
    HEALTH: 'health',
    PERSONAL_DEVELOPMENT: 'personal-development',
    SCIENCE: 'science',
    LANGUAGE: 'language',
    CREATIVITY: 'creativity',
    PRODUCTIVITY: 'productivity',
    FINANCE: 'finance',
    OTHER: 'other',
  };
}

/**
 * Convert lesson category to a valid topic ID
 */
function categoryToTopicId(category: string): string {
  const mapping = getCategoryToTopicMapping();
  return mapping[category as keyof typeof mapping] || 'other';
}

// Sample lesson data (from mock-lessons.ts - simplified inline to avoid module issues)
const SAMPLE_LESSONS = [
  {
    id: 'docker-basics',
    title: 'Docker Basics',
    description: 'Learn the fundamentals of containerization',
    content: 'Docker is a containerization platform...',
    skillId: 'docker-basics',
    category: 'TECHNOLOGY',
    difficulty: 'beginner',
    estimatedMinutes: 2,
    xpReward: 10,
    keyPoints: ['Containers isolate applications', 'Docker images are blueprints', 'Containers are lightweight'],
    examples: [],
    sortOrder: 1,
  },
  {
    id: 'git-version-control',
    title: 'Git Version Control',
    description: 'Master version control with Git',
    content: 'Git is a distributed version control system...',
    skillId: 'git-version-control',
    category: 'TECHNOLOGY',
    difficulty: 'beginner',
    estimatedMinutes: 2,
    xpReward: 10,
    keyPoints: ['Git tracks file changes', 'Commits create snapshots', 'Branches enable parallel work'],
    examples: [],
    sortOrder: 2,
  },
  {
    id: 'rest-apis',
    title: 'REST API Design',
    description: 'Build scalable REST APIs',
    content: 'REST APIs use HTTP methods for operations...',
    skillId: 'rest-apis',
    category: 'TECHNOLOGY',
    difficulty: 'intermediate',
    estimatedMinutes: 3,
    xpReward: 15,
    keyPoints: ['GET, POST, PUT, DELETE operations', 'Stateless communication', 'JSON responses'],
    examples: [],
    sortOrder: 3,
  },
  {
    id: 'typescript-intro',
    title: 'TypeScript Introduction',
    description: 'Start with TypeScript',
    content: 'TypeScript adds static typing to JavaScript...',
    skillId: 'typescript-intro',
    category: 'TECHNOLOGY',
    difficulty: 'intermediate',
    estimatedMinutes: 2,
    xpReward: 12,
    keyPoints: ['Static typing improves code quality', 'Interfaces define contracts', 'Compilation catches errors'],
    examples: [],
    sortOrder: 4,
  },
  {
    id: 'okrs-goal-setting',
    title: 'OKRs: Setting Goals',
    description: 'Learn goal-setting with OKRs',
    content: 'OKRs (Objectives and Key Results) help set and track goals...',
    skillId: 'okrs-goal-setting',
    category: 'BUSINESS',
    difficulty: 'beginner',
    estimatedMinutes: 2,
    xpReward: 10,
    keyPoints: ['Objectives define direction', 'Key Results measure success', 'Regular reviews drive progress'],
    examples: [],
    sortOrder: 1,
  },
  {
    id: 'product-strategy',
    title: 'Product Strategy',
    description: 'Build winning product strategies',
    content: 'Product strategy aligns team around market opportunities...',
    skillId: 'product-strategy',
    category: 'BUSINESS',
    difficulty: 'advanced',
    estimatedMinutes: 3,
    xpReward: 20,
    keyPoints: ['Customer needs drive strategy', 'Competitive analysis reveals opportunities', 'Execution matters'],
    examples: [],
    sortOrder: 2,
  },
];

/**
 * Seeds the lessons collection in Firestore
 */
async function seedLessons(): Promise<void> {
  console.log('🌱 Starting lessons seeding process...\n');

  const lessonsCollection = db.collection('lessons');
  const mockLessons = SAMPLE_LESSONS;
  let createdCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;

  for (const mockLesson of mockLessons) {
    try {
      const lessonRef = lessonsCollection.doc(mockLesson.id);
      const lessonDoc = await lessonRef.get();

      const timestamp = admin.firestore.Timestamp.now();
      const topicId = categoryToTopicId(mockLesson.category);

      // Prepare lesson data for Firestore
      const lessonData = {
        id: mockLesson.id,
        title: mockLesson.title,
        description: mockLesson.description,
        content: mockLesson.content,
        skillId: mockLesson.skillId || mockLesson.id,
        topicId: topicId,
        category: mockLesson.category,
        difficulty: mockLesson.difficulty || 'beginner',
        estimatedMinutes: mockLesson.estimatedMinutes || 1,
        xpReward: mockLesson.xpReward || 10,
        keyPoints: mockLesson.keyPoints || [],
        examples: mockLesson.examples || [],
        isActive: true,
        sortOrder: mockLesson.sortOrder || 0,
        updatedAt: timestamp,
      };

      if (lessonDoc.exists) {
        // Update existing lesson
        await lessonRef.update(lessonData);
        console.log(`✏️  Updated: ${mockLesson.title} (${mockLesson.category})`);
        updatedCount++;
      } else {
        // Create new lesson
        await lessonRef.set({
          ...lessonData,
          createdAt: timestamp,
        });
        console.log(`✅ Created: ${mockLesson.title} (${mockLesson.category})`);
        createdCount++;
      }
    } catch (error) {
      console.error(`❌ Error processing lesson ${mockLesson.title}:`, error);
      skippedCount++;
    }
  }

  console.log('\n📊 Lessons Seeding Summary:');
  console.log(`   ✅ Created: ${createdCount}`);
  console.log(`   ✏️  Updated: ${updatedCount}`);
  console.log(`   ❌ Skipped: ${skippedCount}`);
  console.log(`   📦 Total: ${mockLessons.length}`);
  console.log('\n✨ Lessons seeding completed successfully!');
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  try {
    await seedLessons();
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error during seeding:', error);
    process.exit(1);
  }
}

// Run the script
main();
