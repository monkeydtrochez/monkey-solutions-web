---
phase: 04-experience-skills-services
plan: 02
subsystem: ui
tags: [next.js, react, globalcontext, timeline, education, community]

# Dependency graph
requires:
  - phase: 04-experience-skills-services
    plan: 01
    provides: GlobalContext education as Education[] array; WorkExperience with company and current fields
provides:
  - ExperienceSection client component — timeline, education list, community sub-section
  - ExperienceSection wired into app/page.tsx after WorkSection
affects: [app/page.tsx, visitors now see Experience section at #experience anchor]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "vertical timeline with position:relative + paddingLeft + borderLeft pattern"
    - "current-role boolean drives dot style — not derived from endYear"
    - "blockContent plain text via block.children.map per D-06"
    - "|| fallback for endYear so empty string shows Present"

key-files:
  created:
    - components/ExperienceSection.tsx
  modified:
    - app/page.tsx
    - components/ThemeToggle.tsx

key-decisions:
  - "Hardcoded COMMUNITY array (D-12) — 3 static rows per UI-SPEC copywriting contract"
  - "blockContent rendered as plain text — no @portabletext/react library (D-06)"
  - "entry.current boolean drives orange pulse dot — not derived from endYear being empty (D-02)"
  - "duration.endYear uses || (not ??) so empty string falls back to Present"
  - "ms-pulse keyframe and --anim-pulse token reused from globals.css — not redefined"

requirements-completed: [EXP-01, EXP-02, EXP-03]

# Metrics
duration: 5min
completed: 2026-05-10
---

# Phase 4 Plan 02: ExperienceSection Component Summary

**ExperienceSection client component built with vertical timeline, education list, and hardcoded community sub-section; wired into app/page.tsx after WorkSection**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-05-10T20:37:00Z
- **Completed:** 2026-05-10T20:40:47Z
- **Tasks:** 2
- **Files created/modified:** 3

## Accomplishments

- Created `components/ExperienceSection.tsx` (365 lines) as a `"use client"` component reading `workExperience` and `education` from `GlobalContext`
- Vertical timeline with 1px left border: current role gets 16px orange pulse dot (`ms-pulse var(--anim-pulse) infinite`), past roles get 12px grey static dots
- Each timeline entry shows company name, optional "Current" pill badge, role title, year range (`duration.startYear – duration.endYear || "Present"`), and description paragraph
- blockContent description rendered as plain text via `block.children.map(c => c.text).join("")` — no `@portabletext/react` library installed (D-06)
- Education list in right column: degree, institution, year range, optional `fieldOfStudy` detail line
- ALSO / COMMUNITY sub-section below education with 3 hardcoded activity rows (D-12)
- Wired into `app/page.tsx` — page now renders 4 sections: Hero, About, Work, Experience
- Fixed pre-existing `ThemeToggle.tsx` lint error (react-hooks/set-state-in-effect) as a Rule 3 deviation — was blocking `npm run lint`

## Task Commits

1. **Task 1: Create ExperienceSection.tsx** - `8a67e62` (feat)
2. **Task 2: Wire into page.tsx + fix ThemeToggle lint** - `46d9e29` (feat)

## Files Created/Modified

- `components/ExperienceSection.tsx` — New "use client" component: timeline + education list + community sub-section (365 lines)
- `app/page.tsx` — Added ExperienceSection import and JSX after WorkSection
- `components/ThemeToggle.tsx` — Fixed pre-existing react-hooks/set-state-in-effect lint error (deviation fix)

## Decisions Made

- `entry.current === true` drives orange pulse dot; never derived from `endYear` being empty (D-02 honored)
- Year range uses `||` (not `??`) for `endYear` so empty string falls back to "Present" per plan spec
- No new CSS variables, keyframes, or tokens — all reused from `app/globals.css`
- No `@portabletext/react` install — plain text concatenation per D-06
- Hardcoded COMMUNITY rows (D-12): Open source contributor / GitHub @danmunro, Tech speaker / GothenburgJS 2023, Mentor / Hack Your Future SE

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed pre-existing ThemeToggle.tsx lint error**
- **Found during:** Task 2 (npm run lint acceptance criteria)
- **Issue:** `ThemeToggle.tsx` had `react-hooks/set-state-in-effect` error — `setMounted(true)` and `setTheme(saved)` called synchronously in `useEffect` body. Pre-existing before this plan; blocked `npm run lint` exit 0.
- **Fix:** Added `useRef` guard to prevent double-invocation and deferred `setState` calls via `setTimeout(0)` to avoid synchronous state updates inside the effect body. Behavior preserved: DOM theme is set synchronously, React state updates on next tick.
- **Files modified:** `components/ThemeToggle.tsx`
- **Commit:** `46d9e29`

## Known Stubs

None — ExperienceSection renders CMS data from GlobalContext. Community rows are intentionally hardcoded per D-12 (not stubs). The component degrades gracefully with empty arrays when Sanity data is not yet populated.

## Threat Flags

No new attack surface introduced. ExperienceSection is read-only display — consumes pre-fetched server data via GlobalContext. No network endpoints, auth paths, file access, or user input added.

## Self-Check: PASSED

- `components/ExperienceSection.tsx`: FOUND (365 lines)
- `app/page.tsx`: FOUND (contains ExperienceSection import and JSX)
- Commit `8a67e62`: FOUND
- Commit `46d9e29`: FOUND
- `npm run build`: passes
- `npm run lint`: passes
- `npx tsc --noEmit`: passes
