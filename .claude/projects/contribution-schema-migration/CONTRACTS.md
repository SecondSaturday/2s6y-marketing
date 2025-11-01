# API Contracts - Contribution Schema Migration

> **Contract-First Development**: Backend and Frontend teams agree on these contracts BEFORE implementation.
> **This enables parallel development** without integration surprises.

---

## 📋 Contract Overview

This document defines the exact API signatures that:
- **Backend MUST implement** (mutations, queries, helpers)
- **Frontend WILL consume** (in components, pages, forms)

**Any changes to these contracts require agreement from both Backend and Frontend agents.**

---

## 🔧 Backend Layer Contracts

### 1. Date Utilities (`lib/dateUtils.ts`)

**Purpose**: Calculate deadlines, validate timing, format countdowns

```typescript
/**
 * Calculate the edit deadline for a given month
 * Returns timestamp for 11:45 AM UTC on the 2nd Saturday
 *
 * @param month - Format: "YYYY-MM" (e.g., "2025-10")
 * @returns Unix timestamp in milliseconds
 *
 * @example
 * getEditDeadline("2025-10") // Returns 1728814500000 (Oct 12, 2025 11:45 AM UTC)
 */
export function getEditDeadline(month: string): number

/**
 * Calculate the cutoff date for prompt changes (2 weeks before deadline)
 *
 * @param month - Format: "YYYY-MM"
 * @returns Unix timestamp in milliseconds
 *
 * @example
 * getTwoWeeksBeforeDeadline("2025-10") // Returns 2 weeks before 11:45 AM on 2nd Saturday
 */
export function getTwoWeeksBeforeDeadline(month: string): number

/**
 * Check if current time is before the given deadline
 *
 * @param deadline - Unix timestamp in milliseconds
 * @returns true if before deadline, false if after
 *
 * @example
 * canEditByDeadline(1728814500000) // Returns true if Date.now() < deadline
 */
export function canEditByDeadline(deadline: number): boolean

/**
 * Format a deadline timestamp into countdown object
 * Used by frontend countdown timer component
 *
 * @param deadline - Unix timestamp in milliseconds
 * @returns Object with days, hours, minutes, seconds remaining
 *
 * @example
 * formatCountdown(1728814500000)
 * // Returns: { days: 5, hours: 12, minutes: 30, seconds: 45 }
 */
export function formatCountdown(deadline: number): {
  days: number
  hours: number
  minutes: number
  seconds: number
}
```

**Edge Cases to Handle**:
- Month boundaries (Dec → Jan)
- Leap years
- UTC timezone conversion
- Negative time remaining (deadline passed)

---

### 2. Contributions API (`convex/contributions.ts`)

**Purpose**: Manage user contributions with flexible prompts and deadline enforcement

#### Mutation: `createOrUpdate`

```typescript
/**
 * Create or update a contribution with flexible responses object
 * Calculates editDeadline automatically on creation
 * Validates responses against active prompts
 *
 * @throws ConvexError if deadline has passed
 * @throws ConvexError if response to inactive/deleted prompt
 *
 * @returns Contribution ID
 */
export const createOrUpdate = mutation({
  args: {
    groupId: v.id("groups"),
    month: v.string(), // Format: "YYYY-MM"
    responses: v.object({
      // Dynamic keys: "1", "2", "3", "4", "5" (promptNumber as string)
      // Value varies by promptType:
      // - text: { text: string }
      // - media: { mediaUrls: Array<{url: string, width: number, height: number}> }
      // - audio: { audioUrl: string }
    })
  },
  returns: v.id("contributions"),
  handler: async (ctx, args) => {
    // Implementation by Backend Agent
  }
})
```

**Behavior**:
- **Creation**: Calculate `editDeadline` using `getEditDeadline(month)`, store in contribution record
- **Update**: Check `canEditByDeadline(contribution.editDeadline)`, throw error if past deadline
- **Validation**: For each key in `responses`, verify corresponding prompt exists and is active
- **Auto-save compatible**: Should work with existing 10-second debounce

**Example Usage** (Frontend):
```typescript
const contributionId = await createOrUpdate({
  groupId: "j123...",
  month: "2025-10",
  responses: {
    "1": { text: "My favorite memory..." },
    "2": { mediaUrls: [{url: "...", width: 1920, height: 1080}] },
    "3": { audioUrl: "..." }
  }
})
```

---

#### Query: `canEdit`

```typescript
/**
 * Check if a contribution can still be edited
 * Used by frontend to show/hide edit UI
 *
 * @returns Object with edit permission, deadline, and optional message
 */
export const canEdit = query({
  args: {
    contributionId: v.id("contributions")
  },
  returns: v.object({
    canEdit: v.boolean(),
    deadline: v.number(), // Unix timestamp
    message: v.optional(v.string()) // Error message if canEdit is false
  }),
  handler: async (ctx, args) => {
    // Implementation by Backend Agent
  }
})
```

**Behavior**:
- Fetch contribution record
- Get current `editDeadline` from contribution
- Compare `Date.now()` with `editDeadline`
- Return `canEdit: true` if before deadline, `false` if after
- If false, include message: `"Deadline passed on [formatted date]. Contributions locked."`

**Example Usage** (Frontend):
```typescript
const { canEdit, deadline, message } = await canEdit({ contributionId: "..." })

if (!canEdit) {
  console.log(message) // "Deadline passed on Oct 12, 2025 11:45 AM UTC. Contributions locked."
  disableForm()
}
```

---

### 3. Group Prompts API (`convex/groupPrompts.ts`)

**Purpose**: Manage group prompts with 2-week deletion validation

#### Query: `getActivePrompts`

```typescript
/**
 * Fetch all active prompts for a group, sorted by displayOrder
 *
 * @returns Array of active prompts (3-5 prompts)
 */
export const getActivePrompts = query({
  args: {
    groupId: v.id("groups")
  },
  returns: v.array(v.object({
    _id: v.id("groupPrompts"),
    promptNumber: v.number(), // 1-5
    promptText: v.string(),
    promptType: v.union(v.literal("text"), v.literal("media"), v.literal("audio")),
    displayOrder: v.number() // For sorting
  })),
  handler: async (ctx, args) => {
    // Implementation by Backend Agent
  }
})
```

**Behavior**:
- Filter prompts by `groupId` and `isActive: true`
- Sort by `displayOrder` ascending
- Return only necessary fields (no sensitive data)

**Example Usage** (Frontend):
```typescript
const prompts = await getActivePrompts({ groupId: "..." })

prompts.forEach(prompt => {
  if (prompt.promptType === "text") {
    renderTextPrompt(prompt)
  } else if (prompt.promptType === "media") {
    renderMediaPrompt(prompt)
  } else if (prompt.promptType === "audio") {
    renderAudioPrompt(prompt)
  }
})
```

---

#### Mutation: `deletePrompt`

```typescript
/**
 * Delete a prompt with 2-week validation
 *
 * @throws ConvexError if <2 weeks to deadline AND responses exist
 * @returns Success status and count of deleted responses
 */
export const deletePrompt = mutation({
  args: {
    promptId: v.id("groupPrompts")
  },
  returns: v.object({
    success: v.boolean(),
    deletedResponseCount: v.optional(v.number()) // If responses were deleted
  }),
  handler: async (ctx, args) => {
    // Implementation by Backend Agent
  }
})
```

**Behavior**:
- Fetch prompt to get `promptNumber` and `groupId`
- Get current month's deadline: `getTwoWeeksBeforeDeadline(currentMonth)`
- Check if `Date.now() < twoWeeksBeforeDeadline`
- Query contributions for this group/month to find responses to this `promptNumber`
- **If <2 weeks AND responses exist**: Throw `ConvexError` with message: `"Cannot delete. Less than 2 weeks to deadline and users have responded."`
- **If >2 weeks OR no responses**:
  - Delete responses (if any)
  - Mark prompt as inactive or delete
  - Create notifications for affected users (STORY-B6)
  - Return `{ success: true, deletedResponseCount: X }`

**Example Usage** (Frontend):
```typescript
try {
  const result = await deletePrompt({ promptId: "..." })

  if (result.deletedResponseCount > 0) {
    showToast(`Prompt deleted. ${result.deletedResponseCount} user responses removed.`)
  } else {
    showToast("Prompt deleted successfully.")
  }
} catch (error) {
  showToast(error.message) // "Cannot delete. Less than 2 weeks..."
}
```

---

### 4. Notifications API (`convex/notifications.ts`)

**Purpose**: Notify users when their responses are deleted

#### Mutation: `createNotification` (existing, updated for prompt deletion)

```typescript
/**
 * Create a notification for prompt deletion
 * Called internally by deletePrompt mutation
 */
export const createNotification = mutation({
  args: {
    userId: v.id("users"),
    type: v.literal("prompt_deleted"),
    message: v.string(), // "Admin changed [Prompt Title]. Your response was removed."
    groupId: v.optional(v.id("groups")),
    metadata: v.optional(v.object({
      promptNumber: v.number(),
      promptText: v.string()
    }))
  },
  returns: v.id("notifications"),
  handler: async (ctx, args) => {
    // Implementation by Backend Agent (likely already exists, just add new type)
  }
})
```

**Behavior**:
- Create notification record with type "prompt_deleted"
- Include prompt title in message
- Link to group (so notification appears in group context)

---

## 🎨 Frontend Layer Contracts

### 1. Countdown Timer Component (`components/forms/CountdownTimer.tsx`)

**Purpose**: Reusable countdown timer with progressive warning states

```typescript
interface CountdownTimerProps {
  deadline: number // Unix timestamp from contribution.editDeadline
  variant: "banner" | "inline"
  onExpire: () => void // Callback when timer hits zero
}

export function CountdownTimer({ deadline, variant, onExpire }: CountdownTimerProps): JSX.Element
```

**Behavior**:
- Update every second using `setInterval`
- Use `formatCountdown(deadline)` helper to calculate remaining time
- Display: "X days, X hours, X minutes, X seconds remaining"
- Progressive color states:
  - 7+ days: Info color (`base-content/70`)
  - <24 hours: Warning color (`warning`)
  - Expired: Error color (`error`)
- Call `onExpire()` when timer reaches zero
- Clean up interval on unmount

**Example Usage**:
```typescript
<CountdownTimer
  deadline={contribution.editDeadline}
  variant="banner"
  onExpire={() => router.refresh()}
/>
```

---

### 2. Audio Upload Component (`components/forms/AudioUpload.tsx`)

**Purpose**: Upload and display audio files for audio-type prompts

```typescript
interface AudioUploadProps {
  value: string | undefined // Audio URL from Convex storage
  onChange: (url: string) => void // Callback when upload completes
}

export function AudioUpload({ value, onChange }: AudioUploadProps): JSX.Element
```

**Behavior**:
- File input accepting `.mp3`, `.wav`, `.m4a`
- Validate max 10MB file size before upload
- Upload to Convex storage (similar to PhotoWall logic)
- Display audio player if `value` is set
- Show "Replace" button to upload new file
- Loading state during upload
- Error handling for upload failures

**Example Usage**:
```typescript
<AudioUpload
  value={responses["3"]?.audioUrl}
  onChange={(url) => setResponses({...responses, "3": { audioUrl: url }})}
/>
```

---

### 3. Dynamic Contribution Form (`app/contribute/page.tsx`)

**Integration Points**:

1. **Fetch Active Prompts** (on page load):
```typescript
const prompts = useQuery(api.groupPrompts.getActivePrompts, { groupId })
```

2. **Check Edit Permission** (on page load):
```typescript
const { canEdit, deadline, message } = useQuery(api.contributions.canEdit, { contributionId })

if (!canEdit) {
  disableAllInputs()
  showLockedMessage(message)
}
```

3. **Build Responses Object** (from form state):
```typescript
const responses: Record<string, ResponseValue> = {
  "1": { text: textInput1 },
  "2": { mediaUrls: uploadedImages },
  "3": { audioUrl: uploadedAudio }
}
```

4. **Save Contribution** (with auto-save debounce):
```typescript
const contributionId = await createOrUpdate({
  groupId,
  month: currentMonth,
  responses
})
```

5. **Show Countdown Banner** (if <7 days to deadline):
```typescript
{daysUntilDeadline < 7 && (
  <CountdownTimer
    deadline={contribution.editDeadline}
    variant="banner"
    onExpire={() => router.refresh()}
  />
)}
```

---

### 4. Admin Prompt Deletion Modal (`components/modals/DeletePromptConfirmation.tsx`)

**Integration Points**:

1. **Check for Responses** (before showing modal):
```typescript
const hasResponses = await hasResponsesForPrompt(promptNumber, groupId, currentMonth)

if (hasResponses) {
  showConfirmationModal()
} else {
  deleteImmediately()
}
```

2. **Delete with Error Handling**:
```typescript
try {
  const result = await deletePrompt({ promptId })

  showToast(`Prompt deleted. ${result.deletedResponseCount || 0} responses removed.`)
} catch (error) {
  if (error.message.includes("2 weeks")) {
    showErrorToast("Cannot delete. Less than 2 weeks to deadline and users have responded.")
  }
}
```

---

## 🔄 Data Flow Examples

### Example 1: User Contributes

```
1. User navigates to /contribute
   → Frontend calls: getActivePrompts({ groupId })
   → Backend returns: Array<GroupPrompt> (3-5 prompts)

2. Frontend renders dynamic form
   → Text prompts → <PromptCard>
   → Media prompts → <PhotoWall>
   → Audio prompts → <AudioUpload>

3. User fills text prompt
   → Frontend updates local state: responses["1"] = { text: "..." }
   → After 10-second debounce:
   → Frontend calls: createOrUpdate({ groupId, month, responses })
   → Backend validates, saves, returns contributionId

4. User uploads media
   → <PhotoWall> uploads to Convex storage
   → Frontend updates: responses["2"] = { mediaUrls: [...] }
   → Auto-save triggers after debounce

5. Frontend shows countdown banner
   → Gets editDeadline from contribution record
   → <CountdownTimer deadline={editDeadline} />
```

---

### Example 2: Deadline Enforcement

```
1. User loads /contribute page
   → Frontend calls: canEdit({ contributionId })
   → Backend checks: Date.now() < contribution.editDeadline
   → Backend returns: { canEdit: false, deadline: 1728814500000, message: "..." }

2. Frontend disables form
   → All inputs set disabled={true}
   → "Save" button hidden
   → "Preview" button still visible
   → Error message shown: "Contributions locked. Newsletter sends soon!"

3. User tries to edit anyway
   → Frontend prevents input (disabled state)
   → If somehow bypassed, backend mutation throws ConvexError
```

---

### Example 3: Admin Deletes Prompt

```
1. Admin clicks "Delete" on prompt
   → Frontend checks: hasResponsesForPrompt(promptNumber)
   → If responses exist: Show confirmation modal

2. Admin confirms deletion
   → Frontend calls: deletePrompt({ promptId })
   → Backend checks: Is Date.now() < getTwoWeeksBeforeDeadline()?

   CASE A: <2 weeks + responses exist
   → Backend throws ConvexError
   → Frontend shows error toast

   CASE B: >2 weeks OR no responses
   → Backend deletes responses (if any)
   → Backend creates notifications for affected users
   → Backend returns: { success: true, deletedResponseCount: 5 }
   → Frontend shows success toast
```

---

## ✅ Contract Validation Checklist

Before marking stories "Done", verify:

### Backend Checklist
- [ ] All functions match exact signatures above
- [ ] All error cases throw ConvexError with clear messages
- [ ] All edge cases handled (UTC, month boundaries, etc.)
- [ ] Unit tests cover all contract behavior
- [ ] TypeScript types exported correctly

### Frontend Checklist
- [ ] All API calls use exact contract signatures
- [ ] Error handling for all ConvexError cases
- [ ] Loading states during async operations
- [ ] Disabled states during deadline lock
- [ ] Visual tests at 3 breakpoints

### Integration Checklist
- [ ] E2E tests verify full contract flow
- [ ] No console errors or warnings
- [ ] Auto-save still works
- [ ] Deadline enforcement works correctly
- [ ] 2-week rule enforced

---

## 🚨 Breaking Changes Protocol

**If you need to change a contract**:

1. **Stop work immediately**
2. **Post in main Claude session** with:
   - Current contract
   - Proposed change
   - Reason for change
   - Impact on other layer
3. **Wait for approval** from both Backend and Frontend agents
4. **Update this document** before resuming work
5. **Update Linear issues** with new contract details

**Example**:
```
BREAKING CHANGE PROPOSAL

Contract: createOrUpdate mutation
Current: responses: v.object({})
Proposed: responses: v.record(v.string(), v.union(...))
Reason: Need stronger validation for response values
Impact: Frontend must update how it builds responses object

Approval needed from Backend Agent + Frontend Agent
```

---

**Last Updated**: 2025-10-13
**Status**: Contracts Locked - Ready for Implementation
**Any changes require approval from both layers**
