# Phase 3: About + Work - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-10
**Phase:** 03-about-work
**Areas discussed:** Project overview text, Project kind + category filter, Project metrics structure, About body copy sourcing

---

## Project Overview Text

| Option | Description | Selected |
|--------|-------------|----------|
| New overview: text field | Add overview: string to project schema. Simple to fill in Sanity Studio, no PortableText renderer needed. body stays for potential future long-form use. | ✓ |
| Use existing body blockContent | Render the first block of body as the summary. No schema change, but requires a PortableText renderer. | |
| Replace body with overview: text | Remove body entirely, add overview: text. Cleaner schema but loses future rich-text capability. | |

**User's choice:** New overview: text field
**Notes:** —

---

## Keep or Remove body field

| Option | Description | Selected |
|--------|-------------|----------|
| Remove body | Keep schema clean. If long-form project pages are ever added, they'd be a separate schema. | ✓ |
| Keep body alongside overview | Preserve optionality, but adds Studio clutter. | |

**User's choice:** Remove body
**Notes:** —

---

## Project Kind + Category Filter

| Option | Description | Selected |
|--------|-------------|----------|
| kind: string + regex filter | Add kind: string (e.g. "E-commerce · Headless"). Filter derives web/ios/saas via regex. One field. | ✓ |
| Separate category: string enum | Add category field with web/ios/saas values. Simpler filter logic, but needs a kind field too. | |
| Reuse existing tags array | No schema change, but mixes category with stack tags, murkier filter. | |

**User's choice:** kind: string + regex filter
**Notes:** —

---

## Project Number and Year Display

| Option | Description | Selected |
|--------|-------------|----------|
| Derive number from sortIndex, year from duration.startYear | No new fields needed. | ✓ |
| Add explicit year: string field | More explicit but redundant with existing duration. | |
| You decide | Let Claude figure out the cleanest approach. | |

**User's choice:** Derive number from sortIndex, year from duration.startYear
**Notes:** —

---

## Project Metrics Structure

| Option | Description | Selected |
|--------|-------------|----------|
| metrics: array of objects | Array with max 3 items, each having label, value, suffix strings. Clean structured data. | ✓ |
| Flat metric1/metric2/metric3 fields | 9 string fields. Verbose but no array complexity. | |
| Hardcode metrics in component | Placeholder content stays until a future CMS phase. Not recommended. | |

**User's choice:** metrics: array of objects
**Notes:** —

---

## About Body Copy Sourcing

| Option | Description | Selected |
|--------|-------------|----------|
| Add aboutBody: text field to profile | New simple text field. No PortableText renderer needed. | ✓ |
| Use existing profile.description (blockContent) | Render via PortableText renderer. No schema change but adds a dependency. | |
| Two separate paragraph fields | aboutPara1 + aboutPara2 strings. Explicit but Daniel manages two fields. | |

**User's choice:** Add aboutBody: text field to profile
**Notes:** —

---

## Working Since Year

| Option | Description | Selected |
|--------|-------------|----------|
| Add workingSince: string to profile | CMS-managed, consistent with other profile facts. | |
| Hardcode 2017 in the component | Static year, no schema change. | |
| (User custom)| Hardcode 2015 — career started in 2015, unlikely to ever change. | ✓ |

**User's choice:** Hardcode 2015 in component
**Notes:** Daniel clarified his career started in 2015, not 2017.

---

## About Portrait Placeholder

| Option | Description | Selected |
|--------|-------------|----------|
| Styled border box with initials | 3:4 bordered rectangle with "DT" in Fraunces italic. Clearly a placeholder. | ✓ |
| Solid color block | bgAlt-colored rectangle. Minimal but gives no placeholder signal. | |
| You decide | Let Claude choose a placeholder style. | |

**User's choice:** Styled border box with initials ("DT")
**Notes:** —

---

## Claude's Discretion

- Whether to define `metrics` as an inline array object or extract a named `projectMetric` Sanity type
- Whether to co-locate `AboutSection` and `WorkSection` in a single file or split into separate component files
- Sticker badge content and rotation angle — follow design handoff

## Deferred Ideas

None — discussion stayed within phase scope.
