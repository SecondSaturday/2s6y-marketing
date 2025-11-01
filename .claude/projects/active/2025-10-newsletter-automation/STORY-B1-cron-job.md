# STORY-B1: Cron Job Setup - 2nd Saturday Newsletter Trigger

**Linear Issue**: [2S6-48](https://linear.app/2s6y/issue/2S6-48)
**Agent**: Backend Agent
**Estimate**: 3 hours
**Type**: Backend (Parallelizable with B2)
**Priority**: P0 (Blocker)

---

## Objective

Create Convex cron job that automatically triggers newsletter generation every 2nd Saturday at 9 AM UTC.

---

## Acceptance Criteria

* Cron job defined in `convex/cron.ts`
* Schedule: 2nd Saturday of each month at 9:00 AM UTC
* Triggers `internal.newsletters.orchestrator.runNewsletterGeneration`
* Cron job appears in Convex dashboard
* Manual test: Cron triggers successfully (verify logs)
* Error handling: Cron failures logged but don't crash system

---

## Implementation Steps

### 1. Create Orchestrator Action

**File**: `convex/newsletters/orchestrator.ts` (NEW FILE)

See full implementation in Linear issue description.

### 2. Create Cron Configuration

**File**: `convex/cron.ts` (NEW FILE)

```typescript
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.monthly(
  "generateMonthlyNewsletters",
  {
    day: "second saturday",
    hour: 9,
    minuteUTC: 0
  },
  internal.newsletters.orchestrator.runNewsletterGeneration
);

export default crons;
```

### 3. Verify in Convex Dashboard

1. Deploy: `npx convex dev`
2. Open dashboard: https://dashboard.convex.dev
3. Check "Cron Jobs" tab
4. Verify schedule shows correctly

### 4. Manual Testing

Run in Convex dashboard:
```
internal.newsletters.orchestrator.runNewsletterGeneration({})
```

---

## Testing Requirements

**Unit Tests**: 6 tests in `convex/newsletters/orchestrator.test.ts`

1. Happy path (calls generateNewsletters)
2. Returns correct summary format
3. Handles generation errors
4. Logs errors to console
5. Returns success=false on error
6. Doesn't throw errors (graceful handling)

---

## Files to Create/Modify

**NEW**:
* `convex/cron.ts`
* `convex/newsletters/orchestrator.ts`
* `convex/newsletters/orchestrator.test.ts`

---

## Quick Commands

```bash
# 1. Create files
touch convex/cron.ts
touch convex/newsletters/orchestrator.ts
touch convex/newsletters/orchestrator.test.ts

# 2. Deploy to Convex
npx convex dev

# 3. Test manually in dashboard
# Run: internal.newsletters.orchestrator.runNewsletterGeneration

# 4. Run unit tests
npm run test convex/newsletters/orchestrator.test.ts
```

---

## Success Checklist

- [ ] `convex/cron.ts` created with monthly schedule
- [ ] `convex/newsletters/orchestrator.ts` implemented
- [ ] Cron job visible in Convex dashboard
- [ ] Manual test passes
- [ ] Newsletter records created in database
- [ ] Unit tests passing (6/6)
- [ ] No errors in Convex logs

---

**Estimated Time**: 3 hours
**Blocked By**: None
**Blocks**: STORY-I1
