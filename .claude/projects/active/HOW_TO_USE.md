# How to Use the Launch Scripts

## 🎯 Quick Start (Example)

Let's launch **PROJECT 1: Newsletter Automation** with parallel stories:

### Step 1: Navigate to Project
```bash
cd .claude/projects/active/2025-10-newsletter-automation
```

### Step 2: Run Launch Script
```bash
./LAUNCH_SESSIONS.sh
```

### Step 3: Follow Prompts
The script will guide you through opening new terminal tabs:

```
🔷 Story B1: Cron Job Setup (3 hours)
Linear Issue: https://linear.app/2s6y/issue/2S6-48

Open NEW terminal tab and run:
─────────────────────────────────────────────────
cd /Users/kalyanchandana/Documents/GitHub/2Sat-lite
claude-code

# When Claude asks, paste:
Implement STORY-B1: Cron Job Setup from Linear issue 2S6-48...
─────────────────────────────────────────────────

Press Enter after starting Story B1 session...
```

### Step 4: Open Terminal Tab
1. Open a **new terminal tab** (Command+T in iTerm/Terminal)
2. Copy/paste the commands from the script
3. When Claude Code asks "What should I work on?", paste the provided prompt
4. Press Enter in the launch script to continue

### Step 5: Repeat for Each Story
The script will guide you through each story in the correct order.

---

## 📋 All Projects

### PROJECT 1: Newsletter Automation ⚡ P0
```bash
cd .claude/projects/active/2025-10-newsletter-automation
./LAUNCH_SESSIONS.sh
```
**Stories**: 3 (2 parallel + 1 sequential)
**Time**: 8h total, 5h wall time

---

### PROJECT 2: Deadline Enforcement ⚡ P0
```bash
cd .claude/projects/active/2025-10-deadline-enforcement
./LAUNCH_SESSIONS.sh
```
**Stories**: 2 (both parallel)
**Time**: 2.5h total, 1.5h wall time

---

### PROJECT 3: Route Structure ⚡ P0
```bash
cd .claude/projects/active/2025-10-route-structure
./LAUNCH_SESSIONS.sh
```
**Stories**: 2 (sequential - R2 blocked by R1)
**Time**: 4-5h (sequential)

---

### PROJECT 4: Reminders + Exclusion 🔔 P1
```bash
cd .claude/projects/active/2025-10-reminders-exclusion
./LAUNCH_SESSIONS.sh
```
**Stories**: 4 (2 parallel + 1 sequential + 1 integration)
**Time**: 11h total, 8-9h wall time

---

### PROJECT 5: Email Preferences 📧 P1
```bash
cd .claude/projects/active/2025-10-email-preferences
./LAUNCH_SESSIONS.sh
```
**Stories**: 2 (both parallel)
**Time**: 4h total, 2h wall time

---

## 💡 Pro Tips

### Tip 1: Keep Script Running
Don't close the terminal where the launch script is running. It guides you through phases and enforces dependencies.

### Tip 2: Use Terminal Tabs
Open multiple tabs (Command+T) for parallel stories instead of new windows.

### Tip 3: Copy Prompts Exactly
The launch script provides carefully crafted prompts. Copy them exactly as shown.

### Tip 4: Wait for Blockers
When the script says "WAIT for X to complete", actually wait! Dependencies matter.

### Tip 5: Track Progress
Update `STORY_TRACKER.md` in each project directory as you complete stories.

---

## 🆘 Troubleshooting

### Script Won't Run
```bash
chmod +x LAUNCH_SESSIONS.sh
```

### Claude Code Not Found
```bash
which claude-code
# If not found, install or add to PATH
```

### Lost Track of Progress
Check `STORY_TRACKER.md` in project directory.

### Need to Skip a Story
Just press Enter when the script asks about that story (if you already completed it).

---

## 📊 What Each File Does

```
project-directory/
├── LAUNCH_SESSIONS.sh         # Interactive launcher (USE THIS!)
├── STORY_TRACKER.md            # Progress tracking
├── QUICK_START.md              # Manual execution guide (backup)
└── STORY-*.md                  # Individual story details (reference)
```

**Primary**: Use `LAUNCH_SESSIONS.sh` for guided execution
**Backup**: Use `QUICK_START.md` for manual execution
**Reference**: Read `STORY-*.md` for implementation details

---

## ✅ Success Workflow

1. **Start**: `./LAUNCH_SESSIONS.sh`
2. **Follow**: Open tabs as prompted
3. **Paste**: Copy prompts exactly
4. **Wait**: For dependencies when told
5. **Track**: Update STORY_TRACKER.md
6. **Complete**: All stories done!

---

**Need help?** See `.claude/projects/active/README.md` for full documentation.
