# Newsletter Generation System - Story Kick-Off Commands

> **Project**: Newsletter Generation System
> **Branch**: `feature/newsletter-generation`
> **Linear Project**: https://linear.app/2s6y/project/newsletter-generation-system

---

## 📋 Quick Reference

**Phase 1 (Parallel)** - Start these in 3 separate Claude sessions:
- [STORY-B1](#story-b1-newsletter-generation-action-4h) - Newsletter Generation Action (4h)
- [STORY-B2](#story-b2-email-template-generation-3h) - Email Template Generation (3h)
- [STORY-B3](#story-b3-web-content-generation-2h) - Web Content Generation (2h)

**Phase 2 (Sequential)** - Start after Phase 1 completes:
- [STORY-B4](#story-b4-resend-integration-3h) - Resend Integration (3h)

**Phase 3 (Sequential)** - Start after all backend completes:
- [STORY-I1](#story-i1-integration-tests-4h) - Integration Tests (4h)

---

## STORY-B1: Newsletter Generation Action (4h)

**Linear Issue**: https://linear.app/2s6y/issue/2S6-26
**Agent**: Backend Agent
**Dependencies**: None (can start immediately)
**Branch**: `feature/newsletter-generation`

### Kick-Off Command:

```
Implement STORY-B1: Newsletter Generation Action

**Linear Issue**: https://linear.app/2s6y/issue/2S6-26
**Estimate**: 4 hours
**Status**: Update to "In Progress" when you start

**Deliverables**:

1. **File**: `convex/newsletters/generate.ts`
   - Create action: `generateNewsletters()`
   - Query all groups from `groups` table
   - For each group:
     - Get current month's contributions (status: "submitted")
     - Filter out draft or missing contributions
     - Generate HTML content for email (member cards with responses)
     - Generate web content JSON (with media URLs, video embeds)
     - Identify excluded members (no submission or draft status)
     - Store newsletter record in `newsletters` table with:
       - `groupId`
       - `month` (YYYY-MM format)
       - `htmlContent` (email template)
       - `webContent` (rich JSON structure)
       - `excludedMemberIds` (array of user IDs)
       - `generatedAt` (timestamp)

2. **Schema Reference** (already exists in `convex/schema.ts`):
   ```typescript
   newsletters: defineTable({
     groupId: v.id("groups"),
     month: v.string(), // "2025-10"
     htmlContent: v.string(),
     webContent: v.any(), // Rich JSON structure
     excludedMemberIds: v.array(v.id("users")),
     generatedAt: v.number(),
     sentAt: v.optional(v.number()),
     resendIds: v.optional(v.array(v.string()))
   })
   ```

3. **Testing** (TDD - write tests first):
   - Create `convex/newsletters.test.ts`
   - 8 unit tests (Vitest):
     - Query all groups correctly
     - Filter submitted contributions only
     - Generate HTML content structure
     - Generate web content JSON
     - Identify excluded members correctly
     - Store newsletter record with all fields
     - Handle empty groups (no contributions)
     - Handle partial contributions (some members missing)

4. **Quality Gates** (auto-invoked after completion):
   - Code Reviewer: TypeScript, ESLint, Prettier
   - Security Specialist: Secrets, CVEs, OWASP

**Linear Updates**:
- Start: Update issue 2S6-26 to "In Progress"
- Complete: Update to "Done" + add comment with test results

**Reference Documentation**:
- Convex actions: https://docs.convex.dev/functions/actions
- Schema: `convex/schema.ts` (newsletters table)
- Contributions schema: `convex/schema.ts` (contributions table)
```

---

## STORY-B2: Email Template Generation (3h)

**Linear Issue**: https://linear.app/2s6y/issue/2S6-27
**Agent**: Backend Agent (with frontend component)
**Dependencies**: None (can start immediately)
**Branch**: `feature/newsletter-generation`

### Kick-Off Command:

```
Implement STORY-B2: Email Template Generation

**Linear Issue**: https://linear.app/2s6y/issue/2S6-27
**Estimate**: 3 hours
**Status**: Update to "In Progress" when you start

**Deliverables**:

1. **File**: `emails/NewsletterEmail.tsx` (React Email component)
   - Install `@react-email/components` if not already installed
   - Create email template with:
     - **Header**: Group name, month/year
     - **Member Cards** (Hinge-style layout):
       - Member name + avatar (thumbnail, not full-size)
       - For each prompt response:
         - Prompt text (styled typography)
         - Response text
         - Media thumbnails (images/audio/video - lightweight)
     - **Footer**:
       - "View Web Version" button linking to `/groups/[groupId]/issues/[month]`
       - Unsubscribe link (future feature, placeholder for now)
   - **Design System**: Use inline styles matching DaisyUI cupcake theme
     - Primary: `#65c3c8` (teal)
     - Accent: `#ef9fbc` (pink)
     - Base: `#faf7f5` (cream)
     - Typography: Inter font family

2. **Props Interface**:
   ```typescript
   interface NewsletterEmailProps {
     groupName: string;
     month: string; // "October 2025"
     members: Array<{
       name: string;
       avatarUrl?: string;
       responses: Array<{
         promptText: string;
         responseText?: string;
         mediaUrls?: string[];
       }>;
     }>;
     webViewUrl: string; // Full URL to web version
   }
   ```

3. **Testing**:
   - Create `emails/NewsletterEmail.test.tsx` (visual test)
   - Test with sample data (3 members, 3 prompts each)
   - Verify email renders correctly in preview
   - Check image thumbnails (not full-size)
   - Verify "View Web Version" link

4. **Quality Gates** (auto-invoked after completion):
   - Code Reviewer: TypeScript, ESLint, Prettier
   - UX Reviewer: Accessibility, responsive email design

**Linear Updates**:
- Start: Update issue 2S6-27 to "In Progress"
- Complete: Update to "Done" + add comment with test results

**Reference Documentation**:
- React Email: https://react.email/docs/introduction
- DaisyUI cupcake theme: `.claude/core/design-system.md`
- Email best practices: Lightweight images, inline styles only
```

---

## STORY-B3: Web Content Generation (2h)

**Linear Issue**: https://linear.app/2s6y/issue/2S6-28
**Agent**: Backend Agent
**Dependencies**: None (can start immediately)
**Branch**: `feature/newsletter-generation`

### Kick-Off Command:

```
Implement STORY-B3: Web Content Generation

**Linear Issue**: https://linear.app/2s6y/issue/2S6-28
**Estimate**: 2 hours
**Status**: Update to "In Progress" when you start

**Deliverables**:

1. **File**: `convex/newsletters/webContent.ts`
   - Create helper function: `generateWebContent(groupId, month)`
   - Query contributions for the group/month
   - Transform into rich JSON structure for web display
   - **Structure**:
     ```typescript
     interface WebContent {
       groupName: string;
       month: string; // "2025-10"
       members: Array<{
         userId: string;
         name: string;
         avatarUrl?: string;
         responses: Array<{
           promptNumber: number;
           promptText: string;
           responseText?: string;
           media?: Array<{
             type: "image" | "audio" | "video";
             url: string;
             metadata?: {
               // For video embeds
               platform?: "youtube" | "spotify" | "other";
               embedUrl?: string;
               thumbnail?: string;
             };
           }>;
           // Future: likes, comments
           likes?: number;
           comments?: Array<any>;
         }>;
       }>;
     }
     ```

2. **Features**:
   - Support embedded video players:
     - YouTube: Extract video ID from URL, generate embed URL
     - Spotify: Extract track/playlist ID, generate embed URL
     - Generic video: Use video URL directly
   - Support interactive elements (structure only, UI later):
     - Likes count (placeholder for future)
     - Comments array (placeholder for future)
   - Use existing `newsletters.webContent` field (already in schema)

3. **Testing** (TDD - write tests first):
   - Create `convex/newsletters/webContent.test.ts`
   - 5 unit tests (Vitest):
     - Generate web content structure correctly
     - Handle image media (URL extraction)
     - Handle audio media (URL extraction)
     - Handle video embeds (YouTube URL → embed URL)
     - Handle Spotify embeds (track URL → embed URL)

4. **Quality Gates** (auto-invoked after completion):
   - Code Reviewer: TypeScript, ESLint, Prettier

**Linear Updates**:
- Start: Update issue 2S6-28 to "In Progress"
- Complete: Update to "Done" + add comment with test results

**Reference Documentation**:
- YouTube embed format: `https://www.youtube.com/embed/[VIDEO_ID]`
- Spotify embed format: `https://open.spotify.com/embed/track/[TRACK_ID]`
- Schema: `convex/schema.ts` (newsletters.webContent field)
```

---

## STORY-B4: Resend Integration (3h)

**Linear Issue**: https://linear.app/2s6y/issue/2S6-29
**Agent**: Backend Agent
**Dependencies**: ⚠️ **BLOCKED BY** B1, B2, B3 (wait until all complete)
**Branch**: `feature/newsletter-generation`

### Kick-Off Command:

```
Implement STORY-B4: Resend Integration

**Linear Issue**: https://linear.app/2s6y/issue/2S6-29
**Estimate**: 3 hours
**Status**: Update to "In Progress" when you start

⚠️ **IMPORTANT**: This story is BLOCKED by B1, B2, B3. Only start after:
- STORY-B1 (Newsletter Generation) is complete
- STORY-B2 (Email Template) is complete
- STORY-B3 (Web Content) is complete

**Deliverables**:

1. **File**: `convex/newsletters/sendEmail.ts`
   - Create action: `sendNewsletterEmail(newsletterId: Id<"newsletters">)`
   - Query newsletter by ID
   - Get all group members (active only, exclude blocked)
   - Filter out excluded members (from `excludedMemberIds`)
   - Render email template using React Email + newsletter data
   - Batch send emails via Resend API:
     ```typescript
     import { Resend } from 'resend';
     const resend = new Resend(process.env.RESEND_API_KEY);

     const result = await resend.emails.send({
       from: 'newsletters@2s6y.com',
       to: memberEmails,
       subject: `${groupName} - ${month} Newsletter`,
       react: NewsletterEmail({ ...emailProps })
     });
     ```
   - Store `resendId` from response in newsletter record
   - Update newsletter with `sentAt` timestamp
   - Error handling:
     - Retry logic (3 attempts with exponential backoff)
     - Log failures to separate table (future feature)
     - Partial success: Track which emails sent successfully

2. **File**: `convex/cron.ts` (update existing)
   - Update cron job for 2nd Saturday at 12 PM UTC
   - Call `generateNewsletters()` action (from STORY-B1)
   - After generation, call `sendNewsletterEmail()` for each newsletter
   - **Cron schedule**: `0 12 * * 6#2` (2nd Saturday, 12 PM UTC)

3. **Environment Setup**:
   - Ensure `RESEND_API_KEY` is set in Convex environment
   - Use existing Resend domain: `newsletters@2s6y.com`

4. **Testing** (TDD - write tests first):
   - Create `convex/newsletters/sendEmail.test.ts`
   - 6 unit tests (Vitest):
     - Query newsletter correctly
     - Filter active members only
     - Exclude excluded members
     - Render email template with correct props
     - Track resendId in newsletter record
     - Error handling: Retry on failure (mock Resend API)

5. **Quality Gates** (auto-invoked after completion):
   - Code Reviewer: TypeScript, ESLint, Prettier
   - Security Specialist: Secrets (RESEND_API_KEY not exposed), CVEs

**Linear Updates**:
- Start: Update issue 2S6-29 to "In Progress"
- Complete: Update to "Done" + add comment with test results

**Reference Documentation**:
- Resend Docs: https://resend.com/docs/send-with-nodejs
- React Email rendering: https://react.email/docs/integrations/resend
- Convex cron: https://docs.convex.dev/scheduling/cron-jobs
```

---

## STORY-I1: Integration Tests (4h)

**Linear Issue**: https://linear.app/2s6y/issue/2S6-30
**Agent**: Orchestrator
**Dependencies**: ⚠️ **BLOCKED BY** B1, B2, B3, B4 (wait until all backend complete)
**Branch**: `feature/newsletter-generation`

### Kick-Off Command:

```
Implement STORY-I1: Integration Tests

**Linear Issue**: https://linear.app/2s6y/issue/2S6-30
**Estimate**: 4 hours
**Status**: Update to "In Progress" when you start

⚠️ **IMPORTANT**: This story is BLOCKED by all backend stories. Only start after:
- STORY-B1 (Newsletter Generation) is complete
- STORY-B2 (Email Template) is complete
- STORY-B3 (Web Content) is complete
- STORY-B4 (Resend Integration) is complete

**Deliverables**:

1. **File**: `tests/e2e/newsletter-generation.spec.ts`
   - 4 E2E tests (Playwright):

   **Test 1: Manual Newsletter Generation**
   - Navigate to Convex dashboard (local dev)
   - Manually trigger `generateNewsletters` action
   - Verify: Newsletter created in `newsletters` table
   - Verify: Contribution data included correctly
   - Verify: Excluded members list correct

   **Test 2: Email Delivery**
   - Trigger `sendNewsletterEmail` action with test newsletter
   - Check Resend dashboard (or use test mode)
   - Verify: Email sent successfully (resendId stored)
   - Verify: `sentAt` timestamp updated in newsletter record

   **Test 3: Email Template Rendering**
   - Visual test: Render email template with sample data
   - Take screenshot of email preview
   - Verify: All member cards appear
   - Verify: Images are thumbnails (not full-size)
   - Verify: "View Web Version" link present

   **Test 4: Web Content Display**
   - Navigate to `/groups/[groupId]/issues/[month]`
   - Verify: Newsletter content displays correctly
   - Verify: Video embeds work (if applicable)
   - Verify: Responsive on mobile/tablet (3 breakpoints)
   - Verify: No console errors

2. **Test Data Setup**:
   - Create test group with 3 members
   - Create 3 prompts for the group
   - Create submitted contributions for 2 members (1 excluded)
   - Use test factory pattern (see `tests/factories/`)

3. **Playwright MCP Usage**:
   - Use `mcp__playwright__browser_navigate` for navigation
   - Use `mcp__playwright__browser_snapshot` for accessibility
   - Use `mcp__playwright__browser_take_screenshot` for visual tests
   - Use `mcp__playwright__browser_resize` for responsive tests

4. **Quality Gates** (auto-invoked after completion):
   - Code Reviewer: TypeScript, ESLint, Prettier
   - All E2E tests passing (4/4)

**Linear Updates**:
- Start: Update issue 2S6-30 to "In Progress"
- Complete: Update to "Done" + add comment with test results

**Reference Documentation**:
- Playwright MCP: `.claude/guides/PLAYWRIGHT-MCP-QUICK-START.md`
- Test factories: `tests/factories/README.md`
- Convex testing: https://docs.convex.dev/production/testing
```

---

## 🚀 Execution Checklist

### Pre-Execution
- [ ] Ensure branch `feature/newsletter-generation` is checked out
- [ ] Update all Linear issues from "Duplicate" → "Todo"
- [ ] Confirm Resend API key is set in Convex environment

### Phase 1: Parallel Execution (4h wall clock)
- [ ] Open 3 separate Claude sessions
- [ ] Session 1: Copy STORY-B1 kick-off command → Execute
- [ ] Session 2: Copy STORY-B2 kick-off command → Execute
- [ ] Session 3: Copy STORY-B3 kick-off command → Execute
- [ ] Wait for all 3 to complete

### Phase 2: Sequential Execution (3h)
- [ ] Verify B1, B2, B3 all marked "Done" in Linear
- [ ] Open new Claude session
- [ ] Copy STORY-B4 kick-off command → Execute
- [ ] Wait for completion

### Phase 3: Integration Tests (4h)
- [ ] Verify B1, B2, B3, B4 all marked "Done" in Linear
- [ ] Open new Claude session
- [ ] Copy STORY-I1 kick-off command → Execute
- [ ] Wait for completion

### Post-Execution
- [ ] Run quality gates (auto-invoked)
- [ ] Deploy to staging (Deployment Agent auto-invoked)
- [ ] Manual testing checklist (see TODO.md)
- [ ] Create PR via GitHub MCP
- [ ] Merge to main

---

**Total Estimated Time**: ~11 hours (vs 16h sequential = 31% faster)

**Last Updated**: 2025-10-18
