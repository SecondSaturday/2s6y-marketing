# Deadline Enforcement - Quick Start Guide

**Project**: Deadline Enforcement
**Linear Project**: https://linear.app/2s6y/project/deadline-enforcement-4486c62c1388
**Total Time**: 2.5 hours (1.5 hours parallel execution)

---

## Overview

Enable deadline enforcement that blocks contribution edits after the day before 2nd Saturday at 11:59 PM. Currently stubbed with `isLocked = false` hardcoded at `app/contribute/page.tsx:101`.

**Why This Matters**: Users can edit contributions indefinitely with no deadline protection. This violates the MVP spec and breaks the monthly newsletter cycle.

---

## Execution Strategy

### Parallel Execution (Recommended)

Run both stories simultaneously:

```bash
# Terminal 1: STORY-B1 (Backend deadline validation)
cd /Users/kalyanchandana/Documents/GitHub/2Sat-lite
claude-code

# When Claude asks:
"Implement STORY-B1 from .claude/projects/active/2025-10-deadline-enforcement/STORY-B1-deadline-validation.md
Use backend-dev agent. Add canEdit query, deadline calculation, and validation in mutations."

# Terminal 2: STORY-F1 (Frontend UI lock) - START SIMULTANEOUSLY
cd /Users/kalyanchandana/Documents/GitHub/2Sat-lite
claude-code

# When Claude asks:
"Implement STORY-F1 from .claude/projects/active/2025-10-deadline-enforcement/STORY-F1-lock-ui.md
Use frontend-dev agent. Replace hardcoded isLocked=false with real canEdit query, lock UI after deadline."
```

### Sequential Execution

If you prefer one at a time:

```bash
# 1. STORY-B1 (1.5 hours)
"Implement STORY-B1: Backend deadline validation"

# 2. STORY-F1 (1 hour)
"Implement STORY-F1: Frontend UI lock"
```

---

## Prerequisites

Before starting:

1. **Contribution Schema Has editDeadline** (✅ Already exists):
   - `contributions.editDeadline: v.optional(v.number())`

2. **Countdown Timer Component** (✅ Already implemented):
   - `components/forms/CountdownTimer.tsx`

3. **Test Contribution Available**:
   ```bash
   # Create test contribution with deadline in past for testing
   ```

---

## Story Details

### STORY-B1: Deadline Calculation + canEdit Query (1.5 hours)

**What**: Add backend validation that blocks edits after deadline

**Files to Create**:
- `convex/helpers/deadlines.ts` (deadline calculation helpers)
- `convex/contributions.test.ts` (unit tests)

**Files to Modify**:
- `convex/contributions.ts` (add canEdit query, update mutations)

**Key Implementation**:
```typescript
// Calculate deadline: day before 2nd Saturday at 11:59 PM
export function calculateEditDeadline(month: string): number

// Check if editing allowed
export const canEdit = query({
  args: { contributionId: v.id("contributions") },
  handler: async (ctx, args) => {
    // Returns: { canEdit: boolean, reason: string | null, deadline: number | null }
  }
});
```

**Success**: canEdit query works, mutations throw DEADLINE_PASSED error, 6 unit tests passing

---

### STORY-F1: Lock UI After Deadline (1 hour)

**What**: Replace hardcoded stub with real deadline check, lock UI

**Files to Modify**:
- `app/contribute/page.tsx` (remove stub, add canEdit query)
- `components/forms/PhotoWall.tsx` (add disabled prop support)

**Files to Create**:
- `tests/e2e/contribution-deadline.spec.ts` (E2E tests)

**Key Changes**:
```typescript
// OLD (Line 101)
const isLocked = false; // STUB

// NEW
const canEditResult = useQuery(api.contributions.canEdit,
  contributionId ? { contributionId } : "skip"
);
const isLocked = canEditResult ? !canEditResult.canEdit : false;
```

**Success**: Form locked after deadline, locked banner shows date, 4 E2E tests passing

---

## Verification Checklist

After completing both stories:

### Backend Verification
- [ ] `canEdit` query returns correct state
- [ ] `createOrUpdate` throws DEADLINE_PASSED error after deadline
- [ ] `submit` throws DEADLINE_PASSED error after deadline
- [ ] Error messages include formatted deadline date
- [ ] Unit tests passing (6/6)
- [ ] Manual test: Try editing past deadline → ConvexError thrown

### Frontend Verification
- [ ] Hardcoded `isLocked = false` removed (line 101)
- [ ] `canEdit` query called when contributionId exists
- [ ] Form inputs disabled when locked
- [ ] Locked banner visible with formatted date
- [ ] Save attempts show error toast with deadline
- [ ] Backend errors displayed correctly
- [ ] PhotoWall respects disabled prop
- [ ] E2E tests passing (4/4)

### Integration Verification
- [ ] Create contribution before deadline → can edit
- [ ] Wait until after deadline → form locks
- [ ] Try to save → error toast shows
- [ ] Try to submit → backend error shown
- [ ] Reload page → locked state persists

---

## Troubleshooting

### Issue: canEdit query always returns canEdit=true
**Check**:
1. contribution.editDeadline field populated
2. Current time is actually after deadline
3. isEditingAllowed logic correct

### Issue: Form not locked even though deadline passed
**Check**:
1. contributionId exists (query needs valid ID)
2. canEditResult loaded (check for loading state)
3. isLocked calculation correct

### Issue: Error toast not showing deadline date
**Check**:
1. deadline variable populated from canEditResult
2. Date formatting works (check for null/undefined)
3. Error message string interpolation correct

### Issue: PhotoWall still allows uploads when locked
**Check**:
1. PhotoWall component has disabled prop
2. disabled={isLocked} passed to PhotoWall
3. Upload button hidden when disabled=true

---

## Success Metrics

**Project Complete When**:
- ✅ Backend validates deadline (mutations block edits)
- ✅ Frontend locks UI (inputs disabled, banner shown)
- ✅ All tests passing (10 total: 6 unit + 4 E2E)
- ✅ Error messages include formatted dates
- ✅ Manual testing successful (before and after deadline)

**Next Steps After Completion**:
1. Monitor real contributions approaching deadline
2. Verify countdown timer accuracy
3. Check user feedback on deadline messaging
4. Consider adding email reminder (PROJECT 4)

---

## Resources

**Existing Code**:
- Contribution form: `app/contribute/page.tsx`
- Countdown timer: `components/forms/CountdownTimer.tsx`
- Contributions mutations: `convex/contributions.ts`

**Linear Project**:
- [Deadline Enforcement](https://linear.app/2s6y/project/deadline-enforcement-4486c62c1388)

**Related TODO.md Section**:
- PROJECT 2: Contribution Schema Migration + Deadline Enforcement

---

**Last Updated**: 2025-10-22
**Estimated Total Time**: 2.5 hours
**Parallelizable**: Yes (B1 + F1 can run simultaneously)
