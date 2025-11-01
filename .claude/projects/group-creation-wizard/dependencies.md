# Group Creation Wizard - Dependency Graph

**Project:** Group Creation Wizard
**Last Updated:** 2025-10-11

---

## Execution Phases

### Phase 1: Foundation (Parallel, 1 hour)
**No dependencies - can run simultaneously**

```
[A1: Schema Extension] ──────────┐
                                  │
[C1: Wizard Shell] ──────────────┤
                                  │
                              (Complete)
```

- **A1** (Backend): Extend groupPrompts schema with `promptType` ✅ **COMPLETE**
- **C1** (Frontend): Create wizard shell + context

---

### Phase 2: Core Implementation (Parallel, 1.5 hours)

```
[A1 ✅] ──> [A2: Batch Mutation] ──────┐
                                        │
[C1] ──> [C2: Basic Info UI] ──────────┤
                                        │
[C1] ──> [C3: Appearance UI] ──────────┤
                                        │
                                   (Complete)
```

- **A2** (Backend): Create `createGroupWithSettings` mutation (depends on A1 ✅)
- **C2** (Frontend): Build Step 1 UI (depends on C1)
- **C3** (Frontend): Build Step 2 UI (depends on C1)

---

### Phase 3: Advanced Features (Parallel, 1.5 hours)

```
[C1] + [A1 ✅] ──> [C4: Prompts UI] ────────┐
                                              │
[C1] ──> [C5: Members UI] ──────────────────┤
                                              │
[A2] + [C2] ──> [B1: Wire Basic Info] ─────┤
                                              │
[C3] ──> [B2: Wire Appearance] ─────────────┤
                                              │
                                        (Complete)
```

- **C4** (Frontend): Build Step 3 UI (depends on C1, A1 ✅)
- **C5** (Frontend): Build Step 4 UI (depends on C1)
- **B1** (Integration): Wire Step 1 (depends on A2, C2)
- **B2** (Integration): Wire Step 2 (depends on C3)

---

### Phase 4: Integration & Testing (Sequential, 1 hour)

```
[A1 ✅] + [A2] + [C4] ──> [B3: Wire Prompts] ───┐
                                                  │
[C5] ──> [B4: Wire Members] ────────────────────┤
                                                  │
[C1] ──> [B5: State Management] ────────────────┤
                                                  │
[B1] + [B2] + [B3] + [B4] + [B5] ──> [B6: E2E Tests]
                                                  │
                                            (Complete)
```

- **B3** (Integration): Wire Step 3 (depends on A1 ✅, A2, C4)
- **B4** (Integration): Wire Step 4 (depends on C5)
- **B5** (Integration): State management (depends on C1)
- **B6** (Integration): E2E tests (depends on B1-B5)

---

## Full Dependency Tree

```
Phase 1 (Parallel)
├─ A1: Schema Extension ✅ COMPLETE
│   └─> A2 (Phase 2)
│   └─> C4 (Phase 3)
│   └─> B3 (Phase 4)
│
└─ C1: Wizard Shell
    └─> C2 (Phase 2)
    └─> C3 (Phase 2)
    └─> C4 (Phase 3)
    └─> C5 (Phase 3)
    └─> B5 (Phase 4)

Phase 2 (Parallel)
├─ A2: Batch Mutation [depends: A1 ✅]
│   └─> B1 (Phase 3)
│   └─> B3 (Phase 4)
│
├─ C2: Basic Info UI [depends: C1]
│   └─> B1 (Phase 3)
│
└─ C3: Appearance UI [depends: C1]
    └─> B2 (Phase 3)

Phase 3 (Parallel)
├─ C4: Prompts UI [depends: C1, A1 ✅]
│   └─> B3 (Phase 4)
│
├─ C5: Members UI [depends: C1]
│   └─> B4 (Phase 4)
│
├─ B1: Wire Basic Info [depends: A2, C2]
│   └─> B6 (Phase 4)
│
└─ B2: Wire Appearance [depends: C3]
    └─> B6 (Phase 4)

Phase 4 (Sequential)
├─ B3: Wire Prompts [depends: A1 ✅, A2, C4]
│   └─> B6
│
├─ B4: Wire Members [depends: C5]
│   └─> B6
│
├─ B5: State Management [depends: C1]
│   └─> B6
│
└─ B6: E2E Tests [depends: B1, B2, B3, B4, B5]
    └─> (Complete)
```

---

## Critical Path Analysis

**Critical Path** (longest dependency chain):
```
A1 ✅ → A2 → C4 → B3 → B6
```

**Estimated Time:**
- A1: ✅ 0 hours (complete)
- A2: 1.5 hours
- C4: 1 hour
- B3: 45 minutes
- B6: 1 hour

**Total Critical Path:** 4.25 hours

**Parallel Savings:**
- Sequential total: 8 hours (all stories one-by-one)
- Parallel total: 4.25 hours (critical path)
- **Time saved:** 3.75 hours (47% faster)

---

## Blocking Relationships

### Stories That Block Multiple Others

1. **A1 ✅ (COMPLETE)** blocks:
   - A2 (backend mutation needs promptType)
   - C4 (prompts UI needs type selector)
   - B3 (integration needs types in API)

2. **C1** (wizard shell) blocks:
   - C2, C3, C4, C5 (all steps need shell)
   - B5 (state management in shell)

3. **A2** (batch mutation) blocks:
   - B1, B3 (integration needs API)

4. **B1, B2, B3, B4, B5** (all integrations) block:
   - B6 (E2E testing needs everything working)

---

## Agent Workload Distribution

### Backend Agent
- Phase 1: A1 ✅ (complete)
- Phase 2: A2 (1.5h)
- **Total:** 1.5 hours

### Frontend Agent
- Phase 1: C1 (45m)
- Phase 2: C2 (30m) + C3 (45m) = 1.25h
- Phase 3: C4 (1h) + C5 (45m) + B1 (30m) + B2 (30m) = 3.25h
- Phase 4: B3 (45m) + B4 (30m) + B5 (45m) + B6 (1h) = 3h
- **Total:** 8.25 hours (but parallelized to 4.25h via phases)

---

## Parallel Execution Strategy

### Maximum Parallelization

**Phase 1:** 2 agents, 2 stories
- Backend Agent: A1 ✅
- Frontend Agent: C1

**Phase 2:** 2 agents, 3 stories
- Backend Agent: A2
- Frontend Agent: C2, C3 (sequential within agent)

**Phase 3:** 1 agent, 4 stories
- Frontend Agent: C4, C5, B1, B2 (some parallel, some sequential)

**Phase 4:** 1 agent, 4 stories
- Frontend Agent: B3 → B4 → B5 → B6 (sequential due to dependencies)

---

## Risk Mitigation

### If A2 Fails
**Impact:** Blocks B1, B3
**Mitigation:** Continue with C4, C5, B2 while debugging A2

### If C1 Fails
**Impact:** Blocks all C and B stories
**Mitigation:** **CRITICAL** - prioritize fixing immediately

### If Any Integration Story (B1-B5) Fails
**Impact:** Blocks B6 (E2E tests)
**Mitigation:** Continue other integrations, fix blocker last

---

## Recommended Execution Order

1. **Start Phase 1** (both agents in parallel)
   - A1 ✅ (already complete)
   - C1

2. **Start Phase 2** (both agents in parallel)
   - A2
   - C2, C3

3. **Start Phase 3** (frontend agent only)
   - C4, C5 (parallel)
   - B1, B2 (parallel)

4. **Start Phase 4** (frontend agent only, sequential)
   - B3
   - B4
   - B5
   - B6

**Total Time:** ~4 hours (vs 8 hours sequential)

---

**Last Updated:** 2025-10-11
**Version:** 1.0
**Ready for Execution:** ✅ Yes
