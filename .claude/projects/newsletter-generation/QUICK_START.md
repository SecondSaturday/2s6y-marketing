# Newsletter Generation - Quick Start Commands

> **Copy-paste these commands into separate Claude sessions**

---

## 🚀 Phase 1: Parallel (Start all 3 simultaneously)

### Session 1: STORY-B1 (4h)
```
Implement STORY-B1: Newsletter Generation Action

Linear Issue: https://linear.app/2s6y/issue/2S6-26
Estimate: 4 hours

Create convex/newsletters/generate.ts with generateNewsletters() action.
Query all groups, gather submitted contributions, generate HTML + web content,
identify excluded members, store newsletter record.

Write 8 unit tests first (TDD). Update Linear issue to "In Progress" when starting,
"Done" when complete.

See full details: .claude/projects/newsletter-generation/KICKOFF_COMMANDS.md#story-b1
```

### Session 2: STORY-B2 (3h)
```
Implement STORY-B2: Email Template Generation

Linear Issue: https://linear.app/2s6y/issue/2S6-27
Estimate: 3 hours

Create emails/NewsletterEmail.tsx (React Email component).
Hinge-style card layout, lightweight image thumbnails, "View Web Version" footer.
Use DaisyUI cupcake theme colors (inline styles).

Write visual test. Update Linear issue to "In Progress" when starting,
"Done" when complete.

See full details: .claude/projects/newsletter-generation/KICKOFF_COMMANDS.md#story-b2
```

### Session 3: STORY-B3 (2h)
```
Implement STORY-B3: Web Content Generation

Linear Issue: https://linear.app/2s6y/issue/2S6-28
Estimate: 2 hours

Create convex/newsletters/webContent.ts with generateWebContent() helper.
Transform contributions into rich JSON structure. Support YouTube/Spotify embeds,
interactive elements (likes/comments placeholders).

Write 5 unit tests first (TDD). Update Linear issue to "In Progress" when starting,
"Done" when complete.

See full details: .claude/projects/newsletter-generation/KICKOFF_COMMANDS.md#story-b3
```

---

## ⏸️ Wait for Phase 1 to complete (all 3 stories "Done")

---

## 🔄 Phase 2: Sequential (Start after Phase 1)

### Session 4: STORY-B4 (3h)
```
Implement STORY-B4: Resend Integration

Linear Issue: https://linear.app/2s6y/issue/2S6-29
Estimate: 3 hours
BLOCKED BY: B1, B2, B3 (wait until all complete)

Create convex/newsletters/sendEmail.ts with sendNewsletterEmail() action.
Batch send via Resend API, track resendId, error handling + retry logic.
Update convex/cron.ts for 2nd Saturday 12 PM UTC.

Write 6 unit tests first (TDD). Update Linear issue to "In Progress" when starting,
"Done" when complete.

See full details: .claude/projects/newsletter-generation/KICKOFF_COMMANDS.md#story-b4
```

---

## ⏸️ Wait for Phase 2 to complete (B4 "Done")

---

## ✅ Phase 3: Integration Tests (Start after all backend)

### Session 5: STORY-I1 (4h)
```
Implement STORY-I1: Integration Tests

Linear Issue: https://linear.app/2s6y/issue/2S6-30
Estimate: 4 hours
BLOCKED BY: B1, B2, B3, B4 (wait until all complete)

Create tests/e2e/newsletter-generation.spec.ts with 4 E2E tests:
1. Manual newsletter generation
2. Email delivery verification
3. Email template rendering (visual)
4. Web content display (responsive)

Use Playwright MCP for testing. Update Linear issue to "In Progress" when starting,
"Done" when complete.

See full details: .claude/projects/newsletter-generation/KICKOFF_COMMANDS.md#story-i1
```

---

## 📊 Progress Tracking

**Check Linear for real-time progress**:
https://linear.app/2s6y/project/newsletter-generation-system

**Expected Timeline**:
- Phase 1: 4 hours (parallel)
- Phase 2: 3 hours (sequential)
- Phase 3: 4 hours (sequential)
- **Total**: ~11 hours (vs 16h sequential = 31% faster)

---

## 📝 Pre-Flight Checklist

Before starting Phase 1:
- [ ] Branch `feature/newsletter-generation` checked out
- [ ] All Linear issues status = "Todo" (not "Duplicate")
- [ ] Resend API key set in Convex environment
- [ ] 3 Claude sessions ready for parallel execution

---

**For detailed specifications**: See `KICKOFF_COMMANDS.md`
