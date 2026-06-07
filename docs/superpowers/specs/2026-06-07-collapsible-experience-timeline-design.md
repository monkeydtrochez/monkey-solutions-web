# Design Spec: Collapsible Experience Timeline

**Date:** 2026-06-07
**Status:** Approved

---

## Overview

The Experience section (`#experience`) renders every employer as a timeline row
with an always-visible description. With several roles, the timeline gets long
and turns into a lot of scrolling on mobile.

Rework each employer row into a single-open accordion (mirroring the `#work`
section): a clickable header showing the meta that's already there, plus a
collapsible panel holding the description. The current employer is expanded on
load; all other roles are collapsed.

The timeline visuals (vertical line, dots, current-role pulse) and the entire
Education + Community block below stay exactly as they are. This is purely a
presentational change in `components/ExperienceSection.tsx` — no data, schema,
or Sanity changes.

---

## Behaviour

### Single-open accordion

Reuse the `WorkSection` state machine. One `openId` state of type
`string | "closed" | null`:

- `null` — no explicit pick yet → **default to the current employer** (see
  below). This is the on-load state.
- `"closed"` — user has explicitly collapsed everything → nothing open.
- `<id>` — user explicitly opened that row. Opening one collapses the
  previously open one (single-open).

`handleToggle(id)` sets `openId` to `id` if it wasn't the open row, or
`"closed"` if it was (clicking the open row collapses it).

### Default-open resolution

An `effectiveOpenId`, derived via `useMemo`, resolves which row is actually
open and **only ever points to a row that has description content**:

- If `openId === "closed"` → `null` (nothing open).
- If `openId` is an id → keep it open only if that row still exists and is
  collapsible.
- If `openId === null` → default to the **current employer** (first entry with
  `current === true`) if it's collapsible; otherwise the first entry that has a
  description; otherwise `null`.

### Collapsible vs. static rows

A row is **collapsible** only if it has description text (computed from
`entry.description` block content, same plain-text extraction as today). Rows
with no description render as plain, non-interactive rows — no chevron, no
button semantics, nothing to expand — and are skipped by the default-open
logic.

---

## Layout

### Row header (always visible)

The header keeps everything the row shows today, restructured as a clickable
bar:

- **Timeline dot** — unchanged. Orange 16px pulsing for `current`, grey 12px
  static otherwise, absolutely positioned against the vertical line.
- **Meta** — company name + `Current` badge, role title, year range
  (`startYear–endYear || "Present"`). Same styles as today.
- **Chevron** — a `→` glyph pinned to the right edge (`marginLeft: auto`),
  rotating to `90°` when open, using `var(--anim-chevron)` for the transition
  and `var(--ms-orange-text)` when open. Rendered **only on collapsible rows**.

For collapsible rows the header is a full-width `<button>` (`all: unset`,
`cursor: pointer`, `.focus-ring`). Clicking anywhere on the bar toggles it.
For static rows it's a plain `<div>`.

### Expanded panel

When a row is open, the description paragraph reveals beneath the header:

- Animated in with `animation: ms-fadein var(--anim-fadein)`.
- Indented to align under the meta text, clearing the timeline line (left
  padding consistent with the row's existing `paddingLeft: 32`).
- Description styling unchanged from today (sans font, `var(--text-body)`,
  `line-height: 1.65`, `var(--ms-fg-soft)`).
- Panel carries an `id` referenced by the header's `aria-controls`.

This is a deliberate layout change: today the description sits in a right-hand
column next to the meta; as an accordion it reads more naturally **below** the
header. On mobile (already single-column) the only change is that it starts
collapsed.

### No background tint

Unlike `WorkSection` (which tints the open row with `--ms-mist`), the open
Experience row gets **no background tint** — the section sits on
`--ms-bg-alt` with the timeline line running through it, and a tint would muddy
that. The open state is communicated by the rotated chevron and the revealed
panel alone.

---

## Component structure

Extract an `ExperienceRow` component within `ExperienceSection.tsx` (mirroring
`ProjectRow` in `WorkSection.tsx`), props:

- `entry` — the `WorkExperience` item
- `open` — boolean (`effectiveOpenId === entry._id`)
- `onToggle` — `() => void`
- `isLast` — boolean (preserves the existing `paddingBottom` spacing logic)

The `ExperienceSection` component owns the `openId` state, `effectiveOpenId`
derivation, and `handleToggle`, and maps `workExperience` to `ExperienceRow`s.

---

## Accessibility

- Collapsible header `<button>`: `aria-expanded`, `aria-controls` → panel id,
  `aria-label` (`"Expand {company}"` / `"Collapse {company}"`), `.focus-ring`.
- Static (description-less) rows: plain `<div>`, no button semantics.
- Chevron is `aria-hidden`.

---

## Files Changed

| File | Change |
|------|--------|
| `components/ExperienceSection.tsx` | Add `openId` state + `effectiveOpenId` + `handleToggle`; extract `ExperienceRow`; convert each employer row into a single-open accordion (clickable header + collapsible description panel + chevron). |

---

## Out of Scope

- Background tint on the open row (deliberately omitted — see above).
- Any change to the timeline line, dots, or current-role pulse.
- Any change to the Education + Community block below the timeline.
- Schema / Sanity / data-loader changes — none needed.
- Collapsing the Education or Community lists — not requested.
