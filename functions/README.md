# OneMinuteSkills Cloud Functions

Firebase Cloud Functions for AI-powered lesson generation using OpenAI.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure OpenAI API Key

Create a `.env` file in this directory (copy from `.env.example`):

```bash
cp .env.example .env
```

Add your OpenAI API key to `.env`:

```
OPENAI_API_KEY=sk-proj-your-actual-api-key-here
```

**Important**: Never commit `.env` to Git. It's in `.gitignore`.

### 3. Build

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `lib/` directory.

## Development

### Local Testing with Emulator

Start the Firebase emulator with functions:

```bash
firebase emulators:start --only functions,firestore
```

This starts:
- Functions emulator on `http://127.0.0.1:5001`
- Firestore emulator on `http://127.0.0.1:8080`
- Emulator UI on `http://127.0.0.1:4000`

### Functions Available

#### `generateDailyLesson`

Callable HTTP function to generate a single lesson.

**Request:**

```javascript
const functions = firebase.functions();
const generateDailyLesson = functions.httpsCallable('generateDailyLesson');

const response = await generateDailyLesson({
  topicId: 'technology',
  difficulty: 'beginner',
  skillId: 'web-development', // optional
  category: 'Technology' // optional
});

console.log(response.data);
// {
//   success: true,
//   lessonId: 'abc123',
//   message: 'Lesson generated successfully'
// }
```

**Parameters:**

- `topicId` (required): Topic ID (e.g., 'technology', 'business', 'health')
- `difficulty` (required): One of 'beginner', 'intermediate', 'advanced'
- `skillId` (optional): Specific skill to focus on
- `category` (optional): Category for organizing lessons

**Response:**

```typescript
{
  success: boolean;
  lessonId?: string;      // Firestore document ID if successful
  message?: string;       // Success message
  error?: string;         // Error message if failed
}
```

**Authentication**: Requires Firebase Authentication (user must be logged in)

## Project Structure

```
functions/
├── src/
│   ├── index.ts                  # Cloud Functions entry point
│   ├── generateLesson.ts         # Core lesson generation logic
│   ├── config.ts                 # Configuration & OpenAI setup
│   └── types/
│       └── lesson.types.ts       # TypeScript type definitions
├── lib/                          # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
├── .eslintrc.js
├── .env.example
└── .env                          # Local (not committed)
```

## Configuration

### `config.ts`

Key settings:

```typescript
GENERATION_CONFIG = {
  model: 'gpt-4o-mini',      // GPT-4o-mini for cost efficiency
  temperature: 0.7,           // Balanced creativity
  maxTokens: 1000,            // ~1-2 minute read
};

RATE_LIMITS = {
  maxRequestsPerHour: 10,
  maxRequestsPerDay: 50,
};
```

### `generateLesson.ts`

Core functions:

- `buildUserPrompt()` - Creates OpenAI prompt
- `generateLessonContent()` - Calls OpenAI API
- `validateAIResponse()` - Validates response structure
- `moderateContent()` - Checks for inappropriate content
- `storeLessonInFirestore()` - Saves lesson to Firestore

## API Costs

**OpenAI API (GPT-4o-mini):**

- Input: $0.15 / 1M tokens
- Output: $0.60 / 1M tokens
- **Per lesson**: ~$0.0045 (100 tokens input + 500 tokens output)

**Cloud Functions:**

- First 2M invocations/month: free
- Compute: Free for <400K GB-seconds/month
- Beyond free tier: Very low cost

**Monthly Budget:**

- 1,000 lessons: ~$5
- 10,000 lessons: ~$50

## Deployment

### Deploy to Production

```bash
# Set production API key
firebase functions:config:set openai.key="sk-proj-prod-key"

# Deploy
firebase deploy --only functions
```

### View Logs

```bash
# Real-time logs
firebase functions:log

# Filter by function
firebase functions:log --only generateDailyLesson
```

## Environment Variables

### Local Development (.env)

```
OPENAI_API_KEY=sk-proj-xxxxx
FIREBASE_PROJECT_ID=oneminuteskill-792b7
NODE_ENV=development
```

### Production (Firebase Config)

```bash
firebase functions:config:set \
  openai.key="sk-proj-xxxxx" \
  openai.model="gpt-4o-mini"
```

## Security

### API Key Management

- **Never commit `.env`** - Already in `.gitignore`
- Production keys stored in Firebase config
- Local keys only for development testing

### Firestore Rules

Lessons can only be written via Cloud Functions (Admin SDK):

```javascript
match /lessons/{lessonId} {
  allow read: if isAuthenticated();
  allow write: if false;  // Only Admin SDK
}
```

### Authentication

- All callable functions require user authentication
- Optional: Implement role-based access control for admin functions

## Troubleshooting

### "Error: OPENAI_API_KEY not found"

- Check `.env` file exists
- Verify API key is set: `echo $OPENAI_API_KEY`
- For production, check Firebase config: `firebase functions:config:get`

### "Error: Invalid API key"

- Verify key starts with `sk-proj-`
- Check key hasn't been revoked in OpenAI dashboard
- Ensure key has API usage enabled

### "Content flagged as inappropriate"

- Currently logs warning but allows generation (manual review recommended)
- Can be configured to reject flagged content
- Adjust moderation sensitivity in `generateLesson.ts`

### Function timeout (10 seconds)

- Increase timeout in `firebase.json` if needed
- Default: 60 seconds should be sufficient
- Check Cloud Functions logs for OpenAI API delays

## Testing

### Manual Testing

```bash
# Using Firebase CLI
firebase functions:call generateDailyLesson --data='{"topicId":"technology","difficulty":"beginner"}'
```

### Integration Testing

```bash
npm test
```

## Future Enhancements

1. **Scheduled Generation**: Daily auto-generation via Cloud Scheduler
2. **Batch Generation**: Generate multiple lessons in one call
3. **Content Review**: Approval workflow before publishing
4. **A/B Testing**: Compare AI-generated vs manual lessons
5. **Multi-language**: Support content in multiple languages
6. **Caching**: Cache common prompts and responses
7. **Analytics**: Track generation costs and performance metrics

## Resources

- [Firebase Cloud Functions Documentation](https://firebase.google.com/docs/functions)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Firebase Admin SDK](https://firebase.google.com/docs/database/admin/start)
