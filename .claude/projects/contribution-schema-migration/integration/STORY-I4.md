# STORY-I4: Visual Tests - Countdown Timer

**Linear**: [2S6-20](https://linear.app/2s6y/issue/2S6-20/story-i4-visual-tests-countdown-timer)
**Phase**: 3 (Integration)
**Agent**: Orchestrator
**Time**: 0.5 hours
**Priority**: P3 (Medium)
**Dependencies**: F2 (Countdown Timer), F3 (Deadline Banner)

## Quick Summary
Create visual regression tests for countdown timer at all breakpoints and states.

## Tasks
- [ ] Create test file: `tests/visual/countdown-timer.spec.ts`
- [ ] Capture screenshots at 3 breakpoints:
  - Desktop (1440x900): Timer in banner (info state)
  - Tablet (768x1024): Timer in banner (warning state)
  - Mobile (375x667): Timer in banner (expired state)
- [ ] Test all timer states:
  - Info state (7+ days remaining)
  - Warning state (<24 hours)
  - Error state (expired)
- [ ] Use Playwright MCP for screenshots

## MCP Tools
- `mcp__playwright__browser_navigate`
- `mcp__playwright__browser_resize`
- `mcp__playwright__browser_take_screenshot`
- `mcp__playwright__browser_snapshot`

## Testing
- Screenshots captured at all 3 breakpoints
- All 3 timer states tested
- No layout issues or overflow
- Colors match DaisyUI theme

## Files
- `tests/visual/countdown-timer.spec.ts` (new)
- `tests/visual/countdown-timer.spec.ts-snapshots/` (screenshots)

## Linear Updates
- Wait for F2, F3 to be "Done" before starting
- Set status to "In Progress" when starting
- Add test results as comment when done
- Set status to "Done" when tests pass
