---
phase: 05-contact-footer
plan: 01
subsystem: api
tags: [resend, email, sanity, typescript, pdf]

# Dependency graph
requires:
  - phase: 04-experience-skills-services
    provides: GlobalContext with profile data, established data layer pattern
provides:
  - resend@6.12.3 installed and ready for use
  - POST /api/contact route sending plain-text email via Resend to daniel@monkeysolutions.se
  - Three new Sanity profile fields (availabilityStatus, orgNumber, readCvUrl) in schema + GROQ + TypeScript types
  - public/resume_en.pdf and public/resume_sv.pdf placeholder stubs
affects: [05-02-PLAN, 05-03-PLAN, ContactSection, FooterSection]

# Tech tracking
tech-stack:
  added: [resend@6.12.3]
  patterns: [Next.js App Router POST handler with Resend SDK, three-file atomic Sanity schema+GROQ+types update]

key-files:
  created:
    - app/api/contact/route.ts
    - public/resume_en.pdf
    - public/resume_sv.pdf
  modified:
    - sanity/schemaTypes/profile.ts
    - lib/api/sanityDataLoader.ts
    - app/models/sanityTypes.ts
    - package.json

key-decisions:
  - "Used --legacy-peer-deps for resend install due to pre-existing eslint v10 vs eslint-plugin-react peer dep conflict in project"
  - "Resend sender is onboarding@resend.dev sandbox — documented TODO in code to switch to verified domain for production"
  - "Three new profile fields are optional with no validation rules (per plan spec D-09)"
  - "RESEND_API_KEY read server-side only — no NEXT_PUBLIC_ prefix (D-03)"

patterns-established:
  - "Contact API pattern: NextRequest/NextResponse, JSON body coercion via String(body.field ?? ''), guard on missing env var"
  - "Three-file atomic update: schema (profile.ts) + GROQ projection (sanityDataLoader.ts) + TypeScript interface (sanityTypes.ts)"

requirements-completed: [CONTACT-01, CONTACT-02, CONTACT-03]

# Metrics
duration: ~15 min
completed: 2026-05-18
---

# Phase 5 Plan 01: Data Layer + Backend Summary

**Resend SDK installed, POST /api/contact route created with plain-text email delivery, and Sanity profile schema extended atomically with three new optional footer CMS fields (availabilityStatus, orgNumber, readCvUrl)**

## Performance

- **Duration:** ~15 min (actual execution; wall time included session gaps)
- **Started:** 2026-05-18T06:05:07Z
- **Completed:** 2026-05-18T14:29:41Z
- **Tasks:** 2 of 2
- **Files modified:** 7

## Accomplishments

- Installed resend@6.12.3 and created `app/api/contact/route.ts` — a full POST handler with input validation, Resend SDK email delivery to daniel@monkeysolutions.se, plain-text body (no HTML), `replyTo` set to sender, and graceful RESEND_API_KEY guard
- Extended Sanity `profile` schema with three optional fields (`availabilityStatus`, `orgNumber`, `readCvUrl`) atomically across schema, GROQ projection, and TypeScript interface — all three files in sync
- Created `/public/resume_en.pdf` and `/public/resume_sv.pdf` as minimal valid PDF stubs that browsers can open; Daniel replaces with real PDFs before launch

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Resend SDK, extend Sanity profile (schema + GROQ + types atomically), and create placeholder PDFs** - `e3e3f0f` (feat)
2. **Task 2: Create app/api/contact/route.ts — Resend POST handler** - `4a1dab8` (feat)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified

- `app/api/contact/route.ts` — POST handler using Resend SDK; validates name/email/project, sends plain-text email, guards RESEND_API_KEY, sets replyTo
- `sanity/schemaTypes/profile.ts` — Added availabilityStatus (string), orgNumber (string), readCvUrl (url) defineField entries after heroBio
- `lib/api/sanityDataLoader.ts` — Extended profile GROQ projection with availabilityStatus, orgNumber, readCvUrl
- `app/models/sanityTypes.ts` — Added three optional fields to Profile interface
- `package.json` — Added resend@^6.12.3 dependency
- `public/resume_en.pdf` — Minimal valid PDF stub (302 bytes)
- `public/resume_sv.pdf` — Minimal valid PDF stub (302 bytes, copy of EN)

## Decisions Made

- **--legacy-peer-deps for resend install:** Pre-existing peer dep conflict between eslint v10 (in devDependencies) and eslint-plugin-react@7.37.5 (which requires eslint ≤9.7). This conflict predates this plan — all other packages were also installed with this constraint in place. Used --legacy-peer-deps to match existing project state. This is a Rule 3 (blocking) deviation.
- **Sandbox sender kept:** `onboarding@resend.dev` is used as the `from` address. Documented in code comment: production sends require verifying the `monkeysolutions.se` domain in Resend Dashboard. Until then, the sandbox sender only delivers to the Resend account owner's registered email.
- **Plain-text only:** `text:` field used exclusively, no `html:` field — per D-02.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Used --legacy-peer-deps for resend install**
- **Found during:** Task 1 (Step A — resend install)
- **Issue:** `npm install resend` failed with ERESOLVE — pre-existing peer dep conflict between eslint@10.3.0 (installed) and eslint-plugin-react@7.37.5 (requires eslint ≤9.7). This conflict exists independently of resend.
- **Fix:** Used `npm install resend --legacy-peer-deps` to match existing project installation mode. No functional impact — resend has no eslint dependency.
- **Files modified:** package.json, package-lock.json
- **Verification:** `npm run lint` exits 0; `npx tsc --noEmit` exits 0
- **Committed in:** e3e3f0f (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking/Rule 3)
**Impact on plan:** Pre-existing peer dep conflict resolved with --legacy-peer-deps, which is the correct resolution for a conflict that predates this plan. No scope creep, no functional impact.

## Issues Encountered

None beyond the npm peer dep conflict documented as deviation above.

## User Setup Required

**External services require manual configuration.** See below for required steps:

### RESEND_API_KEY

Add to `.env.local` in the project root:

```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
```

Get the key from: https://resend.com/api-keys → Create API Key

### Resend Account / Domain Setup

1. Create a Resend account at https://resend.com if not already done
2. Add RESEND_API_KEY to `.env.local`
3. For production sends to daniel@monkeysolutions.se from a custom sender: verify `monkeysolutions.se` domain at https://resend.com/domains — then change `from: 'onboarding@resend.dev'` in `app/api/contact/route.ts` to `from: 'Contact Form <contact@monkeysolutions.se>'`
4. Until domain is verified, `onboarding@resend.dev` only delivers to the Resend account owner's own email address

**Verification command (once RESEND_API_KEY is set):**
```bash
curl -X POST http://localhost:3000/api/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test","email":"test@test.com","budget":"","project":"Hello"}'
# Expected: {"id":"..."} with status 200
# Without key: {"error":"Email service not configured"} with status 500
```

## Known Stubs

| Stub | File | Note |
|------|------|------|
| `public/resume_en.pdf` | public/resume_en.pdf | Minimal valid PDF placeholder — Daniel replaces before launch |
| `public/resume_sv.pdf` | public/resume_sv.pdf | Same placeholder as EN — Daniel replaces before launch |

These stubs are intentional per plan spec D-06. The download links in Plan 02 (ContactSection) will work with these stubs. Real PDFs replace them before go-live.

## Threat Surface Scan

No new security surface beyond what is documented in the plan's threat model. All STRIDE mitigations are implemented:

- T-05-01 (Tampering): `String(body.field ?? '').trim()` applied to all fields; plain `text:` only
- T-05-02 (Information Disclosure): RESEND_API_KEY has no NEXT_PUBLIC_ prefix; verified by lint gate

## Next Phase Readiness

- Plan 02 (ContactSection UI) can proceed immediately — `/api/contact` POST endpoint is ready
- Plan 03 (FooterSection UI) can proceed — `availabilityStatus`, `orgNumber`, `readCvUrl` are in GlobalContext via updated GROQ/types
- RESEND_API_KEY must be added to `.env.local` before the contact form can deliver email
- Resume PDFs must be replaced with real files before launch (stubs serve the download links for development)

---
*Phase: 05-contact-footer*
*Completed: 2026-05-18*
