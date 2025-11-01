# Deadline Enforcement - Story Tracker

**Linear Project**: [Deadline Enforcement](https://linear.app/2s6y/project/deadline-enforcement-4486c62c1388)
**Priority**: P0 (Blocker)
**Estimated Total Time**: 2.5 hours
**Status**: NOT STARTED

---

## Overview

Enable contribution deadline enforcement that blocks edits after the day before 2nd Saturday at 11:59 PM. Currently stubbed with `isLocked = false` hardcoded.

**MVP Blocker**: Users can edit contributions indefinitely with no deadline protection.

---

## Stories (2 total)

### ✅ Parallelizable Stories (Run both simultaneously)

| Story | Linear ID | Status | Time | Agent | Blocks |
|-------|-----------|--------|------|-------|--------|
| STORY-B1: Deadline Calculation + canEdit Query | 2S6-35 | ⬜ TODO | 1.5h | Backend | None |
| STORY-F1: Lock UI After Deadline | 2S6-38 | ⬜ TODO | 1h | Frontend | None |

---

## Execution Strategy

### Parallel Development (1.5 hours wall time)

```bash
# Terminal 1: STORY-B1 (Backend)
claude --session b1-deadline

# Terminal 2: STORY-F1 (Frontend)
claude --session f1-ui-lock
```

**Expected Output**:
- Backend: `canEdit` query, deadline calculation helpers, validation in mutations
- Frontend: Locked UI state, formatted deadline messages, disabled form inputs
- Tests: 6 unit tests (backend) + 4 E2E tests (frontend)

---

## Dependencies

**External**:
- Contribution schema already has `editDeadline` field (✅ exists)
- Countdown timer component already exists (✅ implemented)

**Internal**:
- Both stories can run in parallel (no blocking dependencies)

---

## Acceptance Criteria

### Backend (STORY-B1)
- [ ] `canEdit` query returns correct state (canEdit, reason, deadline)
- [ ] `createOrUpdate` blocks edits after deadline with ConvexError
- [ ] `submit` blocks submission after deadline with ConvexError
- [ ] `editDeadline` calculated correctly (day before 2nd Saturday at 11:59 PM)
- [ ] All 6 unit tests passing
- [ ] Error messages include formatted deadline date

### Frontend (STORY-F1)
- [ ] Hardcoded `isLocked = false` removed
- [ ] `canEdit` query called when contributionId exists
- [ ] Form locked (inputs disabled) when canEdit returns false
- [ ] Locked banner shows formatted deadline date
- [ ] Save attempts after deadline show error toast with date
- [ ] Backend errors (DEADLINE_PASSED) displayed correctly
- [ ] PhotoWall respects disabled prop
- [ ] All 4 E2E tests passing

---

## Quick Start

See [QUICK_START.md](./QUICK_START.md) for detailed execution instructions.

---

**Last Updated**: 2025-10-22
**Linear Project ID**: f6ae4a8b-c95d-46b6-9fbc-051d03c3229c
