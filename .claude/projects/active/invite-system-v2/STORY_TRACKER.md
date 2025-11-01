# STORY TRACKER: Group Invite System V2

**Project ID**: 6bc0cebd-8e59-434f-8d75-90da7bbc0d86
**Linear URL**: https://linear.app/2s6y/project/group-invite-system-v2-7f013ff387db
**Status**: Planning
**Timeline**: 1-2 weeks (Target: Nov 9, 2025)
**Strategy**: Fresh start migration (expire old invites), direct to production
**Testing Level**: Unit tests (TDD) + Visual regression + E2E integration

---

## 🎯 PROJECT OVERVIEW

### Problem Statement
Current invite system has critical architectural flaws:
- Dual code system (group code vs invite code causes confusion)
- Only 40K code combinations (collision risk)
- No rate limiting (spam vulnerability)
- No bulk invite capability
- Missing join request flow
- Poor notification integration

### Solution
Complete architectural overhaul:
- ✅ Single invite code per group (250M combinations)
- ✅ Dual-flow system (email auto-join vs join requests)
- ✅ Rate limiting (50 invites/user/week)
- ✅ Bulk invite UI
- ✅ Rich notifications
- ✅ Mobile-first responsive design

### Success Criteria
- [ ] All 7 edge cases handled correctly
- [ ] Unit test coverage >80%
- [ ] Visual regression tests pass (3 breakpoints)
- [ ] E2E flows work end-to-end
- [ ] Migration completes without data loss
- [ ] Mobile UI works perfectly (iOS Safari, Chrome Mobile)
- [ ] Production deployment successful with smoke tests

---

## 📋 STORY BREAKDOWN

### **Phase 1: Foundation** (Sequential, Blocking)

#### ✅ STORY-F0: Architecture Review & Contracts [REVIEW GATE 1]
**Agent**: Strategic Planner
**Linear ID**: 2S6-70 (https://linear.app/2s6y/issue/2S6-70)
**Status**: Pending
**Priority**: P0 (Blocking)
**Dependencies**: None
**Estimated**: 2 hours

**Objective**: Review complete architecture, approve contracts, and greenlight implementation.

**Contracts to Review**:
1. Database schema changes (3 tables modified)
2. API contracts (mutations/queries signatures)
3. Frontend-Backend integration contracts
4. Notification payload contracts
5. Migration script contract

**Deliverables**:
- [ ] Architecture diagram approved
- [ ] All contracts reviewed and signed off
- [ ] Testing strategy confirmed
- [ ] Risk assessment documented
- [ ] Greenlight for parallel execution

**Review Checklist**:
- [ ] Schema changes don't break existing data
- [ ] API contracts are backward compatible during migration
- [ ] Frontend can handle loading states
- [ ] Error messages are user-friendly
- [ ] Mobile considerations documented

---

#### 🔧 STORY-B1: Database Schema Migration & Code Generator [BACKEND]
**Agent**: Backend Agent
**Linear ID**: 2S6-71 (https://linear.app/2s6y/issue/2S6-71)
**Status**: Pending
**Priority**: P0 (Blocking)
**Dependencies**: STORY-F0 (contracts approved)
**Estimated**: 6 hours

**Objective**: Update database schema, create unique code generator with 250M combinations, and write migration script.

**Technical Specification**:

**Schema Changes**:
```typescript
// convex/schema.ts

groups: defineTable({
  // ... existing
  inviteCode: v.string(),  // REQUIRED (was optional)
  inviteCodeGeneratedAt: v.number(),  // NEW
})
  .index("by_invite_code", ["inviteCode"])  // NEW

users: defineTable({
  // ... existing
  weeklyInviteCount: v.optional(v.number()),  // NEW
  weeklyInviteResetAt: v.optional(v.number()),  // NEW
})

invites: defineTable({
  groupId: v.id("groups"),
  email: v.string(),
  invitedBy: v.id("users"),
  // REMOVED: inviteCode field
  status: v.union("pending", "accepted", "expired"),
  createdAt: v.number(),
  expiresAt: v.optional(v.number()),
  acceptedAt: v.optional(v.number()),
})
  .index("by_group_email", ["groupId", "email"])  // NEW composite
  // REMOVED: by_code index
```

**Code Generator**:
- 500 adjectives
- 500 middle words (125 each: spices, animals, vehicles, cities)
- 1000 numbers (000-999)
- Total: 250,000,000 combinations
- Uniqueness check with 10 retry attempts

**New Files**:
- `convex/lib/inviteCodeGenerator.ts`
- `convex/lib/wordLists/adjectives.ts`
- `convex/lib/wordLists/middleWords.ts`
- `convex/migrations/inviteSystemV2.ts`

**Migration Strategy**: FRESH START (Simplified - Test Data Only)

**Migration Script**:
```typescript
// convex/migrations/inviteSystemV2.ts
export const migrateInviteSystem = internalMutation({
  handler: async (ctx) => {
    // 1. DELETE all existing invites (fresh start, no backward compatibility)
    const allInvites = await ctx.db.query("invites").collect();
    for (const invite of allInvites) {
      await ctx.db.delete(invite._id);
    }

    // 2. Backfill ALL groups with invite codes
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
        console.error(`Failed to generate code for group ${group._id}:`, error);
        failedGroups.push(group._id);
      }
    }

    // 3. Initialize ALL user rate limit fields
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

**Testing Requirements** (TDD):
- [ ] Unit test: Code generation produces expected format
- [ ] Unit test: Uniqueness retry works after collisions
- [ ] Unit test: Migration expires all pending invites
- [ ] Unit test: Migration backfills all groups
- [ ] Unit test: Migration initializes all users
- [ ] Test: 1000 code generations have no duplicates

**Acceptance Criteria**:
- [ ] Schema updated and deployed
- [ ] Code generator produces codes in format `{adj}-{word}-{000-999}`
- [ ] Migration script tested on development data
- [ ] All unit tests pass
- [ ] No breaking changes to existing queries

**Mobile Considerations**:
- None (backend only)

---

### **Phase 2: Backend Core** (Parallel Execution After B1)

#### 🔧 STORY-B2: Rate Limiting System [BACKEND]
**Agent**: Backend Agent
**Linear ID**: 2S6-72 (https://linear.app/2s6y/issue/2S6-72)
**Status**: Pending
**Priority**: P1
**Dependencies**: STORY-B1 (schema ready)
**Estimated**: 4 hours

**Objective**: Implement per-user weekly invite limit (50/week) with automatic reset logic.

**Technical Specification**:

**New File**: `convex/lib/rateLimiting.ts`

```typescript
const WEEKLY_INVITE_LIMIT = 50;
const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

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
    await ctx.db.patch(userId, {
      weeklyInviteCount: 0,
      weeklyInviteResetAt: now + WEEK_IN_MS
    });
  }

  // Check limit
  if (currentCount + emailCount > WEEKLY_INVITE_LIMIT) {
    const remaining = WEEKLY_INVITE_LIMIT - currentCount;
    throw new ConvexError(
      `Rate limit exceeded. You can invite ${remaining} more members this week (limit: ${WEEKLY_INVITE_LIMIT}/week)`
    );
  }

  // Increment
  await ctx.db.patch(userId, {
    weeklyInviteCount: currentCount + emailCount
  });
}

export async function getRemainingInvites(
  ctx: QueryCtx,
  userId: Id<"users">
): Promise<number> {
  const user = await ctx.db.get(userId);
  if (!user) return WEEKLY_INVITE_LIMIT;

  const now = Date.now();
  const resetAt = user.weeklyInviteResetAt || 0;

  if (now > resetAt) return WEEKLY_INVITE_LIMIT;

  const used = user.weeklyInviteCount || 0;
  return Math.max(0, WEEKLY_INVITE_LIMIT - used);
}
```

**Contract**:
```typescript
// Export for frontend
export interface RateLimitStatus {
  remaining: number;
  limit: number;
  resetAt: number;
}
```

**Testing Requirements** (TDD):
- [ ] Unit test: Limit enforced at 50 invites
- [ ] Unit test: Counter resets after 7 days
- [ ] Unit test: All-or-nothing batch validation
- [ ] Unit test: Error message contains remaining count
- [ ] Unit test: Multiple users don't interfere
- [ ] Unit test: **CRITICAL** - Concurrent mutation race condition (two invites at same time)
- [ ] Unit test: Atomic increment prevents over-limit (rare edge case)

**Acceptance Criteria**:
- [ ] Rate limiting helper functions complete
- [ ] All unit tests pass
- [ ] Error messages user-friendly
- [ ] Works for both single and bulk invites

**Mobile Considerations**:
- None (backend only)

---

#### 🔧 STORY-B3: Invite Mutations (Create, Bulk, Regenerate) [BACKEND]
**Agent**: Backend Agent
**Linear ID**: 2S6-73 (https://linear.app/2s6y/issue/2S6-73)
**Status**: Pending
**Priority**: P1
**Dependencies**: STORY-B1, STORY-B2
**Estimated**: 8 hours

**Objective**: Rewrite invite creation mutations to use group's invite code, add bulk invite, and update regenerate logic.

**Technical Specification**:

**Update File**: `convex/invites.ts`

**Mutations**:
1. `createInvite(groupId, email)` - Single invite with rate limit + **email status tracking**
2. `createBulkInvites(groupId, emails[])` - Batch invite with **all-or-nothing validation** (no partial success)
3. `regenerateInviteCode(groupId)` - Generate new code, expire all pending invites
4. `cancelInvite(inviteId)` - Admin cancels pending invite

**NEW REQUIREMENT**: Email Delivery Status Tracking
- Add `emailStatus`, `emailSentAt`, `emailDeliveredAt`, `emailError` to invites schema
- Track: "pending" → "sent" → "failed" (MVP)
- Future: Add Resend webhook for "delivered" and "bounced" (post-MVP)

**Key Logic**:
```typescript
export const createInvite = mutation({
  args: { groupId: v.id("groups"), email: v.string() },
  handler: async (ctx, args) => {
    // 1. Auth & admin check
    const user = await getCurrentUser(ctx);
    await requireGroupAdminAccess(ctx, args.groupId);

    // 2. Rate limit check (1 email)
    await checkAndIncrementInviteLimit(ctx, user._id, 1);

    // 3. Validate email & check duplicates
    // 4. Check member status (active/blocked/removed)
    // 5. Create invite (NO inviteCode field, use group's code)
    // 6. Schedule email with group.inviteCode
    // 7. Create notification if user exists
  }
});

export const createBulkInvites = mutation({
  args: { groupId: v.id("groups"), emails: v.array(v.string()) },
  handler: async (ctx, args) => {
    // ALL-OR-NOTHING VALIDATION (no partial success)
    // 1. Validate ALL emails first (stop at first error)
    // 2. Rate limit check BEFORE creating any invites
    // 3. If ANY validation fails, throw error (create NOTHING)
    // 4. If all pass, create ALL invites
    // 5. Return { inviteIds, total }
  }
});

export const regenerateInviteCode = mutation({
  args: { groupId: v.id("groups") },
  handler: async (ctx, args) => {
    // 1. Generate new unique code
    // 2. Update group.inviteCode
    // 3. Expire all pending invites for this group
    // 4. Return { newCode, expiredCount }
  }
});
```

**Edge Cases Handled**:
- Duplicate email → Error: "Already invited"
- Existing active member → Error: "Already a member"
- Removed member → Error: "Use 'Re-add Member'"
- Blocked user → Error: "Blocked, cannot invite"
- Rate limit → Error with remaining count

**Contract** (for Frontend):
```typescript
// API.md
createInvite(groupId, email) => { inviteId }
createBulkInvites(groupId, emails[]) => { results: [{email, success, error?}], total }
regenerateInviteCode(groupId) => { inviteCode, expiredCount }
```

**Testing Requirements** (TDD):
- [ ] Unit test: createInvite happy path + email status tracking
- [ ] Unit test: createInvite validates email format
- [ ] Unit test: createInvite blocks duplicates
- [ ] Unit test: createInvite checks rate limit
- [ ] Unit test: createInvite tracks email status (pending → sent → failed)
- [ ] Unit test: **CRITICAL** - createBulkInvites all-or-nothing (first error = create NOTHING)
- [ ] Unit test: createBulkInvites rate limit validation (all-or-nothing)
- [ ] Unit test: regenerateInviteCode expires pending invites
- [ ] Unit test: All 7 edge cases from analysis

**Acceptance Criteria**:
- [ ] All mutations implemented
- [ ] All unit tests pass (>80% coverage)
- [ ] Email scheduling works
- [ ] Notifications created correctly
- [ ] Rate limiting integrated

**Mobile Considerations**:
- None (backend only)

---

#### 🔧 STORY-B4: Accept Invite & Join Request Flow [BACKEND]
**Agent**: Backend Agent
**Linear ID**: 2S6-74 (https://linear.app/2s6y/issue/2S6-74)
**Status**: Pending
**Priority**: P1
**Dependencies**: STORY-B1, STORY-B3
**Estimated**: 10 hours

**Objective**: Implement dual-flow logic: email invite = auto-join, no invite = join request.

**Technical Specification**:

**Update File**: `convex/invites.ts`

**New Mutation**:
```typescript
export const acceptInvite = mutation({
  args: { inviteCode: v.string() },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    // 1. Find group by invite code
    const group = await ctx.db
      .query("groups")
      .withIndex("by_invite_code", q => q.eq("inviteCode", args.inviteCode))
      .first();

    if (!group) throw new ConvexError("Invalid invite code");

    // 2. Check if pending email invite exists
    const emailInvite = await ctx.db
      .query("invites")
      .withIndex("by_group_email", q =>
        q.eq("groupId", group._id).eq("email", user.email)
      )
      .filter(q => q.eq(q.field("status"), "pending"))
      .first();

    // 3. FLOW DECISION
    if (emailInvite) {
      // FLOW A: Email invite exists → AUTO-JOIN
      // - Validate not expired
      // - Check not blocked
      // - Check limits
      // - Create groupMember
      // - Update invite to "accepted"
      // - Auto-approve any pending join requests
      return { success: true, action: "joined", groupId: group._id };
    } else {
      // FLOW B: No email invite → CREATE JOIN REQUEST
      // - Check not already member
      // - Check not blocked
      // - Check no pending request
      // - Create joinRequest
      // - Notify all admins
      return { success: true, action: "requested", groupId: group._id };
    }
  }
});
```

**Update File**: `convex/joinRequests.ts`

**Mutations**:
- `approveJoinRequest(requestId)` - Admin approves
- `rejectJoinRequest(requestId)` - Admin rejects

**New Query**:
```typescript
export const getGroupByInviteCode = query({
  args: { inviteCode: v.string() },
  handler: async (ctx, args) => {
    // PUBLIC endpoint (no auth)
    const group = await ctx.db
      .query("groups")
      .withIndex("by_invite_code", q => q.eq("inviteCode", args.inviteCode))
      .first();

    if (!group) return null;

    return {
      groupId: group._id,
      name: group.name,
      description: group.description,
      groupImage: group.groupImage,
      memberCount: await getActiveMemberCount(ctx, group._id)
    };
  }
});
```

**Contract** (for Frontend):
```typescript
// API.md
acceptInvite(inviteCode) => { success, action: "joined" | "requested", groupId }
getGroupByInviteCode(inviteCode) => { groupId, name, description, groupImage, memberCount } | null
approveJoinRequest(requestId) => { success }
rejectJoinRequest(requestId) => { success }
```

**Edge Cases Handled**:
- Expired invite during acceptance → Update to expired, throw error
- Blocked user → Error: "Cannot join this group"
- Join request + email invite → Auto-approve request when invite accepted
- User already member → Error
- Pending join request exists → Error

**Testing Requirements** (TDD):
- [ ] Unit test: Email invite → auto-join
- [ ] Unit test: No email invite → join request
- [ ] Unit test: Expired invite handling
- [ ] Unit test: Blocked user rejected
- [ ] Unit test: Join request + invite → auto-approve
- [ ] Unit test: Admin approve/reject flow
- [ ] Unit test: Public query works without auth

**Acceptance Criteria**:
- [ ] acceptInvite dual-flow works correctly
- [ ] Join request approval/rejection works
- [ ] All edge cases handled
- [ ] All unit tests pass
- [ ] Notifications created correctly

**Mobile Considerations**:
- None (backend only)

---

#### 🔧 STORY-B5: Notification System Integration [BACKEND]
**Agent**: Backend Agent
**Linear ID**: 2S6-75 (https://linear.app/2s6y/issue/2S6-75)
**Status**: Pending
**Priority**: P2
**Dependencies**: STORY-B3, STORY-B4
**Estimated**: 4 hours

**Objective**: Create notifications for all invite events (invite received, join request, approved, rejected).

**Technical Specification**:

**Update File**: `convex/notifications.ts`

**Notification Types**:
1. `group_invite` - User received email invite
2. `join_request` - Admin notified of join request
3. `join_approved` - User's request approved
4. `join_rejected` - User's request rejected

**Helper Function**:
```typescript
async function createInviteNotification(
  ctx: MutationCtx,
  userId: Id<"users">,
  groupId: Id<"groups">,
  inviteCode: string
) {
  const group = await ctx.db.get(groupId);

  await ctx.db.insert("notifications", {
    userId,
    type: "group_invite",
    title: "Group Invitation",
    message: `You've been invited to join ${group.name}`,
    isRead: false,
    createdAt: Date.now(),
    groupId,
    metadata: {
      groupName: group.name,
      actionUrl: `/invite/${inviteCode}`,
    },
  });
}
```

**Integration Points**:
- `createInvite` → Create notification if user exists
- `createJoinRequest` → Notify all admins
- `approveJoinRequest` → Notify user
- `rejectJoinRequest` → Notify user (optional)

**Contract** (for Frontend):
```typescript
// Notification schema
type InviteNotification = {
  type: "group_invite",
  title: string,
  message: string,
  metadata: {
    groupName: string,
    actionUrl: string,
  }
}
```

**Testing Requirements** (TDD):
- [ ] Unit test: Invite creates notification
- [ ] Unit test: Join request notifies admins
- [ ] Unit test: Approval notifies user
- [ ] Unit test: No notification if user doesn't exist yet

**Acceptance Criteria**:
- [ ] All notification types work
- [ ] Metadata contains actionUrl
- [ ] All unit tests pass

**Mobile Considerations**:
- Ensure actionUrl works on mobile browsers

---

### **Phase 3: Frontend Core** (Parallel Execution After Contracts)

#### 🎨 STORY-F1: Invite Acceptance Page Redesign [FRONTEND]
**Agent**: Frontend Agent
**Linear ID**: 2S6-76 (https://linear.app/2s6y/issue/2S6-76)
**Status**: Pending
**Priority**: P1
**Dependencies**: STORY-F0 (contracts), STORY-B4 (backend ready)
**Estimated**: 8 hours

**Objective**: Redesign `/invite/[code]` page to handle dual-flow (auto-join vs join request) with mobile-first responsive design.

**Technical Specification**:

**Update File**: `app/invite/[code]/page.tsx`

**UI States**:
1. **Loading** - Fetching group info
2. **Invalid Code** - Group not found
3. **Unauthenticated** - Show group preview + sign-in CTA
4. **Authenticated + Email Invite** - Show "Accept Invitation" button
5. **Authenticated + No Invite** - Show "Request to Join" button
6. **Success (Joined)** - Confirmation + redirect
7. **Success (Requested)** - Pending approval message

**Key Logic**:
```tsx
const InvitePage = async ({ params }: { params: { code: string } }) => {
  const { code } = await params;

  // Public query (no auth)
  const groupPreview = useQuery(api.invites.getGroupByInviteCode, { inviteCode: code });

  // Auth check
  const { isSignedIn, user } = useAuth();

  const acceptMutation = useMutation(api.invites.acceptInvite);

  const handleAccept = async () => {
    const result = await acceptMutation({ inviteCode: code });

    if (result.action === "joined") {
      toast.success("Welcome to the group!");
      router.push(`/groups/${result.groupId}`);
    } else {
      toast.success("Join request sent! Waiting for admin approval.");
      router.push("/dashboard");
    }
  };

  // Render states...
};
```

**Mobile-First Design**:
- Touch-friendly button sizes (min 44x44px)
- Readable text (min 16px font)
- Responsive layout (stack on mobile)
- Fast loading with suspense
- Accessible ARIA labels

**Visual Regression Tests** (3 breakpoints):
- [ ] Mobile (375px): Screenshot of all 7 states
- [ ] Tablet (768px): Screenshot of all 7 states
- [ ] Desktop (1440px): Screenshot of all 7 states

**Acceptance Criteria**:
- [ ] All UI states render correctly
- [ ] Auto-join works (email invite exists)
- [ ] Join request works (no email invite)
- [ ] Error states show friendly messages
- [ ] Mobile layout perfect (tested on iOS Safari, Chrome Mobile)
- [ ] All visual regression tests pass
- [ ] DaisyUI design system compliance

**Testing Checklist**:
- [ ] Manual test on iOS Safari (real device)
- [ ] Manual test on Chrome Mobile (real device)
- [ ] Lighthouse mobile score >90
- [ ] Touch targets >44px

---

#### 🎨 STORY-F2: Bulk Invite UI (Settings Page) [FRONTEND]
**Agent**: Frontend Agent
**Linear ID**: 2S6-77 (https://linear.app/2s6y/issue/2S6-77)
**Status**: Pending
**Priority**: P1
**Dependencies**: STORY-F0, STORY-B3
**Estimated**: 6 hours

**Objective**: Add `EmailInput` component to settings invite section, show rate limit counter, handle bulk invites.

**Technical Specification**:

**Update File**: `components/settings/InviteSection.tsx`

**UI Changes**:
1. Replace single email input with `EmailInput` component (from group-creation)
2. Add rate limit indicator: "You can invite X more members this week (Y/50)"
3. Show invite success/error messages (all-or-nothing feedback)
4. Display pending invites list with **email delivery status badges**
5. **NEW**: Show email status for each invite (🕒 Sending, ✉️ Sent, ✅ Delivered, ⚠️ Bounced, ❌ Failed)

**Key Logic**:
```tsx
const InviteSection = ({ groupId }: { groupId: Id<"groups"> }) => {
  const [validEmails, setValidEmails] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const bulkInviteMutation = useMutation(api.invites.createBulkInvites);
  const rateLimitQuery = useQuery(api.lib.rateLimiting.getRemainingInvites);

  const handleSendInvites = async () => {
    if (validEmails.length === 0) return;

    setIsLoading(true);
    try {
      const result = await bulkInviteMutation({
        groupId,
        emails: validEmails
      });

      // ALL-OR-NOTHING: Either all succeed or mutation throws error
      toast.success(`${result.total} invitations sent!`);
      setValidEmails([]);
    } catch (error) {
      if (error.message.includes("Rate limit")) {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Rate limit indicator */}
      <p className="text-sm text-base-content/70 mb-2">
        You can invite {rateLimitQuery || 0} more members this week ({50 - (rateLimitQuery || 0)}/50)
      </p>

      {/* Email input */}
      <EmailInput onEmailsChange={(emails) => setValidEmails(emails)} />

      {/* Send button */}
      <button
        onClick={handleSendInvites}
        disabled={validEmails.length === 0 || isLoading}
        className="btn btn-primary"
      >
        Send {validEmails.length} Invitation{validEmails.length !== 1 ? 's' : ''}
      </button>

      {/* Pending invites list with email status */}
      <PendingInvitesList groupId={groupId} />
      {/* Each invite shows: email + status badge + delivery status icon */}
    </div>
  );
};

// PendingInvitesList component displays:
// - Email address
// - Invite status (pending/accepted/expired)
// - EMAIL DELIVERY STATUS:
//   - 🕒 Sending... (emailStatus: "pending") - gray
//   - ✉️ Sent (emailStatus: "sent") - blue
//   - ✅ Delivered (emailStatus: "delivered") - green [future]
//   - ⚠️ Bounced (emailStatus: "bounced") - orange + tooltip [future]
//   - ❌ Failed (emailStatus: "failed") - red + tooltip with error
// - Cancel button (if pending)
```

**Mobile-First Design**:
- Email chips wrap on mobile
- Touch-friendly remove buttons
- Responsive button sizing
- Clear error messages

**Visual Regression Tests**:
- [ ] Mobile: Empty state, with emails, error state
- [ ] Tablet: Same states
- [ ] Desktop: Same states

**Acceptance Criteria**:
- [ ] EmailInput component works
- [ ] Rate limit counter updates in real-time
- [ ] **CRITICAL**: Bulk invite is all-or-nothing (no partial success UI)
- [ ] Error messages show first failed email clearly
- [ ] **NEW**: Email delivery status badges display correctly
- [ ] **NEW**: Failed email errors show in tooltip
- [ ] Mobile UI perfect
- [ ] DaisyUI compliance

---

#### 🎨 STORY-F3: Join Group Modal (Dashboard) [FRONTEND]
**Agent**: Frontend Agent
**Linear ID**: 2S6-78 (https://linear.app/2s6y/issue/2S6-78)
**Status**: Pending
**Priority**: P2
**Dependencies**: STORY-F0, STORY-B4
**Estimated**: 6 hours

**Objective**: Create dashboard modal for joining groups via invite code (full flow without leaving dashboard).

**Technical Specification**:

**New File**: `components/JoinGroupModal.tsx`

**UI Flow**:
1. User clicks "Join Group" in dashboard header
2. Modal opens with invite code input
3. User types/pastes code
4. Group preview loads (name, image, member count)
5. User clicks "Join" or "Request to Join"
6. Success message, modal closes

**Key Logic**:
```tsx
const JoinGroupModal = ({ isOpen, onClose }: Props) => {
  const [code, setCode] = useState("");
  const [debouncedCode, setDebouncedCode] = useState("");

  const groupPreview = useQuery(
    api.invites.getGroupByInviteCode,
    debouncedCode ? { inviteCode: debouncedCode } : "skip"
  );

  const acceptMutation = useMutation(api.invites.acceptInvite);

  const handleJoin = async () => {
    const result = await acceptMutation({ inviteCode: code });

    if (result.action === "joined") {
      toast.success("You've joined the group!");
    } else {
      toast.success("Join request sent!");
    }

    onClose();
    router.refresh(); // Reload dashboard
  };

  return (
    <dialog className="modal" open={isOpen}>
      <div className="modal-box">
        <h3>Join a Group</h3>

        {/* Code input */}
        <input
          type="text"
          placeholder="happy-basil-042"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="input input-bordered font-mono"
        />

        {/* Group preview */}
        {groupPreview && (
          <div className="mt-4 p-4 bg-base-200 rounded">
            <img src={groupPreview.groupImage} className="w-12 h-12 rounded" />
            <h4>{groupPreview.name}</h4>
            <p>{groupPreview.memberCount} members</p>
          </div>
        )}

        {/* Action button */}
        <button
          onClick={handleJoin}
          disabled={!groupPreview}
          className="btn btn-primary"
        >
          Join Group
        </button>
      </div>
    </dialog>
  );
};
```

**Mobile-First Design**:
- Modal fills screen on mobile
- Large touch targets
- Auto-focus on code input
- Keyboard-friendly (Enter to submit)

**Visual Regression Tests**:
- [ ] Mobile: Empty, with preview, error
- [ ] Tablet: Same
- [ ] Desktop: Same

**Acceptance Criteria**:
- [ ] Modal opens/closes smoothly
- [ ] Group preview loads on code entry
- [ ] Join/request flow works
- [ ] Mobile UX perfect
- [ ] Keyboard accessible

---

#### 🎨 STORY-F4: Notification Dropdown Updates [FRONTEND]
**Agent**: Frontend Agent
**Linear ID**: 2S6-79 (https://linear.app/2s6y/issue/2S6-79)
**Status**: Pending
**Priority**: P2
**Dependencies**: STORY-F0, STORY-B5
**Estimated**: 4 hours

**Objective**: Add invite and join request notifications to dashboard dropdown.

**Technical Specification**:

**Update File**: `components/NotificationDropdown.tsx`

**New Notification Types**:
```tsx
const NotificationItem = ({ notification }: { notification: Notification }) => {
  switch (notification.type) {
    case "group_invite":
      return (
        <div className="notification-item" onClick={() => router.push(notification.metadata.actionUrl)}>
          <div className="icon">✉️</div>
          <div>
            <h4>{notification.title}</h4>
            <p>{notification.message}</p>
            <span className="time">{formatRelativeTime(notification.createdAt)}</span>
          </div>
        </div>
      );

    case "join_request":
      return (
        <div className="notification-item" onClick={() => router.push(notification.metadata.actionUrl)}>
          <div className="icon">👋</div>
          <div>
            <h4>{notification.title}</h4>
            <p>{notification.message}</p>
            <span className="time">{formatRelativeTime(notification.createdAt)}</span>
          </div>
        </div>
      );

    // ... other types
  }
};
```

**Mobile Considerations**:
- Touch-friendly notification items
- Swipe to dismiss (future)
- Clear visual hierarchy

**Visual Regression Tests**:
- [ ] Mobile: Dropdown with invite notifications
- [ ] Tablet: Same
- [ ] Desktop: Same

**Acceptance Criteria**:
- [ ] Notifications render correctly
- [ ] Click navigates to correct page
- [ ] Unread badge updates
- [ ] Mobile UI perfect

---

#### 🎨 STORY-F5: Group Creation Flow Updates [FRONTEND]
**Agent**: Frontend Agent
**Linear ID**: 2S6-80 (https://linear.app/2s6y/issue/2S6-80)
**Status**: Pending
**Priority**: P2
**Dependencies**: STORY-F0, STORY-B1, STORY-B3
**Estimated**: 4 hours

**Objective**: Update group creation MembersStep to use new mutations and show updated invite code.

**Technical Specification**:

**Update File**: `components/group-creation/MembersStep.tsx`

**Changes**:
1. Use `createBulkInvites` instead of individual creates
2. Display group's invite code (from group record)
3. Update regenerate code logic

**Mobile Considerations**:
- Ensure invite code display is readable on mobile
- Copy button works on mobile browsers

**Visual Regression Tests**:
- [ ] Mobile: MembersStep with code display
- [ ] Tablet: Same
- [ ] Desktop: Same

**Acceptance Criteria**:
- [ ] Bulk invites work during group creation
- [ ] Invite code displays correctly
- [ ] Regenerate works
- [ ] Mobile perfect

---

### **Phase 4: Integration & Testing** (After Frontend + Backend Complete)

#### 🧪 STORY-I1: E2E Email Invite Flow [INTEGRATION]
**Agent**: Orchestrator
**Linear ID**: 2S6-81 (https://linear.app/2s6y/issue/2S6-81)
**Status**: Pending
**Priority**: P1
**Dependencies**: STORY-B3, STORY-B4, STORY-F1, STORY-F2
**Estimated**: 6 hours

**Objective**: Write comprehensive E2E test for complete email invitation flow.

**Test Scenario**:
```
1. Admin signs in
2. Admin creates group
3. Admin sends email invite to friend@example.com
4. Friend receives email (check email sent)
5. Friend clicks invite link
6. Friend sees group preview (not signed in)
7. Friend signs up with friend@example.com
8. Friend sees "Accept Invitation" button
9. Friend clicks accept
10. Friend redirected to group page
11. Verify friend is now a member
12. Verify invite status = "accepted"
13. Verify admin receives notification (optional)
```

**Playwright Test**:
```typescript
test("complete email invite flow", async ({ page, context }) => {
  // Setup: Create admin, group
  // Step 1-3: Send invite
  // Step 4: Check email queue
  // Step 5-10: Accept flow
  // Step 11-13: Verify state
});
```

**Mobile Testing** (ENHANCED):
- [ ] Run on mobile viewport (375x667)
- [ ] Test on iOS Safari (real device if possible, or BrowserStack)
- [ ] Test on Chrome Mobile (real device if possible)
- [ ] **NEW**: Test touch interactions (tap, not mouse click)
- [ ] **NEW**: Test virtual keyboard behavior (doesn't obscure input)
- [ ] **NEW**: Test clipboard API (copy invite code works on mobile)
- [ ] **NEW**: Test iOS Safari safe area insets respected

**Acceptance Criteria**:
- [ ] E2E test passes on all browsers
- [ ] Mobile flow works perfectly
- [ ] All state transitions correct

---

#### 🧪 STORY-I2: E2E Join Request Flow [INTEGRATION]
**Agent**: Orchestrator
**Linear ID**: 2S6-82 (https://linear.app/2s6y/issue/2S6-82)
**Status**: Pending
**Priority**: P1
**Dependencies**: STORY-B4, STORY-F1, STORY-F3
**Estimated**: 6 hours

**Objective**: Write E2E test for join request flow (uninvited user).

**Test Scenario**:
```
1. User1 creates group, gets invite code
2. User2 (uninvited) visits /invite/{code}
3. User2 sees "Request to Join" button
4. User2 clicks request
5. User1 receives notification
6. User1 goes to settings → Join Requests
7. User1 sees User2's request
8. User1 clicks "Approve"
9. User2 receives notification
10. Verify User2 is now a member
```

**Mobile Testing** (ENHANCED):
- [ ] Mobile viewport test (375x667)
- [ ] iOS Safari test (real device if possible)
- [ ] Chrome Mobile test (real device if possible)
- [ ] **NEW**: Touch interactions (tap request button)
- [ ] **NEW**: Virtual keyboard behavior (doesn't block UI)
- [ ] **NEW**: Mobile browser autofill handling

**Acceptance Criteria**:
- [ ] E2E test passes
- [ ] Mobile flow works
- [ ] Notifications delivered correctly

---

#### 🧪 STORY-I3: Edge Case Testing Suite [INTEGRATION]
**Agent**: Orchestrator
**Linear ID**: 2S6-83 (https://linear.app/2s6y/issue/2S6-83)
**Status**: Pending
**Priority**: P1
**Dependencies**: All backend + frontend stories
**Estimated**: 8 hours

**Objective**: Test all 7 edge cases identified in analysis.

**Test Cases**:
1. **Code Regeneration** → Expire pending invites
2. **Multiple Pending Invites** → Correct group selected
3. **Blocked Mid-Invitation** → Acceptance rejected
4. **Expired During Acceptance** → Error shown
5. **Rate Limit Mid-Batch** → All-or-nothing validation
6. **Join Request + Invite** → Auto-approve request
7. **Duplicate Email Invite** → Error message

**Playwright Tests**:
```typescript
describe("Edge Cases", () => {
  test("regenerating code expires pending invites", async () => { ... });
  test("blocked user cannot accept invite", async () => { ... });
  // ... all 7 cases
});
```

**Acceptance Criteria**:
- [ ] All 7 edge case tests pass
- [ ] Error messages user-friendly
- [ ] Mobile behavior correct

---

### **Phase 5: Migration & Deployment** (Final Phase)

#### 🚀 STORY-M1: Migration Execution & Validation [MIGRATION]
**Agent**: Backend Agent
**Linear ID**: 2S6-84 (https://linear.app/2s6y/issue/2S6-84)
**Status**: Pending
**Priority**: P0 (Blocking deployment)
**Dependencies**: STORY-B1
**Estimated**: 4 hours

**Objective**: Run migration script, validate data integrity, prepare rollback plan.

**Migration Checklist**:
- [ ] Backup production database (Convex snapshot)
- [ ] Run migration on development first
- [ ] Validate migration results (counts match)
- [ ] Test rollback procedure
- [ ] Document migration steps
- [ ] Run migration on production
- [ ] Verify all groups have invite codes
- [ ] Verify all users have rate limit fields
- [ ] Verify all pending invites expired

**Rollback Plan** (Simplified - Test Data Only):
```
FRESH START STRATEGY = No rollback needed

Context: This is test data only. If migration fails:
1. Delete all groups (test data can be recreated)
2. Re-run migration script
3. OR start fresh (no production impact)

No complex rollback required since:
- No production users exist
- All data is test data
- Can recreate data anytime
```

**Acceptance Criteria**:
- [ ] Migration runs successfully
- [ ] No data loss
- [ ] All validations pass
- [ ] Rollback plan tested

---

#### 🚀 STORY-D1: Production Deployment & Smoke Tests [DEPLOYMENT]
**Agent**: Deployment Agent
**Linear ID**: 2S6-85 (https://linear.app/2s6y/issue/2S6-85)
**Status**: Pending
**Priority**: P0
**Dependencies**: All stories, STORY-M1
**Estimated**: 6 hours

**Objective**: Deploy to production, run smoke tests, monitor for issues.

**Deployment Steps**:
1. Merge all PRs to main
2. Run full test suite (unit + E2E)
3. Deploy backend (Convex)
4. Deploy frontend (Vercel)
5. Run smoke tests
6. Monitor logs for errors

**Smoke Tests** (Critical Paths):
- [ ] Admin can send email invite
- [ ] Admin can send bulk invites
- [ ] User can accept invite (auto-join)
- [ ] User can request to join (no invite)
- [ ] Admin can approve join request
- [ ] Rate limiting works
- [ ] Notifications delivered
- [ ] Mobile flows work

**Monitoring** (First 24 hours):
- [ ] Error rates < 1%
- [ ] Invite creation success rate > 95%
- [ ] Email delivery rate > 95%
- [ ] Mobile traffic patterns normal

**Rollback Triggers**:
- Error rate > 5%
- Invite creation failing
- Email delivery failing
- Database corruption detected

**Acceptance Criteria**:
- [ ] Deployment successful
- [ ] All smoke tests pass
- [ ] No critical errors in 1 hour
- [ ] Mobile flows working

---

## 🚦 REVIEW GATES

### Gate 1: Architecture Review [BEFORE Phase 1]
**Reviewers**: Strategic Planner
**Criteria**:
- [ ] Schema changes approved
- [ ] Contracts signed off
- [ ] Migration strategy approved
- [ ] Testing plan confirmed

### Gate 2: Backend Code Review [AFTER Phase 2]
**Reviewers**: Code Reviewer, Security Specialist
**Criteria**:
- [ ] All unit tests pass (>80% coverage)
- [ ] No SQL injection risks
- [ ] Rate limiting secure
- [ ] Error messages don't leak data
- [ ] Migration script safe

### Gate 3: Frontend UX Review [AFTER Phase 3]
**Reviewers**: UX Reviewer
**Criteria**:
- [ ] All visual regression tests pass
- [ ] Mobile flows perfect (iOS + Android)
- [ ] WCAG accessibility compliance
- [ ] Design system compliance
- [ ] Error states user-friendly

### Gate 4: Integration Test Review [AFTER Phase 4]
**Reviewers**: Orchestrator
**Criteria**:
- [ ] All E2E tests pass
- [ ] All edge cases handled
- [ ] Mobile E2E tests pass
- [ ] Performance acceptable

### Gate 5: Pre-Deployment Review [BEFORE Phase 5]
**Reviewers**: Code Reviewer, Backend Agent
**Criteria**:
- [ ] Migration script tested
- [ ] Rollback plan documented
- [ ] Smoke test plan approved
- [ ] Monitoring in place

### Gate 6: Post-Deployment Validation [AFTER Deployment]
**Reviewers**: Deployment Agent
**Criteria**:
- [ ] All smoke tests pass
- [ ] No critical errors
- [ ] Mobile traffic normal
- [ ] User feedback positive

---

## 📊 PROGRESS TRACKING

### Story Status
- ⬜️ Not Started
- 🟡 In Progress
- ✅ Complete
- ❌ Blocked

### Current Status (as of start):
- STORY-F0: ⬜️ Not Started
- STORY-B1: ⬜️ Not Started
- STORY-B2: ⬜️ Not Started
- STORY-B3: ⬜️ Not Started
- STORY-B4: ⬜️ Not Started
- STORY-B5: ⬜️ Not Started
- STORY-F1: ⬜️ Not Started
- STORY-F2: ⬜️ Not Started
- STORY-F3: ⬜️ Not Started
- STORY-F4: ⬜️ Not Started
- STORY-F5: ⬜️ Not Started
- STORY-I1: ⬜️ Not Started
- STORY-I2: ⬜️ Not Started
- STORY-I3: ⬜️ Not Started
- STORY-M1: ⬜️ Not Started
- STORY-D1: ⬜️ Not Started

### Timeline Estimate
- **Phase 1**: 8 hours (1 day)
- **Phase 2**: 26 hours (3-4 days) [PARALLEL]
- **Phase 3**: 28 hours (3-4 days) [PARALLEL]
- **Phase 4**: 20 hours (2-3 days)
- **Phase 5**: 10 hours (1-2 days)
- **Total**: ~10-14 days (with parallelization)

---

## 🔗 DEPENDENCIES GRAPH

```
STORY-F0 (Architecture Review)
    ├─→ STORY-B1 (Schema Migration) [BLOCKING]
    │       ├─→ STORY-B2 (Rate Limiting)
    │       ├─→ STORY-B3 (Invite Mutations)
    │       │       └─→ STORY-B4 (Accept/Join Flow)
    │       │               └─→ STORY-B5 (Notifications)
    │       └─→ STORY-M1 (Migration Execution)
    │
    └─→ STORY-F1, F2, F3, F4, F5 (Frontend Stories) [PARALLEL after contracts]
            │
            └─→ STORY-I1, I2, I3 (Integration Tests)
                    │
                    └─→ STORY-D1 (Deployment)
```

---

## 📝 NOTES

### Mobile-First Considerations (All Stories)
- All UI must work perfectly on mobile (iOS Safari, Chrome Mobile)
- Touch targets minimum 44x44px
- Text minimum 16px
- Responsive breakpoints: 375px, 768px, 1440px
- Test on real devices before deployment

### Performance Targets
- Page load < 2 seconds
- Invite creation < 500ms
- Bulk invite (10 emails) < 2 seconds
- Mobile Lighthouse score > 90

### Security Notes
- Rate limiting enforced server-side (not client)
- No invite code enumeration attacks
- Email validation strict (RFC 5322)
- User input sanitized

---

**Project Owner**: Kalyan
**Framework Version**: v1.3.2
**Last Updated**: 2025-10-26
