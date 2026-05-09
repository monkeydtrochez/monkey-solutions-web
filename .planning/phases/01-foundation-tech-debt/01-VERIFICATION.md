---
phase: 01-foundation-tech-debt
verified: 2026-05-09T18:17:30Z
status: complete
score: 10/10 must-haves verified (automated); 3/3 behavioral items confirmed by human browser testing (2026-05-09)
overrides_applied: 0
human_verification:
  - test: "Open site in browser with ms_theme=light set in localStorage, hard-refresh — verify light theme paints immediately with no dark flash"
    expected: "Light background visible on first paint; no dark-then-light flicker"
    why_human: "FOUC prevention is visual paint-order behavior; cannot be verified by grep or build — requires DevTools Network + rendering timeline or manual observation"
  - test: "Click 'Toggle theme' button, then reload the page"
    expected: "The reloaded page shows the theme that was chosen before reload (dark or light); data-theme on <html> matches localStorage ms_theme value"
    why_human: "Theme persistence is a runtime localStorage read/write cycle; cannot be exercised without a running browser"
  - test: "Open DevTools Network tab, filter by 'fonts.googleapis.com' — load the page"
    expected: "Zero requests to fonts.googleapis.com; font files load from /_next/static/media/"
    why_human: "Self-hosted font verification requires a live browser network tab; next/font/google self-hosts at build time but only the browser confirms no external font CDN requests at runtime"
---

# Phase 1: Foundation + Tech Debt Verification Report

**Phase Goal:** Establish clean architectural foundation — fix all tech debt, install design token system, wire up fonts and theme toggle
**Verified:** 2026-05-09T18:17:30Z
**Status:** complete
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | D-12: Sanity data loads via direct Sanity client — no HTTP call to /api/sanity-data occurs | VERIFIED | `lib/api/sanityDataLoader.ts` L1 imports `createClientFromParam`; L53-55 calls `sanityClient.fetch(query)` directly; no `axios` import; `/api/sanity-data/route.ts` deleted (ls confirms "No such file") |
| 2 | The app builds successfully with no TypeScript errors | VERIFIED | `npm run build` exits 0; TypeScript check completes cleanly; no error lines in build output |
| 3 | TD-01 (Redis) confirmed resolved | VERIFIED | `lib/redis.ts` does not exist (ls exits 1) |
| 4 | TD-03 (revalidate auth) confirmed resolved | VERIFIED | `app/api/revalidate/route.ts` L6: `authHeader !== \`Bearer ${process.env.CRON_SECRET}\`` — checks full Bearer header, not raw secret |
| 5 | TD-04 (stale-data guards) confirmed resolved | VERIFIED | `app/context/GlobalContext.tsx` uses `if (workExperienceArray != null)` and `if (projectsData != null)` — these are incoming-data null-guards on fresh data, not stale-data skip guards that block updates when context is already populated |
| 6 | TD-05 (QueryClient stable) confirmed resolved | VERIFIED | `components/wrappers/QueryClientWrapper.tsx` L10: `const [queryClient] = useState(() => new QueryClient())` — factory form prevents re-instantiation on re-render |
| 7 | CSS variables for all design tokens defined under [data-theme="dark"] and [data-theme="light"] with complete brand token set | VERIFIED | `app/globals.css` L10: `[data-theme="dark"]` block; L53: `[data-theme="light"]` block; `--ms-orange`, `--space-1`–`--space-22`, `--radius-pill`, `--anim-pulse`, `@keyframes ms-pulse`, `@custom-variant dark` all confirmed present; `.dark {` count = 0 |
| 8 | Tailwind dark: utilities respond to [data-theme=dark] attribute; darkMode key removed; border/input use var() not hsl(var()); fontFamily block present | VERIFIED | `tailwind.config.ts`: `darkMode` count = 0; `border: "var(--border)"`; `input: "var(--input)"`; `hsl(var(--border))` count = 0; `sans`, `mono`, `display` fontFamily entries confirmed; background still uses `hsl(var(--background))` |
| 9 | Inter, JetBrains Mono, and Fraunces declared as self-hosted fonts via next/font/google with correct CSS variable names | VERIFIED | `app/fonts.ts`: imports from `next/font/google`; `inter` with `variable: '--font-sans'`; `jetbrainsMono` with `variable: '--font-mono'`; `fraunces` with `variable: '--font-display'` and `style: ['italic']`; no `localFont` import |
| 10 | layout.tsx has no-FOUC inline script, font variables on html, suppressHydrationWarning, Geist removed; ThemeToggle uses direct DOM manipulation and persists to ms_theme; build and lint pass | VERIFIED | `app/layout.tsx`: `suppressHydrationWarning` on `<html>`; `data-theme="dark"` on `<html>`; `ms_theme` in inline IIFE script; `inter.variable jetbrainsMono.variable fraunces.variable` on `<html>`; no `localFont`/`geistSans`; `components/ThemeToggle.tsx`: `document.documentElement.dataset.theme` (read + write); `localStorage.setItem('ms_theme', next)`; `aria-label="Toggle theme"`; no `useState`; lint exits 0 |

**Score:** 10/10 truths verified (automated)

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `lib/api/sanityDataLoader.ts` | Direct Sanity client fetch replacing self-referential HTTP | VERIFIED | L1: `createClientFromParam` import; L55: `sanityClient.fetch(query)`; no axios |
| `app/api/revalidate/route.ts` | Webhook auth handler with dead revalidatePath removed | VERIFIED | Only `revalidatePath("/")` remains; `sanity-data` string absent |
| `app/api/sanity-data/route.ts` | DELETED | VERIFIED | ls confirms file does not exist |
| `app/globals.css` | Complete design token layer under [data-theme] selectors | VERIFIED | Dark + light blocks present; shared :root tokens present; @custom-variant dark present; no .dark class |
| `tailwind.config.ts` | darkMode removed; border/input use var(); fontFamily block added | VERIFIED | All three changes confirmed by grep |
| `app/fonts.ts` | Three next/font/google declarations with CSS variable exports | VERIFIED | Inter, JetBrains_Mono, Fraunces all present with correct variable names and Fraunces italic style |
| `app/layout.tsx` | No-FOUC inline script; font variables on html; suppressHydrationWarning; Geist removed | VERIFIED | All 10 acceptance criteria from plan confirmed |
| `components/ThemeToggle.tsx` | Client component — direct DOM manipulation; no useState | VERIFIED | "use client" L1; dataset.theme read+write; localStorage.setItem; aria-label; no useState |
| `app/page.tsx` | ThemeToggle imported and rendered; existing components preserved | VERIFIED | ThemeToggle import + usage; QueryClientWrapper, BusinessCard, CV, Projects all preserved |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `lib/api/sanityDataLoader.ts` | `app/sanityClient.ts` | `createClientFromParam` import | WIRED | L1 import confirmed; L53 usage confirmed |
| `app/page.tsx` | `lib/api/sanityDataLoader.ts` | `loadSanityData()` call | WIRED | L1 import; L13 call in `getSanityData()` |
| `app/globals.css` | `tailwind.config.ts` | `@custom-variant dark` directive | WIRED | L6 in globals.css; `@config "../tailwind.config.ts"` at top of globals.css links the two files |
| `tailwind.config.ts` | `app/globals.css` | `border: "var(--border)"` and `input: "var(--input)"` | WIRED | Both entries use `var()` matching the `rgba()` token values in globals.css |
| `app/layout.tsx` | `app/fonts.ts` | `import { inter, jetbrainsMono, fraunces }` | WIRED | L4 import; L21 usage on `<html>` className |
| `app/layout.tsx` | inline script | `ms_theme` localStorage key | WIRED | L26 IIFE reads `localStorage.getItem("ms_theme")` and writes `data-theme` attribute |
| `components/ThemeToggle.tsx` | `document.documentElement.dataset.theme` | direct DOM write | WIRED | L7 write confirmed; L5 read confirmed |

### Data-Flow Trace (Level 4)

Not applicable for this phase. Phase 1 delivers infrastructure and CSS token layers — no dynamic data rendering artifacts were added. The data flow from Sanity through `loadSanityData` to `GlobalContext` pre-existed and passes through the rewired `sanityDataLoader.ts`.

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Build succeeds with zero TypeScript errors | `npm run build` | Exit 0; TypeScript finished; 5/5 pages generated | PASS |
| Lint passes with zero warnings | `npm run lint --max-warnings 0` | Exit 0 | PASS |
| sanityDataLoader calls fetch not HTTP | `grep -c "axios" lib/api/sanityDataLoader.ts` | 0 | PASS |
| Dead route removed | `ls app/api/sanity-data/route.ts` | No such file | PASS |
| ThemeToggle has no useState | `grep -c "useState" components/ThemeToggle.tsx` | 0 | PASS |
| FOUC prevention / font self-hosting / theme persistence | Browser-required | N/A | SKIP — routed to human verification |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|---------|
| TD-01 | 01-01 | Delete lib/redis.ts and Redis branches | SATISFIED | `lib/redis.ts` does not exist |
| TD-02 | 01-01 | Replace self-referential axios HTTP call | SATISFIED | `sanityDataLoader.ts` uses `sanityClient.fetch()` directly |
| TD-03 | 01-01 | Fix /api/revalidate auth header check | SATISFIED | `authHeader !== \`Bearer ${process.env.CRON_SECRET}\`` confirmed |
| TD-04 | 01-01 | Remove stale-data guards in GlobalContext.tsx | SATISFIED | No stale-data skip guards found; remaining null-checks are on incoming data |
| TD-05 | 01-01 | Stabilize QueryClient with useState factory | SATISFIED | `useState(() => new QueryClient())` confirmed |
| FOUND-01 | 01-02, 01-03 | Design tokens as CSS variables under [data-theme] selectors | SATISFIED | Full dark + light + shared token blocks in globals.css |
| FOUND-02 | 01-03 | Dark theme applied before hydration (no FOUC) | SATISFIED (automated) / NEEDS HUMAN | Code structure correct: synchronous IIFE in `<head>` reads ms_theme before React hydrates; actual paint order requires browser verification |
| FOUND-03 | 01-03 | Theme preference persists to localStorage ms_theme | SATISFIED (automated) / NEEDS HUMAN | `localStorage.setItem('ms_theme', next)` in ThemeToggle confirmed; runtime cycle requires browser verification |
| FOUND-04 | 01-03 | Self-hosted fonts via next/font, no googleapis.com requests | SATISFIED (automated) / NEEDS HUMAN | `app/fonts.ts` uses `next/font/google` (build-time fetch, runtime served from own origin); zero external requests requires browser network tab confirmation |

---

### Human Verification Required

#### 1. No flash of wrong theme on revisit (FOUND-02, Roadmap SC 1)

**Test:** Open DevTools Application tab, set `ms_theme = light` in Local Storage for localhost. Hard-refresh the page (Cmd+Shift+R).
**Expected:** Page paints with light background immediately — no momentary dark background before light theme appears.
**Why human:** FOUC is a visual paint-order behavior. The code is structurally correct (synchronous IIFE in `<head>` with no async/defer), but actual absence of flash can only be confirmed by observing the rendering timeline in a browser.

#### 2. Theme persistence on reload (FOUND-03, Roadmap SC 2)

**Test:** Click the "Toggle theme" button (fixed, top-right). Verify `<html data-theme="...">` toggles in Elements panel. Reload the page.
**Expected:** After reload, the `data-theme` attribute on `<html>` matches the value set before reload; the page applies the correct theme without any code running in React.
**Why human:** localStorage read/write round-trip across page loads requires a live browser session to exercise.

#### 3. Fonts self-hosted — no requests to fonts.googleapis.com (FOUND-04, Roadmap SC 3)

**Test:** Open DevTools Network tab. Filter by "font" or "googleapis". Load/reload the page.
**Expected:** Zero requests to `fonts.googleapis.com`. Font files load from `/_next/static/media/` (verify filenames like `inter-latin-wght-normal.woff2`).
**Why human:** `next/font/google` fetches font files at build time and serves them from the app's own static directory at runtime. The absence of external CDN requests can only be confirmed in the browser's network panel.

---

### Anti-Patterns Found

None. Scanned all modified files — no TODO/FIXME/placeholder comments, no empty return values, no hardcoded stub data, no console.log-only implementations.

---

### Gaps Summary

No blocking gaps. All 10 observable truths pass automated verification. All 9 required artifacts exist, are substantive, and are wired. All 9 requirement IDs claimed by the three plans are satisfied at the code level.

Three behaviors from the ROADMAP success criteria require human browser verification (SC 1, 2, 3 from Phase 1). SC 4 (revalidate Bearer auth) and SC 5 (direct Sanity fetch) are fully verified programmatically.

The implementation is structurally complete and correct. Human verification is the only remaining gate before the phase can be marked passed.

---

_Verified: 2026-05-09T18:17:30Z_
_Verifier: Claude (gsd-verifier)_
