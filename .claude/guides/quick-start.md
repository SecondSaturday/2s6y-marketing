# Quick Start: Starting a New UEDS Project

**For**: Starting your next full-stack feature
**Time**: 10 minutes setup + Orchestrator generation
**Result**: Complete project structure ready for parallel execution

---

## Step 1: Initiate Project with Orchestrator (5 min)

Tell Orchestrator:
```
"Start new UEDS project: [Feature Name]"

Example: "Start new UEDS project: Newsletter Archive"
```

**Orchestrator will**:
1. Create project folder: `.claude/projects/active/[YYYY-MM-feature-name]/`
2. Ask you feature requirements
3. Suggest track breakdown (you approve/adjust)
4. Generate all story files (20-30 stories)
5. Create STORY_INDEX.md (dependency graph)
6. Create STORY_TRACKER.md (empty, ready for progress)
7. Report: "✅ Ready to launch Session 1"

---

## Step 2: Review Generated Structure (2 min)

Check:
- `.claude/projects/active/[YYYY-MM-feature-name]/README.md` (auto-filled)
- `STORY_INDEX.md` (verify dependency graph makes sense)
- `stories/track-*/story-*.md` (scan story breakdown)

**Approve or adjust**: Ask Orchestrator to revise if needed

---

## Step 3: Launch Foundation Story (1-2 hours)

**Session 1**: Execute STORY-000 (foundation)
- Testing infrastructure
- Database schema updates
- Shared utilities

**Wait for completion** before launching parallel sessions.

---

## Step 4: Launch Parallel Sessions (5-10 hours total)

After foundation complete:

**Session 2-7** (parallel): Launch 4-6 stories simultaneously
- Check STORY_TRACKER.md for "Ready to Start" stories
- Launch one session per ready story
- Each agent updates tracker when starting/completing

**Monitor**: Watch STORY_TRACKER.md for:
- ✅ Completed stories → Launch dependent stories
- 🚨 Blocked stories → Resolve blockers
- 🔄 In Progress → Monitor for completion

---

## Step 5: Integration & Completion (2-3 hours)

**Final Track** (sequential): Integration stories
- E2E tests
- Performance optimization
- Documentation

**Orchestrator generates**: POSTMORTEM.md (auto-filled from tracker data)

---

## Step 6: Archive Project

When complete:
- Project auto-moves to `.claude/projects/completed/[YYYY-MM-feature-name]/`
- Ready for next project (start at Step 1)

---

## Quick Reference Commands

**Check what's ready to start**:
```
"Show me ready stories from STORY_TRACKER.md"
```

**Launch specific story**:
```
"Execute STORY-A3 from [project-name]"
```

**Check project status**:
```
"Show project progress for [feature-name]"
```

**Reference previous project**:
```
"Show me how we implemented [similar feature] in [previous project]"
```

---

## Troubleshooting

**Q: Orchestrator suggests too many stories**
A: Ask to consolidate: "Merge STORY-A3 and A4 into one story"

**Q: Story blocked mid-execution**
A: Update tracker to 🚨 Blocked, resolve blocker, then resume

**Q: Want to reuse story from previous project**
A: Tell Orchestrator: "Copy STORY-A1 from [previous-project] as starting point"

---

**Next**: See [Framework.md](../core/Framework.md) for complete methodology
