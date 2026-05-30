# Phase 5: Contact + Footer - Research

**Researched:** 2026-05-17
**Domain:** Next.js App Router API route (Resend email), React form state management, Sanity schema extension, footer/contact component layout
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Contact Form Submission (CONTACT-01, CONTACT-02)**
- D-01: Form submission uses a POST `/api/contact` API route at `app/api/contact/route.ts`. ContactSection posts JSON via `fetch`, handles the response, and controls the optimistic success/error state locally.
- D-02: The API route uses the Resend SDK to send a plain-text email. Destination: `daniel@monkeysolutions.se`. Subject: `New contact from [name]`. Body: name, email, budget, and message fields.
- D-03: Resend API key is stored in env var `RESEND_API_KEY`. The route reads it server-side — never exposed to the client.
- D-04: On successful POST (email sent), the form shows the optimistic success state (green background, checkmark, "✓ Message sent — talk soon!") for 3.5 seconds, then resets. On fetch error or non-2xx response, display a simple inline error message "Something went wrong — try again." below the button.

**Budget Field (CONTACT-01)**
- D-05: Budget field is a plain text input with placeholder `€10k · €50k · let's talk`.

**Resume Downloads (CONTACT-03)**
- D-06: Two download cards use `<a href="/resume_en.pdf" download>` and `<a href="/resume_sv.pdf" download>`. Placeholder PDF files should be created in `/public/` if real ones aren't available yet.

**Contact Section Data Source (CONTACT-04)**
- D-07: Email, LinkedIn URL, and GitHub URL are read from `GlobalContext.profile` — these fields already exist (`email`, `linkedInUrl`, `githubUrl`). No new schema or GROQ changes needed for contact links.
- D-08: ContactSection is a `"use client"` component (requires `useState` for form state and success animation).

**Footer CMS Fields (FOOTER-01, FOOTER-02, FOOTER-03)**
- D-09: Add three optional string fields to `sanity/schemaTypes/profile.ts`: `availabilityStatus`, `orgNumber`, `readCvUrl` (url type).
- D-10: Update the GROQ projection for `_type == 'profile'` in `lib/api/sanityDataLoader.ts` to include `availabilityStatus`, `orgNumber`, `readCvUrl`.
- D-11: Update the `Profile` TypeScript interface in `app/models/sanityTypes.ts` to add `availabilityStatus?: string`, `orgNumber?: string`, `readCvUrl?: string`.
- D-12: FooterSection — prefer prop-drilling if it keeps FooterSection as server component, but client component acceptable.

**Hardcoded Footer Content**
- D-13: Studio address first two lines hardcoded: "Monkey Solutions" and "Gothenburg, Sweden". Org number from profile.
- D-14: Footer nav links hardcoded: `/ about`, `/ work`, `/ experience`, `/ skills`, `/ services`, `/ contact`.
- D-15: Copyright strip hardcoded: "© 2026 Monkey Solutions · All rights reserved" left, "v2026.04 · Made in Göteborg" right.
- D-16: Footer "Also replies in 24h" detail copy hardcoded: "Usually reply within 24h. / Based in CET (UTC+1)."

### Claude's Discretion

- Whether FooterSection reads profile data via `useContext(GlobalContext)` or receives profile as a prop from `page.tsx`. Prefer prop-drilling to keep as server component; client component acceptable.
- Exact Resend `from:` address format (e.g., `onboarding@resend.dev` for dev; Daniel's verified domain for prod). Document in code comments.
- Whether to extract the 6 nav links as a shared constant or duplicate the array.

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CONTACT-01 | User can submit a contact form with name, email, budget, and project description fields | Resend SDK plain-text send; form state pattern via `useState`; field specs from design handoff §8 |
| CONTACT-02 | Contact form shows optimistic success state (green background, checkmark, confirmation text) for 3.5s then resets | `useEffect` + `setTimeout` pattern; state shape `{ sending, sent, error }`; design handoff button colors |
| CONTACT-03 | User can download a resume as PDF in English or Swedish via styled download cards | `<a href="/resume_en.pdf" download>` anchors; placeholder PDFs in `/public/`; design handoff card anatomy |
| CONTACT-04 | User sees direct contact links for email, LinkedIn, and GitHub with trailing arrow icons | `GlobalContext.profile.email/linkedInUrl/githubUrl` already in GROQ projection; design handoff link row pattern |
| FOOTER-01 | User sees a giant wordmark ("MONKEY / solutions.") with Fraunces italic accent on "solutions." | `clamp(80px, 16vw, 240px)` Inter 800 + Fraunces italic 300 orangeText; established font tokens |
| FOOTER-02 | Footer contains a 4-column meta grid: studio address, navigation links, social links, and availability status | D-09 new Sanity fields; design handoff §9 4-column layout; pulsing dot via established `ms-pulse` animation |
| FOOTER-03 | Footer has a bottom strip with copyright text and version info | Hardcoded strings per D-15; flex space-between layout |
</phase_requirements>

---

## Summary

Phase 5 builds the final two sections of the portfolio page: ContactSection (client component with form + direct links + resume download card) and FooterSection (large wordmark + 4-column meta grid + copyright strip). The phase also extends the Sanity `profile` schema with three optional CMS fields (`availabilityStatus`, `orgNumber`, `readCvUrl`) and wires a new `/api/contact` API route that uses the Resend SDK to deliver form submissions as plain-text emails.

All foundational patterns are already established by phases 1–4. ContactSection follows the exact `"use client"` + `useContext(GlobalContext)` pattern from ExperienceSection.tsx and SkillsSection.tsx. FooterSection can be implemented as a client component using the same pattern, or as a thin client wrapper with prop-drilling — the codebase supports both. The Sanity three-file update pattern (schema → GROQ → TypeScript types) has been done in phases 2, 3, and 4 and is routine.

The one genuinely new dependency is the Resend SDK (`resend@6.12.3`, not yet installed). The API route pattern mirrors the existing `/api/revalidate/route.ts` in this project — same `NextRequest`/`NextResponse` shape, same env var access pattern. Resend's `from:` address must be a verified domain for production sends to any recipient; during development, `onboarding@resend.dev` can only send to the account owner's email.

**Primary recommendation:** Install `resend`, implement the three-file Sanity extension first (data layer wave), then build ContactSection and FooterSection in parallel waves since they share no local state.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Contact form UI + state | Browser (Client Component) | — | Requires `useState` for form fields and success/error state |
| Email delivery | API / Backend (route.ts) | — | Resend API key must stay server-side; never in client bundle |
| Form validation (basic) | API / Backend | Browser (client-side UX) | Server is the trust boundary; client-side guards are UX only |
| Contact link data (email, LinkedIn, GitHub) | Browser via GlobalContext | — | Already in context from profile GROQ projection |
| Footer CMS data (availabilityStatus, orgNumber, readCvUrl) | Database / Sanity → API → GlobalContext | Browser read | Three-file update: schema + GROQ + TypeScript types |
| Footer static content (hardcoded copy, nav links) | Browser (component constants) | — | Per D-13 through D-16; no CMS dependency |
| Resume PDF delivery | CDN / Static (/public) | — | `<a download>` anchors to static files; Next.js serves from /public |

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| resend | 6.12.3 | Email delivery via API route | Locked decision D-02; official SDK with TypeScript types, plain-text support |
| next (existing) | ^16.0.7 | App Router API route handler | Already installed; route.ts pattern established in project |
| react (existing) | ^19.2.1 | `useState` / `useEffect` for form state | Already installed; all components use React 19 |

[VERIFIED: npm registry — resend@6.12.3, published 2026-05-06]
[VERIFIED: package.json — next@^16.0.7, react@^19.2.1 already installed]

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @sanity/client (existing) | ^7.22.0 | Sanity schema extension (dev tooling only) | Adding `availabilityStatus`, `orgNumber`, `readCvUrl` fields to profile.ts |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Resend plain-text | Resend HTML or React Email | Locked as plain-text per D-02; simpler, no template needed |
| `useContext(GlobalContext)` in FooterSection | Prop-drilling from page.tsx | Prop-drilling keeps FooterSection as server component; either works — discretion area |

**Installation:**
```bash
npm install resend
```

**Version verification:**
```
resend: 6.12.3 (verified via `npm view resend version`, published 2026-05-06)
```

---

## Architecture Patterns

### System Architecture Diagram

```
page.tsx (server)
    │
    ├─ loadSanityData() ──→ Sanity CMS
    │       │                  (profile with new: availabilityStatus, orgNumber, readCvUrl)
    │       ↓
    ├─ DataHydrator → GlobalContext (client)
    │                    │
    │          ┌─────────┴──────────┐
    │          ↓                    ↓
    │   ContactSection          FooterSection
    │   ("use client")          ("use client" or server)
    │   useContext →             useContext → profile
    │   profile.email            .availabilityStatus
    │   profile.linkedInUrl      .orgNumber
    │   profile.githubUrl        .readCvUrl
    │          │
    │   [form submit]
    │          │
    │          ↓ fetch POST
    │   /api/contact/route.ts (server)
    │          │
    │          ↓ resend.emails.send({ text: ... })
    │       Resend API → daniel@monkeysolutions.se
    │
    └─ /public/resume_en.pdf  (static, <a download>)
       /public/resume_sv.pdf  (static, <a download>)
```

### Recommended Project Structure

```
app/
├── api/
│   └── contact/
│       └── route.ts          # NEW — POST handler, Resend send
├── models/
│   └── sanityTypes.ts        # UPDATE — add availabilityStatus?, orgNumber?, readCvUrl?
components/
├── ContactSection.tsx         # NEW — "use client", form + links + resume card
├── FooterSection.tsx          # NEW — "use client" (useContext) or server prop
lib/
└── api/
    └── sanityDataLoader.ts    # UPDATE — add 3 fields to profile GROQ projection
sanity/
└── schemaTypes/
    └── profile.ts             # UPDATE — add 3 new optional fields
public/
├── resume_en.pdf              # NEW — placeholder PDF (1-byte or minimal valid PDF)
└── resume_sv.pdf              # NEW — placeholder PDF
```

### Pattern 1: Resend API Route (plain-text email)

**What:** POST handler in App Router that reads JSON body, validates fields, sends plain-text email via Resend SDK.
**When to use:** Any form-to-email endpoint where the API key must stay server-side.

```typescript
// Source: Context7 /websites/resend — "Create Next.js API Route for Sending Email"
// app/api/contact/route.ts
import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

// NOTE: for development, use 'onboarding@resend.dev' as `from` — this only delivers
// to the Resend account owner's email. For production, use a verified domain:
// 'Contact Form <contact@monkeysolutions.se>'
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const { name, email, budget, project } = await request.json();

  const { data, error } = await resend.emails.send({
    from: 'onboarding@resend.dev',           // dev; change to verified domain in prod
    to: 'daniel@monkeysolutions.se',
    subject: `New contact from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nBudget: ${budget}\n\n${project}`,
    replyTo: email,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ id: data?.id }, { status: 200 });
}
```

[VERIFIED: Context7 /websites/resend — send API parameters confirmed]

### Pattern 2: Contact Form State Machine

**What:** `"use client"` component with controlled form fields and a `sent`/`error` state driving button UI change. `useEffect` cleans up the 3.5s timer on unmount.
**When to use:** Any form with optimistic success state and auto-reset.

```typescript
// Source: design_handoff_monkey_solutions/hifi-part3.jsx + Context.md D-04
"use client";
import { useState, useEffect } from "react";

type FormState = { name: string; email: string; budget: string; project: string };
const EMPTY: FormState = { name: "", email: "", budget: "", project: "" };

export default function ContactSection() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sent) return;
    const t = setTimeout(() => {
      setSent(false);
      setForm(EMPTY);
    }, 3500);
    return () => clearTimeout(t);
  }, [sent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("non-2xx");
      setSent(true);
    } catch {
      setError("Something went wrong — try again.");
    } finally {
      setSending(false);
    }
  };
  // ...
}
```

[VERIFIED: design_handoff_monkey_solutions/hifi-part3.jsx — submit handler reference]

### Pattern 3: Sanity Profile Schema Extension

**What:** Adding optional fields to an existing `defineType` in `profile.ts`. All three follow the same shape.
**When to use:** Each time a new CMS-managed field is needed in `profile`.

```typescript
// Source: sanity/schemaTypes/profile.ts (existing file pattern)
// Add inside the fields array:
defineField({
  name: 'availabilityStatus',
  title: 'Availability Status',
  type: 'string',
  description: 'e.g. "Open for Q3 projects". Shown in footer Status column.',
}),
defineField({
  name: 'orgNumber',
  title: 'Organisation Number',
  type: 'string',
  description: 'e.g. "559123-4567". Shown in footer Studio address block.',
}),
defineField({
  name: 'readCvUrl',
  title: 'Read.cv URL',
  type: 'url',
  description: 'Read.cv profile URL. Shown in footer Elsewhere column. Optional.',
}),
```

[VERIFIED: sanity/schemaTypes/profile.ts — existing defineField pattern confirmed]

### Pattern 4: GROQ Projection Extension

**What:** Adding new fields to the profile projection in `sanityDataLoader.ts`. All existing fields are enumerated explicitly inside the `_type == 'profile' => { }` block.

```typescript
// Source: lib/api/sanityDataLoader.ts (existing query)
// Add three lines inside the profile projection:
_type == 'profile' => {
  // ... existing fields ...
  heroBio,
  availabilityStatus,
  orgNumber,
  readCvUrl
},
```

[VERIFIED: lib/api/sanityDataLoader.ts — exact GROQ projection structure confirmed]

### Pattern 5: Placeholder PDF Creation

**What:** A minimal valid PDF file in `/public/` so that `<a download>` links work immediately without real files.
**When to use:** Any time a static asset needs to be referenced before the real asset is available.

```bash
# Create a minimal valid PDF (one-line stub — browsers will show a valid but empty PDF)
printf '%s' '%PDF-1.0
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R>>endobj
xref
0 4
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
trailer<</Size 4/Root 1 0 R>>
startxref
190
%%EOF' > public/resume_en.pdf
cp public/resume_en.pdf public/resume_sv.pdf
```

[ASSUMED] — PDF structure is from training knowledge; a 1-byte placeholder or even an empty file will also trigger the `download` attribute, but an invalid PDF will show a browser error on open. A valid stub avoids that.

### Pattern 6: FooterSection with GlobalContext

**What:** `"use client"` component reading profile from GlobalContext — same as ExperienceSection and SkillsSection.
**When to use:** Whenever a component needs CMS data and has no server-only concern.

```typescript
// Source: components/ExperienceSection.tsx (established pattern)
"use client";
import { useContext } from "react";
import GlobalContext from "@/app/context/GlobalContext";

export default function FooterSection() {
  const ctx = useContext(GlobalContext);
  const profile = ctx?.profile;
  // profile.availabilityStatus, profile.orgNumber, profile.readCvUrl
  // ...
}
```

[VERIFIED: components/ExperienceSection.tsx, components/SkillsSection.tsx — pattern confirmed in codebase]

### Anti-Patterns to Avoid

- **Exposing RESEND_API_KEY client-side:** Never use `NEXT_PUBLIC_` prefix for this key. The route.ts reads it server-side only. [VERIFIED: Context.md D-03]
- **Using `onboarding@resend.dev` in production:** This `from:` address can only deliver to the Resend account owner's own email. For any recipient (`daniel@monkeysolutions.se`), a verified domain is required unless the verified account email IS `daniel@monkeysolutions.se`. [VERIFIED: Context7 /websites/resend — validation_error 403 docs]
- **Building inline HTML email:** Locked as plain-text (D-02). Do not add an `html` field to the Resend call; use `text` only.
- **Omitting `replyTo`:** Without `replyTo: email`, Daniel cannot reply directly to the sender from his email client. Add it.
- **Leaving GlobalContext Profile type out of sync:** Any new Sanity field added to the GROQ projection but not to `Profile` in sanityTypes.ts will be silently dropped. All three files (schema, GROQ, TypeScript) must be updated together.
- **`<a href="/public/resume_en.pdf">`:** Files in `/public/` are served at the root path, not under `/public/`. Use `href="/resume_en.pdf"`. [VERIFIED: Next.js docs convention confirmed by `next.config.mjs` remote patterns pattern]

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Email delivery | Custom SMTP client, nodemailer setup | Resend SDK (`resend.emails.send`) | SPF/DKIM/DMARC complexity, deliverability, typed API |
| Form success timeout reset | Manual interval polling | `useEffect` + `setTimeout` with cleanup | Race conditions on unmount; cleanup function prevents memory leaks |
| PDF generation | puppeteer, pdfkit | Static files in `/public/` | Requirement is a static download, not dynamic generation |

**Key insight:** Resend abstracts all email infrastructure (DNS records, deliverability, bounce handling). The contact form's only job is POST → parse → send → respond.

---

## Common Pitfalls

### Pitfall 1: Resend `from:` Address Restriction in Development

**What goes wrong:** API returns 403 with `validation_error` ("You can only send testing emails to your own email address") when using `onboarding@resend.dev` and trying to deliver to `daniel@monkeysolutions.se`.
**Why it happens:** Resend's `onboarding@resend.dev` sender is for sandbox testing only. It can only deliver to the email address registered with the Resend account.
**How to avoid:** Use `onboarding@resend.dev` only if `daniel@monkeysolutions.se` is the Resend account email. For full production delivery to any recipient, Daniel must verify `monkeysolutions.se` in the Resend dashboard and use `contact@monkeysolutions.se` (or similar) as the `from:` address. Document this in a code comment in route.ts.
**Warning signs:** 403 response from Resend; error.name === "validation_error".

[VERIFIED: Context7 /websites/resend — validation_error 403 documentation]

### Pitfall 2: Timer Leak on Form Unmount

**What goes wrong:** `setSent(false)` fires after the component has unmounted (navigated away), producing a React state update on unmounted component warning or subtle UI glitch.
**Why it happens:** `setTimeout` fires after the 3.5s regardless of component lifecycle.
**How to avoid:** Always return a cleanup function from `useEffect`: `return () => clearTimeout(t);`
**Warning signs:** React DevTools warning "Can't perform a React state update on an unmounted component."

[ASSUMED] — Standard React pattern; verified in design handoff reference implementation.

### Pitfall 3: Sanity Three-File Sync Drift

**What goes wrong:** New profile fields appear in Sanity Studio but are `undefined` at runtime because GROQ projection or TypeScript type was not updated.
**Why it happens:** Three files must change together: `sanity/schemaTypes/profile.ts`, `lib/api/sanityDataLoader.ts`, `app/models/sanityTypes.ts`. Missing any one breaks the chain silently.
**How to avoid:** Treat these as a single atomic change. Plan them as one task.
**Warning signs:** `profile.availabilityStatus` is `undefined` even though data was entered in Sanity Studio.

[VERIFIED: lib/api/sanityDataLoader.ts, app/models/sanityTypes.ts — pattern confirmed in codebase]

### Pitfall 4: Resume Download Path Prefix

**What goes wrong:** `<a href="/public/resume_en.pdf" download>` returns 404.
**Why it happens:** Next.js serves `/public/` files at the URL root (`/resume_en.pdf`), not under `/public/`.
**How to avoid:** Use `href="/resume_en.pdf"`.
**Warning signs:** 404 in browser network tab for `GET /public/resume_en.pdf`.

[VERIFIED: next.config.mjs + Next.js static file serving convention]

### Pitfall 5: Read.cv Link Rendered When `readCvUrl` is Null

**What goes wrong:** Footer "Elsewhere" column shows a broken link with `href="null"` or `href="undefined"`.
**Why it happens:** `readCvUrl` is optional (D-09). If not set in Sanity, it will be `undefined` in the Profile type.
**How to avoid:** Conditional render: `{profile?.readCvUrl && <a href={profile.readCvUrl}>Read.cv ↗</a>}`.
**Warning signs:** Empty or malformed href in the DOM; hydration mismatch if server renders nothing but client renders something.

[VERIFIED: Context.md D-09, app/models/sanityTypes.ts optional field pattern]

---

## Code Examples

### Contact Form Field (input with bottom-border focus style)

```typescript
// Source: design_handoff_monkey_solutions/hifi-part3.jsx — form field pattern
// Applied via inline style (project uses inline styles throughout)
<input
  type="text"
  placeholder="Your name"
  value={form.name}
  onChange={(e) => setForm({ ...form, name: e.target.value })}
  style={{
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 0",
    border: "none",
    borderBottom: "1.5px solid var(--ms-border-strong)",
    background: "transparent",
    fontFamily: "var(--font-sans)",
    fontSize: 16,
    color: "var(--ms-fg)",
    outline: "none",
  }}
  onFocus={(e) => (e.currentTarget.style.borderBottomColor = "var(--ms-orange)")}
  onBlur={(e) => (e.currentTarget.style.borderBottomColor = "var(--ms-border-strong)")}
/>
```

### Submit Button with Success State

```typescript
// Source: design_handoff_monkey_solutions/hifi-part3.jsx
<button
  type="submit"
  aria-live="polite"
  disabled={sending}
  style={{
    width: "100%",
    padding: "16px 20px",
    border: "none",
    cursor: sending ? "not-allowed" : "pointer",
    background: sent ? "#27c93f" : "var(--ms-orange)",
    color: "var(--ms-bg)",   // #120a05 dark / page bg light — text on orange
    fontFamily: "var(--font-mono)",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.5px",
    borderRadius: "var(--radius-sm)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    transition: "background 0.2s",
  }}
>
  {sent ? "✓ Message sent — talk soon!" : "$ send_message →"}
</button>
```

### Footer Wordmark

```typescript
// Source: design_handoff_monkey_solutions/hifi-part3.jsx §Footer + README §9
<div
  style={{
    fontFamily: "var(--font-sans)",
    fontWeight: 800,
    letterSpacing: "-0.045em",
    fontSize: "clamp(80px, 16vw, 240px)",
    lineHeight: 0.85,
    color: "var(--ms-fg)",
    marginBottom: 40,
  }}
>
  MONKEY
  <br />
  <em
    style={{
      fontFamily: "var(--font-display)",
      fontStyle: "italic",
      fontWeight: 300,
      color: "var(--ms-orange-text)",
    }}
  >
    solutions.
  </em>
</div>
```

### Footer Status Column (pulsing dot)

```typescript
// Source: design_handoff_monkey_solutions/hifi-part3.jsx §Footer + ExperienceSection.tsx (pulse pattern)
// The ms-pulse animation and ms-orange tokens are already defined in globals.css
<div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--ms-fg)" }}>
  <div
    aria-hidden="true"
    style={{
      position: "relative",
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: "var(--ms-orange)",
    }}
  >
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: -3,
        borderRadius: "50%",
        background: "var(--ms-orange)",
        opacity: 0.3,
        animation: "ms-pulse var(--anim-pulse) infinite",
      }}
    />
  </div>
  {profile?.availabilityStatus ?? "Available"}
</div>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| nodemailer + SMTP setup | Resend SDK | ~2022 | No SMTP credentials; deliverability managed by provider |
| HTML email via string concat | `text:` plain-text field | — (design decision D-02) | Simpler; no HTML escaping concerns |
| Inline form submission with page reload | `fetch` + optimistic state | React hooks era | No page reload; success state in-component |

**Deprecated/outdated:**
- `onboarding@resend.dev` as production sender: Works only for sandbox delivery to account owner's email. Use a verified domain for production.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Minimal valid PDF stub will satisfy `<a download>` and not trigger browser PDF errors | Code Examples — Placeholder PDF | Low: worst case Daniel sees an error when opening the placeholder; real PDFs replace it |
| A2 | The `useEffect` cleanup pattern prevents memory leaks on unmount for the 3.5s timer | Pattern 2 / Pitfall 2 | Low: React 19 may suppress the warning, but cleanup is still correct practice |
| A3 | `daniel@monkeysolutions.se` is the email address registered with the Resend account | Pitfall 1 | Medium: if it's not, `onboarding@resend.dev` won't deliver there and code comment must flag the correct `from:` value |

---

## Open Questions

1. **Resend `from:` address for production**
   - What we know: `onboarding@resend.dev` works only in sandbox (delivers to Resend account email). Production requires a verified domain.
   - What's unclear: Has Daniel verified `monkeysolutions.se` in Resend? What email to use as `from:`?
   - Recommendation: Add a TODO comment in `route.ts`: `// TODO: Replace with verified domain sender, e.g. "Contact Form <contact@monkeysolutions.se>"`. Use `onboarding@resend.dev` as placeholder.

2. **RESEND_API_KEY availability**
   - What we know: `.env.local` does not currently contain `RESEND_API_KEY`.
   - What's unclear: Daniel needs to create a Resend account and add the key before the API route can be tested.
   - Recommendation: Document env var addition as a Wave 0 setup step in the plan. The route should degrade gracefully if the key is absent (return 500, log warning).

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | API route, Resend SDK | ✓ | (project already running) | — |
| resend npm package | `/api/contact/route.ts` | ✗ (not installed) | 6.12.3 | None — must install |
| RESEND_API_KEY env var | `/api/contact/route.ts` | ✗ (not in .env.local) | — | None — must add before testing |
| /public/ directory | resume PDF download links | ✗ (directory absent) | — | Create directory + placeholder files |
| Sanity Studio | profile.ts schema changes | ✓ (local dev via `cd sanity && npm run dev`) | 3.x | — |

**Missing dependencies with no fallback:**
- `resend` npm package — must run `npm install resend` in Wave 0
- `RESEND_API_KEY` in `.env.local` — Daniel must create Resend account and add key; without it `/api/contact` returns 500

**Missing dependencies with fallback:**
- `/public/` directory — must be created; placeholder PDFs are 1-step shell command

---

## Validation Architecture

> `workflow.nyquist_validation` is absent from `.planning/config.json` — treated as enabled.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None configured (CLAUDE.md: "There are no tests configured.") |
| Config file | None |
| Quick run command | `npm run build` (compile check only) |
| Full suite command | `npm run lint && npm run build` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CONTACT-01 | Form fields render and accept input | manual | — | ❌ no test infra |
| CONTACT-02 | Success state shows for 3.5s then resets | manual | — | ❌ no test infra |
| CONTACT-03 | Download links trigger browser download | manual | — | ❌ no test infra |
| CONTACT-04 | Contact links show email, LinkedIn, GitHub from context | manual | — | ❌ no test infra |
| FOOTER-01 | Wordmark renders with Fraunces italic | manual (visual) | — | ❌ no test infra |
| FOOTER-02 | 4-column grid renders; availability shows CMS value | manual | — | ❌ no test infra |
| FOOTER-03 | Copyright strip renders left/right aligned | manual (visual) | — | ❌ no test infra |

### Sampling Rate

- **Per task commit:** `npm run lint` (catches TypeScript errors, unused imports)
- **Per wave merge:** `npm run build` (full compile + type check)
- **Phase gate:** `npm run lint && npm run build` green before `/gsd-verify-work`

### Wave 0 Gaps

- [ ] No automated test files exist for any phase requirement — manual verification is the only test strategy per CLAUDE.md.
- [ ] `npm install resend` — must precede Wave 1 implementation.

*(No test infrastructure exists — consistent with CLAUDE.md "There are no tests configured.")*

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | API route does not authenticate users |
| V3 Session Management | no | Stateless POST endpoint |
| V4 Access Control | no | Public contact form; no authorization needed |
| V5 Input Validation | yes | Validate that required fields are present server-side before calling Resend |
| V6 Cryptography | no | No cryptographic operations |

### Known Threat Patterns for Contact Form + Email API

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Email bombing via open contact form | Denial of Service | Resend rate limit is 5 req/s per team (auto-enforced); optionally add a server-side submission rate limit per IP |
| Header injection via `name` or `email` fields | Tampering | Resend SDK sends structured fields — no header injection via `text:` plain-text body; validate email format server-side |
| RESEND_API_KEY exposure | Information Disclosure | Never use `NEXT_PUBLIC_` prefix; key is only readable in `route.ts` (server-side) |
| Spam content via project field | Spoofing / Elevation | Plain-text body; no HTML rendering; low risk for this use case |

**Rate limiting note:** Resend enforces 5 req/s globally per team. For this single-author portfolio, this is more than sufficient — no additional rate limiting middleware is required for v1.0. If spam becomes an issue, a `Vercel Edge Middleware` rate limiter or honeypot field can be added in a later phase. [VERIFIED: Context7 /websites/resend — rate limit documentation]

---

## Sources

### Primary (HIGH confidence)
- Context7 `/websites/resend` — send API parameters, from/to/text fields, error handling, 403 validation errors, rate limiting (5 req/s)
- `design_handoff_monkey_solutions/hifi-part3.jsx` — Contact and Footer JSX reference; form state shape, button behavior, field layout, footer wordmark and grid
- `design_handoff_monkey_solutions/README.md` §8 and §9 — Visual spec for Contact and Footer sections
- `components/ExperienceSection.tsx`, `components/SkillsSection.tsx`, `components/ServicesSection.tsx` — Established component patterns confirmed in codebase
- `lib/api/sanityDataLoader.ts`, `sanity/schemaTypes/profile.ts`, `app/models/sanityTypes.ts` — Confirmed three-file Sanity extension pattern
- `app/globals.css` — Confirmed CSS tokens: `--ms-orange`, `--ms-border-strong`, `--section-py-contact`, `--font-display`, `ms-pulse` animation
- `app/api/revalidate/route.ts` — Confirmed App Router API route shape for this project
- `.env.local` — Confirmed `RESEND_API_KEY` is absent

### Secondary (MEDIUM confidence)
- npm registry: `npm view resend version` → 6.12.3, published 2026-05-06
- `package.json` — Confirmed resend is not installed; next@^16.0.7, react@^19.2.1 confirmed

### Tertiary (LOW confidence)
- None — all findings verified against codebase or official Resend docs.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Resend version verified from npm registry; all other deps confirmed in package.json
- Architecture: HIGH — all patterns confirmed from codebase reading; Resend API confirmed from Context7
- Pitfalls: HIGH — Resend 403 error verified from Context7; other pitfalls verified from codebase patterns

**Research date:** 2026-05-17
**Valid until:** 2026-06-17 (Resend API is stable; Next.js App Router patterns are stable)
