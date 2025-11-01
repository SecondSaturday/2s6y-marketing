# Agent Protocols - Index

**Framework Version**: v1.3.0
**Last Updated**: 2025-10-11

---

## Quick Reference: When to Use Which Agent

### Direct Agent Invocation (Simple Tasks)

**Frontend Agent** → [frontend.md](./frontend.md)
- UI/UX development
- React components
- Styling & layout
- Visual testing
- **Keywords**: build, design, component, page, form, responsive, UI

**Backend Agent** → [backend.md](./backend.md)
- Database & schema
- Convex mutations/queries
- Business logic
- API integration
- **Keywords**: database, mutation, query, schema, API, validation

**Orchestrator Agent** → [orchestrator.md](./orchestrator.md)
- Full-stack features
- Multi-agent coordination
- Cross-layer debugging
- Integration testing
- **Keywords**: feature, integrate, end-to-end, coordinate

---

## Task Classification Examples

### Frontend Tasks

**Direct Frontend Agent Invocation**:
- "Build the contribution form" → Frontend Agent
- "Fix button styling in modal" → Frontend Agent
- "Make dashboard responsive" → Frontend Agent
- "Add loading spinner to page" → Frontend Agent
- "Update card component colors" → Frontend Agent

**Why Direct**: Single layer (UI only), no backend changes needed

---

### Backend Tasks

**Direct Backend Agent Invocation**:
- "Create saveContribution mutation" → Backend Agent
- "Add tags field to schema" → Backend Agent
- "Set up newsletter cron job" → Backend Agent
- "Write validation for email field" → Backend Agent
- "Add pagination to getNewsletters query" → Backend Agent

**Why Direct**: Single layer (backend only), no UI changes needed

---

### Full-Stack Tasks

**Orchestrator Agent Invocation**:
- "Build newsletter archive feature" → Orchestrator Agent
  - Requires: Backend (getNewsletters query) + Frontend (ArchivePage)
  - Orchestrator coordinates both agents in parallel

- "Implement payment system" → Orchestrator Agent
  - Requires: Backend (Stripe integration) + Frontend (checkout UI)
  - Orchestrator ensures contract compliance

- "Debug: users can't submit forms" → Orchestrator Agent
  - Requires: Investigation across frontend + backend
  - Orchestrator coordinates debugging

**Why Orchestrator**: Multiple layers, requires coordination and integration verification

---

## Complete Agent Documentation

### 1. [Frontend Agent Protocol](./frontend.md) (17KB)

**Responsibility**: Build pixel-perfect UI components with strict design system adherence

**Key Sections**:
- Design system enforcement (colors, spacing, typography)
- Visual testing requirements (3 breakpoints: desktop, tablet, mobile)
- Component development patterns
- DaisyUI component usage
- Screenshot validation workflow
- Responsive design verification

**Strict Rules**:
- MUST use design system tokens (no hardcoded colors)
- MUST use DaisyUI components (no custom buttons/cards)
- MUST visually test with Playwright screenshots
- MUST validate responsive design at all breakpoints
- NEVER use arbitrary spacing values

**Example Invocation**:
```
You: "Frontend agent, build the contribution form with 5 prompts"

Frontend Agent:
  1. Reads design system
  2. Plans component structure (DaisyUI components)
  3. Builds component with TypeScript + React
  4. Takes screenshots (desktop, tablet, mobile)
  5. Verifies design system compliance
  6. Writes visual regression tests
  7. Returns: Code + screenshots + tests

Time: ~3 hours for complex form
```

---

### 2. [Backend Agent Protocol](./backend.md) (21KB)

**Responsibility**: Build type-safe, validated, tested Convex functions

**Key Sections**:
- Convex function patterns (mutations, queries, actions)
- Input validation with Convex validators
- Error handling with ConvexError
- Authentication checks
- Database schema management
- Unit testing requirements
- Security best practices

**Strict Rules**:
- MUST use Convex validators for all inputs
- MUST handle errors with ConvexError
- MUST write unit tests (minimum 5 per function)
- MUST check authentication when required
- NEVER skip input validation
- NEVER expose sensitive data

**Example Invocation**:
```
You: "Backend agent, create saveContribution mutation"

Backend Agent:
  1. Reads contract specification
  2. Uses/creates test factory
  3. Writes tests FIRST (TDD)
  4. Runs tests (expect failures)
  5. Writes mutation with validators
  6. Re-runs tests (should pass)
  7. Verifies 100% pass rate
  8. Returns: Code + unit tests

Time: ~2 hours for CRUD mutation
```

---

### 3. [Orchestrator Agent Protocol](./orchestrator.md) (18KB)

**Responsibility**: Coordinate Frontend and Backend agents for complex multi-layer tasks

**Key Sections**:
- Task decomposition strategies
- Parallel execution coordination
- Integration verification
- Contract checking
- E2E test coordination
- Error handling across agents
- Multi-agent communication protocol

**Important**: Orchestrator **CANNOT write code** - it only coordinates other agents

**Example Invocation**:
```
You: "Orchestrator, build the newsletter archive feature"

Orchestrator:
  1. Decomposes task:
     - Backend: getNewsletters query (2h)
     - Frontend: ArchivePage UI (3h)
     - Testing: E2E test (1.5h)

  2. Creates contract specification

  3. Invokes agents in parallel:
     - Backend Agent → builds query
     - Frontend Agent → builds page

  4. Waits for both to complete (3h total, not 5h)

  5. Verifies contract compliance

  6. Invokes Testing Agent for E2E test

  7. Returns: Complete feature with all tests passing

Time: ~5 hours (vs 6.5h sequential = 23% faster)
```

---

## Agent Invocation Decision Tree

```
Is task simple and single-layer?
  │
  ├─ YES → Use direct agent invocation
  │   │
  │   ├─ UI/styling change? → Frontend Agent
  │   ├─ Backend/database change? → Backend Agent
  │   └─ Test only? → Testing Agent
  │
  └─ NO → Is task complex or multi-layer?
      │
      ├─ YES → Use Orchestrator
      │   │
      │   ├─ Full-stack feature → Orchestrator coordinates both
      │   ├─ Cross-layer debugging → Orchestrator investigates
      │   └─ Integration work → Orchestrator verifies
      │
      └─ UNCLEAR → Ask user for clarification
```

---

## Agent Coordination Patterns

### Pattern 1: Simple Parallel (Independent)

```
Task: "Add 'like' feature to contributions"

Flow:
Backend Agent (parallel) → Create likeContribution mutation (2h)
Frontend Agent (parallel) → Add like button to UI (2h)
   ↓
Both complete → Integration test → Done

Total Time: 2h (not 4h)
```

### Pattern 2: Sequential with Dependencies

```
Task: "Add tags system to contributions"

Flow:
Backend Agent (step 1) → Update schema + add tags field (2h)
   ↓ (wait for completion)
Frontend Agent (step 2) → Build TagInput component (3h)
   ↓ (wait for completion)
Testing Agent (step 3) → E2E test with tags (1.5h)

Total Time: 6.5h (sequential required due to dependencies)
```

### Pattern 3: Hybrid (Partial Parallelism)

```
Task: "Build group creation feature"

Flow:
Phase 1 (parallel):
  Backend Agent → createGroup mutation (2h)
  Frontend Agent → CreateGroupModal UI (2h)
   ↓ (both complete)
Integration Test → Verify connection
   ↓
Phase 2 (parallel):
  Backend Agent → addMemberToGroup mutation (1.5h)
  Frontend Agent → MemberInviteForm (1.5h)
   ↓
Final Integration Test

Total Time: 4h (vs 7h sequential = 43% faster)
```

---

## Integration with Framework

### Agent Protocols + UEDS

- **UEDS** (`.claude/core/UEDS.md`): Defines parallel execution system
- **Agent Protocols** (this directory): Define how each agent executes

**Flow**:
```
UEDS assigns Story A7 → Backend Agent follows backend.md protocol
UEDS assigns Story C9 → Frontend Agent follows frontend.md protocol
UEDS coordinates integration → Orchestrator verifies
```

### Agent Protocols + Framework

- **Framework** (`.claude/core/Framework.md`): Project context and patterns
- **Agent Protocols**: Specific execution guidelines

**Flow**:
```
Framework defines: "Use DaisyUI for all components"
Frontend Agent enforces: Checks all components use DaisyUI
```

### Agent Protocols + Testing System

- **Testing Guide** (`.claude/guides/testing.md`): TDD workflow and test types
- **Agent Protocols**: Reference testing guide for test requirements

**Flow**:
```
Backend Agent → Follows TDD protocol from testing.md
Frontend Agent → Visual testing requirements from testing.md
```

---

## Version History

### v1.3.0 (2025-10-11)
- Refactored structure: Moved agents to `.claude/core/agents/`
- Added agent index (this file) for quick reference
- Improved task classification examples
- Added coordination pattern examples
- Clarified when to use each agent

### v1.2.0 (2025-10-01)
- Added TDD integration to backend/frontend protocols
- Enhanced orchestrator with contract verification
- Added visual testing requirements to frontend protocol

### v1.1.0 (Initial)
- Created specialized agent protocols
- Defined agent autonomy boundaries
- Established strict enforcement rules

---

## Quick Links

### Documentation
- [UEDS (Parallel System)](../UEDS.md)
- [Framework (Project Context)](../Framework.md)
- [Testing Guide](../../guides/testing.md)
- [Design System](../design-system.md)

### Agent Protocols
- [Frontend Agent](./frontend.md) - UI/UX development
- [Backend Agent](./backend.md) - Convex functions
- [Orchestrator Agent](./orchestrator.md) - Multi-agent coordination

### Other Resources
- [CHANGELOG](../../CHANGELOG.md) - Session history
- [STORY_TRACKER](../../sessions/STORY_TRACKER.md) - Active work dashboard

---

**Maintained By**: Agentic Framework Team
**Framework Version**: v1.3.0
**Agent Protocols**: Stable across framework versions
