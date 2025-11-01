#!/bin/bash
# Auto-create GitHub PR when story marked COMPLETE
# Usage: ./.claude/hooks/story-complete-pr.sh STORY-A7
#
# This script extracts story metadata and provides context for Claude
# to create a PR via GitHub MCP server
#
# Framework Version: v1.4.0
# Created: 2025-10-12

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if story ID provided
if [ -z "$1" ]; then
  echo -e "${RED}Error: Story ID required${NC}"
  echo "Usage: ./.claude/hooks/story-complete-pr.sh STORY-ID"
  echo "Example: ./.claude/hooks/story-complete-pr.sh STORY-A7"
  exit 1
fi

STORY_ID=$1
REPO_ROOT=$(git rev-parse --show-toplevel)

# Find story file (check multiple possible locations)
STORY_FILE=""
if [ -f ".claude/sessions/current/stories/${STORY_ID}.md" ]; then
  STORY_FILE=".claude/sessions/current/stories/${STORY_ID}.md"
elif [ -f ".claude/projects/active/*/stories/${STORY_ID}.md" ]; then
  STORY_FILE=$(find .claude/projects/active -name "${STORY_ID}.md" | head -1)
elif [ -f "${STORY_ID}.md" ]; then
  STORY_FILE="${STORY_ID}.md"
else
  echo -e "${RED}Error: Story file not found for ${STORY_ID}${NC}"
  echo "Searched in:"
  echo "  - .claude/sessions/current/stories/"
  echo "  - .claude/projects/active/*/stories/"
  echo "  - Current directory"
  exit 1
fi

echo -e "${BLUE}📋 Story PR Creation Helper${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Extract story metadata
TITLE=$(grep "^# " "$STORY_FILE" | sed 's/# //' | sed "s/${STORY_ID}: //")
TYPE=$(grep "**Type**:" "$STORY_FILE" | sed 's/.*: //' | head -1)
TIME=$(grep "**Estimated Time**:" "$STORY_FILE" | sed 's/.*: //' | head -1)
ACTUAL_TIME=$(grep "**Actual Time**:" "$STORY_FILE" | sed 's/.*: //' | head -1)

# Get current branch
BRANCH=$(git branch --show-current)

# Get files modified (from story file)
FILES=$(sed -n '/## Files Modified/,/##/p' "$STORY_FILE" | grep -E '^- ' | sed 's/^- //' || echo "See commit history")

# Get test results (from story file)
TESTS=$(sed -n '/## Test Results/,/##/p' "$STORY_FILE" | grep -E '^- ' | sed 's/^- //' || echo "All tests passing ✅")

echo -e "${GREEN}✓${NC} Story file found: ${STORY_FILE}"
echo -e "${GREEN}✓${NC} Story ID: ${STORY_ID}"
echo -e "${GREEN}✓${NC} Title: ${TITLE}"
echo -e "${GREEN}✓${NC} Type: ${TYPE}"
echo -e "${GREEN}✓${NC} Branch: ${BRANCH}"
echo ""

# Determine PR type prefix
case "$TYPE" in
  *Backend*|*"(A)"*)
    PR_TYPE="feat(backend)"
    LABELS="backend,convex,tdd"
    ;;
  *Frontend*|*"(C)"*)
    PR_TYPE="feat(frontend)"
    LABELS="frontend,react,daisyui"
    ;;
  *Testing*|*"(E)"*)
    PR_TYPE="test"
    LABELS="testing,playwright"
    ;;
  *Integration*|*"(B)"*)
    PR_TYPE="feat"
    LABELS="integration,full-stack"
    ;;
  *)
    PR_TYPE="feat"
    LABELS="enhancement"
    ;;
esac

# Generate PR title
PR_TITLE="${PR_TYPE}: ${STORY_ID} - ${TITLE}"

# Generate PR body
PR_BODY=$(cat <<EOF
## Story
${STORY_ID}

## Type
${TYPE}

## Summary
${TITLE}

## Time
- Estimated: ${TIME}
- Actual: ${ACTUAL_TIME:-TBD}

## Files Modified
${FILES}

## Tests
${TESTS}

## Story File
\`${STORY_FILE}\`

---

🤖 Generated with [Claude Code](https://claude.com/claude-code) + UEDS Framework v1.4.0
EOF
)

echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}PR Details (Ready for GitHub MCP)${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}Title:${NC}"
echo "  ${PR_TITLE}"
echo ""
echo -e "${BLUE}Labels:${NC}"
echo "  ${LABELS}"
echo ""
echo -e "${BLUE}Base Branch:${NC} main"
echo -e "${BLUE}Head Branch:${NC} ${BRANCH}"
echo ""
echo -e "${BLUE}Body:${NC}"
echo "${PR_BODY}" | sed 's/^/  /'
echo ""

# Check if on correct branch
if [ "$BRANCH" = "main" ]; then
  echo -e "${RED}⚠ Warning: You're on main branch!${NC}"
  echo "PRs should be created from feature branches."
  echo "Create a feature branch first:"
  echo "  git checkout -b feature/${STORY_ID}"
  exit 1
fi

# Check if branch has commits
COMMITS=$(git log main..HEAD --oneline 2>/dev/null | wc -l | tr -d ' ')
if [ "$COMMITS" -eq 0 ]; then
  echo -e "${RED}⚠ Warning: No commits on this branch yet!${NC}"
  echo "Commit your changes first:"
  echo "  git add ."
  echo "  git commit -m \"${PR_TYPE}: ${TITLE}\""
  exit 1
fi

# Check if branch is pushed
if ! git ls-remote --heads origin "$BRANCH" | grep -q "$BRANCH"; then
  echo -e "${YELLOW}⚠ Branch not pushed to remote yet${NC}"
  echo "Push branch first:"
  echo "  git push -u origin ${BRANCH}"
  echo ""
  read -p "Push now? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    git push -u origin "$BRANCH"
    echo -e "${GREEN}✓ Branch pushed${NC}"
  else
    echo "Push manually, then re-run this script."
    exit 1
  fi
fi

echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Ready to create PR!${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}Next step:${NC} Ask Claude to create the PR"
echo ""
echo -e "${YELLOW}Copy and paste this to Claude:${NC}"
echo ""
echo -e "${GREEN}\"Create a GitHub PR with these details:"
echo ""
echo "Title: ${PR_TITLE}"
echo "Base: main"
echo "Head: ${BRANCH}"
echo "Labels: ${LABELS}"
echo ""
echo "Body:"
echo "${PR_BODY}"
echo "\"${NC}"
echo ""

# Optionally save to clipboard (macOS)
if command -v pbcopy &> /dev/null; then
  echo "Create a GitHub PR with these details:

Title: ${PR_TITLE}
Base: main
Head: ${BRANCH}
Labels: ${LABELS}

Body:
${PR_BODY}" | pbcopy
  echo -e "${GREEN}✓ Copied to clipboard!${NC} Just paste into Claude."
  echo ""
fi

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
