# Task: Fix Database ID in Seed Scripts

## Problem
The seed scripts have hardcoded default project ID `'oneminute-skill-dev'` but should use `'oneminuteskill-792b7'`.

## Solution Plan

### Step 1: Update seed-skills.ts
- [ ] Change line 20 from `'oneminute-skill-dev'` to `'oneminuteskill-792b7'`
- Reason: Scripts must use correct Firebase project ID

### Step 2: Update seed-topics-from-skills.ts
- [ ] Change line 20 from `'oneminute-skill-dev'` to `'oneminuteskill-792b7'`
- Reason: Scripts must use correct Firebase project ID

### Step 3: Re-compile and Execute Scripts
- [ ] Compile both TypeScript files
- [ ] Execute seed-skills.js with correct project ID
- [ ] Execute seed-topics-from-skills.js with correct project ID

### Step 4: Cleanup & Commit
- [ ] Remove compiled scripts/dist directory
- [ ] Commit changes with message explaining the fix

## Expected Results
- Scripts now use correct project ID throughout
- Database seeding works with proper project context
- Both dev code and seed scripts aligned on same project ID

## Review Section
(To be filled after execution)
