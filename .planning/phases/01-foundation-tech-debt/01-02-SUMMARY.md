---
phase: 01-foundation-tech-debt
plan: "02"
subsystem: design-tokens
tags: [css-variables, tailwind, dark-mode, design-tokens, theming]
dependency_graph:
  requires: []
  provides: [design-token-layer, css-variables, tailwind-dark-variant]
  affects: [all-future-component-plans]
tech_stack:
  added: []
  patterns: [data-theme-attribute-theming, css-custom-properties, tailwind-custom-variant]
key_files:
  created: []
  modified:
    - app/globals.css
    - tailwind.config.ts
decisions:
  - "D-01: CSS variables for all design tokens defined under [data-theme='dark'] and [data-theme='light'] attribute selectors"
  - "D-02/D-03: Tailwind dark: utilities now respond to [data-theme=dark] attribute via @custom-variant directive"
  - "D-08: fontFamily block added to tailwind.config.ts using var(--font-*) CSS variable references"
  - "border and input tokens use var() not hsl(var()) because they contain rgba() values"
metrics:
  duration: "~2 minutes"
  completed: "2026-05-09T18:00:03Z"
  tasks_completed: 2
  tasks_total: 2
  files_modified: 2
---

# Phase 01 Plan 02: Design Token Layer Summary

**One-liner:** Full Monkey Solutions design token system established with data-theme attribute theming, brand colors (ms-orange #ff6b1a), and Tailwind v4 @custom-variant dark override.

## What Was Built

Replaced the existing shadcn placeholder `:root` and `.dark` token blocks in `app/globals.css` with the complete Monkey Solutions design system, and updated `tailwind.config.ts` to align with the new token approach.

### globals.css

- **`@custom-variant dark`** directive added so Tailwind `dark:` utilities respond to `[data-theme=dark]` HTML attribute instead of `.dark` class
- **`[data-theme="dark"]`** block: shadcn-compatible HSL triplet tokens (background, foreground, card, popover, primary, secondary, muted, accent, destructive, ring, radius) plus extended `--ms-*` brand tokens (surfaces, borders, foreground shades, orange palette, accent2, shadow-sticker)
- **`[data-theme="light"]`** block: warm light theme counterpart with adjusted HSL values and light-optimized rgba borders
- **`:root` shared tokens**: typography scale (`--text-hero` through `--text-label`), spacing scale (`--space-1` through `--space-22`), layout constants (`--content-max`, `--page-px`, `--section-py`), border radii (`--radius-xs` through `--radius-pill`), animation durations (`--anim-*`), terminal traffic light colors, shared shadow
- **Keyframe animations**: `ms-pulse`, `ms-cursor`, `ms-fadein` + `prefers-reduced-motion` rule
- **Body rule**: uses `var(--font-sans)` instead of hardcoded Arial

### tailwind.config.ts

- Removed `darkMode: "class"` — `@custom-variant dark` in globals.css is now the source of truth
- Changed `border` and `input` color entries from `hsl(var(--border))` to `var(--border)` and `var(--input)` — these tokens now hold raw `rgba()` values, not HSL triplets
- Added `fontFamily` extension: `sans`, `mono`, `display` each mapped to CSS variable font stacks

## Commits

| Task | Description | Commit |
|------|-------------|--------|
| 1 | Replace globals.css with complete design token layer | d939ff1 |
| 2 | Update tailwind.config.ts — remove darkMode, add fontFamily, fix border/input | b37b31f |

## Verification Results

All 7 plan verification checks passed:

1. `[data-theme="dark"]` in globals.css: 1 (pass)
2. `@custom-variant dark` in globals.css: 1 (pass)
3. `.dark {` in globals.css: 0 (pass)
4. `darkMode` in tailwind.config.ts: 0 (pass)
5. `font-sans` in tailwind.config.ts: 1 (pass)
6. `var(--border)` in tailwind.config.ts: 1 (pass)
7. `npm run build` exits 0 (pass)

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None. This plan only establishes CSS token values; no UI rendering or data flow is involved.

## Threat Flags

None. All threats were pre-assessed as `accept` in the plan's threat model — CSS variables are fully public, config is static build-time, no server-side execution.

## Self-Check

- [x] `app/globals.css` exists and contains design tokens
- [x] `tailwind.config.ts` exists and contains fontFamily block
- [x] Commit d939ff1 exists (Task 1)
- [x] Commit b37b31f exists (Task 2)
- [x] Build passes
