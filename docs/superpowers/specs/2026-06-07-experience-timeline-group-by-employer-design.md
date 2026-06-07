# Design Spec: Group Experience Timeline by Employer

**Date:** 2026-06-07
**Status:** Approved
**Supersedes:** the per-activity accordion from
`2026-06-07-collapsible-experience-timeline-design.md` (that work shipped; this
iteration changes the grouping granularity from per-activity to per-employer).

---

## Overview

The Experience timeline renders one row per `workExperience` entry. In reality
the 15 entries belong to only **3 employers** — each entry is a client
engagement under one employer (e.g. Visionite ×1, QueensLab ×7, Knowit
Experience ×7). Even collapsed, 15 rows is a long scroll.

Group the entries by employer so the timeline shows **one row per employer**.
The row stays a single-open accordion: the employer holding the current role is
expanded on load, the rest collapsed. Expanding an employer reveals a stacked
list of all that employer's activities (role/client + years + description).

This is purely a presentational change in `components/ExperienceSection.tsx` —
grouping is derived client-side from existing fields. No schema, data-loader, or
Sanity changes.

---

## Data grouping

Add a module-scope `groupByEmployer(entries: WorkExperience[]): EmployerGroup[]`
helper.

```
type EmployerGroup = {
  key: string;            // company || entries[0]._id (stable, used as openId)
  company: string;        // display name ("" if absent)
  entries: WorkExperience[]; // activities, in incoming order
  current: boolean;       // true if any activity has current === true
  startYear: string;      // earliest startYear across activities
  endYearDisplay: string; // "Present" if current, else latest endYear
  count: number;          // entries.length
};
```

Rules:

- **Group order:** first-appearance order of each company in the incoming array
  (which is already chronological by `sortIndex` — Visionite, QueensLab, Knowit).
  Do not re-sort; preserve incoming order to match current rendering.
- **Activity order within a group:** incoming order (preserved).
- **`current`:** `entries.some((e) => e.current === true)`.
- **`startYear`:** the minimum `duration.startYear` across the group's activities
  (numeric comparison; ignore empty/missing values).
- **`endYearDisplay`:** `"Present"` if `current`; otherwise the maximum
  `duration.endYear` across the group (numeric comparison; ignore empty values).
- **`key`:** `company` when present, else `entries[0]._id`. Company names are
  unique in the data, so `company` is the normal key.

`getDescriptionText(entry)` (from the previous iteration) is reused for activity
descriptions.

---

## Behaviour

### Single-open accordion (keyed by employer)

Same `openId` state machine, now keyed by `EmployerGroup.key` instead of entry
id:

- `null` — no explicit pick → default-open the employer with a current activity;
  else the first employer.
- `"closed"` — user collapsed everything → nothing open.
- `<key>` — user explicitly opened that employer; opening one collapses the
  previously open one (single-open).

`effectiveOpenId` (derived via `useMemo`):

- `"closed"` → `null`.
- a `<key>` → keep it if a group with that key still exists, else `null`.
- `null` → first group with `current === true`, else the first group, else
  `null` (empty list).

`handleToggle(key)` = `setOpenId((prev) => (prev === key ? "closed" : key))`.

Every employer has at least one activity, so **every row is collapsible** — the
"static, non-clickable row" branch from the previous iteration is removed.

---

## Layout

### Collapsed employer row (header)

A full-width `<button>` per employer, structured like the previous header:

- **Timeline dot** — unchanged styling. Orange 16px pulsing when `group.current`,
  grey 12px static otherwise. Absolutely positioned against the vertical line.
- **Company name** (sans, 16px, 600) + **`Current` badge** (shown when
  `group.current`), same badge styles as today.
- **Meta line** (mono, 12px, faint): `"{startYear}–{endYearDisplay} · {count} {engagement|engagements}"`,
  e.g. `2020–2024 · 7 engagements`, `2025–Present · 1 engagement`. Pluralize on
  `count === 1`.
- **Chevron** — `→` pinned right (`marginLeft: auto` / flex), rotates to `90°`
  and turns orange when open, `var(--anim-chevron)` transition.

The button uses the same `all: "unset"` + `display: "flex"` + `.focus-ring`
pattern as `WorkSection`'s `ProjectRow` and the previous `ExperienceRow`. No
responsive visibility utilities live inside it, so the known `all: unset` gotcha
does not apply.

### Expanded panel

When open, render an `ActivityItem` for each activity in `group.entries`,
wrapped in a container that fades in (`animation: ms-fadein var(--anim-fadein)`)
and is indented to clear the timeline line.

Each `ActivityItem({ entry })` shows:

- **Role/client title** — the full `entry.title` string (e.g.
  `SENIOR FULLSTACK DEVELOPER | STENA LINE`), mono, `var(--ms-fg)`. Rendered
  as-is; the `|` separator is not parsed.
- **Year range** — `{startYear ?? "?"}–{endYear || "Present"}`, mono, faint.
- **Description** — the activity's description paragraph (sans, `var(--text-body)`,
  `line-height: 1.65`, `var(--ms-fg-soft)`), rendered only when non-empty.

Activities are separated by a thin top divider (`1px solid var(--ms-border)`) on
every item except the first, with comfortable vertical spacing. The list has a
`maxWidth` for readability (~680px).

### No background tint

As in the previous iteration, the open employer row gets **no background tint** —
open state is signalled by the rotated chevron and the revealed panel only.

---

## Component structure

`components/ExperienceSection.tsx`:

- `getDescriptionText(entry)` — reused module-scope helper.
- `groupByEmployer(entries)` — new module-scope helper returning
  `EmployerGroup[]`.
- `ExperienceSection` (default export) — owns the memoized `workExperience`, the
  memoized `groups = groupByEmployer(workExperience)`, the `openId` state,
  `effectiveOpenId`, and `handleToggle`; maps `groups` to `EmployerRow`.
- `EmployerRow({ group, open, onToggle, isLast })` — replaces `ExperienceRow`.
  Renders the dot, the clickable header (name + badge + meta + chevron), and the
  expanded panel.
- `ActivityItem({ entry })` — one activity inside the expanded panel.

---

## Accessibility

- Employer header `<button>`: `aria-expanded`, `aria-controls` → panel id,
  `aria-label` (`"Expand {company}"` / `"Collapse {company}"`), `.focus-ring`.
- Panel container carries the `id` referenced by `aria-controls`.
- Chevron and timeline dot are `aria-hidden`.

---

## Files Changed

| File | Change |
|------|--------|
| `components/ExperienceSection.tsx` | Add `groupByEmployer` helper + `EmployerGroup` type; replace `ExperienceRow` with `EmployerRow` + `ActivityItem`; map over employer groups instead of individual entries; key the accordion state by employer. |

---

## Out of Scope

- Parsing the `title` into separate role/client fields — kept as-is (YAGNI).
- Per-activity nested accordion — all activities in an open employer show at once.
- Background tint on the open row (deliberately omitted).
- Any change to the timeline line, dot styling/pulse, section header, or the
  Education + Community block.
- Schema / Sanity / data-loader changes — none needed.
