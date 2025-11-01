# Agent Quick Reference Guide

## 🎯 Available Agents

You have **3 specialized agents** you can invoke directly using the Task tool:

### 1. Frontend Agent (`frontend-dev`)
**Use for**: UI/UX, React components, styling, layouts, forms

**Invoke when**:
- Building or modifying React components
- Creating Next.js pages
- Styling with Tailwind CSS and DaisyUI
- Making layouts responsive
- Fixing frontend bugs
- Visual testing needed

**Example invocation**:
```
"Use the frontend-dev agent to build the contribution form"
"Use the frontend-dev agent to fix button styling"
"Use the frontend-dev agent to make the dashboard responsive"
```

**What it does**:
- ✅ Enforces design system compliance
- ✅ Uses DaisyUI components
- ✅ Takes screenshots at 3 breakpoints
- ✅ Runs visual regression tests
- ✅ Writes Playwright tests

**Cannot do**:
- ❌ Write Convex functions
- ❌ Update database schema
- ❌ Backend logic

---

### 2. Backend Agent (`backend-dev`)
**Use for**: Convex functions, database schema, API logic, business logic

**Invoke when**:
- Creating mutations/queries/actions
- Updating database schema
- Adding validation or auth checks
- Implementing business logic
- Writing unit tests
- Optimizing queries

**Example invocation**:
```
"Use the backend-dev agent to create saveContribution mutation"
"Use the backend-dev agent to add tags field to schema"
"Use the backend-dev agent to add email validation"
```

**What it does**:
- ✅ Enforces Convex patterns (validators, errors, auth)
- ✅ Writes unit tests for all functions
- ✅ Handles security (auth checks, data filtering)
- ✅ Optimizes queries with indexes
- ✅ Type-safe code

**Cannot do**:
- ❌ Write React/UI code
- ❌ Style components
- ❌ Create pages

---

### 3. Orchestrator Agent (`orchestrator`)
**Use for**: Full-stack features, multi-layer coordination, cross-layer debugging

**Invoke when**:
- Building complete features (UI + API)
- Need parallel execution (frontend + backend)
- Cross-layer debugging
- Integration verification needed
- E2E testing required

**Example invocation**:
```
"Use the orchestrator agent to build newsletter archive feature"
"Use the orchestrator agent to debug: users can't submit"
"Use the orchestrator agent to add tagging system"
```

**What it does**:
- ✅ Decomposes tasks into frontend + backend
- ✅ Coordinates parallel execution (saves 30-50% time)
- ✅ Verifies API contracts between layers
- ✅ Runs E2E integration tests
- ✅ Handles cross-layer issues

**Cannot do**:
- ❌ Write code directly (only coordinates other agents)
- ❌ Make simple single-layer changes

---

## 🚀 How to Invoke Agents

### Using the Task Tool

When you want to use an agent, invoke it through the Task tool:

```typescript
// Example 1: Frontend work
Task({
  subagent_type: "frontend-dev",
  description: "Build contribution form",
  prompt: `Build a contribution form component with 5 prompts:
    1. What did you do this month? (textarea)
    2. Photo Wall (file upload)
    3. One Good Thing (text input)
    4. On Your Mind (textarea)
    5. Song (text input with optional link)

    Use DaisyUI components and design system tokens.
    Take screenshots at all breakpoints.`
})

// Example 2: Backend work
Task({
  subagent_type: "backend-dev",
  description: "Create save mutation",
  prompt: `Create a saveContribution mutation that:
    - Accepts all 5 prompt responses
    - Validates user is authenticated
    - Checks user is member of group
    - Updates existing contribution if exists for this month
    - Returns contribution ID
    - Includes unit tests for all scenarios`
})

// Example 3: Full-stack coordination
Task({
  subagent_type: "orchestrator",
  description: "Build newsletter archive",
  prompt: `Build complete newsletter archive feature:
    - Backend: getNewsletters query with pagination
    - Frontend: Archive page with newsletter cards
    - Integration: Verify data contract matches
    - Testing: E2E test for archive flow

    Execute frontend and backend in parallel to save time.`
})
```

---

## 📋 Decision Matrix: Which Agent to Use?

| Task | Agent | Why |
|------|-------|-----|
| Build form component | `frontend-dev` | UI only |
| Fix button styling | `frontend-dev` | Visual only |
| Create mutation | `backend-dev` | API only |
| Add schema field | `backend-dev` | Database only |
| Build full feature | `orchestrator` | Both UI + API |
| Debug "form won't submit" | `orchestrator` | Cross-layer issue |
| Make page responsive | `frontend-dev` | Visual only |
| Add validation | `backend-dev` | Logic only |
| Write E2E test | `orchestrator` | Integration testing |

---

## ⚡ Quick Examples

### Simple Frontend Fix
```
Task: Fix the button color to use primary token

Agent: frontend-dev

Prompt: "Fix the submit button in the contribution form to use
btn-primary instead of hardcoded color. Take screenshot to verify."

Result: ✅ Done in ~30 seconds
```

### Simple Backend Fix
```
Task: Add email validation

Agent: backend-dev

Prompt: "Add email validation to the createUser mutation.
Validate format and uniqueness. Write unit tests."

Result: ✅ Done in ~45 seconds
```

### Full-Stack Feature
```
Task: Build newsletter archive

Agent: orchestrator

Prompt: "Build complete newsletter archive feature with backend
query, frontend page, and E2E test. Use parallel execution."

Result: ✅ Done in ~5 minutes (vs 7+ minutes sequential)
         Backend + Frontend run in parallel
         Integration verified
         All tests passing
```

---

## 🎯 Best Practices

### 1. **Be Specific in Your Prompt**
❌ Bad: "Fix the form"
✅ Good: "Fix the contribution form submit button to use btn-primary class instead of hardcoded bg-purple-500"

### 2. **Choose the Right Agent**
- If task is **clearly one layer** → Use specialist (frontend-dev or backend-dev)
- If task **spans layers** → Use orchestrator

### 3. **Include Requirements**
```
Good prompt structure:
"Use the [agent] agent to [do what]:
 - Requirement 1
 - Requirement 2
 - Requirement 3

Expected output: [what you expect]"
```

### 4. **Let Orchestrator Parallelize**
When building full features, explicitly mention parallel execution:
```
"Use the orchestrator agent to build X feature.
Execute frontend and backend in parallel to save time."
```

### 5. **Provide Context**
If there are related files or dependencies, mention them:
```
"Use the backend-dev agent to create saveContribution mutation.
Related: convex/schema.ts has the contributions table defined.
Auth: User must be authenticated and member of group."
```

---

## 🔍 Agent Capabilities Summary

### Frontend Agent
- ✅ React components
- ✅ Next.js pages
- ✅ DaisyUI styling
- ✅ Design system enforcement
- ✅ Visual testing
- ✅ Responsive design
- ❌ Backend code

### Backend Agent
- ✅ Convex mutations/queries/actions
- ✅ Schema updates
- ✅ Validation & auth
- ✅ Unit tests
- ✅ Security checks
- ✅ Query optimization
- ❌ UI/React code

### Orchestrator
- ✅ Task decomposition
- ✅ Agent coordination
- ✅ Parallel execution
- ✅ Integration verification
- ✅ E2E testing
- ❌ Direct coding

---

## 📞 When to Escalate

Agents will automatically escalate if:
- Failed 3 times to complete task
- Ambiguous requirements
- Design system token missing (frontend)
- Security concern (backend)
- Integration contract mismatch (orchestrator)

They'll provide:
- Clear description of issue
- What they tried
- Error messages
- Proposed solutions

---

## 🎉 You're Ready!

You now have **3 powerful agents** at your disposal:

1. **Frontend Agent** → UI/UX specialist
2. **Backend Agent** → Convex/API specialist
3. **Orchestrator** → Multi-agent coordinator

**Invoke them directly** when you know what you need, or let the orchestrator coordinate complex multi-layer tasks.

**Start building!** 🚀
