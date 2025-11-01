# Backend API Contract - Group Creation Wizard

**Project:** Group Creation Wizard
**Version:** 1.0.0
**Last Updated:** 2025-10-11

---

## Purpose

This contract defines the backend mutations and queries required for the Group Creation Wizard. Frontend components will consume these APIs during the 4-step wizard flow.

**Key Principle:** All APIs are **backward compatible**. Existing group creation logic (`createGroup`) remains unchanged.

---

## Mutations

### 1. `createGroupWithSettings` (NEW)

**Purpose:** Create a group with full configuration in a single transaction (batch operation).

**File:** `convex/groups.ts`

**Input Schema:**
```typescript
{
  // Step 1: Basic Info
  name: v.string(),                    // Required, 1-50 chars
  meta: v.optional(v.string()),        // Optional, 1-30 chars, URL-safe
  description: v.optional(v.string()), // Optional, max 200 chars

  // Step 2: Appearance (optional)
  avatarStorageId: v.optional(v.string()),  // Convex storage ID
  coverStorageId: v.optional(v.string()),   // Convex storage ID

  // Step 3: Prompts (optional, defaults to 5 default prompts)
  prompts: v.optional(v.array(v.object({
    promptNumber: v.number(),              // 1-5
    promptText: v.string(),                // Required, max 500 chars
    promptType: v.union(
      v.literal("text"),
      v.literal("media"),
      v.literal("audio")
    ),
    isActive: v.boolean(),                 // true = enabled, false = disabled
  }))),

  // Step 4: Members
  memberEmails: v.optional(v.array(v.string())),  // Email addresses
  generateInviteLink: v.optional(v.boolean()),     // Default: false
}
```

**Output Schema:**
```typescript
{
  groupId: Id<"groups">,
  inviteCode?: string,      // Only if generateInviteLink = true
  inviteUrl?: string,       // Full URL: ${origin}/invite/${code}
  message: string,
}
```

**Behavior:**

1. **Validate Inputs:**
   - `name`: Required, 1-50 chars
   - `meta`: If not provided, auto-generate from name (lowercase, dashes, URL-safe)
   - `description`: Max 200 chars
   - `prompts`: If provided, validate each (text 500 chars, type valid, number 1-5)
   - `memberEmails`: Validate email format for each

2. **Create Group:**
   - Insert into `groups` table
   - Set `createdAt` to now
   - Add current user to `memberIds`

3. **Add Creator as Admin:**
   - Insert into `groupMembers` with role = "admin"

4. **Upload Images (if provided):**
   - If `avatarStorageId`: Patch `groups.groupImage`
   - If `coverStorageId`: Patch `groups.coverImage`

5. **Set Custom Prompts (if provided):**
   - For each prompt in `prompts` array:
     - Insert into `groupPrompts` with provided `promptNumber`, `promptText`, `promptType`, `isActive`
     - Set `displayOrder` = `promptNumber` (initial order)
   - If `prompts` not provided or < 5 prompts: Use defaults for missing prompts

6. **Add Members (if provided):**
   - For each email in `memberEmails`:
     - Find or create user
     - Add to `groups.memberIds`
     - Insert into `groupMembers` with role = "member"
     - Create invite record with status = "pending"
     - Send invite email via Resend (background task)

7. **Generate Invite Link (if requested):**
   - If `generateInviteLink = true`:
     - Generate unique `inviteCode` (8 chars, alphanumeric)
     - Create invite record in `invites` table
     - Return `inviteCode` and full `inviteUrl`

8. **Transaction Guarantee:**
   - If ANY step fails, rollback entire group creation
   - Return ConvexError with descriptive message

**Error Cases:**

| Error | Condition | Message |
|-------|-----------|---------|
| Not authenticated | User not logged in | "Not authenticated" |
| Invalid name | Empty or > 50 chars | "Group name must be 1-50 characters" |
| Invalid meta | Contains non-URL-safe chars | "Group ID must be URL-safe" |
| Invalid prompt | Text > 500 chars | "Prompt text must be 500 characters or less" |
| Invalid email | Malformed email in memberEmails | "Invalid email format: {email}" |
| Duplicate member | Email already in group | "User already in group: {email}" |

**Example Usage:**

```typescript
// Frontend call
const result = await createGroupWithSettings({
  // Step 1
  name: "My Book Club",
  meta: "my-book-club", // Optional, auto-generated if omitted
  description: "Monthly book discussions",

  // Step 2
  avatarStorageId: "kg2h4k...", // From Convex upload
  coverStorageId: "mf8s3n...",

  // Step 3
  prompts: [
    {
      promptNumber: 1,
      promptText: "What book did you read this month?",
      promptType: "text",
      isActive: true,
    },
    {
      promptNumber: 2,
      promptText: "Share your favorite quotes",
      promptType: "media",
      isActive: true,
    },
    // Prompts 3-5 will use defaults
  ],

  // Step 4
  memberEmails: ["alice@example.com", "bob@example.com"],
  generateInviteLink: true,
});

// Response
{
  groupId: "j7s8d9f0...",
  inviteCode: "ABC123XY",
  inviteUrl: "https://myapp.com/invite/ABC123XY",
  message: "Group 'My Book Club' created successfully",
}
```

---

### 2. `setGroupPrompt` (UPDATED - ✅ ALREADY DONE)

**Purpose:** Set or update a custom prompt for a group.

**Changes Made (STORY-A1):**
- Added `promptType` parameter
- Now validates: `"text" | "media" | "audio"`

**Input Schema:**
```typescript
{
  groupId: v.id("groups"),
  promptNumber: v.number(),      // 1-5
  promptText: v.string(),        // Max 500 chars
  promptType: v.union(           // NEW
    v.literal("text"),
    v.literal("media"),
    v.literal("audio")
  ),
}
```

**Output:** `Id<"groupPrompts">`

**No frontend changes required** - existing `PromptListSection` can pass `promptType` when available.

---

## Queries

### 1. `getGroupPrompts` (UPDATED - ✅ ALREADY DONE)

**Purpose:** Get all prompts for a group with their types.

**Changes Made (STORY-A1):**
- Response now includes `promptType` field

**Output Schema:**
```typescript
Array<{
  promptNumber: number,
  promptText: string,
  promptType: "text" | "media" | "audio",  // NEW
  isCustom: boolean,
  isActive: boolean,
  displayOrder: number,
}>
```

**Default Prompt Types:**
```typescript
{
  1: { text: "What did you do this month?", type: "text" },
  2: { text: "Photo Wall", type: "media" },
  3: { text: "One Good Thing", type: "text" },
  4: { text: "On Your Mind", type: "text" },
  5: { text: "What song are you listening to?", type: "text" },
}
```

---

### 2. `getById` (EXISTING, NO CHANGES)

**Purpose:** Get group by ID with member details.

**Output:** Group object with `groupImage`, `coverImage`, `meta` fields.

**Usage:** Wizard uses this to fetch group details after creation (for redirect).

---

## Schema Changes

### `groupPrompts` Table (✅ ALREADY UPDATED - STORY-A1)

**New Field:**
```typescript
promptType: v.union(
  v.literal("text"),
  v.literal("media"),
  v.literal("audio")
)
```

**Migration:** Existing prompts will use default types (text for 1,3,4,5 and media for 2).

---

## Implementation Notes for Backend Agent

### Transaction Safety

`createGroupWithSettings` must be **atomic**:
- Use `ctx.db.insert` for all creates
- If error occurs at any step, previous inserts are automatically rolled back by Convex
- Return early with `ConvexError` on validation failures

### Performance Considerations

- **Batch Operations:** All inserts happen in parallel where possible
- **Image Uploads:** Already completed before mutation call (frontend uploads to storage first)
- **Email Sending:** Fire-and-forget via `ctx.scheduler.runAfter(0, ...)`

### Testing Requirements

**Unit Tests (convex-test):**
- [ ] Creates group with all fields
- [ ] Creates group with minimal fields (name only)
- [ ] Auto-generates `meta` from name
- [ ] Validates name length (1-50 chars)
- [ ] Validates prompt text length (500 chars)
- [ ] Validates email format
- [ ] Adds creator as admin
- [ ] Sets custom prompts correctly
- [ ] Generates invite code when requested
- [ ] Handles duplicate member emails gracefully

**File:** `tests/unit/group-creation-batch.test.ts`

---

## Backward Compatibility

### Existing `createGroup` Mutation

**Status:** ✅ UNCHANGED

**Purpose:** Simple group creation (name + creator only).

**Usage:** Fallback for simple use cases or if wizard disabled.

**Contract:** No changes needed. Wizard uses new `createGroupWithSettings`, but old mutation still works.

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-10-11 | Initial contract created |

---

**Contract Owner:** Backend Agent
**Consumers:** Frontend Agent (Stories C1-C5, B1-B6)
**Review Status:** ✅ Ready for Implementation
