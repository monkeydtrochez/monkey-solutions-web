# Phase 6: Responsive + Accessibility — Research

**Researched:** 2026-05-20
**Domain:** Tailwind CSS v4 responsive utilities, ARIA patterns, CSS animation accessibility
**Confidence:** HIGH — all findings verified against codebase and official sources

---

## Summary

Phase 6 is a polish pass on an already-functional site. All components exist and render correctly at desktop width. The work is: (1) add responsive collapse rules for six two-column layouts, (2) add compact row layout for the WorkSection accordion at < 480px, (3) add focus-visible orange rings to every interactive element that erases browser defaults with `all: "unset"` or `outline: "none"`, and (4) complete two partial accessibility gaps — the `aria-live` pattern on the contact form submit button and the `prefers-reduced-motion` coverage for inline-style animations.

The most consequential technical decision is the 760px breakpoint. Tailwind v4's built-in `md` is 768px — 8px wider than the requirement. The correct approach is to define a custom `--breakpoint-ms` variable in the `@theme` block in `globals.css` rather than stretch `md` or use raw `@media` queries. This gives the planner a reusable `ms:` prefix class that works identically to `md:` but fires at exactly 760px.

**Primary recommendation:** Add `--breakpoint-ms: 760px` and `--breakpoint-compact: 480px` to the `@theme` block in `globals.css`, then use `ms:` and `compact:` prefix utilities in every component that needs responsive behavior. Use a global CSS rule with `.focus-ring` utility class to apply the orange focus ring consistently rather than duplicating inline focus styles.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Responsive grid collapse (RESP-01, RESP-03) | Browser / Client | — | CSS-only media-query behavior; no JS |
| WorkSection compact layout (RESP-02) | Browser / Client | — | CSS grid reconfiguration; same data, different visual |
| Focus ring styles (A11Y-01) | Browser / Client | — | CSS `:focus-visible` pseudo-class; global stylesheet |
| aria-hidden decorative elements (A11Y-02) | Frontend (JSX) | — | Markup attribute, no runtime logic |
| aria-live success announcement (A11Y-03) | Frontend (JSX) | — | React state + `role="status"` live region |
| Reduced-motion animation disable (A11Y-04) | Browser / Client | Frontend (JSX) | CSS `@media` for class-based; `useReducedMotion` hook for inline-style animations |

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| RESP-01 | All 2-column grid layouts collapse to single column at < 760px | Custom `--breakpoint-ms: 760px` in `@theme`; six components identified with inline `gridTemplateColumns` needing Tailwind class conversion |
| RESP-02 | Project accordion rows adapt from 5-column to 2-line compact at < 480px | Custom `--breakpoint-compact: 480px`; `gridTemplateColumns: "56px 1.2fr 1fr 80px 28px"` needs conditional class switching |
| RESP-03 | Hero terminal card stacks below headline on mobile (< 760px) | HeroSection already uses `md:grid-cols-[1.4fr_1fr]`; must change `md:` to `ms:` prefix |
| A11Y-01 | All interactive elements have visible `:focus-visible` orange rings (2px, offset 2px) | Two buttons have `all: "unset"` removing browser focus; inputs have `outline: "none"`; global `.focus-ring` class recommended |
| A11Y-02 | Decorative elements marked `aria-hidden`; icon-only buttons have `aria-label` | Most decorative elements already have `aria-hidden`; gap inventory documented below |
| A11Y-03 | Contact form announces success via `aria-live="polite"` | Current `aria-live` on `<button>` is non-standard; separate `role="status"` live region is the correct pattern |
| A11Y-04 | Pulse dot and cursor-blink animations disabled under `prefers-reduced-motion: reduce` | Current CSS rule covers class-based animations but not inline-style `animation:` on three elements |
</phase_requirements>

---

## Standard Stack

No new packages are needed for this phase. All tools are already in the project.

### Core (already installed)

| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| Tailwind CSS | ^4.3.0 | Responsive breakpoint utilities via `ms:` prefix | Already the project's CSS framework |
| Next.js / React | ^16.0.7 / ^19.2.1 | JSX aria attributes, conditional rendering | Already the project's rendering layer |

### Tailwind v4 Custom Breakpoint Syntax

[VERIFIED: tailwindcss.com/docs/responsive-design]

Tailwind v4 uses CSS-first configuration. Custom breakpoints are defined as `--breakpoint-*` CSS variables inside an `@theme` block:

```css
/* in app/globals.css */
@theme {
  --breakpoint-ms:      760px;
  --breakpoint-compact: 480px;
}
```

This generates `ms:` and `compact:` prefix variants usable in JSX `className` props — identical behavior to built-in `sm:` and `md:`.

**Why not use `md:` (768px)?** The requirement specifies 760px. Using `md:` would make two-column layouts persist 8px longer than specified. The 8px gap is small but the requirement is explicit.

**Why not raw `@media`?** Tailwind utility classes keep responsive logic in markup co-located with structure, matching the project's existing pattern (`grid grid-cols-1 md:grid-cols-2` in AboutSection). Consistency is preferable to mixing two systems.

---

## Architecture Patterns

### System Architecture Diagram

```
User viewport < 760px                    User viewport >= 760px
       |                                        |
       v                                        v
  ms: prefix triggers                   Default layout renders
  ─────────────────────                 ────────────────────────
  grid-cols-1 (single col)              grid-cols-2 (two col)
  TerminalCard below headline           TerminalCard beside headline

User viewport < 480px
       |
       v
  compact: prefix triggers
  ─────────────────────────
  WorkSection rows: 2-line layout
  (number + title on line 1, kind + year on line 2)

Keyboard user focuses interactive element
       |
       v
  :focus-visible ring appears
  ─────────────────────────────────────────────────
  2px orange outline, 2px offset
  Applies to: nav links, hero CTAs, filter pills,
  accordion rows, resume download cards, form inputs,
  form submit button

OS prefers-reduced-motion: reduce
       |
       v
  @media (prefers-reduced-motion: reduce)
  ─────────────────────────────────────────────────
  .animate-pulse { animation: none }     <- StatusDot class-based
  [class*="ms-cursor"] { animation: none } <- TerminalCard class-based
  .ms-pulse-inline { animation: none }  <- NEW: covers inline-style elements
  
  + useReducedMotion() hook check
  in StatusDot, FooterSection, ExperienceSection
  to conditionally omit inline animation property
```

### Recommended Project Structure

No new files needed. All changes are in-place edits to existing component files and `globals.css`.

```
app/
└── globals.css              # Add @theme block + .focus-ring + improved reduced-motion rule
components/
├── HeroSection.tsx          # RESP-01, RESP-03: change md: to ms:, fix trust strip
├── AboutSection.tsx         # RESP-01: already has md:, change to ms:
├── ExperienceSection.tsx    # RESP-01: convert inline grids to Tailwind + A11Y-04
├── ServicesSection.tsx      # RESP-01: convert inline grids to Tailwind
├── ContactSection.tsx       # RESP-01: convert inline grid + A11Y-01 (inputs) + A11Y-03
├── FooterSection.tsx        # RESP-01: 4-col → 2-col → 1-col + A11Y-04
├── WorkSection.tsx          # RESP-02: compact row layout + A11Y-01 (buttons)
└── ui/StatusDot.tsx         # A11Y-04: conditional animation
```

### Pattern 1: Custom Breakpoint Definition (Tailwind v4 CSS-first)

**What:** Define named breakpoints as `--breakpoint-*` variables in `@theme`
**When to use:** When the required pixel value does not match a built-in breakpoint

```css
/* Source: tailwindcss.com/docs/responsive-design */
/* In app/globals.css, add inside or after existing @layer base block */
@theme {
  --breakpoint-ms:      760px;
  --breakpoint-compact: 480px;
}
```

Usage in JSX:
```tsx
/* Replaces inline style gridTemplateColumns switching */
<div className="grid grid-cols-1 ms:grid-cols-2">
```

### Pattern 2: focus-visible Orange Ring (Global Utility Class)

**What:** Single CSS class that applies the 2px orange focus ring to any element
**When to use:** All interactive elements — `<a>`, `<button>`, `<input>`, `<textarea>`

```css
/* Source: tailwindcss.com/docs/hover-focus-and-other-states */
/* In app/globals.css */
@layer utilities {
  .focus-ring {
    /* Removes browser default so the custom ring is the only one shown */
    outline: none;
  }
  .focus-ring:focus-visible {
    outline: 2px solid var(--ms-orange);
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }
}
```

Add `className="focus-ring"` to every interactive element. For buttons that use `all: "unset"`, the global class needs to come after the reset, so use `className="focus-ring"` alongside the inline `style={{ all: "unset", ... }}` — the `className` attribute and `style` attribute are independent, so this works correctly.

**Why not Tailwind utilities (`focus-visible:outline-2`):** The `--ms-orange` token is a hex CSS variable, not a Tailwind color token, so `focus-visible:outline-orange-500` would not match the design system color. A direct CSS rule using `var(--ms-orange)` is the clean solution.

### Pattern 3: aria-live Success Region (Separate Region)

**What:** A visually-hidden, always-present `role="status"` element that receives text on form success
**When to use:** Form state changes that screen readers need to announce

The current implementation puts `aria-live="polite"` on the `<button>` itself. This is non-standard — live regions should be empty at page load and receive text changes, not be the interactive element itself.

```tsx
/* Source: developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions */
/* In ContactSection.tsx — add outside the form, inside the section */
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  style={{
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0,0,0,0)",
    whiteSpace: "nowrap",
    border: 0,
  }}
>
  {sent ? "Message sent — we will be in touch soon." : ""}
</div>
```

Remove `aria-live="polite"` from the `<button>` element.

### Pattern 4: prefers-reduced-motion Coverage (Hybrid Approach)

**What:** CSS rule for class-based animations + React hook for inline-style animations
**When to use:** Any animation that is decorative (pulse, cursor blink)

The current CSS rule in `globals.css` covers:
- `StatusDot` class-based pulse (`className="animate-pulse"`) ✓
- `TerminalCard` cursor class (`className="ms-cursor"`) ✓

It does NOT cover inline-style `animation:` properties on:
- `StatusDot` inner span (line 26) — inline `animation: "ms-pulse..."`
- `FooterSection` status dot (line 171) — inline `animation: "ms-pulse..."`
- `ExperienceSection` current-role dot (line 124) — inline `animation: "ms-pulse..."`
- `TerminalCard` cursor span (line 138) — inline `animation: "ms-cursor..."` (partially covered by class)

**CSS-only fix** (preferred, no new deps):

```css
/* Extend the existing rule in globals.css to cover animation: none broadly */
@media (prefers-reduced-motion: reduce) {
  .animate-pulse,
  [class*="ms-cursor"],
  .ms-pulse-anim {
    animation: none !important;
  }
}
```

Then add `className="ms-pulse-anim"` to the three elements with inline `animation: "ms-pulse..."`. This avoids adding a `useReducedMotion` hook dependency. The `!important` flag is acceptable here because `animation:` in inline style has higher specificity than a class rule, but `!important` in a media query is the standard override pattern for motion reduction.

**Alternative (hook-based):** Use `window.matchMedia('(prefers-reduced-motion: reduce)')` read once at component mount. Only needed if CSS-only approach proves insufficient.

### Pattern 5: WorkSection Compact Row Layout (RESP-02)

**What:** Two-line layout for accordion rows at < 480px replacing the 5-column grid
**Architecture decision:** Conditional class switching on the same `<button>` element — NOT a separate component

The current row button:
```tsx
style={{
  gridTemplateColumns: "56px 1.2fr 1fr 80px 28px",
  gap: 20,
}}
```

The compact layout eliminates the explicit number column and year column, stacking them into 2 lines:
- **Line 1:** Project title (full width)
- **Line 2:** Kind + Year (flex row)

Implementation: Switch the `button` element from `display: grid` inline style to a Tailwind class that toggles between grid and flex column. Since the style uses `all: "unset"` which is inline, the responsive toggle needs to be done via CSS class override or by adding a wrapper element with Tailwind classes.

**Recommended approach:** Add a wrapping `<span>` inside the button (since `all: "unset"` is on the button), or convert the button's display to a Tailwind class that can be made responsive. The cleanest approach is:

```tsx
<button
  style={{ all: "unset", cursor: "pointer", width: "100%", boxSizing: "border-box" }}
  className="focus-ring"
>
  {/* Desktop: 5-column grid */}
  <span className="hidden compact:flex flex-col gap-1 w-full py-6 px-1">
    <span>{p.title}</span>
    <span style={{ color: "var(--ms-fg-soft)", fontSize: "var(--text-mono)" }}>
      {p.kind} · {year}
    </span>
  </span>
  <span
    className="compact:hidden"
    style={{
      padding: "24px 4px",
      display: "grid",
      gridTemplateColumns: "56px 1.2fr 1fr 80px 28px",
      gap: 20,
    }}
  >
    {/* existing 5-column content */}
  </span>
</button>
```

Note: `hidden compact:flex` shows the compact view at < 480px; `compact:hidden` hides the desktop view at < 480px. This requires the `compact:` prefix to work as a "max-width" variant. Tailwind v4 responsive variants are min-width by default. For max-width behavior, use:

```css
/* In globals.css */
@custom-variant compact (@media (width < 480px));
@custom-variant ms (@media (width < 760px));
```

This makes `compact:` and `ms:` fire when viewport is NARROWER than the threshold (mobile-first inverted — show/hide for mobile), which is what RESP-01 and RESP-02 require since the default layout is desktop.

**Critical clarification:** Requirements state "collapse at viewports narrower than 760px" — this means the default layout is the wide (multi-column) layout, and we add narrow-viewport overrides. This is NOT standard mobile-first Tailwind (where `sm:` means "at sm and wider"). The project uses max-width semantics for these collapse requirements. Options:

1. **`@custom-variant` approach (recommended):** Define `ms:` and `compact:` as max-width variants. Clean, matches how the existing `md:grid-cols-2` in `AboutSection` is used (where `md:` means "at 768px and wider" — this IS min-width, meaning the base is single-column and expands). Wait — check: `AboutSection` has `grid grid-cols-1 md:grid-cols-2`. This IS mobile-first: base is 1 col, `md:` adds 2 cols at >= 768px. This is correct.

2. **The RESP-01 requirements actually match mobile-first Tailwind:** Base class = 1 column (mobile). `ms:grid-cols-2` = 2 columns at >= 760px. This means `ms:` should be a **min-width** breakpoint, not max-width. The `@theme { --breakpoint-ms: 760px }` approach gives exactly this.

**Resolution:** Use min-width `@theme` breakpoints (standard Tailwind behavior). `ms:` fires at >= 760px. `compact:` fires at >= 480px — but for RESP-02, the compact layout is needed BELOW 480px, meaning the default (base) class should be the compact layout and `compact:` should add the 5-column grid. This requires inverting RESP-02: start with compact, scale up to 5-column at >= 480px.

### Anti-Patterns to Avoid

- **Putting `aria-live` on interactive elements:** ARIA live regions must be non-interactive containers. A `<button>` should not have `aria-live`.
- **Using `@media (max-width)` raw queries alongside Tailwind utilities:** Creates two parallel systems. Prefer `@custom-variant` or `@theme` breakpoints so all responsive logic uses the same utility class syntax.
- **Setting `animation: none` in inline style to handle reduced-motion:** Cannot be overridden by CSS media queries. Use CSS class names for animation so media queries can override them.
- **Forgetting `box-sizing: border-box` when removing `all: "unset"`:** The WorkSection buttons use `all: "unset"` which resets `box-sizing`. Any wrapper that replaces this must restore it.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Custom breakpoint at 760px | Raw `@media (max-width: 760px)` rules | `@theme { --breakpoint-ms: 760px }` | Integrates with Tailwind class system |
| Focus ring styles | Per-element inline focus handlers | `.focus-ring` utility class in globals.css | Single source of truth; easy to update globally |
| Reduced-motion detection | `window.matchMedia` hook in every component | `@media (prefers-reduced-motion: reduce)` CSS rule | CSS is authoritative; no JS needed for CSS animations |

---

## Component-by-Component Responsive Change Map

### RESP-01 Targets (collapse to 1 col at < 760px)

All use inline `style` with `gridTemplateColumns`. The approach is:
1. Remove `gridTemplateColumns` from inline style
2. Add Tailwind `className` with base (mobile) single-col and `ms:` (desktop) multi-col

| Component | Current Layout | Mobile Layout | Notes |
|-----------|---------------|---------------|-------|
| HeroSection (headline + terminal) | `md:grid-cols-[1.4fr_1fr]` | Already has `grid-cols-1` base | Change `md:` → `ms:` |
| HeroSection trust strip | `md:grid-cols-4` | Already has `grid-cols-2` base | Change `md:` → `ms:` |
| AboutSection (text + portrait) | `md:grid-cols-2` | Already has `grid-cols-1` base | Change `md:` → `ms:` |
| ExperienceSection (education + community) | Inline `1fr 1fr` | `grid-cols-1` | Convert to className |
| ExperienceSection (timeline entry: meta + desc) | Inline `220px 1fr` | `grid-cols-1` | Convert to className; `220px` must become `auto` |
| ServicesSection (header: title + subtitle) | Inline `1fr 1fr` | `grid-cols-1` | Convert to className |
| ServicesSection (3 service cards) | Inline `repeat(3, 1fr)` | `grid-cols-1` | Convert to className; consider `ms:grid-cols-3` |
| ContactSection (links + form) | Inline `1fr 1.1fr` | `grid-cols-1` | Convert to className |
| FooterSection (4-col meta grid) | Inline `repeat(4, 1fr)` | `grid-cols-2 ms:grid-cols-4` | 4 cols → 2 cols (mobile) → 4 (desktop) |

**Implementation pattern for each:**
```tsx
/* Before */
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }}>

/* After */
<div className="grid grid-cols-1 ms:grid-cols-2" style={{ gap: 64 }}>
```

### RESP-02 Target (WorkSection compact layout)

Current `ProjectRow` button: `gridTemplateColumns: "56px 1.2fr 1fr 80px 28px"` (5 columns).

Mobile compact (< 480px) layout: title on line 1, kind + year on line 2, chevron remains.

Implementation: Convert to mobile-first. Base class = compact flex layout. `compact:` prefix = 5-column grid.

```tsx
/* 
  Base (mobile): flex column 
  compact: (>= 480px): 5-column grid
*/
<button className="compact:grid compact:grid-cols-[56px_1.2fr_1fr_80px_28px] flex flex-col gap-1 focus-ring" ...>
```

The `compact:` prefix needs the min-width `@theme` definition:
```css
@theme { --breakpoint-compact: 480px; }
```

On mobile, the row elements reflow: hide the `56px` number column and `80px` year column from the flex row, instead embedding number in a subtitle row.

### RESP-03 Target (HeroSection TerminalCard)

Already handled by `grid grid-cols-1 md:grid-cols-[1.4fr_1fr]` in HeroSection line 79. The only change: replace `md:` with `ms:` so the terminal card stacks at 760px instead of 768px.

### Mobile Header

The header (`SiteHeader.tsx`) currently has `flexWrap: "wrap"` and `overflow: "hidden"` on the nav. At narrow viewports, nav links wrap and some may be clipped by `overflow: hidden`. The requirements do NOT specify a hamburger menu. The current behavior (wrapping + hidden overflow) is not great but falls outside the phase requirements. **No hamburger menu work is in scope for this phase.** However, `overflow: hidden` on the nav causes nav links to disappear on very narrow viewports — this is a visual bug. Adding a minimum note: remove `overflow: hidden` from the nav to at least show wrapped links. But this is outside the stated RESP requirements. Document as an open question.

---

## aria-hidden Inventory

### Already Correct (no changes needed)

| Element | Component | Status |
|---------|-----------|--------|
| Grid background, orange glow | HeroSection lines 42, 58 | `aria-hidden="true"` present |
| Decorative dash/line | AboutSection line 54 | `aria-hidden="true"` present |
| Offset border, sticker badge | AboutSection lines 173, 228 | `aria-hidden="true"` present |
| Traffic light dots | ContactSection lines 510, 520, 530 | `aria-hidden="true"` present (individual spans) |
| Traffic light dots | TerminalCard line 25 | `aria-hidden="true"` on container |
| Cursor blink span | TerminalCard line 134 | `aria-hidden="true"` present |
| Giant service numbers | ServicesSection line 135 | `aria-hidden="true"` present |
| Kicker dashes (all sections) | Multiple | `aria-hidden="true"` present |
| Timeline line, dots | ExperienceSection lines 82, 114, 129 | `aria-hidden="true"` present |
| "M" logo mark | SiteHeader line 39 | `aria-hidden="true"` present |

### Gaps to Fix (A11Y-02)

| Element | Component | Issue |
|---------|-----------|-------|
| Logo anchor missing accessible name | SiteHeader | The anchor wraps `aria-hidden="true"` (the "M" badge) + two visible text spans ("monkey/solutions", "daniel_trochez.dev"). The text spans are NOT aria-hidden so they ARE accessible. No fix needed — the anchor text is readable. |
| FooterSection status dot wrapper | FooterSection line 153 | The outer `<div>` wrapping the dot has `aria-hidden="true"`. The inner pulse `<span>` (line 164) also has `aria-hidden="true"`. This is correct — both decorative. No fix needed. |
| Background glow (ContactSection) | ContactSection line 91 | `aria-hidden="true"` present. Correct. |

**Conclusion:** A11Y-02 for `aria-hidden` is already complete. No new `aria-hidden` attributes are needed.

### Icon-only button gap (A11Y-02)

| Element | Component | Has aria-label? |
|---------|-----------|-----------------|
| Dark/Light theme buttons | ThemeToggle lines 87, 96 | Yes — `aria-label="Switch to dark theme"` / `aria-label="Switch to light theme"` |
| External project link (SVG only) | WorkSection line 372 | Yes — `aria-label={"Visit ${p.title} site (opens in new tab)"}` |
| Filter pills (has text) | WorkSection line 115 | Text content visible; no label needed |
| ProjectRow toggle button (has implied text via title) | WorkSection line 218 | No text label. Has `aria-expanded` and `aria-controls`. Add `aria-label` to describe toggle action. |

**Gap:** ProjectRow toggle `<button>` has no accessible text label. It shows a "→" character (aria-hidden) and relies on `aria-expanded`. Screen readers would announce it as "button" without context. Add `aria-label={open ? 'Collapse ${p.title}' : 'Expand ${p.title}'}`.

---

## A11Y-03: Contact Form aria-live Analysis

### Current State

```tsx
<button
  type="submit"
  aria-live="polite"   // <- WRONG PLACEMENT
  ...
>
  {sent ? "✓ Message sent — talk soon!" : "$ send_message →"}
</button>
```

`aria-live` on a `<button>` is non-standard. The text change inside the button (from "$ send_message" to "✓ Message sent") may or may not be announced by screen readers depending on implementation. NVDA and VoiceOver behavior is inconsistent here.

### Correct Pattern

[CITED: developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions]

Add a separate visually-hidden live region outside the form. The region is present from page load (empty) and receives text when `sent` becomes `true`.

```tsx
{/* Outside the <form> element, inside <section id="contact"> */}
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  {sent ? "Message sent — I will be in touch soon." : ""}
</div>
```

Add `sr-only` as a utility class in `globals.css`:
```css
@layer utilities {
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
}
```

Remove `aria-live="polite"` from the `<button>`.

---

## A11Y-04: prefers-reduced-motion Analysis

### Current Rule

```css
/* app/globals.css line 160 */
@media (prefers-reduced-motion: reduce) {
  .animate-pulse, [class*="ms-cursor"] { animation: none; }
}
```

### Coverage Gaps

| Animation | Location | Applied via | Covered? | Fix |
|-----------|----------|-------------|----------|-----|
| `ms-pulse` ring | StatusDot line 26 | Inline `style={{ animation: "ms-pulse..." }}` | NO | Add `className="ms-pulse-anim"` |
| `ms-pulse` ring | FooterSection line 171 | Inline `style={{ animation: "ms-pulse..." }}` | NO | Add `className="ms-pulse-anim"` |
| `ms-pulse` dot | ExperienceSection line 124 | Inline `style={{ animation: "ms-pulse..." }}` | NO | Add `className="ms-pulse-anim"` |
| `ms-cursor` | TerminalCard line 138 | Inline `style={{ animation: "ms-cursor..." }}` + `className="ms-cursor"` | Partial | Class rule fires. Inline style overrides it. Add `className="ms-cursor-anim"` |
| `animate-pulse` | StatusDot line 19 | `className="animate-pulse"` | YES | No change |
| `ms-cursor` | TerminalCard line 133 | `className="ms-cursor"` | YES | No change |

### Fix

1. Add `className="ms-pulse-anim"` to the three inline-pulse elements.
2. Extend the CSS rule:

```css
@media (prefers-reduced-motion: reduce) {
  .animate-pulse,
  [class*="ms-cursor"],
  .ms-cursor-anim,
  .ms-pulse-anim {
    animation: none !important;
  }
}
```

The `!important` is required to override inline `style` animation values from JSX, which have higher CSS specificity than class selectors.

---

## Common Pitfalls

### Pitfall 1: Tailwind Breakpoints Are Min-Width by Default

**What goes wrong:** Developer expects `ms:grid-cols-2` to mean "use 2 columns only below 760px" and sets the base class to `grid-cols-2`, resulting in mobile showing 2 columns.
**Why it happens:** Tailwind's responsive prefixes mean "at this breakpoint and wider."
**How to avoid:** Set the base (mobile) layout as the default class; the `ms:` prefix adds the wider-viewport layout.
**Example:** `grid grid-cols-1 ms:grid-cols-2` — 1 column on mobile, 2 on >= 760px.

### Pitfall 2: `all: "unset"` Removes focus-visible Too

**What goes wrong:** Filter pill buttons and accordion toggle buttons have `all: "unset"` which zeros out browser default focus styles. Adding `className="focus-ring"` after the `style` prop has no effect if the class adds `outline` but the inline style took precedence.
**Why it happens:** `style` prop in React maps to inline styles which have higher CSS specificity than class selectors.
**How to avoid:** The `focus-ring` class uses `:focus-visible` pseudo-class on the element itself. Inline styles do not apply to pseudo-classes, only to the element's base styles. So `style={{ all: "unset" }}` does NOT remove `:focus-visible` styles defined in a CSS class. The class approach works correctly.

### Pitfall 3: Live Region Must Pre-exist in DOM

**What goes wrong:** A live region element is conditionally rendered (only shown when `sent === true`), so the screen reader never registers it as a live region. No announcement is made.
**Why it happens:** Screen readers register live regions on page load. A region that appears after load may not be recognized.
**How to avoid:** Render the `role="status"` element unconditionally from page load with empty content. Update the text content via React state, not by mounting/unmounting the element.

### Pitfall 4: `@theme` Block Placement in Tailwind v4

**What goes wrong:** The `@theme` block is placed inside an `@layer` rule, which causes Tailwind to ignore the `--breakpoint-*` variables.
**Why it happens:** `@theme` is a top-level Tailwind directive, not compatible with `@layer`.
**How to avoid:** Place `@theme { ... }` at the top level of `globals.css`, outside any `@layer` block.

### Pitfall 5: ExperienceSection Fixed-Width Meta Column

**What goes wrong:** The timeline entry uses `gridTemplateColumns: "220px 1fr"`. On mobile (< 760px), the 220px column is fixed and can cause text overflow or layout distortion.
**Why it happens:** Inline style with fixed pixel width has no media query.
**How to avoid:** Convert to `className="grid grid-cols-1 ms:grid-cols-[220px_1fr]"`. On mobile, the meta block stacks above the description.

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| Tailwind v3 `screens` key in `tailwind.config.js` | Tailwind v4 `@theme { --breakpoint-* }` in CSS | CSS-first; no rebuild needed to add breakpoints |
| `@media (prefers-reduced-motion)` only for class-based | Hybrid: CSS class + `!important` override for inline animations | Handles React JSX inline style animation values |
| `aria-live` on interactive elements | Separate `role="status"` live region | Consistent screen reader announcement |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `@theme { --breakpoint-ms: 760px }` generates a working `ms:` prefix in Tailwind v4 | Standard Stack | If wrong, use `@custom-variant ms (@media (width >= 760px))` as fallback |
| A2 | `!important` in `@media (prefers-reduced-motion)` overrides inline `animation:` set via React `style` prop | A11Y-04 section | If wrong, must use a React `useReducedMotion` hook reading `window.matchMedia` |
| A3 | ProjectRow `<button>` with `all: "unset"` and `className="focus-ring"` shows the focus ring because `:focus-visible` is a pseudo-class not affected by inline style reset | A11Y-01 | If wrong, must use CSS `[class~="focus-ring"]:focus-visible` with `!important` |

**If A1 fails fallback:**
```css
@custom-variant ms (@media (width >= 760px));
@custom-variant compact (@media (width >= 480px));
```

---

## Open Questions

1. **Mobile header nav overflow**
   - What we know: `SiteHeader.tsx` nav has `overflow: "hidden"` which clips wrapped nav links at narrow widths
   - What's unclear: Is this intentional (hide overflow) or a bug from the initial implementation?
   - Recommendation: Remove `overflow: hidden` from nav to prevent links being clipped, but do not implement a hamburger menu (not in requirements). Keep as a note for the planner.

2. **ContactSection on mobile: form ordering**
   - What we know: The two-column contact layout stacks to single column (form below links). The form is the RIGHT column — on mobile it renders below the direct links.
   - What's unclear: Should the form come first on mobile (above the links) for conversion priority?
   - Recommendation: Requirements say "collapse to single column" with no column order specification. Keep DOM order (links first, form second). Flag for user decision if desired.

3. **ServicesSection: 3-column cards at mobile**
   - What we know: 3 cards in `repeat(3, 1fr)`. At < 760px they should go to 1 column per RESP-01.
   - What's unclear: Should they be 1 column or perhaps a 2+1 layout at medium widths (e.g., 480px-760px)?
   - Recommendation: Go to `grid-cols-1 ms:grid-cols-3`. Skip a middle breakpoint unless the user specifies one.

---

## Environment Availability

Step 2.6: SKIPPED — this phase is purely code/CSS edits with no external tool dependencies. Tailwind and Next.js are already installed and confirmed working.

---

## Validation Architecture

No test suite is configured for this project (`CLAUDE.md` explicitly states "There are no tests configured"). The validation approach is manual visual inspection.

**Per-task verification commands:**

```bash
npm run build    # Confirm no TypeScript or ESLint errors
npm run lint     # Confirm ESLint passes (--max-warnings 0)
npm run dev      # Visual inspection at localhost:3000
```

**Manual verification checklist for each requirement:**

| Req | Manual Check |
|-----|-------------|
| RESP-01 | Resize browser to 750px; verify all two-column grids are single-column |
| RESP-02 | Resize browser to 470px; expand a project row; verify 2-line compact layout |
| RESP-03 | Resize browser to 750px; verify terminal card is below headline |
| A11Y-01 | Tab through the page; verify orange outline appears on every interactive element |
| A11Y-02 | No changes needed (already complete per audit) |
| A11Y-03 | Submit form; use screen reader (or check ARIA markup) to verify announcement |
| A11Y-04 | Enable reduced-motion in OS settings; reload; verify no pulsing or blinking |

---

## Security Domain

No security-relevant changes in this phase. All changes are visual/CSS and ARIA markup. No new network requests, authentication, or data handling. Security section not applicable.

---

## Sources

### Primary (HIGH confidence)

- [tailwindcss.com/docs/responsive-design](https://tailwindcss.com/docs/responsive-design) — Default breakpoints (`md` = 48rem / 768px), `@theme { --breakpoint-* }` custom breakpoint syntax
- [tailwindcss.com/docs/hover-focus-and-other-states](https://tailwindcss.com/docs/hover-focus-and-other-states) — `focus-visible:` variant, `outline` utility pattern
- [developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions) — `aria-live="polite"`, `role="status"`, live region must be present at page load
- Codebase direct read — all component files, globals.css, tailwind.config.ts, package.json

### Secondary (MEDIUM confidence)

- [github.com/tailwindlabs/tailwindcss/discussions/16347](https://github.com/tailwindlabs/tailwindcss/discussions/16347) — Community confirmation that `@theme { --breakpoint-custom: 760px }` works in v4
- [bordermedia.org/blog/tailwind-css-4-breakpoint-override](https://bordermedia.org/blog/tailwind-css-4-breakpoint-override) — Tailwind v4 breakpoint override patterns

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Tailwind v4 verified from official docs; no new packages
- Breakpoint strategy: HIGH — Verified against official docs and community discussion
- Focus ring pattern: HIGH — Verified from official Tailwind hover/focus docs
- aria-live recommendation: HIGH — MDN authoritative source
- Reduced-motion coverage gap: HIGH — Direct codebase audit
- aria-hidden inventory: HIGH — Direct codebase audit of every component

**Research date:** 2026-05-20
**Valid until:** 2026-06-20 (30 days; stable CSS/ARIA standards, slow-moving)

---

## RESEARCH COMPLETE
