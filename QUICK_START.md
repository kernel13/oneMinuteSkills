# OneMinuteSkill Implementation - Quick Start Guide

## File Structure

This project uses two main tracking files:

### 1. **IMPLEMENTATION_TASKS.md** (35 KB)
**Detailed task breakdown for all 10 phases**

Contains:
- ✅ Every single task with checkboxes
- 🧪 Validation tests for each phase
- 🧬 Unit test requirements
- 🔴 Critical warnings (especially Phase 8)
- 📋 Copy-paste ready code snippets
- 🎯 Success criteria for each phase

**Use this when**: You want detailed step-by-step instructions

---

### 2. **PROGRESS.md** (10 KB)
**High-level progress tracking dashboard**

Contains:
- 📊 Phase completion status
- ⏱️ Estimated duration per phase
- ✅ Key checkpoints
- 🚀 Critical success metrics
- 📝 Session notes template
- 🔗 Quick reference commands

**Use this when**: You want a quick overview or daily standup

---

## How to Use These Files

### Daily Workflow

1. **Start of day**:
   ```bash
   # Open PROGRESS.md
   # Update "Current Phase" and check what's completed
   # Review blockers from yesterday
   ```

2. **During implementation**:
   ```bash
   # Open IMPLEMENTATION_TASKS.md for current phase
   # Follow each task sequentially
   # Check off completed tasks
   # Run validation tests at end of phase
   ```

3. **End of day**:
   ```bash
   # Update PROGRESS.md "Session Notes"
   # Check off completed phases
   # List blockers for tomorrow
   # Update "Overall Progress" percentage
   ```

---

## Critical Reminders

### ⚠️ Phase 8 is CRITICAL
**This is where the error -201 issue occurs**

**DO NOT**:
- ❌ Import Capacitor plugins at the top of the file
- ❌ Call plugin methods without platform checks
- ❌ Forget dynamic imports for Phase 8

**DO**:
- ✅ Use `await import('@capacitor/...')`
- ✅ Check `this.platform.is('capacitor')` first
- ✅ Test extensively on iOS simulator

---

## Phase Dependencies

```
Phase 1: Firebase ← Required by ALL phases
    ↓
Phase 2: Auth ← Required by Phases 3-9
    ↓
Phase 3: Onboarding Topics ← Required by Phase 4
    ↓
Phase 4: Guard & Routing ← Required by Phases 5-9
    ↓
Phases 5-7: Can be done in any order
    ↓
Phase 8: Notifications ← CRITICAL - Test for error -201
    ↓
Phase 9: Seed Data ← Required for MVP testing
    ↓
Phase 10: AI (Optional) ← Can be deferred
```

**Bottom Line**: Do phases in order 1-9, then 10 if time allows

---

## Quick Test Checklist

After each phase, run these tests:

### Web Test
```bash
ionic serve
# Check: No console errors, feature works
```

### iOS Simulator Test (CRITICAL)
```bash
npm run build && npx cap sync ios && npx cap open ios
# Check: No error -201, feature works on device
```

### Code Quality
```bash
npm test                 # Unit tests pass
npm run lint            # No linting errors
```

---

## Common Commands

```bash
# Start development
ionic serve
ionic serve --lab                   # Side-by-side web/mobile preview

# Testing
npm test                            # Watch mode
npm test -- --watch=false          # Single run
npm run lint                        # ESLint check

# Building for iOS
npm run build
npx cap sync ios
npx cap open ios

# Building for Android
npx cap sync android
npx cap open android

# Firebase Emulator
firebase emulators:start --only auth,firestore,storage
```

---

## File Navigation

### To find detailed instructions:
1. Go to **IMPLEMENTATION_TASKS.md**
2. Search for your current phase (e.g., "Phase 5:")
3. Follow each task with checkboxes

### To check overall progress:
1. Go to **PROGRESS.md**
2. Look at "Overall Progress" bar
3. Check "Phase Summary" sections

### To see what to work on next:
1. Go to **PROGRESS.md**
2. Check "Next Immediate Steps"
3. Open IMPLEMENTATION_TASKS.md for that phase

---

## Tracking Progress

### Update Checklist in PROGRESS.md:
```markdown
### Phase 1: Firebase Foundation ⏳ PENDING → ✅ COMPLETE

- [x] Dependencies installed
- [x] Environment files created
- [x] Firebase service implemented
- [x] app.module.ts configured
- [x] Validation tests passed
- [x] Unit tests created and passing
```

### Update Overall Progress:
```
[████████░░░░░░░░░░░░░░░░░░░░░] 30% (3/10 phases complete)
```

### Add Session Notes:
```markdown
### Session 2: Nov 12, 2025
- [x] Completed Phase 1 (Firebase Foundation)
- [ ] Started Phase 2 (Authentication)
- Blocker: Firebase emulator connection on Android
- Tomorrow: Finish Auth service, start onboarding
```

---

## Success Criteria

You're done when ALL of these are true:

✅ **No error -201 on iOS** (anywhere, ever)
✅ **All 9 required phases complete** (Phase 10 optional)
✅ **Unit tests pass** (≥80% coverage)
✅ **ESLint 0 warnings**
✅ **Works on web, iOS, Android**
✅ **Full user flow** works: Onboarding → Lesson → XP → Profile
✅ **Firestore data** validates correctly
✅ **Clean codebase** (no unused code/imports)

---

## Troubleshooting Quick Links

### Error -201 on iOS
→ See Phase 8 section in IMPLEMENTATION_TASKS.md
→ Key: Use dynamic imports, not static imports

### Tests failing
→ Check Mock setup in IMPLEMENTATION_TASKS.md for each phase
→ Ensure Firestore/Auth mocks are configured

### Build errors
→ Run: `npm install` and `npx cap sync ios`
→ Check console for missing dependencies

### Firestore emulator not connecting
→ Ensure `firebase emulators:start` is running
→ Check environment.ts configuration

---

## Next Steps

1. **Read** IMPLEMENTATION_TASKS.md - Phase 1 section
2. **Install** dependencies as listed in Task 1.1
3. **Create** environment files as listed in Task 1.2
4. **Update** this README with session notes as you go
5. **Check** PROGRESS.md daily

**Estimated Time for Full Implementation**: 9-11 days
**Recommended Pace**: 1-2 phases per day (with validation testing)

---

Good luck! 🚀

Remember: **Test after EVERY phase**, especially Phase 8 for error -201!
