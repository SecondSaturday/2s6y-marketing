# STORY-B2: Date/Deadline Helpers

**Linear**: [2S6-6](https://linear.app/2s6y/issue/2S6-6/story-b2-datedeadline-helpers)
**Phase**: 1 (Parallel)
**Agent**: Backend Agent
**Time**: 1 hour
**Priority**: P2 (High)
**Dependencies**: None

## Quick Summary
Create utility functions for calculating deadlines and countdown timers.

## Tasks
- [ ] Create `lib/dateUtils.ts` with functions:
  - `getEditDeadline(month: string): number` - Returns 11:45 AM UTC on 2nd Saturday
  - `getTwoWeeksBeforeDeadline(month: string): number` - 2 weeks before deadline
  - `canEditByDeadline(deadline: number): boolean` - Check if before deadline
  - `formatCountdown(deadline: number): CountdownObject` - Format for timer UI
- [ ] Use existing `getSecondSaturday()` from `lib/utils.ts`
- [ ] Handle edge cases (month boundaries, leap years, UTC conversion)
- [ ] Create comprehensive unit tests (10+ test cases)

## Contract Output
See `CONTRACTS.md` Section 1 for exact signatures.

## Testing
- Unit test: All functions with edge cases
- Test: Dec→Jan, leap years, exact deadline time

## Files
- `lib/dateUtils.ts` (new)
- `tests/unit/dateUtils.test.ts` (new)

## Linear Updates
- Set status to "In Progress" when starting
- Add test results as comment when done
- Set status to "Done" when tests pass
