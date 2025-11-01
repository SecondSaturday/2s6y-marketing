# STORY-B6: User Notifications for Prompt Deletion

**Linear**: [2S6-10](https://linear.app/2s6y/issue/2S6-10/story-b6-user-notifications-for-prompt-deletion)
**Phase**: 1 (Parallel)
**Agent**: Backend Agent
**Time**: 1 hour
**Priority**: P3 (Medium)
**Dependencies**: B5 (Group Prompts Mutations)

## Quick Summary
Notify users when their responses are deleted due to prompt changes.

## Tasks
- [ ] Update `deletePrompt` mutation:
  - When deleting prompt >2 weeks out: Create notifications for affected users
  - Find all users with responses to this prompt
  - Create notification for each affected user
- [ ] Add mutation: `notifyPromptDeleted({ promptNumber, groupId, affectedUserIds })`
- [ ] Notification type: "prompt_deleted"
- [ ] Message: "Admin changed [Prompt Title]. Your response was removed."
- [ ] Create unit tests

## Contract Output
See `CONTRACTS.md` Section 4 for notification signature.

```typescript
// Notifications created automatically when prompt deleted
// Type: "prompt_deleted"
// Message: "Admin changed [Prompt Title]. Your response was removed."
```

## Testing
- Unit test: Notifications created for affected users
- Unit test: Notification content correct
- Unit test: No notifications if no responses

## Files
- `convex/groupPrompts.ts`
- `convex/notifications.ts` (update)
- `tests/unit/prompt-deletion-notifications.test.ts` (new)

## Linear Updates
- Wait for B5 to be "Done" before starting
- Set status to "In Progress" when starting
- Add test results as comment when done
- Set status to "Done" when tests pass
