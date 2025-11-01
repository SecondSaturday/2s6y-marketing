# STORY-[ID]: Database Schema Migration

**Track:** A (Backend)
**Agent:** backend-dev
**Time Estimate:** 1-2 hours
**Dependencies:** [List dependencies, e.g., STORY-000]
**Blocks:** [List stories that depend on this schema]
**Status:** 🔴 Not Started

---

## Context

Migrate from the current schema to support [feature name]. This enables [business capability] while maintaining backward compatibility during transition.

**Current Schema:**
```typescript
// Describe current structure
[tableName]: defineTable({
  // Current fields
})
```

**New Schema:**
Create [N] new tables/fields for [feature description].

**Why This Story Matters**:
- [Business reason 1]
- [Technical reason 2]
- [User impact 3]

---

## Tasks (TDD Order)

### Phase 1: Preparation
- [ ] Review existing schema in `convex/schema.ts`
- [ ] Identify all tables that need modification
- [ ] Plan indexes for query performance
- [ ] Document backward compatibility strategy

### Phase 2: Test-Driven Development

#### Step 1: Write Tests FIRST ✅
- [ ] Write migration test (if data migration needed)
- [ ] Write schema validation test
- [ ] Write query performance test (index usage)
- [ ] Write backward compatibility test
- [ ] Write rollback test (if applicable)
- [ ] **Minimum**: 8+ tests

#### Step 2: Run Tests (Expect Failures) ❌
- [ ] Execute test command
- [ ] Verify all tests FAIL (expected in TDD)
- [ ] Document failure output below

#### Step 3: Implement Schema Changes ✅
- [ ] Add new tables to `convex/schema.ts`
- [ ] Add necessary indexes
- [ ] Update TypeScript types
- [ ] Create migration script (if needed)
- [ ] Implement dual-write logic (if backward compatibility needed)

#### Step 4: Verify 100% Pass Rate ✅
- [ ] All tests passing
- [ ] No failures, no skipped tests
- [ ] Evidence documented below

### Phase 3: Validation
- [ ] Run `npx convex dev` - no errors
- [ ] Check Convex dashboard - schema updated
- [ ] Verify indexes created correctly
- [ ] Test existing queries still work
- [ ] Document breaking changes (if any)

---

## Schema Implementation Template

```typescript
// convex/schema.ts

export default defineSchema({
  // ... existing tables

  [newTableName]: defineTable({
    // Required fields
    [field1]: v.[type](),
    [field2]: v.[type](),

    // Optional fields
    [optionalField]: v.optional(v.[type]()),

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    // Add indexes for common queries
    .index("by_[field]", ["[field]"])
    .index("by_[field1]_[field2]", ["[field1]", "[field2]"])
    // Add composite indexes for multi-field queries
    .index("by_[composite]", ["[field1]", "[field2]", "[field3]"]),

  // If modifying existing table
  [existingTable]: defineTable({
    // ... existing fields
    // New fields (mark as optional for backward compatibility)
    [newField]: v.optional(v.[type]()),
  })
    // Existing indexes
    .index("existing_index", ["field"])
    // New indexes
    .index("by_new_field", ["newField"]),
});
```

## Migration Script Template (If Needed)

```typescript
// convex/migrations.ts

import { internalMutation } from "./_generated/server";

export const migrate[FeatureName] = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Read existing data
    const oldRecords = await ctx.db
      .query("[oldTable]")
      .collect();

    // Transform and insert into new structure
    for (const record of oldRecords) {
      await ctx.db.insert("[newTable]", {
        // Map old fields to new structure
        [newField]: record.[oldField],
        // ... more mappings
        createdAt: Date.now(),
      });
    }

    // Optional: Update old records for dual-write compatibility
    // Keep old structure working during transition
  },
});
```

## Dual-Write Pattern (Backward Compatibility)

```typescript
// convex/[feature].ts

export const create[Entity] = mutation({
  args: { /* ... */ },
  handler: async (ctx, args) => {
    // Write to NEW structure
    const newId = await ctx.db.insert("[newTable]", {
      ...args,
      createdAt: Date.now(),
    });

    // Also write to OLD structure (for backward compatibility)
    await ctx.db.patch(existingRecordId, {
      [oldField]: args.[newField],
    });

    return newId;
  },
});
```

---

## Acceptance Criteria

### Schema Changes
- [ ] All new tables created in schema
- [ ] All new fields added to existing tables
- [ ] All indexes created and functional
- [ ] Type definitions updated
- [ ] No TypeScript errors

### Migration (If Applicable)
- [ ] Migration script successfully migrates test data
- [ ] Data integrity verified (no data loss)
- [ ] Backward compatibility maintained
- [ ] Rollback plan documented

### Testing
- [ ] 8+ unit tests pass using `convex-test`
- [ ] All existing queries still work
- [ ] No breaking changes to existing mutations
- [ ] Convex dashboard shows no errors

### Performance
- [ ] Indexes optimize common queries
- [ ] No performance degradation
- [ ] Query execution time measured

---

## Test Results (MANDATORY)

### TDD Cycle Evidence

**Step 1: Tests Written First** ✅
- Date/Time: [YYYY-MM-DD HH:MM]
- Test file: `tests/unit/[migration].test.ts`
- Number of tests: [X tests]

**Step 2: Tests Run (Pre-Implementation)** ❌
```
[Paste terminal output showing tests FAILING before implementation]
```

**Step 3: Implementation Written** ✅
- Files modified: `convex/schema.ts`, `convex/migrations.ts` (if needed)
- Lines changed: ~[X lines]

**Step 4: Tests Re-run (Post-Implementation)** ✅
```
[Paste terminal output showing tests PASSING]

Example:
✅ PASS tests/unit/migration.test.ts
  ✅ migrates existing data correctly (234ms)
  ✅ creates correct indexes (123ms)
  ✅ maintains backward compatibility (98ms)
  ✅ handles empty data (45ms)
  ...

Tests: [X] passed, [X] total
Pass Rate: 100% ✅
```

**STATUS**: [✅ 100% pass rate / ❌ <100% - IMPLEMENTATION FAILED]

---

## Index Performance Validation

**Indexes Created**:
- `by_[field]` → Used by [queryName]
- `by_[composite]` → Used by [queryName]

**Query Performance** (before/after):
- [Query 1]: [X]ms → [Y]ms (improvement: [Z]%)
- [Query 2]: [X]ms → [Y]ms (improvement: [Z]%)

---

## Expected Outputs

### Files Created/Modified
- [ ] `convex/schema.ts` - Schema updates
- [ ] `convex/migrations.ts` - Migration functions (if needed)
- [ ] `tests/unit/migration.test.ts` - Migration tests
- [ ] `convex/[feature].ts` - Dual-write logic (if needed)

### Breaking Changes
- [ ] None (backward compatible)
- [ ] [List any breaking changes with migration path]

---

## Handoff Notes

### For Dependent Stories
**Schema Available**:
- Table: `[tableName]`
- Key fields: `[field1]`, `[field2]`, `[field3]`
- Indexes: Use `by_[field]` for fast lookups
- Types: Available in `convex/_generated/dataModel.d.ts`

**Migration Status**:
- [ ] Old API still works (dual-write enabled)
- [ ] New API ready for use
- [ ] Both stay in sync automatically

**Example Usage**:
```typescript
// Query the new table
const data = await ctx.db
  .query("[newTable]")
  .withIndex("by_[field]", (q) => q.eq("[field]", value))
  .first();
```

---

## Known Issues / Risks

- **Risk**: [Describe potential issue]
  - **Mitigation**: [How it's handled]
- **Risk**: [Another potential issue]
  - **Mitigation**: [How it's handled]

---

## Related Stories

**Depends On**:
- STORY-[XXX]: [Title] - [Why dependency exists]

**Blocks**:
- STORY-[YYY]: [Title] - [What this schema enables]
- STORY-[ZZZ]: [Title] - [What this schema enables]

---

## Completion Checklist

- [ ] All tasks completed
- [ ] All acceptance criteria met
- [ ] Tests written and passing (8+)
- [ ] Schema deployed to Convex
- [ ] No errors in Convex dashboard
- [ ] Handoff notes documented
- [ ] STORY_TRACKER.md updated with status ✅ Done
- [ ] Committed with message: "feat: [Schema Description] (STORY-[ID])"
- [ ] Documented actual time spent

---

**Last Updated:** [YYYY-MM-DD]
**Completed By:** [Agent name]
**Actual Time:** [X hours]
