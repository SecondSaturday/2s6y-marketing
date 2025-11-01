# STORY-B2: Real Email Sending - Replace Resend Stub

**Linear Issue**: [2S6-49](https://linear.app/2s6y/issue/2S6-49)
**Agent**: Backend Agent
**Estimate**: 3 hours
**Type**: Backend (Parallelizable with B1)
**Priority**: P0 (Blocker)

---

## Objective

Replace stub email sending in `convex/newsletters/sendEmail.ts` with real Resend API batch delivery.

---

## Acceptance Criteria

* Stub code removed from `convex/newsletters/sendEmail.ts`
* Real Resend API integration implemented
* Batch sending supported (max 100 recipients per API call)
* Newsletter.sentAt timestamp updated after successful send
* Newsletter.resendId stored (for tracking/debugging)
* Error handling: Failed emails logged but don't crash workflow
* Active members only (exclude removed/blocked members)
* Unit tests passing (12/12)

---

## Current Problem

**File**: `convex/newsletters/sendEmail.ts` (lines 46-48)

```typescript
// TODO: Implement actual Resend email sending
// For now, just mark as sent
const stubResendId = `stub_${Date.now()}`;
```

No actual emails sent - just marks newsletter as sent.

---

## Implementation Steps

### 1. Update sendNewsletterEmail Action

Replace lines 22-59 with real Resend integration (see Linear issue for full code).

### 2. Add Batch Email Helper

Handle Resend's 100 recipient per call limit:

```typescript
async function sendBatchNewsletterEmail(args: {
  recipients: Array<{ email: string; name: string }>;
  subject: string;
  htmlContent: string;
  newsletterId: string;
}): Promise<{ batchId: string }>
```

### 3. Update Orchestrator

In `convex/newsletters/orchestrator.ts`, add email sending step after generation.

---

## Testing Requirements

**Unit Tests**: 12 tests in `convex/newsletters/sendEmail.test.ts`

1. Happy path: Sends emails to all active members
2. Empty recipients: Returns success with 0 emails sent
3. Batch splitting: Splits >100 recipients
4. Resend API success: Stores resendId correctly
5. Newsletter update: Updates sentAt timestamp
6. Active members only: Excludes removed/blocked
7. Error handling: Logs errors but doesn't throw
8. Missing newsletter: Throws ConvexError
9. Missing group: Throws ConvexError
10. Resend API failure: Returns success=false
11. No API key: Throws configuration error
12. Subject line: Uses correct group name and month

---

## Environment Variables

Required in Convex dashboard:
* `RESEND_API_KEY`
* `RESEND_FROM_EMAIL` (optional)

---

## Files to Modify

**MODIFY**:
* `convex/newsletters/sendEmail.ts`
* `convex/newsletters/orchestrator.ts`

**CREATE**:
* `convex/newsletters/sendEmail.test.ts`

---

## Quick Commands

```bash
# 1. Update sendEmail.ts with implementation

# 2. Create unit tests
touch convex/newsletters/sendEmail.test.ts

# 3. Run tests
npm run test convex/newsletters/sendEmail.test.ts

# 4. Deploy to Convex
npx convex dev

# 5. Test manually
# In dashboard: internal.newsletters.sendEmail.sendNewsletterEmail({ newsletterId: "..." })
```

---

## Success Checklist

- [ ] Stub code removed
- [ ] Batch email helper implemented
- [ ] Resend API integration working
- [ ] Batch splitting tested (>100 recipients)
- [ ] Active members filter working
- [ ] Newsletter.sentAt updated correctly
- [ ] Newsletter.resendId stored
- [ ] Error handling tested
- [ ] Unit tests passing (12/12)
- [ ] Manual test successful (real email received)
- [ ] RESEND_API_KEY configured

---

**Estimated Time**: 3 hours
**Blocked By**: None
**Blocks**: STORY-I1
