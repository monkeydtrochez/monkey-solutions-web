---
phase: "02-header-hero"
plan: "03"
subsystem: "hero"
tags:
  - react
  - css-tokens
  - animation
  - typography
dependency_graph:
  requires:
    - "02-01"  # DataHydrator, GlobalContext slim, stubs
    - "02-02"  # StatusDot component (parallel wave-2 plan)
  provides:
    - "HeroSection — full hero section rendering"
    - "TerminalCard — terminal status card with cursor animation"
  affects:
    - "app/page.tsx — HeroSection stub now renders full hero"
tech_stack:
  added: []
  patterns:
    - "Server component (TerminalCard) with className-based reduced-motion gate"
    - "Client component (HeroSection) reading GlobalContext for CMS-backed lede"
    - "CSS variable token consumption via inline style objects"
    - "Conditional render pattern: heroBio?.trim() && <p>"
key_files:
  created: []
  modified:
    - "components/TerminalCard.tsx"
    - "components/HeroSection.tsx"
decisions:
  - "Used literal pixel values (32, 64, 16, 24, 8) for all spacing to avoid --space-N token name mismatch documented in research — spacing token names in globals.css differ from UI-SPEC table"
  - "StatusDot renders as null until plan 02-02 merges; HeroSection still passes build and lint because StatusDot is a valid (stub) default export"
  - "heroBio?.trim() guards against whitespace-only Sanity values per D-02 and Pitfall 5"
metrics:
  duration: "2 minutes"
  completed: "2026-05-09T20:54:30Z"
  tasks_completed: 2
  tasks_total: 2
  files_modified: 2
---

# Phase 2 Plan 3: Hero Section Summary

Full hero section (HeroSection) and terminal status card (TerminalCard) implemented — replaces plan 01 stubs with complete UI-SPEC §Hero layout including mixed-weight H1 with Fraunces italic "&" accent, CMS-backed lede, dual CTAs, terminal card with blinking cursor, and 4-stat trust strip.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Build TerminalCard (HERO-02) | 8e64abe | components/TerminalCard.tsx |
| 2 | Build HeroSection (HERO-01, HERO-02, HERO-03, HERO-04, D-02, D-03) | 693d637 | components/HeroSection.tsx |

## What Was Built

### TerminalCard (Task 1)

Server component (no `"use client"`) rendering a terminal-styled card:

- Title bar with three traffic-light dots (`hsl(var(--color-tl-red/yellow/green))`) and "~ / status.sh" label
- Four labeled terminal lines: `whoami` → daniel.trochez, `cat role` → software_developer, `./availability` → open · 2-3 slots left, `stack --short` → 6 chips
- Stack chips: TS, C#, Swift, React, .NET, Node — rendered with border tokens
- Blinking cursor: `className="ms-cursor"` triggers the existing `[class*="ms-cursor"]` reduced-motion rule in globals.css; animation is `ms-cursor var(--anim-cursor) step-end infinite`

### HeroSection (Task 2)

Client component (`"use client"`) using `useContext(GlobalContext)`:

- Status row: StatusDot (pulsing when plan 02-02 merges) + orange "AVAILABLE" + remaining copy
- H1: "Software that ships & lasts." — "ships" and "lasts." at weight 700, base at 400, "&" as Fraunces italic in `--ms-orange-text`
- Lede paragraph: conditionally rendered only when `profile?.heroBio?.trim()` is truthy (D-02); no fallback text (D-03)
- CTAs: primary `<a href="#contact">` orange button "Start a project →"; secondary `<a href="#work">` outlined "View work ↓" with orange arrow
- Right column: `<TerminalCard />` rendered directly
- Trust strip: 4-stat grid — "08+", "40+", "07", "100%" with orange accent characters
- Decorative layers: grid (repeating-linear-gradient, masked ellipse) and orange glow blob — both `aria-hidden="true"`

## Deviations from Plan

None — plan executed exactly as written. The plan provided exact code for both components, which was copied faithfully with all specified tokens, copy, and aria attributes.

## Known Stubs

**StatusDot is a stub** (`components/ui/StatusDot.tsx` returns null). This is expected — plan 02-02 fills it in and runs in parallel wave 2. HeroSection renders `<StatusDot />` correctly; the status dot will appear once the 02-02 worktree is merged. The plan explicitly documents this as acceptable: "stub remains usable if plan 02 hasn't merged yet."

## Threat Surface Scan

No new threat surface beyond the plan's threat model:
- `profile?.heroBio` rendered as `{heroBio}` JSX text — React auto-escapes (T-02-08 mitigated)
- No `dangerouslySetInnerHTML` used anywhere
- No new network endpoints or auth paths introduced

## Self-Check

Files exist:
- components/TerminalCard.tsx: FOUND
- components/HeroSection.tsx: FOUND

Commits exist:
- 8e64abe: FOUND
- 693d637: FOUND

Build: PASSED (`npm run build` exits 0)
Lint: PASSED (`npm run lint` exits 0, zero warnings)

## Self-Check: PASSED
