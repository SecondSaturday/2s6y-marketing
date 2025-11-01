# Group Invite System V2 - UEDS Session Launch

**Copy and paste this entire prompt to start a UEDS session:**

---

I'm ready to start the **Group Invite System V2** UEDS project. This is a comprehensive architectural overhaul of the group invitation system with the following scope:

## Project Context

**Linear Project**: https://linear.app/2s6y/project/group-invite-system-v2-7f013ff387db
**Story Tracker**: `.claude/projects/active/invite-system-v2/STORY_TRACKER.md`
**Timeline**: 1-2 weeks (Target: Nov 9, 2025)
**Strategy**: Fresh start migration (expire old invites), direct to production

## Key Features
1. ✅ Single invite code per group (250M combinations)
2. ✅ Dual-flow system (email auto-join vs join requests)
3. ✅ Rate limiting (50 invites/user/week)
4. ✅ Bulk invite UI
5. ✅ Rich notifications
6. ✅ Mobile-first responsive design

## Critical Requirements
- **Testing Level**: Unit tests (TDD) + Visual regression + E2E integration
- **Mobile-First**: All UI must work perfectly on iOS Safari & Chrome Mobile
- **Edge Cases**: All 7 identified edge cases must be handled
- **Performance**: Page load <2s, Lighthouse mobile >90

## Execution Plan

### Phase 1: Architecture Review (STORY-F0) - **START HERE**
Use the **Strategic Planner** agent to:
1. Review all contracts in `CONTRACTS.md`
2. Approve architecture diagram
3. Validate testing strategy
4. Sign off on migration plan
5. Greenlight parallel execution

**After Gate 1 approval**, proceed to Phase 2 & 3 in parallel.

### Phase 2: Backend (Parallel) - Stories B1-B5
Use the **Backend Agent** with TDD:
- STORY-B1: Schema migration & code generator (BLOCKING)
- STORY-B2: Rate limiting system
- STORY-B3: Invite mutations (create, bulk, regenerate)
- STORY-B4: Accept invite & join request flow
- STORY-B5: Notification system integration

### Phase 3: Frontend (Parallel) - Stories F1-F5
Use the **Frontend Agent** with visual regression:
- STORY-F1: Invite acceptance page redesign
- STORY-F2: Bulk invite UI (settings)
- STORY-F3: Join group modal (dashboard)
- STORY-F4: Notification dropdown updates
- STORY-F5: Group creation flow updates

### Phase 4: Integration Testing - Stories I1-I3
Use the **Orchestrator** agent for E2E tests:
- STORY-I1: E2E email invite flow
- STORY-I2: E2E join request flow
- STORY-I3: Edge case testing suite (all 7 cases)

### Phase 5: Migration & Deployment - Stories M1, D1
- STORY-M1: Migration execution & validation (Backend Agent)
- STORY-D1: Production deployment & smoke tests (Deployment Agent)

## Review Gates (MANDATORY)
1. **Gate 1**: Architecture Review (before any coding)
2. **Gate 2**: Backend Code Review (after Phase 2)
3. **Gate 3**: Frontend UX Review (after Phase 3)
4. **Gate 4**: Integration Test Review (after Phase 4)
5. **Gate 5**: Pre-Deployment Review (before Phase 5)
6. **Gate 6**: Post-Deployment Validation (after deployment)

## Agent Assignments & MCPs

### Strategic Planner (STORY-F0)
- **MCPs**: Linear Server (project tracking)
- **Deliverables**: Architecture approval, contract sign-off

### Backend Agent (B1-B5, M1)
- **MCPs**: GitHub (PRs), Linear Server (issue updates)
- **Testing**: Vitest unit tests (>80% coverage)
- **Deliverables**: Convex functions, schema, migration script

### Frontend Agent (F1-F5)
- **MCPs**: Playwright (visual regression), GitHub, Linear Server
- **Testing**: 3 breakpoints (375px, 768px, 1440px)
- **Deliverables**: React components, responsive UI

### Orchestrator (I1-I3)
- **MCPs**: Playwright (E2E), GitHub, Linear Server
- **Testing**: Full user flows, mobile E2E
- **Deliverables**: Integration tests, edge case coverage

### Deployment Agent (D1)
- **MCPs**: Vercel, GitHub, Linear Server
- **Testing**: Smoke tests, monitoring
- **Deliverables**: Production deployment, validation

## Contracts (See CONTRACTS.md)
All contracts MUST be approved in Gate 1 before proceeding:
- Database schema changes
- API contracts (mutations/queries)
- Frontend-backend integration
- Notification payloads
- Migration script

## Mobile-First Mandate
Every UI component MUST:
- Work on iOS Safari (real device test)
- Work on Chrome Mobile (real device test)
- Have touch targets ≥44x44px
- Have text ≥16px
- Pass Lighthouse mobile >90

## Success Criteria
- [ ] All 16 stories completed
- [ ] All 6 review gates passed
- [ ] Unit test coverage >80%
- [ ] All visual regression tests pass
- [ ] All E2E tests pass
- [ ] All 7 edge cases handled
- [ ] Mobile flows perfect (iOS + Android)
- [ ] Production deployment successful
- [ ] No critical errors in first 24 hours

## Parallel Execution Strategy
After STORY-B1 completes:
- Launch **4 parallel agents**: B2, B3, F1, F2
- Maximize throughput while respecting dependencies
- Use STORY_TRACKER.md for coordination

---

**I'm ready to begin. Please start with STORY-F0 (Architecture Review) using the Strategic Planner agent.**

Invoke the agent with:
```
Use the Task tool with subagent_type=strategic-planner
```

After Gate 1 approval, I'll coordinate parallel execution of Phases 2 & 3.
