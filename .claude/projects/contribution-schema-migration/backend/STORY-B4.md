# STORY-B4: Deadline Enforcement

**Linear**: [2S6-8](https://linear.app/2s6y/issue/2S6-8/story-b4-deadline-enforcement)
**Phase**: 1 (Parallel)
**Agent**: Backend Agent
**Time**: 1 hour
**Priority**: P1 (Urgent)
**Dependencies**: B3 (Contributions Mutations)

## Quick Summary
Add `canEdit` query and enforce deadline in mutations.

## Tasks
- [ ] Add `canEdit` query to `convex/contributions.ts`:
  - Check if current time is before `editDeadline`
  - Return `{ canEdit: boolean, deadline: number, message?: string }`
- [ ] Update `createOrUpdate` mutation:
  - Throw `ConvexError` if past deadline
  - Error message: "Deadline passed on [date]. Contributions locked."
- [ ] Create unit tests

## Contract Output
See `CONTRACTS.md` Section 2 for exact signature of `canEdit`.

```typescript
canEdit({ contributionId: Id<"contributions"> }) => {
  canEdit: boolean,
  deadline: number,
  message?: string
}
```

## Testing
- Unit test: canEdit before deadline (returns true)
- Unit test: canEdit after deadline (returns false)
- Unit test: createOrUpdate blocked after deadline
- Unit test: Error message format

## Files
- `convex/contributions.ts`
- `tests/unit/deadline-enforcement.test.ts` (new)

## Linear Updates
- Wait for B3 to be "Done" before starting
- Set status to "In Progress" when starting
- Add test results as comment when done
- Set status to "Done" when tests pass
