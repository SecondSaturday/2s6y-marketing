# Git Worktrees & Parallel Agent Development

## What are Git Worktrees?

Git worktrees allow you to have **multiple working directories** from the same repository, each on a different branch. This enables **parallel development** without branch switching or stashing.

### Traditional Git Workflow (Slow)
```bash
# Agent 1 wants to work on feature A
git checkout feature/a
# ... work on feature A ...

# Agent 2 wants to work on feature B (must wait!)
git stash
git checkout feature/b
# ... work on feature B ...

# Switch back to feature A
git checkout feature/a
git stash pop
```

### Worktree Workflow (Fast & Parallel)
```bash
# Agent 1 works in main directory
cd ~/2Sat-lite
git checkout feature/a
# ... work on feature A ...

# Agent 2 works in separate worktree (simultaneously!)
cd ~/2Sat-lite-feature-b
git checkout feature/b
# ... work on feature B ...

# Both agents work in parallel, no conflicts!
```

---

## Setup Guide

### 1. Create a Worktree

**Using the helper script** (recommended):
```bash
./scripts/setup-worktree.sh feature/contribution-form
```

**Manual setup**:
```bash
# Create worktree
git worktree add ../2Sat-lite-contribution-form feature/contribution-form

# Navigate to worktree
cd ../2Sat-lite-contribution-form

# Install dependencies
npm install

# Copy environment variables
cp ../2Sat-lite/.env.local .env.local

# Start development
npm run dev
```

### 2. List Active Worktrees

```bash
git worktree list
```

Output:
```
/Users/you/2Sat-lite                         abc123 [main]
/Users/you/2Sat-lite-contribution-form       def456 [feature/contribution-form]
/Users/you/2Sat-lite-newsletter-template     ghi789 [feature/newsletter-template]
```

### 3. Remove a Worktree

**When feature is complete**:
```bash
# From main repository
git worktree remove ../2Sat-lite-contribution-form

# If worktree has uncommitted changes
git worktree remove ../2Sat-lite-contribution-form --force
```

---

## Parallel Agent Workflows

### Scenario 1: Manual Parallel Development

**User request**:
> "Build the contribution form AND newsletter template in parallel"

**Agent workflow**:
```bash
# Agent creates two worktrees
./scripts/setup-worktree.sh feature/contribution-form
./scripts/setup-worktree.sh feature/newsletter-template

# Agent 1 works in first worktree
cd ../2Sat-lite-contribution-form
# ... build contribution form ...

# Agent 2 works in second worktree (simultaneously)
cd ../2Sat-lite-newsletter-template
# ... build newsletter template ...

# Both agents test independently
# Both agents create PRs
# User reviews and merges
```

### Scenario 2: GitHub Actions Parallel Execution

**Trigger**: User runs workflow with multiple feature branches

```bash
# GitHub Actions workflow dispatch
# Input: "feature/form,feature/newsletter,feature/cron"

# GitHub creates 3 parallel jobs:
# Job 1: Tests feature/form in isolated worktree
# Job 2: Tests feature/newsletter in isolated worktree
# Job 3: Tests feature/cron in isolated worktree

# All jobs run simultaneously
# Results aggregated in summary
```

**How to trigger**:
1. Go to GitHub Actions tab
2. Select "Parallel Agents" workflow
3. Click "Run workflow"
4. Enter: `feature/form,feature/newsletter,feature/cron`
5. Click "Run"

---

## Best Practices

### ✅ Do's

1. **Create worktrees for feature branches**
   ```bash
   ./scripts/setup-worktree.sh feature/new-feature
   ```

2. **Keep worktree names descriptive**
   ```bash
   # Good
   2Sat-lite-contribution-form
   2Sat-lite-newsletter-template

   # Bad
   2Sat-lite-temp
   2Sat-lite-test
   ```

3. **Remove worktrees after merging**
   ```bash
   git worktree remove ../2Sat-lite-contribution-form
   git branch -d feature/contribution-form
   ```

4. **Use separate Convex dev instances for testing**
   - Prevents data conflicts between parallel agents
   - Each worktree can have its own dev deployment

5. **Commit and push regularly**
   ```bash
   cd ../2Sat-lite-contribution-form
   git add .
   git commit -m "Add contribution form UI"
   git push origin feature/contribution-form
   ```

### ❌ Don'ts

1. **Don't delete worktree directory manually**
   ```bash
   # Bad
   rm -rf ../2Sat-lite-contribution-form

   # Good
   git worktree remove ../2Sat-lite-contribution-form
   ```

2. **Don't modify the same files in multiple worktrees**
   - Each worktree should work on isolated features
   - Avoid editing `package.json` or shared configs simultaneously

3. **Don't forget to install dependencies**
   - Each worktree needs its own `node_modules`
   - Use `npm install` or `npm ci` in each worktree

4. **Don't share `.env.local` with secrets across worktrees**
   - Copy `.env.local` to each worktree
   - Keep secrets isolated per worktree

---

## Common Commands

### Create Worktree
```bash
# Using helper script
./scripts/setup-worktree.sh <branch-name>

# Manual
git worktree add <path> <branch>
```

### List Worktrees
```bash
git worktree list
```

### Remove Worktree
```bash
git worktree remove <path>
git worktree remove <path> --force  # Force remove with uncommitted changes
```

### Prune Deleted Worktrees
```bash
git worktree prune
```

### Move Worktree
```bash
git worktree move <old-path> <new-path>
```

### Lock Worktree (Prevent Deletion)
```bash
git worktree lock <path>
git worktree unlock <path>
```

---

## Troubleshooting

### Issue: "fatal: '<branch>' is already checked out"

**Problem**: Trying to create worktree for a branch that's already checked out in another worktree.

**Solution**:
```bash
# Find which worktree has the branch
git worktree list

# Remove old worktree if no longer needed
git worktree remove <path>

# Or create worktree with new branch name
git worktree add <path> -b new-branch-name
```

### Issue: "Cannot remove worktree with uncommitted changes"

**Problem**: Trying to remove worktree with uncommitted work.

**Solution**:
```bash
# Option 1: Commit changes
cd <worktree-path>
git add .
git commit -m "Save work"

# Option 2: Force remove (discards changes!)
git worktree remove <path> --force

# Option 3: Stash changes
cd <worktree-path>
git stash
cd ../main-repo
git worktree remove <path>
```

### Issue: "node_modules conflicts between worktrees"

**Problem**: Sharing `node_modules` between worktrees causes issues.

**Solution**:
```bash
# Each worktree should have its own node_modules
cd <worktree-path>
npm install
```

### Issue: "Convex deployment conflicts"

**Problem**: Multiple worktrees trying to use same Convex dev instance.

**Solution**:
```bash
# Option 1: Use separate dev instances
cd <worktree-path>
npx convex dev --dev-name my-feature-dev

# Option 2: Share dev instance (read-only testing)
# Don't run "convex dev" in worktrees, only in main repo
```

---

## Advanced: Parallel Testing

### Local Parallel Testing

Run tests in multiple worktrees simultaneously:

```bash
# Terminal 1
cd ../2Sat-lite-contribution-form
npm run test -- --grep "contribution form"

# Terminal 2
cd ../2Sat-lite-newsletter-template
npm run test -- --grep "newsletter"

# Terminal 3
cd ../2Sat-lite-cron
npm run test -- --grep "cron"
```

### GitHub Actions Parallel Testing

See `.github/workflows/parallel-agents.yml` for automated parallel testing.

**Workflow**:
1. User triggers workflow with feature list
2. GitHub creates matrix of features
3. Each feature gets isolated worktree
4. Tests run in parallel
5. Results aggregated in summary

---

## Integration with Claude Code Agents

### Agent Workflow for Parallel Development

**User request**:
> "Build these 3 features in parallel: contribution form, newsletter template, cron job"

**Agent response**:
```bash
# Step 1: Create worktrees
./scripts/setup-worktree.sh feature/contribution-form
./scripts/setup-worktree.sh feature/newsletter-template
./scripts/setup-worktree.sh feature/cron-job

# Step 2: Trigger parallel GitHub Actions
# (or spawn multiple agent instances locally)

# Step 3: Each agent works in isolation
# Agent 1: cd ../2Sat-lite-contribution-form
# Agent 2: cd ../2Sat-lite-newsletter-template
# Agent 3: cd ../2Sat-lite-cron-job

# Step 4: Each agent tests independently
# npx playwright test

# Step 5: Each agent creates PR
# gh pr create --title "..." --body "..."

# Step 6: User reviews and merges
```

### Agent Self-Testing in Worktrees

Each agent validates its work in isolation:

```bash
# Agent 1 in worktree 1
cd ../2Sat-lite-contribution-form
npx playwright test tests/contribution-form.spec.ts
# ✅ Pass → Create PR

# Agent 2 in worktree 2
cd ../2Sat-lite-newsletter-template
npx playwright test tests/newsletter.spec.ts
# ❌ Fail → Debug → Re-test → Create PR
```

---

## Directory Structure Example

```
/Users/you/
  ├── 2Sat-lite/                              # Main repo (main branch)
  │   ├── .git/                               # Git metadata
  │   ├── app/
  │   ├── convex/
  │   ├── scripts/
  │   │   └── setup-worktree.sh
  │   └── package.json
  │
  ├── 2Sat-lite-contribution-form/            # Worktree 1 (feature/contribution-form)
  │   ├── app/
  │   ├── convex/
  │   ├── node_modules/                       # Separate dependencies
  │   └── package.json
  │
  ├── 2Sat-lite-newsletter-template/          # Worktree 2 (feature/newsletter-template)
  │   ├── app/
  │   ├── convex/
  │   ├── node_modules/                       # Separate dependencies
  │   └── package.json
  │
  └── 2Sat-lite-cron-job/                     # Worktree 3 (feature/cron-job)
      ├── app/
      ├── convex/
      ├── node_modules/                       # Separate dependencies
      └── package.json
```

---

## Resources

- [Git Worktree Documentation](https://git-scm.com/docs/git-worktree)
- [GitHub Actions Matrix Strategy](https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs)
- [Convex Multi-Environment Setup](https://docs.convex.dev/production/hosting#development-environments)

---

**Last Updated**: 2025-01-15
**Version**: 1.0.0
