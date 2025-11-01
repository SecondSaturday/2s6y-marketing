# STORY-F1: Exclusion Banner Component

**Linear ID**: 2S6-46
**Agent**: Frontend Agent (`frontend-dev`)
**Estimated Time**: 3 hours
**Status**: TODO
**Blocks**: STORY-I1

---

## User Story

As a user who didn't contribute to a monthly issue, when I view that issue in the archive, I want to see a friendly message explaining that I wasn't included, so I understand why my responses aren't shown.

---

## Acceptance Criteria

1. ✅ `ExclusionBanner.tsx` component created
2. ✅ Component displays at **top** of issue view page (`/groups/[groupId]/issues/[month]/page.tsx`)
3. ✅ Component only shows when `currentUser._id` is in `newsletter.excludedMemberIds`
4. ✅ Message: "The group missed you this month" with friendly icon
5. ✅ Uses DaisyUI alert component (cupcake theme)
6. ✅ Responsive design (mobile, tablet, desktop)
7. ✅ Accessibility compliant (WCAG 2.1 AA)
8. ✅ Visual tests passing (3 breakpoints: 375px, 768px, 1440px)

---

## Technical Details

### Files to Create/Modify
- `components/ExclusionBanner.tsx` - New component
- `app/groups/[groupId]/issues/[month]/page.tsx` - Integrate banner at top

### Component Structure
```tsx
// components/ExclusionBanner.tsx
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface ExclusionBannerProps {
  groupName?: string; // Optional for personalization
}

export default function ExclusionBanner({ groupName }: ExclusionBannerProps) {
  return (
    <div role="alert" className="alert alert-info mb-6">
      <InformationCircleIcon className="w-6 h-6" />
      <div>
        <h3 className="font-bold">The group missed you this month</h3>
        <div className="text-sm">
          You didn't submit a contribution for this issue. We hope to see you next month!
        </div>
      </div>
    </div>
  );
}
```

### Integration into Issue Page
```tsx
// app/groups/[groupId]/issues/[month]/page.tsx
import ExclusionBanner from '@/components/ExclusionBanner';

export default function GroupIssuesPage({ params }) {
  // ... existing code ...

  // Check if current user was excluded
  const currentUserConvexId = /* get from Convex query */;
  const isExcluded = issueData?.newsletter?.excludedMemberIds?.includes(currentUserConvexId);

  return (
    <div className="min-h-screen bg-base-300 flex flex-col">
      {/* Header */}
      <header>...</header>

      {/* Main content */}
      <main className="flex-1 px-5 py-6">
        {/* Show exclusion banner if user was excluded */}
        {isExcluded && <ExclusionBanner groupName={group.name} />}

        {/* Rest of issue content */}
        {issueData ? (
          // ... existing newsletter rendering ...
        ) : (
          <GroupEmptyState />
        )}
      </main>
    </div>
  );
}
```

### Design System Compliance
- **Component**: DaisyUI `alert alert-info` (informational, not error)
- **Icon**: Heroicons `InformationCircleIcon` (24px outline)
- **Colors**: Cupcake theme info colors (enforced by DaisyUI)
- **Spacing**: `mb-6` (24px margin-bottom) to separate from content below
- **Typography**:
  - Heading: `font-bold` (existing alert default)
  - Body: `text-sm` (14px)
- **Responsive**: Alert is responsive by default (DaisyUI handles this)

### Visual Appearance (Cupcake Theme)
```
┌────────────────────────────────────────────────────────────┐
│ ℹ️  The group missed you this month                        │
│     You didn't submit a contribution for this issue.       │
│     We hope to see you next month!                         │
└────────────────────────────────────────────────────────────┘
```

---

## Testing Requirements

### Visual Tests (Playwright Screenshots)
```typescript
// tests/exclusion-banner-visual.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Exclusion Banner Visual Tests', () => {
  test('displays correctly on mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    // Navigate to issue page where user is excluded
    await page.goto('/groups/[groupId]/issues/2025-01');
    await expect(page.locator('[role="alert"]')).toBeVisible();
    await page.screenshot({ path: 'tests/screenshots/exclusion-banner-mobile.png' });
  });

  test('displays correctly on tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/groups/[groupId]/issues/2025-01');
    await expect(page.locator('[role="alert"]')).toBeVisible();
    await page.screenshot({ path: 'tests/screenshots/exclusion-banner-tablet.png' });
  });

  test('displays correctly on desktop (1440px)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/groups/[groupId]/issues/2025-01');
    await expect(page.locator('[role="alert"]')).toBeVisible();
    await page.screenshot({ path: 'tests/screenshots/exclusion-banner-desktop.png' });
  });

  test('does NOT display when user contributed', async ({ page }) => {
    // Navigate to issue where user DID contribute
    await page.goto('/groups/[groupId]/issues/2025-02');
    await expect(page.locator('[role="alert"]')).not.toBeVisible();
  });
});
```

### Accessibility Tests
```typescript
test('exclusion banner is accessible', async ({ page }) => {
  await page.goto('/groups/[groupId]/issues/2025-01');

  // Check ARIA attributes
  const alert = page.locator('[role="alert"]');
  await expect(alert).toBeVisible();

  // Check keyboard navigation
  await page.keyboard.press('Tab');
  // Alert should be in tab order or skippable

  // Check screen reader text
  const alertText = await alert.textContent();
  expect(alertText).toContain('The group missed you this month');
});
```

### Manual Verification
1. Create test data: newsletter with `excludedMemberIds = [currentUser._id]`
2. Navigate to `/groups/[groupId]/issues/[month]`
3. Verify banner displays at top
4. Verify banner styling matches design system
5. Test responsive behavior (resize browser)
6. Test with screen reader (VoiceOver/NVDA)

---

## Dependencies

### Frontend Dependencies
- Existing issue page (`app/groups/[groupId]/issues/[month]/page.tsx`)
- Convex query `api.newsletters.getNewsletterWithContributions` (should return `newsletter.excludedMemberIds`)
- Current user's Convex ID (from `useQuery(api.users.getCurrentUser)` or similar)
- DaisyUI alert component
- Heroicons package

### Data Requirements
**Newsletter schema must include**:
```typescript
{
  excludedMemberIds: Id<"users">[] // Array of user IDs who were excluded
}
```

**Note**: This field already exists in schema (checked in convex/schema.ts)

---

## Implementation Notes

**TDD Approach**: Frontend Agent should write visual tests FIRST, then implement component.

**Design System**: STRICT compliance with DaisyUI cupcake theme. No custom colors or styling.

**Accessibility**:
- Use semantic HTML (`role="alert"`)
- Ensure sufficient color contrast (DaisyUI handles this)
- Test with keyboard navigation
- Test with screen reader

**Performance**: Component is lightweight (no heavy logic, just conditional render).

**Edge Cases**:
- User visits old issue where they weren't excluded → No banner
- User visits current month issue before newsletter sent → No banner (no newsletter yet)
- User visits issue for group they're no longer in → Handle gracefully (show banner or redirect?)

---

## Success Criteria

**DONE when**:
1. ✅ Component renders correctly with DaisyUI alert styling
2. ✅ Banner displays only when user in `excludedMemberIds`
3. ✅ Visual tests passing (3 breakpoints)
4. ✅ Accessibility tests passing (WCAG 2.1 AA)
5. ✅ Responsive design verified (mobile, tablet, desktop)
6. ✅ Manual inspection confirms design system compliance
7. ✅ Frontend Agent reports story complete

---

**Created**: 2025-10-23
**Linear**: https://linear.app/2s6y/issue/2S6-46
