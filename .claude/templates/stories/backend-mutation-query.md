# STORY-[ID]: [Mutation/Query Name]

**Track:** A (Backend)
**Agent:** backend-dev
**Time Estimate:** 1-2 hours
**Dependencies:** [Schema story, helper functions]
**Blocks:** [Frontend stories that need this API]
**Status:** 🔴 Not Started

---

## Contract Specification

**Contract File**: `tests/contracts/[feature-name].contract.ts`

**Backend API**:
- Function: `[functionName]`
- Type: Mutation / Query
- Args: `{ [param]: type, ... }`
- Returns: `[returnType]`
- Errors: `["Error 1", "Error 2", ...]`

**Frontend Usage**:
- Component: `[ComponentName]`
- Expects: `["field1", "field2"]`
- Sends: `{ [arg]: value, ... }`

---

## Factory Usage

**Factory**: `tests/factories/[dataType]Factory.ts`

**Example Usage**:
```typescript
import { create[DataType] } from './factories/[dataType]Factory';

// In tests
const testData = create[DataType]({ /* overrides */ });
```

---

## Context

Create [mutation/query] to [what it does]. This enables [business capability].

**Why This Story Matters**:
- [Business reason]
- [User impact]
- [Technical benefit]

**Related Functionality**:
- Uses `[helperFunction]` from STORY-[XX]
- Integrates with `[existingFeature]`

---

## Tasks (TDD Order - Mandatory)

### Phase 1: Preparation
- [ ] Read contract specification (if full-stack feature)
- [ ] Identify factory for test data
- [ ] Review helper functions from dependencies
- [ ] Understand schema structure

### Phase 2: Test-Driven Development (TDD)

#### Step 1: Write Tests FIRST ✅
- [ ] Happy path test
- [ ] Authentication test (if auth required)
- [ ] Authorization test (if role-based)
- [ ] Input validation tests (2-3 scenarios)
- [ ] Error handling tests
- [ ] Edge case tests
- [ ] **Minimum**: 5+ tests for backend

#### Step 2: Run Tests (Expect Failures) ❌
- [ ] Execute: `npm run test:unit -- tests/unit/[filename].test.ts`
- [ ] Verify all tests FAIL (expected in TDD)
- [ ] Document failure output below

#### Step 3: Implement Mutation/Query ✅
- [ ] Create function in `convex/[module].ts`
- [ ] Add Convex validators for all args
- [ ] Implement authentication check
- [ ] Implement authorization check (if needed)
- [ ] Implement business logic
- [ ] Add error handling with ConvexError
- [ ] Return proper type

#### Step 4: Verify 100% Pass Rate ✅
- [ ] Re-run tests
- [ ] All tests passing
- [ ] No failures, no skipped tests
- [ ] Evidence documented below

### Phase 3: Additional Requirements

**Security**:
- [ ] Input validation with Convex validators
- [ ] Authentication check (if required)
- [ ] Authorization check (if role-based)
- [ ] No sensitive data exposed
- [ ] Proper error messages (user-friendly)

**Performance**:
- [ ] Use indexes for queries
- [ ] Limit results (pagination if needed)
- [ ] Optimize database calls

**Type Safety**:
- [ ] Explicit return type
- [ ] No `any` types
- [ ] Proper TypeScript interfaces

---

## Implementation Template

### Mutation Template

```typescript
import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { ConvexError } from "convex/values";

export const [functionName] = mutation({
  args: {
    // Define all arguments with Convex validators
    [arg1]: v.[type](),
    [arg2]: v.[type](),
    // Optional args
    [optionalArg]: v.optional(v.[type]()),
  },
  handler: async (ctx, args) => {
    // 1. Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    // 2. Get current user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    // 3. Authorization check (if needed)
    // Example: Check if user is admin
    const role = await getUserRole(ctx, { groupId: args.groupId, userId: user._id });
    if (role !== "admin") {
      throw new ConvexError("Insufficient permissions");
    }

    // 4. Input validation (additional business logic)
    if (args.[field] && args.[field].length > 100) {
      throw new ConvexError("[Field] cannot exceed 100 characters");
    }

    // 5. Business logic
    const result = await ctx.db.insert("[tableName]", {
      ...args,
      userId: user._id,
      createdAt: Date.now(),
    });

    // 6. Return
    return result;
  },
});
```

### Query Template

```typescript
import { v } from "convex/values";
import { query } from "./_generated/server";
import { ConvexError } from "convex/values";

export const [functionName] = query({
  args: {
    [arg1]: v.[type](),
    // Optional pagination
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Authentication check (if needed)
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    // 2. Build query with index
    let queryBuilder = ctx.db
      .query("[tableName]")
      .withIndex("by_[field]", (q) => q.eq("[field]", args.[arg1]));

    // 3. Apply filters
    const results = await queryBuilder
      .order("desc") // or "asc"
      .take(args.limit || 50); // Default limit

    // 4. Enrich data (if needed)
    const enriched = await Promise.all(
      results.map(async (item) => {
        const relatedData = await ctx.db.get(item.[relatedId]);
        return {
          ...item,
          [relatedField]: relatedData?.[field],
        };
      })
    );

    // 5. Return
    return enriched;
  },
});
```

---

## Acceptance Criteria

### Functionality
- [ ] All tasks completed
- [ ] Contract requirements met (if applicable)
- [ ] All tests passing (100% pass rate)
- [ ] No regressions in existing functionality

### Security
- [ ] Input validation with Convex validators
- [ ] Authentication implemented (if required)
- [ ] Authorization implemented (if role-based)
- [ ] No sensitive data exposed
- [ ] User-friendly error messages

### Code Quality
- [ ] Follows project conventions
- [ ] Type-safe (explicit return types)
- [ ] Well-documented (comments where needed)
- [ ] No console warnings or errors
- [ ] Uses helper functions (no code duplication)

### Performance
- [ ] Uses indexes for queries
- [ ] Results limited/paginated
- [ ] No N+1 query problems

---

## Test Results (MANDATORY)

### TDD Cycle Evidence

**Step 1: Tests Written First** ✅
- Date/Time: [YYYY-MM-DD HH:MM]
- Test file: `tests/unit/[filename].test.ts`
- Number of tests: [X tests]
- Factory used: `tests/factories/[factory].ts` ✅

**Step 2: Tests Run (Pre-Implementation)** ❌
```
[Paste terminal output showing tests FAILING before implementation]

Example:
❌ FAIL tests/unit/[module].test.ts
  ❌ [functionName] saves data with valid input
     Error: [functionName] is not defined
  ❌ [functionName] rejects unauthenticated users
     Error: [functionName] is not defined
  ❌ [functionName] validates input
     Error: [functionName] is not defined

Tests: 0 passed, 5 failed, 5 total
Time: 1.2s
```

**Expected**: All tests should FAIL at this step (no implementation yet)

**Step 3: Implementation Written** ✅
- File: `convex/[module].ts`
- Function: `[functionName]`
- Lines of code: ~[X lines]
- Date/Time: [YYYY-MM-DD HH:MM]

**Step 4: Tests Re-run (Post-Implementation)** ✅
```
[Paste terminal output showing tests PASSING after implementation]

Example:
✅ PASS tests/unit/[module].test.ts
  ✅ [functionName] saves data with valid input (234ms)
  ✅ [functionName] rejects unauthenticated users (123ms)
  ✅ [functionName] validates input format (98ms)
  ✅ [functionName] handles duplicate entries (187ms)
  ✅ [functionName] checks authorization (145ms)

Tests: 5 passed, 5 total
Time: 1.1s
Pass Rate: 100% ✅
```

**STATUS**: [✅ 100% pass rate / ❌ <100% - IMPLEMENTATION FAILED]

---

## Expected Outputs

### Files Created/Modified
- [ ] `convex/[module].ts` - New mutation/query
- [ ] `tests/unit/[module].test.ts` - Unit tests (5+ tests)
- [ ] `convex/_generated/api.d.ts` - Auto-generated (by Convex)

---

## Handoff Notes

### API Reference

**Import:**
```typescript
import { [functionName] } from "@/convex/[module]";
```

**Usage (Frontend)**:
```typescript
// For mutations
const mutate = useMutation(api.[module].[functionName]);

// Call mutation
const result = await mutate({
  [arg1]: value1,
  [arg2]: value2,
});

// For queries
const data = useQuery(api.[module].[functionName], {
  [arg1]: value1,
});
```

**Return Type**:
```typescript
// Describe what the function returns
{
  _id: Id<"[tableName]">,
  [field1]: type,
  [field2]: type,
  // ...
}
```

**Error Handling**:
```typescript
try {
  await mutate({ ... });
} catch (error) {
  if (error instanceof ConvexError) {
    toast.error(error.message); // User-friendly messages
  }
}
```

**Common Errors**:
- `"Not authenticated"` - User not logged in
- `"Insufficient permissions"` - User lacks required role
- `"[Validation error]"` - Input validation failed

---

## Contract Compliance (If Applicable)

**Contract Verified**: ✅ / ❌

**Backend Provides**:
- [ ] All required fields present in return
- [ ] Return type matches contract
- [ ] All contract errors implemented

**Frontend Integration**:
- [ ] Frontend can send correct args
- [ ] Frontend expects correct return type
- [ ] Frontend handles all contract errors

---

## Related Stories

**Depends On**:
- STORY-[XXX]: [Schema] - Provides database tables
- STORY-[YYY]: [Helpers] - Provides helper functions

**Blocks**:
- STORY-[ZZZ]: [Frontend] - Needs this API

---

## Completion Checklist

- [ ] All tasks completed
- [ ] All acceptance criteria met
- [ ] Tests written and passing (5+, 100% pass rate)
- [ ] Contract compliance verified (if applicable)
- [ ] Code follows Convex patterns
- [ ] Security implemented correctly
- [ ] Handoff notes documented
- [ ] STORY_TRACKER.md updated with status ✅ Done
- [ ] Committed with message: "feat: [Function Description] (STORY-[ID])"
- [ ] Documented actual time spent

---

**Last Updated:** [YYYY-MM-DD]
**Completed By:** [Agent name]
**Actual Time:** [X hours]
