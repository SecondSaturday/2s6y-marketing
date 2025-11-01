# STORY-NL2: HTML Generation Helpers

**Status**: ✅ Complete
**Estimated Effort**: 3 hours
**Actual Effort**: 2.5 hours
**Agent**: Backend Agent
**Dependencies**: NL1 (Schema Updates) - COMPLETED
**Blocks**: NL3 (Cron Job)
**Completed**: 2025-10-12

---

## 📋 Story Description

Create helper functions to generate newsletter HTML on-the-fly from contributions data. Two versions: email HTML (React Email) and web HTML (for rendering in browser).

---

## 🎯 Acceptance Criteria

1. ✅ Helper function generates email HTML from contributions
2. ✅ Helper function generates web HTML from contributions
3. ✅ Layout: One section per prompt, all member responses grouped under prompt
4. ✅ Images rendered with thumbnails (clickable to full size)
5. ✅ Videos prepared for modal (web) / placeholder (email)
6. ✅ Links in text prompts converted to hyperlinks
7. ✅ DaisyUI cupcake theme styling applied
8. ✅ Unit tests verify HTML output structure

---

## 📝 Technical Specification

### File Structure

Create `convex/helpers/newsletterHTML.ts`:

```typescript
import { Doc, Id } from "../_generated/dataModel";

export type ContributionWithUser = {
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
}

export type GroupData = {
  _id: Id<"groups">
  name: string
  coverImage?: string
  groupImage?: string
}

export type PromptConfig = {
  promptNumber: number
  promptText: string
  promptType: "text" | "media"
}

/**
 * Generate newsletter HTML structure for web view
 * Returns HTML string with DaisyUI classes
 */
export function generateNewsletterWebHTML(
  contributions: ContributionWithUser[],
  group: GroupData,
  prompts: PromptConfig[],
  month: string
): string {
  // Implementation: Generate HTML with:
  // - Group cover image
  // - Group name + month
  // - For each prompt:
  //   - Prompt text header
  //   - For each contribution:
  //     - User avatar + name
  //     - Response (text with hyperlinked URLs, or media grid)
  //     - Video data attributes for modal (data-video-url="...")
}

/**
 * Generate newsletter HTML structure for email
 * Returns simplified HTML (email-safe, no complex CSS)
 */
export function generateNewsletterEmailHTML(
  contributions: ContributionWithUser[],
  group: GroupData,
  prompts: PromptConfig[],
  month: string,
  webViewUrl: string
): string {
  // Implementation: Generate HTML with:
  // - Same layout as web
  // - All elements wrapped in links to web app
  // - Inline styles (email-safe)
  // - Footer CTA: "View full version" button
}

/**
 * Convert text with URLs to hyperlinked HTML
 */
export function linkifyText(text: string): string {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener">$1</a>');
}

/**
 * Get Convex storage URL for image/video
 */
export function getStorageUrl(storageId: string): string {
  // Use Convex storage URL generation
  return `${process.env.CONVEX_URL}/storage/${storageId}`;
}
```

### Helper for Determining Video Type

```typescript
/**
 * Check if file is video based on storageId metadata
 * (Convex stores MIME type with file)
 */
export function isVideo(storageId: string): boolean {
  // Implementation: Query Convex storage metadata
  // or use file extension as fallback
  const videoExtensions = ['.mp4', '.mov', '.avi', '.webm'];
  return videoExtensions.some(ext => storageId.toLowerCase().endsWith(ext));
}
```

---

## 🧪 Testing Requirements

### Unit Tests

Create `tests/backend/newsletterHTML.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import {
  generateNewsletterWebHTML,
  generateNewsletterEmailHTML,
  linkifyText
} from "@/convex/helpers/newsletterHTML";

describe("Newsletter HTML Helpers", () => {
  const mockContributions = [
    {
      _id: "contribution1" as any,
      userId: "user1" as any,
      prompt1: "This is my text response with https://example.com link",
      prompt2: [
        {
          storageId: "img_123",
          thumbnailId: "thumb_123",
          caption: "Test image",
          uploadedAt: Date.now(),
        },
      ],
      prompt3: "Another response",
      status: "submitted" as const,
      submittedAt: Date.now(),
      user: {
        _id: "user1" as any,
        name: "Test User",
        profileImage: "https://example.com/avatar.jpg",
        email: "test@example.com",
      },
    },
  ];

  const mockGroup = {
    _id: "group1" as any,
    name: "Test Group",
    coverImage: "cover.jpg",
    groupImage: "avatar.jpg",
  };

  const mockPrompts = [
    { promptNumber: 1, promptText: "What did you do?", promptType: "text" as const },
    { promptNumber: 2, promptText: "Photo Wall", promptType: "media" as const },
  ];

  it("should generate web HTML with correct structure", () => {
    const html = generateNewsletterWebHTML(mockContributions, mockGroup, mockPrompts, "2025-10");

    expect(html).toContain(mockGroup.name);
    expect(html).toContain("What did you do?");
    expect(html).toContain("This is my text response");
  });

  it("should linkify URLs in text", () => {
    const text = "Check out https://example.com for more info";
    const linked = linkifyText(text);

    expect(linked).toContain('<a href="https://example.com"');
    expect(linked).toContain('target="_blank"');
  });

  it("should generate email HTML with CTA footer", () => {
    const html = generateNewsletterEmailHTML(
      mockContributions,
      mockGroup,
      mockPrompts,
      "2025-10",
      "https://app.2sat.io/groups/group1/issues/2025-10"
    );

    expect(html).toContain("View full version");
    expect(html).toContain("https://app.2sat.io");
  });
});
```

---

## 📦 Deliverables

- ✅ `convex/helpers/newsletterHTML.ts` with all helper functions
- ✅ Linkify function for text prompts
- ✅ Storage URL generation helper
- ✅ Unit tests passing
- ✅ HTML output verified manually (visual check)

---

## 🔗 Contracts

### Input Contract (from NL1)

```typescript
type ContributionData = {
  contributions: ContributionWithUser[]
  group: GroupData
  prompts: PromptConfig[]
  month: string
}
```

### Output Contract

```typescript
// Functions exported for use in NL3 (Cron) and NL7 (Email Template)
generateNewsletterWebHTML(contributions, group, prompts, month): string
generateNewsletterEmailHTML(contributions, group, prompts, month, webViewUrl): string
linkifyText(text: string): string
```

**Next Stories Depending on This**:
- NL3: Cron Job (will call these helpers)
- NL7: Email Template (may use helpers for rendering)

---

## ⚠️ Edge Cases

1. **No contributions**: Return empty state HTML
2. **Missing user data**: Handle null user gracefully
3. **Long URLs**: Wrap or truncate in email view
4. **Special characters**: Escape HTML entities (prevent XSS)
5. **Large images**: Use thumbnails for email, full size for web
6. **Video in email**: Show placeholder image (videos don't play in email clients)

---

## 📚 References

- Current issue page: `app/groups/[groupId]/issues/[month]/page.tsx`
- GroupEmptyState component: `components/groups/GroupEmptyState.tsx`
- DaisyUI docs: https://daisyui.com/components/
- Convex storage: https://docs.convex.dev/file-storage
