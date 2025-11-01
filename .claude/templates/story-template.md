# STORY-[ID]: [Title]

**Track:** [Track Letter] ([Track Name])
**Agent:** [backend-dev / frontend-dev / orchestrator]
**Time Estimate:** [X-Y hours]
**Dependencies:** [STORY-XXX, STORY-YYY]
**Blocks:** [STORY-ZZZ]
**Status:** 🔴 Not Started

---

## Contract Specification (For Full-Stack Stories)

**Contract File**: `tests/contracts/[feature-name].contract.ts`

**Backend API** (if applicable):
- Mutation/Query: `[functionName]`
- Args: `{ [param]: type, ... }`
- Returns: `[returnType]`
- Errors: `["Error 1", "Error 2", ...]`

**Frontend Usage** (if applicable):
- Component: `[ComponentName]`
- Uses: `["field1", "field2", ...]`
- Requires: `["mandatoryField1", "mandatoryField2", ...]`
- Sends: `{ [arg]: type, ... }`

---

## Factory Usage

**Factory**: `tests/factories/[dataType]Factory.ts`

**Example Usage**:
```typescript
import { create[DataType] } from './factories/[dataType]Factory';

// In tests
const testData = create[DataType]({ /* overrides */ });
```

---

## Context

[Detailed description of what this story accomplishes. Include business logic, user impact, and technical details.]

**Why This Story Matters**:
- [Reason 1]
- [Reason 2]

**Related Functionality**:
- [Related feature 1]
- [Related feature 2]

---

## Tasks (TDD Order - Mandatory for Backend/Frontend)

### Phase 1: Preparation
- [ ] Read contract specification (if applicable)
- [ ] Identify or create factory for test data
- [ ] Understand dependencies from prior stories

### Phase 2: Test-Driven Development (TDD)

#### Step 1: Write Tests FIRST ✅
- [ ] Happy path test
- [ ] Authentication/authorization test (if applicable)
- [ ] Validation tests (all input validation scenarios)
- [ ] Error handling tests (all error cases)
- [ ] Edge case tests
- [ ] **Minimum**: 5+ tests for backend, 8+ tests for frontend

#### Step 2: Run Tests (Expect Failures) ❌
- [ ] Execute test command
- [ ] Verify all tests FAIL (expected in TDD)
- [ ] Document failure output in "TDD Cycle Evidence" below

#### Step 3: Implement (Make Tests Pass) ✅
- [ ] Write minimal implementation
- [ ] Follow patterns (Convex for backend, Design System for frontend)
- [ ] Re-run tests after each change

#### Step 4: Verify 100% Pass Rate ✅
- [ ] All tests passing
- [ ] No failures, no skipped tests
- [ ] Evidence documented below

#### Step 5: Refactor (Optional)
- [ ] Clean up code while tests stay green
- [ ] Extract helper functions if needed
- [ ] Improve variable names, add comments

### Phase 3: Additional Requirements

**Backend-Specific**:
- [ ] Input validation with Convex validators
- [ ] Error handling with ConvexError
- [ ] Authentication checks (if required)
- [ ] Database indexes for queries
- [ ] Type safety (explicit return types)

**Frontend-Specific**:
- [ ] Design system compliance (100%)
  - [ ] Colors: Only design tokens (no hardcoded hex)
  - [ ] Spacing: Only system scale (no arbitrary values)
  - [ ] Components: DaisyUI (no custom button/card/input)
  - [ ] Typography: System scale only
- [ ] Visual tests at 3 breakpoints (desktop/tablet/mobile)
- [ ] Test all UI states (empty, filled, error, loading, disabled)
- [ ] Responsive design verified
- [ ] Accessibility (keyboard navigation, ARIA labels)

**Integration**:
- [ ] Contract compliance verified (if applicable)
- [ ] Integration test with other layers (if applicable)

---

## Acceptance Criteria

### Functionality
- [ ] All tasks completed
- [ ] All tests passing (100% pass rate)
- [ ] Contract requirements met (if applicable)
- [ ] No regressions in existing functionality

### Code Quality
- [ ] Follows project conventions
- [ ] Type-safe (no `any` types)
- [ ] Well-documented (comments where needed)
- [ ] No console warnings or errors

### Testing
- [ ] TDD cycle completed (tests → implementation)
- [ ] Unit tests passing (backend)
- [ ] Visual tests passing (frontend)
- [ ] Integration tests passing (if applicable)

---

## Expected Outputs

**Files to Create/Modify**:
- [ ] `[file-path-1]` - [Brief description]
- [ ] `[file-path-2]` - [Brief description]
- [ ] `tests/[test-file]` - Test suite

**Database Changes** (if applicable):
- [ ] Schema updates in `convex/schema.ts`
- [ ] Indexes added for queries
- [ ] Migration notes (if breaking changes)

---

## Testing Requirements

### Test Coverage Target

**Backend**: Minimum 5 unit tests
- 1+ happy path
- 1+ authentication/authorization
- 2+ validation scenarios
- 1+ error handling

**Frontend**: Minimum 8 tests
- 3+ functional tests (interaction, submission, validation)
- 3+ visual tests (desktop/tablet/mobile)
- 2+ state tests (empty, filled, error, loading)

### Test Execution Commands

**Backend**:
```bash
npm run test:unit -- tests/unit/[filename].test.ts
```

**Frontend**:
```bash
npx playwright test tests/[filename].spec.ts
```

**Visual Regression**:
```bash
npx playwright test tests/[filename].spec.ts --update-snapshots  # First time only
npx playwright test tests/[filename].spec.ts  # Verify against baseline
```

---

## Test Results (MANDATORY - Do NOT mark story complete without this)

### TDD Cycle Evidence

**Step 1: Tests Written First** ✅
- Date/Time: [YYYY-MM-DD HH:MM]
- Test file: `tests/[path]/[filename]`
- Number of tests: [X tests]
- Factory used: `tests/factories/[factory].ts` ✅

**Step 2: Tests Run (Pre-Implementation)** ❌
```
[Paste terminal output showing tests FAILING before implementation]

Example:
❌ FAIL tests/unit/contributions.test.ts
  ❌ saves contribution with valid data
     Error: saveContribution is not defined
  ❌ rejects unauthenticated users
     Error: saveContribution is not defined

Tests: 0 passed, 5 failed, 5 total
Time: 1.2s
```

**Expected**: All tests should FAIL at this step (no implementation yet)

**Step 3: Implementation Written** ✅
- File(s): `[path]/[filename].ts`
- Lines of code: ~[X lines]
- Date/Time: [YYYY-MM-DD HH:MM]

**Step 4: Tests Re-run (Post-Implementation)** ✅
```
[Paste terminal output showing tests PASSING after implementation]

Example:
✅ PASS tests/unit/contributions.test.ts
  ✅ saves contribution with valid data (234ms)
  ✅ rejects unauthenticated users (123ms)
  ✅ validates month format (98ms)
  ✅ updates existing contribution (187ms)
  ✅ checks group membership (145ms)

Tests: 5 passed, 5 total
Time: 1.1s
```

**Pass Rate**: [X/Y passing] = [Z%]

**STATUS**:
- ✅ 100% pass rate → Story can be marked complete
- ❌ <100% pass rate → Story is 🚨 IMPLEMENTATION FAILED

### Additional Test Results (Frontend Only)

**Visual Tests**:
- Desktop (1440px): ✅ / ❌
- Tablet (768px): ✅ / ❌
- Mobile (375px): ✅ / ❌

**UI States Tested**:
- Empty state: ✅ / ❌
- Filled state: ✅ / ❌
- Error state: ✅ / ❌
- Loading state: ✅ / ❌

**Design System Compliance**:
- Colors (design tokens only): [X/X] ✅
- Spacing (system scale only): [X/X] ✅
- Components (DaisyUI only): [X/X] ✅
- Typography (system scale only): [X/X] ✅

**Compliance Score**: [X%] (Must be 100%)

---

## Contract Compliance (If Applicable)

**Contract Verified**: ✅ / ❌

**Backend Provides**:
- [ ] All required fields present
- [ ] Return type matches contract
- [ ] Error cases match contract

**Frontend Sends/Expects**:
- [ ] Sends correct args to backend
- [ ] Expects correct return type
- [ ] Handles all contract errors

**Integration Test Result**: ✅ PASS / ❌ FAIL

---

## Blocker Protocol ⚠️

**IF ANY OF THE FOLLOWING OCCUR, MARK STORY AS 🚨 BLOCKED (NOT ✅ DONE)**:

### Test Execution Failures
- ❌ Tests cannot execute (framework error, import issues, etc.)
- ❌ Test runner not configured properly
- ❌ Environment setup issues

**Action**: Update status to 🚨 BLOCKED, document error in tracker, escalate immediately.

### Implementation Failures
- ❌ Tests pass <100% (any failures)
- ❌ Pass rate 0-99%
- ❌ Tests execute but implementation has bugs

**Action**: Update status to 🚨 IMPLEMENTATION FAILED, document failure rate, fix bugs before marking complete.

### Design System Violations (Frontend)
- ❌ Hardcoded colors (not using tokens)
- ❌ Arbitrary spacing (not using system scale)
- ❌ Custom components (not using DaisyUI)

**Action**: Fix violations, re-test, verify 100% compliance.

### Contract Mismatches
- ❌ Backend doesn't provide required fields
- ❌ Frontend sends wrong args
- ❌ Return types don't match

**Action**: Update implementation to match contract, re-test integration.

---

## Handoff Notes

[Information that dependent stories need to know]

**For Stories That Depend On This**:
- Key functions/components created: [list]
- Data formats/types: [list]
- Known limitations: [list]
- Usage examples: [code snippets]

**For Integration**:
- API endpoints: [list]
- Required permissions: [list]
- Error handling: [description]

---

## Related Stories

**Depends On**:
- STORY-[XXX]: [Title] - [Why dependency exists]
- STORY-[YYY]: [Title] - [Why dependency exists]

**Blocks**:
- STORY-[ZZZ]: [Title] - [What this provides]

**Related** (not blocking):
- STORY-[AAA]: [Title] - [Relationship]

---

## Notes & Observations

[Any additional context, decisions made, alternatives considered, future enhancements, etc.]

**Decisions Made**:
- [Decision 1 and rationale]
- [Decision 2 and rationale]

**Alternatives Considered**:
- [Alternative 1 - Why not chosen]
- [Alternative 2 - Why not chosen]

**Future Enhancements**:
- [Enhancement 1]
- [Enhancement 2]

---

## Completion Checklist (Final Verification)

**Before marking story as ✅ DONE, verify ALL of the following**:

### Testing
- [ ] All tests written BEFORE implementation (TDD)
- [ ] All tests executed and pass rate = 100%
- [ ] Factory used for test data
- [ ] Evidence documented in "Test Results" section

### Implementation
- [ ] Code follows project patterns
- [ ] Contract compliance verified (if applicable)
- [ ] Design system compliance 100% (frontend)
- [ ] No console errors or warnings

### Documentation
- [ ] Test results section filled out completely
- [ ] TDD cycle evidence provided
- [ ] Handoff notes written for dependent stories
- [ ] Story file status updated to ✅ DONE

### UEDS Coordination
- [ ] STORY_TRACKER.md updated with completion
- [ ] STORY_QUEUE.md updated (this story removed from "In Progress")
- [ ] Dependent stories notified (if applicable)

**IF ALL CHECKBOXES ✅ → Mark story as ✅ DONE**

**IF ANY CHECKBOX ❌ → Story is NOT complete, continue working**

---

**Last Updated**: [YYYY-MM-DD HH:MM]
**Updated By**: [Agent name]
**Status**: [🔴 Not Started / 🔄 In Progress / ✅ Done / 🚨 Blocked]
