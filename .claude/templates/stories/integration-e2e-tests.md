# STORY-[ID]: E2E Integration Tests for [Feature]

**Track:** F (Integration)
**Agent:** orchestrator / testing-agent
**Time Estimate:** 2-3 hours
**Dependencies:** [All feature stories complete]
**Blocks:** [Performance optimization stories]
**Status:** 🔴 Not Started

---

## Context

Write comprehensive end-to-end integration tests covering the complete [feature] user flow. Tests verify that all layers (frontend, backend, database) work together correctly.

**Why This Story Matters**:
- **Integration Verification**: Ensure frontend and backend communicate correctly
- **Regression Prevention**: Catch breaking changes before deployment
- **Confidence**: Prove the complete user flow works
- **Documentation**: Tests serve as living documentation of user flows

---

## User Flows to Test

### Flow 1: [Primary User Journey]
**Steps**:
1. [User action 1]
2. [User action 2]
3. [User action 3]
4. [Expected outcome]

**Test Coverage**:
- Happy path (everything works)
- Error handling (what if it fails)
- Edge cases (boundary conditions)

### Flow 2: [Secondary User Journey]
[Similar structure]

### Flow 3: [Edge Case Journey]
[Similar structure]

---

## Test Coverage Requirements

### Categories to Cover

**1. Happy Path Tests** (40% of tests)
- [ ] User completes primary flow successfully
- [ ] All features work as expected
- [ ] Data persists correctly
- [ ] UI updates reflect backend changes

**2. Error Handling Tests** (30% of tests)
- [ ] Network failures handled gracefully
- [ ] Validation errors display correctly
- [ ] User can recover from errors
- [ ] Proper error messages shown

**3. Edge Cases** (20% of tests)
- [ ] Empty states display correctly
- [ ] Maximum limits respected
- [ ] Concurrent actions handled
- [ ] Race conditions prevented

**4. Cross-Feature Tests** (10% of tests)
- [ ] Feature A affects Feature B correctly
- [ ] Permissions checked across features
- [ ] Data consistency maintained

**Total Tests**: 40-60 comprehensive E2E tests

---

## Tasks

### Phase 1: Test Planning
- [ ] List all user flows
- [ ] Identify test scenarios (happy path, errors, edge cases)
- [ ] Design test data setup
- [ ] Plan cleanup strategy

### Phase 2: Test Implementation

#### For Each User Flow:
- [ ] Write setup (create test data)
- [ ] Write test steps (user actions)
- [ ] Write assertions (verify outcomes)
- [ ] Write cleanup (reset state)
- [ ] Add visual regression (screenshots)

#### Test Organization:
- [ ] Group tests by feature
- [ ] Use descriptive test names
- [ ] Add comments for complex flows
- [ ] Use fixtures for reusable setup

### Phase 3: Visual Regression
- [ ] Take screenshots at key points
- [ ] Test at 3 breakpoints (mobile, tablet, desktop)
- [ ] Verify design system compliance in screenshots
- [ ] Create baseline screenshots

### Phase 4: Execution & Validation
- [ ] Run all tests locally
- [ ] Verify 100% pass rate
- [ ] Run in CI/CD
- [ ] Fix any flaky tests

---

## Test Template

### Basic E2E Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { createTestUser, createTestGroup } from './fixtures';

test.describe('[Feature] - Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Create test data
    // Navigate to starting point
  });

  test.afterEach(async ({ page }) => {
    // Cleanup: Reset state
  });

  test('completes [user flow] successfully', async ({ page }) => {
    // 1. Setup - Navigate to page
    await page.goto('/[route]');

    // 2. Action - User interaction
    await page.click('[data-testid="action-button"]');
    await page.fill('[data-testid="input-field"]', 'Test Value');

    // 3. Submit
    await page.click('[data-testid="submit-button"]');

    // 4. Assert - Verify outcome
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();

    // 5. Verify backend - Check data persisted
    // (Use Convex query or API call)

    // 6. Visual regression (optional)
    await expect(page).toHaveScreenshot('[feature]-success.png');
  });

  test('handles [error scenario] correctly', async ({ page }) => {
    // 1. Setup - Navigate to page
    await page.goto('/[route]');

    // 2. Trigger error condition
    await page.fill('[data-testid="input-field"]', 'invalid-value');
    await page.click('[data-testid="submit-button"]');

    // 3. Assert - Error displayed
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Expected error text');

    // 4. Verify recovery - User can fix and retry
    await page.fill('[data-testid="input-field"]', 'valid-value');
    await page.click('[data-testid="submit-button"]');
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  });

  test('[edge case scenario]', async ({ page }) => {
    // Test boundary conditions
  });
});
```

### Visual Regression Test

```typescript
test('visual regression at all breakpoints', async ({ page }) => {
  // Desktop (1440px)
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/[route]');
  await expect(page).toHaveScreenshot('[feature]-desktop.png');

  // Tablet (768px)
  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(page).toHaveScreenshot('[feature]-tablet.png');

  // Mobile (375px)
  await page.setViewportSize({ width: 375, height: 667 });
  await expect(page).toHaveScreenshot('[feature]-mobile.png');
});
```

### Cross-Feature Integration Test

```typescript
test('feature A affects feature B correctly', async ({ page }) => {
  // 1. Setup both features
  await page.goto('/feature-a');

  // 2. Action in Feature A
  await page.click('[data-testid="action-a"]');

  // 3. Navigate to Feature B
  await page.goto('/feature-b');

  // 4. Verify Feature B reflects change from Feature A
  await expect(page.locator('[data-testid="updated-value"]')).toContainText('Expected value');
});
```

### Accessibility Test

```typescript
test('keyboard navigation works', async ({ page }) => {
  await page.goto('/[route]');

  // Tab to first interactive element
  await page.keyboard.press('Tab');
  await expect(page.locator('[data-testid="first-element"]')).toBeFocused();

  // Tab to second element
  await page.keyboard.press('Tab');
  await expect(page.locator('[data-testid="second-element"]')).toBeFocused();

  // Activate with Enter
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-testid="result"]')).toBeVisible();
});
```

---

## Acceptance Criteria

### Test Coverage
- [ ] 40-60 E2E tests written
- [ ] All user flows covered
- [ ] Happy path + errors + edge cases tested
- [ ] Cross-feature integration tested
- [ ] Visual regression at 3 breakpoints

### Test Quality
- [ ] 100% pass rate
- [ ] No flaky tests
- [ ] Tests run in < 5 minutes
- [ ] Descriptive test names
- [ ] Well-commented code

### Integration Verification
- [ ] Frontend → Backend communication verified
- [ ] Database persistence verified
- [ ] Real-time updates verified (if applicable)
- [ ] All API contracts tested

### Accessibility
- [ ] Keyboard navigation tested
- [ ] ARIA labels verified
- [ ] Screen reader compatibility checked

---

## Test Results (MANDATORY)

### Test Execution

**Date/Time**: [YYYY-MM-DD HH:MM]

**Test Files Created**:
- `tests/e2e/integration-[feature].spec.ts` ([X] tests)
- `tests/e2e/integration-[feature]-errors.spec.ts` ([Y] tests)
- `tests/e2e/integration-[feature]-visual.spec.ts` ([Z] tests)

**Total Tests**: [X+Y+Z] tests

**Execution Output**:
```
[Paste Playwright test output]

Example:
✅ PASS tests/e2e/integration-[feature].spec.ts
  ✅ completes primary user flow (2.3s)
  ✅ completes secondary flow (1.8s)
  ✅ handles error scenario (1.5s)
  ✅ handles edge case (1.2s)
  ... (more tests)

✅ PASS tests/e2e/integration-[feature]-visual.spec.ts
  ✅ desktop view matches snapshot (1.1s)
  ✅ tablet view matches snapshot (0.9s)
  ✅ mobile view matches snapshot (0.8s)

Tests: [X] passed, [X] total
Duration: [X]s
Pass Rate: 100% ✅
```

**STATUS**: [✅ 100% pass rate / ❌ <100% - TESTS FAILED]

### Visual Regression

**Screenshots Created**:
- [ ] `[feature]-desktop.png` (1440px) ✅
- [ ] `[feature]-tablet.png` (768px) ✅
- [ ] `[feature]-mobile.png` (375px) ✅
- [ ] `[feature]-error.png` (error state) ✅
- [ ] `[feature]-empty.png` (empty state) ✅

### Cross-Browser Testing

**Browsers Tested**:
- [ ] Chromium ✅
- [ ] Firefox (optional)
- [ ] WebKit (optional)

---

## Test Organization

### File Structure

```
tests/
  e2e/
    integration-[feature].spec.ts          # Main user flows
    integration-[feature]-errors.spec.ts   # Error handling
    integration-[feature]-visual.spec.ts   # Visual regression
    integration-[feature]-a11y.spec.ts     # Accessibility
  fixtures/
    [feature].fixture.ts                   # Reusable test data
```

### Naming Conventions

**Test Files**: `integration-[feature]-[category].spec.ts`
**Test Names**: `[action] [expected outcome]`
**Data Test IDs**: `[component]-[element]-[action]`

---

## Expected Outputs

### Files Created
- [ ] `tests/e2e/integration-[feature].spec.ts` (main tests)
- [ ] `tests/e2e/integration-[feature]-errors.spec.ts` (error tests)
- [ ] `tests/e2e/integration-[feature]-visual.spec.ts` (visual tests)
- [ ] `tests/fixtures/[feature].fixture.ts` (test data)
- [ ] Screenshots for visual regression (5+)

---

## Handoff Notes

### For Performance Optimization (Next Story)

**Baseline Performance Metrics** (from E2E tests):
- Page load time: [X]ms
- First interaction: [Y]ms
- Form submission: [Z]ms
- Total flow time: [A]s

**Known Performance Issues**:
- [Issue 1]: [Description]
- [Issue 2]: [Description]

**Optimization Opportunities**:
- [Opportunity 1]
- [Opportunity 2]

---

## Related Stories

**Depends On**:
- STORY-[All backend stories]: Backend APIs must work
- STORY-[All frontend stories]: UI must be complete

**Blocks**:
- STORY-[Performance]: Performance optimization needs baseline metrics

---

## Completion Checklist

- [ ] All user flows identified and tested
- [ ] 40-60 E2E tests written
- [ ] All tests passing (100% pass rate)
- [ ] Visual regression tests at 3 breakpoints
- [ ] Cross-feature integration verified
- [ ] Accessibility tested
- [ ] No flaky tests
- [ ] Tests run in CI/CD
- [ ] STORY_TRACKER.md updated with status ✅ Done
- [ ] Committed with message: "feat: E2E Integration Tests (STORY-[ID])"
- [ ] Documented actual time spent

---

**Last Updated:** [YYYY-MM-DD]
**Completed By:** [Agent name]
**Actual Time:** [X hours]
