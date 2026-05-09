---
phase: 01-foundation-tech-debt
reviewed: 2026-05-09T00:00:00Z
depth: standard
files_reviewed: 8
files_reviewed_list:
  - app/api/revalidate/route.ts
  - app/fonts.ts
  - app/globals.css
  - app/layout.tsx
  - app/page.tsx
  - components/ThemeToggle.tsx
  - lib/api/sanityDataLoader.ts
  - tailwind.config.ts
findings:
  critical: 3
  warning: 3
  info: 2
  total: 8
status: issues_found
---

# Phase 01: Code Review Report

**Reviewed:** 2026-05-09T00:00:00Z
**Depth:** standard
**Files Reviewed:** 8
**Status:** issues_found

## Summary

Eight files forming the foundation layer of the Next.js/Sanity site were reviewed. The code is generally readable and follows the documented architecture, but three critical issues exist: a timing-attack vulnerability in the webhook auth comparison, a missing secret guard that silently allows unauthenticated revalidation when `CRON_SECRET` is unset, and an unsafe type cast in `page.tsx` that suppresses the TypeScript type system at the data boundary. Three warnings cover missing error propagation from the Sanity fetch, a ThemeToggle that ships with no visual indicator of the current state (breaking accessibility), and an empty-catch that silently swallows localStorage failures in a way that could hide problems beyond the intentional browser-security guard. Two informational items cover dead chart color tokens and a Tailwind `darkMode` key that is omitted while the project relies on a custom `@custom-variant` strategy.

---

## Critical Issues

### CR-01: Timing-attack vulnerability in webhook authentication

**File:** `app/api/revalidate/route.ts:6`
**Issue:** The auth check uses JavaScript `!==` (a short-circuit string comparison) rather than a constant-time comparison. An attacker who can measure response time differences can brute-force the `CRON_SECRET` character by character. This is the standard concern for HMAC/secret comparisons and applies here because the comparison bails out as soon as one character differs.

**Fix:**
```typescript
import { timingSafeEqual } from "crypto";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const secret = process.env.CRON_SECRET;
  const expected = `Bearer ${secret}`;

  const authorized =
    typeof authHeader === "string" &&
    authHeader.length === expected.length &&
    timingSafeEqual(Buffer.from(authHeader), Buffer.from(expected));

  if (!authorized) {
    return new Response("Unauthorized!", { status: 401 });
  }
  // ...
}
```

---

### CR-02: Missing guard when `CRON_SECRET` env var is unset

**File:** `app/api/revalidate/route.ts:6`
**Issue:** When `CRON_SECRET` is undefined (e.g., misconfigured deployment), the expression becomes `Bearer undefined`. Any request that sends the literal string `"Bearer undefined"` in the Authorization header will pass authentication and trigger a revalidation. This is a silent security gap — the server starts up without any warning that the secret is missing.

**Fix:** Add an early boot-time guard (or at minimum a request-time guard):
```typescript
export async function POST(request: NextRequest) {
  if (!process.env.CRON_SECRET) {
    console.error("CRON_SECRET is not configured — revalidate endpoint is disabled");
    return new Response("Service Unavailable", { status: 503 });
  }
  // ... existing auth check
}
```

---

### CR-03: Unsafe type cast silences fetch errors at the data boundary

**File:** `app/page.tsx:23`
**Issue:** `loadSanityData()` is declared to return `Promise<SanityApiResponse[]>`, but the cast `data as SanityApiResponse[]` at the call site means TypeScript will not warn if the actual runtime value is `null`, `undefined`, or a partial/malformed response. If the Sanity fetch throws and the error is caught somewhere higher without re-throwing (or if `sanityClient.fetch` returns an unexpected shape), `data` could be `undefined` and the cast hides it, causing a runtime crash inside `SiteWrapper` or context.

More concretely: `loadSanityData` already throws on client creation failure (`throw new Error("Sanity client could not be created")`), but that exception is not caught in `page.tsx`. An uncaught async exception in a Next.js server component produces a 500 error page with no fallback. The cast also prevents the compiler from ever flagging a null-check.

**Fix:** Remove the cast and handle the error:
```typescript
export default async function Home() {
  let data: SanityApiResponse[];
  try {
    data = await getSanityData();
  } catch (err) {
    console.error("Failed to load Sanity data:", err);
    // Render a graceful fallback instead of a 500
    return <main><p>Content is temporarily unavailable.</p></main>;
  }

  return (
    <>
      <ThemeToggle />
      <QueryClientWrapper>
        <SiteWrapper data={data}>   {/* no cast needed */}
          <BusinessCard />
          <CV />
          <Projects />
        </SiteWrapper>
      </QueryClientWrapper>
    </>
  );
}
```

---

## Warnings

### WR-01: ThemeToggle has no visual indicator of current theme state

**File:** `components/ThemeToggle.tsx:12-19`
**Issue:** The button always renders the static text "Toggle theme" regardless of which theme is active. This is both a usability problem (the user cannot tell which theme they are on) and an accessibility failure — screen readers will announce "Toggle theme" but provide no current state. WCAG 2.1 SC 4.1.2 requires that the current state of a toggle be exposed. Additionally, the component has no initial state: it reads `document.documentElement.dataset.theme` only on click, which is correct for avoiding SSR/client mismatch, but the label still never reflects state.

**Fix:**
```tsx
"use client"
import { useState, useEffect } from "react"

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark")

  useEffect(() => {
    // Sync initial state from the DOM after mount (avoids SSR mismatch)
    const current = (document.documentElement.dataset.theme as "dark" | "light") || "dark"
    setTheme(current)
  }, [])

  function toggle() {
    const next = theme === "dark" ? "light" : "dark"
    document.documentElement.dataset.theme = next
    setTheme(next)
    try { localStorage.setItem("ms_theme", next) } catch {}
  }

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      aria-pressed={theme === "dark"}
      style={{ position: "fixed", top: "1rem", right: "1rem", zIndex: 9999, padding: "0.5rem 1rem", cursor: "pointer" }}
    >
      {theme === "dark" ? "Light mode" : "Dark mode"}
    </button>
  )
}
```

---

### WR-02: Sanity fetch errors are swallowed — no error surfacing to caller

**File:** `lib/api/sanityDataLoader.ts:46-56`
**Issue:** `sanityClient.fetch(query)` can throw (network failure, bad GROQ, Sanity API error). The function has no try/catch, which means the raw Sanity SDK error propagates up as an unhandled exception. While the caller in `page.tsx` could theoretically catch it (and currently does not — see CR-03), the loader itself also logs nothing, making diagnosis during outages very difficult in production.

More critically, empty strings are passed for `projectId`, `dataset`, and `apiVersion` when the environment variables are missing (line 48–51 use `|| ""`). The Sanity client is created successfully with empty strings (the `if (config)` check in `createClientFromParam` always passes because an object is always truthy), so `createClientFromParam` returns a client that will then fail at fetch time with a cryptic SDK error rather than a clear misconfiguration message.

**Fix:**
```typescript
export const loadSanityData = async (): Promise<SanityApiResponse[]> => {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET;
  const apiVersion = process.env.SANITY_API_VERSION;

  if (!projectId || !dataset || !apiVersion) {
    throw new Error(
      `Missing Sanity env vars: SANITY_PROJECT_ID=${projectId}, SANITY_DATASET=${dataset}, SANITY_API_VERSION=${apiVersion}`
    );
  }

  const config: SanityClientConfig = { projectId, dataset, apiVersion, useCdn: false };
  const sanityClient = createClientFromParam(config);
  if (!sanityClient) throw new Error("Sanity client could not be created");

  return sanityClient.fetch(query);
};
```

---

### WR-03: `createClientFromParam` null-check is dead code — object is always truthy

**File:** `app/sanityClient.ts:11` (cross-reference; called from `lib/api/sanityDataLoader.ts:53`)
**Issue:** The guard `if (config)` in `createClientFromParam` can never be false because the caller always passes a plain object literal. TypeScript's type signature enforces `SanityClientConfig` (not `SanityClientConfig | null | undefined`), so the else branch returning `null` is unreachable. However, the loader then checks `if (!sanityClient)` and throws — meaning a real misconfiguration (e.g., empty `projectId`) will not be caught until `sanityClient.fetch()` is called, not at client creation time. The defense-in-depth intended by the null return is hollow.

**Fix:** Either make `createClientFromParam` validate the config fields and throw directly, or validate them in the loader before passing (see WR-02 fix above). Either way, remove the dead `else { return null }` branch.

---

## Info

### IN-01: Chart color tokens defined in Tailwind but never supplied in CSS

**File:** `tailwind.config.ts:45-51`
**Issue:** Five `chart.*` color tokens (`chart-1` through `chart-5`) are wired to `hsl(var(--chart-1))` etc., but `app/globals.css` defines no `--chart-*` CSS variables for either theme. Any component that references `bg-chart-1`, `text-chart-2`, etc. will render transparent or inherit a fallback color silently. This is dead configuration that adds confusion.

**Fix:** Either add the `--chart-*` CSS variable definitions to both `[data-theme="dark"]` and `[data-theme="light"]` blocks in `globals.css`, or remove the chart color entries from `tailwind.config.ts`.

---

### IN-02: `darkMode` key absent from Tailwind config while a custom dark variant is in use

**File:** `tailwind.config.ts:3-67`
**Issue:** The project overrides the dark variant via `@custom-variant dark` in `globals.css` (line 6) to target `[data-theme=dark]` rather than the Tailwind default `prefers-color-scheme` media query. Tailwind v3 requires `darkMode: ["class", "[data-theme='dark']"]` (or in v4 the custom variant handles it). The absence of a `darkMode` key means Tailwind's own built-in `dark:` utilities still generate `.dark` class-based selectors. Any `dark:` utility class used in components will target `.dark` on an ancestor — which is never set — and therefore never activate. This creates silent dead code whenever a developer uses `dark:text-*` thinking it will respect the custom data-theme toggle.

**Fix:**
```typescript
// tailwind.config.ts
const config: Config = {
  darkMode: ["class", "[data-theme='dark']"],
  // ... rest of config
};
```

---

_Reviewed: 2026-05-09T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
