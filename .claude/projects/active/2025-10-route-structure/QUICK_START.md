# Route Structure Refactor + Core Pages - Quick Start Guide

**Project**: Route Structure Refactor + Core Pages
**Linear Project**: https://linear.app/2s6y/project/route-structure-refactor-core-pages-e5b7cd50cc77
**Total Time**: 4-5 hours (sequential execution required)

---

## Overview

Fix route structure to match MVP spec (`/groups/[groupId]/*` pattern) and build missing core pages. Currently contribution form is at wrong location (`/contribute` not `/groups/[groupId]/contribute`), and there's no group home or archive page.

**Why This Matters**: Violates MVP route structure, causes navigation confusion, and prevents unified group navigation experience.

---

## Execution Strategy

### ⚠️ Sequential Execution REQUIRED

Stories MUST run in order (R2 needs correct contribute route from R1):

```bash
# Step 1: STORY-R1 (Route migration) - MUST COMPLETE FIRST
cd /Users/kalyanchandana/Documents/GitHub/2Sat-lite
claude-code

# When Claude asks:
"Implement STORY-R1 from .claude/projects/active/2025-10-route-structure/STORY-R1-migrate-route.md
Use frontend-dev agent. Move /contribute to /groups/[groupId]/contribute, update all navigation links."

# Step 2: STORY-R2 (Missing pages) - AFTER R1 COMPLETE
cd /Users/kalyanchandana/Documents/GitHub/2Sat-lite
claude-code

# When Claude asks:
"Implement STORY-R2 from .claude/projects/active/2025-10-route-structure/STORY-R2-missing-pages.md
Use frontend-dev agent. Create group home and archive pages with navigation integration."
```

---

## Prerequisites

Before starting:

1. **Dashboard Page Exists** (✅ Already implemented):
   - `app/dashboard/page.tsx`

2. **Group Settings Page Exists** (✅ Already implemented):
   - `app/groups/[groupId]/settings/page.tsx`

3. **Issue Display Page Exists** (✅ Already implemented):
   - `app/groups/[groupId]/issues/[month]/page.tsx`

4. **Contribution Form Exists** (✅ At wrong location):
   - Current: `app/contribute/page.tsx` (424 lines)
   - Target: `app/groups/[groupId]/contribute/page.tsx`

---

## Story Details

### STORY-R1: Migrate Contribution Route (2-3 hours)

**What**: Move contribution form from `/contribute` to `/groups/[groupId]/contribute`

**Why**: Violates MVP route structure, makes group context unclear

**Files to Create**:
- `app/groups/[groupId]/contribute/page.tsx` (migrated from /contribute)

**Files to Modify**:
- `app/dashboard/page.tsx` (update contribute links)
- Any other files with `/contribute` links

**Files to Delete**:
- `app/contribute/page.tsx`
- `app/contribute/` directory

**Key Changes**:
```typescript
// Extract groupId from URL params
const params = useParams();
const groupId = params.groupId as Id<"groups">;

// Remove group selection state (no more tabs)
// Verify user access to group
// Update navigation links
```

**Success**: Contribution form at correct route, no broken links, TypeScript compiles

---

### STORY-R2: Create Missing Pages (2-3 hours)

**What**: Build group home page and archive page

**Why**: No unified group landing page, no dedicated archive browser

**Files to Create**:
- `app/groups/[groupId]/page.tsx` (Group home)
- `app/groups/[groupId]/archive/page.tsx` (Past issues)
- `components/groups/ContributionStatusCard.tsx`
- `components/groups/QuickActionsGrid.tsx`
- `components/groups/GroupStatsCard.tsx`
- `components/groups/ArchiveIssueCard.tsx`

**Files to Modify**:
- `app/dashboard/page.tsx` (group cards link to group home)

**Key Features**:
- **Group Home**: Contribution status, quick actions (contribute/latest/archive/settings)
- **Archive**: List of all past newsletters (newest first)
- **Navigation**: Dashboard → Group Home → Contribute/Archive/Settings

**Success**: Both pages created, navigation integrated, mobile-responsive

---

## Verification Checklist

After completing both stories:

### Route Migration Verification (R1)
- [ ] New route `/groups/[groupId]/contribute/page.tsx` exists
- [ ] Old route `/app/contribute/` deleted completely
- [ ] URL param extraction works (groupId from route)
- [ ] User access validated (non-members redirected)
- [ ] No group tabs (single group context)
- [ ] Dashboard links updated to new route
- [ ] No TypeScript errors
- [ ] Form saves contributions correctly
- [ ] Visual tests at 3 breakpoints

### Missing Pages Verification (R2)
- [ ] Group home page exists and loads
- [ ] Archive page exists and loads
- [ ] Contribution status card displays correctly
- [ ] Quick actions grid navigates correctly
- [ ] Archive lists past issues (newest first)
- [ ] Empty states display appropriately
- [ ] Dashboard links to group home (not settings)
- [ ] All navigation paths work
- [ ] No broken links across entire app
- [ ] Mobile-responsive (3 breakpoints)

### Integration Verification
- [ ] Navigation flow: Dashboard → Group Home → Contribute
- [ ] Navigation flow: Dashboard → Group Home → Archive
- [ ] Navigation flow: Group Home → Latest Issue
- [ ] Navigation flow: Archive → Specific Issue
- [ ] Back buttons return to correct pages
- [ ] No `grep -r 'href="/contribute"' app/` results (all links updated)

---

## Troubleshooting

### Issue: TypeScript error on groupId type
**Solution**: Cast URL param: `params.groupId as Id<"groups">`

### Issue: Broken links after migration
**Solution**: Search all files: `grep -r 'href="/contribute"' app/`

### Issue: Group home not loading
**Check**:
1. File exists at `app/groups/[groupId]/page.tsx`
2. Dynamic route folder uses `[groupId]` not `[id]`
3. Queries use correct groupId param

### Issue: Non-members can access group pages
**Solution**: Add access check in every group page:
```typescript
const groupMember = useQuery(api.groupMembers.getByUserAndGroup, { groupId });

useEffect(() => {
  if (groupMember === null) {
    router.push("/dashboard");
  }
}, [groupMember]);
```

---

## Success Metrics

**Project Complete When**:
- ✅ All routes follow `/groups/[groupId]/*` pattern
- ✅ Contribution form at correct location
- ✅ Group home page provides unified navigation
- ✅ Archive page allows browsing past issues
- ✅ No broken links across entire app
- ✅ Mobile-responsive (all pages at 3 breakpoints)
- ✅ User experience improved (logical navigation flow)

**Next Steps After Completion**:
1. Test navigation with real users
2. Monitor for broken link reports
3. Consider adding breadcrumbs
4. Optimize mobile UX for quick actions

---

## Resources

**Existing Code**:
- Dashboard: `app/dashboard/page.tsx`
- Group settings: `app/groups/[groupId]/settings/page.tsx`
- Issue display: `app/groups/[groupId]/issues/[month]/page.tsx`
- Current contribute: `app/contribute/page.tsx` (to be moved)

**Linear Project**:
- [Route Structure Refactor + Core Pages](https://linear.app/2s6y/project/route-structure-refactor-core-pages-e5b7cd50cc77)

**Related TODO.md Section**:
- PROJECT 3: Route Structure Refactor + Core Pages

---

**Last Updated**: 2025-10-22
**Estimated Total Time**: 4-5 hours
**Parallelizable**: No (R2 blocked by R1)
