# STORY-B2: Reminder Email Templates

**Linear ID**: 2S6-45
**Agent**: Backend Agent (`backend-dev`)
**Estimated Time**: 2 hours
**Status**: BLOCKED (by STORY-B1)
**Blocks**: STORY-I1

---

## User Story

As a 2Sat-lite user, I want to receive email reminders (in addition to in-app notifications) so I don't miss the deadline, even when I'm not actively using the app.

---

## Acceptance Criteria

1. ✅ React email template created (`ReminderEmail.tsx`)
2. ✅ Email template styled correctly (similar to existing email templates)
3. ✅ Notification watcher triggers Resend emails when type="contribution_reminder"
4. ✅ Email preferences respected (`user.emailPreferences.reminders === true`)
5. ✅ Users who opted out don't receive emails
6. ✅ Real reminder emails sent via Resend
7. ✅ Proper error handling (log failed sends, don't crash)

---

## Technical Details

### Files to Create/Modify
- `emails/ReminderEmail.tsx` - React email component
- `convex/notifications.ts` (or new watcher file) - Watch for contribution_reminder notifications and trigger emails

### Email Template Structure
```tsx
// emails/ReminderEmail.tsx
import { Html, Head, Body, Container, Section, Text, Button, Hr } from '@react-email/components';

interface ReminderEmailProps {
  userName: string;
  groupName: string;
  daysRemaining: 7 | 3 | 1;
  contributeUrl: string;
}

export default function ReminderEmail({ userName, groupName, daysRemaining, contributeUrl }: ReminderEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Text style={heading}>
            {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left!
          </Text>
          <Text style={paragraph}>
            Hi {userName},
          </Text>
          <Text style={paragraph}>
            Just a friendly reminder that your {groupName} contribution is due in {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}.
          </Text>
          <Text style={paragraph}>
            Don't forget to submit your responses before the 2nd Saturday!
          </Text>
          <Button style={button} href={contributeUrl}>
            Submit Now
          </Button>
          <Hr style={hr} />
          <Text style={footer}>
            You can manage your email preferences in your account settings.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles similar to existing email templates
const main = { backgroundColor: '#f6f9fc', fontFamily: 'sans-serif' };
// ... more styles
```

### Notification Watcher Logic
```typescript
// Option 1: Add to existing notifications.ts
// Option 2: Create convex/watchers/reminderEmailWatcher.ts

export const sendReminderEmails = internalAction({
  args: {},
  handler: async (ctx) => {
    // 1. Query recent contribution_reminder notifications (last 5 minutes)
    const recentReminders = await ctx.runQuery(
      internal.notifications.getRecentReminders,
      { since: Date.now() - 5 * 60 * 1000 }
    );

    // 2. For each notification:
    for (const notification of recentReminders) {
      // a. Get user data (check emailPreferences.reminders)
      const user = await ctx.runQuery(internal.users.getUser, { userId: notification.userId });

      if (!user || user.emailPreferences?.reminders === false) {
        console.log(`[ReminderEmail] Skipping ${user?.email} (opted out)`);
        continue;
      }

      // b. Render email template
      const emailHtml = render(
        ReminderEmail({
          userName: user.name || user.email,
          groupName: notification.metadata.groupName,
          daysRemaining: notification.metadata.daysRemaining,
          contributeUrl: `${process.env.NEXT_PUBLIC_APP_URL}${notification.metadata.actionUrl}`
        })
      );

      // c. Send via Resend
      try {
        await resend.emails.send({
          from: 'Second Saturday <noreply@secondsaturday.app>',
          to: user.email,
          subject: `Reminder: ${notification.metadata.groupName} contribution due in ${notification.metadata.daysRemaining} days`,
          html: emailHtml,
        });
        console.log(`[ReminderEmail] Sent to ${user.email}`);
      } catch (error) {
        console.error(`[ReminderEmail] Failed to send to ${user.email}:`, error);
        // Don't throw - log and continue
      }
    }
  }
});

// Trigger this watcher via a cron (every 5 minutes) or via HTTP webhook
```

### Integration with Crons
Two approaches:

**Approach A**: Crons directly call email action after creating notifications
```typescript
// In STORY-B1 cron logic (after creating notifications)
await ctx.scheduler.runAfter(0, internal.watchers.sendReminderEmails);
```

**Approach B**: Separate cron runs every 5 minutes to check for new reminders
```typescript
// Add to convex/crons.ts
crons.interval(
  "processReminderEmails",
  { minutes: 5 },
  internal.watchers.sendReminderEmails
);
```

**Recommendation**: Use Approach A (direct call) for immediate email delivery.

---

## Testing Requirements

### Unit Tests
```typescript
// Test email template renders correctly
describe("ReminderEmail", () => {
  it("renders 7-day reminder correctly", () => {
    const html = render(ReminderEmail({
      userName: "Alice",
      groupName: "My Friends",
      daysRemaining: 7,
      contributeUrl: "https://app.com/contribute"
    }));
    expect(html).toContain("7 days left!");
  });
});
```

### Manual Verification
1. Create a test notification (type="contribution_reminder") in dev database
2. Trigger email watcher
3. Verify email received in inbox (use real email or Resend test mode)
4. Verify email preferences respected (opt-out test)
5. Verify error handling (invalid email address)

---

## Dependencies

### Backend Dependencies
- Resend API key (`process.env.RESEND_API_KEY`)
- React Email package (`@react-email/components`)
- Existing email templates for styling reference
- Notifications from STORY-B1 (type="contribution_reminder")

### Contract with STORY-B1
**Input**: Notifications created with:
```typescript
{
  type: "contribution_reminder",
  metadata: {
    groupName: string,
    daysRemaining: 7 | 3 | 1,
    actionUrl: string
  }
}
```

---

## Implementation Notes

**TDD Approach**: Write email template test first, then implement.

**Email Preferences**: MUST check `user.emailPreferences.reminders` before sending. Users who opted out should NOT receive emails.

**Error Handling**: Resend may fail (rate limits, invalid email, etc.). Log errors but don't crash.

**Resend Rate Limits**: Free tier = 100 emails/day. For MVP, this is fine. Log warnings if approaching limit.

**Testing Emails**: Use Resend test mode or a real email address (your own) for manual verification.

---

## Success Criteria

**DONE when**:
1. ✅ Email template renders correctly (manual inspection)
2. ✅ Emails sent via Resend when notifications created
3. ✅ Email preferences respected (opt-out users don't receive emails)
4. ✅ Unit tests passing
5. ✅ Manual test shows real email received in inbox
6. ✅ Error handling works (doesn't crash on Resend failures)
7. ✅ Backend Agent reports story complete

---

**Created**: 2025-10-23
**Linear**: https://linear.app/2s6y/issue/2S6-45
