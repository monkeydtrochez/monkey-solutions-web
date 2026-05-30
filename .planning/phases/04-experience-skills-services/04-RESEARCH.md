# Phase 4: Experience, Skills + Services — Research

**Researched:** 2026-05-10
**Domain:** Next.js App Router / Sanity CMS / React / Tailwind CSS design tokens
**Confidence:** HIGH

---

## Summary

Phase 4 delivers three read-only content sections — ExperienceSection, SkillsSection, and
ServicesSection — wired into the existing Next.js App Router / GlobalContext / Sanity stack
established in Phases 1–3. The work splits into two distinct tracks:

**Track A — Data layer surgery.** The Sanity `workExperience` schema is missing `company`
and `current` fields. The `education` schema is missing `fieldOfStudy`. The GROQ projection
in `sanityDataLoader.ts` does not yet request these new fields. The `Education` type in
`sanityTypes.ts` is a single object in `GlobalContext` but must become an array (same
pattern as `workExperience`). All four files need coordinated edits before any component
can render real data.

**Track B — Component assembly.** Three new components use only pre-established design
tokens, CSS variables, keyframes, and layout patterns — no new dependencies, no new shadcn
installs, no new token declarations. `ExperienceSection` is a client component (reads
GlobalContext); `SkillsSection` and `ServicesSection` are server components (hardcoded
static data). The `badge` component (already installed, outline variant) is reused for
service card stack chips.

**Primary recommendation:** Execute Track A first (schema → types → GROQ → GlobalContext),
then implement Track B components against the updated data contracts. This ordering prevents
type errors from cascading into component work.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Add `company: string` field to `workExperience` schema.
- **D-02:** Add `current: boolean` field to `workExperience` schema. Do NOT derive from `duration.endYear`.
- **D-03:** Do NOT add a `location` field to `workExperience` — not displayed.
- **D-04:** Update GROQ projection for `workExperience` to include `company` and `current`.
- **D-05:** Update `WorkExperience` TypeScript interface to add `company?: string` and `current?: boolean`.
- **D-06:** Render `workExperience.description` (blockContent) as plain text via `block.children.map(c => c.text).join('')` — no block renderer library.
- **D-07:** Change `education: Education | null` to `Education[] | null` in GlobalContext; use `.filter()` not `.find()`.
- **D-08:** Add `fieldOfStudy: string` field to `education` schema (optional, render detail line only if present).
- **D-09:** Update GROQ projection for `education` to include `fieldOfStudy`.
- **D-10:** Update `Education` TypeScript interface to add `fieldOfStudy?: string`. Keep existing `start`/`end` field names.
- **D-11:** Skills proficiency data hardcoded as static arrays in `SkillsSection.tsx` (placeholder values from UI-SPEC).
- **D-12:** Community rows hardcoded as static strings from UI-SPEC copywriting contract.
- **D-13:** Service card content hardcoded as static strings from UI-SPEC `### Service Card Definitions` section.

### Claude's Discretion

- Whether to extract skill group constant data into a separate `lib/skills.ts` constants file or inline as a static array inside `SkillsSection.tsx`.
- Exact Sanity `defineField` wording for `company` and `current` fields (description text, validation rules).

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.

</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| EXP-01 | Experience timeline: vertical line, 4 entries, orange pulse glow for current role | UI-SPEC timeline layout, `ms-pulse` keyframe already in globals.css, `--ms-orange` / `--ms-orange-dim` tokens confirmed present |
| EXP-02 | Education list: degree title, institution, years, detail line per entry | `education` schema + GlobalContext fix (D-07–D-10); `start`/`end` fields confirmed as year strings |
| EXP-03 | "Also / Community" sub-section: 3 activity rows below education list | Hardcoded static strings from UI-SPEC (D-12); no Sanity dependency |
| SKILLS-01 | 4 skill groups with labeled 10-segment proficiency bars | Hardcoded static data (D-11); pure CSS segments via design tokens; no third-party chart library |
| SVC-01 | 2×2 service card grid: title, description, stack chips | Hardcoded static strings (D-13); `badge` outline variant already installed |
| SVC-02 | Service cards: decorative giant Fraunces number, orange border on hover | Fraunces font via `--font-display` confirmed; `--ms-orange` border via CSS transition `--anim-hover` 0.2s |

</phase_requirements>

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Schema field additions (company, current, fieldOfStudy) | Sanity Studio (schema config) | — | Schema is source of truth; changes propagate to CMS UI and data API |
| GROQ projection updates | API / Backend (sanityDataLoader.ts) | — | Server-side data fetch; projects fields from Sanity to app |
| TypeScript interface updates | API / Backend (sanityTypes.ts) | Frontend Server | Types shared across server and client; must stay in sync with GROQ output |
| GlobalContext education fix | Frontend Server (context) | Browser / Client | Context runs in client components; the fix is a data reshape before storage |
| ExperienceSection rendering | Browser / Client | — | Reads GlobalContext — requires `"use client"` |
| SkillsSection rendering | Frontend Server (RSC) | — | Hardcoded data; no useContext; can be server component |
| ServicesSection rendering | Frontend Server (RSC) | — | Hardcoded data; no useContext; can be server component |
| Timeline pulse animation | Browser / Client | — | CSS animation running in browser; keyframe already declared in globals.css |
| Service card hover interaction | Browser / Client | — | CSS transition — handled at stylesheet level, no JS required |

---

## Standard Stack

### Core (all pre-established — no new installs)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js App Router | 15.x (existing) | Page structure, RSC/client component split | Already in use; page.tsx is the composition root |
| React | 19.x (existing) | `useContext` for ExperienceSection | Pre-established; GlobalContext pattern proven in Phases 2–3 |
| Sanity SDK (`@sanity/client`) | existing | GROQ fetch in sanityDataLoader.ts | Pre-established; all data flows through this client |
| Tailwind CSS | v4.x (existing) | Utility classes where used; tokens via CSS vars | Pre-established; all spacing/color tokens declared |
| shadcn/ui `badge` | already installed | Outline variant for service card stack chips | Already installed per UI-SPEC; no new install |

[VERIFIED: codebase grep — package.json and components/ui/badge.tsx exist]

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `sanity` (defineField, defineType) | existing in /sanity | Schema definitions | Only for schema files in /sanity directory |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS var() inline styles | Tailwind utility classes | Both work; existing components mix both; follow per-component precedent |
| Hardcoded skills data inline | `lib/skills.ts` constants file | Claude's discretion — see Open Questions |
| badge component for chips | Custom styled span | badge already installed; use it |

**Installation:** None required. All dependencies pre-exist.

---

## Architecture Patterns

### System Architecture Diagram

```
Sanity CMS (cloud)
  └─ workExperience docs (company*, current*, sortIndex, duration, description)
  └─ education docs (title, school, start, end, fieldOfStudy*)
       * = new fields added in Phase 4
         │
         ▼
lib/api/sanityDataLoader.ts (GROQ fetch — server)
  └─ updated projection: + company, current (workExperience)
  └─ updated projection: + fieldOfStudy (education)
         │
         ▼
app/api/sanity-data/route.ts → app/page.tsx (server component)
         │
         ▼
GlobalContext (client)
  └─ workExperience: WorkExperience[] | null  [already array]
  └─ education: Education[] | null            [fixed in Phase 4: find → filter]
         │
    ┌────┴──────────────────────────┐
    ▼                               ▼
ExperienceSection.tsx        SkillsSection.tsx / ServicesSection.tsx
("use client" — useContext)  (server components — static data)
    │
    ├─ Timeline (workExperience[])
    ├─ Education list (education[])
    └─ Community rows (hardcoded)
         │
         ▼
app/page.tsx <main> (after <WorkSection />)
  <ExperienceSection />
  <SkillsSection />
  <ServicesSection />
```

### Recommended Project Structure

```
components/
├── ExperienceSection.tsx   # "use client" — timeline + education + community
├── SkillsSection.tsx       # server component — 4-group skills bars (static)
├── ServicesSection.tsx     # server component — 2×2 card grid (static)
sanity/schemaTypes/
├── workExperience.ts       # add company + current fields
├── education.ts            # add fieldOfStudy field
app/models/
├── sanityTypes.ts          # update WorkExperience + Education interfaces
app/context/
├── GlobalContext.tsx        # fix education: Education | null → Education[] | null
lib/api/
├── sanityDataLoader.ts     # update GROQ projections
app/
├── page.tsx                # add <ExperienceSection />, <SkillsSection />, <ServicesSection />
```

### Pattern 1: Client Component Reading GlobalContext

Established in Phases 2–3. `ExperienceSection` follows this exact pattern.

```typescript
// Source: components/AboutSection.tsx (verified in codebase)
"use client";
import { useContext } from "react";
import GlobalContext from "@/app/context/GlobalContext";

export default function ExperienceSection() {
  const ctx = useContext(GlobalContext);
  const workExperience = ctx?.workExperience ?? [];
  const education = ctx?.education ?? [];   // after D-07 fix: Education[] | null
  // render...
}
```

[VERIFIED: codebase — AboutSection.tsx lines 1-8, WorkSection.tsx lines 1-21]

### Pattern 2: blockContent Plain-Text Rendering

Established in Phase 3 (WorkSection.tsx). Used for `workExperience.description`.

```typescript
// Source: components/WorkSection.tsx lines 299-312 (verified in codebase)
p.body
  .map((block) => block.children.map((span) => span.text).join(""))
  .filter(Boolean)
  .map((text, i) => <p key={i}>{text}</p>)

// For ExperienceSection (D-06):
entry.description
  ?.map((block) => block.children?.map((c) => c.text).join(""))
  .filter(Boolean)
  .join(" ")
```

[VERIFIED: codebase — WorkSection.tsx]

### Pattern 3: Kicker Row

Established in Phases 2–3 (all sections use this). No abstraction — inline JSX:

```typescript
// Source: components/WorkSection.tsx lines 69-83 (verified in codebase)
<div style={{
  display: "flex", alignItems: "center", gap: 12,
  fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)",
  color: "var(--ms-fg-soft)", letterSpacing: 1,
}}>
  <span style={{ color: "var(--ms-orange-text)", fontWeight: 600 }}>03</span>
  <span aria-hidden="true" style={{ width: 28, height: 1, background: "var(--ms-border-strong)" }} />
  <span style={{ textTransform: "uppercase" }}>EXPERIENCE + EDUCATION</span>
</div>
```

[VERIFIED: codebase — WorkSection.tsx]

### Pattern 4: Section Shell

```typescript
// Source: components/WorkSection.tsx lines 49-57 (verified in codebase)
<section
  id="experience"
  style={{
    padding: "var(--section-py) var(--page-px)",
    background: "var(--ms-bg-alt)",
    borderTop: "1px solid var(--ms-border)",
    borderBottom: "1px solid var(--ms-border)",
  }}
>
  <div style={{ maxWidth: "var(--content-max)", margin: "0 auto" }}>
    {/* content */}
  </div>
</section>
```

[VERIFIED: codebase — AboutSection.tsx, WorkSection.tsx]

### Pattern 5: GlobalContext Education Fix (D-07)

```typescript
// CURRENT (GlobalContext.tsx lines 40-43) — find() returns single item:
const educationData = data?.find((item) => item._type === "education");
if (educationData) { setEducationData(educationData); }

// AFTER FIX — mirrors workExperience pattern (lines 45-48):
const isEducation = (item: SanityApiResponse): item is Education =>
  item._type === "education";
const educationArray = data?.filter(isEducation) ?? [];
setEducationData(educationArray);
// Also update: useState<Education | null> → useState<Education[] | null>
// Also update: ContextType.education: Education | null → Education[] | null
```

[VERIFIED: codebase — GlobalContext.tsx full file read]

### Pattern 6: Sanity Schema Field Addition

```typescript
// Source: sanity/schemaTypes/workExperience.ts (verified in codebase)
// Follow existing defineField patterns:
defineField({
  name: 'company',
  title: 'Company',
  type: 'string',
  description: 'The employer or client organisation name displayed in the timeline.',
}),
defineField({
  name: 'current',
  title: 'Current role',
  type: 'boolean',
  description: 'Enable for the active/current job. Controls the orange pulse dot.',
  initialValue: false,
}),
```

[ASSUMED] — `description` and `initialValue` wording is Claude's discretion (per CONTEXT.md); pattern follows existing field structure.

### Pattern 7: Timeline Pulse Dot

The `ms-pulse` keyframe is already declared in `globals.css` lines 145–148 and `--anim-pulse: 2.2s` is at line 129.

```typescript
// Current role dot — confirmed tokens from globals.css
<div
  aria-hidden="true"
  style={{
    position: "absolute",
    left: -8,    // centers 16px dot over 1px line
    top: 4,
    width: 16, height: 16,
    borderRadius: "50%",
    background: "var(--ms-orange)",
    boxShadow: "0 0 0 4px var(--ms-orange-dim)",
    animation: "ms-pulse var(--anim-pulse) infinite",
  }}
/>
```

[VERIFIED: globals.css lines 129, 145-148 — keyframe and token confirmed]

### Anti-Patterns to Avoid

- **Installing a Portable Text / block renderer library:** D-06 locks plain-text rendering via `.map(block => block.children.map(c => c.text).join(''))`. Do not add `@portabletext/react` or similar.
- **Deriving `current` from empty `endYear`:** D-02 locks this to the explicit boolean field. Do not check `duration.endYear === ""`.
- **Adding a Sanity type for skills:** D-11 locks skills as hardcoded static data. Do not extend the schema.
- **Using `education: Education | null` after the fix:** D-07 requires the array type. If left as single item, the timeline can only show one education entry.
- **Rendering `education.start` with `new Date().getFullYear()`:** D-10 confirms `start`/`end` are already year strings (e.g., "2015"). No date conversion needed.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Stack chip pills (services) | Custom styled `<span>` | `badge` outline variant | Already installed; consistent with Phase 3 project stack pills |
| Proficiency bar segments | Custom SVG or canvas chart | 10x `<div>` flex children | Simple CSS flex; no library needed for 10 static segments |
| Portable text rendering | `@portabletext/react` | Inline `block.children.map(c => c.text).join('')` | D-06 decision; Phase 3 already does this successfully |
| Orange pulse ring | Custom keyframe | `ms-pulse` in globals.css + `--anim-pulse` token | Already declared; redefining creates conflict |

**Key insight:** Every visual element in Phase 4 is achievable with CSS variables and flex/grid. No third-party UI component is needed beyond the already-installed `badge`.

---

## Critical Findings: GROQ / Schema Discrepancies

The UI-SPEC `### GlobalContext Data Mapping` section contains inaccurate statements about
what is "already in the GROQ projection." The actual codebase state (verified by reading
`sanityDataLoader.ts` and the schema files) differs:

### workExperience — Current vs. Required State

| Field | In Sanity Schema? | In GROQ Projection? | In TypeScript Interface? | Action Required |
|-------|------------------|---------------------|--------------------------|-----------------|
| `sortIndex` | YES | YES | YES | None |
| `title` | YES | via `_type` root | YES (via BaseType) | None |
| `duration` | YES (custom type) | YES | YES | None |
| `description` | YES (blockContent) | YES | YES | None |
| `company` | NO | NO | NO | D-01: add to schema; D-04: add to GROQ; D-05: add to interface |
| `current` | NO | NO | NO | D-02: add to schema; D-04: add to GROQ; D-05: add to interface |

The existing `duration` type has `startYear`/`endYear` fields (confirmed in `sanityTypes.ts`
line 74-77) — not `startDate`/`endDate`. The UI-SPEC GlobalContext section mistakenly
refers to `startDate`/`endDate` for workExperience. Use `duration.startYear` and
`duration.endYear` as confirmed by the existing `WorkSection.tsx` line 205:
`const year = p.duration?.startYear ?? "";`

[VERIFIED: codebase — sanityDataLoader.ts, sanityTypes.ts, workExperience.ts schema]

### education — Current vs. Required State

| Field | In Sanity Schema? | In GROQ Projection? | In TypeScript Interface? | Action Required |
|-------|------------------|---------------------|--------------------------|-----------------|
| `title` | YES | via `_type` root | YES (via BaseType) | None |
| `school` | YES | YES | YES | None |
| `start` | YES (string) | YES | YES | None |
| `end` | YES (string) | YES | YES | None |
| `fieldOfStudy` | NO | NO | NO | D-08: add to schema; D-09: add to GROQ; D-10: add to interface |

Education field names are `start`/`end` (not `startDate`/`endDate`). D-10 confirms: keep
existing field names. The UI-SPEC GlobalContext section listing `startDate`/`endDate` for
education is incorrect — do not rename.

[VERIFIED: codebase — sanityTypes.ts lines 27-33, education.ts schema lines 26-43]

---

## Common Pitfalls

### Pitfall 1: UI-SPEC workExperience Field Names vs. Actual Schema

**What goes wrong:** Executor writes `entry.startDate` or `entry.endDate` because the UI-SPEC
GlobalContext section says those fields exist. Component renders blank year ranges.

**Why it happens:** The UI-SPEC GlobalContext section was written with forward-looking field
names that don't match the existing `duration` custom type.

**How to avoid:** Use `entry.duration?.startYear` and `entry.duration?.endYear`. These are
confirmed in `sanityTypes.ts` (Duration interface, line 73-77) and used in `WorkSection.tsx`
line 205. For display: `entry.duration?.startYear ?? "?"` / `entry.duration?.endYear ?? "Present"`.

**Warning signs:** Year range column renders blank or undefined in the timeline.

### Pitfall 2: Education as Singular vs. Array

**What goes wrong:** Executor skips D-07 (GlobalContext fix) and tries to read
`ctx?.education` as an array. TypeScript errors, or a `.map()` call on `Education | null`
fails at runtime.

**Why it happens:** GlobalContext currently types education as `Education | null` (single
item via `.find()`). The fix must happen in GlobalContext before ExperienceSection can
iterate the array.

**How to avoid:** Apply D-07 first — change `useState<Education | null>` to
`useState<Education[] | null>`, update `setSiteContentToContext` to use `.filter()`, and
update `ContextType` interface. Then `ExperienceSection` can safely do `ctx?.education ?? []`.

**Warning signs:** TypeScript error on `education.map(...)` or only one education entry
appearing when multiple exist in Sanity.

### Pitfall 3: ms-pulse Already Declared — Don't Redefine

**What goes wrong:** Executor adds a new `@keyframes ms-pulse` in a component's style block
or a new CSS file. Two declarations conflict; animation behaves unexpectedly.

**Why it happens:** Developer doesn't check globals.css for existing keyframes.

**How to avoid:** The `ms-pulse` keyframe is at `globals.css` lines 145-148. The duration
token `--anim-pulse: 2.2s` is at line 129. Reference both via CSS variable and keyframe
name — do not redefine.

**Warning signs:** Animation test fails; pulsing ring size or opacity doesn't match spec.

### Pitfall 4: Missing `aria-hidden` on Decorative Elements

**What goes wrong:** Screen reader announces "01." giant number before service card title,
or announces pulse dot animation.

**Why it happens:** Decorative elements need explicit `aria-hidden="true"`.

**How to avoid:** Per UI-SPEC Accessibility Contract: timeline pulse dot → `aria-hidden`;
service card decorative numbers → `aria-hidden`; kicker decorative line → `aria-hidden`;
service card stack chips → `aria-hidden`.

**Warning signs:** Accessibility audit flags non-meaningful content being announced.

### Pitfall 5: Skills Bar Segments — role="img" Required

**What goes wrong:** Skill bars are a series of styled divs with no accessible label.
Screen readers cannot interpret proficiency level.

**Why it happens:** Visual bars convey information that needs a text equivalent.

**How to avoid:** Per UI-SPEC Accessibility Contract: wrap each skill bar row in a container
with `role="img"` and `aria-label="TypeScript: 9 out of 10"`. This is the specified pattern.

---

## Code Examples

### ExperienceSection Timeline Entry (verified patterns)

```typescript
// Timeline dot — past role
// Source: UI-SPEC layout spec + globals.css tokens (verified)
<div
  aria-hidden="true"
  style={{
    position: "absolute",
    left: -6,         // centers 12px dot over 1px border-left line
    top: 6,
    width: 12, height: 12,
    borderRadius: "50%",
    background: "var(--ms-border-strong)",
    border: "1px solid var(--ms-bg-alt)",
  }}
/>

// Timeline dot — current role (overrides)
<div
  aria-hidden="true"
  style={{
    position: "absolute",
    left: -8,         // centers 16px dot over 1px border-left line
    top: 4,
    width: 16, height: 16,
    borderRadius: "50%",
    background: "var(--ms-orange)",
    boxShadow: "0 0 0 4px var(--ms-orange-dim)",
    animation: "ms-pulse var(--anim-pulse) infinite",
  }}
/>
```

### Service Card Hover (CSS transition pattern)

```typescript
// Source: UI-SPEC service card spec (transition pattern confirmed in globals.css --anim-hover)
// React approach: inline style + group hover via CSS class, or conditional state
// Simplest: use a wrapper with CSS class and :hover in globals.css, or use React state

// Option A — React state (consistent with "use client" component pattern)
const [hovered, setHovered] = useState(false);
<div
  onMouseEnter={() => setHovered(true)}
  onMouseLeave={() => setHovered(false)}
  style={{
    border: `1px solid ${hovered ? "var(--ms-orange)" : "var(--ms-border)"}`,
    transition: "border-color var(--anim-hover)",
    // ...
  }}
/>
```

Note: `ServicesSection` would be a server component if no state is needed, but hover state
requires `useState` → needs `"use client"`. Alternatively, add a CSS class to globals.css
with `:hover` selector and keep it a server component. The choice is Claude's discretion;
CSS class approach preserves server component benefit.

### Skills Bar Segment

```typescript
// Source: UI-SPEC skill group spec (verified tokens in globals.css)
// Accessible wrapper per UI-SPEC accessibility contract
<div role="img" aria-label={`${skill.name}: ${skill.proficiency} out of 10`}>
  <div style={{ display: "flex", gap: "var(--space-1)", height: 8 }}>
    {Array.from({ length: 10 }).map((_, i) => (
      <div
        key={i}
        style={{
          flex: 1,
          height: 8,
          borderRadius: "var(--radius-xs)",
          background: i < skill.proficiency
            ? "var(--ms-orange)"
            : "var(--ms-border-strong)",
        }}
      />
    ))}
  </div>
</div>
```

### GROQ Projection Update

```groq
// Source: lib/api/sanityDataLoader.ts (verified — current state)
// Update workExperience block:
_type == 'workExperience' => {
  sortIndex,
  duration,
  description,
  company,     // ADD — D-04
  current      // ADD — D-04
},

// Update education block:
_type == 'education' => {
  school,
  start,
  end,
  fieldOfStudy  // ADD — D-09
},
```

---

## Project Constraints (from CLAUDE.md)

These directives are mandatory. The planner must verify the plan does not violate them.

| Directive | Constraint |
|-----------|------------|
| No test framework | CLAUDE.md: "There are no tests configured." Do not add test files or scripts. |
| Tailwind custom theme | New colors must be CSS variables in `app/globals.css` + `tailwind.config.ts`. No new tokens needed in Phase 4 — all pre-established. |
| Image optimization | Only `cdn.sanity.io/images/**` as remote pattern. Not applicable to Phase 4 (no images). |
| Sanity CDN | `SANITY_USE_CDN=false` — already configured in sanityClient.ts. No change needed. |
| Next.js image | Not used in Phase 4 — no `<Image>` components needed. |
| Commit messages | No "Co-authored-by" or AI attribution tags. |

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Education as single `.find()` result | Education as `.filter()` array | Phase 4 fix (D-07) | Allows multiple education entries from Sanity |
| workExperience without employer identity | workExperience with `company` + `current` | Phase 4 (D-01/D-02) | Timeline can display company name and distinguish current role |

**Deprecated/outdated (within this codebase):**
- `education: Education | null` in GlobalContext — being replaced by `Education[] | null` in Phase 4.
- The UI-SPEC field name references `startDate`/`endDate` for education — incorrect; actual fields are `start`/`end` per the existing schema and D-10.

---

## Runtime State Inventory

Phase 4 adds new Sanity schema fields to existing document types. This is additive — no
existing documents are deleted or renamed.

| Category | Items Found | Action Required |
|----------|-------------|-----------------|
| Stored data | Sanity documents of type `workExperience` (existing) will be missing `company` and `current` fields until populated in Studio | Schema addition is non-breaking (optional fields); existing docs render without company/current until Daniel populates them |
| Stored data | Sanity documents of type `education` (existing) will be missing `fieldOfStudy` until populated | Same — optional field; renders detail line only if present |
| Live service config | Sanity Studio schema deployed to hosted environment — needs `cd sanity && npm run deploy` after schema changes | Re-deploy Sanity Studio so editors see new fields |
| OS-registered state | None | None |
| Secrets/env vars | No new env vars required | None |
| Build artifacts | None | None |

**Key point:** Sanity schema changes require a Studio redeploy (`cd sanity && npm run deploy`)
to make new fields visible in the Studio editing UI. The GROQ projection change is a code-side
change and does not require Sanity API changes.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Sanity `defineField` for `current: boolean` with `initialValue: false` follows existing field patterns | Code Examples — Pattern 6 | Low: worst case field displays differently in Studio; no runtime impact |
| A2 | `ServicesSection` can use a CSS `:hover` class in globals.css to avoid `"use client"` while still implementing the orange border transition | Code Examples — Service Card Hover | Low: if CSS class approach is rejected, use React state + `"use client"` instead |
| A3 | All Sanity `workExperience` documents in production currently lack `company` and `current` fields — they will render with empty company and no current styling until Daniel populates them in Studio | Runtime State Inventory | Medium: if documents somehow have these fields, they'll surface immediately; if not, placeholder display is acceptable per project conventions |

---

## Open Questions

1. **ServicesSection: server component vs. client component for hover**
   - What we know: hover `border-color` transition requires either CSS `:hover` (server component safe) or React state (forces `"use client"`)
   - What's unclear: whether inline styles + React state, or a global CSS class, is preferred given existing component conventions
   - Recommendation: Add a `.service-card:hover` rule to `globals.css` so `ServicesSection` remains a server component. This is consistent with the `header-bg` and `logo-m-text` classes already in globals.css (lines 165-169).

2. **Skills data: inline vs. `lib/skills.ts`**
   - What we know: Claude's discretion per CONTEXT.md
   - What's unclear: whether the skill group array complexity warrants extraction
   - Recommendation: Inline in `SkillsSection.tsx` — 4 groups × ~5 skills each = ~20 entries; not large enough to warrant a separate file. Easier for Daniel to find and edit.

3. **workExperience year display from `duration` type**
   - What we know: `duration.startYear` and `duration.endYear` are the correct field names (confirmed in sanityTypes.ts Duration interface; used in WorkSection.tsx line 205)
   - What's unclear: whether `endYear` is empty string or null for the current role (D-02 adds explicit `current` boolean, so this is irrelevant for current-role detection, but year display matters)
   - Recommendation: Display as `{duration.startYear} – {duration.endYear || "Present"}`. If `endYear` is empty string, fall back to "Present".

---

## Environment Availability

Step 2.6: SKIPPED — Phase 4 is purely code/config changes against the existing Sanity and
Next.js stack. No new external dependencies, services, or CLI tools are required. The Sanity
Studio deploy (`npm run deploy`) uses an already-configured Sanity CLI.

---

## Validation Architecture

CLAUDE.md states: "There are no tests configured." No test framework is present in the
codebase. `nyquist_validation` is not set in `.planning/config.json` (key absent) —
treated as enabled per protocol, but there is no existing test infrastructure to extend.

**Wave 0 Gaps:** Full test framework setup would be required before any automated tests
could be written. Given CLAUDE.md's explicit statement, do not add test infrastructure in
Phase 4. Manual verification against the success criteria in the phase description serves
as the validation gate.

**Manual verification checklist (for `/gsd-verify-work`):**
- [ ] EXP-01: Timeline renders 4 entries on a vertical left-border line; current role has orange pulse dot
- [ ] EXP-02: Education list shows degree, institution, years, and `fieldOfStudy` detail line
- [ ] EXP-03: "ALSO / COMMUNITY" heading + 3 activity rows with label/detail pairs
- [ ] SKILLS-01: 4 skill group columns; each item has label row + 10-segment bar with filled/empty segments
- [ ] SVC-01: 2×2 grid with title, description, stack chips per card
- [ ] SVC-02: Giant Fraunces italic number visible; border turns orange on hover
- [ ] TypeScript: `npm run build` passes (no type errors)
- [ ] Lint: `npm run lint` passes

---

## Security Domain

No new authentication, session management, access control, cryptography, or user input
processing is introduced in Phase 4. All three sections are read-only display components
consuming pre-fetched server data. No ASVS categories apply. The existing `/api/revalidate`
auth check is not touched in this phase.

---

## Sources

### Primary (HIGH confidence)

- Codebase direct reads — `sanityDataLoader.ts`, `GlobalContext.tsx`, `sanityTypes.ts`, `workExperience.ts` schema, `education.ts` schema, `WorkSection.tsx`, `AboutSection.tsx`, `app/page.tsx`, `globals.css` — all field names, type signatures, and patterns verified
- `04-CONTEXT.md` — locked decisions D-01 through D-13, canonical references
- `04-UI-SPEC.md` — spacing tokens, typography map, color map, animation contracts, component inventory, accessibility contract, copywriting contract

### Secondary (MEDIUM confidence)

- `03-PATTERNS.md` — Phase 3 pattern assignments confirming component/analog structure

### Tertiary (LOW confidence)

- None — all research was conducted against the live codebase and locked CONTEXT.md decisions

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified against package.json and existing component files
- Architecture: HIGH — all patterns extracted from verified codebase reads
- Pitfalls: HIGH — discrepancies identified by direct comparison of UI-SPEC claims vs. actual codebase state
- Schema changes: HIGH — schema files read directly; field names confirmed

**Research date:** 2026-05-10
**Valid until:** 2026-06-10 (stable stack; 30-day estimate)
