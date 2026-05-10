---
phase: 04-experience-skills-services
plan: 01
subsystem: database
tags: [sanity, groq, typescript, globalcontext]

# Dependency graph
requires:
  - phase: 03-about-work
    provides: GlobalContext pattern with workExperience array; established "use client" component conventions
provides:
  - company and current fields on workExperience Sanity schema and TypeScript type
  - fieldOfStudy field on education Sanity schema and TypeScript type
  - GROQ projection updated to fetch company, current, fieldOfStudy
  - GlobalContext education fixed from singleton to Education[] array
affects: [ExperienceSection component (04-02 or later), any component consuming ctx?.education]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "isEducation type predicate with .filter() — mirrors isWorkExperience pattern for array filtering in GlobalContext"

key-files:
  created: []
  modified:
    - sanity/schemaTypes/workExperience.ts
    - sanity/schemaTypes/education.ts
    - app/models/sanityTypes.ts
    - lib/api/sanityDataLoader.ts
    - app/context/GlobalContext.tsx

key-decisions:
  - "education in GlobalContext must be Education[] | null (D-07) — .filter() not .find()"
  - "company and current on workExperience are optional (?) in TypeScript — Sanity fields may be unset on older documents"
  - "fieldOfStudy on Education is optional (?) — render only when present"
  - "D-03 honored: no location field added to workExperience"
  - "D-10 honored: start/end field names on Education preserved; Duration keeps startYear/endYear"

patterns-established:
  - "isX type predicate + .filter() for all array-typed GlobalContext state (see isWorkExperience pattern)"

requirements-completed: [EXP-01, EXP-02]

# Metrics
duration: 1min
completed: 2026-05-10
---

# Phase 4 Plan 01: Data Layer Extension Summary

**Extended workExperience and education Sanity schemas and TypeScript types with company, current, and fieldOfStudy fields; fixed GlobalContext education singleton bug to use Education[] array via filter()**

## Performance

- **Duration:** ~1 min
- **Started:** 2026-05-10T20:34:27Z
- **Completed:** 2026-05-10T20:35:45Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments

- Added `company` (string) and `current` (boolean, initialValue: false) fields to `workExperience` Sanity schema and TypeScript interface
- Added `fieldOfStudy` (string) field to `education` Sanity schema and TypeScript interface
- Updated GROQ projection in `sanityDataLoader.ts` to request all three new fields
- Fixed GlobalContext bug: `education` changed from `Education | null` (singleton via `.find()`) to `Education[] | null` (array via `.filter()`) — mirrors the existing `workExperience` pattern

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend Sanity schemas with company, current, and fieldOfStudy** - `5cf71fb` (feat)
2. **Task 2: Update TypeScript types and GROQ projection** - `98d70cb` (feat)
3. **Task 3: Fix GlobalContext education singleton — make it an array** - `f6a909c` (fix)

## Files Created/Modified

- `sanity/schemaTypes/workExperience.ts` - Added company (string) and current (boolean) fields; no location field (D-03)
- `sanity/schemaTypes/education.ts` - Added fieldOfStudy (string) field; start/end field names unchanged (D-10)
- `app/models/sanityTypes.ts` - Added company?: string, current?: boolean to WorkExperience; fieldOfStudy?: string to Education; Duration interface unchanged (startYear/endYear)
- `lib/api/sanityDataLoader.ts` - Added fieldOfStudy to education projection; added company and current to workExperience projection
- `app/context/GlobalContext.tsx` - Changed education from Education | null to Education[] | null; replaced .find() with isEducation type predicate + .filter()

## Decisions Made

- Kept all three new TypeScript fields optional (`?:`) so existing Sanity documents without these fields continue to work without type errors
- Used the same `isX` type predicate pattern for `isEducation` that already existed for `isWorkExperience` and `isProject` in GlobalContext
- No validation rules added to `company` or `fieldOfStudy` Sanity fields (free-text, editor discretion) — consistent with existing `title` and `school` field patterns

## Deviations from Plan

None - plan executed exactly as written.

## Locked Decisions Implemented

| Decision ID | Description | Status |
|-------------|-------------|--------|
| D-01 | `company: string` field added to workExperience schema | Done |
| D-02 | `current: boolean` field added to workExperience schema (initialValue: false) | Done |
| D-03 | `location` field NOT added to workExperience | Honored |
| D-04 | GROQ projection updated for workExperience (company, current) | Done |
| D-05 | TypeScript WorkExperience interface updated (company?, current?) | Done |
| D-07 | GlobalContext education fixed to Education[] | null with .filter() | Done |
| D-08 | `fieldOfStudy: string` field added to education schema | Done |
| D-09 | GROQ projection updated for education (fieldOfStudy) | Done |
| D-10 | TypeScript Education interface updated (fieldOfStudy?); start/end field names preserved | Done |

## Issues Encountered

None.

## User Setup Required

Sanity Studio redeploy needed to make the three new fields editable in hosted Studio:
```bash
cd sanity && npm run deploy
```
This is a manual step Daniel runs. It is NOT blocking for downstream component plans, which only depend on the TypeScript type changes (already applied).

## Next Phase Readiness

- All data layer prerequisites for ExperienceSection component are complete
- `ctx?.workExperience` provides company and current on each entry
- `ctx?.education` is now an array — ExperienceSection can render multiple education entries
- Sanity Studio currently shows old schema until `npm run deploy` is run; existing content unaffected (new fields are optional)

---
*Phase: 04-experience-skills-services*
*Completed: 2026-05-10*
