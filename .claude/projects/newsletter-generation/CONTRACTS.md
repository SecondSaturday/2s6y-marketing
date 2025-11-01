# Newsletter Generation System - Contracts

**Version**: 1.0.0
**Last Updated**: 2025-10-12

This document defines the contracts between backend and frontend components for the Newsletter Generation System.

---

## 📦 Table of Contents

1. [Database Schema Contracts](#database-schema-contracts)
2. [Backend API Contracts](#backend-api-contracts)
3. [Frontend Component Contracts](#frontend-component-contracts)
4. [Email Template Contracts](#email-template-contracts)
5. [Integration Contracts](#integration-contracts)

---

## 🗄️ Database Schema Contracts

### Newsletter Record

**Table**: `newsletters`

```typescript
type Newsletter = {
  _id: Id<"newsletters">
  groupId: Id<"groups">
  month: string // Format: "YYYY-MM" (e.g., "2025-10")
  sentAt: number // Unix timestamp

  // Email delivery
  recipientEmails: string[]
  resendId?: string // Resend batch ID

  // Delivery tracking
  deliveryReport?: {
    sent: number
    failed: number
    failedEmails: string[]
  }

  // Member tracking
  excludedMemberIds?: Id<"users">[] // Members who didn't contribute

  // HTML content (empty for on-the-fly generation)
  htmlContent?: string
  webContent?: string
}
```

**Indexes**:
- `by_group`: `["groupId"]`
- `by_month`: `["month"]`
- `by_sent_at`: `["sentAt"]`

**Contract Guarantees**:
1. `month` is always in "YYYY-MM" format
2. `sentAt` is set when newsletter is sent
3. `recipientEmails` includes all active group members
4. `excludedMemberIds` contains only users who didn't contribute
5. `deliveryReport` is populated after send attempt
6. `htmlContent` and `webContent` are optional (may be empty)

---

## 🔌 Backend API Contracts

### Query: `getNewsletterWithContributions`

**Purpose**: Fetch newsletter data with all contributions for display

**Input**:
```typescript
{
  groupId: Id<"groups">
  month: string // "YYYY-MM"
}
```

**Output**:
```typescript
{
  newsletter: Newsletter | null
  contributions: Array<{
    _id: Id<"contributions">
    userId: Id<"users">
    prompt1?: string
    prompt2?: Array<{
      storageId: string
      thumbnailId: string
      caption?: string
      uploadedAt: number
    }>
    prompt3?: string
    prompt4?: string
    prompt5?: string
    status: "draft" | "submitted"
    submittedAt?: number
    user: {
      _id: Id<"users">
      username?: string
      name?: string
      profileImage?: string
      email: string
    } | null
  }>
}
```

**Contract Guarantees**:
1. Returns `null` for newsletter if not yet generated
2. `contributions` array includes only submitted contributions
3. `contributions` sorted by `submittedAt` (earliest first)
4. `user` is enriched with user data
5. User authentication required

---

### Mutation: `generateNewsletterManually`

**Purpose**: Allow admins to manually trigger newsletter generation

**Input**:
```typescript
{
  groupId: Id<"groups">
  month: string // "YYYY-MM"
}
```

**Output**:
```typescript
{
  success: boolean
  newsletterId?: Id<"newsletters">
  sent?: number
  failed?: number
  error?: string
}
```

**Contract Guarantees**:
1. Only group admins can call this mutation
2. Returns `success: false` with `error` message on failure
3. Returns `newsletterId` on success
4. Idempotent: Can be called multiple times safely
5. Creates newsletter record in database
6. Sends batch email via Resend

**Error Cases**:
- Not authenticated → `"Not authenticated"`
- Not admin → `"Only admins can manually generate newsletters"`
- No contributions → `"No members have contributed yet"`
- Newsletter already exists → `"Newsletter already generated for this month"`

---

### Internal Mutation: `generateNewsletterForGroup`

**Purpose**: Core newsletter generation logic (called by cron or manual trigger)

**Input**:
```typescript
{
  groupId: Id<"groups">
  month: string // "YYYY-MM"
}
```

**Output**:
```typescript
{
  newsletterId: Id<"newsletters"> | null
  sent: number
  failed: number
  reason?: "zero_contributions" | "error"
}
```

**Contract Guarantees**:
1. Queries all contributions for group/month
2. Filters to only submitted contributions
3. Identifies excluded members (no contribution or draft)
4. Sends batch email via Resend
5. Stores newsletter metadata
6. Schedules admin report email
7. Returns `newsletterId: null` if zero contributions

---

### Action: `sendNewsletterBatch`

**Purpose**: Send newsletter email to all group members via Resend batch API

**Input**:
```typescript
{
  groupId: Id<"groups">
  month: string
  recipientEmails: string[]
  contributions: ContributionWithUser[]
}
```

**Output**:
```typescript
{
  batchId: string // Resend batch ID
  sent: number
  failed: number
  failedEmails: string[]
}
```

**Contract Guarantees**:
1. Uses Resend batch API (single call for all recipients)
2. Renders email via React Email template
3. Returns Resend batch ID for tracking
4. Handles partial failures (continues sending to others)
5. Logs all failures with email addresses

---

### Action: `sendAdminReport`

**Purpose**: Send delivery report to group admins after newsletter generation

**Input**:
```typescript
{
  groupId: Id<"groups">
  newsletterId: Id<"newsletters">
}
```

**Output**:
```typescript
{
  results: Array<{
    adminEmail: string
    success: boolean
  }>
}
```

**Contract Guarantees**:
1. Sends to all group admins
2. Includes delivery stats (sent, failed)
3. Includes contribution counts
4. Includes excluded member names
5. Email uses DaisyUI design system

---

## 🎨 Frontend Component Contracts

### Component: `ManualNewsletterTrigger`

**Purpose**: Admin UI for manually triggering newsletter generation

**Props**:
```typescript
interface ManualNewsletterTriggerProps {
  groupId: Id<"groups">
  currentMonth: string // "YYYY-MM"
}
```

**Behavior**:
1. Shows button only if user is admin (check via `useQuery`)
2. Opens confirmation modal on click
3. Calls `generateNewsletterManually` mutation
4. Shows loading state during generation
5. Displays success/error message
6. Disables button while loading

**Output States**:
- **Idle**: Button enabled, no message
- **Loading**: Button disabled, spinner visible
- **Success**: Success alert with count (e.g., "Newsletter sent to 5 members!")
- **Error**: Error alert with message (e.g., "No contributions yet")

---

### Component: `VideoModal`

**Purpose**: Modal player for videos in Photo Wall

**Props**:
```typescript
interface VideoModalProps {
  videoUrl: string
  caption?: string
  onClose: () => void
}
```

**Behavior**:
1. Opens modal with HTML5 video player
2. Video autoplays on open
3. Shows caption below video (if provided)
4. Close button in top-right
5. Click backdrop to close
6. Responsive: Scales on mobile

**Output States**:
- **Open**: Modal visible, video playing
- **Closed**: Modal hidden

---

## 📧 Email Template Contracts

### Template: `NewsletterEmail`

**Purpose**: React Email template for newsletter emails

**Props**:
```typescript
interface NewsletterEmailProps {
  groupName: string
  groupCoverImage?: string
  groupAvatarImage?: string
  month: string // "YYYY-MM"
  contributions: Array<{
    userName: string
    userAvatar?: string
    promptNumber: number
    promptText: string
    responseText?: string
    responseImages?: Array<{
      url: string
      isVideo: boolean
      caption?: string
    }>
  }>
  webViewUrl: string // Full URL to web issue page
}
```

**Output**: HTML string (email-safe)

**Contract Guarantees**:
1. Layout matches web app (cover, avatar, prompts, responses)
2. All elements wrapped in links to `webViewUrl`
3. Images embedded (not broken links)
4. Videos show thumbnail with "▶ Watch" overlay
5. Footer CTA: "View Full Version" button
6. DaisyUI cupcake colors (inline styles)
7. Email-safe CSS (tables, no flexbox/grid)

---

### Plain Text Version

**Function**: `newsletterEmailText(props: NewsletterEmailProps)`

**Output**: Plain text string

**Contract Guarantees**:
1. Same content as HTML version
2. Readable on text-only clients
3. Includes `webViewUrl` at bottom

---

## 🔗 Integration Contracts

### Resend Batch API

**Endpoint**: `POST https://api.resend.com/emails/batch`

**Request**:
```json
{
  "from": "2Sat Updates <onboarding@resend.dev>",
  "to": ["user1@example.com", "user2@example.com"],
  "subject": "Your October 2025 update is here! 📬",
  "html": "<html>...</html>",
  "text": "Plain text version..."
}
```

**Response**:
```json
{
  "id": "batch_abc123",
  "sent": 5
}
```

**Contract Guarantees**:
1. Single API call for all recipients
2. Returns batch ID for tracking
3. `sent` count matches `to` array length
4. Failures logged separately

---

### Convex Cron Job

**Schedule**: `0 12 * * 6#2` (Every 2nd Saturday at 12PM UTC)

**Handler**: `internal.newsletters.generateAllNewsletters`

**Contract Guarantees**:
1. Runs automatically on schedule
2. Generates newsletters for all groups
3. Handles errors per-group (one group failure doesn't block others)
4. Logs results

---

## 🧪 Helper Functions

### `generateNewsletterWebHTML`

**Purpose**: Generate HTML for web view

**Input**:
```typescript
(
  contributions: ContributionWithUser[],
  group: GroupData,
  prompts: PromptConfig[],
  month: string
): string
```

**Output**: HTML string with DaisyUI classes

**Contract Guarantees**:
1. One section per prompt
2. Member responses grouped under prompt
3. Images use thumbnails
4. Videos have `data-video-url` attribute for modal
5. Links in text are hyperlinked

---

### `linkifyText`

**Purpose**: Convert URLs in text to clickable links

**Input**: `string`

**Output**: `JSX.Element`

**Contract Guarantees**:
1. Detects all `http://` and `https://` URLs
2. Converts to `<a>` tags with `target="_blank"`
3. Preserves non-URL text

---

## ⚠️ Error Handling Contracts

### Backend Errors

All backend mutations/queries throw `ConvexError` with descriptive messages:

```typescript
throw new ConvexError("Only admins can manually generate newsletters")
```

Frontend should catch and display these messages to users.

### Frontend Errors

All frontend components handle errors gracefully:

```typescript
try {
  await generateNewsletter({ groupId, month })
} catch (error) {
  setResult({
    type: "error",
    message: error.message || "An unexpected error occurred"
  })
}
```

---

## 🎯 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-10-12 | Initial contracts defined |

---

## 📝 Notes

- All timestamps are in Unix milliseconds (`Date.now()`)
- All IDs use Convex ID types (`Id<"table">`)
- All dates in "YYYY-MM" format for consistency
- All URLs are absolute (include protocol)
- All email addresses validated before sending

---

**Maintained By**: Newsletter Generation System Team
**Contact**: See `.claude/projects/newsletter-generation/STORY_TRACKER.md`
