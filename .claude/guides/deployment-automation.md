# Deployment Automation Workflow Guide

**Version**: 1.0.0 (Framework v1.6.0)
**Last Updated**: 2025-10-18

## Overview

This guide explains the automated deployment workflow powered by the **Deployment Agent** (Sonnet, Orange). The Deployment Agent handles the complete deployment lifecycle: staging previews, smoke tests, production deployments, and automated rollbacks.

## Deployment Workflow

### Automatic Staging Deployment

**Trigger**: After all quality gates pass (Code Review + UX Review + Security Scan)

```
Orchestrator: "All quality gates passed ✅"

Orchestrator: [Auto-invokes Deployment Agent for staging]

Deployment Agent:
  Step 1: Deploy Convex backend → preview
  Step 2: Deploy Vercel frontend → preview
  Step 3: Run smoke tests (5 critical flows)
  Step 4: Report preview URL

User: [Tests manually at preview URL]

User: "Looks good, deploy to production"

Orchestrator: [Invokes Deployment Agent for production]
```

### 3-Phase Deployment Strategy

**Phase 1: Backend (Convex)**
```bash
npx convex deploy --prod
```

**Phase 2: Frontend (Vercel)**
```bash
vercel deploy --prod
```

**Phase 3: Smoke Tests**
```bash
npm run test:smoke
```

## Staging Deployment

**Steps**:
1. Deploy Convex to preview
2. Deploy Vercel to preview
3. Run smoke tests
4. Report preview URL

**Example Output**:
```
✅ Staging Deployment Complete

**Preview URLs**:
- Frontend: https://2s6y-abc123.vercel.app
- Backend: https://preview-xyz.convex.cloud

**Smoke Tests**: 5/5 passed ✅
- Homepage loads (1.2s)
- Sign-up flow works
- Dashboard loads
- Create group succeeds
- Contribution form loads

**Next Steps**: Test manually at preview URL
```

## Production Deployment

**Pre-Deployment Checks**:
- ✅ On main/staging branch
- ✅ All tests passing
- ✅ Code review passed
- ✅ Security scan passed
- ✅ User approval received

**Steps**:
1. Backup current state (git tag + Convex export)
2. Deploy Convex to production
3. Deploy Vercel to production
4. Run smoke tests
5. Auto-rollback if smoke tests fail

**Example Output**:
```
✅ Production Deployment Complete

**Production URLs**:
- Frontend: https://2s6y.vercel.app
- Backend: https://production.convex.cloud

**Deployment Time**: 4m 48s

**Smoke Tests**: 5/5 passed ✅

**Performance**:
- LCP: 1.8s (target: <2.5s) ✅
- FID: 45ms (target: <100ms) ✅
- CLS: 0.05 (target: <0.1) ✅

**Backup Created**:
- Git tag: production-backup-20251018-144522
- Convex export: backups/convex-20251018-144522.zip
```

## Automated Rollback

**Triggers**:
- Smoke tests fail on production
- Error rate >10 errors/min

**Rollback Steps**:
1. Detect failure
2. Rollback Vercel to previous deployment
3. Rollback Convex (if no schema migrations)
4. Re-run smoke tests
5. Create incident issue in Linear
6. Alert user

**Example Output**:
```
🚨 ROLLBACK EXECUTED

**Reason**: Smoke tests failed (2/5 passed)

**Actions Taken**:
- ✅ Vercel reverted to previous deployment
- ⚠️ Convex rollback requires manual intervention (schema migration)

**Current Status**:
- Frontend: Reverted to stable
- Backend: Manual rollback needed

**Failed Tests**:
- ❌ Create group (timeout)
- ❌ Dashboard page (500 error)

**Incident**: https://linear.app/issue/INC-001 (created)
```

## Smoke Tests

**5 Critical Flows**:
1. Homepage loads (<2s)
2. Sign-up flow (Clerk auth works)
3. Dashboard loads (authenticated user)
4. Create group (mutation + query working)
5. Contribution form (prompts load)

**Pass Criteria**: All 5 tests pass, 0 console errors, <3s page load

## Environment Management

**Required Secrets**:
- `NEXT_PUBLIC_CONVEX_URL` (public)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (public)
- `CLERK_SECRET_KEY` (secret)
- `RESEND_API_KEY` (secret)

**Verification**:
```bash
vercel env ls
# Check all required vars exist
```

**Security**:
- ✅ Staging uses test mode keys (sk_test_*)
- ✅ Production uses live keys (sk_live_*)
- ❌ Never copy production secrets to staging

## Best Practices

1. **Always deploy to staging first**
2. **Test manually at preview URL**
3. **Wait for user approval before production**
4. **Create backup before production deployment**
5. **Monitor logs for 5 minutes after deployment**

## Related Documentation

- `.claude/agents/deployment-agent.md` - Deployment Agent specification
- `.claude/agents/orchestrator.md` - Auto-invocation workflow
- `.claude/core/Framework.md` - 3-phase deployment strategy (v1.5.0)

---

**Version History**:
- v1.0.0 (2025-10-18): Initial deployment automation guide
