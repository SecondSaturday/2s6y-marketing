# Common Challenges - Cross-Project Insights

**Purpose**: Aggregate challenges from all project postmortems

---

## Challenge 1: Test Execution Issues

**Frequency**: [X projects]

**Projects Affected**:
- 2025-10-group-settings (Session 3)
- [Other projects]

**Symptoms**:
- Tests won't execute
- Import errors
- Config conflicts

**Root Causes**:
- Vitest/Playwright config conflict
- Test file organization
- Missing dependencies

**Solutions Applied**:
- Separate test directories (`tests/unit/`, `tests/`)
- Dedicated config files
- Test execution verification protocol

**Prevention**:
- Foundation story includes test runner setup verification
- Template includes config files

---

## Challenge 2: Implementation Failures (Test Pass Rate <100%)

**Frequency**: [X projects]

**Projects Affected**:
- 2025-10-group-settings (Session 9 - 77% failure rate)

**Symptoms**:
- Tests execute but fail
- Agent marks story complete despite failures

**Root Causes**:
- Missing required fields in test fixtures
- Authentication not mocked
- Agent confusion: "tests executing" ≠ "tests passing"

**Solutions Applied**:
- Implementation Failure Detection Protocol
- 100% pass rate mandatory
- Test results section in story template

**Prevention**:
- Factory pattern ensures consistent test data
- Story template enforces test results documentation

---

## Challenge 3: Design System Violations

**Frequency**: [X projects]

**Projects Affected**:
- [List affected projects]

**Symptoms**:
- Hardcoded colors
- Arbitrary spacing
- Custom components

**Root Causes**:
- Agent not referencing design system
- Unclear enforcement
- No automated checking

**Solutions Applied**:
- Strict design system.md
- Frontend agent protocol enforcement
- Visual regression tests

**Prevention**:
- Frontend agent auto-references design-system.md
- Visual tests at 3 breakpoints mandatory

---

## [Add More Challenges as Discovered]

---

**Update Instructions**:
After each project postmortem:
1. Review "Challenges & Solutions" section
2. Add new challenges to this document
3. Update frequency count for recurring challenges
4. Note if solution from previous project was effective
