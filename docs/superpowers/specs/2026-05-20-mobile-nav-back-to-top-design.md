# Design Spec: Mobile Hamburger Nav + Back-to-Top Button

**Date:** 2026-05-20
**Status:** Approved

---

## Overview

Two independent UI additions:

1. **Mobile hamburger dropdown nav** — collapses the site navigation into a hamburger icon below the `ms:` breakpoint (760px), opening a dropdown panel when tapped.
2. **Back-to-top button** — a fixed ghost-square button in the bottom-right corner that appears after the user scrolls 300px and smooth-scrolls to the top when clicked.

---

## Feature 1: Mobile Hamburger Dropdown Nav

### Trigger breakpoint

Hidden below `760px` (`ms:` custom breakpoint). Above 760px, the existing nav renders unchanged.

### Header layout at < 760px

- Logo (M icon + "monkey/solutions" wordmark) remains visible on the left — unchanged.
- All nav links, ThemeToggle, and Hire me button are hidden.
- A hamburger icon (3 horizontal lines, 16px wide) appears on the right in their place.
- The hamburger button is a plain `<button>` with `aria-label="Open menu"` / `"Close menu"` (toggled), `aria-expanded` attribute, and `aria-controls` pointing to the panel id. Uses `.focus-ring` for keyboard accessibility.

### Dropdown panel (open state)

- Renders immediately below the header's bottom border — not overlapping it.
- Same background treatment as the header: `header-bg` class + `backdropFilter: blur(12px)`.
- `borderBottom: 1px solid var(--ms-border)`.
- Full viewport width.
- `z-index` matches the header (`z-50`).
- Contents, top to bottom:
  1. **Nav links** — same 6 items as desktop (`01 about` … `06 contact`), mono font, orange number prefix, `color: var(--ms-fg-soft)`. Each is a full-width link with `padding: 12px 32px`. Tapping a link closes the menu and follows the anchor.
  2. **Divider** — `1px solid var(--ms-border)`, `margin: 4px 32px`.
  3. **Bottom row** — `ThemeToggle` on the left, Hire me `<a>` on the right, same orange pill style as desktop. Row padding `12px 32px`.

### Close behaviour

The menu closes on any of:
- Tapping a nav link or the Hire me CTA
- Pressing `Escape`
- Clicking/tapping outside the header + panel area (`mousedown` listener on `document`)
- Navigating away (next route mount)

When the menu opens, body scroll is **not** locked — the dropdown is compact enough that locking is unnecessary.

### Animation

- **Open:** `opacity 0→1` + `translateY(-6px)→translateY(0)`, 150ms ease-out.
- **Close:** reverse, 150ms ease-in.
- **`prefers-reduced-motion: reduce`:** animation disabled — instant show/hide via display toggle.

### Implementation

- File: `components/SiteHeader.tsx` (already `"use client"`).
- Add `const [open, setOpen] = useState(false)`.
- Add `useEffect` for:
  - `keydown` → close on Escape
  - `mousedown` → close on outside click (ref on the header element)
- Hamburger button and dropdown panel rendered conditionally based on a CSS class / Tailwind responsive utilities — hamburger visible only `ms:hidden`; desktop nav visible only `hidden ms:flex`.
- The dropdown panel itself is always in the DOM when `open === true`, rendered via a fragment below the main header `<div>`.

---

## Feature 2: Back-to-Top Button

### Appearance

- **Shape:** 38×38px square.
- **Background:** transparent (ghost).
- **Border:** `1px solid var(--ms-orange-text)`.
- **Border-radius:** `var(--radius-md)` (6px) — matches the design system.
- **Icon:** Chevron-up SVG (`↑`), `stroke: var(--ms-orange-text)`, 14×14px, stroke-width 2.5, centered.
- **Hover:** `opacity` 0.7 → 1 transition (`var(--anim-hover)`). No fill change — stays ghost.
- **Focus:** `.focus-ring` class for keyboard accessibility.
- **`aria-label`:** `"Back to top"`.

### Position

- `position: fixed`, `bottom: 24px`, `right: 24px`.
- `z-index: 40` (below the sticky header at `z-50`, above page content).

### Visibility

- Hidden on load (`opacity: 0`, `pointerEvents: none`).
- Becomes visible (`opacity: 1`, `pointerEvents: auto`) after `window.scrollY > 300`.
- Fade transition: `opacity` 150ms ease.
- `prefers-reduced-motion: reduce`: instant opacity change.

### Behaviour

- `onClick`: `window.scrollTo({ top: 0, behavior: 'smooth' })`.
- `prefers-reduced-motion`: uses `behavior: 'instant'` instead of `'smooth'`.

### Implementation

- New file: `components/BackToTop.tsx` — small `"use client"` component.
- `useEffect` attaches a `scroll` passive event listener; updates a `visible` boolean state.
- Reads `prefers-reduced-motion` via `window.matchMedia('(prefers-reduced-motion: reduce)').matches` at click time.
- Mounted in `app/layout.tsx` inside `<body>`, after `{children}`, so it persists across all pages without re-rendering.

---

## Files Changed

| File | Change |
|------|--------|
| `components/SiteHeader.tsx` | Add hamburger state, open/close logic, hamburger button, dropdown panel |
| `components/BackToTop.tsx` | New file — back-to-top button component |
| `app/layout.tsx` | Import and render `<BackToTop />` |

---

## Accessibility

- Hamburger button: `aria-label`, `aria-expanded`, `aria-controls`, `.focus-ring`.
- Dropdown links: native `<a>` elements — no additional ARIA needed.
- Back-to-top: `aria-label="Back to top"`, `.focus-ring`.
- All animations respect `prefers-reduced-motion`.

---

## Out of Scope

- Active link highlighting (scroll-spy) — not requested.
- Animated hamburger → X morphing icon — plain icon swap is sufficient.
- Body scroll lock on menu open — panel is compact, not needed.
- Mobile breakpoint change — stays at 760px (`ms:`) as established in Phase 6.
