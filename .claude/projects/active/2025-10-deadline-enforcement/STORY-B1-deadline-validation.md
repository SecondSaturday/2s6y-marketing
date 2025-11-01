# STORY-B1: Deadline Calculation + canEdit Query

**Linear Issue**: [2S6-35](https://linear.app/2s6y/issue/2S6-35)
**Agent**: Backend Agent
**Estimate**: 1.5 hours
**Type**: PARALLELIZABLE (can run with F1)
**Dependencies**: None

---

## Objective

Implement backend deadline validation. Calculate editDeadline on contribution creation, provide canEdit query for frontend, and block edits in mutations after deadline.

---

## Acceptance Criteria

* canEdit query returns correct state (canEdit, reason, deadline)
* createOrUpdate blocks edits after deadline with ConvexError
* submit blocks submission after deadline with ConvexError
* editDeadline calculated correctly (day before 2nd Saturday at 11:59 PM)
* All 6 unit tests passing
* Error messages include formatted deadline date

---

## Implementation Steps

### 1. Add Deadline Calculation Helper

**File**: `convex/helpers/deadlines.ts` (NEW)

```typescript
/**
 * Calculate edit deadline for a contribution
 * Deadline: Day before 2nd Saturday at 11:59 PM
 */
export function calculateEditDeadline(month: string): number {
  const [year, monthStr] = month.split("-");
  const monthNum = parseInt(monthStr) - 1;

  // Get second Saturday
  const secondSaturday = getSecondSaturday(parseInt(year), monthNum);

  // Go back 1 day, set to 11:59 PM
  const dayBefore = new Date(secondSaturday);
  dayBefore.setDate(dayBefore.getDate() - 1);
  dayBefore.setHours(23, 59, 59, 999);

  return dayBefore.getTime();
}

export function isEditingAllowed(editDeadline: number): boolean {
  return Date.now() < editDeadline;
}
```

### 2. Update createOrUpdate Mutation

**File**: `convex/contributions.ts`

Add deadline check before allowing edits:

```typescript
if (existing) {
  // CHECK DEADLINE BEFORE UPDATE
  if (existing.editDeadline && !isEditingAllowed(existing.editDeadline)) {
    throw new ConvexError({
      code: "DEADLINE_PASSED",
      message: `Contributions locked. Deadline was ${formatDeadline(existing.editDeadline)}.`
    });
  }
  // ... existing update logic
} else {
  // CREATE NEW with editDeadline
  const editDeadline = calculateEditDeadline(args.month);
  // ... insert with editDeadline
}
```

### 3. Create canEdit Query

**File**: `convex/contributions.ts`

```typescript
export const canEdit = query({
  args: { contributionId: v.id("contributions") },
  handler: async (ctx, args) => {
    const contribution = await ctx.db.get(args.contributionId);

    if (!contribution?.editDeadline) {
      return { canEdit: true, reason: null, deadline: null };
    }

    const allowed = isEditingAllowed(contribution.editDeadline);

    return {
      canEdit: allowed,
      reason: allowed ? null : "Deadline has passed",
      deadline: contribution.editDeadline
    };
  },
});
```

### 4. Update submit Mutation

Add deadline check before submit (similar to createOrUpdate).

---

## Testing Requirements

**File**: `convex/contributions.test.ts`

**Tests Required**: 6 tests

1. calculateEditDeadline returns day before 2nd Saturday
2. isEditingAllowed returns true before deadline
3. isEditingAllowed returns false after deadline
4. createOrUpdate throws error after deadline
5. canEdit returns false after deadline
6. submit throws error after deadline

---

## Files to Create/Modify

**Create**:
* `convex/helpers/deadlines.ts`
* `convex/contributions.test.ts`

**Modify**:
* `convex/contributions.ts`

---

## Contract for Frontend (F1)

**Backend provides**:

```typescript
// Query: Check if editing allowed
canEdit(contributionId: Id<"contributions">): Promise<{
  canEdit: boolean,
  reason: string | null,
  deadline: number | null
}>

// Mutation: createOrUpdate throws error after deadline
// Throws: { code: "DEADLINE_PASSED", message: "Contributions locked. Deadline was Oct 10, 11:59 PM." }

// Mutation: submit throws error after deadline
// Throws: { code: "DEADLINE_PASSED", message: "Cannot submit. Deadline was Oct 10, 11:59 PM." }
```

---

## Quick Commands

```bash
# 1. Create files
mkdir -p convex/helpers
touch convex/helpers/deadlines.ts
touch convex/contributions.test.ts

# 2. Implement deadline logic

# 3. Run unit tests
npm run test convex/contributions.test.ts

# 4. Deploy
npx convex dev
```

---

## Success Checklist

- [ ] `convex/helpers/deadlines.ts` created
- [ ] `canEdit` query implemented
- [ ] `createOrUpdate` has deadline check
- [ ] `submit` has deadline check
- [ ] Error messages include formatted date
- [ ] Unit tests passing (6/6)
- [ ] Manual test: Try editing after deadline → error shown

---

**Estimated Time**: 1.5 hours
**Blocked By**: None
**Blocks**: None
