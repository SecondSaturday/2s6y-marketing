# {Project Name}

> **Linear Project**: [View in Linear]({linear-project-url})
> **Project ID**: `{linear-project-id}`
> **Status**: Planning Complete - Ready for Execution
> **Created**: {YYYY-MM-DD}

---

## 📋 Project Overview

**Priority**: P0/P1/P2/P3 (choose one)
**Estimated Total**: X-Y hours
**Parallel Execution**: Yes/No
**Dependencies**: None / List dependencies

### Purpose

{1-2 paragraph description of what this project achieves and why it's important}

### Key Business Rules

- **Rule 1**: {Description}
- **Rule 2**: {Description}
- **Rule 3**: {Description}

---

## 🎯 Stories Breakdown (X Total)

### Phase 1: Backend Stories (Parallelizable - X hours)

| Story | Title | Time | Priority | Linear | Dependencies |
|-------|-------|------|----------|--------|--------------|
| **B1** | {Story Title} | Xh | P1 | [2S6-X]({linear-url}) | None |
| **B2** | {Story Title} | Xh | P2 | [2S6-X]({linear-url}) | B1 |

### Phase 1: Frontend Stories (Parallelizable - X hours)

| Story | Title | Time | Priority | Linear | Dependencies |
|-------|-------|------|----------|--------|--------------|
| **F1** | {Story Title} | Xh | P2 | [2S6-X]({linear-url}) | None |
| **F2** | {Story Title} | Xh | P3 | [2S6-X]({linear-url}) | None |

### Phase 2: Frontend Stories (Dependent - X hours)

| Story | Title | Time | Priority | Linear | Dependencies |
|-------|-------|------|----------|--------|--------------|
| **F3** | {Story Title} | Xh | P1 | [2S6-X]({linear-url}) | B1, B2 |

### Phase 3: Integration Stories (Sequential - X hours)

| Story | Title | Time | Priority | Linear | Dependencies |
|-------|-------|------|----------|--------|--------------|
| **I1** | {Story Title} | Xh | P1 | [2S6-X]({linear-url}) | ALL Phase 1+2 |

---

## 📊 Execution Timeline

### Time Savings with Parallel Execution

| Approach | Backend | Frontend | Integration | Total |
|----------|---------|----------|-------------|-------|
| **Sequential** | Xh | Yh | Zh | **Wh** |
| **Parallel (UEDS)** | Xh | Yh (parallel) + Zh (after backend) | Zh | **~Vh** |
| **Savings** | - | - | - | **X% faster** |

### Execution Phases

```
Phase 1 (Parallel) - X hours
├─ Backend Agent: B1 → B2 → ... (Xh)
└─ Frontend Agent: F1 + F2 (Yh, runs in parallel)

Phase 2 (Dependent) - X hours
└─ Frontend Agent: F3 + ... (Xh, starts after backend dependencies met)

Phase 3 (Integration) - X hours
└─ Orchestrator: I1 + I2 + ... (Xh, sequential)
```

---

## 🔗 Dependencies & Blocking

### Dependency Graph

```
B1 ─────────┐
            ├──→ B2 ──→ F3
F1 ──────────┤
            └──→ I1

ALL Phase 1+2 ────────────→ I2
```

### Critical Path

**{Longest dependency chain}** ({description of blocking path})

---

## 📝 Contracts Between Layers

### Backend Exposes

**{API Name}** (`{file path}`):
```typescript
{Function signature}
```

**{API Name}** (`{file path}`):
```typescript
{Function signature}
```

### Frontend Consumes

- **{Component Name}**: Fetches `{API}`, saves via `{API}`, checks `{API}`
- **{Component Name}**: Calls `{API}`, handles `{error cases}`

**For complete contracts**: See [`CONTRACTS.md`](./CONTRACTS.md)

---

## ✅ Acceptance Criteria

### Backend
- ✅ {Criterion 1}
- ✅ {Criterion 2}
- ✅ All backend unit tests pass (X+ tests)

### Frontend
- ✅ {Criterion 1}
- ✅ {Criterion 2}
- ✅ All visual tests pass at 3 breakpoints

### Integration
- ✅ {Criterion 1}
- ✅ {Criterion 2}
- ✅ No console errors or warnings

### Business Rules Verified
- ✅ {Business rule 1 verified}
- ✅ {Business rule 2 verified}

---

## 🚀 Execution Commands

See [`EXECUTION_GUIDE.md`](./EXECUTION_GUIDE.md) for detailed commands to run each story in parallel sessions.

---

## 📂 Project Structure

```
.claude/projects/{project-name}/
├── README.md (this file)
├── EXECUTION_GUIDE.md
├── CONTRACTS.md
├── backend/
│   ├── STORY-B1.md
│   ├── STORY-B2.md
│   └── ...
├── frontend/
│   ├── STORY-F1.md
│   ├── STORY-F2.md
│   └── ...
└── integration/
    ├── STORY-I1.md
    ├── STORY-I2.md
    └── ...
```

---

## 📊 Progress Tracking

**Primary**: Linear Project Dashboard
**URL**: {linear-project-url}

**Query Progress** (via Linear MCP):
```typescript
const issues = await mcp__linear-server__list_issues({
  project: "{project-id}"
})

const done = issues.filter(i => i.state === "Done").length
const total = issues.length
console.log(`Progress: ${done}/${total} (${Math.round(done/total*100)}%)`)
```

---

## 🎯 Next Steps - How to Execute

### Step 1: Review the Project
```bash
# Open the main README (you're here!)
# Review the Linear project
open {linear-project-url}
```

### Step 2: Understand the Execution Plan
```bash
# Read the execution guide (has all commands)
cat .claude/projects/{project-name}/EXECUTION_GUIDE.md

# Review the contracts
cat .claude/projects/{project-name}/CONTRACTS.md
```

### Step 3: Start Parallel Execution

**In 3 separate Claude Code sessions**:

**Session 1 - Backend Agent** (Xh):
```
{Copy execution command from EXECUTION_GUIDE.md}
```

**Session 2 - Frontend Agent** (Xh for Phase 1):
```
{Copy execution command from EXECUTION_GUIDE.md}
```

**Session 3 - Frontend Agent Phase 2 + Orchestrator** (Xh + Yh):
```
{Copy execution command from EXECUTION_GUIDE.md}
```

---

## 📝 Project Highlights

**Business Impact**:
- {Impact 1}
- {Impact 2}
- {Impact 3}

**Technical Excellence**:
- Contract-first development (no integration surprises)
- TDD enforced (unit tests + E2E tests + visual tests)
- MCP tools for enhanced capabilities
- Real-time Linear progress tracking
- X% time savings with parallel execution

**Framework Improvements** (if any):
- {Improvement 1}
- {Improvement 2}

---

**Last Updated**: {YYYY-MM-DD}
**Version**: {Framework version used}
