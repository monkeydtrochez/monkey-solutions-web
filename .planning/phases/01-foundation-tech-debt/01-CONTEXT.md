# Phase 1: Foundation + Tech Debt - Context

**Gathered:** 2026-05-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Make the design system operational and fix all known infrastructure bugs before any visual work begins. Deliverables: CSS variables for the full design token set, a working theme toggle (script + component + temporary placement), three self-hosted fonts loaded via next/font, and five targeted tech debt fixes. Every subsequent phase builds on this foundation.

</domain>

<decisions>
## Implementation Decisions

### CSS Variable Naming & Tailwind Integration

- **D-01:** Keep existing shadcn variable names (`--background`, `--foreground`, `--primary`, `--card`, `--muted`, `--accent`, etc.) — only change their values to match the design handoff token tables. Tailwind utility classes (`bg-background`, `text-foreground`) keep working in all future phases.
- **D-02:** Migrate theme selector from `.dark` class to `[data-theme="dark"]` / `[data-theme="light"]` attribute selectors on `<html>`. Dark is the default.
- **D-03:** Stay in Tailwind v4 compat mode — keep `@config ../tailwind.config.ts` in globals.css. Do NOT migrate to `@theme` native Tailwind v4 config.
- **D-04:** Define the complete token set in Phase 1 — all colors, typography, spacing, radii, shadows, and animation durations from the design handoff. Future phases can reference tokens immediately without touching globals.css.
- **D-05:** The researcher MUST extract the full token tables from `design_handoff_monkey_solutions/README.md` and include ready-to-implement values in the research output. The planner should not need to parse the design handoff files themselves.

### Theme Toggle

- **D-06:** Phase 1 builds three things: (1) an inline `<script dangerouslySetInnerHTML>` in `app/layout.tsx` `<head>` that reads `localStorage` key `ms_theme` and sets `document.documentElement.dataset.theme` before paint; (2) a `ThemeToggle` component; (3) a temporary visible placement on the page to verify the success criteria. Phase 2 removes the temp placement and integrates the toggle into the header.
- **D-07:** The `ThemeToggle` component uses direct DOM manipulation — reads/writes `document.documentElement.dataset.theme` and `localStorage`. No React context or provider. Any component can read the current theme via `data-theme` attribute on `<html>`.

### Fonts

- **D-08:** Remove Geist fonts (GeistVF.woff, GeistMonoVF.woff) from `app/layout.tsx`. Load Inter (body/UI), JetBrains Mono (meta/kickers), and Fraunces (editorial accents) via `next/font/google` or `next/font/local`. Apply them as CSS variables (`--font-sans`, `--font-mono`, `--font-display`) and set Inter as the body font immediately. Existing components will render in new fonts — this visual change is acceptable during development.

### Existing Components

- **D-09:** Preserve all existing components (BusinessCard, CV, Projects, WorkExperience, etc.) — do not delete them in Phase 1. Since shadcn variable names are kept and only values change, components remain renderable. They will look different (new colors, new fonts) but won't throw errors. Full rewrites happen in Phases 2–5.

### Tech Debt (strict scope)

- **D-10:** Fix exactly TD-01 through TD-05 — no additional CONCERNS.md items. Scope is locked.
- **D-11 (TD-01):** Delete `lib/redis.ts` entirely. Remove the `ioredis` import and all Redis `if (redis !== null)` branches from `lib/api/sanityDataLoader.ts`. Remove `ioredis` from `package.json`.
- **D-12 (TD-02):** Replace the self-referential `axios.get` call in `lib/api/sanityDataLoader.ts` with a direct Sanity client fetch. Delete `app/api/sanity-data/route.ts` entirely — it becomes dead code after this fix.
- **D-13 (TD-03):** Fix `/api/revalidate/route.ts` auth comparison: change the check from `authHeader !== process.env.CRON_SECRET` to `authHeader !== \`Bearer ${process.env.CRON_SECRET}\``.
- **D-14 (TD-04):** Remove the stale-data guards in `app/context/GlobalContext.tsx` — delete the `if (!workExperience)` and `if (projectsData && !projects)` conditional blocks so context always overwrites with fresh server data.
- **D-15 (TD-05):** Stabilize `QueryClient` in `components/wrappers/QueryClientWrapper.tsx` using `const [queryClient] = useState(() => new QueryClient())`.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design Handoff (primary source of truth for tokens + layout)
- `design_handoff_monkey_solutions/README.md` — Complete token tables (colors, typography, spacing, radii, shadows, animations), section specs, and interaction notes. Researcher must extract all token values from here.
- `hifi-part1.jsx` — High-fidelity JSX for Hero + Header sections (reference for token usage in components)
- `hifi-part2.jsx` — High-fidelity JSX for About + Work sections
- `hifi-part3.jsx` — High-fidelity JSX for Experience/Skills/Services/Contact/Footer sections

### Requirements
- `.planning/REQUIREMENTS.md` — Phase 1 requirements: FOUND-01, FOUND-02, FOUND-03, FOUND-04, TD-01 through TD-05
- `.planning/ROADMAP.md` — Phase 1 success criteria (5 criteria that define done)

### Tech Debt Source of Truth
- `.planning/codebase/CONCERNS.md` — Exact file locations, line numbers, and fix approaches for all 5 required TDs

### Current Code Being Modified
- `app/globals.css` — Current shadcn token definitions (values to be replaced)
- `app/layout.tsx` — Current Geist font setup (to be replaced with Inter/JetBrains Mono/Fraunces)
- `lib/api/sanityDataLoader.ts` — Self-referential HTTP call + Redis branches (TD-01, TD-02)
- `app/api/revalidate/route.ts` — Auth comparison bug (TD-03)
- `app/context/GlobalContext.tsx` — Stale data guards (TD-04)
- `components/wrappers/QueryClientWrapper.tsx` — QueryClient re-instantiation (TD-05)
- `app/api/sanity-data/route.ts` — To be deleted after TD-02 fix
- `lib/redis.ts` — To be deleted (TD-01)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `app/sanityClient.ts` — Existing Sanity client factory (`createClientFromParam`). TD-02 fix should import this directly into sanityDataLoader.ts instead of going via HTTP.
- `tailwind.config.ts` — Existing Tailwind config with theme.extend.colors referencing CSS variables. Update color values here when tokens change.
- `components/ui/` — shadcn-style UI primitives (badge, button, card) that reference `--background`, `--foreground`, etc. — will inherit new token values automatically.

### Established Patterns
- CSS variables defined in `@layer base` in `globals.css`, consumed by Tailwind via `hsl(var(--token))` pattern — maintain this pattern with new values.
- `next/font/local` already used for Geist — use `next/font/google` for Inter and JetBrains Mono (or local if self-hosting is required); Fraunces via `next/font/google`.
- `GlobalContextProvider` wraps the app in `layout.tsx` — the `ThemeToggle` component sits outside/alongside this, not inside.

### Integration Points
- `app/layout.tsx` `<head>` — where the no-FOUC inline script is injected
- `app/layout.tsx` `<body>` — where font CSS variables are applied via className
- `app/page.tsx` — temporary placement for the ThemeToggle during Phase 1 verification (remove in Phase 2)

</code_context>

<specifics>
## Specific Ideas

- **localStorage key:** `ms_theme` (specified in REQUIREMENTS.md FOUND-03)
- **Theme default:** Dark is default — inline script should fall back to `"dark"` when no localStorage value exists
- **Font CSS variables:** Use `--font-sans` (Inter), `--font-mono` (JetBrains Mono), `--font-display` (Fraunces) as the variable names
- **ThemeToggle placement for Phase 1:** A minimal button/indicator on the page — exact styling not important, just needs to be clickable for verification. Phase 2 designs the real toggle icon.

</specifics>

<deferred>
## Deferred Ideas

- Opportunistic CONCERNS.md fixes (conflicting `revalidate` export, `@types/react` v19 update, dead code deletion, `"use client"` additions) — explicitly out of scope for Phase 1. May be addressed in a future cleanup pass.
- Deletion of `app/api/sanity-config/route.ts` and `lib/hooks/sanityConfigLoader.ts` (security concern from CONCERNS.md) — not in TD-01 through TD-05 scope.

</deferred>

---

*Phase: 1-Foundation + Tech Debt*
*Context gathered: 2026-05-09*
