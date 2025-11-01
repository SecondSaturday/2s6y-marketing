# STORY-F6: Admin Prompt Deletion Confirmation

**Linear**: [2S6-16](https://linear.app/2s6y/issue/2S6-16/story-f6-admin-prompt-deletion-confirmation)
**Phase**: 2 (Dependent)
**Agent**: Frontend Agent
**Time**: 1 hour
**Priority**: P3 (Medium)
**Dependencies**: B5 (Group Prompts Mutations)

## Quick Summary
Add confirmation modal before admin deletes prompt with responses.

## Tasks
- [ ] Update admin settings page (prompt management UI):
  - Before deleting prompt: Query `hasResponsesForPrompt(promptNumber)`
  - If responses exist: Show confirmation modal
    - Message: "This will delete [X] user responses. Continue?"
    - Buttons: "Cancel" | "Delete Responses"
  - If no responses: Delete immediately (no modal)
  - Handle error: If <2 weeks to deadline + responses exist
    - Show error toast: "Cannot delete. Less than 2 weeks to deadline and users have responded."
- [ ] Use DaisyUI modal component
- [ ] Add loading state during deletion
- [ ] Create E2E test

## Contract Input
`deletePrompt({ promptId })` from B5

## Testing
- E2E test: Delete with confirmation
- E2E test: Deletion blocked <2 weeks
- Visual test: Confirmation modal

## Files
- `app/groups/[groupId]/settings/page.tsx` (or prompt management page)
- `components/modals/DeletePromptConfirmation.tsx` (new)
- `tests/e2e/prompt-deletion.spec.ts` (part of I3)

## Linear Updates
- Wait for B5 to be "Done" before starting
- Set status to "In Progress" when starting
- Add test results as comment when done
- Set status to "Done" when tests pass
