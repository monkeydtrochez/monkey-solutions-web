# Phase 3: About + Work - Pattern Map

**Mapped:** 2026-05-10
**Files analyzed:** 7 (new/modified files in scope)
**Analogs found:** 7 / 7

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `components/AboutSection.tsx` | component | request-response (read-only) | `components/HeroSection.tsx` | exact |
| `components/WorkSection.tsx` | component | event-driven + request-response | `components/HeroSection.tsx` | role-match |
| `sanity/schemaTypes/project.ts` | config/schema | transform | `sanity/schemaTypes/profile.ts` | exact |
| `sanity/schemaTypes/profile.ts` | config/schema | transform | `sanity/schemaTypes/project.ts` | exact |
| `app/models/sanityTypes.ts` | model | transform | self (additive) | exact |
| `lib/api/sanityDataLoader.ts` | service | request-response | self (additive) | exact |
| `app/page.tsx` | route/entry | request-response | self (additive) | exact |

---

## Pattern Assignments

### `components/AboutSection.tsx` (component, read-only)

**Analog:** `components/HeroSection.tsx`

**Imports pattern** (lines 1-4):
```typescript
"use client";
import { useContext } from "react";
import GlobalContext from "@/app/context/GlobalContext";
```

**GlobalContext null-guard pattern** (lines 23-25):
```typescript
export default function AboutSection() {
  const ctx = useContext(GlobalContext);
  const profile = ctx?.profile ?? null;
```

**Section shell with design tokens** (lines 28-36):
```typescript
<section
  id="about"
  style={{
    position: "relative",
    overflow: "hidden",
    padding: "64px 32px",
    background: "var(--ms-bg-alt)",
    borderTop: "1px solid var(--ms-border)",
    borderBottom: "1px solid var(--ms-border)",
  }}
>
```

**Content max-width container** (lines 69-74):
```typescript
<div
  style={{
    position: "relative",
    maxWidth: "var(--content-max)",
    margin: "0 auto",
  }}
>
```

**Two-column responsive grid** (lines 76-81):
```typescript
<div
  className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr]"
  style={{
    gap: 64,
    alignItems: "end",
  }}
>
```

**Font/color token usage pattern** (lines 91-96 — status row span):
```typescript
style={{
  fontFamily: "var(--font-mono)",
  fontSize: "var(--text-mono)",
  fontWeight: 400,
  color: "var(--ms-fg-soft)",
}}
```

**Display/italic accent in H1** (lines 119-126):
```typescript
<em
  style={{
    fontFamily: "var(--font-display)",
    fontStyle: "italic",
    fontWeight: 400,
    color: "var(--ms-orange-text)",
  }}
>
```

**Conditional text rendering (heroBio pattern to adapt for aboutBody)** (lines 131-145):
```typescript
{heroBio && (
  <p
    style={{
      marginTop: 32,
      maxWidth: 520,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-body-lg)",
      fontWeight: 400,
      lineHeight: 1.55,
      color: "var(--ms-fg-soft)",
    }}
  >
    {heroBio}
  </p>
)}
```
Adapt for `aboutBody` by splitting on `\n\n` to produce multiple `<p>` elements instead of a single string render.

**Horizontal strip row (trust strip — adapt for facts row)** (lines 205-212):
```typescript
<div
  className="grid grid-cols-2 md:grid-cols-4"
  style={{
    marginTop: 64,
    paddingTop: 32,
    borderTop: "1px solid var(--ms-border)",
    gap: 32,
  }}
>
```

---

### `components/WorkSection.tsx` (component, event-driven + read-only)

**Analog:** `components/HeroSection.tsx`

**Imports pattern** (lines 1-4, extended for state):
```typescript
"use client";
import { useState, useEffect, useContext, useMemo } from "react";
import GlobalContext from "@/app/context/GlobalContext";
import { Badge } from "@/components/ui/badge";
```

**GlobalContext null-guard with array fallback** (lines 23-24):
```typescript
const ctx = useContext(GlobalContext);
const projects = ctx?.projects ?? [];
```

**Default-open useEffect pattern** (to avoid race condition — Pitfall 6 in RESEARCH.md):
```typescript
const [openId, setOpenId] = useState<string | null>(null);
useEffect(() => {
  if (projects && projects.length > 0 && openId === null) {
    setOpenId(projects[0]._id);
  }
}, [projects]);
```
Note: Do NOT use `useState(projects[0]?._id)` — context is null on first render.

**Filter + accordion state pair**:
```typescript
const [filter, setFilter] = useState<'all' | 'web' | 'ios' | 'saas'>('all');
const [openId, setOpenId] = useState<string | null>(null);
```

**Memoized filter logic** (verbatim from RESEARCH.md — filter regex locked in D-04):
```typescript
const shown = useMemo(() => projects.filter(p => {
  if (filter === 'all') return true;
  if (filter === 'web') return /commerce|web|booking/i.test(p.kind ?? '');
  if (filter === 'ios') return /iOS/.test(p.kind ?? '');
  if (filter === 'saas') return /SaaS/i.test(p.kind ?? '');
  return true;
}), [projects, filter]);
```
Note: `/iOS/` is case-sensitive (no `i` flag) — do not add the `i` flag.

**Section shell**:
```typescript
<section
  id="work"
  style={{
    padding: "var(--section-py) var(--page-px)",
    background: "var(--ms-bg)",
    borderTop: "1px solid var(--ms-border)",
  }}
>
  <div style={{ maxWidth: "var(--content-max)", margin: "0 auto" }}>
    ...
  </div>
</section>
```

**Project row toggle handler**:
```typescript
const handleToggle = (id: string) => {
  setOpenId(prev => prev === id ? null : id);
};
```

**ProjectRow collapsed button** (from hifi-part2.jsx — copy verbatim):
```typescript
<button
  onClick={onToggle}
  aria-expanded={open}
  aria-controls={`project-panel-${p._id}`}
  style={{
    all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
    padding: '24px 4px',
    display: 'grid',
    gridTemplateColumns: '56px 1.2fr 1fr 80px 28px',
    gap: 20,
    alignItems: 'center',
  }}
>
  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-mono)', color: 'var(--ms-fg-faint)', letterSpacing: 0.5 }}>
    {String(p.sortIndex).padStart(3, '0')}
  </span>
  ...
</button>
```

**Badge component usage for stack pills** (from `components/ui/badge.tsx`):
```typescript
import { Badge } from "@/components/ui/badge";
// In expanded row:
{(p.tags ?? []).map((tag) => (
  <Badge key={tag} variant="outline">{tag}</Badge>
))}
```

**Accordion expand animation** (use existing keyframe from globals.css):
```typescript
<div
  id={`project-panel-${p._id}`}
  style={{
    animation: 'ms-fadein var(--anim-fadein)',
  }}
>
```

---

### `sanity/schemaTypes/project.ts` (config/schema, transform)

**Analog:** `sanity/schemaTypes/project.ts` (self — additive changes) and `sanity/schemaTypes/profile.ts` (pattern for `text` field)

**Existing imports** (line 1):
```typescript
import {defineType, defineField, defineArrayMember} from 'sanity'
```

**Existing array-of-strings pattern to adapt** (lines 44-51 — `tags` field):
```typescript
defineField({
  name: 'tags',
  title: 'Tags',
  type: 'array',
  options: {layout: 'tags'},
  of: [
    defineArrayMember({
      type: 'string',
    }),
  ],
}),
```

**New `metrics` array-of-objects pattern** (use `defineArrayMember` with inline `object`, same import already present):
```typescript
defineField({
  name: 'metrics',
  title: 'Metrics',
  type: 'array',
  validation: (Rule) => Rule.max(3),
  of: [
    defineArrayMember({
      type: 'object',
      fields: [
        defineField({ name: 'label', title: 'Label', type: 'string' }),
        defineField({ name: 'value', title: 'Value', type: 'string' }),
        defineField({ name: 'suffix', title: 'Suffix', type: 'string' }),
      ],
    }),
  ],
}),
```

**New `text` field pattern** (from `sanity/schemaTypes/profile.ts` line 31-35 — `heroBio` as `string`; for `overview` use `text` type):
```typescript
defineField({
  name: 'overview',
  title: 'Overview',
  type: 'text',
  description: 'Single summary paragraph shown in the expanded accordion row.',
}),
defineField({
  name: 'kind',
  title: 'Kind',
  type: 'string',
  description: 'Display label, e.g. "E-commerce · Headless", "iOS · Education".',
}),
```

**Removal:** Delete the existing `body: blockContent` field (lines 53-56 of current file — D-02).

---

### `sanity/schemaTypes/profile.ts` (config/schema, transform)

**Analog:** `sanity/schemaTypes/profile.ts` (self — additive)

**Existing `heroBio` string field pattern to copy** (lines 81-86):
```typescript
defineField({
  name: 'heroBio',
  title: 'Hero Bio',
  type: 'string',
  description: 'Short lede paragraph displayed in the hero section.',
}),
```

**New `aboutBody` field** (same pattern, use `text` type instead of `string` for multi-paragraph support):
```typescript
defineField({
  name: 'aboutBody',
  title: 'About Body',
  type: 'text',
  description: 'About section body copy (2+ paragraphs). Separate paragraphs with a blank line.',
}),
```

---

### `app/models/sanityTypes.ts` (model, transform)

**Analog:** self (additive)

**Existing `Profile` interface pattern** (lines 9-22):
```typescript
export interface Profile extends BaseType {
  _type: "profile";
  location: string;
  languages: string[];
  // ...
  heroBio?: string;   // optional, same pattern for aboutBody
}
```

**Existing `Project` interface** (lines 40-49):
```typescript
export interface Project extends BaseType {
  _type: "project";
  coverImage: ImageReference;
  sortIndex: number;
  title: string;
  client: string;
  site: string;
  tags: string[];
  body: WorkDescriptionBlock[];  // REMOVE this line (D-02, D-11)
}
```

**New `ProjectMetric` interface** (add before `Project` — D-10):
```typescript
export interface ProjectMetric {
  label: string;
  value: string;
  suffix: string;
}
```

**Extended `Project` fields** (D-11):
```typescript
export interface Project extends BaseType {
  _type: "project";
  coverImage: ImageReference;
  sortIndex: number;
  title: string;
  client: string;
  site: string;
  tags: string[];
  // body field removed
  overview?: string;
  kind?: string;
  metrics?: ProjectMetric[];
  duration?: Duration;  // note: Duration interface exists at line 61
}
```

**Extended `Profile` field** (D-12 — add to existing interface):
```typescript
aboutBody?: string;
```

---

### `lib/api/sanityDataLoader.ts` (service, request-response)

**Analog:** self (additive)

**Existing GROQ query structure** (lines 4-45):
```typescript
const query = `*[_type == 'profile' || _type == 'workExperience' || _type == 'education' || _type == 'project'] {
    _id,
    _type,
    title,

    _type == 'profile' => {
    profilePicture,
      description,
      languages,
      mobile,
      email,
      location,
      personalitySkills,
      professionalSkills,
      linkedInUrl,
      githubUrl,
      heroBio
    },
    // ...
    _type == 'project' => {
      sortIndex,
      title,
      coverImage,
      duration,
        client,
        site,
        tags,
        body
    }
}`;
```

**Updated profile projection** (add `aboutBody`, keep all existing fields — D-13):
```typescript
_type == 'profile' => {
  profilePicture,
  description,
  languages,
  mobile,
  email,
  location,
  personalitySkills,
  professionalSkills,
  linkedInUrl,
  githubUrl,
  heroBio,
  aboutBody
},
```

**Updated project projection** (remove `body`, add `overview`, `kind`, `metrics` — D-02, D-13):
```typescript
_type == 'project' => {
  sortIndex,
  title,
  coverImage,
  duration,
  client,
  site,
  tags,
  overview,
  kind,
  "metrics": metrics[]{ label, value, suffix }
}
```

---

### `app/page.tsx` (route/entry, request-response)

**Analog:** self (additive)

**Existing import + usage pattern** (lines 1-5):
```typescript
import { loadSanityData } from "@/lib/api/sanityDataLoader";
import DataHydrator from "@/components/wrappers/DataHydrator";
import QueryClientWrapper from "@/components/wrappers/QueryClientWrapper";
import SiteHeader from "@/components/SiteHeader";
import HeroSection from "@/components/HeroSection";
```

**Section insertion pattern** (lines 9-20 — add new imports and JSX):
```typescript
// Add imports:
import AboutSection from "@/components/AboutSection";
import WorkSection from "@/components/WorkSection";

// Add in <main> after <HeroSection />:
<main>
  <HeroSection />
  <AboutSection />
  <WorkSection />
</main>
```

---

## Shared Patterns

### GlobalContext Read Pattern
**Source:** `components/HeroSection.tsx` lines 1-4, 23-25
**Apply to:** `AboutSection.tsx`, `WorkSection.tsx`
```typescript
"use client";
import { useContext } from "react";
import GlobalContext from "@/app/context/GlobalContext";

// Inside component:
const ctx = useContext(GlobalContext);
const profile = ctx?.profile ?? null;   // for AboutSection
const projects = ctx?.projects ?? [];   // for WorkSection (use [] not null fallback)
```

### Inline Style with CSS Custom Properties
**Source:** `components/HeroSection.tsx` lines 91-96, 104-114
**Apply to:** `AboutSection.tsx`, `WorkSection.tsx` (all styled elements)
```typescript
// Pattern: use style={} for design tokens; className only for Tailwind responsive breakpoints
style={{
  fontFamily: "var(--font-mono)",
  fontSize: "var(--text-mono)",
  color: "var(--ms-fg-soft)",
}}
// Tailwind only for breakpoints:
className="grid grid-cols-1 md:grid-cols-2"
```

### Font Variable Tokens (all available)
**Source:** `components/HeroSection.tsx` usage; defined in `app/globals.css`
**Apply to:** All new components
```
var(--font-sans)     → Inter
var(--font-mono)     → JetBrains Mono
var(--font-display)  → Fraunces (italic for editorial accents)
var(--ms-fg)         → foreground
var(--ms-fg-soft)    → secondary text
var(--ms-fg-faint)   → tertiary / decorative text
var(--ms-orange-text)→ accent orange for highlights
var(--ms-border)     → subtle border
var(--ms-border-strong) → emphasized border
var(--ms-bg)         → page background
var(--ms-bg-alt)     → alternate section background
var(--ms-surface)    → card/panel surface
var(--content-max)   → max-width container constraint
```

### Sanity Schema Field Definition
**Source:** `sanity/schemaTypes/project.ts` and `sanity/schemaTypes/profile.ts`
**Apply to:** Both schema files
```typescript
// All three imports are already present in both files:
import {defineType, defineField, defineArrayMember} from 'sanity'

// String field pattern:
defineField({ name: 'fieldName', title: 'Display Name', type: 'string' })

// Text field pattern (multi-line):
defineField({ name: 'fieldName', title: 'Display Name', type: 'text' })

// Array of strings:
defineField({
  name: 'fieldName', title: 'Display Name', type: 'array',
  of: [defineArrayMember({ type: 'string' })],
})

// Array of objects (for metrics):
defineField({
  name: 'fieldName', title: 'Display Name', type: 'array',
  validation: (Rule) => Rule.max(3),
  of: [defineArrayMember({
    type: 'object',
    fields: [
      defineField({ name: 'label', title: 'Label', type: 'string' }),
      defineField({ name: 'value', title: 'Value', type: 'string' }),
      defineField({ name: 'suffix', title: 'Suffix', type: 'string' }),
    ],
  })],
})
```

---

## No Analog Found

All files have close analogs in the codebase. No new pattern categories are required.

---

## Key Decisions Captured

| Decision | Pattern Source | Note |
|----------|---------------|------|
| `tags` used for stack pills | `app/models/sanityTypes.ts` line 48 | Treat `tags: string[]` as the stack field — no new `stack` field needed |
| No third-party accordion | RESEARCH.md anti-patterns | Use `useState` + `<button aria-expanded>` directly |
| Portrait: CSS placeholder now, `<Image>` later | RESEARCH.md Pitfall 7 | `buildImageUrlFor` from `app/utilities/imageUrlBuilder.ts` requires server env vars; defer |
| `aboutBody` fallback | RESEARCH.md Open Question 2 | Hardcode hifi copy when `profile.aboutBody` is falsy — same pattern as `heroBio` in HeroSection |
| H2 font size | RESEARCH.md Pattern 2 discrepancy | Hardcode `clamp(36px, 4.5vw, 64px)` inline — do NOT use `var(--text-h2)` which is larger |
| `duration` field on `Project` type | `app/models/sanityTypes.ts` line 61 — `Duration` interface exists | Add `duration?: Duration` to `Project` interface (it's in GROQ projection but missing from TypeScript type) |

---

## Metadata

**Analog search scope:** `components/`, `sanity/schemaTypes/`, `app/models/`, `lib/api/`, `app/`
**Files read:** 9
**Pattern extraction date:** 2026-05-10
