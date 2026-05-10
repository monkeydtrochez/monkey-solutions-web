---
phase: 04-experience-skills-services
plan: 03
subsystem: ui
tags: [next.js, react, server-component, skills, services, css-hover, accessibility]

# Dependency graph
requires:
  - phase: 04-experience-skills-services
    plan: 02
    provides: ExperienceSection wired into app/page.tsx after WorkSection
provides:
  - SkillsSection server component — 4-group 10-segment proficiency bar layout (SKILLS-01)
  - ServicesSection server component — 2x2 card grid with hover border via CSS class (SVC-01, SVC-02)
  - .service-card CSS hover rule in globals.css
  - app/page.tsx now renders 6 sections (Hero, About, Work, Experience, Skills, Services)
affects: [app/page.tsx, app/globals.css, visitors now see Skills at #skills and Services at #services]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "10-segment proficiency bar via Array.from({ length: 10 }) with filled/empty segment logic"
    - "role='img' + aria-label='Name: N out of 10' accessible wrapper for visual bars"
    - "CSS class .service-card owns border + transition; inline styles on card do not override"
    - "Server component pattern for purely static data — no 'use client', no hooks, no GlobalContext"
    - "Fraunces italic giant number (aria-hidden) as decorative overlay via position:absolute"

key-files:
  created:
    - components/SkillsSection.tsx
    - components/ServicesSection.tsx
  modified:
    - app/globals.css
    - app/page.tsx

key-decisions:
  - "D-11 honored: SKILL_GROUPS hardcoded as static const in SkillsSection.tsx — no Sanity extension for skills in Phase 4"
  - "D-13 honored: SERVICES hardcoded as static const in ServicesSection.tsx — 4 service definitions per UI-SPEC copywriting contract"
  - "Hover border on service cards driven by .service-card CSS class only — no inline border or transition on card divs"
  - "Both SkillsSection and ServicesSection are server components — static data, no hooks needed"
  - "Stack chips use existing Badge variant='outline' component — no custom span or new component"

requirements-completed: [SKILLS-01, SVC-01, SVC-02]

# Metrics
duration: 7min
completed: 2026-05-10
---

# Phase 4 Plan 03: SkillsSection + ServicesSection Summary

**SkillsSection and ServicesSection server components built with hardcoded static data; .service-card hover CSS added to globals.css; both wired into app/page.tsx after ExperienceSection**

## Performance

- **Duration:** ~7 min
- **Started:** 2026-05-10T20:37:00Z
- **Completed:** 2026-05-10T20:44:18Z
- **Tasks:** 3
- **Files created/modified:** 4

## Accomplishments

- Created `components/SkillsSection.tsx` (199 lines) as a pure server component with hardcoded `SKILL_GROUPS` const (D-11): 4 groups (Languages, Frontend, Backend & Infra, Craft), 18 skills total
- Each skill row wrapped in `role="img"` + `aria-label="${skill.name}: ${skill.proficiency} out of 10"` for screen reader accessibility
- 10-segment bar rendered via `Array.from({ length: 10 }).map(...)` — filled segments use `var(--ms-orange)`, empty use `var(--ms-border-strong)`, rounded corners via `var(--radius-xs)`
- 4-column CSS grid layout for skill groups, kicker row "04 ─ SKILLS", H2 "What I work with"
- Created `components/ServicesSection.tsx` (185 lines) as a pure server component with hardcoded `SERVICES` const (D-13): 4 service cards in 2×2 grid
- Each card uses `className="service-card"` — the `.service-card` CSS class owns the `border` and `transition: border-color var(--anim-hover)` rule; no inline border on card divs
- Decorative Fraunces italic number (01.–04.) per card: `position:absolute`, `aria-hidden="true"`, `clamp(80px, 10vw, 140px)` font size, `var(--font-display)` italic
- Stack chips via existing `<Badge variant="outline">` component — no new component installed
- Added `.service-card` and `.service-card:hover` rules to `app/globals.css` after existing class-based rules (`.logo-m-text`)
- Wired both into `app/page.tsx` — page now renders 6 sections in order: Hero, About, Work, Experience, Skills, Services
- `npm run build` and `npm run lint` pass clean

## Task Commits

1. **Task 1: Create SkillsSection.tsx** — `0defebf` (feat)
2. **Task 2: Add .service-card CSS + create ServicesSection.tsx** — `e010776` (feat)
3. **Task 3: Wire into app/page.tsx** — `bfa1f95` (feat)

## Files Created/Modified

- `components/SkillsSection.tsx` — New server component: 4-group 10-segment proficiency bar layout (199 lines)
- `components/ServicesSection.tsx` — New server component: 2x2 service card grid with Fraunces decorative numbers and Badge stack chips (185 lines)
- `app/globals.css` — Added `.service-card` and `.service-card:hover` rules after `.logo-m-text` class
- `app/page.tsx` — Added SkillsSection and ServicesSection imports and JSX after ExperienceSection

## Decisions Made

- Both components are server components — static hardcoded data requires no `"use client"`, no `useContext`, no hooks
- `.service-card` CSS class is single source of truth for border and hover transition — no inline border on the card div, which would override the `:hover` rule
- `Array.from({ length: 10 })` is the idiomatic, spec-required pattern for the 10-segment bar (avoids creating a utility array constant)
- No new CSS variables, keyframes, or tokens introduced — all from pre-established `app/globals.css` root tokens

## Phase 4 Completion

Phase 4 (experience-skills-services) is now fully delivered across three plans:

| Plan | Delivered | Requirements |
|------|-----------|--------------|
| 04-01 | Schema extensions (WorkExperience + Education), GlobalContext fix, GROQ updates | — |
| 04-02 | ExperienceSection component (timeline + education + community) | EXP-01, EXP-02, EXP-03 |
| 04-03 | SkillsSection + ServicesSection components | SKILLS-01, SVC-01, SVC-02 |

All 6 Phase 4 requirements (EXP-01, EXP-02, EXP-03, SKILLS-01, SVC-01, SVC-02) delivered.

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — all content is intentionally hardcoded per D-11 and D-13. Placeholder proficiency values and service descriptions are authored by Daniel during content population. These are not stubs blocking the plan's goal; they are the intended static copy for Phase 4.

## Threat Flags

No new attack surface introduced. Both sections are static read-only display components. No auth, no session, no input processing, no network endpoints, no user input added. Consistent with threat model T-04-07, T-04-08, T-04-09 all accepted.

## Self-Check: PASSED

- `components/SkillsSection.tsx`: FOUND (199 lines)
- `components/ServicesSection.tsx`: FOUND (185 lines)
- `app/globals.css`: contains `.service-card` and `.service-card:hover`
- `app/page.tsx`: contains SkillsSection and ServicesSection imports and JSX
- Commit `0defebf`: FOUND
- Commit `e010776`: FOUND
- Commit `bfa1f95`: FOUND
- `npm run build`: passes
- `npm run lint`: passes
- `npx tsc --noEmit`: passes
