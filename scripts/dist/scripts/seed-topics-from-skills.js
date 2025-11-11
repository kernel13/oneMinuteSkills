#!/usr/bin/env ts-node
"use strict";
/**
 * Topics Seeding Script (from Skill Categories)
 *
 * This script generates topics from existing skill categories in Firestore.
 * Each SkillCategory becomes a Topic with matching colors and descriptions.
 *
 * Usage:
 *   # Compile
 *   ./node_modules/.bin/tsc scripts/seed-topics-from-skills.ts --module commonjs --target es2020 --moduleResolution node --esModuleInterop --skipLibCheck --outDir scripts/dist
 *
 *   # Run against emulator
 *   FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 node scripts/dist/scripts/seed-topics-from-skills.js
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const admin = __importStar(require("firebase-admin"));
const skill_model_1 = require("../src/app/models/skill.model");
// Initialize Firebase Admin
const projectId = process.env.FIREBASE_PROJECT_ID || 'oneminute-skill-dev';
if (process.env.FIRESTORE_EMULATOR_HOST) {
    console.log('🔧 Using Firestore Emulator:', process.env.FIRESTORE_EMULATOR_HOST);
    admin.initializeApp({ projectId });
}
else {
    console.log('📝 Using production Firebase');
    admin.initializeApp({ projectId });
}
const db = admin.firestore();
// Category colors (from seed-skills.ts)
const categoryColors = {
    [skill_model_1.SkillCategory.GENERAL_CONCEPTS]: '#6366f1', // Indigo
    [skill_model_1.SkillCategory.OPERATING_SYSTEMS]: '#8b5cf6', // Violet
    [skill_model_1.SkillCategory.PROGRAMMING_LANGUAGES]: '#ec4899', // Pink
    [skill_model_1.SkillCategory.WEB_TECHNOLOGIES]: '#f59e0b', // Amber
    [skill_model_1.SkillCategory.CI_CD_TOOLS]: '#10b981', // Emerald
    [skill_model_1.SkillCategory.CLOUD_PLATFORMS]: '#06b6d4', // Cyan
    [skill_model_1.SkillCategory.INFRASTRUCTURE_AS_CODE]: '#3b82f6', // Blue
    [skill_model_1.SkillCategory.CONTAINERIZATION]: '#14b8a6', // Teal
    [skill_model_1.SkillCategory.SECURITY]: '#ef4444', // Red
    [skill_model_1.SkillCategory.MONITORING_LOGGING]: '#f97316', // Orange
};
// Icon mapping for each category
const categoryIcons = {
    [skill_model_1.SkillCategory.GENERAL_CONCEPTS]: 'bulb-outline',
    [skill_model_1.SkillCategory.OPERATING_SYSTEMS]: 'desktop-outline',
    [skill_model_1.SkillCategory.PROGRAMMING_LANGUAGES]: 'code-slash-outline',
    [skill_model_1.SkillCategory.WEB_TECHNOLOGIES]: 'globe-outline',
    [skill_model_1.SkillCategory.CI_CD_TOOLS]: 'git-merge-outline',
    [skill_model_1.SkillCategory.CLOUD_PLATFORMS]: 'cloud-outline',
    [skill_model_1.SkillCategory.INFRASTRUCTURE_AS_CODE]: 'layers-outline',
    [skill_model_1.SkillCategory.CONTAINERIZATION]: 'cube-outline',
    [skill_model_1.SkillCategory.SECURITY]: 'shield-checkmark-outline',
    [skill_model_1.SkillCategory.MONITORING_LOGGING]: 'analytics-outline',
};
// Descriptions for each category
const categoryDescriptions = {
    [skill_model_1.SkillCategory.GENERAL_CONCEPTS]: 'Learn fundamental concepts and methodologies in software development and IT operations',
    [skill_model_1.SkillCategory.OPERATING_SYSTEMS]: 'Master operating systems used in enterprise and development environments',
    [skill_model_1.SkillCategory.PROGRAMMING_LANGUAGES]: 'Discover programming languages for modern software development',
    [skill_model_1.SkillCategory.WEB_TECHNOLOGIES]: 'Explore technologies for building modern web applications and APIs',
    [skill_model_1.SkillCategory.CI_CD_TOOLS]: 'Automate your build, test, and deployment processes with CI/CD tools',
    [skill_model_1.SkillCategory.CLOUD_PLATFORMS]: 'Learn cloud computing platforms for scalable infrastructure',
    [skill_model_1.SkillCategory.INFRASTRUCTURE_AS_CODE]: 'Define and manage infrastructure using code and automation',
    [skill_model_1.SkillCategory.CONTAINERIZATION]: 'Build and orchestrate containerized applications at scale',
    [skill_model_1.SkillCategory.SECURITY]: 'Secure your applications and infrastructure with best practices',
    [skill_model_1.SkillCategory.MONITORING_LOGGING]: 'Monitor and analyze system metrics and logs for insights',
};
/**
 * Generate topic ID from category name
 * Removes special characters that are invalid in Firestore document paths
 */
function generateTopicId(category) {
    return category
        .toLowerCase()
        .replace(/[&\/ ]/g, '-') // Replace &, /, and spaces with hyphens
        .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}
/**
 * Seeds the topics collection from skill categories
 */
async function seedTopics() {
    console.log('🌱 Generating topics from skill categories...\n');
    const categories = Object.values(skill_model_1.SkillCategory);
    let sortOrder = 1;
    let createdCount = 0;
    let updatedCount = 0;
    for (const category of categories) {
        try {
            const id = generateTopicId(category);
            const timestamp = admin.firestore.Timestamp.now();
            // Count skills in this category
            const skillsSnapshot = await db.collection('skills')
                .where('category', '==', category)
                .get();
            const skillCount = skillsSnapshot.size;
            const topicRef = db.collection('topics').doc(id);
            const topicDoc = await topicRef.get();
            const topicData = {
                name: category,
                description: categoryDescriptions[category],
                icon: categoryIcons[category],
                color: categoryColors[category],
                lessonsCount: skillCount,
                isActive: true,
                updatedAt: timestamp,
                category: category,
                sortOrder: sortOrder++,
                isFeatured: sortOrder <= 5, // First 5 are featured
            };
            if (topicDoc.exists) {
                // Update existing topic
                await topicRef.update(topicData);
                console.log(`✏️  Updated: ${category} (${skillCount} skills)`);
                updatedCount++;
            }
            else {
                // Create new topic
                await topicRef.set({
                    ...topicData,
                    createdAt: timestamp,
                });
                console.log(`✅ Created: ${category} (${skillCount} skills)`);
                createdCount++;
            }
        }
        catch (error) {
            console.error(`❌ Error processing category ${category}:`, error);
        }
    }
    console.log('\n📊 Topics Seeding Summary:');
    console.log(`   ✅ Created: ${createdCount}`);
    console.log(`   ✏️  Updated: ${updatedCount}`);
    console.log(`   📦 Total: ${categories.length}`);
    console.log('\n✨ Topics seeding completed successfully!');
}
/**
 * Main execution
 */
async function main() {
    try {
        await seedTopics();
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Fatal error during seeding:', error);
        process.exit(1);
    }
}
// Run the script
main();
