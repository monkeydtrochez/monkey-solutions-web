# Phase 1: Foundation + Tech Debt - Pattern Map

**Mapped:** 2026-05-09
**Files analyzed:** 9 (7 modified, 1 new component, 1 new utility)
**Analogs found:** 9 / 9

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `app/globals.css` | config | transform | `app/globals.css` (itself, current state) | exact (replace in-place) |
| `tailwind.config.ts` | config | transform | `tailwind.config.ts` (itself, current state) | exact (modify in-place) |
| `app/layout.tsx` | config | request-response | `app/layout.tsx` (itself, current state) | exact (modify in-place) |
| `app/fonts.ts` (new) | utility | transform | `app/layout.tsx` lines 6–15 (existing `localFont` calls) | role-match |
| `components/ThemeToggle.tsx` (new) | component | event-driven | `components/wrappers/SiteWrapper.tsx` (DOM side-effect pattern with `document.body.style`) | role-match |
| `lib/api/sanityDataLoader.ts` | service | request-response | `app/api/sanity-data/route.ts` (contains the direct Sanity client call + GROQ query) | exact |
| `app/api/revalidate/route.ts` | middleware | request-response | `app/api/revalidate/route.ts` (itself — already correct; minor cleanup needed) | exact |
| `app/context/GlobalContext.tsx` | provider | event-driven | `app/context/GlobalContext.tsx` (itself — targeted guard removal) | exact |
| `components/wrappers/QueryClientWrapper.tsx` | provider | event-driven | `components/wrappers/QueryClientWrapper.tsx` (itself — already correct; verify only) | exact |

---

## Pattern Assignments

### `app/globals.css` (config, transform)

**Analog:** `app/globals.css` — current file to be replaced in-place.

**Current structure** (lines 1–3 — keep these directives exactly):
```css
@import "tailwindcss";
@config "../tailwind.config.ts";
@plugin "tailwindcss-animate";
```

**New directive to insert after line 3** (Pattern 2 from RESEARCH.md):
```css
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));
```

**Current `@layer base` block** (lines 15–69 — replace entirely):
The existing `:root {}` and `.dark {}` blocks are deleted and replaced with `[data-theme="dark"]`, `[data-theme="light"]`, and shared `:root` blocks. The complete replacement is specified verbatim in RESEARCH.md "Complete globals.css token block."

**Current `@layer utilities` block** (lines 9–13 — preserve as-is):
```css
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

**Current `@layer base` star rule** (lines 62–69 — preserve):
```css
@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

**Important constraint from RESEARCH.md Pitfall 2:** The Tailwind config maps `--border` and `--input` via `hsl(var(--border))`, which will break for the new rgba token values. The planner must resolve this: either update `tailwind.config.ts` to use `var(--border)` (not `hsl(var(--border))`) for those two entries, or assign approximate HSL triplets to `--border`/`--input` and keep the rgba tokens only on the `--ms-border` variables. The RESEARCH.md Open Question 2 documents this tradeoff.

---

### `tailwind.config.ts` (config, transform)

**Analog:** `tailwind.config.ts` — current file, modified in-place.

**Current `darkMode` key** (line 4 — remove or change):
```ts
darkMode: "class",  // REMOVE — @custom-variant in globals.css takes over
```

**Current `colors` block** (lines 12–52 — keep all entries, add font families alongside):
```ts
// Keep all existing color entries unchanged.
// ADD inside theme.extend:
fontFamily: {
  sans:    ['var(--font-sans)', 'system-ui', 'sans-serif'],
  mono:    ['var(--font-mono)', 'monospace'],
  display: ['var(--font-display)', 'Georgia', 'serif'],
},
```

**Border/input entries that need attention** (lines 43–44):
```ts
border: "hsl(var(--border))",
input:  "hsl(var(--input))",
```
These must be updated to `"var(--border)"` and `"var(--input))"` if rgba values are used directly on those variables, or left as-is if HSL triplet approximations are used instead. Planner decides per Open Question 2.

---

### `app/layout.tsx` (config, request-response)

**Analog:** `app/layout.tsx` — current file, modified in-place.

**Current font imports** (lines 2, 6–15 — replace entirely):
```tsx
// BEFORE (remove):
import localFont from "next/font/local";
const geistSans = localFont({ src: "./fonts/GeistVF.woff", variable: "--font-geist-sans", weight: "100 900" });
const geistMono = localFont({ src: "./fonts/GeistMonoVF.woff", variable: "--font-geist-mono", weight: "100 900" });

// AFTER (copy from analog app/fonts.ts — see that entry):
import { inter, jetbrainsMono, fraunces } from './fonts'
```

**Current `<html>` element** (line 28 — add suppressHydrationWarning + data-theme):
```tsx
// BEFORE:
<html lang="en">

// AFTER:
<html lang="en" data-theme="dark" suppressHydrationWarning>
```

**New inline script in `<head>`** (insert between `<html>` and `<body>` — no current analog in this file):
```tsx
<head>
  <script
    dangerouslySetInnerHTML={{
      __html: `(function(){try{var t=localStorage.getItem("ms_theme");document.documentElement.setAttribute("data-theme",t||"dark")}catch(e){}})()`,
    }}
  />
</head>
```

**Current `<body>` className** (line 30 — replace font variables):
```tsx
// BEFORE:
<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

// AFTER:
<body className={`${inter.variable} ${jetbrainsMono.variable} ${fraunces.variable} font-sans antialiased`}>
```

**`GlobalContextProvider` placement** (lines 33–38 — preserve, no changes):
```tsx
<GlobalContextProvider>
  {children}
  <footer className="py-4 text-center text-sm text-gray-500">
    © {new Date().getFullYear()} Monkey Solutions. All rights reserved.
  </footer>
</GlobalContextProvider>
```

---

### `app/fonts.ts` (new utility, transform)

**Analog:** `app/layout.tsx` lines 6–15 — existing `localFont` calls show the `variable` CSS var convention and the `next/font/local` API. Replace with `next/font/google`.

**Existing pattern to copy structure from** (app/layout.tsx lines 2, 6–15):
```tsx
import localFont from "next/font/local";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
```

**New file pattern** (replace `localFont` with `next/font/google` imports; structure identical):
```tsx
import { Inter, JetBrains_Mono, Fraunces } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin'],
  weight: 'variable',
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
  style: ['italic'],
  display: 'swap',
  variable: '--font-display',
})
```

Note: `style: ['italic']` on Fraunces is required — the design handoff uses Fraunces italic only (RESEARCH.md Pitfall 7).

---

### `components/ThemeToggle.tsx` (new component, event-driven)

**Analog:** `components/wrappers/SiteWrapper.tsx` — the closest existing client component that performs direct DOM side-effects (`document.body.style.overflow`) and uses `"use client"` directive.

**"use client" + DOM manipulation pattern** (SiteWrapper.tsx lines 1, 27–32):
```tsx
"use client";
// ...
useEffect(() => {
  // ...
  document.body.style.overflow = "hidden";
  // ...
  document.body.style.overflow = "auto";
}, [showCV, showProjects, toggleCardAnimation]);
```

**New component pattern** (no React state or context — direct DOM only per D-07):
```tsx
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

**Temporary placement in `app/page.tsx`** (lines 15–27 — add `<ThemeToggle />` inside the return, per D-06):
```tsx
// Add import at top:
import { ThemeToggle } from '@/components/ThemeToggle'

// Add inside return, alongside existing children (temporary — Phase 2 removes this):
<ThemeToggle />
```

No `onClick` handler prop drilling needed — the toggle is self-contained. Phase 2 removes it from `page.tsx` and places it in the header.

---

### `lib/api/sanityDataLoader.ts` (service, request-response)

**Analog:** `app/api/sanity-data/route.ts` — this file contains the direct Sanity client call and the GROQ query that `sanityDataLoader.ts` currently reaches via HTTP.

**Current broken pattern** (sanityDataLoader.ts lines 1–15 — replace entirely):
```ts
import { SanityApiResponse } from "@/app/models/sanityTypes";
import axios from "axios";

export const loadSanityData = async (): Promise<SanityApiResponse[]> => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const response = await axios.get<SanityApiResponse[]>(
    `${baseUrl}/api/sanity-data`
  );
  if (response.status !== 200) {
    throw new Error(`Failed to fetch Sanity data. Status: ${response.status}`);
  }
  return response.data;
};
```

**Client creation pattern to copy from** (app/api/sanity-data/route.ts lines 1–2, 46–55):
```ts
import { createClientFromParam, SanityClientConfig } from "@/app/sanityClient";

// Inside GET():
const config: SanityClientConfig = {
  projectId: process.env.SANITY_PROJECT_ID || "",
  dataset: process.env.SANITY_DATASET || "",
  apiVersion: process.env.SANITY_API_VERSION || "",
  useCdn: false,
};
const sanityClient = createClientFromParam(config);
const response = await sanityClient?.fetch(query, { time: Date.now() });
```

**GROQ query to migrate** (app/api/sanity-data/route.ts lines 4–44 — copy verbatim into sanityDataLoader.ts):
```ts
const query = `*[_type == 'profile' || _type == 'workExperience' || _type == 'education' || _type == 'project'] {
    _id,
    _type,
    title,
    _type == 'profile' => {
      profilePicture, description, languages, mobile, email, location,
      personalitySkills, professionalSkills, linkedInUrl, githubUrl
    },
    _type == 'education' => { school, start, end },
    _type == 'workExperience' => { sortIndex, duration, description },
    _type == 'project' => { sortIndex, title, coverImage, duration, client, site, tags, body }
}`
```

**`createClientFromParam` factory** (app/sanityClient.ts lines 10–22 — reference only, do not duplicate):
```ts
export function createClientFromParam(config: SanityClientConfig) {
  if (config) {
    return createClient({ projectId, dataset, apiVersion, useCdn, perspective: "published" });
  } else {
    return null;
  }
}
```
The factory returns `null` when config is falsy. The new `loadSanityData` must guard: `if (!sanityClient) throw new Error(...)`.

**After this change:** `app/api/sanity-data/route.ts` is dead code and is deleted. The `axios` import is removed from `sanityDataLoader.ts` only — `axios` stays in `package.json` because `lib/hooks/sanityConfigLoader.ts` still uses it.

**Also update `app/api/revalidate/route.ts`** (line 11 — remove the now-dead path revalidation):
```ts
// REMOVE this line (route is being deleted):
revalidatePath("/api/sanity-data");
// KEEP:
revalidatePath("/");
```

---

### `app/api/revalidate/route.ts` (middleware, request-response)

**Status: Already correct for TD-03.** Auth comparison on line 6 already reads:
```ts
if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
```

**Minor cleanup needed** (line 11 — remove stale `revalidatePath` call after TD-02 deletes the route):
```ts
// REMOVE (after sanity-data route is deleted):
revalidatePath("/api/sanity-data");
```

**Pattern to preserve** (lines 1–33 — keep structure, auth check, try/catch, Cache-Control headers):
```ts
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized!", { status: 401 });
  }
  try {
    revalidatePath("/");
    return NextResponse.json("Successful reloading of sanity data!", {
      status: 200,
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" },
    });
  } catch (error) {
    return NextResponse.json(`Failed reloading data: ${error}`, {
      status: 500,
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" },
    });
  }
}
```

---

### `app/context/GlobalContext.tsx` (provider, event-driven)

**Status: TD-04 is effectively already resolved.** RESEARCH.md Pre-Implementation Audit documents that the `if (!workExperience)` stale-data guard from CONCERNS.md no longer exists. Current code has `if (workExperienceArray != null)` and `if (projectsData != null)` — these guard incoming data, not existing state.

**Current guards that may be removed per D-14** (lines 61–78):
```ts
const workExperienceArray = data?.filter((item) => item._type === "workExperience");
if (workExperienceArray != null) {       // <- D-14 targets this pattern
  const sortedList = [...workExperienceArray].sort((a, b) => a.sortIndex - b.sortIndex);
  setWorkExperienceData(sortedList);
}

const projectsData = data?.filter((item) => item._type === "project");
if (projectsData != null) {             // <- D-14 targets this pattern
  const sortedList = [...projectsData].sort((a, b) => a.sortIndex - b.sortIndex);
  setProjects(sortedList);
}
```

**Pattern if removing guards** (make setters unconditional — low risk since `Array.filter` always returns an array, never `null`/`undefined`):
```ts
const workExperienceArray = data?.filter((item) => item._type === "workExperience") ?? [];
const sortedWE = [...workExperienceArray].sort((a, b) => a.sortIndex - b.sortIndex);
setWorkExperienceData(sortedWE);

const projectsData = data?.filter((item) => item._type === "project") ?? [];
const sortedP = [...projectsData].sort((a, b) => a.sortIndex - b.sortIndex);
setProjects(sortedP);
```

**Planner note:** RESEARCH.md recommends treating TD-04 as satisfied. If the planner agrees, document as "already resolved" and make no changes. If the planner follows D-14 literally, apply the unconditional pattern above.

---

### `components/wrappers/QueryClientWrapper.tsx` (provider, event-driven)

**Status: TD-05 is already done.** Line 10 already reads:
```tsx
const [queryClient] = useState(() => new QueryClient());
```

No changes required. Verify in plan and mark complete.

**Full current file for reference** (lines 1–14):
```tsx
"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";

export default function QueryClientWrapper({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
```

---

## Shared Patterns

### "use client" directive
**Source:** `components/wrappers/SiteWrapper.tsx` line 1, `components/wrappers/QueryClientWrapper.tsx` line 1, `app/context/GlobalContext.tsx` line 1
**Apply to:** `components/ThemeToggle.tsx`
```tsx
"use client"
```
All client components in this project place `"use client"` as the first line, before any imports.

### next/font CSS variable convention
**Source:** `app/layout.tsx` lines 6–15 (existing `localFont` calls)
**Apply to:** `app/fonts.ts`
The pattern is: declare font with `variable: '--font-name'`, export the object, apply `fontObject.variable` as a className on `<html>` in layout.
```tsx
const font = localFont({ src: "...", variable: "--font-name", weight: "..." });
// In layout: <html className={`${font.variable} ...`}>
```
New fonts follow the same convention, substituting `next/font/google` for `next/font/local`.

### Sanity client construction
**Source:** `app/api/sanity-data/route.ts` lines 46–55, `app/sanityClient.ts` lines 10–22
**Apply to:** `lib/api/sanityDataLoader.ts`
```ts
const config: SanityClientConfig = {
  projectId: process.env.SANITY_PROJECT_ID || "",
  dataset: process.env.SANITY_DATASET || "",
  apiVersion: process.env.SANITY_API_VERSION || "",
  useCdn: false,
};
const sanityClient = createClientFromParam(config);
if (!sanityClient) throw new Error('Sanity client could not be created');
return sanityClient.fetch(query);
```

### Route handler error pattern
**Source:** `app/api/revalidate/route.ts` lines 10–33
**Apply to:** Any new Route Handlers added in future phases
```ts
try {
  // ... operation ...
  return NextResponse.json("Success message", {
    status: 200,
    headers: { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" },
  });
} catch (error) {
  return NextResponse.json(`Failed: ${error}`, {
    status: 500,
    headers: { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" },
  });
}
```

### Tailwind CSS variable token consumption
**Source:** `tailwind.config.ts` lines 13–52
**Apply to:** All future color token additions
```ts
// Pattern: define CSS variable as bare HSL triplet in globals.css,
// consume via hsl() wrapper in tailwind.config.ts
colors: {
  background: "hsl(var(--background))",  // CSS: --background: 30 18% 4%;
}
// Exception: rgba tokens cannot use hsl() wrapper —
// use var(--token) directly or define separate --ms-* variables
```

---

## No Analog Found

All files have close analogs in the codebase. No entries.

---

## Files to Delete (no analog needed — pure removal)

| File | Reason |
|---|---|
| `app/api/sanity-data/route.ts` | Becomes dead code after TD-02 direct-fetch migration |
| `app/fonts/GeistVF.woff` | Replaced by `next/font/google` Inter |
| `app/fonts/GeistMonoVF.woff` | Replaced by `next/font/google` JetBrains Mono |

Note: confirm the `.woff` files exist before deleting — the layout currently references them. The `app/fonts/` directory may contain only these two files.

---

## Metadata

**Analog search scope:** `app/`, `lib/`, `components/`
**Files read:** 13 source files
**Pattern extraction date:** 2026-05-09
