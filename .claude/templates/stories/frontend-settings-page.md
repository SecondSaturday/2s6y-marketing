# STORY-[ID]: [Page Name] Settings Page

**Track:** B/C (Frontend)
**Agent:** frontend-dev
**Time Estimate:** 1-2 hours
**Dependencies:** [Backend API stories, design system]
**Blocks:** [Dependent UI stories]
**Status:** 🔴 Not Started

---

## Contract Specification

**Contract File**: `tests/contracts/[feature-name].contract.ts`

**Backend API**:
- Query: `[queryName]` - Fetch data for display
- Mutation: `[mutationName]` - Update settings
- Returns: `{ [field]: type, ... }`
- Errors: `["Error 1", "Error 2"]`

**Frontend Usage**:
- Component: `[PageName]`
- Displays: `["field1", "field2"]`
- Sends: `{ [arg]: value, ... }`

---

## Factory Usage

**Factory**: `tests/factories/[dataType]Factory.ts`

---

## Context

Build [page name] settings page with [feature description]. Users can [what they can do].

**Why This Story Matters**:
- [User benefit]
- [Business value]
- [Feature enablement]

**Design Requirements**:
- DaisyUI card layout
- Responsive (mobile-first)
- Form validation
- Loading states
- Error handling

---

## Tasks (TDD Order - Mandatory)

### Phase 1: Preparation
- [ ] Read contract specification
- [ ] Review design system (`.claude/core/design-system.md`)
- [ ] Identify required DaisyUI components
- [ ] Plan component structure

### Phase 2: Test-Driven Development (TDD)

#### Step 1: Write Tests FIRST ✅
- [ ] **Functional Tests (3+)**:
  - [ ] Page renders with data
  - [ ] Form submission works
  - [ ] Validation errors display
- [ ] **Visual Tests (3+)**:
  - [ ] Desktop view (1440px)
  - [ ] Tablet view (768px)
  - [ ] Mobile view (375px)
- [ ] **State Tests (2+)**:
  - [ ] Empty state
  - [ ] Filled state
  - [ ] Error state
  - [ ] Loading state
- [ ] **Minimum**: 8+ tests total

#### Step 2: Run Tests (Expect Failures) ❌
- [ ] Execute: `npx playwright test tests/[filename].spec.ts`
- [ ] Verify all tests FAIL (expected in TDD)
- [ ] Document failure output below

#### Step 3: Build Component ✅
- [ ] Create page component
- [ ] Use Convex reactive queries
- [ ] Implement form with DaisyUI
- [ ] Add validation
- [ ] Add loading/error states
- [ ] Follow design system

#### Step 4: Verify 100% Pass Rate ✅
- [ ] All tests passing
- [ ] Visual regression tests pass
- [ ] Design system compliance verified
- [ ] Evidence documented below

### Phase 3: Design System Compliance (MANDATORY)

**Colors** (ONLY design tokens):
- [ ] `bg-primary`, `bg-accent`, `bg-base-100`, `bg-base-200` (no hex codes)
- [ ] `text-primary-content`, `text-base-content` (no arbitrary colors)
- [ ] No `style` attributes with colors
- [ ] No `bg-[#hex]` or `text-[#hex]`

**Spacing** (ONLY system scale):
- [ ] `p-4`, `gap-6`, `mb-8` (system values: 0, 1, 2, 3, 4, 5, 6, 8, 12, 16, 20, 32)
- [ ] No `p-[15px]` or arbitrary spacing
- [ ] No inline `padding`, `margin` styles

**Components** (ONLY DaisyUI):
- [ ] `btn`, `btn-primary`, `btn-ghost` (no custom buttons)
- [ ] `card`, `card-body`, `shadow-xl` (no custom cards)
- [ ] `input`, `input-bordered` (no custom inputs)
- [ ] `textarea`, `select`, `checkbox`, `radio` (DaisyUI form elements)
- [ ] No custom component classes when DaisyUI exists

**Typography** (ONLY system scale):
- [ ] `text-4xl`, `text-2xl`, `text-base`, `text-sm` (no arbitrary sizes)
- [ ] `font-bold`, `font-semibold` (no custom font weights)
- [ ] No `text-[28px]` or inline font sizes

**Compliance Score**: MUST be 100% ✅

---

## Implementation Template

### Page Component

```typescript
"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";

export default function [PageName]() {
  // 1. Fetch data using Convex reactive queries
  const data = useQuery(api.[module].[queryName], {
    [arg]: value,
  });

  // 2. Mutations
  const updateData = useMutation(api.[module].[mutationName]);

  // 3. Local state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    [field]: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 4. Loading state
  if (!data) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  // 5. Handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await updateData({
        [arg]: formData.[field],
      });
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setIsLoading(false);
    }
  };

  // 6. Render
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-base-content mb-2">
          [Page Title]
        </h1>
        <p className="text-base-content opacity-70">
          [Page subtitle/description]
        </p>
      </div>

      {/* Main Content */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {/* Content here */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form fields using DaisyUI */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">[Field Label]</span>
              </label>
              <input
                type="text"
                value={formData.[field]}
                onChange={(e) =>
                  setFormData({ ...formData, [field]: e.target.value })
                }
                className="input input-bordered"
                disabled={isLoading}
              />
            </div>

            {/* Error display */}
            {error && (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn btn-ghost"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
```

### Common DaisyUI Patterns

**Form Elements**:
```tsx
{/* Text input */}
<input type="text" className="input input-bordered" />

{/* Textarea */}
<textarea className="textarea textarea-bordered" />

{/* Select */}
<select className="select select-bordered">
  <option>Option 1</option>
</select>

{/* Checkbox */}
<input type="checkbox" className="checkbox" />

{/* Radio */}
<input type="radio" className="radio" />
```

**Buttons**:
```tsx
<button className="btn btn-primary">Primary</button>
<button className="btn btn-secondary">Secondary</button>
<button className="btn btn-ghost">Ghost</button>
<button className="btn btn-outline">Outline</button>
```

**Loading States**:
```tsx
{/* Spinner */}
<span className="loading loading-spinner loading-lg"></span>

{/* Button with loading */}
<button className="btn btn-primary" disabled={isLoading}>
  {isLoading && <span className="loading loading-spinner loading-sm"></span>}
  Submit
</button>
```

**Alerts**:
```tsx
<div className="alert alert-info">Info message</div>
<div className="alert alert-success">Success message</div>
<div className="alert alert-warning">Warning message</div>
<div className="alert alert-error">Error message</div>
```

---

## Acceptance Criteria

### Functionality
- [ ] All tasks completed
- [ ] Page renders with real data from Convex
- [ ] Form submission works
- [ ] Validation works (client + server)
- [ ] Loading states display correctly
- [ ] Error handling works
- [ ] Contract requirements met

### Design System Compliance (MANDATORY)
- [ ] **100% compliance** - No violations
- [ ] Colors: Only design tokens ✅
- [ ] Spacing: Only system scale ✅
- [ ] Components: Only DaisyUI ✅
- [ ] Typography: Only system scale ✅
- [ ] No inline styles ✅

### Testing
- [ ] All tests passing (8+, 100% pass rate)
- [ ] Visual regression at 3 breakpoints ✅
- [ ] All UI states tested (empty, filled, error, loading) ✅
- [ ] Responsive design verified ✅

### Accessibility
- [ ] Keyboard navigation works
- [ ] ARIA labels present
- [ ] Form labels associated
- [ ] Focus indicators visible

---

## Test Results (MANDATORY)

### TDD Cycle Evidence

**Step 1: Tests Written First** ✅
- Date/Time: [YYYY-MM-DD HH:MM]
- Test file: `tests/[filename].spec.ts`
- Number of tests: [X tests]

**Step 2: Tests Run (Pre-Implementation)** ❌
```
[Paste terminal output showing tests FAILING]
```

**Step 3: Implementation Written** ✅
- File: `app/[route]/page.tsx`
- Lines of code: ~[X lines]

**Step 4: Tests Re-run (Post-Implementation)** ✅
```
[Paste terminal output showing tests PASSING]

Example:
✅ PASS tests/[filename].spec.ts
  Functional Tests:
    ✅ renders page with data (234ms)
    ✅ form submission works (456ms)
    ✅ validation errors display (123ms)

  Visual Tests:
    ✅ desktop view matches snapshot (345ms)
    ✅ tablet view matches snapshot (289ms)
    ✅ mobile view matches snapshot (267ms)

  State Tests:
    ✅ empty state displays correctly (123ms)
    ✅ filled state displays correctly (145ms)
    ✅ error state displays correctly (167ms)
    ✅ loading state displays correctly (189ms)

Tests: 10 passed, 10 total
Pass Rate: 100% ✅
```

### Visual Regression Tests

**Screenshots Taken**:
- [ ] `[page]-desktop.png` (1440px) ✅
- [ ] `[page]-tablet.png` (768px) ✅
- [ ] `[page]-mobile.png` (375px) ✅
- [ ] `[page]-error.png` (error state) ✅
- [ ] `[page]-loading.png` (loading state) ✅

**Design System Compliance Verified**:
- [ ] Colors inspected (all use tokens) ✅
- [ ] Spacing measured (all system scale) ✅
- [ ] Components identified (all DaisyUI) ✅
- [ ] Typography verified (all system scale) ✅

**Compliance Score**: 100% ✅

---

## Expected Outputs

### Files Created
- [ ] `app/[route]/page.tsx` - Page component
- [ ] `tests/[filename].spec.ts` - E2E tests (8+)
- [ ] `screenshots/[page]-*.png` - Visual regression baselines (5+)

---

## Handoff Notes

### For Dependent Stories

**Component Available**: `app/[route]/page.tsx`

**Props Required** (if extracted as component):
```typescript
interface [ComponentName]Props {
  [prop]: type;
}
```

**Usage**:
```typescript
import [ComponentName] from "@/app/[route]/page";

<[ComponentName] [prop]={value} />
```

**Backend API Used**:
- Query: `api.[module].[queryName]`
- Mutation: `api.[module].[mutationName]`

---

## Related Stories

**Depends On**:
- STORY-[XXX]: [Backend API] - Provides data/mutations
- STORY-000: Foundation - Design system

**Blocks**:
- STORY-[YYY]: [Dependent feature]

---

## Completion Checklist

- [ ] All tasks completed
- [ ] All acceptance criteria met
- [ ] Tests written and passing (8+, 100% pass rate)
- [ ] Visual regression tests pass
- [ ] Design system compliance 100%
- [ ] Responsive design verified
- [ ] Accessibility verified
- [ ] STORY_TRACKER.md updated with status ✅ Done
- [ ] Committed with message: "feat: [Page Description] (STORY-[ID])"
- [ ] Documented actual time spent

---

**Last Updated:** [YYYY-MM-DD]
**Completed By:** [Agent name]
**Actual Time:** [X hours]
