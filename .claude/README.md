# 2Sat-lite Agentic Framework

**Version**: v1.3.0 (Refactored Structure)
**Framework Methodology**: UEDS v1.2.0
**Last Updated**: 2025-10-11

**Quick Navigation**:
- [Quick Start](#quick-start-daily-reference) - Start here for daily use
- [Onboarding](#onboarding-new-users) - New to the framework? Start here
- [Complete Index](#complete-documentation-index) - All docs

---

## Quick Start (Daily Reference)

### 🚀 Start a New Project
```
Tell Orchestrator: "Start new UEDS project: [Feature Name]"
```
→ Orchestrator creates structure, generates stories, initializes tracking

**See**: [guides/quick-start.md](./guides/quick-start.md)

### 📋 Common Tasks

**Check project status**:
```
Open: projects/active/[YYYY-MM-feature]/STORY_TRACKER.md
```

**Launch a story**:
```
Tell agent: "Execute [STORY-ID] from [project-name]"
```

**Reference framework**:
- Agents: [core/agents/](./core/agents/)
- Testing: [guides/testing.md](./guides/testing.md)
- UEDS: [core/UEDS.md](./core/UEDS.md)

**Troubleshoot issues**:
- [guides/troubleshooting.md](./guides/troubleshooting.md)

---

## Onboarding (New Users)

### What is This?

The **2Sat-lite Agentic Framework** is a parallel development orchestration system that enables:
- ✅ **4-6 simultaneous AI agents** working on independent tasks
- ✅ **60-80% time reduction** vs sequential development
- ✅ **Story-based coordination** (28+ small stories per feature)
- ✅ **Built-in testing** (TDD, factories, contracts)
- ✅ **Zero integration failures** (contract-first development)

### How It Works

1. **Break feature into stories** (Orchestrator does this)
   - Each story: 1-2 hours, clear scope, testable
   - Organized into tracks (Backend, Frontend, Integration)

2. **Identify dependencies** (Orchestrator creates graph)
   - STORY-A1 must complete before STORY-A2
   - STORY-B1 and STORY-C1 can run parallel

3. **Execute in parallel** (4-6 agents work simultaneously)
   - Foundation first (sequential)
   - Then parallel blast (4-6 stories at once)
   - Integration last (sequential)

4. **Track progress** (STORY_TRACKER.md updates in real-time)
   - 🔴 Not Started → 🔄 In Progress → ✅ Done
   - Blockers immediately visible

5. **Archive when complete** (Postmortem generated)
   - Project moves to `completed/`
   - Ready for next feature

### Core Components

**Framework** (reusable methodology):
- [core/Framework.md](./core/Framework.md) - How to use the system
- [core/UEDS.md](./core/UEDS.md) - Parallel development methodology
- [core/agents/](./core/agents/) - Agent protocols (Frontend, Backend, Orchestrator)
- [core/design-system.md](./core/design-system.md) - Design tokens & rules

**Guides** (how-tos):
- [guides/quick-start.md](./guides/quick-start.md) - Start a new project
- [guides/testing.md](./guides/testing.md) - Testing (TDD, factories, contracts)
- [guides/troubleshooting.md](./guides/troubleshooting.md) - Common issues

**Templates** (reusable starting points):
- [templates/stories/](./templates/stories/) - 8+ story templates (schema migration, settings page, E2E tests)
- [templates/](./templates/) - Project templates (README, tracker, postmortem)
- [templates/factories/](./templates/factories/) - Test data factories
- [templates/contracts/](./templates/contracts/) - API contracts

**Projects** (execution artifacts):
- `projects/active/` - Currently in progress
- `projects/completed/` - Finished projects (archived)
- `projects/archive/` - Projects older than X months
- `projects/_analytics/` - Cross-project insights

### Example: Building a Feature

**Goal**: Build "Newsletter Archive" feature

**Time**: ~5-10 hours (vs 40+ hours sequential)

**Process**:
1. Tell Orchestrator: "Start new UEDS project: Newsletter Archive"
2. Orchestrator generates 22 stories across 5 tracks
3. Execute STORY-000 (foundation, 1-2h)
4. Launch 6 parallel sessions (Stories A1, A2, B1, C1, D1, E1)
5. Monitor STORY_TRACKER.md as stories complete
6. Launch dependent stories as they become ready
7. Complete with integration track (E2E tests, optimization)
8. Orchestrator generates postmortem

**Result**: Feature complete in 7 hours with 100% test coverage

---

## Complete Documentation Index

### Core Framework
- **[Framework.md](./core/Framework.md)** - Complete framework guide (how to use agents, patterns, standards)
- **[UEDS.md](./core/UEDS.md)** - Parallel development methodology (story breakdown, dependency management, execution)
- **[design-system.md](./core/design-system.md)** - Design tokens, color palette, DaisyUI integration
- **[agents/](./core/agents/)** - Agent protocols
  - [README.md](./core/agents/README.md) - Agent index & quick reference
  - [frontend.md](./core/agents/frontend.md) - Frontend agent protocol (17KB)
  - [backend.md](./core/agents/backend.md) - Backend agent protocol (21KB)
  - [orchestrator.md](./core/agents/orchestrator.md) - Orchestrator agent protocol (18KB)

### Guides
- **[quick-start.md](./guides/quick-start.md)** - Start a new UEDS project (10-min guide)
- **[testing.md](./guides/testing.md)** - Complete testing guide (TDD, factories, contracts, visual testing)
- **[troubleshooting.md](./guides/troubleshooting.md)** - Common issues & solutions

### Templates (Copy & Customize)
- **[templates/stories/](./templates/stories/)** - Reusable story templates
  - backend-schema-migration.md
  - backend-mutation-query.md
  - frontend-settings-page.md
  - frontend-form-component.md
  - integration-e2e-tests.md
  - [8+ more templates]
- **[templates/](./templates/)** - Project templates
  - project-readme.md
  - story-tracker.md
  - story-index.md
  - postmortem.md (hybrid format)
  - story-template.md (enhanced)
- **[templates/factories/](./templates/factories/)** - Test data factory templates
- **[templates/contracts/](./templates/contracts/)** - API contract templates

### Projects
- **[projects/active/](./projects/active/)** - Currently in progress
- **[projects/completed/](./projects/completed/)** - Finished projects (full documentation)
- **[projects/archive/](./projects/archive/)** - Older projects
- **[projects/_analytics/](./projects/_analytics/)** - Cross-project insights
  - velocity-trends.md - Time savings, speedups
  - common-challenges.md - Recurring issues & solutions
  - framework-improvements.md - Framework evolution

### Archive
- **[archive/deprecated/](./archive/deprecated/)** - Obsolete documentation

---

## Framework Versions

**Current**: v1.3.0 (Refactored Structure)
- Separated framework from project artifacts
- Template library for rapid project setup
- Analytics foundation for cross-project insights

**Previous**: v1.2.0 (Enhanced Testing)
- TDD protocol + Factory pattern + Contract testing
- 100% test pass rate enforcement
- Zero integration failures

**Initial**: v1.0.0 (UEDS)
- Story-based parallel development
- 60-80% time reduction vs sequential

**See**: [projects/_analytics/framework-improvements.md](./projects/_analytics/framework-improvements.md)

---

## Quick Reference Card

| Need | Go To |
|------|-------|
| Start new project | [guides/quick-start.md](./guides/quick-start.md) |
| Understand methodology | [core/UEDS.md](./core/UEDS.md) |
| Agent protocols | [core/agents/](./core/agents/) |
| Testing guide | [guides/testing.md](./guides/testing.md) |
| Design system | [core/design-system.md](./core/design-system.md) |
| Story templates | [templates/stories/](./templates/stories/) |
| Troubleshooting | [guides/troubleshooting.md](./guides/troubleshooting.md) |
| Previous projects | [projects/completed/](./projects/completed/) |
| Analytics | [projects/_analytics/](./projects/_analytics/) |

---

## Support

**Issues?** See [guides/troubleshooting.md](./guides/troubleshooting.md)

**Framework questions?** Reference [core/Framework.md](./core/Framework.md)

**Previous implementations?** Browse [projects/completed/](./projects/completed/)

---

**Last Updated**: 2025-10-11
**Maintained By**: Kalyan + Agentic Framework
**Version**: v1.3.0
