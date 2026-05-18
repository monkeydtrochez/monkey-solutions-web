# Roadmap: Monkey Solutions Web

## Overview

A complete visual and structural overhaul of the Monkey Solutions portfolio site. The build proceeds inside-out: infrastructure and tech debt first, then the design system foundation, then structural chrome (header), then content sections top-to-bottom, and finally cross-cutting responsive and accessibility polish. Each phase ships a coherent, independently verifiable capability.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation + Tech Debt** - Design tokens, theme toggle, fonts, and all five tech debt fixes
- [ ] **Phase 2: Header + Hero** - Sticky header with nav/CTA and full hero section with trust strip
- [ ] **Phase 3: About + Work** - Two-column About section and expandable project accordion with filter
- [ ] **Phase 4: Experience, Skills + Services** - Timeline, education, skills bars, and service card grid
- [x] **Phase 5: Contact + Footer** - Contact form with success state, resume downloads, and footer (completed 2026-05-18)
- [ ] **Phase 6: Responsive + Accessibility** - Mobile layouts, reduced-motion support, and a11y baseline

## Phase Details

### Phase 1: Foundation + Tech Debt
**Goal**: The design system is operational and the codebase has no known infrastructure bugs
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, TD-01, TD-02, TD-03, TD-04, TD-05
**Success Criteria** (what must be TRUE):
  1. Opening the site in a browser that previously selected light theme shows no flash of dark background before paint
  2. Toggling the theme switch and reloading the page restores the chosen theme
  3. Inter, JetBrains Mono, and Fraunces render as self-hosted fonts with no requests to fonts.googleapis.com
  4. The `/api/revalidate` endpoint correctly accepts a `Bearer` token and rejects bare secrets
  5. The Sanity data loader fetches directly via the Sanity client — no server-to-itself HTTP round-trip occurs
**Plans**: 3 plans
Plans:
**Wave 1**
- [x] 01-01-PLAN.md — Tech debt fixes (TD-02: replace self-referential HTTP with direct Sanity client; confirm TD-01, TD-03, TD-04, TD-05 already done)
- [x] 01-02-PLAN.md — CSS design tokens (globals.css full token layer: dark/light themes, shared tokens, @custom-variant dark; tailwind.config.ts fontFamily + border/input fix)

**Wave 2** *(blocked on Wave 1 completion)*
- [x] 01-03-PLAN.md — Fonts, layout, ThemeToggle (app/fonts.ts, layout.tsx with no-FOUC script, ThemeToggle component, temp page.tsx placement)
**UI hint**: yes

### Phase 2: Header + Hero
**Goal**: Visitors see a fully styled sticky header and hero section that establish the brand and provide primary navigation
**Depends on**: Phase 1
**Requirements**: NAV-01, NAV-02, NAV-03, HERO-01, HERO-02, HERO-03, HERO-04
**Success Criteria** (what must be TRUE):
  1. The header is visible and sticks to the top of the viewport while scrolling, with a blurred semi-transparent background
  2. The hire CTA button in the header shows a pulsing orange dot
  3. The hero headline renders with mixed font weights and a Fraunces italic accent
  4. The terminal status card shows whoami, role, availability, and stack chips with a blinking cursor
  5. The trust strip below the hero displays 4 stats with orange accent characters
**Plans**: 3 plans
Plans:
**Wave 1**
- [x] 02-01-PLAN.md — Data layer foundation: extend Sanity schema with heroBio, slim GlobalContext, create DataHydrator + UI stubs, rewrite app/page.tsx, delete legacy components

**Wave 2** *(blocked on Wave 1 completion)*
- [x] 02-02-PLAN.md — SiteHeader + ThemeToggle pill refactor + StatusDot + theme-aware CSS classes (NAV-01, NAV-02, NAV-03)
- [x] 02-03-PLAN.md — HeroSection + TerminalCard with H1, lede, CTAs, terminal card, trust strip (HERO-01, HERO-02, HERO-03, HERO-04)
**UI hint**: yes

### Phase 3: About + Work
**Goal**: Visitors can read Daniel's background and browse all projects with filtering
**Depends on**: Phase 2
**Requirements**: ABOUT-01, ABOUT-02, ABOUT-03, WORK-01, WORK-02, WORK-03
**Success Criteria** (what must be TRUE):
  1. The About section renders as two columns: editorial text left, portrait placeholder with sticker right
  2. The facts row beneath the About copy shows location, languages, and working-since data
  3. All 6 projects appear as accordion rows; clicking one opens it and closes any previously open row
  4. An expanded project row shows the overview, stack pills, metrics card, and screenshot placeholder
  5. The category filter control updates the visible project rows when a category is selected
**Plans**: 3 plans
Plans:
**Wave 1**
- [x] 03-01-PLAN.md — Data layer: extend Sanity schemas (project: +overview, +kind, +metrics, -body; profile: +aboutBody), update TypeScript types (ProjectMetric + Project/Profile extensions), update GROQ projections

**Wave 2** *(blocked on Wave 1)*
- [x] 03-02-PLAN.md — AboutSection component (two-column kicker + H2 + body + facts row + portrait placeholder + sticker badge) + page.tsx wiring (ABOUT-01, ABOUT-02, ABOUT-03)

**Wave 3** *(blocked on Wave 2 — shares app/page.tsx)*
- [x] 03-03-PLAN.md — WorkSection component (filter pills + accordion with single-open + ProjectRow + metrics card + screenshot placeholder + footer note) + page.tsx wiring (WORK-01, WORK-02, WORK-03)
**UI hint**: yes

### Phase 4: Experience, Skills + Services
**Goal**: Visitors can see Daniel's full professional history, technical proficiency, and service offerings
**Depends on**: Phase 3
**Requirements**: EXP-01, EXP-02, EXP-03, SKILLS-01, SVC-01, SVC-02
**Success Criteria** (what must be TRUE):
  1. The experience timeline shows 4 entries on a vertical line; the current role has an orange pulse glow
  2. The education list shows degree, institution, years, and a detail line for each entry
  3. The community sub-section shows 3 activity rows below the education list
  4. The skills section renders 4 groups, each with labeled 10-segment bars reflecting proficiency levels
  5. The 2x2 service card grid shows giant decorative Fraunces numbers and highlights with an orange border on hover
**Plans**: 3 plans
Plans:
**Wave 1**
- [x] 04-01-PLAN.md — Data layer: extend workExperience (company, current) + education (fieldOfStudy) schemas; update TypeScript types + GROQ projection; fix GlobalContext education to Education[] (D-01..D-10)

**Wave 2** *(blocked on Wave 1)*
- [x] 04-02-PLAN.md — ExperienceSection client component (timeline w/ orange pulse current role + education list + ALSO/COMMUNITY 3 rows) + page.tsx wiring (EXP-01, EXP-02, EXP-03)

**Wave 3** *(blocked on Wave 2 — shares app/page.tsx)*
- [ ] 04-03-PLAN.md — SkillsSection (4 groups, 10-segment bars) + ServicesSection (2x2 cards, Fraunces decorative numbers, CSS hover) + .service-card globals.css rule + page.tsx wiring (SKILLS-01, SVC-01, SVC-02)
**UI hint**: yes

### Phase 5: Contact + Footer
**Goal**: Visitors can reach Daniel, download his resume, and see site meta information in the footer
**Depends on**: Phase 4
**Requirements**: CONTACT-01, CONTACT-02, CONTACT-03, CONTACT-04, FOOTER-01, FOOTER-02, FOOTER-03
**Success Criteria** (what must be TRUE):
  1. Submitting the contact form with valid input triggers an optimistic success state (green background, checkmark) for 3.5 seconds, then resets the form
  2. Two resume download cards are present and link to the English and Swedish PDF files
  3. Direct contact links for email, LinkedIn, and GitHub are visible with trailing arrow icons
  4. The footer displays a giant wordmark with Fraunces italic accent on "solutions."
  5. The footer 4-column meta grid and copyright/version strip render correctly
**Plans**: 3 plans
Plans:
**Wave 1**
- [x] 05-01-PLAN.md — Data layer + backend: install resend, extend Sanity profile schema (availabilityStatus, orgNumber, readCvUrl), update GROQ + TypeScript types, create /api/contact Resend POST handler, seed /public/ placeholder PDFs (CONTACT-01, CONTACT-02, CONTACT-03)

**Wave 2** *(blocked on Wave 1)*
- [x] 05-02-PLAN.md — ContactSection client component (two-column: direct links + resume download card + form with optimistic success state) + page.tsx wiring (CONTACT-01, CONTACT-02, CONTACT-03, CONTACT-04)

**Wave 3** *(blocked on Wave 2 — shares app/page.tsx)*
- [x] 05-03-PLAN.md — FooterSection client component (giant wordmark, 4-column meta grid with CMS fields, bottom strip) + page.tsx wiring outside main (FOOTER-01, FOOTER-02, FOOTER-03)
**UI hint**: yes

### Phase 6: Responsive + Accessibility
**Goal**: The site is fully usable on all viewport sizes and meets the accessibility baseline
**Depends on**: Phase 5
**Requirements**: RESP-01, RESP-02, RESP-03, A11Y-01, A11Y-02, A11Y-03, A11Y-04
**Success Criteria** (what must be TRUE):
  1. All two-column grid layouts collapse to a single column when the viewport is narrower than 760px
  2. Project accordion rows switch to the compact two-line layout at viewports narrower than 480px
  3. The hero terminal card stacks below the headline on mobile viewports
  4. All interactive elements show a 2px orange focus ring on keyboard navigation, and icon-only buttons have accessible labels
  5. Pulse dot and cursor-blink animations stop when the OS has reduced-motion enabled; the contact form success state is announced via aria-live
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation + Tech Debt | 3/3 | Complete | 2026-05-09 |
| 2. Header + Hero | 0/3 | Not started | - |
| 3. About + Work | 0/3 | Not started | - |
| 4. Experience, Skills + Services | 2/3 | In Progress|  |
| 5. Contact + Footer | 3/3 | Complete   | 2026-05-18 |
| 6. Responsive + Accessibility | 0/TBD | Not started | - |
