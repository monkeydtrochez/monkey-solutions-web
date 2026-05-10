# Phase 4: experience-skills-services - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-10
**Phase:** 04-experience-skills-services
**Areas discussed:** WorkExperience schema gaps, Education: array + fieldOfStudy, Hardcoded content timing

---

## WorkExperience schema gaps

### Current role indicator

| Option | Description | Selected |
|--------|-------------|----------|
| Add `current: boolean` field | Daniel explicitly checks a toggle in Sanity Studio for the active job. Clear intent, no ambiguity if he leaves endYear blank by accident. | ✓ |
| Derive from empty endYear | If `duration.endYear` is null/empty, treat the role as current. No new schema field, but relies on Daniel always leaving endYear blank for the current role — fragile. | |

**User's choice:** Add `current: boolean` field
**Notes:** Explicit boolean is more reliable than convention-based derivation.

### Location field

| Option | Description | Selected |
|--------|-------------|----------|
| Skip location | Not shown in timeline layout, keep schema clean. | ✓ |
| Add location anyway | Store in Sanity even if Phase 4 doesn't display it — useful for future phases or resume export. | |

**User's choice:** Skip location
**Notes:** The UI-SPEC mentions location in the field list but the rendered timeline layout does not display it anywhere.

---

## Education: array + fieldOfStudy

### fieldOfStudy field

| Option | Description | Selected |
|--------|-------------|----------|
| Add `fieldOfStudy: string` | Daniel fills in field of study per degree. UI-SPEC renders it "if present" — optional, graceful if empty. | ✓ |
| Skip for Phase 4 | Omit the detail line entirely. Simpler but less info on screen. | |

**User's choice:** Add `fieldOfStudy: string`
**Notes:** Optional field matches the UI-SPEC's "if present" rendering contract. Also agreed: education changes from single-item to array in GlobalContext (no explicit question needed — unambiguous fix).

---

## Hardcoded content timing

| Option | Description | Selected |
|--------|-------------|----------|
| Use UI-SPEC placeholders now, update later | Consistent with prior phases. Daniel updates real values during content population. | ✓ |
| Provide real values before execution | Daniel supplies actual skill ratings, community rows, and service descriptions before executor runs. | |

**User's choice:** Use UI-SPEC placeholders now, update later

---

## Claude's Discretion

- Whether to extract skill group constant data into a separate `lib/skills.ts` file or inline in `SkillsSection.tsx`.
- Exact Sanity `defineField` wording for `company` and `current` fields.

## Deferred Ideas

None — discussion stayed within phase scope.
