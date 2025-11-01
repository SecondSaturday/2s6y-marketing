# STORY-F1: Lock UI After Deadline

**Linear Issue**: [2S6-38](https://linear.app/2s6y/issue/2S6-38)
**Agent**: Frontend Agent
**Estimate**: 1 hour
**Type**: PARALLELIZABLE (can run with B1)
**Dependencies**: None (uses contract from B1)

---

## Objective

Update contribution form to call canEdit query and lock UI after deadline. Replace hardcoded `isLocked = false` with real deadline check.

---

## Acceptance Criteria

* Hardcoded `isLocked = false` removed
* canEdit query called when contributionId exists
* Form locked (inputs disabled) when canEdit returns false
* Locked banner shows formatted deadline date
* Save attempts after deadline show error toast with date
* Backend errors (DEADLINE_PASSED) displayed correctly
* PhotoWall respects disabled prop
* All 4 E2E tests passing

---

## Implementation Steps

### 1. Remove Hardcoded Stub

**File**: `app/contribute/page.tsx` (Line 101)

**Current Code**:
```typescript
const isLocked = false; // STUB: Always allow editing
```

**New Code**:
```typescript
const canEditResult = useQuery(
  api.contributions.canEdit,
  contributionId ? { contributionId } : "skip"
);

const isLocked = canEditResult ? !canEditResult.canEdit : false;
const lockReason = canEditResult?.reason || null;
const deadline = canEditResult?.deadline || draft?.editDeadline || null;
```

### 2. Update Locked Banner

**File**: `app/contribute/page.tsx` (Lines 282-292)

Show formatted deadline in banner:

```tsx
{isLocked && deadline && (
  <div className="alert alert-warning">
    <svg>...</svg>
    <div className="flex flex-col">
      <span className="font-semibold">Contributions Locked</span>
      <span className="text-sm">
        Deadline passed on {new Date(deadline).toLocaleDateString(...)}
      </span>
    </div>
  </div>
)}
```

### 3. Handle Lock State During Save

**File**: `app/contribute/page.tsx` (Lines 106-113)

Show deadline date in error toast:

```typescript
if (isLocked) {
  const deadlineDate = deadline
    ? new Date(deadline).toLocaleDateString(...)
    : "unknown";
  toast.error(`Cannot edit. Deadline was ${deadlineDate}.`);
  return;
}
```

### 4. Update Error Handling

Handle DEADLINE_PASSED error from backend:

```typescript
catch (error: any) {
  const isDeadlineError = error?.data?.code === "DEADLINE_PASSED";
  const errorMessage = isDeadlineError
    ? error.data.message // Backend provides formatted message
    : error instanceof Error
    ? error.message
    : "Failed to save.";

  toast.error(errorMessage, { id: toastId });
}
```

### 5. Update PhotoWall

**File**: `components/forms/PhotoWall.tsx`

Add `disabled` prop support:

```tsx
interface PhotoWallProps {
  disabled?: boolean; // NEW
}

export default function PhotoWall({ disabled = false, ... }) {
  return (
    <div>
      {!disabled && (
        <button onClick={handleUpload}>Upload Photo</button>
      )}
      {/* Hide delete buttons when disabled */}
    </div>
  );
}
```

---

## Testing Requirements

**E2E Test**: `tests/e2e/contribution-deadline.spec.ts`

**Tests Required**: 4 tests

1. Form locks after deadline passes
2. Form allows editing before deadline
3. Save attempt after deadline shows error toast
4. Backend error shown if deadline check fails

---

## Files to Modify

**Modify**:
* `app/contribute/page.tsx`
* `components/forms/PhotoWall.tsx`

**Create**:
* `tests/e2e/contribution-deadline.spec.ts`

---

## Contract from Backend (B1)

**Frontend uses**:

```typescript
const canEditResult = await convex.query(api.contributions.canEdit, {
  contributionId: Id<"contributions">
});

// Expected response
{
  canEdit: boolean,
  reason: string | null,
  deadline: number | null
}

// Backend mutations throw
{
  code: "DEADLINE_PASSED",
  message: "Contributions locked. Deadline was Oct 10, 11:59 PM."
}
```

---

## Quick Commands

```bash
# 1. Update contribute page

# 2. Update PhotoWall component

# 3. Create E2E tests
mkdir -p tests/e2e
touch tests/e2e/contribution-deadline.spec.ts

# 4. Run E2E tests
npx playwright test contribution-deadline

# 5. Visual verification (3 breakpoints)
npx playwright screenshot --viewport-size=1920x1080 http://localhost:3000/contribute
npx playwright screenshot --viewport-size=768x1024 http://localhost:3000/contribute
npx playwright screenshot --viewport-size=375x667 http://localhost:3000/contribute
```

---

## Success Checklist

- [ ] Hardcoded `isLocked = false` removed
- [ ] `canEdit` query called
- [ ] Form locked when canEdit returns false
- [ ] Locked banner shows formatted deadline
- [ ] Save error toast shows deadline
- [ ] Backend errors displayed
- [ ] PhotoWall respects disabled prop
- [ ] E2E tests passing (4/4)
- [ ] Visual tests at 3 breakpoints

---

**Estimated Time**: 1 hour
**Blocked By**: None
**Blocks**: None
