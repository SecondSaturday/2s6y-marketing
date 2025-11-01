# STORY-NL1: Schema Updates & Newsletter Metadata

**Status**: 🟡 Pending
**Estimated Effort**: 2 hours
**Agent**: Backend Agent
**Dependencies**: None
**Blocks**: NL2, NL3, NL5

---

## 📋 Story Description

Update the `newsletters` table schema to support metadata tracking for newsletter generation, including delivery reports and excluded members list.

---

## 🎯 Acceptance Criteria

1. ✅ Schema includes `excludedMemberIds: Id<"users">[]` field
2. ✅ Schema includes `deliveryReport: { sent: number, failed: number, failedEmails: string[] }` field
3. ✅ `htmlContent` and `webContent` are optional (will be empty/null for on-the-fly generation)
4. ✅ `resendId` stores Resend batch ID (string, not array)
5. ✅ Migration script exists (if needed for existing data)
6. ✅ Unit tests verify new fields can be inserted/queried

---

## 📝 Technical Specification

### Schema Changes

Update `convex/schema.ts`:

```typescript
newsletters: defineTable({
  groupId: v.id("groups"),
  month: v.string(), // Format: "2025-10"
  sentAt: v.number(),

  // Email delivery metadata
  recipientEmails: v.array(v.string()),
  resendId: v.optional(v.string()), // Resend batch ID

  // Delivery tracking
  deliveryReport: v.optional(v.object({
    sent: v.number(),
    failed: v.number(),
    failedEmails: v.array(v.string()),
  })),

  // Member tracking
  excludedMemberIds: v.optional(v.array(v.id("users"))), // Members who didn't contribute

  // HTML content (empty for on-the-fly generation, optional for archival)
  htmlContent: v.optional(v.string()),
  webContent: v.optional(v.string()),
})
  .index("by_group", ["groupId"])
  .index("by_month", ["month"])
  .index("by_sent_at", ["sentAt"])
```

### Migration Script (if needed)

If there are existing newsletters in the database, create `convex/migrations/001_newsletter_schema_update.ts`:

```typescript
import { internalMutation } from "./_generated/server";

export const migrateNewsletterSchema = internalMutation({
  handler: async (ctx) => {
    const newsletters = await ctx.db.query("newsletters").collect();

    for (const newsletter of newsletters) {
      await ctx.db.patch(newsletter._id, {
        deliveryReport: newsletter.deliveryReport || { sent: 0, failed: 0, failedEmails: [] },
        excludedMemberIds: newsletter.excludedMemberIds || [],
      });
    }

    return { migrated: newsletters.length };
  },
});
```

---

## 🧪 Testing Requirements

### Unit Tests

Create `tests/backend/newsletters-schema.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { convexTest } from "convex-test";
import schema from "@/convex/schema";

describe("Newsletter Schema", () => {
  it("should create newsletter with new fields", async () => {
    const t = convexTest(schema);

    // Insert newsletter with new fields
    const newsletterId = await t.run(async (ctx) => {
      return await ctx.db.insert("newsletters", {
        groupId: t.id("groups"),
        month: "2025-10",
        sentAt: Date.now(),
        recipientEmails: ["test@example.com"],
        resendId: "batch_123",
        deliveryReport: {
          sent: 5,
          failed: 1,
          failedEmails: ["failed@example.com"],
        },
        excludedMemberIds: [t.id("users")],
      });
    });

    expect(newsletterId).toBeDefined();
  });

  it("should handle optional fields correctly", async () => {
    const t = convexTest(schema);

    // Insert newsletter without optional fields
    const newsletterId = await t.run(async (ctx) => {
      return await ctx.db.insert("newsletters", {
        groupId: t.id("groups"),
        month: "2025-10",
        sentAt: Date.now(),
        recipientEmails: [],
      });
    });

    const newsletter = await t.run((ctx) => ctx.db.get(newsletterId));

    expect(newsletter.deliveryReport).toBeUndefined();
    expect(newsletter.excludedMemberIds).toBeUndefined();
    expect(newsletter.htmlContent).toBeUndefined();
  });
});
```

---

## 📦 Deliverables

- ✅ Updated `convex/schema.ts` with new fields
- ✅ Migration script (if existing data needs updating)
- ✅ Unit tests passing
- ✅ Convex deployment successful (no schema errors)

---

## 🔗 Contracts

### Output Contract

After this story completes, the following fields will be available for use in subsequent stories:

```typescript
type Newsletter = {
  _id: Id<"newsletters">
  groupId: Id<"groups">
  month: string
  sentAt: number
  recipientEmails: string[]
  resendId?: string
  deliveryReport?: {
    sent: number
    failed: number
    failedEmails: string[]
  }
  excludedMemberIds?: Id<"users">[]
  htmlContent?: string
  webContent?: string
}
```

**Next Stories Depending on This**:
- NL2: HTML Generation Helpers (needs schema structure)
- NL3: Cron Job Logic (will insert newsletter records)
- NL5: Manual Trigger (will insert newsletter records)

---

## ⚠️ Edge Cases

1. **Empty arrays**: Ensure `recipientEmails`, `failedEmails`, `excludedMemberIds` handle empty arrays correctly
2. **Optional fields**: Verify queries work when optional fields are undefined
3. **Resend batch ID format**: Confirm Resend returns string (not object) for batch sends

---

## 📚 References

- Convex schema docs: https://docs.convex.dev/database/schemas
- Current schema: `convex/schema.ts`
- Newsletter queries: `convex/newsletters.ts`
