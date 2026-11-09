# Monkey Solutions Web

Portfolio and resume site for Monkey Solutions. Content is authored in Sanity CMS and rendered by a Next.js App Router app.

## Stack

- **Next.js 16** (App Router, React 19, TypeScript)
- **Sanity CMS** — headless content backend, studio lives in `/sanity`
- **Tailwind CSS v4** with dark mode (`class` strategy) and HSL theme variables in `app/globals.css`
- **Radix UI primitives** wrapped in shadcn-style components under `components/ui/`
- **Resend** for the contact form email delivery

## Repository Layout

This repo contains two separate projects:

```
/              Next.js app (the public site)
/sanity        Sanity Studio (the content editor)
```

Each has its own `package.json` and `.env.local`.

## How Data Flows

1. `app/[lang]/layout.tsx` (server component, one static build per language) calls `loadSanityData(lang)` in `lib/api/sanityDataLoader.ts`. The GROQ query comes from `lib/api/siteQuery.ts` and runs against the Sanity client in `app/sanityClient.ts` (CDN disabled).
2. `normalizeSanityData` (`lib/content/normalize.ts`) splits and sorts the result, and the layout passes it to `GlobalContextProvider initialData` (`app/context/GlobalContext.tsx`). Content is in the server-rendered HTML.
3. UI components consume `GlobalContext`. They never fetch Sanity data directly.

### Languages

Swedish lives at `/` and English at `/en`. `proxy.ts` rewrites Swedish URLs to the internal `/sv` segment and redirects any visible `/sv` away. `lib/i18n/routes.ts` is the only place slugs are defined. UI text comes from `lib/i18n/dictionaries/{sv,en}.ts`. Swedish Sanity content lives in `<field>Sv` sibling fields and falls back to English when empty.

### Cache invalidation

A Sanity webhook posts to `/api/revalidate` with `Authorization: Bearer <CRON_SECRET>`. The handler calls `revalidatePath('/', 'layout')`, which refreshes both languages.

### Content schema

Schemas live in `sanity/schemaTypes/` and define `profile`, `education`, `workExperience`, `project`, `duration`, and `blockContent`. Matching TypeScript types are in `app/models/sanityTypes.ts` — **keep these in sync** when schemas change.

### Images and downloads

- Image URLs are built via `app/utilities/imageUrlBuilder.ts` (wraps `@sanity/image-url`).
- `next.config.mjs` only allows `cdn.sanity.io/images/`** as a remote image pattern — add hosts there if needed.
- PDF downloads from Sanity append `?dl=<filename>` to the asset URL (the HTML `download` attribute is ignored cross-origin).

## Getting Started

Install dependencies and run the Next.js dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To run Sanity Studio locally:

```bash
cd sanity
npm install
npm run dev
```

## Scripts

```bash
npm run dev      # Next.js dev server on :3000
npm run build    # Production build
npm run start    # Run the production build
npm run lint     # ESLint (zero warnings allowed)
npm test         # Vitest unit tests
bash scripts/verify-i18n.sh   # Routing/SEO checks against `npm run start`

cd sanity && npm run dev      # Sanity Studio locally
cd sanity && npm run deploy   # Deploy Studio to hosted environment
```

Unit tests live next to the code as `*.test.ts` (Vitest). `scripts/verify-i18n.sh` checks routing, language, SEO and API status codes against a running production build.

## Environment

Next.js app (`.env.local` example):

```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
SANITY_PROJECT_ID={projectId}
SANITY_DATASET={envioronment}
SANITY_API_VERSION=2022-03-07
SANITY_USE_CDN=false
CRON_SECRET=<webhook auth secret>
RESEND_API_KEY=<for contact form>
```

Sanity Studio (`sanity/.env.local example`):

```
SANITY_STUDIO_PROJECT_ID={projectId}
SANITY_STUDIO_DATASET={envioronment}
```

## Styling Conventions

Define theme colors as HSL CSS variables in `app/globals.css` and reference them through `tailwind.config.ts`. Avoid arbitrary color values in components.

## Deployment

The app deploys to Vercel. Sanity Studio deploys separately via `npm run deploy` from `/sanity`. After publishing content in Studio, the configured webhook will hit `/api/revalidate` and refresh both language versions.