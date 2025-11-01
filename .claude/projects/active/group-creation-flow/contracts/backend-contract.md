# Backend Contract - Group Creation Flow

**STORY-2: Backend Enhancements**
**Version**: 1.0.0
**Last Updated**: 2025-10-25
**Status**: ✅ Complete (All tests passing)

This document defines the backend API contract for the Group Creation Flow Rebuild project. All functions are fully tested with Vitest unit tests.

---

## Table of Contents

1. [Query: checkGroupIdUniqueness](#query-checkgroupiduniqueness)
2. [Mutation: createGroupWithSettings](#mutation-creategroupwithsettings)
3. [Mutation: updateGroupDescription](#mutation-updategroupdescription)
4. [Constant: DEFAULT_PROMPTS](#constant-default_prompts)
5. [Error Handling](#error-handling)
6. [Testing](#testing)

---

## Query: checkGroupIdUniqueness

Check if a custom group ID (meta) is available for use.

**Location**: `convex/groups/queries.ts`

### Function Signature

```typescript
export const checkGroupIdUniqueness = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args): Promise<{ available: boolean }>
});
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | `string` | Yes | The group ID to check (will be stored in `meta` field) |

### Return Type

```typescript
{
  available: boolean  // true if ID is available, false if already taken
}
```

### Behavior

- **Case-insensitive**: `"my-group"` and `"MY-GROUP"` are considered the same
- **Empty strings**: Always returns `available: true` (will be auto-generated)
- **No authentication required**: Public query for real-time validation

### Examples

**Example 1: Check available ID**
```typescript
const result = await convex.query(api.groups.queries.checkGroupIdUniqueness, {
  id: "my-unique-group"
});
// Returns: { available: true }
```

**Example 2: Check taken ID**
```typescript
const result = await convex.query(api.groups.queries.checkGroupIdUniqueness, {
  id: "existing-group"
});
// Returns: { available: false }
```

**Example 3: Case-insensitive check**
```typescript
// If "my-group" exists in database
const result = await convex.query(api.groups.queries.checkGroupIdUniqueness, {
  id: "MY-GROUP"
});
// Returns: { available: false }
```

### Frontend Usage

Use this for real-time validation during group creation:

```typescript
const [groupId, setGroupId] = useState("");
const uniquenessCheck = useQuery(
  api.groups.queries.checkGroupIdUniqueness,
  { id: groupId }
);

// Show validation message
{uniquenessCheck?.available === false && (
  <p className="text-error text-sm">This group ID is already taken</p>
)}
```

---

## Mutation: createGroupWithSettings

Create a new group with custom settings including description.

**Location**: `convex/groups/mutations.ts`

### Function Signature

```typescript
export const createGroupWithSettings = mutation({
  args: {
    name: v.string(),
    meta: v.optional(v.string()),
    description: v.optional(v.string()),  // NEW in STORY-2
    avatarStorageId: v.optional(v.string()),
    coverStorageId: v.optional(v.string()),
    prompts: v.optional(v.array(v.object({
      promptNumber: v.number(),
      promptText: v.string(),
      promptType: v.union(v.literal("text"), v.literal("media"), v.literal("audio")),
      isActive: v.boolean(),
    }))),
    memberEmails: v.optional(v.array(v.string())),
    generateInviteLink: v.optional(v.boolean()),
  },
  handler: async (ctx, args): Promise<{
    groupId: Id<"groups">;
    inviteCode?: string;
    inviteUrl?: string;
    message: string;
  }>
});
```

### Parameters

| Parameter | Type | Required | Description | Validation |
|-----------|------|----------|-------------|------------|
| `name` | `string` | Yes | Group name | 1-50 characters, cannot be empty |
| `meta` | `string` | No | Custom group ID | Max 30 chars, lowercase/numbers/dashes only |
| `description` | `string` | No | Group description | **Max 200 characters** (NEW) |
| `avatarStorageId` | `string` | No | Storage ID for avatar | - |
| `coverStorageId` | `string` | No | Storage ID for cover | - |
| `prompts` | `array` | No | Custom prompts | 1-5 prompts, each max 500 chars |
| `memberEmails` | `array<string>` | No | Emails to invite | Valid email format |
| `generateInviteLink` | `boolean` | No | Generate shareable link | - |

### Return Type

```typescript
{
  groupId: Id<"groups">;      // Created group ID
  inviteCode?: string;         // 8-character code (if generateInviteLink: true)
  inviteUrl?: string;          // Full invite URL (if generateInviteLink: true)
  message: string;             // Success message
}
```

### Validation Rules

#### Description Validation (NEW)
- **Maximum length**: 200 characters
- **Trimming**: Leading/trailing whitespace removed
- **Optional**: Can be omitted or empty string
- **Storage**: Stored as `undefined` if empty after trimming

### Error Cases

| Error Message | Cause | HTTP-equivalent |
|--------------|-------|-----------------|
| `"Not authenticated"` | No user identity | 401 Unauthorized |
| `"Group name cannot be empty"` | Empty/whitespace name | 400 Bad Request |
| `"Group name must be 50 characters or less"` | Name too long | 400 Bad Request |
| `"Description must be 200 characters or less"` | Description too long | 400 Bad Request |
| `"Group ID must be 30 characters or less"` | Meta too long | 400 Bad Request |
| `"Group ID must contain only lowercase letters, numbers, and dashes"` | Invalid meta format | 400 Bad Request |
| `"Invalid email format: {email}"` | Bad email in memberEmails | 400 Bad Request |
| `"Prompt number must be between 1 and 5"` | Invalid prompt number | 400 Bad Request |
| Limit exceeded errors | Subscription limits hit | 403 Forbidden |

### Examples

**Example 1: Basic group with description**
```typescript
const result = await convex.mutation(api.groups.mutations.createGroupWithSettings, {
  name: "My Friend Group",
  description: "A group for my closest friends to share monthly updates",
});
// Returns: { groupId: "...", message: "Group 'My Friend Group' created successfully" }
```

**Example 2: Full configuration**
```typescript
const result = await convex.mutation(api.groups.mutations.createGroupWithSettings, {
  name: "Book Club",
  meta: "book-club-2025",
  description: "Monthly book discussions and recommendations",
  prompts: [
    { promptNumber: 1, promptText: "Book I'm reading", promptType: "text", isActive: true },
    { promptNumber: 2, promptText: "Book photos", promptType: "media", isActive: true },
  ],
  memberEmails: ["alice@example.com", "bob@example.com"],
  generateInviteLink: true,
});
// Returns: { groupId: "...", inviteCode: "ABC12345", inviteUrl: "...", message: "..." }
```

**Example 3: Description edge cases**
```typescript
// Maximum length (200 characters)
const maxDescription = "a".repeat(200);
await convex.mutation(api.groups.mutations.createGroupWithSettings, {
  name: "Test",
  description: maxDescription,
});
// ✅ Success

// Too long (201 characters)
const tooLong = "a".repeat(201);
await convex.mutation(api.groups.mutations.createGroupWithSettings, {
  name: "Test",
  description: tooLong,
});
// ❌ Throws: "Description must be 200 characters or less"

// Whitespace trimming
await convex.mutation(api.groups.mutations.createGroupWithSettings, {
  name: "Test",
  description: "  My description  ",
});
// Stored as: "My description" (trimmed)
```

### Database Changes

The `description` field is now stored in the `groups` table:

```typescript
// Schema update (convex/schema.ts)
groups: defineTable({
  name: v.string(),
  meta: v.optional(v.string()),
  description: v.optional(v.string()),  // NEW
  // ... other fields
})
```

---

## Mutation: updateGroupDescription

Update an existing group's description (admin only).

**Location**: `convex/groups/mutations.ts`

### Function Signature

```typescript
export const updateGroupDescription = mutation({
  args: {
    groupId: v.id("groups"),
    description: v.string(),
  },
  handler: async (ctx, args): Promise<Doc<"groups">>
});
```

### Parameters

| Parameter | Type | Required | Description | Validation |
|-----------|------|----------|-------------|------------|
| `groupId` | `Id<"groups">` | Yes | Target group ID | Must exist |
| `description` | `string` | Yes | New description | Max 200 characters (can be empty) |

### Return Type

```typescript
Doc<"groups">  // Full updated group document
```

### Authorization

- **Authentication required**: User must be logged in
- **Admin only**: User must have `role: "admin"` in `groupMembers` table
- **Membership check**: User must be member of the group

### Validation Rules

- **Maximum length**: 200 characters (same as creation)
- **Empty allowed**: Can be empty string to clear description
- **Trimming**: Leading/trailing whitespace removed
- **Undefined storage**: Empty strings stored as `undefined`

### Error Cases

| Error Message | Cause | HTTP-equivalent |
|--------------|-------|-----------------|
| `"Not authenticated"` | No user identity | 401 Unauthorized |
| `"User not found"` | User doesn't exist in database | 404 Not Found |
| `"Group not found"` | Group doesn't exist | 404 Not Found |
| `"Only group admins can update the group description"` | User is not admin | 403 Forbidden |
| `"Description must be 200 characters or less"` | Description too long | 400 Bad Request |

### Examples

**Example 1: Update description**
```typescript
const updatedGroup = await convex.mutation(
  api.groups.mutations.updateGroupDescription,
  {
    groupId: "jh71234567890abcde" as Id<"groups">,
    description: "Updated description for our group",
  }
);
// Returns: Full group document with updated description
```

**Example 2: Clear description**
```typescript
const updatedGroup = await convex.mutation(
  api.groups.mutations.updateGroupDescription,
  {
    groupId: groupId,
    description: "",  // Empty string to clear
  }
);
// Description stored as undefined in database
```

**Example 3: Non-admin attempt (error)**
```typescript
// User is regular member, not admin
await convex.mutation(api.groups.mutations.updateGroupDescription, {
  groupId: groupId,
  description: "Trying to update",
});
// ❌ Throws: "Only group admins can update the group description"
```

### Frontend Usage

This mutation is primarily used by STORY-10 (Settings Page):

```typescript
// Settings page - admin only
const updateDescription = useMutation(api.groups.mutations.updateGroupDescription);

const handleSave = async () => {
  try {
    await updateDescription({
      groupId: currentGroupId,
      description: newDescription,
    });
    toast.success("Description updated!");
  } catch (error) {
    toast.error(error.message);
  }
};
```

---

## Constant: DEFAULT_PROMPTS

Default prompt configuration for new groups.

**Location**: `convex/groups/constants.ts`

### Type Definition

```typescript
export const DEFAULT_PROMPTS: Array<{
  label: string;
  type: "text" | "media";
  order: number;
}>;
```

### Value

```typescript
[
  { label: "This month I...", type: "text", order: 0 },
  { label: "📸 Photo Wall", type: "media", order: 1 },
  { label: "One good thing from last month", type: "text", order: 2 },
  { label: "This has been on my mind", type: "text", order: 3 },
  { label: "🎵 Something I have been listening to", type: "text", order: 4 },
]
```

### Properties

- **Length**: Always 5 prompts
- **Types**: 4 text, 1 media
- **Order**: Sequential from 0 to 4
- **Immutable**: Use spread operator to create copies

### Frontend Usage

**Example 1: Initialize prompt state**
```typescript
import { DEFAULT_PROMPTS } from "@/convex/groups/constants";

const [prompts, setPrompts] = useState(
  DEFAULT_PROMPTS.map((p, idx) => ({
    id: idx + 1,
    label: p.label,
    type: p.type,
    isActive: true,
  }))
);
```

**Example 2: Reset to defaults**
```typescript
const handleReset = () => {
  setPrompts(DEFAULT_PROMPTS.map((p, idx) => ({
    id: idx + 1,
    label: p.label,
    type: p.type,
    isActive: true,
  })));
};
```

**Example 3: Reference for validation**
```typescript
const MAX_PROMPTS = DEFAULT_PROMPTS.length; // 5
const hasMediaPrompt = prompts.some(p => p.type === "media");
```

---

## Error Handling

All mutations follow consistent error handling patterns:

### ConvexError Structure

```typescript
throw new ConvexError("User-friendly error message");

// For limit errors (STORY-B2)
throw new ConvexError({
  message: "Limit message",
  code: "LIMIT_EXCEEDED",
  limitType: "groups_created" | "group_members" | "groups_joined",
  current: number,
  max: number,
});
```

### Error Response Format

Frontend receives errors as:
```typescript
try {
  await mutation(...);
} catch (error) {
  // error.message contains the user-friendly message
  console.error(error.message);
}
```

### Common Error Patterns

1. **Authentication**: Check user identity first
2. **Validation**: Validate input parameters
3. **Existence**: Check if resources exist
4. **Authorization**: Verify user permissions
5. **Business logic**: Check subscription limits, etc.

---

## Testing

All backend enhancements are fully tested with Vitest.

### Test File

**Location**: `tests/unit/groups-backend-enhancements.test.ts`

### Test Coverage

#### checkGroupIdUniqueness (4 tests)
- ✅ Returns available: true when ID doesn't exist
- ✅ Returns available: false when ID already exists
- ✅ Case-insensitive uniqueness check
- ✅ Handles empty strings correctly

#### createGroupWithSettings - description (5 tests)
- ✅ Creates group with valid description
- ✅ Accepts optional description parameter
- ✅ Rejects description longer than 200 characters
- ✅ Accepts description at exactly 200 characters
- ✅ Trims whitespace from description

#### updateGroupDescription (6 tests)
- ✅ Updates description successfully as admin
- ✅ Rejects non-admin users
- ✅ Requires authentication
- ✅ Rejects description longer than 200 characters
- ✅ Accepts empty description (allows clearing)
- ✅ Rejects update to non-existent group

#### DEFAULT_PROMPTS constant (4 tests)
- ✅ Exports constant with correct structure
- ✅ Has correct prompt structure (label, type, order)
- ✅ Contains expected prompt labels
- ✅ Has correct type distribution (4 text, 1 media)

### Running Tests

```bash
# Run all backend enhancement tests
npm run test:unit -- tests/unit/groups-backend-enhancements.test.ts

# Watch mode
npm run test:unit -- tests/unit/groups-backend-enhancements.test.ts --watch

# Coverage report
npm run test:unit -- --coverage
```

### Test Results

```
✅ Test Files: 1 passed (1)
✅ Tests: 19 passed (19)
✅ Duration: ~300ms
```

---

## Integration with Frontend (STORY-1, STORY-3)

### STORY-1 Dependencies

**Frontend needs**:
- `checkGroupIdUniqueness` - Real-time validation of custom group ID
- `DEFAULT_PROMPTS` - Initialize prompt editor with defaults
- `createGroupWithSettings` - Submit full group creation form

**Example flow**:
```typescript
// Step 1: User types custom group ID
const checkResult = useQuery(api.groups.queries.checkGroupIdUniqueness, {
  id: customGroupId
});

// Step 2: User fills form with DEFAULT_PROMPTS as defaults
const [prompts, setPrompts] = useState(DEFAULT_PROMPTS.map(...));

// Step 3: User submits form
const result = await createGroup({
  name,
  meta: customGroupId,
  description,
  prompts: prompts.map((p, i) => ({
    promptNumber: i + 1,
    promptText: p.label,
    promptType: p.type,
    isActive: p.isActive,
  })),
  generateInviteLink: true,
});
```

### STORY-10 Dependencies (Settings Page)

**Frontend needs**:
- `updateGroupDescription` - Edit description in settings

**Example usage**:
```typescript
// Settings page component
const updateDescription = useMutation(api.groups.mutations.updateGroupDescription);

<textarea
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  maxLength={200}
/>
<button onClick={() => updateDescription({ groupId, description })}>
  Save
</button>
```

---

## Schema Changes

### groups Table

**Before STORY-2**:
```typescript
groups: defineTable({
  name: v.string(),
  meta: v.optional(v.string()),
  createdAt: v.number(),
  memberIds: v.array(v.id("users")),
  groupImage: v.optional(v.string()),
  coverImage: v.optional(v.string()),
})
```

**After STORY-2**:
```typescript
groups: defineTable({
  name: v.string(),
  meta: v.optional(v.string()),
  description: v.optional(v.string()),  // NEW: Max 200 chars
  createdAt: v.number(),
  memberIds: v.array(v.id("users")),
  groupImage: v.optional(v.string()),
  coverImage: v.optional(v.string()),
})
```

**Migration**: No migration needed - field is optional, existing groups will have `undefined`

---

## Performance Considerations

### checkGroupIdUniqueness

- **Complexity**: O(n) where n = total number of groups
- **Optimization opportunity**: Add index on `meta` field if groups > 1000
- **Current approach**: Acceptable for MVP (free tier: max ~5-10 groups per user)

**Future optimization** (if needed):
```typescript
// Add to schema.ts
groups: defineTable({
  // ...
}).index("by_meta", ["meta"])

// Update query
const existing = await ctx.db
  .query("groups")
  .withIndex("by_meta", (q) => q.eq("meta", normalizedId))
  .first();
```

### createGroupWithSettings

- **Transaction safety**: All writes are atomic
- **Scheduler usage**: Uses `ctx.scheduler.runAfter(0, ...)` for member addition
- **Performance**: ~200-500ms for typical group creation with 5 members

### updateGroupDescription

- **Complexity**: O(1) for update, O(1) for permission check
- **Indexes used**: `by_group_user` index on `groupMembers` table
- **Performance**: ~50-100ms typical

---

## Version History

### v1.0.0 (2025-10-25) - STORY-2 Implementation

**Added**:
- `checkGroupIdUniqueness` query for real-time ID validation
- `description` field support in `createGroupWithSettings` mutation
- `updateGroupDescription` mutation for admin-only description editing
- `DEFAULT_PROMPTS` constant export for frontend initialization
- Complete Vitest test coverage (19 tests, 100% passing)

**Schema changes**:
- Added `description: v.optional(v.string())` to `groups` table

**Testing**:
- All 19 unit tests passing
- TDD approach: Tests written first, then implementation
- Coverage: Query validation, mutation authorization, edge cases

---

## Related Documentation

- **STORY-1 (Frontend)**: `.claude/projects/active/group-creation-flow/stories/STORY-1.md`
- **STORY-10 (Settings)**: To be defined
- **Testing Guide**: `.claude/guides/testing.md`
- **Convex Patterns**: `.claude/core/agents/backend.md`

---

## Support & Questions

**For frontend integration questions**:
- Check examples in this contract
- Review test file for usage patterns
- See STORY-1 frontend implementation

**For backend changes**:
- All changes must include tests
- Follow TDD workflow (RED → GREEN → REFACTOR)
- Update this contract document

**Linear Issue**: [2S6-59](https://linear.app/2s6y/issue/2S6-59)

---

**Contract Status**: ✅ Complete and tested
**Last Verified**: 2025-10-25
**Test Results**: 19/19 passing
