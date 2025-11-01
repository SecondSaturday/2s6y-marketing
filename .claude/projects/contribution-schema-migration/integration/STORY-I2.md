# STORY-I2: E2E Test - Deadline Enforcement

**Linear**: [2S6-18](https://linear.app/2s6y/issue/2S6-18/story-i2-e2e-test-deadline-enforcement)
**Phase**: 3 (Integration)
**Agent**: Orchestrator
**Time**: 1 hour
**Priority**: P1 (Urgent)
**Dependencies**: ALL Phase 1+2 stories (B1-B6, F1-F6)

## Quick Summary
Create E2E test for deadline enforcement and countdown timer behavior.

## Tasks
- [ ] Create test file: `tests/e2e/contribution-deadline.spec.ts`
- [ ] Test flow:
  a. Mock current time to 8 days before deadline
  b. User contributes → countdown banner shows (info state)
  c. Mock time to 12 hours before deadline
  d. Countdown banner shows (warning state)
  e. Mock time to AFTER deadline (11:46 AM UTC)
  f. Form locked, inputs disabled
  g. Verify error when trying to save
  h. Verify "Preview" button still works
- [ ] Test progressive warning states
- [ ] Use Playwright MCP for browser automation

## MCP Tools
- `mcp__playwright__browser_navigate`
- `mcp__playwright__browser_snapshot`
- `mcp__playwright__browser_wait_for`
- `mcp__playwright__browser_take_screenshot`
- `mcp__playwright__browser_console_messages`

## Testing
- Countdown timer displays correctly
- Progressive warning states work
- Form locks after deadline
- Clear error messages shown

## Files
- `tests/e2e/contribution-deadline.spec.ts` (new)

## Linear Updates
- Wait for ALL Phase 1+2 to be "Done" before starting
- Set status to "In Progress" when starting
- Add test results as comment when done
- Set status to "Done" when tests pass
