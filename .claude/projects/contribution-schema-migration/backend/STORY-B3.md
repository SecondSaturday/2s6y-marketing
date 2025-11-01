# STORY-B3: Update Contributions Mutations

**Linear**: [2S6-7](https://linear.app/2s6y/issue/2S6-7/story-b3-update-contributions-mutations)
**Phase**: 1 (Parallel)
**Agent**: Backend Agent
**Time**: 1.5 hours
**Priority**: P1 (Urgent)
**Dependencies**: B1 (Schema), B2 (Date Helpers)

## Quick Summary
Update contributions mutations to accept `responses` object and calculate deadlines automatically.

## Tasks
- [ ] Update `convex/contributions.ts`:
  - Modify `createOrUpdate` to accept `responses` object (not prompt1-5)
  - Calculate `editDeadline` on creation using `getEditDeadline(month)`
  - Validate responses against active prompts
  - Maintain auto-save compatibility
- [ ] Keep same mutation signature for frontend compatibility
- [ ] Create/update unit tests

## Contract Output
See `CONTRACTS.md` Section 2 for exact signature of `createOrUpdate`.

```typescript
createOrUpdate({
  groupId: Id<"groups">,
  month: string,
  responses: Record<string, ResponseValue>
}) => Id<"contributions">
```

## Testing
- Unit test: Create contribution with responses
- Unit test: Update contribution with responses
- Unit test: editDeadline calculation
- Unit test: Validation of inactive prompts

## Files
- `convex/contributions.ts`
- `tests/unit/contributions-mutations.test.ts`

## Linear Updates
- Wait for B1, B2 to be "Done" before starting
- Set status to "In Progress" when starting
- Add test results as comment when done
- Set status to "Done" when tests pass
