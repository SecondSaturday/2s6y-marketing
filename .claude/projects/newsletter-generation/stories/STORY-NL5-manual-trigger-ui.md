# STORY-NL5: Manual Trigger UI for Admins

**Status**: 🟡 Pending
**Estimated Effort**: 1.5 hours
**Agent**: Frontend Agent
**Dependencies**: NL3 (Cron Job - needs generateNewsletterForGroup mutation)
**Blocks**: None

---

## 📋 Story Description

Add "Generate Newsletter" button in group settings for admins to manually trigger newsletter generation before 2nd Saturday (for testing and special cases).

---

## 🎯 Acceptance Criteria

1. ✅ Button visible only to group admins
2. ✅ Button location: Group settings page (new "Newsletter" tab or in existing tab)
3. ✅ Confirmation modal before triggering
4. ✅ Loading state during generation (disable button, show spinner)
5. ✅ Success message: "Newsletter generated and sent!"
6. ✅ Error message: Show specific error (e.g., "No contributions yet")
7. ✅ Responsive design (mobile-friendly)
8. ✅ Unit/E2E tests verify button works

---

## 📝 Technical Specification

### UI Location

Add to existing group settings page: `app/groups/[groupId]/settings/page.tsx`

**Option A**: New "Newsletter" tab (recommended)
**Option B**: Add to "General" tab under "Advanced" section

### Component Structure

Create `components/groups/ManualNewsletterTrigger.tsx`:

```typescript
"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface ManualNewsletterTriggerProps {
  groupId: Id<"groups">;
  currentMonth: string; // "2025-10"
}

export default function ManualNewsletterTrigger({
  groupId,
  currentMonth,
}: ManualNewsletterTriggerProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [result, setResult] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const generateNewsletter = useMutation(api.newsletters.generateNewsletterManually);

  const handleGenerate = async () => {
    setShowConfirmModal(false);
    setResult({ type: null, message: "" });

    try {
      const response = await generateNewsletter({
        groupId,
        month: currentMonth,
      });

      if (response.success) {
        setResult({
          type: "success",
          message: `Newsletter generated and sent to ${response.sent} members!`,
        });
      } else {
        setResult({
          type: "error",
          message: response.error || "Failed to generate newsletter",
        });
      }
    } catch (error) {
      setResult({
        type: "error",
        message: error.message || "An unexpected error occurred",
      });
    }
  };

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h3 className="card-title text-lg">Manual Newsletter Generation</h3>
        <p className="text-sm text-base-content/70">
          Generate and send this month's newsletter immediately. This is useful
          for testing or sending newsletters early.
        </p>

        <div className="divider"></div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm">
              <strong>Current Month:</strong> {formatMonth(currentMonth)}
            </p>
            <p className="text-xs text-base-content/60 mt-1">
              This will send emails to all active group members.
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => setShowConfirmModal(true)}
          >
            Generate Newsletter
          </button>
        </div>

        {/* Success/Error Messages */}
        {result.type === "success" && (
          <div className="alert alert-success mt-4">
            <CheckCircleIcon className="w-6 h-6" />
            <span>{result.message}</span>
          </div>
        )}

        {result.type === "error" && (
          <div className="alert alert-error mt-4">
            <ExclamationTriangleIcon className="w-6 h-6" />
            <span>{result.message}</span>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Confirm Newsletter Generation</h3>
              <p className="py-4">
                Are you sure you want to generate and send the newsletter for{" "}
                <strong>{formatMonth(currentMonth)}</strong>?
              </p>
              <p className="text-sm text-base-content/70">
                This will send emails to all active group members immediately.
              </p>

              <div className="modal-action">
                <button
                  className="btn btn-ghost"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleGenerate}>
                  Generate & Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Helper: Format month for display
 */
function formatMonth(month: string): string {
  const [year, monthNum] = month.split("-");
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return `${monthNames[parseInt(monthNum) - 1]} ${year}`;
}
```

### Backend Mutation (expose internal mutation)

Update `convex/newsletters/generate.ts`:

```typescript
import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";

/**
 * Manual trigger for newsletter generation (admin only)
 * Wrapper around internal mutation for admin UI
 */
export const generateNewsletterManually = mutation({
  args: {
    groupId: v.id("groups"),
    month: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Verify user is admin of this group
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const membership = await ctx.db
      .query("groupMembers")
      .withIndex("by_group_user", (q) =>
        q.eq("groupId", args.groupId).eq("userId", user._id)
      )
      .first();

    if (!membership || membership.role !== "admin") {
      throw new Error("Only admins can manually generate newsletters");
    }

    // Call internal mutation
    const result = await ctx.scheduler.runAfter(
      0,
      internal.newsletters.generateNewsletterForGroup,
      {
        groupId: args.groupId,
        month: args.month,
      }
    );

    return {
      success: true,
      newsletterId: result.newsletterId,
      sent: result.sent,
      failed: result.failed,
    };
  },
});
```

---

## 🧪 Testing Requirements

### Unit Tests

Create `tests/components/ManualNewsletterTrigger.spec.ts`:

```typescript
import { test, expect } from "@playwright/test";

test.describe("Manual Newsletter Trigger", () => {
  test("should show button only for admins", async ({ page }) => {
    // TODO: Login as admin
    await page.goto("/groups/test-group-id/settings");

    // Verify button is visible
    const button = page.locator('button:has-text("Generate Newsletter")');
    await expect(button).toBeVisible();
  });

  test("should show confirmation modal on click", async ({ page }) => {
    await page.goto("/groups/test-group-id/settings");

    await page.click('button:has-text("Generate Newsletter")');

    // Verify modal is visible
    await expect(page.locator(".modal")).toBeVisible();
    await expect(page.locator("text=Confirm Newsletter Generation")).toBeVisible();
  });

  test("should trigger newsletter generation", async ({ page }) => {
    await page.goto("/groups/test-group-id/settings");

    await page.click('button:has-text("Generate Newsletter")');
    await page.click('button:has-text("Generate & Send")');

    // Wait for success message
    await expect(page.locator(".alert-success")).toBeVisible();
    await expect(page.locator("text=Newsletter generated")).toBeVisible();
  });

  test("should handle errors gracefully", async ({ page }) => {
    // TODO: Mock failed API call
    await page.goto("/groups/test-group-id/settings");

    await page.click('button:has-text("Generate Newsletter")');
    await page.click('button:has-text("Generate & Send")');

    // Wait for error message
    await expect(page.locator(".alert-error")).toBeVisible();
  });
});
```

---

## 📦 Deliverables

- ✅ `components/groups/ManualNewsletterTrigger.tsx` component
- ✅ Backend mutation: `generateNewsletterManually` (admin-only)
- ✅ Integrated into group settings page
- ✅ Confirmation modal working
- ✅ Loading/success/error states working
- ✅ Unit/E2E tests passing

---

## 🔗 Contracts

### Backend Contract (from NL3)

```typescript
generateNewsletterManually(
  groupId: Id<"groups">,
  month: string
): Promise<{
  success: boolean
  newsletterId?: Id<"newsletters">
  sent?: number
  failed?: number
  error?: string
}>
```

---

## ⚠️ Edge Cases

1. **Non-admin user**: Hide button, throw error if API called directly
2. **No contributions**: Show friendly error: "No members have contributed yet"
3. **Newsletter already exists**: Warn: "Newsletter already generated for this month"
4. **Network failure**: Show retry button

---

## 📚 References

- Group settings page: `app/groups/[groupId]/settings/page.tsx`
- DaisyUI modal: https://daisyui.com/components/modal/
- DaisyUI alert: https://daisyui.com/components/alert/
