# STORY-C2: Build Step 1 - Basic Info UI

**Track:** C (Frontend) | **Agent:** frontend-dev | **Time:** 30min | **Dependencies:** C1 | **Blocks:** B1 | **Phase:** 2

## Tasks
1. Create BasicInfoStep component with name/meta/description fields
2. Implement auto-generation of meta from name (debounced)
3. Add validation (name required, meta URL-safe)
4. Character counters (50, 30, 200 chars)

## Acceptance Criteria
- [ ] Name input (required, 1-50 chars)
- [ ] Meta input (auto-gen, editable, URL-safe)
- [ ] Description textarea (optional, 200 chars)
- [ ] Validation on blur
- [ ] Visual tests (3 breakpoints)

**Contract:** `contracts/frontend-props.md` (BasicInfoStep)
