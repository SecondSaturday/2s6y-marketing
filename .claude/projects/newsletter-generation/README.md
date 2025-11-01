# Newsletter Generation System - UEDS Project

> **Status**: Setup Complete - Ready for Execution
> **Priority**: P0 (Blocker)
> **Timeline**: ~11 hours (UEDS parallel execution)
> **Branch**: `feature/newsletter-generation`

---

## 📋 Project Overview

Build a newsletter generation system that runs every 2nd Saturday at 12 PM UTC, generates HTML email + rich web content, and sends via Resend.

**Linear Project**: https://linear.app/2s6y/project/newsletter-generation-system

---

## 🎯 Stories

### Phase 1: Parallelizable (4h wall clock)
- **[2S6-26] STORY-B1**: Newsletter Generation Action (4h)
- **[2S6-27] STORY-B2**: Email Template Generation (3h)
- **[2S6-28] STORY-B3**: Web Content Generation (2h)

### Phase 2: Sequential (3h)
- **[2S6-29] STORY-B4**: Resend Integration (3h) - Blocked by B1, B2, B3

### Phase 3: Integration (4h)
- **[2S6-30] STORY-I1**: Integration Tests (4h) - Blocked by all backend

---

## 📊 Dependency Graph

```
Phase 1 (Parallel - 4h):
┌─────────────────────────────────────┐
│  B1 (4h)  │  B2 (3h)  │  B3 (2h)   │
│  Backend  │  Email    │  Web       │
└─────────────────────────────────────┘
              ↓
Phase 2 (Sequential - 3h):
        ┌──────────┐
        │  B4 (3h) │
        │  Resend  │
        └──────────┘
              ↓
Phase 3 (Sequential - 4h):
        ┌──────────┐
        │  I1 (4h) │
        │  E2E     │
        └──────────┘
```

**Total**: ~11h (vs 16h sequential = 31% faster ⚡)

---

## 🚀 Quick Start

### Option 1: Copy-Paste Commands (Recommended)
See **[QUICK_START.md](./QUICK_START.md)** for ready-to-use commands

### Option 2: Detailed Specifications
See **[KICKOFF_COMMANDS.md](./KICKOFF_COMMANDS.md)** for full specs

---

## 📂 Project Files

```
.claude/projects/newsletter-generation/
├── README.md                    # This file (project overview)
├── QUICK_START.md              # Copy-paste kick-off commands
├── KICKOFF_COMMANDS.md         # Detailed specifications
├── CONTRACTS.md                # Backend/Frontend contracts (legacy)
├── STORY_TRACKER.md            # [DEPRECATED] Use Linear instead
└── stories/                    # Legacy story files (NL1-NL8)
```

**Note**: This project uses **Linear MCP** for tracking instead of markdown files.

---

## 🔄 Execution Workflow

### 1. Pre-Flight Setup
- [ ] Checkout branch: `git checkout feature/newsletter-generation`
- [ ] Update Linear issues: "Duplicate" → "Todo"
- [ ] Verify Resend API key in Convex environment
- [ ] Open 3 Claude sessions for Phase 1

### 2. Phase 1: Parallel Execution
- **Session 1**: Copy STORY-B1 command → Execute
- **Session 2**: Copy STORY-B2 command → Execute
- **Session 3**: Copy STORY-B3 command → Execute
- **Wait**: All 3 stories marked "Done" in Linear

### 3. Phase 2: Sequential Execution
- **Session 4**: Copy STORY-B4 command → Execute
- **Wait**: B4 marked "Done" in Linear

### 4. Phase 3: Integration Tests
- **Session 5**: Copy STORY-I1 command → Execute
- **Wait**: I1 marked "Done" in Linear

### 5. Quality Gates (Auto-Invoked)
- Code Reviewer: TypeScript, ESLint, Prettier ✅
- Security Specialist: Secrets, CVEs, OWASP ✅
- UX Reviewer: Accessibility, responsive ✅

### 6. Deployment (Auto-Invoked)
- Staging deployment: Automatic after quality gates pass
- Production deployment: Manual approval required

---

## 📝 Deliverables

### Backend Files
- `convex/newsletters/generate.ts` - Newsletter generation action
- `convex/newsletters/sendEmail.ts` - Email sending via Resend
- `convex/newsletters/webContent.ts` - Web content transformation
- `convex/cron.ts` - Updated cron job

### Frontend Files
- `emails/NewsletterEmail.tsx` - React Email template

### Test Files
- `convex/newsletters.test.ts` - Newsletter generation tests (8 tests)
- `convex/newsletters/sendEmail.test.ts` - Email sending tests (6 tests)
- `convex/newsletters/webContent.test.ts` - Web content tests (5 tests)
- `emails/NewsletterEmail.test.tsx` - Email template visual test
- `tests/e2e/newsletter-generation.spec.ts` - E2E tests (4 tests)

**Total Tests**: 24 (19 unit + 1 visual + 4 E2E)

---

## 🎯 Success Criteria

### Functional
- [ ] Newsletter generation action works correctly
- [ ] Email template renders with all member contributions
- [ ] Web content supports video embeds (YouTube, Spotify)
- [ ] Excluded members not included in emails
- [ ] Emails sent successfully via Resend
- [ ] Cron job triggers on 2nd Saturday at 12 PM UTC

### Quality
- [ ] All 24 tests passing
- [ ] TypeScript: 0 errors
- [ ] ESLint: 0 errors
- [ ] No exposed secrets (Resend API key)
- [ ] Accessibility: 0 violations (email template)

### Performance
- [ ] Email generation < 5s per group
- [ ] Batch email sending < 10s per 50 members
- [ ] Web content loads < 2s

---

## 🔗 Related Documentation

**Framework**:
- UEDS Methodology: `.claude/core/UEDS.md`
- Backend Agent Protocol: `.claude/core/agents/backend.md`
- Orchestrator Protocol: `.claude/core/agents/orchestrator.md`

**Project Context**:
- MVP Scope: `.claude/poc-context.md`
- Development Guide: `.claude/development-guide.md`
- Testing Guide: `.claude/guides/testing.md`

**External**:
- Convex Actions: https://docs.convex.dev/functions/actions
- React Email: https://react.email/docs/introduction
- Resend API: https://resend.com/docs/send-with-nodejs

---

## 📞 Support

**Issues**: Track in Linear - https://linear.app/2s6y/project/newsletter-generation-system

**Questions**: Reference this README or framework docs in `.claude/`

---

**Created**: 2025-10-18
**Status**: Ready for Execution
**Estimated Completion**: ~11 hours (UEDS parallel)
