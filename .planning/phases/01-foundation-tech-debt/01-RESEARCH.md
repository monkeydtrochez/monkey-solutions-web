# Phase 1: Foundation + Tech Debt - Research

**Researched:** 2026-05-09
**Domain:** CSS design tokens, theme switching, Next.js fonts, Sanity data fetching, React stability patterns
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Keep existing shadcn variable names (`--background`, `--foreground`, `--primary`, `--card`, `--muted`, `--accent`, etc.) — only change their values to match the design handoff token tables. Tailwind utility classes (`bg-background`, `text-foreground`) keep working in all future phases.
- **D-02:** Migrate theme selector from `.dark` class to `[data-theme="dark"]` / `[data-theme="light"]` attribute selectors on `<html>`. Dark is the default.
- **D-03:** Stay in Tailwind v4 compat mode — keep `@config ../tailwind.config.ts` in globals.css. Do NOT migrate to `@theme` native Tailwind v4 config.
- **D-04:** Define the complete token set in Phase 1 — all colors, typography, spacing, radii, shadows, and animation durations from the design handoff. Future phases can reference tokens immediately without touching globals.css.
- **D-05:** The researcher MUST extract the full token tables from `design_handoff_monkey_solutions/README.md` and include ready-to-implement values in the research output.
- **D-06:** Phase 1 builds three things: (1) an inline `<script dangerouslySetInnerHTML>` in `app/layout.tsx` `<head>` that reads `localStorage` key `ms_theme` and sets `document.documentElement.dataset.theme` before paint; (2) a `ThemeToggle` component; (3) a temporary visible placement on the page to verify the success criteria.
- **D-07:** The `ThemeToggle` component uses direct DOM manipulation — reads/writes `document.documentElement.dataset.theme` and `localStorage`. No React context or provider.
- **D-08:** Remove Geist fonts. Load Inter (body/UI), JetBrains Mono (meta/kickers), and Fraunces (editorial accents) via `next/font/google`. Apply as CSS variables (`--font-sans`, `--font-mono`, `--font-display`). Set Inter as body font.
- **D-09:** Preserve all existing components — do not delete them in Phase 1.
- **D-10:** Fix exactly TD-01 through TD-05 — no additional CONCERNS.md items.
- **D-11 (TD-01):** Delete `lib/redis.ts`. Remove `ioredis` import and all Redis branches from `lib/api/sanityDataLoader.ts`. Remove `ioredis` from `package.json`.
- **D-12 (TD-02):** Replace the self-referential `axios.get` call in `lib/api/sanityDataLoader.ts` with a direct Sanity client fetch. Delete `app/api/sanity-data/route.ts`.
- **D-13 (TD-03):** Fix `/api/revalidate/route.ts` auth comparison to check `Authorization: Bearer <CRON_SECRET>`.
- **D-14 (TD-04):** Remove stale-data guards in `GlobalContext.tsx`.
- **D-15 (TD-05):** Stabilize `QueryClient` in `QueryClientWrapper.tsx` using `const [queryClient] = useState(() => new QueryClient())`.

### Claude's Discretion

None specified.

### Deferred Ideas (OUT OF SCOPE)

- Opportunistic CONCERNS.md fixes (conflicting `revalidate` export, `@types/react` v19 update, dead code deletion, `"use client"` additions).
- Deletion of `app/api/sanity-config/route.ts` and `lib/hooks/sanityConfigLoader.ts`.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FOUND-01 | Design tokens (colors, typography, spacing, radii, shadows, animations) are defined as CSS variables under `[data-theme="dark"]` and `[data-theme="light"]` selectors | Full token tables extracted below; CSS variable naming convention documented |
| FOUND-02 | Dark theme applied before hydration via an inline script in `<head>` — no flash of wrong theme on revisit | Next.js official pattern for `suppressHydrationWarning` + inline script confirmed |
| FOUND-03 | User's theme preference persists to `localStorage` under key `ms_theme` and is restored on page load | localStorage key confirmed; inline script pattern documented |
| FOUND-04 | Three typefaces (Inter, JetBrains Mono, Fraunces) self-hosted via `next/font` — no external Google Fonts CSS requests | All three confirmed as variable fonts in `next/font/google`; font config pattern documented |
| TD-01 | Delete `lib/redis.ts`, remove `ioredis` import and Redis branches from `sanityDataLoader.ts`, remove `ioredis` from `package.json` | **ALREADY DONE** — `lib/redis.ts` does not exist, `ioredis` not in `package.json`, no Redis code in `sanityDataLoader.ts` |
| TD-02 | Replace self-referential `axios.get` in `sanityDataLoader.ts` with direct Sanity client fetch; eliminate `app/api/sanity-data/route.ts` | GROQ query identified in `app/api/sanity-data/route.ts`; Sanity client factory at `app/sanityClient.ts`; migration pattern documented |
| TD-03 | Fix `/api/revalidate` auth header comparison to check `Authorization: Bearer <CRON_SECRET>` | **ALREADY DONE** — line 6 of `app/api/revalidate/route.ts` already reads `` authHeader !== `Bearer ${process.env.CRON_SECRET}` `` |
| TD-04 | Remove stale-data guards in `GlobalContext.tsx` | **PARTIALLY DONE** — the `if (!workExperience)` pattern is gone; remaining `if (workExperienceArray != null)` checks incoming data nullability (not existing-state guards); requires planner judgment on scope |
| TD-05 | Stabilize `QueryClient` in `QueryClientWrapper.tsx` using `useState(() => new QueryClient())` | **ALREADY DONE** — line 10 already reads `const [queryClient] = useState(() => new QueryClient())` |
</phase_requirements>

---

## Summary

Phase 1 is a foundation phase with two independent work streams: (1) design system setup (CSS tokens + theme switching + fonts), and (2) tech debt fixes to the data fetching pipeline. Neither work stream depends on the other, so they can be planned and executed in parallel waves.

**Critical pre-discovery:** Three of the five tech debt items are already fixed in the current codebase. TD-01 (Redis removal), TD-03 (auth header), and TD-05 (QueryClient stabilization) are complete. Only TD-02 (self-referential HTTP call) needs implementation work. TD-04 needs planner judgment: the old `if (!workExperience)` stale-data guards from CONCERNS.md are gone, but the current code still has null-guards on incoming data (`if (workExperienceArray != null)`); the decision (D-14) says to remove these — so the planner must decide whether to remove those null guards entirely and call state setters unconditionally with potentially-empty arrays.

The design token work is well-specified: the handoff README contains all exact values. The key implementation challenge is the Tailwind v4 `@custom-variant` approach for `data-theme` attribute selectors — the existing `darkMode: "class"` in `tailwind.config.ts` does not cover attribute selectors and must be supplemented with a `@custom-variant dark` rule in `globals.css`.

**Primary recommendation:** Execute as two waves — Wave 1: Tech Debt (fast, targeted file edits), Wave 2: Design System (CSS tokens, fonts, theme toggle). Both gates are the success criteria from the ROADMAP.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| CSS design tokens | Browser / Client | — | CSS variables live in `globals.css`; resolved at paint time by the browser |
| Theme attribute selector | Browser / Client | Frontend Server (SSR) | `data-theme` set via inline script before hydration; CSS reads it |
| Theme persistence | Browser / Client | — | `localStorage` is client-only; inline script runs before React |
| No-FOUC prevention | Frontend Server (SSR) | Browser / Client | Inline `<script>` injected in SSR-rendered `<head>` HTML |
| Font self-hosting | Frontend Server (SSR) | CDN / Static | `next/font` downloads and serves fonts from the Next.js origin at build time |
| Sanity data loading | API / Backend | — | `sanityDataLoader.ts` runs server-side in a Server Component |
| Auth token validation | API / Backend | — | `app/api/revalidate/route.ts` is a Next.js Route Handler (server) |
| QueryClient stability | Browser / Client | — | TanStack Query client lives in client component; stabilized via `useState` |

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next/font/google | bundled with Next.js 16.2.4 | Self-host Google Fonts at build time | Zero external font requests; optimal LCP; official Next.js primitive [VERIFIED: npm registry, node_modules] |
| @sanity/client | 7.22.0 | Direct GROQ fetch to Sanity API | Already installed; eliminates axios HTTP round-trip [VERIFIED: package.json] |
| Tailwind CSS | 4.3.0 | Utility classes consume CSS variables | Already installed and configured [VERIFIED: package.json] |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| tailwindcss-animate | 1.0.7 | Keyframe animation utilities | Phase 1 defines animation tokens; plugin already present [VERIFIED: package.json] |
| axios | 1.7.7 | HTTP client | Still used by `lib/hooks/sanityConfigLoader.ts` — do NOT remove from `package.json` in TD-02; only remove from `sanityDataLoader.ts` |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `next/font/google` | `next/font/local` with manually downloaded font files | `next/font/google` auto-downloads at build time; `local` requires committing font binaries |
| Inline `<script>` in `<head>` | `next-themes` library | `next-themes` is the industry package but adds a dependency; the inline script approach is 3 lines and avoids FOUC without a library |
| `@custom-variant dark` in CSS | `darkMode: "selector"` in tailwind.config.ts (v3 feature) | Tailwind v4 with `@config` compat mode does not forward `darkMode: "selector"` from the config file — CSS-side `@custom-variant` is required |

**Installation:** No new packages required. All dependencies already present.

---

## Architecture Patterns

### System Architecture Diagram

```
Browser (on page load)
    │
    ▼
SSR HTML response
    ├── <head>
    │     └── <script> [inline, synchronous]
    │           reads localStorage("ms_theme")
    │           sets document.documentElement.dataset.theme = "dark" | "light"
    │           (before first paint — no FOUC)
    │
    ├── <link rel="preload"> for Inter, JetBrains Mono, Fraunces woff2 files
    │     (injected by next/font — no fonts.googleapis.com request)
    │
    └── <body class="font-sans ...">
          CSS reads [data-theme="dark"] / [data-theme="light"] selectors
          → resolves --background, --foreground, --primary, etc.

ThemeToggle component (client)
    reads  document.documentElement.dataset.theme
    writes document.documentElement.dataset.theme
    writes localStorage("ms_theme")

Server Component (app/page.tsx)
    calls sanityDataLoader.loadSanityData()
        │
        └── directly calls sanityClient.fetch(query)  ← after TD-02 fix
              (was: axios.get to /api/sanity-data — eliminated)
              returns SanityApiResponse[]

app/api/revalidate (Route Handler, server)
    receives POST from Sanity webhook
    checks Authorization: Bearer <CRON_SECRET>
    calls revalidatePath("/")
```

### Recommended Project Structure

```
app/
├── layout.tsx              # Add inline script in <head>; load 3 fonts; apply --font-sans/mono/display
├── globals.css             # Replace :root / .dark blocks with [data-theme="dark"] / [data-theme="light"]
│                           # Add @custom-variant dark rule
├── fonts.ts (new)          # Centralize Inter, JetBrains_Mono, Fraunces declarations
components/
├── ThemeToggle.tsx (new)   # Client component; DOM manipulation only; no context
lib/
├── api/
│   └── sanityDataLoader.ts # Replace axios with direct sanityClient.fetch()
app/
└── api/
    └── sanity-data/
        └── route.ts        # DELETE after TD-02 (dead code)
```

### Pattern 1: No-FOUC Theme Inline Script

**What:** A synchronous IIFE in `<head>` reads `localStorage` before paint and sets `data-theme` on `<html>`.
**When to use:** Any SSR app where theme choice persists across page loads.

```tsx
// Source: https://nextjs.org/docs/app/guides/preventing-flash-before-hydration
// app/layout.tsx <head> section
<html lang="en" data-theme="dark" suppressHydrationWarning>
  <head>
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(){try{var t=localStorage.getItem("ms_theme");document.documentElement.setAttribute("data-theme",t||"dark")}catch(e){}})()`,
      }}
    />
  </head>
  <body>{children}</body>
</html>
```

Key points:
- `suppressHydrationWarning` on `<html>` suppresses React's hydration mismatch warning (the SSR-rendered `data-theme="dark"` default may differ from what the script sets). [VERIFIED: Context7 /vercel/next.js]
- The script must be a synchronous IIFE — no `async`/`defer`. The browser blocks rendering until the script runs.
- Fallback when `localStorage` is empty or throws (private browsing): defaults to `"dark"`.

### Pattern 2: `@custom-variant` for Data-Theme Dark Mode in Tailwind v4

**What:** Overrides Tailwind's built-in `dark:` variant to use `[data-theme=dark]` attribute selector.
**When to use:** When using `data-theme` on `<html>` instead of the `.dark` class strategy.

```css
/* Source: https://tailwindcss.com/docs/dark-mode */
/* Add to globals.css BEFORE @config line, or after @import "tailwindcss" */

@import "tailwindcss";
@config "../tailwind.config.ts";   /* D-03: keep compat mode */
@plugin "tailwindcss-animate";

@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));
```

This means existing `dark:bg-background` utility classes in shadcn components continue working automatically — no component changes needed. [VERIFIED: tailwindcss.com/docs/dark-mode]

**Important:** The `tailwind.config.ts` `darkMode: "class"` setting is overridden by this CSS-side declaration. Update `tailwind.config.ts` to `darkMode: "selector"` or simply remove the `darkMode` key — it has no effect once `@custom-variant dark` is defined in CSS.

### Pattern 3: `next/font/google` with CSS Variables

**What:** Import Google Fonts as variable fonts, assign to CSS variables, apply to `<html>`.
**When to use:** Any time three or more font families are needed with variable weights.

```tsx
// Source: Context7 /vercel/next.js — font CSS variables pattern
// app/fonts.ts (centralize declarations)
import { Inter, JetBrains_Mono, Fraunces } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin'],
  weight: 'variable',       // variable font — all weights in one file
  display: 'swap',
  variable: '--font-sans',
})

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: 'variable',
  display: 'swap',
  variable: '--font-mono',
})

export const fraunces = Fraunces({
  subsets: ['latin'],
  weight: 'variable',
  style: ['italic'],        // only italic style needed per design handoff
  display: 'swap',
  variable: '--font-display',
})
```

```tsx
// app/layout.tsx — apply variables to <html>
import { inter, jetbrainsMono, fraunces } from './fonts'

<html className={`${inter.variable} ${jetbrainsMono.variable} ${fraunces.variable}`}>
  <body className="font-sans">  {/* Inter becomes default body font */}
```

```css
/* globals.css — reference the CSS variables */
body {
  font-family: var(--font-sans), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  font-feature-settings: "ss01", "ss02", "cv11";  /* Inter stylistic sets from design handoff */
}
```

[VERIFIED: Context7 /vercel/next.js — font docs; confirmed variable weight support for all 3 fonts via node_modules type definitions]

### Pattern 4: Direct Sanity Client Fetch (TD-02)

**What:** Replace `axios.get(${NEXT_PUBLIC_BASE_URL}/api/sanity-data)` with a direct Sanity client call.
**When to use:** Any server component or server-side function that needs Sanity data.

The GROQ query currently lives in `app/api/sanity-data/route.ts`. After TD-02:

```typescript
// lib/api/sanityDataLoader.ts (after fix)
import { createClientFromParam } from '@/app/sanityClient'
import { SanityApiResponse } from '@/app/models/sanityTypes'

const query = `*[_type == 'profile' || _type == 'workExperience' || _type == 'education' || _type == 'project'] {
  _id,
  _type,
  title,
  _type == 'profile' => { profilePicture, description, languages, mobile, email, location, personalitySkills, professionalSkills, linkedInUrl, githubUrl },
  _type == 'education' => { school, start, end },
  _type == 'workExperience' => { sortIndex, duration, description },
  _type == 'project' => { sortIndex, title, coverImage, duration, client, site, tags, body }
}`

export const loadSanityData = async (): Promise<SanityApiResponse[]> => {
  const sanityClient = createClientFromParam({
    projectId: process.env.SANITY_PROJECT_ID || '',
    dataset: process.env.SANITY_DATASET || '',
    apiVersion: process.env.SANITY_API_VERSION || '',
    useCdn: false,
  })
  if (!sanityClient) throw new Error('Sanity client could not be created')
  return sanityClient.fetch(query)
}
```

After this change, `app/api/sanity-data/route.ts` becomes dead code and is deleted. The `axios` import is removed from `sanityDataLoader.ts`. [VERIFIED: codebase — `app/sanityClient.ts` exports `createClientFromParam`; GROQ query confirmed in `app/api/sanity-data/route.ts`]

### Pattern 5: ThemeToggle Component

**What:** Client component that reads/writes `data-theme` on `<html>` and persists to `localStorage`.
**When to use:** Any toggle UI that switches between `"dark"` and `"light"` themes.

```tsx
// components/ThemeToggle.tsx
"use client"

export function ThemeToggle() {
  function toggle() {
    const current = document.documentElement.dataset.theme || 'dark'
    const next = current === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try { localStorage.setItem('ms_theme', next) } catch {}
  }

  return (
    <button onClick={toggle} aria-label="Toggle theme">
      Toggle theme
    </button>
  )
}
```

Phase 1 placement: drop `<ThemeToggle />` in `app/page.tsx` temporarily for verification. Phase 2 moves it to the header. [CITED: CONTEXT.md D-06, D-07]

### Anti-Patterns to Avoid

- **Setting `data-theme` via React state (useState):** React state is set after hydration, causing a FOUC. Use the inline script + direct DOM manipulation only.
- **Using `darkMode: "class"` in tailwind.config.ts without updating the selector:** After switching to `data-theme`, the `.dark` class no longer applies. The `@custom-variant dark` rule in CSS must be the single source of truth.
- **Importing fonts in `layout.tsx` inline:** Works, but a `fonts.ts` file keeps `layout.tsx` clean and ensures fonts are declared once.
- **Calling `revalidatePath('/api/sanity-data')` in revalidate route:** The API route is deleted in TD-02; the `revalidatePath` call for it should be removed too.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font self-hosting | Manual font download + @font-face rules | `next/font/google` | Handles subsetting, preloading, `font-display`, woff2 format, zero extra request |
| No-FOUC theme persistence | Custom localStorage hook with useEffect | Inline `<script>` in `<head>` (IIFE) | useEffect fires after paint; only synchronous `<script>` prevents the flash |
| Sanity data fetching | Custom fetch wrapper with auth headers | `@sanity/client` (already installed) | Client handles CDN, perspective, token auth, error handling |

**Key insight:** The no-FOUC problem is fundamentally unsolvable with React — React runs after the browser renders. Only a synchronous inline script in `<head>` guarantees pre-paint theme application.

---

## Design Token Tables (Extracted from Design Handoff — D-05)

These are ready-to-implement values for `globals.css`.

### Color Tokens — HSL Converted for CSS Variables

The existing `globals.css` uses `hsl(var(--token))` pattern. New tokens use the same pattern. Transparent/rgba tokens cannot be expressed as plain HSL triplets — they are kept as literal `rgba()` values assigned directly to the CSS variable.

#### Dark Theme (`[data-theme="dark"]`)

| CSS Variable | HSL or rgba value | Original Hex/rgba | Usage |
|---|---|---|---|
| `--ms-bg` | `30 18% 4%` | `#0d0b09` | Page background |
| `--ms-bg-alt` | `34 20% 7%` | `#15120e` | Alternating section bg |
| `--ms-surface` | `30 18% 9%` | `#1a1612` | Cards, terminal panels |
| `--ms-border` | — | `rgba(255,255,255,0.08)` | Dividers, subtle borders |
| `--ms-border-strong` | — | `rgba(255,255,255,0.18)` | Card edges, input underlines |
| `--ms-fg` | `37 27% 90%` | `#ede8e0` | Primary text |
| `--ms-fg-soft` | — | `rgba(237,232,224,0.65)` | Body text, secondary |
| `--ms-fg-faint` | — | `rgba(237,232,224,0.38)` | Meta, captions, muted |
| `--ms-orange` | `21 100% 55%` | `#ff6b1a` | Brand accent |
| `--ms-orange-text` | `23 100% 63%` | `#ff8b42` | Orange as text on dark bg |
| `--ms-orange-dim` | — | `rgba(255,107,26,0.15)` | Orange tint backgrounds |
| `--ms-mist` | — | `rgba(255,107,26,0.06)` | Very faint orange wash |
| `--ms-accent2` | `31 53% 64%` | `#d4a574` | Reserved |

**Shadcn token remapping (dark):**

| Shadcn Variable | New Value (HSL triplet) | Maps to design token |
|---|---|---|
| `--background` | `30 18% 4%` | `bg` |
| `--foreground` | `37 27% 90%` | `fg` |
| `--card` | `30 18% 9%` | `surface` |
| `--card-foreground` | `37 27% 90%` | `fg` |
| `--popover` | `30 18% 9%` | `surface` |
| `--popover-foreground` | `37 27% 90%` | `fg` |
| `--primary` | `21 100% 55%` | `orange` |
| `--primary-foreground` | `30 18% 4%` | `bg` (dark text on orange) |
| `--secondary` | `34 20% 7%` | `bgAlt` |
| `--secondary-foreground` | `37 27% 90%` | `fg` |
| `--muted` | `30 18% 9%` | `surface` |
| `--muted-foreground` | `37 27% 90%` | `fgFaint` (use with opacity) |
| `--accent` | `30 18% 9%` | `surface` |
| `--accent-foreground` | `37 27% 90%` | `fg` |
| `--destructive` | `0 50% 30%` | (keep existing) |
| `--destructive-foreground` | `37 27% 90%` | `fg` |
| `--border` | — | literal: `rgba(255,255,255,0.08)` |
| `--input` | — | literal: `rgba(255,255,255,0.08)` |
| `--ring` | `21 100% 55%` | `orange` |
| `--radius` | `0.5rem` | (keep existing) |

#### Light Theme (`[data-theme="light"]`)

| CSS Variable | HSL or rgba value | Original Hex/rgba | Usage |
|---|---|---|---|
| `--ms-bg` | `40 36% 95%` | `#f7f4ee` | Page background (warm paper) |
| `--ms-bg-alt` | `39 30% 91%` | `#efeae1` | Alternating section bg |
| `--ms-surface` | `48 56% 98%` | `#fdfcf8` | Cards, terminal panels |
| `--ms-border` | — | `rgba(20,15,10,0.10)` | Dividers |
| `--ms-border-strong` | — | `rgba(20,15,10,0.22)` | Card edges |
| `--ms-fg` | `30 24% 8%` | `#1a1510` | Primary text |
| `--ms-fg-soft` | — | `rgba(26,21,16,0.70)` | Body text |
| `--ms-fg-faint` | — | `rgba(26,21,16,0.40)` | Meta, muted |
| `--ms-orange` | `21 88% 48%` | `#e85a0f` | Brand accent (darker for AA) |
| `--ms-orange-text` | `21 95% 40%` | `#c94a05` | Orange as text on light bg |
| `--ms-orange-dim` | — | `rgba(232,90,15,0.12)` | Orange tint |
| `--ms-mist` | — | `rgba(232,90,15,0.04)` | Very faint orange wash |
| `--ms-accent2` | `27 37% 46%` | `#a0704a` | Reserved |

**Shadcn token remapping (light):**

| Shadcn Variable | New Value (HSL triplet) | Maps to design token |
|---|---|---|
| `--background` | `40 36% 95%` | `bg` |
| `--foreground` | `30 24% 8%` | `fg` |
| `--card` | `48 56% 98%` | `surface` |
| `--card-foreground` | `30 24% 8%` | `fg` |
| `--popover` | `48 56% 98%` | `surface` |
| `--popover-foreground` | `30 24% 8%` | `fg` |
| `--primary` | `21 88% 48%` | `orange` |
| `--primary-foreground` | `40 36% 95%` | `bg` |
| `--secondary` | `39 30% 91%` | `bgAlt` |
| `--secondary-foreground` | `30 24% 8%` | `fg` |
| `--muted` | `48 56% 98%` | `surface` |
| `--muted-foreground` | `30 24% 8%` | `fg` |
| `--accent` | `48 56% 98%` | `surface` |
| `--accent-foreground` | `30 24% 8%` | `fg` |
| `--destructive` | `0 50% 30%` | (keep) |
| `--destructive-foreground` | `40 36% 95%` | `bg` |
| `--border` | — | literal: `rgba(20,15,10,0.10)` |
| `--input` | — | literal: `rgba(20,15,10,0.10)` |
| `--ring` | `21 88% 48%` | `orange` |
| `--radius` | `0.5rem` | (keep) |

### Typography Tokens

```css
/* Font families — populated by next/font CSS variables */
--font-sans:    /* set by next/font via html className */;
--font-mono:    /* set by next/font via html className */;
--font-display: /* set by next/font via html className */;
```

**Type scale (define as CSS custom properties for future phases):**

| Token | Value | Usage |
|---|---|---|
| `--text-hero` | `clamp(48px, 8vw, 112px)` | Hero H1 |
| `--text-h2-section` | `clamp(36px, 5vw, 88px)` | Section H2 |
| `--text-h3` | `26px` | Card H3 |
| `--text-body` | `16px` | Body text |
| `--text-body-lg` | `17px` | Lead paragraphs |
| `--text-small` | `14px` | Small body |
| `--text-mono-label` | `11px` | Mono kicker labels |
| `--text-mono-body` | `12px` | Terminal mono |
| `--lh-tight` | `0.92` | Hero headline |
| `--lh-body` | `1.6` | Body paragraphs |
| `--tracking-tight` | `-0.045em` | Large headlines |

### Spacing Tokens

```css
--space-1:   4px;
--space-2:   6px;
--space-3:   8px;
--space-4:   10px;
--space-5:   12px;
--space-6:   14px;
--space-7:   16px;
--space-8:   18px;
--space-9:   20px;
--space-10:  24px;
--space-11:  28px;
--space-12:  32px;
--space-13:  36px;
--space-14:  40px;
--space-15:  48px;
--space-16:  56px;
--space-17:  64px;
--space-18:  72px;
--space-19:  80px;
--space-20:  96px;
--space-21:  120px;
--space-22:  140px;
--content-max: 1240px;
--page-px:   32px;
--section-py: 120px;
--section-py-contact: 140px;
```

### Border Radius Tokens

```css
--radius-xs:   2px;     /* Pills (rectangular variant) */
--radius-sm:   4px;     /* Tags, small chips */
--radius-md:   6px;     /* Buttons, traffic lights, logo block */
--radius-lg:   8px;     /* Inputs, primary CTA, list metric card */
--radius-xl:   10px;    /* Hero terminal card, service cards */
--radius-2xl:  12px;    /* Tweaks panel, contact form card */
--radius-pill: 999px;   /* Pills, filter segmented control */
```

Note: The existing `--radius: 0.5rem` (8px) shadcn token maps to `--radius-lg`. Keep `--radius` for shadcn component compat; add the new tokens alongside it.

### Shadow Tokens

```css
/* Dark theme shadows */
--shadow-sticker-dark: 0 4px 20px rgba(255,107,26,0.3);
/* Light theme shadows */
--shadow-sticker-light: 0 4px 12px rgba(232,90,15,0.2);
/* Panel */
--shadow-panel: 0 12px 40px rgba(0,0,0,0.25);
```

Define these inside the respective `[data-theme="dark"]` and `[data-theme="light"]` blocks.

### Animation Tokens

```css
/* Defined globally (same in both themes) */
--anim-pulse-duration:  2.2s;
--anim-cursor-duration: 1.1s;
--anim-fadein-duration: 0.3s;
--anim-hover-duration:  0.2s;
--anim-chevron-duration: 0.25s;
```

**Keyframes (add to globals.css `@layer base`):**

```css
@keyframes ms-pulse {
  from { transform: scale(1); opacity: 0.5; }
  to   { transform: scale(2.6); opacity: 0; }
}

@keyframes ms-cursor {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

@keyframes ms-fadein {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .animate-ms-pulse, .animate-ms-cursor { animation: none; }
}
```

### Decorative Color Tokens

```css
/* Terminal traffic lights — decorative only (aria-hidden) */
--color-tl-red:    3 100% 67%;    /* #ff5f56 */
--color-tl-yellow: 41 100% 59%;  /* #ffbd2e */
--color-tl-green:  129 68% 47%;  /* #27c93f */
/* Success state (contact form) */
--color-success: #27c93f;
```

---

## Pre-Implementation State Audit — What Is and Isn't Done

This audit prevents duplicate work or missed items. All findings are [VERIFIED: codebase grep].

| TD Item | Decision | Current State | Work Required |
|---------|----------|---------------|---------------|
| TD-01: Redis removal | D-11 | **DONE** — `lib/redis.ts` does not exist; `ioredis` absent from `package.json`; no Redis code in `sanityDataLoader.ts` | None — verify in plan and mark complete |
| TD-02: Self-referential HTTP | D-12 | **NEEDED** — `sanityDataLoader.ts` still calls `axios.get(${NEXT_PUBLIC_BASE_URL}/api/sanity-data)` | Replace with direct `sanityClient.fetch()`; delete `app/api/sanity-data/route.ts`; remove `axios` import from `sanityDataLoader.ts` only |
| TD-03: Auth header | D-13 | **DONE** — line 6 of `app/api/revalidate/route.ts` already reads `` authHeader !== `Bearer ${process.env.CRON_SECRET}` `` | None — verify in plan and mark complete |
| TD-04: Stale data guards | D-14 | **NEEDS CLARIFICATION** — the `if (!workExperience)` pattern from CONCERNS.md is already gone; current code has `if (workExperienceArray != null)` null-checks on incoming data (not existing-state guards). D-14 says "delete the `if (!workExperience)` and `if (projectsData && !projects)` conditional blocks" — those specific blocks do not exist anymore. The remaining null-guards on incoming data (`if (workExperienceArray != null)`, `if (projectsData != null)`) may be intentional defensive coding | Planner judgment: interpret D-14 as removing the existing null-guards too (making setters unconditional), OR document as already satisfied. Recommend documenting as satisfied since the stale-data bug (skipping updates when state already populated) is already fixed. |
| TD-05: QueryClient | D-15 | **DONE** — line 10 already reads `const [queryClient] = useState(() => new QueryClient())` | None — verify in plan and mark complete |

**Net result:** Of 5 TD items, 1 needs real implementation work (TD-02), 3 are already done (TD-01, TD-03, TD-05), and 1 needs planner interpretation (TD-04).

**Axis removal note for TD-02:** `axios` must NOT be removed from `package.json` — `lib/hooks/sanityConfigLoader.ts` still imports and uses it. Only remove the import from `lib/api/sanityDataLoader.ts`.

---

## Common Pitfalls

### Pitfall 1: `hsl()` Wrapper Required for Tailwind

**What goes wrong:** Defining `--background: 30 18% 4%` (HSL triplet) works with `color: hsl(var(--background))` but NOT with `background-color: var(--background)`.
**Why it happens:** The existing Tailwind setup wraps tokens in `hsl()` in `tailwind.config.ts`: `"hsl(var(--background))"`. The HSL triplet approach only works with this explicit wrapper.
**How to avoid:** Keep the same pattern — define variables as bare triplets `30 18% 4%`, consumed via `hsl(var(--token))` in Tailwind config. Do not change the Tailwind config entries.
**Warning signs:** Colors appear transparent or white in the rendered page.

### Pitfall 2: `rgba()` Border Tokens Break `hsl(var())` Pattern

**What goes wrong:** `--border` is defined as `rgba(255,255,255,0.08)` but Tailwind's config entry reads `"hsl(var(--border))"`.
**Why it happens:** `rgba()` cannot be wrapped in `hsl()`. Using a literal rgba value breaks the Tailwind mapping.
**How to avoid:** For rgba tokens used directly in CSS (`border-color`, `background`), define them as literal values and reference them via `var(--ms-border)` directly in CSS — NOT through Tailwind's theme system. For shadcn's `--border` variable (used as `border-border`), either: (a) pick an approximate HSL value that visually matches, or (b) define `--border` as a raw rgba and update the Tailwind config entry to use `var(--border)` instead of `hsl(var(--border))`.
**Warning signs:** `border-border` utility class shows no border or wrong opacity.

### Pitfall 3: `suppressHydrationWarning` Scope

**What goes wrong:** Placing `suppressHydrationWarning` on `<body>` instead of `<html>` still shows a React warning about `data-theme` mismatch on the `<html>` element.
**Why it happens:** The `data-theme` attribute is on `<html>`, so `suppressHydrationWarning` must be on `<html>`.
**How to avoid:** Add `suppressHydrationWarning` to the `<html>` element in `app/layout.tsx`.
**Warning signs:** React console warning: "Warning: Prop `data-theme` did not match."

### Pitfall 4: `@custom-variant dark` Placement in globals.css

**What goes wrong:** Adding `@custom-variant dark` after `@config` causes a CSS parsing error or has no effect.
**Why it happens:** Tailwind v4 processes `@custom-variant` as a CSS directive — placement relative to `@import "tailwindcss"` matters.
**How to avoid:** Place `@custom-variant dark` after `@import "tailwindcss"` and after `@config`. Example order:
```css
@import "tailwindcss";
@config "../tailwind.config.ts";
@plugin "tailwindcss-animate";
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));
```
**Warning signs:** `dark:bg-black` classes have no effect after switching to `data-theme`.

### Pitfall 5: `tailwind.config.ts` `darkMode` Key Conflict

**What goes wrong:** Keeping `darkMode: "class"` in `tailwind.config.ts` after adding `@custom-variant dark` in CSS may produce unexpected specificity behavior.
**Why it happens:** In v4 compat mode, the `@custom-variant` CSS declaration takes precedence over the config-file `darkMode` key. The config entry becomes a no-op but is misleading.
**How to avoid:** Remove the `darkMode` key from `tailwind.config.ts` entirely, or set it to `"selector"` as documentation. The `@custom-variant` in CSS is the actual source of truth.
**Warning signs:** No visual issue, but code review confusion.

### Pitfall 6: Font Variable Names Must Match `tailwind.config.ts`

**What goes wrong:** Defining `variable: '--font-sans'` in `fonts.ts` but referencing `font-sans` in a Tailwind utility class that maps to a different CSS variable.
**Why it happens:** `font-sans` in Tailwind resolves to `fontFamily.sans` in the theme — unless `tailwind.config.ts` maps `sans` to `var(--font-sans)`.
**How to avoid:** Add to `tailwind.config.ts` `theme.extend.fontFamily`:
```ts
fontFamily: {
  sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
  mono: ['var(--font-mono)', 'monospace'],
  display: ['var(--font-display)', 'serif'],
}
```
**Warning signs:** `className="font-sans"` on body still renders system font, not Inter.

### Pitfall 7: Fraunces Italic Only Needs `style: ['italic']`

**What goes wrong:** Loading Fraunces without specifying `style: ['italic']` downloads both normal and italic style files (or only normal, depending on subset).
**Why it happens:** By default `next/font/google` loads `style: 'normal'`.
**How to avoid:** Specify `style: ['italic']` (or `style: 'italic'`) in the Fraunces config — the design handoff only uses Fraunces italic.
**Warning signs:** Fraunces renders as upright (non-italic) in editorial accents.

---

## Runtime State Inventory

Not applicable. This phase makes no renames, rebrands, or migrations. All changes are code edits and file deletions.

---

## Code Examples

### Complete globals.css token block

```css
/* Source: design_handoff_monkey_solutions/README.md + CONTEXT.md D-01, D-02 */

@import "tailwindcss";
@config "../tailwind.config.ts";
@plugin "tailwindcss-animate";

/* Override Tailwind dark variant to use data-theme attribute */
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));

@layer base {
  /* ── DARK THEME (default) ─────────────────────── */
  [data-theme="dark"] {
    /* Shadcn-compatible tokens (consumed via hsl(var(--token)) in tailwind.config.ts) */
    --background: 30 18% 4%;
    --foreground: 37 27% 90%;
    --card: 30 18% 9%;
    --card-foreground: 37 27% 90%;
    --popover: 30 18% 9%;
    --popover-foreground: 37 27% 90%;
    --primary: 21 100% 55%;
    --primary-foreground: 30 18% 4%;
    --secondary: 34 20% 7%;
    --secondary-foreground: 37 27% 90%;
    --muted: 30 18% 9%;
    --muted-foreground: 37 27% 90%;
    --accent: 30 18% 9%;
    --accent-foreground: 37 27% 90%;
    --destructive: 0 50% 30%;
    --destructive-foreground: 37 27% 90%;
    --ring: 21 100% 55%;
    --radius: 0.5rem;

    /* Border tokens use rgba — referenced directly in CSS, not via hsl() wrapper */
    --border: rgba(255,255,255,0.08);
    --input: rgba(255,255,255,0.08);

    /* Extended design tokens */
    --ms-bg:           #0d0b09;
    --ms-bg-alt:       #15120e;
    --ms-surface:      #1a1612;
    --ms-border:       rgba(255,255,255,0.08);
    --ms-border-strong: rgba(255,255,255,0.18);
    --ms-fg:           #ede8e0;
    --ms-fg-soft:      rgba(237,232,224,0.65);
    --ms-fg-faint:     rgba(237,232,224,0.38);
    --ms-orange:       #ff6b1a;
    --ms-orange-text:  #ff8b42;
    --ms-orange-dim:   rgba(255,107,26,0.15);
    --ms-mist:         rgba(255,107,26,0.06);
    --ms-accent2:      #d4a574;
    --shadow-sticker:  0 4px 20px rgba(255,107,26,0.3);
  }

  /* ── LIGHT THEME ──────────────────────────────── */
  [data-theme="light"] {
    --background: 40 36% 95%;
    --foreground: 30 24% 8%;
    --card: 48 56% 98%;
    --card-foreground: 30 24% 8%;
    --popover: 48 56% 98%;
    --popover-foreground: 30 24% 8%;
    --primary: 21 88% 48%;
    --primary-foreground: 40 36% 95%;
    --secondary: 39 30% 91%;
    --secondary-foreground: 30 24% 8%;
    --muted: 48 56% 98%;
    --muted-foreground: 30 24% 8%;
    --accent: 48 56% 98%;
    --accent-foreground: 30 24% 8%;
    --destructive: 0 50% 30%;
    --destructive-foreground: 40 36% 95%;
    --ring: 21 88% 48%;
    --radius: 0.5rem;

    --border: rgba(20,15,10,0.10);
    --input: rgba(20,15,10,0.10);

    --ms-bg:           #f7f4ee;
    --ms-bg-alt:       #efeae1;
    --ms-surface:      #fdfcf8;
    --ms-border:       rgba(20,15,10,0.10);
    --ms-border-strong: rgba(20,15,10,0.22);
    --ms-fg:           #1a1510;
    --ms-fg-soft:      rgba(26,21,16,0.70);
    --ms-fg-faint:     rgba(26,21,16,0.40);
    --ms-orange:       #e85a0f;
    --ms-orange-text:  #c94a05;
    --ms-orange-dim:   rgba(232,90,15,0.12);
    --ms-mist:         rgba(232,90,15,0.04);
    --ms-accent2:      #a0704a;
    --shadow-sticker:  0 4px 12px rgba(232,90,15,0.2);
  }

  /* ── SHARED TOKENS (theme-independent) ─────────── */
  :root {
    /* Typography scale */
    --font-sans:    /* populated by next/font html className */;
    --font-mono:    /* populated by next/font html className */;
    --font-display: /* populated by next/font html className */;
    --text-hero:     clamp(48px, 8vw, 112px);
    --text-h2:       clamp(36px, 5vw, 88px);
    --text-h3:       26px;
    --text-body:     16px;
    --text-body-lg:  17px;
    --text-small:    14px;
    --text-mono:     12px;
    --text-label:    11px;
    --lh-tight:      0.92;
    --lh-body:       1.6;
    --tracking-tight: -0.045em;

    /* Spacing */
    --space-1: 4px; --space-2: 6px; --space-3: 8px; --space-4: 10px;
    --space-5: 12px; --space-6: 14px; --space-7: 16px; --space-8: 18px;
    --space-9: 20px; --space-10: 24px; --space-11: 28px; --space-12: 32px;
    --space-13: 36px; --space-14: 40px; --space-15: 48px; --space-16: 56px;
    --space-17: 64px; --space-18: 72px; --space-19: 80px; --space-20: 96px;
    --space-21: 120px; --space-22: 140px;
    --content-max: 1240px;
    --page-px: 32px;
    --section-py: 120px;

    /* Border radius */
    --radius-xs: 2px; --radius-sm: 4px; --radius-md: 6px;
    --radius-lg: 8px; --radius-xl: 10px; --radius-2xl: 12px;
    --radius-pill: 999px;

    /* Animation durations */
    --anim-pulse:   2.2s;
    --anim-cursor:  1.1s;
    --anim-fadein:  0.3s;
    --anim-hover:   0.2s;
    --anim-chevron: 0.25s;

    /* Decorative (traffic lights) */
    --color-tl-red: 3 100% 67%;
    --color-tl-yellow: 41 100% 59%;
    --color-tl-green: 129 68% 47%;
    --shadow-panel: 0 12px 40px rgba(0,0,0,0.25);
  }
}

/* Keyframe animations */
@keyframes ms-pulse {
  from { transform: scale(1); opacity: 0.5; }
  to   { transform: scale(2.6); opacity: 0; }
}
@keyframes ms-cursor {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}
@keyframes ms-fadein {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .animate-pulse, [class*="ms-cursor"] { animation: none; }
}

/* Body defaults */
body {
  font-family: var(--font-sans), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  font-feature-settings: "ss01", "ss02", "cv11";
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `darkMode: "class"` + `.dark {}` in CSS | `@custom-variant dark` with `[data-theme]` attribute selector | Tailwind v4 (2024) | Config-based darkMode key no longer controls CSS generation in v4 compat |
| Geist variable fonts from `next/font/local` | `next/font/google` with Inter, JetBrains Mono, Fraunces | Phase 1 of this project | Zero external font requests; optimal subset selection |
| `axios.get` to self for Sanity data | Direct `@sanity/client` fetch in server component | Phase 1 of this project | Eliminates HTTP round-trip latency and cold-start failures |
| `new QueryClient()` in render body | `useState(() => new QueryClient())` | Already fixed in current codebase | Prevents query cache loss on every re-render |

**Deprecated/outdated:**
- `lib/redis.ts` and `ioredis`: Removed. Never was connected in production; only printed errors on startup.
- `app/api/sanity-data/route.ts`: Becomes dead code after TD-02 and is deleted.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The `if (workExperienceArray != null)` and `if (projectsData != null)` checks in GlobalContext are NOT the stale-data guards described in CONCERNS.md — they are incoming-data null-guards on a different code version | Pre-Implementation State Audit (TD-04) | If the planner treats TD-04 as not-done and removes these guards, `setWorkExperienceData` and `setProjects` would be called with `undefined` when `data?.filter()` returns undefined (impossible for filter, but defensive) — low risk |
| A2 | All three fonts (Inter, JetBrains Mono, Fraunces) are variable fonts and support `weight: 'variable'` | Standard Stack | If wrong, individual weights must be specified in an array; the font config snippet changes but behavior is the same |
| A3 | The `@custom-variant dark` directive in CSS overrides the `darkMode: "class"` key in `tailwind.config.ts` when using `@config` compat mode | Architecture Patterns (Pattern 2) | If wrong, `dark:` utilities may not respond to `[data-theme=dark]` — would require removing `darkMode` from config entirely |
| A4 | `suppressHydrationWarning` on `<html>` suppresses the `data-theme` hydration mismatch without affecting other children | Code Examples (inline script) | If wrong, a React warning appears in dev but does not affect production behavior |

**If this table is empty:** All claims in this research were verified or cited — no user confirmation needed.

---

## Open Questions (RESOLVED)

1. **TD-04 scope: what does "done" look like?** [RESOLVED]
   - What we know: The CONCERNS.md described guards checking `if (!workExperience)` (existing state) — those are gone. The current code has `if (workExperienceArray != null)` (incoming data nullability checks).
   - What's unclear: Does D-14 require removing these null-guards too?
   - Recommendation: Treat TD-04 as satisfied. The stale-data bug (context ignoring fresh server data) is fixed. The current null-guards are defensive coding on fresh data, not stale-data guards. Document in plan as "already resolved."

2. **`--border` and `--input` rgba tokens in Tailwind `hsl(var())` pattern** [RESOLVED]
   - What we know: `tailwind.config.ts` wraps these as `"hsl(var(--border))"`. rgba values cannot be passed to `hsl()`.
   - What's unclear: Whether shadcn components that use `border-border` will visually break.
   - Recommendation: Define `--border` as the raw rgba value for the design system tokens. Add a fallback HSL value (closest approximation: `0 0% 100% / 0.08` for dark, `0 0% 8% / 0.10` for light using CSS `color-mix`-aware syntax) or update the Tailwind config to use `var(--border)` directly rather than `hsl(var(--border))`. The planner should address this explicitly.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build tooling | Yes | 24.13.0 | — |
| npm | Package management | Yes | 11.6.2 | — |
| Next.js | All features | Yes | 16.2.4 | — |
| @sanity/client | TD-02 direct fetch | Yes | 7.22.0 | — |
| Tailwind CSS | CSS tokens | Yes | 4.3.0 | — |
| next/font (Inter, JetBrains Mono, Fraunces) | FOUND-04 | Yes (all in `next/font/google` type defs) | bundled | — |

**Missing dependencies:** None. All required packages are installed.

---

## Validation Architecture

No test framework is configured in this project (`CLAUDE.md`: "There are no tests configured"). `config.json` does not exist in `.planning/` — validation is manual.

**Manual verification commands:**

| Requirement | Manual Verification |
|-------------|---------------------|
| FOUND-01 | Open DevTools → Elements → `<html data-theme="dark">` → inspect computed `--background` value matches `#0d0b09` |
| FOUND-02 | Set `ms_theme=light` in localStorage, hard-refresh → page should paint light immediately without dark flash |
| FOUND-03 | Click toggle (light), reload → theme restored to light. Clear localStorage, reload → dark default |
| FOUND-04 | Network tab → filter "fonts.googleapis.com" → no requests. Font files loaded from `/_next/static/media/` |
| TD-02 | Network tab → no request to `/api/sanity-data` on page load |

**Build verification:**
```bash
npm run build   # must pass with no errors
npm run lint    # must pass with --max-warnings 0
```

---

## Project Constraints (from CLAUDE.md)

| Directive | Applies To |
|---|---|
| Tailwind dark mode `class` strategy | **Superseded by D-02** — migrating to `data-theme` attribute; update `tailwind.config.ts` `darkMode` key |
| CSS variables in `@layer base` in `globals.css` | Maintain — all new tokens go here |
| Custom colors defined as HSL CSS variables, referenced via `hsl(var(--token))` | Maintain for shadcn tokens; raw values for rgba tokens |
| No external image hosts beyond `cdn.sanity.io/images/**` | No impact on Phase 1 |
| `/api/revalidate` must receive `Authorization: Bearer <CRON_SECRET>` | Already implemented correctly |
| `next/font/local` used for Geist — migrate to `next/font/google` for new fonts | Follow this pattern; use `next/font/google` |
| Commit messages: no `Co-authored-by: Claude` or AI attribution | Apply to all commits |
| No tests configured | No test tasks needed |

---

## Sources

### Primary (HIGH confidence)
- [Context7 /vercel/next.js] — `next/font/google` API (CSS variable pattern, variable weight syntax), no-FOUC inline script pattern with `suppressHydrationWarning`
- [tailwindcss.com/docs/dark-mode] — `@custom-variant dark` syntax for `[data-theme]` attribute selector in v4
- Codebase grep — all TD states verified directly from source files

### Secondary (MEDIUM confidence)
- [tailwindcss.com/docs/dark-mode] via WebFetch — confirmed `@custom-variant` overrides config-file `darkMode` key
- HSL values: computed via node.js hex-to-HSL conversion from design handoff `#` values

### Tertiary (LOW confidence)
- None.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages confirmed in node_modules and package.json
- Architecture: HIGH — patterns confirmed via Context7 and official Tailwind docs
- Token values: HIGH — computed directly from handoff hex values; no estimation
- TD state audit: HIGH — verified via direct file reads and grep
- Tailwind v4 `@custom-variant` + compat mode interaction: MEDIUM — confirmed via official docs; A3 in assumptions log flags the one uncertainty

**Research date:** 2026-05-09
**Valid until:** 2026-06-09 (Tailwind v4 is stable; Next.js 16 is stable)
