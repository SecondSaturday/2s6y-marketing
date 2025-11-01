# STORY-C1: Create CreateGroupWizard Shell Component

**Track:** C (Frontend)
**Agent:** frontend-dev
**Time Estimate:** 45 minutes
**Dependencies:** None
**Blocks:** STORY-C2, C3, C4, C5, STORY-B5
**Status:** 🟡 Pending
**Phase:** 1 (Parallel Execution - runs with STORY-A1)

---

## Context

Create the main wizard container with state management, step navigation, and progress indicator. This is the foundation for all wizard steps.

**Deliverables:**
- `CreateGroupWizard.tsx` - Main container
- `wizard/WizardContext.tsx` - State management
- `wizard/WizardProgress.tsx` - Progress indicator

---

## Tasks

1. Create wizard directory structure
2. Implement WizardContext with state management
3. Build CreateGroupWizard container with step routing
4. Build WizardProgress indicator component
5. Add navigation (Next/Back/Skip) logic
6. Write visual regression tests

---

## Component Specs

### CreateGroupWizard
- Props: `{ isOpen, onClose, onSuccess }`
- State: currentStep (1-5), formData, errors, isSubmitting
- Methods: goNext, goBack, goToStep, canProceed, handleSubmit

### WizardProgress
- Visual progress bar with 5 steps
- Active step highlighted
- Clickable to jump to steps (if already visited)

---

## Acceptance Criteria

- [ ] Wizard opens in modal
- [ ] Progress indicator shows current step
- [ ] Navigation buttons work (Next/Back)
- [ ] State persists across steps
- [ ] Modal can be closed
- [ ] Visual tests pass (3 breakpoints)

---

**Contract:** See `contracts/frontend-props.md`
**Time:** 45 minutes
