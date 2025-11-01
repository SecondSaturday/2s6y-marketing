# STORY-I1: E2E Reminder + Exclusion Tests

**Linear ID**: 2S6-47
**Agent**: Orchestrator Agent (`orchestrator`)
**Estimated Time**: 3 hours
**Status**: BLOCKED (by STORY-B1, STORY-B2, STORY-F1)
**Blocks**: None (final story)

---

## User Story

As a developer, I want comprehensive E2E tests that verify reminder crons work correctly and exclusion banners display properly, so we can confidently deploy this feature to production.

---

## Acceptance Criteria

1. ✅ E2E test: Verify reminder crons create in-app notifications correctly
2. ✅ E2E test: Verify reminder emails sent via Resend (with email preferences respected)
3. ✅ E2E test: Verify exclusion banner displays on issue view page
4. ✅ E2E test: Verify exclusion banner does NOT display for users who contributed
5. ✅ E2E test: Verify edge cases (opt-out users, empty groups, month boundaries)
6. ✅ All tests passing in CI/CD pipeline
7. ✅ Test coverage report shows >90% coverage for new code

---

## Technical Details

### Files to Create
- `tests/e2e/contribution-reminders.spec.ts` - Reminder cron and email tests
- `tests/e2e/exclusion-banner.spec.ts` - Exclusion UI tests
- `convex/tests/reminders.test.ts` - Backend unit tests for reminder logic (if not created by Backend Agent)

### Test Structure

#### Test 1: Reminder Crons Create Notifications
```typescript
// tests/e2e/contribution-reminders.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Contribution Reminders E2E', () => {
  test('7-day reminder cron creates notifications for active members', async ({ page }) => {
    // Setup: Create test group with 3 active members
    // Setup: Set today to be 7 days before 2nd Saturday
    // Trigger: Run 7-day reminder cron manually (or wait for scheduled run)
    // Verify: 3 notifications created in database
    // Verify: Notifications have correct type, metadata, groupId
  });

  test('reminder cron skips groups with no active members', async ({ page }) => {
    // Setup: Create group with 0 active members (all removed/blocked)
    // Trigger: Run reminder cron
    // Verify: No notifications created for this group
  });

  test('reminder cron sends to users who already submitted', async ({ page }) => {
    // Setup: Create group with 2 members (1 submitted, 1 draft)
    // Trigger: Run reminder cron
    // Verify: Both members receive notifications (not just draft user)
  });
});
```

#### Test 2: Reminder Emails Sent via Resend
```typescript
test.describe('Reminder Email Delivery', () => {
  test('emails sent when notifications created', async ({ page }) => {
    // Setup: Create test user with emailPreferences.reminders = true
    // Trigger: Create contribution_reminder notification
    // Trigger: Run email watcher
    // Verify: Resend API called with correct params
    // Verify: Email sent to user's email address
  });

  test('emails NOT sent when user opts out', async ({ page }) => {
    // Setup: Create user with emailPreferences.reminders = false
    // Trigger: Create contribution_reminder notification
    // Trigger: Run email watcher
    // Verify: Resend API NOT called for this user
    // Verify: Other users (opted in) still receive emails
  });

  test('email failures logged but do not crash', async ({ page }) => {
    // Setup: Create user with invalid email address
    // Trigger: Create notification and run email watcher
    // Verify: Error logged to console
    // Verify: Watcher continues processing other users
  });
});
```

#### Test 3: Exclusion Banner Display
```typescript
// tests/e2e/exclusion-banner.spec.ts
test.describe('Exclusion Banner E2E', () => {
  test('banner displays when user was excluded from issue', async ({ page }) => {
    // Setup: Create newsletter with excludedMemberIds = [currentUser._id]
    // Navigate: Go to /groups/[groupId]/issues/[month]
    // Verify: Banner visible at top of page
    // Verify: Banner text: "The group missed you this month"
  });

  test('banner does NOT display when user contributed', async ({ page }) => {
    // Setup: Create newsletter with excludedMemberIds = [otherUser._id] (not current user)
    // Navigate: Go to /groups/[groupId]/issues/[month]
    // Verify: Banner NOT visible
  });

  test('banner displays correctly on all breakpoints', async ({ page }) => {
    // Mobile (375px)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/groups/[groupId]/issues/[month]');
    await expect(page.locator('[role="alert"]')).toBeVisible();

    // Tablet (768px)
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('[role="alert"]')).toBeVisible();

    // Desktop (1440px)
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page.locator('[role="alert"]')).toBeVisible();
  });
});
```

#### Test 4: Edge Cases
```typescript
test.describe('Edge Cases', () => {
  test('month boundary: cron on Dec 31 calculates Jan 2nd Saturday correctly', async ({ page }) => {
    // Setup: Mock system date to Dec 31, 2024
    // Trigger: Run 7-day reminder cron
    // Verify: Calculates Jan 11, 2025 as 2nd Saturday
    // Verify: Notifications created if today is 7 days before
  });

  test('leap year: February 2nd Saturday calculated correctly', async ({ page }) => {
    // Setup: Mock system date to Feb 2024 (leap year)
    // Trigger: Run reminder cron
    // Verify: Feb 10, 2024 calculated correctly
  });

  test('user views archived issue from group they left', async ({ page }) => {
    // Setup: User was member of group, contributed to Jan issue, then left group
    // Navigate: Go to /groups/[groupId]/issues/2025-01
    // Verify: Issue displays correctly (user's contribution still shown)
    // Verify: No exclusion banner (they contributed)
  });
});
```

---

## Testing Strategy

### Backend Unit Tests
```typescript
// convex/tests/reminders.test.ts (created by Backend Agent in STORY-B1)
describe("Reminder Helper Functions", () => {
  describe("getSecondSaturday", () => {
    it("calculates correctly for each month of 2025");
    it("handles leap years");
    it("handles December → January boundary");
  });

  describe("isReminderDay", () => {
    it("returns true when today is 7 days before 2nd Saturday");
    it("returns false when today is 6 days before");
  });

  describe("getActiveGroups", () => {
    it("returns only groups with active members");
    it("excludes groups with all members removed/blocked");
  });
});
```

### Frontend Visual Tests
```typescript
// tests/exclusion-banner-visual.spec.ts (created by Frontend Agent in STORY-F1)
test.describe("Exclusion Banner Visual Regression", () => {
  test("mobile screenshot matches baseline");
  test("tablet screenshot matches baseline");
  test("desktop screenshot matches baseline");
});
```

### Integration Tests (Orchestrator's Responsibility)
```typescript
// tests/e2e/contribution-reminders.spec.ts
// Full end-to-end flow:
// 1. Create test data (groups, users, contributions)
// 2. Trigger cron
// 3. Verify notifications created
// 4. Verify emails sent
// 5. Navigate to UI
// 6. Verify banner displays
```

---

## Test Data Setup

### Test Groups
```typescript
const testData = {
  groups: [
    {
      name: "Active Group",
      activeMembers: 5, // All status="active"
    },
    {
      name: "Empty Group",
      activeMembers: 0, // All removed/blocked
    },
    {
      name: "Mixed Group",
      activeMembers: 3,
      inactiveMembers: 2, // Some removed/blocked
    }
  ],
  users: [
    {
      email: "opted-in@test.com",
      emailPreferences: { reminders: true }
    },
    {
      email: "opted-out@test.com",
      emailPreferences: { reminders: false }
    }
  ],
  newsletters: [
    {
      month: "2025-01",
      excludedMemberIds: ["user1", "user2"]
    }
  ]
};
```

### Test Utilities
```typescript
// tests/helpers/testSetup.ts
export async function createTestGroup(activeMembers: number, inactiveMembers: number) {
  // Create group with specified member counts
}

export async function mockSystemDate(date: Date) {
  // Mock Date.now() for cron testing
}

export async function triggerReminderCron(days: 7 | 3 | 1) {
  // Manually trigger cron (or wait for scheduled run)
}

export async function verifyNotificationCreated(userId: string, type: string) {
  // Query database and verify notification exists
}
```

---

## Dependencies

### Backend Dependencies
- STORY-B1: Reminder cron jobs implemented
- STORY-B2: Reminder email templates implemented
- Test database seeding utilities

### Frontend Dependencies
- STORY-F1: Exclusion banner component implemented
- Playwright test framework
- Test authentication setup (Clerk test users)

### External Dependencies
- Resend test mode or real API key
- Convex dev environment
- Test data factories

---

## Implementation Notes

**TDD Approach**: Orchestrator should coordinate test writing BEFORE integration:
1. Backend Agent writes unit tests for cron logic
2. Frontend Agent writes visual tests for banner
3. Orchestrator writes E2E integration tests

**Test Isolation**: Each test should:
- Create its own test data (no shared state)
- Clean up after itself (delete test groups/users/notifications)
- Not depend on other tests

**CI/CD Integration**: Tests should run in GitHub Actions pipeline:
```yaml
# .github/workflows/test.yml
- name: Run E2E Tests
  run: npm run test:e2e
- name: Upload Screenshots
  uses: actions/upload-artifact@v3
  with:
    name: test-screenshots
    path: tests/screenshots/
```

**Performance**: E2E tests may be slow (30+ seconds each). Optimize by:
- Parallel test execution (Playwright supports this)
- Reusing test data where safe
- Mocking Resend API calls (use test mode)

---

## Success Criteria

**DONE when**:
1. ✅ All E2E tests passing (reminders + exclusion)
2. ✅ Backend unit tests passing (>90% coverage)
3. ✅ Frontend visual tests passing (3 breakpoints)
4. ✅ Edge cases tested (month boundaries, leap years, opt-outs)
5. ✅ Tests run successfully in CI/CD pipeline
6. ✅ Test report generated with coverage metrics
7. ✅ Orchestrator Agent reports story complete

---

**Created**: 2025-10-23
**Linear**: https://linear.app/2s6y/issue/2S6-47
