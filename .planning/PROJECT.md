# Monkey Solutions Web

## What This Is

Freelance developer portfolio for Daniel Trochez / Monkey Solutions (monkeysolutions.se). A single-page site that showcases projects, experience, skills, and services — with a contact form and resume download — to convert visitors into clients. Content is managed via Sanity CMS and served through Next.js App Router.

## Core Value

Let visitors hire Daniel — every section funnels toward the contact form, direct email, and resume download.

## Current Milestone: v1.0 Redesign Monkey Solutions Web

**Goal:** Replace the existing portfolio site with a complete dark-moody, terminal-inspired redesign that converts visitors into clients.

**Target features:**
- Design system foundation (design tokens, typography, dark/light themes)
- Sticky header with logo, nav, theme toggle, and hire CTA
- Hero section with terminal status card and trust strip
- About section with portrait placeholder and fact rows
- Work section with expandable project rows and category filter
- Experience + Education timeline section
- Skills section with 10-segment bars
- Services section with 4 service cards
- Contact section with form + resume download cards
- Footer with giant wordmark
- Dark/light theme toggle with localStorage persistence and no FOUC
- Responsive layout (< 760px, < 480px breakpoints)
- Accessibility baseline + reduced-motion support

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- ✓ Sanity CMS integration for content (profile, work experience, education, projects, skills) — existing
- ✓ Next.js App Router with TypeScript — existing
- ✓ Tailwind CSS styling with dark mode class strategy — existing
- ✓ Sanity webhook → `/api/revalidate` for cache invalidation — existing
- ✓ GlobalContext for client-side data access — existing

### Active

<!-- Current scope — Milestone v1.0 -->

- [ ] Design tokens extracted as CSS variables (colors, typography, spacing, radii) for both dark and light themes
- [ ] Dark/light theme toggle with localStorage persistence and no flash of wrong theme
- [ ] Sticky header: logo, numbered nav links, theme toggle, hire CTA with pulse dot
- [ ] Hero: H1 with mixed weights, terminal status card, CTA buttons, 4-stat trust strip
- [ ] About: two-column layout, editorial H2, portrait placeholder with sticker, facts row
- [ ] Work: expandable project accordion with metrics card and filter control
- [ ] Experience + Education: two-column timeline and education list
- [ ] Skills: 4-group 10-segment bar layout
- [ ] Services: 2×2 card grid with giant decorative numbers
- [ ] Contact: form with optimistic success state + resume download cards
- [ ] Footer: giant wordmark, 4-column meta grid, copyright strip
- [ ] Fix known tech debt: Redis cleanup, self-referential HTTP call, revalidation auth bug, context stale-data guards
- [ ] Responsive design: all 2-col grids collapse at < 760px, project rows adapt at < 480px

### Out of Scope

<!-- Explicit boundaries -->

- Multi-page routing — Single-page scroll only; no separate route per section
- CMS-managed design tokens — All design tokens are code-level; content editors manage copy only
- Blog or writing section — Not in this milestone; design handoff does not include it
- Internationalization — Site is English-only; Swedish exists only for resume PDF

## Context

- **Design handoff:** Complete hi-fi spec in `design_handoff_monkey_solutions/`. Interactive prototype in `Monkey Solutions.html`. High-fidelity JSX references in `hifi-part1/2/3.jsx`. README has full token tables, section specs, and interaction notes.
- **Design direction:** Dark-moody terminal aesthetic. Brand accent `#ff6b1a` (orange). Fonts: Inter (body/UI), JetBrains Mono (meta/kickers), Fraunces italic (editorial accents). Two themes: dark (default) and light.
- **Tech stack:** Next.js 15 App Router, TypeScript, Tailwind v4, Sanity v3 (@sanity/client v7).
- **Known tech debt:** Documented in `.planning/codebase/CONCERNS.md` — Redis remnants, self-referential HTTP call, revalidation header bug, stale context guards, QueryClient re-instantiation. Fix alongside redesign.
- **Content:** All dynamic content (bio, experience, education, projects, skills) continues from Sanity. Placeholder content in design handoff will be replaced by Daniel with real copy during/after development.
- **Assets Daniel will provide:** Portrait photo (3:4), 6 project screenshots (16:9), resume PDFs (`/public/resume_en.pdf`, `/public/resume_sv.pdf`), real company names, org number, social handles.

## Constraints

- **Tech stack:** Next.js App Router + TypeScript + Tailwind — already established, no migration
- **Content source:** Sanity CMS — all editable copy must remain CMS-managed
- **Image optimization:** `next.config.mjs` only allows `cdn.sanity.io/images/**` — update if external image hosts are needed
- **No FOUC:** Theme must be applied before hydration via inline script in `<head>`
- **Fonts:** Self-hosted via `next/font` (Inter, JetBrains Mono, Fraunces) — no external CSS requests

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Single-page scroll with anchor links | Portfolio sites convert better with one long scroll; no routing complexity | — Pending |
| Dark theme as default | Design handoff specifies dark as default; brand aesthetic is dark-moody | — Pending |
| Keep Sanity as CMS | Existing integration is working; no reason to migrate | ✓ Good |
| Design tokens as CSS variables on `<html data-theme>` | Enables SSR-safe theme switching without JS flash | — Pending |
| Fix tech debt inline with redesign | Component rewrites touch all the same files; fix once, not twice | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-09 — Milestone v1.0 started*
