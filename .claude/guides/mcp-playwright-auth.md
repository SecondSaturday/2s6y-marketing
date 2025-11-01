# MCP Playwright Authentication Guide

**Framework Version**: v1.6.1 (Dynamic Port Detection)
**Created**: 2025-10-13
**Updated**: 2025-10-18
**Status**: Production Ready

---

## ⚠️ CRITICAL: Dynamic Port Detection Required

**ALL agents MUST use dynamic port detection before Playwright MCP.**

```bash
# Get port dynamically (REQUIRED)
PORT=$(./scripts/playwright-with-port.sh)

# Or get full URL
URL=$(./scripts/playwright-with-port.sh --url /dashboard)
```

**See**: `.claude/guides/playwright-dynamic-port.md` for complete guide.

**Why**: Dev servers run on different ports (main: 3000, feature branch-1: 3001, etc.). Hardcoding breaks parallel builds.

---

## Overview

This guide explains how to handle authentication when using **Playwright MCP** for visual testing with Clerk-protected routes. Critical for TDD workflows where agents need to test authenticated pages.

---

## 🎯 Quick Decision Tree

```
Does the page require authentication?
│
├─ NO → Use MCP Playwright directly (no auth needed)
│         ├─ Landing page (/): ✅ No auth
│         ├─ Public pages: ✅ No auth
│         └─ Sign-in page (/sign-in): ✅ No auth
│
└─ YES → Choose approach:
          │
          ├─ PREFERRED: MCP Playwright (sign in once per session)
          │   - Fast (60% faster than bash)
          │   - Interactive
          │   - Session persists across tool calls
          │   - Use for: Visual testing, component screenshots, E2E flows
          │
          └─ FALLBACK: Bash Playwright (automated test suite)
              - Uses auth.setup.ts (one-time manual sign-in)
              - Slower but fully automated
              - Use for: CI/CD, batch testing, regression suites
```

---

## 🔐 Method 1: MCP Playwright (Preferred for Agents)

### How It Works

**Key Insight**: MCP Playwright maintains a **persistent browser context** within a Claude session. Once you sign in, the session **stays authenticated** for all subsequent tool calls.

### Workflow

#### Step 1: Sign In Once Per Claude Session

```bash
# FIRST: Get port dynamically
PORT=$(./scripts/playwright-with-port.sh)
```

```typescript
// 1. Navigate to a protected route (will redirect to Clerk sign-in)
mcp__playwright__browser_navigate({
  url: `http://localhost:${PORT}/dashboard`
})

// 2. Snapshot to see current page (will show Clerk sign-in)
mcp__playwright__browser_snapshot()

// 3. Fill in test credentials
mcp__playwright__browser_type({
  element: "Email input",
  ref: "input[name='identifier']",
  text: "test@example.com"
})

mcp__playwright__browser_click({
  element: "Continue button",
  ref: "button[type='submit']"
})

// 4. Wait for password field
mcp__playwright__browser_wait_for({
  text: "Password"
})

mcp__playwright__browser_type({
  element: "Password input",
  ref: "input[name='password']",
  text: "your-test-password"
})

mcp__playwright__browser_click({
  element: "Sign in button",
  ref: "button[type='submit']"
})

// 5. Wait for successful redirect to dashboard
mcp__playwright__browser_wait_for({
  text: "My Groups"  // Or any text that confirms dashboard loaded
})

// ✅ NOW AUTHENTICATED - Session persists for rest of Claude session!
```

#### Step 2: Access All Protected Routes

```typescript
// Navigate to any protected route - already authenticated!
// PORT was detected earlier, reuse it
mcp__playwright__browser_navigate({
  url: `http://localhost:${PORT}/groups/abc123/settings`
})

// Take screenshot
mcp__playwright__browser_take_screenshot({
  filename: "group-settings-desktop.png"
})

// Navigate to another protected route
mcp__playwright__browser_navigate({
  url: `http://localhost:${PORT}/contribute`
})

// Still authenticated - take another screenshot
mcp__playwright__browser_take_screenshot({
  filename: "contribute-form-desktop.png"
})
```

### When Session Ends

**Session persists until**:
- You close Claude Code / restart conversation
- You explicitly call `mcp__playwright__browser_close()`
- Browser times out (rare)

**To re-authenticate**: Repeat Step 1 in new Claude session.

---

## 📋 Agent Protocol: MCP Auth Workflow

### When Agent Receives Task with Protected Route

**Example Task**: "Take screenshots of the group settings page at 3 breakpoints"

**Agent Workflow**:

```markdown
1. Check if route requires auth:
   - /dashboard → YES (protected)
   - /groups/:id → YES (protected)
   - /contribute → YES (protected)
   - / (landing) → NO (public)

2. If YES, check if already authenticated:
   - Try navigating to route
   - Take snapshot
   - Check if Clerk sign-in page appears

3a. If NOT authenticated (sign-in page appears):
    → Follow "Step 1: Sign In Once" workflow above

3b. If ALREADY authenticated (route loads):
    → Skip to Step 2, proceed with testing

4. Complete testing task (screenshots, interactions, etc.)

5. Report results to user
```

### Example: Frontend Agent Visual Testing

```bash
# FIRST: Detect port
PORT=$(./scripts/playwright-with-port.sh)
```

```typescript
// Task: Screenshot group settings page

// Step 1: Navigate and check auth
await mcp__playwright__browser_navigate({
  url: `http://localhost:${PORT}/groups/test-group-id/settings`
})

await mcp__playwright__browser_snapshot()

// If snapshot shows Clerk sign-in:
// → STOP and inform user:
"⚠️ This route requires authentication. I need test credentials to proceed.

**Option 1 (Recommended)**: Provide test credentials now:
- Email: test@example.com
- Password: (your test password)
I'll sign in once and complete all visual tests.

**Option 2**: Use bash Playwright with saved session:
`npx playwright test tests/group-settings.spec.ts`

Which would you prefer?"

// If snapshot shows settings page content:
// → CONTINUE with testing
"✅ Already authenticated. Proceeding with visual tests..."

await mcp__playwright__browser_resize({ width: 1440, height: 900 })
await mcp__playwright__browser_take_screenshot({
  filename: "group-settings-desktop.png"
})
```

---

## 🔧 Method 2: Bash Playwright (Automated Test Suites)

### How It Works

Uses **`tests/auth.setup.ts`** to handle authentication once, saves session to `playwright/.auth/user.json`, then reuses for all tests.

### Setup (One-Time Manual Sign-In)

```bash
# First time running tests
npx playwright test

# Browser window opens (headed mode)
# Manually sign in with test credentials
# Session saves to playwright/.auth/user.json
# Future tests use saved session automatically
```

### Usage

```bash
# All tests use authenticated session
npx playwright test tests/visual/group-settings.spec.ts

# Multiple tests run with same session
npx playwright test tests/e2e/
```

### When To Use

✅ **Use bash Playwright when**:
- Running batch test suites (10+ tests)
- CI/CD automation (no interactive sign-in)
- Test files that already use `auth.setup.ts`
- Regression testing

❌ **Don't use bash Playwright when**:
- Taking quick screenshots (MCP is faster)
- Interactive debugging
- Single component visual test
- Need to test as different user (MCP more flexible)

---

## 🆚 Comparison: MCP vs Bash Playwright

| Feature | MCP Playwright | Bash Playwright |
|---------|----------------|-----------------|
| **Speed** | ✅ 60% faster | ⚠️ Slower (spawn process) |
| **Auth Setup** | Manual once per session | One-time manual setup |
| **Session Persistence** | Within Claude session | Saved to file (persistent) |
| **Interactive** | ✅ Yes | ❌ No |
| **CI/CD Ready** | ❌ No (requires interaction) | ✅ Yes (automated) |
| **Best For** | Quick visual tests, screenshots | Batch tests, automation |
| **Test Different Users** | ✅ Easy (sign in as different user) | ⚠️ Harder (need multiple session files) |
| **Agent Preferred** | ✅ **YES** (faster, interactive) | Use for batch only |

---

## 🎯 When Agents Should Use Each Method

### Use MCP Playwright (Preferred)

**Scenarios**:
1. **Visual testing** (screenshots at 3 breakpoints)
2. **Component inspection** (checking design system compliance)
3. **Interactive debugging** (click, fill, navigate)
4. **Single page testing** (one route, quick validation)
5. **Cross-user testing** (sign in as different users)

**Example**:
```
User: "Take screenshots of the contribution form at 3 breakpoints"
Frontend Agent: Uses MCP Playwright (faster, interactive)
```

### Use Bash Playwright

**Scenarios**:
1. **Running test files** already written (e.g., `tests/e2e/newsletter.spec.ts`)
2. **Batch testing** (10+ test cases at once)
3. **Regression suites** (automated, no interaction)
4. **CI/CD workflows** (GitHub Actions)

**Example**:
```
User: "Run all E2E tests for the newsletter feature"
Backend/Orchestrator Agent: Uses bash Playwright (full test suite)
```

---

## 🧪 Testing Scenarios

### Scenario 1: Screenshot Protected Route (MCP)

**Task**: Screenshot group settings page at 3 breakpoints

**Agent Workflow**:
```typescript
// FIRST: Detect port
const PORT = execSync('./scripts/playwright-with-port.sh').toString().trim()

// 1. Sign in if needed (check snapshot first)
mcp__playwright__browser_navigate({ url: `http://localhost:${PORT}/dashboard` })
// ... sign in workflow if needed ...

// 2. Navigate to settings
mcp__playwright__browser_navigate({
  url: `http://localhost:${PORT}/groups/abc123/settings`
})

// 3. Take 3 screenshots
const breakpoints = [
  { width: 1440, height: 900, name: "desktop" },
  { width: 768, height: 1024, name: "tablet" },
  { width: 375, height: 667, name: "mobile" }
]

for (const bp of breakpoints) {
  mcp__playwright__browser_resize(bp)
  mcp__playwright__browser_take_screenshot({
    filename: `group-settings-${bp.name}.png`
  })
}

// ✅ Complete - 3 screenshots taken
```

---

### Scenario 2: Test Form Submission (MCP)

**Task**: Test contribution form saves correctly

**Agent Workflow**:
```bash
# FIRST: Detect port
PORT=$(./scripts/playwright-with-port.sh)
```

```typescript
// 1. Navigate to form (authenticated)
mcp__playwright__browser_navigate({
  url: `http://localhost:${PORT}/contribute`
})

// 2. Fill form
mcp__playwright__browser_fill_form({
  fields: [
    { name: "Prompt 1", type: "textbox", ref: "[data-prompt='1']", value: "Test update" },
    { name: "Prompt 3", type: "textbox", ref: "[data-prompt='3']", value: "Good thing" }
  ]
})

// 3. Submit
mcp__playwright__browser_click({
  element: "Submit button",
  ref: "[data-action='submit']"
})

// 4. Verify success
mcp__playwright__browser_wait_for({ text: "Contribution saved" })

// 5. Screenshot success state
mcp__playwright__browser_take_screenshot({
  filename: "contribute-success.png"
})
```

---

### Scenario 3: Run E2E Test Suite (Bash)

**Task**: Verify entire newsletter generation flow

**Agent Workflow**:
```bash
# Use bash Playwright for full E2E test
npx playwright test tests/e2e/newsletter-generation.spec.ts

# Test file uses auth.setup.ts automatically
# Multiple test cases run with same session
# Results reported
```

---

## 🚨 Troubleshooting

### Problem: "Session expired" mid-testing

**Cause**: Clerk session timeout (rare)

**Fix**:
```typescript
// Re-authenticate
mcp__playwright__browser_navigate({ url: "http://localhost:3001/dashboard" })
// ... repeat sign-in workflow ...
```

---

### Problem: "Wrong user signed in"

**Cause**: MCP session has different user than expected

**Fix**:
```bash
# FIRST: Detect port
PORT=$(./scripts/playwright-with-port.sh)
```

```typescript
// 1. Sign out first
mcp__playwright__browser_navigate({ url: `http://localhost:${PORT}` })
mcp__playwright__browser_click({
  element: "User menu",
  ref: "[data-user-menu]"
})
mcp__playwright__browser_click({
  element: "Sign out",
  ref: "[data-action='sign-out']"
})

// 2. Sign in as correct user
// ... follow sign-in workflow with correct credentials ...
```

---

### Problem: "Clerk sign-in page keeps appearing"

**Cause**: Session not persisting (cookies disabled or MCP issue)

**Fix 1**: Use bash Playwright instead
```bash
npx playwright test tests/your-test.spec.ts
```

**Fix 2**: Use dynamic port detection
```bash
# Detect actual port (don't hardcode)
PORT=$(./scripts/playwright-with-port.sh)
echo "Dev server running on port: $PORT"
```

```typescript
// Use detected port
mcp__playwright__browser_navigate({
  url: `http://localhost:${PORT}`
})
```

---

### Problem: "playwright/.auth/user.json missing"

**Cause**: Haven't run auth.setup.ts yet

**Fix**:
```bash
# Run test once to trigger auth setup
npx playwright test

# Headed browser opens
# Sign in manually
# Session saves for future use
```

---

## 📝 Agent Checklist: MCP Auth Testing

Before starting visual tests, agents should:

- [ ] Determine if route requires authentication
- [ ] Check if already authenticated (take snapshot)
- [ ] If not authenticated:
  - [ ] Ask user for test credentials OR
  - [ ] Use bash Playwright if credentials unavailable
- [ ] Sign in once per Claude session (if using MCP)
- [ ] Proceed with testing (screenshots, interactions)
- [ ] Report results with authentication status

---

## 🎯 Best Practices

### For Frontend Agent

1. **Always check auth first**: Take snapshot before proceeding
2. **Ask for credentials once**: Don't ask repeatedly per test
3. **Prefer MCP over bash**: Faster for visual testing
4. **Document which user**: If testing as specific user, note in report

### For Backend Agent

1. **No auth needed**: Backend unit tests don't require browser auth
2. **Use bash for E2E**: If writing E2E test files, use bash Playwright

### For Orchestrator

1. **Coordinate auth once**: If multiple agents need auth, handle sign-in in orchestrator
2. **Pass session info**: Tell agents session is ready, no need to re-auth
3. **Use bash for integration tests**: Full test suites run via bash

---

## 🔒 Security Notes

### Test Credentials

- ✅ **DO**: Use dedicated test account (test@example.com)
- ✅ **DO**: Store test password in .env.local (never commit)
- ❌ **DON'T**: Use production user accounts
- ❌ **DON'T**: Commit credentials to git

### Session Files

- ✅ **DO**: Gitignore `playwright/.auth/` directory
- ✅ **DO**: Regenerate session periodically (every 30 days)
- ❌ **DON'T**: Share session files
- ❌ **DON'T**: Use production sessions in dev

---

## 📚 Related Documentation

- **Playwright MCP Overview**: `.claude/claude.md` (MCP Server Integration section)
- **Frontend Agent Protocol**: `.claude/agents/frontend-dev.md`
- **Testing Guide**: `.claude/guides/testing.md` (TDD workflows)
- **Auth Setup File**: `tests/auth.setup.ts` (bash Playwright auth)
- **Playwright Config**: `playwright.config.ts` (storage state config)

---

## 🎉 Summary

### Quick Reference

**Protected Route Testing**:
```typescript
// Option 1: MCP (preferred for agents - fast, interactive)
1. Navigate to protected route
2. If sign-in appears, authenticate once
3. Session persists - test all routes
4. Complete when Claude session ends

// Option 2: Bash (batch tests, CI/CD)
1. Run: npx playwright test
2. Sign in manually (first time only)
3. Session saves to file
4. All future tests use saved session
```

**Agent Decision**:
- Single test / screenshot → **MCP Playwright** ✅
- Test suite / CI/CD → **Bash Playwright** ✅

---

**Framework Version**: v1.4.1 (Authentication Enhancement)
**Last Updated**: 2025-10-13
**Maintained By**: Agentic Framework Team
