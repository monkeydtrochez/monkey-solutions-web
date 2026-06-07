# Package Migrations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade all held-back major-version packages to latest stable as a clean baseline before the website redesign, landing each ecosystem group in its own commit.

**Architecture:** Five sequential commits — each one self-contained, build-verified before the next starts. No redesign work begins until all five commits are merged.

**Tech Stack:** Next.js 16, React 19, TypeScript, ESLint, Tailwind CSS, Sanity CMS

---

## File Map

| File | Task | Change |
|------|------|--------|
| `package.json` | 1, 2, 3, 4, 5 | Version bumps, add/remove packages |
| `tsconfig.json` | 2 | Add `"types": ["node"]` |
| `.eslintrc.json` | 3 | Delete — replaced by `eslint.config.mjs` |
| `eslint.config.mjs` | 3 | Create — flat config replacement |
| `sanity/.eslintrc` | 3 | Delete — sanity sub-project migrates to its own flat config |
| `sanity/eslint.config.mjs` | 3 | Create — flat config for sanity sub-project |
| `app/utilities/imageUrlBuilder.ts` | 4 | Rename import + constructor call |
| `components/ui/SocialMediaButtons.tsx` | 5 | Replace removed brand icons with inline SVGs |
| `postcss.config.mjs` | 6 | Swap `tailwindcss` plugin for `@tailwindcss/postcss` |
| `app/globals.css` | 6 | Replace `@tailwind` directives, add `@plugin` |
| `tailwind.config.ts` | 6 | Remove `plugins` array, update `darkMode` syntax |

---

## Task 1: Bump `@types/node`

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install updated package**

```bash
npm install --save-dev @types/node@^25
```

- [ ] **Step 2: Verify build is clean**

```bash
npm run build
```

Expected: build succeeds with no new errors.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: bump @types/node to v25"
```

---

## Task 2: TypeScript 6

**Files:**
- Modify: `package.json`
- Modify: `tsconfig.json`

- [ ] **Step 1: Install TypeScript 6**

```bash
npm install --save-dev typescript@^6
```

- [ ] **Step 2: Add explicit `types` to tsconfig**

TypeScript 6 no longer auto-includes `@types/*` packages. Open `tsconfig.json` and add `"types": ["node"]` inside `compilerOptions`:

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "types": ["node"],
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] },
    "target": "ES2017"
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": ["node_modules", "sanity"]
}
```

- [ ] **Step 3: Run type check to surface any new strict errors**

```bash
npx tsc --noEmit
```

Expected: exits clean. If there are new errors, fix them before proceeding — TypeScript 6 tightened a handful of checks. Common new error: implicit `any` in callback parameters — add explicit types.

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json tsconfig.json
git commit -m "chore: upgrade TypeScript to v6"
```

---

## Task 3: ESLint 10 + eslint-plugin-react-hooks 7

**Files:**
- Modify: `package.json`
- Delete: `.eslintrc.json`
- Create: `eslint.config.mjs`
- Delete: `sanity/.eslintrc`
- Create: `sanity/eslint.config.mjs`

ESLint 10 drops support for `.eslintrc.*` files entirely. Config must live in `eslint.config.mjs` (flat config format).

- [ ] **Step 1: Install updated packages**

```bash
npm install --save-dev eslint@^10 eslint-plugin-react-hooks@^7
```

- [ ] **Step 2: Run the migration codemod on the root config**

```bash
npx @eslint/migrate-config .eslintrc.json
```

This generates a starter `eslint.config.mjs`. Ignore the generated file for now — you'll replace it with the correct content in the next step.

- [ ] **Step 3: Write the root `eslint.config.mjs`**

Next.js 16 ships with flat config support. Replace the generated file with:

```js
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
```

- [ ] **Step 4: Install `@eslint/eslintrc` if not already present**

```bash
npm list @eslint/eslintrc || npm install --save-dev @eslint/eslintrc
```

- [ ] **Step 5: Delete the old root ESLint config**

```bash
rm .eslintrc.json
```

- [ ] **Step 6: Verify root linting works**

```bash
npm run lint
```

Expected: exits clean (same results as before).

- [ ] **Step 7: Migrate the Sanity sub-project ESLint config**

The `sanity/` directory is a separate project using `@sanity/eslint-config-studio` with ESLint 8. Create a flat config for it, then delete the old one.

Create `sanity/eslint.config.mjs`:

```js
import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends("@sanity/eslint-config-studio"),
];

export default eslintConfig;
```

Note: `sanity/` has its own `package.json` with `eslint@^8`. The flat config here only governs how ESLint is configured — the version used when running `eslint` inside `sanity/` is still the local v8. This config file future-proofs the setup.

- [ ] **Step 8: Delete the old Sanity ESLint config**

```bash
rm sanity/.eslintrc
```

- [ ] **Step 9: Verify full build and lint**

```bash
npm run build && npm run lint
```

Expected: both exit clean.

- [ ] **Step 10: Commit**

```bash
git add package.json package-lock.json eslint.config.mjs sanity/eslint.config.mjs
git rm .eslintrc.json sanity/.eslintrc
git commit -m "chore: upgrade ESLint to v10 and migrate to flat config"
```

---

## Task 4: Sanity ecosystem (@sanity/client 7, @sanity/image-url 2, @portabletext/react 6)

**Files:**
- Modify: `package.json`
- Modify: `app/utilities/imageUrlBuilder.ts`

- [ ] **Step 1: Install updated packages**

```bash
npm install @sanity/client@^7 @sanity/image-url@^2 @portabletext/react@^6
```

- [ ] **Step 2: Update the import and constructor in `imageUrlBuilder.ts`**

`@sanity/image-url` v2 renames the default export to a named export. Open `app/utilities/imageUrlBuilder.ts` and apply this change:

```ts
// Before (line 1 and line 15)
import imageUrlBuilder from "@sanity/image-url";
// ...
const builder = imageUrlBuilder(sanityClient);

// After
import { createImageUrlBuilder } from "@sanity/image-url";
// ...
const builder = createImageUrlBuilder(sanityClient);
```

Full updated file:

```ts
import { createImageUrlBuilder } from "@sanity/image-url";
import { createClientFromParam, SanityClientConfig } from "@/app/sanityClient";

export function buildImageUrlFor(
  sanityClientConfig: SanityClientConfig,
  imageRef: string
) {
  if (!imageRef) {
    console.warn("Warning: imageRef is undefined.");
    return "";
  }
  try {
    const sanityClient = createClientFromParam(sanityClientConfig);
    if (sanityClient !== null) {
      const builder = createImageUrlBuilder(sanityClient);
      const imageUrl = builder.image(imageRef);
      return imageUrl ? imageUrl.toString() : "";
    }
    return "";
  } catch (error) {
    console.error("Error building image URL:", error);
    return "";
  }
}
```

- [ ] **Step 3: Run type check**

```bash
npx tsc --noEmit
```

Expected: clean.

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: clean build.

- [ ] **Step 5: Smoke-test Sanity data in dev**

```bash
npm run dev
```

Open `http://localhost:3000` in a browser. Verify the page loads content from Sanity (profile, work experience, projects visible). Stop the server with Ctrl+C.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json app/utilities/imageUrlBuilder.ts
git commit -m "chore: upgrade Sanity ecosystem to @sanity/client v7, image-url v2, @portabletext/react v6"
```

---

## Task 5: lucide-react 1.x

**Files:**
- Modify: `package.json`
- Modify: `components/ui/SocialMediaButtons.tsx`

`Github` and `Linkedin` brand icons were removed from lucide-react v1. Replace them with inline SVGs from the official brand kits.

- [ ] **Step 1: Install lucide-react v1**

```bash
npm install lucide-react@^1
```

- [ ] **Step 2: Replace `SocialMediaButtons.tsx`**

Open `components/ui/SocialMediaButtons.tsx` and replace the entire file:

```tsx
import { Button } from "./button";

interface SocialMediaProps {
  linkedInUrl: string;
  githubUrl: string;
}

const GithubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-4 w-4"
    aria-hidden="true"
  >
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-4 w-4"
    aria-hidden="true"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const SocialMediaButtons = ({ linkedInUrl, githubUrl }: SocialMediaProps) => {
  return (
    <div className="flex justify-center space-x-4 mb-8">
      <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
        <Button variant="outline" size="icon">
          <LinkedinIcon />
        </Button>
      </a>
      <a href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
        <Button variant="outline" size="icon">
          <GithubIcon />
        </Button>
      </a>
    </div>
  );
};

export default SocialMediaButtons;
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: clean build with no lucide import errors.

- [ ] **Step 4: Verify icons render in dev**

```bash
npm run dev
```

Open `http://localhost:3000`. Confirm both GitHub and LinkedIn icons are visible and clickable. Stop the server with Ctrl+C.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json components/ui/SocialMediaButtons.tsx
git commit -m "chore: upgrade lucide-react to v1, replace removed brand icons with inline SVGs"
```

---

## Task 6: Tailwind 4 + tailwind-merge 3

**Files:**
- Modify: `package.json`
- Modify: `postcss.config.mjs`
- Modify: `app/globals.css`
- Modify: `tailwind.config.ts`

This is the most involved migration. Tailwind 4 changes the PostCSS plugin name, CSS directives, and plugin loading. The automated codemod handles most of it — review all diffs before committing.

- [ ] **Step 1: Install Tailwind 4 packages**

```bash
npm install tailwindcss@^4 @tailwindcss/postcss tailwind-merge@^3
```

- [ ] **Step 2: Remove autoprefixer**

Tailwind 4 bundles autoprefixer natively — the separate package is no longer needed.

```bash
npm uninstall autoprefixer
```

- [ ] **Step 3: Run the official upgrade codemod**

```bash
npx @tailwindcss/upgrade
```

When prompted about migrating your config file, choose **yes**. Review all changes it makes — particularly in `app/globals.css` and `tailwind.config.ts` — before proceeding.

- [ ] **Step 4: Replace `postcss.config.mjs`**

The codemod may handle this, but verify. The file should look exactly like this:

```js
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

- [ ] **Step 5: Update `app/globals.css`**

The codemod replaces the three `@tailwind` directives. Verify the top of the file now reads:

```css
@import "tailwindcss";
@config "./tailwind.config.ts";
@plugin "tailwindcss-animate";
```

The `@config` line keeps the existing `tailwind.config.ts` working. The `@plugin` line replaces the `require("tailwindcss-animate")` in the JS config.

The `@layer utilities` and `@layer base` blocks, and all CSS variable definitions, remain exactly as-is — do not touch them.

Full expected `app/globals.css`:

```css
@import "tailwindcss";
@config "./tailwind.config.ts";
@plugin "tailwindcss-animate";

body {
  font-family: Arial, Helvetica, sans-serif;
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}

@layer base {
  :root {
    --background: 30.7 15% 95%;
    --foreground: 30.7 5% 10%;
    --card: 30.7 15% 90%;
    --card-foreground: 30.7 5% 12%;
    --popover: 30.7 15% 95%;
    --popover-foreground: 30.7 95% 10%;
    --primary: 30.7 97.2% 72.4%;
    --primary-foreground: 0 0% 0%;
    --secondary: 30.7 15% 70%;
    --secondary-foreground: 0 0% 0%;
    --muted: -7.300000000000001 15% 85%;
    --muted-foreground: 30.7 5% 35%;
    --accent: -7.300000000000001 15% 80%;
    --accent-foreground: 30.7 5% 12%;
    --destructive: 0 50% 30%;
    --destructive-foreground: 30.7 5% 90%;
    --border: 30.7 20% 50%;
    --input: 30.7 20% 18%;
    --ring: 30.7 97.2% 72.4%;
    --radius: 0.5rem;
  }
  .dark {
    --background: 30.7 15% 10%;
    --foreground: 30.7 5% 90%;
    --card: 30.7 15% 10%;
    --card-foreground: 30.7 5% 90%;
    --popover: 30.7 15% 5%;
    --popover-foreground: 30.7 5% 90%;
    --primary: 30.7 97.2% 72.4%;
    --primary-foreground: 0 0% 0%;
    --secondary: 30.7 15% 12%;
    --secondary-foreground: 0 0% 100%;
    --muted: -7.300000000000001 15% 15%;
    --muted-foreground: 30.7 5% 60%;
    --accent: -7.300000000000001 15% 15%;
    --accent-foreground: 30.7 5% 90%;
    --destructive: 0 50% 30%;
    --destructive-foreground: 30.7 5% 90%;
    --border: 30.7 20% 18%;
    --input: 30.7 20% 18%;
    --ring: 30.7 97.2% 72.4%;
    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

- [ ] **Step 6: Update `tailwind.config.ts`**

Remove the `plugins` array (moved to CSS `@plugin`) and update `darkMode` syntax (v4 JS config drops the array form):

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
};

export default config;
```

- [ ] **Step 7: Verify build**

```bash
npm run build
```

Expected: clean build. If you see errors about unknown utilities or missing CSS variables, the codemod may have renamed something — check the diff and restore any values it changed incorrectly.

- [ ] **Step 8: Visual smoke test**

```bash
npm run dev
```

Open `http://localhost:3000` and check:
- Page layout renders correctly (no broken spacing or colors)
- Dark mode toggle works (if exposed in UI — add `dark` class to `<html>` in DevTools manually if not)
- Hover states work on buttons and cards
- Animations (card transitions) play correctly

Stop the server with Ctrl+C.

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json postcss.config.mjs app/globals.css tailwind.config.ts
git commit -m "chore: upgrade Tailwind CSS to v4 and tailwind-merge to v3"
```

---

## Final Verification

After all five commits:

- [ ] Run `npm run build` — must be clean
- [ ] Run `npm run lint` — must be clean
- [ ] Run `npx tsc --noEmit` — must be clean
- [ ] Run `npm run dev` and do a full visual walkthrough: home page, CV view, Projects view, social links
