# Story Index - Group Settings & Roles

**Total Stories:** 28
**Estimated Time:** 28-56 hours of work (5-10 hours real-time with 6 parallel sessions)
**Last Updated:** 2025-01-10

---

## 📋 All Stories by Track

### 🔧 Foundation (1 story - BLOCKING)
- [**STORY-000**](./foundation/STORY-000-foundation.md) - Foundation Setup ⚠️ **BLOCKS ALL OTHER STORIES**
  - Time: 1-2 hours | Agent: Orchestrator
  - Sets up testing infrastructure (convex-test, Playwright fixtures, Resend)

---

### 🗄️ Track A: Database & Backend (6 stories)
- [**STORY-A1**](./track-a-backend/STORY-A1-schema-migration.md) - Schema Migration
  - Time: 1-2 hours | Agent: backend-dev
  - Dependencies: STORY-000
  - Creates 5 new tables, migration script, dual-write logic

- [**STORY-A2**](./track-a-backend/story-a2.md) - Role Helper Functions
  - Time: 1 hour | Agent: backend-dev
  - Dependencies: STORY-A1
  - **CRITICAL**: Blocks all other backend stories (A3-A6)

- [**STORY-A3**](./track-a-backend/story-a3.md) - Invite System Backend
  - Time: 1-2 hours | Agent: backend-dev
  - Dependencies: STORY-A2

- [**STORY-A4**](./track-a-backend/story-a4.md) - Join Request System Backend
  - Time: 1-2 hours | Agent: backend-dev
  - Dependencies: STORY-A2

- [**STORY-A5**](./track-a-backend/story-a5.md) - Member Actions Backend
  - Time: 1-2 hours | Agent: backend-dev
  - Dependencies: STORY-A2

- [**STORY-A6**](./track-a-backend/story-a6.md) - Prompts & Appearance Backend
  - Time: 1-2 hours | Agent: backend-dev
  - Dependencies: STORY-A2

---

### 🎨 Track B: UI Foundation (4 stories)
- [**STORY-B1**](./track-b-ui-foundation/story-b1.md) - Settings Page Scaffold
  - Time: 1 hour | Agent: frontend-dev
  - Dependencies: STORY-000
  - Creates tab layout (General + Prompts)

- [**STORY-B2**](./track-b-ui-foundation/story-b2.md) - General Settings Tab Structure
  - Time: 1 hour | Agent: frontend-dev
  - Dependencies: STORY-B1
  - **CRITICAL**: Blocks all Track C stories (C1-C7)

- [**STORY-B3**](./track-b-ui-foundation/story-b3.md) - Prompts Settings Tab Structure
  - Time: 1 hour | Agent: frontend-dev
  - Dependencies: STORY-B1
  - **CRITICAL**: Blocks all Track D stories (D1-D4)

- [**STORY-B4**](./track-b-ui-foundation/story-b4.md) - Shared Components
  - Time: 1-2 hours | Agent: frontend-dev
  - Dependencies: STORY-000
  - Creates: MemberCard, RoleBadge, ConfirmModal, LoadingState

---

### 👥 Track C: Member Management UI (8 stories)
- [**STORY-C1**](./track-c-member-ui/story-c1.md) - Group Info Section
  - Time: 1 hour | Agent: frontend-dev
  - Dependencies: STORY-B2

- [**STORY-C2**](./track-c-member-ui/story-c2.md) - Appearance Section
  - Time: 1-2 hours | Agent: frontend-dev
  - Dependencies: STORY-A6, STORY-B2

- [**STORY-C3**](./track-c-member-ui/story-c3.md) - Member List Section
  - Time: 1-2 hours | Agent: frontend-dev
  - Dependencies: STORY-A5, STORY-B4

- [**STORY-C4**](./track-c-member-ui/story-c4.md) - Invite Section
  - Time: 1-2 hours | Agent: frontend-dev
  - Dependencies: STORY-A3, STORY-B2

- [**STORY-C5**](./track-c-member-ui/story-c5.md) - Join Requests Panel
  - Time: 1-2 hours | Agent: frontend-dev
  - Dependencies: STORY-A4, STORY-B2

- [**STORY-C6**](./track-c-member-ui/story-c6.md) - Blocked Users Section
  - Time: 1 hour | Agent: frontend-dev
  - Dependencies: STORY-A5, STORY-B2

- [**STORY-C7**](./track-c-member-ui/story-c7.md) - Leave Group Section
  - Time: 1-2 hours | Agent: frontend-dev
  - Dependencies: STORY-A5, STORY-B2

- [**STORY-C8**](./track-c-member-ui/story-c8.md) - Transfer Admin Modal
  - Time: 1 hour | Agent: frontend-dev
  - Dependencies: STORY-A5, STORY-B4

---

### ⚙️ Track D: Prompts & Appearance UI (4 stories)
- [**STORY-D1**](./track-d-prompts/story-d1.md) - Prompt List Component
  - Time: 1-2 hours | Agent: frontend-dev
  - Dependencies: STORY-B3, STORY-A6
  - **CRITICAL**: Blocks D2, D3

- [**STORY-D2**](./track-d-prompts/story-d2.md) - Drag-and-Drop Reorder
  - Time: 1-2 hours | Agent: frontend-dev
  - Dependencies: STORY-D1

- [**STORY-D3**](./track-d-prompts/story-d3.md) - Add Prompt Button
  - Time: 1 hour | Agent: frontend-dev
  - Dependencies: STORY-D1

- [**STORY-D4**](./track-d-prompts/story-d4.md) - Prompt Preview Panel
  - Time: 1 hour | Agent: frontend-dev
  - Dependencies: STORY-D1

---

### 📧 Track E: Notifications & Email (3 stories)
- [**STORY-E1**](./track-e-notifications/story-e1.md) - In-App Notifications
  - Time: 1-2 hours | Agent: backend-dev
  - Dependencies: STORY-A3, STORY-A4, STORY-A5

- [**STORY-E2**](./track-e-notifications/story-e2.md) - Email Templates
  - Time: 1-2 hours | Agent: frontend-dev
  - Dependencies: STORY-000

- [**STORY-E3**](./track-e-notifications/story-e3.md) - Email Integration
  - Time: 1-2 hours | Agent: backend-dev
  - Dependencies: STORY-E1, STORY-E2

---

### 🔗 Track F: Integration & Polish (3 stories - SEQUENTIAL)
- [**STORY-F1**](./track-f-integration/story-f1.md) - End-to-End Integration Tests
  - Time: 2 hours | Agent: orchestrator
  - Dependencies: ALL previous stories (A1-E3)

- [**STORY-F2**](./track-f-integration/story-f2.md) - Performance & Optimization
  - Time: 1-2 hours | Agent: frontend-dev
  - Dependencies: STORY-F1

- [**STORY-F3**](./track-f-integration/story-f3.md) - Documentation & Cleanup
  - Time: 1 hour | Agent: orchestrator
  - Dependencies: STORY-F2

---

## 📊 Dependency Graph (ASCII Visualization)

```
STORY-000 (Foundation) ⚠️ BLOCKING
    ├─→ STORY-A1 (Schema Migration)
    │      └─→ STORY-A2 (Role Helpers) 🔑 CRITICAL
    │             ├─→ STORY-A3 (Invites Backend)
    │             ├─→ STORY-A4 (Join Requests Backend)
    │             ├─→ STORY-A5 (Member Actions Backend)
    │             └─→ STORY-A6 (Prompts/Appearance Backend)
    │
    ├─→ STORY-B1 (Settings Scaffold)
    │      ├─→ STORY-B2 (General Tab) 🔑 CRITICAL
    │      │      ├─→ STORY-C1 (Group Info)
    │      │      ├─→ STORY-C4 (Invite UI) ← needs A3
    │      │      ├─→ STORY-C5 (Join Requests UI) ← needs A4
    │      │      ├─→ STORY-C6 (Blocked Users) ← needs A5
    │      │      └─→ STORY-C7 (Leave Group) ← needs A5
    │      │
    │      └─→ STORY-B3 (Prompts Tab) 🔑 CRITICAL
    │             └─→ STORY-D1 (Prompt List) ← needs A6
    │                    ├─→ STORY-D2 (Drag-Drop)
    │                    ├─→ STORY-D3 (Add Prompt)
    │                    └─→ STORY-D4 (Preview)
    │
    ├─→ STORY-B4 (Shared Components)
    │      ├─→ STORY-C3 (Member List) ← needs A5
    │      └─→ STORY-C8 (Transfer Admin) ← needs A5
    │
    ├─→ STORY-C2 (Appearance UI) ← needs A6, B2
    │
    ├─→ STORY-E1 (Notifications) ← needs A3, A4, A5
    ├─→ STORY-E2 (Email Templates)
    └─→ STORY-E3 (Email Integration) ← needs E1, E2

ALL ABOVE
    └─→ STORY-F1 (E2E Tests)
           └─→ STORY-F2 (Performance)
                  └─→ STORY-F3 (Documentation)
```

---

## 🎯 Parallel Execution Groups

### **Group 1: Foundation** (Sequential - must complete first)
```
STORY-000 ⚠️
```
**Time:** 1-2 hours
**Who:** Main orchestrator session

---

### **Group 2: Initial Parallel Blast** (Can start immediately after Group 1)
```
Session 1 (backend-dev):  STORY-A1
Session 2 (frontend-dev): STORY-B1
Session 3 (frontend-dev): STORY-B4
```
**Time:** 1-2 hours
**Parallelism:** 3 sessions

---

### **Group 3: Backend Foundation** (After A1 complete)
```
Session 1 (backend-dev): STORY-A2 🔑 CRITICAL
```
**Time:** 1 hour
**Note:** This blocks all other backend work

---

### **Group 4: Maximum Parallelism** (After A2, B1, B2, B3 complete)
```
Session 1 (backend-dev):  STORY-A3 → A4 → A5 → A6 (sequential in 1 session)
Session 2 (frontend-dev): STORY-C1 → C4 → C5 (sequential in 1 session)
Session 3 (frontend-dev): STORY-C2 → C6 → C7 (sequential in 1 session)
Session 4 (frontend-dev): STORY-C3 → C8 (sequential in 1 session)
Session 5 (frontend-dev): STORY-D1 → D2 → D3 → D4 (sequential in 1 session)
Session 6 (backend-dev):  STORY-E1 → E3 (sequential in 1 session)
Session 7 (frontend-dev): STORY-E2 (standalone)
```
**Time:** 3-5 hours
**Parallelism:** 6-7 sessions running simultaneously

---

### **Group 5: Integration** (After all above complete)
```
Session 1 (orchestrator): STORY-F1 → F2 → F3 (sequential)
```
**Time:** 3-4 hours
**Parallelism:** 1 session (sequential tasks)

---

## 🚦 Critical Path (Longest Dependency Chain)

```
STORY-000 (2h)
  → STORY-A1 (2h)
    → STORY-A2 (1h)
      → STORY-A6 (2h)
        → STORY-B3 (1h)
          → STORY-D1 (2h)
            → STORY-D2 (2h)
              → STORY-F1 (2h)
                → STORY-F2 (2h)
                  → STORY-F3 (1h)
```
**Total Critical Path:** ~17 hours

With 6 parallel sessions, **real-time estimate: 5-8 hours**

---

## 📈 Progress Tracking

**View live progress:** `.claude/stories/STORY_TRACKER.md`
**View ready stories:** `.claude/stories/STORY_QUEUE.md`

**Velocity Calculation:**
- Average story time: 1.2 hours (actual)
- Parallelism factor: 6 sessions
- Coordination overhead: 15%
- **Realistic completion:** 6-10 hours

---

## 🎓 How to Use This Index

### For Orchestrator Sessions:
```
Read .claude/stories/STORY_INDEX.md to understand dependencies.
Launch parallel sessions for all stories in Group 2.
Monitor progress and launch Group 3 when ready.
```

### For Individual Agent Sessions:
```
You are working on STORY-A3.
Read: .claude/stories/track-a-backend/story-a3.md
Check dependencies are met in STORY_TRACKER.md.
Execute the story and update tracker when done.
```

### For Monitoring Progress:
```bash
# Run monitor dashboard
npm run monitor

# Or manually check
cat .claude/stories/STORY_TRACKER.md
```

---

**Last Updated:** 2025-01-10
**Maintained By:** Orchestration System
**Total Estimated Cost:** $0 (all free tier tools)
