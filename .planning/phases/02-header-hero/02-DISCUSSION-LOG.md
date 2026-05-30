# Phase 2: Header + Hero - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-09
**Phase:** 02-header-hero
**Areas discussed:** Hero copy sourcing, page.tsx cleanup scope, SiteHeader placement

---

## Hero copy sourcing

| Option | Description | Selected |
|--------|-------------|----------|
| All hardcoded | Static strings in components. No Sanity schema changes. | |
| Sanity-driven where sensible | Map to existing profile schema fields where possible | ✓ |
| Full CMS control | New siteConfig/hero Sanity document type for all hero content | |

**User's choice:** Sanity-driven where sensible

---

| Option | Description | Selected |
|--------|-------------|----------|
| Just the lede paragraph | Map profile.description (rich text) | |
| Add a few fields to profile | Add specific fields to the profile schema | ✓ |
| Fully hardcoded for now | Keep all hero copy as static strings | |

**User's choice:** Add a few fields to profile

---

*User clarification (via screenshot):* Only the lede paragraph (the text between the H1 tagline and the CTA buttons) should be CMS-editable. Everything else stays hardcoded.

---

| Option | Description | Selected |
|--------|-------------|----------|
| Reuse profile.description | Existing blockContent field; complex renderer needed | |
| Add a heroBio string field | New plain-text field; simple to render in React | ✓ |

**User's choice:** Add heroBio string field to profile schema

---

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — fall back to hardcoded | Show hardcoded lede if heroBio is null | |
| Leave it blank | Show nothing if heroBio is not populated | ✓ |

**User's choice:** Leave it blank (no fallback)

---

## page.tsx cleanup scope

| Option | Description | Selected |
|--------|-------------|----------|
| Delete old components | Remove BusinessCard, CV, Projects files entirely | ✓ |
| Keep old components below | Render new + old components together | |
| Remove from page.tsx, keep files | Stop rendering but keep files as reference | |

**User's choice:** Delete old component files — clean slate

---

| Option | Description | Selected |
|--------|-------------|----------|
| Keep SiteWrapper as data bridge | Strip old logic but preserve setSiteContentToContext | |
| Let the planner figure it out | Claude designs the new data hydration architecture | ✓ |

**User's choice:** Let the planner figure it out

---

| Option | Description | Selected |
|--------|-------------|----------|
| Leave as dead links | Nav links point to non-existent anchors until phases 3–5 add them | ✓ |
| Add placeholder sections | Add 5 empty <section id="..."> elements | |

**User's choice:** Leave nav links as dead links

---

## SiteHeader placement

| Option | Description | Selected |
|--------|-------------|----------|
| app/layout.tsx | Semantic — header outside main, future-proof | |
| app/page.tsx | Simpler, all in one place for single-page site | ✓ |

**User's choice:** app/page.tsx

---

## Claude's Discretion

- How to hydrate GlobalContext with Sanity data after old SiteWrapper is removed
- Whether to retain, refactor, or remove QueryClientWrapper in Phase 2
- Exact placement of `<main>` element (page.tsx vs layout.tsx)

## Deferred Ideas

None — discussion stayed within Phase 2 scope.
