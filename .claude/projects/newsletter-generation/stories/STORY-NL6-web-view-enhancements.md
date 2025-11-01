# STORY-NL6: Web View Enhancements

**Status**: 🟡 Pending
**Estimated Effort**: 2.5 hours
**Agent**: Frontend Agent
**Dependencies**: None (can start immediately)
**Blocks**: NL8 (E2E Tests)

---

## 📋 Story Description

Enhance the web issue view with video modal player, link detection in text prompts, and excluded member messaging.

---

## 🎯 Acceptance Criteria

1. ✅ Videos in Photo Wall open in modal player (click thumbnail → modal with video)
2. ✅ Links in text prompts (prompt1, prompt3-5) converted to clickable hyperlinks
3. ✅ Excluded members see encouraging message: "You didn't contribute this month - we'd love to see your updates next time!"
4. ✅ Excluded members can still VIEW all contributions (not blocked from content)
5. ✅ Modal responsive (works on mobile)
6. ✅ Video player controls (play, pause, volume, fullscreen)
7. ✅ Visual regression tests at 3 breakpoints

---

## 📝 Technical Specification

### Video Modal Component

Create `components/newsletter/VideoModal.tsx`:

```typescript
"use client";

import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface VideoModalProps {
  videoUrl: string;
  caption?: string;
  onClose: () => void;
}

export default function VideoModal({ videoUrl, caption, onClose }: VideoModalProps) {
  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl p-0 overflow-hidden">
        {/* Close button */}
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10"
          onClick={onClose}
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        {/* Video player */}
        <video
          src={videoUrl}
          controls
          autoPlay
          className="w-full h-auto max-h-[80vh]"
          style={{ display: "block" }}
        >
          Your browser does not support the video tag.
        </video>

        {/* Caption */}
        {caption && (
          <div className="p-4 bg-base-200">
            <p className="text-sm text-base-content/80">{caption}</p>
          </div>
        )}
      </div>

      {/* Backdrop */}
      <div className="modal-backdrop bg-black/70" onClick={onClose}></div>
    </div>
  );
}
```

### Photo Wall Enhancement

Update `components/groups/GroupEmptyState.tsx` to handle video thumbnails:

```typescript
"use client";

import { useState } from "react";
import VideoModal from "../newsletter/VideoModal";
import { getStorageUrl } from "@/lib/storageUtils";

// ... existing code ...

export default function GroupEmptyState({ ... }) {
  const [activeVideo, setActiveVideo] = useState<{
    url: string;
    caption?: string;
  } | null>(null);

  // ... existing rendering logic ...

  // Render Photo Wall (prompt2)
  const renderPhotoWall = (photos: PhotoWallItem[]) => {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {photos.map((photo, index) => {
          const isVideo = photo.storageId.toLowerCase().match(/\.(mp4|mov|avi|webm)$/);
          const thumbnailUrl = getStorageUrl(photo.thumbnailId);
          const fullUrl = getStorageUrl(photo.storageId);

          return (
            <div
              key={index}
              className="relative aspect-square cursor-pointer hover:opacity-90 transition"
              onClick={() => {
                if (isVideo) {
                  setActiveVideo({ url: fullUrl, caption: photo.caption });
                } else {
                  // Open image in new tab or lightbox
                  window.open(fullUrl, "_blank");
                }
              }}
            >
              <img
                src={thumbnailUrl}
                alt={photo.caption || ""}
                className="w-full h-full object-cover rounded-lg"
              />
              {isVideo && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                </div>
              )}
              {photo.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 rounded-b-lg">
                  {photo.caption}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* ... existing JSX ... */}

      {/* Video Modal */}
      {activeVideo && (
        <VideoModal
          videoUrl={activeVideo.url}
          caption={activeVideo.caption}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </>
  );
}
```

### Link Detection Helper

Create `lib/textUtils.ts`:

```typescript
/**
 * Convert text with URLs to JSX with clickable links
 */
export function renderTextWithLinks(text: string): JSX.Element {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return (
    <>
      {parts.map((part, index) => {
        if (part.match(urlRegex)) {
          return (
            <a
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="link link-primary"
            >
              {part}
            </a>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}
```

### Excluded Member Message

Update `components/groups/GroupEmptyState.tsx`:

```typescript
// Add to component logic
const isExcluded = newsletter?.excludedMemberIds?.includes(currentUserId);

// Render at top of content area
{isExcluded && (
  <div className="alert alert-info mb-6">
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <div>
      <h4 className="font-semibold">You didn't contribute this month</h4>
      <p className="text-sm">
        We'd love to see your updates next time! Check out what your friends shared below.
      </p>
    </div>
  </div>
)}
```

---

## 🧪 Testing Requirements

### Visual Regression Tests

Create `tests/visual/newsletter-web-view.spec.ts`:

```typescript
import { test, expect } from "@playwright/test";

test.describe("Newsletter Web View Enhancements", () => {
  test("video modal opens on thumbnail click", async ({ page }) => {
    await page.goto("/groups/test-group/issues/2025-10");

    // Click video thumbnail
    await page.click('[data-testid="video-thumbnail"]');

    // Verify modal opens
    await expect(page.locator(".modal")).toBeVisible();
    await expect(page.locator("video")).toBeVisible();
  });

  test("video modal closes on X button", async ({ page }) => {
    await page.goto("/groups/test-group/issues/2025-10");
    await page.click('[data-testid="video-thumbnail"]');

    // Click close button
    await page.click('button[aria-label="Close"]');

    // Verify modal closed
    await expect(page.locator(".modal")).not.toBeVisible();
  });

  test("links in text are clickable", async ({ page }) => {
    await page.goto("/groups/test-group/issues/2025-10");

    // Find link in text
    const link = page.locator('a[href^="http"]').first();
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("target", "_blank");
  });

  test("excluded member sees message", async ({ page }) => {
    // TODO: Mock user as excluded
    await page.goto("/groups/test-group/issues/2025-10");

    // Verify message is visible
    await expect(page.locator("text=You didn't contribute this month")).toBeVisible();
  });

  test("video modal is responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/groups/test-group/issues/2025-10");

    await page.click('[data-testid="video-thumbnail"]');

    // Verify modal fits on screen
    const modal = page.locator(".modal-box");
    const bbox = await modal.boundingBox();
    expect(bbox?.width).toBeLessThanOrEqual(375);
  });
});
```

### Visual Snapshots

Take screenshots at 3 breakpoints:
- Desktop: 1920x1080
- Tablet: 768x1024
- Mobile: 375x667

```typescript
test("visual regression - newsletter with video", async ({ page }) => {
  await page.goto("/groups/test-group/issues/2025-10");

  // Desktop
  await page.setViewportSize({ width: 1920, height: 1080 });
  await expect(page).toHaveScreenshot("newsletter-desktop.png");

  // Tablet
  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(page).toHaveScreenshot("newsletter-tablet.png");

  // Mobile
  await page.setViewportSize({ width: 375, height: 667 });
  await expect(page).toHaveScreenshot("newsletter-mobile.png");
});
```

---

## 📦 Deliverables

- ✅ `components/newsletter/VideoModal.tsx` component
- ✅ Updated `components/groups/GroupEmptyState.tsx` with video handling
- ✅ `lib/textUtils.ts` with link detection
- ✅ Excluded member message UI
- ✅ Visual regression tests passing
- ✅ Responsive on all breakpoints

---

## 🔗 Contracts

### Input Contract

- Contribution data with `prompt2` (Photo Wall) array
- Newsletter with `excludedMemberIds`
- Current user ID for exclusion check

### Component Props

```typescript
interface VideoModalProps {
  videoUrl: string
  caption?: string
  onClose: () => void
}
```

---

## ⚠️ Edge Cases

1. **No videos**: Show only images, no modal
2. **Broken video URL**: Show error message in modal
3. **Large video files**: Add loading spinner while video loads
4. **No caption**: Modal works without caption
5. **Multiple modals**: Only one modal open at a time

---

## 📚 References

- Current issue page: `app/groups/[groupId]/issues/[month]/page.tsx`
- GroupEmptyState: `components/groups/GroupEmptyState.tsx`
- DaisyUI modal: https://daisyui.com/components/modal/
- HTML5 video: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
