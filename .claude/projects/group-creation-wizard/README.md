# Group Creation Wizard - UEDS Project

**Status:** ✅ Planning Complete, Ready for Execution
**Created:** 2025-10-11
**Estimated Duration:** 4 hours (parallel) / 8 hours (sequential)

---

## 📁 Project Structure

```
.claude/projects/group-creation-wizard/
├── README.md                      # This file
├── PROJECT.md                     # Complete project overview
├── STORY_TRACKER.md               # Real-time progress tracking
├── dependencies.md                # Dependency graph & execution phases
├── contracts/
│   ├── backend-api.md             # Backend API contracts
│   └── frontend-props.md          # Frontend component contracts
├── stories/
│   ├── STORY-A1-extend-prompts-schema.md         ✅ COMPLETE
│   ├── STORY-A2-batch-creation-mutation.md       🟡 Pending
│   ├── STORY-C1-wizard-shell.md                  🟡 Pending
│   ├── STORY-C2-basic-info-step.md               🟡 Pending
│   ├── STORY-C3-appearance-step.md               🟡 Pending
│   ├── STORY-C4-prompts-setup-step.md            🟡 Pending
│   ├── STORY-C5-members-step.md                  🟡 Pending
│   ├── STORY-B1-wire-basic-info.md               🟡 Pending
│   ├── STORY-B2-wire-appearance.md               🟡 Pending
│   ├── STORY-B3-wire-prompts.md                  🟡 Pending
│   ├── STORY-B4-wire-members.md                  🟡 Pending
│   ├── STORY-B5-state-management.md              🟡 Pending
│   └── STORY-B6-e2e-tests.md                     🟡 Pending
└── factories/                     # (Empty - for future test factories)
```

---

## 🚀 Quick Start for Agents

### For Backend Agent

**Phase 1:** STORY-A1 ✅ (Already complete)
**Phase 2:** STORY-A2 (Ready to start)

```bash
# Read the story
Read: .claude/projects/group-creation-wizard/stories/STORY-A2-batch-creation-mutation.md

# Read the contract
Read: .claude/projects/group-creation-wizard/contracts/backend-api.md

# Start work (TDD)
# 1. Write tests first
# 2. Run tests (expect failures)
# 3. Implement mutation
# 4. Verify 100% pass rate
```

**Deliverables:**
- `convex/groups.ts` - createGroupWithSettings mutation
- `tests/unit/group-creation-batch.test.ts` - 12+ tests

---

### For Frontend Agent

**Phase 1:** STORY-C1 (Ready to start)

```bash
# Read the story
Read: .claude/projects/group-creation-wizard/stories/STORY-C1-wizard-shell.md

# Read the contract
Read: .claude/projects/group-creation-wizard/contracts/frontend-props.md

# Start work
# 1. Create wizard directory structure
# 2. Build WizardContext
# 3. Build CreateGroupWizard container
# 4. Build WizardProgress indicator
# 5. Take visual regression screenshots (3 breakpoints)
```

**Deliverables:**
- `components/groups/CreateGroupWizard.tsx`
- `components/groups/wizard/WizardContext.tsx`
- `components/groups/wizard/WizardProgress.tsx`

---

## 📊 Progress Tracking

**Current Status:**
- ✅ Planning: 100% complete
- 🟢 Phase 1: 50% complete (A1 done, C1 pending)
- 🟡 Phase 2: 0% complete
- 🟡 Phase 3: 0% complete
- 🟡 Phase 4: 0% complete

**Overall:** 1/13 stories complete (8%)

**Next Steps:**
1. Frontend Agent starts STORY-C1 (Phase 1)
2. Backend Agent starts STORY-A2 (Phase 2, after C1 completes)
3. Continue through phases as dependencies resolve

---

## 📋 Key Documents

### Must Read First
1. **PROJECT.md** - Complete project overview, success criteria, architecture
2. **dependencies.md** - Execution phases, dependency graph, critical path
3. **STORY_TRACKER.md** - Real-time progress, story details, blockers

### Before Starting Work
- **contracts/backend-api.md** - If writing backend code
- **contracts/frontend-props.md** - If writing frontend code
- **stories/STORY-XX-name.md** - Your assigned story

---

## 🎯 Success Criteria (POC)

### User Experience
- [ ] User can create a group in 4 intuitive steps
- [ ] Progress indicator shows current step
- [ ] User can navigate back/forward
- [ ] User can skip optional steps (Appearance)
- [ ] Group ID auto-generates but is editable
- [ ] At least 3 prompts configured
- [ ] Direct email invites + shareable link generated

### Technical
- [ ] All API contracts implemented
- [ ] Backend mutations support batch operations
- [ ] Frontend wizard preserves state
- [ ] Schema changes backward compatible
- [ ] Existing group creation still works

### Testing
- [ ] E2E test covers full wizard flow
- [ ] Unit tests for all mutations (100% pass rate)
- [ ] Visual regression tests pass (3 breakpoints)

---

## 🔧 Execution Commands

### For Orchestrator

**Track Progress:**
```bash
# View current status
Read: .claude/projects/group-creation-wizard/STORY_TRACKER.md

# Check dependencies
Read: .claude/projects/group-creation-wizard/dependencies.md

# View phase progress
Check STORY_TRACKER.md > Execution Plan section
```

**Assign Work:**
```bash
# Assign story to agent
"@backend-agent Start STORY-A2"
"@frontend-agent Start STORY-C1"
```

**Monitor Completion:**
```bash
# After agent finishes
Update STORY_TRACKER.md: Mark story ✅ Done
Check dependencies: Unblock next stories
Assign next story based on phase
```

---

## ⚠️ Important Notes

### For All Agents

1. **Read contracts first** before starting any story
2. **Follow TDD protocol** (write tests → fail → implement → pass)
3. **Update STORY_TRACKER.md** when starting and completing stories
4. **Take visual regression tests** (frontend stories only)
5. **No hardcoded colors/spacing** - use design system tokens

### Design System Compliance

**Frontend agents MUST:**
- Use DaisyUI components only
- Use design tokens from `.claude/core/design-system.md`
- No arbitrary values (❌ `gap-[13px]`, ✅ `gap-4`)
- Take screenshots at 3 breakpoints (375px, 768px, 1440px)

---

## 🔗 Related Documentation

**Framework:**
- `.claude/core/Framework.md` - Complete framework guide
- `.claude/core/UEDS.md` - Parallel development system
- `.claude/core/agents/backend.md` - Backend agent protocol
- `.claude/core/agents/frontend.md` - Frontend agent protocol

**Project-Specific:**
- `.claude/core/design-system.md` - Design tokens
- `.claude/guides/testing.md` - Testing protocols

---

## 📈 Timeline

**Target Completion:** 4 hours (parallel execution)

| Phase | Duration | Stories | Start After |
|-------|----------|---------|-------------|
| Phase 1 | 1h | A1 ✅, C1 | Now |
| Phase 2 | 1.5h | A2, C2, C3 | Phase 1 done |
| Phase 3 | 1.5h | C4, C5, B1, B2 | Phase 2 done |
| Phase 4 | 1h | B3, B4, B5, B6 | Phase 3 done |

**Critical Path:** A1 ✅ → A2 → C4 → B3 → B6 (4.25 hours)

---

**Last Updated:** 2025-10-11
**Project Owner:** Product Team
**Technical Lead:** Agentic Framework (Orchestrator)
**Ready for Execution:** ✅ Yes
