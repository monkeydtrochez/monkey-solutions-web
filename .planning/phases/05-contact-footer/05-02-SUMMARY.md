---
phase: 05-contact-footer
plan: 02
subsystem: ui
tags: [nextjs, react, typescript, contact-form, resend, tailwind, css-variables]

# Dependency graph
requires:
  - phase: 05-01
    provides: POST /api/contact route, placeholder PDFs, GlobalContext with availabilityStatus/orgNumber/readCvUrl fields
  - phase: 04-experience-skills-services
    provides: GlobalContext with profile data (email, linkedInUrl, githubUrl), established "use client" + useContext pattern
provides:
  - ContactSection "use client" component — full two-column layout with direct links, resume download card, and contact form
  - app/page.tsx now renders 7 sections (HeroSection through ContactSection)
  - Fix: Resend lazy instantiation in app/api/contact/route.ts (build-safe without RESEND_API_KEY)
affects: [05-03-PLAN, FooterSection]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "hoveredCard state for React hover effects without CSS-in-JS (en | sv | null)"
    - "Lazy Resend instantiation pattern inside POST handler to prevent build-time throw"
    - "Form state shape: FormState { name, email, budget, project } + sending/sent/error booleans + useEffect cleanup timer"

key-files:
  created:
    - components/ContactSection.tsx
  modified:
    - app/page.tsx
    - app/api/contact/route.ts

key-decisions:
  - "hoveredCard React state used for download button hover styles (border-color + mist bg) — no CSS class added to globals.css since inline logic was simpler for a two-card case"
  - "LinkedIn display shows URL hostname via URL() constructor — falls back to raw string on parse failure"
  - "GitHub address hardcoded as 'github.com/danmunro' per UI-SPEC (profile.githubUrl still read for href)"
  - "Resend top-level instantiation fixed inline (Rule 1) — moved inside POST handler to prevent next build failure when RESEND_API_KEY is absent"

patterns-established:
  - "hoveredCard pattern: useState<'en' | 'sv' | null>(null) with onMouseEnter/onMouseLeave on each card to apply conditional inline styles"
  - "Form submit flow: setSending(true) → fetch → setSent(true) or setError(msg) → setSending(false) in finally"

requirements-completed: [CONTACT-01, CONTACT-02, CONTACT-03, CONTACT-04]

# Metrics
duration: ~15 min
completed: 2026-05-18
---

# Phase 5 Plan 02: ContactSection UI Summary

**"use client" ContactSection with two-column layout — direct links + resume download card (left) and contact form with 3.5s green success state (right) — wired into page.tsx reading email/LinkedIn/GitHub from GlobalContext.profile**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-05-18T15:00:00Z
- **Completed:** 2026-05-18T15:15:00Z
- **Tasks:** 2 of 2
- **Files modified:** 3

## Accomplishments

- Created `components/ContactSection.tsx` (677 lines) — full two-column implementation per UI-SPEC with all locked decisions; reads email/linkedInUrl/githubUrl from GlobalContext.profile (D-07)
- Resume download card with EN/SV `<a download>` buttons to `/resume_en.pdf` and `/resume_sv.pdf` (D-06), hover effects via React state
- Contact form with 4 fields (name, email, budget plain-text input, project textarea), submit POSTs JSON to `/api/contact`, button turns `#27c93f` on success for 3.5s then resets with clearTimeout cleanup (D-04, D-05)
- Fixed pre-existing build-breaking bug in `app/api/contact/route.ts` — moved Resend instantiation inside handler (lazy init) so `next build` succeeds without `RESEND_API_KEY`
- Added ContactSection import and render in `app/page.tsx` after ServicesSection; `npm run build` and `npm run lint` both exit 0

## Task Commits

Each task was committed atomically:

1. **Task 1: Create components/ContactSection.tsx** - `2cb36d5` (feat)
2. **Task 2: Wire ContactSection into app/page.tsx (+ Resend lazy-init fix)** - `552b5de` (feat)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified

- `components/ContactSection.tsx` — "use client" two-column contact section: kicker, H2 with Fraunces italic "build", lede, direct links (email/LinkedIn/GitHub from GlobalContext), resume download card (EN/SV `<a download>`), form card with traffic-light dots, 4 fields, success/error states
- `app/page.tsx` — Added ContactSection import and `<ContactSection />` after `<ServicesSection />`
- `app/api/contact/route.ts` — Moved `new Resend(...)` call from module-top-level to inside the POST handler (lazy instantiation) to fix build failure without `RESEND_API_KEY`

## Decisions Made

- **hoveredCard state for hover:** The plan allowed either a CSS class or React state for download button hover effects. Used `hoveredCard: "en" | "sv" | null` state — simpler for two cards and keeps all styling inline without adding to globals.css.
- **LinkedIn hostname display:** Extracts hostname via `new URL(profile.linkedInUrl).hostname` — shows "linkedin.com" rather than the full URL; falls back gracefully on parse error.
- **Resend lazy init (Rule 1 auto-fix):** The `new Resend(process.env.RESEND_API_KEY)` at module top-level threw at build time when the key is absent. Moving it inside the handler (after the guard check) is the minimal correct fix with no API behavior change.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed Resend top-level instantiation causing next build failure**
- **Found during:** Task 2 (npm run build verification)
- **Issue:** `new Resend(process.env.RESEND_API_KEY)` at module top-level in `app/api/contact/route.ts` throws `Error: Missing API key` when `RESEND_API_KEY` is absent in the build environment. This crashed `next build` for the entire app, blocking Task 2's done criteria.
- **Fix:** Moved `const resend = new Resend(process.env.RESEND_API_KEY)` to inside the POST handler, after the existing `if (!process.env.RESEND_API_KEY)` guard. No behavior change when key is present.
- **Files modified:** `app/api/contact/route.ts`
- **Verification:** `npm run build` exits 0; `npm run lint` exits 0; `npx tsc --noEmit` exits 0
- **Committed in:** `552b5de` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking bug / Rule 1)
**Impact on plan:** Build-blocking bug in Plan 01 output fixed inline. No scope creep; no behavior change when RESEND_API_KEY is set.

## Issues Encountered

None beyond the Resend lazy-init bug documented above.

## User Setup Required

No new setup required for Plan 02. See Plan 01 SUMMARY for RESEND_API_KEY and Resend domain setup instructions.

## Known Stubs

| Stub | File | Note |
|------|------|------|
| `public/resume_en.pdf` | public/resume_en.pdf | Minimal valid PDF placeholder from Plan 01 — Daniel replaces before launch |
| `public/resume_sv.pdf` | public/resume_sv.pdf | Same placeholder — Daniel replaces before launch |

Download links work with stubs for development purposes.

## Threat Surface Scan

No new security surface beyond the plan's threat model. STRIDE dispositions implemented as specified:

- T-05-06 (Tampering): Client-side inputs are UX-only; server-side validation in route.ts is the trust boundary — no validation duplicated client-side.
- T-05-07 (Information Disclosure): email/linkedInUrl/githubUrl intentionally public contact details rendered in DOM.
- T-05-08 (DoS): `disabled={sending}` prevents double-submit during in-flight request; 3.5s cooldown is UX-only.

## Next Phase Readiness

- Plan 03 (FooterSection) can proceed — ContactSection and page.tsx wiring are complete; app builds and lints clean
- Footer will also use `"use client"` + `useContext(GlobalContext)` pattern (same as ContactSection)
- `availabilityStatus`, `orgNumber`, `readCvUrl` are available in GlobalContext from Plan 01

---
*Phase: 05-contact-footer*
*Completed: 2026-05-18*
