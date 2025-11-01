# STORY-I1: E2E Newsletter Automation Testing

**Linear Issue**: [2S6-50](https://linear.app/2s6y/issue/2S6-50)
**Agent**: Orchestrator Agent
**Estimate**: 2 hours
**Type**: Integration (BLOCKED by B1 + B2)
**Priority**: P0 (Blocker)

---

## Objective

Verify the complete newsletter automation workflow end-to-end: cron trigger → generation → email delivery.

---

## ⚠️ BLOCKED UNTIL

* **STORY-B1 complete**: Cron job must exist
* **STORY-B2 complete**: Real email sending must work

---

## Acceptance Criteria

* E2E test suite created (5 tests)
* All tests passing (5/5)
* Cron trigger verified (manual + automated)
* Newsletter generation verified (HTML + web content)
* Email delivery verified (Resend API)
* Exclusion logic verified (members without contributions excluded)
* Error scenarios tested (no contributions, API failures)

---

## Test Suite

**File**: `tests/e2e/newsletter-automation.spec.ts`

### E2E-1: Full Workflow
Trigger orchestrator → verify newsletter created → verify emails sent

### E2E-2: No Contributions
Skip groups with no contributions

### E2E-3: All Members Excluded
Handle gracefully when no contributors

### E2E-4: Batch Email Sending
Test >100 recipients (150 members)

### E2E-5: Cron Schedule Verification
Verify cron exists in Convex dashboard

---

## Manual Testing Checklist

### Manual Test 1: Trigger Orchestrator
```bash
# In Convex dashboard:
internal.newsletters.orchestrator.runNewsletterGeneration({})

# Expected:
# ✓ Console logs show "Starting..."
# ✓ Newsletters created
# ✓ Emails sent (check Resend)
# ✓ No errors
```

### Manual Test 2: Verify Cron Schedule
Check Convex dashboard Cron Jobs tab:
- ✓ "generateMonthlyNewsletters" visible
- ✓ Schedule: "second saturday at 9:00 AM UTC"
- ✓ Next run: [Next 2nd Saturday date]
- ✓ Status: Active

### Manual Test 3: Check Resend Delivery
In Resend dashboard:
- ✓ Batch email logged
- ✓ Recipients match newsletter.recipientEmails
- ✓ Subject correct
- ✓ HTML renders correctly
- ✓ No bounce/spam errors

### Manual Test 4: Exclusion Logic
- Create group with 3 members
- Only 2 members submit contributions
- Trigger orchestrator
- Verify:
  - ✓ Newsletter.excludedMemberIds contains 3rd member
  - ✓ Only 2 emails sent
  - ✓ Excluded member does NOT receive email

---

## Error Scenarios

### Scenario 1: Resend API Failure
Mock 500 error → orchestrator logs error but returns success=false

### Scenario 2: No Active Members
All members removed → orchestrator skips email sending, logs warning

### Scenario 3: Missing Environment Variable
Remove RESEND_API_KEY → clear error "Email service not configured"

---

## Files to Create

**NEW**:
* `tests/e2e/newsletter-automation.spec.ts`
* `tests/helpers/newsletter-test-helpers.ts`

---

## Quick Commands

```bash
# 1. Create E2E test suite
mkdir -p tests/e2e tests/helpers
touch tests/e2e/newsletter-automation.spec.ts
touch tests/helpers/newsletter-test-helpers.ts

# 2. Run E2E tests
npx playwright test newsletter-automation

# 3. Manual orchestrator test (Convex dashboard)
# Run: internal.newsletters.orchestrator.runNewsletterGeneration({})

# 4. Check Resend logs
open https://resend.com/logs
```

---

## Success Checklist

- [ ] E2E test suite created (5 tests)
- [ ] All E2E tests passing (5/5)
- [ ] Manual orchestrator test successful
- [ ] Cron job verified in dashboard
- [ ] Real emails delivered (checked in Resend)
- [ ] Exclusion logic working
- [ ] Batch sending tested (>100 recipients)
- [ ] Error scenarios tested
- [ ] No console errors

---

**Estimated Time**: 2 hours
**Blocked By**: STORY-B1, STORY-B2
**Blocks**: None (final story)
