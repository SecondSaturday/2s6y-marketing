# STORY-B5: Group Prompts Mutations

**Linear**: [2S6-9](https://linear.app/2s6y/issue/2S6-9/story-b5-group-prompts-mutations)
**Phase**: 1 (Parallel)
**Agent**: Backend Agent
**Time**: 1 hour
**Priority**: P2 (High)
**Dependencies**: B2 (Date Helpers)

## Quick Summary
Create group prompts mutations with 2-week deletion validation.

## Tasks
- [ ] Create `convex/groupPrompts.ts`:
  - `getActivePrompts({ groupId })` - Returns active prompts with displayOrder
  - `deletePrompt({ promptId })` - With 2-week + response validation
  - Helper: `hasResponsesForPrompt(promptNumber, groupId, month)`
- [ ] Deletion validation:
  - Block if `<2 weeks to deadline` AND `responses exist`
  - Throw ConvexError with clear message
- [ ] Allow deletion if `>2 weeks` even with responses (notify users)
- [ ] Create unit tests

## Contract Output
See `CONTRACTS.md` Section 3 for exact signatures.

```typescript
getActivePrompts({ groupId: Id<"groups"> }) => Array<GroupPrompt>

deletePrompt({ promptId: Id<"groupPrompts"> }) => {
  success: boolean,
  deletedResponseCount?: number
}
```

## Testing
- Unit test: Delete with no responses (success)
- Unit test: Delete >2 weeks with responses (success)
- Unit test: Delete <2 weeks with responses (blocked)

## Files
- `convex/groupPrompts.ts` (new)
- `tests/unit/groupPrompts.test.ts` (new)

## Linear Updates
- Wait for B2 to be "Done" before starting
- Set status to "In Progress" when starting
- Add test results as comment when done
- Set status to "Done" when tests pass
