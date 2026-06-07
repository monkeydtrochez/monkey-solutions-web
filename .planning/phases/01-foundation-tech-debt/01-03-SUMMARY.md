---
phase: 01-foundation-tech-debt
plan: 01-03
status: complete
completed: 2026-05-09
---

# Plan 01-03: Fonts, Layout, ThemeToggle — Summary

## Objective

Self-host Inter, JetBrains Mono, and Fraunces via `next/font/google`. Add the no-FOUC inline script to `app/layout.tsx`. Create the `ThemeToggle` component. Place temporarily in `app/page.tsx` for Phase 1 verification.

## Artifacts Created

| File | Description |
|------|-------------|
| `app/fonts.ts` | Three `next/font/google` declarations — Inter, JetBrains Mono, Fraunces — all variable fonts with CSS variable exports (`--font-sans`, `--font-mono`, `--font-display`) |
| `components/ThemeToggle.tsx` | Client component — no-state theme toggle via direct DOM manipulation; writes `data-theme` on `<html>` and persists to `localStorage` key `ms_theme` |

## Artifacts Modified

| File | Change |
|------|--------|
| `app/layout.tsx` | Replaced Geist `localFont` declarations with `next/font/google` imports from `./fonts`; added `data-theme="dark"`, `suppressHydrationWarning`, and font variable classNames to `<html>`; added no-FOUC inline script in `<head>`; updated `<body>` to `font-sans antialiased` |
| `app/page.tsx` | Added `ThemeToggle` import and `<ThemeToggle />` before `QueryClientWrapper` in a React Fragment — temporary Phase 1 placement |

## Decisions Implemented

- **D-06**: ThemeToggle uses direct DOM manipulation — no `useState`, no React context
- **D-07**: Inline FOUC script in `<head>` reads `ms_theme` from localStorage, falls back to `dark`
- **D-08**: Self-hosted fonts via `next/font/google` — no requests to `fonts.googleapis.com` at runtime; Geist fonts removed
- **D-02**: Toggling the theme button switches `[data-theme]` on `<html>` and persists to `localStorage` key `ms_theme`

## Phase Success Criteria Status

All 5 Phase 1 success criteria can now be verified manually:

1. **Fonts self-hosted** — Inter, JetBrains Mono, Fraunces via `next/font/google`; Geist removed
2. **No FOUC** — Inline script in `<head>` reads `ms_theme` before React hydrates
3. **Theme persists** — ThemeToggle writes to `localStorage`; script reads on next load
4. **Dark default** — `data-theme="dark"` on `<html>` with FOUC script fallback
5. **Design tokens active** — `font-sans` class on `<body>` consumes `--font-sans` from Wave 1

## Commits

- `95978cb` — feat(01-03): add self-hosted fonts — Inter, JetBrains Mono, Fraunces via next/font/google
- `11caed6` — feat(01-03): update layout.tsx — self-hosted fonts, no-FOUC script, suppressHydrationWarning
- `e8791e9` — feat(01-03): add ThemeToggle component and temp placement in page.tsx

## Self-Check: PASSED

- [x] `grep -c "suppressHydrationWarning" app/layout.tsx` → 1
- [x] `grep -c "ms_theme" app/layout.tsx` → 1
- [x] `grep -c "localFont" app/layout.tsx` → 0 (removed)
- [x] `grep -c "document.documentElement.dataset.theme" components/ThemeToggle.tsx` → 2
- [x] `grep -c "ThemeToggle" app/page.tsx` → 2
- [x] `npm run build` → 0 (exit 0)
- [x] `npm run lint` → 0 (exit 0, 0 warnings)
