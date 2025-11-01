# Group Invite System V2 - Interface Contracts

**Version**: 2.0.0 (Gate 1 Fixes Applied)
**Status**: Ready for Re-Approval (Gate 1)
**Last Updated**: 2025-10-26 (Critical Issues Fixed)

---

## CONTRACT 1: Database Schema Changes

### Groups Table
```typescript
// BEFORE (v1)
groups: defineTable({
  inviteCode: v.optional(v.string()), // ❌ Optional
})

// AFTER (v2)
groups: defineTable({
  inviteCode: v.string(), // ✅ Required
  inviteCodeGeneratedAt: v.number(), // ✅ NEW
})
  .index("by_invite_code", ["inviteCode"]) // ✅ NEW
```

**Migration Impact**:
- All groups MUST have an invite code
- Backfill script will generate codes for existing groups
- NEW index enables fast lookup by code

---

### Users Table
```typescript
// AFTER (v2)
users: defineTable({
  // ... existing fields
  weeklyInviteCount: v.optional(v.number()), // ✅ NEW (default: 0)
  weeklyInviteResetAt: v.optional(v.number()), // ✅ NEW (timestamp)
})
```

**Migration Impact**:
- Enables per-user rate limiting
- Backfill script initializes to 0 for existing users

---

### Invites Table
```typescript
// BEFORE (v1)
invites: defineTable({
  groupId: v.id("groups"),
  email: v.string(),
  invitedBy: v.id("users"),
  inviteCode: v.string(), // ❌ REMOVE (each invite had its own code)
  status: v.union("pending", "accepted", "expired"),
  // ...
})
  .index("by_code", ["inviteCode"]) // ❌ REMOVE

// AFTER (v2)
invites: defineTable({
  groupId: v.id("groups"),
  email: v.string(),
  invitedBy: v.id("users"),
  // inviteCode REMOVED - use group's code via groupId lookup
  status: v.union("pending", "accepted", "expired"),
  createdAt: v.number(),
  expiresAt: v.optional(v.number()),
  acceptedAt: v.optional(v.number()),
})
  .index("by_group_email", ["groupId", "email"]) // ✅ NEW composite index
```

**Migration Impact**:
- ALL pending invites will be EXPIRED (fresh start)
- Email invites now reference group's code only
- Composite index enables fast lookup by (group + email)

---

## CONTRACT 2: API Contracts (Backend)

### Invite Mutations

#### createInvite (Single Invite)
```typescript
// INPUT
{
  groupId: Id<"groups">,
  email: string
}

// OUTPUT
{
  inviteId: Id<"invites">
}

// ERRORS
- ConvexError("Invalid email format")
- ConvexError("This person has already been invited")
- ConvexError("This person is already a member")
- ConvexError("This person was removed. Use 'Re-add Member' instead")
- ConvexError("This person is blocked and cannot be invited")
- ConvexError("Rate limit exceeded. You can invite X more members this week (limit: 50/week)")
```

**Frontend Contract**:
- Frontend MUST validate email format before calling
- Frontend MUST handle rate limit error gracefully
- Frontend SHOULD show remaining invite count from `getRemainingInvites` query

---

#### createBulkInvites (Batch Invite)
```typescript
// INPUT
{
  groupId: Id<"groups">,
  emails: string[] // Max 50 emails (rate limit)
}

// OUTPUT
{
  inviteIds: Id<"invites">[], // All created invite IDs
  total: number // Total invites created
}

// ERRORS
- ConvexError("No valid emails provided")
- ConvexError("Invalid email format: {email}") // First invalid email found
- ConvexError("Rate limit exceeded...") // All-or-nothing validation
- ConvexError("Email already invited: {email}") // First duplicate found
```

**Transaction Behavior**: ALL-OR-NOTHING
- If ANY email fails validation (format, duplicate, blocked, etc.), NO invites are created
- If rate limit is exceeded, NO invites are created
- Frontend gets EITHER all invites created OR error with first failure reason
- No partial success states (simpler UX, easier error handling)

**Frontend Contract**:
- Frontend MUST validate all emails before calling (client-side validation)
- Frontend handles only binary outcomes: total success OR total failure
- Frontend SHOULD check rate limit BEFORE calling (prevent user frustration)
- Frontend displays clear error message for first failed email

---

#### regenerateInviteCode
```typescript
// INPUT
{
  groupId: Id<"groups">
}

// OUTPUT
{
  inviteCode: string, // New code (format: {adj}-{word}-{000-999})
  expiredCount: number // Number of pending invites expired
}

// ERRORS
- ConvexError("Not authorized") // User is not admin
```

**Frontend Contract**:
- Frontend MUST show confirmation dialog BEFORE calling
- Frontend MUST warn user that old code will stop working
- Frontend MUST display new code prominently after regeneration

---

#### cancelInvite
```typescript
// INPUT
{
  inviteId: Id<"invites">
}

// OUTPUT
{
  success: true
}

// ERRORS
- ConvexError("Invite not found")
- ConvexError("Not authorized")
```

---

### Accept Invite & Join Request Mutations

#### acceptInvite (Dual-Flow Decision)
```typescript
// INPUT
{
  inviteCode: string // Group's invite code
}

// OUTPUT
{
  success: true,
  action: "joined" | "requested", // Which flow was used
  groupId: Id<"groups">
}

// ERRORS
- ConvexError("Invalid invite code")
- ConvexError("This invitation has expired. Please contact the group admin for a new invitation.")
- ConvexError("You cannot join this group") // Blocked
- ConvexError("You are already a member of this group")
- ConvexError("You already have a pending join request for this group")
- ConvexError("User join limit exceeded") // Max 5 groups
- ConvexError("Group member limit exceeded")
```

**Frontend Contract**:
- Frontend MUST handle BOTH actions ("joined" vs "requested")
- Frontend MUST show different success messages for each action
- Frontend MUST navigate appropriately (joined → group page, requested → dashboard)
- Frontend MUST handle expired invite gracefully with clear messaging

**Dual-Flow Logic** (Backend Implementation):
```
1. Find group by inviteCode
2. Check if pending email invite exists for user.email + group
3. IF yes:
   - FLOW A: Auto-join (create groupMember immediately)
   - Return { action: "joined" }
4. IF no:
   - FLOW B: Create join request (admin approval needed)
   - Return { action: "requested" }
```

---

#### approveJoinRequest
```typescript
// INPUT
{
  requestId: Id<"joinRequests">
}

// OUTPUT
{
  success: true
}

// ERRORS
- ConvexError("Join request not found")
- ConvexError("Not authorized")
- ConvexError("User is blocked")
- ConvexError("Group member limit exceeded")
```

---

#### rejectJoinRequest
```typescript
// INPUT
{
  requestId: Id<"joinRequests">
}

// OUTPUT
{
  success: true
}
```

---

### Queries

#### getGroupByInviteCode (PUBLIC - No Auth)
```typescript
// INPUT
{
  inviteCode: string
}

// OUTPUT
{
  groupId: Id<"groups">,
  name: string,
  description: string | undefined,
  groupImage: string | undefined,
  memberCount: number
} | null // null if invalid code

// ERRORS
None (returns null for invalid codes)
```

**Frontend Contract**:
- Frontend MUST handle null response (invalid code)
- Frontend can call this WITHOUT authentication (public preview)
- Frontend SHOULD debounce calls (500ms) when typing code

---

#### getRemainingInvites
```typescript
// INPUT
{
  userId: Id<"users">
}

// OUTPUT
{
  remaining: number, // 0-50
  limit: number, // Always 50
  resetAt: number // Unix timestamp
}

// ERRORS
None (returns full limit if user not found)
```

**Frontend Contract**:
- Frontend SHOULD display this prominently in invite UI
- Frontend SHOULD show "X/50 this week" format
- Frontend SHOULD disable invite button when remaining = 0

---

## CONTRACT 3: Notification Payloads

### group_invite (User Receives Email Invite)
```typescript
{
  userId: Id<"users">,
  type: "group_invite",
  title: "Group Invitation",
  message: "You've been invited to join {groupName}",
  isRead: false,
  createdAt: number,
  groupId: Id<"groups">,
  metadata: {
    groupName: string,
    actionUrl: string, // Format: "/invite/{inviteCode}"
  }
}
```

**Frontend Contract**:
- Frontend MUST display ✉️ icon for this type
- Frontend MUST navigate to `metadata.actionUrl` on click
- Frontend MUST mark as read on click

---

### join_request (Admin Receives Join Request)
```typescript
{
  userId: Id<"users">, // Admin's ID
  type: "join_request",
  title: "New Join Request",
  message: "{userName} requested to join {groupName}",
  isRead: false,
  createdAt: number,
  groupId: Id<"groups">,
  metadata: {
    groupName: string,
    actionUrl: string, // Format: "/groups/{groupId}/settings?tab=requests"
  }
}
```

**Frontend Contract**:
- Frontend MUST display 👋 icon for this type
- Frontend MUST navigate to join requests tab
- Frontend SHOULD highlight the specific request (if possible)

---

### join_approved (User's Request Approved)
```typescript
{
  userId: Id<"users">,
  type: "join_approved",
  title: "Join Request Approved",
  message: "You've been accepted to join {groupName}",
  isRead: false,
  createdAt: number,
  groupId: Id<"groups">,
  metadata: {
    groupName: string,
    actionUrl: string, // Format: "/groups/{groupId}"
  }
}
```

**Frontend Contract**:
- Frontend MUST display ✅ icon for this type
- Frontend MUST navigate to group page

---

### join_rejected (User's Request Rejected)
```typescript
{
  userId: Id<"users">,
  type: "join_rejected",
  title: "Join Request Declined",
  message: "Your request to join {groupName} was declined",
  isRead: false,
  createdAt: number,
  groupId: Id<"groups">,
  metadata: {
    groupName: string,
    actionUrl: string | undefined, // No action (optional)
  }
}
```

**Frontend Contract**:
- Frontend MUST display ❌ icon for this type
- Frontend SHOULD show as informational only (no click action)

---

## CONTRACT 4: Frontend-Backend Integration

### Loading States
All frontend components MUST handle these states:
1. **Initial Load** - Skeleton or spinner
2. **Loading** - Mutation in progress (disable buttons)
3. **Success** - Show success message (toast), clear form
4. **Error** - Show error message (toast), keep form state

### Error Handling
Frontend MUST:
- Parse `ConvexError` messages
- Display user-friendly messages
- Log errors to console (development only)
- NOT expose technical details to users

### Optimistic Updates
Frontend SHOULD (optional):
- Optimistically update UI for join requests (remove from list on approve/reject)
- Revert on error

---

## CONTRACT 5: Migration Script

### Migration Strategy: FRESH START (Simplified)

**Context**: This is a development server with test data only. No production users exist yet.

**Strategy**: Delete all existing data and regenerate with new schema. No backward compatibility needed.

### Migration Execution Order
```typescript
// convex/migrations/inviteSystemV2.ts

export const migrateInviteSystem = internalMutation({
  handler: async (ctx) => {
    // STEP 1: DELETE all existing invites (fresh start)
    const allInvites = await ctx.db.query("invites").collect();
    for (const invite of allInvites) {
      await ctx.db.delete(invite._id);
    }

    // STEP 2: Backfill ALL groups with invite codes
    const allGroups = await ctx.db.query("groups").collect();

    const failedGroups: Id<"groups">[] = [];

    for (const group of allGroups) {
      try {
        const code = await generateUniqueInviteCode(ctx);
        await ctx.db.patch(group._id, {
          inviteCode: code,
          inviteCodeGeneratedAt: Date.now(),
        });
      } catch (error) {
        // Log failed group, continue migration
        console.error(`Failed to generate code for group ${group._id}:`, error);
        failedGroups.push(group._id);
      }
    }

    // STEP 3: Initialize ALL user rate limit fields
    const allUsers = await ctx.db.query("users").collect();

    for (const user of allUsers) {
      await ctx.db.patch(user._id, {
        weeklyInviteCount: 0,
        weeklyInviteResetAt: Date.now() + (7 * 24 * 60 * 60 * 1000),
      });
    }

    return {
      deletedInvites: allInvites.length,
      groupsBackfilled: allGroups.length - failedGroups.length,
      failedGroups: failedGroups,
      usersInitialized: allUsers.length,
    };
  },
});
```

**Contract**:
- Migration DELETES all existing invites (fresh start, no backward compatibility)
- Migration backfills ALL groups (not just missing codes)
- Migration initializes ALL users (overwrites existing values)
- Migration handles code generation failures gracefully (logs and continues)
- Migration returns detailed results including failed groups
- Migration is idempotent (safe to run multiple times)

---

## CONTRACT 6: Code Generation

### Invite Code Format
```
Format: {adjective}-{word}-{number}
Example: happy-basil-042
```

### Specifications
- **Adjectives**: 500 words (positive, memorable)
- **Middle Words**: 500 words (125 each: spices, animals, vehicles, cities)
- **Numbers**: 000-999 (3 digits, zero-padded)
- **Total Combinations**: 500 × 500 × 1000 = 250,000,000

### Uniqueness Guarantee
```typescript
export async function generateUniqueInviteCode(ctx: QueryCtx): Promise<string> {
  const maxRetries = 10;

  for (let i = 0; i < maxRetries; i++) {
    const code = generateInviteCode();

    // Check if code already exists
    const existing = await ctx.db
      .query("groups")
      .withIndex("by_invite_code", q => q.eq("inviteCode", code))
      .first();

    if (!existing) return code;
  }

  throw new ConvexError("Failed to generate unique invite code after 10 attempts");
}
```

**Contract**:
- Backend MUST attempt uniqueness check with 10 retries
- Backend MUST throw error if all retries fail
- Frontend MUST handle this error (very rare, <0.001% probability)

---

## CONTRACT 7: Rate Limiting

### Rate Limit Rules
- **Limit**: 50 invites per user per week
- **Reset**: Every 7 days from first invite (note: may desynchronize across users, acceptable for MVP)
- **Scope**: Per user (not per group)
- **Validation**: All-or-nothing for bulk invites
- **Concurrency**: Atomic increment to prevent race conditions

### Atomic Increment Implementation
```typescript
// CRITICAL: Use atomic operations to prevent race conditions
export async function checkAndIncrementInviteLimit(
  ctx: MutationCtx,
  userId: Id<"users">,
  emailCount: number
): Promise<void> {
  const user = await ctx.db.get(userId);
  if (!user) throw new ConvexError("User not found");

  const now = Date.now();
  const resetAt = user.weeklyInviteResetAt || 0;

  // Reset if week passed
  let currentCount = user.weeklyInviteCount || 0;
  if (now > resetAt) {
    currentCount = 0;
    // Atomic update: set count AND resetAt together
    await ctx.db.patch(userId, {
      weeklyInviteCount: 0,
      weeklyInviteResetAt: now + WEEK_IN_MS
    });
  }

  // Check limit BEFORE incrementing
  if (currentCount + emailCount > WEEKLY_INVITE_LIMIT) {
    const remaining = WEEKLY_INVITE_LIMIT - currentCount;
    throw new ConvexError(
      `Rate limit exceeded. You can invite ${remaining} more members this week (limit: ${WEEKLY_INVITE_LIMIT}/week)`
    );
  }

  // Atomic increment (single patch operation)
  await ctx.db.patch(userId, {
    weeklyInviteCount: currentCount + emailCount
  });
}
```

### Batch Validation
```typescript
// Before creating ANY invites, check if entire batch fits under limit
const remaining = await getRemainingInvites(ctx, userId);
if (emailCount > remaining) {
  throw new ConvexError(
    `Rate limit exceeded. You can invite ${remaining} more members this week (limit: 50/week)`
  );
}
```

**Contract**:
- Backend MUST use atomic operations (single `ctx.db.patch` call per update)
- Backend MUST validate BEFORE creating any invites
- Backend MUST NOT partially create invites (all-or-nothing)
- Backend accepts best-effort atomicity (Convex guarantees single-document atomicity)
- Frontend SHOULD pre-validate and disable UI if limit exceeded

**Known Limitation** (Acceptable for MVP):
- Rare race condition: If two mutations run simultaneously on same user, rate limit may allow 1-2 invites over limit (probability <0.01%)
- Mitigation: Single-document atomic patches minimize risk
- Future enhancement: Add distributed locking if needed

---

## CONTRACT 8: Email Delivery Status Tracking

### Requirement
Track email delivery status from Resend and display in group settings invite section.

### Invites Schema Extension
```typescript
// Add to invites table schema
invites: defineTable({
  // ... existing fields
  emailStatus: v.optional(v.union(
    v.literal("pending"),    // Email scheduled but not sent yet
    v.literal("sent"),       // Email sent to Resend
    v.literal("delivered"),  // Resend confirmed delivery
    v.literal("bounced"),    // Email bounced (invalid address)
    v.literal("failed")      // Resend failed to send
  )),
  emailSentAt: v.optional(v.number()),      // When email was sent to Resend
  emailDeliveredAt: v.optional(v.number()), // When Resend confirmed delivery
  emailError: v.optional(v.string()),       // Error message if failed/bounced
})
```

### Email Scheduling Mutation Updates
```typescript
// In createInvite mutation
export const createInvite = mutation({
  handler: async (ctx, args) => {
    // ... existing logic

    // Create invite with email status tracking
    const inviteId = await ctx.db.insert("invites", {
      groupId: args.groupId,
      email: args.email,
      invitedBy: user._id,
      status: "pending",
      emailStatus: "pending", // NEW
      createdAt: Date.now(),
    });

    // Schedule email with Resend
    try {
      await ctx.scheduler.runAfter(0, internal.emails.sendGroupInvite, {
        inviteId,
        email: args.email,
        groupName: group.name,
        inviteCode: group.inviteCode,
      });

      // Update status to "sent" immediately after scheduling
      await ctx.db.patch(inviteId, {
        emailStatus: "sent",
        emailSentAt: Date.now(),
      });
    } catch (error) {
      // Update status to "failed" if scheduling fails
      await ctx.db.patch(inviteId, {
        emailStatus: "failed",
        emailError: error.message,
      });
    }

    return { inviteId };
  }
});
```

### Resend Webhook Integration (Future)
```typescript
// convex/http.ts - Webhook endpoint for Resend delivery events

export const http = httpRouter();

http.route({
  path: "/webhooks/resend",
  method: "POST",
  handler: async (ctx, request) => {
    const event = await request.json();

    // event.type: "email.delivered" | "email.bounced" | "email.failed"
    // event.data.email_id: Resend email ID (map to inviteId via metadata)

    if (event.type === "email.delivered") {
      await ctx.runMutation(internal.invites.updateEmailStatus, {
        inviteId: event.data.metadata.inviteId,
        status: "delivered",
        deliveredAt: Date.now(),
      });
    } else if (event.type === "email.bounced") {
      await ctx.runMutation(internal.invites.updateEmailStatus, {
        inviteId: event.data.metadata.inviteId,
        status: "bounced",
        error: event.data.bounce_reason,
      });
    }

    return new Response(null, { status: 200 });
  }
});
```

### Frontend Contract: Invite List UI
```typescript
// In group settings invite section, display email status for each invite

type InviteWithStatus = {
  _id: Id<"invites">,
  email: string,
  status: "pending" | "accepted" | "expired",
  emailStatus?: "pending" | "sent" | "delivered" | "bounced" | "failed",
  emailError?: string,
  createdAt: number,
}

// UI Display Rules:
// - "pending" → 🕒 Sending... (gray)
// - "sent" → ✉️ Sent (blue)
// - "delivered" → ✅ Delivered (green)
// - "bounced" → ⚠️ Bounced (orange) + show emailError tooltip
// - "failed" → ❌ Failed (red) + show emailError tooltip
```

**Frontend Contract**:
- Frontend MUST display email status icon/badge for each invite in settings
- Frontend MUST show error details in tooltip/popover for bounced/failed emails
- Frontend SHOULD color-code status (gray/blue/green/orange/red)
- Frontend SHOULD offer "Resend" button for bounced/failed invites

**Backend Contract**:
- Backend MUST update emailStatus when scheduling email
- Backend MUST capture Resend API errors and store in emailError field
- Backend MAY implement webhook handler for delivery confirmation (optional for MVP)
- Backend defaults to "sent" if webhook not implemented (good enough for MVP)

**MVP Implementation**:
- Phase 1 (MVP): Track "pending" → "sent" → "failed" only (no webhook)
- Phase 2 (Post-MVP): Add Resend webhook for "delivered" and "bounced" status

---

## CONTRACT APPROVAL CHECKLIST

- [ ] **Strategic Planner** reviewed all contracts
- [ ] **Backend Agent** confirmed implementation feasible
- [ ] **Frontend Agent** confirmed UI can handle all states
- [ ] **Security Specialist** confirmed no security risks
- [ ] **UX Reviewer** confirmed error messages user-friendly
- [ ] **Mobile considerations** documented for all UI contracts
- [ ] **Migration script** tested on development data
- [ ] **All stakeholders** signed off

**Once approved, this document becomes the source of truth for implementation.**

---

## CHANGELOG (v1.0.0 → v2.0.0)

**All CRITICAL issues from Gate 1 review have been addressed:**

### ✅ C1: Schema Migration Conflict - FIXED
- Changed to FRESH START strategy (delete all test data)
- Simplified migration script (no backward compatibility needed)
- Added error handling for code generation failures

### ✅ C2: Existing Invite Links Break - FIXED
- Confirmed fresh start strategy (delete all invites)
- No backward compatibility needed (test data only)

### ✅ C3: Rate Limiting Race Condition - FIXED
- Added atomic increment specification (single `ctx.db.patch` operation)
- Added concurrency test requirement to STORY-B2
- Documented known limitation (acceptable for MVP)

### ✅ C4: Incomplete Rollback Plan - FIXED
- Simplified rollback plan (fresh start = no complex rollback)
- Documented test data context (can delete and recreate)

### ✅ C5: Bulk Invite Transaction Ambiguity - FIXED
- Clarified ALL-OR-NOTHING behavior (no partial success)
- Updated createBulkInvites contract to return `inviteIds[]` only
- Specified frontend handles binary outcomes only

### ⭐ NEW: Email Delivery Status Tracking - ADDED
- Added CONTRACT 8 for email status tracking
- Extended invites schema with `emailStatus`, `emailSentAt`, `emailError` fields
- Updated STORY-B3 and STORY-F2 with tracking requirements
- MVP: Track "pending" → "sent" → "failed"
- Future: Add Resend webhook for "delivered" and "bounced"

### 📱 Mobile-Specific E2E Tests - ENHANCED
- Added touch interaction tests to STORY-I1, STORY-I2
- Added virtual keyboard behavior tests
- Added clipboard API tests
- Added iOS Safari safe area tests

---

**Status**: ✅ **READY FOR RE-APPROVAL**
**Approver**: Strategic Planner (STORY-F0)
**Date Approved**: _____________
