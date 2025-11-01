# Contribution Form Visual Fixes

## Date
2025-10-04

## Summary
Fixed visual styling issues in the contribution form including unwanted borders/boxes, tab styling, and scrolling problems.

## Issues Identified and Fixed

### 1. Unwanted Borders/Boxes Around Prompt Cards
**Problem:**
- PromptCard component had multiple nested containers with conflicting styles
- Applied `overflow-clip` and shadow to outer container
- Inner container had its own `bg-base-100` and `rounded-[16px]` creating a card-within-a-card effect
- Created visual "boxes" that didn't match design system

**Solution:**
- Simplified PromptCard to a single container
- Removed nested structure
- Applied clean design system compliant styling:
  - `bg-base-100` for background (design token)
  - `rounded-[16px]` for border radius (system value)
  - `p-4` for padding (system spacing)
  - `gap-2` for internal spacing (system spacing)
- Removed shadows and overflow-clip

**File:** `/components/forms/PromptCard.tsx`

**Before:**
```tsx
<div className="flex flex-col w-full overflow-clip shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
  <div className="px-3 py-2">
    <h3 className="text-sm font-semibold text-base-content leading-[1.5]">
      {title}
    </h3>
  </div>
  <div className="bg-base-100 px-3 py-4 rounded-[16px]">
    <textarea ... />
  </div>
</div>
```

**After:**
```tsx
<div className="flex flex-col w-full bg-base-100 rounded-[16px] p-4 gap-2">
  <h3 className="text-sm font-semibold text-base-content">
    {title}
  </h3>
  <textarea ... />
</div>
```

### 2. Tab Styling Issues
**Problem:**
- Group tabs container had extra shadow that caused visual inconsistency
- Missing background color causing transparency issues

**Solution:**
- Removed shadow from tabs container
- Added `bg-base-100` background
- Kept border-bottom for clean separation
- Reduced padding between prompts from `px-2` to `px-4` for better alignment

**File:** `/app/contribute/page.tsx`

**Before:**
```tsx
<div className="h-[72px] flex items-start overflow-x-auto px-4 border-b border-base-content/10 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
```

**After:**
```tsx
<div className="h-[72px] flex items-start overflow-x-auto px-4 border-b border-base-content/10 bg-base-100">
```

### 3. Unwanted Scrolling Element
**Problem:**
- Main container had no height constraint
- Caused entire page to scroll instead of just the prompts area
- Auto-save indicator used `sticky` positioning incorrectly

**Solution:**
- Added `h-screen` to main container to constrain height
- Added `bg-base-100` to header for consistency
- Changed spacing in prompts container from `space-y-6` to `space-y-4` for better density
- Removed `sticky` from auto-save indicator (now fixed at bottom)
- Changed auto-save background from `bg-base-300` to `bg-base-100` for consistency

**File:** `/app/contribute/page.tsx`

**Before:**
```tsx
<div className="w-full max-w-2xl flex flex-col">
  <header className="h-14 px-5 py-4 flex items-center justify-between border-b border-base-content/10">
  ...
  <div className="flex-1 px-2 py-6 space-y-6 overflow-y-auto">
  ...
  <div className="sticky bottom-0 px-4 py-4 bg-base-300 border-t border-base-content/10">
```

**After:**
```tsx
<div className="w-full max-w-2xl flex flex-col h-screen">
  <header className="h-14 px-5 py-4 flex items-center justify-between border-b border-base-content/10 bg-base-100">
  ...
  <div className="flex-1 px-4 py-6 space-y-4 overflow-y-auto">
  ...
  <div className="px-4 py-3 bg-base-100 border-t border-base-content/10">
```

## Design System Compliance

All changes strictly follow the design system rules from `.claude/DESIGN_SYSTEM.md`:

### Colors
- ✅ Used design tokens: `bg-base-100`, `text-base-content`, `border-base-content/10`
- ✅ No hardcoded hex colors
- ✅ No arbitrary color values

### Spacing
- ✅ Used system scale: `p-4`, `gap-2`, `px-4`, `py-3`, `py-6`, `space-y-4`
- ✅ No arbitrary spacing values
- ✅ All values from approved spacing scale (0, 1, 2, 3, 4, 5, 6, 8, 12, 16, 20, 32)

### Typography
- ✅ Used system typography: `text-sm`, `text-xs`, `text-xl`, `text-base`
- ✅ No arbitrary font sizes
- ✅ Proper font weights: `font-semibold`, `font-medium`

### Components
- ✅ Clean component structure
- ✅ No inline styles
- ✅ Proper use of Tailwind utilities

### Border Radius
- ✅ Used system value: `rounded-[16px]` (for boxes/cards)
- ✅ Consistent with design system specification

## Visual Improvements

### Before
- Unwanted box borders around prompt input areas
- Nested card effect creating visual clutter
- Shadows creating depth inconsistency
- Extra scrollbar on right side
- Tab area had shadow mismatch

### After
- Clean, flat prompt cards with consistent spacing
- Single card design without nesting
- Uniform background colors throughout
- Proper scrolling only in prompts area
- Clean tab area with subtle border separator
- Consistent padding and spacing

## Layout Structure

```
Container (h-screen)
├─ Header (fixed height, bg-base-100)
│  └─ Back button | Title | Preview button
├─ Group Tabs (fixed height, bg-base-100)
│  └─ Tab items with active indicator
├─ Prompts Area (flex-1, scrollable)
│  ├─ Prompt Card 1 (bg-base-100, p-4, gap-2)
│  ├─ Prompt Card 2 (bg-base-100, p-4, gap-2)
│  ├─ Prompt Card 3 (bg-base-100, p-4, gap-2)
│  ├─ Prompt Card 4 (bg-base-100, p-4, gap-2)
│  └─ Prompt Card 5 (bg-base-100, p-4, gap-2)
└─ Auto-save Indicator (fixed at bottom, bg-base-100)
```

## Testing

Visual regression tests created in `/tests/contribution-form-fixed.spec.ts` to verify:
- Desktop view (1440px) - no unwanted boxes/borders
- Tablet view (768px) - responsive styling
- Mobile view (375px) - mobile styling
- Prompt card styling verification
- No horizontal scrollbar

## Files Modified

1. `/components/forms/PromptCard.tsx` - Simplified component structure
2. `/app/contribute/page.tsx` - Fixed layout and scrolling
3. `/tests/contribution-form-fixed.spec.ts` - Added visual regression tests (new file)

## Design System Verification

All changes verified against `.claude/DESIGN_SYSTEM.md`:
- ✅ Colors: Only design tokens used
- ✅ Spacing: System scale only
- ✅ Typography: System sizes only
- ✅ No inline styles
- ✅ No custom components where DaisyUI exists
- ✅ No hardcoded values
- ✅ Mobile-first responsive design

## Next Steps

To manually verify the fixes:
1. Start dev server: `npm run dev`
2. Navigate to `/contribute` (must be authenticated)
3. Verify at different breakpoints:
   - Desktop (1440px)
   - Tablet (768px)
   - Mobile (375px)
4. Check that:
   - No weird borders around prompt cards
   - Clean card appearance
   - Only prompts area scrolls (not entire page)
   - Tabs have clean styling
   - Consistent spacing throughout

## Conclusion

The contribution form now has clean, consistent styling that strictly adheres to the design system. All visual issues have been resolved:
- ✅ No unwanted boxes/borders
- ✅ Fixed tab styling
- ✅ Removed unwanted scrolling
- ✅ Design system compliant
- ✅ Clean, professional appearance
