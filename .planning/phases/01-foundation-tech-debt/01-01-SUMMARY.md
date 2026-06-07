---
phase: 01-foundation-tech-debt
plan: "01"
subsystem: data-layer
tags: [tech-debt, sanity, api, cleanup]
dependency_graph:
  requires: []
  provides: [direct-sanity-fetch, clean-revalidate-handler]
  affects: [lib/api/sanityDataLoader.ts, app/api/revalidate/route.ts]
tech_stack:
  added: []
  patterns: [direct-sanity-client-fetch]
key_files:
  created: []
  modified:
    - lib/api/sanityDataLoader.ts
    - app/api/revalidate/route.ts
  deleted:
    - app/api/sanity-data/route.ts
decisions:
  - "TD-02 fixed by replacing axios self-HTTP call with direct sanityClient.fetch() — eliminates cold-start risk and unnecessary latency"
  - "TD-04 confirmed resolved without code change — remaining if (x != null) checks in GlobalContext.tsx are incoming-data null-guards on fresh data, not stale-data skip guards"
metrics:
  duration: "~10 minutes"
  completed: "2026-05-09"
---

# Phase 1 Plan 01: Tech Debt Cleanup (TD-01 through TD-05) Summary

**One-liner:** Eliminated self-referential HTTP round-trip by rewriting `loadSanityData` to call `sanityClient.fetch()` directly and deleted the now-dead `/api/sanity-data` route.

## Objective

Fix TD-02 (self-referential HTTP call) and confirm TD-01, TD-03, TD-04, TD-05 are already resolved. After this plan, Sanity data flows directly: server component → `sanityDataLoader` → `@sanity/client` → Sanity API — no server-to-itself HTTP round-trip.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Replace self-referential HTTP call with direct Sanity client fetch (TD-02) | 9e7e313 | lib/api/sanityDataLoader.ts, app/api/revalidate/route.ts, app/api/sanity-data/route.ts (deleted) |

## Artifacts

### Modified

**`lib/api/sanityDataLoader.ts`** — Fully rewritten. Removed `axios` import. Now imports `createClientFromParam` and `SanityClientConfig` from `@/app/sanityClient`, defines the GROQ query locally (copied verbatim from the deleted route), and calls `sanityClient.fetch(query)` directly. Guards against null client with explicit error throw.

**`app/api/revalidate/route.ts`** — Removed dead `revalidatePath("/api/sanity-data")` call. Auth check, `revalidatePath("/")`, try/catch, and Cache-Control headers all preserved unchanged.

### Deleted

**`app/api/sanity-data/route.ts`** — Entire route deleted. The GROQ query and client construction logic were migrated to `sanityDataLoader.ts`. Attack surface from T-01-04 is eliminated.

## Tech Debt Resolution Status

| Item | Status | Notes |
|------|--------|-------|
| TD-01: Redis remnants | Confirmed done | `lib/redis.ts` does not exist |
| TD-02: Self-referential HTTP call | Fixed in this plan | `loadSanityData` now calls `sanityClient.fetch()` directly |
| TD-03: Revalidation auth bug | Confirmed done | Line 6 of `revalidate/route.ts` correctly checks `Bearer ${process.env.CRON_SECRET}` |
| TD-04: Stale-data context guards | Confirmed done | `if (workExperienceArray != null)` checks in `GlobalContext.tsx` are incoming-data null-guards, not stale-data skip guards that prevent updates when context is already populated |
| TD-05: QueryClient re-instantiation | Confirmed done | `QueryClientWrapper.tsx` line 10: `const [queryClient] = useState(() => new QueryClient())` |

## Decisions Made

1. **TD-02 approach:** Migrated GROQ query verbatim from the deleted route into `sanityDataLoader.ts`. No query changes — same data, different call path.
2. **TD-04 conclusion:** No code change required. The original concern was about guards that skip context updates when data already exists. The actual code checks `if (workExperienceArray != null)` on incoming data before sorting — this is correct null-safety on fresh data, not a stale-data guard pattern.
3. **axios not removed from package.json:** `lib/hooks/sanityConfigLoader.ts` still uses axios for the config endpoint. Only the import in `sanityDataLoader.ts` was removed.

## Verification Results

- `grep createClientFromParam lib/api/sanityDataLoader.ts` — matches (lines 1, 53)
- `grep -c axios lib/api/sanityDataLoader.ts` — returns 0
- `ls app/api/sanity-data/route.ts` — "No such file or directory"
- `grep -c sanity-data app/api/revalidate/route.ts` — returns 0
- `npm run build` — exits 0, TypeScript clean
- `npm run lint` — exits 0, zero warnings

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None.

## Threat Flags

None — the threat model items were all accounted for:
- T-01-01: Auth check confirmed present and correct (TD-03)
- T-01-02: Accepted (public portfolio data, env vars for credentials)
- T-01-03: Accepted (low-traffic portfolio site)
- T-01-04: Mitigated — `/api/sanity-data` route deleted, attack surface removed

## Self-Check: PASSED

- FOUND: lib/api/sanityDataLoader.ts
- FOUND: app/api/revalidate/route.ts
- CONFIRMED DELETED: app/api/sanity-data/route.ts
- FOUND: 01-01-SUMMARY.md
- FOUND commit: 9e7e313
