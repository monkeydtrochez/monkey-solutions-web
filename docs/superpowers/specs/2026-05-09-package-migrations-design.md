# Package Migrations Design

**Date:** 2026-05-09
**Branch:** feature/redesign-web
**Goal:** Bump all held-back major-version packages to latest stable before the website redesign. All migrations land before any redesign work begins.

---

## Context

A codebase scan identified the following packages held at old major versions after the previous upgrade pass. These are being migrated now so the redesign starts from a clean, current baseline.

---

## Commit Sequence

### Commit 1 — `@types/node` 22 → 25

**Package:** `@types/node@^25`
**Code changes:** None
**Verification:** `npm run build`

---

### Commit 2 — TypeScript 6 + ESLint 10 + eslint-plugin-react-hooks 7

**Packages:** `typescript@^6`, `eslint@^10`, `eslint-plugin-react-hooks@^7`

**TypeScript 6:**
- Run `npx @andrewbranch/ts5to6` codemod on `tsconfig.json`
- Add `"types": ["node"]` explicitly to `tsconfig.json` (TS6 no longer auto-includes `@types/*` packages)
- Run `npx tsc --noEmit` to surface any newly-strict type errors and fix them

**ESLint 10:**
- Run `npx @eslint/migrate-config .eslintrc.json` to generate `eslint.config.js`
- Delete `.eslintrc.json`
- Run `npx @eslint/migrate-config sanity/.eslintrc` to generate `sanity/eslint.config.js`
- Delete `sanity/.eslintrc`
- Verify `eslint-config-next` flat config export works with Next 16

**eslint-plugin-react-hooks 7:**
- Handled as part of the ESLint flat config migration — use `recommended` preset (not `recommended-legacy`) in `eslint.config.js`

**Verification:** `npm run lint`, `npx tsc --noEmit`, `npm run build`

---

### Commit 3 — Sanity ecosystem

**Packages:** `@sanity/client@^7`, `@sanity/image-url@^2`, `@portabletext/react@^6`

**Code changes — `app/utilities/imageUrlBuilder.ts`:**
```ts
// Before
import imageUrlBuilder from "@sanity/image-url";
const builder = imageUrlBuilder(sanityClient);

// After
import { createImageUrlBuilder } from "@sanity/image-url";
const builder = createImageUrlBuilder(sanityClient);
```

`@sanity/client` and `@portabletext/react` require zero code changes.

**Note:** `@sanity/client` v7 requires Node.js 20+. Verify deployment environment.

**Verification:** `npm run build`, manually confirm Sanity data loads in `npm run dev`

---

### Commit 4 — lucide-react 0.x → 1.x

**Package:** `lucide-react@^1`

**Code changes — `components/ui/SocialMediaButtons.tsx`:**
- `Github` and `Linkedin` brand icons were removed in v1. Replace both with inline SVGs sourced from GitHub and LinkedIn brand kits.
- Add `aria-label` to social link anchors (v1 sets `aria-hidden` by default on all icons, so icon-only links lose accessibility without it).

**Verification:** `npm run build`, visually confirm social icons render correctly in `npm run dev`

---

### Commit 5 — Tailwind 4 + tailwind-merge 3

**Packages:** `tailwindcss@^4`, `@tailwindcss/postcss`, `tailwind-merge@^3`
**Remove:** `autoprefixer` (bundled into Tailwind 4)

**Steps:**
1. Run `npx @tailwindcss/upgrade` codemod — handles `@tailwind` directives → `@import "tailwindcss"`, utility class renames, and most config transforms
2. Update `postcss.config.mjs`: replace `tailwindcss` plugin with `@tailwindcss/postcss`
3. Check `tailwindcss-animate` for v4 compatibility — if no v4 release exists, replace with equivalent CSS keyframe animations directly in `globals.css`
4. Migrate `darkMode: ["class"]` config to CSS `@variant dark (&:where(.dark, .dark *))` in `globals.css`
5. Move color and border-radius theme tokens from `tailwind.config.ts` `@theme` block into `globals.css`
6. `tailwind-merge` requires zero code changes — `twMerge` API in `lib/utils.ts` is unchanged

**Verification:** `npm run build`, `npm run lint`, visual check of dark mode and hover states in `npm run dev`

---

## Verification Checklist (per commit)

- [ ] `npm run build` exits clean
- [ ] `npm run lint` exits clean
- [ ] Commit 2: `npx tsc --noEmit` exits clean
- [ ] Commit 3: Sanity data loads in dev
- [ ] Commit 4: Social icons visible, `aria-label` present on anchor elements
- [ ] Commit 5: Dark mode works, hover states work on touch simulation

---

## Out of Scope

The following packages remain at their current major version intentionally — they require larger migration efforts unrelated to the redesign baseline:

- `@sanity/client` in `/sanity/` Studio directory (separate project, separate migration)
- `eslint` and TypeScript in `/sanity/` Studio directory (same)
- `@types/node` for the `/sanity/` sub-project
