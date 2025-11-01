# MCP & Plugin Integration Quick Start Guide

**Created**: 2025-10-12
**Framework Version**: v1.4.0
**Audience**: 2s6y developers using Claude Code

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Browse Available Plugins

```bash
# Open Claude Code plugin menu
/plugin

# Expected output: Interactive menu showing installed plugins
```

### Step 2: Add Plugin Marketplace

```bash
# Add a curated marketplace
/plugin marketplace add jeremylongshore/claude-code-plugins

# Expected output: Marketplace added successfully
```

### Step 3: Browse & Install Plugins

```bash
# Open plugin menu to browse
/plugin

# Navigate to marketplace plugins
# Select a plugin to install
# Example: Install a testing automation plugin
```

---

## 📦 Recommended Plugin Marketplaces for 2s6y

### 1. Jeremy Longshore's Marketplace (Recommended)

**Contains**: 220+ production-ready plugins

```bash
/plugin marketplace add jeremylongshore/claude-code-plugins
```

**Relevant Categories**:
- Testing automation (Playwright, E2E)
- Code quality (linters, formatters)
- Documentation generation
- Git workflows
- Design system validation

**Browse**: After adding, use `/plugin` to explore

---

### 2. Anthropic Official Marketplace (Default)

**Contains**: 5 curated Anthropic plugins

**Already Available**: No installation needed

**Plugins**:
- PR review automation
- Security guidance
- Plugin creator (meta-plugin)

**Usage**: `/plugin` → Browse official plugins

---

### 3. Dan Ávila's Templates

**Contains**: DevOps, documentation, project management

```bash
/plugin marketplace add davila7/claude-code-templates
```

**Useful For**:
- API documentation generation
- Testing suites
- Project setup automation

---

## 🔌 MCP Server Configuration

### What are MCP Servers?

MCP (Model Context Protocol) servers connect Claude Code to external tools and services:
- **GitHub**: PR management, issue tracking
- **Figma**: Design token extraction, component generation
- **Linear**: Project management, story tracking
- **Sentry**: Error monitoring
- **Resend**: Email testing

### Figma MCP Server (Already Available!)

**Status**: ✅ Pre-configured in your Claude Code

**Available Tools**:
- `mcp__figma-dev-mode-mcp-server__get_code` - Generate code from Figma
- `mcp__figma-dev-mode-mcp-server__get_screenshot` - Capture design screenshots
- `mcp__figma-dev-mode-mcp-server__get_metadata` - Extract component metadata
- `mcp__figma-dev-mode-mcp-server__get_variable_defs` - Get design tokens

**Example Usage**:

```markdown
User: "Generate code for Figma node 123:456"

Claude Code:
1. Uses mcp__figma-dev-mode-mcp-server__get_code
2. Extracts:
   - Component structure
   - Design tokens (colors, spacing)
   - Variants
3. Generates initial React component
4. Verifies DaisyUI compliance
```

**Try It Now**:
```
You: "Show me the design tokens from the current Figma selection"

(Claude will use Figma MCP to fetch variable definitions)
```

---

### GitHub MCP Server (Recommended)

**Why**: Automate PR creation, issue management, CI/CD

**Configuration**: Add to `claude_desktop_config.json`

**Location**: `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS)

**Add This**:
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

**Get GitHub Token**:
1. Go to https://github.com/settings/tokens
2. Generate new token (classic)
3. Scopes: `repo`, `workflow`, `read:org`
4. Copy token → paste in config above

**Restart**: Close and reopen Claude Code

**Test**:
```
You: "Create a PR for the current branch"

(Claude will use GitHub MCP to create PR)
```

---

### Linear MCP Server (For Team Collaboration)

**Why**: Sync STORY_TRACKER.md with Linear

**Configuration**:
```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-linear"
      ],
      "env": {
        "LINEAR_API_KEY": "lin_api_your_key_here"
      }
    }
  }
}
```

**Get Linear API Key**:
1. Go to https://linear.app/settings/api
2. Create new API key
3. Copy → paste in config

**Use Cases**:
- Auto-create Linear issues from stories
- Sync story status with Linear
- Track velocity in Linear
- Team visibility into progress

---

### Resend MCP Server (For Newsletter Testing)

**Why**: Test newsletter emails programmatically

**Configuration**:
```json
{
  "mcpServers": {
    "resend": {
      "command": "npx",
      "args": [
        "-y",
        "resend-mcp-server"
      ],
      "env": {
        "RESEND_API_KEY": "re_your_key_here"
      }
    }
  }
}
```

**Get Resend API Key**:
- You already use Resend! Check `convex.json` or env vars
- Or create new key at https://resend.com/api-keys

**Use Cases**:
- Send test newsletters
- Verify HTML rendering
- Check spam scores
- Validate email deliverability

---

## 🎯 Integration with UEDS Framework

### Pattern 1: GitHub MCP + Story Completion

**Workflow**:
```markdown
1. Agent completes STORY-A7
2. Updates STORY_TRACKER.md: Status → COMPLETE
3. GitHub MCP auto-creates PR:
   - Title: "feat: STORY-A7 - Create saveContribution mutation"
   - Body: Auto-generated from story file
   - Labels: backend, convex, tdd
4. CI runs tests
5. User reviews and merges
```

**Benefits**:
- Zero manual PR creation
- Consistent PR naming
- Automatic linking to stories
- CI/CD integration

---

### Pattern 2: Figma MCP + Frontend Agent

**Workflow**:
```markdown
User: "Build Button component from Figma node 123:456"

1. Frontend Agent uses Figma MCP:
   - Fetch design tokens
   - Extract component structure
   - Get variants (primary, secondary, disabled)

2. Agent verifies DaisyUI compliance:
   - Colors match cupcake theme
   - Spacing uses design system scale

3. Agent writes Playwright tests FIRST (TDD):
   - Renders all variants ✅
   - Uses correct colors ✅
   - Visual regression tests ✅

4. Agent implements component

5. Tests pass → Component complete ✅
```

**Benefits**:
- Design-code consistency
- Faster component scaffolding
- Automated design token extraction
- Zero design handoff friction

---

### Pattern 3: Linear MCP + STORY_TRACKER.md

**Bi-directional Sync**:
```markdown
STORY_TRACKER.md → Linear:
- Story created → Linear issue created
- Status: PENDING → IN_PROGRESS → Linear updates
- Story completed → Linear marks "Done"

Linear → STORY_TRACKER.md:
- Issue blocked → Story marked BLOCKED
- Priority changed → Story priority updated
- Comments added → Sync to story file
```

**Benefits**:
- Real-time team visibility
- Product manager can track in Linear
- Developers work in STORY_TRACKER.md
- Automatic sync (no manual updates)

---

## 🧪 Testing Your Setup

### Test 1: Figma MCP

```
You: "What design tokens are available in the current Figma selection?"

Expected:
- Claude uses Figma MCP
- Returns color/spacing/typography tokens
- Verifies they match DaisyUI cupcake theme
```

### Test 2: GitHub MCP (After Configuration)

```
You: "What's the status of PR #123?"

Expected:
- Claude uses GitHub MCP
- Fetches PR details
- Shows status, reviews, CI results
```

### Test 3: Plugin Marketplace

```
You: "Browse available testing plugins"

Expected:
- Claude opens plugin menu
- Shows testing category
- Allows installation
```

---

## 📊 Expected Improvements

### Time Savings

| Task | Before MCP | With MCP | Savings |
|------|-----------|----------|---------|
| Create PR from story | 5 min manual | 30 sec | 90% |
| Extract Figma tokens | 10 min manual | 1 min | 90% |
| Test newsletter email | 3 min | 30 sec | 83% |
| Sync Linear stories | 5 min per story | Real-time | 100% |

**Overall**: 10-15% faster feature development

---

## 🚨 Troubleshooting

### "MCP server not found"

**Cause**: Server not configured in `claude_desktop_config.json`

**Fix**:
1. Open `~/Library/Application Support/Claude/claude_desktop_config.json`
2. Add MCP server configuration
3. Restart Claude Code

---

### "Authentication failed"

**Cause**: Invalid or expired API token

**Fix**:
1. Generate new token from service (GitHub, Linear, etc.)
2. Update `claude_desktop_config.json`
3. Restart Claude Code

---

### "Plugin installation failed"

**Cause**: Marketplace not added or plugin doesn't exist

**Fix**:
1. Add marketplace: `/plugin marketplace add user/repo`
2. Verify plugin name is correct
3. Try `/plugin` to browse available plugins

---

## 🎓 Best Practices

### 1. Start Small

- Install 1-2 MCP servers first (GitHub + Figma)
- Test workflows before adding more
- Gradually expand based on value

### 2. Document Your Workflows

- Update `.claude/core/agents/*.md` with MCP usage
- Add MCP examples to testing guide
- Share learnings in CHANGELOG

### 3. Security

- **NEVER commit API tokens** to git
- Store tokens in `claude_desktop_config.json` only
- Rotate tokens periodically
- Use minimal scopes (principle of least privilege)

### 4. Keep UEDS Core

- MCP servers **enhance**, not replace UEDS
- Story-based decomposition still core workflow
- Contract-first development unchanged
- TDD enforcement remains mandatory

---

## 📚 Next Steps

### Immediate (Today)
- [ ] Test Figma MCP (already available!)
- [ ] Browse plugin marketplaces (`/plugin`)
- [ ] Identify 2-3 useful plugins to try

### This Week
- [ ] Configure GitHub MCP server
- [ ] Test PR automation workflow
- [ ] Update Frontend Agent protocol with Figma MCP usage

### Next Week
- [ ] Add Resend MCP for newsletter testing
- [ ] Consider Linear MCP (if team expands)
- [ ] Document MCP workflows in testing guide

### Future
- [ ] Create custom plugin packaging UEDS
- [ ] Share with community
- [ ] Iterate based on feedback

---

## 🔗 Resources

### Official Documentation
- [Claude Code MCP Guide](https://docs.claude.com/en/docs/claude-code/mcp)
- [Plugin Documentation](https://docs.claude.com/en/docs/claude-code/plugins)
- [MCP Servers Repository](https://github.com/modelcontextprotocol/servers)

### Community Resources
- [Awesome MCP Servers](https://github.com/punkpeye/awesome-mcp-servers)
- [MCP Server List](https://www.pulsemcp.com/)
- [Plugin Marketplaces](https://claudecodemarketplace.com)

### Internal Documentation
- `.claude/PLUGIN_RECOMMENDATIONS.md` - Detailed plugin analysis
- `.claude/core/Framework.md` - UEDS framework core
- `.claude/CHANGELOG.md` - Framework evolution

---

## 🎉 Success Checklist

After setup, you should be able to:
- [ ] Browse plugin marketplaces via `/plugin`
- [ ] Use Figma MCP to fetch design tokens
- [ ] Create PRs via GitHub MCP (after config)
- [ ] Test newsletter emails via Resend MCP (after config)
- [ ] Integrate MCP with UEDS workflow

---

**Happy enhancing!** 🚀

If you encounter issues, refer to the Troubleshooting section or check the official Claude Code documentation.

---

**Version**: v1.0.0
**Last Updated**: 2025-10-12
**Maintainer**: 2s6y Framework Team
