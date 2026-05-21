# Requirements: Monkey Solutions Web

**Defined:** 2026-05-09
**Core Value:** Let visitors hire Daniel — every section funnels toward the contact form, direct email, and resume download.

## v1.0 Requirements

All requirements for the v1.0 redesign milestone.

### Foundation — Design System

- [ ] **FOUND-01**: Design tokens (colors, typography, spacing, radii, shadows, animations) are defined as CSS variables under `[data-theme="dark"]` and `[data-theme="light"]` selectors
- [ ] **FOUND-02**: Dark theme is applied before hydration via an inline script in `<head>` so there is no flash of wrong theme on revisit
- [ ] **FOUND-03**: User's theme preference persists to `localStorage` under key `ms_theme` and is restored on page load
- [ ] **FOUND-04**: Three typefaces (Inter, JetBrains Mono, Fraunces) are self-hosted via `next/font` — no external Google Fonts CSS requests

### Header Navigation

- [ ] **NAV-01**: User sees a sticky header with the Monkey Solutions logo, numbered anchor links (01–05), a dark/light theme toggle, and a hire CTA button
- [ ] **NAV-02**: Hire CTA button includes a pulsing orange status dot animation
- [ ] **NAV-03**: Header background uses backdrop blur with semi-transparent theme color to remain legible over page content

### Hero Section

- [ ] **HERO-01**: User sees a hero headline (H1) that mixes font weights and includes a Fraunces italic editorial accent
- [ ] **HERO-02**: User sees a terminal status card that shows whoami, role, availability, stack chips, and a blinking cursor animation
- [ ] **HERO-03**: User can click a primary "Start a project" CTA and a secondary "View work" CTA in the hero
- [ ] **HERO-04**: User sees a trust strip below the hero with 4 stats (years shipping, projects delivered, languages, on-time rate) with orange accent characters

### About Section

- [ ] **ABOUT-01**: User sees a two-column About section with an editorial H2 (including Fraunces italic accent) and two body paragraphs
- [ ] **ABOUT-02**: Right column shows a 3:4 portrait placeholder with a decorative offset border and a rotated sticker badge
- [ ] **ABOUT-03**: User sees a facts row with location, languages, and working-since data beneath the body copy

### Work Section

- [ ] **WORK-01**: User sees a list of 6 projects as expandable accordion rows; clicking a row opens it (one open at a time)
- [ ] **WORK-02**: Expanded project row shows an overview paragraph, stack pills, a metrics card (3 key metrics), and a screenshot placeholder
- [ ] **WORK-03**: User can filter the project list by category (all / web / ios / saas) via a segmented pill control

### Experience + Education Section

- [x] **EXP-01**: User sees an experience timeline with a vertical line, 4 entries, and visual distinction between the current role and past roles (orange pulse glow for current)
- [x] **EXP-02**: User sees an education list with degree title, institution, years, and detail line for each entry
- [x] **EXP-03**: User sees an "Also / Community" sub-section with 3 community activity rows below the education list

### Skills Section

- [ ] **SKILLS-01**: User sees a skills section with 4 groups (Languages, Frontend, Backend & Infra, Craft), each showing labeled 10-segment bars with filled segments indicating proficiency level

### Services Section

- [ ] **SVC-01**: User sees a 2×2 grid of service cards, each with a title, description, and stack chip list
- [ ] **SVC-02**: Service cards display a decorative giant Fraunces italic number and highlight with an orange border on hover

### Contact Section

- [x] **CONTACT-01**: User can submit a contact form with name, email, budget, and project description fields
- [x] **CONTACT-02**: Contact form shows an optimistic success state (green background, checkmark, confirmation text) for 3.5 seconds on successful submission, then resets
- [x] **CONTACT-03**: User can download a resume as PDF in English or Swedish via styled download cards
- [x] **CONTACT-04**: User sees direct contact links for email, LinkedIn, and GitHub with trailing arrow icons

### Footer

- [x] **FOOTER-01**: User sees a giant wordmark ("MONKEY / solutions.") with Fraunces italic accent on "solutions."
- [x] **FOOTER-02**: Footer contains a 4-column meta grid: studio address, navigation links, social links, and availability status
- [x] **FOOTER-03**: Footer has a bottom strip with copyright text and version info

### Responsive Layout

- [ ] **RESP-01**: All 2-column grid layouts collapse to a single column at viewports narrower than 760px
- [ ] **RESP-02**: Project accordion rows adapt from a 5-column grid to a 2-line compact layout at viewports narrower than 480px
- [ ] **RESP-03**: Hero terminal card stacks below the headline on mobile (< 760px)

### Accessibility

- [ ] **A11Y-01**: All interactive elements are real `<a>` or `<button>` elements with visible `:focus-visible` orange rings (2px, offset 2px)
- [ ] **A11Y-02**: Decorative elements (traffic lights, giant service numbers, grid background) are marked `aria-hidden`; icon-only buttons have `aria-label` attributes
- [ ] **A11Y-03**: Contact form submit button announces success state changes via `aria-live="polite"`
- [ ] **A11Y-04**: Pulse dot and cursor-blink animations are disabled under `@media (prefers-reduced-motion: reduce)`

### Tech Debt

- [ ] **TD-01**: Delete `lib/redis.ts`, remove the `ioredis` import and all Redis branches from `lib/api/sanityDataLoader.ts`, and remove `ioredis` from `package.json`
- [ ] **TD-02**: Replace the self-referential `axios.get` HTTP call in `lib/api/sanityDataLoader.ts` with a direct Sanity client fetch, eliminating the server-to-itself round-trip
- [ ] **TD-03**: Fix `/api/revalidate` auth header comparison to check `Authorization: Bearer <CRON_SECRET>` instead of comparing raw secret
- [ ] **TD-04**: Remove stale-data guards in `GlobalContext.tsx` (`if (!workExperience)` / `if (projectsData && !projects)`) so context always overwrites with fresh server data
- [ ] **TD-05**: Stabilize `QueryClient` instantiation in `QueryClientWrapper.tsx` using `useState(() => new QueryClient())`

## Future Requirements

Deferred — not in v1.0 scope.

### Content + CMS

- Blog / writing section — not in design handoff
- CMS-managed design tokens
- Internationalized site content (beyond resume PDFs)

### Enhanced Features

- Animated scroll-triggered section reveals
- Project case study pages (separate routes)
- Light theme accent color switcher (amber, coral variants specced in handoff but non-default)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Multi-page routing | Single-page scroll; no separate route per section — stated in design handoff |
| Blog or writing section | Not in design handoff; deferred |
| Internationalization | English-only site; SV exists only for resume PDF |
| CMS-managed design tokens | Tokens are code-level; content editors manage copy only |
| Real project content | Daniel provides real copy, photos, and company names during/after dev |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Pending |
| FOUND-02 | Phase 1 | Pending |
| FOUND-03 | Phase 1 | Pending |
| FOUND-04 | Phase 1 | Pending |
| TD-01 | Phase 1 | Pending |
| TD-02 | Phase 1 | Pending |
| TD-03 | Phase 1 | Pending |
| TD-04 | Phase 1 | Pending |
| TD-05 | Phase 1 | Pending |
| NAV-01 | Phase 2 | Pending |
| NAV-02 | Phase 2 | Pending |
| NAV-03 | Phase 2 | Pending |
| HERO-01 | Phase 2 | Pending |
| HERO-02 | Phase 2 | Pending |
| HERO-03 | Phase 2 | Pending |
| HERO-04 | Phase 2 | Pending |
| ABOUT-01 | Phase 3 | Pending |
| ABOUT-02 | Phase 3 | Pending |
| ABOUT-03 | Phase 3 | Pending |
| WORK-01 | Phase 3 | Pending |
| WORK-02 | Phase 3 | Pending |
| WORK-03 | Phase 3 | Pending |
| EXP-01 | Phase 4 | Complete |
| EXP-02 | Phase 4 | Complete |
| EXP-03 | Phase 4 | Complete |
| SKILLS-01 | Phase 4 | Pending |
| SVC-01 | Phase 4 | Pending |
| SVC-02 | Phase 4 | Pending |
| CONTACT-01 | Phase 5 | Complete |
| CONTACT-02 | Phase 5 | Complete |
| CONTACT-03 | Phase 5 | Complete |
| CONTACT-04 | Phase 5 | Complete |
| FOOTER-01 | Phase 5 | Complete |
| FOOTER-02 | Phase 5 | Complete |
| FOOTER-03 | Phase 5 | Complete |
| RESP-01 | Phase 6 | Pending |
| RESP-02 | Phase 6 | Pending |
| RESP-03 | Phase 6 | Pending |
| A11Y-01 | Phase 6 | Pending |
| A11Y-02 | Phase 6 | Pending |
| A11Y-03 | Phase 6 | Pending |
| A11Y-04 | Phase 6 | Pending |
