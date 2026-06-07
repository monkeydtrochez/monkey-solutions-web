# Phase 3: About + Work - Context

**Gathered:** 2026-05-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Build two sections: (1) a two-column About section with editorial H2, `aboutBody` paragraphs, portrait placeholder, and a facts row; (2) an expandable project accordion with a metrics card, screenshot placeholder, and category filter (all/web/ios/saas). Extend the Sanity `project` schema with `overview`, `kind`, and `metrics` fields; extend `profile` schema with `aboutBody`. All design tokens, fonts, and layout patterns are pre-established by Phases 1–2 — this phase applies them.

</domain>

<decisions>
## Implementation Decisions

### Project Schema — Sanity (sanity/schemaTypes/project.ts)
- **D-01:** Add `overview: text` field to the `project` schema. This is the single summary paragraph shown in the expanded accordion row (e.g., "Rebuilt a 12-year-old Magento store on a headless Next.js + Sanity stack. 3× faster LCP, half the ops cost, editorial CMS the team actually enjoys.").
- **D-02:** Remove the existing `body: blockContent` field from `project` schema. It's replaced by `overview`. No PortableText renderer needed for projects.
- **D-03:** Add `kind: string` field to `project` schema. This is the display label in the collapsed row (e.g., "E-commerce · Headless", "iOS · Education", "SaaS · Product").
- **D-04:** Category filter (all / web / ios / saas) derives from `kind` via regex in the component — no separate `category` field in Sanity. Regex rules mirror the hifi reference: `/commerce|web|booking/i` → web, `/iOS/` → ios, `/SaaS/i` → saas.
- **D-05:** Project display number (001, 002…) is derived from `sortIndex` and formatted with zero-padding in the component. No new field needed.
- **D-06:** Project year displayed in the collapsed row comes from `duration.startYear` (already in schema).
- **D-07:** Add `metrics` array field to `project` schema — array of objects each with `label: string`, `value: string`, `suffix: string`. Max 3 items. These are the 3-cell metrics card values Daniel fills in per project (e.g., label: "LCP", value: "0.9s", suffix: "−68%").

### Profile Schema — Sanity (sanity/schemaTypes/profile.ts)
- **D-08:** Add `aboutBody: text` field to `profile` schema. This holds the About section body copy (2+ paragraphs). Rendered as plain text with line breaks → paragraph splits in the component. `heroBio` (added in Phase 2) remains for the hero lede — distinct from `aboutBody`.
- **D-09:** `workingSince` is hardcoded as `"2015"` in the `AboutSection` component — NOT a Sanity field. Career start year is static and doesn't need CMS control.

### TypeScript Types (app/models/sanityTypes.ts)
- **D-10:** Add `ProjectMetric` interface: `{ label: string; value: string; suffix: string }`.
- **D-11:** Add to `Project` interface: `overview?: string`, `kind?: string`, `metrics?: ProjectMetric[]`.
- **D-12:** Add to `Profile` interface: `aboutBody?: string`.

### GROQ Query (lib/api/sanityDataLoader.ts)
- **D-13:** Add `overview`, `kind`, `metrics[]{ label, value, suffix }` to the `project` projection. Add `aboutBody` to the `profile` projection.

### About Section Rendering
- **D-14:** Portrait placeholder renders as a styled 3:4 border box with "DT" centered in Fraunces italic. When `profile.profilePicture` is populated (after Daniel uploads his photo), swap in a Next.js `<Image>` using the existing `imageUrlBuilder`. For now, CSS-only placeholder.
- **D-15:** Facts row values: Location = `profile.location` (CMS), Languages = `profile.languages` joined with " · " (CMS), Working since = hardcoded `"2015"`.
- **D-16:** Sticker badge is decorative and hardcoded per the design handoff (content and rotation are design decisions, not content).

### Accordion Behavior
- **D-17:** Default open state = first project in the sorted list (`sortIndex` 1). This matches the design's "Default open: project 001" intent but uses the sorted order rather than a hardcoded project name.

### Claude's Discretion
- Exact Sanity array field definition for `metrics` (whether to use `defineArrayMember` with inline object or define a named `projectMetric` type) — either approach is valid; planner decides.
- Whether to co-locate `AboutSection` and `WorkSection` in a single file or split into separate component files — planner decides based on complexity.
- Sticker badge rotation angle and text content — follow the design handoff.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### UI Design Contract (primary spec for this phase)
- `.planning/phases/03-about-work/03-UI-SPEC.md` — Complete visual/interaction contract for About + Work sections. MUST be created via `/gsd-ui-phase 3` before planning begins. If it doesn't exist when planning starts, the planner should reference the hifi files directly.

### Design Handoff Reference
- `design_handoff_monkey_solutions/README.md` — About section spec (§3), Work section spec (§4), including filter behavior, accordion interaction, and metrics card layout.
- `design_handoff_monkey_solutions/hifi-part1.jsx` — About section JSX reference (Header, Hero, About primitives).
- `design_handoff_monkey_solutions/hifi-part2.jsx` — Work section JSX reference (project list, accordion expand, filter pills, metrics card). MUST read — contains the exact PROJECTS data structure and filter regex logic.

### Requirements & Roadmap
- `.planning/REQUIREMENTS.md` — Phase 3 requirements: ABOUT-01, ABOUT-02, ABOUT-03, WORK-01, WORK-02, WORK-03.
- `.planning/ROADMAP.md` — Phase 3 goal and success criteria (5 items).

### Sanity Schema & Data Layer
- `sanity/schemaTypes/project.ts` — Add `overview`, `kind`, `metrics` fields (D-01 through D-07).
- `sanity/schemaTypes/profile.ts` — Add `aboutBody` field (D-08).
- `app/models/sanityTypes.ts` — Add `ProjectMetric` interface; extend `Project` and `Profile` types (D-10 through D-12).
- `lib/api/sanityDataLoader.ts` — Update GROQ projections for `project` and `profile` (D-13).
- `app/context/GlobalContext.tsx` — `projects` and `profile` already in context; no structural changes expected.

### Phase 2 Foundation (what's pre-built)
- `.planning/phases/02-header-hero/02-CONTEXT.md` — Phase 2 decisions: DataHydrator pattern, GlobalContext usage, font variables, component file conventions.
- `app/page.tsx` — Entry point; new sections (`AboutSection`, `WorkSection`) are added here with their `id` anchor attributes.

### Existing Components to Reuse
- `components/SiteHeader.tsx` — Nav links `#about` and `#work` are already written; this phase adds the matching `id="about"` and `id="work"` anchors, activating the nav.
- `components/ui/badge.tsx` — Available for stack pills in expanded project rows.
- `components/HeroSection.tsx` — Reference for CSS variable usage patterns and component structure.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `components/ui/badge.tsx` — Stack pills in the expanded project row use this pattern (already styled with design tokens from Phase 1).
- `app/context/GlobalContext.tsx` — `projects: Project[] | null` and `profile: Profile | null` are already exposed; components read via `useContext(GlobalContext)`.
- `app/utilities/imageUrlBuilder.ts` — Use this to build the portrait URL when `profile.profilePicture` is populated.

### Established Patterns
- CSS variables via Tailwind utilities (`bg-background`, `text-foreground`) or `var(--token)` — apply to all new components.
- `"use client"` required for accordion state (open/closed toggle) and filter state — `WorkSection` is a client component.
- Font variables: `var(--font-sans)` (Inter), `var(--font-mono)` (JetBrains Mono), `var(--font-display)` (Fraunces) — applied via CSS custom properties established in Phase 1.
- Section anchors: each section needs `id="about"` / `id="work"` on its outermost `<section>` element for nav link targeting.

### Integration Points
- `app/page.tsx` — Add `<AboutSection />` and `<WorkSection />` below `<HeroSection />`. Sections receive data via GlobalContext (no prop drilling needed).
- `sanity/schemaTypes/index.ts` — Import and register any new schema types (if `projectMetric` is extracted as a named type).
- GROQ query — Update projection arrays in `lib/api/sanityDataLoader.ts` so new fields are fetched on every request.

</code_context>

<specifics>
## Specific Ideas

- **hifi project data structure**: The `hifi-part2.jsx` PROJECTS array is the exact data shape Daniel will fill into Sanity. Downstream agents should read it to understand the expected values per field.
- **Filter regex logic**: The hifi filter is the authoritative spec for category derivation — copy it verbatim rather than improvising: web = `/commerce|web|booking/i`, ios = `/iOS/`, saas = `/SaaS/i`.
- **Metrics card grid**: 3-column grid, each cell: label (mono 10 uppercase faint) → large value (Inter 32/300 orange) → suffix (mono 11 soft). Below grid = 180px image placeholder.
- **Accordion animation**: `ms-fadein` (opacity 0→1, translateY -6px→0, 0.3s) on the expanded row body — defined in `design_handoff_monkey_solutions/README.md §Animations`.
- **Portrait box DT initials**: Styled as 3:4 aspect-ratio box, `border: 1px solid var(--color-border-strong)`, "DT" in `var(--font-display)` italic, centered. When `profile.profilePicture._ref` is present, render `<Image>` via `imageUrlBuilder` instead.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 03-about-work*
*Context gathered: 2026-05-10*
