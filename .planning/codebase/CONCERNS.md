# Codebase Concerns

**Analysis Date:** 2026-04-26

---

## Tech Debt

**Incomplete Redis removal:**
- Issue: A PR titled "remove-redis" was merged (commit `50e2ba5`) but only exported `loadSanityData` — it did not remove `lib/redis.ts`, the `ioredis` dependency, or the cache functions. Redis code still runs on every server startup, attempts to connect to `redis://localhost:6379`, logs an error when it fails, and keeps `revalidateCache` and `getSanityDataFromCache` as dead exports.
- Files: `lib/redis.ts`, `lib/api/sanityDataLoader.ts`, `package.json`
- Impact: `ioredis` module is instantiated at module load time (not lazily), so every cold start prints a Redis connection error to logs. The package ships in the production bundle unnecessarily.
- Fix approach: Delete `lib/redis.ts`, remove the `ioredis` `import` and all Redis `if (redis !== null)` branches from `lib/api/sanityDataLoader.ts`, delete `revalidateCache` and `getSanityDataFromCache` (both are dead — see Dead Code section), and remove `ioredis` from `package.json`.

**Self-referential HTTP call in server component:**
- Issue: `app/page.tsx` (a server component) calls `loadSanityData()`, which makes an outbound `axios.get` back to `${NEXT_PUBLIC_BASE_URL}/api/sanity-data` — the same Next.js server. This is an HTTP round-trip from the server to itself.
- Files: `app/page.tsx`, `lib/api/sanityDataLoader.ts`, `app/api/sanity-data/route.ts`
- Impact: Adds latency, requires `NEXT_PUBLIC_BASE_URL` to be correct in every environment, and can fail entirely during `next build` or cold starts before the server is listening. The Sanity client could be called directly from the server component, bypassing the API route entirely.
- Fix approach: Import `createClientFromParam` and the GROQ query directly into `lib/api/sanityDataLoader.ts` (or `app/page.tsx`) and call `sanityClient.fetch(query)` server-side without the intermediate HTTP hop.

**Duplicate Sanity client config construction:**
- Issue: The `SanityClientConfig` object (projectId, dataset, apiVersion, useCdn) is assembled from `process.env` in two separate places.
- Files: `app/api/sanity-data/route.ts` (lines 47–51), `app/api/sanity-config/route.ts` (lines 5–9)
- Impact: Adding a new config field (e.g. `token`) requires two edits. Values can drift.
- Fix approach: Create a single `lib/sanityConfig.ts` that exports the config object and import it from both routes.

**Hardcoded personal content in a CMS-backed component:**
- Issue: `components/CV.tsx` hardcodes the name "Daniel Trochez", the job title "SOFTWARE DEVELOPER", and a board membership note ("Active board member for a .NET program / Handelsakademin Göteborg") directly in JSX. These should come from the Sanity `profile` schema.
- Files: `components/CV.tsx` (lines 55–58, 79–84)
- Impact: Updating any of these requires a code change and redeployment instead of a Sanity content edit.
- Fix approach: Add matching fields to the `profile` schema in `sanity/schemaTypes/profile.ts` and the `Profile` TypeScript type in `app/models/sanityTypes.ts`, then read them from `globalContext.profile` in `CV.tsx`.

---

## Known Bugs

**Authorization header comparison is wrong:**
- Symptoms: The `/api/revalidate` webhook endpoint will return 401 for every legitimate Sanity webhook request. `CLAUDE.md` states the endpoint expects `Authorization: Bearer <CRON_SECRET>`, but the code compares the full header value directly to `process.env.CRON_SECRET` without stripping the `"Bearer "` prefix.
- Files: `app/api/revalidate/route.ts` (line 7)
- Trigger: Any POST to `/api/revalidate` with the standard `Authorization: Bearer <token>` header.
- Workaround: The Sanity webhook would need to send the raw secret as the Authorization header value (no "Bearer " prefix), which is non-standard.
- Fix: `authHeader !== `Bearer ${process.env.CRON_SECRET}``

**Context guards prevent data refresh after revalidation:**
- Symptoms: `setSiteContentToContext` skips updating `workExperience` and `projects` if they are already populated (lines 61 and 75 in `GlobalContext.tsx`). After a Sanity webhook triggers `revalidatePath('/')` and the server re-fetches fresh data, the client-side context will keep the original stale values for the lifetime of the browser session.
- Files: `app/context/GlobalContext.tsx` (lines 61–78)
- Trigger: User visits the page, data loads, then a content editor updates Sanity. The page server-renders fresh data but `setSiteContentToContext` ignores the update.
- Fix approach: Remove the `if (!workExperience)` and `if (projectsData && !projects)` guards so the context always overwrites with incoming data.

**`project.coverImage.asset._ref` accessed without optional chaining:**
- Symptoms: A runtime `TypeError` if any project in Sanity does not have a `coverImage` set.
- Files: `components/ProjectDetails.tsx` (lines 39, 43, 47)
- Trigger: Any project document in Sanity missing a cover image.
- Fix: Use `project.coverImage?.asset?._ref` and add a guard before the `buildImageUrlFor` call.

---

## Security Considerations

**`/api/sanity-config` exposes server env vars via unauthenticated public endpoint:**
- Risk: `SANITY_PROJECT_ID`, `SANITY_DATASET`, and `SANITY_API_VERSION` are served to any anonymous HTTP client at `/api/sanity-config`. While these values are technically semi-public (project IDs appear in Sanity CDN URLs), deliberately exposing server-side env vars through an API endpoint sets a bad precedent and needlessly expands the attack surface.
- Files: `app/api/sanity-config/route.ts`, `lib/hooks/sanityConfigLoader.ts`
- Current mitigation: These specific values are not secret credentials; they cannot grant write access on their own.
- Recommendation: Replace `SANITY_PROJECT_ID`, `SANITY_DATASET`, and `SANITY_API_VERSION` with `NEXT_PUBLIC_` prefixed env vars so they are inlined at build time and available in client components directly, eliminating the need for the `/api/sanity-config` endpoint entirely. Delete `app/api/sanity-config/route.ts` and `lib/hooks/sanityConfigLoader.ts`.

---

## Performance Bottlenecks

**`QueryClient` re-instantiated on every render:**
- Problem: `QueryClientWrapper` creates `new QueryClient()` directly in the function body without `useState` or `useMemo`. React will create a new `QueryClient` instance on every render cycle, discarding all cached query data.
- Files: `components/wrappers/QueryClientWrapper.tsx` (line 10)
- Cause: Missing stabilization — should be `useState(() => new QueryClient())`.
- Improvement path: `const [queryClient] = useState(() => new QueryClient())`.

**Image URLs fetched client-side via a TanStack Query API call on every mount:**
- Problem: `CV.tsx` and each `ProjectDetails.tsx` instance independently call `useSanityConfigLoader()`, which makes a TanStack Query fetch to `/api/sanity-config`. Because `QueryClient` is re-created on every render (see above), these fetches are never deduped or cached. On the Projects page with N project cards, this triggers N+1 identical API calls to `/api/sanity-config`.
- Files: `components/CV.tsx`, `components/ProjectDetails.tsx`, `lib/hooks/sanityConfigLoader.ts`
- Improvement path: Fix the `QueryClient` instantiation first. Then, if switching to `NEXT_PUBLIC_` env vars, the API call is eliminated entirely.

**`setTimeout` without cleanup in `SiteWrapper`:**
- Problem: The animation `useEffect` in `SiteWrapper` calls `setTimeout(() => toggleCardAnimation(false), 300)` but returns no cleanup function. If the component unmounts before 300ms, the callback fires on an unmounted component, causing a stale state update.
- Files: `components/wrappers/SiteWrapper.tsx` (lines 26–34)
- Improvement path: Return `() => clearTimeout(timerId)` from the effect.

---

## Fragile Areas

**`revalidateCache` in `sanityDataLoader.ts` is silently a no-op:**
- Files: `lib/api/sanityDataLoader.ts` (lines 20–51), `app/api/revalidate/route.ts` (line 14)
- Why fragile: `revalidateCache` checks `if (redis !== null)` before doing anything. Because Redis is not configured in production (no `REDIS_URL` env var), `redis` is always `null` and the function does nothing. The `/api/revalidate` endpoint calls it and appears to succeed, but the cache (which was never populated) is never purged.
- Safe modification: The function can be deleted entirely. The `revalidatePath('/')` call on line 13 of `route.ts` is the only thing that actually works.
- Test coverage: None.

**Components using `useContext` without `"use client"` directive:**
- Files: `components/WorkExperience.tsx`, `components/Profile.tsx`, `components/Education.tsx`, `components/Skills.tsx`
- Why fragile: These components call `useContext` but lack a `"use client"` directive. They only work because they are currently rendered inside other components that already have `"use client"`. If any of them is ever imported directly into a server component context, it will throw a React hooks error at runtime with no clear error message.
- Safe modification: Add `"use client"` to each file.

**`SiteWrapper` returns a plain string on context null:**
- Files: `components/wrappers/SiteWrapper.tsx` (line 16), `components/BusinessCard.tsx` (line 13), `components/CV.tsx` (line 18), `components/Projects.tsx` (line 14)
- Why fragile: These components return bare strings like `"Global context is null"` when context is missing. In React 18+, this renders as text content but bypasses any layout structure and produces no visual indication of the failure in production. Typos vary: `"GloblaContext is null!"` in `WorkExperience.tsx`, `"Globalcontext is null"` in `Profile.tsx`.
- Safe modification: Replace with a proper error UI or throw an error to be caught by an error boundary.

---

## Dead Code

**`getSanityDataFromCache` — never called:**
- Files: `lib/api/sanityDataLoader.ts` (lines 53–73)
- Nothing in the codebase imports or calls this function. It is exported but unreferenced.

**`fetchSanityConfig` — never called:**
- Files: `lib/hooks/sanityConfigLoader.ts` (lines 16–31)
- This standalone async function is exported but never imported anywhere. Only `useSanityConfigLoader` (the hook) is used.

**`CACHE_REVALIDATION_INTERVAL` — never referenced:**
- Files: `lib/constants.ts`
- This constant is the only export in the file and is not imported anywhere.

**`envConfig.ts` — never imported:**
- Files: `envConfig.ts`
- This file calls `loadEnvConfig(process.cwd())` as a side effect but is never imported anywhere in the app. It has no effect.

**`ArrowUp` import — used only in commented-out code:**
- Files: `components/CV.tsx` (line 4, lines 88–98)
- `ArrowUp` is imported from `lucide-react` but is only referenced inside a commented-out JSX block tagged `TODO IMPLEMENT`. The import is dead until the feature is built.

**`sanity/schemaTypes/post.ts` and `sanity/schemaTypes/milestone.ts` — defined but not registered:**
- Files: `sanity/schemaTypes/post.ts`, `sanity/schemaTypes/milestone.ts`, `sanity/schemaTypes/index.ts`
- These schema files exist and define `post` and `milestone` types, but neither is exported from `sanity/schemaTypes/index.ts` or included in the `schemaTypes` array. They are never loaded into Sanity Studio.

---

## Dependencies at Risk

**`ioredis` — should not be a dependency:**
- Risk: The "remove-redis" PR was merged but `ioredis` remains in `package.json` and `lib/redis.ts` still instantiates it at module load time.
- Impact: Unnecessary production dependency; connection attempt and error log on every cold start.
- Migration plan: Complete the Redis removal (see Tech Debt section above).

**`@types/react` pinned to `^18` while `react` is `^19.2.1`:**
- Risk: The runtime is React 19 but the TypeScript type definitions are for React 18. This can cause incorrect type checking — for example, `React.FC` signature differences and new React 19 APIs being untyped.
- Impact: TypeScript may not catch React 19-specific type errors; IDE completion may be wrong.
- Migration plan: Update `@types/react` and `@types/react-dom` to `^19` in `package.json`.

**`eslint-config-next` version `14.2.15` while `next` is `^16.0.7`:**
- Risk: The ESLint Next.js config is two major versions behind the Next.js runtime. Rules specific to Next.js 15/16 App Router patterns (e.g., Server Action warnings) will not be enforced.
- Impact: Linting gaps around Next.js-specific patterns.
- Migration plan: Update `eslint-config-next` to match the installed `next` version.

---

## Missing Critical Features

**No error boundary or `error.tsx`:**
- Problem: There is no `app/error.tsx` and no React Error Boundary in the component tree. Any unhandled error in a client component (e.g., a null dereference in `ProjectDetails`) will crash the entire page with the default Next.js error screen in production.
- Blocks: Graceful degradation when individual sections fail.

**No `loading.tsx`:**
- Problem: There is no `app/loading.tsx`. The page has no loading skeleton or spinner while the server fetches Sanity data, leading to a blank white screen during SSR hydration delays.
- Blocks: Perceived performance on slow connections.

**No placeholder image for missing Sanity assets:**
- Problem: `imageUrlBuilder.ts` has four `return ""` paths with `// todo add placeholder image` comments. When an image reference is missing or invalid, `CV.tsx` and `ProjectDetails.tsx` render nothing (the `{imageUrl && <Image ...>}` guards hide the element entirely).
- Files: `app/utilities/imageUrlBuilder.ts`, `components/CV.tsx`, `components/ProjectDetails.tsx`
- Blocks: Visible fallback content when a Sanity image is not uploaded.

---

## Conflicting Configuration

**`export const dynamic = "force-dynamic"` and `export const revalidate = 1` conflict:**
- Files: `app/page.tsx` (lines 10–11)
- In Next.js 15, `dynamic = "force-dynamic"` overrides `revalidate`. The `revalidate = 1` export is ignored and has no effect. This creates misleading configuration — a reader might assume ISR is active.
- Fix: Remove `export const revalidate = 1` from `app/page.tsx`.

---

*Concerns audit: 2026-04-26*
