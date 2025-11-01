# Plugin & MCP Server Recommendations for 2s6y Framework

**Created**: 2025-10-12
**Framework Version**: v1.3.2 → v1.4.0 (Enhanced)
**Status**: Research & Recommendations

---

## 🎯 Overview

This document outlines recommended Claude Code plugins and MCP (Model Context Protocol) servers to **enhance** (not replace) the existing 2s6y agentic development framework.

**Philosophy**: Keep the unique UEDS parallel development system, enhance with community plugins for external integrations.

---

## 📊 Enhancement Strategy

### What We're KEEPING ✅
- **UEDS Parallel Development System** - Unique 4-6x speedup methodology
- **Story-based decomposition** - Custom workflow optimized for this project
- **Contract-first development** - Critical for parallel agent coordination
- **TDD enforcement** - Project-specific testing protocols
- **STORY_TRACKER.md** - Central coordination dashboard
- **Custom templates** - Story templates, contracts, factories

### What We're ENHANCING ⚡
1. **External integrations** → MCP servers (GitHub, Linear, Figma)
2. **Testing automation** → Playwright MCP
3. **Error monitoring** → Sentry MCP
4. **Project management** → Linear/Jira MCP
5. **Design handoff** → Figma MCP (already enabled!)
6. **Git workflows** → GitHub MCP

### What We MIGHT Replace Later 🔄
- **Custom agents** → Native Claude Code sub-agents (after testing)
- **Manual hooks** → Plugin-based hooks
- **Custom slash commands** → Plugin marketplace commands

---

## 🔌 Priority 1: Essential MCP Servers

### 1. GitHub MCP Server ⭐⭐⭐

**Why**: Automate PR creation, issue tracking, and code reviews

**Use Cases**:
- Auto-create PRs from completed stories
- Link story IDs to GitHub issues
- Trigger CI/CD workflows
- Analyze commits for changelog generation

**Integration with UEDS**:
```markdown
Story completion workflow:
1. Agent completes STORY-A7
2. GitHub MCP creates PR with:
   - Title: "feat: STORY-A7 - Create saveContribution mutation"
   - Body: Auto-generated from story file
   - Labels: "backend", "convex", "tdd"
3. CI/CD runs tests automatically
4. User reviews and merges
```

**Installation**:
```bash
# Add GitHub MCP to claude_desktop_config.json
# Requires GitHub personal access token
```

**Status**: 🟡 Needs testing

---

### 2. Figma MCP Server ⭐⭐⭐

**Why**: Ensure design-code consistency, auto-generate components from designs

**Use Cases**:
- Fetch design tokens (colors, spacing, typography)
- Generate component code from Figma frames
- Verify DaisyUI compliance against Figma designs
- Auto-update design system documentation

**Integration with UEDS**:
```markdown
Frontend story workflow:
1. Designer updates Figma file
2. Frontend Agent uses Figma MCP to:
   - Extract design tokens
   - Generate initial component code
   - Verify color/spacing compliance
3. Agent writes tests and implements per TDD
```

**Installation**:
```bash
# Already enabled! Available via mcp__figma-dev-mode-mcp-server__*
```

**Status**: ✅ Available (already configured)

**Actions**:
- Document how to use with Frontend Agent
- Add to `.claude/core/agents/frontend.md` protocol
- Create example workflow in testing guide

---

### 3. Playwright MCP Server ⭐⭐

**Why**: Enhanced browser automation for visual testing

**Use Cases**:
- Structured browser interactions via accessibility tree
- Deterministic web content representation
- Auto-generate visual regression tests
- Cross-browser testing coordination

**Integration with UEDS**:
```markdown
Testing story workflow:
1. Frontend Agent completes component
2. Testing Agent uses Playwright MCP to:
   - Auto-generate accessibility tree
   - Create deterministic selectors
   - Run visual tests across 3 breakpoints
   - Generate screenshot baselines
```

**Installation**:
```bash
# Via plugin marketplace or direct MCP configuration
```

**Status**: 🟡 Needs research

---

## 🔌 Priority 2: Productivity MCP Servers

### 4. Linear MCP Server ⭐⭐⭐

**Why**: Sync STORY_TRACKER.md with Linear for team collaboration

**Use Cases**:
- Auto-create Linear issues from stories
- Sync story status (PENDING → IN_PROGRESS → COMPLETE)
- Track velocity metrics in Linear
- Link stories to Linear milestones

**Integration with UEDS**:
```markdown
Project management workflow:
1. Orchestrator creates stories in STORY_TRACKER.md
2. Linear MCP auto-creates Linear issues:
   - Title: Story title
   - Description: Story requirements
   - Labels: Story type (A, C, E)
   - Estimate: Story time estimate
3. Agent updates story status → Linear auto-syncs
4. Linear provides team visibility
```

**Benefits**:
- Team can see progress in Linear
- Product manager can track velocity
- Stakeholders get status updates
- Historical metrics for planning

**Installation**:
```bash
# Requires Linear API key
# Configure via claude_desktop_config.json
```

**Status**: 🟡 Recommended for team expansion

---

### 5. Sentry MCP Server ⭐⭐

**Why**: Auto-debug production errors with AI assistance

**Use Cases**:
- Fetch error details from Sentry
- Debug using error context
- Link errors to specific stories/commits
- Auto-create bug fix stories

**Integration with UEDS**:
```markdown
Error handling workflow:
1. Production error occurs → Sentry captures
2. User: "Debug Sentry error XYZ-123"
3. Sentry MCP fetches:
   - Stack trace
   - User context
   - Breadcrumbs
4. Backend/Frontend Agent:
   - Analyzes error
   - Identifies root cause
   - Creates fix story
   - Implements TDD fix
```

**Installation**:
```bash
# Requires Sentry auth token
```

**Status**: 🟢 Optional (useful for production)

---

## 🔌 Priority 3: Development Workflow

### 6. PostgreSQL MCP Server ⭐

**Why**: Database introspection (if you add Postgres later)

**Current Status**: Using Convex (not Postgres)

**Future Use**: If migrating to Postgres for advanced features

**Status**: ⏸️ Not applicable (Convex only)

---

### 7. Resend MCP Server ⭐⭐

**Why**: Test newsletter email rendering and delivery

**Use Cases**:
- Test newsletter HTML rendering
- Verify email deliverability
- Debug email template issues
- Preview emails before sending

**Integration with UEDS**:
```markdown
Newsletter testing workflow:
1. Newsletter generation mutation complete
2. Testing Agent uses Resend MCP to:
   - Send test newsletter to test email
   - Verify HTML renders correctly
   - Check for spam score
   - Validate links work
```

**Installation**:
```bash
# Requires Resend API key (already using Resend!)
```

**Status**: 🟡 Recommended (you're already using Resend)

---

## 📦 Recommended Plugin Marketplaces

### 1. jeremylongshore/claude-code-plugins ⭐⭐⭐

**Contains**: 220 production-ready plugins across 14 categories

**Relevant Categories**:
- Testing automation
- Code quality
- Documentation generation
- Git workflows
- Design system validation

**Installation**:
```bash
/plugin marketplace add jeremylongshore/claude-code-plugins
/plugin install [plugin-name]@jeremylongshore
```

**Status**: 🟢 Browse and test plugins

---

### 2. Anthropic Official Marketplace ⭐⭐⭐

**Contains**: 5 curated plugins from Anthropic

**Examples**:
- PR review automation
- Security guidance
- Meta-plugin (creates new plugins)

**Installation**:
```bash
# Default marketplace, already available
/plugin install [plugin-name]
```

**Status**: ✅ Available

---

### 3. davila7/claude-code-templates ⭐⭐

**Contains**: DevOps automation, documentation, project management, testing

**Potential Use**:
- Auto-generate API documentation
- Standardize project management workflows
- Testing suite automation

**Installation**:
```bash
/plugin marketplace add davila7/claude-code-templates
```

**Status**: 🟡 Explore for documentation plugins

---

## 🎨 Design System Integration

### Figma MCP + DaisyUI Workflow

**Goal**: Ensure 100% design-code consistency

**Workflow**:
```markdown
1. Designer creates component in Figma
2. Designer adds Figma variables for colors/spacing
3. Frontend Agent uses Figma MCP:
   - Fetch component metadata
   - Extract design tokens
   - Verify tokens match DaisyUI cupcake theme
   - Generate initial component code
4. Agent writes Playwright tests (TDD)
5. Agent implements component
6. Visual regression tests verify design match
```

**Benefits**:
- Automated design token extraction
- Design-code consistency verification
- Faster component scaffolding
- Reduced manual design handoff time

**Implementation**:
```typescript
// Example: Fetch Figma design tokens
const tokens = await figmaMCP.getVariableDefs(nodeId);
// tokens = { 'color/primary': '#a442fe', 'spacing/4': '16px' }

// Verify against DaisyUI
const daisyUI = { primary: '#a442fe', spacing: { 4: '1rem' } };
const matches = verifyTokens(tokens, daisyUI); // true/false
```

---

## 🤖 Agent Migration Strategy (Optional)

### Current Custom Agents → Native Sub-Agents

**Current State**:
```
.claude/agents/
├── frontend-dev.md
├── backend-dev.md
└── orchestrator.md
```

**Future State (Optional)**:
```
Native Claude Code sub-agents with:
- Configured via /agents command
- Same prompts/tools as current agents
- Easier to share across projects
```

**Migration Path**:
1. Test creating sub-agent with `/agents`
2. Copy `frontend-dev.md` content → sub-agent system prompt
3. Configure tools (Read, Write, Edit, Glob, Grep, Bash)
4. Test parallel execution
5. Compare performance vs custom agents
6. Decide: migrate or keep custom

**Status**: 🟡 Low priority (current agents work well)

---

## 🔗 Integration Patterns

### Pattern 1: GitHub MCP + UEDS

**Story Completion Hook**:
```bash
# .claude/hooks/story-complete.sh
# Triggered when story marked COMPLETE in STORY_TRACKER.md

STORY_ID=$1  # e.g., "STORY-A7"
STORY_FILE=".claude/sessions/current/stories/${STORY_ID}.md"

# Extract story details
TITLE=$(grep "^# " "$STORY_FILE" | sed 's/# //')
TYPE=$(grep "**Type**:" "$STORY_FILE" | sed 's/.*: //')
FILES=$(grep -A 20 "## Files Modified" "$STORY_FILE")

# Create PR via GitHub MCP
gh pr create \
  --title "feat: ${STORY_ID} - ${TITLE}" \
  --body "$(cat <<EOF
## Story
${STORY_ID}

## Type
${TYPE}

## Files
${FILES}

## Tests
All tests passing ✅

Generated via UEDS framework
EOF
)" \
  --label "${TYPE}"
```

---

### Pattern 2: Figma MCP + Frontend Agent

**Component Generation**:
```markdown
User: "Build Button component from Figma node 123:456"

Frontend Agent workflow:
1. Use Figma MCP: Get code for node 123:456
2. Extract:
   - Component structure
   - Design tokens (colors, spacing)
   - Variants (primary, secondary, disabled)
3. Verify tokens match DaisyUI cupcake theme
4. Write Playwright tests FIRST (TDD):
   - Renders all variants
   - Uses correct design tokens
   - Visual regression tests
5. Implement component
6. Run tests → all pass ✅
```

---

### Pattern 3: Linear MCP + STORY_TRACKER.md

**Bi-directional Sync**:
```markdown
STORY_TRACKER.md changes:
- Status: PENDING → IN_PROGRESS
  → Linear MCP: Update issue status → "In Progress"

- Status: IN_PROGRESS → COMPLETE
  → Linear MCP: Update issue status → "Done"
  → Linear MCP: Update time tracking

Linear changes:
- Issue status → "In Progress"
  → Update STORY_TRACKER.md: 🔄 In Progress

- Issue blocked
  → Update STORY_TRACKER.md: 🚫 Blocked
  → Notify Orchestrator
```

---

## 📈 Expected Improvements

### Time Savings

| Workflow | Before | With MCP | Savings |
|----------|--------|----------|---------|
| Create PR from story | 5 min manual | 30 sec automated | 90% |
| Fetch Figma design tokens | 10 min manual | 1 min automated | 90% |
| Debug Sentry error | 15 min context gathering | 2 min automated | 87% |
| Sync Linear issues | 5 min per story | Real-time sync | 100% |
| Test newsletter email | 3 min manual send | 30 sec automated | 83% |

**Total Estimated Savings**: 30-60 min per feature (10-15% overall improvement)

---

## 🚀 Implementation Roadmap

### Phase 1: Quick Wins (This Week)
- [ ] Document Figma MCP usage in Frontend Agent protocol
- [ ] Test GitHub MCP for PR automation
- [ ] Browse plugin marketplaces for relevant plugins
- [ ] Create example workflows in testing guide

### Phase 2: MCP Integration (Next Week)
- [ ] Install GitHub MCP server
- [ ] Configure Resend MCP for newsletter testing
- [ ] Test Playwright MCP for visual testing
- [ ] Document MCP + UEDS integration patterns

### Phase 3: Automation (Week 3)
- [ ] Create hooks for GitHub PR automation
- [ ] Set up Linear MCP (if team expands)
- [ ] Add Sentry MCP for production errors
- [ ] Create plugin for UEDS workflow (share with community!)

### Phase 4: Optimization (Week 4)
- [ ] Evaluate agent migration to native sub-agents
- [ ] Test plugin marketplace offerings
- [ ] Create custom plugin packaging UEDS framework
- [ ] Document framework v2.0 (hybrid approach)

---

## 🎁 Bonus: Create Your Own Plugin

**Idea**: Package UEDS framework as a Claude Code plugin

**Plugin Contents**:
```
2s6y-ueds-plugin/
├── .claude-plugin/
│   └── plugin.json
├── commands/
│   ├── story-create.md
│   ├── story-complete.md
│   └── tracker-update.md
├── agents/
│   ├── frontend-dev.md
│   ├── backend-dev.md
│   └── orchestrator.md
└── README.md
```

**Installation** (by others):
```bash
/plugin install 2s6y-ueds@your-github
```

**Benefits**:
- Share your framework with community
- Easier to use across multiple projects
- Version control for framework updates
- Community contributions

---

## 📊 Success Metrics

Track improvements after MCP integration:

| Metric | Baseline | Target | Actual |
|--------|----------|--------|--------|
| Story completion time | 2.5h avg | 2.2h avg | TBD |
| PR creation time | 5 min | 30 sec | TBD |
| Integration failures | <5% | <2% | TBD |
| Newsletter test time | 3 min | 30 sec | TBD |
| Design-code mismatches | Occasional | Zero | TBD |

---

## 🤔 Open Questions

1. **Team size**: Just you or expanding? (Impacts Linear MCP priority)
2. **Plugin trust**: Comfortable using community plugins? (Security consideration)
3. **Migration effort**: Worth 1-2 weeks to migrate agents? (ROI calculation)
4. **Custom plugin**: Want to share UEDS with community? (Potential impact)
5. **MCP priorities**: Which MCP servers are most valuable? (GitHub > Figma > Linear?)

---

## 📚 Resources

### Plugin Marketplaces
- [jeremylongshore/claude-code-plugins](https://github.com/jeremylongshore/claude-code-plugins) - 220 plugins
- [Anthropic Official Marketplace](https://docs.claude.com/en/docs/claude-code/plugins)
- [ananddtyagi/claude-code-marketplace](https://github.com/ananddtyagi/claude-code-marketplace)

### MCP Documentation
- [Claude Code MCP Guide](https://docs.claude.com/en/docs/claude-code/mcp)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP Servers Repository](https://github.com/modelcontextprotocol/servers)

### Related Framework Docs
- `.claude/core/Framework.md` - Current framework
- `.claude/core/UEDS.md` - Parallel development system
- `.claude/CHANGELOG.md` - Framework evolution

---

**Next Steps**: Review this document, prioritize MCP servers, and decide on implementation timeline.

**Recommendation**: Start with Figma MCP (already available) and GitHub MCP (high ROI), then expand based on team needs.

---

**Version**: v1.0.0
**Last Updated**: 2025-10-12
**Status**: Draft (awaiting user review)
