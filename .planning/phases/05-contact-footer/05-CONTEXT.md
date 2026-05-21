# Phase 5: Contact + Footer - Context

**Gathered:** 2026-05-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Build two sections: (1) ContactSection — a two-column layout with a direct-links column (email, LinkedIn, GitHub with trailing arrow icons) + resume download cards (EN/SV PDFs via `<a download>`), and a form column (name, email, budget text input, project textarea) that POSTs to a Next.js API route `/api/contact` using Resend to deliver a plain-text email to daniel@monkeysolutions.se; (2) FooterSection — giant Inter/Fraunces wordmark, 4-column meta grid (studio address with CMS-managed org number, nav links, Elsewhere column with LinkedIn/GitHub/Read.cv, availability status), and copyright/version strip. Extend the Sanity `profile` schema with three new optional fields: `availabilityStatus`, `orgNumber`, and `readCvUrl`.

</domain>

<decisions>
## Implementation Decisions

### Contact Form Submission (CONTACT-01, CONTACT-02)

- **D-01:** Form submission uses a POST `/api/contact` API route at `app/api/contact/route.ts`. ContactSection posts JSON via `fetch`, handles the response, and controls the optimistic success/error state locally.
- **D-02:** The API route uses the **Resend** SDK to send a plain-text email. Destination: `daniel@monkeysolutions.se`. Subject: `New contact from [name]`. Body: name, email, budget, and message fields.
- **D-03:** Resend API key is stored in env var `RESEND_API_KEY`. The route reads it server-side — never exposed to the client.
- **D-04:** On successful POST (email sent), the form shows the optimistic success state (green background, checkmark, "✓ Message sent — talk soon!") for 3.5 seconds, then resets. On fetch error or non-2xx response, display a simple inline error message — no custom error state in the design, so use a modest "Something went wrong — try again." below the button.

### Budget Field (CONTACT-01)

- **D-05:** Budget field is a **plain text input** with placeholder `€10k · €50k · let's talk` — matches the design handoff exactly. No select/dropdown.

### Resume Downloads (CONTACT-03)

- **D-06:** Two download cards use `<a href="/resume_en.pdf" download>` and `<a href="/resume_sv.pdf" download>`. Next.js serves `/public/` assets at the root path — the `href` must omit the `/public/` prefix. Placeholder PDF files should be created in `/public/` if Daniel hasn't provided real ones yet (a stub file is fine — the download link must work).

### Contact Section Data Source (CONTACT-04)

- **D-07:** Email, LinkedIn URL, and GitHub URL are read from `GlobalContext.profile` — these fields already exist in the Sanity profile schema and GROQ projection (`email`, `linkedInUrl`, `githubUrl`). No new schema or GROQ changes needed for the contact links.
- **D-08:** ContactSection is a `"use client"` component (requires `useState` for form state and success animation).

### Footer CMS Fields (FOOTER-01, FOOTER-02, FOOTER-03)

- **D-09:** Add three optional string fields to `sanity/schemaTypes/profile.ts`:
  - `availabilityStatus: string` — e.g., "Open for Q3 projects". Displayed in the footer Status column with the pulsing dot.
  - `orgNumber: string` — e.g., "559123-4567". Displayed in the Studio address block as "Org. [orgNumber]".
  - `readCvUrl: url` — Read.cv profile URL. Displayed in the Elsewhere column alongside LinkedIn and GitHub. Render the link only if the field is set (optional; omit gracefully if null).
- **D-10:** Update the GROQ projection for `_type == 'profile'` in `lib/api/sanityDataLoader.ts` to include `availabilityStatus`, `orgNumber`, `readCvUrl`.
- **D-11:** Update the `Profile` TypeScript interface in `app/models/sanityTypes.ts` to add `availabilityStatus?: string`, `orgNumber?: string`, `readCvUrl?: string`.
- **D-12:** FooterSection is a server component (no client state needed — reads from `GlobalContext` is fine via a thin client wrapper or prop-drilling from page.tsx; use the same pattern as SkillsSection/ServicesSection if possible, otherwise `"use client"` with `useContext`).

### Hardcoded Footer Content

- **D-13:** Studio address first two lines are hardcoded: "Monkey Solutions" and "Gothenburg, Sweden". Org number comes from profile (D-09).
- **D-14:** Footer nav links (`/ about`, `/ work`, `/ experience`, `/ skills`, `/ services`, `/ contact`) are hardcoded as anchor links — same 6 links as in the design handoff.
- **D-15:** Copyright strip is hardcoded: "© 2026 Monkey Solutions · All rights reserved" left, "v2026.04 · Made in Göteborg" right. Version string is static (acceptable; Daniel can update in a future deploy).
- **D-16:** Footer "Also replies in 24h" detail copy is hardcoded: "Usually reply within 24h. / Based in CET (UTC+1)."

### Claude's Discretion

- Whether `FooterSection` reads profile data via `useContext(GlobalContext)` (client component) or receives profile as a prop from `page.tsx` (server-friendly). Planner decides — prefer prop-drilling if it keeps FooterSection as a server component, but a client component is acceptable.
- Exact Resend `from:` address format (e.g., `onboarding@resend.dev` for dev; Daniel's verified domain for prod). Document this in code comments.
- Whether to extract the 6 nav links as a shared constant (also used in SiteHeader) or duplicate the array — planner decides.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design Spec (primary visual/interaction spec)
- `design_handoff_monkey_solutions/README.md` §8 (Contact) and §9 (Footer) — Complete visual spec: grid layout, spacing, color tokens, typography, component anatomy, copy strings, interaction states. MUST read before writing any component.
- `design_handoff_monkey_solutions/hifi-part3.jsx` — Hi-fi JSX reference for Contact and Footer sections. Use as visual reference alongside README.

### Requirements & Roadmap
- `.planning/REQUIREMENTS.md` — Phase 5 requirements: CONTACT-01, CONTACT-02, CONTACT-03, CONTACT-04, FOOTER-01, FOOTER-02, FOOTER-03.
- `.planning/ROADMAP.md` — Phase 5 goal and success criteria.

### Sanity Schema & Data Layer
- `sanity/schemaTypes/profile.ts` — Add `availabilityStatus`, `orgNumber`, `readCvUrl` fields (D-09).
- `app/models/sanityTypes.ts` — Update `Profile` interface (D-11).
- `lib/api/sanityDataLoader.ts` — Update GROQ projection for profile (D-10).

### Contact Form Backend
- `app/api/contact/route.ts` — New file. POST handler using Resend SDK. See D-01 through D-04 for spec.
- `.env.local` — Add `RESEND_API_KEY` env var (server-side only; no `NEXT_PUBLIC_` prefix).

### Phase 4 Foundation (established patterns)
- `.planning/phases/04-experience-skills-services/04-CONTEXT.md` — Component and data layer patterns to continue.
- `components/ServicesSection.tsx` — Reference for server component pattern.
- `components/ExperienceSection.tsx` — Reference for `"use client"` component reading from `GlobalContext`.

### Entry Point
- `app/page.tsx` — Add `<ContactSection />` and `<FooterSection />` (or `<footer>`) after `<ServicesSection />` in document order.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `GlobalContext.profile` — Already contains `email`, `linkedInUrl`, `githubUrl`, `location`. ContactSection reads these directly; no new Sanity/GROQ work needed for contact links column.
- `components/ExperienceSection.tsx` — Exact pattern for `"use client"` components using `useContext(GlobalContext)`. ContactSection follows this.
- `components/ServicesSection.tsx` — Pattern for server component (no client state). FooterSection may follow this if profile data is prop-drilled.
- `components/ui/badge.tsx` — May be used for stack chip labels if needed in the resume card area.

### Established Patterns
- CSS variables via `var(--token)` — all design tokens pre-established; no new tokens needed for Phase 5.
- `"use client"` required only when `useState` / `useContext` is needed. ContactSection needs it (form state); FooterSection may not.
- Section anchors: `id="contact"` on outermost `<section>` — activates header nav `#5 contact` link.
- Font variables: `var(--font-sans)`, `var(--font-mono)`, `var(--font-display)` (Fraunces) — already established.

### Integration Points
- `app/page.tsx` — New components added after `<ServicesSection />`.
- `app/api/contact/route.ts` — New API route; follows Next.js App Router convention.
- `sanity/schemaTypes/profile.ts` + `app/models/sanityTypes.ts` + `lib/api/sanityDataLoader.ts` — Three-file change for each new profile field.

</code_context>

<specifics>
## Specific Ideas

- **Contact form traffic lights:** The form card header shows 3 decorative traffic-light dots + `./new_project.sh` label (mono 11 fgFaint). These are `aria-hidden` decorative elements.
- **Success state:** On successful submission, the submit button changes bg to `#27c93f` and text to "✓ Message sent — talk soon!". After 3.5s, reset form and restore original button. Use `useEffect` with a `setTimeout`.
- **Resume download card:** The design shows a single card with both download buttons inside. Not two separate cards. Card has a header row "◉ RESUME" (mono orange) + version tag + hairline, a description paragraph, then a `grid 1fr/1fr` of two download `<a>` buttons.
- **Footer wordmark:** Two lines: `MONKEY` (Inter 800, clamp 80–240px, tracking -0.045em) then `solutions.` (Fraunces italic 300, orangeText). These are not two separate elements — they're two lines of a single heading.
- **"Elsewhere" column Read.cv link:** Only render if `profile.readCvUrl` is set. The trailing arrow `↗` is in orangeText, consistent with other external links in the design.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 05-contact-footer*
*Context gathered: 2026-05-17*
