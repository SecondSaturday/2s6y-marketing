# Playwright MCP Mandatory Protocol

**Framework Version**: v1.6.1
**Status**: MANDATORY - All agents MUST follow this protocol
**Last Updated**: 2025-10-18

---

## ⚠️ CRITICAL RULE

**ALL agents MUST follow this exact workflow before using any Playwright MCP tools.**

**Violation = Framework non-compliance = Agent must retry with correct protocol.**

---

## 📋 Pre-Flight Checklist (MANDATORY)

Before EVERY Playwright MCP session, agents MUST complete these steps in order:

### ✅ Step 1: Reset Browser (First MCP Call in Session)

**When**: At the START of every Claude session that uses Playwright MCP

**Command**:
```bash
./scripts/playwright-mcp-reset.sh
```

**Expected Output**:
```
🔄 Resetting Playwright MCP browser...
✅ Killed N stale browser process(es)
✅ Cleaned browser lock files
✅ Playwright MCP reset complete! You can now use mcp__playwright__ tools.
```

**Why**: Prevents "Browser already in use" errors from previous sessions

**Skip if**: This is the first Playwright MCP call after a verified successful navigation (session already clean)

---

### ✅ Step 2: Detect Port Dynamically (EVERY Session)

**When**: ALWAYS, before ANY `mcp__playwright__browser_navigate` call

**Command**:
```bash
PORT=$(./scripts/playwright-with-port.sh)
echo "✅ Detected dev server on port: $PORT"
```

**Expected Output**:
```
✅ Detected dev server on port: 3000
```

**Error Handling**:
```bash
# If no dev server found:
ERROR: No Next.js dev server found. Please start with 'npm run dev'

# Action: Start dev server first
npm run dev &
sleep 10
PORT=$(./scripts/playwright-with-port.sh)
```

**Why**: Supports parallel builds, prevents hardcoded port errors

**NEVER**: Use hardcoded ports like `localhost:3000` or `localhost:3001`

---

### ✅ Step 3: Navigate with Dynamic Port

**When**: For EVERY navigation

**Correct**:
```typescript
// Use detected PORT variable
mcp__playwright__browser_navigate({
  url: `http://localhost:${PORT}/dashboard`
})
```

**WRONG** (Framework Violation):
```typescript
// ❌ NEVER hardcode ports
mcp__playwright__browser_navigate({
  url: "http://localhost:3000/dashboard"  // WRONG!
})
```

**Alternative** (One-liner):
```bash
# Get full URL in one command
URL=$(./scripts/playwright-with-port.sh --url /dashboard)

# Use directly
mcp__playwright__browser_navigate({ url: "${URL}" })
```

---

### ✅ Step 4: Handle Authentication (Protected Routes Only)

**When**: Navigating to protected routes (`/dashboard`, `/contribute`, `/groups/:id`, etc.)

**Check if auth required**:
```typescript
// After navigation, check if Clerk sign-in appears
mcp__playwright__browser_snapshot()

// Look for "Sign in to 2s6y" heading or Clerk sign-in form
```

**If auth needed**:
```typescript
// Fill test credentials from .env.local
mcp__playwright__browser_type({
  element: "Email address or username",
  ref: "<ref from snapshot>",
  text: "calyanv12@outlook.com"  // TEST_USER_EMAIL
})

mcp__playwright__browser_click({
  element: "Continue button",
  ref: "<ref from snapshot>"
})

// Wait for password field
mcp__playwright__browser_wait_for({ text: "Password" })

mcp__playwright__browser_type({
  element: "Password",
  ref: "<ref from snapshot>",
  text: "Aloha234%"  // TEST_USER_PASSWORD
})

mcp__playwright__browser_click({
  element: "Sign in button",
  ref: "<ref from snapshot>"
})

// Wait for successful auth (dashboard loads)
mcp__playwright__browser_wait_for({ text: "My Groups" })

// ✅ Now authenticated - session persists for entire Claude session!
```

**If already authenticated**:
```
✅ Page loaded without sign-in prompt
→ Session active, proceed with testing
```

**Why**: Session persists across all navigations in same Claude session

---

### ✅ Step 5: Continue Testing (Session Active)

**When**: After initial auth, for rest of Claude session

**No re-authentication needed**:
```typescript
// All subsequent navigations work automatically
mcp__playwright__browser_navigate({ url: `http://localhost:${PORT}/contribute` })
mcp__playwright__browser_take_screenshot({ filename: "contribute.png" })

mcp__playwright__browser_navigate({ url: `http://localhost:${PORT}/groups/abc123` })
mcp__playwright__browser_take_screenshot({ filename: "group-detail.png" })

// Session persists - no need to sign in again!
```

**Browser lifecycle**: Browser stays open until Claude session ends

---

## 🚫 NEVER Do These (Common Mistakes)

### ❌ 1. Hardcoding Ports
```typescript
// WRONG
mcp__playwright__browser_navigate({ url: "http://localhost:3000/..." })
mcp__playwright__browser_navigate({ url: "http://localhost:3001/..." })
```

### ❌ 2. Calling `browser_close()` Mid-Session
```typescript
// WRONG - Causes "Browser already in use" error
mcp__playwright__browser_navigate({ url: "..." })
mcp__playwright__browser_close()  // ❌ Don't do this!
mcp__playwright__browser_navigate({ url: "..." })  // ERROR!
```

### ❌ 3. Skipping Port Detection
```bash
# WRONG - Assumes port 3000
mcp__playwright__browser_navigate({ url: "http://localhost:3000/..." })

# CORRECT - Always detect
PORT=$(./scripts/playwright-with-port.sh)
mcp__playwright__browser_navigate({ url: `http://localhost:${PORT}/...` })
```

### ❌ 4. Skipping Browser Reset
```
# WRONG - Starting session without reset
# (May encounter "Browser already in use" error)

# CORRECT - Always reset at session start
./scripts/playwright-mcp-reset.sh
```

---

## 📝 Complete Workflow Template

**Copy this template for EVERY Playwright MCP session:**

```bash
# ========================================
# Playwright MCP Session Start
# ========================================

# Step 1: Reset browser (prevents stale processes)
./scripts/playwright-mcp-reset.sh

# Step 2: Detect dev server port
PORT=$(./scripts/playwright-with-port.sh)
echo "✅ Using port: $PORT"

# Step 3: Navigate to route
mcp__playwright__browser_navigate({
  url: `http://localhost:${PORT}/dashboard`
})

# Step 4: Check if auth needed
mcp__playwright__browser_snapshot()

# Step 5a: If auth needed, sign in
# (Use test credentials: calyanv12@outlook.com / Aloha234%)
# ... authentication flow ...

# Step 5b: If already authenticated, continue

# Step 6: Perform testing
mcp__playwright__browser_take_screenshot({
  filename: "my-test.png"
})

# ✅ Session complete
# Browser will close automatically when Claude session ends
```

---

## 🎯 Agent Enforcement

### Frontend Agent

**MUST** follow this protocol for:
- Visual testing (screenshots at 3 breakpoints)
- Component inspection
- Design system compliance checks
- Responsive design verification

**Protocol violation** = Agent restarts task with correct workflow

---

### Orchestrator Agent

**MUST** follow this protocol for:
- E2E testing coordination
- Cross-layer integration tests
- Full-stack feature verification

**Additional responsibility**: Coordinate port detection for multiple agents

---

### Strategic Planner

**No Playwright MCP usage** (planning only, no testing)

---

## 🔧 Error Recovery Protocol

### Error: "Browser is already in use"

**Automatic Recovery**:
```bash
# 1. Reset browser
./scripts/playwright-mcp-reset.sh

# 2. Retry failed operation
PORT=$(./scripts/playwright-with-port.sh)
mcp__playwright__browser_navigate({ url: `http://localhost:${PORT}/...` })
```

**Report to User**:
```
⚠️ Encountered "Browser already in use" error
✅ Auto-reset browser and retried
✅ Operation successful
```

---

### Error: "No Next.js dev server found"

**Automatic Recovery**:
```bash
# 1. Start dev server
npm run dev &

# 2. Wait for server
sleep 10

# 3. Verify and get port
PORT=$(./scripts/playwright-with-port.sh)

# 4. Retry operation
mcp__playwright__browser_navigate({ url: `http://localhost:${PORT}/...` })
```

**Report to User**:
```
⚠️ Dev server not running
✅ Started dev server (port ${PORT})
✅ Retrying operation
```

---

### Error: Authentication fails

**Troubleshooting**:
```
1. Verify test credentials in .env.local
2. Check Clerk configuration
3. Try manual sign-in at http://localhost:${PORT}/sign-in
4. Report issue to user if credentials invalid
```

**Do NOT**:
- Retry authentication indefinitely
- Ask user for credentials repeatedly
- Continue without authentication

---

## 📊 Session Checklist (Agent Self-Check)

Before reporting "task complete", agents MUST verify:

- [ ] Used dynamic port detection (not hardcoded ports)
- [ ] Reset browser at session start (if needed)
- [ ] Handled authentication correctly (if protected route)
- [ ] Did NOT call `browser_close()` mid-session
- [ ] Captured all required screenshots/snapshots
- [ ] Verified all tests passed
- [ ] No console errors in browser
- [ ] Reported results to user

---

## 🎓 Training Examples

### Example 1: Visual Testing (Correct)

```bash
# Task: Screenshot dashboard at 3 breakpoints

# Step 1: Reset
./scripts/playwright-mcp-reset.sh

# Step 2: Detect port
PORT=$(./scripts/playwright-with-port.sh)

# Step 3: Navigate
mcp__playwright__browser_navigate({ url: `http://localhost:${PORT}/dashboard` })

# Step 4: Auth (if needed)
# ... sign-in flow ...

# Step 5: Take screenshots
for breakpoint in "1440x900:desktop" "768x1024:tablet" "375x667:mobile"; do
  width=$(echo $breakpoint | cut -d'x' -f1)
  height=$(echo $breakpoint | cut -d'x' -f2 | cut -d':' -f1)
  name=$(echo $breakpoint | cut -d':' -f2)

  mcp__playwright__browser_resize({ width: $width, height: $height })
  mcp__playwright__browser_take_screenshot({ filename: "dashboard-${name}.png" })
done

# ✅ Complete - 3 screenshots captured
```

---

### Example 2: E2E Flow (Correct)

```bash
# Task: Test contribution submission flow

# Step 1: Reset
./scripts/playwright-mcp-reset.sh

# Step 2: Detect port
PORT=$(./scripts/playwright-with-port.sh)

# Step 3: Navigate to contribute page
mcp__playwright__browser_navigate({ url: `http://localhost:${PORT}/contribute` })

# Step 4: Auth (if needed)
# ... sign-in flow ...

# Step 5: Fill form
mcp__playwright__browser_type({
  element: "What did you do this month?",
  ref: "<ref>",
  text: "Test contribution"
})

# Step 6: Submit
mcp__playwright__browser_click({ element: "Save button", ref: "<ref>" })

# Step 7: Verify success
mcp__playwright__browser_wait_for({ text: "Saved successfully" })

# Step 8: Screenshot confirmation
mcp__playwright__browser_take_screenshot({ filename: "contribute-saved.png" })

# ✅ Complete - Flow verified
```

---

## 🚀 Quick Commands Reference

| Task | Command |
|------|---------|
| Reset browser | `./scripts/playwright-mcp-reset.sh` |
| Detect port | `PORT=$(./scripts/playwright-with-port.sh)` |
| Get full URL | `URL=$(./scripts/playwright-with-port.sh --url /path)` |
| Check test credentials | `cat .env.local \| grep TEST_USER` |
| Verify dev server | `curl -I http://localhost:${PORT}` |
| List browser processes | `ps aux \| grep mcp-chrome` |

---

## 📚 Related Documentation

- **`.claude/guides/playwright-dynamic-port.md`** - Dynamic port detection guide
- **`.claude/guides/playwright-mcp-browser-error.md`** - Browser error troubleshooting
- **`.claude/guides/mcp-playwright-auth.md`** - Authentication workflow
- **`.claude/guides/authentication-setup.md`** - Auth configuration
- **`.claude/core/agents/frontend.md`** - Frontend agent protocol

---

## ✅ Protocol Compliance Verification

**Before completing any Playwright MCP task, agents MUST answer YES to all:**

1. Did you reset the browser at session start? **YES/NO**
2. Did you detect the port dynamically? **YES/NO**
3. Did you use `${PORT}` variable (not hardcoded port)? **YES/NO**
4. Did you handle authentication if needed? **YES/NO**
5. Did you avoid calling `browser_close()` mid-session? **YES/NO**
6. Did all operations complete without errors? **YES/NO**

**If ANY answer is NO**: Agent must retry task with correct protocol.

---

**Status**: ✅ MANDATORY PROTOCOL
**Framework Version**: v1.6.1
**Enforcement**: Strict - No exceptions allowed
**Last Updated**: 2025-10-18

**Violation Consequence**: Task retry with corrected workflow
