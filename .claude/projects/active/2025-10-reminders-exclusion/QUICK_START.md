# Contribution Reminders + Exclusion Logic - Quick Start Guide

**Project**: Contribution Reminders + Exclusion Logic
**Linear**: https://linear.app/2s6y/project/contribution-reminders-exclusion-logic-340c2e86ade5
**Total Time**: 11 hours (5h parallel + 2h sequential + 3h integration + 1h buffer)

---

## Execution Strategy

### Phase 1: Parallel (5 hours wall time)
```bash
# Terminal 1: STORY-B1 (Reminder Cron Jobs)
"Implement STORY-B1 (2S6-44): Create 3 cron jobs (7d/3d/1d reminders) with backend-dev agent"

# Terminal 2: STORY-F1 (Exclusion Empty State) - START SIMULTANEOUSLY
"Implement STORY-F1 (2S6-46): Create exclusion empty state UI with frontend-dev agent"
```

### Phase 2: Sequential (2 hours - AFTER B1)
```bash
"Implement STORY-B2 (2S6-45): Create reminder email templates with backend-dev agent"
```

### Phase 3: Integration (3 hours - AFTER ALL)
```bash
"Implement STORY-I1 (2S6-47): E2E reminder tests + exclusion notifications with orchestrator agent"
```

---

## Story Details

### STORY-B1: Reminder Cron Jobs (3h)
**Files**: `convex/crons/*.ts`
**What**: 3 cron jobs that send reminders at 7d/3d/1d before deadline
**Success**: Crons in dashboard, notifications created for non-contributors

### STORY-B2: Reminder Email Templates (2h - BLOCKED BY B1)
**Files**: `emails/ReminderEmail.tsx`, notification watcher
**What**: Email template + Resend integration
**Success**: Real reminder emails sent via Resend

### STORY-F1: Exclusion Empty State UI (3h)
**Files**: `components/ExclusionEmptyState.tsx`
**What**: Show excluded users why they weren't included
**Success**: Empty state displays when user in excludedMemberIds

### STORY-I1: E2E Tests + Exclusion Notifications (3h - BLOCKED BY ALL)
**Files**: `tests/e2e/reminders.spec.ts`, exclusion notification logic
**What**: Verify reminders work, send exclusion notifications
**Success**: All E2E tests passing, excluded users notified

---

**See individual story files for detailed implementations.**
