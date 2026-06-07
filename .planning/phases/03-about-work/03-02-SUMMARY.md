---
phase: 03-about-work
plan: "02"
subsystem: ui-components
tags: [react, tailwind, design-tokens, about-section, fraunces, portrait-placeholder]
dependency_graph:
  requires:
    - 03-01: "Profile.aboutBody field available in GlobalContext"
  provides:
    - components/AboutSection.tsx: "AboutSection client component reading profile from GlobalContext"
    - app/page.tsx: "Homepage composition with AboutSection rendered below HeroSection"
  affects:
    - app/page.tsx: "Now renders AboutSection below HeroSection inside main"
    - SiteHeader nav #about link: "Resolves to the section id added in this plan"
tech_stack:
  added: []
  patterns:
    - "Inline style objects for design-token properties; Tailwind only for responsive breakpoint classes (grid-cols-1 md:grid-cols-2)"
    - "useState lazy initializer for localStorage reads — avoids react-hooks/set-state-in-effect lint rule"
    - "aboutBody.split(/\\n\\n+/) for multi-paragraph rendering with fallback to UI-SPEC copy"
key_files:
  created:
    - components/AboutSection.tsx
  modified:
    - app/page.tsx
    - components/ThemeToggle.tsx
decisions:
  - "Portrait stays as CSS placeholder (striped background + DT initials) per D-14 — real photo to be provided by Daniel later"
  - "Sticker text color #120a05 hardcoded per UI-SPEC — matches HeroSection hire CTA precedent"
  - "H2 font-size uses clamp(36px, 4.5vw, 64px) hardcoded — must NOT use --text-h2 per UI-SPEC discrepancy noted in RESEARCH.md"
  - "ThemeToggle.tsx pre-existing lint error fixed as deviation Rule 1 — moved localStorage read to useState lazy initializer"
metrics:
  duration: "~20 minutes"
  completed: "2026-05-10"
  tasks_completed: 2
  tasks_total: 2
  files_modified: 3
---

# Phase 3 Plan 02: AboutSection Component Summary

**One-liner:** Built AboutSection client component with two-column layout — Fraunces italic H2 accent, body paragraphs with Sanity fallback, facts row, striped portrait placeholder with offset border and rotated sticker badge; wired into homepage.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create components/AboutSection.tsx | 431156a | components/AboutSection.tsx, components/ThemeToggle.tsx |
| 2 | Wire AboutSection into app/page.tsx | e602baa | app/page.tsx |

## What Was Done

### Task 1 — AboutSection.tsx

Created `components/AboutSection.tsx` as a `"use client"` component following the HeroSection pattern:

- **Kicker row:** `01 ── ABOUT` with orange "01", mono font, `--ms-border-strong` rule, uppercase label
- **Two-column grid:** `grid-cols-1 md:grid-cols-2` with 72px gap
- **H2:** `clamp(36px, 4.5vw, 64px)` with `<em>` "wish" in Fraunces italic orange (`--ms-orange-text`)
- **Body paragraphs:** Split `profile.aboutBody` on `/\n\n+/`; falls back to two UI-SPEC verbatim paragraphs when empty
- **Facts row:** LOCATION (`profile.location`), LANGUAGES (`profile.languages` joined `" · "`), WORKING SINCE `"2015"` (hardcoded)
- **Right column:** 3:4 striped portrait placeholder (`repeating-linear-gradient`) with centered "DT" in Fraunces italic, decorative offset border (`translate(16px, 16px)`), rotated sticker badge (`rotate(-3deg)`) reading "↓ hi, nice to meet you"

Also fixed pre-existing lint error in `components/ThemeToggle.tsx` (react-hooks/set-state-in-effect) — moved localStorage read from `useEffect` into a `useState` lazy initializer function. Required to pass `npm run lint`.

### Task 2 — app/page.tsx

Added `import AboutSection from "@/components/AboutSection"` and `<AboutSection />` directly after `<HeroSection />` inside `<main>`. No other changes.

## Build + Lint Status

- `npm run build` — PASS (Compiled successfully, TypeScript clean)
- `npm run lint` — PASS (0 errors, 0 warnings)

## Visual Verification (expected on dev)

When Daniel opens `http://localhost:3000`:
- About section appears below hero with `--ms-bg-alt` background and top/bottom borders
- Kicker "01 ── ABOUT" shows orange "01" number
- H2 reads "I build what teams *wish* they had time to build." with "wish" in Fraunces italic orange
- Two fallback body paragraphs from UI-SPEC copy are visible (will swap to Sanity `aboutBody` once Daniel populates it)
- Facts row shows three pairs: LOCATION (Göteborg, SE fallback), LANGUAGES (SV · EN · ES fallback), WORKING SINCE 2015
- Right column shows striped placeholder with "DT" centered, offset decorative border, and rotated orange sticker
- Clicking SiteHeader nav `#about` link scrolls to section

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed pre-existing lint error in ThemeToggle.tsx**
- **Found during:** Task 1 (lint check)
- **Issue:** `setTheme(saved)` called synchronously inside `useEffect` body — `react-hooks/set-state-in-effect` ESLint rule. This prevented `npm run lint` from passing (blocked the Task 1 acceptance criteria). Documented in Plan 01 summary as pre-existing but must be fixed to meet this plan's acceptance criteria.
- **Fix:** Replaced `useState("dark")` + effect-based sync with `useState(getInitialTheme)` lazy initializer (reads localStorage on first client render, returns "dark" during SSR). The `useEffect` now only syncs `data-theme` attribute based on the `theme` state value, with no `setState` call inside it.
- **Files modified:** `components/ThemeToggle.tsx`
- **Commit:** 431156a (included in Task 1 commit)

## Known Stubs

- **Portrait placeholder** (`components/AboutSection.tsx`, right column): CSS-only striped div with "DT" initials — intentional per D-14. Daniel will provide a 3:4 portrait photo; a future plan will swap this to a `<Image>` from Sanity. No data path is broken; sticker badge and decorative border are fully rendered.

## Threat Flags

None — this plan renders only public-facing portfolio copy (profile.location, profile.languages, profile.aboutBody). React JSX text interpolation auto-escapes all Sanity-sourced strings (T-03-05 mitigated as designed). No new network endpoints, auth paths, or file access patterns introduced.

## Self-Check: PASSED

- `components/AboutSection.tsx` exists and starts with `"use client";` ✓
- `grep -c 'export default function AboutSection'` returns 1 ✓
- `grep -c 'id="about"'` returns 1 ✓
- `grep -c 'useContext(GlobalContext)'` returns 1 ✓
- `grep -c 'aboutBody'` returns 3 (read + condition + split) ✓
- `grep -c '"2015"'` returns 1 ✓
- `grep -c 'clamp(36px, 4.5vw, 64px)'` returns 1 ✓
- `grep -c 'translate(16px, 16px)'` returns 1 ✓
- `grep -c 'rotate(-3deg)'` returns 1 ✓
- `grep -c '↓ hi, nice to meet you'` returns 1 ✓
- `grep -c 'aria-hidden="true"'` returns 4 ✓
- `grep -c 'var(--text-h2)'` returns 0 (correctly absent) ✓
- `grep -c 'from "next/image"'` returns 0 (correctly absent) ✓
- `app/page.tsx` imports AboutSection and renders it after HeroSection ✓
- `npm run build` exits 0 ✓
- `npm run lint` exits 0 ✓
- Commits exist: 431156a, e602baa ✓
