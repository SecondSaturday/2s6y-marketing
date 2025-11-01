# STORY-F2: Countdown Timer Component

**Linear**: [2S6-12](https://linear.app/2s6y/issue/2S6-12/story-f2-countdown-timer-component)
**Phase**: 1 (Parallel)
**Agent**: Frontend Agent
**Time**: 1.5 hours
**Priority**: P2 (High)
**Dependencies**: None

## Quick Summary
Create reusable countdown timer component with progressive warning states.

## Tasks
- [ ] Create `components/forms/CountdownTimer.tsx`:
  - Props: `deadline: number`, `variant: "banner" | "inline"`, `onExpire: () => void`
  - Display: "X days, X hours, X minutes, X seconds remaining"
  - Style: Flip clock animation (CSS transitions or framer-motion)
  - Update every second (useEffect + setInterval)
  - Progressive warning states:
    - 7+ days: Info color (`base-content/70`)
    - <24 hours: Warning color (`warning`)
    - Expired: Error color (`error`)
  - Call `onExpire()` when timer hits zero
- [ ] Clean up interval on unmount
- [ ] Create visual tests at 3 breakpoints
- [ ] Create unit tests

## Contract Output
See `CONTRACTS.md` Section "Countdown Timer Component" for props interface.

## Testing
- Visual test: Desktop - info state
- Visual test: Tablet - warning state
- Visual test: Mobile - error state
- Unit test: Time calculations
- Unit test: onExpire callback

## Files
- `components/forms/CountdownTimer.tsx` (new)
- `tests/visual/countdown-timer.spec.ts` (new)
- `tests/unit/countdown-timer.test.ts` (new)

## Linear Updates
- Set status to "In Progress" when starting
- Add test results as comment when done
- Set status to "Done" when tests pass
