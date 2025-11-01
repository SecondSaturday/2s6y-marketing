# STORY-R2: Create Missing Core Pages (Group Home + Archive)

**Linear Issue**: [2S6-43](https://linear.app/2s6y/issue/2S6-43)
**Agent**: Frontend Agent
**Estimate**: 2-3 hours
**Type**: Sequential (BLOCKED by R1)
**Dependency**: 2S6-41 (STORY-R1)

---

## Context

Users currently navigate between Dashboard → Settings/Issues/Contribute with no unified group home page. No dedicated archive page for browsing past newsletters.

**Missing Pages**:
1. `/groups/[groupId]/page.tsx` - Group home
2. `/groups/[groupId]/archive/page.tsx` - Past issues list

---

## Acceptance Criteria

### Group Home Page
* Route `/groups/[groupId]/page.tsx` exists
* Shows contribution status (draft/submitted/locked)
* Shows quick action buttons (contribute, latest, archive, settings)
* Back button navigates to dashboard
* Settings icon navigates to group settings
* Non-members redirected to dashboard
* Mobile-responsive (3 breakpoints)

### Archive Page
* Route `/groups/[groupId]/archive/page.tsx` exists
* Lists all past issues (newest first)
* Shows month name, date sent, contributor count
* "View Issue" button works for each issue
* Empty state when no issues yet
* Back button navigates to group home
* Mobile-responsive (3 breakpoints)

### Navigation Integration
* Dashboard links to group home (click group card)
* Group home links to contribute
* Group home links to archive
* Archive links to individual issues
* No broken links

---

## Implementation Details

### Page 1: Group Home

**Layout**:
```
┌─────────────────────────────────────┐
│ Header: [← Back] Group Name  [⚙️]   │
├─────────────────────────────────────┤
│ Contribution Status Card            │
│ "Your November Update"              │
│ Status: Draft | Submitted | Locked  │
│ [Continue Editing] or [View Issue]  │
├─────────────────────────────────────┤
│ Quick Actions                       │
│ [📝 Contribute] [📰 Latest Issue]   │
│ [📚 Archive]    [⚙️ Settings]       │
└─────────────────────────────────────┘
```

**Queries needed**:
```typescript
const group = useQuery(api.groups.getById, { groupId });
const contribution = useQuery(api.contributions.getUserDraft, { groupId, month });
const latestIssue = useQuery(api.newsletters.getLatestForGroup, { groupId });
const memberCount = useQuery(api.groupMembers.countActiveMembers, { groupId });
```

**Components to create**:
- `ContributionStatusCard` - Status + CTA
- `QuickActionsGrid` - 2x2 action buttons
- `GroupStatsCard` - Member count, next issue date

### Page 2: Archive

**Layout**:
```
┌─────────────────────────────────────┐
│ Header: [← Back] Archive            │
├─────────────────────────────────────┤
│ November 2025                       │
│ Sent: Nov 9, 2025                   │
│ 8 contributors                      │
│ [View Issue →]                      │
├─────────────────────────────────────┤
│ October 2025                        │
│ ...                                 │
└─────────────────────────────────────┘
```

**Queries needed**:
```typescript
const newsletters = useQuery(api.newsletters.listForGroup, { groupId });
```

**Components to create**:
- `ArchiveIssueCard` - Month, date, count, view button

**Empty State**:
```tsx
{newsletters.length === 0 && (
  <div className="flex flex-col items-center py-12">
    <p>No newsletters yet. The first issue sends on the 2nd Saturday!</p>
  </div>
)}
```

---

## Testing Checklist

### Visual Tests
```bash
# Group home (3 breakpoints)
npx playwright screenshot http://localhost:3000/groups/[testGroupId] \
  --viewport-size=1920x1080
npx playwright screenshot http://localhost:3000/groups/[testGroupId] \
  --viewport-size=768x1024
npx playwright screenshot http://localhost:3000/groups/[testGroupId] \
  --viewport-size=375x667

# Archive (3 breakpoints)
# ... similar for archive page
```

### Navigation Tests
1. Dashboard → Group Home: Click group card
2. Group Home → Contribute: Click contribute button
3. Group Home → Archive: Click archive button
4. Archive → Issue: Click issue card
5. Back Navigation: Verify back buttons work

### Functional Tests
1. Contribution Status: Draft/submitted/locked display correctly
2. Quick Actions: All 4 buttons navigate correctly
3. Archive List: Past issues in correct order (newest first)
4. Empty States: Appropriate messages when no data
5. Access Control: Non-members cannot access

---

## Files to Create

**Create**:
* `app/groups/[groupId]/page.tsx` (Group home)
* `app/groups/[groupId]/archive/page.tsx` (Archive)
* `components/groups/ContributionStatusCard.tsx`
* `components/groups/QuickActionsGrid.tsx`
* `components/groups/GroupStatsCard.tsx`
* `components/groups/ArchiveIssueCard.tsx`

**Modify**:
* `app/dashboard/page.tsx` (update group card links)

---

## Quick Commands

```bash
# 1. Create page files
mkdir -p app/groups/[groupId]/archive
touch app/groups/[groupId]/page.tsx
touch app/groups/[groupId]/archive/page.tsx

# 2. Create component files
mkdir -p components/groups
touch components/groups/ContributionStatusCard.tsx
touch components/groups/QuickActionsGrid.tsx
touch components/groups/GroupStatsCard.tsx
touch components/groups/ArchiveIssueCard.tsx

# 3. Run dev server
npm run dev

# 4. Test navigation
open http://localhost:3000/dashboard
```

---

## Success Checklist

- [ ] Group home page created
- [ ] Archive page created
- [ ] All components implemented
- [ ] Contribution status displays correctly
- [ ] Quick actions navigate correctly
- [ ] Archive lists past issues
- [ ] Empty states display
- [ ] Dashboard links updated
- [ ] No broken links
- [ ] Mobile-responsive (3 breakpoints)

---

**Estimated Time**: 2-3 hours
**Blocked By**: STORY-R1 (needs correct contribute route)
**Blocks**: None (final story)
