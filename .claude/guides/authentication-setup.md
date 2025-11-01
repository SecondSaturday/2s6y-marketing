# Authentication Setup Guide

**Framework Version**: v1.6.1
**Auth Provider**: Clerk
**Last Updated**: 2025-10-18

---

## 🔐 Test User Credentials

### Primary Test Account

**Email**: `calyanv12@outlook.com`
**Password**: `Aloha234%`

**Source**: `.env.local` (lines 26-27)
```bash
TEST_USER_EMAIL=calyanv12@outlook.com
TEST_USER_PASSWORD=Aloha234%
```

**Clerk Dashboard**: https://dashboard.clerk.com
**Organization**: live-satyr-2.clerk.accounts.dev

---

## 🎯 How Authentication Works

### Two Different Auth Workflows

#### 1. **Bash Playwright Tests** (Automated - Recommended for CI/CD)

**Setup File**: `tests/auth.setup.ts`

**Workflow**:
```bash
# First time running Playwright tests
npx playwright test

# What happens automatically:
1. ✅ Detects dev server port dynamically (port 3000 currently)
2. ✅ Navigates to /dashboard (redirects to Clerk sign-in)
3. ✅ Fills email: calyanv12@outlook.com (from .env.local)
4. ✅ Clicks "Continue"
5. ✅ Waits for password field
6. ✅ Fills password: Aloha234% (from .env.local)
7. ✅ Clicks "Sign in"
8. ✅ Waits for dashboard to load (verifies success)
9. ✅ Saves session to playwright/.auth/user.json
10. ✅ Future tests reuse saved session (no re-authentication)
```

**Saved Session**: `playwright/.auth/user.json`
**Last Updated**: Oct 15, 10:36am
**Size**: 10.8 KB

**Advantages**:
- ✅ Fully automated (no manual intervention)
- ✅ Session persists across test runs
- ✅ Fast (reuses saved session)
- ✅ Supports parallel builds (dynamic port detection)
- ✅ CI/CD ready

**Test Output** (from latest run):
```
🔐 Starting automated Clerk authentication...
📧 Email: calyanv12@outlook.com
📍 Navigating to /dashboard (port 3000)...
✉️  Filling email...
➡️  Clicking Continue...
⏳ Waiting for password field...
🔑 Filling password...
➡️  Clicking Continue...
⏳ Waiting for dashboard to load...
✅ Successfully authenticated!
💾 Saving session to: /Users/.../playwright/.auth/user.json

🎉 Authentication setup complete!
   Future test runs will use this saved session.

1 passed (5.0s)
```

---

#### 2. **MCP Playwright** (Manual - Interactive Testing)

**Workflow**:
```typescript
// First navigation to protected route
PORT=$(./scripts/playwright-with-port.sh)
mcp__playwright__browser_navigate({
  url: `http://localhost:${PORT}/dashboard`
})

// Browser redirects to Clerk sign-in
mcp__playwright__browser_snapshot()  // Shows Clerk sign-in form

// Option A: Agent auto-fills test credentials (if authorized)
mcp__playwright__browser_type({
  element: "Email input",
  ref: "input[name='identifier']",
  text: "calyanv12@outlook.com"
})

mcp__playwright__browser_click({
  element: "Continue button",
  ref: "button:has-text('Continue')"
})

// Wait for password field
mcp__playwright__browser_wait_for({ text: "Password" })

mcp__playwright__browser_type({
  element: "Password input",
  ref: "input[name='password']",
  text: "Aloha234%"
})

mcp__playwright__browser_click({
  element: "Sign in button",
  ref: "button:has-text('Continue')"
})

// Wait for dashboard
mcp__playwright__browser_wait_for({ text: "My Groups" })

// ✅ Now authenticated - session persists for entire Claude session!
```

**Advantages**:
- ✅ Interactive (can test as different users)
- ✅ Session persists within Claude session
- ✅ Fast for visual testing
- ✅ Flexible (can sign in as any user)

**Disadvantages**:
- ⚠️ Requires manual sign-in each Claude session
- ⚠️ Not suitable for batch tests

---

## 🔧 Configuration

### Environment Variables (`.env.local`)

**Clerk Keys**:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bGl2ZS1zYXR5ci0yLmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_kABsc5ZD3p5wKpq53oyi7CGkhzo5qOWgE4WoiasqUs
CLERK_JWT_ISSUER_DOMAIN=https://live-satyr-2.clerk.accounts.dev
```

**Test Credentials**:
```bash
TEST_USER_EMAIL=calyanv12@outlook.com
TEST_USER_PASSWORD=Aloha234%
```

**Clerk Routing** (Custom Pages):
```bash
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/signin
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

---

### Playwright Configuration (`playwright.config.ts`)

**Storage State** (Saved Session):
```typescript
export default defineConfig({
  projects: [
    // Setup project - runs first
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // Tests use saved session
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json'  // Reuse saved session
      },
      dependencies: ['setup'],
    },
  ],
})
```

---

## 🚀 Usage Examples

### Running Tests with Auth

**First Time** (Creates Session):
```bash
# Runs auth.setup.ts, signs in, saves session
npx playwright test

# Output:
# ✅ Successfully authenticated!
# 💾 Saving session to: playwright/.auth/user.json
```

**Subsequent Runs** (Reuses Session):
```bash
# All tests use saved session (no re-authentication)
npx playwright test tests/e2e/

# Fast! No sign-in needed
```

---

### Regenerating Session (If Expired)

```bash
# Delete old session
rm playwright/.auth/user.json

# Run setup again
npx playwright test --project=setup

# New session saved
```

---

### Testing as Different User

**Option 1: Update .env.local** (Permanent)
```bash
# Edit .env.local
TEST_USER_EMAIL=newuser@example.com
TEST_USER_PASSWORD=NewPassword123!

# Regenerate session
rm playwright/.auth/user.json
npx playwright test --project=setup
```

**Option 2: Use Environment Variables** (Temporary)
```bash
# Override for single test run
TEST_USER_EMAIL=admin@example.com \
TEST_USER_PASSWORD=AdminPass123 \
npx playwright test --project=setup
```

**Option 3: MCP Playwright** (Interactive)
```typescript
// Sign in as different user during Claude session
mcp__playwright__browser_type({
  element: "Email input",
  ref: "input[name='identifier']",
  text: "differentuser@example.com"
})
// ... continue sign-in flow
```

---

## 🛡️ Security Best Practices

### ✅ DO

1. **Use Dedicated Test Account**
   - ✅ `calyanv12@outlook.com` is a dedicated test account
   - ✅ Never use production user accounts for testing

2. **Environment Variables**
   - ✅ Store credentials in `.env.local` (gitignored)
   - ✅ Use `process.env.TEST_USER_EMAIL` in code
   - ✅ Never commit credentials to git

3. **Session Files**
   - ✅ Gitignore `playwright/.auth/` directory
   - ✅ Regenerate session periodically (every 30 days)
   - ✅ Delete session after major auth changes

4. **Clerk Dashboard**
   - ✅ Use Clerk development keys (not production)
   - ✅ Monitor test account activity
   - ✅ Enable 2FA for production Clerk account (not test user)

---

### ❌ DON'T

1. **Never Commit**
   - ❌ Don't commit `.env.local` (already in .gitignore ✅)
   - ❌ Don't commit `playwright/.auth/user.json` (already in .gitignore ✅)
   - ❌ Don't hardcode credentials in test files

2. **Never Use Production**
   - ❌ Don't test with real user accounts
   - ❌ Don't use production Clerk keys in `.env.local`
   - ❌ Don't share test credentials with unauthorized users

3. **Never Expose**
   - ❌ Don't log passwords in console (auth.setup.ts only logs email ✅)
   - ❌ Don't include credentials in error messages
   - ❌ Don't share session files

---

## 🔍 Troubleshooting

### Issue: "Missing test credentials" Error

**Error**:
```
❌ Missing test credentials!
Please set TEST_USER_EMAIL and TEST_USER_PASSWORD in .env.local
```

**Cause**: `.env.local` missing or credentials not set

**Fix**:
```bash
# Verify .env.local exists
cat .env.local | grep TEST_USER

# Should show:
# TEST_USER_EMAIL=calyanv12@outlook.com
# TEST_USER_PASSWORD=Aloha234%

# If missing, add them to .env.local
```

---

### Issue: Authentication Timeout

**Error**:
```
⏱️  Timeout Error
```

**Causes & Fixes**:

1. **Dev server not running**
   ```bash
   # Check if running
   curl -I http://localhost:3000

   # Start if needed
   npm run dev
   ```

2. **Wrong port**
   ```bash
   # Verify port detection
   ./scripts/playwright-with-port.sh
   # Should output: 3000
   ```

3. **Clerk configuration issue**
   ```bash
   # Verify Clerk keys in .env.local
   echo $NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

   # Should not be empty
   ```

---

### Issue: "Invalid credentials" or Sign-In Fails

**Causes & Fixes**:

1. **Incorrect password**
   ```bash
   # Verify credentials in .env.local match Clerk dashboard
   cat .env.local | grep TEST_USER

   # Test sign-in manually at:
   # http://localhost:3000/sign-in
   ```

2. **Test user doesn't exist in Clerk**
   - Go to https://dashboard.clerk.com
   - Navigate to Users
   - Verify `calyanv12@outlook.com` exists
   - If not, create user with password `Aloha234%`

3. **Session expired**
   ```bash
   # Regenerate session
   rm playwright/.auth/user.json
   npx playwright test --project=setup
   ```

---

### Issue: "Browser already in use" During Auth Setup

**Error**:
```
Error: Browser is already in use for /Users/.../mcp-chrome-66c8354
```

**Fix**:
```bash
# Reset Playwright browsers
./scripts/playwright-mcp-reset.sh

# Retry auth setup
npx playwright test --project=setup
```

---

## 📊 Authentication Architecture

### Flow Diagram

```
User runs Playwright test
    ↓
Check if playwright/.auth/user.json exists
    ↓
    ├─ YES → Load saved session (skip sign-in)
    │         ↓
    │         Run test with authenticated session
    │
    └─ NO → Run tests/auth.setup.ts
            ↓
            1. Detect dev server port (dynamic)
            2. Navigate to /dashboard (→ Clerk sign-in)
            3. Fill email from TEST_USER_EMAIL
            4. Click Continue
            5. Wait for password field
            6. Fill password from TEST_USER_PASSWORD
            7. Click Sign in
            8. Wait for dashboard (verify auth)
            9. Save session to user.json
            ↓
            Run test with new session
```

---

### Session Lifecycle

```
npx playwright test (first run)
    ↓
auth.setup.ts runs
    ↓
Sign in with test credentials
    ↓
Session saved to user.json (10.8 KB)
    ↓
Tests run with session
    ↓
Session valid for ~30 days
    ↓
(After 30 days or Clerk changes)
    ↓
Delete user.json, re-run setup
```

---

## 🎯 Quick Reference

| Task | Command | Auth Method |
|------|---------|-------------|
| Run all tests (auto-auth) | `npx playwright test` | Bash (saved session) |
| Regenerate session | `rm playwright/.auth/user.json && npx playwright test --project=setup` | Bash |
| Test as different user | Update `.env.local` → regenerate session | Bash |
| Visual testing (MCP) | `mcp__playwright__browser_navigate` → manual sign-in | MCP (manual) |
| Check saved session | `ls -l playwright/.auth/user.json` | N/A |
| Verify credentials | `cat .env.local \| grep TEST_USER` | N/A |

---

## 📚 Related Documentation

- **`.claude/guides/mcp-playwright-auth.md`** - MCP Playwright authentication workflow
- **`.claude/guides/playwright-dynamic-port.md`** - Dynamic port detection
- **`tests/auth.setup.ts`** - Automated auth setup script
- **`playwright.config.ts`** - Playwright configuration with storage state

---

## ✅ Summary

### Test User

**Email**: `calyanv12@outlook.com`
**Password**: `Aloha234%`
**Source**: `.env.local` (environment variables)

### Bash Playwright

✅ **Fully automated** - no manual intervention
✅ **Session saved** to `playwright/.auth/user.json`
✅ **Dynamic port detection** - works with parallel builds
✅ **5-second setup** - regenerate session anytime

### MCP Playwright

✅ **Interactive** - manual sign-in each session
✅ **Flexible** - test as any user
✅ **Persistent** - session lasts entire Claude session

---

**Status**: ✅ Production Ready
**Framework Version**: v1.6.1
**Auth Provider**: Clerk
**Test Account**: Dedicated test user (not production)
