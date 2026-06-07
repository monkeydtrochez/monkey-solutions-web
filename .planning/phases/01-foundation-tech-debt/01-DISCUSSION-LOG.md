# Phase 1: Foundation + Tech Debt - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-09
**Phase:** 1-Foundation + Tech Debt
**Areas discussed:** CSS variable naming, Theme toggle scope, Existing component fate, Tech debt scope

---

## CSS Variable Naming

### Q1: How should the new CSS variables be named?

| Option | Description | Selected |
|--------|-------------|----------|
| Keep shadcn names | Keep --background, --foreground, --primary, etc. but change values and migrate to [data-theme] selectors. Tailwind utilities keep working. | ✓ |
| Use design handoff names | Introduce exact design handoff naming (--color-bg-primary, --color-accent-orange). Requires rewriting tailwind.config.ts. | |
| Hybrid: design names + shadcn aliases | Design handoff names as source of truth, shadcn names aliased on top. Zero breakage, more verbose. | |

**User's choice:** Keep shadcn names
**Notes:** Continuity with existing utility classes outweighs naming purity.

---

### Q2: How should CSS variables integrate with Tailwind v4?

| Option | Description | Selected |
|--------|-------------|----------|
| Stay in compat mode | Keep @config tailwind.config.ts; define tokens in tailwind.config.ts under theme.extend.colors. Least disruption. | ✓ |
| Go native Tailwind v4 | Drop tailwind.config.ts, move all tokens into globals.css using @theme {}. Cleaner long-term. | |
| You decide | Let researcher recommend based on @custom-variant dark support. | |

**User's choice:** Stay in compat mode
**Notes:** Avoid migration complexity in a foundational phase.

---

### Q3: How complete should the token set be in Phase 1?

| Option | Description | Selected |
|--------|-------------|----------|
| All tokens from the design handoff | Define every token (colors, typography, spacing, radii, shadows, animation durations) in one shot. | ✓ |
| Colors + typography only | Add spacing, shadows, animations per-phase as needed. | |
| Minimal: just Phase 1 needs | Only tokens for theme toggle and font system. | |

**User's choice:** All tokens from the design handoff
**Notes:** One-time cost upfront prevents going back to globals.css in every subsequent phase.

---

### Q4: Should the researcher extract token values from the design handoff?

| Option | Description | Selected |
|--------|-------------|----------|
| Researcher extracts tokens into CONTEXT.md | Researcher reads design handoff README and extracts exact values. Planner gets a ready-to-implement table. | ✓ |
| Planner reads the handoff directly | CONTEXT.md points to design_handoff_monkey_solutions/README.md. Planner reads it during plan creation. | |

**User's choice:** Researcher extracts tokens
**Notes:** Keeps planner focused on structure, not parsing design files.

---

## Theme Toggle Scope

### Q1: How much of the theme toggle does Phase 1 build?

| Option | Description | Selected |
|--------|-------------|----------|
| Script + component + temp placement | Inline <head> script, ThemeToggle component, temporary visible button for verification. Phase 2 removes temp placement. | ✓ |
| Script + component, no placement | Script and component built, but not placed anywhere visible. Verification via dev tools. | |
| Script only | Just the inline script. Toggle component deferred to Phase 2. Success criteria 2 deferred. | |

**User's choice:** Script + component + temp placement
**Notes:** Phase 1 success criteria explicitly requires toggling to work and persist.

---

### Q2: Where should the inline theme script live?

| Option | Description | Selected |
|--------|-------------|----------|
| Inline in app/layout.tsx <head> | dangerouslySetInnerHTML <script> runs synchronously before paint. Standard FOUC prevention pattern. | ✓ |
| In a separate Script component | Next.js <Script strategy="beforeInteractive">. More declarative but adds dependency. | |

**User's choice:** Inline in layout.tsx `<head>`
**Notes:** Simpler, standard approach.

---

### Q3: How should ThemeToggle manage state?

| Option | Description | Selected |
|--------|-------------|----------|
| Direct DOM manipulation | Reads/writes document.documentElement.dataset.theme + localStorage. No React state or context. SSR-safe. | ✓ |
| React context provider | ThemeProvider wraps the app, exposes useTheme() hook. More React-idiomatic. | |
| You decide | Let researcher recommend based on GlobalContext pattern. | |

**User's choice:** Direct DOM manipulation
**Notes:** Simpler, avoids SSR hydration concerns.

---

## Existing Component Fate

### Q1: What happens to existing components during Phase 1?

| Option | Description | Selected |
|--------|-------------|----------|
| Preserve them | shadcn variable names kept, values change. Components render with new colors/fonts. Site stays functional. | ✓ |
| Delete them now | Remove old components, app/page.tsx shows placeholder. Phases 2–5 build fresh. | |
| You decide | Let Claude decide based on development experience. | |

**User's choice:** Preserve existing components
**Notes:** Clean slate would make verification harder; preserving allows visual diff checking.

---

### Q2: Should font swap happen immediately?

| Option | Description | Selected |
|--------|-------------|----------|
| Swap immediately | Remove Geist, load Inter/JetBrains Mono/Fraunces in Phase 1. Existing components render in new fonts right away. | ✓ |
| Keep Geist alongside | Add new fonts as additional CSS variables; existing components switch when rebuilt. | |

**User's choice:** Swap immediately
**Notes:** Minor visual disruption during development is acceptable.

---

## Tech Debt Scope

### Q1: Beyond the 5 required TDs, how should adjacent CONCERNS.md issues be handled?

| Option | Description | Selected |
|--------|-------------|----------|
| Opportunistic: fix anything under 10 lines | Include quick wins: remove conflicting revalidate export, dead code deletion, add "use client" directives. | |
| Strict: TD-01 through TD-05 only | Fix exactly what's required. Scope stays predictable. | ✓ |
| Extended: fix all CONCERNS.md issues | All concerns including dependency updates and security fixes. | |

**User's choice:** Strict — TD-01 through TD-05 only
**Notes:** Keeps phase goal tight and verifiable.

---

### Q2: Should /api/sanity-data route be kept or deleted after TD-02 fix?

| Option | Description | Selected |
|--------|-------------|----------|
| Keep the route | May be useful for debugging. sanityDataLoader.ts just stops calling it. | |
| Delete the route entirely | Becomes dead code after TD-02. Fewer moving parts. | ✓ |
| You decide | Let researcher assess external dependencies first. | |

**User's choice:** Delete the route entirely
**Notes:** If nothing external depends on it, removal is cleaner.

---

## Claude's Discretion

None — all gray areas had explicit user choices.

## Deferred Ideas

- Opportunistic CONCERNS.md fixes (conflicting `revalidate` export, `@types/react` v19, dead code, `"use client"` additions) — explicitly kept out of Phase 1 scope.
- `app/api/sanity-config/route.ts` security concern — not addressed in Phase 1.
