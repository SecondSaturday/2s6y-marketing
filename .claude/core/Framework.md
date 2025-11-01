# 2Sat-lite Agentic Development Framework

**Version**: v1.3.0 (Refactored Structure)
**Framework Methodology**: UEDS v1.2.0
**Last Updated**: 2025-10-11

---

## Part 1: Quick Reference (for daily use)

### 🎯 Project Context

**2Sat-lite** is a web-based POC (Proof of Concept) for a monthly friend group update newsletter app. Friends share monthly life updates through a structured form, and everyone receives a beautifully formatted HTML newsletter every second Saturday.

### POC Scope

This simplified version validates the core concept with real friends THIS month:

- ✅ **One friend group** (hardcoded for now)
- ✅ **5 prompts** for monthly contributions
- ✅ **Clerk authentication** (Google/Facebook/Discord/Email)
- ✅ **Automated HTML newsletter** sent every 2nd Saturday via Resend
- ✅ **Archive view** to browse past newsletters

### Tech Stack

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Backend**: Convex (database + server logic)
- **Auth**: Clerk
- **Email**: Resend
- **Styling**: Tailwind CSS + DaisyUI (cupcake theme)
- **Testing**: Playwright (via MCP)
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel (frontend) + Convex Cloud (backend)

### Full Vision Context

The full app will support:
- Multiple friend groups
- Individual + group contribution flows
- Mobile apps (iOS/Android via Capacitor)
- Premium subscription ($3-6/month)
- Rich media (photos/videos)

**But for this POC**: We're validating the core loop with minimal features.

---

## Agent Invocation Guide

### When to Use Which Agent

**You control which agent to invoke.** Choose based on task type:

#### Direct Invocation (Simple/Clear Tasks)

**Frontend Agent** → [See `.claude/core/agents/frontend.md`]:
- "Build the contribution form"
- "Fix button styling in modal"
- "Make dashboard responsive"
- "Add loading spinner to page"

**Backend Agent** → [See `.claude/core/agents/backend.md`]:
- "Create saveContribution mutation"
- "Add tags field to schema"
- "Write validation for email field"
- "Create getGroups query"

**Orchestrator Agent** → [See `.claude/core/agents/orchestrator.md`]:
- "Build newsletter archive feature" (backend query + frontend page)
- "Implement group creation" (mutation + modal + validation)
- "Debug: Users can't submit contributions" (check frontend + backend)

#### Direct Invocation Flow

```
You → "@frontend-agent Build the form"
       ↓
Frontend Agent executes autonomously
       ↓
Returns: Code + screenshots + tests
       ↓
Done (no routing overhead)
```

#### Orchestrator Invocation Flow

```
You → "@orchestrator Build newsletter archive"
       ↓
Orchestrator decomposes:
  ├─ Backend: getNewsletters query
  └─ Frontend: ArchivePage UI
       ↓
Invokes both agents in parallel
       ↓
Waits for completion
       ↓
Verifies integration (API contract)
       ↓
Runs E2E test
       ↓
Returns: "✅ Complete, all layers integrated"
```

### Task Classification Quick Guide

| Scenario | Agent Choice | Why |
|----------|--------------|-----|
| Fix button color | Frontend Agent (direct) | Single layer, simple |
| Add field to schema | Backend Agent (direct) | Single layer, simple |
| Build full feature | Orchestrator | Multiple layers, coordination |
| Debug cross-layer bug | Orchestrator | Needs investigation across layers |
| Write single test | Testing Agent (direct) | Single layer, simple |
| Optimize query | Backend Agent (direct) | Single layer, focused |
| Make page responsive | Frontend Agent (direct) | Single layer, focused |
| Add new API + UI | Orchestrator | Multiple layers, integration |

---

## Part 2: Core Concepts

### Agentic Framework Philosophy

The framework includes specialized sub-agents for specific tasks. **You invoke these agents directly** when you know what you need, or use the **Orchestrator** for complex multi-agent coordination.

#### Agent Roles

**1. Frontend Agent** (`.claude/core/agents/frontend.md`)
- **Invoked for**: UI/UX development, component building, styling, layouts
- **Expertise**: React, Next.js, TypeScript, DaisyUI, Tailwind CSS
- **Strict Rules**:
  - MUST use design system tokens (colors, spacing, typography)
  - MUST use DaisyUI components (no custom button/card/input implementations)
  - MUST visually test with Playwright screenshots
  - MUST validate responsive design (mobile, tablet, desktop)
  - NEVER use hardcoded hex colors or arbitrary spacing values

**2. Backend Agent** (`.claude/core/agents/backend.md`)
- **Invoked for**: Convex functions, database schema, API logic, business logic
- **Expertise**: Convex mutations/queries/actions, TypeScript, data modeling, validation
- **Strict Rules**:
  - MUST use Convex validators for all inputs
  - MUST handle errors with ConvexError
  - MUST write unit tests for all functions
  - MUST check authentication when required
  - NEVER skip input validation or expose sensitive data

**3. Orchestrator Agent** (`.claude/core/agents/orchestrator.md`)
- **Invoked for**: Full-stack features, multi-agent coordination, complex debugging
- **Expertise**: Task decomposition, parallel execution, integration testing
- **Strict Rules**:
  - CANNOT write code directly (coordination only)
  - MUST invoke Frontend/Backend agents for code work
  - MUST verify integration between layers
  - MUST run E2E tests after integration

**4. Testing Agent** (Future)
- **Invoked for**: Test writing, coverage analysis, debugging test failures
- **Expertise**: Playwright, unit tests, integration tests, visual regression

### Agent Autonomy Boundaries

#### ✅ Agents Can Do Independently:
- Build features based on specifications
- Fix bugs and refactor code
- Update Convex schema (database models)
- Implement Clerk authentication flows
- Create/modify frontend components **using design system**
- Write backend logic (mutations/queries/actions)
- Organize files and folders
- Choose variable/function names
- Add error handling
- Run Playwright tests and self-validate
- Take screenshots for visual validation
- Update changelogs

#### ❌ Agents Must Ask for Approval:
- External API integrations requiring new auth tokens/keys
- Third-party service setup (beyond Clerk/Convex/Resend already configured)
- Major architectural changes (switching frameworks, databases)
- **Adding colors/tokens NOT in design system** (`.claude/core/design-system.md`)
- Creating custom UI components when DaisyUI equivalents exist
- Spending money (paid services, upgrades)

---

## Part 3: Development Patterns

### File Structure

```
/app
  /(auth)
    /signin
      page.tsx
    /sign-up
      page.tsx
  /dashboard
    page.tsx         # Main landing after login
  /contribute
    page.tsx         # Monthly contribution form
  /archive
    page.tsx         # Past newsletters view
    /[month]
      page.tsx       # Individual newsletter view
  /api
    /webhooks
      /clerk
        route.ts     # Clerk user sync
  layout.tsx
  page.tsx           # Landing page (public)

/convex
  schema.ts          # Data models
  auth.ts            # Auth helper
  auth.config.ts     # Clerk config
  http.ts            # HTTP routes
  /functions
    users.ts         # User CRUD
    contributions.ts # Contribution CRUD
    newsletters.ts   # Newsletter generation
    groups.ts        # Group logic
  /cron
    sendNewsletter.ts # Scheduled newsletter job

/components
  /ui
    Button.tsx
    Card.tsx
    Input.tsx
    Textarea.tsx
    FileUpload.tsx
  /forms
    ContributionForm.tsx
    PromptField.tsx
  /newsletter
    NewsletterTemplate.tsx
    NewsletterPreview.tsx
  /layout
    Header.tsx
    Footer.tsx
    Sidebar.tsx

/lib
  utils.ts           # Utility functions
  constants.ts       # App constants

/.claude
  /core
    UEDS.md          # Parallel development system
    Framework.md     # This file - project overview
    design-system.md # Design tokens
    /agents
      README.md      # Agent index
      frontend.md    # Frontend protocol
      backend.md     # Backend protocol
      orchestrator.md # Orchestrator protocol
  /guides
    testing.md       # Testing protocols
  /sessions
    STORY_TRACKER.md # Active work dashboard
  CHANGELOG.md       # Session logs
```

### State Management

**Philosophy**: Keep it simple with Convex reactive queries.

- **Backend state**: Convex queries (reactive, real-time)
- **Form state**: React `useState` + `useReducer`
- **No global state library** needed (Zustand, Redux, etc.)
- **Optimistic updates**: Use Convex mutations with optimistic UI

**Example**:
```typescript
// Fetch data
const contributions = useQuery(api.contributions.list);

// Mutate data
const addContribution = useMutation(api.contributions.create);

// Optimistic update
await addContribution({ ...data }, { optimistic: true });
```

### Error Handling

**All user-facing operations must handle errors gracefully.**

**Pattern**:
```typescript
try {
  await mutation({ data });
  toast.success("Contribution saved!");
} catch (error) {
  console.error("Error saving contribution:", error);
  toast.error("Failed to save. Please try again.");
}
```

**Convex Errors**:
```typescript
// convex/contributions.ts
import { ConvexError } from "convex/values";

throw new ConvexError("User not found");
```

**Client Handling**:
```typescript
try {
  await addContribution(data);
} catch (error) {
  if (error instanceof ConvexError) {
    alert(error.message);
  }
}
```

### Styling Rules (STRICT ENFORCEMENT)

**MANDATORY**: All styling **MUST** follow `.claude/core/design-system.md`

**DaisyUI Cupcake Theme**:
- **ALWAYS** use DaisyUI components (btn, card, input, alert, modal, etc.)
- **NEVER** create custom button/card/input components when DaisyUI equivalents exist
- Theme: `cupcake` (cheerful, friendly colors)

**Design System Compliance Rules**:

1. **Colors**: **ONLY** use design tokens
   ```tsx
   // ✅ CORRECT - Design tokens
   <div className="bg-primary text-primary-content">...</div>

   // ❌ WRONG - Hardcoded hex colors
   <div style={{ backgroundColor: '#a442fe' }}>...</div>
   ```

2. **Spacing**: **ONLY** use system scale (0, 1, 2, 3, 4, 5, 6, 8, 12, 16, 20, 32)
3. **Typography**: **ONLY** use system scale (text-xs to text-7xl)
4. **Components**: **ALWAYS** use DaisyUI
5. **No Inline Styles**: **NEVER** use `style` attribute

**Reference Documentation**:
- Complete design system: `.claude/core/design-system.md`
- Frontend agent protocol: `.claude/core/agents/frontend.md`

### Code Quality Standards

#### TypeScript

- **Strict mode enabled** (`tsconfig.json`)
- **No `any` types** (use `unknown` or proper types)
- **Explicit return types** for functions

**Good**:
```typescript
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

#### Convex Functions

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
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Not authenticated");

    return await ctx.db.insert("contributions", {
      userId: identity.subject,
      ...args,
      submittedAt: Date.now(),
    });
  },
});
```

#### React Components

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

---

## Part 4: Multi-Agent Coordination Examples

### Example 1: Direct Frontend Invocation

```
You: "Frontend agent, fix the submit button color"

Frontend Agent:
  1. Reads DESIGN_SYSTEM.md
  2. Changes button to use btn-primary
  3. Takes screenshot
  4. Returns: "✅ Fixed. Now uses design token."

Time: ~30 seconds
```

### Example 2: Direct Backend Invocation

```
You: "Backend agent, add email validation to createUser mutation"

Backend Agent:
  1. Opens convex/users.ts
  2. Adds email validator (v.string() with regex)
  3. Adds error handling
  4. Writes unit test
  5. Returns: "✅ Email validation added + tested"

Time: ~45 seconds
```

### Example 3: Orchestrator for Full-Stack Feature

```
You: "Orchestrator, build the newsletter archive feature"

Orchestrator:
  1. Decomposes task:
     - Backend: getNewsletters query (paginated)
     - Frontend: ArchivePage + NewsletterCard components
     - Testing: E2E archive flow test

  2. Invokes in parallel:
     - Backend Agent → builds query (2 min)
     - Frontend Agent → builds page (3 min)

  3. Waits for both (total 3 min, not 5)

  4. Verifies integration:
     - API contract matches ✅

  5. Runs E2E test via Testing Agent

  6. Returns:
     "✅ Newsletter archive complete
      - Backend: convex/newsletters.ts
      - Frontend: app/archive/page.tsx
      - Tests: All passing"

Time: ~5 minutes (parallel execution saved 2+ minutes)
```

### Example 4: Orchestrator for Cross-Layer Debugging

```
You: "Orchestrator, debug why users can't submit contributions"

Orchestrator:
  1. Asks Frontend Agent: "Check form submission logic"
     → Frontend: "✅ Form submits, calls mutation correctly"

  2. Asks Backend Agent: "Check saveContribution mutation"
     → Backend: "❌ Found issue: Missing auth check"

  3. Asks Backend Agent: "Add auth check to mutation"
     → Backend: "✅ Fixed + added test"

  4. Asks Testing Agent: "Run E2E test"
     → Testing: "✅ Submission works end-to-end"

  5. Returns:
     "✅ Fixed. Issue was missing auth check in backend.
      File: convex/contributions.ts:15"

Time: ~3 minutes
```

---

## Appendices

### Appendix A: POC-Specific Logic

#### Data Model (Convex Schema)

```typescript
// convex/schema.ts

users (synced from Clerk)
  - clerkId: string
  - email: string
  - name: string
  - profileImage: string
  - joinedAt: number

contributions
  - userId: Id<"users">
  - groupId: Id<"groups">
  - month: string // "2025-01"
  - prompt1: string // What did you do this month?
  - prompt2: string[] // Photo Wall (image URLs)
  - prompt3: string // One Good Thing
  - prompt4: string // On Your Mind
  - prompt5: string // Song you're listening to
  - submittedAt: number
  - updatedAt: number

groups
  - name: string // "My Friend Group"
  - createdAt: number
  - memberIds: Id<"users">[]

newsletters
  - groupId: Id<"groups">
  - month: string // "2025-01"
  - sentAt: number
  - htmlContent: string
  - recipientEmails: string[]
  - resendId: string (optional)
```

#### Core Features

**1. Authentication (Clerk)**
- Google OAuth
- Facebook OAuth
- Discord OAuth
- Email/Password
- Custom sign-in/sign-up pages at `/signin` and `/sign-up`
- Redirect to `/dashboard` after login

**2. Monthly Contribution Form**
- Route: `/contribute`
- 5 prompts for monthly updates
- Auto-save draft every 30s
- Users can edit until 2nd Saturday of next month
- Validate: at least 1 prompt filled before submission

**3. Automated Newsletter (Cron Job)**
- Schedule: Every 2nd Saturday at 9:00 AM
- Query all contributions for current month
- Generate HTML newsletter with Hinge-style layout
- Send via Resend to all group members
- Store sent newsletter in database

**4. Archive View**
- Route: `/archive`
- List all past newsletters (newest first)
- Click to view full HTML newsletter
- Filter by month

### Appendix B: Performance Constraints

#### Free Tier Limits

**Convex**:
- 1M function calls/month
- 1 GB database storage
- 1 GB bandwidth

**Strategies**:
- Use `db.query().take(N)` to limit results
- Paginate long lists
- Lazy load images
- Cache newsletter HTML

**Resend**:
- 100 emails/day (free tier)
- 3,000 emails/month

**Clerk**:
- 5,000 MAU (monthly active users)

**Vercel**:
- 100 GB bandwidth/month
- Serverless function: 100 GB-hours

### Appendix C: Integration Setup

#### External Services

**Clerk (Already Configured)**
- Dashboard: https://dashboard.clerk.com
- API keys in `.env.local`
- Webhook for user sync: `/api/webhooks/clerk`

**Convex (Already Configured)**
- Dashboard: https://dashboard.convex.dev
- Deploy URL in `.env.local`

**Resend (Needs API Key)**
- Requires user approval before setup
- Sign up at https://resend.com
- Get API key and add to `.env.local`

### Appendix D: Security Best Practices

#### Environment Variables
- **Never commit** `.env.local` to git
- **Use `.env.example`** as template
- **Validate** required vars on startup

#### Data Validation
- **Client-side**: Form validation (UX)
- **Server-side**: Convex validators (security)
- **Never trust user input**

**Example**:
```typescript
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

### Appendix E: POC Success Criteria

#### Metrics to Track

1. **User Engagement**
   - % of friends who submit each month
   - Time to complete form
   - Newsletter open rates

2. **Technical Performance**
   - Page load time (<2s)
   - Form submission time (<1s)
   - Newsletter generation time (<30s)

3. **Reliability**
   - Newsletter delivery success rate (>95%)
   - Uptime (>99%)
   - Zero data loss

### Appendix F: Escalation Protocol

#### When Agents Should Ask for Help

1. **Stuck after 3 debugging attempts**
2. **Unclear requirements** (ambiguous task)
3. **External service issues** (downtime)
4. **Architecture decision needed** (major refactor)
5. **Security concern** (potential vulnerability)

**How to escalate**:
- Pause work
- Document the issue clearly
- Present options (if any)
- Wait for user decision

### Appendix G: Useful Commands

```bash
# Development
npm run dev              # Start Next.js + Convex
npm run build            # Build Next.js app
npm run lint             # Lint code

# Testing
npx playwright test      # Run all tests
npx playwright test --ui # Run with UI

# Convex
npx convex dev           # Start Convex dev server
npx convex deploy        # Deploy to production
npx convex dashboard     # Open Convex dashboard

# Git
git status
git log --oneline -10
git diff main
```

### Appendix H: Learning Resources

**Core Documentation**:
- [Convex Docs](https://docs.convex.dev/)
- [Next.js Docs](https://nextjs.org/docs)
- [Clerk Docs](https://clerk.com/docs)
- [DaisyUI Components](https://daisyui.com/components/)
- [Playwright Docs](https://playwright.dev/)
- [Resend Docs](https://resend.com/docs)

**Framework Documentation** (Internal):
- `.claude/core/design-system.md` - Complete design system
- `.claude/core/agents/frontend.md` - Frontend agent protocol
- `.claude/core/agents/backend.md` - Backend agent protocol
- `.claude/core/agents/orchestrator.md` - Orchestrator protocol
- `.claude/core/UEDS.md` - Parallel development system
- `.claude/guides/testing.md` - Testing protocols
- `.claude/CHANGELOG.md` - Session logs

---

## 🎉 Final Notes

This POC is about **speed and validation**, not perfection.

**Priorities**:
1. ✅ **Ship fast** (weeks, not months)
2. ✅ **Real user feedback** (your friend group)
3. ✅ **Learn quickly** (iterate based on usage)
4. ✅ **Validate demand** (before building full app)

**Non-priorities**:
- ❌ Perfect UI/UX (good enough is fine)
- ❌ Scalability (100 users is plenty for POC)
- ❌ Advanced features (save for full build)

**Remember**: The goal is to prove the concept works, not build the final product.

---

**Version**: v1.3.0
**Last Updated**: 2025-10-11
**Maintained By**: Agentic development framework + Kalyan (product owner)

**Changes in v1.3.0**:
- Restructured with hybrid format (quick ref + detailed + appendices)
- Consolidated from CLAUDE.md + AGENT_ORCHESTRATION.md
- Eliminated redundant agent invocation examples
- Moved agent details to separate agent protocol files
- Improved navigation with clear part structure
- Size reduced by ~30KB (eliminated 50% duplication)
