# UX Specifications - Group Creation Flow (CORRECTED)

**Project**: Group Creation Flow Rebuild
**Created**: 2025-10-25
**Updated**: 2025-10-25 (Corrected with actual design tokens)
**Status**: Ready for GATE-1 Review
**Linear Issue**: [2S6-58](https://linear.app/2s6y/issue/2S6-58)

---

## 🎨 Design Philosophy

**Vision**: Create a visually beautiful, spacious, and delightful full-page experience that emphasizes the "Second Saturday ritual" - meaningful monthly connections through smart defaults and minimal required input.

**Principles**:
- **Visual Beauty**: Elegant layouts, thoughtful spacing, delightful micro-interactions
- **Simplicity**: Smart defaults reduce friction, only name is required
- **Consistency**: Match existing settings page aesthetic and patterns
- **Design Token Compliance**: Use ONLY the design tokens defined in globals.css
- **Accessibility**: WCAG 2.1 AA compliant, keyboard-friendly, screen-reader optimized
- **Responsive**: Full mobile and desktop support with graceful degradation

---

## 1. Design System Reference (FROM globals.css)

###Actual Color Palette

```css
/* Primary Colors */
--color-primary: #a442fe;           /* Purple - CTAs, focused states */
--color-primary-content: #f8f3ff;   /* Very light purple - text on primary */

--color-secondary: #eeba79;         /* Orange/Tan - highlights */
--color-secondary-content: #722e14; /* Dark brown - text on secondary */

--color-accent: #80e4e4;           /* Cyan - special elements */
--color-accent-content: #153a37;   /* Dark teal - text on accent */

/* Base Colors */
--color-base-100: #f8f2ed;         /* Cream - main background */
--color-base-200: #e8e1dc;         /* Light tan - subtle backgrounds */
--color-base-300: #dad2cd;         /* Tan - borders, dividers */
--color-base-content: #291334;     /* Dark purple - body text */

/* Neutrals */
--color-neutral: #262629;          /* Almost black - dark elements */
--color-neutral-content: #e4e4e7;  /* Light gray - text on neutral */

/* Semantic Colors */
--color-info: #238de4;             /* Blue - informational */
--color-info-content: #e2f1fd;     /* Light blue - text on info */

--color-success: #3db17c;          /* Green - success states */
--color-success-content: #d8f9e6;  /* Light green - text on success */

--color-warning: #e2b523;          /* Yellow - warnings */
--color-warning-content: #3d2009;  /* Dark brown - text on warning */

--color-error: #be2448;            /* Red - errors */
--color-error-content: #fae4e6;    /* Light red - text on error */
```

### Typography (Instrument Sans & Serif)

**Font Families**:
- Primary: `Instrument Sans` (all UI, body text)
- Secondary: `Instrument Serif` (decorative headings if needed)

**Font Sizes** (from globals.css):
- `text-xs`: 11px
- `text-sm`: 12px
- `text-base`: 14px
- `text-lg`: 18px
- `text-xl`: 20px
- `text-2xl`: 24px
- `text-3xl`: 30px
- `text-4xl`: 36px
- `text-7xl`: 72px

**Font Weights**:
- Normal: 400
- Medium: 500
- Semibold: 600
- Bold: 700

### Spacing System

**From globals.css**:
- `spacing-1`: 4px
- `spacing-2`: 8px
- `spacing-3`: 12px
- `spacing-4`: 16px
- `spacing-5`: 20px
- `spacing-6`: 24px
- `spacing-8`: 32px
- `spacing-12`: 48px
- `spacing-16`: 64px
- `spacing-20`: 80px
- `spacing-32`: 128px

**Common Usage**:
- Card padding: `24px` (spacing-6)
- Form field gaps: `16px` (spacing-4)
- Section margins: `32px` (spacing-8)

### Border Radius

- `radius-fields`: 4px (inputs)
- `radius-selectors`: 8px (dropdowns, buttons)
- `radius-boxes`: 16px (cards, containers)
- `radius-round`: 1000px (fully rounded)

---

## 2. Screen 0: Welcome/Intro

### Visual Specifications

**Background** (use CSS mesh gradient from globals.css):
```html
<div class="min-h-screen css-mesh-gradient flex items-center justify-center p-6">
</div>
```
- Uses existing `.css-mesh-gradient` class from globals.css
- Colors: Purple (#a442fe), lighter purple, pink/orange, cyan
- Animated with `mesh-shift` keyframes

**Hero Card**:
```html
<div class="card bg-base-100 shadow-depth border border-base-300 max-w-2xl w-full">
  <div class="card-body" style="padding: var(--spacing-12);">
    <h1 class="text-7xl font-bold text-base-content mb-4 text-center">
      Create Your Group
    </h1>
    <p class="text-2xl text-base-content/80 mb-2 text-center">
      Every second Saturday, connect meaningfully
    </p>
    <p class="text-lg text-base-content/60 mb-8 text-center">
      Set prompts, invite friends, and receive monthly newsletters
    </p>
    <button class="btn btn-primary btn-lg w-full max-w-xs mx-auto">
      Get Started →
    </button>
  </div>
</div>
```

**Colors**:
- Heading: `text-base-content` (#291334 - dark purple)
- Subtitle: `text-base-content/80` (80% opacity)
- Button: `btn-primary` (purple #a442fe)
- Card: `bg-base-100` (cream #f8f2ed)

**Responsive**:
- Desktop: `text-7xl` (72px), padding 48px
- Mobile: `text-4xl` (36px), padding 24px

---

## 3. Step 1: Basic Info

### Page Container

```html
<div class="min-h-screen bg-base-100">
  <div class="max-w-4xl mx-auto px-6 py-8">
    <!-- Content -->
  </div>
</div>
```

### Form Card

```html
<div class="card bg-base-100 shadow-depth border border-base-300">
  <div class="card-body" style="padding: var(--card-padding);">
    <h2 class="text-3xl font-bold text-base-content mb-2">
      Basic Information
    </h2>
    <p class="text-sm text-base-content/70 mb-6">
      Your group will connect monthly on the 2nd Saturday
    </p>
    <!-- Form fields -->
  </div>
</div>
```

### Form Fields

**Group Name**:
```html
<div class="form-control mb-4">
  <label class="label">
    <span class="label-text font-medium">Group Name *</span>
    <span class="label-text-alt text-base-content/50">1-50 chars</span>
  </label>
  <input
    type="text"
    class="input input-bordered focus:border-primary"
    style="border-radius: var(--radius-fields);"
    maxlength="50"
  />
</div>
```

**Group ID** (with real-time validation):
```html
<div class="form-control mb-4">
  <label class="label">
    <span class="label-text font-medium">Group ID</span>
  </label>
  <div class="flex gap-2 items-center">
    <input
      type="text"
      class="input input-bordered flex-1 font-mono"
      style="border-radius: var(--radius-fields);"
      pattern="[a-z0-9-]+"
    />
    <span class="text-success">✓</span>
  </div>
  <span class="text-xs text-success">Available</span>
</div>
```

**Description**:
```html
<textarea
  class="textarea textarea-bordered resize-none"
  style="height: 96px; border-radius: var(--radius-fields);"
  maxlength="200"
></textarea>
```

**Avatar Upload**:
```html
<div class="flex items-center gap-4">
  <div class="avatar">
    <div class="w-24 h-24" style="border-radius: var(--radius-round);">
      <img src="[random-meme]" alt="Avatar" />
    </div>
  </div>
  <label class="btn btn-ghost btn-sm">
    <input type="file" class="hidden" />
    Change Avatar
  </label>
</div>
```

**Cover Banner**:
```html
<div class="css-mesh-gradient w-full" style="height: 128px; border-radius: var(--radius-boxes);"></div>
<label class="btn btn-ghost btn-sm mt-2">
  <input type="file" class="hidden" />
  Change Cover
</label>
```

---

## 4. Step 2: Prompts (NO PREVIEW PANEL)

### Single Column Layout

```html
<div class="card bg-base-100 shadow-depth border border-base-300">
  <div class="card-body" style="padding: var(--card-padding);">
    <h2 class="text-3xl font-bold text-base-content mb-2">
      Custom Prompts
    </h2>
    <p class="text-sm text-base-content/70 mb-6">
      These prompts will guide your monthly check-ins
    </p>
    <div class="space-y-4">
      <!-- 5 prompt cards -->
    </div>
  </div>
</div>
```

### Prompt Card (Editable & Drag-to-Reorder)

```html
<div class="card bg-base-200 border border-base-300 hover:border-primary transition-colors cursor-move">
  <div class="card-body p-4">
    <div class="flex items-start gap-3">
      <!-- Drag handle -->
      <svg class="w-5 h-5 text-base-content/30"><!-- Drag icon --></svg>

      <!-- Number badge -->
      <div class="badge badge-primary badge-lg font-bold">1</div>

      <!-- Content -->
      <div class="flex-1">
        <input
          type="text"
          value="This month I..."
          class="input input-ghost w-full font-medium text-lg p-0 mb-2"
          maxlength="500"
        />

        <!-- Type selector -->
        <div class="flex gap-2">
          <button class="btn btn-xs btn-primary gap-1">
            <svg class="w-4 h-4"><!-- Icon --></svg>
            Text
          </button>
          <button class="btn btn-xs btn-ghost gap-1">Media</button>
          <button class="btn btn-xs btn-ghost gap-1">Audio</button>
        </div>
      </div>
    </div>
  </div>
</div>
```

**Colors**:
- Card: `bg-base-200` (light tan)
- Hover border: `border-primary` (purple)
- Badge: `badge-primary` (purple)
- Active type: `btn-primary`

**Default Prompts**:
1. "This month I..." (text)
2. "📸 Photo Wall" (media)
3. "One good thing from last month" (text)
4. "This has been on my mind" (text)
5. "🎵 Something I have been listening to" (text)

---

## 5. Step 3: Members

### Email Textarea

```html
<textarea
  class="textarea textarea-bordered font-mono text-sm"
  style="height: 128px; border-radius: var(--radius-fields);"
  placeholder="friend1@example.com&#10;friend2@example.com"
></textarea>
```

### Email Badges

```html
<div class="flex flex-wrap gap-2">
  <div class="badge badge-lg badge-primary gap-2">
    friend1@example.com
    <button class="btn btn-xs btn-circle">×</button>
  </div>
  <div class="badge badge-lg badge-error gap-2">
    invalid-email
    <button class="btn btn-xs btn-circle">×</button>
  </div>
</div>
```

### Invite Code Display

```html
<div class="card bg-base-200 border border-base-300">
  <div class="card-body" style="padding: var(--spacing-6);">
    <h3 class="text-lg font-semibold mb-3">Shareable Invite Link</h3>

    <div class="flex flex-col sm:flex-row gap-3">
      <div class="flex-1 p-4 bg-base-100 border border-base-300" style="border-radius: var(--radius-boxes);">
        <p class="font-mono text-sm text-base-content/70">Invite Code</p>
        <p class="font-mono text-2xl font-bold text-primary">ABC12XYZ</p>
      </div>

      <button class="btn btn-primary gap-2">
        <svg class="w-5 h-5"><!-- Icon --></svg>
        Copy Link
      </button>
    </div>
  </div>
</div>
```

### Submit Button

```html
<button class="btn btn-primary btn-lg w-full sm:w-auto sm:px-12">
  Create Group →
</button>
```

---

## 6. Progress Stepper

```html
<nav aria-label="Progress" class="mb-8">
  <ol class="flex items-center justify-center gap-2">
    <!-- Active step -->
    <li>
      <div class="flex flex-col items-center gap-2">
        <div class="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold">
          1
        </div>
        <span class="text-xs font-medium text-primary hidden sm:block">
          Basic Info
        </span>
      </div>
    </li>

    <!-- Connector -->
    <div class="w-12 sm:w-16 h-0.5 bg-base-300"></div>

    <!-- Upcoming step -->
    <li>
      <div class="flex flex-col items-center gap-2">
        <div class="w-10 h-10 rounded-full bg-base-300 text-base-content flex items-center justify-center font-bold">
          2
        </div>
        <span class="text-xs font-medium text-base-content/50 hidden sm:block">
          Prompts
        </span>
      </div>
    </li>

    <div class="w-12 sm:w-16 h-0.5 bg-base-300"></div>

    <li>
      <div class="flex flex-col items-center gap-2">
        <div class="w-10 h-10 rounded-full bg-base-300 text-base-content flex items-center justify-center font-bold">
          3
        </div>
        <span class="text-xs font-medium text-base-content/50 hidden sm:block">
          Members
        </span>
      </div>
    </li>
  </ol>
</nav>
```

**States**:
- Active: `bg-primary` (purple) + `text-primary-content`
- Completed: `bg-success` (green) with checkmark
- Upcoming: `bg-base-300` (tan)

**Mobile**: Labels hidden (`hidden sm:block`)

---

## 7. Global Specifications

### Spacing

- Container: `max-w-4xl mx-auto px-6 py-8`
- Card padding: `24px`
- Field gaps: `16px`
- Section gaps: `32px`

### Typography

- H1: `text-7xl font-bold` (72px / 36px mobile)
- H2: `text-3xl font-bold` (30px / 24px mobile)
- H3: `text-lg font-semibold` (18px)
- Body: `text-base` (14px)
- Helper: `text-sm` (12px)

### Colors (ACTUAL TOKENS)

- Primary: Purple (#a442fe)
- Secondary: Orange/Tan (#eeba79)
- Accent: Cyan (#80e4e4)
- Success: Green (#3db17c)
- Error: Red (#be2448)
- Base-100: Cream (#f8f2ed)
- Base-content: Dark purple (#291334)

### Buttons

- Primary: `btn btn-primary` (purple)
- Ghost: `btn btn-ghost` (transparent)
- Sizes: `btn-sm`, `btn`, `btn-lg`

### Inputs

- Border radius: `4px`
- Focus: Purple border
- Error: Red border
- Success: Green border

---

## 8. Responsive Design

| Breakpoint | Changes |
|------------|---------|
| Mobile (<640px) | Single column, full-width buttons, hidden labels, smaller text |
| Tablet (640px-1024px) | Single column, all labels visible |
| Desktop (>1024px) | Single column, spacious layout |

---

## 9. Accessibility

- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Visible focus rings (purple)
- [ ] ARIA labels on icons
- [ ] Screen reader announcements
- [ ] 4.5:1 color contrast
- [ ] 44×44px touch targets

---

## Summary

### Corrections Made

1. ✅ **Correct Colors**: Purple primary (#a442fe), not teal
2. ✅ **No Live Preview**: Removed from Prompts step
3. ✅ **Fully Responsive**: Mobile/desktop clearly defined
4. ✅ **Design Token Compliance**: All from globals.css
5. ✅ **Single Column**: Simplified, not crowded

### Quick Reference

- **Colors**: Purple, Orange/Tan, Cyan
- **Fonts**: Instrument Sans
- **Spacing**: 4, 8, 16, 24, 32, 48px
- **Radius**: Fields 4px, Boxes 16px

---

**Status**: ✅ Ready for GATE-1 review
**Next**: User approval → Begin development