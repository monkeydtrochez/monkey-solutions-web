---
phase: 02-header-hero
plan: "01"
subsystem: data-layer
tags:
  - sanity
  - groq
  - react-context
  - nextjs
  - data-layer
  - cleanup

dependency_graph:
  requires:
    - "01-foundation-tech-debt (CSS variables, font setup, ThemeToggle)"
  provides:
    - "heroBio field in Sanity schema, GROQ, and TypeScript types"
    - "DataHydrator component for GlobalContext hydration"
    - "Slim GlobalContext with 5 fields only"
    - "New page.tsx shell: QueryClientWrapper > DataHydrator + SiteHeader + main > HeroSection"
    - "Stub components: SiteHeader, HeroSection, TerminalCard, StatusDot"
  affects:
    - "02-02 (fills SiteHeader, StatusDot stubs)"
    - "02-03 (fills HeroSection, TerminalCard stubs)"

tech_stack:
  added: []
  patterns:
    - "DataHydrator as side-effect-only client component for context hydration"
    - "Null-returning stubs enable parallel plan execution without page.tsx conflicts"

key_files:
  created:
    - components/wrappers/DataHydrator.tsx
    - components/SiteHeader.tsx
    - components/HeroSection.tsx
    - components/TerminalCard.tsx
    - components/ui/StatusDot.tsx
  modified:
    - sanity/schemaTypes/profile.ts
    - app/models/sanityTypes.ts
    - lib/api/sanityDataLoader.ts
    - app/context/GlobalContext.tsx
    - app/page.tsx
  deleted:
    - components/BusinessCard.tsx
    - components/CV.tsx
    - components/Profile.tsx
    - components/ProfileIntro.tsx
    - components/ProjectDetails.tsx
    - components/Projects.tsx
    - components/Skills.tsx
    - components/WorkExperience.tsx
    - components/WorkExperienceItem.tsx
    - components/Education.tsx
    - components/wrappers/SiteWrapper.tsx
    - components/ui/SocialMediaButtons.tsx

decisions:
  - "DataHydrator pattern (not SiteWrapper) chosen for GlobalContext hydration — side-effect-only client component with useEffect"
  - "Stubs return null to enable plans 02-02 and 02-03 to run in parallel without page.tsx write conflict"
  - "TerminalCard and StatusDot created as server components (no use client) as specified"

metrics:
  duration: "3 minutes"
  completed: "2026-05-09T20:48:17Z"
  tasks_completed: 4
  tasks_total: 4
  files_created: 5
  files_modified: 5
  files_deleted: 12
---

# Phase 2 Plan 01: Data Layer and Clean-Slate Page Shell Summary

**One-liner:** Sanity heroBio field added end-to-end (schema → GROQ → TypeScript → context), GlobalContext slimmed from 10 to 5 fields, legacy SPA components deleted, and new page.tsx shell with null-returning stubs established for parallel execution of plans 02-02 and 02-03.

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Extend Sanity schema, types, GROQ with heroBio | bed7671 | sanity/schemaTypes/profile.ts, app/models/sanityTypes.ts, lib/api/sanityDataLoader.ts |
| 2 | Create DataHydrator and stub UI components | 07544a1 | components/wrappers/DataHydrator.tsx, components/SiteHeader.tsx, components/HeroSection.tsx, components/TerminalCard.tsx, components/ui/StatusDot.tsx |
| 3 | Slim GlobalContext | ed4fae8 | app/context/GlobalContext.tsx |
| 4 | Rewrite app/page.tsx and delete legacy components | 5e88b62 | app/page.tsx, 12 deleted files |

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

These stubs are intentional scaffolding — to be filled by downstream plans:

| Component | File | Reason |
|-----------|------|--------|
| SiteHeader | components/SiteHeader.tsx | Filled by plan 02-02 |
| StatusDot | components/ui/StatusDot.tsx | Filled by plan 02-02 |
| HeroSection | components/HeroSection.tsx | Filled by plan 02-03 |
| TerminalCard | components/TerminalCard.tsx | Filled by plan 02-03 |

These stubs are intentional plan scaffolding per the plan objective. They return null and render nothing — the page is intentionally blank pending plans 02-02 and 02-03. This is not a correctness failure; it is the design.

## Threat Flags

No new security surface introduced. All changes are internal refactoring of the data layer and component structure. No new network endpoints, auth paths, or external data sources added.

## Self-Check: PASSED

### Files created:
- components/wrappers/DataHydrator.tsx: FOUND
- components/SiteHeader.tsx: FOUND
- components/HeroSection.tsx: FOUND
- components/TerminalCard.tsx: FOUND
- components/ui/StatusDot.tsx: FOUND

### Commits verified:
- bed7671: FOUND (Task 1 — heroBio schema/types/GROQ)
- 07544a1: FOUND (Task 2 — DataHydrator + stubs)
- ed4fae8: FOUND (Task 3 — slim GlobalContext)
- 5e88b62: FOUND (Task 4 — page.tsx rewrite + legacy deletions)

### Build: PASSED (npm run build exits 0)
### Lint: PASSED (npm run lint exits 0, zero warnings)
