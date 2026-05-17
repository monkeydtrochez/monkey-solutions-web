# Phase 5: Contact + Footer - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-17
**Phase:** 05-contact-footer
**Areas discussed:** Form submission, Footer dynamic content, Budget field format

---

## Form Submission

| Option | Description | Selected |
|--------|-------------|----------|
| Resend API route | Next.js API route at /api/contact using Resend SDK. Real email delivery. Matches existing server-first architecture. | ✓ |
| Formspree | No server code — change form action to Formspree URL. External dependency. | |
| UI-only mock | Show optimistic success state but don't actually send. Backend wired up later. | |

**User's choice:** Resend API route (`POST /api/contact`)

| Sub-question | Options | Selected |
|---|---|---|
| Route structure | POST /api/contact route vs Server Action | POST /api/contact route |
| Email format | Plain text vs HTML email | Plain text with all fields |

**Notes:** Destination email is daniel@monkeysolutions.se (from design handoff). Subject "New contact from [name]". Fields: name, email, budget, message. RESEND_API_KEY stored as server-side env var.

---

## Footer Dynamic Content

| Option | Description | Selected |
|--------|-------------|----------|
| availabilityStatus CMS-managed | Add string field to Sanity profile schema | ✓ |
| Hardcode availability | Write string in FooterSection.tsx; deploy to update | |

| Option | Description | Selected |
|--------|-------------|----------|
| orgNumber + readCvUrl CMS-managed | Add both optional fields to Sanity profile | ✓ |
| orgNumber only | Add org number; hardcode or omit Read.cv | |
| Hardcode both | Write both in component | |

**User's choice:** All three footer fields (availabilityStatus, orgNumber, readCvUrl) are CMS-managed via Sanity profile schema.

**Notes:** readCvUrl renders in the footer "Elsewhere" column only when set. All three fields are optional strings/url.

---

## Budget Field Format

| Option | Description | Selected |
|--------|-------------|----------|
| Text input as-specced | Free-form input, placeholder "€10k · €50k · let's talk". Matches design handoff. | ✓ |
| Select/dropdown | Preset ranges for lead qualification. Deviates from design handoff. | |

**User's choice:** Plain text input as specified in design handoff.

**Notes:** No deviation from the design spec needed here.

---

## Claude's Discretion

- Whether FooterSection uses `useContext(GlobalContext)` (client) or receives profile as a prop (server). Planner decides.
- Resend `from:` address format for dev vs prod. Document in code comments.
- Whether to extract nav links as a shared constant between SiteHeader and FooterSection.

## Deferred Ideas

None — discussion stayed within phase scope.
