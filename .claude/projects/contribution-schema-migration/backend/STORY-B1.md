# STORY-B1: Schema Migration

**Linear**: [2S6-5](https://linear.app/2s6y/issue/2S6-5/story-b1-schema-migration)
**Phase**: 1 (Parallel)
**Agent**: Backend Agent
**Time**: 1.5 hours
**Priority**: P1 (Urgent)
**Dependencies**: None

## Quick Summary
Update Convex schema to replace hardcoded `prompt1-5` fields with flexible `responses` object and add `editDeadline` field.

## Tasks
- [ ] Update `convex/schema.ts`:
  - Remove: `prompt1`, `prompt2`, `prompt3`, `prompt4`, `prompt5` fields
  - Add: `responses: v.optional(v.object({}))`
  - Add: `editDeadline: v.number()`
- [ ] Deploy schema changes (no migration script needed)
- [ ] Create unit test: `tests/unit/contributions-schema.test.ts`

## Contract Output
```typescript
// New contributions schema fields
responses: v.optional(v.object({})), // Dynamic keys "1"-"5"
editDeadline: v.number() // Calculated on creation
```

## Testing
- Unit test: Verify schema accepts new structure
- Verify Convex accepts schema deployment

## Files
- `convex/schema.ts`
- `tests/unit/contributions-schema.test.ts` (new)

## Linear Updates
- Set status to "In Progress" when starting
- Add test results as comment when done
- Set status to "Done" when tests pass
