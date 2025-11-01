# 2Sat-lite Design System

## Overview

This design system is **MANDATORY** for all frontend development. Every component, page, and UI element **MUST** strictly adhere to these specifications extracted from the Figma DaisyUI Library 2.0.

**Design Source**: Figma DaisyUI Library 2.0 (Node: 6705:20358)

---

## 🎨 Color Palette

### Base Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `base-100` | `#f8f2ed` | Primary background color |
| `base-200` | `#e8e1dc` | Secondary background, hover states |
| `base-300` | `#dad2cd` | Tertiary background, borders |
| `base-content` | `#291334` | Primary text color on base backgrounds |

**Usage Example**:
```tsx
<div className="bg-base-100 text-base-content">
  Main content area
</div>
```

### Brand Colors

| Token | Hex | Content Color | Usage |
|-------|-----|---------------|-------|
| `primary` | `#a442fe` | `#f8f3ff` | Primary actions, CTAs, brand elements |
| `secondary` | `#eeba79` | `#722e14` | Secondary actions, accents |
| `accent` | `#80e4e4` | `#153a37` | Highlights, special elements |

**CRITICAL**:
- **NEVER** use hardcoded hex colors like `#a442fe` directly in code
- **ALWAYS** use semantic color tokens: `bg-primary`, `text-primary`, etc.
- **NEVER** create custom purple/teal colors - use `primary` and `accent`

**Good**:
```tsx
<button className="btn btn-primary">Submit</button>
<span className="text-accent">New!</span>
```

**Bad**:
```tsx
<button style={{ backgroundColor: '#a442fe' }}>Submit</button>
<span className="text-[#80e4e4]">New!</span>
```

### Neutral

| Token | Hex | Content Color |
|-------|-----|---------------|
| `neutral` | `#262629` | `#e4e4e7` |

### Semantic Colors

| Token | Hex | Content Color | Usage |
|-------|-----|---------------|-------|
| `info` | `#238de4` | `#e2f1fd` | Informational messages |
| `success` | `#3db17c` | `#d8f9e6` | Success states, confirmations |
| `warning` | `#e2b523` | `#3d2009` | Warnings, cautions |
| `error` | `#be2448` | `#fae4e6` | Errors, destructive actions |

**Usage Example**:
```tsx
<div className="alert alert-success">
  <span>Contribution saved successfully!</span>
</div>
```

---

## 📐 Typography

### Font Families

**Primary (Sans-serif)**: Instrument Sans
```css
--font-family-primary: "Instrument Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
```

**Secondary (Serif)**: Instrument Serif
```css
--font-family-secondary: "Instrument Serif", Georgia, "Times New Roman", serif
```

**Default**: All text uses primary font unless explicitly styled

### Font Sizes

| Token | Size | Usage |
|-------|------|-------|
| `text-xs` | 11px | Fine print, captions |
| `text-sm` | 12px | Secondary text, labels |
| `text-base` | 14px | Body text (default) |
| `text-md` | 14px | Medium body text |
| `text-lg` | 18px | Large body text |
| `text-xl` | 20px | Subheadings |
| `text-2xl` | 24px | Headings |
| `text-3xl` | 30px | Large headings |
| `text-4xl` | 36px | Page titles |
| `text-7xl` | 72px | Hero text |

**Usage Example**:
```tsx
<h1 className="text-4xl font-bold">Monthly Contributions</h1>
<p className="text-base">Fill out your monthly update below</p>
<span className="text-sm text-base-content/60">Last saved 2 min ago</span>
```

### Font Weights

| Token | Value |
|-------|-------|
| `font-normal` | 400 |
| `font-medium` | 500 |
| `font-semibold` | 600 |
| `font-bold` | 700 |

### Line Heights

| Token | Height |
|-------|--------|
| `leading-4` | 16px |
| `leading-5` | 20px |
| `leading-6` | 24px |
| `leading-7` | 28px |
| `leading-8` | 32px |
| `leading-9` | 36px |
| `leading-10` | 40px |

---

## 📏 Spacing

### Spacing Scale

| Token | Size | Usage |
|-------|------|-------|
| `0` | 0px | No spacing |
| `1` | 4px | Minimal spacing |
| `1.5` | 6px | Tight spacing |
| `2` | 8px | Small spacing |
| `3` | 12px | Medium spacing |
| `4` | 16px | Default spacing |
| `5` | 20px | Large spacing |
| `6` | 24px | Extra large spacing |
| `8` | 32px | Section spacing |
| `12` | 48px | Major section spacing |
| `16` | 64px | Page section spacing |
| `20` | 80px | Large page sections |
| `32` | 128px | Hero sections |

**Usage Example**:
```tsx
<div className="p-4 gap-6">
  <div className="mb-8">Section 1</div>
  <div>Section 2</div>
</div>
```

**Standard Component Spacing**:
- Card padding: `p-6` (24px)
- Button padding: `px-4 py-2` (16px horizontal, 8px vertical)
- Form field spacing: `gap-4` (16px)
- Section margins: `mb-8` or `mb-12` (32px or 48px)

---

## 🔘 Border Radius

| Token | Size | Usage |
|-------|------|-------|
| `rounded-fields` | 4px | Input fields, buttons |
| `rounded-selectors` | 8px | Dropdowns, select boxes, tabs |
| `rounded-boxes` | 16px | Cards, modals, containers |
| `rounded-badge` | 1000px | Badges, pills, tags |

**DaisyUI Utilities**:
```tsx
<input className="input rounded-[4px]" /> {/* Fields */}
<div className="card rounded-[16px]"> {/* Boxes */}
  <div className="badge rounded-full"> {/* Badges */}
    New
  </div>
</div>
```

---

## 🧩 Component Catalog

### Required DaisyUI Components

**MUST USE** these DaisyUI components instead of custom implementations:

#### Buttons

```tsx
// Primary button
<button className="btn btn-primary">Submit</button>

// Secondary button
<button className="btn btn-secondary">Cancel</button>

// Outline button
<button className="btn btn-outline btn-primary">Learn More</button>

// Disabled button
<button className="btn btn-disabled">Unavailable</button>

// Button sizes
<button className="btn btn-sm">Small</button>
<button className="btn btn-md">Medium</button>
<button className="btn btn-lg">Large</button>
```

**Sizes**:
- `btn-sm`: 32px height
- `btn-md`: 40px height (default)
- `btn-lg`: 48px height

#### Cards

```tsx
<div className="card bg-base-100 shadow-xl">
  <div className="card-body">
    <h2 className="card-title">Card Title</h2>
    <p>Card content goes here</p>
    <div className="card-actions justify-end">
      <button className="btn btn-primary">Action</button>
    </div>
  </div>
</div>
```

#### Forms

```tsx
// Text input
<input
  type="text"
  className="input input-bordered w-full"
  placeholder="Enter text..."
/>

// Textarea
<textarea
  className="textarea textarea-bordered w-full"
  placeholder="Long text..."
/>

// Select
<select className="select select-bordered w-full">
  <option>Option 1</option>
  <option>Option 2</option>
</select>

// Checkbox
<input type="checkbox" className="checkbox checkbox-primary" />

// Radio
<input type="radio" className="radio radio-primary" />

// Toggle
<input type="checkbox" className="toggle toggle-primary" />
```

#### Alerts

```tsx
<div className="alert alert-info">
  <span>Informational message</span>
</div>

<div className="alert alert-success">
  <span>Success message</span>
</div>

<div className="alert alert-warning">
  <span>Warning message</span>
</div>

<div className="alert alert-error">
  <span>Error message</span>
</div>
```

#### Modals

```tsx
<dialog className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg">Modal Title</h3>
    <p className="py-4">Modal content</p>
    <div className="modal-action">
      <button className="btn">Close</button>
    </div>
  </div>
</dialog>
```

#### Navigation

```tsx
// Navbar
<div className="navbar bg-base-100">
  <div className="navbar-start">
    <a className="btn btn-ghost text-xl">2Sat</a>
  </div>
  <div className="navbar-center"></div>
  <div className="navbar-end">
    <button className="btn btn-primary">Sign In</button>
  </div>
</div>

// Tabs
<div className="tabs tabs-boxed">
  <a className="tab">Tab 1</a>
  <a className="tab tab-active">Tab 2</a>
  <a className="tab">Tab 3</a>
</div>
```

#### Loading States

```tsx
// Spinner
<span className="loading loading-spinner loading-lg"></span>

// Progress
<progress className="progress progress-primary w-56"></progress>

// Skeleton
<div className="skeleton h-32 w-full"></div>
```

#### Badges

```tsx
<div className="badge badge-primary">Primary</div>
<div className="badge badge-secondary">Secondary</div>
<div className="badge badge-accent">Accent</div>
```

---

## 🎭 Component Sizes

| Component | Small | Medium | Large | XL |
|-----------|-------|--------|-------|-----|
| Button | 32px | 40px | 48px | - |
| Input | 32px | 40px | 48px | - |
| Avatar | 32px | 40px | 48px | 64px |

---

## 🖼️ Layout Patterns

### Container Widths

```tsx
// Full width
<div className="w-full">...</div>

// Max width container
<div className="container mx-auto max-w-7xl px-4">...</div>

// Responsive max widths
<div className="max-w-md mx-auto">Form</div> {/* 448px */}
<div className="max-w-2xl mx-auto">Article</div> {/* 672px */}
<div className="max-w-7xl mx-auto">Dashboard</div> {/* 1280px */}
```

### Grid Layouts

```tsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div className="card">Card 1</div>
  <div className="card">Card 2</div>
  <div className="card">Card 3</div>
</div>

// Form layout
<div className="grid grid-cols-1 gap-4">
  <input className="input input-bordered" />
  <input className="input input-bordered" />
  <button className="btn btn-primary">Submit</button>
</div>
```

### Flex Layouts

```tsx
// Horizontal layout
<div className="flex items-center gap-4">
  <span>Label</span>
  <button className="btn">Action</button>
</div>

// Vertical layout
<div className="flex flex-col gap-6">
  <div>Section 1</div>
  <div>Section 2</div>
</div>

// Space between
<div className="flex justify-between items-center">
  <h1>Title</h1>
  <button className="btn">Action</button>
</div>
```

---

## 🎨 Custom Utilities

### Gradient Text

```tsx
<h1 className="text-primary-gradient text-4xl font-bold">
  2Sat Newsletter
</h1>
```

### Depth Shadow

```tsx
<div className="card shadow-depth">
  Card with custom shadow
</div>
```

### Focus Ring

```tsx
<button className="btn focus-ring">
  Accessible button
</button>
```

---

## ⛔ Forbidden Practices

### NEVER Do These

❌ **Custom colors outside design system**:
```tsx
// BAD
<div style={{ color: '#ff0000' }}>Red text</div>
<div className="bg-[#123456]">Custom blue</div>
```

✅ **Use design tokens**:
```tsx
// GOOD
<div className="text-error">Error text</div>
<div className="bg-primary">Brand color</div>
```

---

❌ **Inline styles**:
```tsx
// BAD
<div style={{ padding: '16px', margin: '8px' }}>Content</div>
```

✅ **Tailwind utilities**:
```tsx
// GOOD
<div className="p-4 m-2">Content</div>
```

---

❌ **Custom button styles**:
```tsx
// BAD
<button className="px-4 py-2 rounded bg-blue-500 text-white">
  Submit
</button>
```

✅ **DaisyUI button**:
```tsx
// GOOD
<button className="btn btn-primary">Submit</button>
```

---

❌ **Arbitrary font sizes**:
```tsx
// BAD
<h1 className="text-[28px]">Heading</h1>
```

✅ **Design system sizes**:
```tsx
// GOOD
<h1 className="text-3xl">Heading</h1>
```

---

❌ **Hardcoded spacing**:
```tsx
// BAD
<div className="mt-[17px] mb-[23px]">Content</div>
```

✅ **System spacing**:
```tsx
// GOOD
<div className="my-6">Content</div>
```

---

## 🔍 Visual Testing Requirements

Every frontend component **MUST** be visually validated before completion:

### Screenshot Validation

1. **Take screenshot** of component in browser (localhost)
2. **Use Playwright** to capture automated screenshot
3. **Compare** against Figma design (if applicable)
4. **Verify**:
   - ✅ Colors match design system
   - ✅ Spacing is correct
   - ✅ Typography is correct
   - ✅ Components render properly on mobile & desktop

### Responsive Breakpoints

Test all components at:
- **Mobile**: 375px (iPhone SE)
- **Tablet**: 768px (iPad)
- **Desktop**: 1440px (MacBook Pro)

```typescript
// Playwright responsive test
test('component renders on all breakpoints', async ({ page }) => {
  const sizes = [
    { width: 375, height: 667, name: 'mobile' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 1440, height: 900, name: 'desktop' },
  ];

  for (const size of sizes) {
    await page.setViewportSize({ width: size.width, height: size.height });
    await page.screenshot({ path: `screenshots/${size.name}.png` });
  }
});
```

---

## 📱 Mobile-First Principles

Always design and code mobile-first:

```tsx
// Good: Mobile-first responsive
<div className="text-sm md:text-base lg:text-lg">
  Responsive text
</div>

// Good: Mobile-first grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
  {/* Cards */}
</div>

// Bad: Desktop-first
<div className="text-lg md:text-sm">
  Wrong approach
</div>
```

---

## 🎯 Component Checklist

Before completing any frontend component, verify:

- [ ] Uses DaisyUI components (no custom reimplementations)
- [ ] All colors use design tokens (no hardcoded hex)
- [ ] Typography follows font size scale
- [ ] Spacing uses system scale (no arbitrary values)
- [ ] Border radius matches design system
- [ ] Responsive on mobile, tablet, desktop
- [ ] Screenshot taken and validated
- [ ] Playwright visual test added
- [ ] Accessibility tested (keyboard navigation, screen reader)

---

## 📚 Resources

- [DaisyUI Components](https://daisyui.com/components/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Figma DaisyUI Library](https://www.figma.com/community/file/1152511118223842786)

---

**Last Updated**: 2025-10-01
**Version**: 1.0.0
**Maintained By**: Design System Team
