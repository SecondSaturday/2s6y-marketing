# STORY-NL7: Newsletter Email Template (React Email)

**Status**: 🟡 Pending
**Estimated Effort**: 2.5 hours
**Agent**: Frontend Agent
**Dependencies**: None (can start immediately)
**Blocks**: NL8 (E2E Tests)

---

## 📋 Story Description

Create React Email template for the newsletter email that matches the web app layout (cover, avatar, prompts, responses) with all elements clickable leading to the web app.

---

## 🎯 Acceptance Criteria

1. ✅ Template: `emails/NewsletterEmail.tsx` created
2. ✅ Layout matches web app: Group cover, name, prompt sections, member responses
3. ✅ All elements clickable → link to web app issue page
4. ✅ Images embedded (not broken links)
5. ✅ Videos show thumbnail with "Watch" overlay (no inline video players in email)
6. ✅ Footer CTA: "View Full Version" button
7. ✅ DaisyUI cupcake colors used (inline styles)
8. ✅ Email-safe CSS (no flexbox, grid uses tables)
9. ✅ Plain text version included
10. ✅ Visual test: Email renders correctly in preview

---

## 📝 Technical Specification

### Email Template

Create `emails/NewsletterEmail.tsx`:

```typescript
import React from 'react';
import { Html, Head, Body, Container, Section, Text, Link, Img, Hr } from '@react-email/components';

export interface NewsletterEmailProps {
  groupName: string;
  groupCoverImage?: string;
  groupAvatarImage?: string;
  month: string; // "2025-10"
  contributions: Array<{
    userName: string;
    userAvatar?: string;
    promptNumber: number;
    promptText: string;
    responseText?: string;
    responseImages?: Array<{ url: string; isVideo: boolean; caption?: string }>;
  }>;
  webViewUrl: string; // Full URL to web issue page
}

export default function NewsletterEmail({
  groupName,
  groupCoverImage,
  groupAvatarImage,
  month,
  contributions,
  webViewUrl,
}: NewsletterEmailProps) {
  const formattedMonth = formatMonth(month);

  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Cover Image */}
          {groupCoverImage && (
            <Link href={webViewUrl} style={styles.link}>
              <Img
                src={groupCoverImage}
                alt={groupName}
                width="600"
                height="200"
                style={styles.coverImage}
              />
            </Link>
          )}

          {/* Header */}
          <Section style={styles.header}>
            {groupAvatarImage && (
              <Img
                src={groupAvatarImage}
                alt={groupName}
                width="60"
                height="60"
                style={styles.groupAvatar}
              />
            )}
            <Link href={webViewUrl} style={styles.link}>
              <Text style={styles.groupName}>{groupName}</Text>
              <Text style={styles.monthText}>{formattedMonth} Issue</Text>
            </Link>
          </Section>

          <Hr style={styles.divider} />

          {/* Group contributions by prompt */}
          {groupByPrompt(contributions).map((promptGroup) => (
            <Section key={promptGroup.promptNumber} style={styles.promptSection}>
              {/* Prompt Header */}
              <Link href={webViewUrl} style={styles.link}>
                <Text style={styles.promptText}>{promptGroup.promptText}</Text>
              </Link>

              {/* Member Responses */}
              {promptGroup.responses.map((response, index) => (
                <Section key={index} style={styles.responseCard}>
                  {/* User Info */}
                  <table width="100%" cellPadding="0" cellSpacing="0">
                    <tr>
                      <td width="50" valign="top">
                        {response.userAvatar && (
                          <Link href={webViewUrl}>
                            <Img
                              src={response.userAvatar}
                              alt={response.userName}
                              width="40"
                              height="40"
                              style={styles.userAvatar}
                            />
                          </Link>
                        )}
                      </td>
                      <td valign="top">
                        <Link href={webViewUrl} style={styles.link}>
                          <Text style={styles.userName}>{response.userName}</Text>
                        </Link>

                        {/* Text Response */}
                        {response.responseText && (
                          <Link href={webViewUrl} style={styles.link}>
                            <Text style={styles.responseText}>{response.responseText}</Text>
                          </Link>
                        )}

                        {/* Image/Video Grid */}
                        {response.responseImages && response.responseImages.length > 0 && (
                          <table cellPadding="4" cellSpacing="0" style={{ marginTop: '10px' }}>
                            <tr>
                              {response.responseImages.slice(0, 3).map((media, i) => (
                                <td key={i} style={{ position: 'relative' }}>
                                  <Link href={webViewUrl}>
                                    <Img
                                      src={media.url}
                                      alt={media.caption || ''}
                                      width="180"
                                      height="180"
                                      style={styles.mediaImage}
                                    />
                                  </Link>
                                  {media.isVideo && (
                                    <div style={styles.videoOverlay}>
                                      <Text style={styles.videoText}>▶ Watch</Text>
                                    </div>
                                  )}
                                </td>
                              ))}
                            </tr>
                          </table>
                        )}
                      </td>
                    </tr>
                  </table>
                </Section>
              ))}
            </Section>
          ))}

          <Hr style={styles.divider} />

          {/* Footer CTA */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              Want to see the full experience with videos and interactions?
            </Text>
            <Link href={webViewUrl} style={styles.ctaButton}>
              View Full Version
            </Link>
            <Text style={styles.footerSecondary}>
              2Sat - Monthly Friend Updates
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles (inline, email-safe)
const styles = {
  body: {
    backgroundColor: '#f8f2ed',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '20px',
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
  header: {
    padding: '20px',
    textAlign: 'center' as const,
  },
  groupAvatar: {
    borderRadius: '50%',
    marginBottom: '10px',
  },
  groupName: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333333',
    margin: '10px 0 5px 0',
  },
  monthText: {
    fontSize: '14px',
    color: '#666666',
    margin: '0',
  },
  divider: {
    borderTop: '1px solid #e5e7eb',
    margin: '20px 0',
  },
  promptSection: {
    padding: '0 20px 20px 20px',
  },
  promptText: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#a442fe',
    margin: '10px 0',
  },
  responseCard: {
    backgroundColor: '#f8f2ed',
    borderRadius: '8px',
    padding: '15px',
    marginTop: '15px',
  },
  userAvatar: {
    borderRadius: '50%',
  },
  userName: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333333',
    margin: '0 0 5px 0',
  },
  responseText: {
    fontSize: '14px',
    color: '#333333',
    lineHeight: '1.5',
    margin: '5px 0',
  },
  mediaImage: {
    borderRadius: '8px',
    display: 'block',
  },
  videoOverlay: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: '8px',
    padding: '8px 16px',
  },
  videoText: {
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: 'bold',
    margin: '0',
  },
  footer: {
    padding: '30px 20px',
    textAlign: 'center' as const,
    backgroundColor: '#f8f2ed',
  },
  footerText: {
    fontSize: '14px',
    color: '#666666',
    margin: '0 0 20px 0',
  },
  ctaButton: {
    display: 'inline-block',
    backgroundColor: '#a442fe',
    color: '#ffffff',
    padding: '12px 32px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  footerSecondary: {
    fontSize: '12px',
    color: '#999999',
    margin: '20px 0 0 0',
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
};

// Helper: Group contributions by prompt
function groupByPrompt(contributions: NewsletterEmailProps['contributions']) {
  const grouped: Record<number, typeof contributions> = {};

  contributions.forEach((contribution) => {
    if (!grouped[contribution.promptNumber]) {
      grouped[contribution.promptNumber] = [];
    }
    grouped[contribution.promptNumber].push(contribution);
  });

  return Object.entries(grouped).map(([promptNumber, responses]) => ({
    promptNumber: parseInt(promptNumber),
    promptText: responses[0].promptText,
    responses,
  }));
}

// Helper: Format month
function formatMonth(month: string): string {
  const [year, monthNum] = month.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(monthNum) - 1]} ${year}`;
}

// Plain text version
export const newsletterEmailText = (props: NewsletterEmailProps) => `
${props.groupName} - ${formatMonth(props.month)} Issue

${props.contributions.map(c => `
${c.promptText}

${c.userName}:
${c.responseText || '(Media content)'}
`).join('\n---\n')}

View the full version with images and videos:
${props.webViewUrl}

---
2Sat - Monthly Friend Updates
`.trim();
```

### Integration with Resend

Update `convex/emails.ts` to use React Email:

```typescript
import { action } from "./_generated/server";
import { v } from "convex/values";
import { render } from "@react-email/render";
import NewsletterEmail, { newsletterEmailText } from "../emails/NewsletterEmail";

export const sendNewsletterBatch = action({
  args: {
    groupId: v.id("groups"),
    month: v.string(),
    recipientEmails: v.array(v.string()),
    contributions: v.any(), // ContributionWithUser[]
  },
  handler: async (ctx, args) => {
    const { resendApiKey, fromEmail, appUrl } = getEmailConfig();

    // Build web view URL
    const webViewUrl = `${appUrl}/groups/${args.groupId}/issues/${args.month}`;

    // Render email HTML
    const emailHtml = await render(
      NewsletterEmail({
        groupName: "Group Name", // TODO: Pass from args
        month: args.month,
        contributions: formatContributionsForEmail(args.contributions),
        webViewUrl,
      })
    );

    const emailText = newsletterEmailText({
      // same props
    });

    // Send via Resend batch API
    const response = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: args.recipientEmails,
        subject: `Your ${formatMonth(args.month)} update is here! 📬`,
        html: emailHtml,
        text: emailText,
      }),
    });

    const data = await response.json();

    return {
      batchId: data.id,
      sent: args.recipientEmails.length,
      failed: 0,
      failedEmails: [],
    };
  },
});
```

---

## 🧪 Testing Requirements

### Preview Test

```bash
npm run email:dev
```

Navigate to http://localhost:3000 and verify:
- Layout matches web app
- All links work
- Images load correctly
- Responsive on mobile preview

### Visual Test

Create `tests/visual/newsletter-email.spec.ts`:

```typescript
import { test, expect } from "@playwright/test";
import { render } from "@react-email/render";
import NewsletterEmail from "@/emails/NewsletterEmail";

test("newsletter email renders correctly", async ({ page }) => {
  const html = await render(
    NewsletterEmail({
      groupName: "Test Group",
      month: "2025-10",
      contributions: mockContributions,
      webViewUrl: "https://app.2sat.io/groups/test/issues/2025-10",
    })
  );

  await page.setContent(html);
  await expect(page).toHaveScreenshot("newsletter-email.png");
});
```

---

## 📦 Deliverables

- ✅ `emails/NewsletterEmail.tsx` template
- ✅ Plain text version exported
- ✅ Integration with Resend in `convex/emails.ts`
- ✅ Email preview working (npm run email:dev)
- ✅ Visual test passing

---

## 🔗 Contracts

### Input Props

```typescript
interface NewsletterEmailProps {
  groupName: string
  groupCoverImage?: string
  groupAvatarImage?: string
  month: string
  contributions: Array<{
    userName: string
    userAvatar?: string
    promptNumber: number
    promptText: string
    responseText?: string
    responseImages?: Array<{ url: string; isVideo: boolean; caption?: string }>
  }>
  webViewUrl: string
}
```

---

## ⚠️ Edge Cases

1. **No cover image**: Skip cover section
2. **Long text**: Truncate after 500 chars, add "Read more" link
3. **Many images**: Show first 3, add "View all" link
4. **Broken image URLs**: Use placeholder

---

## 📚 References

- React Email docs: https://react.email/docs/introduction
- Existing email templates: `emails/GroupInviteEmail.tsx`
- Resend batch API: https://resend.com/docs/api-reference/batch
