# Post-Story Verification Checklist

## Before Marking Story as ✅ Done

### 1. Code Implementation
- [ ] All tasks in story file checked ✅
- [ ] All acceptance criteria checked ✅
- [ ] Code follows project conventions
- [ ] No TypeScript errors
- [ ] No Convex deployment errors

### 2. Test Execution ⚠️ CRITICAL
- [ ] **Tests written**: Files exist in correct location
- [ ] **Tests executed**: Ran appropriate test command
  - Backend: `npm run test:unit -- tests/unit/[file].test.ts`
  - Frontend: `npm run test:e2e -- tests/[file].spec.ts`
- [ ] **Tests passed**: Green output, **0 failures**
- [ ] **100% pass rate verified**: ALL tests pass, not just some
- [ ] **Evidence captured**: Pasted output showing 100% pass rate in story file

**🚨 STOP**: If pass rate <100%, mark story as 🚨 IMPLEMENTATION FAILED

**Pass Rate Calculation**:
```
Pass Rate = (Tests Passing / Total Tests) × 100%

Examples:
✅ 36/36 passing → 100% → Can mark ✅ Done
❌ 15/36 passing → 42% → 🚨 IMPL FAILED (fix all 21 failures)
❌ 0/10 passing → 0% → 🚨 IMPL FAILED (fix all 10 failures)
❌ 24/25 passing → 96% → 🚨 IMPL FAILED (even 1 failure blocks completion)

RULE: Only 100% pass rate = ✅ Done. Anything less = 🚨 IMPL FAILED.
```

### 3. Documentation
- [ ] Story file updated with test results
- [ ] Story file status changed to ✅ Done
- [ ] STORY_TRACKER.md updated to match
- [ ] Actual time spent documented
- [ ] Handoff notes completed (if blocking other stories)

### 4. Commit
- [ ] Changes committed with descriptive message
- [ ] Commit includes all file updates (code + docs)

---

## If Story is Blocked

1. **Do NOT mark as ✅ Done**
2. Update story status to 🚨 Blocked
3. Document blocker with error details
4. Update tracker blocker column
5. Escalate to orchestrator/user
6. Pause this story, switch to different ready story

## Common Mistakes

❌ "Tests written but can't run" → Mark as Done
✅ "Tests written but can't run" → Mark as 🚨 Blocked

❌ Update tracker, forget story file
✅ Update both story file AND tracker

❌ Skip test execution, assume tests work
✅ Always run and verify tests execute successfully

❌ "Tests execute, 15/36 passing" → Mark as Done
✅ "Tests execute, 15/36 passing" → Mark as 🚨 IMPL FAILED

❌ "24/25 tests passing, only 1 failure" → Mark as Done
✅ "24/25 tests passing, only 1 failure" → Mark as 🚨 IMPL FAILED

❌ "Most tests pass, close enough" → Mark as Done
✅ "Only 100% pass rate acceptable" → Fix ALL failures before marking Done
