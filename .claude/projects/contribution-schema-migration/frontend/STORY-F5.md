# STORY-F5: Audio Upload Component

**Linear**: [2S6-15](https://linear.app/2s6y/issue/2S6-15/story-f5-audio-upload-component)
**Phase**: 1 (Parallel)
**Agent**: Frontend Agent
**Time**: 1 hour
**Priority**: P3 (Medium)
**Dependencies**: None

## Quick Summary
Create audio upload component for audio-type prompts.

## Tasks
- [ ] Create `components/forms/AudioUpload.tsx`:
  - Props: `value: string | undefined`, `onChange: (url: string) => void`
  - UI: File input (accept .mp3, .wav, .m4a)
  - Upload to Convex storage (similar to PhotoWall logic)
  - Display: Audio player + "Replace" button
  - Validation: Max 10MB file size
  - Loading state during upload
  - Error handling for upload failures
- [ ] Integrate with DaisyUI styling
- [ ] Responsive design
- [ ] Create visual tests at 3 breakpoints
- [ ] Create unit tests

## Contract Output
See `CONTRACTS.md` Section "Audio Upload Component" for props interface.

## Testing
- Visual test: Empty state (desktop/tablet/mobile)
- Visual test: Uploaded state with player
- Unit test: File size validation
- Unit test: Upload to storage

## Files
- `components/forms/AudioUpload.tsx` (new)
- `tests/visual/audio-upload.spec.ts` (new)
- `tests/unit/audio-upload.test.ts` (new)

## Linear Updates
- Set status to "In Progress" when starting
- Add test results as comment when done
- Set status to "Done" when tests pass
