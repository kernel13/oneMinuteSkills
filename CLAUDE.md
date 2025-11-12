# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**OneMinuteSkills** is an Ionic Angular mobile application (iOS, Android, Web) for learning bite-sized daily skills. The app features:
- Anonymous user authentication with Firebase
- Topic selection onboarding flow
- Daily lesson delivery system with XP rewards
- Gamification (streaks, levels, XP)
- User profiles with statistics
- Push notifications
- Firestore backend

### Key Stack
- **Framework**: Angular 20 + Ionic 8
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Mobile**: Capacitor 7 (iOS/Android)
- **Testing**: Jasmine/Karma with 80%+ coverage target
- **Build**: Angular CLI with separate dev/prod environments

## Critical Configuration

### Firebase Project ID Alignment
- **Environment Dev**: `projectId: 'oneminuteskill-792b7'` (src/environments/environment.ts)
- **Firebase CLI**: `oneminuteskill-792b7` (.firebaserc)
- **Emulator**: Runs with the same project ID
- **Note**: App and emulator MUST use identical project IDs for security rules evaluation

### Firestore Rules & Security
- **Location**: `firestore.rules` at project root
- **Load Path**: Configured in `firebase.json`
- **Collection Paths**:
  - `users/{userId}`: User profiles (owner access only)
  - `users/{userId}/preferences/{prefId}`: User preferences/onboarding
  - `user_lesson_progress/{progressId}`: Lesson completion tracking
  - `lessons/{lessonId}`: Public lesson content
  - `topics/{topicId}`: Public topic content
  - `skills/{skillId}`: Public skill metadata
  - `errorLogs/{logId}`: Error tracking (immutable)
  - `userActions/{actionId}`: Action audit logs (immutable)

### Firebase Emulator Setup
```bash
firebase emulators:start --only firestore,auth
# Emulator runs on: Firestore 127.0.0.1:8080, Auth 127.0.0.1:9099
# UI available at: http://127.0.0.1:4000
```

### Environment Variables
- **useEmulator**: true in dev (environment.ts), false in prod (environment.prod.ts)
- **Ports**: Auth (9099), Firestore (8080), Storage (9199)
- **Platform Detection**: Android emulator uses 10.0.2.2 for emulator host; iOS/Web use 127.0.0.1

## Build & Development Commands

### Development
```bash
npm start                          # Start dev server (ng serve)
ionic serve                        # Ionic-specific dev server
ionic serve --lab                  # Side-by-side web/mobile preview
npm run build                      # Production build
npm run build:dev                  # Development build
npm run build:prod                 # Production build with optimizations
npm run watch                      # Watch mode for development
```

### Testing & Quality
```bash
npm test                           # Karma with watch mode
npm test -- --watch=false        # Single run (CI mode)
npm run lint                       # ESLint check for errors

# TypeScript strict mode enforced via tsconfig.app.json
# ESLint rules in eslintrc.json (Angular/TypeScript specific)
```

### iOS/Android Native Builds
```bash
# iOS
npm run build && npx cap sync ios
npx cap open ios                   # Opens Xcode

# Android
npx cap sync android
npx cap open android               # Opens Android Studio

# Check for errors (especially error -201 on iOS):
# - Search Xcode console for "-201" after running app
# - This indicates Capacitor plugin static imports (dangerous pattern)
```

### Firebase Tools
```bash
firebase emulators:start --only firestore,auth
firebase deploy --only firestore:rules              # Deploy rules to project
```

### Database Seeding
```bash
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 node scripts/dist/scripts/seed-skills.js
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 node scripts/dist/scripts/seed-topics-from-skills.js
```

## Architecture & Patterns

### Service Layer Organization
**Location**: `src/app/services/`

**Core Services** (all decorated with `@Injectable({ providedIn: 'root' })`):
- **firebase.service.ts**: Firebase SDK initialization, emulator connection, multi-platform host detection
- **auth.service.ts**: Anonymous auth flow, user profile CRUD, auth state management (BehaviorSubject)
- **topic.service.ts**: Topic fetching and management
- **lesson.service.ts**: Daily lesson delivery, lesson completion tracking, XP calculations

**Key Patterns**:
- **RxJS BehaviorSubject**: For state management (currentUser$, authInitialized$)
- **Dependency Injection**: All services injected via constructor
- **Error Handling**: Try-catch in async operations, console.error logging
- **Multi-platform Support**: Platform checks via Ionic Platform service

### Model Layer Organization
**Location**: `src/app/models/`

**Core Models**:
- **user.model.ts**: User interface + createUser() factory, gamification fields (xp, level, streak)
- **lesson.model.ts**: Lesson interface + UserLessonProgress interface, difficulty helpers
- **topic.model.ts**: Topic interface + category enum
- **skill.model.ts**: Skill interface + SkillCategory/SkillDifficulty enums

**Key Patterns**:
- Factory functions (createUser(), createUserLessonProgress()) for object creation
- Type-safe enums for categories/difficulty
- Helper functions (getDifficultyColor(), getCategoryLabel()) for UI rendering

### Guard & Resolver Pattern
**Location**: `src/app/guards/`

- **onboarding.guard.ts**: Routes to onboarding if not complete (onboardingComplete flag)
- **onboarding.resolver.ts**: Pre-fetches topic data before navigation
- **main-app.guard.ts**: Ensures auth initialization before accessing main app
- Applied via Angular routing guards in routing modules

### State Management
**Pattern**: RxJS BehaviorSubject + async pipe in templates
- No NgRx/state library; BehaviorSubject provides sufficient state for MVP
- Services manage domain state (currentUser, authState, lessonData)
- Components subscribe via async pipe `{{ user$ | async }}`

### Authentication Flow
1. App init → FirebaseService initializes SDK
2. AuthService listens to onAuthStateChanged
3. If no user → signInAnonymously creates anonymous account
4. User profile created in Firestore with default values
5. currentUser$ BehaviorSubject updated for UI

### Lesson Completion Flow
1. User taps "Complete Lesson" button
2. LessonService.markLessonAsComplete() called with lessonId
3. Creates document in `user_lesson_progress` collection
4. Security rules validate: `request.resource.data.userId == request.auth.uid`
5. User stats updated (xp, level, streak, totalLessonsCompleted)
6. Completion is immutable (no delete allowed)

## Key Implementation Details

### Firebase Configuration
- **Project ID**: Must match across environment.ts, .firebaserc, and emulator launch
- **Web Config**: Placeholder values in environment.ts (apiKey, authDomain, etc.)
- **Emulator Connection**: connectFirestoreEmulator() + connectAuthEmulator() in firebase.service.ts
- **Long Polling**: experimentalForceLongPolling: true in Firestore initialization (emulator compatibility)

### Capacitor Plugin Integration
**Critical Pattern**: Dynamic imports only (NO static imports at module level)
```typescript
// ❌ NEVER do this - causes error -201 on iOS
import { LocalNotifications } from '@capacitor/local-notifications';

// ✅ ALWAYS do this - safe pattern
async requestPermissions(): Promise<boolean> {
  const { LocalNotifications } = await import('@capacitor/local-notifications');
  return true;
}
```

### Testing Strategy
**Test Structure**: Parallel .spec.ts files for each service/component
**Mocking**:
- Firebase: Mock Firestore with getDoc/setDoc stubs
- Auth: Mock Auth state directly
- Capacitor: Only required for platform-specific code
**Coverage Target**: 80% line coverage minimum

**Run Tests**:
```bash
npm test -- --watch=false          # CI mode with coverage
# Coverage report: karma-coverage (in browser)
```

### Error Handling & Logging
- **Console Methods**: console.error for errors, console.log for info
- **Error Messages**: Prefixed with service name: `[ServiceName] Error message`
- **Error Logs Collection**: Immutable errorLogs collection in Firestore
- **Stack Traces**: Included in error logs for debugging

## Code Organization Standards

### File Structure
```
src/
├── app/
│   ├── models/                    # Interfaces + factories
│   │   ├── user.model.ts
│   │   ├── lesson.model.ts
│   │   ├── topic.model.ts
│   │   └── skill.model.ts
│   ├── services/                  # Business logic
│   │   ├── firebase.service.ts
│   │   ├── auth.service.ts
│   │   ├── lesson.service.ts
│   │   └── *.spec.ts              # Unit tests
│   ├── guards/                    # Route guards & resolvers
│   │   ├── onboarding.guard.ts
│   │   └── *.spec.ts
│   ├── pages/                     # Components
│   │   ├── tabs/
│   │   └── onboarding/
│   └── app.module.ts              # Root module
├── environments/
│   ├── environment.ts             # Dev configuration
│   └── environment.prod.ts        # Prod configuration
└── global.scss                    # Global styles
```

### Naming Conventions
- **Services**: `feature.service.ts` (e.g., lesson.service.ts)
- **Models**: `feature.model.ts` (e.g., user.model.ts)
- **Guards**: `feature.guard.ts` (e.g., onboarding.guard.ts)
- **Components**: `feature.component.ts`
- **Tests**: `*.spec.ts` (parallel structure)
- **Classes**: PascalCase (LessonService, User)
- **Enums**: PascalCase, UPPER_SNAKE_CASE values (SkillCategory.TECHNOLOGY)
- **Properties**: camelCase for public, private prefixed with _

### TypeScript Strict Mode
- **Enforced**: tsconfig.app.json has strict mode enabled
- **No `any`**: Type all variables and parameters
- **Non-null assertions**: Use `!` sparingly, prefer null checks
- **Return types**: All functions must have explicit return types

### Angular Patterns
- **Dependency Injection**: Constructor injection only
- **OnDestroy**: Unsubscribe from observables in ngOnDestroy
- **ChangeDetection**: Default OnPush where possible
- **Async Pipe**: Prefer async pipe over subscriptions
- **Observables**: Use RxJS for async operations (no Promises)

## Common Development Tasks

### Adding a New Service
1. Create `src/app/services/feature.service.ts`
2. Add `@Injectable({ providedIn: 'root' })` decorator
3. Inject FirebaseService if needed
4. Create parallel `feature.service.spec.ts`
5. Add unit tests with mocks
6. Export from service index (if exists)

### Adding a Model
1. Create `src/app/models/feature.model.ts`
2. Define interface with all required fields
3. Add factory function `createFeature()` with defaults
4. Add helper functions if needed (getLabel(), getColor())
5. Create `.spec.ts` with basic tests

### Handling Firestore Operations
```typescript
// Reading
const userRef = doc(firestore, 'users', userId);
const userSnap = await getDoc(userRef);

// Writing
const progressRef = doc(firestore, 'user_lesson_progress', progressId);
await setDoc(progressRef, { userId, lessonId, ... }, { merge: true });

// Querying
const q = query(collection(firestore, 'lessons'), where('topicId', '==', topicId));
const docs = await getDocs(q);
```

### Testing Firestore Interactions
```typescript
// Mock getDoc
spyOn(firestore, 'doc').and.returnValue({
  // Mock reference
});
spyOn(firestore, 'getDoc').and.returnValue(Promise.resolve({
  exists: () => true,
  data: () => ({ id: 'test', ... })
}));
```

## Known Issues & Fixes

### Firebase Project ID Mismatch
**Symptom**: Permission-denied errors on lesson completion
**Root Cause**: App uses different project ID than Firebase emulator/rules
**Fix**: Update projectId in environment.ts and .firebaserc to match Firebase console project
**Validation**: `firebase emulators:start` output should show correct project

### Error -201 on iOS
**Symptom**: App crashes on iOS with error -201 in Xcode console
**Root Cause**: Capacitor plugins imported statically at module level
**Fix**: Use dynamic imports with async/await for all Capacitor plugin access
**Location**: Phase 8 (Notifications) uses this pattern
**Validation**: Search Xcode console for "-201"; if not found, fix worked

### Emulator Rules Not Loading
**Symptom**: All Firestore operations allowed (including invalid ones)
**Root Cause**: firebase.json not found or misconfigured
**Fix**: Ensure firebase.json in project root with proper firestore.rules path
**Validation**: Emulator logs should show "Firestore Rules loaded from firestore.rules"

## Testing Checklist

### Before Committing Code
- [ ] `npm test -- --watch=false` passes (all tests)
- [ ] `npm run lint` shows 0 warnings/errors
- [ ] TypeScript strict mode: 0 errors (verify in IDE)
- [ ] No unused imports or variables
- [ ] console.log() removed (except for debug tracking)

### Before Creating PR
- [ ] Web build works: `ionic serve`
- [ ] iOS simulator works: `npx cap open ios`
- [ ] No error -201 in Xcode console
- [ ] Firestore operations work in emulator
- [ ] No unit test skips (no `fit()`, `xit()`)

### Phase Validation
- [ ] Feature works end-to-end on web
- [ ] Feature works on iOS simulator (NO error -201)
- [ ] Feature works on Android (if available)
- [ ] Firestore data persists correctly
- [ ] Unit tests ≥80% coverage for new code

## Documentation Files

The project includes detailed implementation guides:
- **QUICK_START.md**: Getting started guide with common commands
- **IMPLEMENTATION_TASKS.md**: 10-phase breakdown with specific tasks and code snippets
- **PROGRESS.md**: Daily progress tracking with phase checklist
- **README_IMPLEMENTATION.md**: Comprehensive implementation overview

These files track the original 10-phase implementation plan. Current status: **Phase 5 complete** (Daily Lesson Display)

## Environment-Specific Behavior

### Development (useEmulator: true)
- Firebase emulator required: `firebase emulators:start --only firestore,auth`
- Long polling enabled for Firestore
- Cache disabled (avoid offline mode issues)
- Dynamic project ID resolution for platform (Android vs iOS/Web)

### Production (useEmulator: false)
- Connects to real Firebase project
- Cache enabled (50MB)
- Requires valid Firebase web config
- Same code, different environment.prod.ts

## Debugging Tips

### Firestore Issues
```bash
# Check Emulator UI
# Visit: http://127.0.0.1:4000/firestore
# Inspect collections, documents, rules

# Check Emulator Logs
tail -f firestore-debug.log

# Verify Rules Loaded
# Look for: "Firestore Rules loaded from firestore.rules"
```

### Auth Issues
```bash
# Check Firebase Console Auth tab (emulator)
# http://127.0.0.1:4000/auth
# Verify user created, UID matches app

# Check auth state in service
console.log('[AuthService]', this.currentUserSubject.value);
```

### Performance Profiling
```bash
# Angular DevTools in Chrome
# Check component hierarchy, change detection cycles

# Network tab
# Verify Firestore requests, response times
```

## Future Considerations

- **Phase 6-7**: Gamification UI + Profile page
- **Phase 8**: Notifications (critical - watch for error -201)
- **Phase 9**: Seed data (skills, topics, lessons)
- **Phase 10**: AI-generated lesson content (optional)
- **Offline Support**: Service workers for lesson caching
- **Analytics**: Firebase Analytics integration
- **Cloud Functions**: Automated notifications, data cleanup

## Version Lock Notes

- Angular 20 (modern, strong typing)
- Ionic 8 (stable, full Capacitor 7 support)
- Firebase 11.10 + AngularFire 20 (latest SDK)
- Capacitor 7 (iOS/Android native)
- TypeScript 5.8 (strict mode enforced)

These versions were selected for maximum compatibility and modern best practices.

## !IMPORTANT: Rule to follow during the development

1. In plan mode think through the problem, read the codebase for relevant files. The plan should alway includ the path to the file to be modified or created. The changes should be clear
2. before you begin working, check in with me and I will verify the plan
3. Please every step of the way just give me a high level of explaination 
4. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex chnages. Every change should impact as little code as possible. Everything is about simplicity
5. DO NOT BE LAZY. NEVER BE LAZY. IF THERE IS A BIG, FIND THE ROOT CAUSE END FIX IT. NO TEMPORARY FIXES. YOU ARE A SENIOR DEVELOPPER. NEVER BE LAZY
6. MAKE ALL FIXES AND CODE HCANGES AS SIMPLE AS HUMANLY POSSIBLE. THEY SHOULD ONLY IMPACT NECESSARY CODE RELEVANT TO THE TASK AND NOTHING ELSE. IT SHOULD IMPACT AS LITTLE CODE AS POSSIBLE. YOU GOAL IS TO NOT INTRODUCE ANY BUGS. IT'S ALL ABOUT SIMPLICITY.
