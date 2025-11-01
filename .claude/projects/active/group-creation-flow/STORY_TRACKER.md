# STORY_TRACKER - Group Creation Flow Rebuild

**Project**: Group Creation Flow Rebuild
**Type**: UEDS Parallel Development
**Created**: 2025-10-25
**Status**: In Progress
**Linear Project**: [Group Creation Flow Rebuild](https://linear.app/2s6y/project/group-creation-flow-rebuild-5d5bbee6c07e)

---

## 📊 Progress Overview

| Phase | Stories | Status | Duration |
|-------|---------|--------|----------|
| Phase 1: Foundation | STORY-1 | ⏳ Pending | 2-3 hours |
| Phase 2: Backend + Frontend | STORY-2 to STORY-7 | ⏳ Pending | ~3-4 hours (parallel) |
| Phase 3: Integration | STORY-8 to STORY-10 | ⏳ Pending | ~2-3 hours (parallel) |
| Phase 4: Cleanup | STORY-11 | ⏳ Pending | 2 hours |
| **TOTAL** | **11 Stories** | **0/11 Complete** | **~10-12 hours** |

---

## 🎯 Story List

### **STORY-1: UX Design Review & Specifications** [BLOCKING]
**Agent**: `ux-reviewer`
**Status**: ⏳ Pending
**Linear Issue**: [2S6-58](https://linear.app/2s6y/issue/2S6-58)
**Duration**: 2 hours
**Dependencies**: None

**Objectives**:
- Analyze existing settings page for design patterns
- Review DaisyUI cupcake theme components
- Create visual specifications for 4 screens
- Define spacing, typography, color usage
- Accessibility audit (WCAG 2.1 AA)
- Responsive specifications

**Deliverables**:
- [ ] `ux-specifications.md` - Complete visual design specs
- [ ] Component recommendations with DaisyUI classes
- [ ] Spacing/layout specifications
- [ ] Accessibility checklist
- [ ] Responsive breakpoint guidelines

**Notes**:
- **BLOCKER**: Frontend work cannot start until GATE-1 approved
- Must create delightful experience, not just functional

---

### **GATE-1: UX Design Approval** ⚠️
**Status**: ⏳ Awaiting STORY-1 completion
**Reviewer**: User
**Criteria**: Review and approve UX specifications before proceeding

---

### **STORY-2: Backend Enhancements**
**Agent**: `backend-dev`
**Status**: ⏳ Pending
**Linear Issue**: [2S6-59](https://linear.app/2s6y/issue/2S6-59)
**Duration**: 2-3 hours
**Dependencies**: GATE-1 approved

**Objectives**:
- Add group ID uniqueness validation query
- Add description field support to `createGroupWithSettings`
- Create description editing mutation for settings
- Export default prompts as constants
- Unit tests (TDD)

**Files to Modify**:
- `convex/groups/mutations.ts`
- `convex/groups/queries.ts`
- `convex/schema.ts` (verify description field)
- Unit tests

**Deliverables**:
- [ ] `checkGroupIdUniqueness(id: string)` query
- [ ] `updateGroupDescription(groupId, description)` mutation
- [ ] Updated `createGroupWithSettings` with description
- [ ] Default prompts constant exported
- [ ] Unit tests passing
- [ ] Contract document for frontend

**Notes**: Can run in parallel with STORY-3 to STORY-7

---

### **STORY-3: Welcome/Intro Screen**
**Agent**: `frontend-dev`
**Status**: ⏳ Pending
**Linear Issue**: [2S6-60](https://linear.app/2s6y/issue/2S6-60)
**Duration**: 2 hours
**Dependencies**: GATE-1 approved, STORY-1 (UX specs)

**Objectives**:
- Build `/create-group` route structure
- Implement Welcome screen (Screen 0)
- Hero section with ritual messaging
- Beautiful visual layout
- "Get Started" CTA button
- Responsive design

**Files to Create**:
- `app/create-group/page.tsx`
- `components/group-creation/WelcomeScreen.tsx`
- `components/group-creation/types.ts`

**Deliverables**:
- [ ] Welcome screen component
- [ ] Smooth transition to Step 1
- [ ] Visual tests (3 breakpoints)
- [ ] Matches UX specs

**Notes**: Can run in parallel with STORY-2, STORY-4-7

---

### **STORY-4: Basic Info Step**
**Agent**: `frontend-dev`
**Status**: ⏳ Pending
**Linear Issue**: [2S6-61](https://linear.app/2s6y/issue/2S6-61)
**Duration**: 3 hours
**Dependencies**: GATE-1 approved, STORY-1 (UX specs), STORY-2 (backend contract)

**Objectives**:
- Group name input with validation
- Group ID input (auto-generated, editable, unique check)
- Description textarea
- Avatar upload with random meme default
- Cover upload with gradient default
- Image preview
- Validation and error states

**Files to Create**:
- `components/group-creation/BasicInfoStep.tsx`
- `components/group-creation/ImageUpload.tsx`
- `lib/group-creation/defaults.ts`
- `lib/group-creation/validation.ts`

**Deliverables**:
- [ ] Basic Info step component
- [ ] Real-time group ID uniqueness validation
- [ ] Random meme avatar on load
- [ ] Gradient banner on load
- [ ] Image upload with preview
- [ ] Form validation
- [ ] Visual tests

**Notes**: Requires backend uniqueness check from STORY-2

---

### **STORY-5: Prompts Step**
**Agent**: `frontend-dev`
**Status**: ⏳ Pending
**Linear Issue**: [2S6-62](https://linear.app/2s6y/issue/2S6-62)
**Duration**: 2-3 hours
**Dependencies**: GATE-1 approved, STORY-1 (UX specs), STORY-2 (default prompts)

**Objectives**:
- Display 5 default prompts (pre-filled)
- Editable prompt labels
- Type selector per prompt
- Visual prompt cards with emoji
- Validation
- Live preview

**Files to Create**:
- `components/group-creation/PromptsStep.tsx`
- `components/group-creation/PromptCard.tsx`
- `components/group-creation/PromptPreview.tsx`

**Deliverables**:
- [ ] Prompts step component
- [ ] 5 default prompts loaded
- [ ] Editable with type selectors
- [ ] Visual prompt cards
- [ ] Validation
- [ ] Visual tests

**Notes**: Must match settings page prompt UI

---

### **STORY-6: Members Step**
**Agent**: `frontend-dev`
**Status**: ⏳ Pending
**Linear Issue**: [2S6-63](https://linear.app/2s6y/issue/2S6-63)
**Duration**: 2 hours
**Dependencies**: GATE-1 approved, STORY-1 (UX specs), STORY-2 (backend contract)

**Objectives**:
- Email input (comma/newline separated)
- Real-time email validation
- Display parsed email list
- Auto-generated invite code display
- Copy invite link functionality
- "Create Group" submit button
- Loading states

**Files to Create**:
- `components/group-creation/MembersStep.tsx`
- `components/group-creation/EmailInput.tsx`
- `components/group-creation/InviteCodeDisplay.tsx`
- `lib/group-creation/email-parser.ts`

**Deliverables**:
- [ ] Members step component
- [ ] Email parsing and validation
- [ ] Invite code generation
- [ ] Copy to clipboard
- [ ] Submit button with loading
- [ ] Visual tests

**Notes**: Final step before submission

---

### **STORY-7: Progress Stepper & Navigation**
**Agent**: `frontend-dev`
**Status**: ⏳ Pending
**Linear Issue**: [2S6-64](https://linear.app/2s6y/issue/2S6-64)
**Duration**: 2 hours
**Dependencies**: GATE-1 approved, STORY-1 (UX specs)

**Objectives**:
- Visual progress stepper (numbered circles + labels)
- Current step highlighting
- Back/Next navigation
- URL state management
- Form state persistence
- Validation gates

**Files to Create**:
- `components/group-creation/ProgressStepper.tsx`
- `components/group-creation/NavigationButtons.tsx`
- `lib/group-creation/store.ts` (Zustand)
- `hooks/useGroupCreation.ts`

**Deliverables**:
- [ ] Progress stepper component
- [ ] Navigation buttons
- [ ] State management
- [ ] URL sync
- [ ] Validation gates
- [ ] Visual tests

**Notes**: Foundation for navigation across all steps

---

### **GATE-2: Contract Review** ⚠️
**Status**: ⏳ Awaiting STORY-2 to STORY-7 completion
**Reviewer**: Main Claude Session
**Criteria**:
- Backend contracts published
- Frontend components align with contracts
- No integration blockers identified

---

### **STORY-8: Integration & Submission Handler**
**Agent**: `orchestrator`
**Status**: ⏳ Pending
**Linear Issue**: [2S6-65](https://linear.app/2s6y/issue/2S6-65)
**Duration**: 3 hours
**Dependencies**: GATE-2 approved, STORY-2, STORY-3-7

**Objectives**:
- Wire all steps together
- Implement submission handler
- Map form state to `createGroupWithSettings`
- Handle success (navigate to new group)
- Handle errors
- State cleanup
- Contract verification

**Files to Modify**:
- `app/create-group/page.tsx`
- `lib/group-creation/submission.ts`

**Deliverables**:
- [ ] Fully integrated creation flow
- [ ] Submission handler wired
- [ ] Success navigation
- [ ] Error handling
- [ ] State cleanup
- [ ] Integration tests

**Notes**: Critical integration point - requires all previous stories

---

### **STORY-9: E2E Test Suite**
**Agent**: `frontend-dev`
**Status**: ⏳ Pending
**Linear Issue**: [2S6-66](https://linear.app/2s6y/issue/2S6-66)
**Duration**: 3-4 hours
**Dependencies**: STORY-1 (UX specs), STORY-8 (integration)

**Test Coverage**:
1. Happy path (complete flow)
2. Validation tests
3. Navigation tests
4. Defaults (avatar, banner, prompts)
5. Image upload tests
6. Members (email, invite code)
7. Submission (success, errors)
8. Edge cases

**Files to Create**:
- `tests/e2e/group-creation-flow.spec.ts`
- `tests/fixtures/group-creation-data.ts`
- `tests/helpers/group-creation-helpers.ts`

**Deliverables**:
- [ ] Comprehensive E2E test suite
- [ ] Test fixtures and helpers
- [ ] Coverage report
- [ ] Visual regression tests

**Notes**: Can run in parallel with STORY-8

---

### **STORY-10: Settings Page - Add Description Field**
**Agent**: `frontend-dev`
**Status**: ⏳ Pending
**Linear Issue**: [2S6-67](https://linear.app/2s6y/issue/2S6-67)
**Duration**: 2 hours
**Dependencies**: GATE-2 approved, STORY-2 (backend mutation)

**Objectives**:
- Add description textarea to GroupInfoSection
- Wire to `updateGroupDescription` mutation
- Match existing settings UI
- Admin-only permissions
- Validation (200 char max)
- Optimistic UI update

**Files to Modify**:
- `components/settings/GroupInfoSection.tsx`

**Deliverables**:
- [ ] Description field in settings
- [ ] Edit functionality
- [ ] Validation
- [ ] Optimistic updates
- [ ] Visual tests

**Notes**: Can run in parallel with STORY-8, STORY-9

---

### **GATE-3: E2E Test Validation** ⚠️
**Status**: ⏳ Awaiting STORY-8, STORY-9 completion
**Reviewer**: Main Claude Session
**Criteria**:
- All E2E tests passing
- Integration verified
- No regressions found
- Ready for cleanup

---

### **STORY-11: Code Cleanup & Migration**
**Agent**: `frontend-dev`
**Status**: ⏳ Pending
**Linear Issue**: [2S6-68](https://linear.app/2s6y/issue/2S6-68)
**Duration**: 2 hours
**Dependencies**: GATE-3 approved

**Objectives**:
- Remove old modal wizard components
- Remove old test files
- Update dashboard to use new route
- Clean up unused types/utilities
- Update documentation
- Verify no regressions

**Files to DELETE**:
- `components/groups/CreateGroupWizard.tsx`
- `components/groups/CreateGroupModal.tsx`
- `components/groups/wizard/WizardContext.tsx`
- `components/groups/wizard/BasicInfoStep.tsx`
- `components/groups/wizard/AppearanceStep.tsx`
- `components/groups/wizard/PromptsSetupStep.tsx`
- `components/groups/wizard/WizardProgress.tsx`
- `types/wizard.ts` (if unused)
- `tests/e2e/group-creation-wizard.spec.ts`
- `tests/components/CreateGroupWizard.integration.spec.ts`

**Files to UPDATE**:
- `app/dashboard/page.tsx`

**Deliverables**:
- [ ] All old code removed
- [ ] Dashboard updated
- [ ] No broken imports
- [ ] Documentation updated
- [ ] Tests still passing

**Notes**: Final cleanup - ensure zero redundancy

---

## 📈 Execution Timeline

| Day | Phase | Stories | Hours |
|-----|-------|---------|-------|
| Day 1 AM | Phase 1 | STORY-1 + GATE-1 | 2-3 hours |
| Day 1 PM | Phase 2 Start | STORY-2, STORY-3-7 (parallel) | ~2-3 hours |
| Day 2 AM | Phase 2 Complete + GATE-2 | Complete parallel work | ~1-2 hours |
| Day 2 PM | Phase 3 | STORY-8, STORY-9, STORY-10 (parallel) + GATE-3 | ~2-3 hours |
| Day 3 AM | Phase 4 | STORY-11 + PR creation | 2 hours |
| **TOTAL** | | **11 Stories** | **~10-12 hours** |

---

## 🎯 Success Metrics

### Completion Criteria
- [ ] All 11 stories marked "Done" in Linear
- [ ] All review gates passed
- [ ] E2E tests 100% passing
- [ ] Old wizard code removed
- [ ] GitHub PR created and reviewed
- [ ] No console errors/warnings

### Quality Gates
- [ ] GATE-1: UX specs approved
- [ ] GATE-2: Contracts verified
- [ ] GATE-3: E2E tests passing

---

## 📝 Notes

- Stories 3-7 can run in parallel after GATE-1
- Stories 8-10 can run in parallel after GATE-2
- Each gate is a blocking checkpoint
- All Linear issues created (2S6-58 through 2S6-68)
- GitHub branch: `feature/group-creation-full-page`

---

**Last Updated**: 2025-10-25
**Next Step**: Execute STORY-1 (UX Design Review)
