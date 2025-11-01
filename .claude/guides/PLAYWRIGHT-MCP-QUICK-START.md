# Playwright MCP Quick Start (30 Seconds)

**⚠️ READ THIS FIRST** before using ANY Playwright MCP tools!

---

## 🚀 5-Step Protocol (MANDATORY)

### Step 1: Reset Browser (Session Start)
```bash
./scripts/playwright-mcp-reset.sh
```

### Step 2: Detect Port (Always!)
```bash
PORT=$(./scripts/playwright-with-port.sh)
```

### Step 3: Navigate with Dynamic Port
```typescript
mcp__playwright__browser_navigate({
  url: `http://localhost:${PORT}/your-route`
})
```

### Step 4: Auth (If Protected Route)
```typescript
// Sign in with: calyanv12@outlook.com / Aloha234%
// See: .claude/guides/playwright-mcp-protocol.md
```

### Step 5: Test & Screenshot
```typescript
mcp__playwright__browser_take_screenshot({
  filename: "my-test.png"
})
```

---

## ❌ NEVER Do

- ❌ Hardcode `localhost:3000` or `localhost:3001`
- ❌ Skip port detection
- ❌ Call `browser_close()` mid-session
- ❌ Skip browser reset at start

---

## ✅ Full Example

```bash
# Reset
./scripts/playwright-mcp-reset.sh

# Detect port
PORT=$(./scripts/playwright-with-port.sh)

# Navigate
mcp__playwright__browser_navigate({
  url: `http://localhost:${PORT}/dashboard`
})

# Take screenshot
mcp__playwright__browser_take_screenshot({
  filename: "dashboard.png"
})

# ✅ Done!
```

---

**Full Protocol**: `.claude/guides/playwright-mcp-protocol.md`
