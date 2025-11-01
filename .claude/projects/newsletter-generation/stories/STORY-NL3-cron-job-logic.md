# STORY-NL3: Cron Job & Newsletter Generation Logic

**Status**: 🟡 Pending
**Estimated Effort**: 4 hours
**Agent**: Backend Agent
**Dependencies**: NL1 (Schema), NL2 (HTML Helpers)
**Blocks**: NL4 (Admin Report), NL5 (Manual Trigger)

---

## 📋 Story Description

Create the automated cron job that runs every 2nd Saturday at 12PM UTC to generate and send monthly newsletters for all groups.

---

## 🎯 Acceptance Criteria

1. ✅ Cron job schedule: `0 12 * * 6#2` (12PM UTC, 2nd Saturday)
2. ✅ Mutation: `generateMonthlyNewsletter(groupId, month)` works correctly
3. ✅ Queries all submitted contributions for group/month
4. ✅ Identifies excluded members (no contribution or draft status)
5. ✅ Sends batch email via Resend API
6. ✅ Stores newsletter metadata in database
7. ✅ Handles zero contributions scenario (sends feedback email)
8. ✅ Error handling: Continues on partial failures, logs errors
9. ✅ Unit tests cover all scenarios

---

## 📝 Technical Specification

### File Structure

Create `convex/cron.ts`:

```typescript
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Every 2nd Saturday at 12:00 PM UTC
crons.monthly(
  "send-monthly-newsletters",
  "0 12 * * 6#2",
  internal.newsletters.generateAllNewsletters
);

export default crons;
```

### Main Newsletter Generation Logic

Create `convex/newsletters/generate.ts`:

```typescript
import { internalMutation } from "../_generated/server";
import { ConvexError } from "convex/values";
import { generateNewsletterEmailHTML } from "../helpers/newsletterHTML";

/**
 * Generate newsletters for all groups
 * Called by cron job every 2nd Saturday
 */
export const generateAllNewsletters = internalMutation({
  handler: async (ctx) => {
    const allGroups = await ctx.db.query("groups").collect();

    const results = [];

    for (const group of allGroups) {
      try {
        const result = await generateNewsletterForGroup(ctx, {
          groupId: group._id,
          month: getCurrentMonth(), // "2025-10"
        });
        results.push({ groupId: group._id, success: true, result });
      } catch (error) {
        console.error(`Failed to generate newsletter for group ${group._id}:`, error);
        results.push({
          groupId: group._id,
          success: false,
          error: error.message
        });
      }
    }

    return results;
  },
});

/**
 * Generate newsletter for a single group
 * Can be called manually or by cron
 */
export const generateNewsletterForGroup = internalMutation({
  args: {
    groupId: v.id("groups"),
    month: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Get group data
    const group = await ctx.db.get(args.groupId);
    if (!group) {
      throw new ConvexError("Group not found");
    }

    // 2. Get all contributions for this month
    const allContributions = await ctx.db
      .query("contributions")
      .filter((q) =>
        q.and(
          q.eq(q.field("groupId"), args.groupId),
          q.eq(q.field("month"), args.month)
        )
      )
      .collect();

    // 3. Filter submitted contributions
    const submittedContributions = allContributions.filter(
      (c) => c.status === "submitted"
    );

    // 4. Identify excluded members (no contribution or draft)
    const contributorIds = submittedContributions.map((c) => c.userId);
    const allMemberIds = group.memberIds;
    const excludedMemberIds = allMemberIds.filter(
      (id) => !contributorIds.includes(id)
    );

    // 5. Handle zero contributions scenario
    if (submittedContributions.length === 0) {
      await ctx.scheduler.runAfter(0, internal.emails.sendZeroContributionsEmails, {
        groupId: args.groupId,
        month: args.month,
        memberIds: allMemberIds,
      });
      return {
        newsletterId: null,
        reason: "zero_contributions"
      };
    }

    // 6. Enrich contributions with user data
    const contributionsWithUsers = await Promise.all(
      submittedContributions.map(async (c) => {
        const user = await ctx.db.get(c.userId);
        return { ...c, user };
      })
    );

    // 7. Get recipient emails
    const recipients = await Promise.all(
      allMemberIds.map(async (id) => {
        const user = await ctx.db.get(id);
        return user?.email;
      })
    );
    const recipientEmails = recipients.filter(Boolean) as string[];

    // 8. Send batch email via Resend
    const sendResult = await ctx.scheduler.runAfter(
      0,
      internal.emails.sendNewsletterBatch,
      {
        groupId: args.groupId,
        month: args.month,
        recipientEmails,
        contributions: contributionsWithUsers,
      }
    );

    // 9. Create newsletter record with metadata
    const newsletterId = await ctx.db.insert("newsletters", {
      groupId: args.groupId,
      month: args.month,
      sentAt: Date.now(),
      recipientEmails,
      resendId: sendResult.batchId,
      deliveryReport: {
        sent: sendResult.sent,
        failed: sendResult.failed,
        failedEmails: sendResult.failedEmails,
      },
      excludedMemberIds,
      htmlContent: "", // Generated on-the-fly
      webContent: "",  // Generated on-the-fly
    });

    // 10. Schedule admin report
    await ctx.scheduler.runAfter(0, internal.emails.sendAdminReport, {
      groupId: args.groupId,
      newsletterId,
    });

    return { newsletterId, sent: sendResult.sent, failed: sendResult.failed };
  },
});

/**
 * Helper: Get current month in "YYYY-MM" format
 */
function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}
```

---

## 🧪 Testing Requirements

### Unit Tests

Create `tests/backend/newsletter-generation.test.ts`:

```typescript
import { describe, it, expect, vi } from "vitest";
import { convexTest } from "convex-test";
import schema from "@/convex/schema";
import { internal } from "@/convex/_generated/api";

describe("Newsletter Generation", () => {
  it("should generate newsletter for group with contributions", async () => {
    const t = convexTest(schema);

    // Setup: Create group with members and contributions
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
    expect(result.sent).toBeGreaterThan(0);
  });

  it("should handle zero contributions scenario", async () => {
    const t = convexTest(schema);

    const groupId = await t.run((ctx) =>
      ctx.db.insert("groups", {
        name: "Empty Group",
        memberIds: [],
        createdAt: Date.now(),
      })
    );

    const result = await t.mutation(internal.newsletters.generateNewsletterForGroup, {
      groupId,
      month: "2025-10",
    });

    expect(result.reason).toBe("zero_contributions");
    expect(result.newsletterId).toBeNull();
  });

  it("should identify excluded members correctly", async () => {
    const t = convexTest(schema);

    // Setup: 2 members, 1 contributes, 1 doesn't
    const user1 = await t.run((ctx) =>
      ctx.db.insert("users", { email: "user1@example.com" })
    );
    const user2 = await t.run((ctx) =>
      ctx.db.insert("users", { email: "user2@example.com" })
    );

    const groupId = await t.run((ctx) =>
      ctx.db.insert("groups", {
        name: "Test Group",
        memberIds: [user1, user2],
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

    const result = await t.mutation(internal.newsletters.generateNewsletterForGroup, {
      groupId,
      month: "2025-10",
    });

    const newsletter = await t.run((ctx) => ctx.db.get(result.newsletterId));

    expect(newsletter.excludedMemberIds).toContain(user2);
    expect(newsletter.excludedMemberIds).not.toContain(user1);
  });
});
```

---

## 📦 Deliverables

- ✅ `convex/cron.ts` with cron schedule
- ✅ `convex/newsletters/generate.ts` with generation logic
- ✅ Unit tests passing (all scenarios covered)
- ✅ Manual test: Trigger cron, verify newsletter created
- ✅ Error logs for debugging

---

## 🔗 Contracts

### Input Contract (from NL1 & NL2)

- Schema with new fields (NL1)
- HTML generation helpers (NL2)

### Output Contract

```typescript
// Main mutation exposed for manual trigger (NL5)
generateNewsletterForGroup(
  groupId: Id<"groups">,
  month: string
): Promise<{
  newsletterId: Id<"newsletters"> | null
  sent: number
  failed: number
  reason?: string
}>
```

**Next Stories Depending on This**:
- NL4: Admin Report (triggered after newsletter generation)
- NL5: Manual Trigger (calls generateNewsletterForGroup mutation)

---

## ⚠️ Edge Cases

1. **Zero contributions**: Send feedback email instead of newsletter
2. **Partial contributions**: Include only submitted ones
3. **Invalid emails**: Log failed sends, continue with others
4. **Resend API failure**: Retry with exponential backoff
5. **Duplicate newsletters**: Check if newsletter already exists for group/month

---

## 📚 References

- Convex cron jobs: https://docs.convex.dev/scheduling/cron-jobs
- Resend batch API: https://resend.com/docs/api-reference/batch
- Cron expression: https://crontab.guru/
- Current contributions query: `convex/contributions.ts`
