import { Lesson } from '../models/lesson.model';

/**
 * Mock Lesson Data
 * Sample lessons for development and testing
 */

export const MOCK_LESSONS: Lesson[] = [
  // TECHNOLOGY lessons
  {
    id: 'lesson-tech-001',
    title: 'What is Docker?',
    description: 'Learn the basics of containerization with Docker',
    content: `Docker is a containerization platform that allows you to package applications and their dependencies into isolated containers.

## Key Concepts
- **Container**: A lightweight, isolated environment for running applications
- **Image**: A blueprint for creating containers
- **Registry**: A repository for storing and sharing images

## Why Use Docker?
- Consistency across environments
- Easy scaling and deployment
- Reduced resource overhead compared to virtual machines`,
    skillId: 'skill-docker',
    topicId: 'topic-tech',
    category: 'TECHNOLOGY',
    difficulty: 'beginner',
    estimatedMinutes: 1,
    xpReward: 10,
    keyPoints: [
      'Docker containerizes applications for consistent deployment',
      'Images are templates; containers are running instances',
      'Docker simplifies environment setup across teams',
    ],
    examples: ['docker run -d nginx', 'docker build -t myapp .'],
    isActive: true,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  },
  {
    id: 'lesson-tech-002',
    title: 'Git Fundamentals',
    description: 'Master version control with Git basics',
    content: `Git is the most popular version control system for tracking changes in code.

## Core Concepts
- **Repository**: A directory with Git history
- **Commit**: A snapshot of your code at a point in time
- **Branch**: An isolated line of development
- **Merge**: Combining changes from different branches

## Essential Commands
- git init: Initialize a repository
- git add: Stage changes for commit
- git commit: Save changes with a message
- git push: Send commits to remote repository`,
    skillId: 'skill-git',
    topicId: 'topic-tech',
    category: 'TECHNOLOGY',
    difficulty: 'beginner',
    estimatedMinutes: 1,
    xpReward: 10,
    keyPoints: [
      'Git tracks code changes over time',
      'Commits create a history of your work',
      'Branches enable parallel development',
    ],
    examples: ['git commit -m "Add feature"', 'git push origin main'],
    isActive: true,
    createdAt: new Date('2025-01-02'),
    updatedAt: new Date('2025-01-02'),
  },
  {
    id: 'lesson-tech-003',
    title: 'REST API Design',
    description: 'Design scalable REST APIs with best practices',
    content: `REST (Representational State Transfer) is an architectural style for building web services.

## REST Principles
- **Resources**: Everything is a resource (users, posts, comments)
- **HTTP Methods**: GET (read), POST (create), PUT (update), DELETE (remove)
- **Stateless**: Each request contains all needed information
- **Standard Responses**: Use appropriate HTTP status codes

## API Endpoints
- GET /api/users: List all users
- GET /api/users/:id: Get specific user
- POST /api/users: Create new user
- PUT /api/users/:id: Update user`,
    skillId: 'skill-api',
    topicId: 'topic-tech',
    category: 'TECHNOLOGY',
    difficulty: 'intermediate',
    estimatedMinutes: 2,
    xpReward: 15,
    keyPoints: [
      'REST uses HTTP methods to perform operations on resources',
      'Use proper status codes (200, 404, 500, etc.)',
      'Design endpoints to be intuitive and consistent',
    ],
    examples: ['GET /api/products/123', 'POST /api/products with JSON body'],
    isActive: true,
    createdAt: new Date('2025-01-03'),
    updatedAt: new Date('2025-01-03'),
  },
  {
    id: 'lesson-tech-004',
    title: 'TypeScript Types Mastery',
    description: 'Advanced TypeScript type system techniques',
    content: `TypeScript extends JavaScript with a powerful type system for safer code.

## Type System Features
- **Interfaces**: Define object shapes
- **Generics**: Create reusable, type-safe components
- **Union Types**: Allow multiple possible types
- **Type Guards**: Narrow types at runtime

## Advanced Concepts
- Conditional Types: Types that depend on other types
- Mapped Types: Transform existing types
- Decorators: Modify classes and properties`,
    skillId: 'skill-typescript',
    topicId: 'topic-tech',
    category: 'TECHNOLOGY',
    difficulty: 'advanced',
    estimatedMinutes: 2,
    xpReward: 20,
    keyPoints: [
      'Interfaces define contracts for object shapes',
      'Generics create flexible, type-safe code',
      'Union and intersection types provide flexibility',
    ],
    examples: ['interface User { name: string }', 'function identity<T>(x: T): T'],
    isActive: true,
    createdAt: new Date('2025-01-04'),
    updatedAt: new Date('2025-01-04'),
  },

  // BUSINESS lessons
  {
    id: 'lesson-biz-001',
    title: 'Understanding OKRs',
    description: 'Learn how to set effective Objectives and Key Results',
    content: `OKR (Objectives and Key Results) is a goal-setting framework used by leading companies.

## OKR Structure
- **Objective**: A qualitative goal (where you want to go)
- **Key Results**: Measurable outcomes (how you know you got there)
- Usually 3-5 objectives per quarter with 3-4 key results each

## Benefits
- Focuses teams on what matters
- Provides alignment across organization
- Enables rapid iteration and learning

## Example OKR
Objective: "Become the most loved fitness app"
Key Results:
1. Increase daily active users from 100K to 500K
2. Improve app rating from 4.0 to 4.8 stars
3. Achieve 70% one-month retention rate`,
    skillId: 'skill-okr',
    topicId: 'topic-biz',
    category: 'BUSINESS',
    difficulty: 'beginner',
    estimatedMinutes: 2,
    xpReward: 15,
    keyPoints: [
      'OKRs align teams around ambitious but achievable goals',
      'Key Results must be measurable and time-bound',
      'OKRs are typically reviewed quarterly',
    ],
    examples: ['Objective: "Dominate enterprise market"', 'KR: "Acquire 100 Fortune 500 customers"'],
    isActive: true,
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-05'),
  },
  {
    id: 'lesson-biz-002',
    title: 'Product Strategy Basics',
    description: 'Build products customers love',
    content: `Product strategy defines the direction and goals of your product.

## Key Elements
- **Vision**: Long-term view of product's impact
- **Mission**: How you'll achieve the vision
- **Target Market**: Who you're building for
- **Value Proposition**: What makes you different

## Strategy Frameworks
- Jobs to be Done: What job does user hire product for?
- Blue Ocean: Create uncontested market space
- Platform Strategy: Build ecosystem of partners

## Execution
1. Define target customer and their problem
2. Design solution addressing that problem
3. Measure success with metrics
4. Iterate based on learning`,
    skillId: 'skill-product',
    topicId: 'topic-biz',
    category: 'BUSINESS',
    difficulty: 'intermediate',
    estimatedMinutes: 2,
    xpReward: 15,
    keyPoints: [
      'Product strategy aligns teams around customer value',
      'Know your target market and their specific problem',
      'Success metrics should link to business outcomes',
    ],
    examples: [
      'Airbnb: Let anyone host their home as accommodation',
      'Uber: Reliable transportation at the push of a button',
    ],
    isActive: true,
    createdAt: new Date('2025-01-06'),
    updatedAt: new Date('2025-01-06'),
  },

  // PRODUCTIVITY lessons
  {
    id: 'lesson-prod-001',
    title: 'Time Blocking 101',
    description: 'Master time blocking for peak productivity',
    content: `Time blocking is a scheduling technique where you divide your day into focused blocks of time.

## How Time Blocking Works
1. Identify your most important tasks
2. Allocate specific time blocks for each
3. During each block, focus exclusively on that task
4. Take short breaks between blocks

## Benefits
- Reduces decision fatigue (know what to work on)
- Minimizes context switching (stay in flow)
- Ensures important work gets done
- Creates sense of progress and accomplishment

## Best Practices
- Block your peak productivity hours for deep work
- Include breaks to maintain energy
- Leave buffer time for unexpected tasks
- Review and adjust your schedule weekly`,
    skillId: 'skill-timeblock',
    topicId: 'topic-prod',
    category: 'PRODUCTIVITY',
    difficulty: 'beginner',
    estimatedMinutes: 1,
    xpReward: 10,
    keyPoints: [
      'Time blocking gives structure to your day',
      'Focus on deep work during peak hours',
      'Include breaks and buffer time',
    ],
    examples: ['9-11am: Deep work on key project', '2-3pm: Meetings and email'],
    isActive: true,
    createdAt: new Date('2025-01-07'),
    updatedAt: new Date('2025-01-07'),
  },
  {
    id: 'lesson-prod-002',
    title: 'The Two-Minute Rule',
    description: 'Handle small tasks immediately to clear mental clutter',
    content: `The Two-Minute Rule is a simple productivity technique that can dramatically improve efficiency.

## The Rule
If a task takes less than 2 minutes to complete, do it immediately instead of adding it to your to-do list.

## Why It Works
- Prevents task list from becoming overwhelming
- Creates momentum with quick wins
- Avoids context-switching later
- Gives sense of immediate progress

## Examples
- Reply to a quick email: 1 minute
- File a document: 30 seconds
- Delete old files: 2 minutes
- Schedule a meeting: 2 minutes

## What to Avoid
- Don't use this for tasks requiring focus or thought
- Batch small tasks if they interrupt deep work
- Protect your flow state for important work`,
    skillId: 'skill-two-min',
    topicId: 'topic-prod',
    category: 'PRODUCTIVITY',
    difficulty: 'beginner',
    estimatedMinutes: 1,
    xpReward: 10,
    keyPoints: [
      'Two-Minute Rule eliminates small task clutter',
      'Do small tasks immediately to build momentum',
      'Protects focus time for important work',
    ],
    examples: ['Quick email reply', 'Filing a document', 'Scheduling a meeting'],
    isActive: true,
    createdAt: new Date('2025-01-08'),
    updatedAt: new Date('2025-01-08'),
  },

  // HEALTH lessons
  {
    id: 'lesson-health-001',
    title: 'The Power of Morning Routines',
    description: 'Set yourself up for success each day',
    content: `A consistent morning routine sets the tone for your entire day.

## Benefits of Morning Routines
- Establishes consistency and discipline
- Reduces decision fatigue
- Improves mental clarity and focus
- Boosts confidence and motivation

## Essential Elements
1. **Hydration**: Start with water to rehydrate
2. **Movement**: 10-30 minutes of exercise or stretching
3. **Mindfulness**: Meditation or journaling (5-10 minutes)
4. **Nutrition**: Healthy breakfast with protein
5. **Planning**: Review your day's priorities

## Building Your Routine
- Start small (even 10 minutes works)
- Build gradually, adding one element at a time
- Track your routine for 21 days to build habit
- Adjust based on what energizes you most

## Example 30-Minute Routine
- 5 min: Hydrate and light stretching
- 10 min: Meditation or journaling
- 10 min: Movement (walk, yoga, exercise)
- 5 min: Plan your day`,
    skillId: 'skill-morning',
    topicId: 'topic-health',
    category: 'HEALTH',
    difficulty: 'beginner',
    estimatedMinutes: 2,
    xpReward: 10,
    keyPoints: [
      'Morning routines create consistency and confidence',
      'Include movement, mindfulness, and nutrition',
      'Start small and build gradually over time',
    ],
    examples: [
      '5am: Wake up and hydrate',
      '5:10am: 15 min yoga',
      '5:25am: 10 min journaling',
    ],
    isActive: true,
    createdAt: new Date('2025-01-09'),
    updatedAt: new Date('2025-01-09'),
  },

  // PERSONAL DEVELOPMENT lessons
  {
    id: 'lesson-pd-001',
    title: 'Growth Mindset vs Fixed Mindset',
    description: 'Unlock your potential with a growth mindset',
    content: `Your mindset significantly impacts your ability to learn and achieve goals.

## Fixed Mindset
- Belief that abilities are fixed and unchangeable
- Avoids challenges (might expose limitations)
- Gives up easily when facing obstacles
- Ignores feedback or improvement opportunities
- Threatened by others' success

## Growth Mindset
- Belief that abilities can be developed through effort
- Embraces challenges as learning opportunities
- Persists through obstacles
- Learns from criticism and feedback
- Inspired by others' success

## How to Cultivate Growth Mindset
1. Replace "I can't do this" with "I can't do this yet"
2. View failures as learning opportunities
3. Embrace challenges and stretch goals
4. Learn from criticism instead of dismissing it
5. Celebrate effort, not just results

## Benefits
- Greater resilience and persistence
- Increased motivation and achievement
- Better relationships and collaboration
- Continuous learning and improvement`,
    skillId: 'skill-mindset',
    topicId: 'topic-pd',
    category: 'PERSONAL_DEVELOPMENT',
    difficulty: 'beginner',
    estimatedMinutes: 2,
    xpReward: 12,
    keyPoints: [
      'Growth mindset believes abilities can be developed',
      'Embrace challenges as opportunities to learn',
      'Failures and feedback are essential for growth',
    ],
    examples: [
      '"I can\'t do math" → "I can\'t do math YET"',
      'Failing a test → Understand material better next time',
    ],
    isActive: true,
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-10'),
  },

  // SCIENCE lessons
  {
    id: 'lesson-sci-001',
    title: 'The Scientific Method',
    description: 'Systematic approach to discovering knowledge',
    content: `The scientific method is a systematic process for investigating and understanding natural phenomena.

## Steps of the Scientific Method
1. **Observation**: Notice something in the world
2. **Question**: Ask "why?" or "how?" about it
3. **Hypothesis**: Make an educated guess (testable prediction)
4. **Experiment**: Design and conduct test
5. **Analysis**: Examine results and draw conclusions
6. **Communication**: Share findings with others

## Key Principles
- **Reproducibility**: Results can be repeated by others
- **Falsifiability**: Hypothesis can be proven wrong
- **Controlled Variables**: Change one thing at a time
- **Peer Review**: Others critique methodology and conclusions

## Real-World Example
1. Observation: Plants seem to grow toward light
2. Question: Do plants grow toward light?
3. Hypothesis: Plants will grow toward a light source
4. Experiment: Grow plants with light from one direction
5. Result: Plants bend toward the light (phototropism)`,
    skillId: 'skill-method',
    topicId: 'topic-sci',
    category: 'SCIENCE',
    difficulty: 'beginner',
    estimatedMinutes: 2,
    xpReward: 12,
    keyPoints: [
      'Scientific method is systematic process for discovery',
      'Must include testable hypothesis and experiment',
      'Results must be reproducible by others',
    ],
    examples: [
      'Testing if temperature affects reaction speed',
      'Examining if light color affects plant growth',
    ],
    isActive: true,
    createdAt: new Date('2025-01-11'),
    updatedAt: new Date('2025-01-11'),
  },

  // LANGUAGE lessons
  {
    id: 'lesson-lang-001',
    title: 'Language Learning Hacks',
    description: 'Learn languages faster with proven techniques',
    content: `Learning a new language is one of the most rewarding challenges. Here are proven strategies.

## Most Effective Techniques
1. **Immersion**: Consume media in target language (movies, podcasts, books)
2. **Active Speaking**: Practice conversation early and often
3. **Spaced Repetition**: Review vocabulary at optimal intervals
4. **Context Learning**: Learn words in meaningful contexts, not isolation
5. **Teach Others**: Explaining to others solidifies your understanding

## Daily Habits for Fluency
- 15-30 minutes daily beats occasional long sessions
- Mix listening, speaking, reading, writing
- Focus on high-frequency words first (80/20 rule)
- Use language in real conversations or writing

## Resources
- Language exchange partners: Practice with natives
- Apps: Duolingo, Anki, Memrise for vocabulary
- Media: Movies, podcasts, YouTube in target language
- Classes: Online tutors for structured learning

## Mindset Tips
- Accept making mistakes (they're learning)
- Celebrate small progress and wins
- Find content you enjoy in target language
- Connect with community of learners`,
    skillId: 'skill-language',
    topicId: 'topic-lang',
    category: 'LANGUAGE',
    difficulty: 'beginner',
    estimatedMinutes: 2,
    xpReward: 12,
    keyPoints: [
      'Immersion and active practice are most effective',
      'Consistency beats intensity (daily > occasional)',
      'Learn high-frequency words first for quick progress',
    ],
    examples: [
      'Watch movies in Spanish with subtitles',
      'Find language exchange partner on Tandem app',
    ],
    isActive: true,
    createdAt: new Date('2025-01-12'),
    updatedAt: new Date('2025-01-12'),
  },

  // FINANCE lessons
  {
    id: 'lesson-fin-001',
    title: 'Personal Finance 101',
    description: 'Take control of your financial future',
    content: `Financial literacy is one of the most valuable skills you can develop.

## Core Concepts
- **Income**: Money coming in (salary, investments, business)
- **Expenses**: Money going out (living costs, subscriptions)
- **Savings**: Income minus expenses
- **Investments**: Using savings to grow wealth

## Creating a Budget
1. Track all income and expenses for a month
2. Categorize: Housing, food, transport, entertainment, etc.
3. Identify areas to reduce spending
4. Allocate savings to investments or emergency fund
5. Review monthly and adjust as needed

## 50/30/20 Rule
- 50%: Essential needs (housing, food, utilities)
- 30%: Wants (entertainment, dining out)
- 20%: Savings and debt repayment

## Building Wealth
1. Create emergency fund (3-6 months expenses)
2. Pay off high-interest debt
3. Invest for long-term growth (stocks, bonds, real estate)
4. Increase income through skills and career growth
5. Minimize expenses through smart spending`,
    skillId: 'skill-finance',
    topicId: 'topic-fin',
    category: 'FINANCE',
    difficulty: 'beginner',
    estimatedMinutes: 2,
    xpReward: 12,
    keyPoints: [
      'Budget = Income - Expenses, with clear categories',
      'Use 50/30/20 rule for balanced spending',
      'Build emergency fund before investing',
    ],
    examples: ['Monthly budget: $4000 income, $2000 rent, $800 food', '50/30/20 allocation: $2k needs, $1.2k wants, $800 savings'],
    isActive: true,
    createdAt: new Date('2025-01-13'),
    updatedAt: new Date('2025-01-13'),
  },
];

/**
 * Get all mock lessons
 */
export function getAllMockLessons(): Lesson[] {
  return MOCK_LESSONS;
}

/**
 * Get lessons by category
 */
export function getMockLessonsByCategory(category: string): Lesson[] {
  return MOCK_LESSONS.filter((lesson) => lesson.category === category);
}

/**
 * Get lesson by ID
 */
export function getMockLessonById(id: string): Lesson | undefined {
  return MOCK_LESSONS.find((lesson) => lesson.id === id);
}

/**
 * Get lessons by difficulty
 */
export function getMockLessonsByDifficulty(
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): Lesson[] {
  return MOCK_LESSONS.filter((lesson) => lesson.difficulty === difficulty);
}

/**
 * Get random lesson
 */
export function getRandomMockLesson(): Lesson {
  const randomIndex = Math.floor(Math.random() * MOCK_LESSONS.length);
  return MOCK_LESSONS[randomIndex];
}

/**
 * Get lessons for today (simple daily rotation)
 * Returns a lesson based on day of week
 */
export function getDailyMockLesson(): Lesson {
  const dayOfWeek = new Date().getDay();
  const lessonIndex = dayOfWeek % MOCK_LESSONS.length;
  return MOCK_LESSONS[lessonIndex];
}
