# Group Invite System V2 - UEDS Project

**Status**: Ready to Launch 🚀
**Timeline**: 1-2 weeks (Target: Nov 9, 2025)
**Linear Project**: https://linear.app/2s6y/project/group-invite-system-v2-7f013ff387db

---

## 📋 Project Overview

Complete architectural overhaul of the group invitation system fixing critical flaws and adding enterprise-grade features.

### Problems Solved
- ❌ Dual code system (group code vs invite code) → ✅ Single code per group
- ❌ Only 40K combinations (collision risk) → ✅ 250M combinations
- ❌ No rate limiting (spam vulnerability) → ✅ 50 invites/user/week
- ❌ No bulk invite capability → ✅ Bulk invite with EmailInput component
- ❌ Missing join request flow → ✅ Dual-flow (auto-join vs requests)
- ❌ Poor notifications → ✅ Rich notifications in dropdown

### Key Features
1. **Single Invite Code** - One memorable code per group (e.g., `happy-basil-042`)
2. **Dual-Flow Invitations** - Email invite = auto-join, no invite = join request
3. **Rate Limiting** - 50 invites per user per week (prevent spam)
4. **Bulk Invites** - Send invites to multiple emails at once
5. **Rich Notifications** - In-app notifications for all invite events
6. **Mobile-First** - Perfect UX on iOS Safari & Chrome Mobile

---

## 📂 Project Structure

```
.claude/projects/active/invite-system-v2/
├── README.md                   # This file
├── STORY_TRACKER.md            # Complete story breakdown with dependencies
├── CONTRACTS.md                # Interface contracts (frontend ↔ backend)
├── SESSION_LAUNCH_PROMPT.md    # Copy-paste to start UEDS session
└── [Future: Individual story files will be created by agents]
```

---

## 🚀 How to Launch UEDS Session

### Step 1: Review Materials
1. Read `STORY_TRACKER.md` - Understand all 16 stories
2. Read `CONTRACTS.md` - Understand all interface contracts
3. Review Linear project - See stories in dashboard

### Step 2: Copy Launch Prompt
Open `SESSION_LAUNCH_PROMPT.md` and copy the ENTIRE prompt.

### Step 3: Start New Claude Session
Paste the prompt into a NEW Claude Code session (not this one).

### Step 4: Execute Phases
The session will guide you through:
1. **Gate 1**: Architecture Review (Strategic Planner)
2. **Phase 2 & 3**: Parallel backend + frontend (Backend Agent + Frontend Agent)
3. **Gate 2 & 3**: Code review + UX review
4. **Phase 4**: Integration testing (Orchestrator)
5. **Gate 4**: Integration test review
6. **Phase 5**: Migration + Deployment
7. **Gate 5 & 6**: Pre/post deployment validation

---

## 📊 Story Breakdown (16 Stories)

### Phase 1: Foundation (Sequential)
- **STORY-F0** [2h] - Architecture Review & Contracts ⚠️ GATE 1

### Phase 2: Backend (Parallel after B1)
- **STORY-B1** [6h] - Database Schema Migration & Code Generator 🔴 BLOCKING
- **STORY-B2** [4h] - Rate Limiting System
- **STORY-B3** [8h] - Invite Mutations (Create, Bulk, Regenerate)
- **STORY-B4** [10h] - Accept Invite & Join Request Flow
- **STORY-B5** [4h] - Notification System Integration

### Phase 3: Frontend (Parallel after contracts)
- **STORY-F1** [8h] - Invite Acceptance Page Redesign
- **STORY-F2** [6h] - Bulk Invite UI (Settings Page)
- **STORY-F3** [6h] - Join Group Modal (Dashboard)
- **STORY-F4** [4h] - Notification Dropdown Updates
- **STORY-F5** [4h] - Group Creation Flow Updates

### Phase 4: Integration (After Phase 2 & 3)
- **STORY-I1** [6h] - E2E Email Invite Flow ⚠️ GATE 4
- **STORY-I2** [6h] - E2E Join Request Flow
- **STORY-I3** [8h] - Edge Case Testing Suite (7 cases)

### Phase 5: Migration & Deployment (Final)
- **STORY-M1** [4h] - Migration Execution & Validation ⚠️ GATE 5
- **STORY-D1** [6h] - Production Deployment & Smoke Tests ⚠️ GATE 6

**Total Estimated Time**: ~92 hours
**With Parallelization**: ~60 hours (10-14 days)

---

## 🔑 Critical Success Criteria

### Testing Requirements
- [ ] Unit test coverage >80% (Backend)
- [ ] Visual regression tests pass (3 breakpoints: 375px, 768px, 1440px)
- [ ] E2E tests pass (email invite flow, join request flow)
- [ ] All 7 edge cases tested and passing
- [ ] Mobile E2E tests pass (iOS Safari, Chrome Mobile)

### Performance Requirements
- [ ] Page load <2 seconds
- [ ] Invite creation <500ms
- [ ] Bulk invite (10 emails) <2 seconds
- [ ] Mobile Lighthouse score >90

### Mobile Requirements
- [ ] All UI works on iOS Safari (real device test)
- [ ] All UI works on Chrome Mobile (real device test)
- [ ] Touch targets ≥44x44px
- [ ] Text ≥16px
- [ ] Responsive at 375px, 768px, 1440px

### Deployment Requirements
- [ ] Migration completes without data loss
- [ ] All smoke tests pass
- [ ] No critical errors in first 24 hours
- [ ] Error rate <1%
- [ ] Invite creation success rate >95%

---

## 🚦 Review Gates (6 Total)

### Gate 1: Architecture Review ⚠️ BLOCKING
**Before**: Phase 1
**Reviewer**: Strategic Planner
**Criteria**: Contracts approved, architecture sound, migration safe

### Gate 2: Backend Code Review
**After**: Phase 2 (all backend stories)
**Reviewers**: Code Reviewer, Security Specialist
**Criteria**: Unit tests pass, no security risks, code quality

### Gate 3: Frontend UX Review
**After**: Phase 3 (all frontend stories)
**Reviewers**: UX Reviewer
**Criteria**: Visual tests pass, mobile perfect, DaisyUI compliance

### Gate 4: Integration Test Review
**After**: Phase 4 (all integration tests)
**Reviewer**: Orchestrator
**Criteria**: All E2E tests pass, edge cases handled

### Gate 5: Pre-Deployment Review ⚠️ BLOCKING
**Before**: Phase 5 (deployment)
**Reviewers**: Code Reviewer, Backend Agent
**Criteria**: Migration tested, rollback plan ready

### Gate 6: Post-Deployment Validation
**After**: Deployment
**Reviewer**: Deployment Agent
**Criteria**: Smoke tests pass, no critical errors, monitoring green

---

## 📱 Mobile-First Mandate

**Every UI component MUST**:
1. Work perfectly on iOS Safari (test on real iPhone)
2. Work perfectly on Chrome Mobile (test on real Android)
3. Have touch targets ≥44px × 44px
4. Have minimum text size 16px
5. Be responsive at 375px (mobile), 768px (tablet), 1440px (desktop)
6. Pass Lighthouse mobile audit with score >90

**Testing Protocol**:
- [ ] Playwright visual regression at 3 breakpoints
- [ ] Manual test on real iOS device (Safari)
- [ ] Manual test on real Android device (Chrome)
- [ ] Lighthouse audit in mobile mode

---

## 🧪 Testing Strategy

### Backend Testing (TDD)
- **Tool**: Vitest
- **Coverage**: >80%
- **Scope**: All mutations, queries, helpers, edge cases

### Frontend Testing (Visual Regression)
- **Tool**: Playwright
- **Breakpoints**: 375px, 768px, 1440px
- **Scope**: All UI states (loading, error, success, empty)

### Integration Testing (E2E)
- **Tool**: Playwright
- **Scope**: Complete user flows, cross-layer verification
- **Focus**: Email invite flow, join request flow, 7 edge cases

### Smoke Testing (Post-Deployment)
- **Tool**: Manual + Playwright
- **Scope**: Critical paths (invite, accept, request, approve)
- **Duration**: First 24 hours after deployment

---

## 🔄 Parallel Execution Strategy

### After STORY-B1 Completes
Launch **4 agents in parallel**:
1. **Backend Agent** → STORY-B2 (Rate Limiting)
2. **Backend Agent** → STORY-B3 (Invite Mutations)
3. **Frontend Agent** → STORY-F1 (Acceptance Page)
4. **Frontend Agent** → STORY-F2 (Bulk Invite UI)

### Coordination
- Use `STORY_TRACKER.md` for status updates
- Agents update Linear issues on completion
- Orchestrator verifies contracts during integration phase

---

## 📦 Migration Strategy

**Strategy**: Fresh Start (Expire All Pending Invites)

### Why Fresh Start?
- Simplifies migration (no complex code mapping)
- Clean slate for new architecture
- Low user impact (most invites likely stale)

### Migration Steps
1. Backup production database (Convex snapshot)
2. Run migration on development environment
3. Validate migration results (check counts)
4. Test rollback procedure
5. Run migration on production
6. Verify all groups have codes
7. Verify all users initialized

### Rollback Plan
1. Revert schema to previous version
2. Deploy old code
3. Restore from backup if needed

---

## 🎯 Edge Cases (All 7 Must Pass)

1. **Code Regeneration** → Expire pending invites when admin regenerates code
2. **Multiple Pending Invites** → Correct group selected based on code
3. **Blocked Mid-Invitation** → User cannot accept if blocked between send and accept
4. **Expired During Acceptance** → Graceful error if invite expires during processing
5. **Rate Limit Mid-Batch** → All-or-nothing validation for bulk invites
6. **Join Request + Invite** → Auto-approve join request when email invite accepted
7. **Duplicate Email Invite** → Block with clear error message

---

## 💡 Quick Reference

### Linear Stories
- View all: https://linear.app/2s6y/project/group-invite-system-v2-7f013ff387db
- Individual story format: `2S6-70` through `2S6-85`

### Agent Assignments
- **Strategic Planner**: STORY-F0
- **Backend Agent**: B1, B2, B3, B4, B5, M1
- **Frontend Agent**: F1, F2, F3, F4, F5
- **Orchestrator**: I1, I2, I3
- **Deployment Agent**: D1

### MCPs Used
- **Linear Server** - All agents (issue tracking)
- **GitHub** - Backend, Frontend, Orchestrator, Deployment (PRs, branches)
- **Playwright** - Frontend (visual regression), Orchestrator (E2E)
- **Vercel** - Deployment Agent (production deployment)

---

## 🆘 Troubleshooting

### If Gate 1 Fails
- Review contracts in `CONTRACTS.md`
- Address concerns raised by Strategic Planner
- Update contracts and re-submit for approval

### If Tests Fail
- Check STORY_TRACKER.md for acceptance criteria
- Review test failures in agent output
- Fix issues and re-run tests

### If Deployment Fails
- Check rollback plan in STORY-M1
- Review deployment logs
- Execute rollback if critical errors

---

**Ready to start? Copy `SESSION_LAUNCH_PROMPT.md` and paste into a new Claude Code session!**
