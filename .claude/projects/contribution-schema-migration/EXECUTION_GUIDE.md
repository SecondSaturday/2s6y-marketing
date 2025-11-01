# Execution Guide - Contribution Schema Migration

> **This guide provides commands to execute each story in parallel Claude Code sessions.**
> **CRITICAL**: You will NOT invoke agents in this planning session. Use these commands in separate sessions.

---

## 🚀 Quick Start

### Step 1: Open Multiple Terminal Sessions

You'll need **3 terminal sessions** for optimal parallel execution:

1. **Session 1**: Backend Agent (Phase 1)
2. **Session 2**: Frontend Agent (Phase 1)
3. **Session 3**: Frontend Agent (Phase 2) + Orchestrator (Phase 3)

### Step 2: Start Phase 1 (Parallel)

**Session 1 - Backend Agent** (6 hours):
```bash
cd /Users/kalyanchandana/Documents/GitHub/2Sat-lite

# Start Claude Code with Backend Agent for all backend stories
# You'll provide the agent with the Linear issue IDs and story files

# The agent will execute: B1 → B2 → B3 → B4 → B5 → B6
```

**Session 2 - Frontend Agent** (2.5 hours):
```bash
cd /Users/kalyanchandana/Documents/GitHub/2Sat-lite

# Start Claude Code with Frontend Agent for parallelizable frontend stories
# The agent will execute: F2 + F5
```

### Step 3: Start Phase 2 (After Phase 1 Dependencies Met)

**Session 3 - Frontend Agent** (4.5 hours):
```bash
cd /Users/kalyanchandana/Documents/GitHub/2Sat-lite

# Wait for B3, B4, B5 to complete from Session 1
# Then execute: F1 → F3 → F4 → F6
```

### Step 4: Start Phase 3 (Integration)

**Session 3 - Orchestrator** (3 hours):
```bash
cd /Users/kalyanchandana/Documents/GitHub/2Sat-lite

# Wait for ALL Phase 1+2 stories to complete
# Then execute: I1 → I2 → I3 → I4
```

---

## 📋 Story-by-Story Execution

### Phase 1: Backend Stories (Session 1)

#### STORY-B1: Schema Migration (1.5h)

**Linear**: [2S6-5](https://linear.app/2s6y/issue/2S6-5)
**Story File**: `.claude/projects/contribution-schema-migration/backend/STORY-B1.md`

**Command**:
```bash
# In Claude Code session, invoke Backend Agent:
I need you to work on STORY-B1: Schema Migration
Linear Issue: https://linear.app/2s6y/issue/2S6-5
Story File: .claude/projects/contribution-schema-migration/backend/STORY-B1.md

Please:
1. Read the story file for full context
2. Update the schema as specified
3. Create unit tests
4. Update Linear issue status to "In Progress", then "Done"
5. Add test results as a comment to the Linear issue
```

---

#### STORY-B2: Date/Deadline Helpers (1h)

**Linear**: [2S6-6](https://linear.app/2s6y/issue/2S6-6)
**Story File**: `.claude/projects/contribution-schema-migration/backend/STORY-B2.md`

**Command**:
```bash
I need you to work on STORY-B2: Date/Deadline Helpers
Linear Issue: https://linear.app/2s6y/issue/2S6-6
Story File: .claude/projects/contribution-schema-migration/backend/STORY-B2.md

Please:
1. Read the story file for full context
2. Create lib/dateUtils.ts with all helper functions
3. Handle edge cases (month boundaries, leap years, UTC)
4. Create comprehensive unit tests (10+ test cases)
5. Update Linear issue status and add test results
```

---

#### STORY-B3: Update Contributions Mutations (1.5h)

**Linear**: [2S6-7](https://linear.app/2s6y/issue/2S6-7)
**Story File**: `.claude/projects/contribution-schema-migration/backend/STORY-B3.md`
**Dependencies**: B1, B2 (must be complete)

**Command**:
```bash
I need you to work on STORY-B3: Update Contributions Mutations
Linear Issue: https://linear.app/2s6y/issue/2S6-7
Story File: .claude/projects/contribution-schema-migration/backend/STORY-B3.md

IMPORTANT: This depends on B1 (Schema) and B2 (Date Helpers) being complete.

Please:
1. Read the story file for full context
2. Update convex/contributions.ts mutations
3. Accept responses object (not prompt1-5)
4. Calculate editDeadline on creation
5. Maintain auto-save compatibility
6. Create unit tests
7. Update Linear issue status and add test results
```

---

#### STORY-B4: Deadline Enforcement (1h)

**Linear**: [2S6-8](https://linear.app/2s6y/issue/2S6-8)
**Story File**: `.claude/projects/contribution-schema-migration/backend/STORY-B4.md`
**Dependencies**: B3 (must be complete)

**Command**:
```bash
I need you to work on STORY-B4: Deadline Enforcement
Linear Issue: https://linear.app/2s6y/issue/2S6-8
Story File: .claude/projects/contribution-schema-migration/backend/STORY-B4.md

IMPORTANT: This depends on B3 (Contributions Mutations) being complete.

Please:
1. Read the story file for full context
2. Add canEdit query to convex/contributions.ts
3. Update createOrUpdate to throw ConvexError after deadline
4. Create unit tests (before/after/exact deadline)
5. Update Linear issue status and add test results
```

---

#### STORY-B5: Group Prompts Mutations (1h)

**Linear**: [2S6-9](https://linear.app/2s6y/issue/2S6-9)
**Story File**: `.claude/projects/contribution-schema-migration/backend/STORY-B5.md`
**Dependencies**: B2 (must be complete)

**Command**:
```bash
I need you to work on STORY-B5: Group Prompts Mutations
Linear Issue: https://linear.app/2s6y/issue/2S6-9
Story File: .claude/projects/contribution-schema-migration/backend/STORY-B5.md

IMPORTANT: This depends on B2 (Date Helpers) being complete.

Please:
1. Read the story file for full context
2. Create convex/groupPrompts.ts
3. Implement getActivePrompts and deletePrompt
4. Enforce 2-week deletion rule
5. Create unit tests
6. Update Linear issue status and add test results
```

---

#### STORY-B6: User Notifications for Prompt Deletion (1h)

**Linear**: [2S6-10](https://linear.app/2s6y/issue/2S6-10)
**Story File**: `.claude/projects/contribution-schema-migration/backend/STORY-B6.md`
**Dependencies**: B5 (must be complete)

**Command**:
```bash
I need you to work on STORY-B6: User Notifications for Prompt Deletion
Linear Issue: https://linear.app/2s6y/issue/2S6-10
Story File: .claude/projects/contribution-schema-migration/backend/STORY-B6.md

IMPORTANT: This depends on B5 (Group Prompts Mutations) being complete.

Please:
1. Read the story file for full context
2. Update deletePrompt mutation to create notifications
3. Notify affected users when responses deleted
4. Create unit tests
5. Update Linear issue status and add test results
```

---

### Phase 1: Frontend Stories - Parallelizable (Session 2)

#### STORY-F2: Countdown Timer Component (1.5h)

**Linear**: [2S6-12](https://linear.app/2s6y/issue/2S6-12)
**Story File**: `.claude/projects/contribution-schema-migration/frontend/STORY-F2.md`

**Command**:
```bash
I need you to work on STORY-F2: Countdown Timer Component
Linear Issue: https://linear.app/2s6y/issue/2S6-12
Story File: .claude/projects/contribution-schema-migration/frontend/STORY-F2.md

Please:
1. Read the story file for full context
2. Create components/forms/CountdownTimer.tsx
3. Implement flip clock animation with progressive warning states
4. Update every second (useEffect + setInterval)
5. Create visual tests at 3 breakpoints
6. Create unit tests
7. Update Linear issue status and add test results
```

---

#### STORY-F5: Audio Upload Component (1h)

**Linear**: [2S6-15](https://linear.app/2s6y/issue/2S6-15)
**Story File**: `.claude/projects/contribution-schema-migration/frontend/STORY-F5.md`

**Command**:
```bash
I need you to work on STORY-F5: Audio Upload Component
Linear Issue: https://linear.app/2s6y/issue/2S6-15
Story File: .claude/projects/contribution-schema-migration/frontend/STORY-F5.md

Please:
1. Read the story file for full context
2. Create components/forms/AudioUpload.tsx
3. Implement file upload to Convex storage
4. Add audio player with replace functionality
5. Validate 10MB max file size
6. Create visual tests at 3 breakpoints
7. Update Linear issue status and add test results
```

---

### Phase 2: Frontend Stories - Dependent (Session 3)

#### STORY-F1: Dynamic Contribution Form (2h)

**Linear**: [2S6-11](https://linear.app/2s6y/issue/2S6-11)
**Story File**: `.claude/projects/contribution-schema-migration/frontend/STORY-F1.md`
**Dependencies**: B3, B5 (must be complete)

**Command**:
```bash
I need you to work on STORY-F1: Dynamic Contribution Form
Linear Issue: https://linear.app/2s6y/issue/2S6-11
Story File: .claude/projects/contribution-schema-migration/frontend/STORY-F1.md

IMPORTANT: This depends on B3 (Contributions Mutations) and B5 (Group Prompts Mutations) being complete.

Please:
1. Read the story file for full context
2. Update app/contribute/page.tsx
3. Fetch active prompts dynamically
4. Build responses object
5. Maintain auto-save functionality
6. Create visual tests at 3 breakpoints
7. Update Linear issue status and add test results
```

---

#### STORY-F3: Deadline Banner + Warning Stages (1h)

**Linear**: [2S6-13](https://linear.app/2s6y/issue/2S6-13)
**Story File**: `.claude/projects/contribution-schema-migration/frontend/STORY-F3.md`
**Dependencies**: B3, F2 (must be complete)

**Command**:
```bash
I need you to work on STORY-F3: Deadline Banner + Warning Stages
Linear Issue: https://linear.app/2s6y/issue/2S6-13
Story File: .claude/projects/contribution-schema-migration/frontend/STORY-F3.md

IMPORTANT: This depends on B3 (Contributions Mutations) and F2 (Countdown Timer) being complete.

Please:
1. Read the story file for full context
2. Add <CountdownTimer> to app/contribute/page.tsx
3. Show banner when <7 days to deadline
4. Implement progressive warning states
5. Create visual tests at 3 breakpoints
6. Update Linear issue status and add test results
```

---

#### STORY-F4: Read-Only View After Deadline (0.5h)

**Linear**: [2S6-14](https://linear.app/2s6y/issue/2S6-14)
**Story File**: `.claude/projects/contribution-schema-migration/frontend/STORY-F4.md`
**Dependencies**: B4 (must be complete)

**Command**:
```bash
I need you to work on STORY-F4: Read-Only View After Deadline
Linear Issue: https://linear.app/2s6y/issue/2S6-14
Story File: .claude/projects/contribution-schema-migration/frontend/STORY-F4.md

IMPORTANT: This depends on B4 (Deadline Enforcement) being complete.

Please:
1. Read the story file for full context
2. Update app/contribute/page.tsx
3. Query canEdit on page load
4. Disable all inputs after deadline
5. Show clear locked message
6. Create E2E test
7. Update Linear issue status and add test results
```

---

#### STORY-F6: Admin Prompt Deletion Confirmation (1h)

**Linear**: [2S6-16](https://linear.app/2s6y/issue/2S6-16)
**Story File**: `.claude/projects/contribution-schema-migration/frontend/STORY-F6.md`
**Dependencies**: B5 (must be complete)

**Command**:
```bash
I need you to work on STORY-F6: Admin Prompt Deletion Confirmation
Linear Issue: https://linear.app/2s6y/issue/2S6-16
Story File: .claude/projects/contribution-schema-migration/frontend/STORY-F6.md

IMPORTANT: This depends on B5 (Group Prompts Mutations) being complete.

Please:
1. Read the story file for full context
2. Update admin settings page
3. Add confirmation modal before deletion
4. Handle 2-week rule error
5. Create E2E test
6. Update Linear issue status and add test results
```

---

### Phase 3: Integration Stories (Session 3)

#### STORY-I1: E2E Test - Full Contribution Flow (1h)

**Linear**: [2S6-17](https://linear.app/2s6y/issue/2S6-17)
**Story File**: `.claude/projects/contribution-schema-migration/integration/STORY-I1.md`
**Dependencies**: ALL Phase 1+2 stories (must be complete)

**Command**:
```bash
I need you to work on STORY-I1: E2E Test - Full Contribution Flow
Linear Issue: https://linear.app/2s6y/issue/2S6-17
Story File: .claude/projects/contribution-schema-migration/integration/STORY-I1.md

IMPORTANT: This depends on ALL Phase 1+2 stories being complete.

Please:
1. Read the story file for full context
2. Create tests/e2e/contribution-flexible-prompts.spec.ts
3. Use Playwright MCP tools for browser automation
4. Test full contribution flow (login → contribute → auto-save → preview)
5. Verify no console errors
6. Update Linear issue status and add test results
```

---

#### STORY-I2: E2E Test - Deadline Enforcement (1h)

**Linear**: [2S6-18](https://linear.app/2s6y/issue/2S6-18)
**Story File**: `.claude/projects/contribution-schema-migration/integration/STORY-I2.md`
**Dependencies**: ALL Phase 1+2 stories (must be complete)

**Command**:
```bash
I need you to work on STORY-I2: E2E Test - Deadline Enforcement
Linear Issue: https://linear.app/2s6y/issue/2S6-18
Story File: .claude/projects/contribution-schema-migration/integration/STORY-I2.md

IMPORTANT: This depends on ALL Phase 1+2 stories being complete.

Please:
1. Read the story file for full context
2. Create tests/e2e/contribution-deadline.spec.ts
3. Use Playwright MCP tools for browser automation
4. Test countdown timer and deadline enforcement
5. Mock time for different states
6. Update Linear issue status and add test results
```

---

#### STORY-I3: E2E Test - Prompt Deletion with 2-Week Rule (0.5h)

**Linear**: [2S6-19](https://linear.app/2s6y/issue/2S6-19)
**Story File**: `.claude/projects/contribution-schema-migration/integration/STORY-I3.md`
**Dependencies**: ALL Phase 1+2 stories (must be complete)

**Command**:
```bash
I need you to work on STORY-I3: E2E Test - Prompt Deletion with 2-Week Rule
Linear Issue: https://linear.app/2s6y/issue/2S6-19
Story File: .claude/projects/contribution-schema-migration/integration/STORY-I3.md

IMPORTANT: This depends on ALL Phase 1+2 stories being complete.

Please:
1. Read the story file for full context
2. Create tests/e2e/prompt-deletion-rules.spec.ts
3. Use Playwright MCP tools for browser automation
4. Test 2-week deletion rule enforcement
5. Verify notifications created
6. Update Linear issue status and add test results
```

---

#### STORY-I4: Visual Tests - Countdown Timer (0.5h)

**Linear**: [2S6-20](https://linear.app/2s6y/issue/2S6-20)
**Story File**: `.claude/projects/contribution-schema-migration/integration/STORY-I4.md`
**Dependencies**: F2, F3 (must be complete)

**Command**:
```bash
I need you to work on STORY-I4: Visual Tests - Countdown Timer
Linear Issue: https://linear.app/2s6y/issue/2S6-20
Story File: .claude/projects/contribution-schema-migration/integration/STORY-I4.md

IMPORTANT: This depends on F2 (Countdown Timer) and F3 (Deadline Banner) being complete.

Please:
1. Read the story file for full context
2. Create tests/visual/countdown-timer.spec.ts
3. Use Playwright MCP tools for screenshots
4. Capture all 3 breakpoints (desktop/tablet/mobile)
5. Test all 3 timer states (info/warning/error)
6. Update Linear issue status and add test results
```

---

## 📊 Monitoring Progress

### Real-Time Progress Dashboard

**In any Claude Code session**, you can query Linear for real-time progress:

```typescript
// Query all issues in the project
const issues = await mcp__linear-server__list_issues({
  project: "a7f07c4b-4166-47ef-906b-d372b87f0801"
})

// Calculate progress
const total = issues.length
const done = issues.filter(i => i.state === "Done" || i.state === "Completed").length
const inProgress = issues.filter(i => i.state === "In Progress").length
const todo = issues.filter(i => i.state === "Todo" || i.state === "Backlog").length

console.log(`
Progress Dashboard:
✅ Done: ${done}/${total} (${Math.round(done/total*100)}%)
🔄 In Progress: ${inProgress}/${total}
⏸️ Todo: ${todo}/${total}
`)

// List in-progress stories
console.log("\n🔄 Currently Working On:")
issues
  .filter(i => i.state === "In Progress")
  .forEach(i => console.log(`- ${i.identifier}: ${i.title}`))

// List blocked stories (waiting on dependencies)
console.log("\n⏸️ Waiting on Dependencies:")
issues
  .filter(i => i.state === "Backlog" || i.state === "Todo")
  .forEach(i => console.log(`- ${i.identifier}: ${i.title}`))
```

### View in Linear Dashboard

**URL**: https://linear.app/2s6y/project/contribution-schema-migration-deadline-enforcement-56f82b35abf3

---

## 🎯 Tips for Parallel Execution

1. **Start Phase 1 immediately** - B1-B6 + F2, F5 can all run in parallel
2. **Monitor dependencies** - Watch for B3, B4, B5 completion before starting F1, F3, F4, F6
3. **Use Linear for coordination** - Check issue statuses before starting dependent stories
4. **Take breaks between phases** - Phase 1 → Phase 2 → Phase 3 transitions are natural break points
5. **Test as you go** - Each story includes tests, don't skip them
6. **Update Linear immediately** - Keep status current so other sessions know what's blocked/unblocked

---

## 🚨 Troubleshooting

### "Dependency not met" error

**Solution**: Check Linear issue status for prerequisite stories. Wait for them to be marked "Done" before proceeding.

### Merge conflicts between parallel sessions

**Solution**: Use separate branches for Phase 1 backend/frontend work. Merge backend first, then frontend.

### Test failures

**Solution**: Add test results as comments to Linear issue. Don't mark story as "Done" until tests pass.

### Can't find story file

**Solution**: All story files are in `.claude/projects/contribution-schema-migration/{backend|frontend|integration}/`

---

**Last Updated**: 2025-10-13
**Next**: Start with Phase 1 backend stories in parallel with Phase 1 frontend stories!
