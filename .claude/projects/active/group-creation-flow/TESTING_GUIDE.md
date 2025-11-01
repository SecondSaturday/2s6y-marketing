# Testing Guide: 5-Group Creation Limit

**Feature**: Group creation limit enforcement
**Branch**: `feature/deadline-enforcement`

---

## Quick Test (5 minutes)

### Prerequisites

1. Dev server running: `npm run dev`
2. Browser open to: `http://localhost:3000/dashboard`
3. Signed in with test account

---

## Test 1: Below Limit (Normal Flow)

**Setup**: Account with 0-4 groups created

**Steps**:
1. Open dashboard
2. Click menu button (3 dots in top right)
3. Observe "Create New Group" menu item
4. Click "Create New Group"
5. Observe navigation

**Expected Results**:
- ✅ Menu item is NOT dimmed (full opacity)
- ✅ NO "Limit Reached" badge visible
- ✅ Clicking navigates to `/create-group`
- ✅ Welcome screen loads successfully

---

## Test 2: At Limit (5 Groups)

### 2a. Menu Disabled State

**Setup**: Account with 5 groups created (as admin)

**Steps**:
1. Open dashboard
2. Click menu button (3 dots in top right)
3. Observe "Create New Group" menu item appearance
4. Click "Create New Group"
5. Observe alert and navigation

**Expected Results**:
- ✅ Menu item is dimmed (opacity-50)
- ✅ "Limit Reached" badge visible (yellow/warning color)
- ✅ Cursor shows "not-allowed" on hover
- ✅ Clicking shows alert: "You've reached the maximum of 5 groups. Delete a group to create a new one."
- ✅ Does NOT navigate to `/create-group`
- ✅ Menu closes after clicking OK on alert

**Visual Check**:
```
Create New Group    [Limit Reached]
^                   ^
dimmed text         yellow badge
```

---

### 2b. Direct URL Access (Redirect)

**Setup**: Account with 5 groups created

**Steps**:
1. In browser URL bar, navigate to: `http://localhost:3000/create-group`
2. Observe alert and redirect

**Expected Results**:
- ✅ Alert shows: "You've reached the maximum of 5 groups. Delete a group to create a new one."
- ✅ Immediately redirects to `/dashboard`
- ✅ Does NOT show group creation welcome screen

---

### 2c. Empty State with Limit

**Setup**: Account with 5 groups created, then ALL groups deleted

**Steps**:
1. Open dashboard
2. Observe empty state

**Expected Results**:
- ✅ Message shows: "Your groups will appear here"
- ✅ "Create Your First Group" button is NOT visible
- ✅ Menu "Create New Group" still shows "Limit Reached" badge

**Why**: Even though user has 0 active groups, they've still created 5 total (limit enforcement counts created groups, not active groups).

**Note**: This is an edge case. In production, we may want to reset the limit if all groups are deleted. Discuss with product owner.

---

## Test 3: Edge Case - Delete Group to Free Slot

**Setup**: Account with 5 groups created

**Steps**:
1. Open dashboard (menu shows "Limit Reached")
2. Navigate to any group settings page
3. Delete the group
4. Return to dashboard
5. Click menu button
6. Observe "Create New Group" menu item

**Expected Results**:
- ✅ Menu item is NO LONGER dimmed
- ✅ "Limit Reached" badge is GONE
- ✅ Can click and navigate to `/create-group`
- ✅ Can create new group successfully

---

## Test 4: Backend Enforcement (Failsafe)

**Setup**: Developer tools open, account with 5 groups

**Steps**:
1. Open browser DevTools → Console
2. Navigate to `/create-group` (should redirect)
3. In console, manually call the mutation (if you can bypass UI):
   ```javascript
   // This is for testing only - UI should prevent this
   await createGroupMutation({
     name: "Test Group",
     meta: "test-group",
     // ... other args
   });
   ```

**Expected Results**:
- ✅ Mutation throws `ConvexError`
- ✅ Error code: `LIMIT_EXCEEDED`
- ✅ Error message: "Stay tuned for increased limits"
- ✅ Group is NOT created

**Why**: Backend is the final line of defense. Even if UI is bypassed, backend rejects the request.

---

## Visual Regression Tests (Playwright)

### Desktop (1440px)

**Screenshot**: `tests/visual/dashboard-menu-at-limit-desktop.png`

**Capture**:
1. Sign in with account at 5-group limit
2. Open dashboard
3. Click menu button
4. Take screenshot of menu dropdown

**Expected**:
- Menu item shows "Limit Reached" badge
- Text is dimmed

---

### Mobile (375px)

**Screenshot**: `tests/visual/dashboard-menu-at-limit-mobile.png`

**Capture**:
1. Sign in with account at 5-group limit
2. Open dashboard
3. Click menu button
4. Take screenshot of menu dropdown

**Expected**:
- Same as desktop (responsive)

---

## Manual Test Accounts

**Account 1: Below Limit**
- Email: `test-below-limit@example.com`
- Password: (ask for credentials)
- Groups Created: 2/5

**Account 2: At Limit**
- Email: `test-at-limit@example.com`
- Password: (ask for credentials)
- Groups Created: 5/5

**Account 3: Fresh (0 groups)**
- Email: `test-fresh@example.com`
- Password: (ask for credentials)
- Groups Created: 0/5

---

## Debugging Checklist

If tests fail, check:

1. **Backend Constants**:
   - File: `convex/constants/limits.ts`
   - Verify: `maxGroupsCreated: 5` (not 2)

2. **Query Result**:
   - Open DevTools → React DevTools → Components
   - Find `DashboardContent` component
   - Check `createCheck` value:
     ```
     {
       canCreate: false,
       currentCount: 5,
       maxAllowed: 5,
       message: "Stay tuned for increased limits"
     }
     ```

3. **Prop Passing**:
   - File: `app/dashboard/page.tsx`
   - Verify both `MenuDropdown` instances have `canCreateGroup={createCheck?.canCreate ?? true}`

4. **Component Props**:
   - File: `components/dashboard/MenuDropdown.tsx`
   - Verify `canCreateGroup` is destructured in component
   - Verify conditional logic in `onClick` handler

---

## Known Issues / Edge Cases

### Issue 1: Soft-Deleted Groups Count Toward Limit

**Current Behavior**: If user creates 5 groups then deletes all, they still can't create new groups (counter doesn't reset).

**Why**: `groupMembers` table filters by `status === "active"`, but once a group is deleted, the membership status changes to "removed" or "inactive". However, the limit check counts CREATED groups (admin memberships), not ACTIVE groups.

**Fix (if needed)**: Update backend limit check to only count groups where membership status is "active":
```typescript
const activeAdminCount = createdGroups.filter(
  (m) => m.role === "admin" && m.status === "active", // Already correct!
).length;
```

**Verification**: Check `convex/groups/mutations.ts` line 623-625. Should already filter by `status === "active"`.

---

### Issue 2: Race Condition (Multiple Tabs)

**Scenario**: User opens `/create-group` in 2 tabs simultaneously when at 4/5 limit.

**Expected**: First tab creates group (5/5), second tab's mutation fails with `LIMIT_EXCEEDED`.

**Why**: Backend check happens at mutation time, so second mutation will see 5 groups and reject.

**Test**:
1. Create account with 4 groups
2. Open 2 browser tabs
3. Navigate both to `/create-group`
4. Submit both forms simultaneously
5. Verify one succeeds, one fails

---

## Performance Considerations

**Query Frequency**: `canCreateGroup` query runs on:
- Dashboard page load
- `/create-group` page load

**Optimization**: Query is cached by Convex, so subsequent checks are fast.

**Cost**: Minimal (2 queries per dashboard visit for user with 5 groups).

---

## Accessibility

**Screen Reader Test**:
1. Enable VoiceOver (Mac) or NVDA (Windows)
2. Navigate to dashboard menu
3. Tab to "Create New Group" menu item
4. Verify screen reader announces:
   - "Create New Group"
   - "Limit Reached" (from badge)

**Keyboard Navigation**:
1. Tab to menu button
2. Press Enter to open menu
3. Tab to "Create New Group"
4. Press Enter
5. Verify alert shows and menu closes

---

## Next Steps After Testing

1. **Update CHANGELOG.md** with implementation details
2. **Commit changes** with message:
   ```
   feat: Enforce 5-group creation limit across all entry points

   - Update limit from 2 to 5 in backend constants
   - Add canCreateGroup prop to MenuDropdown component
   - Disable menu item and show "Limit Reached" badge when at limit
   - Redirect from /create-group page when at limit
   - Hide empty state CTA when at limit

   Backend validation already in place (mutations.ts line 627-635)
   ```
3. **Create PR** if tests pass
4. **Deploy to staging** for QA testing

---

**Last Updated**: 2025-10-25
