# Phase 3: About + Work - Research

**Researched:** 2026-05-10
**Domain:** React/Next.js component authoring, Sanity schema extension, accordion state management
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Project Schema — Sanity (sanity/schemaTypes/project.ts)**
- D-01: Add `overview: text` field to project schema (single summary paragraph for expanded row).
- D-02: Remove existing `body: blockContent` field from project schema. No PortableText renderer needed.
- D-03: Add `kind: string` field to project schema (display label, e.g. "E-commerce · Headless").
- D-04: Category filter derives from `kind` via regex — no separate category field. Regex verbatim: web = `/commerce|web|booking/i`, ios = `/iOS/`, saas = `/SaaS/i`.
- D-05: Project display number (001, 002…) derived from `sortIndex` + zero-padded in component. No new field.
- D-06: Project year comes from `duration.startYear` (already in schema).
- D-07: Add `metrics` array field — array of objects each with `label: string`, `value: string`, `suffix: string`. Max 3.

**Profile Schema — Sanity (sanity/schemaTypes/profile.ts)**
- D-08: Add `aboutBody: text` field to profile schema. Plain text, line breaks = paragraph splits in component.
- D-09: `workingSince` is hardcoded `"2015"` in component — NOT a Sanity field.

**TypeScript Types (app/models/sanityTypes.ts)**
- D-10: Add `ProjectMetric` interface: `{ label: string; value: string; suffix: string }`.
- D-11: Add to `Project`: `overview?: string`, `kind?: string`, `metrics?: ProjectMetric[]`.
- D-12: Add to `Profile`: `aboutBody?: string`.

**GROQ Query (lib/api/sanityDataLoader.ts)**
- D-13: Add `overview`, `kind`, `metrics[]{ label, value, suffix }` to project projection. Add `aboutBody` to profile projection.

**About Section**
- D-14: Portrait placeholder = styled 3:4 box with "DT" in Fraunces italic. Swap for Next.js `<Image>` when `profile.profilePicture` is present.
- D-15: Facts row — Location = `profile.location`, Languages = `profile.languages` joined with " · ", Working since = hardcoded `"2015"`.
- D-16: Sticker badge is decorative and hardcoded. Copy: "↓ hi, nice to meet you". `aria-hidden="true"`.

**Accordion Behavior**
- D-17: Default open state = first project in sorted list (sortIndex 1).

### Claude's Discretion

- Exact Sanity array field definition for `metrics` (whether to use `defineArrayMember` with inline object or define a named `projectMetric` type) — either approach is valid; planner decides.
- Whether to co-locate `AboutSection` and `WorkSection` in a single file or split into separate component files — planner decides based on complexity.
- Sticker badge rotation angle and text content — follow the design handoff.

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ABOUT-01 | Two-column About section with editorial H2 (Fraunces italic accent) and two body paragraphs | AboutSection component; 1fr 1fr grid; H2 spec in UI-SPEC §Typography |
| ABOUT-02 | Right column: 3:4 portrait placeholder with decorative offset border and rotated sticker badge | CSS-only placeholder with `aspect-ratio: 3/4`; offset border via `transform: translate(16px, 16px)` |
| ABOUT-03 | Facts row with location, languages, working-since beneath body copy | Data from `profile.location`, `profile.languages`; "2015" hardcoded |
| WORK-01 | 6 project accordion rows; clicking opens one, closes previous (one-open-at-a-time) | `useState` in WorkSection client component; toggle handler in UI-SPEC §Interaction |
| WORK-02 | Expanded row shows overview, stack pills, metrics card (3 metrics), screenshot placeholder | Expanded panel grid 3-col; badge component for pills; metrics from Sanity |
| WORK-03 | Category filter (all/web/ios/saas) updates visible rows | Filter regex locked in D-04; filter state in WorkSection |
</phase_requirements>

---

## Summary

Phase 3 extends the existing single-page scroll by adding two content sections below HeroSection: `AboutSection` and `WorkSection`. Both sections consume data already available in `GlobalContext` — `profile` and `projects` are already fetched and sorted by the existing data pipeline.

The primary work divides cleanly into four tracks: (1) extend two Sanity schemas (`project` and `profile`) with new fields, (2) update TypeScript types and the GROQ query to surface those fields, (3) build `AboutSection` as a server-friendly client component reading from `GlobalContext`, and (4) build `WorkSection` as a client component with two pieces of React state (active filter + open accordion row). All design tokens, fonts, animation variables, and the badge component are already in place from Phases 1 and 2.

The codebase uses inline `style={}` objects for CSS rather than Tailwind utilities — the Phase 2 pattern in `HeroSection.tsx` is the authoritative style guide to follow. All spacing, color, and typography values are established CSS custom properties (`var(--ms-*)`, `var(--text-*)`, `var(--space-*)`) defined in `globals.css`. No new dependencies are needed for this phase. The `badge` component from shadcn (`components/ui/badge.tsx`) is already installed and used for stack pills.

**Primary recommendation:** Split `AboutSection` and `WorkSection` into separate files (`components/AboutSection.tsx` and `components/WorkSection.tsx`). Both are client components (`"use client"`) because they read from `GlobalContext` via `useContext`. `AboutSection` has no interactive state; `WorkSection` owns two `useState` hooks. Keep `ProjectRow` as an internal function within `WorkSection.tsx` unless it exceeds ~120 lines, at which point extract it.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| About body copy rendering | Frontend (React component) | CMS (Sanity) | Text stored in Sanity, split on newlines into `<p>` tags in component |
| Facts row data (location, languages) | Frontend (React component) | CMS (Sanity profile) | Data already in GlobalContext from server fetch |
| Portrait placeholder / real photo | Frontend (React component) | CDN (Sanity CDN) | CSS placeholder now; `<Image>` + imageUrlBuilder when photo uploaded |
| Project accordion state | Browser (client React state) | — | Open/closed is UI state, not server state |
| Filter state | Browser (client React state) | — | Derived from `kind` field via regex; no server involvement |
| Project data (overview, kind, metrics) | CMS (Sanity) | API (GROQ query) | New fields added to schema, fetched via updated projection |
| Schema extension | CMS (Sanity Studio) | — | `sanity/schemaTypes/project.ts` and `profile.ts` |
| TypeScript types sync | Code (app/models/) | — | Must mirror schema changes |
| GROQ query update | API (`lib/api/sanityDataLoader.ts`) | — | Projection must include new fields |

---

## Standard Stack

### Core (all already installed — no new dependencies)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React `useState` | (Next.js built-in) | Accordion open/closed + active filter state | Native React; no external library needed for two simple state variables |
| Next.js App Router | (existing) | Page composition, `"use client"` directives | Already the project framework |
| `@sanity/client` | (existing) | Schema definitions, GROQ queries | Project's CMS |
| `components/ui/badge.tsx` | (existing shadcn) | Stack pills in expanded project row | Already installed; outline variant matches spec |
| Tailwind CSS | (existing) | Responsive breakpoints (`md:grid-cols-*`) | Already configured; Phase 2 uses `className` for breakpoints + `style={}` for tokens |

[VERIFIED: project codebase inspection — `package.json`, `components/ui/badge.tsx`, `app/globals.css`]

### No New Installs

The UI-SPEC explicitly confirms: "No new shadcn components need to be installed." All primitives needed (badge, CSS animations, design tokens) are pre-established.

[VERIFIED: `03-UI-SPEC.md` §Registry Safety, §Component Inventory]

---

## Architecture Patterns

### System Architecture Diagram

```
Sanity CMS
  └── project schema (add: overview, kind, metrics)
  └── profile schema (add: aboutBody)
         │
         ▼ GROQ fetch (lib/api/sanityDataLoader.ts — updated projection)
         │
         ▼ app/page.tsx (server component, force-dynamic)
         │  loadSanityData() → DataHydrator → GlobalContext
         │
         ├──► AboutSection.tsx ("use client")
         │      useContext(GlobalContext) → profile
         │      Renders: H2, body paragraphs, facts row, portrait placeholder
         │      No state needed
         │
         └──► WorkSection.tsx ("use client")
                useContext(GlobalContext) → projects (pre-sorted by sortIndex)
                useState: filter ('all'|'web'|'ios'|'saas')
                useState: openId (string | null — default first project._id)
                Renders: filter control, project list (filtered)
                  └──► ProjectRow (internal or extracted)
                         Collapsed: number, name, kind, year, arrow
                         Expanded: overview, stack pills, meta strip, metrics card, screenshot placeholder
```

### Recommended Project Structure

```
components/
├── AboutSection.tsx       # New — "use client", reads profile from GlobalContext
├── WorkSection.tsx        # New — "use client", owns filter+openId state
├── HeroSection.tsx        # Existing — reference for style pattern
├── SiteHeader.tsx         # Existing — #about and #work links already present
└── ui/
    └── badge.tsx          # Existing — used for stack pills

app/
├── page.tsx               # Add <AboutSection /> and <WorkSection /> below <HeroSection />
├── models/
│   └── sanityTypes.ts     # Add ProjectMetric, extend Project and Profile

lib/api/
└── sanityDataLoader.ts    # Update GROQ project + profile projections

sanity/schemaTypes/
├── project.ts             # Add overview, kind, metrics; remove body
└── profile.ts             # Add aboutBody
```

### Pattern 1: "use client" with GlobalContext (established in Phase 2)

**What:** Components that need Sanity data mark themselves `"use client"` and call `useContext(GlobalContext)`. The data has already been fetched server-side and hydrated.

**When to use:** Any component that reads `profile`, `projects`, or other Sanity data at render time.

```typescript
// Source: components/HeroSection.tsx (Phase 2 reference)
"use client";
import { useContext } from "react";
import GlobalContext from "@/app/context/GlobalContext";

export default function AboutSection() {
  const ctx = useContext(GlobalContext);
  const profile = ctx?.profile ?? null;
  // render using profile.location, profile.languages, profile.aboutBody
}
```

[VERIFIED: `components/HeroSection.tsx` lines 1-4, `app/context/GlobalContext.tsx`]

### Pattern 2: Inline style objects with CSS custom properties (established in Phase 2)

**What:** The codebase uses `style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)" }}` rather than Tailwind utilities for design-token values. Tailwind is used only for responsive breakpoint classes (`md:grid-cols-*`).

**When to use:** Every styled element. Tokens come from `app/globals.css` `:root` block.

```typescript
// Source: components/HeroSection.tsx (Phase 2 pattern)
<h2 style={{
  fontFamily: "var(--font-sans)",
  fontSize: "var(--text-h2)",         // clamp(36px, 5vw, 88px) — NOTE: UI-SPEC specifies clamp(36px, 4.5vw, 64px) for About/Work H2
  fontWeight: 400,
  letterSpacing: "-0.035em",
  lineHeight: 1.02,
  color: "var(--ms-fg)",
}}>
```

[VERIFIED: `components/HeroSection.tsx`, `app/globals.css`]

**Important discrepancy:** `globals.css` declares `--text-h2: clamp(36px, 5vw, 88px)` but the UI-SPEC and hifi specify `clamp(36px, 4.5vw, 64px)` for About/Work H2. The planner must decide: use the token (which renders larger) or hardcode the spec value. The hifi and UI-SPEC both use the smaller clamp. Recommendation: hardcode `clamp(36px, 4.5vw, 64px)` inline, consistent with Phase 2 precedent of hardcoding off-token values.

### Pattern 3: Accordion with single-open constraint

**What:** `WorkSection` tracks one open row ID. Clicking the same row closes it (toggle). Clicking a different row opens it and implicitly closes the previous (by overwriting `openId`).

**When to use:** Any exclusive-open accordion. This is simpler than a generic accordion library.

```typescript
// Source: 03-UI-SPEC.md §Accordion Behavior — State Contract
"use client";
import { useState, useContext, useMemo } from "react";
import GlobalContext from "@/app/context/GlobalContext";

export default function WorkSection() {
  const ctx = useContext(GlobalContext);
  const projects = ctx?.projects ?? [];

  const firstId = projects[0]?._id ?? null;   // projects already sorted by sortIndex in GlobalContext
  const [filter, setFilter] = useState<'all' | 'web' | 'ios' | 'saas'>('all');
  const [openId, setOpenId] = useState<string | null>(firstId);

  const shown = useMemo(() => projects.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'web') return /commerce|web|booking/i.test(p.kind ?? '');
    if (filter === 'ios') return /iOS/.test(p.kind ?? '');
    if (filter === 'saas') return /SaaS/i.test(p.kind ?? '');
    return true;
  }), [projects, filter]);

  // When filter changes, collapse open row if it's no longer in the filtered set
  const handleFilterChange = (f: typeof filter) => {
    setFilter(f);
    const stillVisible = projects.some(p => {
      if (f === 'all') return p._id === openId;
      if (f === 'web') return /commerce|web|booking/i.test(p.kind ?? '') && p._id === openId;
      if (f === 'ios') return /iOS/.test(p.kind ?? '') && p._id === openId;
      if (f === 'saas') return /SaaS/i.test(p.kind ?? '') && p._id === openId;
      return false;
    });
    if (!stillVisible) setOpenId(null);
  };
  // ...
}
```

[VERIFIED: `03-UI-SPEC.md` §Accordion Behavior — State Contract]

### Pattern 4: Sanity schema extension with defineArrayMember + inline object

**What:** For the `metrics` array field, use `defineArrayMember` with an inline `object` type containing three string fields. This avoids creating a standalone named type and keeps the definition local to `project.ts`. A named type (`projectMetric`) is valid but adds indirection for a simple three-field structure.

```typescript
// Source: sanity/schemaTypes/project.ts pattern extended from existing `tags` field
defineField({
  name: 'metrics',
  title: 'Metrics',
  type: 'array',
  validation: Rule => Rule.max(3),
  of: [
    defineArrayMember({
      type: 'object',
      fields: [
        defineField({ name: 'label', title: 'Label', type: 'string' }),
        defineField({ name: 'value', title: 'Value', type: 'string' }),
        defineField({ name: 'suffix', title: 'Suffix', type: 'string' }),
      ],
    }),
  ],
}),
```

[VERIFIED: existing `project.ts` uses `defineArrayMember` for `tags` field — same pattern]

### Pattern 5: Zero-padding project display number

**What:** `sortIndex` (number 1–6) is formatted as "001", "002"… in the component.

```typescript
// Source: 03-CONTEXT.md D-05; hifi-part2.jsx PROJECTS array
const displayNumber = String(p.sortIndex).padStart(3, '0');
```

[VERIFIED: hifi-part2.jsx — PROJECTS array uses literal `n: '001'` as display value]

### Pattern 6: Portrait placeholder — CSS only, conditional Image

**What:** While `profile.profilePicture` is absent, render a CSS-striped box with "DT" centered. When `profile.profilePicture._ref` is truthy, render `<Image>` via `imageUrlBuilder`.

```typescript
// Source: 03-CONTEXT.md D-14; app/utilities/imageUrlBuilder.ts
{profile?.profilePicture?._ref ? (
  <Image
    src={buildImageUrlFor(sanityConfig, profile.profilePicture._ref)}
    alt="Daniel Trochez"
    fill
    style={{ objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
  />
) : (
  <div style={{
    aspectRatio: '3/4',
    background: 'repeating-linear-gradient(45deg, var(--ms-bg-alt) 0 10px, var(--ms-surface) 10px 11px)',
    border: '1px solid var(--ms-border)',
    borderRadius: 'var(--radius-sm)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--ms-fg-faint)' }}>DT</span>
  </div>
)}
```

[VERIFIED: `app/utilities/imageUrlBuilder.ts`, `03-CONTEXT.md D-14`, `03-UI-SPEC.md §About — Right Column`]

### Anti-Patterns to Avoid

- **Installing a third-party accordion library (Radix, headlessui, etc.):** The design is a bespoke 5-column grid row, not a standard disclosure widget. A library forces markup constraints. Use `useState` + `<button aria-expanded>` directly.
- **Fetching data in `WorkSection` or `AboutSection` directly:** Data is already in GlobalContext. Do not introduce `useEffect` + `fetch` — this is the architecture's design invariant.
- **Using `profile.description` (blockContent) for the About body:** `description` is a PortableText field requiring a renderer. `aboutBody` (new `text` field) renders as plain string. Split on `\n` to produce paragraph elements.
- **Hardcoding project data in the component:** All 6 projects come from Sanity/GlobalContext. The hifi PROJECTS array is reference data only — do not copy it into the component.
- **Using `--text-h2` token directly:** The token value (`clamp(36px, 5vw, 88px)`) differs from the spec (`clamp(36px, 4.5vw, 64px)`). Hardcode the spec value to match the design.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Stack pill chips | Custom pill component | `<Badge variant="outline">` from `components/ui/badge.tsx` | Already styled with design tokens; `outline` variant provides correct border + text coloring |
| Image URL construction from Sanity image ref | String concatenation | `buildImageUrlFor()` from `app/utilities/imageUrlBuilder.ts` | Handles CDN transforms, format negotiation, error cases |
| Sort order of projects | Re-sort in component | Use `ctx.projects` directly — already sorted by `sortIndex` in `GlobalContext.tsx` | Sorting happens once in `setSiteContentToContext`; re-sorting wastes cycles |
| Animation keyframe | Custom CSS | Use existing `ms-fadein` keyframe declared in `globals.css` | `animation: 'ms-fadein var(--anim-fadein)'` — already defined |

**Key insight:** This phase is purely additive UI and schema work. The data pipeline, styling system, and component primitives are already in place. The job is wiring, not plumbing.

---

## Common Pitfalls

### Pitfall 1: `useContext` returning `null` before hydration
**What goes wrong:** `GlobalContext` is initialized to `null` (`createContext<ContextType | null>(null)`). If a component calls `ctx.profile` without a null check, it throws on first render.
**Why it happens:** `DataHydrator` runs `setSiteContentToContext` after mount, so the initial render has `ctx === null`.
**How to avoid:** Always guard: `const ctx = useContext(GlobalContext); const profile = ctx?.profile ?? null;` — same pattern as HeroSection.tsx line 24-25.
**Warning signs:** Uncaught TypeError at runtime; works in Storybook but breaks on page load.

[VERIFIED: `app/context/GlobalContext.tsx` line 19; `components/HeroSection.tsx` lines 24-25]

### Pitfall 2: Filter regex case sensitivity on `kind`
**What goes wrong:** `/iOS/` (case-sensitive, no `i` flag) must match exactly. If Sanity content has "ios" or "IOS" instead of "iOS", the filter silently returns no results.
**Why it happens:** The hifi uses case-sensitive `/iOS/` intentionally to distinguish iOS from the word "ios" in other kinds.
**How to avoid:** Copy the regex verbatim from the spec. Instruct Daniel to enter `kind` values exactly matching the PROJECTS hifi (e.g., "iOS · Education", not "ios · Education").
**Warning signs:** iOS filter pill returns empty even when iOS projects exist.

[VERIFIED: `hifi-part2.jsx` lines 159-165; `03-CONTEXT.md D-04`]

### Pitfall 3: `aboutBody` text field — rendering paragraph breaks
**What goes wrong:** Sanity `text` type preserves newline characters. If rendered directly as `{profile.aboutBody}`, line breaks are lost (HTML collapses whitespace).
**Why it happens:** HTML ignores `\n` in text content.
**How to avoid:** Split on `\n\n` (double newline = paragraph break): `profile.aboutBody?.split('\n\n').map((para, i) => <p key={i}>{para}</p>)`. For single `\n`, use `white-space: pre-wrap` or split on `\n`.
**Warning signs:** Body copy renders as a single run-on block with no paragraph separation.

[ASSUMED — standard Sanity `text` field behavior. No official Sanity doc checked specifically for newline character behavior in the current editor version.]

### Pitfall 4: `body` field removal from project schema — existing data
**What goes wrong:** Removing `body: blockContent` from the Sanity schema while existing project documents have `body` data does not delete that data. Sanity keeps unknown fields. But the TypeScript type will no longer have `body`, so any code that accessed `project.body` will type-error.
**Why it happens:** Sanity is schema-on-write; removing a field from the schema doesn't migrate existing data.
**How to avoid:** Remove `body` from the schema file AND from the `Project` TypeScript interface simultaneously. Existing Sanity documents retain the data silently — this is fine since no UI code will render it.
**Warning signs:** TypeScript errors on `project.body` access after the type is updated.

[VERIFIED: `sanity/schemaTypes/project.ts` line 55 shows `body: blockContent` exists; `app/models/sanityTypes.ts` line 47 shows `body: WorkDescriptionBlock[]`]

### Pitfall 5: GROQ projection — new fields not included = `undefined` in components
**What goes wrong:** Adding fields to the Sanity schema does NOT automatically include them in the GROQ response. If `overview`, `kind`, and `metrics` are not added to the project projection in `sanityDataLoader.ts`, components get `undefined` for those fields.
**Why it happens:** The query uses explicit field projections (`_type == 'project' => { sortIndex, title, ... }`).
**How to avoid:** Update the `query` string in `lib/api/sanityDataLoader.ts` to include all new fields. Also add `aboutBody` to the profile projection.
**Warning signs:** Component renders without overview text or metrics; TypeScript allows it because fields are `optional`.

[VERIFIED: `lib/api/sanityDataLoader.ts` lines 35-44 — projection is explicit]

### Pitfall 6: Default open state race condition
**What goes wrong:** `useState(firstId)` initializes with `firstId = projects[0]?._id ?? null`. But at mount time, `projects` is `null` (pre-hydration), so `firstId` is always `null`. The default-open state never activates.
**Why it happens:** `useState` initial value is evaluated once — at first render when context is empty.
**How to avoid:** Initialize with `null` and use a `useEffect` to set `openId` to the first project once `projects` becomes available:
```typescript
const [openId, setOpenId] = useState<string | null>(null);
useEffect(() => {
  if (projects && projects.length > 0 && openId === null) {
    setOpenId(projects[0]._id);
  }
}, [projects]);
```
This ensures the default-open behavior applies after hydration without overwriting user interaction.
**Warning signs:** First project never opens by default; accordion starts fully collapsed.

[VERIFIED: `app/context/GlobalContext.tsx` — state initializes to `null`; `components/HeroSection.tsx` pattern shows `ctx?.profile ?? null` null-guard]

### Pitfall 7: `SanityClientConfig` needed for `imageUrlBuilder` in client component
**What goes wrong:** `buildImageUrlFor()` requires a `SanityClientConfig` object. In a client component, env vars must be `NEXT_PUBLIC_*` to be available. `SANITY_PROJECT_ID` (no `NEXT_PUBLIC_` prefix) is not available in client-side code.
**Why it happens:** Non-public env vars are server-only.
**How to avoid:** The portrait placeholder conditional is "CSS now, swap in `<Image>` when photo is available" (D-14). When the real photo is implemented, use `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` (may require adding these env vars), OR pass the built image URL as a prop from a server component. For now, since `profile.profilePicture` is not yet populated, the placeholder branch will always render — defer this issue to when Daniel uploads the photo.
**Warning signs:** `process.env.SANITY_PROJECT_ID` is `undefined` in browser console.

[VERIFIED: `app/utilities/imageUrlBuilder.ts`; `.env` file naming in CLAUDE.md — `SANITY_PROJECT_ID` has no `NEXT_PUBLIC_` prefix]

---

## Code Examples

Verified patterns from official sources and codebase inspection:

### Kicker component (reusable inline pattern)

```typescript
// Source: design_handoff_monkey_solutions/hifi-part1.jsx — Kicker function
// Pattern: flex row, orange number, horizontal rule, uppercase label
<div style={{ display: 'flex', alignItems: 'center', gap: 12,
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-mono)',
              color: 'var(--ms-fg-soft)', letterSpacing: 1 }}>
  <span style={{ color: 'var(--ms-orange-text)', fontWeight: 600 }}>01</span>
  <span aria-hidden="true" style={{ width: 28, height: 1, background: 'var(--ms-border-strong)' }} />
  <span style={{ textTransform: 'uppercase' }}>ABOUT</span>
</div>
```

### About section outer shell

```typescript
// Source: hifi-part1.jsx About() + 03-UI-SPEC.md §Layout
<section id="about" style={{
  padding: 'var(--section-py) var(--page-px)',
  background: 'var(--ms-bg-alt)',
  borderTop: '1px solid var(--ms-border)',
  borderBottom: '1px solid var(--ms-border)',
}}>
  <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>
    {/* Kicker */}
    <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 72, marginTop: 36 }}>
      {/* left: H2 + body + facts */}
      {/* right: portrait placeholder + sticker */}
    </div>
  </div>
</section>
```

### Project row collapsed button

```typescript
// Source: hifi-part2.jsx ProjectRow()
<button
  onClick={onToggle}
  aria-expanded={open}
  aria-controls={`project-panel-${p._id}`}
  style={{
    all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
    padding: '24px 4px',
    display: 'grid',
    gridTemplateColumns: '56px 1.2fr 1fr 80px 28px',
    gap: 20,
    alignItems: 'center',
  }}
>
  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-mono)', color: 'var(--ms-fg-faint)', letterSpacing: 0.5 }}>
    {String(p.sortIndex).padStart(3, '0')}
  </span>
  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ms-fg)' }}>
    {p.title}
  </span>
  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-mono)', color: 'var(--ms-fg-soft)', letterSpacing: 0.3 }}>
    {p.kind}
  </span>
  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-mono)', color: 'var(--ms-fg-faint)', textAlign: 'right' }}>
    {p.duration?.startYear}
  </span>
  <span style={{
    fontFamily: 'var(--font-mono)', fontSize: 'var(--text-mono)', textAlign: 'center',
    color: open ? 'var(--ms-orange-text)' : 'var(--ms-fg-soft)',
    transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
    transition: 'transform var(--anim-chevron), color var(--anim-hover)',
    display: 'inline-block',
  }}>→</span>
</button>
```

### Metrics card

```typescript
// Source: hifi-part2.jsx ProjectRow expanded panel — right column
<div style={{
  border: '1px solid var(--ms-border)',
  borderRadius: 'var(--radius-lg)',
  padding: 'var(--space-9)',
  background: 'var(--ms-surface)',
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 'var(--space-7)',
}}>
  {(p.metrics ?? []).map(({ label, value, suffix }) => (
    <div key={label}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-mono)', color: 'var(--ms-fg-faint)', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
      <div style={{ marginTop: 'var(--space-3)', fontFamily: 'var(--font-sans)', fontSize: 28, fontWeight: 400, letterSpacing: '-0.02em', color: 'var(--ms-orange-text)', lineHeight: 1 }}>{value}</div>
      {suffix && <div style={{ marginTop: 4, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-mono)', color: 'var(--ms-fg-soft)' }}>{suffix}</div>}
    </div>
  ))}
  {/* Screenshot placeholder */}
  <div aria-hidden="true" style={{ gridColumn: '1 / -1', marginTop: 8, height: 180, borderRadius: 'var(--radius-sm)',
    background: 'repeating-linear-gradient(45deg, var(--ms-bg-alt) 0 10px, var(--ms-surface) 10px 11px)',
    border: '1px solid var(--ms-border)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'var(--font-mono)', fontSize: 'var(--text-mono)', color: 'var(--ms-fg-faint)', letterSpacing: 1 }}>
    [{p.title.toUpperCase()} · SCREENSHOT]
  </div>
</div>
```

### Updated GROQ projections

```typescript
// Source: lib/api/sanityDataLoader.ts — updated project and profile projections
// Project projection additions (D-13):
_type == 'project' => {
  sortIndex,
  title,
  coverImage,
  duration,
  client,
  site,
  tags,
  // body field REMOVED (D-02)
  overview,
  kind,
  "metrics": metrics[]{ label, value, suffix }
}

// Profile projection addition (D-13):
_type == 'profile' => {
  profilePicture,
  description,
  languages,
  mobile,
  email,
  location,
  personalitySkills,
  professionalSkills,
  linkedInUrl,
  githubUrl,
  heroBio,
  aboutBody
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Separate accordion library (Radix Accordion) | Custom `useState` + `<button aria-expanded>` | Design decision (Phase 3) | Simpler, no markup constraints, bespoke grid layout preserved |
| PortableText for project body | Plain `text` field for `overview` | D-02 (Phase 3) | Eliminates need for `@portabletext/react` renderer in this component |

**Deprecated/outdated in this phase:**
- `project.body: blockContent` — replaced by `project.overview: text`. The field is removed from the schema (D-02) and from the TypeScript type (D-11). Existing Sanity documents retain the raw data.
- `project.tags: string[]` — still exists in schema but NOT shown in the accordion UI. The expanded row uses `stack` pills driven by the same `tags` field. Verify: the hifi uses a separate `stack` array while the existing schema has `tags`. The planner should confirm: **are `tags` and `stack` the same field?** The CONTEXT.md does not address this. The hifi PROJECTS array has `stack: ['Next.js 14', 'Sanity', ...]` while the schema has `tags`. This is an open question.

---

## Open Questions (RESOLVED)

1. **`tags` vs `stack` field for stack pills** — RESOLVED: Treat `tags: string[]` as the stack field. No new `stack` field is needed. Plans use `p.tags` for Badge pills in the expanded row. Studio field title updated to "Tech Stack" for clarity. Confirmed in PATTERNS.md Key Decisions.
   - What we know: The existing `project` schema has `tags: string[]`. The hifi-part2.jsx PROJECTS array has a `stack: string[]` field used for the pills in the expanded row.
   - Resolution: `tags` is the stack data under a different name; no new schema field required.

2. **`aboutBody` content delivery before phase completion** — RESOLVED: Hardcode hifi copy as fallback when `profile.aboutBody` is falsy. Matches Phase 2 precedent for `heroBio`. Confirmed in PATTERNS.md Key Decisions.
   - What we know: `aboutBody` is a new text field Daniel must populate in Sanity Studio.
   - Resolution: Component renders hardcoded hifi paragraphs when `profile.aboutBody` is null/empty.

3. **`SanityClientConfig` for `imageUrlBuilder` in client component** — RESOLVED: Defer image implementation per D-14. Portrait renders as CSS placeholder unconditionally for this phase. A TODO comment marks the location for future `<Image>` integration when Daniel uploads the photo. Confirmed in PATTERNS.md Key Decisions.

---

## Environment Availability

Step 2.6: SKIPPED (no external dependencies — phase is pure code and Sanity schema changes, no new CLI tools or services required).

---

## Validation Architecture

`workflow.nyquist_validation` is absent from `.planning/config.json` — treated as enabled.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None configured |
| Config file | Not present — see Wave 0 |
| Quick run command | `npm run build` (type-check + lint via build) |
| Full suite command | `npm run lint && npm run build` |

Note: CLAUDE.md explicitly states "There are no tests configured." The project has no test runner. The primary validation mechanism is TypeScript compilation + ESLint.

[VERIFIED: `CLAUDE.md` §Commands — no test script; `package.json` not read but CLAUDE.md is authoritative]

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | Notes |
|--------|----------|-----------|-------------------|-------|
| ABOUT-01 | Two-column About with H2 renders | Visual / build | `npm run build` | TSC catches type errors; visual verified in browser |
| ABOUT-02 | Portrait placeholder with offset border | Visual | `npm run build` | No automated UI test possible without test framework |
| ABOUT-03 | Facts row renders with profile data | Build + manual | `npm run build` | Verify `profile.location` and `profile.languages` appear |
| WORK-01 | Accordion opens one row at a time | Manual interactive | `npm run dev` then click | No test framework; manual in browser |
| WORK-02 | Expanded row shows all elements | Manual visual | `npm run dev` then expand | Screenshot comparison not automated |
| WORK-03 | Category filter updates visible rows | Manual interactive | `npm run dev` then filter | Filter regex logic is simple — verify all 4 categories |

### Sampling Rate

- **Per task commit:** `npm run build` — verifies TypeScript and no import errors
- **Per wave merge:** `npm run lint && npm run build`
- **Phase gate:** `npm run lint && npm run build` green before `/gsd-verify-work`

### Wave 0 Gaps

No test infrastructure to create — project has no test runner by design.

---

## Security Domain

This phase involves no authentication, no user input, no form submission, and no secrets handling. Data flows server → GlobalContext → read-only components.

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | — |
| V3 Session Management | No | — |
| V4 Access Control | No | — |
| V5 Input Validation | No | No user input in this phase |
| V6 Cryptography | No | — |

No threat patterns apply to Phase 3 — it is a read-only rendering phase.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Sanity `text` field preserves `\n` characters in fetched data | Common Pitfalls — Pitfall 3 | If Sanity normalizes newlines differently, paragraph splitting logic breaks |
| A2 | `tags` and `stack` are the same data (tags = stack pills) | Open Questions #1 | If separate, a new `stack` field must be added to schema — unplanned work |
| A3 | Hardcoded hifi copy is acceptable fallback when `aboutBody` is empty | Open Questions #2 | If Daniel wants no fallback, component must handle empty state differently |

---

## Sources

### Primary (HIGH confidence)
- **Codebase inspection** — `app/models/sanityTypes.ts`, `lib/api/sanityDataLoader.ts`, `app/context/GlobalContext.tsx`, `components/HeroSection.tsx`, `app/globals.css`, `components/ui/badge.tsx`, `sanity/schemaTypes/project.ts`, `sanity/schemaTypes/profile.ts`, `sanity/schemaTypes/index.ts`, `app/utilities/imageUrlBuilder.ts`, `app/page.tsx`
- **`.planning/phases/03-about-work/03-CONTEXT.md`** — Locked decisions D-01 through D-17
- **`.planning/phases/03-about-work/03-UI-SPEC.md`** — Complete visual/interaction contract
- **`design_handoff_monkey_solutions/hifi-part1.jsx`** — About section JSX reference
- **`design_handoff_monkey_solutions/hifi-part2.jsx`** — Work section JSX reference, PROJECTS data structure, filter regex

### Secondary (MEDIUM confidence)
- **`.planning/REQUIREMENTS.md`** — Phase 3 requirements ABOUT-01 through WORK-03
- **`.planning/STATE.md`** — Project history and phase status

### Tertiary (LOW confidence)
- Sanity `text` field newline behavior — [ASSUMED] from general knowledge of how Sanity text fields work

---

## Metadata

**Confidence breakdown:**
- Schema changes: HIGH — existing schema files read, pattern is clear
- TypeScript types: HIGH — existing types file read, additions are additive
- GROQ query update: HIGH — existing query read, projection pattern is clear
- Component architecture: HIGH — Phase 2 component pattern fully verified
- Accordion state logic: HIGH — spec is exact (state contract in UI-SPEC)
- Filter regex: HIGH — copied verbatim from hifi-part2.jsx
- Styling values: HIGH — globals.css and UI-SPEC cross-referenced
- `tags` vs `stack` field: LOW — open question, not resolved in CONTEXT.md

**Research date:** 2026-05-10
**Valid until:** 2026-06-10 (stable tech stack, tokens pre-established)
