# Phase 2: Header + Hero - Pattern Map

**Mapped:** 2026-05-09
**Files analyzed:** 11 (4 new components, 5 data-layer modifications, 1 page restructure, 1 toggle refactor)
**Analogs found:** 10 / 11

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `components/wrappers/DataHydrator.tsx` | wrapper/provider | request-response (side-effect only) | `components/wrappers/SiteWrapper.tsx` | role-match (hydration subset) |
| `components/SiteHeader.tsx` | component | event-driven | `components/ThemeToggle.tsx` + `components/BusinessCard.tsx` | partial (client + context) |
| `components/HeroSection.tsx` | component | request-response | `components/BusinessCard.tsx` | role-match (context reader) |
| `components/TerminalCard.tsx` | component | static | `components/ui/card.tsx` | partial (no analog — purely static) |
| `components/ui/StatusDot.tsx` | component | static | `components/ui/badge.tsx` | partial |
| `components/ThemeToggle.tsx` | component | event-driven | self (logic unchanged, markup replaced) | exact (self-refactor) |
| `app/page.tsx` | route/page | request-response | self (restructure) | exact (self-refactor) |
| `app/context/GlobalContext.tsx` | provider/store | CRUD | self (slim down stale state) | exact (self-refactor) |
| `sanity/schemaTypes/profile.ts` | config/schema | CRUD | self (additive change) | exact |
| `app/models/sanityTypes.ts` | model | transform | self (additive change) | exact |
| `lib/api/sanityDataLoader.ts` | service | request-response | self (additive change) | exact |

---

## Pattern Assignments

### `components/wrappers/DataHydrator.tsx` (new — wrapper, request-response)

**Analog:** `components/wrappers/SiteWrapper.tsx`

**Imports pattern** (`SiteWrapper.tsx` lines 1–4):
```tsx
"use client";
import GlobalContext from "@/app/context/GlobalContext";
import { SanityApiResponse } from "@/app/models/sanityTypes";
import React, { useContext, useEffect } from "react";
```

**Core hydration pattern** (`SiteWrapper.tsx` lines 6–22):
```tsx
export default function SiteWrapper({
  data,
  children,
}: {
  data: SanityApiResponse[];
  children: React.ReactNode;
}) {
  const globalContext = useContext(GlobalContext);
  const { setSiteContentToContext } = globalContext ?? {};

  useEffect(() => {
    if (setSiteContentToContext) {
      setSiteContentToContext(data as SanityApiResponse[]);
    }
  }, [data, setSiteContentToContext]);
```

**What to keep vs. strip:** `DataHydrator` retains only the `useEffect` hydration block (lines 18–22). Strip: `children`, layout div wrappers (lines 41–44), overflow/animation `useEffect` (lines 24–34), `showCV`/`showProjects` destructuring (line 16). Return `null` — no JSX output.

**New file shape:**
```tsx
"use client";
import { useContext, useEffect } from "react";
import GlobalContext from "@/app/context/GlobalContext";
import { SanityApiResponse } from "@/app/models/sanityTypes";

export default function DataHydrator({ data }: { data: SanityApiResponse[] }) {
  const ctx = useContext(GlobalContext);
  useEffect(() => {
    ctx?.setSiteContentToContext(data);
  }, [data, ctx]);
  return null;
}
```

---

### `components/SiteHeader.tsx` (new — component, event-driven)

**Analog:** `components/BusinessCard.tsx` (client component reading context) + `components/ThemeToggle.tsx` (client DOM interaction)

**Directive:** Must be `"use client"` because it contains `ThemeToggle` which reads/writes `localStorage` and `document.documentElement.dataset.theme`.

**Imports pattern** (derived from `BusinessCard.tsx` lines 1–7):
```tsx
"use client";
import { useContext } from "react";
import GlobalContext from "@/app/context/GlobalContext";
import { ThemeToggle } from "@/components/ThemeToggle";
```

**Sticky header with backdrop blur** — use a CSS class for theme-switchable background (not inline style) so `data-theme` selectors can override it. Define in `globals.css`:
```css
[data-theme="dark"]  .header-bg { background: rgba(13,11,9,0.78); }
[data-theme="light"] .header-bg { background: rgba(247,244,238,0.82); }
```

Apply to the `<header>` element:
```tsx
<header
  className="header-bg sticky top-0 z-50"
  style={{
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid var(--ms-border)",
  }}
>
```

**Nav link pattern** — plain `<a>` anchors per UI-SPEC (no shadcn `<Button>`):
```tsx
<nav>
  <a href="#about" style={{ color: "var(--ms-fg-soft)", fontSize: "var(--text-label)" }}>
    <span style={{ color: "var(--ms-orange)" }}>01.</span> About
  </a>
  {/* ... repeat for #work, #experience, #skills, #contact */}
</nav>
```

**StatusDot inside hire CTA** (`ms-pulse` animation already in `globals.css` lines 145–148):
```tsx
{/* StatusDot usage — pulse ring absolutely positioned behind dot */}
<span style={{ position: "relative", display: "inline-flex", width: 8, height: 8 }}>
  <span
    className="animate-pulse"
    style={{
      position: "absolute", inset: 0, borderRadius: "50%",
      background: "var(--ms-orange)", opacity: 0.75,
      animation: `ms-pulse var(--anim-pulse) ease-out infinite`,
    }}
  />
  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--ms-orange)" }} />
</span>
```

---

### `components/HeroSection.tsx` (new — component, request-response)

**Analog:** `components/BusinessCard.tsx`

**Context read pattern** (`BusinessCard.tsx` lines 11–17):
```tsx
"use client";  // required because useContext is a client hook
import { useContext } from "react";
import GlobalContext from "@/app/context/GlobalContext";

const HeroSection = () => {
  const globalContext = useContext(GlobalContext);
  const { profile } = globalContext ?? {};
  // profile.heroBio is optional — render nothing if null/empty (D-02)
  return (
    <>
      {profile?.heroBio && (
        <p style={{ color: "var(--ms-fg-soft)" }}>{profile.heroBio}</p>
      )}
    </>
  );
};
```

**H1 mixed-weight typography** — Fraunces italic uses `--font-display` variable set on `<html>` in `layout.tsx` (line 21):
```tsx
<h1 style={{ fontSize: "var(--text-hero)", lineHeight: "var(--lh-tight)", letterSpacing: "var(--tracking-tight)" }}>
  Software that{" "}
  <em style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 400 }}>
    ships
  </em>{" "}
  &amp; lasts.
</h1>
```

**CTA pattern** — custom `<a>` elements styled with design tokens (not shadcn `<Button>`):
```tsx
<a
  href="#contact"
  style={{
    display: "inline-flex", alignItems: "center", gap: 8,
    background: "var(--ms-orange)", color: "#fff",
    borderRadius: "var(--radius-md)", padding: "12px 24px",
    fontWeight: 600, textDecoration: "none",
    transition: "opacity var(--anim-hover)",
  }}
>
  Start a project
</a>
<a
  href="#work"
  style={{
    display: "inline-flex", alignItems: "center", gap: 8,
    border: "1px solid var(--ms-border-strong)",
    color: "var(--ms-fg)", borderRadius: "var(--radius-md)",
    padding: "12px 24px", textDecoration: "none",
    transition: "border-color var(--anim-hover)",
  }}
>
  View work
</a>
```

**Trust strip** — CSS grid, orange accent characters wrapped in `<span>`:
```tsx
<div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
  <div>
    <div style={{ fontSize: "var(--text-h3)", fontWeight: 700 }}>
      <span style={{ color: "var(--ms-orange)" }}>+</span>5
    </div>
    <div style={{ color: "var(--ms-fg-soft)", fontSize: "var(--text-small)" }}>
      Years shipping
    </div>
  </div>
  {/* repeat for other 3 stats */}
</div>
```

---

### `components/TerminalCard.tsx` (new — component, static)

**No exact analog.** Closest structural analog is `components/ui/card.tsx` (surface/border pattern) but `TerminalCard` is fully static with no shadcn dependencies. Do NOT add `"use client"`.

**CSS animation for cursor** — keyframe `ms-cursor` is in `globals.css` lines 150–153. The span's class name MUST contain `"ms-cursor"` for the reduced-motion rule at line 161 to fire:
```tsx
{/* Correct — reduced-motion rule [class*="ms-cursor"] matches */}
<span
  className="ms-cursor"
  style={{
    borderRight: "7px solid var(--ms-orange)",
    paddingRight: 1,
    animation: "ms-cursor var(--anim-cursor) step-end infinite",
  }}
>
  _
</span>

{/* Wrong — reduced-motion does NOT fire */}
<span style={{ animation: "ms-cursor 1.1s step-end infinite" }}>_</span>
```

**Surface pattern** (terminal window):
```tsx
<div
  style={{
    background: "var(--ms-surface)",
    border: "1px solid var(--ms-border)",
    borderRadius: "var(--radius-2xl)",
    fontFamily: "var(--font-mono)",
    fontSize: "var(--text-mono)",
  }}
>
  {/* Traffic light dots */}
  <div style={{ display: "flex", gap: 6, padding: "12px 16px" }}>
    <span style={{ width: 10, height: 10, borderRadius: "50%", background: "hsl(var(--color-tl-red))" }} />
    <span style={{ width: 10, height: 10, borderRadius: "50%", background: "hsl(var(--color-tl-yellow))" }} />
    <span style={{ width: 10, height: 10, borderRadius: "50%", background: "hsl(var(--color-tl-green))" }} />
  </div>
</div>
```

Color tokens for traffic lights are in `globals.css` line 136–138: `--color-tl-red`, `--color-tl-yellow`, `--color-tl-green` — consumed as `hsl(var(--color-tl-red))`.

---

### `components/ui/StatusDot.tsx` (new — component, static)

**No close analog.** Purely decorative; a small server component. No `"use client"` required.

**Pulse animation** — `ms-pulse` keyframe in `globals.css` lines 145–148. Use Tailwind's `animate-pulse` class name so reduced-motion rule at line 161 (`.animate-pulse`) also fires:
```tsx
export default function StatusDot() {
  return (
    <span style={{ position: "relative", display: "inline-flex", width: 8, height: 8 }}>
      <span
        className="animate-pulse"
        style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: "var(--ms-orange)",
          animation: `ms-pulse var(--anim-pulse) ease-out infinite`,
        }}
      />
      <span
        style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--ms-orange)" }}
      />
    </span>
  );
}
```

---

### `components/ThemeToggle.tsx` (modify — component, event-driven)

**Analog:** Self — existing file. Logic is exact; only JSX markup changes.

**Logic to preserve exactly** (`ThemeToggle.tsx` lines 5–8):
```tsx
function toggle() {
  const current = document.documentElement.dataset.theme || 'dark'
  const next = current === 'dark' ? 'light' : 'dark'
  document.documentElement.dataset.theme = next
  try { localStorage.setItem('ms_theme', next) } catch {}
}
```

**New pattern:** Expand to two-button pill. Add `useState` to track active theme for active/inactive styling. Initialize from DOM on mount (avoids FOUC mismatch):
```tsx
"use client";
import { useState, useEffect } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const current = (document.documentElement.dataset.theme as "dark" | "light") || "dark";
    setTheme(current);
  }, []);

  function applyTheme(next: "dark" | "light") {
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("ms_theme", next); } catch {}
    setTheme(next);
  }
  // ... pill JSX with two buttons
}
```

**Active button style** — `background: var(--ms-fg); color: var(--ms-bg)`. Inactive — `background: transparent; color: var(--ms-fg-soft)`.

---

### `app/page.tsx` (modify — route/page, request-response)

**Analog:** Self — existing file. Pattern for server component with `loadSanityData()` is already correct.

**Patterns to keep** (`page.tsx` lines 1, 10–14):
```tsx
import { loadSanityData } from "@/lib/api/sanityDataLoader";
// ...
export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await loadSanityData();
  // ...
}
```

**Remove:** All imports of deleted components (`BusinessCard`, `CV`, `Projects`, `SiteWrapper`, `ThemeToggle`).

**New structure:**
```tsx
import { loadSanityData } from "@/lib/api/sanityDataLoader";
import DataHydrator from "@/components/wrappers/DataHydrator";
import QueryClientWrapper from "@/components/wrappers/QueryClientWrapper";
import SiteHeader from "@/components/SiteHeader";
import HeroSection from "@/components/HeroSection";
import { SanityApiResponse } from "@/app/models/sanityTypes";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await loadSanityData();
  return (
    <QueryClientWrapper>
      <DataHydrator data={data as SanityApiResponse[]} />
      <SiteHeader />
      <main>
        <HeroSection />
      </main>
    </QueryClientWrapper>
  );
}
```

**Deletion order:** Rewrite `page.tsx` first (removing all old imports), then delete component files. This prevents "module not found" TypeScript errors.

---

### `app/context/GlobalContext.tsx` (modify — provider/store, CRUD)

**Analog:** Self — additive removal.

**Fields and handlers to remove** (lines 18–22, 44–47, 80–97, 104–107, 109–111):
- State: `showCV`, `showProjects`, `animateCard`
- Handlers: `handleViewCV`, `handleViewProjects`, `handleBackButton`, `toggleCardAnimation`
- From `ContextType` interface (lines 18–22): remove `showCV`, `showProjects`, `animateCard`, `handleViewCV`, `handleViewProjects`, `handleBackButton`, `toggleCardAnimation`
- From `Provider value` (lines 104–113): remove those same keys

**Fields to retain:** `profile`, `education`, `workExperience`, `projects`, `setSiteContentToContext`.

**`setSiteContentToContext` pattern to preserve exactly** (`GlobalContext.tsx` lines 50–78) — the dispatch/sort logic that parses `SanityApiResponse[]` by `_type` must remain unchanged.

---

### `sanity/schemaTypes/profile.ts` (modify — config/schema, CRUD)

**Analog:** Self — additive change. Insert after line 80 (before closing `]`).

**Pattern to copy from existing simple string field** (`profile.ts` lines 22–24):
```ts
defineField({
  name: 'linkedInUrl',
  title: 'LinkedIn Url',
  type: 'string',
}),
```

**New field to add:**
```ts
defineField({
  name: 'heroBio',
  title: 'Hero Bio',
  type: 'string',
  description: 'Short lede paragraph displayed in the hero section.',
}),
```

---

### `app/models/sanityTypes.ts` (modify — model, transform)

**Analog:** Self — additive change. Add one optional property to `Profile` interface (lines 9–21).

**Pattern** (existing optional-adjacent fields at lines 18–20):
```ts
export interface Profile extends BaseType {
  // ... existing fields ...
  heroBio?: string;  // optional — renders nothing if unset (D-02)
}
```

---

### `lib/api/sanityDataLoader.ts` (modify — service, request-response)

**Analog:** Self — additive change. Add `heroBio` to the `profile` projection block (lines 9–20).

**Pattern** (existing projection field, lines 11–13):
```ts
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
  heroBio          // ← add at end of projection
},
```

---

## Shared Patterns

### CSS Token Consumption
**Source:** `app/globals.css` (lines 36–90 for ms-* tokens, lines 92–142 for typography/spacing/animation)
**Apply to:** All new component files (`SiteHeader`, `HeroSection`, `TerminalCard`, `StatusDot`, `ThemeToggle`)

Design token reference for Phase 2 components:
```
Colors:       var(--ms-bg), var(--ms-fg), var(--ms-fg-soft), var(--ms-fg-faint)
              var(--ms-orange), var(--ms-orange-text), var(--ms-border), var(--ms-border-strong)
              var(--ms-surface), var(--ms-bg-alt)
Typography:   var(--text-hero), var(--text-h3), var(--text-body-lg), var(--text-body)
              var(--text-small), var(--text-mono), var(--text-label)
              var(--lh-tight), var(--lh-body), var(--tracking-tight)
Fonts:        var(--font-sans) = Inter, var(--font-mono) = JetBrains Mono, var(--font-display) = Fraunces
Animation:    var(--anim-pulse) = 2.2s, var(--anim-cursor) = 1.1s, var(--anim-hover) = 0.2s
Radius:       var(--radius-md), var(--radius-lg), var(--radius-xl), var(--radius-2xl), var(--radius-pill)
```

### Spacing — Use Tailwind, Not CSS Variable Names
**Critical risk:** UI-SPEC token names differ from globals.css token names (e.g., UI-SPEC `--space-5` = 32px, but globals.css `--space-5` = 12px).
**Apply to:** All component files with layout/spacing.

Use Tailwind utilities or pixel values from UI-SPEC directly:
```
UI-SPEC 8px  → Tailwind p-2 / gap-2   (or style={{ gap: 8 }})
UI-SPEC 16px → Tailwind p-4 / gap-4   (or style={{ gap: 16 }})
UI-SPEC 24px → Tailwind p-6 / gap-6   (or style={{ gap: 24 }})
UI-SPEC 32px → Tailwind p-8 / gap-8   (or style={{ gap: 32 }})
UI-SPEC 48px → Tailwind p-12 / gap-12 (or style={{ gap: 48 }})
UI-SPEC 64px → Tailwind p-16 / gap-16 (or style={{ gap: 64 }})
```

### "use client" Directive
**Source:** `components/ThemeToggle.tsx` line 1, `components/wrappers/SiteWrapper.tsx` line 1, `components/BusinessCard.tsx` line 1
**Apply to:** `DataHydrator.tsx`, `SiteHeader.tsx`, `HeroSection.tsx`, `ThemeToggle.tsx`

The directive is the first line of the file — before all imports:
```tsx
"use client";
import ...
```

### GlobalContext Read Pattern
**Source:** `components/BusinessCard.tsx` lines 11–17
**Apply to:** `SiteHeader.tsx` (if it reads profile data), `HeroSection.tsx`

```tsx
const globalContext = useContext(GlobalContext);
const { profile } = globalContext ?? {};
// access profile?.heroBio, profile?.email, etc.
```

### Theme-Switchable CSS via data-theme Selectors
**Source:** `app/globals.css` lines 10–90 (data-theme="dark" and data-theme="light" blocks)
**Apply to:** `SiteHeader.tsx` (header-bg class for backdrop), any component needing theme-dependent values not covered by existing `--ms-*` tokens.

Pattern for adding a new theme-aware CSS class:
```css
/* In globals.css, inside existing @layer base or directly under data-theme blocks */
[data-theme="dark"]  .header-bg { background: rgba(13,11,9,0.78); }
[data-theme="light"] .header-bg { background: rgba(247,244,238,0.82); }
```

---

## No Analog Found

| File | Role | Data Flow | Reason |
|---|---|---|---|
| `components/TerminalCard.tsx` | component | static | No existing static-only presentational component; `card.tsx` is shadcn-based, not a useful pattern to copy |

---

## Files to Delete (no pattern work needed)

These are confirmed to exist and must be removed. Rewrite `app/page.tsx` first to drop all imports, then delete:

| File | Path |
|---|---|
| BusinessCard | `components/BusinessCard.tsx` |
| CV | `components/CV.tsx` |
| Profile | `components/Profile.tsx` |
| ProfileIntro | `components/ProfileIntro.tsx` |
| ProjectDetails | `components/ProjectDetails.tsx` |
| Projects | `components/Projects.tsx` |
| Skills | `components/Skills.tsx` |
| WorkExperience | `components/WorkExperience.tsx` |
| WorkExperienceItem | `components/WorkExperienceItem.tsx` |
| Education | `components/Education.tsx` |
| SiteWrapper | `components/wrappers/SiteWrapper.tsx` |
| SocialMediaButtons | `components/wrappers/SocialMediaButtons.tsx` (orphaned after SiteWrapper deletion) |

---

## Metadata

**Analog search scope:** `components/`, `components/wrappers/`, `components/ui/`, `app/`, `lib/`, `sanity/schemaTypes/`
**Files scanned:** 14 source files read directly
**Pattern extraction date:** 2026-05-09
