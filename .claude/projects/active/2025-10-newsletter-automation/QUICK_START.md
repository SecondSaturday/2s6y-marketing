# Newsletter Automation (MVP) - Quick Start Guide

**Project**: Newsletter Automation (MVP)
**Linear Project**: https://linear.app/2s6y/project/newsletter-automation-mvp-fc0a5c6fe353
**Total Time**: 8 hours (6 hours parallel + 2 hours sequential)

---

## Overview

This project implements automated newsletter generation that runs every 2nd Saturday at 9 AM UTC. It generates HTML emails, sends them via Resend, and stores rich web content.

**Why This Matters**: Without this automation, newsletters must be generated and sent manually - this is the core MVP blocker.

---

## Execution Strategy

### Option 1: Parallel Execution (Recommended)

Run 2 stories in parallel terminals, then run integration test:

```bash
# Terminal 1: STORY-B1 (Cron Job Setup)
cd /Users/kalyanchandana/Documents/GitHub/2Sat-lite
claude-code

# When Claude asks what to work on:
"Implement STORY-B1 from .claude/projects/active/2025-10-newsletter-automation/STORY-B1-cron-job.md
Use backend-dev agent. Create cron job that triggers newsletter generation on 2nd Saturday at 9 AM UTC."

# Terminal 2: STORY-B2 (Email Sending) - START SIMULTANEOUSLY
cd /Users/kalyanchandana/Documents/GitHub/2Sat-lite
claude-code

# When Claude asks what to work on:
"Implement STORY-B2 from .claude/projects/active/2025-10-newsletter-automation/STORY-B2-email-sending.md
Use backend-dev agent. Replace email sending stub with real Resend API batch delivery."

# Terminal 3: STORY-I1 (E2E Testing) - AFTER B1 + B2 COMPLETE
cd /Users/kalyanchandana/Documents/GitHub/2Sat-lite
claude-code

# When Claude asks what to work on:
"Implement STORY-I1 from .claude/projects/active/2025-10-newsletter-automation/STORY-I1-e2e-testing.md
Use orchestrator agent. Create E2E tests for newsletter automation workflow."
```

### Option 2: Sequential Execution

If you prefer to run stories one at a time:

```bash
# 1. STORY-B1 (3 hours)
"Implement STORY-B1: Cron Job Setup"

# 2. STORY-B2 (3 hours)
"Implement STORY-B2: Email Sending"

# 3. STORY-I1 (2 hours)
"Implement STORY-I1: E2E Testing"
```

---

## Prerequisites

Before starting, ensure:

1. **Resend API Key Configured**:
   ```bash
   # Check Convex dashboard: Settings > Environment Variables
   # Ensure RESEND_API_KEY is set
   ```

2. **Newsletter Generation Logic Exists** (✅ Already implemented):
   - `convex/newsletters/generate.ts`
   - `emails/NewsletterEmail.tsx`

3. **Test Group Available**:
   ```bash
   # Create test group with 3 members and contributions for testing
   ```

---

## Story Details

### STORY-B1: Cron Job Setup (3 hours)

**What**: Create cron job that triggers newsletter generation on 2nd Saturday at 9 AM UTC

**Files to Create**:
- `convex/cron.ts`
- `convex/newsletters/orchestrator.ts`
- `convex/newsletters/orchestrator.test.ts`

**Key Commands**:
```bash
touch convex/cron.ts convex/newsletters/orchestrator.ts
npx convex dev
# Verify in dashboard: Cron Jobs tab
```

**Success**: Cron job visible in Convex dashboard, manual test successful

---

### STORY-B2: Email Sending (3 hours)

**What**: Replace stub email sending with real Resend API batch delivery

**Files to Modify**:
- `convex/newsletters/sendEmail.ts` (remove stub)
- `convex/newsletters/orchestrator.ts` (add email sending step)

**Files to Create**:
- `convex/newsletters/sendEmail.test.ts`

**Key Commands**:
```bash
npm run test convex/newsletters/sendEmail.test.ts
npx convex dev
# Test in dashboard: internal.newsletters.sendEmail.sendNewsletterEmail
```

**Success**: Real emails sent via Resend, unit tests passing (12/12)

---

### STORY-I1: E2E Testing (2 hours)

**What**: Verify complete workflow end-to-end

**Files to Create**:
- `tests/e2e/newsletter-automation.spec.ts`
- `tests/helpers/newsletter-test-helpers.ts`

**Key Commands**:
```bash
npx playwright test newsletter-automation
# Manual test in Convex dashboard
# Check Resend logs
```

**Success**: All E2E tests passing (5/5), real emails delivered

---

## Verification Checklist

After completing all stories:

### Backend Verification
- [ ] Cron job exists in Convex dashboard
- [ ] Schedule shows "second saturday at 9:00 AM UTC"
- [ ] Manual orchestrator test successful
- [ ] Stub code removed from sendEmail.ts
- [ ] All unit tests passing (18 total: 6 + 12)

### Integration Verification
- [ ] E2E tests passing (5/5)
- [ ] Newsletter records created in database
- [ ] Newsletter.sentAt timestamp updated
- [ ] Newsletter.resendId stored (not "stub_...")
- [ ] Exclusion logic working (excludedMemberIds populated)

### Email Delivery Verification
- [ ] Real emails received in test inbox
- [ ] Batch sending works (>100 recipients)
- [ ] Resend logs show successful delivery
- [ ] HTML email renders correctly
- [ ] Subject line correct: "[Group Name] - [Month] Newsletter"

---

## Troubleshooting

### Issue: Cron job not appearing in dashboard
**Solution**: Run `npx convex deploy` (not just `npx convex dev`)

### Issue: Emails not sending
**Check**:
1. RESEND_API_KEY configured in Convex
2. RESEND_FROM_EMAIL set (or uses default)
3. Newsletter.resendId not starting with "stub_"

### Issue: All members excluded
**Check**:
1. Members have submitted contributions (status = "submitted")
2. Contributions are for current month
3. Members are active (not removed/blocked)

### Issue: Batch sending fails
**Check**:
1. Recipients array is valid (all have email + name)
2. Resend API key has sufficient quota
3. No more than 100 recipients per API call

---

## Success Metrics

**Project Complete When**:
- ✅ Cron job runs automatically on schedule
- ✅ Newsletters generated for all groups
- ✅ Emails sent via Resend
- ✅ All tests passing (23 total: 18 unit + 5 E2E)
- ✅ No errors in Convex logs
- ✅ Real users receive emails

**Next Steps After Completion**:
1. Monitor first real 2nd Saturday send
2. Check Resend delivery rates
3. Verify exclusion logic with real data
4. Set up alerts for cron failures

---

## Resources

**Convex Documentation**:
- [Cron Jobs](https://docs.convex.dev/scheduling/cron-jobs)
- [Actions](https://docs.convex.dev/functions/actions)

**Resend Documentation**:
- [Batch Emails API](https://resend.com/docs/api-reference/emails/send-batch-emails)
- [Error Handling](https://resend.com/docs/api-reference/errors)

**Linear Project**:
- [Newsletter Automation (MVP)](https://linear.app/2s6y/project/newsletter-automation-mvp-fc0a5c6fe353)

---

**Last Updated**: 2025-10-22
**Estimated Total Time**: 8 hours
**Parallelizable**: Yes (B1 + B2 can run simultaneously)
