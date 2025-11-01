# STORY-[ID]: [Helper Functions Name]

**Track:** A (Backend)
**Agent:** backend-dev
**Time Estimate:** 1 hour
**Dependencies:** [Schema story]
**Blocks:** [Stories that need these helpers]
**Status:** 🔴 Not Started

---

## Context

Create reusable helper functions for [purpose]. These helpers will be used across multiple mutations/queries to [specific benefit].

**Why This Story Matters**:
- **Code Reusability**: Avoid duplicating logic across mutations
- **Consistency**: Ensure permission checks work identically everywhere
- **Maintainability**: Single place to update business rules
- **Testing**: Test helper logic once, use everywhere

**Common Use Cases**:
- Permission/role checking functions
- Data validation helpers
- Query helpers (common database operations)
- Business logic utilities

---

## Tasks (TDD Order - Mandatory)

### Phase 1: Preparation
- [ ] Identify common patterns in existing code
- [ ] List all helper functions needed
- [ ] Design function signatures
- [ ] Plan error handling strategy

### Phase 2: Test-Driven Development (TDD)

#### Step 1: Write Tests FIRST ✅
- [ ] Test each helper function (3-5 tests per function)
- [ ] Test success paths
- [ ] Test error cases
- [ ] Test edge cases (null, undefined, empty)
- [ ] **Minimum**: 15+ tests (assuming 3-5 helpers)

#### Step 2: Run Tests (Expect Failures) ❌
- [ ] Execute test command
- [ ] Verify all tests FAIL (expected in TDD)
- [ ] Document failure output below

#### Step 3: Implement Helpers ✅
- [ ] Create `convex/lib/[helpers].ts`
- [ ] Implement each helper function
- [ ] Add TypeScript types
- [ ] Add JSDoc comments
- [ ] Handle errors properly

#### Step 4: Verify 100% Pass Rate ✅
- [ ] All tests passing
- [ ] No failures, no skipped tests
- [ ] Evidence documented below

---

## Common Helper Function Patterns

### 1. Authentication Helper

```typescript
/**
 * Verifies user is authenticated and returns user identity
 * @throws ConvexError if not authenticated
 */
export async function requireAuth(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError("Not authenticated");
  }
  return identity;
}

/**
 * Gets current user from database
 * @throws ConvexError if user not found
 */
export async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
  const identity = await requireAuth(ctx);

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .first();

  if (!user) {
    throw new ConvexError("User not found");
  }

  return user;
}
```

### 2. Role/Permission Helpers

```typescript
/**
 * Gets user's role in a group
 * @returns "admin" | "member" | null
 */
export async function getUserRole(
  ctx: QueryCtx | MutationCtx,
  args: { groupId: Id<"groups">; userId: Id<"users"> }
) {
  const membership = await ctx.db
    .query("groupMembers")
    .withIndex("by_group_user", (q) =>
      q.eq("groupId", args.groupId).eq("userId", args.userId)
    )
    .first();

  return membership?.role || null;
}

/**
 * Checks if user is admin of a group
 */
export async function isAdmin(
  ctx: QueryCtx | MutationCtx,
  args: { groupId: Id<"groups">; userId: Id<"users"> }
): Promise<boolean> {
  const role = await getUserRole(ctx, args);
  return role === "admin";
}

/**
 * Requires user to be admin, throws error otherwise
 * @throws ConvexError if not admin
 */
export async function requireAdmin(
  ctx: QueryCtx | MutationCtx,
  args: { groupId: Id<"groups"> }
) {
  const user = await getCurrentUser(ctx);
  const isUserAdmin = await isAdmin(ctx, { groupId: args.groupId, userId: user._id });

  if (!isUserAdmin) {
    throw new ConvexError("Insufficient permissions");
  }

  return user;
}
```

### 3. Query Helpers

```typescript
/**
 * Gets all members of a group
 */
export async function getGroupMembers(
  ctx: QueryCtx | MutationCtx,
  groupId: Id<"groups">
) {
  return await ctx.db
    .query("groupMembers")
    .withIndex("by_group", (q) => q.eq("groupId", groupId))
    .collect();
}

/**
 * Gets member count for a group
 */
export async function getMemberCount(
  ctx: QueryCtx | MutationCtx,
  groupId: Id<"groups">
): Promise<number> {
  const members = await getGroupMembers(ctx, groupId);
  return members.length;
}

/**
 * Checks if user is a member of a group
 */
export async function isMember(
  ctx: QueryCtx | MutationCtx,
  args: { groupId: Id<"groups">; userId: Id<"users"> }
): Promise<boolean> {
  const membership = await ctx.db
    .query("groupMembers")
    .withIndex("by_group_user", (q) =>
      q.eq("groupId", args.groupId).eq("userId", args.userId)
    )
    .first();

  return membership !== null && membership.status === "active";
}
```

### 4. Validation Helpers

```typescript
/**
 * Validates email format
 * @throws ConvexError if invalid
 */
export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ConvexError("Invalid email format");
  }
}

/**
 * Validates string length
 * @throws ConvexError if too short or too long
 */
export function validateLength(
  value: string,
  min: number,
  max: number,
  fieldName: string
): void {
  if (value.length < min) {
    throw new ConvexError(`${fieldName} must be at least ${min} characters`);
  }
  if (value.length > max) {
    throw new ConvexError(`${fieldName} cannot exceed ${max} characters`);
  }
}

/**
 * Checks if entity exists
 * @throws ConvexError if not found
 */
export async function requireEntity<T extends string>(
  ctx: QueryCtx | MutationCtx,
  tableName: T,
  id: Id<T>
): Promise<Doc<T>> {
  const entity = await ctx.db.get(id);
  if (!entity) {
    throw new ConvexError(`${tableName} not found`);
  }
  return entity;
}
```

### 5. Combined Permission Checks

```typescript
/**
 * Combined check: auth + membership + not blocked
 * @throws ConvexError if any check fails
 * @returns { user, role }
 */
export async function requireGroupAccess(
  ctx: QueryCtx | MutationCtx,
  args: { groupId: Id<"groups"> }
) {
  // 1. Check authentication
  const user = await getCurrentUser(ctx);

  // 2. Check group exists
  const group = await requireEntity(ctx, "groups", args.groupId);

  // 3. Check membership
  const role = await getUserRole(ctx, { groupId: args.groupId, userId: user._id });
  if (!role) {
    throw new ConvexError("Not a member of this group");
  }

  // 4. Check not blocked
  const isUserBlocked = await isBlocked(ctx, { groupId: args.groupId, userId: user._id });
  if (isUserBlocked) {
    throw new ConvexError("You have been blocked from this group");
  }

  return { user, role };
}

/**
 * Combined check: auth + admin access + not blocked
 */
export async function requireGroupAdminAccess(
  ctx: QueryCtx | MutationCtx,
  args: { groupId: Id<"groups"> }
) {
  const { user, role } = await requireGroupAccess(ctx, args);

  if (role !== "admin") {
    throw new ConvexError("Admin access required");
  }

  return user;
}
```

---

## Acceptance Criteria

### Functionality
- [ ] All helper functions implemented
- [ ] All tests passing (15+, 100% pass rate)
- [ ] No code duplication
- [ ] Proper error handling

### Code Quality
- [ ] TypeScript strict mode compliance
- [ ] JSDoc comments for all functions
- [ ] Descriptive function names
- [ ] Proper type definitions
- [ ] No `any` types

### Reusability
- [ ] Functions are pure/deterministic (where possible)
- [ ] Single responsibility principle
- [ ] Easy to test in isolation
- [ ] No side effects (unless explicitly intended)

---

## Test Results (MANDATORY)

### TDD Cycle Evidence

**Step 1: Tests Written First** ✅
- Date/Time: [YYYY-MM-DD HH:MM]
- Test file: `tests/unit/[helpers].test.ts`
- Number of tests: [X tests]
- Factory used: `tests/factories/[factory].ts` ✅

**Step 2: Tests Run (Pre-Implementation)** ❌
```
[Paste terminal output showing tests FAILING]
```

**Step 3: Implementation Written** ✅
- File: `convex/lib/[helpers].ts`
- Number of functions: [X]
- Lines of code: ~[X lines]

**Step 4: Tests Re-run (Post-Implementation)** ✅
```
[Paste terminal output showing tests PASSING]

Example:
✅ PASS tests/unit/[helpers].test.ts
  ✅ requireAuth throws if not authenticated
  ✅ getCurrentUser returns user
  ✅ getUserRole returns correct role
  ✅ isAdmin returns true for admins
  ✅ requireAdmin throws for non-admins
  ... (15+ tests)

Tests: 15 passed, 15 total
Pass Rate: 100% ✅
```

**STATUS**: [✅ 100% pass rate / ❌ <100% - IMPLEMENTATION FAILED]

---

## Expected Outputs

### Files Created
- [ ] `convex/lib/[helpers].ts` - Helper functions
- [ ] `tests/unit/[helpers].test.ts` - Comprehensive tests (15+)

---

## Handoff Notes

### For Stories That Depend On This

**Import Helpers**:
```typescript
import {
  requireAuth,
  getCurrentUser,
  getUserRole,
  isAdmin,
  requireAdmin,
  requireGroupAccess,
  // ... other helpers
} from "@/convex/lib/[helpers]";
```

**Example Usage in Mutations**:
```typescript
export const [mutationName] = mutation({
  args: { groupId: v.id("groups") },
  handler: async (ctx, args) => {
    // Use helper for combined checks
    const user = await requireGroupAdminAccess(ctx, { groupId: args.groupId });

    // Now you have authenticated admin user
    // Proceed with business logic
  },
});
```

**Example Usage in Queries**:
```typescript
export const [queryName] = query({
  args: { groupId: v.id("groups") },
  handler: async (ctx, args) => {
    // Check membership
    const { user, role } = await requireGroupAccess(ctx, { groupId: args.groupId });

    // Query based on role
    if (role === "admin") {
      // Return admin view
    } else {
      // Return member view
    }
  },
});
```

**Key Functions Available**:
- `requireAuth()` - Verify authentication
- `getCurrentUser()` - Get current user
- `getUserRole()` - Get user's role in group
- `isAdmin()` - Check if user is admin
- `requireAdmin()` - Require admin access
- `requireGroupAccess()` - Combined membership check
- `requireGroupAdminAccess()` - Combined admin check
- [List all helpers created]

---

## Related Stories

**Depends On**:
- STORY-[XXX]: [Schema] - Provides database tables

**Blocks**:
- STORY-[YYY]: [Mutation] - Needs these helpers
- STORY-[ZZZ]: [Query] - Needs these helpers

---

## Completion Checklist

- [ ] All helper functions implemented
- [ ] All tests passing (15+, 100% pass rate)
- [ ] JSDoc comments added
- [ ] TypeScript strict mode compliance
- [ ] Handoff notes documented
- [ ] STORY_TRACKER.md updated with status ✅ Done
- [ ] Committed with message: "feat: [Helpers Description] (STORY-[ID])"
- [ ] Documented actual time spent

---

**Last Updated:** [YYYY-MM-DD]
**Completed By:** [Agent name]
**Actual Time:** [X hours]
