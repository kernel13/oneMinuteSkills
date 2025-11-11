#!/usr/bin/env ts-node
"use strict";
/**
 * Skills Seeding Script
 *
 * This script populates the Firestore 'skills' collection with initial skill data.
 * It can be run multiple times safely (idempotent).
 *
 * Usage:
 *   npm run seed:skills
 *
 * Environment Variables Required:
 *   - FIREBASE_PROJECT_ID (optional, defaults to 'oneminuteskill-dev')
 *   - GOOGLE_APPLICATION_CREDENTIALS (path to service account key)
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
let app;
if (process.env.FIRESTORE_EMULATOR_HOST) {
    console.log('🔧 Using Firestore Emulator:', process.env.FIRESTORE_EMULATOR_HOST);
    app = admin.initializeApp({
        projectId: projectId,
    });
}
else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.log('🔑 Using Service Account credentials');
    app = admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: projectId,
    });
}
else {
    console.log('📝 Using Application Default Credentials');
    app = admin.initializeApp({
        projectId: projectId,
    });
}
const db = admin.firestore();
// Color scheme by category
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
// Skills data to seed
const skillsData = [
    // General Concepts
    {
        id: 'devops',
        name: 'DevOps',
        description: 'Cultural and technical practices combining software development and IT operations for faster, more reliable software delivery.',
        category: skill_model_1.SkillCategory.GENERAL_CONCEPTS,
        difficulty: skill_model_1.SkillDifficulty.INTERMEDIATE,
        relatedTopics: ['technology', 'productivity'],
        icon: 'git-merge-outline',
        color: categoryColors[skill_model_1.SkillCategory.GENERAL_CONCEPTS],
        tags: ['methodology', 'culture', 'automation'],
        sortOrder: 1,
    },
    {
        id: 'computer-science-programming',
        name: 'Computer Science & Programming',
        description: 'Foundational concepts including algorithms, data structures, computational thinking, and software design principles.',
        category: skill_model_1.SkillCategory.GENERAL_CONCEPTS,
        difficulty: skill_model_1.SkillDifficulty.BEGINNER,
        relatedTopics: ['technology', 'science'],
        icon: 'code-slash-outline',
        color: categoryColors[skill_model_1.SkillCategory.GENERAL_CONCEPTS],
        tags: ['fundamentals', 'theory', 'algorithms'],
        sortOrder: 2,
    },
    {
        id: 'devsecops',
        name: 'DevSecOps',
        description: 'Integration of security practices within the DevOps process, ensuring security is built into every stage of software development.',
        category: skill_model_1.SkillCategory.GENERAL_CONCEPTS,
        difficulty: skill_model_1.SkillDifficulty.ADVANCED,
        relatedTopics: ['technology', 'security'],
        icon: 'shield-checkmark-outline',
        color: categoryColors[skill_model_1.SkillCategory.GENERAL_CONCEPTS],
        tags: ['security', 'automation', 'best-practices'],
        sortOrder: 3,
    },
    {
        id: 'test-driven-development',
        name: 'Test-Driven Development',
        description: 'Software development approach where tests are written before code, ensuring code quality and design through a test-first methodology.',
        category: skill_model_1.SkillCategory.GENERAL_CONCEPTS,
        difficulty: skill_model_1.SkillDifficulty.INTERMEDIATE,
        relatedTopics: ['technology', 'productivity'],
        icon: 'checkmark-done-circle-outline',
        color: categoryColors[skill_model_1.SkillCategory.GENERAL_CONCEPTS],
        tags: ['testing', 'methodology', 'quality'],
        sortOrder: 4,
    },
    {
        id: 'agile-scrum',
        name: 'Agile & Scrum Methodologies',
        description: 'Iterative project management and software development frameworks emphasizing flexibility, collaboration, and customer feedback.',
        category: skill_model_1.SkillCategory.GENERAL_CONCEPTS,
        difficulty: skill_model_1.SkillDifficulty.BEGINNER,
        relatedTopics: ['productivity', 'business'],
        icon: 'people-outline',
        color: categoryColors[skill_model_1.SkillCategory.GENERAL_CONCEPTS],
        tags: ['methodology', 'project-management', 'teamwork'],
        sortOrder: 5,
    },
    // Operating Systems
    {
        id: 'linux',
        name: 'Linux',
        description: 'Open-source Unix-like operating system widely used in servers, cloud infrastructure, and development environments.',
        category: skill_model_1.SkillCategory.OPERATING_SYSTEMS,
        difficulty: skill_model_1.SkillDifficulty.INTERMEDIATE,
        relatedTopics: ['technology'],
        icon: 'terminal-outline',
        color: categoryColors[skill_model_1.SkillCategory.OPERATING_SYSTEMS],
        tags: ['os', 'unix', 'server'],
        sortOrder: 10,
    },
    {
        id: 'windows',
        name: 'Windows',
        description: 'Microsoft operating system family widely used in enterprise environments and personal computing.',
        category: skill_model_1.SkillCategory.OPERATING_SYSTEMS,
        difficulty: skill_model_1.SkillDifficulty.BEGINNER,
        relatedTopics: ['technology'],
        icon: 'desktop-outline',
        color: categoryColors[skill_model_1.SkillCategory.OPERATING_SYSTEMS],
        tags: ['os', 'microsoft', 'enterprise'],
        sortOrder: 11,
    },
    // Programming Languages
    {
        id: 'java',
        name: 'Java',
        description: 'Object-oriented programming language known for "write once, run anywhere" capability, widely used in enterprise applications.',
        category: skill_model_1.SkillCategory.PROGRAMMING_LANGUAGES,
        difficulty: skill_model_1.SkillDifficulty.INTERMEDIATE,
        relatedTopics: ['technology'],
        icon: 'code-outline',
        color: categoryColors[skill_model_1.SkillCategory.PROGRAMMING_LANGUAGES],
        tags: ['language', 'oop', 'enterprise'],
        sortOrder: 20,
    },
    {
        id: 'go',
        name: 'Go',
        description: 'Fast, statically typed compiled language by Google, excellent for concurrent programming and cloud-native applications.',
        category: skill_model_1.SkillCategory.PROGRAMMING_LANGUAGES,
        difficulty: skill_model_1.SkillDifficulty.INTERMEDIATE,
        relatedTopics: ['technology'],
        icon: 'flash-outline',
        color: categoryColors[skill_model_1.SkillCategory.PROGRAMMING_LANGUAGES],
        tags: ['language', 'compiled', 'concurrent'],
        sortOrder: 21,
    },
    {
        id: 'python',
        name: 'Python',
        description: 'High-level, interpreted language known for readability and versatility in web development, data science, automation, and AI.',
        category: skill_model_1.SkillCategory.PROGRAMMING_LANGUAGES,
        difficulty: skill_model_1.SkillDifficulty.BEGINNER,
        relatedTopics: ['technology', 'science'],
        icon: 'logo-python',
        color: categoryColors[skill_model_1.SkillCategory.PROGRAMMING_LANGUAGES],
        tags: ['language', 'scripting', 'data-science'],
        sortOrder: 22,
    },
    {
        id: 'nodejs',
        name: 'Node.js',
        description: 'JavaScript runtime built on Chrome\'s V8 engine, enabling server-side JavaScript execution for scalable network applications.',
        category: skill_model_1.SkillCategory.PROGRAMMING_LANGUAGES,
        difficulty: skill_model_1.SkillDifficulty.INTERMEDIATE,
        relatedTopics: ['technology'],
        icon: 'logo-nodejs',
        color: categoryColors[skill_model_1.SkillCategory.PROGRAMMING_LANGUAGES],
        tags: ['runtime', 'javascript', 'backend'],
        sortOrder: 23,
    },
    {
        id: 'csharp',
        name: 'C#',
        description: 'Modern, object-oriented language developed by Microsoft, primary language for .NET framework and Unity game development.',
        category: skill_model_1.SkillCategory.PROGRAMMING_LANGUAGES,
        difficulty: skill_model_1.SkillDifficulty.INTERMEDIATE,
        relatedTopics: ['technology'],
        icon: 'code-working-outline',
        color: categoryColors[skill_model_1.SkillCategory.PROGRAMMING_LANGUAGES],
        tags: ['language', 'oop', 'dotnet'],
        sortOrder: 24,
    },
    {
        id: 'javascript',
        name: 'JavaScript',
        description: 'Essential web programming language for client-side interactivity, also used server-side with Node.js.',
        category: skill_model_1.SkillCategory.PROGRAMMING_LANGUAGES,
        difficulty: skill_model_1.SkillDifficulty.BEGINNER,
        relatedTopics: ['technology'],
        icon: 'logo-javascript',
        color: categoryColors[skill_model_1.SkillCategory.PROGRAMMING_LANGUAGES],
        tags: ['language', 'web', 'frontend'],
        sortOrder: 25,
    },
    // Web Technologies
    {
        id: 'html',
        name: 'HTML',
        description: 'HyperText Markup Language - standard markup language for creating web pages and web applications.',
        category: skill_model_1.SkillCategory.WEB_TECHNOLOGIES,
        difficulty: skill_model_1.SkillDifficulty.BEGINNER,
        relatedTopics: ['technology'],
        icon: 'logo-html5',
        color: categoryColors[skill_model_1.SkillCategory.WEB_TECHNOLOGIES],
        tags: ['markup', 'web', 'frontend'],
        sortOrder: 30,
    },
    {
        id: 'css',
        name: 'CSS',
        description: 'Cascading Style Sheets - style sheet language used for describing the presentation and design of web pages.',
        category: skill_model_1.SkillCategory.WEB_TECHNOLOGIES,
        difficulty: skill_model_1.SkillDifficulty.BEGINNER,
        relatedTopics: ['technology', 'design'],
        icon: 'logo-css3',
        color: categoryColors[skill_model_1.SkillCategory.WEB_TECHNOLOGIES],
        tags: ['styling', 'web', 'frontend'],
        sortOrder: 31,
    },
    {
        id: 'rest',
        name: 'REST',
        description: 'REpresentational State Transfer - architectural style for designing networked applications using HTTP methods.',
        category: skill_model_1.SkillCategory.WEB_TECHNOLOGIES,
        difficulty: skill_model_1.SkillDifficulty.INTERMEDIATE,
        relatedTopics: ['technology'],
        icon: 'swap-horizontal-outline',
        color: categoryColors[skill_model_1.SkillCategory.WEB_TECHNOLOGIES],
        tags: ['api', 'http', 'architecture'],
        sortOrder: 32,
    },
    {
        id: 'graphql',
        name: 'GraphQL',
        description: 'Query language for APIs providing a complete and understandable description of data, enabling efficient data fetching.',
        category: skill_model_1.SkillCategory.WEB_TECHNOLOGIES,
        difficulty: skill_model_1.SkillDifficulty.ADVANCED,
        relatedTopics: ['technology'],
        icon: 'git-network-outline',
        color: categoryColors[skill_model_1.SkillCategory.WEB_TECHNOLOGIES],
        tags: ['api', 'query', 'data'],
        sortOrder: 33,
    },
    {
        id: 'grpc',
        name: 'gRPC',
        description: 'High-performance, open-source RPC framework by Google using HTTP/2 and Protocol Buffers for efficient communication.',
        category: skill_model_1.SkillCategory.WEB_TECHNOLOGIES,
        difficulty: skill_model_1.SkillDifficulty.ADVANCED,
        relatedTopics: ['technology'],
        icon: 'pulse-outline',
        color: categoryColors[skill_model_1.SkillCategory.WEB_TECHNOLOGIES],
        tags: ['rpc', 'microservices', 'performance'],
        sortOrder: 34,
    },
    // CI/CD Tools
    {
        id: 'github-actions',
        name: 'GitHub Actions',
        description: 'CI/CD platform integrated with GitHub for automating build, test, and deployment workflows directly from repositories.',
        category: skill_model_1.SkillCategory.CI_CD_TOOLS,
        difficulty: skill_model_1.SkillDifficulty.INTERMEDIATE,
        relatedTopics: ['technology', 'productivity'],
        icon: 'logo-github',
        color: categoryColors[skill_model_1.SkillCategory.CI_CD_TOOLS],
        tags: ['ci-cd', 'automation', 'github'],
        sortOrder: 40,
    },
    {
        id: 'jenkins',
        name: 'Jenkins',
        description: 'Open-source automation server for building, testing, and deploying software with extensive plugin ecosystem.',
        category: skill_model_1.SkillCategory.CI_CD_TOOLS,
        difficulty: skill_model_1.SkillDifficulty.INTERMEDIATE,
        relatedTopics: ['technology'],
        icon: 'construct-outline',
        color: categoryColors[skill_model_1.SkillCategory.CI_CD_TOOLS],
        tags: ['ci-cd', 'automation', 'open-source'],
        sortOrder: 41,
    },
    {
        id: 'gitlab-ci',
        name: 'GitLab CI',
        description: 'Built-in continuous integration and deployment tool in GitLab for automated testing and delivery pipelines.',
        category: skill_model_1.SkillCategory.CI_CD_TOOLS,
        difficulty: skill_model_1.SkillDifficulty.INTERMEDIATE,
        relatedTopics: ['technology'],
        icon: 'logo-gitlab',
        color: categoryColors[skill_model_1.SkillCategory.CI_CD_TOOLS],
        tags: ['ci-cd', 'automation', 'gitlab'],
        sortOrder: 42,
    },
    {
        id: 'azure-devops',
        name: 'Azure DevOps',
        description: 'Microsoft\'s suite of development tools for planning, developing, delivering, and maintaining software with integrated CI/CD.',
        category: skill_model_1.SkillCategory.CI_CD_TOOLS,
        difficulty: skill_model_1.SkillDifficulty.INTERMEDIATE,
        relatedTopics: ['technology'],
        icon: 'cloud-upload-outline',
        color: categoryColors[skill_model_1.SkillCategory.CI_CD_TOOLS],
        tags: ['ci-cd', 'microsoft', 'devops'],
        sortOrder: 43,
    },
    // Cloud Platforms
    {
        id: 'aws',
        name: 'AWS',
        description: 'Amazon Web Services - comprehensive cloud computing platform offering compute, storage, databases, and 200+ services.',
        category: skill_model_1.SkillCategory.CLOUD_PLATFORMS,
        difficulty: skill_model_1.SkillDifficulty.INTERMEDIATE,
        relatedTopics: ['technology'],
        icon: 'cloud-outline',
        color: categoryColors[skill_model_1.SkillCategory.CLOUD_PLATFORMS],
        tags: ['cloud', 'amazon', 'infrastructure'],
        sortOrder: 50,
    },
    {
        id: 'azure',
        name: 'Azure',
        description: 'Microsoft\'s cloud computing platform providing IaaS, PaaS, and SaaS solutions with strong enterprise integration.',
        category: skill_model_1.SkillCategory.CLOUD_PLATFORMS,
        difficulty: skill_model_1.SkillDifficulty.INTERMEDIATE,
        relatedTopics: ['technology'],
        icon: 'cloud-outline',
        color: categoryColors[skill_model_1.SkillCategory.CLOUD_PLATFORMS],
        tags: ['cloud', 'microsoft', 'enterprise'],
        sortOrder: 51,
    },
    {
        id: 'gcp',
        name: 'Google Cloud Platform',
        description: 'Google\'s cloud computing services offering compute, storage, machine learning, and data analytics at scale.',
        category: skill_model_1.SkillCategory.CLOUD_PLATFORMS,
        difficulty: skill_model_1.SkillDifficulty.INTERMEDIATE,
        relatedTopics: ['technology'],
        icon: 'cloud-outline',
        color: categoryColors[skill_model_1.SkillCategory.CLOUD_PLATFORMS],
        tags: ['cloud', 'google', 'data'],
        sortOrder: 52,
    },
    // Infrastructure as Code
    {
        id: 'terraform',
        name: 'Terraform',
        description: 'Infrastructure as Code tool for building, changing, and versioning infrastructure safely and efficiently across multiple providers.',
        category: skill_model_1.SkillCategory.INFRASTRUCTURE_AS_CODE,
        difficulty: skill_model_1.SkillDifficulty.ADVANCED,
        relatedTopics: ['technology'],
        icon: 'layers-outline',
        color: categoryColors[skill_model_1.SkillCategory.INFRASTRUCTURE_AS_CODE],
        tags: ['iac', 'automation', 'multi-cloud'],
        sortOrder: 60,
    },
    // Containerization & Orchestration
    {
        id: 'docker',
        name: 'Docker',
        description: 'Platform for developing, shipping, and running applications in lightweight, portable containers ensuring consistency across environments.',
        category: skill_model_1.SkillCategory.CONTAINERIZATION,
        difficulty: skill_model_1.SkillDifficulty.INTERMEDIATE,
        relatedTopics: ['technology'],
        icon: 'cube-outline',
        color: categoryColors[skill_model_1.SkillCategory.CONTAINERIZATION],
        tags: ['containers', 'virtualization', 'deployment'],
        sortOrder: 70,
    },
    {
        id: 'kubernetes',
        name: 'Kubernetes',
        description: 'Open-source container orchestration platform automating deployment, scaling, and management of containerized applications.',
        category: skill_model_1.SkillCategory.CONTAINERIZATION,
        difficulty: skill_model_1.SkillDifficulty.ADVANCED,
        relatedTopics: ['technology'],
        icon: 'grid-outline',
        color: categoryColors[skill_model_1.SkillCategory.CONTAINERIZATION],
        tags: ['orchestration', 'containers', 'scaling'],
        sortOrder: 71,
    },
    // Security
    {
        id: 'ssl-tls',
        name: 'SSL/TLS',
        description: 'Cryptographic protocols providing secure communication over networks through encryption and authentication.',
        category: skill_model_1.SkillCategory.SECURITY,
        difficulty: skill_model_1.SkillDifficulty.INTERMEDIATE,
        relatedTopics: ['technology', 'security'],
        icon: 'lock-closed-outline',
        color: categoryColors[skill_model_1.SkillCategory.SECURITY],
        tags: ['encryption', 'certificates', 'https'],
        sortOrder: 80,
    },
    {
        id: 'ssh',
        name: 'SSH',
        description: 'Secure Shell protocol for secure remote login and command execution over unsecured networks using strong cryptography.',
        category: skill_model_1.SkillCategory.SECURITY,
        difficulty: skill_model_1.SkillDifficulty.INTERMEDIATE,
        relatedTopics: ['technology', 'security'],
        icon: 'key-outline',
        color: categoryColors[skill_model_1.SkillCategory.SECURITY],
        tags: ['remote-access', 'encryption', 'authentication'],
        sortOrder: 81,
    },
    {
        id: 'vpn',
        name: 'VPN',
        description: 'Virtual Private Network technology creating secure, encrypted connections over public networks for private communication.',
        category: skill_model_1.SkillCategory.SECURITY,
        difficulty: skill_model_1.SkillDifficulty.BEGINNER,
        relatedTopics: ['technology', 'security'],
        icon: 'shield-outline',
        color: categoryColors[skill_model_1.SkillCategory.SECURITY],
        tags: ['networking', 'encryption', 'privacy'],
        sortOrder: 82,
    },
    {
        id: 'encryption-basics',
        name: 'Encryption Basics',
        description: 'Fundamental concepts of cryptography including symmetric/asymmetric encryption, hashing, and digital signatures.',
        category: skill_model_1.SkillCategory.SECURITY,
        difficulty: skill_model_1.SkillDifficulty.BEGINNER,
        relatedTopics: ['technology', 'security'],
        icon: 'shield-checkmark-outline',
        color: categoryColors[skill_model_1.SkillCategory.SECURITY],
        tags: ['cryptography', 'security', 'fundamentals'],
        sortOrder: 83,
    },
    // Monitoring & Logging
    {
        id: 'prometheus',
        name: 'Prometheus',
        description: 'Open-source monitoring and alerting toolkit with powerful time-series database and flexible query language.',
        category: skill_model_1.SkillCategory.MONITORING_LOGGING,
        difficulty: skill_model_1.SkillDifficulty.INTERMEDIATE,
        relatedTopics: ['technology'],
        icon: 'analytics-outline',
        color: categoryColors[skill_model_1.SkillCategory.MONITORING_LOGGING],
        tags: ['monitoring', 'metrics', 'alerting'],
        sortOrder: 90,
    },
    {
        id: 'grafana',
        name: 'Grafana',
        description: 'Open-source analytics and visualization platform for creating dashboards and graphs from time-series data.',
        category: skill_model_1.SkillCategory.MONITORING_LOGGING,
        difficulty: skill_model_1.SkillDifficulty.INTERMEDIATE,
        relatedTopics: ['technology'],
        icon: 'bar-chart-outline',
        color: categoryColors[skill_model_1.SkillCategory.MONITORING_LOGGING],
        tags: ['visualization', 'dashboards', 'analytics'],
        sortOrder: 91,
    },
    {
        id: 'elk',
        name: 'ELK Stack',
        description: 'Elasticsearch, Logstash, and Kibana - powerful stack for searching, analyzing, and visualizing log data in real-time.',
        category: skill_model_1.SkillCategory.MONITORING_LOGGING,
        difficulty: skill_model_1.SkillDifficulty.ADVANCED,
        relatedTopics: ['technology'],
        icon: 'search-outline',
        color: categoryColors[skill_model_1.SkillCategory.MONITORING_LOGGING],
        tags: ['logging', 'search', 'analytics'],
        sortOrder: 92,
    },
    {
        id: 'splunk',
        name: 'Splunk',
        description: 'Enterprise platform for searching, monitoring, and analyzing machine-generated data for operational intelligence.',
        category: skill_model_1.SkillCategory.MONITORING_LOGGING,
        difficulty: skill_model_1.SkillDifficulty.ADVANCED,
        relatedTopics: ['technology'],
        icon: 'stats-chart-outline',
        color: categoryColors[skill_model_1.SkillCategory.MONITORING_LOGGING],
        tags: ['logging', 'analytics', 'enterprise'],
        sortOrder: 93,
    },
];
/**
 * Seeds the skills collection in Firestore
 */
async function seedSkills() {
    console.log('🌱 Starting skills seeding process...\n');
    const skillsCollection = db.collection('skills');
    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    for (const skillData of skillsData) {
        try {
            const skillRef = skillsCollection.doc(skillData.id);
            const skillDoc = await skillRef.get();
            const timestamp = admin.firestore.Timestamp.now();
            if (skillDoc.exists) {
                // Update existing skill (preserve usageCount and timestamps)
                const existingData = skillDoc.data();
                await skillRef.update({
                    name: skillData.name,
                    description: skillData.description,
                    category: skillData.category,
                    difficulty: skillData.difficulty,
                    relatedTopics: skillData.relatedTopics,
                    icon: skillData.icon,
                    color: skillData.color,
                    tags: skillData.tags || [],
                    sortOrder: skillData.sortOrder || 0,
                    updatedAt: timestamp,
                });
                console.log(`✏️  Updated: ${skillData.name} (${skillData.category})`);
                updatedCount++;
            }
            else {
                // Create new skill
                await skillRef.set({
                    ...skillData,
                    usageCount: 0,
                    isActive: true,
                    createdAt: timestamp,
                    updatedAt: timestamp,
                });
                console.log(`✅ Created: ${skillData.name} (${skillData.category})`);
                createdCount++;
            }
        }
        catch (error) {
            console.error(`❌ Error processing skill ${skillData.name}:`, error);
            skippedCount++;
        }
    }
    console.log('\n📊 Seeding Summary:');
    console.log(`   ✅ Created: ${createdCount}`);
    console.log(`   ✏️  Updated: ${updatedCount}`);
    console.log(`   ❌ Skipped: ${skippedCount}`);
    console.log(`   📦 Total: ${skillsData.length}`);
    console.log('\n✨ Skills seeding completed successfully!');
}
/**
 * Main execution
 */
async function main() {
    try {
        await seedSkills();
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Fatal error during seeding:', error);
        process.exit(1);
    }
}
// Run the script
main();
