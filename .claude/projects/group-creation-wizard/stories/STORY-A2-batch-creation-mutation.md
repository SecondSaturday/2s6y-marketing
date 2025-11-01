# STORY-A2: Create `createGroupWithSettings` Batch Mutation

**Track:** A (Backend)
**Agent:** backend-dev
**Time Estimate:** 1.5 hours
**Dependencies:** STORY-A1 ✅ (promptType field)
**Blocks:** STORY-B1, STORY-B2, STORY-B3, STORY-B4
**Status:** 🟡 Pending
**Phase:** 2 (Parallel Execution)

---

## Context

Create a new mutation `createGroupWithSettings` that allows creating a fully-configured group in a single transaction. This powers the Group Creation Wizard's final "Create Group" action, combining:
- Group creation (name, meta, description)
- Image uploads (avatar, cover)
- Custom prompts with types
- Member invitations
- Invite link generation

**Why This Story Matters**:
- **Better UX:** Single API call instead of 5+ sequential calls
- **Atomicity:** All-or-nothing transaction (if any step fails, entire creation rolls back)
- **Performance:** Reduces network round-trips from 5+ to 1

**Current State:** Users call `createGroup` then navigate to settings to customize. This story enables complete setup during creation.

---

## API Contract

### Input Schema

```typescript
{
  // Step 1: Basic Info
  name: v.string(),                    // Required, 1-50 chars
  meta: v.optional(v.string()),        // Optional, 1-30 chars, URL-safe
  description: v.optional(v.string()), // Optional, max 200 chars

  // Step 2: Appearance
  avatarStorageId: v.optional(v.string()),
  coverStorageId: v.optional(v.string()),

  // Step 3: Prompts
  prompts: v.optional(v.array(v.object({
    promptNumber: v.number(),           // 1-5
    promptText: v.string(),             // Max 500 chars
    promptType: v.union(
      v.literal("text"),
      v.literal("media"),
      v.literal("audio")
    ),
    isActive: v.boolean(),
  }))),

  // Step 4: Members
  memberEmails: v.optional(v.array(v.string())),
  generateInviteLink: v.optional(v.boolean()),
}
```

### Output Schema

```typescript
{
  groupId: Id<"groups">,
  inviteCode?: string,
  inviteUrl?: string,
  message: string,
}
```

---

## Tasks (TDD Order)

### Phase 1: Preparation
- [ ] Read API contract: `.claude/projects/group-creation-wizard/contracts/backend-api.md`
- [ ] Review existing mutations: `createGroup`, `setGroupPrompt`, `updateGroupImage`, `updateGroupCover`
- [ ] Plan error handling for partial failures
- [ ] Document test cases

### Phase 2: Test-Driven Development

#### Step 1: Write Tests FIRST ✅
**File:** `tests/unit/group-creation-batch.test.ts`

- [ ] Test: Create group with name only (minimal)
- [ ] Test: Create group with all fields (maximal)
- [ ] Test: Auto-generate meta from name
- [ ] Test: Validate name length (1-50 chars)
- [ ] Test: Validate meta URL-safe characters
- [ ] Test: Set custom prompts with types
- [ ] Test: Add members via email
- [ ] Test: Generate invite link
- [ ] Test: Creator becomes admin
- [ ] Test: Invalid email throws error
- [ ] Test: Prompt text > 500 chars throws error
- [ ] Test: Duplicate member email handled gracefully
- [ ] **Minimum**: 12+ tests

#### Step 2: Run Tests (Expect Failures) ❌
- [ ] Execute: `npm run test:unit tests/unit/group-creation-batch.test.ts`
- [ ] Verify all tests FAIL (expected in TDD)
- [ ] Document failure output below

#### Step 3: Implement Mutation ✅
- [ ] Create `createGroupWithSettings` in `convex/groups.ts`
- [ ] Implement validation logic
- [ ] Implement transaction logic (atomic)
- [ ] Handle avatar/cover uploads
- [ ] Create custom prompts
- [ ] Add members
- [ ] Generate invite code

#### Step 4: Verify 100% Pass Rate ✅
- [ ] All tests passing
- [ ] No failures, no skipped tests
- [ ] Evidence documented below

### Phase 3: Validation
- [ ] Test in Convex dashboard (manual group creation)
- [ ] Verify rollback on error (intentionally fail mid-transaction)
- [ ] Check all tables updated correctly (groups, groupMembers, groupPrompts, invites)

---

## Implementation

### Mutation Code

```typescript
// convex/groups.ts

export const createGroupWithSettings = mutation({
  args: {
    name: v.string(),
    meta: v.optional(v.string()),
    description: v.optional(v.string()),
    avatarStorageId: v.optional(v.string()),
    coverStorageId: v.optional(v.string()),
    prompts: v.optional(v.array(v.object({
      promptNumber: v.number(),
      promptText: v.string(),
      promptType: v.union(
        v.literal("text"),
        v.literal("media"),
        v.literal("audio")
      ),
      isActive: v.boolean(),
    }))),
    memberEmails: v.optional(v.array(v.string())),
    generateInviteLink: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // 1. AUTHENTICATION
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    // 2. FIND OR CREATE CURRENT USER
    let user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .first();

    if (!user) {
      const userId = await ctx.db.insert("users", {
        email: identity.email!,
        clerkId: identity.subject,
        name: identity.name,
        username: (identity as any).username,
        profileImage: identity.pictureUrl,
        joinedAt: Date.now(),
      });
      user = await ctx.db.get(userId);
      if (!user) throw new ConvexError("Failed to create user");
    }

    // 3. VALIDATE NAME
    if (!args.name || args.name.trim().length === 0) {
      throw new ConvexError("Group name cannot be empty");
    }
    if (args.name.trim().length > 50) {
      throw new ConvexError("Group name must be 50 characters or less");
    }

    // 4. GENERATE OR VALIDATE META (GROUP ID)
    let meta = args.meta;
    if (!meta || meta.trim().length === 0) {
      // Auto-generate from name
      meta = args.name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .substring(0, 30);
    } else {
      // Validate provided meta
      if (meta.length > 30) {
        throw new ConvexError("Group ID must be 30 characters or less");
      }
      if (!/^[a-z0-9-]+$/.test(meta)) {
        throw new ConvexError("Group ID must contain only lowercase letters, numbers, and dashes");
      }
    }

    // 5. VALIDATE DESCRIPTION (optional)
    if (args.description && args.description.trim().length > 200) {
      throw new ConvexError("Description must be 200 characters or less");
    }

    // 6. VALIDATE MEMBER EMAILS (optional)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (args.memberEmails) {
      for (const email of args.memberEmails) {
        if (!emailRegex.test(email)) {
          throw new ConvexError(`Invalid email format: ${email}`);
        }
      }
    }

    // 7. VALIDATE PROMPTS (optional)
    if (args.prompts) {
      for (const prompt of args.prompts) {
        if (prompt.promptNumber < 1 || prompt.promptNumber > 5) {
          throw new ConvexError("Prompt number must be between 1 and 5");
        }
        if (prompt.promptText.trim().length === 0) {
          throw new ConvexError("Prompt text cannot be empty");
        }
        if (prompt.promptText.trim().length > 500) {
          throw new ConvexError("Prompt text must be 500 characters or less");
        }
        const validTypes = ["text", "media", "audio"];
        if (!validTypes.includes(prompt.promptType)) {
          throw new ConvexError("Invalid prompt type");
        }
      }
    }

    // 8. CREATE GROUP
    const groupId = await ctx.db.insert("groups", {
      name: args.name.trim(),
      meta: meta,
      createdAt: Date.now(),
      memberIds: [user._id],
      groupImage: args.avatarStorageId?.trim() || undefined,
      coverImage: args.coverStorageId?.trim() || undefined,
    });

    // 9. ADD CREATOR AS ADMIN
    await ctx.scheduler.runAfter(0, internal.migrations.syncMemberAddition, {
      groupId,
      userId: user._id,
      addedBy: user._id,
      role: "admin",
    });

    // 10. SET CUSTOM PROMPTS (if provided)
    if (args.prompts && args.prompts.length > 0) {
      const now = Date.now();
      for (const prompt of args.prompts) {
        await ctx.db.insert("groupPrompts", {
          groupId,
          promptNumber: prompt.promptNumber,
          promptText: prompt.promptText.trim(),
          promptType: prompt.promptType,
          isActive: prompt.isActive,
          displayOrder: prompt.promptNumber,
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    // 11. ADD MEMBERS (if provided)
    if (args.memberEmails && args.memberEmails.length > 0) {
      for (const email of args.memberEmails) {
        // Skip if adding self
        if (email.toLowerCase() === user.email.toLowerCase()) {
          continue;
        }

        // Find or create user
        let targetUser = await ctx.db
          .query("users")
          .filter((q) => q.eq(q.field("email"), email))
          .first();

        if (!targetUser) {
          const userId = await ctx.db.insert("users", {
            email: email,
            joinedAt: Date.now(),
          });
          targetUser = await ctx.db.get(userId);
        }

        if (targetUser) {
          // Get current group to update memberIds
          const group = await ctx.db.get(groupId);
          if (group && !group.memberIds.includes(targetUser._id)) {
            await ctx.db.patch(groupId, {
              memberIds: [...group.memberIds, targetUser._id],
            });

            // Add to groupMembers table
            await ctx.scheduler.runAfter(0, internal.migrations.syncMemberAddition, {
              groupId,
              userId: targetUser._id,
              addedBy: user._id,
              role: "member",
            });

            // Create invite record
            const inviteCode = generateInviteCode();
            await ctx.db.insert("invites", {
              groupId,
              email: email,
              invitedBy: user._id,
              inviteCode,
              status: "pending",
              createdAt: Date.now(),
            });

            // Send invite email (background)
            await ctx.scheduler.runAfter(0, internal.emails.sendGroupInvite, {
              to: email,
              groupName: args.name.trim(),
              inviterName: user.name || user.email,
              inviteCode,
            });
          }
        }
      }
    }

    // 12. GENERATE INVITE LINK (if requested)
    let inviteCode: string | undefined;
    let inviteUrl: string | undefined;

    if (args.generateInviteLink) {
      inviteCode = generateInviteCode();
      inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${inviteCode}`;

      await ctx.db.insert("invites", {
        groupId,
        email: "", // Empty for shareable link
        invitedBy: user._id,
        inviteCode,
        status: "pending",
        createdAt: Date.now(),
      });
    }

    // 13. RETURN RESULT
    return {
      groupId,
      inviteCode,
      inviteUrl,
      message: `Group "${args.name.trim()}" created successfully`,
    };
  },
});

// Helper function
function generateInviteCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
```

---

## Acceptance Criteria

### Functionality
- [ ] Creates group with name, meta, description
- [ ] Auto-generates meta from name if not provided
- [ ] Validates all inputs correctly
- [ ] Sets avatar and cover images
- [ ] Creates custom prompts with types
- [ ] Adds members to group
- [ ] Generates invite link
- [ ] Creator assigned admin role

### Transaction Safety
- [ ] All operations atomic (rollback on failure)
- [ ] No partial group creation
- [ ] Errors are descriptive

### Testing
- [ ] 12+ unit tests pass (100% pass rate)
- [ ] All error cases covered
- [ ] Backward compatibility maintained

---

## Test Results (MANDATORY)

### TDD Cycle Evidence

**Step 1: Tests Written First** ✅
- Date/Time: [TO BE FILLED]
- Test file: `tests/unit/group-creation-batch.test.ts`
- Number of tests: 12+ tests

**Step 2: Tests Run (Pre-Implementation)** ❌
```
[TO BE FILLED]
FAIL tests/unit/group-creation-batch.test.ts
Error: [Function not found error]
```

**Step 3: Implementation Written** ✅
- Files modified: `convex/groups.ts`
- Lines changed: ~200 lines

**Step 4: Tests Re-run (Post-Implementation)** ✅
```
[TO BE FILLED]
✓ tests/unit/group-creation-batch.test.ts (12 tests)
100% PASS RATE ✅
```

---

## Expected Outputs

### Files Modified
- [ ] `convex/groups.ts` - new mutation added
- [ ] `tests/unit/group-creation-batch.test.ts` - 12+ tests

### Breaking Changes
- [ ] None (additive only)

---

## Handoff Notes

### For STORY-B1, B2, B3, B4 (Frontend Integration)

**Mutation Available:**
```typescript
const result = await createGroupWithSettings({
  name: "My Book Club",
  meta: "my-book-club", // Optional
  description: "Monthly discussions",
  avatarStorageId: "kg...", // After upload
  coverStorageId: "mf...",  // After upload
  prompts: [
    {
      promptNumber: 1,
      promptText: "What did you read?",
      promptType: "text",
      isActive: true,
    },
  ],
  memberEmails: ["alice@ex.com"],
  generateInviteLink: true,
});

// Response: { groupId, inviteCode, inviteUrl, message }
```

**Image Upload Flow:**
1. Frontend uploads file to Convex storage first
2. Gets storageId
3. Passes storageId to this mutation

---

## Completion Checklist

- [ ] All tasks completed
- [ ] All acceptance criteria met
- [ ] Tests written and passing (12+ tests, 100% pass rate)
- [ ] Mutation implemented and tested
- [ ] Transaction safety verified
- [ ] Handoff notes documented
- [ ] STORY_TRACKER.md updated with status ✅ Done
- [ ] Committed with message: "feat: Add createGroupWithSettings batch mutation (STORY-A2)"

---

**Last Updated:** 2025-10-11
**Status:** 🟡 Pending (Ready for Backend Agent)
**Estimated Time:** 1.5 hours
