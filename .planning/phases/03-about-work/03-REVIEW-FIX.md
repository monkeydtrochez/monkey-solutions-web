---
phase: 03-about-work
fixed_at: 2026-05-10T00:00:00Z
review_path: .planning/phases/03-about-work/03-REVIEW.md
iteration: 1
findings_in_scope: 6
fixed: 6
skipped: 0
status: all_fixed
---

# Phase 03: Code Review Fix Report

**Fixed at:** 2026-05-10
**Source review:** `.planning/phases/03-about-work/03-REVIEW.md`
**Iteration:** 1

**Summary:**
- Findings in scope: 6 (CR-01, CR-02, WR-01, WR-02, WR-03, WR-04)
- Fixed: 6
- Skipped: 0

## Fixed Issues

### CR-01: `p.title.toUpperCase()` crashes when title is absent

**Files modified:** `components/WorkSection.tsx`, `sanity/schemaTypes/project.ts`
**Commit:** a9ad0cc
**Applied fix:** Guarded the screenshot placeholder with `(p.title ?? "UNTITLED").toUpperCase()` in WorkSection.tsx line 447. Added `validation: (Rule) => Rule.required().error('A title is required.')` to the `title` field in project.ts to close the schema/type mismatch at the source.

---

### CR-02: ThemeToggle causes React hydration mismatch for non-dark users

**Files modified:** `components/ThemeToggle.tsx`
**Commit:** a00ddbb
**Applied fix:** Replaced the lazy `useState(getInitialTheme)` initializer with a deferred mount pattern: initial state is always `"dark"` (matching SSR), a `mounted` boolean starts `false`, and a single `useEffect` on mount calls `getInitialTheme()`, sets both `mounted` and `theme`, and applies `data-theme` to the `<html>` element. The component returns a size-identical `<div aria-hidden />` placeholder until mounted, so SSR output always matches the initial client render.

---

### WR-01: Toggle logic makes it impossible to collapse the first row

**Files modified:** `components/WorkSection.tsx`
**Commit:** 66bf314
**Applied fix:** Changed `openId` type from `string | null` to `string | "closed" | null`. The `effectiveOpenId` memo now returns `null` immediately when `openId === "closed"`. `handleToggle` sets `openId` to `"closed"` (instead of `null`) when the active row is clicked again. This allows the first row to be collapsed like any other.

---

### WR-02: Two intentional no-op `useEffect` hooks inserted to pass a plan grep check

**Files modified:** `components/WorkSection.tsx`
**Commit:** 290984e
**Applied fix:** Deleted both no-op `useEffect` calls (the comment block, both hook declarations, and their dependency arrays). Also removed `useEffect` from the React import line since it was no longer used in this file.

---

### WR-03: `GlobalContext` sort comparator operates on an unnarrowed union type

**Files modified:** `app/context/GlobalContext.tsx`
**Commit:** 46873ae
**Applied fix:** Replaced the inline lambda predicates passed to `.filter()` with named type-predicate functions (`isWorkExperience` and `isProject`). Both use `item is WorkExperience` / `item is Project` return types so the filtered arrays are properly narrowed. Updated the sort and set-state calls to use the narrowed arrays. Also switched from the conditional `if (array != null)` guard to a `?? []` fallback so the state setters are always called (passing an empty array when data is null).

---

### WR-04: `profile.ts` schema uses `type: 'string'` for URL fields instead of `type: 'url'`

**Files modified:** `sanity/schemaTypes/profile.ts`
**Commit:** 11a79dc
**Applied fix:** Changed `type: 'string'` to `type: 'url'` for both `linkedInUrl` (line 23) and `githubUrl` (line 28) in the profile schema. Sanity's `url` type enables built-in format validation in Studio and prevents editors from saving malformed or dangerous protocol strings without a validation error.

---

## Build Verification

`npm run build` completed successfully after all fixes were applied:

```
✓ Compiled successfully in 1588ms
  Running TypeScript ...
  Finished TypeScript in 1512ms ...
✓ Generating static pages using 7 workers (5/5) in 209ms
```

No TypeScript errors, no compile errors.

---

_Fixed: 2026-05-10_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
