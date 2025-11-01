# Email Preferences System - Quick Start Guide

**Project**: Email Preferences System
**Linear**: https://linear.app/2s6y/project/email-preferences-system-3502f31da2dd
**Total Time**: 4 hours (2 hours parallel execution)

---

## Execution Strategy

### Parallel Execution (2 hours wall time)
```bash
# Terminal 1: STORY-EP1 (Backend)
cd /Users/kalyanchandana/Documents/GitHub/2Sat-lite
claude-code

"Implement STORY-EP1 from Linear issue 2S6-40: Add emailPreferences schema field to users table
(7 boolean fields: groupInvites, joinRequests, memberUpdates, adminTransfer, newsletters, reminders, issueReady).
Create getUserEmailPreferences query, updateEmailPreferences mutation, and shouldSendEmail helper.
Update all 7 email actions in convex/emailActions.ts to check preferences before sending.
Use backend-dev agent."

# Terminal 2: STORY-EP2 (Frontend) - START SIMULTANEOUSLY
cd /Users/kalyanchandana/Documents/GitHub/2Sat-lite
claude-code

"Implement STORY-EP2 from Linear issue 2S6-42: Add Email Preferences section to settings page (/app/settings/page.tsx).
Add 7 DaisyUI toggle switches for each preference type (groupInvites, joinRequests, memberUpdates, adminTransfer, newsletters, reminders, issueReady).
Fetch preferences on load, save when toggled, show success/error toasts.
Use frontend-dev agent."
```

---

## Story Details

### STORY-EP1: Backend Schema + Logic (2h)
**Files to Create**: `convex/users/preferences.ts`
**Files to Modify**: `convex/schema.ts` (add emailPreferences), `convex/emailActions.ts` (add checks)

**Schema Addition**:
```typescript
emailPreferences: v.optional(v.object({
  groupInvites: v.boolean(),
  joinRequests: v.boolean(),
  memberUpdates: v.boolean(),
  adminTransfer: v.boolean(),
  newsletters: v.boolean(),
  reminders: v.boolean(),
  issueReady: v.boolean(),
}))
```

**Success**: Preferences saved, email actions respect preferences, 6 unit tests passing

---

### STORY-EP2: Frontend Preferences UI (2h)
**Files to Modify**: `app/settings/page.tsx`

**UI Section**:
- 7 DaisyUI toggle switches
- Labels with descriptions
- Auto-save on toggle
- Success/error toasts

**Success**: UI functional, preferences persist, mobile-responsive

---

## Verification Checklist

### Backend Verification
- [ ] `users.emailPreferences` field in schema
- [ ] `getUserEmailPreferences` query works
- [ ] `updateEmailPreferences` mutation saves
- [ ] `shouldSendEmail` helper checks preferences
- [ ] All 7 email actions check preferences
- [ ] Unit tests passing (6/6)

### Frontend Verification
- [ ] Email Preferences section in settings page
- [ ] 7 toggles display correctly
- [ ] Preferences fetched on page load
- [ ] Toggles save when clicked
- [ ] Success toast shows
- [ ] Error toast shows on failure
- [ ] Mobile-responsive

### Integration Verification
- [ ] Toggle off groupInvites → no invite emails sent
- [ ] Toggle off reminders → no reminder emails sent
- [ ] Toggle off newsletters → no newsletter emails sent
- [ ] Preferences persist across sessions

---

## Success Metrics

**Project Complete When**:
- ✅ 7 email preference types in schema
- ✅ Settings page has Email Preferences section
- ✅ All email actions respect preferences
- ✅ Users can opt-out of any email type
- ✅ Preferences persist correctly

---

**See Linear issues 2S6-40 and 2S6-42 for full implementations.**
