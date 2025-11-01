# STORY-NL4: Admin Report Email System

**Status**: 🟡 Pending
**Estimated Effort**: 2 hours
**Agent**: Backend Agent
**Dependencies**: NL3 (Cron Job)
**Blocks**: None

---

## 📋 Story Description

Create email system to send admin reports after newsletter generation, including delivery stats, contribution counts, and excluded member list.

---

## 🎯 Acceptance Criteria

1. ✅ Admin report email sent after successful newsletter generation
2. ✅ Report includes: total members, contributors, excluded members, delivery stats
3. ✅ Report sent to all group admins (via email)
4. ✅ Email template uses DaisyUI cupcake design system
5. ✅ Handles both success and failure scenarios
6. ✅ Unit tests verify email content and recipient list

---

## 📝 Technical Specification

### Email Action

Create `convex/emails/adminReport.ts`:

```typescript
import { action } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";

/**
 * Send admin report after newsletter generation
 */
export const sendAdminReport = action({
  args: {
    groupId: v.id("groups"),
    newsletterId: v.id("newsletters"),
  },
  handler: async (ctx, args) => {
    // 1. Get newsletter data
    const newsletter = await ctx.runQuery(internal.newsletters.get, {
      id: args.newsletterId,
    });

    if (!newsletter) {
      throw new Error("Newsletter not found");
    }

    // 2. Get group data and admins
    const group = await ctx.runQuery(internal.groups.getGroupById, {
      groupId: args.groupId,
    });

    const admins = await ctx.runQuery(internal.groupMembers.getAdmins, {
      groupId: args.groupId,
    });

    // 3. Calculate stats
    const totalMembers = group.memberIds.length;
    const contributors = totalMembers - (newsletter.excludedMemberIds?.length || 0);
    const excluded = newsletter.excludedMemberIds?.length || 0;
    const deliveryStats = newsletter.deliveryReport || { sent: 0, failed: 0, failedEmails: [] };

    // 4. Build email content
    const emailHTML = buildAdminReportHTML({
      groupName: group.name,
      month: newsletter.month,
      totalMembers,
      contributors,
      excluded,
      excludedMemberNames: [], // TODO: Fetch names
      deliveryStats,
    });

    // 5. Send to all admins
    const { resendApiKey, fromEmail } = getEmailConfig();

    const results = [];
    for (const admin of admins) {
      const result = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: admin.email,
          subject: `[${group.name}] Newsletter Report - ${formatMonth(newsletter.month)}`,
          html: emailHTML,
        }),
      });

      results.push({
        adminEmail: admin.email,
        success: result.ok,
      });
    }

    return { results };
  },
});

/**
 * Build admin report HTML
 */
function buildAdminReportHTML(data: {
  groupName: string;
  month: string;
  totalMembers: number;
  contributors: number;
  excluded: number;
  excludedMemberNames: string[];
  deliveryStats: {
    sent: number;
    failed: number;
    failedEmails: string[];
  };
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Newsletter Report - ${data.groupName}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8f2ed; padding: 40px 20px;">
  <table width="600" cellpadding="0" cellspacing="0" style="margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #a442fe 0%, #80e4e4 100%); padding: 30px; text-align: center;">
        <h1 style="margin: 0; color: #ffffff; font-size: 24px;">Newsletter Report</h1>
        <p style="margin: 10px 0 0 0; color: #ffffff; opacity: 0.9;">${data.groupName} - ${formatMonth(data.month)}</p>
      </td>
    </tr>

    <!-- Stats -->
    <tr>
      <td style="padding: 30px;">
        <h2 style="margin: 0 0 20px 0; font-size: 18px; color: #333;">📊 Newsletter Statistics</h2>

        <table width="100%" cellpadding="10" style="border-collapse: collapse;">
          <tr style="background-color: #f8f2ed;">
            <td style="padding: 15px; border-radius: 8px;"><strong>Total Members</strong></td>
            <td style="padding: 15px; text-align: right;">${data.totalMembers}</td>
          </tr>
          <tr>
            <td style="padding: 15px;"><strong>Contributors</strong></td>
            <td style="padding: 15px; text-align: right; color: #22c55e;">${data.contributors} ✓</td>
          </tr>
          <tr style="background-color: #f8f2ed;">
            <td style="padding: 15px; border-radius: 8px;"><strong>Excluded (No Contribution)</strong></td>
            <td style="padding: 15px; text-align: right; color: #ef4444;">${data.excluded}</td>
          </tr>
        </table>

        ${data.excludedMemberNames.length > 0 ? `
        <div style="margin: 20px 0; padding: 15px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
          <p style="margin: 0 0 10px 0; font-weight: bold; color: #92400e;">Excluded Members:</p>
          <ul style="margin: 0; padding-left: 20px; color: #92400e;">
            ${data.excludedMemberNames.map(name => `<li>${name}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        <h2 style="margin: 30px 0 20px 0; font-size: 18px; color: #333;">📧 Email Delivery</h2>

        <table width="100%" cellpadding="10" style="border-collapse: collapse;">
          <tr style="background-color: #f8f2ed;">
            <td style="padding: 15px; border-radius: 8px;"><strong>Successfully Sent</strong></td>
            <td style="padding: 15px; text-align: right; color: #22c55e;">${data.deliveryStats.sent} ✓</td>
          </tr>
          <tr>
            <td style="padding: 15px;"><strong>Failed</strong></td>
            <td style="padding: 15px; text-align: right; color: #ef4444;">${data.deliveryStats.failed}</td>
          </tr>
        </table>

        ${data.deliveryStats.failedEmails.length > 0 ? `
        <div style="margin: 20px 0; padding: 15px; background-color: #fee2e2; border-left: 4px solid #ef4444; border-radius: 4px;">
          <p style="margin: 0 0 10px 0; font-weight: bold; color: #991b1b;">Failed Emails:</p>
          <ul style="margin: 0; padding-left: 20px; color: #991b1b;">
            ${data.deliveryStats.failedEmails.map(email => `<li>${email}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        <p style="margin: 30px 0 0 0; padding: 20px; background-color: #f8f2ed; border-radius: 8px; text-align: center; color: #666;">
          ✅ Newsletter successfully generated and sent!
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 20px; text-align: center; background-color: #f8f2ed; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; font-size: 14px; color: #666;">
          2Sat - Automated Newsletter Report
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Helper: Format month for display
 */
function formatMonth(month: string): string {
  const [year, monthNum] = month.split("-");
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${monthNames[parseInt(monthNum) - 1]} ${year}`;
}

/**
 * Get email configuration
 */
function getEmailConfig() {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "2Sat Updates <onboarding@resend.dev>";

  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY not configured");
  }

  return { resendApiKey, fromEmail };
}
```

---

## 🧪 Testing Requirements

### Unit Tests

Create `tests/backend/admin-report.test.ts`:

```typescript
import { describe, it, expect, vi } from "vitest";
import { convexTest } from "convex-test";
import schema from "@/convex/schema";
import { internal } from "@/convex/_generated/api";

describe("Admin Report Email", () => {
  it("should send admin report to all group admins", async () => {
    const t = convexTest(schema);

    // Setup: Create group with admins and newsletter
    const adminUserId = await t.run((ctx) =>
      ctx.db.insert("users", {
        email: "admin@example.com",
        name: "Admin User",
      })
    );

    const groupId = await t.run((ctx) =>
      ctx.db.insert("groups", {
        name: "Test Group",
        memberIds: [adminUserId],
        createdAt: Date.now(),
      })
    );

    await t.run((ctx) =>
      ctx.db.insert("groupMembers", {
        groupId,
        userId: adminUserId,
        role: "admin",
        status: "active",
        joinedAt: Date.now(),
      })
    );

    const newsletterId = await t.run((ctx) =>
      ctx.db.insert("newsletters", {
        groupId,
        month: "2025-10",
        sentAt: Date.now(),
        recipientEmails: ["member@example.com"],
        resendId: "batch_123",
        deliveryReport: { sent: 5, failed: 1, failedEmails: ["failed@example.com"] },
        excludedMemberIds: [],
      })
    );

    // Act: Send admin report
    const result = await t.action(internal.emails.sendAdminReport, {
      groupId,
      newsletterId,
    });

    // Assert
    expect(result.results).toHaveLength(1);
    expect(result.results[0].adminEmail).toBe("admin@example.com");
  });
});
```

---

## 📦 Deliverables

- ✅ `convex/emails/adminReport.ts` with email action
- ✅ HTML email template with stats
- ✅ Unit tests passing
- ✅ Manual test: Verify email received with correct data

---

## 🔗 Contracts

### Input Contract (from NL3)

- Newsletter record with deliveryReport and excludedMemberIds
- Called after newsletter generation completes

### Output Contract

```typescript
sendAdminReport(groupId, newsletterId): Promise<{
  results: Array<{ adminEmail: string; success: boolean }>
}>
```

---

## ⚠️ Edge Cases

1. **No admins**: Log warning, skip email
2. **Invalid admin emails**: Log error, continue with others
3. **Empty excluded list**: Show "All members contributed!" message
4. **All emails failed**: Highlight in red

---

## 📚 References

- Existing email actions: `convex/emailActions.ts`
- Resend API: https://resend.com/docs/api-reference/emails/send-email
