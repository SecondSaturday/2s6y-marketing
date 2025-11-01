# Contribution Reminders + Exclusion Logic - Story Tracker

**Linear Project**: [Contribution Reminders + Exclusion Logic](https://linear.app/2s6y/project/contribution-reminders-exclusion-logic-340c2e86ade5)
**Priority**: P1 (High)
**Estimated Total Time**: 11 hours
**Status**: NOT STARTED

---

## Overview

Implement automated reminder notifications (7d, 3d, 1d before deadline) and exclusion UI for members who don't contribute.

**Impact**: Without reminders, users forget to contribute. Without exclusion UI, excluded members see no explanation.

---

## Stories (4 total)

### Phase 1: Parallel Development (5 hours wall time)
| Story | Linear ID | Status | Time | Agent | Blocks |
|-------|-----------|--------|------|-------|--------|
| STORY-B1: Reminder Cron Jobs | 2S6-44 | ⬜ TODO | 3h | Backend | B2, I1 |
| STORY-F1: Exclusion Empty State UI | 2S6-46 | ⬜ TODO | 3h | Frontend | None |

### Phase 2: Sequential (BLOCKED by B1)
| Story | Linear ID | Status | Time | Agent | Blocks |
|-------|-----------|--------|------|-------|--------|
| STORY-B2: Reminder Email Templates | 2S6-45 | ⬜ BLOCKED | 2h | Backend | I1 |

### Phase 3: Integration (BLOCKED by all)
| Story | Linear ID | Status | Time | Agent | Blocks |
|-------|-----------|--------|------|-------|--------|
| STORY-I1: E2E Reminder Tests | 2S6-47 | ⬜ BLOCKED | 3h | Orchestrator | None |

---

## Quick Start

See [QUICK_START.md](./QUICK_START.md) for execution instructions.

---

**Last Updated**: 2025-10-22
**Linear Project ID**: c12d4fc9-91a9-4000-a8b0-2304b744b817
