# STORY-R1: Migrate Contribution Form to Correct Route

**Linear Issue**: [2S6-41](https://linear.app/2s6y/issue/2S6-41)
**Agent**: Frontend Agent
**Estimate**: 2-3 hours
**Type**: Sequential (must complete before R2)
**Dependencies**: None

---

## Context

The contribution form currently lives at `/contribute` but should be at `/groups/[groupId]/contribute` to match MVP route structure.

**Current State**:
- **File**: `/app/contribute/page.tsx` (424 lines)
- **Route**: `/contribute`
- **Problem**: Violates `/groups/[groupId]/*` pattern

**Target State**:
- **File**: `/app/groups/[groupId]/contribute/page.tsx`
- **Route**: `/groups/[groupId]/contribute`
- **Benefit**: Logical group context

---

## Acceptance Criteria

* New route `/app/groups/[groupId]/contribute/page.tsx` exists
* Old route `/app/contribute/` deleted
* URL param extraction works (groupId from route)
* User access validation (non-members redirected)
* No group tabs (single group context only)
* Preview button navigates correctly
* Dashboard links updated
* No TypeScript errors
* Form saves contributions correctly
* Mobile-responsive (3 breakpoints)

---

## Implementation Tasks

### 1. Create New Route Structure

```bash
mkdir -p app/groups/[groupId]/contribute
# Move file (DO NOT copy)
```

### 2. Update Component Code

**Key changes**:

```typescript
// OLD (implicit group selection)
const [selectedGroupId, setSelectedGroupId] = useState<Id<"groups"> | null>(null);

// NEW (explicit groupId from URL)
import { useParams } from "next/navigation";
const params = useParams();
const groupId = params.groupId as Id<"groups">;

// Verify user has access
const groupMember = useQuery(api.groupMembers.getByUserAndGroup, { groupId });

// Redirect if not a member
useEffect(() => {
  if (groupMember === null) {
    router.push("/dashboard");
    toast.error("You don't have access to this group");
  }
}, [groupMember, router]);
```

### 3. Remove Group Tabs Component

Remove:
- GroupTab import
- Group selection state
- Group switching logic

### 4. Update Navigation Links

**Files to update**:
- `app/dashboard/page.tsx`: Update contribute links
- Any other files with `/contribute` links

```bash
# Search for hardcoded links
grep -r 'href="/contribute"' app/
```

### 5. Update Preview Button

```typescript
// OLD
router.push("/contribute/preview");

// NEW
router.push(`/groups/${groupId}/contribute/preview`);
```

### 6. Delete Old Route

```bash
rm -rf app/contribute
```

---

## Testing Checklist

### Visual Tests
```bash
npx playwright screenshot http://localhost:3000/groups/[testGroupId]/contribute \
  --viewport-size=1920x1080 -o screenshots/contribute-desktop.png

npx playwright screenshot http://localhost:3000/groups/[testGroupId]/contribute \
  --viewport-size=768x1024 -o screenshots/contribute-tablet.png

npx playwright screenshot http://localhost:3000/groups/[testGroupId]/contribute \
  --viewport-size=375x667 -o screenshots/contribute-mobile.png
```

### Functional Tests
1. Navigate: Dashboard → Group → Contribute
2. Verify: URL shows `/groups/[groupId]/contribute`
3. Test: Save contribution (should work identically)
4. Test: Preview button (navigate to correct preview)
5. Test: Back button (return to group home)
6. Test: Non-member access (redirect to dashboard)

### Navigation Integrity
```bash
# Check for broken links
grep -r 'href="/contribute"' app/  # Should return 0 results
```

---

## Files to Create/Modify

**Create**:
* `app/groups/[groupId]/contribute/page.tsx`

**Modify**:
* `app/dashboard/page.tsx` (update links)

**Delete**:
* `app/contribute/page.tsx`
* `app/contribute/` directory

---

## Quick Commands

```bash
# 1. Create new directory
mkdir -p app/groups/[groupId]/contribute

# 2. Move file (implementation will handle this)

# 3. Update component code (extract groupId from URL)

# 4. Search for broken links
grep -r 'href="/contribute"' app/

# 5. Delete old route
rm -rf app/contribute

# 6. Run dev server
npm run dev

# 7. Test navigation
open http://localhost:3000/dashboard
```

---

## Success Checklist

- [ ] New route exists at correct location
- [ ] Old route deleted completely
- [ ] URL param extraction works
- [ ] User access validated
- [ ] No group tabs
- [ ] Dashboard links updated
- [ ] No broken links remaining
- [ ] TypeScript compiles
- [ ] Form saves correctly
- [ ] Visual tests at 3 breakpoints

---

**Estimated Time**: 2-3 hours
**Blocked By**: None
**Blocks**: STORY-R2 (navigation links need correct route)
