# STORY-F4: Read-Only View After Deadline

**Linear**: [2S6-14](https://linear.app/2s6y/issue/2S6-14/story-f4-read-only-view-after-deadline)
**Phase**: 2 (Dependent)
**Agent**: Frontend Agent
**Time**: 0.5 hours
**Priority**: P2 (High)
**Dependencies**: B4 (Deadline Enforcement)

## Quick Summary
Lock contribution form after deadline passes.

## Tasks
- [ ] Update `app/contribute/page.tsx`:
  - Query `canEdit(contributionId)` on page load
  - If `canEdit === false`:
    - Disable all form inputs (add `disabled` prop)
    - Show message: "Contributions locked. Newsletter sends soon!"
    - Hide "Save" button
    - Keep "Preview" button visible
  - Show error toast if user tries to edit after deadline

## Contract Input
`canEdit({ contributionId })` from B4

## Testing
- E2E test: Verify form locked after deadline
- E2E test: Verify error on save attempt
- Visual test: Locked form state

## Files
- `app/contribute/page.tsx`
- `tests/e2e/contribution-locked.spec.ts` (part of I2)

## Linear Updates
- Wait for B4 to be "Done" before starting
- Set status to "In Progress" when starting
- Add test results as comment when done
- Set status to "Done" when tests pass
