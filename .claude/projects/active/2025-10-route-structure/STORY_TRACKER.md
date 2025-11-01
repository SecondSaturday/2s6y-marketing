# Route Structure Refactor + Core Pages - Story Tracker

**Linear Project**: [Route Structure Refactor + Core Pages](https://linear.app/2s6y/project/route-structure-refactor-core-pages-e5b7cd50cc77)
**Priority**: P0 (Blocker)
**Estimated Total Time**: 4-5 hours
**Status**: NOT STARTED

---

## Overview

Fix route structure to match MVP spec (`/groups/[groupId]/*` pattern) and build missing core pages for group navigation.

**MVP Blocker**: Contribution form at wrong route (`/contribute` not `/groups/[groupId]/contribute`), no group home page, no archive page.

---

## Stories (2 total)

### ⚠️ Sequential Stories (R1 must complete before R2)

| Story | Linear ID | Status | Time | Agent | Blocks |
|-------|-----------|--------|------|-------|--------|
| STORY-R1: Migrate Contribution Route | 2S6-41 | ⬜ TODO | 2-3h | Frontend | R2 |
| STORY-R2: Create Missing Pages | 2S6-43 | ⬜ BLOCKED | 2-3h | Frontend | None |

---

## Execution Strategy

### Phase 1: Route Migration (2-3 hours)
```bash
# STORY-R1: Move /contribute to /groups/[groupId]/contribute
claude --session r1-migrate-route
```

**Expected Output**:
- `/app/groups/[groupId]/contribute/page.tsx` created
- `/app/contribute/` deleted
- Group selection removed (use URL param)
- Dashboard links updated
- No broken links

### Phase 2: Missing Pages (2-3 hours)
```bash
# STORY-R2: Create group home + archive pages (AFTER R1 COMPLETE)
claude --session r2-missing-pages
```

**Expected Output**:
- `/app/groups/[groupId]/page.tsx` (Group home)
- `/app/groups/[groupId]/archive/page.tsx` (Past issues list)
- Components: ContributionStatusCard, QuickActionsGrid, ArchiveIssueCard
- Navigation updated

---

## Dependencies

**External**:
- Dashboard page exists (✅ implemented)
- Group settings page exists (✅ implemented)
- Issue display page exists (✅ implemented)

**Internal**:
- STORY-R2 blocked by STORY-R1 (needs correct contribute route for navigation links)

---

## Acceptance Criteria

### Route Migration (STORY-R1)
- [ ] New route `/groups/[groupId]/contribute/page.tsx` exists
- [ ] Old route `/app/contribute/` deleted
- [ ] URL param extraction works (groupId from route)
- [ ] User access validation (non-members redirected)
- [ ] No group tabs (single group context only)
- [ ] Dashboard links updated
- [ ] No TypeScript errors
- [ ] Mobile-responsive (3 breakpoints)

### Missing Pages (STORY-R2)
- [ ] Group home page created with contribution status
- [ ] Quick actions grid (contribute, latest, archive, settings)
- [ ] Archive page lists all past issues
- [ ] Navigation integration complete
- [ ] Empty states handle gracefully
- [ ] Mobile-responsive (3 breakpoints)
- [ ] No broken links

---

## Quick Start

See [QUICK_START.md](./QUICK_START.md) for detailed execution instructions.

---

**Last Updated**: 2025-10-22
**Linear Project ID**: 005cda20-f6bf-41a8-ba75-77975813d909
