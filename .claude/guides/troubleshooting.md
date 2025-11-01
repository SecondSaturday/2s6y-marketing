# Troubleshooting Common Issues

Based on lessons learned from completed projects.

---

## Issue 1: Tests Won't Execute

**Symptoms**: Test command runs but shows "0 tests found" or import errors

**Causes**:
- Test runner config (Vitest/Playwright conflict)
- Wrong file paths
- Missing dependencies

**Solutions**:
1. Verify test runner config (`vitest.config.ts`, `playwright.config.ts`)
2. Check test file location (`tests/unit/` for backend, `tests/` for E2E)
3. Run `npm install` to ensure dependencies installed
4. Check import paths in test files

**See**: UEDS.md "Test Execution Verification Protocol"

---

## Issue 2: All Tests Fail After Writing Implementation

**Symptoms**: Tests execute, but 0-77% pass rate

**Causes**:
- Missing required fields (e.g., `status: "active"`)
- Authentication not mocked properly
- Test fixtures don't match schema

**Solutions**:
1. Check test fixtures include all required fields
2. Verify auth mocking pattern: `const tAuth = t.withIdentity()`
3. Compare fixture structure to actual schema
4. Use factories from `tests/factories/` for consistent data

**See**: UEDS.md "Implementation Failure Detection Protocol"

---

## Issue 3: Design System Violations

**Symptoms**: Frontend agent reports design system compliance <100%

**Causes**:
- Hardcoded hex colors instead of design tokens
- Arbitrary spacing (e.g., `p-[15px]` instead of `p-4`)
- Custom components instead of DaisyUI

**Solutions**:
1. Replace hardcoded colors with tokens: `bg-primary`, `text-accent`
2. Use system spacing scale: 0, 1, 2, 3, 4, 5, 6, 8, 12, 16, 20, 32
3. Use DaisyUI components: `btn btn-primary`, `card`, `input`
4. Review design-system.md for complete token list

**See**: core/design-system.md, core/agents/frontend.md

---

## Issue 4: Integration Failures (Frontend ↔ Backend)

**Symptoms**: E2E tests fail, API response doesn't match frontend expectations

**Causes**:
- No contract specification
- Backend changed API without notifying frontend
- Frontend expects different data structure

**Solutions**:
1. Create contract BEFORE implementation: `tests/contracts/[feature].contract.ts`
2. Both agents work from contract
3. Orchestrator verifies contract compliance
4. Don't change API mid-project without updating contract

**See**: guides/testing.md "Contract Testing"

---

## Issue 5: Story Dependency Violations

**Symptoms**: Story fails because dependent story not complete

**Causes**:
- Started story with unmet dependencies
- Dependency graph incorrect
- Didn't check STORY_TRACKER.md before starting

**Solutions**:
1. Always check STORY_TRACKER.md for "Ready to Start" section
2. Verify dependencies met before launching story
3. If dependency graph incorrect, pause and fix STORY_INDEX.md

**See**: core/UEDS.md "Dependency Management"

---

## Issue 6: Factory Data Doesn't Match Schema

**Symptoms**: Tests fail with "unknown field" or "missing required field"

**Causes**:
- Schema changed but factory not updated
- Factory missing new required fields

**Solutions**:
1. Update factory to match current schema: `tests/factories/[name]Factory.ts`
2. Add new required fields with default values
3. Regenerate test data

**See**: templates/factories/README.md

---

## Issue 7: Visual Regression Tests Failing

**Symptoms**: Playwright visual tests fail, screenshots don't match

**Causes**:
- Legitimate UI change (need to update baseline)
- Design system violation (colors/spacing wrong)
- Timing issue (component not fully rendered)

**Solutions**:
1. Review screenshot diff to determine if change is intentional
2. If intentional: Update baseline with `--update-snapshots`
3. If violation: Fix colors/spacing to match design system
4. If timing: Add proper wait conditions

**See**: guides/testing.md "Visual Testing"

---

## Issue 8: Slow Test Execution

**Symptoms**: Tests take >5 minutes to run

**Causes**:
- Too many E2E tests running serially
- No parallelization configured
- Slow database queries in tests

**Solutions**:
1. Configure parallel test execution in Playwright
2. Use factories for faster test data setup
3. Mock slow external API calls
4. Split test suite by priority (fast smoke tests vs full suite)

---

## Getting Help

**If issue persists**:
1. Document the issue in STORY_TRACKER.md blocker column
2. Mark story as 🚨 Blocked
3. Escalate with full error output and steps to reproduce
4. Don't proceed to dependent stories until resolved

---

**Framework Support**: See [Framework.md](../core/Framework.md) for escalation protocol
