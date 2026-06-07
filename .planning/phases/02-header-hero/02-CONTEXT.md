# Phase 2: Header + Hero - Context

**Gathered:** 2026-05-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the two structural elements visitors see first: (1) a sticky header with logo, numbered nav, theme toggle pill, and hire CTA; and (2) a hero section with mixed-weight H1, terminal status card, two CTA buttons, and a 4-stat trust strip. Extend the Sanity `profile` schema with one new `heroBio` string field for the lede paragraph. Delete all old component files from Phase 0. All design tokens, fonts, and animations are pre-established by Phase 1 — this phase applies them.

</domain>

<decisions>
## Implementation Decisions

### Hero Copy Sourcing
- **D-01:** Add `heroBio: string` to `sanity/schemaTypes/profile.ts`. This is the only schema change in Phase 2.
- **D-02:** The hero lede paragraph reads `profile.heroBio` from GlobalContext. If the field is null or empty, show nothing — no hardcoded fallback.
- **D-03:** All other hero copy is hardcoded per the UI-SPEC copywriting contract: H1 ("Software that ships & lasts."), status row ("AVAILABLE · freelance projects, Q2 2026 →"), terminal content, trust stats, and CTA labels. These do not need CMS control.
- **D-04:** `heroBio` must be added to the GROQ query projection in `lib/api/sanityDataLoader.ts` and to the TypeScript profile type in `app/models/sanityTypes.ts`.

### page.tsx Cleanup
- **D-05:** Delete the old component files: `BusinessCard.tsx`, `CV.tsx`, `Profile.tsx`, `ProfileIntro.tsx`, `ProjectDetails.tsx`, `Projects.tsx`, `Skills.tsx`, `WorkExperience.tsx`, `WorkExperienceItem.tsx`, `Education.tsx`. Clean slate — only Phase 2 components render.
- **D-06:** Remove the temporary `<ThemeToggle />` from `app/page.tsx` (Phase 1 temp placement). The toggle moves into `SiteHeader`.
- **D-07:** Nav links (`#about`, `#work`, `#experience`, `#skills`, `#contact`) are written as-is in the header. They remain dead links until Phases 3–5 add their respective section IDs. No placeholder sections needed.
- **D-08:** Data hydration architecture (how Sanity data, including `heroBio`, reaches GlobalContext without the old `SiteWrapper`) is Claude's discretion. The planner should design the cleanest approach given the new structure.

### SiteHeader Placement
- **D-09:** `SiteHeader` and `HeroSection` both live in `app/page.tsx`. No changes to `app/layout.tsx` beyond what Phase 1 established.

### Claude's Discretion
- How to hydrate GlobalContext with Sanity data now that old `SiteWrapper` is removed — planner decides the cleanest wrapper/provider approach
- Whether `QueryClientWrapper` is retained, refactored, or removed in Phase 2 (TanStack Query may still be needed by later phases)
- Exact `<main>` element placement (in `page.tsx` wrapping `HeroSection`, or in `layout.tsx` wrapping `{children}`)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### UI Design Contract (primary spec for this phase)
- `.planning/phases/02-header-hero/02-UI-SPEC.md` — Complete visual/interaction contract: spacing, typography, color, component inventory, semantic HTML structure, animation contracts, accessibility, copywriting. MUST read before writing any component.

### Design Handoff Reference
- `design_handoff_monkey_solutions/README.md` — Token tables and interaction notes (reference if UI-SPEC is ambiguous)
- `hifi-part1.jsx` — High-fidelity JSX for header + hero sections (visual reference)

### Requirements & Roadmap
- `.planning/REQUIREMENTS.md` — Phase 2 requirements: NAV-01, NAV-02, NAV-03, HERO-01, HERO-02, HERO-03, HERO-04
- `.planning/ROADMAP.md` — Phase 2 goal and success criteria (5 items)

### Sanity Schema & Data Layer
- `sanity/schemaTypes/profile.ts` — Profile schema (add `heroBio: string` field here)
- `app/models/sanityTypes.ts` — TypeScript types (add `heroBio?: string` to profile type)
- `app/context/GlobalContext.tsx` — GlobalContext provider (ensure profile type includes heroBio)
- `lib/api/sanityDataLoader.ts` — GROQ query (add `heroBio` to profile projection)

### Phase 1 Foundation (what's pre-built)
- `.planning/phases/01-foundation-tech-debt/01-CONTEXT.md` — Phase 1 decisions: CSS variable naming, ThemeToggle DOM pattern, font variables, token conventions

### Existing Code to Reuse / Replace
- `components/ThemeToggle.tsx` — Keep toggle logic (DOM manipulation + localStorage `ms_theme`), replace markup with pill style per UI-SPEC
- `app/page.tsx` — Replace with new structure (see D-05 through D-09)
- `app/layout.tsx` — Do not modify; Phase 1 already established no-FOUC script, fonts, GlobalContextProvider

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `components/ThemeToggle.tsx` — Toggle logic is complete; only the JSX markup changes (temp fixed-position button → pill integrated into SiteHeader nav)
- `components/ui/button.tsx`, `components/ui/badge.tsx` — Available but not used directly; Phase 2 CTAs are custom `<a>` elements styled with design tokens per handoff
- `app/context/GlobalContext.tsx` — Source of `profile` data including new `heroBio` field; `HeroSection` reads from this context

### Established Patterns
- CSS variables consumed via Tailwind utilities (`bg-background`, `text-foreground`) or direct `var(--token)` — use this pattern for all new components
- `"use client"` required for any component using DOM APIs or event handlers (SiteHeader has ThemeToggle interaction)
- Server components can read GlobalContext values passed via props; client components use `useContext(GlobalContext)`
- Font classes applied via `className` on `<html>` in layout.tsx: `--font-sans` (Inter), `--font-mono` (JetBrains Mono), `--font-display` (Fraunces)

### Integration Points
- `app/layout.tsx` `<html>` — `data-theme="dark"` attribute, font class variables, no-FOUC inline script; already configured by Phase 1
- `app/page.tsx` — Entry point being restructured; hosts SiteHeader + HeroSection + data hydration provider
- GlobalContext `profile` field — new `heroBio?: string` field flows from GROQ → types → context → HeroSection

</code_context>

<specifics>
## Specific Ideas

- **heroBio field initial value**: The UI-SPEC has the intended copy: "I'm **Daniel Trochez** — a Gothenburg-based software developer running Monkey Solutions. I help teams and founders turn messy briefs into quietly well-made web, iOS & backend products." Daniel will enter this into Sanity Studio.
- **ThemeToggle markup target**: Pill container with `border-radius: 20px`, two buttons (☾ dark / ☀ light), active state has `bg-fg text-bg`, inactive is transparent — full spec in UI-SPEC.md Theme Toggle section.
- **Phase 1 temp placement removal**: Remove `<ThemeToggle />` from the top of `app/page.tsx` (the fixed-position button added for Phase 1 verification).

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 02-header-hero*
*Context gathered: 2026-05-09*
