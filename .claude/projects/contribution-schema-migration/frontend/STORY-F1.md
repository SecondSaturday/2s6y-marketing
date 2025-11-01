# STORY-F1: Dynamic Contribution Form

**Linear**: [2S6-11](https://linear.app/2s6y/issue/2S6-11/story-f1-dynamic-contribution-form)
**Phase**: 2 (Dependent)
**Agent**: Frontend Agent
**Time**: 2 hours
**Priority**: P1 (Urgent)
**Dependencies**: B3 (Contributions Mutations), B5 (Group Prompts Mutations)

## Quick Summary
Update contribution form to dynamically render prompts based on active group prompts.

## Tasks
- [ ] Update `app/contribute/page.tsx`:
  - Replace hardcoded prompts with dynamic rendering
  - Fetch: `useQuery(api.groupPrompts.getActivePrompts, { groupId })`
  - Build responses object: `{ "1": { text: "..." }, "2": { mediaUrls: [...] } }`
  - Save using updated `createOrUpdate` mutation
  - Handle promptType rendering:
    - `text` → `<PromptCard>` (already exists)
    - `media` → `<PhotoWall>` (already exists)
    - `audio` → `<AudioUpload>` (STORY-F5)
- [ ] Maintain auto-save functionality (10-second debounce)
- [ ] Create visual tests at 3 breakpoints

## Contract Input
See `CONTRACTS.md` for exact API signatures from B3, B5.

## Testing
- Visual test: Desktop (1440x900) - 5 prompts
- Visual test: Tablet (768x1024) - 3 prompts
- Visual test: Mobile (375x667) - 4 prompts

## Files
- `app/contribute/page.tsx`
- `tests/visual/dynamic-contribution-form.spec.ts` (new)

## Linear Updates
- Wait for B3, B5 to be "Done" before starting
- Set status to "In Progress" when starting
- Add test results as comment when done
- Set status to "Done" when tests pass
