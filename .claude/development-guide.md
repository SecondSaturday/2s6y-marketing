# 2Sat-lite MVP - Development Guide

**Framework Version**: v1.3.2
**Last Updated**: 2025-10-11
**Project Status**: MVP (Minimum Viable Product) - Target launch within 2 weeks
**Related Documentation**:
- Project context → `.claude/poc-context.md` (MVP scope, data model, features)
- Framework methodology → `.claude/core/Framework.md`
- Agent protocols → `.claude/core/agents/`
- Testing guide → `.claude/guides/testing.md`
- Design system → `.claude/core/design-system.md`

---

## 🎨 Styling Rules (STRICT ENFORCEMENT)

**MANDATORY**: All styling **MUST** follow `.claude/core/design-system.md`

### DaisyUI Cupcake Theme

- **ALWAYS** use DaisyUI components (btn, card, input, alert, modal, etc.)
- **NEVER** create custom button/card/input components when DaisyUI equivalents exist
- Theme: `cupcake` (cheerful, friendly colors)
- All color values defined in `daisyui.config.ts` and `app/globals.css`

**For complete design system specification**: See `.claude/core/design-system.md`

### Design System Compliance Rules

#### 1. Colors: **ONLY** use design tokens

```tsx
// ✅ CORRECT - Design tokens
<div className="bg-primary text-primary-content">...</div>
<span className="text-accent">...</span>

// ❌ WRONG - Hardcoded hex colors
<div style={{ backgroundColor: '#a442fe' }}>...</div>
<div className="bg-[#80e4e4]">...</div>
```

#### 2. Spacing: **ONLY** use system scale (0, 1, 2, 3, 4, 5, 6, 8, 12, 16, 20, 32)

```tsx
// ✅ CORRECT - System spacing
<div className="p-4 gap-6 mb-8">...</div>

// ❌ WRONG - Arbitrary values
<div className="p-[15px] gap-[13px] mb-[23px]">...</div>
```

#### 3. Typography: **ONLY** use system scale (text-xs to text-7xl)

```tsx
// ✅ CORRECT - System typography
<h1 className="text-4xl font-bold">Title</h1>

// ❌ WRONG - Arbitrary font size
<h1 className="text-[28px]">Title</h1>
```

#### 4. Components: **ALWAYS** use DaisyUI

```tsx
// ✅ CORRECT - DaisyUI components
<button className="btn btn-primary">Submit</button>
<div className="card bg-base-100 shadow-xl">
  <div className="card-body">...</div>
</div>

// ❌ WRONG - Custom implementations
<button className="px-4 py-2 bg-blue-500 rounded">Submit</button>
<div className="bg-white p-4 rounded-lg shadow">...</div>
```

#### 5. No Inline Styles: **NEVER** use `style` attribute

```tsx
// ✅ CORRECT - Tailwind utilities
<div className="p-4 mb-6">...</div>

// ❌ WRONG - Inline styles
<div style={{ padding: '16px', marginBottom: '24px' }}>...</div>
```

### Frontend Agent Enforcement

**Reference**: See `.claude/core/agents/frontend.md`

- Frontend Agent **automatically enforces** these rules
- Any violation **blocks task completion**
- Visual tests **verify** design system compliance

---

## 🔄 State Management

**Philosophy**: Keep it simple with Convex reactive queries.

**For complete project context**: See `.claude/poc-context.md`

### Architecture

- **Backend state**: Convex queries (reactive, real-time)
- **Form state**: React `useState` + `useReducer`
- **No global state library** needed (Zustand, Redux, etc.)
- **Optimistic updates**: Use Convex mutations with optimistic UI

### Example

```typescript
// Fetch data
const contributions = useQuery(api.contributions.list);

// Mutate data
const addContribution = useMutation(api.contributions.create);

// Optimistic update
await addContribution({ ...data }, { optimistic: true });
```

---

## ⚠️ Error Handling

**All user-facing operations must handle errors gracefully.**

### Pattern

```typescript
try {
  await mutation({ data });
  toast.success("Contribution saved!");
} catch (error) {
  console.error("Error saving contribution:", error);
  toast.error("Failed to save. Please try again.");
}
```

### Convex Errors

```typescript
// convex/contributions.ts
import { ConvexError } from "convex/values";

throw new ConvexError("User not found");
```

### Client Handling

```typescript
try {
  await addContribution(data);
} catch (error) {
  if (error instanceof ConvexError) {
    alert(error.message);
  }
}
```

---

## 🧪 Testing & Validation

**Complete testing protocols**: See `.claude/guides/testing.md`

### Self-Testing Protocol

**Every feature MUST be validated BEFORE marking complete:**

#### Required Testing Steps

1. **Functional Tests** (Playwright)
   - User interactions work correctly
   - Data persistence verified
   - Error handling tested

2. **Visual Tests** (Playwright Screenshots) **MANDATORY for frontend**
   - Take screenshots at 3 breakpoints:
     - Desktop: 1440px
     - Tablet: 768px
     - Mobile: 375px
   - Verify design system compliance:
     - Colors match tokens (use browser inspector)
     - Spacing matches system scale
     - Typography matches system scale
   - Compare against visual regression baseline

3. **Accessibility Tests**
   - Keyboard navigation works
   - Screen reader compatible
   - ARIA labels present

### Test Scenarios

**Reference**: See `.claude/guides/testing.md` for complete test specifications

1. **Authentication Flow**
   - Sign up with email
   - Sign in with Google/Facebook/Discord
   - Sign out
   - Session persistence

2. **Contribution Form**
   - Fill all prompts
   - Upload images/videos
   - Save draft
   - Submit contribution
   - Edit existing contribution
   - **Visual regression** (screenshots at 3 breakpoints)

3. **Newsletter Generation**
   - Trigger cron job manually
   - Verify HTML output
   - Check email delivery (Resend)
   - Verify database record
   - **Visual regression** (email template)

4. **Archive View**
   - List newsletters
   - View individual newsletter
   - Filter by month
   - **Visual regression** (archive page)

### Validation Workflow

```
Build Feature
    ↓
Frontend? → Take screenshots (desktop/tablet/mobile)
          → Verify design system compliance
          → Run visual regression test
    ↓
Write Playwright Functional Test
    ↓
Run Test via MCP
    ↓
Pass? → Verify screenshots manually
      → Update changelog with test results
      → Mark complete
Fail? → Debug → Re-test (max 3 attempts)
    ↓
Still failing? → Escalate to user
```

### Visual Testing Requirements

**For ALL frontend components**, agents MUST:

**Reference**: See `.claude/core/agents/frontend.md` for visual testing protocol

1. Run `npm run dev` to start local server
2. Navigate to component in browser
3. Take screenshot using Playwright:
   ```typescript
   await page.setViewportSize({ width: 1440, height: 900 });
   await page.screenshot({ path: 'screenshots/component-desktop.png' });
   ```
4. Inspect screenshot to verify:
   - ✅ Colors: primary=#a442fe, accent=#80e4e4, base-100=#f8f2ed
   - ✅ Spacing: matches system scale (4px, 8px, 12px, 16px, etc.)
   - ✅ Typography: uses system sizes
   - ✅ Components: DaisyUI classes visible
5. Repeat for tablet (768px) and mobile (375px)
6. Write visual regression test:
   ```typescript
   await expect(page).toHaveScreenshot('component.png');
   ```

**Screenshots stored in**: `screenshots/` directory

### CI/CD Testing

GitHub Actions runs Playwright tests on:
- Every PR
- Before merge to main
- Scheduled daily (catch regressions)
- Includes visual regression tests

**Workflow configuration**: See GitHub Actions Integration section below

---

## 📚 Code Quality Standards

### TypeScript

- **Strict mode enabled** (`tsconfig.json`)
- **No `any` types** (use `unknown` or proper types)
- **Explicit return types** for functions

**Good**:
```typescript
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

**Bad**:
```typescript
function calculateTotal(items: any) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

### Convex Functions

**Reference**: See `.claude/core/agents/backend.md` for complete backend patterns

- **Named exports only** (no default exports)
- **Input validation** via Convex validators
- **Error handling** with `ConvexError`

**Example**:
```typescript
import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createContribution = mutation({
  args: {
    prompt1: v.string(),
    prompt2: v.array(v.string()),
    // ... more args
  },
  handler: async (ctx, args) => {
    // Validate user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Not authenticated");

    // Business logic
    const contributionId = await ctx.db.insert("contributions", {
      userId: identity.subject,
      ...args,
      submittedAt: Date.now(),
    });

    return contributionId;
  },
});
```

### React Components

- **Functional components** (no class components)
- **TypeScript props interfaces**
- **Descriptive component names**

**Good**:
```typescript
interface ContributionFormProps {
  onSubmit: (data: ContributionData) => Promise<void>;
  initialData?: ContributionData;
}

export function ContributionForm({ onSubmit, initialData }: ContributionFormProps) {
  // ...
}
```

### Comments

- **Explain WHY, not WHAT**
- **Document complex logic**
- **TODOs for future enhancements**

**Good**:
```typescript
// Calculate 2nd Saturday of month for newsletter scheduling
// Month is 0-indexed, so January = 0
const secondSaturday = getSecondSaturday(new Date());
```

**Bad**:
```typescript
// Get second Saturday
const secondSaturday = getSecondSaturday(new Date());
```

---

## 🔒 Security Best Practices

### Environment Variables

- **Never commit** `.env.local` to git
- **Use `.env.example`** as template
- **Validate** required vars on startup

**Convex**:
- API keys stored in Convex dashboard (not in code)
- Access via `process.env` in actions

**Clerk**:
- Webhook signature verification
- Protect routes with Clerk middleware

### Data Validation

- **Client-side**: Form validation (UX)
- **Server-side**: Convex validators (security)
- **Never trust user input**

**Example**:
```typescript
// Client (UX feedback)
if (!email.includes("@")) {
  setError("Invalid email");
  return;
}

// Server (security)
export const createUser = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    if (!args.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      throw new ConvexError("Invalid email format");
    }
    // ...
  },
});
```

---

## 📝 Changelog Format

**Reference**: See `.claude/CHANGELOG.md` for examples

### Session-Based Tracking

Every agent session generates a changelog entry in `.claude/CHANGELOG.md`.

**Format**:
```markdown
## [2025-01-15] - Feature: Contribution Form

### Added
- Contribution form with 5 prompts
- Image/video upload (max 10 files)
- Auto-save draft every 30s
- Form validation before submission

### Fixed
- N/A

### Changed
- N/A

### Validated
- ✅ Form submission (Playwright)
- ✅ Image upload (Playwright)
- ✅ Auto-save (Playwright)

### Performance
- Optimized image uploads (lazy loading)
- Reduced bundle size by 12% (Next.js Image)

---
```

**Auto-generation**:
- Agents update changelog BEFORE marking task complete
- GitHub Actions appends commit links
- Grouped by date + feature

---

## 🌲 Git Worktrees & Parallel Agents

**Reference**: See `.claude/workflows/README.md` for detailed guide

### Why Worktrees?

Git worktrees enable **parallel development** by allowing multiple agents to work on different branches simultaneously without conflicts.

**For UEDS parallel development system**: See `.claude/core/UEDS.md`

**Use Cases**:
- Agent 1: Build contribution form (`feature/contribution-form`)
- Agent 2: Build newsletter template (`feature/newsletter-template`)
- Agent 3: Set up cron job (`feature/cron-newsletter`)

All working **at the same time** in isolated directories.

### Setup

```bash
# Create worktree for feature
./scripts/setup-worktree.sh feature/contribution-form

# This creates:
# ../2Sat-lite-contribution-form/
#   - Isolated working directory
#   - Separate node_modules (optional)
#   - Independent Convex dev instance
```

### Workflow

1. **User assigns parallel tasks**:
   ```
   "Build the contribution form AND newsletter template in parallel"
   ```

2. **Agent creates worktrees**:
   ```bash
   ./scripts/setup-worktree.sh feature/contribution-form
   ./scripts/setup-worktree.sh feature/newsletter-template
   ```

3. **GitHub Actions runs parallel agents**:
   - Triggered via `.github/workflows/parallel-agents.yml`
   - Each agent works in its own worktree
   - Tests run in isolation

4. **Agents merge back**:
   - Create PRs from each branch
   - CI tests pass
   - User reviews + merges

### Cleanup

```bash
# Remove worktree after merge
git worktree remove ../2Sat-lite-contribution-form
```

---

## 🚀 GitHub Actions Integration

### Workflows

#### 1. **test.yml** - Automated Testing
**Triggers**: PR, push to main

```yaml
name: Test
on: [pull_request, push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Install dependencies
      - Run Playwright tests
      - Upload test results
```

#### 2. **deploy.yml** - Deployment
**Triggers**: Push to main (after tests pass)

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - Deploy to Vercel (frontend)
      - Deploy to Convex (backend)
      - Notify on success/failure
```

#### 3. **parallel-agents.yml** - Parallel Execution
**Triggers**: Manual (workflow_dispatch) or comment `/parallel`

```yaml
name: Parallel Agents
on: workflow_dispatch
jobs:
  agent-1:
    runs-on: ubuntu-latest
    steps:
      - Setup worktree for feature A
      - Build feature A
      - Test feature A
  agent-2:
    runs-on: ubuntu-latest
    steps:
      - Setup worktree for feature B
      - Build feature B
      - Test feature B
```

**Usage**:
- User triggers via GitHub UI or comment `/parallel`
- Agents run concurrently
- Results reported back via PR comments

---

## 🎨 Design Constraints

### What Agents CANNOT Change

**Reference**: See `.claude/core/design-system.md` for complete specification

- **Theme**: DaisyUI cupcake (locked)
- **Colors**: Primary/accent set by user (ask before changing)
- **Layout philosophy**: Mobile-first, clean, minimal
- **Typography**: Default system fonts (can suggest but needs approval)

### What Agents CAN Change

- Component spacing (Tailwind utilities)
- Responsive breakpoints (within mobile-first approach)
- Icon choices (Heroicons, Lucide)
- Animation timing (subtle transitions)

**When in doubt**: Ask for approval.

---

## 📖 Related Documentation

### Project-Specific Documentation
- `.claude/poc-context.md` - MVP project context, data model, features

### Core Framework Documentation
- `.claude/core/Framework.md` - Complete framework methodology
- `.claude/core/UEDS.md` - Parallel development system (4-6x faster)
- `.claude/core/design-system.md` - DaisyUI cupcake theme specification

### Agent Protocols
- `.claude/core/agents/README.md` - Agent index & decision tree
- `.claude/core/agents/frontend.md` - Frontend agent (React, Next.js, DaisyUI)
- `.claude/core/agents/backend.md` - Backend agent (Convex, TypeScript)
- `.claude/core/agents/orchestrator.md` - Multi-agent coordination

### Operational Guides
- `.claude/guides/testing.md` - TDD workflow, visual regression, E2E testing
- `.claude/guides/quick-start.md` - 10-minute project launch
- `.claude/guides/troubleshooting.md` - Common issues & solutions

### Other Resources
- `.claude/CHANGELOG.md` - Session logs and updates
- `.claude/workflows/README.md` - Git worktree guide
- `.claude/AGENT_QUICK_REFERENCE.md` - Quick agent invocation guide

### External Documentation
- [Convex Docs](https://docs.convex.dev/)
- [Next.js Docs](https://nextjs.org/docs)
- [Clerk Docs](https://clerk.com/docs)
- [DaisyUI Components](https://daisyui.com/components/)
- [Playwright Docs](https://playwright.dev/)
- [Resend Docs](https://resend.com/docs)

---

**Document Type**: Development Patterns & Standards
**Companion Document**: `.claude/poc-context.md` (MVP-specific logic & features)
**Parent**: `.claude/claude.md` (navigation hub)
**Framework**: `.claude/core/Framework.md` + `.claude/core/UEDS.md`
**Target**: Production-ready MVP within 2 weeks
