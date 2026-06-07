# Collapsible Experience Timeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn each employer row in the Experience timeline into a single-open accordion (current employer expanded, the rest collapsed) so the section is much shorter, especially on mobile.

**Architecture:** Mirror the proven `WorkSection` accordion pattern inside `ExperienceSection.tsx`. The parent owns an `openId` state machine and derives `effectiveOpenId`; each employer row is extracted into an `ExperienceRow` component whose header is a clickable button that reveals the description in a collapsible panel. Timeline visuals and the Education + Community block are untouched.

**Tech Stack:** Next.js App Router (client component), React `useState`/`useMemo`, inline styles + Tailwind utility classes, CSS custom properties from `app/globals.css`.

**Spec:** `docs/superpowers/specs/2026-06-07-collapsible-experience-timeline-design.md`

**Note on testing:** This repo has no test runner configured (see `CLAUDE.md` → "There are no tests configured"). Standing up Jest/RTL for one presentational component is out of scope (YAGNI). Verification is therefore via `npm run lint`, `npm run build` (which type-checks), and a manual browser check at `#experience`. Each task ends with these checks and a commit.

**Commit messages:** Per `CLAUDE.md`, never include `Co-authored-by` or any AI attribution.

---

## File Structure

| File | Responsibility | Change |
|------|----------------|--------|
| `components/ExperienceSection.tsx` | Renders the Experience + Education section. Will own accordion state and an extracted `ExperienceRow` presentational component. | Modify only |

No other files change. No schema, data-loader, or type changes are needed — `WorkExperience` already has `_id`, `company`, `title`, `current`, `duration`, and `description`.

---

## Task 1: Extract `ExperienceRow` (behavior-preserving refactor)

Move the per-entry timeline markup out of the `.map()` into a dedicated `ExperienceRow` component. **No visual or behavioral change** — the description still renders always-visible in the two-column grid. This isolates the row so Task 2 can layer in the accordion cleanly.

**Files:**
- Modify: `components/ExperienceSection.tsx`

- [ ] **Step 1: Add the `WorkExperience` type import**

In the import block at the top of `components/ExperienceSection.tsx`, add the type import below the existing imports:

```tsx
"use client";
import { useContext } from "react";
import GlobalContext from "@/app/context/GlobalContext";
import type { WorkExperience } from "@/app/models/sanityTypes";
```

- [ ] **Step 2: Replace the `workExperience.map(...)` body with a call to `ExperienceRow`**

Inside the timeline wrapper `<div>` (the one with `position: "relative", marginTop: 48`), the children are the `aria-hidden` vertical line `<div>` followed by `{workExperience.map(...)}`. Replace **only** the `{workExperience.map(...)}` expression (the whole callback that returns each row `<div>`) with this:

```tsx
{workExperience.map((entry, index) => (
  <ExperienceRow
    key={entry._id}
    entry={entry}
    isLast={index === workExperience.length - 1}
  />
))}
```

Leave the vertical-line `<div>` and everything else in the section exactly as-is.

- [ ] **Step 3: Add the `ExperienceRow` component at the bottom of the file**

After the closing `}` of the `ExperienceSection` default-export function (and before end of file), add this component. It is the existing row markup moved verbatim, parameterised by `entry` and `isLast`:

```tsx
function ExperienceRow({
  entry,
  isLast,
}: {
  entry: WorkExperience;
  isLast: boolean;
}) {
  // Compute plain text from blockContent (D-06) — no block renderer library
  const text = entry.description
    ?.map((block) => block.children?.map((c) => c.text).join(""))
    .filter(Boolean)
    .join(" ");

  return (
    <div
      style={{
        position: "relative",
        paddingLeft: 32,
        paddingBottom: isLast ? 0 : 48,
      }}
    >
      {/* Dot — current role: orange 16px pulsing; past role: grey 12px static */}
      {entry.current === true ? (
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

      {/* Entry: meta left, description right */}
      <div
        className="grid grid-cols-1 ms:grid-cols-[220px_1fr]"
        style={{
          gap: 40,
          alignItems: "start",
        }}
      >
        {/* Meta column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* Company name + optional "Current" badge */}
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 16,
                fontWeight: 600,
                color: "var(--ms-fg)",
              }}
            >
              {entry.company ?? ""}
            </span>
            {entry.current === true && (
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

          {/* Role title */}
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 400,
              color: "var(--ms-fg-soft)",
            }}
          >
            {entry.title}
          </div>

          {/* Year range — use || for endYear so empty string falls back to "Present" */}
          <div
            style={{
              marginTop: 2,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 400,
              color: "var(--ms-fg-faint)",
            }}
          >
            {entry.duration?.startYear ?? "?"}&ndash;{entry.duration?.endYear || "Present"}
          </div>
        </div>

        {/* Description column */}
        {text && (
          <p
            style={{
              margin: 0,
              paddingTop: 2,
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
    </div>
  );
}
```

- [ ] **Step 4: Lint**

Run: `npm run lint`
Expected: PASS with no new errors or warnings for `components/ExperienceSection.tsx`.

- [ ] **Step 5: Build (type-check)**

Run: `npm run build`
Expected: Build succeeds. No TypeScript errors.

- [ ] **Step 6: Manual visual check**

Run: `npm run dev`, open `http://localhost:3000/#experience`.
Expected: The Experience timeline looks **identical** to before — every employer's description is visible, dots and the vertical line unchanged.

- [ ] **Step 7: Commit**

```bash
git add components/ExperienceSection.tsx
git commit -m "Extract ExperienceRow component from timeline map"
```

---

## Task 2: Add the single-open accordion behavior

Layer the accordion onto `ExperienceRow`: the parent gains the `openId` state machine and default-opens the current employer; the row header becomes a clickable button with a rotating chevron, and the description moves into a collapsible panel. Rows without a description render as plain, non-clickable rows.

**Files:**
- Modify: `components/ExperienceSection.tsx`

- [ ] **Step 1: Update React imports to include `useMemo` and `useState`**

Change the React import at the top of the file to:

```tsx
"use client";
import { useContext, useMemo, useState } from "react";
import GlobalContext from "@/app/context/GlobalContext";
import type { WorkExperience } from "@/app/models/sanityTypes";
```

- [ ] **Step 2: Add module-scope description helpers**

Immediately **after** the import block and **before** `export default function ExperienceSection()`, add these two helpers. (Module scope keeps them out of `useMemo` dependency arrays.)

```tsx
// Plain text from a work entry's blockContent description (D-06) — no block renderer.
function getDescriptionText(entry: WorkExperience): string {
  return (
    entry.description
      ?.map((block) => block.children?.map((c) => c.text).join(""))
      .filter(Boolean)
      .join(" ") ?? ""
  );
}

// A row is collapsible only if it has description text to reveal.
function hasDescription(entry: WorkExperience): boolean {
  return getDescriptionText(entry).length > 0;
}
```

- [ ] **Step 3: Memoize `workExperience` and add the accordion state**

Inside `ExperienceSection`, change the `workExperience` line from:

```tsx
const workExperience = ctx?.workExperience ?? [];
```

to a memoized version, then add the state machine directly below the three context-derived consts (`workExperience`, `education`, `communityWork`):

```tsx
const workExperience = useMemo(() => ctx?.workExperience ?? [], [ctx?.workExperience]);
const education = ctx?.education ?? [];
const communityWork = ctx?.profile?.communityWork ?? [];

// openId tracks the user's explicit selection:
//   null     = no explicit pick yet (auto-open the current employer)
//   "closed" = user explicitly collapsed everything
//   string   = user explicitly opened this row id
const [openId, setOpenId] = useState<string | "closed" | null>(null);

// Resolve which row is actually open — only ever a row that has a description.
const effectiveOpenId = useMemo(() => {
  if (openId === "closed") return null;
  if (openId !== null) {
    const match = workExperience.find((e) => e._id === openId);
    return match && hasDescription(match) ? openId : null;
  }
  // No explicit pick: default to the current employer if it has a description,
  // else the first entry that has one.
  const current = workExperience.find((e) => e.current === true && hasDescription(e));
  if (current) return current._id;
  const firstWithText = workExperience.find(hasDescription);
  return firstWithText ? firstWithText._id : null;
}, [openId, workExperience]);

const handleToggle = (id: string) => {
  setOpenId((prev) => (prev === id ? "closed" : id));
};
```

- [ ] **Step 4: Pass `open` and `onToggle` into `ExperienceRow`**

Update the map call (added in Task 1) to wire the open state and toggle handler:

```tsx
{workExperience.map((entry, index) => (
  <ExperienceRow
    key={entry._id}
    entry={entry}
    open={effectiveOpenId === entry._id}
    onToggle={() => handleToggle(entry._id)}
    isLast={index === workExperience.length - 1}
  />
))}
```

- [ ] **Step 5: Replace the `ExperienceRow` component with the accordion version**

Replace the **entire** `ExperienceRow` function from Task 1 with this version. The dot markup is unchanged; the body becomes a clickable header (`<button>` when collapsible, plain `<div>` otherwise) plus a collapsible description panel. No background tint is applied to the open row.

```tsx
function ExperienceRow({
  entry,
  open,
  onToggle,
  isLast,
}: {
  entry: WorkExperience;
  open: boolean;
  onToggle: () => void;
  isLast: boolean;
}) {
  const text = getDescriptionText(entry);
  const collapsible = text.length > 0;
  const panelId = `experience-panel-${entry._id}`;

  // Shared meta block (company + badge, role, year range)
  const meta = (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, minWidth: 0 }}>
      {/* Company name + optional "Current" badge */}
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 16,
            fontWeight: 600,
            color: "var(--ms-fg)",
          }}
        >
          {entry.company ?? ""}
        </span>
        {entry.current === true && (
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

      {/* Role title */}
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          fontWeight: 400,
          color: "var(--ms-fg-soft)",
        }}
      >
        {entry.title}
      </div>

      {/* Year range — use || for endYear so empty string falls back to "Present" */}
      <div
        style={{
          marginTop: 2,
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          fontWeight: 400,
          color: "var(--ms-fg-faint)",
        }}
      >
        {entry.duration?.startYear ?? "?"}&ndash;{entry.duration?.endYear || "Present"}
      </div>
    </div>
  );

  // Chevron — collapsible rows only; rotates 90° when open
  const chevron = collapsible ? (
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
  ) : null;

  return (
    <div
      style={{
        position: "relative",
        paddingLeft: 32,
        paddingBottom: isLast ? 0 : 48,
      }}
    >
      {/* Dot — current role: orange 16px pulsing; past role: grey 12px static */}
      {entry.current === true ? (
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

      {/* Header — clickable button when collapsible, plain row otherwise */}
      {collapsible ? (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={`${open ? "Collapse" : "Expand"} ${entry.company ?? "role"}`}
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
          {meta}
          {chevron}
        </button>
      ) : (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
          {meta}
        </div>
      )}

      {/* Collapsible description panel */}
      {collapsible && open && (
        <p
          id={panelId}
          style={{
            margin: 0,
            marginTop: 16,
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-body)",
            fontWeight: 400,
            lineHeight: 1.65,
            color: "var(--ms-fg-soft)",
            maxWidth: 640,
            animation: "ms-fadein var(--anim-fadein)",
          }}
        >
          {text}
        </p>
      )}
    </div>
  );
}
```

> **Caution (known repo gotcha):** `all: "unset"` plus an inline `display` value silently overrides Tailwind responsive visibility utilities (e.g. `ms:hidden`). This is safe here because the button's children use plain inline styles — no responsive show/hide classes inside it — exactly as `WorkSection`'s `ProjectRow` button does.

- [ ] **Step 6: Lint**

Run: `npm run lint`
Expected: PASS. In particular, no `react-hooks/exhaustive-deps` warning on the `effectiveOpenId` `useMemo` (helpers are module-scope) and no `no-unused-vars`.

- [ ] **Step 7: Build (type-check)**

Run: `npm run build`
Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 8: Manual behavior check**

Run: `npm run dev`, open `http://localhost:3000/#experience`. Verify:
- On load, the **current** employer is expanded (description visible); all others are collapsed.
- Clicking a collapsed employer expands it **and** collapses the previously open one (single-open).
- Clicking the open employer collapses it (nothing open).
- The chevron rotates 90° and turns orange when open; the panel fades in.
- The open row has **no background tint**.
- The timeline line, dots, and current-role pulse are unchanged, and the section is now much shorter.
- Resize to mobile width: the timeline is short and each row toggles correctly.
- Education + Community block below is unchanged.

- [ ] **Step 9: Commit**

```bash
git add components/ExperienceSection.tsx
git commit -m "Make Experience timeline rows a single-open accordion"
```

---

## Self-Review

**Spec coverage:**
- Single-open accordion / `openId` state machine → Task 2, Step 3 ✓
- Default-open current employer (fallback: first with description) → Task 2, Step 3 (`effectiveOpenId`) ✓
- `"closed"` collapse-all state → Task 2, Step 3 (`handleToggle`) ✓
- Collapsible vs. static (description-less) rows → Task 2, Step 5 (`collapsible` flag drives button vs div; `hasDescription` filters default-open) ✓
- Header keeps dot + company/role/years/badge, adds right-pinned rotating chevron → Task 2, Step 5 ✓
- Expanded panel below header, `ms-fadein`, indented, unchanged description styling → Task 2, Step 5 ✓
- No background tint → Task 2, Step 5 (no `background` on the row container) ✓
- Accessibility (`aria-expanded`, `aria-controls`, `aria-label`, `.focus-ring`, chevron `aria-hidden`) → Task 2, Step 5 ✓
- Extract `ExperienceRow` → Task 1 ✓
- Only `components/ExperienceSection.tsx` changes; no schema/data work → both tasks ✓
- Out of scope (timeline visuals, Education/Community, tint) left untouched → confirmed in both tasks ✓

**Placeholder scan:** No TBD/TODO/"handle edge cases" — all steps contain complete code. ✓

**Type consistency:** `getDescriptionText`/`hasDescription` names used consistently in parent and row; `ExperienceRow` props (`entry`, `open`, `onToggle`, `isLast`) match the map call in Task 2 Step 4; `panelId` referenced by both `aria-controls` and the panel `id`; `effectiveOpenId === entry._id` compares the same id type set by `handleToggle`. ✓
