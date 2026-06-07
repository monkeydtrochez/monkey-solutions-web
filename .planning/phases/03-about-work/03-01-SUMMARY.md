---
phase: 03-about-work
plan: "01"
subsystem: data-layer
tags: [sanity, groq, typescript, schema]
dependency_graph:
  requires: []
  provides:
    - sanity/schemaTypes/project.ts: "Project schema with overview, kind, metrics fields; body removed"
    - sanity/schemaTypes/profile.ts: "Profile schema with aboutBody field"
    - app/models/sanityTypes.ts: "ProjectMetric interface; Project and Profile types extended"
    - lib/api/sanityDataLoader.ts: "GROQ query includes overview, kind, metrics, aboutBody; body removed"
  affects:
    - app/context/GlobalContext.tsx: "projects and profile data will now carry new fields"
    - components/AboutSection.tsx: "can read profile.aboutBody via GlobalContext (Plan 02)"
    - components/WorkSection.tsx: "can read project.overview, kind, metrics via GlobalContext (Plan 03)"
tech_stack:
  added: []
  patterns:
    - "defineArrayMember with inline object type for metrics (avoids named schema type for 3-field structure)"
    - "GROQ sub-projection metrics[]{ label, value, suffix } forces ProjectMetric shape"
key_files:
  created: []
  modified:
    - sanity/schemaTypes/project.ts
    - sanity/schemaTypes/profile.ts
    - app/models/sanityTypes.ts
    - lib/api/sanityDataLoader.ts
decisions:
  - "Metrics uses inline defineArrayMember object rather than a named projectMetric schema type — simpler for a 3-field structure"
  - "aboutBody uses type: 'text' (multi-line) not type: 'string', enabling paragraph splits on \\n\\n in the component"
  - "Project.body removed from TypeScript type and GROQ query — no orphan references found in codebase"
  - "duration?: Duration added to Project interface to surface existing Sanity field in TypeScript"
metrics:
  duration: "~15 minutes"
  completed: "2026-05-10"
  tasks_completed: 3
  tasks_total: 3
  files_modified: 4
---

# Phase 3 Plan 01: Sanity Data Layer Extension Summary

**One-liner:** Extended Sanity schemas, TypeScript types, and GROQ query with project.overview/kind/metrics and profile.aboutBody fields; removed deprecated project.body.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Extend Sanity schemas (project + profile) | 01385c4 | sanity/schemaTypes/project.ts, sanity/schemaTypes/profile.ts |
| 2 | Extend TypeScript types (ProjectMetric, Project, Profile) | 3952ecb | app/models/sanityTypes.ts |
| 3 | Update GROQ query (project + profile projections) | f22cae9 | lib/api/sanityDataLoader.ts |

## What Was Done

### Task 1 — Sanity Schema Changes

**sanity/schemaTypes/project.ts:**
- Removed the `body` field (`type: 'blockContent'`) — replaced by plain text `overview`
- Added `overview` field (`type: 'text'`) — single summary paragraph for accordion expanded row
- Added `kind` field (`type: 'string'`) — display label e.g. "E-commerce · Headless"
- Added `metrics` field (`type: 'array'`, `validation: Rule.max(3)`) — each item is an inline object with `label`, `value`, `suffix` string fields

**sanity/schemaTypes/profile.ts:**
- Added `aboutBody` field (`type: 'text'`) — multi-paragraph About section body copy; separate paragraphs with blank line

### Task 2 — TypeScript Type Changes

**app/models/sanityTypes.ts:**
- Added `export interface ProjectMetric { label: string; value: string; suffix: string; }` before the Project interface
- Removed `body: WorkDescriptionBlock[]` from `Project` interface
- Added optional fields to `Project`: `overview?: string`, `kind?: string`, `metrics?: ProjectMetric[]`, `duration?: Duration`
- Added `aboutBody?: string` to `Profile` interface

### Task 3 — GROQ Query Changes

**lib/api/sanityDataLoader.ts:**
- Profile projection: added `aboutBody` after `heroBio`
- Project projection: removed `body`; added `overview`, `kind`, and `"metrics": metrics[]{ label, value, suffix }`

## Build + Lint Status

- `npm run build` — PASS (TypeScript compiles, no errors)
- `npm run lint` — 1 pre-existing error in `components/ui/ThemeToggle.tsx` (react-hooks/set-state-in-effect at line 16) — not introduced by this plan, not related to data layer changes

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — this plan is a pure data layer change. No UI rendering, no placeholder values.

## Threat Flags

None — all fields are user-facing public website copy by design. The `metrics` array `Rule.max(3)` validation was implemented as specified in the threat model (T-03-03 mitigation).

## Self-Check: PASSED

- sanity/schemaTypes/project.ts exists and contains `name: 'overview'` ✓
- sanity/schemaTypes/profile.ts exists and contains `name: 'aboutBody'` ✓
- app/models/sanityTypes.ts exists and exports `ProjectMetric` ✓
- lib/api/sanityDataLoader.ts exists and contains `aboutBody` and `overview` ✓
- Commits exist: 01385c4, 3952ecb, f22cae9 ✓
