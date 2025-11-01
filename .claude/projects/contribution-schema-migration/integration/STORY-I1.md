# STORY-I1: E2E Test - Full Contribution Flow

**Linear**: [2S6-17](https://linear.app/2s6y/issue/2S6-17/story-i1-e2e-test-full-contribution-flow)
**Phase**: 3 (Integration)
**Agent**: Orchestrator
**Time**: 1 hour
**Priority**: P1 (Urgent)
**Dependencies**: ALL Phase 1+2 stories (B1-B6, F1-F6)

## Quick Summary
Create comprehensive E2E test for full contribution flow with flexible prompts.

## Tasks
- [ ] Create test file: `tests/e2e/contribution-flexible-prompts.spec.ts`
- [ ] Test flow:
  a. User logs in, navigates to contribute page
  b. Fetches active prompts (3-5 prompts)
  c. Fills text prompt → auto-saves
  d. Uploads media to PhotoWall → auto-saves
  e. Uploads audio file → auto-saves
  f. Verifies responses object saved correctly
  g. Switches group tabs → loads different prompts
  h. Previews → verifies all responses render
- [ ] Use Playwright MCP for browser automation
- [ ] Verify no console errors

## MCP Tools
- `mcp__playwright__browser_navigate`
- `mcp__playwright__browser_click`
- `mcp__playwright__browser_type`
- `mcp__playwright__browser_fill_form`
- `mcp__playwright__browser_wait_for`
- `mcp__playwright__browser_console_messages`
- `mcp__playwright__browser_take_screenshot`

## Testing
- All test steps pass
- Auto-save works for all prompt types
- responses object structure correct in database
- No console errors

## Files
- `tests/e2e/contribution-flexible-prompts.spec.ts` (new)

## Linear Updates
- Wait for ALL Phase 1+2 to be "Done" before starting
- Set status to "In Progress" when starting
- Add test results as comment when done
- Set status to "Done" when tests pass
