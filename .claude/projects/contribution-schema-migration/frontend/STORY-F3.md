# STORY-F3: Deadline Banner + Warning Stages

**Linear**: [2S6-13](https://linear.app/2s6y/issue/2S6-13/story-f3-deadline-banner-warning-stages)
**Phase**: 2 (Dependent)
**Agent**: Frontend Agent
**Time**: 1 hour
**Priority**: P2 (High)
**Dependencies**: B3 (Contributions Mutations), F2 (Countdown Timer)

## Quick Summary
Add countdown banner to contribution page with progressive warning stages.

## Tasks
- [ ] Add `<CountdownTimer>` to `app/contribute/page.tsx`:
  - Show banner when <7 days to deadline
  - Position: Top of page (above group tabs)
  - Style: Subtle, non-intrusive (alert alert-info / alert-warning)
  - Text: "Contributions lock in [countdown]. Submit your responses!"
  - Hide banner if deadline passed
- [ ] Progressive states:
  - 7+ days: No banner shown
  - 2-7 days: Info banner (alert-info)
  - <24 hours: Warning banner (alert-warning)
  - Expired: Error banner (alert-error)
- [ ] Responsive design (stack on mobile)
- [ ] Create visual tests at 3 breakpoints

## Contract Input
`contribution.editDeadline` from B3

## Testing
- Visual test: Desktop - info state (5 days left)
- Visual test: Tablet - warning state (12 hours left)
- Visual test: Mobile - error state (expired)

## Files
- `app/contribute/page.tsx`
- `tests/visual/deadline-banner.spec.ts` (new)

## Linear Updates
- Wait for B3, F2 to be "Done" before starting
- Set status to "In Progress" when starting
- Add test results as comment when done
- Set status to "Done" when tests pass
