# [Feature Name] - UEDS Implementation

**Project ID**: [YYYY-MM-feature-name]
**Status**: 🔄 In Progress / ✅ Completed
**Framework Version**: UEDS 1.0
**Started**: [Date]
**Completed**: [Date or N/A]
**Duration**: [X hours]

---

## Feature Overview

[Brief description of what this feature does - 2-3 sentences]

**Business Value**:
- [Value proposition 1]
- [Value proposition 2]

**User Impact**:
- [How users benefit 1]
- [How users benefit 2]

**Technical Scope**:
- [Technical detail 1]
- [Technical detail 2]

---

## Tracks & Stories

### Track A (Backend - Database & API)
**Stories**: [X stories]
- STORY-A1: [Schema Migration] - [Brief description]
- STORY-A2: [Helper Functions] - [Brief description]
- STORY-A3: [Mutation 1] - [Brief description]
- STORY-A4: [Mutation 2] - [Brief description]
- STORY-A5: [Query 1] - [Brief description]
- STORY-A6: [Query 2] - [Brief description]

**Status**: [X/Y completed] ([Z%])

### Track B (UI Foundation)
**Stories**: [X stories]
- STORY-B1: [Page Scaffold] - [Brief description]
- STORY-B2: [Tab Content 1] - [Brief description]
- STORY-B3: [Tab Content 2] - [Brief description]
- STORY-B4: [Shared Components] - [Brief description]

**Status**: [X/Y completed] ([Z%])

### Track C ([Feature] UI)
**Stories**: [X stories]
- STORY-C1: [Component 1] - [Brief description]
- STORY-C2: [Component 2] - [Brief description]
- [... more stories]

**Status**: [X/Y completed] ([Z%])

### Track D ([Optional Track Name])
**Stories**: [X stories]
- [List stories]

**Status**: [X/Y completed] ([Z%])

### Track E (Notifications & Email)
**Stories**: [X stories]
- STORY-E1: [In-App Notifications] - [Brief description]
- STORY-E2: [Email Templates] - [Brief description]
- STORY-E3: [Email Integration] - [Brief description]

**Status**: [X/Y completed] ([Z%])

### Track F (Integration & Polish)
**Stories**: [X stories]
- STORY-F1: [E2E Tests] - [Brief description]
- STORY-F2: [Performance] - [Brief description]
- STORY-F3: [Documentation] - [Brief description]

**Status**: [X/Y completed] ([Z%])

**Total Stories**: [X stories]
**Total Estimated Time**: [X hours]

---

## Dependencies

### External Dependencies
- [Service/Library 1]: [Why needed]
- [Service/Library 2]: [Why needed]

### Internal Dependencies
- [Feature 1]: [Why needed]
- [Feature 2]: [Why needed]

### Prerequisites
- [ ] [Prerequisite 1]
- [ ] [Prerequisite 2]

---

## Quick Links

- [Story Tracker](./STORY_TRACKER.md) - Live progress dashboard
- [Story Index](./STORY_INDEX.md) - Dependency graph & relationships
- [Framework Reference](../../core/UEDS.md) - UEDS framework documentation
- [Testing Guide](../../guides/testing.md) - Testing protocols
- [Design System](../../core/design-system.md) - Design tokens & components

---

## Architecture

### Database Schema
**Tables Modified/Created**:
- `[tableName1]` - [Purpose]
- `[tableName2]` - [Purpose]

### API Endpoints
**Mutations**:
- `[mutationName1]` - [Purpose]
- `[mutationName2]` - [Purpose]

**Queries**:
- `[queryName1]` - [Purpose]
- `[queryName2]` - [Purpose]

### Frontend Routes
- `/[route1]` - [Purpose]
- `/[route2]` - [Purpose]

### Components Created
- `[ComponentName1]` - [Purpose]
- `[ComponentName2]` - [Purpose]

---

## Testing Strategy

### Unit Tests (Backend)
- **Target**: 5+ tests per mutation/query
- **Coverage**: Happy path, auth, validation, errors, edge cases
- **Framework**: convex-test

### E2E Tests (Frontend)
- **Target**: 8+ tests per page/component
- **Coverage**: Functional (3+), Visual (3+), State (2+)
- **Framework**: Playwright

### Integration Tests
- **Target**: 40-60 comprehensive tests
- **Coverage**: User flows, cross-feature, accessibility
- **Framework**: Playwright

### Visual Regression
- **Breakpoints**: Desktop (1440px), Tablet (768px), Mobile (375px)
- **Tool**: Playwright screenshots

**Total Test Count**: [X tests]

---

## Results (Fill when complete)

### Stories Completed
- **Completed**: X/Y stories (Z%)
- **In Progress**: X stories
- **Blocked**: X stories

### Testing Metrics
- **Unit Tests**: X/X passing (100%)
- **E2E Tests**: X/X passing (100%)
- **Visual Tests**: X/X passing (100%)
- **Total Tests**: X/X passing (100%)

### Quality Metrics
- **Design System Compliance**: [X%] (Target: 100%)
- **Type Safety**: [X%] (Target: 100%)
- **Test Coverage**: [X%] (Target: 80%+)
- **Performance**: [Pass/Fail]

### Velocity Metrics
- **Estimated Time**: [X hours]
- **Actual Time**: [Y hours]
- **Variance**: [+/- Z%]
- **Average Story Time**: [X hours]

### Framework Effectiveness
- **TDD Compliance**: [X/Y stories] ([Z%])
- **Test-First Stories**: [X stories]
- **Contract-Driven Stories**: [X stories]

---

## Lessons Learned (Fill when complete)

### Top 3 Wins
1. [Win 1] - [Why it worked well]
2. [Win 2] - [Why it worked well]
3. [Win 3] - [Why it worked well]

### Top 3 Challenges
1. [Challenge 1] - [How it was resolved]
2. [Challenge 2] - [How it was resolved]
3. [Challenge 3] - [How it was resolved]

### What Worked Well
- [Thing 1]
- [Thing 2]
- [Thing 3]

### What Could Be Improved
- [Improvement 1]
- [Improvement 2]
- [Improvement 3]

### Unexpected Issues
- [Issue 1] - [Impact and resolution]
- [Issue 2] - [Impact and resolution]

---

## Framework Improvements Discovered (Fill when complete)

### Template Improvements
- [Template 1]: [Suggested change]
- [Template 2]: [Suggested change]

### Process Improvements
- [Process 1]: [Suggested change]
- [Process 2]: [Suggested change]

### Tool Additions
- [Tool 1]: [Why it would help]
- [Tool 2]: [Why it would help]

### Documentation Gaps
- [Gap 1]: [What's missing]
- [Gap 2]: [What's missing]

---

## Retrospective Notes

### Team Velocity
- **Stories per day**: [X stories]
- **Fastest story**: [STORY-XX] ([X hours])
- **Slowest story**: [STORY-YY] ([Y hours])
- **Bottlenecks**: [Describe any bottlenecks]

### TDD Effectiveness
- **Test-first adherence**: [X%]
- **Bugs caught by tests**: [X bugs]
- **Bugs in production**: [X bugs]
- **Test maintenance**: [Easy/Medium/Hard]

### Contract-Driven Development
- **Stories using contracts**: [X stories]
- **Integration failures**: [X failures]
- **Contract benefits**: [Describe benefits]

### Design System Compliance
- **Violations found**: [X violations]
- **Time saved by system**: [X hours]
- **Most used components**: [List components]

---

## Next Steps

### Follow-Up Work
- [ ] [Follow-up task 1]
- [ ] [Follow-up task 2]

### Future Enhancements
- [ ] [Enhancement 1]
- [ ] [Enhancement 2]

### Technical Debt
- [ ] [Debt item 1] - [Priority: High/Medium/Low]
- [ ] [Debt item 2] - [Priority: High/Medium/Low]

---

## References

### Documentation
- [Link to technical docs]
- [Link to user docs]
- [Link to API docs]

### Related Projects
- [Related project 1]
- [Related project 2]

### External Resources
- [Resource 1]
- [Resource 2]

---

*This project uses UEDS 1.0. See [CHANGELOG](../../CHANGELOG.md) for framework version details.*

**Last Updated**: [YYYY-MM-DD]
**Maintained By**: [Team/Person]
