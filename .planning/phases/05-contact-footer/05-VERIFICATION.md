---
phase: 05-contact-footer
verified: 2026-05-18T16:00:00Z
status: passed
score: 13/13 must-haves verified
overrides_applied: 0
human_verification:
  - test: "Submit contact form with valid input (name, email, project)"
    expected: "Button turns green (#27c93f) with '✓ Message sent — talk soon!' for 3.5 seconds, then form resets to empty"
    why_human: "Cannot invoke runtime form submission without a running dev server; requires RESEND_API_KEY in .env.local for real email delivery"
  - test: "Submit contact form with RESEND_API_KEY absent (or wrong)"
    expected: "Error message 'Something went wrong — try again.' appears below the button"
    why_human: "Requires controlled env var state and a running server"
  - test: "Click EN and SV download buttons in ContactSection resume card"
    expected: "Browser download dialog appears for /resume_en.pdf and /resume_sv.pdf respectively"
    why_human: "Download behavior requires a running browser; cannot verify file-download trigger programmatically"
  - test: "Scroll to footer — verify wordmark renders with Fraunces italic on 'solutions.' and pulsing orange dot in Status column"
    expected: "MONKEY in Inter 800, 'solutions.' in Fraunces italic orangeText at clamp(80px,16vw,240px); pulsing dot animates"
    why_human: "Visual rendering and animation require a browser"
  - test: "Resize viewport below 760px — verify footer 4-column grid does not collapse (Phase 6 concern)"
    expected: "Grid remains 4-column until Phase 6 responsive work — note any overflow issues for Phase 6 planning"
    why_human: "Visual viewport testing requires a browser"
---

# Phase 5: Contact + Footer Verification Report

**Phase Goal:** Visitors can reach Daniel, download his resume, and see site meta information in the footer
**Verified:** 2026-05-18T16:00:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Three new optional profile fields exist in Sanity schema: availabilityStatus, orgNumber, readCvUrl | ✓ VERIFIED | `sanity/schemaTypes/profile.ts` lines 148–164: all three defineField entries present |
| 2 | GROQ projection includes availabilityStatus, orgNumber, readCvUrl for _type == 'profile' | ✓ VERIFIED | `lib/api/sanityDataLoader.ts` lines 24–26: all three fields in profile block |
| 3 | Profile TypeScript interface has availabilityStatus?, orgNumber?, readCvUrl? | ✓ VERIFIED | `app/models/sanityTypes.ts` lines 37–39: three optional fields in Profile interface |
| 4 | POST /api/contact accepts JSON body {name, email, budget, project}, sends plain-text email via Resend SDK, returns 200 on success or 500 on error | ✓ VERIFIED | `app/api/contact/route.ts`: lazy Resend instantiation, input coercion via String(), plain text: field (no html:), correct status codes |
| 5 | RESEND_API_KEY is read server-side only (no NEXT_PUBLIC_ prefix) | ✓ VERIFIED | grep confirms no NEXT_PUBLIC_RESEND in route.ts |
| 6 | resume_en.pdf and resume_sv.pdf exist in /public/ as valid minimal PDFs | ✓ VERIFIED | Both files exist at 302 bytes each |
| 7 | ContactSection renders at #contact anchor with two-column layout, kicker, H2, lede, direct links, resume download card | ✓ VERIFIED | `components/ContactSection.tsx` (677 lines): id="contact", kicker "07 CONTACT", H2 "Let's / build something.", lede text, email/LinkedIn/GitHub links with ↗ arrows |
| 8 | Form POSTs JSON to /api/contact; on success button turns green (#27c93f) for 3.5s then resets | ✓ VERIFIED | Lines 32–37: fetch POST to /api/contact; line 628: `sent ? "#27c93f"`; lines 23–24: 3500ms setTimeout + clearTimeout cleanup |
| 9 | On fetch error form shows 'Something went wrong — try again.' | ✓ VERIFIED | Lines 40–42: catch block sets error state; lines 659–671: conditional error display |
| 10 | email, linkedInUrl, githubUrl read from GlobalContext.profile (not hardcoded) | ✓ VERIFIED | Lines 195, 213, 220, 255: all three profile fields read via useContext(GlobalContext) |
| 11 | Budget field is plain text input with placeholder '€10k · €50k · let's talk' | ✓ VERIFIED | Line 582–587: type="text" input, correct placeholder, no <select> |
| 12 | Footer renders giant wordmark MONKEY/solutions., 4-column meta grid (Studio/Navigate/Elsewhere/Status), and bottom strip | ✓ VERIFIED | `components/FooterSection.tsx` (211 lines): MONKEY + solutions. wordmark at clamp(80px, 16vw, 240px), 4-column grid with all column labels, copyright strip |
| 13 | FooterSection is rendered in app/page.tsx after ContactSection, outside main | ✓ VERIFIED | `app/page.tsx` line 31: `<FooterSection />` at line 31, after `</main>` at line 30 |

**Score:** 13/13 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `sanity/schemaTypes/profile.ts` | Three new optional fields: availabilityStatus (string), orgNumber (string), readCvUrl (url) | ✓ VERIFIED | All three defineField entries present after heroBio |
| `lib/api/sanityDataLoader.ts` | GROQ projection includes three new profile fields | ✓ VERIFIED | availabilityStatus, orgNumber, readCvUrl on lines 24–26 |
| `app/models/sanityTypes.ts` | Profile interface has availabilityStatus?, orgNumber?, readCvUrl? | ✓ VERIFIED | Three optional fields at lines 37–39 |
| `app/api/contact/route.ts` | POST handler using Resend SDK — plain-text email to daniel@monkeysolutions.se | ✓ VERIFIED | Full implementation: lazy init, input validation, resend.emails.send, replyTo, 400/500 error handling |
| `public/resume_en.pdf` | Placeholder PDF for EN resume download | ✓ VERIFIED | 302 bytes, minimal valid PDF |
| `public/resume_sv.pdf` | Placeholder PDF for SV resume download | ✓ VERIFIED | 302 bytes, minimal valid PDF |
| `components/ContactSection.tsx` | Client component — two-column contact section with form, direct links, resume download card | ✓ VERIFIED | 677 lines, "use client", contains id="contact", full two-column implementation |
| `app/page.tsx` | ContactSection imported and rendered after ServicesSection | ✓ VERIFIED | Import at line 11, `<ContactSection />` at line 29, after `<ServicesSection />` at line 28 |
| `components/FooterSection.tsx` | Client component — footer with wordmark, 4-column meta grid, bottom strip | ✓ VERIFIED | 211 lines, "use client", wordmark + grid + strip all present |
| `app/page.tsx` | FooterSection rendered after main block | ✓ VERIFIED | `<FooterSection />` at line 31, immediately after `</main>` at line 30 |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `app/api/contact/route.ts` | `process.env.RESEND_API_KEY` | `new Resend(process.env.RESEND_API_KEY)` | ✓ WIRED | Key read at line 25 inside handler; guard check at line 17 — both occurrences confirmed |
| `lib/api/sanityDataLoader.ts` | `app/models/sanityTypes.ts` | GROQ fields map to Profile interface optional fields | ✓ WIRED | GROQ projects availabilityStatus/orgNumber/readCvUrl; Profile interface declares matching optional fields |
| `components/ContactSection.tsx` | `GlobalContext.profile` | `useContext(GlobalContext)` — reads email, linkedInUrl, githubUrl | ✓ WIRED | useContext at line 9, profile fields rendered at lines 195, 213, 220, 255 |
| `components/ContactSection.tsx` | `/api/contact` | fetch POST on form submit | ✓ WIRED | fetch("/api/contact") at line 32 inside handleSubmit; response checked at line 37 |
| `components/ContactSection.tsx` | `/resume_en.pdf` | `<a href='/resume_en.pdf' download>` | ✓ WIRED | Lines 352–353: href="/resume_en.pdf" with download attribute |
| `components/FooterSection.tsx` | `GlobalContext.profile` | `useContext(GlobalContext)` — reads availabilityStatus, orgNumber, readCvUrl, linkedInUrl, githubUrl | ✓ WIRED | useContext at line 15; all five profile fields read in JSX |
| `components/FooterSection.tsx` | `var(--font-display)` | Fraunces italic em element for 'solutions.' wordmark | ✓ WIRED | Line 49: `fontFamily: "var(--font-display)"` on em element |
| `components/FooterSection.tsx` | `ms-pulse keyframe` | `animation: 'ms-pulse var(--anim-pulse) infinite'` on pulsing dot | ✓ WIRED | Line 171: animation applied inline; no @keyframes redefined in component |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `ContactSection.tsx` | `profile.email`, `profile.linkedInUrl`, `profile.githubUrl` | `GlobalContext` ← `DataHydrator` ← `loadSanityData()` ← Sanity GROQ | Yes — GROQ query fetches live Sanity document fields | ✓ FLOWING |
| `FooterSection.tsx` | `profile.availabilityStatus`, `profile.orgNumber`, `profile.readCvUrl` | `GlobalContext` ← `DataHydrator` ← `loadSanityData()` ← Sanity GROQ | Yes — three fields in GROQ projection (lines 24–26 of sanityDataLoader.ts) | ✓ FLOWING |
| `app/api/contact/route.ts` | `name`, `email`, `budget`, `project` | `request.json()` — runtime POST body | Yes — coerced via String() and validated before forwarding to Resend | ✓ FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| `npm run build` exits 0 | `npm run build` | Clean build — all 6 routes compiled, TypeScript passed, no errors | ✓ PASS |
| `npm run lint` exits 0 | `npm run lint` | 0 warnings, 0 errors | ✓ PASS |
| /api/contact route exists in build output | Build route list | `ƒ /api/contact` listed as dynamic route | ✓ PASS |
| ContactSection min 200 lines | `wc -l components/ContactSection.tsx` | 677 lines | ✓ PASS |
| FooterSection min 150 lines | `wc -l components/FooterSection.tsx` | 211 lines | ✓ PASS |
| FooterSection does not redefine ms-pulse keyframe | `grep @keyframes FooterSection.tsx` | No matches | ✓ PASS |
| Budget field is not a select | `grep '<select' ContactSection.tsx` | No matches | ✓ PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| CONTACT-01 | 05-02 | Contact form with name, email, budget (plain text), project textarea | ✓ SATISFIED | All 4 fields in ContactSection.tsx; budget is type="text" input |
| CONTACT-02 | 05-02 | Green success state 3.5s then reset; inline error on failure | ✓ SATISFIED | #27c93f on sent state, 3500ms timer, clearTimeout cleanup, error display |
| CONTACT-03 | 05-01, 05-02 | EN and SV resume download cards with `<a download>` to /resume_en.pdf and /resume_sv.pdf | ✓ SATISFIED | Both files exist; both download anchors present in ContactSection |
| CONTACT-04 | 05-02 | Email, LinkedIn, GitHub direct links read from GlobalContext.profile | ✓ SATISFIED | All three links read from profile via useContext |
| FOOTER-01 | 05-03 | Giant wordmark MONKEY/solutions. with Fraunces italic orange "solutions." at clamp(80px, 16vw, 240px) | ✓ SATISFIED | FooterSection.tsx lines 37–55 |
| FOOTER-02 | 05-03 | 4-column meta grid: Studio (CMS orgNumber), Navigate (6 hardcoded), Elsewhere (LinkedIn/GitHub/conditional Read.cv), Status (pulsing dot + CMS availabilityStatus) | ✓ SATISFIED | All four columns implemented with correct CMS field wiring and conditional readCvUrl render |
| FOOTER-03 | 05-03 | Bottom strip with copyright and version string, flex space-between | ✓ SATISFIED | Lines 193–207: "© 2026 Monkey Solutions · All rights reserved" and "v2026.04 · Made in Göteborg" |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `public/resume_en.pdf` | — | Minimal stub PDF (302 bytes) | ℹ️ Info | Intentional per plan spec D-06; Daniel replaces before launch. Download links work for development. |
| `public/resume_sv.pdf` | — | Same stub as EN | ℹ️ Info | Same as above — both are documented known stubs. |

No blocking anti-patterns found. The `onboarding@resend.dev` sandbox sender in `app/api/contact/route.ts` line 46 has a documented TODO comment and is an accepted deviation per D-04 and SUMMARY decision log.

### Human Verification Required

#### 1. Contact Form Success State

**Test:** Run dev server (`npm run dev`), add `RESEND_API_KEY` to `.env.local`, visit `http://localhost:3000/`, scroll to #contact, fill all 4 fields and submit.
**Expected:** Button background transitions to `#27c93f` with label "✓ Message sent — talk soon!" for exactly 3.5 seconds, then button and form fields reset to initial state.
**Why human:** Runtime form submission with fetch requires a running server and valid RESEND_API_KEY; cannot automate.

#### 2. Contact Form Error State

**Test:** Same as above but with RESEND_API_KEY absent or invalid in `.env.local`.
**Expected:** Error paragraph "Something went wrong — try again." appears below the submit button. Button label remains "$ send_message →".
**Why human:** Requires controlled env var state at runtime.

#### 3. Resume Download Behavior

**Test:** Click "EN" and "SV" download buttons in the ContactSection resume card.
**Expected:** Browser download dialog opens and saves `resume_en.pdf` (or `resume_sv.pdf`) to disk. Hover state: card border turns orange and background turns mist color.
**Why human:** File download trigger and hover CSS require a browser.

#### 4. Footer Visual Rendering

**Test:** Visit `http://localhost:3000/`, scroll to footer.
**Expected:** "MONKEY" in Inter 800 at giant clamp size; "solutions." in Fraunces italic 300, orange. 4-column grid visible with Studio/Navigate/Elsewhere/Status labels. Pulsing orange dot animates in Status column. Bottom strip shows copyright left and version right.
**Why human:** Font rendering, animation, and visual layout require a browser.

#### 5. Footer Responsive (informational — Phase 6 concern)

**Test:** Resize browser to below 760px viewport width.
**Expected:** Note any overflow in footer 4-column grid — Phase 6 will collapse to single column. This is a forward-looking observation, not a Phase 5 gap.
**Why human:** Visual viewport testing.

### Gaps Summary

No gaps. All 13 must-have truths are VERIFIED in the codebase. The 5 human verification items above are runtime behavioral and visual checks that cannot be confirmed programmatically — they require a running dev server and a browser. All automated checks (build, lint, artifact existence, content patterns, key links, data-flow traces) pass.

**Key notes for human verification:**
- RESEND_API_KEY must be added to `.env.local` before the contact form can deliver real email. Without it, the route returns a 500 error — the form error state can be tested without the key.
- The `onboarding@resend.dev` sandbox sender only delivers to the Resend account owner's registered email until the `monkeysolutions.se` domain is verified in the Resend Dashboard.
- Resume PDFs are intentional stubs — download links function correctly for development; Daniel replaces with real PDFs before launch.

---

_Verified: 2026-05-18T16:00:00Z_
_Verifier: Claude (gsd-verifier)_
