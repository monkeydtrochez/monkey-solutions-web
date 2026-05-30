# Monkey Solutions Web

## What This Is

Freelance developer portfolio for Daniel Trochez / Monkey Solutions (monkeysolutions.se). A single-page site that showcases projects, experience, skills, and services — with a contact form and resume download — to convert visitors into clients. Content is managed via Sanity CMS and served through Next.js App Router. v1.0 shipped 2026-05-21.

## Core Value

Let visitors hire Daniel — every section funnels toward the contact form, direct email, and resume download.

## Current State

**v1.0 shipped 2026-05-21** — Full redesign: dark-moody terminal aesthetic, 8 content sections, contact form with Resend, CMS-backed content, responsive layout, accessibility baseline, dark/light theme with localStorage persistence.

Pre-launch blockers remaining:
- Resend domain verification (`monkeysolutions.se`) — contact form won't deliver until done
- Resume PDFs are placeholder stubs in `/public/` — Daniel must replace
- Portrait photo, project screenshots, real company names, org number, social handles pending from Daniel

## Requirements

### Validated

- ✓ Sanity CMS integration for content (profile, work experience, education, projects, skills) — existing
- ✓ Next.js App Router with TypeScript — existing
- ✓ Tailwind CSS styling with dark mode class strategy — existing
- ✓ Sanity webhook → `/api/revalidate` for cache invalidation — existing
- ✓ GlobalContext for client-side data access — existing
- ✓ Design tokens extracted as CSS variables (colors, typography, spacing, radii) for both dark and light themes — v1.0
- ✓ Dark/light theme toggle with localStorage persistence and no flash of wrong theme — v1.0
- ✓ Sticky header: logo, numbered nav links, theme toggle, hire CTA with pulse dot — v1.0
- ✓ Hero: H1 with mixed weights, terminal status card, CTA buttons, 4-stat trust strip — v1.0
- ✓ About: two-column layout, editorial H2, portrait placeholder with sticker, facts row — v1.0
- ✓ Work: expandable project accordion with metrics card and filter control — v1.0
- ✓ Experience + Education: two-column timeline and education list — v1.0
- ✓ Contact: form with optimistic success state + resume download cards — v1.0
- ✓ Footer: giant wordmark, 4-column meta grid, copyright strip — v1.0
- ✓ Fix known tech debt: self-referential HTTP call, revalidation auth, context stale-data guards — v1.0
- ✓ Responsive design: all 2-col grids collapse at < 760px, project rows adapt at < 480px — v1.0
- ✓ Accessibility baseline + reduced-motion support — v1.0

### Accepted Deviations (v1.0)

- Skills section: badge chip layout shipped instead of 10-segment proficiency bars — owner accepted, intentional design
- Services section: 3-card 1×3 grid shipped instead of 4-card 2×2 — owner accepted, intentional design

### Out of Scope

- Multi-page routing — Single-page scroll only; no separate route per section
- CMS-managed design tokens — All design tokens are code-level; content editors manage copy only
- Blog or writing section — Not in this milestone; design handoff does not include it
- Internationalization — Site is English-only; Swedish exists only for resume PDF

## Context

- **Tech stack:** Next.js 15 App Router (Turbopack), TypeScript, Tailwind v4, Sanity v3 (@sanity/client v7), Resend SDK for contact form
- **Codebase:** ~3,900 LOC TypeScript across components and app
- **Theme:** Dark-moody terminal aesthetic. Brand accent `#ff6b1a` (orange). Fonts: Inter, JetBrains Mono, Fraunces (all self-hosted via next/font). Two themes: dark (default) and light.
- **Known pre-launch items:** Domain verification in Resend Dashboard, real assets from Daniel (portrait, screenshots, PDFs, company names, org number, social handles)
- **Nav breakpoint:** `desk:` at 1200px (separate from content `ms:` 760px) — needed extra room for 6-item nav

## Constraints

- **Tech stack:** Next.js App Router + TypeScript + Tailwind — already established, no migration
- **Content source:** Sanity CMS — all editable copy must remain CMS-managed
- **Image optimization:** `next.config.mjs` only allows `cdn.sanity.io/images/**` — update if external image hosts are needed
- **No FOUC:** Theme must be applied before hydration via inline script in `<head>`
- **Fonts:** Self-hosted via `next/font` (Inter, JetBrains Mono, Fraunces) — no external CSS requests

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Single-page scroll with anchor links | Portfolio sites convert better with one long scroll; no routing complexity | ✓ Good |
| Dark theme as default | Design handoff specifies dark as default; brand aesthetic is dark-moody | ✓ Good |
| Keep Sanity as CMS | Existing integration is working; no reason to migrate | ✓ Good |
| Design tokens as CSS variables on `<html data-theme>` | Enables SSR-safe theme switching without JS flash | ✓ Good |
| Fix tech debt inline with redesign | Component rewrites touch all the same files; fix once, not twice | ✓ Good |
| Badge chips for skills (not 10-seg bars) | Owner reviewed both; chips fit aesthetic better, avoid rigid rankings | ✓ Accepted |
| 3-card services grid (not 4-card 2×2) | Owner reviewed; 3 services accurately represents current scope | ✓ Accepted |
| `desk:` breakpoint at 1200px for nav | 6-item nav + logo + CTA needs ~1100px minimum; separate from content `ms:` 760px | ✓ Good |
| CSS animation classes over inline style | inline `style={{ animation }}` doesn't override `@layer` cascade correctly in Tailwind v4 | ✓ Good |
| Resend sandbox sender until domain verified | `monkeysolutions.se` not yet verified in Resend — use `onboarding@resend.dev` in dev | ⚠️ Revisit pre-launch |

---
*Last updated: 2026-05-21 after v1.0 milestone*
