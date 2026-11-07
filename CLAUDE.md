# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Next.js app
npm run dev       # Start dev server (localhost:3000)
npm run build     # Build for production
npm run lint      # Run ESLint
npm test          # Vitest unit tests (lib/**/*.test.ts, sanity/migrations/**/*.test.ts)
bash scripts/verify-i18n.sh   # Routing/SEO/API checks; needs `npm run build && npm run start` first

# Sanity Studio (run from /sanity directory)
cd sanity && npm run dev      # Start Sanity Studio locally
cd sanity && npm run deploy   # Deploy Studio to hosted environment
```

`scripts/verify-i18n.sh` skips two checks unless asked: `VERIFY_SEND_EMAIL=1` posts a valid contact form (sends a real email when `RESEND_API_KEY` is set) and `VERIFY_SV_CONTENT=1` checks Swedish Sanity content after the translation migration.

## Architecture

This is a portfolio/resume site for Monkey Solutions. Content is managed via Sanity CMS and served through Next.js App Router.

**Data flow:**
1. `app/[lang]/layout.tsx` (server component, statically generated per language) calls `loadSanityData(lang)` (`lib/api/sanityDataLoader.ts`), which runs the GROQ query from `buildSiteQuery(lang)` (`lib/api/siteQuery.ts`)
2. `normalizeSanityData` (`lib/content/normalize.ts`) splits and sorts the result; the layout passes it to `GlobalContextProvider initialData` (`app/context/GlobalContext.tsx`), so content is in the server-rendered HTML
3. All UI components read from `GlobalContext` — they do not fetch data themselves

## Languages (sv/en)

- Swedish is the default at `/`, English at `/en`. `proxy.ts` rewrites Swedish paths to the internal `/sv` segment and 308-redirects any visible `/sv/...` away; the decision logic is `resolveProxy` in `lib/i18n/proxyRules.ts`.
- `lib/i18n/routes.ts` is the only place slugs live (`pathFor`, `languageAlternates`, `switchTarget`). A page exists in a language only when listed in its `live` array.
- UI text lives in `lib/i18n/dictionaries/sv.ts` (source, `as const`) and `en.ts` (typed `Dictionary`, same shape). Client components use `useI18n()`; server components call `getDictionary(lang)`. Brand and code-like strings (`monkey/solutions`, `TerminalCard`, `$ send_message →`) are not translated.
- Swedish Sanity content sits in `<field>Sv` sibling fields (Studio schema only; `app/models/sanityTypes.ts` keeps the English names). The Swedish GROQ picks the `Sv` field and falls back to English when it is missing or empty.
- `sanity/migrations/translate-to-swedish/` fills the `Sv` fields from a reviewed translation file with `setIfMissing`. Run `npx sanity migration run translate-to-swedish` from `/sanity` for a dry-run; `--no-dry-run` writes to production.
- SEO: per-page metadata via `buildPageMetadata` (`lib/seo/metadata.ts`), JSON-LD in the layout, `app/sitemap.ts`, `app/robots.ts`, OG images from `/api/og/<lang>`.

**Cache invalidation:** Pages are static. Sanity webhooks POST to `/api/revalidate` (authenticated via `CRON_SECRET` env var), which calls `revalidatePath('/', 'layout')` to refresh both languages. `SANITY_*` env vars are needed at build time. Do not set `dynamicParams = false` on a route whose pages must survive revalidation: Next regenerates them as cached 404s (`NoFallbackError`). It was removed from `app/[lang]/layout.tsx` for that reason; `app/[lang]/[slug]/page.tsx` still has it and must be re-checked (verify script with `CRON_SECRET`) when the first service page goes live.

**Sanity client** is created in `app/sanityClient.ts` — configured with CDN disabled to ensure fresh data on every request.

**Two separate projects in this repo:**
- `/` — Next.js app (TypeScript, Tailwind, Radix UI primitives via shadcn-style components in `components/ui/`)
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
