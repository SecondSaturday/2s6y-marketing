# Contribution Schema Migration + Deadline Enforcement

> **Linear Project**: [View in Linear](https://linear.app/2s6y/project/contribution-schema-migration-deadline-enforcement-56f82b35abf3)
> **Project ID**: `a7f07c4b-4166-47ef-906b-d372b87f0801`
> **Status**: Planning Complete - Ready for Execution
> **Created**: 2025-10-13

---

## 📋 Project Overview

**Priority**: P0 (Blocker)
**Estimated Total**: 10-12 hours
**Parallel Execution**: Yes (Backend + Frontend in parallel)
**Dependencies**: None (standalone project)

### Purpose

Migrate contributions from hardcoded `prompt1-5` fields to flexible `responses` object, implement edit deadlines (11:45 AM UTC on 2nd Saturday), enforce 2-week prompt change cutoff, and build countdown timer UI.

### Key Business Rules

- **Newsletter sends**: 2nd Saturday 12PM UTC (worldwide)
- **Contribution deadline**: 2nd Saturday 11:45 AM UTC (15 min buffer)
- **Contribution period**: Opens immediately after newsletter sends
- **Prompt deletion**: Blocked if <2 weeks to deadline AND responses exist
- **Partial submissions**: Allowed (min 1 response), users can edit until deadline
- **All groups use same schedule** (no per-group customization)

---

## 🎯 Stories Breakdown (16 Total)

### Phase 1: Backend Stories (Parallelizable - 6 hours)

| Story | Title | Time | Priority | Linear | Dependencies |
|-------|-------|------|----------|--------|--------------|
| **B1** | Schema Migration | 1.5h | P1 | [2S6-5](https://linear.app/2s6y/issue/2S6-5) | None |
| **B2** | Date/Deadline Helpers | 1h | P2 | [2S6-6](https://linear.app/2s6y/issue/2S6-6) | None |
| **B3** | Update Contributions Mutations | 1.5h | P1 | [2S6-7](https://linear.app/2s6y/issue/2S6-7) | B1, B2 |
| **B4** | Deadline Enforcement | 1h | P1 | [2S6-8](https://linear.app/2s6y/issue/2S6-8) | B3 |
| **B5** | Group Prompts Mutations | 1h | P2 | [2S6-9](https://linear.app/2s6y/issue/2S6-9) | B2 |
| **B6** | User Notifications for Prompt Deletion | 1h | P3 | [2S6-10](https://linear.app/2s6y/issue/2S6-10) | B5 |

### Phase 1: Frontend Stories (Parallelizable - 2.5 hours)

| Story | Title | Time | Priority | Linear | Dependencies |
|-------|-------|------|----------|--------|--------------|
| **F2** | Countdown Timer Component | 1.5h | P2 | [2S6-12](https://linear.app/2s6y/issue/2S6-12) | None |
| **F5** | Audio Upload Component | 1h | P3 | [2S6-15](https://linear.app/2s6y/issue/2S6-15) | None |

### Phase 2: Frontend Stories (Dependent - 4.5 hours)

| Story | Title | Time | Priority | Linear | Dependencies |
|-------|-------|------|----------|--------|--------------|
| **F1** | Dynamic Contribution Form | 2h | P1 | [2S6-11](https://linear.app/2s6y/issue/2S6-11) | B3, B5 |
| **F3** | Deadline Banner + Warning Stages | 1h | P2 | [2S6-13](https://linear.app/2s6y/issue/2S6-13) | B3, F2 |
| **F4** | Read-Only View After Deadline | 0.5h | P2 | [2S6-14](https://linear.app/2s6y/issue/2S6-14) | B4 |
| **F6** | Admin Prompt Deletion Confirmation | 1h | P3 | [2S6-16](https://linear.app/2s6y/issue/2S6-16) | B5 |

### Phase 3: Integration Stories (Sequential - 3 hours)

| Story | Title | Time | Priority | Linear | Dependencies |
|-------|-------|------|----------|--------|--------------|
| **I1** | E2E Test - Full Contribution Flow | 1h | P1 | [2S6-17](https://linear.app/2s6y/issue/2S6-17) | ALL Phase 1+2 |
| **I2** | E2E Test - Deadline Enforcement | 1h | P1 | [2S6-18](https://linear.app/2s6y/issue/2S6-18) | ALL Phase 1+2 |
| **I3** | E2E Test - Prompt Deletion with 2-Week Rule | 0.5h | P2 | [2S6-19](https://linear.app/2s6y/issue/2S6-19) | ALL Phase 1+2 |
| **I4** | Visual Tests - Countdown Timer | 0.5h | P3 | [2S6-20](https://linear.app/2s6y/issue/2S6-20) | F2, F3 |

---

## 📊 Execution Timeline

### Time Savings with Parallel Execution

| Approach | Backend | Frontend | Integration | Total |
|----------|---------|----------|-------------|-------|
| **Sequential** | 6h | 7h | 3h | **16h** |
| **Parallel (UEDS)** | 6h | 2.5h (parallel) + 4.5h (after backend) | 3h | **~11h** |
| **Savings** | - | - | - | **31% faster** |

### Execution Phases

```
Phase 1 (Parallel) - 6 hours
├─ Backend Agent: B1 → B2 → B3 → B4 → B5 → B6 (6h)
└─ Frontend Agent: F2 + F5 (2.5h, runs in parallel)

Phase 2 (Dependent) - 4.5 hours
└─ Frontend Agent: F1 + F3 + F4 + F6 (4.5h, starts after B3/B4/B5 complete)

Phase 3 (Integration) - 3 hours
└─ Orchestrator: I1 + I2 + I3 + I4 (3h, sequential)
```

---

## 🔗 Dependencies & Blocking

### Dependency Graph

```
B1 (Schema) ─────────┐
                     ├──→ B3 (Mutations) ──→ B4 (Deadline) ──→ F4 (Read-Only)
B2 (Date Helpers) ───┤                    └──→ F3 (Banner)
                     │                    └──→ F1 (Dynamic Form)
                     └──→ B5 (Prompts) ──→ B6 (Notifications)
                                        └──→ F6 (Deletion Modal)

F2 (Timer) ──────────────→ F3 (Banner)
F5 (Audio) ──────────────→ F1 (Dynamic Form)

ALL Phase 1+2 ────────────→ I1, I2, I3 (E2E Tests)
F2 + F3 ──────────────────→ I4 (Visual Tests)
```

### Critical Path

**B1 → B2 → B3 → F1 → I1** (longest path = ~5.5 hours with dependencies)

---

## 📝 Contracts Between Layers

### Backend Exposes

**Date Utilities** (`lib/dateUtils.ts`):
```typescript
export function getEditDeadline(month: string): number
export function getTwoWeeksBeforeDeadline(month: string): number
export function canEditByDeadline(deadline: number): boolean
export function formatCountdown(deadline: number): CountdownObject
```

**Contributions API** (`convex/contributions.ts`):
```typescript
createOrUpdate({
  groupId: Id<"groups">,
  month: string,
  responses: Record<string, ResponseValue>
}) => Id<"contributions">

canEdit({
  contributionId: Id<"contributions">
}) => {
  canEdit: boolean,
  deadline: number,
  message?: string
}
```

**Group Prompts API** (`convex/groupPrompts.ts`):
```typescript
getActivePrompts({ groupId: Id<"groups"> }) => Array<GroupPrompt>

deletePrompt({ promptId: Id<"groupPrompts"> }) => {
  success: boolean,
  deletedResponseCount?: number
}
```

### Frontend Consumes

- **Dynamic Form**: Fetches `getActivePrompts`, saves via `createOrUpdate`, checks `canEdit`
- **Countdown Timer**: Receives `deadline` from contribution record, displays formatted countdown
- **Admin UI**: Calls `deletePrompt`, handles confirmation/errors

---

## ✅ Acceptance Criteria

### Backend
- ✅ Schema updated: `responses` object replaces `prompt1-5`
- ✅ All contributions have `editDeadline` calculated on creation
- ✅ `canEdit` query correctly enforces deadline
- ✅ `createOrUpdate` blocks edits after deadline
- ✅ Prompt deletion blocked if <2 weeks + responses exist
- ✅ Notifications sent to affected users on prompt deletion
- ✅ All backend unit tests pass (15+ tests)

### Frontend
- ✅ Contribution form renders 3-5 prompts dynamically
- ✅ Form supports text, media, and audio prompt types
- ✅ Countdown timer shows in last 7 days (flip clock style)
- ✅ Progressive warnings (info → warning → error)
- ✅ Form locked after deadline (read-only view)
- ✅ Admin sees confirmation before deleting prompt with responses
- ✅ All visual tests pass at 3 breakpoints

### Integration
- ✅ E2E test: Full contribution flow works end-to-end
- ✅ E2E test: Deadline enforcement works (countdown → lock)
- ✅ E2E test: 2-week prompt deletion rule enforced
- ✅ No console errors or warnings
- ✅ Auto-save still works (10-second debounce)

---

## 🚀 Execution Commands

See [`EXECUTION_GUIDE.md`](./EXECUTION_GUIDE.md) for detailed commands to run each story in parallel sessions.

---

## 📂 Project Structure

```
.claude/projects/contribution-schema-migration/
├── README.md (this file)
├── EXECUTION_GUIDE.md
├── CONTRACTS.md
├── backend/
│   ├── STORY-B1.md
│   ├── STORY-B2.md
│   ├── STORY-B3.md
│   ├── STORY-B4.md
│   ├── STORY-B5.md
│   └── STORY-B6.md
├── frontend/
│   ├── STORY-F1.md
│   ├── STORY-F2.md
│   ├── STORY-F3.md
│   ├── STORY-F4.md
│   ├── STORY-F5.md
│   └── STORY-F6.md
└── integration/
    ├── STORY-I1.md
    ├── STORY-I2.md
    ├── STORY-I3.md
    └── STORY-I4.md
```

---

## 📊 Progress Tracking

**Primary**: Linear Project Dashboard
**URL**: https://linear.app/2s6y/project/contribution-schema-migration-deadline-enforcement-56f82b35abf3

**Query Progress** (via Linear MCP):
```typescript
const issues = await mcp__linear-server__list_issues({
  project: "a7f07c4b-4166-47ef-906b-d372b87f0801"
})

const done = issues.filter(i => i.state === "Done").length
const total = issues.length
console.log(`Progress: ${done}/${total} (${Math.round(done/total*100)}%)`)
```

---

## 🎯 Next Steps

1. **Review this README** - Ensure all stories and dependencies are clear
2. **Open Linear Project** - Familiarize yourself with the dashboard
3. **Read EXECUTION_GUIDE.md** - Get commands for parallel session execution
4. **Read CONTRACTS.md** - Understand API contracts between layers
5. **Start Phase 1** - Launch Backend Agent + Frontend Agent in parallel

---

## 📞 Support

**Questions?** Ask in the main Claude session.
**Issues?** Update Linear issue status and add comments.
**Blocked?** Check dependency graph and ensure prerequisite stories are complete.

---

**Last Updated**: 2025-10-13
**Framework Version**: v1.4.0 (MCP Server Integration + Linear UEDS)
