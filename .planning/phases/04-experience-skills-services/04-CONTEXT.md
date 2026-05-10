# Phase 4: experience-skills-services - Context

**Gathered:** 2026-05-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Build three read-only content sections: (1) Experience + Education — a vertical timeline for 4 work entries (with orange pulse on current role) plus an education list and a "Also / Community" sub-section; (2) Skills — 4-group 10-segment proficiency bar layout; (3) Services — 2×2 card grid with hover border and decorative giant numbers. Extend the Sanity `workExperience` schema with `company` and `current` fields; extend `education` schema with `fieldOfStudy`; fix GlobalContext to store education as an array. All design tokens, fonts, and layout patterns are pre-established by Phases 1–3.

</domain>

<decisions>
## Implementation Decisions

### WorkExperience Schema (sanity/schemaTypes/workExperience.ts)

- **D-01:** Add `company: string` field to `workExperience` schema — this is the company/employer name displayed above the role title in the timeline. Currently missing.
- **D-02:** Add `current: boolean` field to `workExperience` schema — Daniel explicitly checks this toggle in Sanity Studio for the active job. Do NOT derive current status from `duration.endYear` being blank (fragile).
- **D-03:** Do NOT add a `location` field — the timeline layout does not display location; keep schema clean.
- **D-04:** Update the GROQ projection for `_type == 'workExperience'` in `lib/api/sanityDataLoader.ts` to include `company` and `current` alongside the existing `sortIndex`, `duration`, `description`.
- **D-05:** Update the TypeScript `WorkExperience` interface in `app/models/sanityTypes.ts` to add `company?: string` and `current?: boolean`.
- **D-06:** `description` on `workExperience` is `blockContent` (array of block objects). Render as plain paragraph text using `block.children.map(c => c.text).join('')` — no block renderer library. (Carried forward from Phase 3 CONTEXT.md decision.)

### Education Schema + GlobalContext (sanity/schemaTypes/education.ts, app/context/GlobalContext.tsx)

- **D-07:** Change `education: Education | null` to `Education[] | null` in `GlobalContext`. Update `setSiteContentToContext` in `GlobalContext.tsx` to use `.filter()` instead of `.find()` for education items (same pattern as `workExperience`).
- **D-08:** Add `fieldOfStudy: string` field to the `education` schema — this is the degree/major detail line (e.g., "Computer Science"). It is an optional field; render the detail line only if present.
- **D-09:** Update the GROQ projection for `_type == 'education'` to include `fieldOfStudy` alongside existing `school`, `start`, `end`.
- **D-10:** Update the TypeScript `Education` interface in `app/models/sanityTypes.ts` to add `fieldOfStudy?: string`. Keep existing `start`/`end` field names — do not rename to `startDate`/`endDate`. The fields are already year strings (no `getFullYear()` conversion needed).

### Hardcoded Content (SkillsSection, ServicesSection, community rows)

- **D-11:** Skills proficiency data is hardcoded as static arrays in `SkillsSection.tsx` using the placeholder values from the UI-SPEC `### Skills Groups and Proficiency Data` section. Daniel updates real proficiency values during content population — no Sanity extension for skills in Phase 4.
- **D-12:** Community rows ("Open source contributor", "Tech speaker", "Mentor") are hardcoded as static strings from the UI-SPEC copywriting contract.
- **D-13:** Service card content (titles, descriptions, stack chip labels for all 4 cards) is hardcoded as static strings from the UI-SPEC `### Service Card Definitions` section.

### Claude's Discretion

- Whether to extract skill group constant data into a separate `lib/skills.ts` constants file or inline as a static array inside `SkillsSection.tsx` — planner decides based on component complexity.
- Exact Sanity `defineField` wording for `company` and `current` fields (description text, validation rules) — follow existing field patterns in the schema file.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### UI Design Contract (primary visual/interaction spec)
- `.planning/phases/04-experience-skills-services/04-UI-SPEC.md` — Complete visual contract: spacing, typography, color, component inventory, semantic HTML structure, animation contracts, accessibility, copywriting, skills proficiency data, service card definitions. MUST read before writing any component.

### Requirements & Roadmap
- `.planning/REQUIREMENTS.md` — Phase 4 requirements: EXP-01, EXP-02, EXP-03, SKILLS-01, SVC-01, SVC-02.
- `.planning/ROADMAP.md` — Phase 4 goal and success criteria.

### Sanity Schema & Data Layer
- `sanity/schemaTypes/workExperience.ts` — Add `company: string` and `current: boolean` fields (D-01, D-02).
- `sanity/schemaTypes/education.ts` — Add `fieldOfStudy: string` field (D-08).
- `app/models/sanityTypes.ts` — Update `WorkExperience` interface (D-05) and `Education` interface (D-10).
- `lib/api/sanityDataLoader.ts` — Update GROQ projections for both `workExperience` and `education` (D-04, D-09).
- `app/context/GlobalContext.tsx` — Change education from single item to array (D-07).

### Phase 3 Foundation (established patterns)
- `.planning/phases/03-about-work/03-CONTEXT.md` — blockContent plain-text rendering decision, GlobalContext usage pattern, component file conventions.
- `components/AboutSection.tsx` — Reference for client component using `useContext(GlobalContext)` with null coalescing.
- `components/WorkSection.tsx` — Reference for client component pattern; also shows `workExperience` (array) consumption from GlobalContext.

### Entry Point
- `app/page.tsx` — Add `<ExperienceSection />`, `<SkillsSection />`, `<ServicesSection />` after `<WorkSection />` in document order.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `components/AboutSection.tsx`, `components/WorkSection.tsx` — Exact pattern for `"use client"` components reading from `GlobalContext`. `ExperienceSection` follows this pattern.
- `app/context/GlobalContext.tsx` — `workExperience: WorkExperience[] | null` already uses the array pattern; education needs the same fix applied.
- `components/ui/badge.tsx` — Already installed; use outline variant for service card stack chip labels.
- `app/utilities/imageUrlBuilder.ts` — Not needed in Phase 4 (no images).

### Established Patterns
- CSS variables via direct `var(--token)` — all design tokens are pre-established; no new tokens needed.
- `"use client"` required only for components using `useContext` — `ExperienceSection` needs it; `SkillsSection` and `ServicesSection` are server components.
- Font variables: `var(--font-sans)`, `var(--font-mono)`, `var(--font-display)` (Fraunces) — established in Phase 1.
- Section anchors: `id="experience"`, `id="skills"`, `id="services"` on outermost `<section>` elements — activates header nav links.

### Integration Points
- `app/page.tsx` — New section components added here after `<WorkSection />`.
- `GlobalContext` — `workExperience` already array-typed and sorted; education needs `.filter()` fix to match.
- `lib/api/sanityDataLoader.ts` — GROQ projections need `company`, `current` added to workExperience block; `fieldOfStudy` added to education block.

</code_context>

<specifics>
## Specific Ideas

- **Education year range**: Use `education.start` / `education.end` directly as display strings (already year values like "2015") — no date conversion needed.
- **Skills data source**: The authoritative placeholder list is in `04-UI-SPEC.md` under `### Skills Groups and Proficiency Data`. Executor copies this verbatim as the hardcoded static array.
- **Service card data source**: The authoritative placeholder list is in `04-UI-SPEC.md` under `### Service Card Definitions`. Executor copies this verbatim.
- **blockContent description**: For any `workExperience.description` block array, render as plain paragraph text: `entry.description?.map(block => block.children?.map(c => c.text).join('')).join(' ')` — consistent with Phase 3 approach.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 04-experience-skills-services*
*Context gathered: 2026-05-10*
