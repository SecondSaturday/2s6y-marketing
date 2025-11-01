# MCP Quick Reference Card

**Framework**: v1.4.0 | **Setup Status**: 🟡 Needs API Tokens

---

## 🔑 Get API Tokens

```bash
# Open setup guide
open .claude/guides/mcp-setup-complete.md
```

**GitHub**: https://github.com/settings/tokens (scopes: repo, workflow, read:org)
**Linear**: https://linear.app/settings/api
**Resend**: https://resend.com/api-keys

---

## ⚙️ Configuration File

```bash
# Edit config
open ~/Library/Application\ Support/Claude/claude_desktop_config.json

# After adding tokens:
# 1. Quit Claude Code (⌘Q)
# 2. Reopen Claude Code
```

---

## 🧪 Test MCP Servers

```
GitHub: "What issues are in SecondSaturday/2Sat-lite?"
Linear: "Show my Linear teams"
Resend: "Check my Resend account status"
```

---

## 🌲 Feature branch Commands

```bash
# Create feature branch for story
./scripts/setup-feature branch.sh feature/story-a7-backend

# Navigate
cd ../2Sat-lite-story-a7-backend

# Remove when done
git feature branch remove ../2Sat-lite-story-a7-backend
```

---

## 📝 Create PR with GitHub MCP

```bash
# After committing & pushing
./.claude/hooks/story-complete-pr.sh STORY-A7

# Then ask Claude (copies to clipboard):
"Create a GitHub PR from feature/story-a7-backend to main"
```

---

## 🚀 Parallel Development (3 Agents)

```bash
# Create 3 feature branchs
./scripts/setup-feature branch.sh feature/story-a7-backend
./scripts/setup-feature branch.sh feature/story-c5-frontend
./scripts/setup-feature branch.sh feature/story-e2-testing

# Each agent works independently (no conflicts!)
```

---

## 📊 Linear Sync

```
"Create a Linear issue for STORY-A7 with:
- Title: [STORY-A7] Create saveContribution mutation
- Project: 2s6y Newsletter Feature
- Estimate: 2-3 hours"
```

---

## 📧 Newsletter Testing

```
"Send a test newsletter via Resend to kalyan@example.com"
```

---

## 🔧 Troubleshooting

```bash
# Verify config syntax
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json | python -m json.tool

# Check GitHub token
gh auth status

# List feature branchs
git feature branch list

# Cleanup unused feature branchs
git feature branch prune
```

---

## 📚 Full Guides

- **Setup**: `.claude/guides/mcp-setup-complete.md` (45 min)
- **Patterns**: `.claude/guides/feature branch-mcp-patterns.md` (workflows)
- **Quick Start**: `.claude/guides/mcp-quick-start.md` (5 min)

---

## ⏱️ Expected Time Savings

| Task | Before | After | Savings |
|------|--------|-------|---------|
| Create PR | 5 min | 30 sec | 90% |
| Newsletter test | 3 min | 30 sec | 83% |
| Linear sync | 5 min | Real-time | 100% |

**Total**: 10-15% faster development

---

**Need help?** Ask Claude:
- "Help me set up GitHub MCP"
- "How do I create a PR with GitHub MCP?"
- "Show me feature branch + MCP workflow"
