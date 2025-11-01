# Group Creation Wizard - UEDS Project

**Project Type:** Feature Enhancement (Multi-Step User Flow)
**Estimated Duration:** 6-8 hours sequential / 3-4 hours parallel
**Status:** 🟡 Planning Phase
**Created:** 2025-10-11
**Owner:** Product Team + Agentic Framework

---

## 🎯 Project Overview

### What We're Building

A **4-step wizard** that replaces the current single-modal group creation flow with a comprehensive, user-friendly group setup experience.

**Current State (Single Modal)**:
- Group name + member emails only
- No customization during creation
- Users must navigate to settings to customize prompts, appearance, etc.

**Target State (4-Step Wizard)**:
1. **Basic Info**: Name, editable ID, optional description
2. **Appearance**: Upload avatar + cover (optional, can skip)
3. **Prompts Setup**: Customize 3-5 prompts with type selection (text/media/audio)
4. **Members & Invite**: Add emails + generate shareable invite link

### Why UEDS for This Project?

**Complexity Justification**:
- **9 stories** across 3 tracks (Backend, Integration, Frontend)
- **3+ independent parallelizable stories** (backend schema + frontend wizard + integration)
- **Clear API contracts** can be defined upfront (createGroupWithSettings mutation)
- **Estimated 8+ hours sequential** → **3-4 hours parallel** (50% time reduction)

**Parallelization Strategy**:
- **Phase 1**: Backend schema (A1) + Frontend wizard shell (C1) run simultaneously
- **Phase 2**: Backend batch mutation (A2) + Frontend step components (C2-C5) in parallel
- **Phase 3**: Integration (B1-B6) connects layers after Phase 1+2 complete

---

## 📋 Success Criteria

### Must-Have (POC Scope)

#### User Experience
- [ ] User can create a group in 4 intuitive steps
- [ ] Progress indicator shows current step (1/4, 2/4, etc.)
- [ ] User can navigate back/forward between steps
- [ ] User can skip optional steps (Appearance)
- [ ] Group ID auto-generates from name but is editable
- [ ] At least 3 prompts configured (default or custom)
- [ ] Direct email invites + shareable link generated

#### Technical Requirements
- [ ] All API contracts defined before implementation
- [ ] Backend mutations support batch operations (single transaction)
- [ ] Frontend wizard preserves state across steps
- [ ] Schema changes are backward compatible
- [ ] Existing group creation flow still works (modal fallback)

#### Testing
- [ ] E2E test covers full wizard flow (4 steps)
- [ ] Unit tests for all new mutations (convex-test)
- [ ] Visual regression tests for wizard UI (Playwright)
- [ ] Join request approval flow tested

#### Privacy & Permissions
- [ ] Semi-private mode: Link-based joins require admin approval
- [ ] Direct email invites bypass approval (added immediately)
- [ ] Only group creator gets admin role during creation

### Nice-to-Have (Future Enhancement)

- [ ] Auto-save wizard state to localStorage (resume later)
- [ ] Smart prompt suggestions based on group name
- [ ] Preview mode: Show contribution form preview before finalizing
- [ ] Welcome email auto-sent on group creation
- [ ] Bulk member upload (CSV import)

---

## 🏗️ Architecture Overview

### Schema Changes

#### `groupPrompts` Table Extension (✅ ALREADY COMPLETED - STORY-A1)
```typescript
groupPrompts: {
  // Existing fields
  groupId: Id<"groups">,
  promptNumber: number,
  promptText: string,
  isActive: boolean,
  displayOrder: number,
  createdAt: number,
  updatedAt: number,

  // NEW FIELD
  promptType: "text" | "media" | "audio" // ✅ Added in STORY-A1
}
```

#### No Other Schema Changes Required ✅
All necessary tables already exist:
- `groups` has `meta` (editable ID), `groupImage`, `coverImage`
- `invites` supports email + code-based invitations
- `joinRequests` supports admin approval flow
- `groupMembers` supports role assignment (admin/member)

### API Contracts

#### Backend Mutations (Track A)

**NEW: `createGroupWithSettings`**
```typescript
Input: {
  // Step 1: Basic Info
  name: string;
  meta?: string; // Auto-generated if not provided
  description?: string;

  // Step 2: Appearance (optional)
  avatarStorageId?: string;
  coverStorageId?: string;

  // Step 3: Prompts (array of customizations)
  prompts: Array<{
    promptNumber: number;
    promptText: string;
    promptType: "text" | "media" | "audio";
    isActive: boolean;
  }>;

  // Step 4: Members
  memberEmails: string[];
  generateInviteLink: boolean;
}

Output: {
  groupId: Id<"groups">;
  inviteCode?: string; // If generateInviteLink = true
  inviteUrl?: string; // Full URL
  message: string;
}
```

**UPDATED: `setGroupPrompt`** (✅ ALREADY UPDATED - STORY-A1)
- Now accepts `promptType` parameter

#### Frontend Components (Track C)

**NEW: `CreateGroupWizard`**
```typescript
Props: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (groupId: Id<"groups">) => void;
}

State: {
  currentStep: 1 | 2 | 3 | 4;
  formData: {
    // Step 1
    name: string;
    meta: string;
    description?: string;

    // Step 2
    avatarFile?: File;
    coverFile?: File;

    // Step 3
    prompts: Map<number, { text: string; type: string; active: boolean }>;

    // Step 4
    memberEmails: string[];
    generateLink: boolean;
  };
}
```

---

## 📊 Story Breakdown

### Track A: Backend (2 stories, 2 hours)

**Owner:** Backend Agent

| Story | Description | Time | Dependencies |
|-------|-------------|------|--------------|
| **A1** | Extend `groupPrompts` schema with `promptType` | 1h | None |
| **A2** | Create `createGroupWithSettings` batch mutation | 1h | A1 |

### Track B: Integration Layer (6 stories, 3 hours)

**Owner:** Frontend Agent (integration focus)

| Story | Description | Time | Dependencies |
|-------|-------------|------|--------------|
| **B1** | Wire Step 1 (Basic Info) to backend | 30m | A2, C2 |
| **B2** | Wire Step 2 (Appearance) to image upload | 30m | C3 |
| **B3** | Wire Step 3 (Prompts) to backend | 45m | A1, A2, C4 |
| **B4** | Wire Step 4 (Members) to invite system | 30m | C5 |
| **B5** | Implement wizard state management | 45m | C1 |
| **B6** | Add E2E tests for full wizard flow | 1h | B1-B4 |

### Track C: Frontend (5 stories, 3 hours)

**Owner:** Frontend Agent

| Story | Description | Time | Dependencies |
|-------|-------------|------|--------------|
| **C1** | Create `CreateGroupWizard` shell component | 45m | None |
| **C2** | Build Step 1: Basic Info UI | 30m | C1 |
| **C3** | Build Step 2: Appearance UI | 45m | C1 |
| **C4** | Build Step 3: Prompts Setup UI | 1h | C1, A1 |
| **C5** | Build Step 4: Members & Invite UI | 45m | C1 |

**Total Stories:** 13 (2 backend + 6 integration + 5 frontend)
**Estimated Sequential Time:** 8 hours
**Estimated Parallel Time:** 3-4 hours

---

## 🔄 Execution Phases

### Phase 1: Foundation (Parallel, 1 hour)

**Agents Running Simultaneously:**
- **Backend Agent** → STORY-A1 (schema extension)
- **Frontend Agent** → STORY-C1 (wizard shell)

**Output:** Schema ready + Wizard framework ready

### Phase 2: Core Implementation (Parallel, 1.5 hours)

**Agents Running Simultaneously:**
- **Backend Agent** → STORY-A2 (batch mutation)
- **Frontend Agent** → STORY-C2, C3 (Steps 1-2 UI)

**Output:** Backend API ready + First 2 wizard steps built

### Phase 3: Advanced Features (Parallel, 1.5 hours)

**Agents Running Simultaneously:**
- **Frontend Agent** → STORY-C4, C5 (Steps 3-4 UI)
- **Integration (Frontend Agent)** → STORY-B1, B2 (wire Steps 1-2)

**Output:** All 4 steps built + First 2 steps wired

### Phase 4: Integration & Testing (Sequential, 1 hour)

**Single Agent (Frontend - Integration Focus):**
- STORY-B3 (wire Step 3 - prompts) - 45m
- STORY-B4 (wire Step 4 - members) - 30m
- STORY-B5 (state management) - 45m
- STORY-B6 (E2E tests) - 1h

**Why Sequential?** Testing requires all components complete.

**Output:** Fully integrated wizard + passing E2E tests

---

## 🧪 Testing Strategy

### Unit Tests (Backend - convex-test)

**File:** `tests/unit/group-creation-batch.test.ts`

**Coverage:**
- [ ] `createGroupWithSettings` creates group successfully
- [ ] `createGroupWithSettings` handles invalid inputs
- [ ] `createGroupWithSettings` sets custom prompts
- [ ] `createGroupWithSettings` uploads avatar/cover
- [ ] `createGroupWithSettings` adds members
- [ ] `createGroupWithSettings` generates invite code
- [ ] Backward compatibility: old `createGroup` still works

### Integration Tests (Frontend - Playwright)

**File:** `tests/e2e/group-creation-wizard.spec.ts`

**Coverage:**
- [ ] Wizard opens from dashboard
- [ ] Step 1: Basic info validation (name required, ID editable)
- [ ] Step 2: Avatar upload + preview
- [ ] Step 2: Cover upload + preview
- [ ] Step 2: Skip appearance step
- [ ] Step 3: Edit prompt text
- [ ] Step 3: Change prompt type (text/media/audio)
- [ ] Step 3: Drag to reorder prompts
- [ ] Step 4: Add member emails (comma-separated)
- [ ] Step 4: Generate invite link
- [ ] Final: Review summary
- [ ] Final: Create group successfully
- [ ] Navigation: Back/forward between steps
- [ ] Error handling: Show validation errors

### Visual Regression Tests (Playwright)

**Screenshots Required (3 breakpoints each):**
- [ ] Wizard modal (all 4 steps) - desktop/tablet/mobile
- [ ] Prompt editor UI - desktop/tablet/mobile
- [ ] Review summary step - desktop/tablet/mobile

---

## 📦 Deliverables

### Code Files

#### Backend (`convex/`)
- [x] `schema.ts` - promptType field added (✅ STORY-A1 COMPLETE)
- [x] `prompts.ts` - setGroupPrompt updated (✅ STORY-A1 COMPLETE)
- [ ] `groups.ts` - createGroupWithSettings mutation

#### Frontend (`components/groups/`)
- [ ] `CreateGroupWizard.tsx` - Main wizard container
- [ ] `wizard/BasicInfoStep.tsx` - Step 1 UI
- [ ] `wizard/AppearanceStep.tsx` - Step 2 UI
- [ ] `wizard/PromptsSetupStep.tsx` - Step 3 UI
- [ ] `wizard/MembersStep.tsx` - Step 4 UI
- [ ] `wizard/ReviewStep.tsx` - Summary step
- [ ] `wizard/WizardProgress.tsx` - Progress indicator
- [ ] `wizard/PromptTypeSelector.tsx` - Dropdown for text/media/audio

#### Tests
- [x] `tests/unit/prompts-schema.test.ts` - promptType tests (✅ 9 tests passing)
- [ ] `tests/unit/group-creation-batch.test.ts` - Batch mutation tests
- [ ] `tests/e2e/group-creation-wizard.spec.ts` - E2E wizard tests

#### Documentation
- [ ] Update `.claude/CLAUDE.md` with "Existing Features Summary"
- [ ] Update `CHANGELOG.md` with feature addition
- [ ] Add wizard flow diagram to `/docs`

---

## 🚧 Risks & Mitigation

### Risk 1: State Management Complexity

**Risk:** Wizard state across 4 steps could become messy.

**Mitigation:**
- Use React Context for wizard state
- Validate each step before allowing "Next"
- Persist state to localStorage (auto-save draft)

### Risk 2: Image Upload During Creation

**Risk:** Large uploads could fail, blocking wizard completion.

**Mitigation:**
- Make Step 2 (Appearance) optional
- Allow users to skip and add images later in settings
- Show upload progress indicator

### Risk 3: Backward Compatibility

**Risk:** Existing group creation modal might break.

**Mitigation:**
- Keep `CreateGroupModal.tsx` as fallback
- Feature flag to toggle wizard vs modal
- Test both flows in CI/CD

### Risk 4: Prompt Type Confusion

**Risk:** Users might not understand "text" vs "media" vs "audio" prompt types.

**Mitigation:**
- Add tooltips/help text: "Media prompts show file upload in contribution form"
- Show preview of contribution form in Step 3
- Provide examples for each type

---

## 📈 Success Metrics

### User Metrics (Post-Launch)
- **Completion Rate:** % of users who finish all 4 steps
- **Time to Complete:** Average time to create a group
- **Prompt Customization Rate:** % of users who edit default prompts
- **Avatar Upload Rate:** % of users who add group avatar
- **Invite Link Usage:** % of groups using shareable link vs email-only

### Technical Metrics
- **E2E Test Pass Rate:** 100% (all wizard flows)
- **Unit Test Coverage:** 90%+ for new mutations
- **Performance:** Wizard loads in <1s
- **Error Rate:** <1% failed group creations

---

## 📝 Notes for Agents

### For Backend Agent (Stories A1, A2)

**Context Available:**
- Schema already extended with `promptType` (✅ STORY-A1 COMPLETE)
- Existing mutations: `createGroup`, `setGroupPrompt`, `updateGroupImage`, `updateGroupCover`
- Use `requireGroupAdminAccess` helper for auth checks

**Key Considerations:**
- `createGroupWithSettings` must be a **single transaction** (atomic)
- If any step fails (prompt creation, image upload, member add), rollback entire group creation
- Generate `meta` (group ID) from name if not provided: `name.toLowerCase().replace(/\s+/g, '-')`
- Default to "text" type for prompts if `promptType` not specified

### For Frontend Agent (Stories C1-C5, B1-B6)

**Context Available:**
- Existing components: `CreateGroupModal`, `PromptListSection`, `AppearanceSection`, `InviteSection`
- DaisyUI components: `modal`, `card`, `btn`, `input`, `textarea`, `file-input`, `badge`
- Design system: `.claude/core/design-system.md`

**Key Considerations:**
- Wizard must be responsive (mobile, tablet, desktop)
- Use existing upload logic from `AppearanceSection`
- Reuse drag-drop logic from `PromptListSection`
- Validate each step before enabling "Next" button
- Show loading states during image uploads

**Testing Requirements:**
- Take screenshots at 3 breakpoints (375px, 768px, 1440px)
- Verify design system compliance (no hardcoded colors/spacing)
- Write E2E test before marking integration stories complete

---

## 🔗 Related Documentation

- **Framework Guide:** `.claude/core/Framework.md`
- **UEDS Protocol:** `.claude/core/UEDS.md`
- **Design System:** `.claude/core/design-system.md`
- **Frontend Agent:** `.claude/core/agents/frontend.md`
- **Backend Agent:** `.claude/core/agents/backend.md`
- **Testing Guide:** `.claude/guides/testing.md`

---

## 📅 Timeline

**Target Completion:** 3-4 hours (parallel execution)

| Phase | Duration | Stories | Status |
|-------|----------|---------|--------|
| Phase 1 | 1h | A1 ✅, C1 | ✅ A1 Complete |
| Phase 2 | 1.5h | A2, C2, C3 | 🟡 Pending |
| Phase 3 | 1.5h | C4, C5, B1, B2 | 🟡 Pending |
| Phase 4 | 1h | B3, B4, B5, B6 | 🟡 Pending |

**Last Updated:** 2025-10-11
**Project Status:** 🟡 Planning Complete, Ready for Execution
