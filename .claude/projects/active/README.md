# 2Sat-lite MVP - Active UEDS Projects

**Status**: Ready for parallel execution
**Total Projects**: 5
**Total Stories**: 13
**Estimated Total Time**: ~27-30 hours (with parallelization: ~18-20 hours wall time)

---

## 🚀 Quick Start - Run All Projects

Each project has a `LAUNCH_SESSIONS.sh` script that guides you through launching multiple Claude Code sessions in parallel.

### Usage

```bash
# Navigate to any project directory
cd .claude/projects/active/2025-10-newsletter-automation

# Run the launch script
./LAUNCH_SESSIONS.sh
```

The script will:
1. Display project overview and story details
2. Guide you to open new terminal tabs
3. Provide exact prompts to paste into Claude Code
4. Show acceptance criteria for each story
5. Handle phase dependencies (wait for prerequisites)

---

## 📦 Projects Overview

### PROJECT 1: Newsletter Automation (MVP) ⚡ P0 Blocker
**Directory**: `2025-10-newsletter-automation/`
**Linear**: https://linear.app/2s6y/project/newsletter-automation-mvp-fc0a5c6fe353
**Time**: 8h total (6h parallel + 2h sequential)
**Parallelization**: ✅ Yes (B1 + B2 can run simultaneously)

**Stories**:
- 2S6-48: STORY-B1: Cron Job Setup (3h) ✅ Parallelizable
- 2S6-49: STORY-B2: Real Email Sending (3h) ✅ Parallelizable
- 2S6-50: STORY-I1: E2E Testing (2h) ⚠️ Blocked by B1+B2

**Launch**:
```bash
cd 2025-10-newsletter-automation
./LAUNCH_SESSIONS.sh
```

---

### PROJECT 2: Deadline Enforcement ⚡ P0 Blocker
**Directory**: `2025-10-deadline-enforcement/`
**Linear**: https://linear.app/2s6y/project/deadline-enforcement-4486c62c1388
**Time**: 2.5h total (1.5h parallel execution)
**Parallelization**: ✅ Yes (B1 + F1 can run simultaneously)

**Stories**:
- 2S6-35: STORY-B1: Backend Deadline Validation (1.5h) ✅ Parallelizable
- 2S6-38: STORY-F1: Frontend UI Lock (1h) ✅ Parallelizable

**Launch**:
```bash
cd 2025-10-deadline-enforcement
./LAUNCH_SESSIONS.sh
```

---

### PROJECT 3: Route Structure Refactor ⚡ P0 Blocker
**Directory**: `2025-10-route-structure/`
**Linear**: https://linear.app/2s6y/project/route-structure-refactor-core-pages-e5b7cd50cc77
**Time**: 4-5h total (SEQUENTIAL execution required)
**Parallelization**: ❌ No (R2 blocked by R1)

**Stories**:
- 2S6-41: STORY-R1: Migrate Contribution Route (2-3h) ✅ Start first
- 2S6-43: STORY-R2: Create Missing Pages (2-3h) ⚠️ Blocked by R1

**Launch**:
```bash
cd 2025-10-route-structure
./LAUNCH_SESSIONS.sh
```

---

### PROJECT 4: Reminders + Exclusion Logic 🔔 P1 High Priority
**Directory**: `2025-10-reminders-exclusion/`
**Linear**: https://linear.app/2s6y/project/contribution-reminders-exclusion-logic-340c2e86ade5
**Time**: 11h total (5h parallel + 2h + 3h)
**Parallelization**: ✅ Partial (B1 + F1 parallel, then B2, then I1)

**Stories**:
- 2S6-44: STORY-B1: Reminder Cron Jobs (3h) ✅ Parallelizable
- 2S6-46: STORY-F1: Exclusion Empty State (3h) ✅ Parallelizable
- 2S6-45: STORY-B2: Reminder Email Templates (2h) ⚠️ Blocked by B1
- 2S6-47: STORY-I1: E2E Tests + Exclusion Notifications (3h) ⚠️ Blocked by all

**Launch**:
```bash
cd 2025-10-reminders-exclusion
./LAUNCH_SESSIONS.sh
```

---

### PROJECT 5: Email Preferences System 📧 P1 High Priority
**Directory**: `2025-10-email-preferences/`
**Linear**: https://linear.app/2s6y/project/email-preferences-system-3502f31da2dd
**Time**: 4h total (2h parallel execution)
**Parallelization**: ✅ Yes (EP1 + EP2 can run simultaneously)

**Stories**:
- 2S6-40: STORY-EP1: Backend Schema + Logic (2h) ✅ Parallelizable
- 2S6-42: STORY-EP2: Frontend Preferences UI (2h) ✅ Parallelizable

**Launch**:
```bash
cd 2025-10-email-preferences
./LAUNCH_SESSIONS.sh
```

---

## 📊 Recommended Execution Order

Based on TODO.md priorities and MVP blockers:

### Week 1: Critical Blockers (P0)

**Day 1-2: PROJECT 1 (Newsletter Automation)**
```bash
cd 2025-10-newsletter-automation
./LAUNCH_SESSIONS.sh
# Estimated: 6 hours parallel + 2 hours sequential = 8 hours wall time
```

**Day 3: PROJECT 2 (Deadline Enforcement)**
```bash
cd 2025-10-deadline-enforcement
./LAUNCH_SESSIONS.sh
# Estimated: 1.5 hours parallel execution
```

**Day 4-5: PROJECT 3 (Route Structure)**
```bash
cd 2025-10-route-structure
./LAUNCH_SESSIONS.sh
# Estimated: 4-5 hours sequential
```

### Week 2: High Priority (P1)

**Day 6-7: PROJECT 4 (Reminders + Exclusion)**
```bash
cd 2025-10-reminders-exclusion
./LAUNCH_SESSIONS.sh
# Estimated: 8-9 hours wall time (3 phases)
```

**Day 8: PROJECT 5 (Email Preferences)**
```bash
cd 2025-10-email-preferences
./LAUNCH_SESSIONS.sh
# Estimated: 2 hours parallel execution
```

---

## 🎯 How the Launch Scripts Work

### Step 1: Run Script
```bash
cd .claude/projects/active/2025-10-newsletter-automation
./LAUNCH_SESSIONS.sh
```

### Step 2: Script Displays Story Details
```
🔷 Story B1: Cron Job Setup (3 hours)
Linear Issue: https://linear.app/2s6y/issue/2S6-48

Open NEW terminal tab and run:
─────────────────────────────────────────────────
cd /Users/kalyanchandana/Documents/GitHub/2Sat-lite
claude-code

# When Claude asks, paste:
Implement STORY-B1: Cron Job Setup from Linear issue 2S6-48.

Create Convex cron job that triggers newsletter generation...
[Full prompt with acceptance criteria]
─────────────────────────────────────────────────

Press Enter after starting Story B1 session...
```

### Step 3: You Open New Terminal Tab
- Open a new terminal tab
- Run `cd /Users/kalyanchandana/Documents/GitHub/2Sat-lite`
- Run `claude-code`
- Paste the provided prompt when Claude asks

### Step 4: Script Guides You Through Each Story
- Waits for you to confirm story started
- Shows next story details
- Handles phase dependencies (blocks until prerequisites complete)

---

## 📁 Project Structure

Each project contains:

```
2025-10-{project-name}/
├── LAUNCH_SESSIONS.sh        # Interactive launcher (NEW!)
├── STORY_TRACKER.md           # Progress tracking
├── QUICK_START.md             # Manual execution guide
├── STORY-{id}-{name}.md       # Individual story files (where detailed)
└── (Linear issues have full details)
```

---

## 💡 Tips for Efficient Execution

### 1. Use iTerm2 or Terminal Tabs
Open multiple tabs and run stories in parallel:
- Tab 1: Story B1
- Tab 2: Story B2
- Tab 3: Story I1 (when B1+B2 complete)

### 2. Keep Script Running
The launch script guides you through phases and waits for dependencies.

### 3. Reference Linear for Full Details
All stories have complete implementations in Linear. Launch scripts provide quick prompts.

### 4. Track Progress in STORY_TRACKER.md
Update story statuses as you complete them:
```markdown
| Story | Status | Time | Agent |
|-------|--------|------|-------|
| 2S6-48 | ✅ COMPLETE | 3h | Backend |
| 2S6-49 | 🔄 IN PROGRESS | 3h | Backend |
| 2S6-50 | ⬜ TODO | 2h | Orchestrator |
```

### 5. Monitor for Blockers
The launch scripts enforce dependencies:
- Will WAIT before starting blocked stories
- Prompts you to confirm prerequisites complete
- Shows clear phase separation

---

## ✅ Verification Checklist

After completing all projects:

### PROJECT 1: Newsletter Automation
- [ ] Cron job visible in Convex dashboard
- [ ] Manual orchestrator test successful
- [ ] Real emails sent via Resend
- [ ] E2E tests passing (5/5)
- [ ] No stub code remaining

### PROJECT 2: Deadline Enforcement
- [ ] Hardcoded `isLocked = false` removed
- [ ] canEdit query works
- [ ] Form locks after deadline
- [ ] Unit tests passing (6/6)
- [ ] E2E tests passing (4/4)

### PROJECT 3: Route Structure
- [ ] Contribution form at `/groups/[groupId]/contribute`
- [ ] Old `/contribute` route deleted
- [ ] Group home page created
- [ ] Archive page created
- [ ] No broken links

### PROJECT 4: Reminders + Exclusion
- [ ] 3 cron jobs in dashboard
- [ ] Reminder emails sending
- [ ] Exclusion empty state displays
- [ ] E2E tests passing

### PROJECT 5: Email Preferences
- [ ] emailPreferences schema field added
- [ ] Settings page has preferences section
- [ ] 7 toggles functional
- [ ] Email actions respect preferences

---

## 🆘 Troubleshooting

### Issue: Script won't run
```bash
# Make executable
chmod +x LAUNCH_SESSIONS.sh
```

### Issue: Can't find Claude Code
```bash
# Ensure claude-code is in PATH
which claude-code
```

### Issue: Lost track of which stories are done
Check `STORY_TRACKER.md` in each project directory.

### Issue: Need to restart a story
Just re-run the launch script and skip to the story you need.

---

## 📈 Time Estimates Summary

| Project | Sequential Time | Parallel Time | Speedup |
|---------|----------------|---------------|---------|
| PROJECT 1 | 8h | 5h | 1.6x |
| PROJECT 2 | 2.5h | 1.5h | 1.7x |
| PROJECT 3 | 4-5h | 4-5h | 1x (sequential) |
| PROJECT 4 | 11h | 8-9h | 1.2x |
| PROJECT 5 | 4h | 2h | 2x |
| **TOTAL** | **~30h** | **~20h** | **1.5x faster** |

---

## 🎉 Success Metrics

**MVP Complete When**:
- ✅ All 5 projects delivered
- ✅ 13 Linear stories closed
- ✅ All tests passing
- ✅ 4 critical blockers resolved
- ✅ Ready for production launch

---

**Last Updated**: 2025-10-22
**Framework Version**: v1.3.2
**Created By**: UEDS (Universal Engineering Development System)
