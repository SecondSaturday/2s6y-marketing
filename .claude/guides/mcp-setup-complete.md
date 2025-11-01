
# Complete MCP Setup Guide: GitHub + Linear + Resend

**Created**: 2025-10-12
**Status**: Setup in Progress
**Estimated Time**: 30-45 minutes

---

## ✅ Step 1: Configuration File Created

I've created your MCP configuration file at:
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Current Status**: ⚠️ Contains placeholder tokens (needs your API keys)

---

## 🔑 Step 2: Get Your API Tokens

### GitHub Personal Access Token

**Purpose**: PR automation, issue tracking, CI/CD integration

**Steps**:
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. **Token name**: `Claude Code MCP - 2s6y`
4. **Expiration**: 90 days (or No expiration for convenience)
5. **Select scopes**:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
   - ✅ `read:org` (Read org and team membership)
6. Click "Generate token"
7. **COPY THE TOKEN** (you won't see it again!)
8. Token format: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**What it enables**:
- Create PRs from completed stories
- Manage issues and labels
- Trigger CI/CD workflows
- Read repository data
- Manage branches

---

### Linear API Key

**Purpose**: STORY_TRACKER.md sync, team collaboration

**Steps**:
1. Go to: https://linear.app/settings/api
2. Click "Create new API key"
3. **Name**: `Claude Code MCP - 2s6y`
4. **Description**: `Story tracking sync with UEDS framework`
5. Click "Create"
6. **COPY THE API KEY**
7. Key format: `lin_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**What it enables**:
- Auto-create Linear issues from stories
- Sync story status (PENDING → IN_PROGRESS → COMPLETE)
- Track velocity metrics in Linear
- Team visibility into progress

**Note**: If you don't have Linear yet:
- Sign up at https://linear.app/
- Free tier supports up to 10 users
- Optional: Can skip this and add later

---

### Resend API Key

**Purpose**: Newsletter email testing automation

**Steps**:
1. Go to: https://resend.com/api-keys
2. Click "Create API Key"
3. **Name**: `Claude Code MCP - 2s6y Newsletter Testing`
4. **Permission**: "Sending access" (default)
5. Click "Create"
6. **COPY THE API KEY**
7. Key format: `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**What it enables**:
- Send test newsletters programmatically
- Verify HTML rendering
- Check spam scores
- Validate email deliverability

**Note**: You're already using Resend for production newsletters, so this key is just for testing.

---

## ⚙️ Step 3: Update Configuration File

**Method 1: Manual Edit** (Recommended)
```bash
# Open config in your editor
open ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

Replace placeholders with your actual tokens:
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_YOUR_REAL_GITHUB_TOKEN"
      }
    },
    "linear": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-linear"
      ],
      "env": {
        "LINEAR_API_KEY": "${LINEAR_API_KEY}"
      }
    },
    "resend": {
      "command": "npx",
      "args": ["-y", "resend-mcp-server"],
      "env": {
        "RESEND_API_KEY": "re_YOUR_REAL_RESEND_KEY"
      }
    }
  }
}
```

**Method 2: Command Line** (If you prefer)
```bash
# I can help you do this once you have the tokens
```

---

## 🔄 Step 4: Restart Claude Code

**IMPORTANT**: MCP servers only load on startup

**Steps**:
1. Quit Claude Code completely (⌘Q)
2. Reopen Claude Code
3. MCP servers will initialize automatically

**Verification**:
- You should see MCP tools available
- Try asking: "What issues are in SecondSaturday/2Sat-lite?"
- Or: "Create a PR from my current branch"

---

## 🧪 Step 5: Test Each MCP Server

### Test 1: GitHub MCP

**Basic Test**:
```
You: "What's the status of this repository?"
```

**Expected**: Claude uses GitHub MCP to fetch repo info

**Advanced Test**:
```
You: "List open issues in SecondSaturday/2Sat-lite"
```

**Expected**: Claude lists GitHub issues

---

### Test 2: Linear MCP

**Basic Test**:
```
You: "What teams do I have in Linear?"
```

**Expected**: Claude uses Linear MCP to list your teams

**Advanced Test** (after creating a Linear project):
```
You: "Create a Linear issue for STORY-A7"
```

**Expected**: Claude creates an issue in Linear

---

### Test 3: Resend MCP

**Basic Test**:
```
You: "What's my Resend account status?"
```

**Expected**: Claude uses Resend MCP to fetch account info

**Advanced Test**:
```
You: "Send a test newsletter to my email"
```

**Expected**: Claude sends test email via Resend

---

## 🌲 Step 6: Feature branch + MCP Integration

### Pattern 1: Story-Based Feature branch + Auto-PR

**Workflow**:
```bash
# 1. Create feature branch for new story
./scripts/setup-feature branch.sh feature/story-a7-mutation

# 2. Work in isolated feature branch
cd ../2Sat-lite-story-a7-mutation

# 3. Complete story (agent marks COMPLETE)

# 4. GitHub MCP auto-creates PR
# (configured in next section)
```

---

### Pattern 2: Parallel Stories in Separate Feature branchs

**Scenario**: 3 agents working on 3 stories simultaneously

**Setup**:
```bash
# Agent 1: Backend story
./scripts/setup-feature branch.sh feature/story-a7-backend

# Agent 2: Frontend story
./scripts/setup-feature branch.sh feature/story-c5-frontend

# Agent 3: Testing story
./scripts/setup-feature branch.sh feature/story-e2-testing
```

**Each feature branch**:
- Independent node_modules
- Separate Convex dev instance
- No git conflicts
- Can run dev server on different ports

**Benefits**:
- 3x faster development (true parallelism)
- Zero conflicts between agents
- Each agent has isolated environment

---

### Pattern 3: Linear Sync Workflow

**Setup**: Bi-directional sync between STORY_TRACKER.md and Linear

**Workflow**:
1. Orchestrator creates stories in STORY_TRACKER.md
2. Linear MCP auto-creates Linear issues:
   - Title: Story title
   - Description: Story requirements
   - Labels: Story type (A, C, E)
   - Estimate: Story time estimate
3. Agent updates story status → Linear auto-syncs
4. Product manager tracks in Linear
5. Developers work in STORY_TRACKER.md

**Implementation** (next step):
- Create hook script for auto-sync
- Configure in `.claude/hooks/`

---

## 🚀 Step 7: Create Auto-PR Hook (GitHub MCP)

### Hook Script: Auto-create PR when story completes

**File**: `.claude/hooks/story-complete-pr.sh`

```bash
#!/bin/bash
# Auto-create GitHub PR when story marked COMPLETE
# Triggered by: Story status change in STORY_TRACKER.md

STORY_ID=$1  # e.g., "STORY-A7"

# Extract story details
STORY_FILE=".claude/sessions/current/stories/${STORY_ID}.md"
TITLE=$(grep "^# " "$STORY_FILE" | sed 's/# //')
TYPE=$(grep "**Type**:" "$STORY_FILE" | sed 's/.*: //')

# Get current branch
BRANCH=$(git branch --show-current)

# Create PR via GitHub MCP (ask Claude)
# Claude will use GitHub MCP to create PR with:
# - Title: "feat: ${STORY_ID} - ${TITLE}"
# - Body: Auto-generated from story file
# - Labels: ${TYPE}
# - Base: main

echo "📝 Story ${STORY_ID} complete!"
echo "🔄 Use GitHub MCP to create PR from branch: ${BRANCH}"
```

**Usage**:
```bash
# When story completes, run:
./.claude/hooks/story-complete-pr.sh STORY-A7

# Then ask Claude:
"Create a PR for STORY-A7 from this branch"
```

---

## 📊 Step 8: Verify Full Setup

### Checklist

- [ ] **GitHub Token**: Added to config file
- [ ] **Linear API Key**: Added to config file
- [ ] **Resend API Key**: Added to config file
- [ ] **Claude Code**: Restarted
- [ ] **GitHub MCP**: Tested (list issues)
- [ ] **Linear MCP**: Tested (list teams)
- [ ] **Resend MCP**: Tested (account status)
- [ ] **Feature branch Script**: Exists and executable
- [ ] **Hook Script**: Created (optional but recommended)

---

## 🎯 Next Steps: Your First Workflow

### Complete Story → Auto-PR Workflow

**Steps**:
1. Create feature branch for story:
   ```bash
   ./scripts/setup-feature branch.sh feature/story-test
   cd ../2Sat-lite-story-test
   ```

2. Complete a simple task (e.g., add a comment)

3. Commit changes:
   ```bash
   git add .
   git commit -m "feat: Test story complete"
   git push -u origin feature/story-test
   ```

4. Ask Claude:
   ```
   "Create a PR for this feature branch to main"
   ```

5. **Expected**: Claude uses GitHub MCP to create PR automatically

---

## 🔧 Troubleshooting

### "MCP server not found"

**Cause**: Config file not loaded or syntax error

**Fix**:
```bash
# Verify config file exists
ls ~/Library/Application\ Support/Claude/claude_desktop_config.json

# Check for syntax errors (valid JSON)
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json | python -m json.tool

# Restart Claude Code completely
```

---

### "Authentication failed" (GitHub)

**Cause**: Invalid or expired token, or insufficient scopes

**Fix**:
1. Go to https://github.com/settings/tokens
2. Check token hasn't expired
3. Verify scopes: `repo`, `workflow`, `read:org`
4. If expired, generate new token and update config
5. Restart Claude Code

---

### "Linear API error"

**Cause**: Invalid API key or account not set up

**Fix**:
1. Verify Linear account exists
2. Check API key at https://linear.app/settings/api
3. Ensure key has correct permissions
4. Update config and restart Claude Code

---

### "Resend domain not verified"

**Cause**: Resend requires domain verification for sending

**Fix**:
1. Go to https://resend.com/domains
2. Verify your domain (or use Resend's test domain)
3. Update DNS records if needed
4. Wait for verification (up to 72 hours)

---

### "Feature branch already exists"

**Cause**: Previous feature branch not cleaned up

**Fix**:
```bash
# List all feature branchs
git feature branch list

# Remove specific feature branch
git feature branch remove /path/to/feature branch

# Or use script (will prompt to remove)
./scripts/setup-feature branch.sh feature/story-name
```

---

## 🎉 Success Criteria

You'll know setup is complete when:

1. ✅ Ask Claude: "List issues in SecondSaturday/2Sat-lite" → See GitHub issues
2. ✅ Ask Claude: "Show my Linear teams" → See Linear teams
3. ✅ Ask Claude: "Check my Resend account" → See Resend info
4. ✅ Create feature branch → Works without errors
5. ✅ Ask Claude: "Create a PR from this branch" → PR created automatically

---

## 📚 Additional Resources

### Documentation
- GitHub MCP: https://github.com/modelcontextprotocol/servers/tree/main/src/github
- Linear MCP: https://github.com/modelcontextprotocol/servers/tree/main/src/linear
- MCP Documentation: https://modelcontextprotocol.io/

### Your Framework Docs
- `.claude/guides/mcp-quick-start.md` - Quick reference
- `.claude/PLUGIN_RECOMMENDATIONS.md` - Full analysis
- `.claude/workflows/README.md` - Feature branch guide

---

## 🔒 Security Best Practices

### API Token Storage
- ✅ **DO**: Store tokens in `claude_desktop_config.json` only
- ❌ **DON'T**: Commit tokens to git
- ❌ **DON'T**: Share tokens in chat/email
- ❌ **DON'T**: Use production Resend key for testing

### Token Rotation
- Rotate GitHub token every 90 days
- Rotate Linear key if exposed
- Rotate Resend key if exposed
- Use separate Resend keys for dev/prod

### Permissions
- Use **minimum scopes** required
- GitHub: Only `repo`, `workflow`, `read:org` (not admin)
- Linear: Only API access (not admin)
- Resend: Only sending access (not domain management)

---

## 📞 Need Help?

**Stuck on a step?** Ask me:
- "Help me get a GitHub token"
- "Why isn't Linear MCP working?"
- "How do I create a PR with GitHub MCP?"
- "Show me an example feature branch workflow"

**Found a bug?** Document in:
- `.claude/guides/troubleshooting.md`
- Report to framework improvement system

---

**Status**: 🟡 Waiting for API tokens

**Next Step**: Get your API tokens (Step 2) and update the config file (Step 3)

---

**Created**: 2025-10-12
**Last Updated**: 2025-10-12
**Framework Version**: v1.4.0
