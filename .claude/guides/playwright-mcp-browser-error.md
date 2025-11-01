# Playwright MCP "Browser Already In Use" Error

**Error Message**: `Browser is already in use for /Users/.../mcp-chrome-66c8354, use --isolated to run multiple instances`

**Framework Version**: v1.6.1
**Status**: Known Issue with Solution

---

## 🔍 What's Happening

### Playwright MCP Browser Lifecycle

Playwright MCP maintains a **persistent browser process** across all tool calls in a Claude Code session:

```
Claude Session Start
    ↓
First mcp__playwright__browser_navigate()
    ↓
Launches Chrome browser (stays running in background)
    ↓
Browser process: /Users/.../mcp-chrome-66c8354
    ↓
All subsequent mcp__playwright__ calls reuse same browser
    ↓
Claude Session End → Browser closes automatically
```

**Key Insight**: The browser process runs **continuously** during your entire Claude session, not per tool call.

---

## ❌ When This Error Occurs

### Scenario 1: Calling `browser_close()` Mid-Session (Most Common)

```typescript
// 1. First navigation - opens browser ✅
mcp__playwright__browser_navigate({ url: "http://localhost:3000" })

// 2. Close browser - closes PAGE but process stays running ⚠️
mcp__playwright__browser_close()

// 3. Second navigation - ERROR! ❌
mcp__playwright__browser_navigate({ url: "http://localhost:3000/dashboard" })
// Error: Browser is already in use
```

**Why**: `browser_close()` closes the **page** but the **browser process** keeps running (locked state). Next navigation fails because browser exists but has no page.

---

### Scenario 2: Stale Browser from Previous Session

```bash
# Yesterday's Claude session (forgot to close browser)
Claude Session 1 → Launched browser → Session ended (browser still running)
    ↓
    ↓ (Browser process still alive 12+ hours later)
    ↓
# Today's Claude session
Claude Session 2 → Try to launch browser → ERROR (already in use)
```

**Why**: Browser process from previous session didn't terminate properly. New session can't launch new browser while old one is locked.

---

### Scenario 3: Multiple Claude Sessions Simultaneously

```
Terminal 1: Claude Code (Session A) → Launches browser
Terminal 2: Claude Code (Session B) → Tries to launch browser → ERROR
```

**Why**: Only one Claude session can control the MCP browser at a time. The browser profile path is shared, causing conflicts.

---

## ✅ Solution 1: Reset Script (Recommended)

### Quick Fix (30 seconds)

```bash
# Kill stale browser processes and clean locks
./scripts/playwright-mcp-reset.sh
```

**Output**:
```
🔄 Resetting Playwright MCP browser...
✅ Killed 11 stale browser process(es)
✅ Cleaned browser lock files
✅ Playwright MCP reset complete! You can now use mcp__playwright__ tools.
```

**Then retry**:
```typescript
mcp__playwright__browser_navigate({ url: "http://localhost:3000" })
// Now works! ✅
```

---

## ✅ Solution 2: Manual Cleanup

### Step 1: Kill Browser Processes

```bash
# Kill all MCP Chrome processes
pkill -f "mcp-chrome-66c8354"
```

### Step 2: Verify Cleanup

```bash
# Check if any processes remain
ps aux | grep "mcp-chrome" | grep -v grep
# Should return nothing
```

### Step 3: Retry Playwright

```typescript
mcp__playwright__browser_navigate({ url: "http://localhost:3000" })
// Now works! ✅
```

---

## 🛡️ Prevention: Best Practices

### ✅ DO (Correct Workflow)

**1. Don't call `browser_close()` unless ending session**

```typescript
// Multiple navigations in one session
mcp__playwright__browser_navigate({ url: "http://localhost:3000" })
mcp__playwright__browser_take_screenshot({ filename: "landing.png" })

// Navigate to another page (browser stays open)
mcp__playwright__browser_navigate({ url: "http://localhost:3000/dashboard" })
mcp__playwright__browser_take_screenshot({ filename: "dashboard.png" })

// ✅ Browser stays open - NO browser_close() needed
// Browser will close automatically when Claude session ends
```

**2. Use `browser_tabs()` for multiple pages**

```typescript
// Open multiple tabs in same browser session
mcp__playwright__browser_tabs({ action: "new" })  // Tab 1
mcp__playwright__browser_navigate({ url: "http://localhost:3000" })

mcp__playwright__browser_tabs({ action: "new" })  // Tab 2
mcp__playwright__browser_navigate({ url: "http://localhost:3000/dashboard" })

// Switch between tabs
mcp__playwright__browser_tabs({ action: "select", index: 0 })  // Back to Tab 1
```

**3. Reset before new session if needed**

```bash
# At start of new Claude session (if previous session had issues)
./scripts/playwright-mcp-reset.sh

# Then proceed with Playwright
PORT=$(./scripts/playwright-with-port.sh)
mcp__playwright__browser_navigate({ url: `http://localhost:${PORT}` })
```

---

### ❌ DON'T (Causes Errors)

**1. Don't call `browser_close()` mid-session**

```typescript
// ❌ BAD
mcp__playwright__browser_navigate({ url: "http://localhost:3000" })
mcp__playwright__browser_close()  // ← Don't do this!
mcp__playwright__browser_navigate({ url: "http://localhost:3000/dashboard" })
// ERROR: Browser is already in use
```

**2. Don't run multiple Claude sessions with Playwright simultaneously**

```bash
# ❌ BAD (causes conflicts)
Terminal 1: Claude Code → Using Playwright MCP
Terminal 2: Claude Code → Using Playwright MCP  # ← ERROR
```

**Fix**: Use Playwright in only one Claude session at a time, OR use bash Playwright for parallel testing.

---

## 🔧 How the Reset Script Works

### What It Does

```bash
#!/bin/bash
# 1. Find all MCP Chrome processes
pgrep -f "mcp-chrome-66c8354"

# 2. Kill them forcefully
kill -9 <pid>

# 3. Clean browser lock files
find ~/Library/Caches/ms-playwright/mcp-chrome-66c8354 -name "*.lock" -delete

# 4. Browser is now reset - ready for new session
```

### What It Preserves

✅ **Keeps**: Browser profile data (authentication sessions if saved)
✅ **Keeps**: Cookies, local storage (useful for testing)
❌ **Removes**: Stale process locks
❌ **Removes**: Hung browser instances

---

## 📊 Troubleshooting Decision Tree

```
Got "Browser already in use" error?
│
├─ Did you call browser_close() mid-session?
│  └─ YES → Don't do that! Use reset script and continue without closing
│
├─ Is this a new Claude session?
│  └─ YES → Previous session didn't clean up
│           → Run: ./scripts/playwright-mcp-reset.sh
│
├─ Are you running multiple Claude sessions?
│  └─ YES → Only use Playwright in ONE session at a time
│           → Close other sessions or use bash Playwright
│
└─ Still failing?
   └─ Manual cleanup:
      1. pkill -f "mcp-chrome-66c8354"
      2. Verify: ps aux | grep mcp-chrome (should be empty)
      3. Retry Playwright
```

---

## 🎯 Agent Protocol (Automatic Recovery)

### When Agent Encounters This Error

**Step 1: Detect Error**
```
If Playwright MCP returns "Browser is already in use":
```

**Step 2: Auto-Reset**
```bash
# Agent should automatically run reset script
./scripts/playwright-mcp-reset.sh
```

**Step 3: Retry Operation**
```typescript
// Retry the failed operation
mcp__playwright__browser_navigate({ url: originalUrl })
```

**Step 4: Report to User**
```
⚠️ Playwright browser was reset due to stale process.
✅ Retried successfully. Continuing with visual testing...
```

---

## 📝 Example: Full Testing Session (Correct Way)

```bash
# Start of Claude session
echo "Starting visual testing session..."

# Detect port (once)
PORT=$(./scripts/playwright-with-port.sh)

# Navigate to multiple pages (browser stays open)
mcp__playwright__browser_navigate({ url: `http://localhost:${PORT}` })
mcp__playwright__browser_take_screenshot({ filename: "landing.png" })

mcp__playwright__browser_navigate({ url: `http://localhost:${PORT}/dashboard` })
mcp__playwright__browser_take_screenshot({ filename: "dashboard.png" })

mcp__playwright__browser_navigate({ url: `http://localhost:${PORT}/contribute` })
mcp__playwright__browser_take_screenshot({ filename: "contribute.png" })

# ✅ DON'T call browser_close() - let Claude session handle cleanup

# End of Claude session - browser closes automatically
```

---

## 🔍 Debugging Commands

### Check if Browser is Running

```bash
# List MCP Chrome processes
ps aux | grep "mcp-chrome-66c8354" | grep -v grep

# Count processes
pgrep -f "mcp-chrome-66c8354" | wc -l
# Output: 0 = no processes (good)
# Output: 10+ = browser running
```

### Check Browser Remote Debugging Port

```bash
# Find browser debugging port
lsof -i -P | grep "Chrome" | grep LISTEN | grep 615

# Example output:
# Google    10099  user   27u  IPv4  ...  TCP *:61557 (LISTEN)
# Port 61557 = browser is running and debuggable
```

### Check Browser Lock Files

```bash
# List lock files
find ~/Library/Caches/ms-playwright/mcp-chrome-66c8354 -name "*.lock"

# If many lock files exist = stale locks
```

---

## 🎓 Understanding Browser Persistence

### Why Persistent Browser?

**Advantages**:
1. **Faster**: Don't relaunch browser for every tool call (60% faster)
2. **Session continuity**: Authentication persists across navigations
3. **State preservation**: Cookies, local storage maintained
4. **Better UX**: Smoother testing experience

**Trade-off**:
- Browser stays running until Claude session ends
- Can cause "already in use" errors if not managed properly

### When Browser Closes

**Automatic Cleanup** (Normal):
- Claude Code session ends (you close terminal/tab)
- Claude Code crashes
- User explicitly closes Claude

**Manual Cleanup** (Error Recovery):
- `./scripts/playwright-mcp-reset.sh` (recommended)
- `pkill -f "mcp-chrome-66c8354"` (manual)

---

## 📚 Related Documentation

- **`.claude/guides/playwright-dynamic-port.md`** - Dynamic port detection
- **`.claude/guides/mcp-playwright-auth.md`** - Authentication workflow
- **`.claude/core/agents/frontend.md`** - Frontend agent visual testing
- **`scripts/playwright-mcp-reset.sh`** - Reset script source

---

## ✅ Quick Reference

| Situation | Command | Expected Result |
|-----------|---------|-----------------|
| Got "browser in use" error | `./scripts/playwright-mcp-reset.sh` | ✅ Browser reset, ready to use |
| Starting new Claude session | `./scripts/playwright-mcp-reset.sh` | ✅ Clean slate (optional but recommended) |
| End of testing session | Nothing (let Claude handle cleanup) | ✅ Browser closes automatically |
| Multiple pages needed | `mcp__playwright__browser_tabs()` | ✅ Use tabs, not browser_close() |

---

## 🎉 Summary

### The Error Means:

> "A Playwright browser process is already running and locked. Can't start a new one."

### Common Causes:

1. Called `browser_close()` mid-session ← **Most common**
2. Stale browser from previous session
3. Multiple Claude sessions using Playwright

### The Fix:

```bash
# One command to rule them all
./scripts/playwright-mcp-reset.sh
```

### Prevention:

- **Don't call `browser_close()`** unless absolutely necessary
- **Let Claude manage browser lifecycle** - it's automatic
- **Use tabs** for multiple pages in same session
- **Run reset script** at start of new session (optional preventive measure)

---

**Status**: ✅ Documented with Solution
**Framework Version**: v1.6.1
**Last Updated**: 2025-10-18
