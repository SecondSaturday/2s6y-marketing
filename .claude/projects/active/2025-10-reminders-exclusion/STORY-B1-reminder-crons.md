# STORY-B1: Reminder Cron Jobs

**Linear ID**: 2S6-44
**Agent**: Backend Agent (`backend-dev`)
**Estimated Time**: 3 hours
**Status**: TODO
**Blocks**: STORY-B2, STORY-I1

---

## User Story

As a 2Sat-lite user, I want to receive automated reminders 7, 3, and 1 days before the 2nd Saturday deadline so I remember to submit my monthly contribution.

---

## Acceptance Criteria

1. ✅ Three daily cron jobs created (7-day, 3-day, 1-day reminder schedulers)
2. ✅ Each cron calculates the 2nd Saturday of the current/next month
3. ✅ Crons only process groups with active members (status="active" in groupMembers table)
4. ✅ In-app notifications created for ALL active members (including those who already submitted)
5. ✅ Notifications visible in Convex dashboard after cron runs
6. ✅ Cron jobs visible in Convex dashboard
7. ✅ Proper error handling and logging

---

## Technical Details

### Files to Create/Modify
- `convex/crons.ts` - Add 3 new daily cron jobs
- `convex/reminders/sendReminders.ts` - Internal action to process reminders
- `convex/reminders/helpers.ts` - Helper functions (calculate 2nd Saturday, etc.)

### Cron Schedule
```typescript
// Daily cron (runs every day at 9 AM UTC)
crons.daily(
  "send7DayReminders",
  { hourUTC: 9, minuteUTC: 0 },
  internal.reminders.sendReminders.send7DayReminders
);

crons.daily(
  "send3DayReminders",
  { hourUTC: 9, minuteUTC: 0 },
  internal.reminders.sendReminders.send3DayReminders
);

crons.daily(
  "send1DayReminders",
  { hourUTC: 9, minuteUTC: 0 },
  internal.reminders.sendReminders.send1DayReminders
);
```

### Logic Flow (for each cron)
```typescript
1. Calculate 2nd Saturday of current/next month
2. Check if today === (2nd Saturday - N days)
3. If NO: Exit early (not a reminder day)
4. If YES:
   a. Query all groups
   b. Filter groups: only those with active members count > 0
   c. For each active group:
      - Get all active members (groupMembers where status="active")
      - For each active member:
        * Create in-app notification (type="contribution_reminder")
        * Include metadata: groupId, groupName, daysRemaining, actionUrl
5. Log results (groups processed, notifications created)
```

### Notification Schema
```typescript
{
  userId: Id<"users">,
  type: "contribution_reminder",
  title: "Reminder: {groupName} contribution due in {N} days",
  message: "Don't forget to submit your responses before the 2nd Saturday!",
  isRead: false,
  createdAt: Date.now(),
  groupId: Id<"groups">,
  metadata: {
    groupName: string,
    actionUrl: `/groups/${groupId}/contribute`,
    daysRemaining: 7 | 3 | 1
  }
}
```

### Edge Cases to Handle
- ✅ Group has no active members → Skip group
- ✅ User already submitted contribution → Still send reminder (per requirements)
- ✅ Month boundary edge cases (e.g., cron runs on Dec 31, needs to calculate Jan 2nd Sat)
- ✅ Leap years (February 2nd Saturday calculation)
- ✅ Cron failures (catch errors, log, don't crash)

---

## Testing Requirements

### Unit Tests (Backend Agent should write these)
```typescript
// convex/reminders/helpers.test.ts
describe("getSecondSaturday", () => {
  it("calculates 2nd Saturday correctly for January 2025", () => {
    expect(getSecondSaturday(2025, 0)).toBe(/* Jan 11, 2025 */);
  });

  it("handles leap years correctly", () => {
    expect(getSecondSaturday(2024, 1)).toBe(/* Feb 10, 2024 */);
  });
});

describe("isReminderDay", () => {
  it("returns true when today is 7 days before 2nd Saturday", () => {
    // Test logic
  });
});
```

### Manual Verification
1. Deploy crons to Convex dev environment
2. Check crons appear in Convex dashboard
3. Manually trigger a cron (if possible) or wait for scheduled run
4. Verify notifications created in database
5. Verify only active groups processed

---

## Dependencies

### Backend Dependencies
- Existing `notifications` table schema
- Existing `groupMembers` table (for querying active members)
- Existing `groups` table
- `getSecondSaturday` utility (may already exist in `lib/utils.ts` - check first)

### Contract with STORY-B2
**Output**: Notifications created in database with type="contribution_reminder"
**STORY-B2 expects**: These notifications to trigger Resend emails

---

## Implementation Notes

**TDD Approach**: Backend Agent should write tests FIRST, then implement.

**Performance**: Crons should be fast (<30 seconds execution). If processing 1000+ groups, consider batching.

**Idempotency**: Ensure crons don't create duplicate notifications if run multiple times on same day.

**Logging**: Log to console for Convex dashboard visibility:
```typescript
console.log(`[${cronName}] Processing ${groupCount} groups`);
console.log(`[${cronName}] Created ${notificationCount} notifications`);
```

---

## Success Criteria

**DONE when**:
1. ✅ All 3 cron jobs visible in Convex dashboard
2. ✅ Unit tests passing (100% coverage for helper functions)
3. ✅ Manual test shows notifications created for active members
4. ✅ No duplicate notifications created
5. ✅ Error handling works (doesn't crash on invalid data)
6. ✅ Backend Agent reports story complete

---

**Created**: 2025-10-23
**Linear**: https://linear.app/2s6y/issue/2S6-44
