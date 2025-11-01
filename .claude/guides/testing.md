# Testing Guide - Complete Reference

**Framework**: Enhanced Testing System (Factories + TDD + Contracts)
**Version**: Introduced in UEDS v1.2.0
**Last Updated**: 2025-10-11

---

## Quick Start (5-Minute Guide)

### What's New in Enhanced Testing?

1. ✅ **Factories** replace static test data
2. ✅ **Contracts** define API specs upfront
3. ✅ **TDD** becomes mandatory (tests first)

### How to Use (Step-by-Step)

#### When You Start a New Full-Stack Feature

**Example**: "Build user profile editing feature"

**Step 1: Tell Orchestrator**
```
You: "Build user profile editing feature using UEDS with enhanced testing"
```

**Step 2: Orchestrator Creates Contract**
```typescript
// Orchestrator will create: tests/contracts/user-profile.contract.ts
{
  backend: {
    mutations: {
      updateProfile: {
        args: { name: "string", bio: "string" },
        returns: "Id<'users'>",
        errors: ["Not authenticated", "Invalid name"]
      }
    }
  },
  frontend: {
    component: "ProfileEditPage",
    uses: ["name", "bio", "profileImage"],
    requires: ["_id", "name"],
    sends: { name: "string", bio: "string" }
  }
}
```

**Step 3: Backend Agent (TDD)**
```markdown
STORY-A5: Create updateProfile Mutation

Agent workflow:
1. Read contract ✓
2. Use factory: createUser() ✓
3. Write tests FIRST ✓
4. Run tests (expect failures) ❌
5. Write mutation ✓
6. Re-run tests (should pass) ✅
7. 100% pass rate verified ✓
```

**Step 4: Frontend Agent (TDD)**
```markdown
STORY-C4: Build ProfileEditPage

Agent workflow:
1. Read contract ✓
2. Use factory: createUser() ✓
3. Write tests FIRST ✓
4. Run tests (expect failures) ❌
5. Build component ✓
6. Re-run tests (should pass) ✅
7. Visual tests + design system ✓
```

**Step 5: Orchestrator Integration**
```markdown
Both agents complete:
✅ Backend: 5/5 tests (100%)
✅ Frontend: 9/9 tests (100%)

Orchestrator verifies:
✅ Contract compliance
✅ E2E integration test
✅ Mark stories complete
```

---

## Part 1: Testing Philosophy

### Test-First Development

All agents MUST follow Test-Driven Development (TDD) when building features. This ensures:
- ✅ Requirements understood before coding
- ✅ All functionality tested
- ✅ Fewer bugs
- ✅ Better design decisions
- ✅ Confidence in changes

### The Red → Green → Refactor Loop

```
1. RED:   Write a failing test (no implementation yet)
2. GREEN: Write minimal code to make test pass
3. REFACTOR: Clean up code while keeping tests green
4. REPEAT: Move to next test
```

**CRITICAL**: Never skip step 1 (writing test first).

---

## Part 2: TDD Workflow

### Backend Agent TDD Workflow

#### Step 1: Read Contract & Requirements

```markdown
Task: "Create saveContribution mutation"

1. Read contract: tests/contracts/contribution.contract.ts
2. Understand args, returns, errors
3. Identify test cases needed
```

#### Step 2: Create or Use Factory

```typescript
// If factory doesn't exist, create it first
// tests/factories/contributionFactory.ts

export function createContribution(overrides = {}) {
  return {
    groupId: "test-group",
    month: "2025-10",
    prompt1: "Test monthly update",
    prompt2: [],
    prompt3: "One good thing",
    prompt4: "On my mind",
    prompt5: "Song - Artist",
    ...overrides
  };
}
```

#### Step 3: Write Tests FIRST (RED Phase)

```typescript
// tests/unit/contributions.test.ts
import { createContribution } from '../factories/contributionFactory';

describe("saveContribution mutation", () => {
  // Test 1: Happy path
  test("saves contribution with valid data", async () => {
    const mockCtx = createMockContext({ auth: mockAuth });
    const data = createContribution();

    const result = await saveContribution(mockCtx, data);

    expect(result).toBeDefined();
    expect(mockCtx.db.insert).toHaveBeenCalledWith("contributions",
      expect.objectContaining({
        userId: mockUser._id,
        month: data.month,
        prompt1: data.prompt1
      })
    );
  });

  // Test 2: Auth check
  test("rejects unauthenticated users", async () => {
    const mockCtx = createMockContext({ auth: null });
    const data = createContribution();

    await expect(saveContribution(mockCtx, data))
      .rejects.toThrow("You must be logged in");
  });

  // Test 3: Validation
  test("validates month format", async () => {
    const mockCtx = createMockContext({ auth: mockAuth });
    const data = createContribution({ month: "2025-1" }); // Invalid

    await expect(saveContribution(mockCtx, data))
      .rejects.toThrow("Invalid month format");
  });

  // Test 4: Business logic
  test("updates existing contribution", async () => {
    const mockCtx = createMockContext({
      auth: mockAuth,
      db: mockDbWithExisting
    });
    const data = createContribution();

    await saveContribution(mockCtx, data);

    expect(mockCtx.db.patch).toHaveBeenCalled();
    expect(mockCtx.db.insert).not.toHaveBeenCalled();
  });

  // Test 5: Error case
  test("checks group membership", async () => {
    const mockCtx = createMockContext({
      auth: mockAuth,
      db: mockDbWithOtherGroup
    });
    const data = createContribution({ groupId: "other-group" });

    await expect(saveContribution(mockCtx, data))
      .rejects.toThrow("You are not a member of this group");
  });
});
```

#### Step 4: Run Tests (Expect Failures - RED)

```bash
npm run test:unit -- tests/unit/contributions.test.ts

# Expected output:
# ❌ FAIL tests/unit/contributions.test.ts
#   ❌ saves contribution with valid data
#      Error: saveContribution is not defined
#   ... (all tests failing)
#
# Tests: 0 passed, 5 failed, 5 total
```

**This is CORRECT in TDD!** Tests should fail because we haven't written the implementation yet.

#### Step 5: Write Implementation (GREEN Phase)

```typescript
// convex/contributions.ts
import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { ConvexError } from "convex/values";

export const saveContribution = mutation({
  args: {
    groupId: v.id("groups"),
    month: v.string(),
    prompt1: v.string(),
    prompt2: v.array(v.string()),
    prompt3: v.string(),
    prompt4: v.string(),
    prompt5: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Auth check (makes test 2 pass)
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("You must be logged in");
    }

    // 2. Validate month format (makes test 3 pass)
    if (!/^\d{4}-\d{2}$/.test(args.month)) {
      throw new ConvexError("Invalid month format. Use YYYY-MM");
    }

    // 3. Get user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    // 4. Check group membership (makes test 5 pass)
    const group = await ctx.db.get(args.groupId);
    if (!group || !group.memberIds.includes(user._id)) {
      throw new ConvexError("You are not a member of this group");
    }

    // 5. Check for existing contribution (makes test 4 pass)
    const existing = await ctx.db
      .query("contributions")
      .withIndex("by_user_month", (q) =>
        q.eq("userId", user._id).eq("month", args.month)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        updatedAt: Date.now()
      });
      return existing._id;
    }

    // 6. Create new (makes test 1 pass)
    const contributionId = await ctx.db.insert("contributions", {
      userId: user._id,
      groupId: args.groupId,
      month: args.month,
      prompt1: args.prompt1,
      prompt2: args.prompt2,
      prompt3: args.prompt3,
      prompt4: args.prompt4,
      prompt5: args.prompt5,
      submittedAt: Date.now(),
      updatedAt: Date.now(),
    });

    return contributionId;
  }
});
```

#### Step 6: Re-run Tests (Should Pass - GREEN)

```bash
npm run test:unit -- tests/unit/contributions.test.ts

# Expected output:
# ✅ PASS tests/unit/contributions.test.ts
#   ✅ saves contribution with valid data (234ms)
#   ✅ rejects unauthenticated users (123ms)
#   ✅ validates month format (98ms)
#   ✅ updates existing contribution (187ms)
#   ✅ checks group membership (145ms)
#
# Tests: 5 passed, 5 total
# Pass Rate: 100%
```

**Now we're GREEN!** All tests pass.

#### Step 7: Refactor (Optional)

If code is messy, clean it up while keeping tests green:
- Extract helper functions
- Improve variable names
- Simplify logic
- Add comments

**Re-run tests after each refactor** to ensure nothing broke.

#### Step 8: Mark Story Complete

Only mark complete when:
- ✅ All tests passing (100% pass rate)
- ✅ Implementation follows Convex patterns
- ✅ Contract compliance verified
- ✅ Code documented

---

### Frontend Agent TDD Workflow

#### Step 1: Read Contract & Requirements

```markdown
Task: "Build ContributionForm component"

1. Read contract: tests/contracts/contribution.contract.ts
2. Understand what backend expects
3. Identify UI states to test
```

#### Step 2: Write Tests FIRST (RED Phase)

```typescript
// tests/contribution-form.spec.ts
import { test, expect } from '@playwright/test';
import { createContribution } from './factories/contributionFactory';

test.describe("ContributionForm Component", () => {
  // Test 1: Renders empty form
  test("renders empty form with all prompts", async ({ page }) => {
    await page.goto("/contribute");

    await expect(page.locator('[data-prompt="1"]')).toBeVisible();
    await expect(page.locator('[data-prompt="2"]')).toBeVisible();
    await expect(page.locator('[data-prompt="3"]')).toBeVisible();
    await expect(page.locator('[data-prompt="4"]')).toBeVisible();
    await expect(page.locator('[data-prompt="5"]')).toBeVisible();
    await expect(page.locator('[data-prompt="1"]')).toBeEmpty();
  });

  // Test 2: Fills form with data
  test("fills form with valid data", async ({ page }) => {
    const data = createContribution();
    await page.goto("/contribute");

    await page.locator('[data-prompt="1"]').fill(data.prompt1);
    await expect(page.locator('[data-prompt="1"]')).toHaveValue(data.prompt1);

    await page.locator('[data-prompt="3"]').fill(data.prompt3);
    await expect(page.locator('[data-prompt="3"]')).toHaveValue(data.prompt3);
  });

  // Test 3: Validates required fields
  test("shows validation error when submitting empty form", async ({ page }) => {
    await page.goto("/contribute");
    await page.click('[data-action="submit"]');
    await expect(page.locator("text=At least 1 prompt required")).toBeVisible();
  });

  // Test 4: Submits to backend
  test("submits form with correct data structure", async ({ page }) => {
    const data = createContribution();
    await page.goto("/contribute");

    await page.locator('[data-prompt="1"]').fill(data.prompt1);
    await page.locator('[data-prompt="3"]').fill(data.prompt3);
    await page.click('[data-action="submit"]');

    await expect(page.locator("text=Contribution saved")).toBeVisible();
  });

  // Test 5: Visual regression - Empty state
  test("empty state visual - desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/contribute");
    await expect(page).toHaveScreenshot("form-empty-desktop.png");
  });

  // Test 6: Visual regression - Filled state
  test("filled state visual - desktop", async ({ page }) => {
    const data = createContribution();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/contribute");

    await page.locator('[data-prompt="1"]').fill(data.prompt1);
    await expect(page).toHaveScreenshot("form-filled-desktop.png");
  });

  // Test 7: Visual regression - Error state
  test("error state visual - desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/contribute");
    await page.click('[data-action="submit"]');
    await expect(page).toHaveScreenshot("form-error-desktop.png");
  });
});
```

#### Step 3: Run Tests (Expect Failures - RED)

```bash
npx playwright test tests/contribution-form.spec.ts

# Expected output:
# ❌ FAIL tests/contribution-form.spec.ts
#   ❌ renders empty form with all prompts
#      Error: locator('[data-prompt="1"]') not found
#   ... (all tests failing)
```

**This is CORRECT!** Component doesn't exist yet.

#### Step 4: Build Component (GREEN Phase)

```tsx
// app/contribute/page.tsx
"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function ContributePage() {
  const [prompt1, setPrompt1] = useState("");
  const [prompt3, setPrompt3] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const saveContribution = useMutation(api.contributions.saveContribution);

  const handleSubmit = async () => {
    if (!prompt1 && !prompt3) {
      setError("At least 1 prompt required");
      return;
    }

    try {
      await saveContribution({
        groupId: "current-group-id",
        month: new Date().toISOString().substring(0, 7),
        prompt1,
        prompt2: [],
        prompt3,
        prompt4: "",
        prompt5: ""
      });

      setSuccess(true);
      setError("");
    } catch (err) {
      setError("Failed to save contribution");
    }
  };

  return (
    <form className="grid grid-cols-1 gap-6 p-6 bg-base-100 rounded-[16px]">
      {/* Prompt 1 */}
      <div>
        <label className="label">
          <span className="label-text text-base font-medium">
            What did you do this month?
          </span>
        </label>
        <textarea
          data-prompt="1"
          className="textarea textarea-bordered w-full"
          rows={6}
          value={prompt1}
          onChange={(e) => setPrompt1(e.target.value)}
        />
      </div>

      {/* Prompt 3 */}
      <div>
        <label className="label">
          <span className="label-text text-base font-medium">
            One Good Thing
          </span>
        </label>
        <input
          data-prompt="3"
          type="text"
          className="input input-bordered w-full"
          value={prompt3}
          onChange={(e) => setPrompt3(e.target.value)}
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="alert alert-success">
          <span>Contribution saved!</span>
        </div>
      )}

      {/* Submit button */}
      <button
        type="button"
        data-action="submit"
        className="btn btn-primary"
        onClick={handleSubmit}
      >
        Submit Contribution
      </button>
    </form>
  );
}
```

#### Step 5: Re-run Tests (Should Pass - GREEN)

```bash
npx playwright test tests/contribution-form.spec.ts

# Expected output:
# ✅ PASS tests/contribution-form.spec.ts
#   ✅ renders empty form with all prompts (543ms)
#   ✅ fills form with valid data (687ms)
#   ✅ shows validation error (456ms)
#   ✅ submits form (789ms)
#   ✅ empty state visual - desktop (1.2s)
#   ✅ filled state visual - desktop (1.4s)
#   ✅ error state visual - desktop (987ms)
#
# Tests: 7 passed, 7 total
```

#### Step 6: Design System Verification

```bash
npx playwright test tests/design-system.spec.ts --grep="ContributionForm"

# Verify:
# ✅ Colors: btn-primary, textarea-bordered (design tokens)
# ✅ Spacing: gap-6, p-6 (system scale)
# ✅ Components: DaisyUI textarea, input, btn
```

#### Step 7: Mark Story Complete

Only mark complete when:
- ✅ All functional tests passing
- ✅ All visual tests passing
- ✅ Design system compliant (100%)
- ✅ Contract compliance verified

---

## Part 3: Test Types & Scenarios

### Unit Tests (Convex Backend)

**Required for**:
- All mutations
- All queries
- All actions
- Business logic functions

**Test Coverage**:
```typescript
describe("functionName", () => {
  describe("validation", () => {
    test("rejects invalid email format", async () => { /* ... */ });
    test("rejects empty name", async () => { /* ... */ });
  });

  describe("authentication", () => {
    test("throws error when not authenticated", async () => { /* ... */ });
  });

  describe("business logic", () => {
    test("creates record successfully", async () => { /* ... */ });
    test("updates existing record", async () => { /* ... */ });
  });

  describe("error cases", () => {
    test("handles duplicate entries", async () => { /* ... */ });
    test("handles missing references", async () => { /* ... */ });
  });
});
```

### E2E Tests (Playwright)

**Test Scenarios** (Complete List):

#### 1. Authentication Flow
```typescript
test.describe("Authentication", () => {
  test("user can sign up with email", async ({ page }) => {
    await page.goto("/sign-up");
    await page.fill('[name="email"]', "test@example.com");
    await page.fill('[name="password"]', "password123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/dashboard");
  });

  test("user can sign in with Google", async ({ page }) => {
    await page.goto("/signin");
    await page.click('button:has-text("Sign in with Google")');
    // OAuth flow simulation
    await expect(page).toHaveURL("/dashboard");
  });

  test("user can sign out", async ({ page }) => {
    await signIn(page);
    await page.click('[data-action="sign-out"]');
    await expect(page).toHaveURL("/");
  });

  test("session persists after refresh", async ({ page }) => {
    await signIn(page);
    await page.reload();
    await expect(page).toHaveURL("/dashboard");
  });
});
```

#### 2. Contribution Form
```typescript
test.describe("Contribution Form", () => {
  test("fills all prompts and submits", async ({ page }) => {
    const data = createContribution();
    await page.goto("/contribute");

    await page.fill('[data-prompt="1"]', data.prompt1);
    await page.fill('[data-prompt="3"]', data.prompt3);
    await page.fill('[data-prompt="4"]', data.prompt4);
    await page.fill('[data-prompt="5"]', data.prompt5);

    await page.click('[data-action="submit"]');
    await expect(page.locator("text=Contribution saved")).toBeVisible();
  });

  test("uploads images to photo wall", async ({ page }) => {
    await page.goto("/contribute");

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('test-image.jpg');

    await expect(page.locator('img[alt="Upload preview"]')).toBeVisible();
  });

  test("auto-saves draft every 30 seconds", async ({ page }) => {
    await page.goto("/contribute");
    await page.fill('[data-prompt="1"]', "Draft content");

    await page.waitForTimeout(31000); // Wait for auto-save
    await expect(page.locator("text=Draft saved")).toBeVisible();
  });

  test("loads existing contribution for editing", async ({ page }) => {
    const existing = createContribution();
    await seedContribution(existing);

    await page.goto("/contribute");
    await expect(page.locator('[data-prompt="1"]')).toHaveValue(existing.prompt1);
  });
});
```

#### 3. Newsletter Generation
```typescript
test.describe("Newsletter Generation", () => {
  test("generates newsletter on 2nd Saturday", async ({ page }) => {
    // Simulate cron trigger
    await triggerCron("send-newsletter");

    // Verify newsletter created
    const newsletters = await getNewsletters();
    expect(newsletters.length).toBeGreaterThan(0);
  });

  test("includes all contributions in newsletter", async ({ page }) => {
    const contributions = [
      createContribution({ userId: "user1" }),
      createContribution({ userId: "user2" })
    ];
    await seedContributions(contributions);

    await triggerCron("send-newsletter");

    const newsletter = await getLatestNewsletter();
    expect(newsletter.htmlContent).toContain(contributions[0].prompt1);
    expect(newsletter.htmlContent).toContain(contributions[1].prompt1);
  });

  test("sends email to all group members", async ({ page }) => {
    await triggerCron("send-newsletter");

    const sentEmails = await getResendEmails();
    expect(sentEmails.length).toBe(5); // 5 group members
  });

  test("stores sent newsletter in database", async ({ page }) => {
    await triggerCron("send-newsletter");

    const newsletter = await getLatestNewsletter();
    expect(newsletter.sentAt).toBeDefined();
    expect(newsletter.resendId).toBeDefined();
  });
});
```

#### 4. Archive View
```typescript
test.describe("Archive View", () => {
  test("lists all past newsletters", async ({ page }) => {
    const newsletters = [
      createNewsletter({ month: "2025-01" }),
      createNewsletter({ month: "2025-02" })
    ];
    await seedNewsletters(newsletters);

    await page.goto("/archive");
    await expect(page.locator("text=January 2025")).toBeVisible();
    await expect(page.locator("text=February 2025")).toBeVisible();
  });

  test("displays newsletters newest first", async ({ page }) => {
    await page.goto("/archive");

    const months = await page.locator('.newsletter-month').allTextContents();
    expect(months[0]).toContain("February");
    expect(months[1]).toContain("January");
  });

  test("opens full newsletter on click", async ({ page }) => {
    await page.goto("/archive");
    await page.click('text=January 2025');

    await expect(page).toHaveURL("/archive/2025-01");
    await expect(page.locator('.newsletter-content')).toBeVisible();
  });

  test("filters newsletters by month", async ({ page }) => {
    await page.goto("/archive");
    await page.selectOption('[data-filter="month"]', "2025-01");

    await expect(page.locator("text=January 2025")).toBeVisible();
    await expect(page.locator("text=February 2025")).not.toBeVisible();
  });
});
```

### Visual Regression Tests

**MANDATORY for all frontend components**:

```typescript
// Test at 3 breakpoints
const sizes = [
  { width: 375, height: 667, name: 'mobile' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 1440, height: 900, name: 'desktop' }
];

for (const size of sizes) {
  test(`contribution form visual - ${size.name}`, async ({ page }) => {
    await page.setViewportSize({ width: size.width, height: size.height });
    await page.goto("/contribute");
    await expect(page).toHaveScreenshot(`form-${size.name}.png`);
  });
}
```

---

## Part 4: Factories & Contracts

### Using Test Factories

**Available Factories**:

```typescript
// tests/factories/userFactory.ts
export function createUser(overrides = {}) {
  return {
    _id: generateId(),
    clerkId: `user_${generateId()}`,
    email: "test@example.com",
    name: "Test User",
    profileImage: "https://example.com/avatar.jpg",
    joinedAt: Date.now(),
    ...overrides
  };
}

// tests/factories/groupFactory.ts
export function createGroup(overrides = {}) {
  return {
    _id: generateId(),
    name: "Test Friend Group",
    createdAt: Date.now(),
    memberIds: [],
    ...overrides
  };
}

// tests/factories/contributionFactory.ts
export function createContribution(overrides = {}) {
  return {
    _id: generateId(),
    userId: generateId(),
    groupId: generateId(),
    month: "2025-10",
    prompt1: "This month I traveled to Japan and visited...",
    prompt2: ["https://example.com/photo1.jpg"],
    prompt3: "Reconnecting with old friends",
    prompt4: "Planning my next adventure",
    prompt5: "Levitating - Dua Lipa",
    submittedAt: Date.now(),
    updatedAt: Date.now(),
    ...overrides
  };
}

// tests/factories/newsletterFactory.ts
export function createNewsletter(overrides = {}) {
  return {
    _id: generateId(),
    groupId: generateId(),
    month: "2025-10",
    sentAt: Date.now(),
    htmlContent: "<html>...</html>",
    recipientEmails: ["user1@example.com", "user2@example.com"],
    resendId: "email_12345",
    ...overrides
  };
}
```

**Usage**:
```typescript
import { createUser, createContribution } from './factories';

// Default data
const user = createUser();

// Override specific fields
const customUser = createUser({
  email: "custom@example.com",
  name: "Custom Name"
});

// Realistic test data
const contribution = createContribution({
  userId: user._id,
  month: "2025-11"
});
```

### Creating Contracts

**Contract Template**:
```typescript
// tests/contracts/[feature].contract.ts

export const featureContract = {
  backend: {
    // Mutations
    mutations: {
      functionName: {
        args: {
          field1: "string",
          field2: "number"
        },
        returns: "Id<'tableName'>",
        errors: ["Error message 1", "Error message 2"]
      }
    },

    // Queries
    queries: {
      functionName: {
        args: { id: "Id<'tableName'>" },
        returns: {
          field1: "string",
          field2: "number",
          nested: {
            subField: "boolean"
          }
        },
        errors: ["Not found"]
      }
    }
  },

  frontend: {
    component: "ComponentName",
    uses: ["field1", "field2"], // Fields actually used
    requires: ["_id", "field1"], // Fields required to function
    sends: {
      field1: "string",
      field2: "number"
    }
  }
};
```

### Contract Verification

**Orchestrator verifies contracts automatically**:

```typescript
function verifyContract(backend, frontend) {
  const backendFields = extractFields(backend.returns);
  const frontendNeeds = frontend.requires;

  const missing = frontendNeeds.filter(f => !backendFields.includes(f));

  if (missing.length > 0) {
    return {
      status: "MISMATCH",
      issue: `Backend missing: ${missing.join(", ")}`,
      fix: "Backend Agent must add these fields"
    };
  }

  return { status: "MATCH" };
}
```

---

## Part 5: Visual Testing Requirements

### Screenshot Requirements (3 Breakpoints)

**For ALL frontend components**, agents MUST:

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

### Design System Compliance Verification

**Automated checks**:
```typescript
test("component uses design system colors", async ({ page }) => {
  await page.goto("/component");

  // Verify primary button color
  const button = page.locator('button.btn-primary');
  const bgColor = await button.evaluate(el =>
    window.getComputedStyle(el).backgroundColor
  );

  // DaisyUI primary (#a442fe) = rgb(164, 66, 254)
  expect(bgColor).toBe('rgb(164, 66, 254)');
});

test("component uses design system spacing", async ({ page }) => {
  await page.goto("/component");

  const container = page.locator('.container');
  const padding = await container.evaluate(el =>
    window.getComputedStyle(el).padding
  );

  // Verify system scale (e.g., p-6 = 24px)
  expect(padding).toBe('24px');
});
```

---

## Appendices

### Appendix A: Test Execution Verification Protocol

**From TDD_PROTOCOL.md**:

**Backend Tests**:
```bash
npm run test:unit -- tests/unit/[file].test.ts
```

**Frontend Tests**:
```bash
npx playwright test tests/[file].spec.ts
```

**All Tests**:
```bash
npm run test
```

### Appendix B: Implementation Failure Detection

**Signs of implementation failure**:
- ❌ Tests passing but feature doesn't work
- ❌ Tests failing after 3 fix attempts
- ❌ Integration test failures
- ❌ Visual regression failures

**Recovery protocol**:
1. Review test specification
2. Review contract
3. Re-implement with correct approach
4. Re-run tests
5. If still failing → Escalate to user

### Appendix C: When NOT to Use TDD

**OK to skip TDD for**:
1. **Trivial changes** (fixing typo, updating color constant)
2. **Exploratory prototyping** (trying new library, unclear requirements)
3. **Documentation** (writing markdown files)
4. **Visual-only adjustments** (tweaking padding by 2px)

**MUST use TDD for**:
1. **All features** (new functionality)
2. **All bug fixes** (write test that catches bug, then fix)
3. **All API changes** (backend mutations/queries)
4. **All user interactions** (forms, buttons, navigation)

### Appendix D: Complete Test Scenarios List

**See Part 3 above for full list covering**:
- Authentication Flow (4 tests)
- Contribution Form (4 tests)
- Newsletter Generation (4 tests)
- Archive View (4 tests)
- Visual Regression (all components, all breakpoints)

---

## 🎉 Summary

### Key Principles

1. ✅ **Always write tests FIRST** (before implementation)
2. ✅ **Run tests to see them FAIL** (verify test works)
3. ✅ **Write minimal code to pass** (don't over-engineer)
4. ✅ **Refactor while GREEN** (clean up safely)
5. ✅ **100% pass rate required** (no story complete with failures)

### Benefits

- ✅ Better understanding of requirements
- ✅ Fewer bugs
- ✅ Confidence in changes
- ✅ Living documentation
- ✅ Better code design

### Integration with UEDS

- **UEDS**: Coordinates when tests run
- **Testing System**: Defines how to write tests
- **Factories**: Provide consistent test data
- **Contracts**: Prevent integration failures
- **TDD**: Ensures quality implementation

**TDD + Factories + Contracts = Zero Integration Failures**

---

**Version**: 1.0.0
**Last Updated**: 2025-10-11
**Framework**: UEDS v1.2.0

**Consolidated from**:
- TESTING.md (Playwright scenarios)
- TESTING_PROTOCOL_TDD.md (TDD workflow)
- ENHANCED_TESTING_SUMMARY.md (system overview)
- QUICK_START_ENHANCED_TESTING.md (quick guide)

**Size**: ~28KB (was 66KB combined - eliminated 38KB duplication)
