# Frontend Component Props Contract - Group Creation Wizard

**Project:** Group Creation Wizard
**Version:** 1.0.0
**Last Updated:** 2025-10-11

---

## Purpose

This contract defines the React component interfaces, props, and state management for the Group Creation Wizard. All components follow DaisyUI + Tailwind CSS design system.

---

## Component Hierarchy

```
CreateGroupWizard (Main Container)
├── WizardProgress (Progress Indicator)
└── Steps (Conditionally Rendered)
    ├── BasicInfoStep (Step 1)
    ├── AppearanceStep (Step 2)
    ├── PromptsSetupStep (Step 3)
    │   └── PromptTypeSelector (Dropdown)
    ├── MembersStep (Step 4)
    └── ReviewStep (Final Summary)
```

---

## 1. CreateGroupWizard (Main Container)

**File:** `components/groups/CreateGroupWizard.tsx`

**Props:**
```typescript
interface CreateGroupWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (groupId: Id<"groups">) => void;
}
```

**State:**
```typescript
interface WizardState {
  currentStep: 1 | 2 | 3 | 4 | 5;  // 5 = review step

  formData: {
    // Step 1: Basic Info
    name: string;
    meta: string;          // Auto-generated from name, editable
    description: string;   // Optional

    // Step 2: Appearance
    avatarFile: File | null;
    avatarPreview: string | null;
    avatarStorageId: string | null;  // After upload
    coverFile: File | null;
    coverPreview: string | null;
    coverStorageId: string | null;   // After upload

    // Step 3: Prompts (Map for O(1) lookup)
    prompts: Map<number, {
      promptText: string;
      promptType: "text" | "media" | "audio";
      isActive: boolean;
    }>;

    // Step 4: Members
    memberEmails: string[];
    generateInviteLink: boolean;
  };

  errors: {
    name?: string;
    meta?: string;
    description?: string;
    prompts?: Map<number, string>;  // Error per prompt
    memberEmails?: string;
  };

  isSubmitting: boolean;
}
```

**Methods:**
```typescript
interface WizardMethods {
  goToStep: (step: number) => void;
  goNext: () => void;
  goBack: () => void;
  canProceed: () => boolean;         // Validates current step
  handleSubmit: () => Promise<void>; // Final submission
}
```

**Behavior:**

1. **Step Navigation:**
   - "Next" button calls `goNext()` → validates current step → increments `currentStep`
   - "Back" button calls `goBack()` → decrements `currentStep`
   - Step 2 (Appearance) can be skipped → "Skip" button jumps to Step 3

2. **Validation Rules:**
   - **Step 1:** `name` required (1-50 chars), `meta` URL-safe (1-30 chars)
   - **Step 2:** No validation (optional)
   - **Step 3:** At least 3 active prompts, each text max 500 chars
   - **Step 4:** If emails provided, validate format

3. **Submission Flow:**
   ```typescript
   handleSubmit() {
     1. Upload avatar (if provided) → get storageId
     2. Upload cover (if provided) → get storageId
     3. Call createGroupWithSettings with all formData
     4. On success: Close wizard, call onSuccess(groupId)
     5. On error: Show error alert, stay on current step
   }
   ```

4. **Auto-Save (Optional):**
   - Save `formData` to localStorage on every change
   - Restore on wizard open (if draft exists)

---

## 2. WizardProgress (Progress Indicator)

**File:** `components/groups/wizard/WizardProgress.tsx`

**Props:**
```typescript
interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;  // Always 5 (4 steps + review)
  steps: Array<{
    number: number;
    title: string;
    isComplete: boolean;
  }>;
}
```

**UI Design:**
```
Step 1: Basic Info → Step 2: Appearance → Step 3: Prompts → Step 4: Members → Review
  [●]──────────────[○]────────────────[○]──────────────[○]─────────[○]

Active step: Primary color badge
Complete steps: Success color badge with checkmark
Future steps: Gray badge
```

**DaisyUI Classes:**
- Active: `badge badge-primary badge-lg`
- Complete: `badge badge-success badge-lg`
- Future: `badge badge-ghost badge-lg`

---

## 3. BasicInfoStep (Step 1)

**File:** `components/groups/wizard/BasicInfoStep.tsx`

**Props:**
```typescript
interface BasicInfoStepProps {
  formData: {
    name: string;
    meta: string;
    description: string;
  };
  errors: {
    name?: string;
    meta?: string;
    description?: string;
  };
  onChange: (field: string, value: string) => void;
}
```

**UI Fields:**

1. **Group Name** (Required)
   - Input: `text`
   - Max length: 50 chars
   - Counter: `{name.length}/50`
   - Auto-generates `meta` on change (debounced 300ms)

2. **Group ID** (Auto-generated, Editable)
   - Input: `text`
   - Max length: 30 chars
   - Pattern: Only lowercase letters, numbers, dashes
   - Help text: "This will be used in your group's URL"
   - Preview: `https://yourapp.com/groups/{meta}`

3. **Description** (Optional)
   - Textarea: 3 rows
   - Max length: 200 chars
   - Counter: `{description.length}/200`
   - Help text: "Shown to members when they join"

**Validation:**
- On blur: Validate name (required, 1-50 chars)
- On blur: Validate meta (URL-safe, 1-30 chars)
- On change: Auto-fix meta (replace spaces with dashes, remove special chars)

---

## 4. AppearanceStep (Step 2)

**File:** `components/groups/wizard/AppearanceStep.tsx`

**Props:**
```typescript
interface AppearanceStepProps {
  formData: {
    avatarFile: File | null;
    avatarPreview: string | null;
    coverFile: File | null;
    coverPreview: string | null;
  };
  onAvatarChange: (file: File | null) => void;
  onCoverChange: (file: File | null) => void;
}
```

**UI Fields:**

1. **Group Avatar** (Optional)
   - File input: `accept="image/*"`
   - Preview: 128x128px circle
   - Recommended size: "512x512px (square)"
   - Remove button: Clears file

2. **Group Cover** (Optional)
   - File input: `accept="image/*"`
   - Preview: Full width, 200px height
   - Recommended size: "1500x500px (landscape)"
   - Remove button: Clears file

3. **Skip Button** (Prominent)
   - Text: "Skip for now (add later in settings)"
   - Styling: `btn btn-ghost`

**File Upload Logic:**
```typescript
onAvatarChange(file) {
  1. Validate: max 5MB, image type
  2. Generate preview: FileReader.readAsDataURL
  3. Store file in state (upload happens on final submit)
}
```

**DaisyUI Classes:**
- Avatar preview: `avatar` + `rounded-full`
- Cover preview: `w-full h-48 object-cover`
- File input: `file-input file-input-bordered`

---

## 5. PromptsSetupStep (Step 3)

**File:** `components/groups/wizard/PromptsSetupStep.tsx`

**Props:**
```typescript
interface PromptsSetupStepProps {
  prompts: Map<number, {
    promptText: string;
    promptType: "text" | "media" | "audio";
    isActive: boolean;
  }>;
  errors: Map<number, string>;
  onPromptChange: (promptNumber: number, field: string, value: any) => void;
  onReorder: (newOrder: number[]) => void;
}
```

**UI Design:**

**Prompt List (Drag-to-Reorder):**
```
[Drag Icon] [1] What did you do this month?         [Text ▼] [Toggle: On]
[Drag Icon] [2] Photo Wall                          [Media ▼] [Toggle: On]
[Drag Icon] [3] One Good Thing                      [Text ▼] [Toggle: Off]
...
```

**Per Prompt:**
1. **Drag Handle** (6 horizontal lines icon)
2. **Prompt Number Badge** (`badge badge-primary`)
3. **Prompt Text** (Editable input, 500 chars max)
4. **Prompt Type Selector** (Dropdown: Text/Media/Audio)
5. **Active Toggle** (Checkbox or toggle switch)

**Validation:**
- At least 3 prompts must be active
- Prompt text max 500 chars
- Show error if < 3 active: "At least 3 prompts must be enabled"

**Drag-Drop:**
- Use `@dnd-kit/core` (already used in `PromptListSection`)
- Reorder by dragging
- Visual feedback: Opacity 0.5 while dragging

---

## 6. PromptTypeSelector (Dropdown)

**File:** `components/groups/wizard/PromptTypeSelector.tsx`

**Props:**
```typescript
interface PromptTypeSelectorProps {
  value: "text" | "media" | "audio";
  onChange: (type: "text" | "media" | "audio") => void;
  disabled?: boolean;
}
```

**UI Design:**

**Dropdown Options:**
```
Text   - Members type text responses
Media  - Members upload photos/videos
Audio  - Members record voice notes
```

**DaisyUI Classes:**
- Dropdown: `dropdown dropdown-end`
- Button: `btn btn-sm btn-ghost`
- Menu: `dropdown-content menu bg-base-100 rounded-box`

**Tooltip on Hover:**
- Text: "Free-form text response (up to 800 characters)"
- Media: "Upload up to 4 photos or videos"
- Audio: "Record a voice note (up to 3 minutes)"

---

## 7. MembersStep (Step 4)

**File:** `components/groups/wizard/MembersStep.tsx`

**Props:**
```typescript
interface MembersStepProps {
  formData: {
    memberEmails: string[];
    generateInviteLink: boolean;
  };
  errors: {
    memberEmails?: string;
  };
  onChange: (field: string, value: any) => void;
}
```

**UI Fields:**

1. **Add Members by Email**
   - Textarea: 4 rows
   - Placeholder: "Enter email addresses (comma or newline separated)"
   - Example: `alice@example.com, bob@example.com`
   - Validation: Email format, no duplicates
   - Help text: "These members will be added directly (no approval needed)"

2. **Generate Invite Link** (Checkbox)
   - Label: "Generate a shareable invite link"
   - Help text: "Anyone with this link can request to join (requires your approval)"
   - Default: `true`

3. **Privacy Notice** (Info Alert)
   - Badge: `alert alert-info`
   - Text: "Direct email invites bypass approval. Link-based joins require admin approval."

**Validation:**
- Split emails by comma or newline
- Trim whitespace
- Validate each email format
- Show error: "Invalid email: {email}"

---

## 8. ReviewStep (Final Summary)

**File:** `components/groups/wizard/ReviewStep.tsx`

**Props:**
```typescript
interface ReviewStepProps {
  formData: WizardState['formData'];
  onEdit: (step: number) => void;  // Go back to edit a specific step
}
```

**UI Design:**

**Summary Card Sections:**

1. **Basic Info**
   - Group Name: {name}
   - Group ID: {meta}
   - Description: {description || "None"}
   - Edit button → `onEdit(1)`

2. **Appearance**
   - Avatar: Preview thumbnail (or "Not set")
   - Cover: Preview thumbnail (or "Not set")
   - Edit button → `onEdit(2)`

3. **Prompts** ({activeCount}/5 active)
   - List of active prompts with types
   - Example: "1. What did you do this month? (Text)"
   - Edit button → `onEdit(3)`

4. **Members**
   - Email count: "{memberEmails.length} members"
   - Invite link: "Yes" or "No"
   - Edit button → `onEdit(4)`

**Submit Button:**
- Text: "Create Group"
- Styling: `btn btn-primary btn-lg btn-block`
- Loading state: `<span className="loading loading-spinner"></span> Creating...`

---

## State Management

### Approach: React Context

**File:** `components/groups/wizard/WizardContext.tsx`

```typescript
interface WizardContextValue {
  state: WizardState;
  methods: WizardMethods;
}

export const WizardContext = createContext<WizardContextValue>();

export function WizardProvider({ children }) {
  const [state, setState] = useState<WizardState>(initialState);

  const methods = {
    goToStep: (step) => setState({ ...state, currentStep: step }),
    goNext: () => {...},
    goBack: () => {...},
    canProceed: () => {...},
    handleSubmit: async () => {...},
  };

  return (
    <WizardContext.Provider value={{ state, methods }}>
      {children}
    </WizardContext.Provider>
  );
}
```

**Usage in Steps:**
```typescript
function BasicInfoStep() {
  const { state, methods } = useContext(WizardContext);
  // Access formData, errors, onChange
}
```

---

## Design System Compliance

### Required DaisyUI Components

- **Modal:** `modal modal-open modal-box`
- **Progress:** Custom progress indicator (badges + connecting lines)
- **Inputs:** `input input-bordered`, `textarea textarea-bordered`, `file-input file-input-bordered`
- **Buttons:** `btn btn-primary`, `btn btn-ghost`, `btn btn-outline`
- **Badges:** `badge badge-primary`, `badge badge-success`, `badge badge-ghost`
- **Alerts:** `alert alert-info`, `alert alert-error`
- **Toggle:** `toggle toggle-primary`
- **Dropdown:** `dropdown dropdown-end`

### Color Tokens (from design system)

- Primary: `#a442fe` (DaisyUI `primary`)
- Accent: `#80e4e4` (DaisyUI `accent`)
- Base: `#f8f2ed` (DaisyUI `base-100`)
- Error: DaisyUI `error`
- Success: DaisyUI `success`

### Spacing (from design system)

- Use system scale: `gap-2`, `gap-4`, `gap-6`, `p-4`, `p-6`, `mb-4`, `mt-6`
- NO arbitrary values: ❌ `gap-[13px]`, ✅ `gap-4`

---

## Responsive Breakpoints

### Mobile (< 768px)
- Full-screen modal
- Single column layout
- Progress indicator: Vertical list

### Tablet (768px - 1024px)
- Modal: 80% width
- Two-column layout for review step

### Desktop (> 1024px)
- Modal: Max 800px width
- Two-column layout for review step
- Side-by-side avatar/cover preview

---

## Testing Requirements

### Component Tests (Playwright)

**File:** `tests/e2e/group-creation-wizard.spec.ts`

**Coverage:**
- [ ] Wizard opens and shows Step 1
- [ ] Step 1: Name validation (required)
- [ ] Step 1: Meta auto-generates from name
- [ ] Step 1: Meta editable and validates URL-safe
- [ ] Step 2: Avatar upload + preview
- [ ] Step 2: Cover upload + preview
- [ ] Step 2: Skip button works
- [ ] Step 3: Edit prompt text
- [ ] Step 3: Change prompt type dropdown
- [ ] Step 3: Toggle active/inactive
- [ ] Step 3: Drag to reorder prompts
- [ ] Step 3: Validation (min 3 active)
- [ ] Step 4: Add emails (comma-separated)
- [ ] Step 4: Email validation
- [ ] Step 4: Generate invite link checkbox
- [ ] Review: Summary shows all data
- [ ] Review: Edit buttons navigate back
- [ ] Submit: Creates group successfully
- [ ] Navigation: Back/Next buttons

### Visual Regression (Playwright Screenshots)

**Breakpoints:** 375px, 768px, 1440px

**Pages:**
- [ ] Step 1 (empty state)
- [ ] Step 1 (filled state)
- [ ] Step 2 (with preview)
- [ ] Step 3 (prompt list)
- [ ] Step 4 (emails entered)
- [ ] Review (full summary)

---

## Implementation Notes for Frontend Agent

### Reusable Logic

**From Existing Components:**
1. **Image Upload:** Copy from `AppearanceSection.tsx`
2. **Drag-Drop:** Copy from `PromptListSection.tsx` (@dnd-kit)
3. **Email Validation:** Copy from `InviteSection.tsx`

### File Structure

```
components/groups/
├── CreateGroupWizard.tsx          (Main container)
├── wizard/
│   ├── WizardContext.tsx          (State management)
│   ├── WizardProgress.tsx         (Progress indicator)
│   ├── BasicInfoStep.tsx          (Step 1)
│   ├── AppearanceStep.tsx         (Step 2)
│   ├── PromptsSetupStep.tsx       (Step 3)
│   ├── PromptTypeSelector.tsx     (Dropdown component)
│   ├── MembersStep.tsx            (Step 4)
│   └── ReviewStep.tsx             (Final summary)
```

### Performance Optimizations

- Debounce meta auto-generation (300ms)
- Memoize step components (React.memo)
- Lazy load review step (only when reached)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-10-11 | Initial contract created |

---

**Contract Owner:** Frontend Agent
**Consumers:** Integration Agent (Stories B1-B6)
**Review Status:** ✅ Ready for Implementation
