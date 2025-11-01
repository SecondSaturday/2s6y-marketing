# Story System - Parallel Implementation Framework

**Welcome to the 2Sat-lite parallel development orchestration system!**

This directory contains everything you need to coordinate 6+ parallel Claude sessions working simultaneously on the Group Settings & Roles feature.

---

## 📁 Directory Structure

```
.claude/stories/
├── README.md (you are here)
├── STORY_INDEX.md (master index with dependency graph)
├── STORY_TRACKER.md (live progress tracker)
├── STORY_QUEUE.md (ready/in-progress/blocked stories)
├── foundation/
│   └── STORY-000-foundation.md
├── track-a-backend/ (6 backend stories)
├── track-b-ui-foundation/ (4 UI foundation stories)
├── track-c-member-ui/ (8 member management stories)
├── track-d-prompts/ (4 prompt customization stories)
├── track-e-notifications/ (3 notification/email stories)
└── track-f-integration/ (3 integration/polish stories)
```

**Total: 28 stories** | **Estimated: 5-10 hours real-time with parallelism**

---

## 🚀 Quick Start Guide

### Step 1: Run Foundation Setup

```bash
# Start with STORY-000 (Foundation)
# This sets up testing infrastructure

# Option A: Do it yourself
open .claude/stories/foundation/STORY-000-foundation.md
# Follow instructions manually

# Option B: Delegate to orchestrator
# (Open new Claude session and paste:)
"Execute STORY-000 from .claude/stories/foundation/STORY-000-foundation.md"
```

### Step 2: Launch Parallel Sessions

After STORY-000 completes, launch 3 parallel sessions:

**Session 1 (Backend):**
```
You are backend-dev agent.
Execute STORY-A1 from .claude/stories/track-a-backend/STORY-A1-schema-migration.md
Update .claude/stories/STORY_TRACKER.md when you start and finish.
```

**Session 2 (Frontend):**
```
You are frontend-dev agent.
Execute STORY-B1 from .claude/stories/track-b-ui-foundation/story-b1.md
Update .claude/stories/STORY_TRACKER.md when you start and finish.
```

**Session 3 (Frontend):**
```
You are frontend-dev agent.
Execute STORY-B4 from .claude/stories/track-b-ui-foundation/story-b4.md
Update .claude/stories/STORY_TRACKER.md when you start and finish.
```

### Step 3: Monitor Progress

```bash
# View live progress
cat .claude/stories/STORY_TRACKER.md

# Check what's ready to start
cat .claude/stories/STORY_QUEUE.md

# (Future: Run dashboard)
npm run monitor
```

### Step 4: Continue Launching

As stories complete, launch more sessions. See STORY_INDEX.md for dependency graph.

**Maximum parallelism** (after A2, B2, B3 complete):
- 6-7 sessions running simultaneously
- Each session works on 3-5 sequential stories
- Real-time completion: ~3-5 hours

---

## 📖 File Descriptions

### STORY_INDEX.md
- **Purpose:** Master index of all 28 stories
- **Contains:** Dependency graph, parallel execution groups, critical path
- **Use:** Understanding the big picture, planning session launches

### STORY_TRACKER.md
- **Purpose:** Live progress tracking
- **Contains:** Table with status, times, tests, blockers
- **Use:** Monitoring active sessions, identifying blockers
- **⚠️ UPDATE THIS:** Every agent must update when starting/finishing

### STORY_QUEUE.md
- **Purpose:** Shows what's ready, in-progress, blocked
- **Contains:** Ready queue, waiting list, completed list
- **Use:** Deciding what to launch next
- **⚠️ UPDATE THIS:** Move stories as they progress

### Individual Story Files
- **Purpose:** Complete specification for one story
- **Contains:** Context, tasks, acceptance criteria, testing requirements
- **Use:** Paste into new Claude session to start work

---

## 🎯 Workflow Patterns

### Pattern 1: Manual Orchestration (You Control Everything)

```bash
# 1. Check what's ready
cat .claude/stories/STORY_QUEUE.md

# 2. Open new Claude session
# 3. Paste story assignment:
"Execute STORY-A3 from .claude/stories/track-a-backend/story-a3.md"

# 4. Monitor progress in STORY_TRACKER.md
# 5. When complete, launch next ready story
```

### Pattern 2: Orchestrator Automation

```bash
# Open Claude session with:
"You are the orchestrator.
Read .claude/stories/STORY_QUEUE.md
Launch all 'Ready to Start' stories in parallel using Task tool.
Monitor progress in STORY_TRACKER.md.
When stories complete, launch next ready stories.
Continue until all 28 stories done."
```

### Pattern 3: Hybrid (Recommended)

```bash
# You launch foundation manually
Execute STORY-000

# Then use orchestrator for parallel blast
"Read STORY_INDEX.md Group 2.
Launch 3 parallel sessions (A1, B1, B4).
Monitor and launch Group 3 when ready."
```

---

## ✅ Story Lifecycle

```
1. 🔴 Not Started
   ↓ (Dependencies met, added to queue)
2. 🟢 Ready to Start
   ↓ (Session assigned, work begins)
3. 🔄 In Progress
   ↓ (All tasks complete, tests pass)
4. ✅ Done
   ↓ (Unblocks dependent stories)
5. Dependencies now met for next stories
```

---

## 🚨 Handling Blockers

**If a session reports a blocker:**

1. **Update STORY_TRACKER.md:**
   ```
   Status: 🚨 Blocked
   Blocker: "Auth middleware issue"
   ```

2. **Investigate:**
   - Check if it's a dependency issue
   - Check if it's a code bug
   - Check if it's missing context

3. **Resolve:**
   - Fix the blocker
   - Update tracker: 🚨 Blocked → 🔄 In Progress
   - Session resumes

4. **Learn:**
   - Document in `.claude/PARALLEL_POSTMORTEM.md`
   - Improve process for future

---

## 📊 Progress Dashboard (Future)

```bash
npm run monitor
```

**Output:**
```
╔════════════════════════════════════════════════╗
║  Group Settings & Roles - Live Progress       ║
╠════════════════════════════════════════════════╣
║  Progress: ████████████░░░░░░  18/28 (64%)    ║
║  Velocity: 1.2 hrs/story avg                   ║
║  ETA: Tomorrow 2:30 PM                         ║
╠════════════════════════════════════════════════╣
║  Active Sessions (4):                          ║
║  • Backend-1  → STORY-A5 (45 min) 🔄          ║
║  • Frontend-1 → STORY-C3 (20 min) 🔄          ║
║  • Frontend-2 → STORY-D2 (10 min) 🔄          ║
║  • Backend-2  → STORY-E1 (30 min) 🔄          ║
╠════════════════════════════════════════════════╣
║  Blockers (1):                                 ║
║  🚨 STORY-C4 - Auth middleware issue           ║
╚════════════════════════════════════════════════╝
```

---

## 🎓 Tips for Success

### Do's ✅
- ✅ **Update STORY_TRACKER.md religiously** (every start/finish)
- ✅ **Check dependencies** before launching sessions
- ✅ **Run tests** before marking complete
- ✅ **Commit frequently** (per story or per task)
- ✅ **Read handoff notes** from completed stories

### Don'ts ❌
- ❌ **Don't skip STORY-000** (foundation is critical)
- ❌ **Don't launch stories with unmet dependencies**
- ❌ **Don't forget to update trackers** (causes confusion)
- ❌ **Don't run 10 sessions at once** (diminishing returns)
- ❌ **Don't skip tests** (breaks integration later)

---

## 📈 Expected Timeline

**Optimistic (everything perfect):**
- Foundation: 1 hour
- Parallel blast: 4 hours
- Integration: 2 hours
- **Total: 7 hours**

**Realistic (some blockers):**
- Foundation: 1.5 hours
- Parallel blast: 5 hours
- Integration: 2.5 hours
- Blockers/debugging: 1 hour
- **Total: 10 hours**

**Conservative (learning curve):**
- Foundation: 2 hours
- Parallel blast: 6 hours
- Integration: 3 hours
- Blockers/coordination: 2 hours
- **Total: 13 hours**

---

## 🎯 Success Metrics

**You'll know it's working when:**
- ✅ STORY_TRACKER.md shows 🔄 on 4-6 stories simultaneously
- ✅ No 🚨 blockers lasting more than 30 minutes
- ✅ Velocity stays around 1-1.5 hours per story
- ✅ Stories complete in dependency order (no waiting)

**Red flags:**
- 🚨 Same story stuck 🔄 for 3+ hours (investigate)
- 🚨 Multiple blockers at same time (coordination issue)
- 🚨 Velocity drops below 0.5 hours/story (too easy, wrong estimate)
- 🚨 Velocity exceeds 3 hours/story (too hard, need help)

---

## 🔗 Related Documentation

- `.claude/CLAUDE.md` - Main project instructions
- `.claude/DESIGN_SYSTEM.md` - UI/UX guidelines
- `.claude/PARALLEL_WORKFLOW.md` - Detailed workflow guide (created by STORY-000)
- `.claude/CHANGELOG.md` - Project changelog
- `.claude/PARALLEL_POSTMORTEM.md` - Retrospective (created by STORY-F3)

---

**Questions?** Check STORY_INDEX.md or ask in main Claude session.

**Ready to begin?** Start with STORY-000! 🚀
