# STORY-NL8: Integration & E2E Testing

**Status**: 🟡 Pending
**Estimated Effort**: 2.5 hours
**Agent**: Backend Agent + Frontend Agent (Orchestrator)
**Dependencies**: ALL (NL1-NL7)
**Blocks**: None (Final story)

---

## 📋 Story Description

Create comprehensive E2E tests that verify the entire newsletter generation flow from cron trigger to email delivery to web view display.

---

## 🎯 Acceptance Criteria

1. ✅ E2E test: Cron triggers → newsletter created → email sent
2. ✅ E2E test: Manual trigger button → newsletter created → success message
3. ✅ E2E test: Admin report email delivered with correct stats
4. ✅ E2E test: Zero contributions → feedback email sent
5. ✅ E2E test: Web view displays with videos, links, excluded message
6. ✅ E2E test: Excluded member can view issue but sees message
7. ✅ Integration test: Resend batch API called correctly
8. ✅ All tests passing in CI/CD

---

## 📝 Technical Specification

### E2E Test Suite

Create `tests/e2e/newsletter-generation.spec.ts`:

```typescript
import { test, expect } from "@playwright/test";
import { setupTestData, cleanupTestData } from "../fixtures/testData";

test.describe("Newsletter Generation E2E", () => {
  let testData: {
    groupId: string;
    adminUserId: string;
    memberUserId: string;
    month: string;
  };

  test.beforeEach(async () => {
    // Setup: Create test group with members and contributions
    testData = await setupTestData();
  });

  test.afterEach(async () => {
    await cleanupTestData(testData.groupId);
  });

  test("manual trigger generates and sends newsletter", async ({ page }) => {
    // 1. Login as admin
    await page.goto("/login");
    // TODO: Login as admin user

    // 2. Navigate to group settings
    await page.goto(`/groups/${testData.groupId}/settings`);

    // 3. Click "Generate Newsletter" button
    await page.click('button:has-text("Generate Newsletter")');

    // 4. Confirm in modal
    await page.click('button:has-text("Generate & Send")');

    // 5. Verify success message
    await expect(page.locator(".alert-success")).toBeVisible({ timeout: 10000 });
    await expect(page.locator("text=Newsletter generated")).toBeVisible();

    // 6. Navigate to issue page
    await page.goto(`/groups/${testData.groupId}/issues/${testData.month}`);

    // 7. Verify contributions are visible
    await expect(page.locator('[data-testid="contribution"]')).toHaveCount(1);
  });

  test("cron job generates newsletter automatically", async ({ page }) => {
    // 1. Trigger cron manually (via Convex dashboard or test API)
    const response = await page.request.post("/api/test/trigger-cron", {
      data: { cronName: "send-monthly-newsletters" },
    });
    expect(response.ok()).toBeTruthy();

    // 2. Wait for newsletter creation
    await page.waitForTimeout(5000);

    // 3. Verify newsletter exists in database
    // TODO: Query Convex to check newsletter record

    // 4. Verify web view works
    await page.goto(`/groups/${testData.groupId}/issues/${testData.month}`);
    await expect(page.locator("text=Test Group")).toBeVisible();
  });

  test("admin report email contains correct stats", async ({ page }) => {
    // 1. Trigger newsletter generation
    await page.request.post("/api/test/generate-newsletter", {
      data: {
        groupId: testData.groupId,
        month: testData.month,
      },
    });

    // 2. Wait for email delivery
    await page.waitForTimeout(3000);

    // 3. Check email inbox (via Resend test API or email testing service)
    const emails = await page.request.get("/api/test/get-emails", {
      params: { to: "admin@example.com" },
    });
    const emailData = await emails.json();

    expect(emailData.emails).toHaveLength(1);
    expect(emailData.emails[0].subject).toContain("Newsletter Report");
    expect(emailData.emails[0].html).toContain("Total Members");
  });

  test("zero contributions sends feedback email", async ({ page }) => {
    // 1. Create group with NO contributions
    const emptyGroupId = await setupTestData({ withContributions: false });

    // 2. Trigger newsletter generation
    await page.request.post("/api/test/generate-newsletter", {
      data: {
        groupId: emptyGroupId,
        month: testData.month,
      },
    });

    // 3. Verify no newsletter record created
    // TODO: Query Convex

    // 4. Verify feedback email sent
    const emails = await page.request.get("/api/test/get-emails", {
      params: { to: "admin@example.com" },
    });
    const emailData = await emails.json();

    expect(emailData.emails.some((e: any) =>
      e.subject.includes("Better luck next month")
    )).toBeTruthy();
  });

  test("excluded member sees encouraging message", async ({ page }) => {
    // 1. Login as member who didn't contribute
    await page.goto("/login");
    // TODO: Login as excluded member

    // 2. Navigate to issue page
    await page.goto(`/groups/${testData.groupId}/issues/${testData.month}`);

    // 3. Verify excluded message is visible
    await expect(page.locator("text=You didn't contribute this month")).toBeVisible();
    await expect(page.locator("text=we'd love to see your updates")).toBeVisible();

    // 4. Verify can still see others' contributions
    await expect(page.locator('[data-testid="contribution"]')).toBeVisible();
  });

  test("web view handles videos and links correctly", async ({ page }) => {
    // 1. Navigate to issue page with video contribution
    await page.goto(`/groups/${testData.groupId}/issues/${testData.month}`);

    // 2. Click video thumbnail
    await page.click('[data-testid="video-thumbnail"]');

    // 3. Verify video modal opens
    await expect(page.locator(".modal")).toBeVisible();
    await expect(page.locator("video")).toBeVisible();

    // 4. Close modal
    await page.click('[aria-label="Close"]');
    await expect(page.locator(".modal")).not.toBeVisible();

    // 5. Verify links in text are clickable
    const link = page.locator('a[href^="http"]').first();
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("target", "_blank");
  });

  test("newsletter email sent via Resend batch API", async ({ page }) => {
    // 1. Mock Resend API to capture batch request
    await page.route("https://api.resend.com/emails/batch", async (route) => {
      const request = route.request();
      const postData = JSON.parse(request.postData() || "{}");

      // Verify batch structure
      expect(postData.to).toBeInstanceOf(Array);
      expect(postData.from).toContain("2Sat");
      expect(postData.html).toContain("View Full Version");

      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          id: "batch_test_123",
          sent: postData.to.length,
        }),
      });
    });

    // 2. Trigger newsletter generation
    await page.goto(`/groups/${testData.groupId}/settings`);
    await page.click('button:has-text("Generate Newsletter")');
    await page.click('button:has-text("Generate & Send")');

    // 3. Verify success
    await expect(page.locator(".alert-success")).toBeVisible();
  });
});
```

### Integration Tests

Create `tests/integration/newsletter-mutations.test.ts`:

```typescript
import { describe, it, expect, vi } from "vitest";
import { convexTest } from "convex-test";
import schema from "@/convex/schema";
import { api, internal } from "@/convex/_generated/api";

describe("Newsletter Generation Mutations", () => {
  it("should create newsletter with correct metadata", async () => {
    const t = convexTest(schema);

    // Setup
    const groupId = await t.run((ctx) =>
      ctx.db.insert("groups", {
        name: "Test Group",
        memberIds: [t.id("users")],
        createdAt: Date.now(),
      })
    );

    const userId = await t.run((ctx) =>
      ctx.db.insert("users", {
        email: "test@example.com",
        name: "Test User",
      })
    );

    await t.run((ctx) =>
      ctx.db.insert("contributions", {
        userId,
        groupId,
        month: "2025-10",
        prompt1: "My contribution",
        status: "submitted",
        submittedAt: Date.now(),
        updatedAt: Date.now(),
      })
    );

    // Act: Generate newsletter
    const result = await t.mutation(internal.newsletters.generateNewsletterForGroup, {
      groupId,
      month: "2025-10",
    });

    // Assert
    expect(result.newsletterId).toBeDefined();

    const newsletter = await t.run((ctx) => ctx.db.get(result.newsletterId!));

    expect(newsletter?.groupId).toBe(groupId);
    expect(newsletter?.month).toBe("2025-10");
    expect(newsletter?.recipientEmails).toHaveLength(1);
    expect(newsletter?.deliveryReport).toBeDefined();
    expect(newsletter?.excludedMemberIds).toBeDefined();
  });

  it("should handle Resend API failure gracefully", async () => {
    const t = convexTest(schema);

    // Mock Resend API failure
    vi.mock("fetch", () => ({
      default: vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ error: "Service unavailable" }),
        })
      ),
    }));

    // Setup
    const groupId = await t.run((ctx) =>
      ctx.db.insert("groups", {
        name: "Test Group",
        memberIds: [],
        createdAt: Date.now(),
      })
    );

    // Act: Generate newsletter (should handle error)
    const result = await t.mutation(internal.newsletters.generateNewsletterForGroup, {
      groupId,
      month: "2025-10",
    });

    // Assert: Newsletter created but delivery failed
    expect(result.newsletterId).toBeDefined();
    expect(result.failed).toBeGreaterThan(0);
  });

  it("should identify excluded members correctly", async () => {
    const t = convexTest(schema);

    // Setup: 3 members, only 1 contributes
    const user1 = await t.run((ctx) =>
      ctx.db.insert("users", { email: "user1@example.com" })
    );
    const user2 = await t.run((ctx) =>
      ctx.db.insert("users", { email: "user2@example.com" })
    );
    const user3 = await t.run((ctx) =>
      ctx.db.insert("users", { email: "user3@example.com" })
    );

    const groupId = await t.run((ctx) =>
      ctx.db.insert("groups", {
        name: "Test Group",
        memberIds: [user1, user2, user3],
        createdAt: Date.now(),
      })
    );

    // Only user1 contributes
    await t.run((ctx) =>
      ctx.db.insert("contributions", {
        userId: user1,
        groupId,
        month: "2025-10",
        prompt1: "Contribution",
        status: "submitted",
        submittedAt: Date.now(),
        updatedAt: Date.now(),
      })
    );

    // Act
    const result = await t.mutation(internal.newsletters.generateNewsletterForGroup, {
      groupId,
      month: "2025-10",
    });

    const newsletter = await t.run((ctx) => ctx.db.get(result.newsletterId!));

    // Assert
    expect(newsletter?.excludedMemberIds).toHaveLength(2);
    expect(newsletter?.excludedMemberIds).toContain(user2);
    expect(newsletter?.excludedMemberIds).toContain(user3);
    expect(newsletter?.excludedMemberIds).not.toContain(user1);
  });
});
```

---

## 🧪 Test Fixtures

Create `tests/fixtures/newsletterData.ts`:

```typescript
import { Id } from "@/convex/_generated/dataModel";

export function createMockContribution() {
  return {
    _id: "contribution_1" as Id<"contributions">,
    userId: "user_1" as Id<"users">,
    groupId: "group_1" as Id<"groups">,
    month: "2025-10",
    prompt1: "I went on a road trip to the mountains! Check out https://example.com",
    prompt2: [
      {
        storageId: "img_123",
        thumbnailId: "thumb_123",
        caption: "Scenic view",
        uploadedAt: Date.now(),
      },
      {
        storageId: "video_456.mp4",
        thumbnailId: "thumb_456",
        caption: "Timelapse",
        uploadedAt: Date.now(),
      },
    ],
    prompt3: "Feeling grateful for my friends",
    status: "submitted" as const,
    submittedAt: Date.now(),
    updatedAt: Date.now(),
    user: {
      _id: "user_1" as Id<"users">,
      name: "Test User",
      email: "test@example.com",
      profileImage: "https://example.com/avatar.jpg",
    },
  };
}

export function createMockGroup() {
  return {
    _id: "group_1" as Id<"groups">,
    name: "Test Group",
    memberIds: ["user_1", "user_2"] as Id<"users">[],
    coverImage: "https://example.com/cover.jpg",
    groupImage: "https://example.com/group.jpg",
    createdAt: Date.now(),
  };
}
```

---

## 📦 Deliverables

- ✅ E2E test suite: `tests/e2e/newsletter-generation.spec.ts`
- ✅ Integration tests: `tests/integration/newsletter-mutations.test.ts`
- ✅ Test fixtures: `tests/fixtures/newsletterData.ts`
- ✅ All tests passing in CI/CD
- ✅ Test coverage report > 80%

---

## 🔗 Contracts

### Test API Endpoints (for E2E)

```typescript
// Test-only endpoints (disabled in production)
POST /api/test/trigger-cron { cronName: string }
POST /api/test/generate-newsletter { groupId, month }
GET /api/test/get-emails { to: string }
```

---

## ⚠️ Edge Cases Covered

1. **Cron trigger**: Verify automated execution
2. **Manual trigger**: Verify admin UI flow
3. **Zero contributions**: Verify feedback email
4. **Excluded members**: Verify message and access
5. **Failed sends**: Verify error handling and reporting
6. **Resend API failure**: Verify graceful degradation
7. **Video playback**: Verify modal opens and video plays
8. **Link detection**: Verify URLs become clickable

---

## 📚 References

- Playwright docs: https://playwright.dev/
- Vitest docs: https://vitest.dev/
- Convex testing: https://docs.convex.dev/client/testing
- Test data factories: `tests/factories/`
