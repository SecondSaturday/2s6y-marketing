# Code Review Workflow Guide

**Version**: 1.0.0 (Framework v1.6.0)
**Last Updated**: 2025-10-18

## Overview

This guide explains the automated code review workflow powered by the **Code Reviewer Agent** (Opus, Red). The Code Reviewer acts as an automated quality gate that runs after implementation and before deployment, ensuring code quality, security, and framework compliance.

## When Code Review Runs

**Automatic Triggers** (no user action needed):
1. After Backend Agent + Frontend Agent both complete
2. After all unit tests pass (Vitest + Playwright)
3. After integration E2E tests pass
4. Before deployment to staging

**Manual Triggers** (user requested):
- User says "run code review"
- User says "check code quality"
- User wants to verify specific files

## Code Review Phases

The Code Reviewer runs **5 automated phases** in order:

### Phase 1: Git Status Check (MANDATORY)

**Purpose**: Ensure clean working tree before review

**Checks**:
- ✅ No uncommitted changes (except in `.claude/` framework docs)
- ✅ Working on correct branch (feature branch, not main)
- ✅ All files added to git (no untracked production files)

**Example Output**:
```
Phase 1: Git Status Check ✅
- Uncommitted changes: 0
- Untracked files: 0 (excluding .claude/)
- Current branch: feature/likes-system (✅ feature branch)
```

**Failures**:
- ❌ "Uncommitted changes found - commit or stash before review"
- ❌ "Working on main branch - create feature branch first"

---

### Phase 2: Static Analysis (MANDATORY)

**Purpose**: Catch code quality and type safety issues

**Tools Used**:
1. **TypeScript Compiler** (`npx tsc --noEmit`)
   - Type errors
   - Interface mismatches
   - Import errors

2. **ESLint** (`npx eslint . --max-warnings=0`)
   - Code style violations
   - Unused variables
   - Unsafe patterns (e.g., `any` types)

3. **Prettier** (`npx prettier --check .`)
   - Formatting inconsistencies
   - Indentation errors
   - Quote style violations

4. **Semgrep SAST** (`semgrep scan --config auto` via MCP)
   - Security vulnerabilities (OWASP Top 10)
   - Injection patterns (SQL, XSS, CSRF)
   - Authentication bypasses
   - Cryptographic failures

**Example Output**:
```
Phase 2: Static Analysis ✅
- TypeScript: 0 errors
- ESLint: 0 warnings
- Prettier: All files formatted correctly
- Semgrep: 12 rules passed, 0 vulnerabilities
```

**Blocking Failures**:
- ❌ TypeScript errors → **BLOCKS DEPLOYMENT**
- ❌ ESLint warnings >0 → **BLOCKS DEPLOYMENT**
- ❌ Prettier formatting issues → **BLOCKS DEPLOYMENT**
- ❌ Semgrep CRITICAL vulnerabilities → **BLOCKS DEPLOYMENT**

**Non-Blocking** (warnings only):
- ⚠️ Semgrep MEDIUM vulnerabilities → FIX SOON
- ⚠️ Complex functions (cyclomatic complexity >15) → REFACTOR POST-MVP

---

### Phase 3: Framework Compliance (MANDATORY)

**Purpose**: Enforce 2s6y framework patterns

**Checks**:

#### 3.1 Convex Backend Patterns
- ✅ All mutations have input validators (`v.object({ ... })`)
- ✅ All mutations check auth (`ctx.auth.getUserIdentity()`)
- ✅ Errors thrown as `ConvexError` (not generic Error)
- ✅ Database queries use proper indexes
- ✅ Rate limiting on sensitive operations

**Example**:
```typescript
// ✅ CORRECT Pattern
export const createGroup = mutation({
  args: {
    name: v.string(),  // ✅ Input validator
    description: v.string()
  },
  handler: async (ctx, args) => {
    // ✅ Auth check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized");  // ✅ ConvexError
    }

    // ✅ Validation
    if (args.name.length < 3) {
      throw new ConvexError("Name must be at least 3 characters");
    }

    // Business logic...
  }
});

// ❌ WRONG Pattern (caught by Code Reviewer)
export const createGroup = mutation({
  // ❌ Missing args validators
  handler: async (ctx, args: any) => {  // ❌ Using 'any'
    // ❌ No auth check
    // ❌ No validation
    await ctx.db.insert("groups", { name: args.name });  // ❌ Unsafe
  }
});
```

#### 3.2 React Frontend Patterns
- ✅ No hardcoded colors (use design system tokens only)
- ✅ No inline styles (use DaisyUI classes)
- ✅ Responsive design (use `sm:`, `md:`, `lg:` breakpoints)
- ✅ Accessibility attributes (ARIA labels, semantic HTML)
- ✅ Error boundaries on async components

**Example**:
```tsx
// ✅ CORRECT Pattern
<button className="btn btn-primary">  {/* ✅ DaisyUI classes */}
  Like
</button>

// ❌ WRONG Pattern (caught by Code Reviewer)
<button style={{ backgroundColor: '#a442fe' }}>  {/* ❌ Hardcoded color */}
  Like
</button>

<button className="custom-purple-btn">  {/* ❌ Custom class */}
  Like
</button>
```

#### 3.3 Test Coverage Requirements
- ✅ Backend: 6 tests per mutation/query (happy path, auth, validation, business logic, authorization, edge cases)
- ✅ Frontend: Visual tests at 3 breakpoints (mobile, tablet, desktop)
- ✅ Integration: E2E test for critical flows
- ✅ Test pass rate: 100% (no failing/skipped tests)

**Example Output**:
```
Phase 3: Framework Compliance ✅
- Convex patterns: 8/8 mutations compliant
  ✅ Input validators present
  ✅ Auth checks present
  ✅ ConvexError used correctly
- Design system: 12/12 components compliant
  ✅ No hardcoded colors
  ✅ DaisyUI classes used
  ✅ Responsive breakpoints applied
- Test coverage: 100% (24 backend + 9 frontend + 3 E2E = 36 tests)
```

**Blocking Failures**:
- ❌ Missing input validators → **BLOCKS DEPLOYMENT**
- ❌ Missing auth checks → **BLOCKS DEPLOYMENT**
- ❌ Hardcoded colors → **BLOCKS DEPLOYMENT**
- ❌ Test coverage <100% → **BLOCKS DEPLOYMENT**

---

### Phase 4: Security Scan (CRITICAL)

**Purpose**: Detect critical security vulnerabilities

**Checks**:

#### 4.1 Secrets Detection
```bash
# Check for exposed secrets
grep -rE "(API_KEY|SECRET|TOKEN|PASSWORD|PRIVATE_KEY).*=.*['\"]" \
  --include="*.ts" --include="*.tsx" . | grep -v "process.env"

# Check for committed .env.local
git ls-files | grep ".env.local"
```

**Violations**:
- ❌ `const API_KEY = "sk_live_abc123"` → **BLOCKS DEPLOYMENT**
- ❌ `.env.local` committed to git → **BLOCKS DEPLOYMENT**

#### 4.2 Dependency Vulnerabilities
```bash
npm audit --json
```

**Severity Levels**:
- **CRITICAL** (CVE score 9.0-10.0) → **BLOCKS DEPLOYMENT**
- **HIGH** (CVE score 7.0-8.9) → Warning (fix soon)
- **MEDIUM/LOW** → Advisory (fix post-MVP)

**Example Output**:
```
Phase 4: Security Scan ✅
- Secrets: 0 exposed (all using process.env)
- Dependencies: 0 critical, 2 high (fix available)
  ⚠️ HIGH: axios 0.21.1 → 1.6.0 (SSRF vulnerability)
  ⚠️ HIGH: semver 7.0.0 → 7.5.2 (ReDoS vulnerability)
```

#### 4.3 Authentication & Authorization
```bash
# Check for missing auth
grep -r "mutation({" convex/ | grep -v "ctx.auth"

# Check for missing authorization (group membership)
grep -r "ctx.db.get\|ctx.db.query" convex/ | grep -v "isGroupMember"
```

**Violations**:
- ❌ Mutation without auth check → **BLOCKS DEPLOYMENT**
- ❌ Group data access without membership check → **BLOCKS DEPLOYMENT**

---

### Phase 5: Code Complexity Analysis (ADVISORY)

**Purpose**: Identify refactoring opportunities

**Metrics**:
- **Cyclomatic Complexity** (max 15 per function)
- **File Size** (max 500 lines)
- **Function Length** (max 100 lines)
- **Code Duplication** (detect copy-paste patterns)

**Example Output**:
```
Phase 5: Code Complexity ⚠️
- High complexity functions: 2
  ⚠️ getNewslettersWithFilters (complexity: 18) - consider extracting filters
  ⚠️ generateNewsletterHTML (complexity: 22) - consider extracting sections
- Large files: 1
  ⚠️ contributions.ts (612 lines) - consider splitting helpers
- Duplicate code: 0 patterns detected
```

**Non-Blocking**: All complexity warnings are advisory only.

---

## Code Review Report

After all phases complete, Code Reviewer generates a comprehensive report:

### ✅ PASS Example

```markdown
# Code Review Report ✅

**Status**: PASS - Safe to deploy
**Reviewed By**: Code Reviewer Agent (Opus)
**Timestamp**: 2025-10-18 14:32:15 UTC

## Summary
- Total Files Reviewed: 18
- Blocking Issues: 0 ✅
- Warnings: 4 ⚠️
- Advisory: 2 💡

## Phase Results

### Phase 1: Git Status ✅
- Working tree clean
- Feature branch: feature/likes-system
- All files committed

### Phase 2: Static Analysis ✅
- TypeScript: 0 errors
- ESLint: 0 warnings
- Prettier: Formatted correctly
- Semgrep: 0 vulnerabilities

### Phase 3: Framework Compliance ✅
- Convex patterns: 8/8 mutations compliant
- Design system: 12/12 components compliant
- Test coverage: 100% (36/36 passing)

### Phase 4: Security Scan ✅
- Secrets: 0 exposed
- Dependencies: 0 critical, 2 high (fix available)
  ⚠️ axios 0.21.1 → 1.6.0 (SSRF)
  ⚠️ semver 7.0.0 → 7.5.2 (ReDoS)
- Auth/Authz: All mutations protected

### Phase 5: Code Complexity ⚠️
- 2 high-complexity functions (advisory)
- 1 large file (advisory)

## Warnings (Non-Blocking)

1. **Dependency**: axios 0.21.1 has HIGH severity SSRF vulnerability
   - **Fix**: `npm install axios@1.6.0`
   - **Priority**: Fix before next release

2. **Dependency**: semver 7.0.0 has HIGH severity ReDoS vulnerability
   - **Fix**: `npm install semver@7.5.2`
   - **Priority**: Fix before next release

## Advisory (Refactoring Opportunities)

1. **Complexity**: getNewslettersWithFilters (complexity: 18)
   - **Suggestion**: Extract filter logic into separate functions
   - **Benefit**: Easier testing and maintenance

2. **File Size**: contributions.ts (612 lines)
   - **Suggestion**: Split helpers into separate file
   - **Benefit**: Improved organization

## Recommendation

✅ **APPROVED FOR DEPLOYMENT**

All critical checks passed. 2 HIGH severity dependency vulnerabilities found but have fixes available. Recommend running `npm update` before deployment.

---

**Next Steps**:
1. Fix dependency vulnerabilities: `npm install axios@1.6.0 semver@7.5.2`
2. Re-run code review (optional)
3. Proceed to UX Review → Security Specialist → Deployment
```

### ❌ FAIL Example

```markdown
# Code Review Report ❌

**Status**: FAIL - Deployment BLOCKED
**Reviewed By**: Code Reviewer Agent (Opus)
**Timestamp**: 2025-10-18 14:35:42 UTC

## Summary
- Total Files Reviewed: 15
- Blocking Issues: 5 ❌
- Warnings: 1 ⚠️

## BLOCKING ISSUES (Must Fix)

### 1. TypeScript Errors (Phase 2)
**File**: `components/groups/LikeButton.tsx`
**Line**: 42
**Error**: Property 'liked' does not exist on type '{ count: number }'
**Fix**: Add `liked: boolean` to mutation return type

### 2. Hardcoded Color (Phase 3)
**File**: `components/groups/LikeButton.tsx`
**Line**: 28
**Error**: Hardcoded color `#ff0000` found
**Fix**: Use design system token: `className="text-error"` or `className="text-primary"`

### 3. Missing Auth Check (Phase 4)
**File**: `convex/contributions.ts`
**Function**: `deleteContribution`
**Error**: Mutation missing auth check
**Fix**:
```typescript
const identity = await ctx.auth.getUserIdentity();
if (!identity) {
  throw new ConvexError("Unauthorized");
}
```

### 4. Exposed Secret (Phase 4)
**File**: `lib/newsletter.ts`
**Line**: 12
**Error**: RESEND_API_KEY exposed in code
**Fix**: Move to environment variable:
```typescript
// WRONG
const apiKey = "re_abc123def456";

// CORRECT
const apiKey = process.env.RESEND_API_KEY;
```

### 5. Missing Input Validator (Phase 3)
**File**: `convex/contributions.ts`
**Function**: `updateContribution`
**Error**: Missing input validators
**Fix**:
```typescript
export const updateContribution = mutation({
  args: {
    id: v.id("contributions"),
    prompt1: v.string(),
    prompt2: v.array(v.string())
  },
  handler: async (ctx, args) => { ... }
});
```

## Recommendation

❌ **DEPLOYMENT BLOCKED**

Fix all 5 blocking issues and re-run code review. Do not deploy to staging until code review passes.

**Priority**:
1. Fix exposed secret (CRITICAL SECURITY ISSUE)
2. Add auth check (CRITICAL SECURITY ISSUE)
3. Fix TypeScript errors (BLOCKS BUILD)
4. Add input validators (FRAMEWORK REQUIREMENT)
5. Remove hardcoded color (DESIGN SYSTEM VIOLATION)
```

---

## Integration with Workflow

### Automatic Workflow (UEDS)

```
Orchestrator: "Backend + Frontend complete, all tests passing (24/24)"

Orchestrator: [Auto-invokes Code Reviewer]

Code Reviewer:
  Phase 1: Git Status ✅
  Phase 2: Static Analysis ✅
  Phase 3: Framework Compliance ✅
  Phase 4: Security Scan ✅
  Phase 5: Code Complexity ⚠️

Code Reviewer: "✅ PASS - 0 blocking issues, 2 warnings (dependency updates)"

Orchestrator: [Proceeds to UX Reviewer...]
```

### Failure Handling

```
Code Reviewer: "❌ FAIL - 3 blocking issues found"

Orchestrator: [Analyzes failures]
  - 1 TypeScript error (Frontend)
  - 2 missing auth checks (Backend)

Orchestrator: [Invokes Frontend Agent]
  Task: "Fix TypeScript error in LikeButton.tsx:42 - add 'liked' property"

Orchestrator: [Invokes Backend Agent]
  Task: "Add auth checks to deleteContribution and updateContribution"

[Agents fix issues]

Orchestrator: [Re-runs Code Reviewer]

Code Reviewer: "✅ PASS - All issues resolved"

Orchestrator: [Continues to next quality gate...]
```

---

## Manual Code Review

**When to use**:
- User wants to review specific files before committing
- User suspects code quality issues
- User wants pre-commit validation

**How to trigger**:
```
User: "Run code review on LikeButton component"

Main Claude: [Invokes Code Reviewer with specific file filter]

Code Reviewer:
  - Reviewing: components/groups/LikeButton.tsx
  - Phase 2: TypeScript ✅
  - Phase 3: No hardcoded colors ✅
  - Phase 5: Complexity 8 (low) ✅

Code Reviewer: "✅ LikeButton.tsx passes all checks"
```

---

## Skipping Code Review (Not Recommended)

**When to skip**:
- Documentation-only changes (README.md, comments)
- Framework documentation changes (`.claude/` directory)
- Urgent production hotfixes (after user approval)

**How to skip**:
```
User: "Skip code review and deploy directly"

Orchestrator: [Skips Code Reviewer, proceeds to Deployment Agent]
  ⚠️ WARNING: Deploying without code review - use with caution
```

**Risks**:
- Undetected TypeScript errors → Build failures
- Security vulnerabilities → Data breaches
- Framework violations → Maintenance debt
- Missing tests → Regression bugs

---

## Best Practices

### For Developers

1. **Run TypeScript locally before committing**:
   ```bash
   npx tsc --noEmit
   ```

2. **Run ESLint with auto-fix**:
   ```bash
   npx eslint . --fix
   ```

3. **Format with Prettier**:
   ```bash
   npx prettier --write .
   ```

4. **Check for secrets before committing**:
   ```bash
   git diff | grep -E "(API_KEY|SECRET|TOKEN|PASSWORD)"
   ```

5. **Write tests FIRST** (TDD):
   - Backend: Vitest unit tests (6 per function)
   - Frontend: Playwright visual tests (3 breakpoints)
   - Integration: E2E tests for critical flows

### For Framework Maintainers

1. **Update Code Reviewer patterns** when new framework rules added
2. **Add Semgrep custom rules** for project-specific patterns
3. **Track code review metrics** (pass rate, common failures)
4. **Propose improvements** when repetitive failures occur

---

## Troubleshooting

### Issue: TypeScript Errors in Framework Files

**Problem**: Code Reviewer flags TypeScript errors in `.claude/` files

**Solution**: Framework documentation files are excluded from code review. If flagged, update `.eslintignore`:
```
.claude/
```

### Issue: Semgrep False Positives

**Problem**: Semgrep flags safe code as vulnerable

**Solution**: Add inline comment to suppress:
```typescript
// nosemgrep: typescript.express.security.audit.xss.reflected-req-params-to-response.reflected-req-params-to-response
res.send(userInput);
```

Or add to `.semgrepignore`:
```
tests/
*.test.ts
```

### Issue: Code Review Timeout

**Problem**: Code review takes >5 minutes (timeout)

**Solution**:
1. Review large files individually (don't review entire codebase at once)
2. Skip Phase 5 (code complexity) for large codebases
3. Increase timeout in Code Reviewer settings

---

## Related Documentation

- `.claude/agents/code-reviewer.md` - Code Reviewer agent specification
- `.claude/agents/orchestrator.md` - Auto-invocation workflow
- `.claude/development-guide.md` - Framework coding standards
- `.claude/guides/testing.md` - TDD requirements

---

**Version History**:
- v1.0.0 (2025-10-18): Initial code review workflow guide
