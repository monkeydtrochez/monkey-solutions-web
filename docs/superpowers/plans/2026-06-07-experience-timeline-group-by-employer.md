# Group Experience Timeline by Employer — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render the Experience timeline as one accordion row per employer (3 rows) instead of one per activity (15 rows); expanding an employer reveals all its client engagements with role/client, years, and description.

**Architecture:** Derive employer groups client-side from the existing `workExperience` array via a module-scope `groupByEmployer` helper. Keep the single-open accordion (`WorkSection` pattern) but key it by employer. Replace `ExperienceRow` with `EmployerRow` (the employer header + expanded panel) and a small `ActivityItem` (one engagement). Only `components/ExperienceSection.tsx` changes.

**Tech Stack:** Next.js App Router client component, React `useState`/`useMemo`, inline styles + Tailwind utilities + CSS custom properties from `app/globals.css`.

**Spec:** `docs/superpowers/specs/2026-06-07-experience-timeline-group-by-employer-design.md`

**Note on testing:** This repo has no test runner (CLAUDE.md → "There are no tests configured"). Do NOT add a test framework (YAGNI). Verification is `npm run lint`, `npm run build` (type-checks), and a manual browser check at `#experience`.

**Commit messages:** Per CLAUDE.md, never include `Co-authored-by` or any AI attribution.

**Data reality (for the manual check):** 15 entries across 3 employers — Visionite (1 activity, current, 2025–Present), QueensLab (7, 2020–2024), Knowit Experience (7, 2015–2020). Every activity has a description.

---

## File Structure

| File | Responsibility | Change |
|------|----------------|--------|
| `components/ExperienceSection.tsx` | Renders the Experience + Education section. | Modify only — add `EmployerGroup` type + `groupByEmployer` helper; key accordion state by employer; replace `ExperienceRow` with `EmployerRow` + `ActivityItem`; remove the now-unused `hasDescription` helper. |

No other files change. No schema/data-loader/type changes — grouping is derived from existing `company`, `current`, `duration`, `title`, `description` fields.

---

## Task 1: Group the timeline by employer

This task replaces the per-activity accordion with a per-employer accordion in one cohesive rewrite of `components/ExperienceSection.tsx`. The section header (kicker + H2), the timeline vertical line, the dot styling/pulse, the no-tint open state, and the entire Education + Community block are preserved.

**Files:**
- Modify: `components/ExperienceSection.tsx`

- [ ] **Step 1: Replace the entire contents of `components/ExperienceSection.tsx` with the following.**

This removes `hasDescription` (no longer needed — every employer is collapsible), adds the `EmployerGroup` type and `groupByEmployer` helper, keys the accordion state by employer, maps over `groups`, and replaces `ExperienceRow` with `EmployerRow` + `ActivityItem`. `getDescriptionText`, the section header, and the Education + Community block are unchanged from the current file.

```tsx
"use client";
import { useContext, useMemo, useState } from "react";
import GlobalContext from "@/app/context/GlobalContext";
import type { WorkExperience } from "@/app/models/sanityTypes";

// Plain text from a work entry's blockContent description (D-06) — no block renderer.
function getDescriptionText(entry: WorkExperience): string {
  return (
    entry.description
      ?.map((block) => block.children?.map((c) => c.text).join(""))
      .filter(Boolean)
      .join(" ") ?? ""
  );
}

// An employer with all of its activities (client engagements) grouped together.
type EmployerGroup = {
  key: string;
  company: string;
  entries: WorkExperience[];
  current: boolean;
  startYear: string;
  endYearDisplay: string;
  count: number;
};

// Group work entries by employer, preserving first-seen (chronological) order.
function groupByEmployer(entries: WorkExperience[]): EmployerGroup[] {
  const order: string[] = [];
  const map = new Map<string, WorkExperience[]>();

  for (const entry of entries) {
    const key = entry.company || entry._id;
    if (!map.has(key)) {
      map.set(key, []);
      order.push(key);
    }
    map.get(key)!.push(entry);
  }

  return order.map((key) => {
    const groupEntries = map.get(key)!;
    const current = groupEntries.some((e) => e.current === true);

    const startYears = groupEntries
      .map((e) => e.duration?.startYear)
      .filter((y): y is string => Boolean(y));
    const endYears = groupEntries
      .map((e) => e.duration?.endYear)
      .filter((y): y is string => Boolean(y));

    const startYear = startYears.length
      ? startYears.reduce((min, y) => (Number(y) < Number(min) ? y : min))
      : "";
    const latestEnd = endYears.length
      ? endYears.reduce((max, y) => (Number(y) > Number(max) ? y : max))
      : "";

    return {
      key,
      company: groupEntries[0].company ?? "",
      entries: groupEntries,
      current,
      startYear,
      endYearDisplay: current ? "Present" : latestEnd,
      count: groupEntries.length,
    };
  });
}

export default function ExperienceSection() {
  const ctx = useContext(GlobalContext);
  const workExperience = useMemo(() => ctx?.workExperience ?? [], [ctx?.workExperience]);
  const education = ctx?.education ?? [];
  const communityWork = ctx?.profile?.communityWork ?? [];

  // One row per employer; each employer holds its client engagements.
  const groups = useMemo(() => groupByEmployer(workExperience), [workExperience]);

  // openId tracks the user's explicit selection, keyed by employer:
  //   null     = no explicit pick yet (auto-open the current employer)
  //   "closed" = user explicitly collapsed everything
  //   string   = user explicitly opened this employer key
  const [openId, setOpenId] = useState<string | "closed" | null>(null);

  // Resolve which employer is actually open.
  const effectiveOpenId = useMemo(() => {
    if (openId === "closed") return null;
    if (openId !== null) {
      return groups.some((g) => g.key === openId) ? openId : null;
    }
    // No explicit pick: default to the employer with the current role, else the first.
    const current = groups.find((g) => g.current);
    if (current) return current.key;
    return groups.length > 0 ? groups[0].key : null;
  }, [openId, groups]);

  const handleToggle = (key: string) => {
    setOpenId((prev) => (prev === key ? "closed" : key));
  };

  return (
    <section
      id="experience"
      style={{
        padding: "var(--section-py) var(--page-px)",
        background: "var(--ms-bg-alt)",
        borderTop: "1px solid var(--ms-border)",
        borderBottom: "1px solid var(--ms-border)",
      }}
    >
      <div style={{ maxWidth: "var(--content-max)", margin: "0 auto" }}>
        {/* Kicker row */}
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
            03
          </span>
          <span
            aria-hidden="true"
            style={{
              width: 28,
              height: 1,
              background: "var(--ms-border-strong)",
            }}
          />
          <span style={{ textTransform: "uppercase" }}>EXPERIENCE + EDUCATION</span>
        </div>

        {/* Section H2 with Fraunces italic accent on "Education" */}
        <h2
          style={{
            marginTop: 36,
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-h2)",
            fontWeight: 400,
            lineHeight: 1.02,
            letterSpacing: "-0.035em",
            color: "var(--ms-fg)",
          }}
        >
          Experience +{" "}
          <em
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontWeight: 400,
              color: "var(--ms-orange-text)",
            }}
          >
            Education
          </em>
        </h2>

        {/* ── Full-width experience timeline ── */}
        <div
          style={{
            position: "relative",
            marginTop: 48,
          }}
        >
          {/* Explicit vertical line — positioned so it aligns with dot centres */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 7,
              top: 8,
              bottom: 8,
              width: 1,
              background: "var(--ms-border)",
            }}
          />

          {groups.map((group, index) => (
            <EmployerRow
              key={group.key}
              group={group}
              open={effectiveOpenId === group.key}
              onToggle={() => handleToggle(group.key)}
              isLast={index === groups.length - 1}
            />
          ))}
        </div>

        {/* ── Education + Community row (below timeline) ── */}
        <div
          className="grid grid-cols-1 ms:grid-cols-2"
          style={{
            gap: 64,
            marginTop: 64,
            paddingTop: 48,
            borderTop: "1px solid var(--ms-border)",
            alignItems: "start",
          }}
        >
          {/* Education list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {education.map((entry) => (
              <div
                key={entry._id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 16,
                  alignItems: "start",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 16,
                      fontWeight: 600,
                      color: "var(--ms-fg)",
                    }}
                  >
                    {entry.title}
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      fontWeight: 400,
                      color: "var(--ms-fg-soft)",
                    }}
                  >
                    {entry.school}
                  </div>
                  {entry.fieldOfStudy && (
                    <div
                      style={{
                        marginTop: 6,
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        fontWeight: 400,
                        color: "var(--ms-fg-faint)",
                      }}
                    >
                      {entry.fieldOfStudy}
                    </div>
                  )}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    fontWeight: 400,
                    color: "var(--ms-fg-faint)",
                    textAlign: "right",
                    whiteSpace: "nowrap",
                  }}
                >
                  {entry.start}&ndash;{entry.end}
                </div>
              </div>
            ))}
          </div>

          {/* Community sub-section — from profile.communityWork */}
          {communityWork.length > 0 && (
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  color: "var(--ms-fg-faint)",
                  marginBottom: 16,
                }}
              >
                ALSO / COMMUNITY
              </div>

              {communityWork.map((row) => (
                <div
                  key={row._key}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    gap: 16,
                    padding: "12px 0",
                    borderBottom: "1px solid var(--ms-border)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      fontWeight: 400,
                      color: "var(--ms-fg-soft)",
                    }}
                  >
                    {row.assignment}
                  </span>
                  {row.organisation && (
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        fontWeight: 400,
                        color: "var(--ms-fg-faint)",
                        textAlign: "right",
                      }}
                    >
                      {row.organisation}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}

function EmployerRow({
  group,
  open,
  onToggle,
  isLast,
}: {
  group: EmployerGroup;
  open: boolean;
  onToggle: () => void;
  isLast: boolean;
}) {
  const panelId = `experience-panel-${group.key}`;
  const rangeLabel = `${group.startYear || "?"}–${group.endYearDisplay || "Present"}`;
  const countLabel = `${group.count} ${group.count === 1 ? "engagement" : "engagements"}`;

  return (
    <div
      style={{
        position: "relative",
        paddingLeft: 32,
        paddingBottom: isLast ? 0 : 48,
      }}
    >
      {/* Dot — current employer: orange 16px pulsing; past: grey 12px static */}
      {group.current ? (
        <div
          aria-hidden="true"
          className="ms-pulse-anim"
          style={{
            position: "absolute",
            left: -1,
            top: 2,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "var(--ms-orange)",
            boxShadow: "0 0 0 4px var(--ms-orange-dim)",
            animation: "ms-pulse var(--anim-pulse) infinite",
          }}
        />
      ) : (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 1,
            top: 4,
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "var(--ms-border-strong)",
            border: "2px solid var(--ms-bg-alt)",
          }}
        />
      )}

      {/* Employer header — clickable accordion toggle */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${open ? "Collapse" : "Expand"} ${group.company || "employer"}`}
        className="focus-ring"
        style={{
          all: "unset",
          boxSizing: "border-box",
          cursor: "pointer",
          width: "100%",
          display: "flex",
          alignItems: "flex-start",
          gap: 16,
        }}
      >
        {/* Meta: company + badge, then range · count */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 16,
                fontWeight: 600,
                color: "var(--ms-fg)",
              }}
            >
              {group.company}
            </span>
            {group.current && (
              <span
                style={{
                  padding: "3px 8px",
                  border: "1px solid var(--ms-orange-dim)",
                  borderRadius: "var(--radius-pill)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  color: "var(--ms-orange-text)",
                }}
              >
                Current
              </span>
            )}
          </div>

          <div
            style={{
              marginTop: 2,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 400,
              color: "var(--ms-fg-faint)",
            }}
          >
            {rangeLabel} · {countLabel}
          </div>
        </div>

        {/* Chevron — rotates 90° when open */}
        <span
          aria-hidden="true"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-mono)",
            color: open ? "var(--ms-orange-text)" : "var(--ms-fg-soft)",
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform var(--anim-chevron), color var(--anim-hover)",
            display: "inline-block",
            marginTop: 2,
            flexShrink: 0,
          }}
        >
          →
        </span>
      </button>

      {/* Expanded panel — all activities for this employer */}
      {open && (
        <div
          id={panelId}
          style={{
            marginTop: 20,
            maxWidth: 680,
            animation: "ms-fadein var(--anim-fadein)",
          }}
        >
          {group.entries.map((entry, i) => (
            <ActivityItem key={entry._id} entry={entry} isFirst={i === 0} />
          ))}
        </div>
      )}
    </div>
  );
}

function ActivityItem({ entry, isFirst }: { entry: WorkExperience; isFirst: boolean }) {
  const text = getDescriptionText(entry);

  return (
    <div
      style={{
        marginTop: isFirst ? 0 : 20,
        paddingTop: isFirst ? 0 : 20,
        borderTop: isFirst ? "none" : "1px solid var(--ms-border)",
      }}
    >
      {/* Role / client title */}
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          fontWeight: 500,
          color: "var(--ms-fg)",
        }}
      >
        {entry.title}
      </div>

      {/* Year range */}
      <div
        style={{
          marginTop: 4,
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          fontWeight: 400,
          color: "var(--ms-fg-faint)",
        }}
      >
        {entry.duration?.startYear ?? "?"}&ndash;{entry.duration?.endYear || "Present"}
      </div>

      {/* Description */}
      {text && (
        <p
          style={{
            margin: "10px 0 0",
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-body)",
            fontWeight: 400,
            lineHeight: 1.65,
            color: "var(--ms-fg-soft)",
          }}
        >
          {text}
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: PASS with no errors/warnings. In particular, no `no-unused-vars` (confirm `hasDescription` was removed and `getDescriptionText` is still used by `ActivityItem`) and no `react-hooks/exhaustive-deps` warning (the `groups` memo deps on `[workExperience]`; `effectiveOpenId` deps on `[openId, groups]`; `groupByEmployer`/`getDescriptionText` are module-scope).

- [ ] **Step 3: Build (type-check)**

Run: `npm run build`
Expected: Build succeeds, no TypeScript errors.

- [ ] **Step 4: Manual behavior check**

Run: `npm run dev`, open `http://localhost:3000/#experience`. Verify:
- The timeline shows **3 rows**: Visionite, QueensLab, Knowit Experience (most-recent first).
- Each collapsed row shows `range · count`, e.g. `QueensLab` → `2020–2024 · 7 engagements`; `Knowit Experience` → `2015–2020 · 7 engagements`; `Visionite` → `2025–Present · 1 engagement`.
- On load, **Visionite** (current) is expanded showing its 1 activity (title `SENIOR FULLSTACK DEVELOPER | VÄSTTRAFIK`, year range, description); the others are collapsed.
- The Visionite dot is the orange pulsing dot; the other two are grey static dots.
- Clicking QueensLab expands it to **7 activities** (each: role/client title, year range, description, separated by thin dividers) and collapses Visionite (single-open).
- Clicking the open employer collapses it (nothing open). The chevron rotates 90° and turns orange when open; the panel fades in.
- The open row has **no background tint**.
- The timeline is now short; resize to mobile width and confirm each employer toggles correctly.
- The section header and the Education + Community block are unchanged.

- [ ] **Step 5: Commit**

```bash
git add components/ExperienceSection.tsx
git commit -m "Group Experience timeline by employer with expandable activities"
```

---

## Self-Review

**Spec coverage:**
- `groupByEmployer` helper + `EmployerGroup` shape (key/company/entries/current/startYear/endYearDisplay/count) → Step 1 ✓
- Group order = first-appearance; activity order = incoming → `groupByEmployer` preserves `order[]` and push order ✓
- `current` = any activity current; `startYear` = min; `endYearDisplay` = "Present" if current else max end → Step 1 reduce logic ✓
- `key` = `company || entries[0]._id` → Step 1 ✓
- Single-open accordion keyed by employer; default-open current employer else first; `"closed"` collapse-all → `effectiveOpenId` + `handleToggle` ✓
- Every employer collapsible (no static branch); `hasDescription` removed → Step 1 (EmployerRow always a button) ✓
- Collapsed header: dot + company + Current badge + `range · count` (pluralized) + chevron → `EmployerRow` ✓
- Expanded panel: `ActivityItem` list with title + year range + description, dividers, fade-in, maxWidth ✓
- No background tint → `EmployerRow` container has no `background` ✓
- Accessibility: `aria-expanded`/`aria-controls`/`aria-label`/`focus-ring`; panel `id`; chevron + dot `aria-hidden` → ✓
- Components `groupByEmployer`, `EmployerRow`, `ActivityItem`; `getDescriptionText` reused → ✓
- Unchanged: timeline line, dot styling/pulse, section header, Education + Community → preserved verbatim in Step 1 ✓
- Only `components/ExperienceSection.tsx` changes → ✓

**Placeholder scan:** No TBD/TODO/"handle edge cases" — Step 1 contains the complete file. ✓

**Type consistency:** `EmployerGroup` fields used consistently (`group.key`, `group.company`, `group.entries`, `group.current`, `group.startYear`, `group.endYearDisplay`, `group.count`); `EmployerRow` props (`group`, `open`, `onToggle`, `isLast`) match the map call; `ActivityItem` props (`entry`, `isFirst`) match its usage; `panelId` referenced by both `aria-controls` and the panel `id`; `effectiveOpenId === group.key` compares the same key set by `handleToggle`. ✓
