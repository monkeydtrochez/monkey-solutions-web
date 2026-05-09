# Phase 2: Header + Hero — Research

**Researched:** 2026-05-09
**Domain:** Next.js App Router component authoring, Sanity schema extension, CSS token application, React context hydration
**Confidence:** HIGH — all findings verified against live codebase; no library API research required (stack pre-established in Phase 1)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Add `heroBio: string` to `sanity/schemaTypes/profile.ts`. This is the only schema change in Phase 2.
- **D-02:** The hero lede paragraph reads `profile.heroBio` from GlobalContext. If the field is null or empty, show nothing — no hardcoded fallback.
- **D-03:** All other hero copy is hardcoded per the UI-SPEC copywriting contract: H1, status row, terminal content, trust stats, and CTA labels. These do not need CMS control.
- **D-04:** `heroBio` must be added to the GROQ query projection in `lib/api/sanityDataLoader.ts` and to the TypeScript profile type in `app/models/sanityTypes.ts`.
- **D-05:** Delete the old component files: `BusinessCard.tsx`, `CV.tsx`, `Profile.tsx`, `ProfileIntro.tsx`, `ProjectDetails.tsx`, `Projects.tsx`, `Skills.tsx`, `WorkExperience.tsx`, `WorkExperienceItem.tsx`, `Education.tsx`. Clean slate — only Phase 2 components render.
- **D-06:** Remove the temporary `<ThemeToggle />` from `app/page.tsx` (Phase 1 temp placement). The toggle moves into `SiteHeader`.
- **D-07:** Nav links (`#about`, `#work`, `#experience`, `#skills`, `#contact`) are written as-is in the header. They remain dead links until Phases 3–5 add their respective section IDs. No placeholder sections needed.
- **D-08:** Data hydration architecture (how Sanity data reaches GlobalContext without the old SiteWrapper) is Claude's discretion. The planner should design the cleanest approach.
- **D-09:** `SiteHeader` and `HeroSection` both live in `app/page.tsx`. No changes to `app/layout.tsx` beyond what Phase 1 established.

### Claude's Discretion

- How to hydrate GlobalContext with Sanity data now that old `SiteWrapper` is removed — planner decides the cleanest wrapper/provider approach
- Whether `QueryClientWrapper` is retained, refactored, or removed in Phase 2 (TanStack Query may still be needed by later phases)
- Exact `<main>` element placement (in `page.tsx` wrapping `HeroSection`, or in `layout.tsx` wrapping `{children}`)

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| NAV-01 | Sticky header with logo, numbered anchor links (01–05), dark/light theme toggle, hire CTA button | Component structure, `SiteHeader` as `"use client"`, sticky CSS via Tailwind `sticky top-0 z-50` |
| NAV-02 | Hire CTA button includes a pulsing orange status dot animation | `ms-pulse` keyframe already declared in globals.css; `StatusDot` component activates it |
| NAV-03 | Header background uses backdrop blur with semi-transparent theme color | `backdrop-blur-md` Tailwind class + hardcoded rgba background per UI-SPEC |
| HERO-01 | Hero H1 mixes font weights and includes Fraunces italic editorial accent | `font-display` Tailwind class, `font-sans` with `font-bold`/`font-normal`, `italic` utility |
| HERO-02 | Terminal status card shows whoami, role, availability, stack chips, blinking cursor | `ms-cursor` keyframe already declared; `TerminalCard` as server component |
| HERO-03 | Primary "Start a project" CTA and secondary "View work" CTA in the hero | Custom `<a>` elements styled with design tokens; no shadcn components needed |
| HERO-04 | Trust strip with 4 stats and orange accent characters | CSS grid 4 columns, orange `<span>` wrappers for `+` and `%` characters |
</phase_requirements>

---

## Summary

Phase 2 is a component-authoring phase — no new libraries, no new infrastructure. The technology stack (Next.js 14 App Router, TypeScript, Tailwind v4, shadcn, design tokens) is fully established. Every keyframe animation, CSS variable, and font is pre-loaded from Phase 1. The work is: write four new components (`SiteHeader`, `HeroSection`, `StatusDot`, `TerminalCard`), refactor `ThemeToggle` markup, extend the Sanity schema and data layer by one field, delete all legacy components, and restructure `page.tsx` into a clean new shell.

The most significant architectural question is GlobalContext hydration: the old `SiteWrapper` (a client component that called `setSiteContentToContext` in a `useEffect`) is being deleted. The planner must design a replacement approach. The recommended pattern is an inline client wrapper in `page.tsx` — a thin `DataHydrator` component that accepts Sanity data as a prop and calls `setSiteContentToContext` on mount, preserving the server-fetches-data / client-hydrates-context split without modifying `layout.tsx`.

**Critical finding — spacing token mismatch:** The UI-SPEC was authored with a simplified 7-token spacing scale (e.g., `--space-2: 8px`, `--space-5: 32px`, `--space-7: 64px`). The globals.css actually implemented in Phase 1 uses a 22-token scale with entirely different values (`--space-2: 6px`, `--space-5: 12px`, `--space-7: 16px`). The executor must NOT use UI-SPEC token names directly — they must read actual pixel values from the UI-SPEC and find the matching token in the real globals.css scale, or use Tailwind utilities (e.g., `p-8` for 32px) instead of CSS variable names.

**Primary recommendation:** Build all four components using Tailwind utility classes and inline `style={{ var(--token) }}` for values not in the Tailwind scale. Do not reference `--space-N` by name without verifying the actual value in globals.css.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Sticky header rendering | Frontend Server (SSR) → Client | — | `SiteHeader` must be `"use client"` because it contains `ThemeToggle` (DOM manipulation + `localStorage`) |
| Theme toggle interaction | Browser / Client | — | Reads/writes `document.documentElement.dataset.theme` and `localStorage` — cannot be server-rendered |
| Hero section rendering | Frontend Server (SSR) | — | `HeroSection` has no client state; all content is static or read from context props passed down from page.tsx |
| Terminal card rendering | Frontend Server (SSR) | — | Purely decorative/static markup; CSS animation via class name |
| Sanity data fetching | Frontend Server (SSR) | — | `page.tsx` is a server component; `loadSanityData()` runs at request time |
| GlobalContext hydration | Browser / Client | — | Context requires `useEffect` to propagate data — handled by thin client wrapper |
| Sanity schema extension | Database / Storage | — | Edit to `sanity/schemaTypes/profile.ts` and redeployment of Sanity Studio |

---

## Standard Stack

No new packages required in Phase 2. All libraries are pre-installed.

### Already Installed (verify before adding)

| Library | Installed | Purpose in Phase 2 |
|---------|-----------|---------------------|
| Next.js (App Router) | Yes | `page.tsx` server component, `"use client"` boundary |
| TypeScript | Yes | Type extensions to `Profile` interface |
| Tailwind v4 | Yes | All layout/spacing/typography utilities |
| `@sanity/client` | Yes | GROQ query extension for `heroBio` |
| shadcn (badge, button, card) | Yes | NOT used directly in Phase 2 — custom elements only |
| `lucide-react` | Yes | Available but not needed in Phase 2 per UI-SPEC |
| `@tanstack/react-query` | Yes | Retained in `QueryClientWrapper`; not used by Phase 2 components |

**Installation:** No `npm install` commands needed for this phase. [VERIFIED: codebase grep]

---

## Architecture Patterns

### System Architecture Diagram

```
Request
  │
  ▼
page.tsx (server component)
  │  calls loadSanityData() → Sanity GROQ (includes heroBio)
  │  returns SanityApiResponse[]
  │
  ├──► <DataHydrator data={data} />  (client component — thin wrapper)
  │       │  useEffect → setSiteContentToContext(data)
  │       │  (populates GlobalContext.profile including heroBio)
  │
  ├──► <SiteHeader />  (client component — ThemeToggle lives here)
  │       │  localStorage ←→ document.documentElement.dataset.theme
  │
  └──► <main>
         └──► <HeroSection />  (server component)
                │  useContext(GlobalContext) → profile.heroBio
                │
                ├── Hero left column (H1, lede, CTAs)
                ├── <TerminalCard />  (server component — static markup)
                └── Trust strip (static markup)
```

### Recommended Project Structure

```
components/
├── SiteHeader.tsx          # "use client" — sticky header, nav, ThemeToggle, hire CTA
├── HeroSection.tsx         # server component — hero grid, lede, CTAs, trust strip
├── TerminalCard.tsx        # server component — terminal UI block
├── ThemeToggle.tsx         # "use client" — pill markup replaces fixed button (logic unchanged)
├── ui/
│   └── StatusDot.tsx       # server component — 8×8 orange dot with optional pulse ring
└── wrappers/
    ├── QueryClientWrapper.tsx  # retained (needed by later phases)
    ├── DataHydrator.tsx        # NEW "use client" — replaces SiteWrapper hydration role
    └── SiteWrapper.tsx         # DELETED in Phase 2 (legacy)
```

### Pattern 1: GlobalContext Hydration Without SiteWrapper

**What:** A minimal `DataHydrator` client component accepts server-fetched Sanity data as a prop and pushes it into `GlobalContext` via `useEffect`. This replaces `SiteWrapper`'s hydration role while removing all the layout/overflow/animation state that `SiteWrapper` also managed (which is now defunct).

**When to use:** Whenever a server component needs to seed a client-side context with server-fetched data without mixing layout concerns.

```tsx
// components/wrappers/DataHydrator.tsx
"use client";
import { useContext, useEffect } from "react";
import GlobalContext from "@/app/context/GlobalContext";
import { SanityApiResponse } from "@/app/models/sanityTypes";

export default function DataHydrator({ data }: { data: SanityApiResponse[] }) {
  const ctx = useContext(GlobalContext);
  useEffect(() => {
    ctx?.setSiteContentToContext(data);
  }, [data, ctx]);
  return null;  // renders nothing — side-effect only
}
```

```tsx
// app/page.tsx (new structure)
import { loadSanityData } from "@/lib/api/sanityDataLoader";
import DataHydrator from "@/components/wrappers/DataHydrator";
import QueryClientWrapper from "@/components/wrappers/QueryClientWrapper";
import SiteHeader from "@/components/SiteHeader";
import HeroSection from "@/components/HeroSection";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await loadSanityData();
  return (
    <QueryClientWrapper>
      <DataHydrator data={data} />
      <SiteHeader />
      <main>
        <HeroSection />
      </main>
    </QueryClientWrapper>
  );
}
```

[VERIFIED: codebase — based on existing SiteWrapper pattern in `components/wrappers/SiteWrapper.tsx`]

### Pattern 2: ThemeToggle Markup Replacement

**What:** The existing `ThemeToggle.tsx` logic (`document.documentElement.dataset.theme`, `localStorage.setItem`) is correct and must be preserved exactly. Only the JSX markup changes: the fixed-position `<button>` becomes a pill container with two `<button>` elements.

**Key concern:** The active/inactive state must be tracked in React state so the correct button gets the active styling. Read `document.documentElement.dataset.theme` on mount to initialize state.

```tsx
// components/ThemeToggle.tsx — new markup skeleton
"use client";
import { useState, useEffect } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    // Read current theme from DOM (set by no-FOUC script)
    const current = (document.documentElement.dataset.theme as "dark" | "light") || "dark";
    setTheme(current);
  }, []);

  function applyTheme(next: "dark" | "light") {
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("ms_theme", next); } catch {}
    setTheme(next);
  }

  // Pill container + two buttons per UI-SPEC
  return (
    <div style={{ borderRadius: "20px", border: "1px solid var(--ms-border)", padding: "2px", display: "flex" }}>
      <button
        onClick={() => applyTheme("dark")}
        aria-label="Switch to dark theme"
        style={{
          borderRadius: "18px",
          padding: "8px 16px",
          background: theme === "dark" ? "var(--ms-fg)" : "transparent",
          color: theme === "dark" ? "var(--ms-bg)" : "var(--ms-fg-soft)",
          fontSize: "var(--text-label)",
          border: "none",
          cursor: "pointer",
          transition: "background-color 0.2s, color 0.2s",
        }}
      >
        <span aria-hidden>☾</span> dark
      </button>
      <button
        onClick={() => applyTheme("light")}
        aria-label="Switch to light theme"
        style={{
          borderRadius: "18px",
          padding: "8px 16px",
          background: theme === "light" ? "var(--ms-fg)" : "transparent",
          color: theme === "light" ? "var(--ms-bg)" : "var(--ms-fg-soft)",
          fontSize: "var(--text-label)",
          border: "none",
          cursor: "pointer",
          transition: "background-color 0.2s, color 0.2s",
        }}
      >
        <span aria-hidden>☀</span> light
      </button>
    </div>
  );
}
```

[VERIFIED: codebase — existing logic in `components/ThemeToggle.tsx`]

### Pattern 3: Sticky Header with Backdrop Blur

**What:** CSS sticky positioning with `backdrop-filter: blur()`. Tailwind v4 has `backdrop-blur-md` = `blur(12px)`. Background must be hardcoded rgba (not a design token) per UI-SPEC.

```tsx
// SiteHeader outer element
<header
  className="sticky top-0 z-50"
  style={{
    background: "rgba(13,11,9,0.78)",  // dark theme value; swap in light via data-theme CSS
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid var(--ms-border)",
  }}
>
```

For light theme background switch, use a CSS class defined in globals.css rather than inline style, so data-theme selectors can override it cleanly.

[VERIFIED: codebase — `globals.css` has `--ms-bg: #0d0b09` dark, `--ms-bg: #f7f4ee` light; hardcoded rgba values confirmed in UI-SPEC]

### Pattern 4: Cursor Blink Animation

**What:** The `ms-cursor` keyframe is already declared in `globals.css`. Apply it to a `<span>` with `border-right: 7px solid var(--ms-orange)`.

**Critical:** The reduced-motion rule in globals.css targets `[class*="ms-cursor"]`. The cursor span's class name **must contain "ms-cursor"** for the rule to fire.

```tsx
// Correct — reduced-motion fires
<span className="ms-cursor" style={{
  borderRight: "7px solid var(--ms-orange)",
  paddingRight: "1px",
  animation: "ms-cursor 1.1s step-end infinite",
}}>_</span>

// Wrong — reduced-motion does NOT fire
<span style={{ animation: "ms-cursor 1.1s step-end infinite", ... }}>_</span>
```

[VERIFIED: codebase — `globals.css` line 161: `[class*="ms-cursor"] { animation: none; }`]

### Anti-Patterns to Avoid

- **Referencing UI-SPEC token names by number without checking globals.css:** The UI-SPEC spacing table uses names like `--space-2: 8px` but globals.css has `--space-2: 6px`. Never copy a token name from the UI-SPEC without verifying the actual value in globals.css.
- **Making HeroSection a client component:** `HeroSection` reads from GlobalContext via `useContext` — but only for the optional `heroBio` lede. Use a pattern where `page.tsx` reads context and passes `heroBio` as a prop down to `HeroSection`, OR make `HeroSection` a client component only if needed. The simpler approach is to make `HeroSection` a client component that reads context directly.
- **Adding `"use client"` to TerminalCard:** `TerminalCard` is purely static markup with a CSS animation. It does not need `"use client"`.
- **Modifying `app/layout.tsx`:** D-09 forbids this. Data hydration must be handled inside `page.tsx`.
- **Using shadcn `<Button>` or `<Badge>` for hero/header CTAs:** UI-SPEC explicitly requires custom `<a>` elements styled with design tokens. Shadcn components would produce wrong visual output.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Theme persistence without FOUC | Custom script | Existing no-FOUC inline script in `layout.tsx` | Already implemented in Phase 1; re-implementing risks breaking the SSR-safe pattern |
| CSS animation for cursor/pulse | Custom keyframe | `ms-cursor` / `ms-pulse` in globals.css | Already declared; adding new keyframes creates duplicates |
| Font loading | `@font-face` | `next/font` variables in `layout.tsx` | Already set up in Phase 1; fonts available via `--font-sans`, `--font-mono`, `--font-display` |
| Sanity client creation | `createClient()` directly | `createClientFromParam()` from `app/sanityClient.ts` | Project pattern; centralized config |

---

## Critical Finding: Spacing Token Mismatch

**This is the most important risk for the executor. The planner must surface this explicitly in every task that references spacing.**

### What the UI-SPEC says

The UI-SPEC (approved 2026-05-09) defines a 7-token spacing scale:
```
--space-1: 4px    --space-2: 8px    --space-3: 16px   --space-4: 24px
--space-5: 32px   --space-6: 48px   --space-7: 64px
```

### What globals.css actually has

[VERIFIED: codebase — `app/globals.css` lines 108–113]

```css
--space-1:  4px;  --space-2:  6px;  --space-3:  8px;  --space-4:  10px;
--space-5:  12px; --space-6:  14px; --space-7:  16px; --space-8:  18px;
--space-9:  20px; --space-10: 24px; --space-11: 28px; --space-12: 32px;
--space-13: 36px; --space-14: 40px; --space-15: 48px; --space-16: 56px;
--space-17: 64px; --space-18: 72px; --space-19: 80px; --space-20: 96px;
--space-21: 120px; --space-22: 140px;
```

### Token name remapping table

Use this table to translate UI-SPEC token names to the actual token names in globals.css:

| UI-SPEC says | Pixel value | Actual token in globals.css | Tailwind alternative |
|---|---|---|---|
| `--space-1` | 4px | `--space-1` | `p-1` / `gap-1` |
| `--space-2` | 8px | `--space-3` | `p-2` / `gap-2` |
| `--space-3` | 16px | `--space-7` | `p-4` / `gap-4` |
| `--space-4` | 24px | `--space-10` | `p-6` / `gap-6` |
| `--space-5` | 32px | `--space-12` | `p-8` / `gap-8` |
| `--space-6` | 48px | `--space-15` | `p-12` / `gap-12` |
| `--space-7` | 64px | `--space-17` | `p-16` / `gap-16` |

**Recommendation for executor:** Use Tailwind spacing utilities (`p-4`, `gap-8`, etc.) rather than `var(--space-N)` CSS variable names. Tailwind's default scale (`1 = 4px`, `2 = 8px`, `4 = 16px`, etc.) matches the UI-SPEC pixel values directly and avoids the token name confusion entirely.

---

## Data Layer Changes

### Files that must be modified

**1. `sanity/schemaTypes/profile.ts`** — Add `heroBio` field

```ts
defineField({
  name: 'heroBio',
  title: 'Hero Bio',
  type: 'string',
  description: 'Short lede paragraph displayed in the hero section.',
}),
```

**2. `app/models/sanityTypes.ts`** — Add `heroBio` to `Profile` interface

```ts
export interface Profile extends BaseType {
  // ... existing fields ...
  heroBio?: string;  // optional — lede shows nothing if unset (D-02)
}
```

**3. `lib/api/sanityDataLoader.ts`** — Add `heroBio` to GROQ profile projection

```
_type == 'profile' => {
  profilePicture,
  description,
  languages,
  mobile,
  email,
  location,
  personalitySkills,
  professionalSkills,
  linkedInUrl,
  githubUrl,
  heroBio          // ← add this
},
```

**4. `app/context/GlobalContext.tsx`** — The `Profile` type already flows through; adding `heroBio?` to the type is sufficient. No context logic changes needed — `profile.heroBio` is available via the existing `profile` state.

[VERIFIED: codebase — `GlobalContext.tsx` stores `Profile | null` as `profile` state; type update propagates automatically]

---

## Files to Delete (D-05)

These files exist and must be deleted: [VERIFIED: codebase — `ls components/`]

| File | Path |
|------|------|
| BusinessCard.tsx | `components/BusinessCard.tsx` |
| CV.tsx | `components/CV.tsx` |
| Profile.tsx | `components/Profile.tsx` |
| ProfileIntro.tsx | `components/ProfileIntro.tsx` |
| ProjectDetails.tsx | `components/ProjectDetails.tsx` |
| Projects.tsx | `components/Projects.tsx` |
| Skills.tsx | `components/Skills.tsx` |
| WorkExperience.tsx | `components/WorkExperience.tsx` |
| WorkExperienceItem.tsx | `components/WorkExperienceItem.tsx` |
| Education.tsx | `components/Education.tsx` |
| SiteWrapper.tsx | `components/wrappers/SiteWrapper.tsx` |
| SocialMediaButtons.tsx | `components/wrappers/SocialMediaButtons.tsx` (not in D-05 but orphaned after deletions) |

**Note on `SocialMediaButtons.tsx`:** This file exists in `components/wrappers/` but is not listed in D-05. The planner should decide whether to delete it (it is orphaned after `SiteWrapper` removal) or leave it for later phases. It is not imported by any Phase 2 component.

**Note on `QueryClientWrapper.tsx`:** Must NOT be deleted. Retained for later phases (TanStack Query). (Claude's Discretion, D-08 adjacent)

---

## GlobalContext Cleanup Opportunity (Claude's Discretion)

The current `GlobalContext` contains state and handlers for the old SPA navigation model (`showCV`, `showProjects`, `animateCard`, `handleViewCV`, `handleViewProjects`, `handleBackButton`, `toggleCardAnimation`). These will become dead code after Phase 2 deletes all old components.

**Recommendation:** Remove these stale fields from `GlobalContext` in Phase 2 as part of the clean-slate operation. Leaving them creates noise and misleads future phases. The slimmed context needs only: `profile`, `education`, `workExperience`, `projects`, `setSiteContentToContext`.

This is Claude's discretion (D-08 area). The planner should decide and include it explicitly in a task.

---

## Animation Contracts — Confirmed in Codebase

Both keyframes needed by Phase 2 are already declared. [VERIFIED: codebase — `globals.css` lines 145–162]

| Animation | Keyframe name | Duration token | Applied to |
|-----------|--------------|----------------|------------|
| Status dot pulse | `ms-pulse` | `--anim-pulse` = `2.2s` | `StatusDot` component (header hire CTA + hero status row) |
| Terminal cursor blink | `ms-cursor` | `--anim-cursor` = `1.1s` | Cursor `<span>` in `TerminalCard` |

Reduced-motion rule present:
```css
@media (prefers-reduced-motion: reduce) {
  .animate-pulse, [class*="ms-cursor"] { animation: none; }
}
```

**Executor must:** Give the cursor span a class containing `"ms-cursor"` (e.g., `className="ms-cursor"`). The reduced-motion rule matches on `[class*="ms-cursor"]`, not on the keyframe name.

---

## Common Pitfalls

### Pitfall 1: Using UI-SPEC Token Names Directly
**What goes wrong:** Executor writes `gap: var(--space-5)` expecting 32px but gets 12px, causing broken spacing.
**Why it happens:** The UI-SPEC was authored with a simplified 7-token naming convention that does not match what Phase 1 actually put in globals.css.
**How to avoid:** Always look up pixel values from the UI-SPEC, then find the matching token in globals.css, or use Tailwind utilities which match the UI-SPEC pixel values via Tailwind's standard scale.
**Warning signs:** Layout looks compressed; gaps visually smaller than the design.

### Pitfall 2: HeroSection Needs Context But Is a Server Component
**What goes wrong:** `HeroSection` calls `useContext(GlobalContext)` but is not marked `"use client"`, causing a build error.
**Why it happens:** `GlobalContext` is a React context; reading it requires `useContext` which is a client-side hook.
**How to avoid:** Either (a) mark `HeroSection` as `"use client"` — acceptable because it has no SSR-critical data, or (b) pass `heroBio` as a prop from `page.tsx` where it can be read after `DataHydrator` has fired. Option (b) has a race condition risk (context not hydrated on first render). The simplest correct solution is (a): mark `HeroSection` `"use client"`.
**Warning signs:** "useContext is not a function" or "useState cannot be called" build errors.

### Pitfall 3: SiteHeader Backdrop Blur Theme Color Switching
**What goes wrong:** Header background doesn't switch between dark (`rgba(13,11,9,0.78)`) and light (`rgba(247,244,238,0.82)`) when theme toggles.
**Why it happens:** Inline `style` attributes cannot be overridden by `data-theme` CSS selectors — only `className`-applied styles can.
**How to avoid:** Define two CSS classes in globals.css:
```css
[data-theme="dark"] .header-bg { background: rgba(13,11,9,0.78); }
[data-theme="light"] .header-bg { background: rgba(247,244,238,0.82); }
```
Apply `className="header-bg"` to the `<header>` element.
**Warning signs:** Header stays dark-colored even after switching to light theme.

### Pitfall 4: TypeScript Build Errors from Deleted Components
**What goes wrong:** Deleting component files before removing their imports from `page.tsx` (or other files) causes TypeScript/build errors.
**Why it happens:** The current `page.tsx` imports `BusinessCard`, `CV`, `Projects`, `SiteWrapper`, and `QueryClientWrapper` (some of which are being deleted).
**How to avoid:** Rewrite `page.tsx` first (or simultaneously) with all imports removed. Delete component files after `page.tsx` no longer imports them.
**Warning signs:** Module not found errors during `npm run build`.

### Pitfall 5: GlobalContext heroBio Race on First Render
**What goes wrong:** `HeroSection` renders before `DataHydrator`'s `useEffect` fires, so `profile.heroBio` is `null` on first render even if data is available.
**Why it happens:** `useEffect` runs after render; context is null at first paint.
**How to avoid:** D-02 already handles this: "If the field is null or empty, show nothing." The lede paragraph is conditionally rendered only when `heroBio` is truthy. No loading spinner needed.
**Warning signs:** Lede paragraph flashes in after a short delay (acceptable per D-02).

---

## Environment Availability

Step 2.6: SKIPPED — Phase 2 is a code/config-only change. All runtime dependencies (Node.js, Next.js, Sanity) are pre-established and confirmed working from Phase 1. No new external tools, databases, or CLIs are introduced.

The one exception is **Sanity Studio deployment** for the `heroBio` schema field. This requires running `cd sanity && npm run deploy` — but this is a content management step, not a blocking code dependency. The field can be added to the schema and deployed after the code changes land.

---

## Validation Architecture

`workflow.nyquist_validation` is not set in `.planning/config.json` — treated as enabled.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None configured |
| Config file | None — CLAUDE.md states "There are no tests configured" |
| Quick run command | `npm run build` (type-check + compilation) |
| Full suite command | `npm run build && npm run lint` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | Notes |
|--------|----------|-----------|-------------------|-------|
| NAV-01 | Sticky header renders with logo, nav, theme toggle, hire CTA | Visual/manual | `npm run build` (compile check) | No automated UI test available |
| NAV-02 | Hire CTA has pulsing orange dot | Visual/manual | `npm run build` | Animation verified by inspection |
| NAV-03 | Header backdrop blur | Visual/manual | `npm run build` | Browser-rendered effect |
| HERO-01 | H1 with mixed weights and Fraunces italic | Visual/manual | `npm run build` | Font rendering verified by inspection |
| HERO-02 | Terminal card with blinking cursor | Visual/manual | `npm run build` | CSS animation verified by inspection |
| HERO-03 | Primary + secondary CTAs present | Visual/manual | `npm run build` | Link elements compile-verified |
| HERO-04 | Trust strip with 4 stats | Visual/manual | `npm run build` | Verified by inspection |

### Sampling Rate

- **Per task commit:** `npm run build` (catches TypeScript and import errors)
- **Per wave merge:** `npm run build && npm run lint`
- **Phase gate:** `npm run build` green + visual browser inspection at `localhost:3000`

### Wave 0 Gaps

No test infrastructure to create — no testing framework configured and CLAUDE.md confirms this is intentional. The "test" for this phase is: `npm run build` succeeds and the page renders correctly at `localhost:3000`.

---

## Security Domain

This phase introduces no authentication, user input, external API calls, or sensitive data flows. The only data handled is Sanity CMS content (static text). No ASVS categories apply.

The `heroBio` field is a plain string read from Sanity and rendered as text content — no `dangerouslySetInnerHTML`, no user-controlled input, no XSS surface.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `SocialMediaButtons.tsx` is orphaned after `SiteWrapper` deletion and has no other importers | Files to Delete | Low — if it is imported elsewhere, the build will catch it immediately |
| A2 | Making `HeroSection` a `"use client"` component is the simplest correct approach for context reading | Architecture Patterns | Low — alternative (prop drilling from page.tsx) also works; either is valid |

---

## Open Questions

1. **GlobalContext stale state fields**
   - What we know: `showCV`, `showProjects`, `animateCard`, and related handlers become dead code after Phase 2
   - What's unclear: Whether the planner wants to clean these up in Phase 2 or defer to a future "context refactor" task
   - Recommendation: Clean up in Phase 2 as part of the D-05 clean slate — the context is tightly coupled to the deleted components

2. **SocialMediaButtons.tsx fate**
   - What we know: The file exists in `components/wrappers/SocialMediaButtons.tsx`; it is not in D-05's deletion list; it is used by `SiteWrapper` which is being deleted
   - What's unclear: Whether it's needed by later phases
   - Recommendation: Delete it in Phase 2 unless the planner has a specific later-phase use

3. **`<main>` element placement**
   - What we know: UI-SPEC shows `<main>` wrapping `<section id="top">` in the page structure; current `layout.tsx` has no `<main>` — only a `<footer>`
   - What's unclear: Claude's Discretion item — whether `<main>` goes in `page.tsx` wrapping `HeroSection` or in `layout.tsx` wrapping `{children}`
   - Recommendation: Place `<main>` in `page.tsx` (not `layout.tsx`) — it makes the page's content landmark explicit at the page level, and avoids modifying `layout.tsx` per D-09

---

## Sources

### Primary (HIGH confidence)
- `app/globals.css` — all token values, keyframes, reduced-motion rule; read directly
- `components/wrappers/SiteWrapper.tsx` — existing hydration pattern; read directly
- `components/ThemeToggle.tsx` — existing toggle logic; read directly
- `app/context/GlobalContext.tsx` — context shape and `setSiteContentToContext` pattern; read directly
- `app/page.tsx` — current structure being replaced; read directly
- `app/layout.tsx` — what Phase 1 established; read directly
- `lib/api/sanityDataLoader.ts` — GROQ query structure; read directly
- `sanity/schemaTypes/profile.ts` — schema shape; read directly
- `app/models/sanityTypes.ts` — TypeScript types; read directly
- `.planning/phases/02-header-hero/02-UI-SPEC.md` — approved visual contract; read directly
- `.planning/phases/02-header-hero/02-CONTEXT.md` — locked decisions; read directly

### Secondary (MEDIUM confidence)
- None required — all research is codebase-internal

### Tertiary (LOW confidence — assumed)
- [ASSUMED] Tailwind v4 `backdrop-blur-md` = `blur(12px)` — standard Tailwind documentation

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new libraries; all confirmed installed
- Architecture: HIGH — patterns derived from existing code in the repo
- Pitfalls: HIGH — most are verifiable mismatches between UI-SPEC and globals.css (token mismatch confirmed by direct file comparison)
- Data layer changes: HIGH — all three files examined and change locations identified

**Research date:** 2026-05-09
**Valid until:** Phase is actively being planned; no external dependencies means research remains valid until codebase changes.
