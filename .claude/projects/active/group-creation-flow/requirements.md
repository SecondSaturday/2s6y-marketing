# Group Creation Flow - Requirements Document

**Project**: Group Creation Flow Rebuild
**Type**: UEDS Parallel Development
**Timeline**: 2-3 days (Standard priority)
**Status**: In Progress
**Created**: 2025-10-25

---

## 📋 Vision Statement

Create a **visually beautiful, seamless full-page group creation experience** that emphasizes the **Second Saturday ritual** - meaningful monthly connections through smart defaults and minimal required input.

---

## 🚪 Entry Points

### 1. Primary Entry (Existing Users)
- **Location**: Dashboard → Top right options dropdown
- **Action**: Click "Create New Group"
- **Behavior**: Navigate immediately to `/create-group` (no confirmation)

### 2. Empty State Entry (New Users)
- **Location**: Dashboard main area (where groups list would appear)
- **UI**: Two centered buttons when user has no groups:
  - **Primary**: "Create a Group" (emphasized)
  - **Secondary**: "Join a Group"
- **Behavior**: Click "Create a Group" → Navigate to `/create-group`

---

## 📄 Page Structure

### Route
- **URL**: `/create-group`
- **Type**: Full dedicated page (NOT modal)
- **Layout**: Clean, spacious, visually appealing

### Flow (4 screens total)

#### **Screen 0: Welcome/Intro**
- Brief explanation of 2Sat-lite ritual
- "Every second Saturday, connect meaningfully with people who matter"
- Visually appealing hero section
- CTA: "Get Started" → Navigate to Step 1

#### **Step 1: Basic Info**
- Group name (mandatory, 1-50 chars)
- Group ID/meta (auto-generated from name, editable, unique validation)
- Description (optional, max 200 chars)
- Avatar (pre-filled with random meme, changeable)
- Banner (pre-filled with gradient, changeable)

#### **Step 2: Prompts**
- 5 default prompts pre-filled
- Users can edit prompt text and type
- Each prompt shows type selector (text/media/audio)
- Visual prompt cards with emoji

#### **Step 3: Members**
- Add member emails (comma/newline separated, optional)
- Auto-generated invite code displayed (8 chars, unique)
- Option to copy invite link
- **Submit button here** (not separate page)

### Progress Indicator
- Visual stepper (numbered circles with step labels)
- Steps: "Welcome" → "Basic Info" → "Prompts" → "Members"
- Show current step, allow navigation back

---

## ✅ Required vs Optional Fields

### Mandatory
- **Group name** only (1-50 characters)

### Optional (user can skip)
- Description
- Custom group ID (auto-generated if not customized)
- Member emails
- Custom prompts (defaults provided)
- Custom avatar (default meme provided)
- Custom banner (default gradient provided)

### Auto-Generated Defaults

| Field | Default | Editable? | Notes |
|-------|---------|-----------|-------|
| Group ID | Generated from name | ✅ Yes | Must be unique, 1-30 chars, URL-safe |
| Avatar | Random meme (API) | ✅ Yes | Never blank, always has image |
| Banner | Gradient/mesh | ✅ Yes | Simple, changeable |
| Prompts | 5 defaults | ✅ Yes | Pre-filled, editable |
| Invite Code | Random 8-char code | ❌ No | Auto-generated, unique |

---

## 🎨 Default Assets

### Avatar
- **Source**: External meme API (e.g., meme-api.com or similar)
- **Fetch timing**: On page load (Step 1)
- **Fallback**: If API fails, use generated placeholder (dicebear or similar)
- **Behavior**: User sees random meme, can click to upload custom image

### Banner
- **Type**: Client-side generated gradient/mesh
- **Style**: Soft mesh gradient (aesthetic, not garish)
- **Colors**: Use DaisyUI cupcake theme colors (primary, secondary, accent)
- **Behavior**: User sees gradient, can click to upload custom image

---

## 📝 Default Prompts

| # | Prompt Text | Type | Notes |
|---|-------------|------|-------|
| 1 | This month I... | `text` | Open-ended reflection |
| 2 | 📸 Photo Wall | `media` | Visual sharing |
| 3 | One good thing from last month | `text` | Gratitude/positivity |
| 4 | This has been on my mind | `text` | Deeper thoughts |
| 5 | 🎵 Something I have been listening to | `text` | Music/media sharing |

**Prompt Types Available** (from schema):
- `text` - Text-only responses
- `media` - Image/video uploads
- `audio` - Audio recordings

---

## 💬 Second Saturday Ritual Messaging

### Intro Screen (Welcome)
- **Primary message**: "Every second Saturday, connect with people who matter"
- **Secondary**: "Create a group, set prompts, and get monthly newsletters"
- **Tone**: Warm, inviting, not preachy

### Throughout Flow (Subtle)
- **Step 1**: Small helper text - "Your group will connect monthly on the 2nd Saturday"
- **Step 2**: "These prompts will guide your monthly check-ins"
- **Step 3**: "Invite friends to join your monthly ritual"
- **Avoid**: Over-explaining, being repetitive, corporate jargon

### Philosophy
- Emphasize **consistency** (monthly cadence)
- Emphasize **meaningfulness** (deeper connections)
- Don't overdo it - users already know what they're signing up for

---

## 🎯 Validation Rules

### Group Name
- Required, 1-50 characters
- Any characters allowed (including special chars, emoji)

### Group ID/Meta
- Auto-generated from name (lowercase, hyphens, numbers only)
- Editable by user
- **Must be unique** (validate against existing groups)
- 1-30 characters, URL-safe pattern: `^[a-z0-9-]+$`

### Description
- Optional, max 200 characters

### Emails (Members)
- RFC-compliant email regex
- Comma or newline separated
- No limit on number (subscription limits handled by backend)

### Prompts
- 1-5 prompts allowed
- Each prompt: max 500 characters
- Each prompt must have a type (text/media/audio)

---

## ⚙️ Backend Integration

### Mutation to Use
- **Primary**: `createGroupWithSettings()` (convex/groups/mutations.ts:565-869)
- Already supports batch operation:
  - Create group
  - Add creator as admin
  - Set custom prompts
  - Invite members by email
  - Generate invite code

### Required Backend Enhancements (STORY-2)
- Add `checkGroupIdUniqueness(id: string)` query for real-time validation
- Add description parameter support to `createGroupWithSettings`
- Create `updateGroupDescription(groupId, description)` mutation for settings page
- Export default prompts as constant

### Validation on Backend
- Subscription limits (max 5 groups created per user)
- Member limits (max 20 members per group)
- Unique group ID validation

---

## 🎨 Design Requirements (Match Settings Page)

### DaisyUI Components to Use

- **Cards** - `card`, `card-body` for section wrappers
- **Inputs** - `input`, `input-bordered` for text fields
- **Buttons** - `btn-primary`, `btn-ghost`, `btn-error` with sizes
- **Badges** - `badge-primary`, `badge-accent` for status indicators
- **Alerts** - `alert-success`, `alert-error`, `alert-info` for messages
- **File Upload** - Custom styled `input[type="file"]` with preview
- **Progress Stepper** - Custom component (numbered circles + labels)

### Visual Aesthetics
- **Full-page layout**: Spacious, not cramped
- **DaisyUI cupcake theme**: Use existing design tokens
- **Typography**: Clear hierarchy, readable
- **Spacing**: Generous padding/margins
- **Colors**: Cohesive with existing design system
- **Images**: Avatar/banner prominently displayed

### Responsive
- Desktop-first (optimize for larger screens)
- Still functional on tablet/mobile
- Images scale appropriately

---

## 🔄 Consistency with Settings Page

### Fields Must Match Settings Page

| Field | Creation | Settings | Status |
|-------|----------|----------|--------|
| Group Name | ✅ Required | ✅ Editable (admin) | ✅ Match |
| Group ID/Meta | ✅ Editable (creation only) | ❌ Immutable | ⚠️ Expected |
| Description | ✅ Optional | ✅ Editable (admin) | ✅ Match |
| Avatar | ✅ Random meme | ✅ Upload/remove | ✅ Match |
| Cover/Banner | ✅ Gradient | ✅ Upload/remove | ✅ Match |
| Prompts (5x) | ✅ Defaults | ✅ Edit/reorder/toggle | ✅ Match |
| Members | ✅ Email invite | ✅ Manage/invite | ✅ Match |
| Invite Code | ✅ Auto-generate | ✅ Generate link | ✅ Match |

### Image Upload Specifications (From Settings)

#### Avatar Upload
```typescript
Accept: "image/png, image/jpeg, image/jpg, image/gif, image/webp"
Max Size: 5MB
Recommended: Square (e.g., 400x400px)
Storage: Convex file storage (upload via mutation)
Preview: Client-side FileReader before upload
Fallback: Letter avatar ("G" for group name)
```

#### Cover Upload
```typescript
Accept: "image/png, image/jpeg, image/jpg, image/gif"
Max Size: 10MB
Recommended: 1200x400px (landscape)
Storage: Convex file storage
Preview: Client-side FileReader before upload
Fallback: Placeholder gradient/icon
```

---

## ✨ Post-Creation Behavior

### On Successful Creation
1. Close/leave `/create-group` page
2. Navigate to `/groups/[newGroupId]/issues/[currentMonth]`
3. Show success toast/notification
4. Group auto-selected in dashboard
5. User sees their new group immediately

### On Error
- Stay on `/create-group` page
- Display error message
- Preserve form state (don't lose user input)
- Allow user to fix and retry

---

## 🧹 Code Cleanup (Critical)

### Files to DELETE After New Implementation
```
components/groups/CreateGroupWizard.tsx
components/groups/CreateGroupModal.tsx
components/groups/wizard/WizardContext.tsx
components/groups/wizard/BasicInfoStep.tsx
components/groups/wizard/AppearanceStep.tsx
components/groups/wizard/PromptsSetupStep.tsx
components/groups/wizard/WizardProgress.tsx
types/wizard.ts (if unused elsewhere)
tests/e2e/group-creation-wizard.spec.ts (old version)
tests/components/CreateGroupWizard.integration.spec.ts (old version)
```

### What to Keep/Reuse
- **Backend mutations**: Keep all (already good)
- **Validation logic**: Reuse email regex, name validation
- **Utility functions**: Meta ID generation, prompt helpers
- **Types**: Keep schema types, create new types for new wizard

### Goal
- **Zero redundancy**: No old modal code lingering
- **Clean codebase**: Only new full-page implementation
- **Fresh start**: Build with your vision, not constrained by old code

---

## 📊 Success Criteria

### Functional
- [ ] User can create group with just a name (minimal input)
- [ ] Defaults populate automatically (avatar, banner, prompts)
- [ ] Group ID is unique and validated in real-time
- [ ] Members can be invited via email
- [ ] Invite code auto-generated and copyable
- [ ] Redirects to new group page after creation
- [ ] Description editable in both creation AND settings
- [ ] Old wizard code completely removed

### Visual/UX
- [ ] Full-page experience (not modal)
- [ ] Visually beautiful (within DaisyUI design system)
- [ ] Progress indicator clear and functional
- [ ] Second Saturday messaging present but subtle
- [ ] Seamless, spacious layout
- [ ] Smooth navigation between steps
- [ ] UX-reviewer approved design

### Technical
- [ ] Uses existing `createGroupWithSettings()` mutation
- [ ] Proper error handling and validation
- [ ] Subscription limits respected
- [ ] Comprehensive E2E tests (100% passing)
- [ ] No console errors or warnings
- [ ] Clean, maintainable code
- [ ] Linear issues all marked "Done"
- [ ] GitHub PR created

---

## ⚠️ Review Gates (3 Total)

### GATE-1: UX Design Approval (After STORY-1)
- User reviews `ux-specifications.md`
- Approves visual design, component choices, accessibility plan
- **Blocker**: No frontend work starts until approved

### GATE-2: Contract Review (After STORY-2, STORY-3-7)
- Review backend contracts
- Verify frontend components align
- Check for integration issues
- **Blocker**: No integration work until verified

### GATE-3: E2E Test Validation (After STORY-8, STORY-9)
- All E2E tests passing
- Integration verified
- No regressions found
- **Blocker**: No cleanup until tests green

---

## 🛠️ External Dependencies

### APIs
- **Meme API**: Random meme avatar generation
  - Option 1: https://meme-api.com/gimme
  - Option 2: https://api.imgflip.com/get_memes
  - Fallback: DiceBear Avatars (https://dicebear.com/)

### Libraries (May Need Installation)
- **@dnd-kit/core**, **@dnd-kit/sortable** - Already used in settings for prompt reordering
- **Zustand** or **React Context** - State management for wizard
- **react-hot-toast** - Already used in settings for notifications

---

## 📝 Notes

- Group ID/meta is **immutable after creation** (can only be set during creation)
- Description is **editable in both creation and settings** (STORY-10 adds to settings)
- UX-reviewer involvement is **critical** before building (GATE-1)
- All design must match existing settings page aesthetics
- Testing is mandatory before cleanup (GATE-3)

---

**Last Updated**: 2025-10-25
**Status**: Requirements Finalized, Ready for Execution
