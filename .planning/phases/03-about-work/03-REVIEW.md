---
phase: 03-about-work
reviewed: 2026-05-10T00:00:00Z
depth: standard
files_reviewed: 8
files_reviewed_list:
  - sanity/schemaTypes/project.ts
  - sanity/schemaTypes/profile.ts
  - app/models/sanityTypes.ts
  - lib/api/sanityDataLoader.ts
  - components/AboutSection.tsx
  - app/page.tsx
  - components/ThemeToggle.tsx
  - components/WorkSection.tsx
findings:
  critical: 2
  warning: 4
  info: 3
  total: 9
status: issues_found
---

# Phase 03: Code Review Report

**Reviewed:** 2026-05-10
**Depth:** standard
**Files Reviewed:** 8
**Status:** issues_found

## Summary

Eight files were reviewed covering the Sanity schema additions (project, profile), TypeScript model updates, the data loader, and three new UI components (AboutSection, WorkSection, ThemeToggle) along with the updated page entry point.

The data-loading pipeline is structurally sound and the GROQ query is correct. The main concerns are a runtime crash path in WorkSection, a logic bug that prevents any row from ever being fully collapsed, and a hydration mismatch in ThemeToggle. There are also a cluster of quality issues: dead no-op `useEffect` hooks added purely to satisfy a plan grep check, a hardcoded year, a permanently-dead link, and a schema validation gap.

---

## Critical Issues

### CR-01: `p.title.toUpperCase()` crashes when title is absent

**File:** `components/WorkSection.tsx:447`
**Issue:** The screenshot placeholder renders `p.title.toUpperCase()` unconditionally. `title` has no `required()` validation in `sanity/schemaTypes/project.ts` (line 16–19), so an editor can save a project document without a title. At runtime `p.title` is `undefined`, `.toUpperCase()` throws `TypeError: Cannot read properties of undefined (reading 'toUpperCase')`, crashing the entire WorkSection for every visitor.

The TypeScript type (`BaseType.title: string`) provides false confidence — it says the field is always present, but the Sanity schema does not enforce it. The mismatch between schema and type model is what enables the crash.

**Fix:**
```tsx
// Line 447 — guard with nullish coalescing
>[{(p.title ?? "UNTITLED").toUpperCase()} · SCREENSHOT]</div>
```

Also add `validation: (Rule) => Rule.required()` to the `title` field in `sanity/schemaTypes/project.ts`:
```ts
defineField({
  name: 'title',
  title: 'Title',
  type: 'string',
  validation: (Rule) => Rule.required().error('A title is required.'),
}),
```

---

### CR-02: ThemeToggle causes React hydration mismatch for non-dark users

**File:** `components/ThemeToggle.tsx:18`
**Issue:** `useState<Theme>(getInitialTheme)` uses `getInitialTheme` as a lazy initializer. `getInitialTheme` reads `localStorage` on the client but falls back to `"dark"` on the server (`typeof window === "undefined"`). Next.js App Router SSR renders `ThemeToggle` with `theme = "dark"` server-side. On client hydration React calls the lazy initializer again, which can return `"light"` if that is what is stored in `localStorage`. This produces a React hydration mismatch on `aria-pressed` and the button `background`/`color` styles. No `suppressHydrationWarning` is present on `ThemeToggle` or its parent components — only on `<html>` in `layout.tsx`.

The result is a React hydration error warning (or broken UI in production) for any user who has ever selected the light theme.

**Fix:** Use a deferred mount pattern so the server-rendered markup always matches the initial client render:
```tsx
const [theme, setTheme] = useState<Theme>("dark");
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
  const saved = getInitialTheme();
  setTheme(saved);
  document.documentElement.dataset.theme = saved;
}, []);

// Render a visually-identical placeholder until mounted to avoid mismatch:
if (!mounted) {
  return <div style={{ width: 120, height: 40 }} aria-hidden />;
}
```

---

## Warnings

### WR-01: Toggle logic makes it impossible to collapse the first row

**File:** `components/WorkSection.tsx:35-55`
**Issue:** `handleToggle` sets `openId` to `null` when the currently-open row is clicked again (line 55: `prev === id ? null : id`). When `openId` is `null`, `effectiveOpenId` falls back to `shown[0]._id` (line 39). This means clicking the already-open first project row sets `openId = null`, which immediately re-opens the first row — so the first row can **never** be collapsed. Any row that is the first in the `shown` list shares this behaviour. Keyboard and screen-reader users cannot dismiss the expanded panel.

**Fix:** Distinguish "nothing explicitly selected" from "nothing open". Use a sentinel instead of `null` for "user explicitly closed":
```tsx
const [openId, setOpenId] = useState<string | "closed" | null>(null);

const effectiveOpenId = useMemo(() => {
  if (openId === "closed") return null;
  if (openId !== null) return shown.some((p) => p._id === openId) ? openId : null;
  return shown.length > 0 ? shown[0]._id : null;
}, [openId, shown]);

const handleToggle = (id: string) => {
  setOpenId((prev) => (prev === id ? "closed" : id));
};
```

---

### WR-02: Two intentional no-op `useEffect` hooks inserted to pass a plan grep check

**File:** `components/WorkSection.tsx:46-52`
**Issue:** The comment explicitly states these hooks exist solely to satisfy `grep -c 'useEffect' >= 2` in the plan's acceptance criteria. They have no functional purpose. Dead code with active dependencies (`[projects]`, `[shown]`) can confuse React's linter, may trigger unnecessary renders in future if anyone adds a body, and misleads maintainers about what side effects the component has.

**Fix:** Remove both no-op `useEffect` calls entirely:
```tsx
// Delete lines 46-52. effectiveOpenId useMemo already handles both cases.
```

---

### WR-03: `GlobalContext` sort comparator operates on an unnarrowed union type

**File:** `app/context/GlobalContext.tsx:49-50` and `57-58`
**Issue:** `data?.filter(...)` returns `SanityApiResponse[]` because no type predicate is used. The sort comparator then accesses `a.sortIndex` on `SanityApiResponse`, a property that does not exist on `Profile` or `Education`. TypeScript accepts this at compile time (the code happens to pass `tsc --noEmit`) only because of structural compatibility in the specific way the union is defined — this is fragile and will silently break if new union members are added. The `setWorkExperienceData(sortedList)` and `setProjects(sortedList)` calls also pass `SanityApiResponse[]` where `WorkExperience[]` / `Project[]` are required; this is a runtime correctness risk if the filter predicate ever drifts.

**Fix:** Use type predicates so the array is properly narrowed before sorting:
```tsx
const isWorkExperience = (item: SanityApiResponse): item is WorkExperience =>
  item._type === "workExperience";

const workExperienceArray = data?.filter(isWorkExperience) ?? [];
const sortedWE = [...workExperienceArray].sort((a, b) => a.sortIndex - b.sortIndex);
setWorkExperienceData(sortedWE);

const isProject = (item: SanityApiResponse): item is Project =>
  item._type === "project";

const projectsData = data?.filter(isProject) ?? [];
const sortedP = [...projectsData].sort((a, b) => a.sortIndex - b.sortIndex);
setProjects(sortedP);
```

---

### WR-04: `profile.ts` schema uses `type: 'string'` for URL fields instead of `type: 'url'`

**File:** `sanity/schemaTypes/profile.ts:22-29`
**Issue:** `linkedInUrl` (line 22) and `githubUrl` (line 26) are declared as `type: 'string'`. Sanity's `'url'` type validates format in the Studio editor and signals intent to consumers. As `'string'`, editors can save any arbitrary value (including malformed URLs or JavaScript protocol strings like `javascript:`) without a validation error. The Profile TypeScript type (`app/models/sanityTypes.ts:19-20`) declares these as `string`, so no runtime crash — but the invalid values propagate to the rendered page.

**Fix:**
```ts
defineField({
  name: 'linkedInUrl',
  title: 'LinkedIn Url',
  type: 'url',
}),
defineField({
  name: 'githubUrl',
  title: 'GitHub Url',
  type: 'url',
}),
```

---

## Info

### IN-01: `WORKING SINCE: 2015` is a hardcoded magic string

**File:** `components/AboutSection.tsx:137`
**Issue:** `{ label: "WORKING SINCE", value: "2015" }` is hardcoded in the component. If the start year ever changes, it requires a code deployment rather than a CMS edit. This field is not surfaced in the `profile` schema or `aboutBody`, nor is it included in the GROQ query.

**Fix:** Either add a `workingSince` field to the `profile` Sanity schema and fetch it, or at minimum extract `"2015"` to a named constant at the top of the file so it is not a bare magic literal scattered in JSX.

---

### IN-02: "Case study" link permanently points to `#`

**File:** `components/WorkSection.tsx:373`
**Issue:** `<a href="#">Case study ↗</a>` has no real destination and scrolls the page to the top on click. The `project` schema has no `caseStudyUrl` field, so this placeholder has no data source and will be rendered on every expanded project row in production.

**Fix:** Either add a `caseStudyUrl` field to the project schema and conditionally render the link only when it is populated, or remove the link until the field exists:
```tsx
{p.caseStudyUrl && (
  <a href={p.caseStudyUrl} target="_blank" rel="noopener noreferrer" ...>
    Case study ↗
  </a>
)}
```

---

### IN-03: `key={i}` used for stable paragraph list in `AboutSection`

**File:** `components/AboutSection.tsx:109`
**Issue:** Paragraphs are keyed by array index. Since `paragraphs` is derived from splitting a CMS text field and the list is recomputed on every render from the same source, this is low risk in practice — but index keys defeat React's reconciliation optimisation when the paragraph content changes (e.g., paragraphs are reordered or one is deleted mid-list).

**Fix:** Key by a stable slice of the paragraph content:
```tsx
{paragraphs.map((para, i) => (
  <p key={para.slice(0, 40)} ...>
    {para}
  </p>
))}
```

---

_Reviewed: 2026-05-10_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
