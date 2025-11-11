# OneMinuteSkill Implementation Tasks

**Project**: Fresh Ionic application migration from original codebase
**Location**: `/Users/stephanesop/Documents/dev/onMinuteSkills`
**Objective**: Implement features incrementally with validation tests at each step, avoiding error -201 and keeping codebase clean

---

## Phase 1: Firebase Foundation (Estimated: 1 day)

### Task 1.1: Install Dependencies
- [ ] Install `@angular/fire`
- [ ] Install `firebase`
- [ ] Verify installation: `npm list @angular/fire firebase`

### Task 1.2: Create Environment Files
- [ ] Create `src/environments/environment.ts` (development with emulators)
  - [ ] Configure Firebase credentials
  - [ ] Set `emulator.enabled = true`
  - [ ] Set platform-specific hosts (Android: 10.0.2.2, iOS/web: localhost)
- [ ] Create `src/environments/environment.prod.ts` (production)
- [ ] Create `src/environments/environment.test.ts` (testing)
- [ ] Update `angular.json` fileReplacements for environments

### Task 1.3: Implement Firebase Service
- [ ] Create `src/app/services/firebase.service.ts`
- [ ] Implement `initializeFirebase()` method
  - [ ] App initialization with timeout protection
  - [ ] Emulator connection logic (only in dev)
  - [ ] Platform-aware host detection (Android fix)
  - [ ] Error handling and logging
- [ ] Implement `isNativeApp()` using `Capacitor.isNativePlatform()`
- [ ] Add service to providers

### Task 1.4: Update app.module.ts
- [ ] Add Firebase providers:
  - [ ] `provideFirebaseApp()`
  - [ ] `provideAuth()`
  - [ ] `provideFirestore()`
  - [ ] `provideStorage()`
- [ ] **IMPORTANT**: Use function-based providers (avoid module-level calls)
- [ ] Configure emulator connections in providers
- [ ] Add `isNativeApp()` guard to prevent Capacitor calls on native

### Task 1.5: Validation Test - Firebase Setup
- [ ] **Test 1**: Run web app
  ```bash
  ionic serve
  ```
  - [ ] No console errors
  - [ ] Firebase connects successfully
  - [ ] Can see Firebase Emulator UI at http://localhost:4000

- [ ] **Test 2**: Build iOS
  ```bash
  npm run build && npx cap sync ios
  ```
  - [ ] Build succeeds
  - [ ] No Xcode build errors
  - [ ] No error -201 in output

- [ ] **Test 3**: Run iOS simulator
  ```bash
  npx cap open ios
  # Run in Xcode
  ```
  - [ ] App loads successfully
  - [ ] No blank white screen
  - [ ] No error -201 in Xcode console
  - [ ] Console shows "Firebase initialized"

- [ ] **Test 4**: Web - Verify Firestore connection
  - [ ] Open browser DevTools → Console
  - [ ] No Firebase connection errors
  - [ ] Can see emulator logs

### Task 1.6: Unit Tests - Firebase Service
- [ ] Create `src/app/services/firebase.service.spec.ts`
- [ ] Test `initializeFirebase()` initialization
- [ ] Test emulator connection logic
- [ ] Test platform detection (`isNativeApp()`)
- [ ] Test error handling
- [ ] Run tests: `npm test -- --include='**/firebase.service.spec.ts'`
- [ ] Verify all tests pass

---

## Phase 2: Authentication System (Estimated: 1 day)

### Task 2.1: Create User Model
- [ ] Create `src/app/models/user.model.ts`
- [ ] Define User interface with fields:
  - [ ] Auth: uid, email, displayName, photoURL, emailVerified, isAnonymous
  - [ ] Timestamps: createdAt, lastLoginAt
  - [ ] Gamification: currentStreak, longestStreak, totalXP, level
  - [ ] Preferences: preferredTopics[], preferredLanguage, notificationsEnabled, onboardingCompleted
  - [ ] Push: fcmTokens[]

### Task 2.2: Implement Auth Service
- [ ] Create `src/app/services/auth.service.ts`
- [ ] Import Capacitor (for platform detection): `import { Capacitor } from '@capacitor/core'`
- [ ] Implement `signInAnonymously()` method
  - [ ] Call Firebase `signInAnonymously()`
  - [ ] Create user profile in Firestore
  - [ ] Return UserCredential
  - [ ] Handle errors with console logging
- [ ] Implement `getCurrentUser()` method
  - [ ] Return `auth.currentUser`
- [ ] Implement `ensureAuthenticatedUser()` method
  - [ ] Check if `auth.currentUser` exists
  - [ ] If yes, return existing user
  - [ ] If no, wait for auth state with 8s timeout
  - [ ] If timeout, sign in anonymously
  - [ ] Ensure user profile exists in Firestore
- [ ] Implement `createUserProfile(user: FirebaseUser)` helper
  - [ ] Create document in `users/{uid}` collection
  - [ ] Set default values: level=1, totalXP=0, streaks=0, onboardingCompleted=false
  - [ ] Handle Firestore errors
- [ ] Add service to providers

### Task 2.3: Update app.component.ts
- [ ] Inject `AuthService`
- [ ] Call `authService.ensureAuthenticatedUser()` in `ngOnInit()`
- [ ] Handle errors gracefully with error logging
- [ ] Add comment explaining anonymous auth for onboarding

### Task 2.4: Validation Test - Authentication
- [ ] **Test 1**: Web - Anonymous user creation
  ```bash
  ionic serve
  ```
  - [ ] Open http://localhost:4000/auth (Firebase Emulator UI)
  - [ ] Verify anonymous user created in Authentication tab
  - [ ] Console shows "Anonymous user created"

- [ ] **Test 2**: Web - Firestore user document
  - [ ] Open http://localhost:4000/firestore (Firestore Emulator)
  - [ ] Navigate to `users` collection
  - [ ] Verify user document exists with correct fields
  - [ ] Verify `onboardingCompleted: false`

- [ ] **Test 3**: iOS simulator - NO ERROR -201
  ```bash
  npm run build && npx cap sync ios && npx cap open ios
  ```
  - [ ] App loads without error -201
  - [ ] No blank screen
  - [ ] Xcode console shows "Anonymous user created"
  - [ ] Search Xcode console for "-201" (should be empty)

- [ ] **Test 4**: Android emulator (if available)
  ```bash
  npm run build && npx cap sync android && npx cap open android
  ```
  - [ ] App loads successfully
  - [ ] No Firebase connection errors

### Task 2.5: Unit Tests - Auth Service
- [ ] Create `src/app/services/auth.service.spec.ts`
- [ ] Test `signInAnonymously()` method
  - [ ] Mock Firebase Auth
  - [ ] Verify user profile created
  - [ ] Verify returned UserCredential
- [ ] Test `getCurrentUser()` method
  - [ ] Mock auth.currentUser
  - [ ] Verify returns current user
- [ ] Test `ensureAuthenticatedUser()` method
  - [ ] Test case: user already exists (should return immediately)
  - [ ] Test case: no user, auth state resolves (should wait for user)
  - [ ] Test case: timeout with no user (should sign in anonymously)
  - [ ] Verify user profile created in each case
- [ ] Run tests: `npm test -- --include='**/auth.service.spec.ts'`
- [ ] Verify all tests pass

### Task 2.6: Code Cleanup
- [ ] Remove unused imports from app.module.ts
- [ ] Remove unused tab components (tab1, tab2, tab3 - will redesign later)
- [ ] Verify no ESLint warnings: `npm run lint`

---

## Phase 3: Onboarding Flow - Part 1 (Estimated: 1.5 days)

### Task 3.1: Create Topic Model and Service
- [ ] Create/update `src/app/models/lesson.model.ts`
- [ ] Define Topic interface:
  - [ ] id, name, description
  - [ ] icon, color
  - [ ] category, sortOrder
  - [ ] isActive, isFeatured
- [ ] Create `src/app/services/topic.service.ts`
- [ ] Define 10 default topics (Technology, Science, History, Arts, Business, Health, Sports, Literature, Psychology, Environment)
- [ ] Implement `getTopics()` method
  - [ ] Fetch from Firestore `topics` collection
  - [ ] Fallback to default topics if collection empty
  - [ ] Return Observable<Topic[]>
- [ ] Implement `getFeaturedTopics()` method
  - [ ] Return featured topics only
- [ ] Add service to providers

### Task 3.2: Create Onboarding Module and Pages
- [ ] Generate onboarding module:
  ```bash
  ionic g module pages/onboarding --routing
  ```
- [ ] Generate welcome page:
  ```bash
  ionic g page pages/onboarding/welcome --module=pages/onboarding --skip-import
  ```
- [ ] Generate topic-selection page:
  ```bash
  ionic g page pages/onboarding/topic-selection --module=pages/onboarding --skip-import
  ```
- [ ] Configure routing in `pages/onboarding/onboarding-routing.module.ts`:
  - [ ] Path: '', component: WelcomePage
  - [ ] Path: 'topics', component: TopicSelectionPage

### Task 3.3: Implement Welcome Page
- [ ] Create template:
  - [ ] Header: "Welcome to OneMinuteSkill"
  - [ ] Description text (1-2 sentences)
  - [ ] Animated icon/image
  - [ ] "Get Started" button
- [ ] Implement component logic:
  - [ ] Navigate to `./topics` on button click
  - [ ] Add comment explaining onboarding flow

### Task 3.4: Implement Topic Selection Page
- [ ] Inject TopicService
- [ ] Create template:
  - [ ] Header: "Choose Your Learning Topics"
  - [ ] Subtitle: "Select at least 3 topics"
  - [ ] Topic list with ion-checkbox for each
  - [ ] Selected count display
  - [ ] "Continue" button (disabled if < 3 topics selected)
- [ ] Implement component logic:
  - [ ] Load topics in `ngOnInit()` via TopicService
  - [ ] Track selected topics in `selectedTopics: Set<string>`
  - [ ] Implement toggle method
  - [ ] Validate minimum 3 topics
  - [ ] Store in session storage temporarily:
    ```typescript
    sessionStorage.setItem('selectedTopics', JSON.stringify(Array.from(this.selectedTopics)));
    ```
  - [ ] Navigate to next step on "Continue"
  - [ ] Handle loading and error states

### Task 3.5: Create Onboarding Service (Simplified)
- [ ] Create `src/app/services/onboarding.service.ts`
- [ ] Implement `saveTopicPreferences(topics: string[], userId: string)` method
  - [ ] Update user document in Firestore: `users/{uid}`
  - [ ] Set `preferredTopics: topics`
  - [ ] Return Observable<void>
  - [ ] Handle Firestore errors
- [ ] Implement `completeOnboarding(userId: string)` method
  - [ ] Update user document: `onboardingCompleted: true`
  - [ ] Update `lastOnboardingCompletedAt` timestamp
  - [ ] Return Observable<void>
- [ ] Add service to providers

### Task 3.6: Validation Test - Onboarding Flow (Part 1)
- [ ] **Test 1**: Web - Topic selection
  ```bash
  ionic serve
  ```
  - [ ] Welcome page displays
  - [ ] Click "Get Started" → navigate to topics
  - [ ] Can select/deselect topics
  - [ ] "Continue" button disabled until 3+ selected
  - [ ] Select 3 topics, click "Continue"
  - [ ] No console errors

- [ ] **Test 2**: Firestore - Topics saved
  - [ ] Open Firestore Emulator
  - [ ] Navigate to `users/{uid}`
  - [ ] Verify `preferredTopics` contains selected topics
  - [ ] Verify as array

- [ ] **Test 3**: iOS simulator - NO ERROR -201
  ```bash
  npm run build && npx cap sync ios && npx cap open ios
  ```
  - [ ] Welcome page displays
  - [ ] Navigate through onboarding
  - [ ] No error -201 in Xcode console
  - [ ] Topics save to Firestore

- [ ] **Test 4**: Topic Service fallback
  - [ ] Clear Firestore `topics` collection
  - [ ] Reload web app
  - [ ] Default topics still display
  - [ ] Service correctly falls back

### Task 3.7: Unit Tests - Onboarding
- [ ] Create `src/app/services/topic.service.spec.ts`
  - [ ] Test `getTopics()` with Firestore data
  - [ ] Test `getTopics()` fallback to defaults
  - [ ] Test `getFeaturedTopics()`
- [ ] Create `src/app/services/onboarding.service.spec.ts`
  - [ ] Test `saveTopicPreferences()`
  - [ ] Test `completeOnboarding()`
  - [ ] Mock Firestore updates
- [ ] Create `welcome.page.spec.ts`
  - [ ] Test navigation on button click
- [ ] Create `topic-selection.page.spec.ts`
  - [ ] Test topic loading from service
  - [ ] Test topic selection toggle
  - [ ] Test validation (min 3 topics)
  - [ ] Test "Continue" button enable/disable
- [ ] Run all tests: `npm test`
- [ ] Verify coverage ≥ 80%

### Task 3.8: Code Cleanup
- [ ] Remove unused imports
- [ ] Verify no ESLint warnings
- [ ] Verify no console errors in web app

---

## Phase 4: Onboarding Guard and Routing (Estimated: 0.5 days)

### Task 4.1: Create Onboarding Guard
- [ ] Generate guard:
  ```bash
  ionic g guard guards/onboarding
  ```
- [ ] Implement `CanActivateFn` or `CanActivate` interface
- [ ] Logic:
  - [ ] Inject AuthService and Router
  - [ ] Get current user with `authService.getCurrentUser()`
  - [ ] Check `user.onboardingCompleted`
  - [ ] If false → redirect to `/onboarding`
  - [ ] If true → allow access (return true)
  - [ ] Handle null user (shouldn't happen, but safety check)

### Task 4.2: Update Routing Configuration
- [ ] Update `src/app/app-routing.module.ts`
- [ ] Configure routes:
  ```
  '' → '/tabs'
  '/tabs' → with guard [OnboardingGuard]
  '/onboarding' → no guard (allow access)
  ```
- [ ] Add wildcard route: '**' → '/tabs'

### Task 4.3: Add Onboarding Completion Logic
- [ ] Update `topic-selection.page.ts`
- [ ] After saving topics, create new page: `notification-setup.page.ts`
  - [ ] Simple page with "Continue" button (skip notifications for now)
  - [ ] On click: call `onboardingService.completeOnboarding()`
  - [ ] Show loading spinner while saving
  - [ ] Navigate to `/tabs` on success
  - [ ] Handle errors with toast message

### Task 4.4: Validation Test - Guard and Routing
- [ ] **Test 1**: Fresh install - redirect to onboarding
  ```bash
  ionic serve
  # Clear localStorage
  localStorage.clear()
  # Reload
  ```
  - [ ] Redirected to `/onboarding`
  - [ ] Welcome page displays

- [ ] **Test 2**: Complete onboarding - access tabs
  - [ ] Go through welcome → topics → notification-setup
  - [ ] Click final "Continue"
  - [ ] Redirected to `/tabs`
  - [ ] Can navigate between tabs

- [ ] **Test 3**: Reload after completion
  - [ ] After onboarding, reload browser
  - [ ] Stay on `/tabs` (no redirect to `/onboarding`)

- [ ] **Test 4**: Manual Firestore flag change
  - [ ] Open Firestore Emulator
  - [ ] Edit user document: set `onboardingCompleted: false`
  - [ ] Reload web app
  - [ ] Redirected back to `/onboarding`

- [ ] **Test 5**: iOS simulator
  ```bash
  npm run build && npx cap sync ios && npx cap open ios
  ```
  - [ ] All routing works
  - [ ] No error -201

### Task 4.5: Unit Tests - Guard and Routing
- [ ] Create `src/app/guards/onboarding.guard.spec.ts`
  - [ ] Test allows access when `onboardingCompleted: true`
  - [ ] Test redirects when `onboardingCompleted: false`
  - [ ] Test null user handling
- [ ] Create `notification-setup.page.spec.ts`
  - [ ] Test completion flow
  - [ ] Test navigation to `/tabs`
- [ ] Run tests: `npm test`
- [ ] Verify all pass

---

## Phase 5: Daily Lesson Display (Estimated: 2 days)

### Task 5.1: Create Lesson Model and Service
- [ ] Update `src/app/models/lesson.model.ts`
- [ ] Define Lesson interface:
  - [ ] id, topic, title, content
  - [ ] date, xpReward
  - [ ] difficulty: 'beginner' | 'intermediate' | 'advanced'
  - [ ] estimatedReadTime (minutes)
  - [ ] tags: string[]
- [ ] Create `src/app/services/lesson.service.ts`
- [ ] Implement `getTodaysLesson()` method
  - [ ] Query Firestore `lessons` collection
  - [ ] Filter by today's date
  - [ ] Return first lesson
  - [ ] Fallback: return mock lesson if none found
  - [ ] Return Observable<Lesson>
- [ ] Implement `completeLesson(lessonId: string, userId: string)` method
  - [ ] Create document in `userProgress/{userId}_{lessonId}`
  - [ ] Set `completedAt: now()`, `xpEarned: lesson.xpReward`
  - [ ] Update user document: increment `totalXP`
  - [ ] Return Observable<void>
  - [ ] Handle errors
- [ ] Add service to providers

### Task 5.2: Create Mock Lesson Data
- [ ] In `lesson.service.ts`, define fallback mock lesson:
  ```typescript
  private mockLesson: Lesson = {
    id: 'mock-001',
    topic: 'Technology',
    title: 'The History of the Internet',
    content: '...(1-2 minute read)...',
    date: new Date(),
    xpReward: 10,
    difficulty: 'beginner',
    estimatedReadTime: 1,
    tags: ['technology', 'history', 'web']
  }
  ```

### Task 5.3: Redesign Tab1 as Home Page
- [ ] Update `src/app/tabs/tab1/tab1.page.ts`:
  - [ ] Rename or keep as home component
  - [ ] Remove placeholder "Explore Container"
  - [ ] Inject LessonService and AuthService
  - [ ] Load today's lesson in `ngOnInit()`
  - [ ] Track loading and error states
- [ ] Create comprehensive template:
  - [ ] Header section:
    - [ ] User greeting (Hi, {displayName}!)
    - [ ] Date display
  - [ ] Lesson card:
    - [ ] Topic badge (styled with color)
    - [ ] Lesson title
    - [ ] Content (scrollable, max height)
    - [ ] "Read Time: X minutes"
    - [ ] XP reward indicator (⭐ +10 XP)
  - [ ] Actions:
    - [ ] "Mark Complete" button (prominent)
    - [ ] "Share Lesson" button (secondary, for future)
  - [ ] Loading spinner while fetching
  - [ ] Error message if lesson fails to load

### Task 5.4: Implement Completion Flow
- [ ] In tab1 component:
  - [ ] Inject `LessonService`
  - [ ] Implement `markComplete()` method:
    - [ ] Show loading state on button
    - [ ] Call `lessonService.completeLesson(lessonId, userId)`
    - [ ] On success: show success toast "+10 XP 🎉"
    - [ ] Disable button (show "✓ Completed")
    - [ ] Update local XP display
    - [ ] Store completion status locally to persist across reloads
  - [ ] Handle errors: show error toast
  - [ ] Prevent double-submission (disable button)

### Task 5.5: Implement Streak Logic (Basic)
- [ ] In `lesson.service.ts`, add `updateStreak()` method:
  - [ ] Check `lastCompletedDate` in user document
  - [ ] If yesterday → increment `currentStreak`
  - [ ] If not yesterday → reset `currentStreak` to 1
  - [ ] Update `longestStreak` if current > longest
  - [ ] Call this in `completeLesson()`
- [ ] Return updated streak to component
- [ ] Display in success message: "+10 XP, Streak: 5 🔥"

### Task 5.6: Validation Test - Lesson Display
- [ ] **Test 1**: Web - Display lesson
  ```bash
  ionic serve
  ```
  - [ ] Home page (tab1) loads
  - [ ] Mock lesson displays (if no Firestore data)
  - [ ] All content readable
  - [ ] "Mark Complete" button visible
  - [ ] No console errors

- [ ] **Test 2**: Web - Complete lesson
  - [ ] Click "Mark Complete"
  - [ ] Show loading spinner briefly
  - [ ] Button disabled, shows "✓ Completed"
  - [ ] Toast shows "+10 XP"
  - [ ] XP display updated in header

- [ ] **Test 3**: Firestore - Progress saved
  - [ ] Open Firestore Emulator
  - [ ] Check `userProgress/{userId}_mock-001`
  - [ ] Verify `completedAt`, `xpEarned: 10`
  - [ ] Check user document: `totalXP` increased by 10

- [ ] **Test 4**: Web - Reload persistence
  - [ ] Reload page
  - [ ] Button still shows "✓ Completed"
  - [ ] XP persists
  - [ ] Check if stored in session/local storage

- [ ] **Test 5**: iOS simulator
  ```bash
  npm run build && npx cap sync ios && npx cap open ios
  ```
  - [ ] Lesson displays correctly
  - [ ] Complete lesson works
  - [ ] No error -201
  - [ ] XP updates in Firestore

- [ ] **Test 6**: Streak logic
  - [ ] Create second lesson (different ID, for next day testing)
  - [ ] Complete lesson 1 → streak = 1
  - [ ] Complete lesson 2 (mock date as tomorrow) → streak = 2
  - [ ] Verify in Firestore `user.currentStreak`

### Task 5.7: Unit Tests - Lesson Service
- [ ] Create `src/app/services/lesson.service.spec.ts`
  - [ ] Test `getTodaysLesson()` with Firestore data
  - [ ] Test `getTodaysLesson()` fallback to mock
  - [ ] Test `completeLesson()` creates progress document
  - [ ] Test `completeLesson()` increments XP
  - [ ] Test `updateStreak()` logic (consecutive, broken, first)
  - [ ] Mock Firestore operations
- [ ] Create `tab1.page.spec.ts`
  - [ ] Test lesson loading on init
  - [ ] Test "Mark Complete" button click
  - [ ] Test completion success flow
  - [ ] Test error handling
- [ ] Run tests: `npm test`
- [ ] Verify coverage ≥ 80%

---

## Phase 6: Gamification UI (Estimated: 1.5 days)

### Task 6.1: Create Gamification Service
- [ ] Create `src/app/services/gamification.service.ts`
- [ ] Implement helper methods:
  - [ ] `calculateLevel(totalXP: number): number`
    ```typescript
    // 100 XP per level: level = floor(XP / 100) + 1
    return Math.floor(totalXP / 100) + 1;
    ```
  - [ ] `getXPForNextLevel(currentLevel: number): number`
    ```typescript
    // Total XP needed for next level
    return currentLevel * 100;
    ```
  - [ ] `getXPProgress(totalXP: number): { current: number, next: number }`
    ```typescript
    // XP progress within current level
    const level = this.calculateLevel(totalXP);
    const previous = (level - 1) * 100;
    const next = level * 100;
    return { current: totalXP - previous, next: next - previous };
    ```
- [ ] Add service to providers

### Task 6.2: Add Stats Header to Home Page
- [ ] Update tab1 template:
  - [ ] Add stats header card above lesson:
    ```
    🔥 Streak: 5 days
    ⭐ Total XP: 230
    📊 Level 3
    ```
  - [ ] Style with ion-card, ion-grid for layout
  - [ ] Stats should update when lesson completed
- [ ] Update tab1 component:
  - [ ] Inject GameificationService
  - [ ] Load user stats: `authService.getCurrentUser()`
  - [ ] Calculate level: `gamificationService.calculateLevel(user.totalXP)`
  - [ ] Store in component properties: `streak`, `totalXP`, `level`
  - [ ] Update on `markComplete()`

### Task 6.3: Add XP Progress Bar
- [ ] Update tab1 template:
  - [ ] Add progress bar showing XP to next level
  - [ ] Display: "123/200 XP to next level"
  - [ ] Use ion-progress-bar component
- [ ] Calculate progress:
  - [ ] `gamificationService.getXPProgress(totalXP)`
  - [ ] Set progress bar value

### Task 6.4: Update Lesson Completion Success Message
- [ ] Enhance toast message on completion:
  - [ ] Show: "+10 XP"
  - [ ] Show: "Streak: 5 🔥"
  - [ ] Show: "Level up! You're now Level 3! 🎉" (if level increased)
  - [ ] Animate XP badge when lesson completed

### Task 6.5: Validation Test - Gamification UI
- [ ] **Test 1**: Web - Display stats
  ```bash
  ionic serve
  ```
  - [ ] Stats header displays: Streak, XP, Level
  - [ ] Values correct (from Firestore user document)
  - [ ] Progress bar visible and sized correctly

- [ ] **Test 2**: Web - Complete lesson, update stats
  - [ ] View initial stats
  - [ ] Complete lesson
  - [ ] Stats update immediately:
    - [ ] Streak increased (if conditions met)
    - [ ] Total XP increased by 10
    - [ ] Level recalculated
    - [ ] Progress bar updated

- [ ] **Test 3**: Web - Level up celebration
  - [ ] Complete lesson that brings XP to 100 (new level)
  - [ ] Success toast shows "Level up! You're now Level 2! 🎉"
  - [ ] Level badge updates

- [ ] **Test 4**: iOS simulator
  - [ ] All gamification UI displays and updates correctly
  - [ ] No error -201

- [ ] **Test 5**: Android emulator (if available)
  - [ ] Stats display and animations work

### Task 6.6: Unit Tests - Gamification
- [ ] Create `src/app/services/gamification.service.spec.ts`
  - [ ] Test `calculateLevel()`:
    - [ ] XP 0 → Level 1
    - [ ] XP 99 → Level 1
    - [ ] XP 100 → Level 2
    - [ ] XP 250 → Level 3
  - [ ] Test `getXPForNextLevel()`
  - [ ] Test `getXPProgress()`
    - [ ] Returns object with `current` and `next`
    - [ ] Values correct
- [ ] Create integration test:
  - [ ] Complete lesson → XP increases → Level recalculates
- [ ] Run tests: `npm test`
- [ ] Verify all pass

---

## Phase 7: Profile Page (Estimated: 1.5 days)

### Task 7.1: Redesign Tab3 as Profile Page
- [ ] Update tab3 component:
  - [ ] Remove placeholder
  - [ ] Inject AuthService, GameificationService
  - [ ] Load user data on init
- [ ] Create template with sections:
  - **Header**:
    - [ ] User avatar (if available) or initials badge
    - [ ] Display name
    - [ ] Email (if not anonymous)
  - **Statistics**:
    - [ ] Total XP
    - [ ] Current Streak
    - [ ] Longest Streak
    - [ ] Total lessons completed
    - [ ] Current level with bar
  - **Preferences**:
    - [ ] Selected topics (list)
    - [ ] Edit topics button
    - [ ] Notification toggle (on/off)
    - [ ] Daily reminder time display
  - **Account**:
    - [ ] Sign out button
    - [ ] Account type (Anonymous / Email)

### Task 7.2: Implement Settings Section
- [ ] Add "Edit Topics" button:
  - [ ] Click → navigate to topic-selection page with pre-selected topics
  - [ ] Modify service to support "edit mode"
- [ ] Add notification toggle:
  - [ ] Mock for now (no actual implementation)
  - [ ] Save preference to Firestore: `user.notificationsEnabled`
- [ ] Add daily reminder time display:
  - [ ] Show time if set (or "Not set")
  - [ ] For now, read-only (will implement time picker later)

### Task 7.3: Implement Sign Out
- [ ] Add sign out button:
  - [ ] Implement `authService.signOut()` method (if not exists)
  - [ ] Show confirmation dialog
  - [ ] Navigate to onboarding on success
  - [ ] Handle errors

### Task 7.4: Add Profile Link from Home
- [ ] Tab3 should be accessible from home page
- [ ] Verify tab navigation works
- [ ] Add profile icon to header (navigation)

### Task 7.5: Validation Test - Profile Page
- [ ] **Test 1**: Web - View profile
  ```bash
  ionic serve
  ```
  - [ ] Profile page loads
  - [ ] All stats display correctly
  - [ ] User info shows (name, email if not anonymous)
  - [ ] Selected topics list shows correct topics

- [ ] **Test 2**: Web - Edit settings
  - [ ] Toggle notifications on/off
  - [ ] Verify Firestore updates
  - [ ] Reload page → setting persists

- [ ] **Test 3**: Web - Edit topics
  - [ ] Click "Edit Topics"
  - [ ] Navigate to topic selection with pre-selected topics
  - [ ] Modify selection
  - [ ] Save and return to profile
  - [ ] Profile updates with new topics

- [ ] **Test 4**: Web - Sign out
  - [ ] Click sign out button
  - [ ] Confirm dialog
  - [ ] Redirected to onboarding
  - [ ] New anonymous user created

- [ ] **Test 5**: iOS simulator
  - [ ] All profile features work
  - [ ] No error -201

### Task 7.6: Unit Tests - Profile
- [ ] Create `tab3.page.spec.ts`
  - [ ] Test user data loading
  - [ ] Test settings toggle
  - [ ] Test topic editing navigation
  - [ ] Test sign out flow
- [ ] Run tests: `npm test`
- [ ] Verify all pass

---

## Phase 8: Local Notifications (Estimated: 1 day)

### **CRITICAL**: Dynamic Imports Required to Avoid Error -201

### Task 8.1: Create Notification Service (DYNAMIC IMPORTS ONLY)
- [ ] Create `src/app/services/notification.service.ts`
- [ ] **DO NOT import plugins at top level**:
  ```typescript
  // ❌ DON'T DO THIS:
  // import { LocalNotifications } from '@capacitor/local-notifications';

  // ✅ DO THIS (dynamic import):
  ```
- [ ] Implement methods with DYNAMIC imports:
  - [ ] `checkPermissions()`:
    ```typescript
    async checkPermissions(): Promise<boolean> {
      if (!this.platform.is('capacitor')) return false;
      const { LocalNotifications } = await import('@capacitor/local-notifications');
      const result = await LocalNotifications.checkPermissions();
      return result.display === 'granted';
    }
    ```
  - [ ] `requestPermissions()`:
    ```typescript
    async requestPermissions(): Promise<boolean> {
      if (!this.platform.is('capacitor')) return false;
      const { LocalNotifications } = await import('@capacitor/local-notifications');
      const result = await LocalNotifications.requestPermissions();
      if (result.display === 'granted') {
        // Show permission granted toast
      }
      return result.display === 'granted';
    }
    ```
  - [ ] `scheduleDailyReminder(time: string)`:
    ```typescript
    async scheduleDailyReminder(time: string): Promise<void> {
      if (!this.platform.is('capacitor')) return;
      const { LocalNotifications } = await import('@capacitor/local-notifications');

      const [hours, minutes] = time.split(':').map(Number);
      const scheduledTime = new Date();
      scheduledTime.setHours(hours, minutes, 0, 0);

      await LocalNotifications.schedule({
        notifications: [{
          id: 1,
          title: '🎓 Time to Learn!',
          body: 'Your daily lesson awaits',
          schedule: { at: scheduledTime, every: 'day' as any }
        }]
      });
    }
    ```
  - [ ] `cancelAllNotifications()`
- [ ] Add service to providers

### Task 8.2: Add Notification Setup to Profile
- [ ] Update tab3 (Profile page):
  - [ ] Add "Notification Settings" section
  - [ ] Add button: "Enable Notifications"
  - [ ] Show current status: "Enabled at 8:00 AM" or "Disabled"
- [ ] Implement click handler:
  - [ ] Call `notificationService.requestPermissions()`
  - [ ] If granted, show time picker
  - [ ] If denied, show helpful message
- [ ] Add time picker (ion-input type="time"):
  - [ ] Default: "08:00"
  - [ ] On change: call `scheduleDailyReminder(time)`
  - [ ] Save time to Firestore: `user.dailyReminderTime`

### Task 8.3: Validation Test - Notifications (CRITICAL - NO ERROR -201)
- [ ] **Test 1**: Web
  ```bash
  ionic serve
  ```
  - [ ] Notification settings section visible
  - [ ] "Enable Notifications" button clickable
  - [ ] No errors in console

- [ ] **Test 2**: iOS simulator - CRITICAL TEST FOR ERROR -201
  ```bash
  npm run build
  # Check console for errors
  npx cap sync ios
  # Check for build errors, look for error -201
  npx cap open ios
  ```
  - [ ] **CRITICAL**: Build completes WITHOUT error -201
  - [ ] **CRITICAL**: Xcode console has NO error -201 messages
  - [ ] App loads successfully
  - [ ] Profile page accessible
  - [ ] Notification settings visible
  - [ ] Click "Enable Notifications" → permission prompt
  - [ ] Grant permission → prompt closes
  - [ ] Time picker appears
  - [ ] Set time → notification scheduled

- [ ] **Test 3**: Android emulator (if available)
  - [ ] Same as iOS
  - [ ] Notification permission prompt appears

- [ ] **Test 4**: Search for -201 errors
  ```bash
  # In Xcode console, search for: -201
  # Should find ZERO results
  ```

### Task 8.4: Unit Tests - Notifications
- [ ] Create `src/app/services/notification.service.spec.ts`
  - [ ] Mock Capacitor platform check
  - [ ] Test `checkPermissions()` when platform is capacitor
  - [ ] Test `checkPermissions()` when platform is not capacitor (returns false)
  - [ ] Test `requestPermissions()` granted case
  - [ ] Test `requestPermissions()` denied case
  - [ ] Test dynamic import (verify plugin not loaded at module level)
  - [ ] **Important**: Mock `import()` to avoid actual plugin loading
- [ ] Create `tab3.page.spec.ts` (update with notification tests)
  - [ ] Test notification button click
  - [ ] Test time picker interaction
- [ ] Run tests: `npm test`
- [ ] Verify all pass

### Task 8.5: Code Cleanup
- [ ] Remove any old plugin imports from other files
- [ ] Verify no static Capacitor plugin imports exist
- [ ] Search codebase for patterns:
  ```bash
  grep -r "import.*from '@capacitor'" src/app/services/*.ts
  # Should show NO LOCAL-NOTIFICATIONS, PUSH-NOTIFICATIONS, etc.
  ```

---

## Phase 9: Firestore Seed Data (Estimated: 1 day)

### Task 9.1: Seed 10 Default Topics
- [ ] Create `scripts/seed-firestore.ts`
- [ ] Define 10 topics with all fields:
  ```
  Technology, Science, History, Arts, Business,
  Health, Sports, Literature, Psychology, Environment
  ```
- [ ] Each topic:
  - [ ] Unique ID
  - [ ] name, description
  - [ ] icon (emoji or icon name)
  - [ ] color (hex code)
  - [ ] category, sortOrder
  - [ ] isActive: true
  - [ ] isFeatured: varies
- [ ] Write topics to Firestore `topics` collection

### Task 9.2: Create Sample Lessons
- [ ] Define 7 sample lessons (one per week):
  - [ ] Each lesson:
    - [ ] topic (reference to topic ID)
    - [ ] title
    - [ ] content (1-2 minute read)
    - [ ] date (different dates for testing)
    - [ ] xpReward: 10
    - [ ] difficulty: varies
    - [ ] estimatedReadTime: 1-2
    - [ ] tags: array
- [ ] Write lessons to Firestore `lessons` collection

### Task 9.3: Update Topic Service
- [ ] Modify `getTopics()`:
  - [ ] First check Firestore `topics` collection
  - [ ] Only fallback to defaults if collection empty
  - [ ] Cache result locally (optional)

### Task 9.4: Update Lesson Service
- [ ] Modify `getTodaysLesson()`:
  - [ ] Query Firestore `lessons` collection
  - [ ] Filter by today's date
  - [ ] Return first matching lesson
  - [ ] Fallback to mock only if no lessons exist

### Task 9.5: Validation Test - Seed Data
- [ ] **Test 1**: Web - Run seed script
  ```bash
  ionic serve
  npm run seed
  # Or manually upload through Firestore Emulator UI
  ```
  - [ ] Script executes without errors
  - [ ] Check Firestore Emulator UI
  - [ ] `topics` collection has 10 documents
  - [ ] `lessons` collection has 7 documents

- [ ] **Test 2**: Web - Topic selection shows real topics
  ```bash
  ionic serve
  ```
  - [ ] Onboarding topic selection shows seeded topics
  - [ ] Can select and save
  - [ ] Firestore updates

- [ ] **Test 3**: Web - Home page shows real lesson
  - [ ] Home page loads lesson for today's date
  - [ ] If no lesson for today, shows mock
  - [ ] Can complete lesson
  - [ ] Progress saved to Firestore

- [ ] **Test 4**: iOS simulator
  - [ ] All features work with real data
  - [ ] No error -201

- [ ] **Test 5**: Verify all collections
  - [ ] Open Firestore Emulator
  - [ ] Check `topics`: 10 documents
  - [ ] Check `lessons`: 7 documents
  - [ ] Check `users`: user documents
  - [ ] Check `userProgress`: progress documents

### Task 9.6: Code Cleanup
- [ ] Remove mock lesson (update fallback to use seed data)
- [ ] Clean up any test data
- [ ] Verify no console errors

---

## Phase 10: AI Content Generation (OPTIONAL - Can Defer)

### Task 10.1: OpenAI Integration Setup
- [ ] Install OpenAI SDK: `npm install openai`
- [ ] Create Firebase Cloud Function: `firebase init functions`
- [ ] Create `functions/src/generateDailyLesson.ts`

### Task 10.2: Implement Lesson Generation Function
- [ ] Callable function that:
  - [ ] Takes topic and difficulty as input
  - [ ] Calls OpenAI API to generate 1-minute lesson
  - [ ] Stores result in Firestore `lessons` collection
  - [ ] Returns success/error

### Task 10.3: Schedule Daily Generation
- [ ] Set up Cloud Scheduler to trigger function daily
- [ ] Or manually call via admin endpoint

### Task 10.4: Validation Test - AI Generation
- [ ] Test function locally with emulator
- [ ] Test with real OpenAI API
- [ ] Verify generated lessons are quality

**NOTE**: This phase can be completed later once MVP is stable.

---

## Final Validation & Testing

### Comprehensive Test Suite (After All Phases)

- [ ] **Web Testing**:
  - [ ] Full user flow: Onboarding → Home → Profile → Settings
  - [ ] Complete multiple lessons
  - [ ] Edit preferences
  - [ ] No console errors
  - [ ] ESLint clean: `npm run lint`
  - [ ] All unit tests pass: `npm test`
  - [ ] Coverage ≥ 80%

- [ ] **iOS Simulator Testing** (CRITICAL):
  - [ ] **NO ERROR -201 anywhere in console**
  - [ ] Full user flow works
  - [ ] All pages load without blank screen
  - [ ] Notifications work
  - [ ] Data persists across app reloads
  - [ ] Build succeeds: `npm run build && npx cap sync ios`

- [ ] **Android Emulator Testing** (if available):
  - [ ] Full user flow works
  - [ ] No Firebase connection issues
  - [ ] Notifications work
  - [ ] Data syncs with Firestore

- [ ] **Firestore Validation**:
  - [ ] All collections present
  - [ ] Data structure matches models
  - [ ] User documents complete
  - [ ] Relationships correct

- [ ] **Code Quality**:
  - [ ] No unused imports
  - [ ] No commented-out code
  - [ ] No TODO comments (resolved)
  - [ ] ESLint: 0 warnings
  - [ ] TypeScript: strict mode, 0 errors
  - [ ] No dead code detected

---

## Success Criteria

✅ **All Requirements Met**:
- [ ] No error -201 on iOS
- [ ] All features functional on web, iOS, Android
- [ ] Unit tests pass with ≥80% coverage
- [ ] Codebase is clean (no unused code)
- [ ] Firestore data validates correctly
- [ ] User can complete full flow:
  1. Launch app
  2. Complete onboarding (choose 3+ topics)
  3. View daily lesson on home
  4. Complete lesson (earn XP, streak)
  5. View stats and profile
  6. Configure notifications
  7. App works on all platforms

---

## Progress Tracking

Update this file as you complete each task:
- [ ] = Not started
- [x] = Completed
- [~] = In progress

Keep notes in each section for blockers or issues encountered.
