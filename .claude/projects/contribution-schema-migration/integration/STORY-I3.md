# STORY-I3: E2E Test - Prompt Deletion with 2-Week Rule

**Linear**: [2S6-19](https://linear.app/2s6y/issue/2S6-19/story-i3-e2e-test-prompt-deletion-with-2-week-rule)
**Phase**: 3 (Integration)
**Agent**: Orchestrator
**Time**: 0.5 hours
**Priority**: P2 (High)
**Dependencies**: ALL Phase 1+2 stories (B1-B6, F1-F6)

## Quick Summary
Create E2E test for prompt deletion validation and 2-week rule enforcement.

## Tasks
- [ ] Create test file: `tests/e2e/prompt-deletion-rules.spec.ts`
- [ ] Test flow:
  a. Admin creates prompt, user responds
  b. Mock time to 3 weeks before deadline
  c. Admin deletes prompt → confirmation shown
  d. Admin confirms → user gets notification
  e. Mock time to 1 week before deadline
  f. Admin creates new prompt, user responds
  g. Admin tries to delete → blocked with error
- [ ] Use Playwright MCP for browser automation
- [ ] Verify notifications created

## MCP Tools
- `mcp__playwright__browser_navigate`
- `mcp__playwright__browser_click`
- `mcp__playwright__browser_wait_for`
- `mcp__playwright__browser_snapshot`
- `mcp__playwright__browser_take_screenshot`

## Testing
- Confirmation modal shows
- Deletion succeeds if >2 weeks
- Deletion blocked if <2 weeks + responses exist
- User receives notification

## Files
- `tests/e2e/prompt-deletion-rules.spec.ts` (new)

## Linear Updates
- Wait for ALL Phase 1+2 to be "Done" before starting
- Set status to "In Progress" when starting
- Add test results as comment when done
- Set status to "Done" when tests pass
