# Phase 4: Experience, Skills + Services - Pattern Map

**Mapped:** 2026-05-10
**Files analyzed:** 8 (new/modified files in scope)
**Analogs found:** 8 / 8

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `components/ExperienceSection.tsx` | component | request-response (read-only, GlobalContext) | `components/AboutSection.tsx` | exact |
| `components/SkillsSection.tsx` | component | static (no data fetch) | `components/AboutSection.tsx` | role-match |
| `components/ServicesSection.tsx` | component | static (no data fetch) | `components/AboutSection.tsx` | role-match |
| `sanity/schemaTypes/workExperience.ts` | config/schema | transform | `sanity/schemaTypes/education.ts` | exact |
| `sanity/schemaTypes/education.ts` | config/schema | transform | `sanity/schemaTypes/workExperience.ts` | exact |
| `app/models/sanityTypes.ts` | model | transform | self (additive) | exact |
| `lib/api/sanityDataLoader.ts` | service | request-response | self (additive) | exact |
| `app/context/GlobalContext.tsx` | provider | event-driven | self (targeted edit) | exact |
| `app/page.tsx` | route/entry | request-response | self (additive) | exact |

---

## Pattern Assignments

### `components/ExperienceSection.tsx` (component, request-response via GlobalContext)

**Analog:** `components/AboutSection.tsx`

**Imports pattern** (lines 1-6):
```typescript
"use client";
import { useContext } from "react";
import GlobalContext from "@/app/context/GlobalContext";
```

**GlobalContext read pattern** (lines 6-9, AboutSection.tsx):
```typescript
export default function AboutSection() {
  const ctx = useContext(GlobalContext);
  const profile = ctx?.profile ?? null;
  // For ExperienceSection, analogously:
  // const workExperience = ctx?.workExperience ?? [];
  // const education = ctx?.education ?? [];   // after D-07 fix applied
```

**Section shell pattern** (lines 34-44, AboutSection.tsx):
```typescript
<section
  id="about"
  style={{
    padding: "var(--section-py) var(--page-px)",
    background: "var(--ms-bg-alt)",
    borderTop: "1px solid var(--ms-border)",
    borderBottom: "1px solid var(--ms-border)",
  }}
>
  <div style={{ maxWidth: "var(--content-max)", margin: "0 auto" }}>
```

**Kicker row pattern** (lines 46-69, AboutSection.tsx):
```typescript
<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontFamily: "var(--font-mono)",
    fontSize: "var(--text-mono)",
    color: "var(--ms-fg-soft)",
    letterSpacing: 1,
  }}
>
  <span style={{ color: "var(--ms-orange-text)", fontWeight: 600 }}>
    01
  </span>
  <span
    aria-hidden="true"
    style={{
      width: 28,
      height: 1,
      background: "var(--ms-border-strong)",
    }}
  />
  <span style={{ textTransform: "uppercase" }}>ABOUT</span>
</div>
```

**blockContent plain-text rendering** (lines 299-312, WorkSection.tsx):
```typescript
{p.body && p.body.length > 0 && p.body
  .map((block) => block.children.map((span) => span.text).join(""))
  .filter(Boolean)
  .map((text, i) => (
    <p key={i} style={{
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-body)",
      fontWeight: 400,
      lineHeight: 1.6,
      color: "var(--ms-fg)",
      margin: i === 0 ? 0 : "12px 0 0",
    }}>{text}</p>
  ))}
// For ExperienceSection (D-06): single joined string variant:
// entry.description
//   ?.map((block) => block.children?.map((c) => c.text).join(""))
//   .filter(Boolean)
//   .join(" ")
```

**Duration field name pattern** (line 205, WorkSection.tsx):
```typescript
const year = p.duration?.startYear ?? "";
// Display pattern for ExperienceSection:
// `${entry.duration?.startYear ?? "?"} – ${entry.duration?.endYear || "Present"}`
```

**Badge (stack chip) pattern** (lines 5, 315-326, WorkSection.tsx):
```typescript
import { Badge } from "@/components/ui/badge";
// ...
{p.tags && p.tags.length > 0 && (
  <div style={{ marginTop: 20, display: "flex", gap: 8, flexWrap: "wrap" }}>
    {p.tags.map((tag) => (
      <Badge key={tag} variant="outline">{tag}</Badge>
    ))}
  </div>
)}
```

**Label/value fact pair pattern** (lines 141-173, AboutSection.tsx):
```typescript
{[
  { label: "LOCATION", value: location },
  { label: "LANGUAGES", value: languagesValue },
  { label: "WORKING SINCE", value: "2015" },
].map(({ label, value }) => (
  <div key={label}>
    <div style={{
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-mono)",
      fontWeight: 400,
      textTransform: "uppercase",
      letterSpacing: 1,
      color: "var(--ms-fg-faint)",
    }}>{label}</div>
    <div style={{
      marginTop: 4,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-body)",
      fontWeight: 600,
      color: "var(--ms-fg)",
    }}>{value}</div>
  </div>
))}
```

**Timeline pulse dot (current role) — globals.css tokens** (lines 129, 145-148, globals.css):
```css
/* Already declared — DO NOT redefine */
--anim-pulse: 2.2s;

@keyframes ms-pulse {
  from { transform: scale(1); opacity: 0.5; }
  to   { transform: scale(2.6); opacity: 0; }
}
```
Usage in JSX:
```typescript
// Current role dot
<div
  aria-hidden="true"
  style={{
    position: "absolute",
    left: -8,
    top: 4,
    width: 16, height: 16,
    borderRadius: "50%",
    background: "var(--ms-orange)",
    boxShadow: "0 0 0 4px var(--ms-orange-dim)",
    animation: "ms-pulse var(--anim-pulse) infinite",
  }}
/>
// Past role dot
<div
  aria-hidden="true"
  style={{
    position: "absolute",
    left: -6,
    top: 6,
    width: 12, height: 12,
    borderRadius: "50%",
    background: "var(--ms-border-strong)",
    border: "1px solid var(--ms-bg-alt)",
  }}
/>
```

---

### `components/SkillsSection.tsx` (component, static — server component)

**Analog:** `components/AboutSection.tsx` (section shell + kicker), but WITHOUT `"use client"` or `useContext` — static data only.

**No "use client" — server component structure:**
```typescript
// NO "use client" directive
// NO import of useContext or GlobalContext
// Static data defined inline as a const array

const SKILL_GROUPS = [
  {
    group: "Frontend",
    skills: [
      { name: "TypeScript", proficiency: 9 },
      // ...
    ],
  },
  // 3 more groups
];

export default function SkillsSection() {
  return (
    <section id="skills" style={{ ... }}>
      ...
    </section>
  );
}
```

**Section shell pattern** — same as AboutSection.tsx lines 34-44 (see above).

**Kicker row pattern** — same as AboutSection.tsx lines 46-69 (see above), with section number `03` or `04` per UI-SPEC.

**10-segment proficiency bar — accessible pattern** (from RESEARCH.md Code Examples):
```typescript
<div role="img" aria-label={`${skill.name}: ${skill.proficiency} out of 10`}>
  <div style={{ display: "flex", gap: "var(--space-1)", height: 8 }}>
    {Array.from({ length: 10 }).map((_, i) => (
      <div
        key={i}
        style={{
          flex: 1,
          height: 8,
          borderRadius: "var(--radius-xs)",
          background: i < skill.proficiency
            ? "var(--ms-orange)"
            : "var(--ms-border-strong)",
        }}
      />
    ))}
  </div>
</div>
```

---

### `components/ServicesSection.tsx` (component, static — server component preferred)

**Analog:** `components/AboutSection.tsx` (section shell + kicker + layout grid), but WITHOUT `"use client"` — static data, hover via CSS class in globals.css.

**No "use client" — server component, CSS hover approach** (from RESEARCH.md Open Questions recommendation):
```typescript
// NO "use client" directive
// Hover border handled via .service-card:hover rule added to globals.css
// Pattern: add to globals.css, same as existing .header-bg and .logo-m-text classes (lines 165-169)

const SERVICES = [
  {
    number: "01",
    title: "...",
    description: "...",
    stack: ["...", "..."],
  },
  // 3 more
];

export default function ServicesSection() {
  return (
    <section id="services" style={{ ... }}>
      ...
    </section>
  );
}
```

**Global CSS hover pattern** (lines 165-169, globals.css — existing class-based approach):
```css
/* Existing pattern in globals.css (lines 165-169): */
[data-theme="dark"]  .header-bg { background: rgba(13,11,9,0.78); }
[data-theme="light"] .header-bg { background: rgba(247,244,238,0.82); }

/* New rule to add for service card hover: */
.service-card {
  border: 1px solid var(--ms-border);
  transition: border-color var(--anim-hover);
}
.service-card:hover {
  border-color: var(--ms-orange);
}
```

**Badge for stack chips** (same as WorkSection.tsx pattern):
```typescript
import { Badge } from "@/components/ui/badge";
// ...
{service.stack.map((chip) => (
  <Badge key={chip} variant="outline" aria-hidden="true">{chip}</Badge>
))}
```

**Fraunces italic giant number — decorative** (from AboutSection.tsx lines 222-229, same font pattern):
```typescript
<span
  aria-hidden="true"
  style={{
    fontFamily: "var(--font-display)",
    fontStyle: "italic",
    fontWeight: 400,
    fontSize: 64,        // UI-SPEC specifies larger value for decorative number
    color: "var(--ms-fg-faint)",
  }}
>
  01.
</span>
```

---

### `sanity/schemaTypes/workExperience.ts` (config/schema, additive)

**Analog:** `sanity/schemaTypes/workExperience.ts` (self — additive fields) and `sanity/schemaTypes/education.ts` (cross-reference for field patterns)

**Existing field structure** (lines 1-30, workExperience.ts — full file):
```typescript
import {defineField, defineType} from 'sanity'

export const workExperience = defineType({
  name: 'workExperience',
  title: 'Work Experience',
  type: 'document',
  fields: [
    defineField({
      name: 'sortIndex',
      title: 'Sort Index',
      type: 'number',
      validation: (Rule) => Rule.required().error('A sort index is required.'),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'duration',
    }),
    defineField({
      name: 'description',
      title: 'Work Description',
      type: 'blockContent',
    }),
    // ADD AFTER description:
    // defineField({ name: 'company', title: 'Company', type: 'string', description: '...' }),
    // defineField({ name: 'current', title: 'Current role', type: 'boolean', ... }),
  ],
})
```

**String field pattern for `company`** (from education.ts lines 21-25):
```typescript
defineField({
  name: 'school',     // → rename to 'company' for workExperience
  title: 'School',   // → 'Company'
  type: 'string',
}),
```

**Boolean field pattern for `current`** — no direct analog in codebase; follow defineField structure:
```typescript
defineField({
  name: 'current',
  title: 'Current role',
  type: 'boolean',
  description: 'Enable for the active/current job. Controls the orange pulse dot.',
  initialValue: false,
}),
```

---

### `sanity/schemaTypes/education.ts` (config/schema, additive)

**Analog:** `sanity/schemaTypes/education.ts` (self — additive field)

**Existing field structure** (lines 1-45, education.ts — full file):
```typescript
import {defineField, defineType} from 'sanity'

export const education = defineType({
  name: 'education',
  title: 'Education',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'school', title: 'School', type: 'string' }),
    defineField({
      name: 'start',
      title: 'Start',
      type: 'string',
      options: { list: lastFiftyYears() },
    }),
    defineField({
      name: 'end',
      title: 'End',
      type: 'string',
      options: { list: lastFiftyYears() },
    }),
    // ADD AFTER end:
    // defineField({ name: 'fieldOfStudy', title: 'Field of Study', type: 'string', description: '...' }),
  ],
})
```

**New `fieldOfStudy` field** — simple string, no list options (free text):
```typescript
defineField({
  name: 'fieldOfStudy',
  title: 'Field of Study',
  type: 'string',
  description: 'Degree or major detail line, e.g. "Computer Science". Renders below the school name if present.',
}),
```

---

### `app/models/sanityTypes.ts` (model, additive)

**Analog:** `app/models/sanityTypes.ts` (self — additive interface properties)

**Current Education interface** (lines 27-32, sanityTypes.ts):
```typescript
export interface Education extends BaseType {
  _type: "education";
  school: string;
  start: string;
  end: string;
  // ADD: fieldOfStudy?: string;
}
```

**Current WorkExperience interface** (lines 35-40, sanityTypes.ts):
```typescript
export interface WorkExperience extends BaseType {
  _type: "workExperience";
  sortIndex: number;
  duration: Duration;
  description: WorkDescriptionBlock[];
  // ADD: company?: string;
  // ADD: current?: boolean;
}
```

**Duration interface field names** (lines 73-77, sanityTypes.ts) — confirmed correct names:
```typescript
interface Duration {
  _type: "duration";
  startYear: string;
  endYear: string;
}
```

---

### `lib/api/sanityDataLoader.ts` (service, additive)

**Analog:** `lib/api/sanityDataLoader.ts` (self — additive GROQ projection fields)

**Current education projection** (lines 25-29, sanityDataLoader.ts):
```groq
_type == 'education' => {
  school,
  start,
  end
  // ADD: fieldOfStudy
},
```

**Current workExperience projection** (lines 31-35, sanityDataLoader.ts):
```groq
_type == 'workExperience' => {
  sortIndex,
  duration,
  description
  // ADD: company
  // ADD: current
},
```

---

### `app/context/GlobalContext.tsx` (provider, targeted edit)

**Analog:** `app/context/GlobalContext.tsx` (self — targeted lines for education)

**Current education state (single item) — lines to change** (lines 13, 27, 40-42, GlobalContext.tsx):
```typescript
// LINE 13 — ContextType interface:
education: Education | null;          // → Education[] | null

// LINE 27 — useState:
const [education, setEducationData] = useState<Education | null>(null);  // → useState<Education[] | null>(null)

// LINES 40-42 — setSiteContentToContext, education block:
const educationData = data?.find((item) => item._type === "education");
if (educationData) {
  setEducationData(educationData);
}
// → REPLACE WITH (mirrors workExperience pattern at lines 45-49):
const isEducation = (item: SanityApiResponse): item is Education =>
  item._type === "education";
const educationArray = data?.filter(isEducation) ?? [];
setEducationData(educationArray);
```

**workExperience array pattern to mirror** (lines 45-49, GlobalContext.tsx — verified working pattern):
```typescript
const isWorkExperience = (item: SanityApiResponse): item is WorkExperience =>
  item._type === "workExperience";
const workExperienceArray = data?.filter(isWorkExperience) ?? [];
const sortedWE = [...workExperienceArray].sort((a, b) => a.sortIndex - b.sortIndex);
setWorkExperienceData(sortedWE);
```

---

### `app/page.tsx` (route/entry, additive)

**Analog:** `app/page.tsx` (self — additive imports and JSX after `<WorkSection />`)

**Current section composition** (lines 1-24, page.tsx — full file):
```typescript
import { loadSanityData } from "@/lib/api/sanityDataLoader";
import DataHydrator from "@/components/wrappers/DataHydrator";
import QueryClientWrapper from "@/components/wrappers/QueryClientWrapper";
import SiteHeader from "@/components/SiteHeader";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import WorkSection from "@/components/WorkSection";
// ADD:
// import ExperienceSection from "@/components/ExperienceSection";
// import SkillsSection from "@/components/SkillsSection";
// import ServicesSection from "@/components/ServicesSection";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await loadSanityData();
  return (
    <QueryClientWrapper>
      <DataHydrator data={data} />
      <SiteHeader />
      <main>
        <HeroSection />
        <AboutSection />
        <WorkSection />
        {/* ADD after WorkSection: */}
        {/* <ExperienceSection /> */}
        {/* <SkillsSection /> */}
        {/* <ServicesSection /> */}
      </main>
    </QueryClientWrapper>
  );
}
```

---

## Shared Patterns

### Section Shell
**Source:** `components/AboutSection.tsx` lines 34-44
**Apply to:** `ExperienceSection`, `SkillsSection`, `ServicesSection`
```typescript
<section
  id="[section-id]"   // "experience" | "skills" | "services"
  style={{
    padding: "var(--section-py) var(--page-px)",
    background: "var(--ms-bg-alt)",
    borderTop: "1px solid var(--ms-border)",
    borderBottom: "1px solid var(--ms-border)",
  }}
>
  <div style={{ maxWidth: "var(--content-max)", margin: "0 auto" }}>
    {/* content */}
  </div>
</section>
```

### Kicker Row
**Source:** `components/AboutSection.tsx` lines 46-69
**Apply to:** `ExperienceSection`, `SkillsSection`, `ServicesSection`
```typescript
<div style={{
  display: "flex",
  alignItems: "center",
  gap: 12,
  fontFamily: "var(--font-mono)",
  fontSize: "var(--text-mono)",
  color: "var(--ms-fg-soft)",
  letterSpacing: 1,
}}>
  <span style={{ color: "var(--ms-orange-text)", fontWeight: 600 }}>03</span>
  <span aria-hidden="true" style={{ width: 28, height: 1, background: "var(--ms-border-strong)" }} />
  <span style={{ textTransform: "uppercase" }}>SECTION LABEL</span>
</div>
```

### Mono Label + Value pair
**Source:** `components/AboutSection.tsx` lines 148-170
**Apply to:** `ExperienceSection` (education detail rows, community rows)
```typescript
<div style={{
  fontFamily: "var(--font-mono)",
  fontSize: "var(--text-mono)",
  textTransform: "uppercase",
  letterSpacing: 1,
  color: "var(--ms-fg-faint)",
}}>LABEL</div>
<div style={{
  marginTop: 4,
  fontFamily: "var(--font-mono)",
  fontSize: "var(--text-mono)",
  color: "var(--ms-fg)",
}}>value</div>
```

### Fraunces Italic Accent
**Source:** `components/AboutSection.tsx` lines 95-102 and `components/WorkSection.tsx` lines 95-101
**Apply to:** `ExperienceSection` (H2), `ServicesSection` (decorative giant number)
```typescript
<em style={{
  fontFamily: "var(--font-display)",
  fontStyle: "italic",
  fontWeight: 400,
  color: "var(--ms-orange-text)",
}}>
  italic text
</em>
```

### Badge Outline (stack chips)
**Source:** `components/WorkSection.tsx` lines 5, 315-326
**Apply to:** `ServicesSection` (stack chip labels per card)
```typescript
import { Badge } from "@/components/ui/badge";
// ...
<Badge variant="outline" aria-hidden="true">{chipLabel}</Badge>
```

### CSS transition via anim-hover token
**Source:** `components/WorkSection.tsx` lines 210-213 (project row background transition)
**Apply to:** `ServicesSection` (border-color on card hover, via globals.css class)
```typescript
// ProjectRow background transition (existing pattern):
background: open ? "var(--ms-mist)" : "transparent",
transition: "background var(--anim-hover)",
// ServicesSection analogous: border-color transition in CSS class
```

### aria-hidden on Decorative Elements
**Source:** `components/AboutSection.tsx` lines 179-188 (decorative offset border), line 220 (decorative span), `components/WorkSection.tsx` line 286 (spacer div)
**Apply to:** All new components — timeline pulse dot, service card giant numbers, kicker decorative line, service card stack chips
```typescript
<div aria-hidden="true" style={{ ... }} />
<span aria-hidden="true" style={{ ... }} />
```

---

## No Analog Found

All files have close matches in the codebase. No files require falling back to RESEARCH.md patterns exclusively.

The one genuinely new visual element — the 10-segment proficiency bar — has no existing component analog, but its implementation is fully specified in RESEARCH.md Code Examples and uses only pre-established CSS variable tokens (`--ms-orange`, `--ms-border-strong`, `--radius-xs`, `--space-1`). The `role="img"` + `aria-label` accessibility wrapper is the only novel pattern required.

---

## Metadata

**Analog search scope:** `components/`, `app/context/`, `app/models/`, `lib/api/`, `sanity/schemaTypes/`, `app/page.tsx`, `app/globals.css`
**Files scanned:** 11 source files read directly
**Pattern extraction date:** 2026-05-10
