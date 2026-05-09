---
phase: 02-header-hero
reviewed: 2026-05-09T00:00:00Z
depth: standard
files_reviewed: 12
files_reviewed_list:
  - app/context/GlobalContext.tsx
  - app/globals.css
  - app/models/sanityTypes.ts
  - app/page.tsx
  - components/HeroSection.tsx
  - components/SiteHeader.tsx
  - components/TerminalCard.tsx
  - components/ThemeToggle.tsx
  - components/ui/StatusDot.tsx
  - components/wrappers/DataHydrator.tsx
  - lib/api/sanityDataLoader.ts
  - sanity/schemaTypes/profile.ts
findings:
  critical: 3
  warning: 6
  info: 4
  total: 13
status: issues_found
---

# Phase 02: Code Review Report

**Reviewed:** 2026-05-09
**Depth:** standard
**Files Reviewed:** 12
**Status:** issues_found

## Summary

Phase 2 delivers the site header and hero section. The code is generally well-structured and follows the project's token-based styling approach. However, three critical issues were found: the `ThemeToggle` initializer crashes on the server during SSR (breaking the page in production builds), the `SanityApiResponse[]` cast in `page.tsx` silently swallows a `null` that `loadSanityData` can return, and `dangerouslySetInnerHTML` is used in `layout.tsx` with a localStorage token that is not in review scope but is referenced by `ThemeToggle` — the toggle's own initializer duplicates this logic incorrectly. Six warnings cover logic correctness, missing type narrowing, an empty catch swallowing localStorage errors silently, and a missing mobile/responsive breakpoint for the hero two-column grid. Four info-level items cover hardcoded content, an unused CSS class selector, and minor type precision gaps.

---

## Critical Issues

### CR-01: `ThemeToggle` initializer crashes in SSR / during build

**File:** `components/ThemeToggle.tsx:8-9`
**Issue:** The `useState` lazy initializer accesses `document.documentElement.dataset.theme` directly. The guard `typeof document === "undefined"` only protects against the module-level top scope — inside a `useState` initializer React can call this during server rendering (RSC pre-render or `next build` static analysis). In Next.js App Router, client components are still rendered on the server for the initial HTML shell. The check returns `"dark"` correctly for the pure-server path, but any hydration mismatch caused by the client reading a different value from `localStorage` (set by the inline script in `layout.tsx`) will produce a React hydration error that breaks the toggle's rendered state silently, or in strict mode, a visible console error cascade.

More critically: the initializer reads `document.documentElement.dataset.theme` on the client — but the inline `<script>` in layout sets the attribute on `documentElement` before React hydrates. If the user's stored theme is `"light"` the script will have set `data-theme="light"` on `<html>`, but React's SSR output serialized `data-theme="dark"` (the default). React will then warn and potentially reset the attribute, fighting with the toggle. This is a hydration-mismatch bug.

**Fix:** Derive initial state from `localStorage` directly (which is what the layout script already sets), wrapped in a `useEffect` that fires after hydration. The component should render with a stable SSR-safe initial value (`"dark"`) and reconcile on mount:

```tsx
const [theme, setTheme] = useState<Theme>("dark");

useEffect(() => {
  // Read persisted preference after hydration — matches what the layout script applied
  try {
    const stored = localStorage.getItem("ms_theme") as Theme | null;
    if (stored === "light" || stored === "dark") setTheme(stored);
    else {
      // Fallback: read what the layout script already applied to documentElement
      const applied = document.documentElement.dataset.theme as Theme;
      if (applied === "light" || applied === "dark") setTheme(applied);
    }
  } catch {}
}, []);
```

This eliminates the SSR/client mismatch and removes the dual `document` access in the initializer.

---

### CR-02: `loadSanityData` return value cast discards null / error propagation gap

**File:** `app/page.tsx:11`  
**Issue:** `loadSanityData` is typed to return `Promise<SanityApiResponse[]>` but `createClientFromParam` can return `null` (when the `if (config)` branch is false), in which case `loadSanityData` throws `"Sanity client could not be created"`. However if `sanityClient.fetch(query)` itself resolves to `null` or `undefined` (Sanity can return `null` for an empty result set depending on the query shape), the function returns that value. In `page.tsx` it is then cast with `as SanityApiResponse[]`, silently producing a `null` that is passed to `DataHydrator` and subsequently to `setSiteContentToContext`. Inside `setSiteContentToContext` the parameter is typed as `SanityApiResponse[] | null` (line 34 in GlobalContext) and uses optional chaining (`data?.find`), so it does not crash — but the `workExperienceArray != null` check on line 48 of GlobalContext will match an empty array `[]` (because `[] != null` is true) and call `setWorkExperienceData([])`, replacing any previously set state with an empty array if the function is called a second time with partial data. This is a silent data-loss path.

Beyond that: if any environment variable (`SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_VERSION`) is an empty string (the fallback in `sanityDataLoader.ts` lines 49-51), `createClient` receives empty strings and will make malformed requests — the error will be a runtime fetch failure, not a useful startup-time error.

**Fix 1** — Validate env vars at startup, not silently fall back to empty string:
```ts
const projectId = process.env.SANITY_PROJECT_ID;
const dataset   = process.env.SANITY_DATASET;
const apiVersion = process.env.SANITY_API_VERSION;

if (!projectId || !dataset || !apiVersion) {
  throw new Error(
    `Missing Sanity env vars: ${[
      !projectId && "SANITY_PROJECT_ID",
      !dataset   && "SANITY_DATASET",
      !apiVersion && "SANITY_API_VERSION",
    ].filter(Boolean).join(", ")}`
  );
}
```

**Fix 2** — Remove the `as SanityApiResponse[]` cast in `page.tsx` and handle a potential empty/null result:
```ts
const data = await loadSanityData();
// data is already typed Promise<SanityApiResponse[]>; no cast needed
```

---

### CR-03: `setSiteContentToContext` interface type mismatch — signature vs. `ContextType` declaration

**File:** `app/context/GlobalContext.tsx:16` vs. `app/context/GlobalContext.tsx:34`

**Issue:** `ContextType` declares `setSiteContentToContext` as accepting `SanityApiResponse[]` (non-nullable, line 16). The implementation on line 34 accepts `SanityApiResponse[] | null`. TypeScript will report the implementation as assignable to the interface because the implementation is wider, but callers that rely on the `ContextType` interface will believe they can never pass `null` — yet `DataHydrator.tsx` passes `data` which is typed `SanityApiResponse[]` (non-null) so this is fine for now. The concern is the reverse: if a future caller reads the context type and assumes the contract is `SanityApiResponse[]`, they may not add null handling, yet the function's actual implementation accepts and handles `null` differently (it bails early on `data?.find(...)` which produces `undefined`, leaving state as-is). The contract and implementation must agree.

**Fix:** Align the `ContextType` interface to reflect the actual accepted type:
```ts
interface ContextType {
  // ...
  setSiteContentToContext: (data: SanityApiResponse[] | null) => void;
}
```

---

## Warnings

### WR-01: Hero two-column grid has no mobile breakpoint — layout breaks on narrow screens

**File:** `components/HeroSection.tsx:77-82`
**Issue:** The hero layout uses `gridTemplateColumns: "1.4fr 1fr"` as a fixed inline style with no responsive override. At mobile viewport widths the `TerminalCard` will be compressed into a narrow column alongside the heading, making both illegible. There is no media query or responsive Tailwind class applied because the component uses inline styles throughout. This will cause a broken layout at viewports below ~768px.

**Fix:** Either switch this container to a Tailwind class with responsive modifiers (`className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr]"`), or apply a `@media` style via CSS modules / a `<style>` tag. At minimum, wrap in a container that stacks to single-column on small screens.

---

### WR-02: Trust strip grid also has no mobile breakpoint

**File:** `components/HeroSection.tsx:207-214`
**Issue:** `gridTemplateColumns: "repeat(4, 1fr)"` is a fixed 4-column grid with no responsive override. On mobile this produces four very narrow columns. Same root cause as WR-01.

**Fix:** Use `className="grid grid-cols-2 md:grid-cols-4"` with Tailwind, or add a media query.

---

### WR-03: Header nav has no mobile treatment — renders as overflowing flex row

**File:** `components/SiteHeader.tsx:87-145`
**Issue:** The `<nav>` renders all five links plus `ThemeToggle` plus the CTA button in a horizontal `flex` row with `gap: 32`. On viewports narrower than ~900px this overflows the header without wrapping or collapsing to a hamburger menu. There is no `flexWrap`, no `display: none`, and no mobile nav. The sticky header will be broken/overflowed on mobile.

**Fix:** At minimum, add `flexWrap: "wrap"` and `overflow: "hidden"` to the nav, or — preferably — hide the nav links on mobile and provide a mobile menu trigger. This is a functional layout bug, not a cosmetic issue.

---

### WR-04: `ThemeToggle` empty `catch {}` silently swallows all errors

**File:** `components/ThemeToggle.tsx:16`
**Issue:** The `catch {}` block in `applyTheme` discards all errors. While the intent is to tolerate `localStorage` being unavailable (private browsing, storage quota), a bare empty catch also silences genuine programming errors (e.g., `setTheme` called with wrong arguments, though TypeScript makes that unlikely). More concretely, if `document.documentElement.dataset.theme = next` itself throws for any reason, the theme will not be applied visually but the UI will show the new button as active — a split-brain state. The try/catch scope is too wide.

**Fix:** Narrow the try/catch to only the `localStorage` call:
```ts
function applyTheme(next: Theme) {
  document.documentElement.dataset.theme = next;
  setTheme(next);
  try {
    localStorage.setItem("ms_theme", next);
  } catch {
    // localStorage unavailable (private browsing / quota) — ignore
  }
}
```

---

### WR-05: `createClientFromParam` guard is always true — dead `else` branch

**File:** `app/sanityClient.ts:11-21`
**Issue:** `config` is typed as `SanityClientConfig` (a non-nullable interface). The `if (config)` check can never be falsy when the TypeScript type is respected — objects are always truthy. The `else { return null }` branch is unreachable dead code, but it exists in the type signature as a possible `null` return, which forces `sanityDataLoader.ts` to guard against it (`if (!sanityClient) throw ...`). This creates unnecessary complexity for no safety benefit.

**Fix:** Remove the dead branch and return directly:
```ts
export function createClientFromParam(config: SanityClientConfig) {
  return createClient({
    projectId: config.projectId,
    dataset: config.dataset,
    apiVersion: config.apiVersion,
    useCdn: config.useCdn,
    perspective: "published",
  });
}
```

---

### WR-06: `StatusDot` is `aria-hidden` in `SiteHeader` "Hire me" CTA — button loses meaningful accessible label

**File:** `components/SiteHeader.tsx:142-145`
**Issue:** `StatusDot` always renders with `aria-hidden="true"` (hardcoded in the component), so the orange dot inside the "Hire me" `<a>` element is invisible to screen readers — that is correct. However the `<a>` element itself has no `aria-label`, meaning screen readers will announce its text content only: "Hire me". That is acceptable on its own, but the dot provides a visual "available" signal that has no accessible equivalent alongside the button. Additionally, the `StatusDot` is used with its default `pulse={true}` in both the hero status row and the header CTA, but in the header the animation is inside a link, which can cause focus-related animation flicker in some browsers. This is a minor but real accessibility gap.

**Fix:** The `<a>` in the header already reads "Hire me" — acceptable. No change strictly required. However, if the availability signal is semantically meaningful (as it is in the hero's status row), a visually hidden `<span>` text equivalent should accompany the dot in contexts where its meaning matters. Low-impact but flagged as a correctness concern.

---

## Info

### IN-01: Hardcoded content in `TerminalCard` and `HeroSection` — not connected to Sanity

**File:** `components/TerminalCard.tsx:1`, `components/HeroSection.tsx:15-20`
**Issue:** `STACK_CHIPS`, `TRUST_STATS`, and the terminal text ("daniel.trochez", "software_developer", "2–3 slots left") are all hardcoded constants. The Sanity `profile` schema has `professionalSkills` and `heroBio` fields, but the stack chips and trust numbers are not sourced from CMS data. The "Q2 2026" availability text in HeroSection line 102 is similarly hardcoded.

**Fix:** If these values are intended to be content-managed, add corresponding fields to the `profile` schema. If intentionally static for this phase, document that explicitly.

---

### IN-02: `WorkDescriptionSpan.marks` typed as `never[]` — too restrictive

**File:** `app/models/sanityTypes.ts:82`
**Issue:** `marks: never[]` means the array must always be empty — any Sanity block content with inline marks (bold, italic, links) will fail TypeScript validation at runtime usage even though the data arrives fine. Sanity's portable text marks are `string[]`.

**Fix:**
```ts
interface WorkDescriptionSpan {
  _type: "span";
  text: string;
  _key: string;
  marks: string[];  // mark keys referencing markDefs entries
}
```

Similarly `WorkDescriptionBlock.markDefs: never[]` should be `MarkDef[]` or at minimum `{ _key: string; _type: string; [key: string]: unknown }[]`.

---

### IN-03: `ms-cursor` class selector in `globals.css` reduced-motion rule targets the wrong selector

**File:** `app/globals.css:161`
**Issue:** The reduced-motion rule is:
```css
.animate-pulse, [class*="ms-cursor"] { animation: none; }
```
But the cursor element in `TerminalCard.tsx` uses `className="ms-cursor"` (line 138). The attribute selector `[class*="ms-cursor"]` will match it. However, `animate-pulse` is a Tailwind utility class — yet `StatusDot` uses the custom `ms-pulse` keyframe via inline style (not `animate-pulse`). The `animate-pulse` selector in the reduced-motion rule targets Tailwind's built-in pulse animation, not the custom `ms-pulse` used on `StatusDot`. As a result, under `prefers-reduced-motion: reduce`, the pulsing dot in `StatusDot` will **not** be suppressed because it uses `animation: "ms-pulse ..."` via inline style, not the `animate-pulse` class.

**Fix:** Add a selector for the `ms-pulse` animation specifically:
```css
@media (prefers-reduced-motion: reduce) {
  .animate-pulse,
  [class*="ms-cursor"],
  [style*="ms-pulse"] { animation: none; }
}
```
Or — better — give the pulse `<span>` inside `StatusDot` a dedicated CSS class and target it directly.

---

### IN-04: `Profile` type has `description: WorkDescriptionBlock[]` but field is semantically block content

**File:** `app/models/sanityTypes.ts:16-17`
**Issue:** `description` is typed as `WorkDescriptionBlock[]` — a type intended for `workExperience` description blocks. The Sanity schema defines `description` as type `blockContent` (a richer portable text type that may include images, links, and other marks). Reusing `WorkDescriptionBlock` for profile description works only while no rich content is used, but it will silently fail type checks when Sanity returns block content with annotations or non-block types.

**Fix:** Extract a shared `PortableTextBlock` type or use `@portabletext/types` to type this field accurately. At minimum, rename the shared type to `BlockContentItem` to signal it is not workExperience-specific.

---

_Reviewed: 2026-05-09_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
