# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Next.js app
npm run dev       # Start dev server (localhost:3000)
npm run build     # Build for production
npm run lint      # Run ESLint

# Sanity Studio (run from /sanity directory)
cd sanity && npm run dev      # Start Sanity Studio locally
cd sanity && npm run deploy   # Deploy Studio to hosted environment
```

There are no tests configured.

## Architecture

This is a portfolio/resume site for Monkey Solutions. Content is managed via Sanity CMS and served through Next.js App Router.

**Data flow:**
1. `app/page.tsx` (server component) calls `/api/sanity-data` at request time
2. The API route (`app/api/sanity-data/route.ts`) fetches content from Sanity using a GROQ query via `lib/api/sanityDataLoader.ts`
3. Data is passed into `GlobalContext` (`app/context/GlobalContext.tsx`), a client-side React context
4. All UI components read from `GlobalContext` — they do not fetch data themselves

**Cache invalidation:** Sanity webhooks POST to `/api/revalidate` (authenticated via `CRON_SECRET` env var), which calls `revalidatePath('/')`.

**Sanity client** is created in `app/sanityClient.ts` — configured with CDN disabled to ensure fresh data on every request.

**Two separate projects in this repo:**
- `/` — Next.js app (TypeScript, Tailwind, TanStack Query for client-side state, Radix UI primitives via shadcn-style components in `components/ui/`)
- `/sanity/` — Sanity Studio with schema definitions. Schemas live in `sanity/schemaTypes/` and define `profile`, `education`, `workExperience`, `project`, `duration`, and `blockContent` types.

**TypeScript types** for Sanity content are in `app/models/sanityTypes.ts` — keep these in sync with schema changes in `sanity/schemaTypes/`.

**Image URLs** from Sanity use the builder in `app/utilities/imageUrlBuilder.ts`, which wraps `@sanity/image-url`.

## Environment Variables

```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
SANITY_PROJECT_ID=zj7baet4
SANITY_DATASET=production
SANITY_API_VERSION=2022-03-07
SANITY_USE_CDN=false
CRON_SECRET=<webhook auth secret>
```

Sanity Studio needs its own `.env.local` inside `/sanity/` with `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET`.

## Styling

Tailwind with dark mode (`class` strategy). Custom theme colors are defined as HSL CSS variables in `app/globals.css` and referenced through `tailwind.config.ts` — add new colors there, not as arbitrary values.

## Commit Messages

- Never include `Co-authored-by: Claude` or any AI attribution tags

## Key Constraints

- Next.js image optimization is configured to allow only `cdn.sanity.io/images/**` as a remote pattern — update `next.config.mjs` if other external image hosts are needed.
- The `/api/revalidate` endpoint must receive `Authorization: Bearer <CRON_SECRET>` — this is called by a Sanity webhook, not a cron job.
