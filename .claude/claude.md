# 2s6y Marketing Site - Agentic Development Framework

> **NOTE**: This file is maintained for backward compatibility.
> **Primary entry point**: `.claude/README.md` (hybrid format with quick start)
> **Complete framework guide**: `.claude/core/Framework.md`
> **Framework Version**: v1.3.2 (Refactored Structure)
> **Project Status**: Production Ready - Static Marketing Site

---

## 🚀 Quick Links

**Need project context?** → See `.claude/project-context.md` (marketing site overview, tech stack, deployment)

**Need development patterns?** → See `.claude/development-guide.md` (styling rules, code standards, testing)

**Need framework rules?** → See `.claude/core/Framework.md` (complete framework documentation)

**Need agent protocols?** → See `.claude/core/agents/` (frontend, backend, orchestrator)

**Need quick start?** → See `.claude/guides/quick-start.md` (10-minute setup guide)

---

## ⚠️ Main Claude Session Role (CRITICAL)

### Main Claude Session vs Specialized Agents

**The main Claude session (YOU) CANNOT write code directly.**

You are the **coordinator and planner** only. Your responsibilities:

**✅ What You CAN Do**:
- Understand user requests and translate into tasks
- Choose appropriate agent(s) for each task
- Invoke agents via Task tool with clear prompts
- Review agent outputs and verify completion
- Answer questions about the codebase
- Read and analyze existing code
- Research documentation and explain concepts
- Update framework documentation in `.claude/` (with user approval)

**❌ What You CANNOT Do**:
- Write or edit application code (frontend, components)
- Create React components (use Frontend Agent instead)
- Modify styling or layouts (use Frontend Agent instead)
- Fix bugs in application code (use appropriate agent)
- Implement features directly (use agents via Task tool)

**Exception**: You CAN edit framework documentation files in `.claude/` directory with user approval (e.g., `claude.md`, `CHANGELOG.md`, templates).

**Rule**: All application code changes MUST go through specialized agents.

---

## 🎯 Project Context (Quick Summary)

**2s6y Marketing Site** is a static landing page for the 2s6y application. It's a standalone Next.js project deployed separately from the main app at `bykc.pro/2s6y`.

**Project Scope**:
- ✅ Responsive landing page (mobile/tablet/desktop)
- ✅ Value proposition and CTA messaging
- ✅ Links to main app sign-up/sign-in
- ✅ Animated gradient logo (Whatamesh)
- ✅ DaisyUI cupcake theme (matches main app)
- ✅ Static export for CDN deployment

**Tech Stack**: Next.js 15, React 19, TypeScript, Tailwind CSS 4, DaisyUI, Whatamesh

**For complete specification**: See `.claude/project-context.md`

---

## 🔄 Framework Continuous Improvement Protocol

**MANDATORY**: Agents MUST proactively identify framework optimization opportunities.

### When to Propose Improvements

Agents should watch for:
- Repetitive patterns that could be templated
- Documentation gaps or unclear instructions
- Inefficiencies in workflows (>3 manual steps)
- Opportunities to reduce time/effort
- Conflicts or contradictions in documentation
- Missing error handling patterns
- Performance bottlenecks

### How to Propose Improvements

**NEVER make framework changes without permission.**

When you identify an optimization:

1. **Pause current work**
2. **Document the opportunity**:
   ```
   "I noticed a framework optimization opportunity:

   **Area**: [e.g., Testing workflow, Story templates, Agent coordination]

   **Current Issue**: [Describe the inefficiency/gap]

   **Proposed Improvement**: [Specific change to make]

   **Why This Helps**: [Expected benefit - time saved, errors prevented, clarity improved]

   **Files to Update**: [List specific framework files]

   **Risk Level**: [Low/Medium/High - breaking changes?]

   May I proceed with this improvement?"
   ```
3. **Wait for explicit user approval**
4. **If approved**: Make changes, update CHANGELOG.md, increment framework version if needed
5. **If denied**: Resume original task

### Examples of Good Improvement Proposals

**Example 1: Template Gap**
```
"I noticed a framework optimization opportunity:

**Area**: Story Templates

**Current Issue**: No template exists for 'API integration stories'. Agents are recreating the pattern each time (OAuth setup, error handling, rate limiting).

**Proposed Improvement**: Create `templates/stories/backend-api-integration.md` with standardized structure for Clerk, Resend, Stripe integrations.

**Why This Helps**:
- Reduces story creation time by ~15 minutes
- Ensures consistent error handling
- Prevents common security mistakes (API key exposure)

**Files to Update**:
- Create `.claude/templates/stories/backend-api-integration.md`
- Update `.claude/templates/stories/README.md` index

**Risk Level**: Low (additive only, no breaking changes)

May I proceed?"
```

**Example 2: Workflow Inefficiency**
```
"I noticed a framework optimization opportunity:

**Area**: Testing Workflow

**Current Issue**: Agents manually take 3 screenshots (desktop/tablet/mobile) in separate commands. This takes ~2 minutes per component.

**Proposed Improvement**: Add helper script `scripts/visual-test.sh <component-url>` that automatically captures all 3 breakpoints in one command.

**Why This Helps**:
- Reduces visual testing time from 2min → 30sec (75% faster)
- Eliminates human error (forgetting a breakpoint)
- Consistent screenshot naming

**Files to Update**:
- Create `scripts/visual-test.sh`
- Update `.claude/guides/testing.md` (visual testing section)
- Update `.claude/CHANGELOG.md`

**Risk Level**: Low (agents can still use manual method if needed)

May I proceed?"
```

**Example 3: Documentation Conflict**
```
"I noticed a framework optimization opportunity:

**Area**: Agent Coordination

**Current Issue**: `.claude/core/Framework.md` says "Frontend Agent handles all styling", but `.claude/core/agents/frontend.md` says "Ask user for color changes not in design system". This conflict causes agents to make mistakes.

**Proposed Improvement**: Clarify in Framework.md: "Frontend Agent enforces existing design tokens but MUST ask permission for NEW colors/tokens."

**Why This Helps**:
- Eliminates confusion
- Prevents agents from adding arbitrary colors
- Reduces back-and-forth with user

**Files to Update**:
- `.claude/core/Framework.md` (Agent Autonomy Boundaries section)

**Risk Level**: Low (clarification only, not changing behavior)

May I proceed?"
```

### What NOT to Propose

❌ **Don't propose**:
- Personal preference changes ("I think this reads better...")
- Changes unrelated to efficiency ("Let's reformat all markdown...")
- Experimental ideas without proven benefit
- Changes that break backward compatibility without strong justification

✅ **Do propose**:
- Measurable time savings (X minutes → Y minutes)
- Error prevention (stops common mistakes)
- Clarity improvements (resolves confusion/conflicts)
- Template additions (stops pattern repetition)

### Tracking Improvements

All approved improvements MUST be:
1. Documented in `CHANGELOG.md`
2. Added to `projects/_analytics/framework-improvements.md`
3. Version bumped if breaking change (v1.3.0 → v1.4.0)

**Philosophy**: The framework should get better with every project. Your job is to notice opportunities and ask permission to improve.

---

## 📂 Where to Find Everything

### Project-Specific Documentation

**`.claude/poc-context.md`** (55KB) - MVP project context
- Project overview and MVP scope (target: 2 weeks to launch)
- Data model (Convex schema with all tables including future features)
- Core features (7 features: auth, group management, custom prompts, contributions, dual delivery, archive, notifications)
- File structure (routes, components, Convex functions)
- Performance constraints (free tier limits & strategies)
- Integration setup (Clerk, Convex, Resend)
- MVP success criteria (engagement, performance, group health metrics)
- Next steps after MVP (likes, comments, polls, mobile apps, subscriptions)
- Escalation protocol
- Useful commands

**`.claude/development-guide.md`** (24KB) - Development patterns & standards
- Styling rules (STRICT - DaisyUI compliance)
- Error handling patterns
- Testing & validation protocols
- Code quality standards (TypeScript, Convex, React)
- Security best practices
- Changelog format

---

### Core Framework Documentation

**`.claude/core/Framework.md`** (80KB) - Complete framework guide
- Full agentic framework methodology
- Agent autonomy boundaries
- UEDS parallel development system (overview)
- Contract-first development
- Story decomposition patterns
- Testing protocols
- Complete workflow documentation

**`.claude/core/UEDS.md`** (60KB) - Universal Engineering Development System
- Story-based parallel development (4-6x faster)
- When to use UEDS vs direct agents
- Story decomposition methodology
- Dependency graphs
- Contract-first integration
- STORY_TRACKER.md usage
- Session workflow (pre-session, execution, post-session)
- 3-hour story rule enforcement

**`.claude/core/design-system.md`** (40KB) - Complete design system
- DaisyUI cupcake theme specification
- Color tokens (primary, accent, base)
- Spacing scale (0-32)
- Typography scale (text-xs to text-7xl)
- Component usage guidelines
- Design system compliance rules

---

### Agent Protocols

**`.claude/core/agents/README.md`** (10KB) - Agent index & decision tree
- Quick reference for when to use which agent
- Task classification examples
- Agent coordination patterns
- Decision tree for agent selection

**`.claude/core/agents/frontend.md`** (17KB) - Frontend agent protocol
- React/Next.js component development
- Design system enforcement (strict)
- Visual testing requirements (3 breakpoints)
- DaisyUI component usage
- Responsive design verification
- Screenshot validation workflow

**`.claude/core/agents/backend.md`** (21KB) - Backend agent protocol
- Convex function patterns (mutations, queries, actions)
- Input validation with Convex validators
- Error handling with ConvexError
- Authentication checks
- Unit testing requirements (TDD)
- Security best practices

**`.claude/core/agents/orchestrator.md`** (18KB) - Orchestrator protocol
- Task decomposition strategies
- Parallel execution coordination
- Integration verification
- Contract checking between layers
- E2E test coordination
- Multi-agent communication protocol

**`.claude/AGENT_QUICK_REFERENCE.md`** (8KB) - Quick agent invocation guide
- How to use the Task tool
- Decision matrix (which agent for which task)
- Example invocations
- Agent capabilities summary

---

### Operational Guides

**`.claude/guides/testing.md`** (30KB) - Testing protocols
- TDD workflow (test-first development)
- Visual testing (Playwright screenshots)
- E2E testing (cross-layer verification)
- Test factory patterns
- Coverage requirements
- CI/CD integration

**`.claude/guides/quick-start.md`** (15KB) - 10-minute project guide
- Framework overview
- Project setup
- First story walkthrough
- Agent invocation examples
- Common workflows

**`.claude/guides/troubleshooting.md`** (12KB) - Common issues & solutions
- Framework-related issues
- Agent coordination problems
- Testing failures
- Integration errors
- Performance optimization

---

### Templates Library

**`.claude/templates/story-template.md`** (11KB) - Base story template
**`.claude/templates/project-readme.md`** (7KB) - Project documentation template
**`.claude/templates/session-launch-prompt.md`** (2KB) - UEDS session starter

**Story Templates** (`.claude/templates/stories/`):
- `backend-mutation-query.md` (8KB) - Convex functions
- `backend-schema-migration.md` (7KB) - Database schema changes
- `backend-helper-functions.md` (6KB) - Utility functions
- `frontend-settings-page.md` (9KB) - Settings UI components
- `integration-e2e-tests.md` (8KB) - E2E test stories

**Contract Templates** (`.claude/templates/contracts/`):
- `README.md` (5KB) - Contract-first development guide

**Factory Templates** (`.claude/templates/factories/`):
- `README.md` (6KB) - Test data factory patterns

---

### Project Execution Artifacts

**Active Projects** (`.claude/projects/active/`):
- Currently in progress (STORY_TRACKER.md lives here)

**Completed Projects** (`.claude/projects/completed/`):
- `2025-10-group-settings/` - Group settings feature (postmortem, tracker, stories)

**Analytics** (`.claude/projects/_analytics/`):
- `framework-improvements.md` (8KB) - Optimization tracking
- `velocity-trends.md` (6KB) - Speed metrics
- `common-challenges.md` (7KB) - Pattern recognition

---

### Other Resources

**`.claude/CHANGELOG.md`** (32KB) - Session logs and updates
- Chronological session history
- Feature implementations
- Bug fixes
- Framework improvements

**`.claude/REFACTORING_COMPLETE.md`** (20KB) - v1.3.0 refactor report
- Migration from old structure to new
- File mapping (old → new locations)
- Backward compatibility notes

**`.claude/workflows/README.md`** (12KB) - Git worktree guide
- Parallel development workflows
- Worktree setup and usage
- Branch isolation strategies

**`.claude/settings.local.json`** (4KB) - Framework configuration
- Agent settings
- Testing configuration
- Build preferences

---

## 🤖 Agent Invocation Quick Reference

### Available Agents (3 total)

1. **Frontend Agent** (`frontend-dev`)
   - **Use for**: UI/UX, React components, styling, layouts
   - **Keywords**: build, design, component, page, form, responsive, UI
   - **File**: `.claude/core/agents/frontend.md`

2. **Backend Agent** (`backend-dev`)
   - **Use for**: Convex functions, database schema, API logic, business logic
   - **Keywords**: database, mutation, query, schema, API, validation
   - **File**: `.claude/core/agents/backend.md`

3. **Orchestrator Agent** (`orchestrator`)
   - **Use for**: Full-stack features, multi-agent coordination, cross-layer debugging
   - **Keywords**: feature, integrate, end-to-end, coordinate
   - **File**: `.claude/core/agents/orchestrator.md`

### When to Use Which Agent

| Task | Agent | Why |
|------|-------|-----|
| Fix button color | Frontend Agent | Single layer, UI only |
| Add schema field | Backend Agent | Single layer, database only |
| Build full feature | Orchestrator | Multiple layers, coordination needed |
| Debug cross-layer bug | Orchestrator | Investigation across frontend + backend |
| Make page responsive | Frontend Agent | Single layer, UI only |
| Write unit tests | Backend Agent | Backend testing (TDD) |
| Write visual tests | Frontend Agent | Frontend testing (screenshots) |
| Add new API + UI | Orchestrator | Multiple layers, integration required |

**For detailed agent invocation guide**: See `.claude/AGENT_QUICK_REFERENCE.md`

---

## 🚀 UEDS (When to Use Parallel Development)

**UEDS is NOT for every task.** It's for **complex features** with 3+ independent parallelizable stories.

### Use UEDS When (✅):
- Full-stack features (backend + frontend + testing coordination)
- 3+ independent parallelizable stories
- Clear contracts can be defined upfront
- Estimated 10+ hours sequential work → 3-5 hours parallel
- User explicitly says "use UEDS"

### Use Direct Agents When (❌):
- < 3 hours work
- Single file/component edit
- < 3 stories total
- Unclear requirements
- Sequential dependencies (no parallelization opportunity)

**For complete UEDS documentation**: See `.claude/core/UEDS.md`

---

## 📖 External Documentation

**Core Tech Stack Documentation**:
- [Convex Docs](https://docs.convex.dev/)
- [Next.js Docs](https://nextjs.org/docs)
- [Clerk Docs](https://clerk.com/docs)
- [DaisyUI Components](https://daisyui.com/components/)
- [Playwright Docs](https://playwright.dev/)
- [Resend Docs](https://resend.com/docs)

---

## 🎉 MVP Philosophy (Quick Reminder)

This MVP is about **shipping a production-ready product ASAP**, not perfection.

**Priorities**:
1. ✅ Ship within 2 weeks (aggressive timeline)
2. ✅ Core features work flawlessly (group management, contributions, newsletters)
3. ✅ Real users can invite friends (viral growth potential)
4. ✅ Data is secure (no shortcuts on security)
5. ✅ Framework improvements (propose optimizations proactively)

**Non-priorities**:
- ❌ Perfect UI/UX (good enough is fine, iterate based on feedback)
- ❌ Scalability beyond 1,000 users (optimize after validation)
- ❌ Advanced features (likes, comments, polls - schema ready, UI later)
- ❌ Mobile apps (web-first, mobile later)

**Remember**: Ship a working product to real users. Get feedback. Iterate fast. Make the framework better along the way.

---

**Last Updated**: 2025-10-11
**Version**: v1.3.2 (Agent Role Enforcement + Complete Documentation)
**Maintained By**: Agentic development framework + Kalyan (product owner)

**Changes in v1.3.2**:
- **CRITICAL**: Added Main Claude Session role restriction (CANNOT code directly)
- **CRITICAL**: Clarified specialized agents MUST be used for all code changes
- **FIXED**: Removed Testing Agent references (testing handled by specialized agents)
- **NEW**: Modular file structure (claude.md → router, poc-context.md → project, development-guide.md → patterns)
- **NEW**: Comprehensive "Where to Find Everything" navigation guide
- Updated "Agents Can Do" → "Specialized Agents Can Do" for clarity

**Changes in v1.3.1**:
- **NEW**: UEDS (Universal Engineering Development System) overview section
- Added UEDS complexity decision tree (when to use vs when NOT to use)
- Added UEDS user approval protocol (MANDATORY before invocation)

**Changes in v1.3.0**:
- **NEW**: Framework Continuous Improvement Protocol (agents propose optimizations)
- Restructured to align with new `.claude/` hierarchy
- Updated all file path references
