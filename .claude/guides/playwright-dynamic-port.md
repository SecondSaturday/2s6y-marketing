# Playwright MCP with Dynamic Port Detection

**Problem**: Dev servers run on different ports depending on build context (main: 3000, feature branch-1: 3001, feature branch-2: 3002, etc.). Hardcoding ports breaks parallel builds.

**Solution**: Use dynamic port detection scripts before invoking Playwright MCP.

---

## Quick Start (For Agents)

### Before Using Playwright MCP

**ALWAYS detect the port dynamically**:

```bash
# Get the active port
PORT=$(./scripts/playwright-with-port.sh)

# Or get full URL directly
URL=$(./scripts/playwright-with-port.sh --url /dashboard)
```

### Example: Frontend Agent Visual Testing

**OLD (Hardcoded - DON'T USE)**:
```typescript
❌ mcp__playwright__browser_navigate({ url: "http://localhost:3000/dashboard" })
```

**NEW (Dynamic - CORRECT)**:
```bash
# Step 1: Detect port
PORT=$(./scripts/playwright-with-port.sh)

# Step 2: Use in Playwright MCP
mcp__playwright__browser_navigate({ url: `http://localhost:${PORT}/dashboard` })
```

**Even Better (One-Liner)**:
```bash
# Get URL in one command
URL=$(./scripts/playwright-with-port.sh --url dashboard)

# Use directly
mcp__playwright__browser_navigate({ url: "${URL}" })
```

---

## Port Detection Script API

### `scripts/detect-dev-port.sh`

**Purpose**: Detects all active Next.js dev servers

**Usage**:
```bash
# Get primary port (lowest port, usually main build)
./scripts/detect-dev-port.sh --primary
# Output: 3000

# List all active Next.js servers
./scripts/detect-dev-port.sh --all
# Output:
# Active Next.js dev servers:
#   - http://localhost:3000
#   - http://localhost:3001
# 3000

# Get JSON format (for programmatic use)
./scripts/detect-dev-port.sh --json
# Output: {"ports":["3000","3001"],"primary":3000}

# Detect from current working directory
./scripts/detect-dev-port.sh --current
# If in feature branch, returns that feature branch's port
# Otherwise returns primary port

# Get port for specific feature branch
./scripts/detect-dev-port.sh --feature branch newsletter
# Output: 3001 (if newsletter feature branch is on port 3001)
```

**How It Works**:
1. Checks ports 3000-3010 for HTTP responses
2. Verifies `x-powered-by: Next.js` header
3. Returns active Next.js ports only

---

## Playwright Helper Script API

### `scripts/playwright-with-port.sh`

**Purpose**: Simplified wrapper for agents to get Playwright URLs

**Usage**:
```bash
# Get port only
./scripts/playwright-with-port.sh
# Output: 3000

# Get full URL for route
./scripts/playwright-with-port.sh --url /dashboard
# Output: http://localhost:3000/dashboard

# Without leading slash (also works)
./scripts/playwright-with-port.sh --url dashboard
# Output: http://localhost:3000/dashboard
```

**Error Handling**:
```bash
# If no dev server running:
./scripts/playwright-with-port.sh
# ERROR: No Next.js dev server found. Please start with 'npm run dev'
# (Exit code: 1)
```

---

## Agent Workflow (Step-by-Step)

### Frontend Agent: Visual Testing

**Step 1: Verify dev server is running**
```bash
if ! ./scripts/detect-dev-port.sh --primary &>/dev/null; then
  echo "⚠️ Dev server not running. Starting..."
  npm run dev &
  sleep 10
fi
```

**Step 2: Get port dynamically**
```bash
PORT=$(./scripts/playwright-with-port.sh)
echo "✅ Detected dev server on port ${PORT}"
```

**Step 3: Use Playwright MCP**
```typescript
// Navigate to landing page
await mcp__playwright__browser_navigate({
  url: `http://localhost:${PORT}`
})

// Take screenshot
await mcp__playwright__browser_take_screenshot({
  filename: "landing-desktop.png"
})
```

**Complete Example**:
```bash
# Bash commands
PORT=$(./scripts/playwright-with-port.sh)
DASHBOARD_URL="http://localhost:${PORT}/dashboard"

# Then use in MCP tools
mcp__playwright__browser_navigate({ url: "${DASHBOARD_URL}" })
mcp__playwright__browser_snapshot()
mcp__playwright__browser_take_screenshot({ filename: "dashboard.png" })
```

---

## Parallel Builds (Feature branch Scenario)

### Scenario: 3 Concurrent Builds

**Setup**:
- Main branch (port 3000): `/Users/kalyan/2Sat-lite`
- Feature branch 1 (port 3001): `/Users/kalyan/2Sat-lite/feature branchs/newsletter`
- Feature branch 2 (port 3002): `/Users/kalyan/2Sat-lite/feature branchs/group-settings`

**How Agents Detect Correct Port**:

```bash
# Agent working in main branch
cd /Users/kalyan/2Sat-lite
./scripts/detect-dev-port.sh --current
# Output: 3000

# Agent working in newsletter feature branch
cd /Users/kalyan/2Sat-lite/feature branchs/newsletter
./scripts/detect-dev-port.sh --current
# Output: 3001

# Agent working in group-settings feature branch
cd /Users/kalyan/2Sat-lite/feature branchs/group-settings
./scripts/detect-dev-port.sh --current
# Output: 3002
```

**Port File Convention** (Optional):

For explicit port tracking, create `.port` files in feature branchs:

```bash
# In feature branch directory
echo "3001" > .port

# Script reads this file first before detection
./scripts/detect-dev-port.sh --feature branch newsletter
# Output: 3001 (from .port file)
```

---

## Environment Variables (Advanced)

**Set port explicitly** (if script detection fails):

```bash
# Option 1: Export in shell
export NEXT_DEV_PORT=3001
PORT=${NEXT_DEV_PORT:-$(./scripts/playwright-with-port.sh)}

# Option 2: Pass to Next.js
PORT=3001 npm run dev
```

**For CI/CD**:
```yaml
# .github/workflows/test.yml
- name: Start dev server
  run: PORT=3000 npm run dev &

- name: Wait for server
  run: |
    while ! ./scripts/detect-dev-port.sh --primary; do
      sleep 1
    done

- name: Run Playwright tests
  run: |
    PORT=$(./scripts/playwright-with-port.sh)
    npm run test:e2e -- --port $PORT
```

---

## Troubleshooting

### Issue: "No Next.js dev server found"

**Cause**: Dev server not running or script can't detect it

**Solutions**:
```bash
# 1. Check if server is running
lsof -i :3000-3010 | grep LISTEN

# 2. Verify Next.js is responding
curl -I http://localhost:3000

# 3. Check server output
npm run dev
# Look for: "- Local: http://localhost:XXXX"

# 4. If port is non-standard (e.g., 8080), update detection range
# Edit scripts/detect-dev-port.sh: for port in {3000..3010}
```

### Issue: "Multiple servers detected, using wrong one"

**Cause**: Multiple Next.js servers running, script picks lowest port

**Solutions**:
```bash
# Option 1: Kill unwanted servers
pkill -f "next dev"
npm run dev  # Restart only the one you need

# Option 2: Use feature branch-specific detection
./scripts/detect-dev-port.sh --feature branch <name>

# Option 3: Create .port file in feature branch
echo "3002" > .port
```

### Issue: "Browser is already in use" Error

**Error**: `Error: Browser is already in use for /Users/.../mcp-chrome-66c8354`

**Cause**: Previous MCP Chrome instance still running OR called `browser_close()` mid-session

**Quick Fix**:
```bash
# Run reset script (recommended)
./scripts/playwright-mcp-reset.sh

# Then retry Playwright
./scripts/playwright-with-port.sh --url /dashboard
```

**See Full Guide**: `.claude/guides/playwright-mcp-browser-error.md`

**Prevention**: Don't call `mcp__playwright__browser_close()` mid-session - let Claude manage browser lifecycle

---

## Framework Rule (MANDATORY)

**ALL agents MUST use dynamic port detection before Playwright MCP.**

**Enforcement**:
- ❌ Hardcoded `http://localhost:3000` → Framework violation
- ✅ `$(./scripts/playwright-with-port.sh --url /route)` → Correct

**Why**:
1. Supports parallel builds (feature branchs)
2. Prevents "blank screen" errors
3. Works in CI/CD with non-standard ports
4. Future-proof (supports any port assignment strategy)

---

## Agent Quick Reference

### ✅ DO (Dynamic)

```bash
# Get port first
PORT=$(./scripts/playwright-with-port.sh)

# Use in Playwright
mcp__playwright__browser_navigate({ url: `http://localhost:${PORT}/dashboard` })
```

### ❌ DON'T (Hardcoded)

```bash
# NEVER hardcode ports
mcp__playwright__browser_navigate({ url: "http://localhost:3000/dashboard" })
mcp__playwright__browser_navigate({ url: "http://localhost:3001/dashboard" })
```

### 🎯 BEST (One-Liner)

```bash
# Single command for full URL
URL=$(./scripts/playwright-with-port.sh --url dashboard)
mcp__playwright__browser_navigate({ url: "${URL}" })
```

---

**Last Updated**: 2025-10-18
**Framework Version**: v1.6.1 (Dynamic Port Detection)
