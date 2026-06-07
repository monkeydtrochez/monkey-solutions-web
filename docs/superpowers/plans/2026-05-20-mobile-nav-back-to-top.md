# Mobile Nav Hamburger + Back-to-Top Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a hamburger dropdown nav for mobile (< 760px) and a fixed ghost-square back-to-top button.

**Architecture:** `SiteHeader.tsx` gains hamburger state and a dropdown panel below the header bar. `BackToTop.tsx` is a new isolated client component mounted in `app/layout.tsx` so it persists across all page sections without re-rendering.

**Tech Stack:** Next.js 14 App Router, React 18, Tailwind v4 (custom `ms:` breakpoint at 760px), inline CSS-in-JS style props, `"use client"` components.

---

## File Map

| File | Change |
|------|--------|
| `components/BackToTop.tsx` | **Create** — scroll-aware ghost button, fixed bottom-right |
| `app/layout.tsx` | **Modify** — import + render `<BackToTop />` after `{children}` |
| `components/SiteHeader.tsx` | **Modify** — hamburger state, outside-click/Escape handlers, hamburger button, mobile dropdown panel |

---

## Task 1: Create `components/BackToTop.tsx`

**Files:**
- Create: `components/BackToTop.tsx`

- [ ] **Step 1: Create the file with scroll detection and click handler**

```tsx
"use client";
import { useState, useEffect } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    function handleScroll() {
      setVisible(window.scrollY > 300);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleClick() {
    window.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" });
  }

  return (
    <button
      onClick={handleClick}
      aria-label="Back to top"
      className="focus-ring"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 40,
        width: 38,
        height: 38,
        background: "transparent",
        border: "1px solid var(--ms-orange-text)",
        borderRadius: "var(--radius-md)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: reducedMotion ? undefined : "opacity 0.15s ease",
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
      >
        <polyline
          points="2,9 7,4 12,9"
          stroke="var(--ms-orange-text)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
```

- [ ] **Step 2: Verify the file builds**

```bash
npm run build
```

Expected: exits 0, no TypeScript errors. The component isn't mounted yet so it won't appear in the browser.

- [ ] **Step 3: Commit**

```bash
git add components/BackToTop.tsx
git commit -m "feat: add BackToTop ghost-square button component"
```

---

## Task 2: Mount `BackToTop` in `app/layout.tsx`

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Add the import and render `<BackToTop />` after `{children}`**

Open `app/layout.tsx`. The current body is:

```tsx
<body className="font-sans antialiased">
  <GlobalContextProvider>
    {children}
  </GlobalContextProvider>
</body>
```

Change it to:

```tsx
import BackToTop from "@/components/BackToTop";

// ...inside RootLayout return:
<body className="font-sans antialiased">
  <GlobalContextProvider>
    {children}
  </GlobalContextProvider>
  <BackToTop />
</body>
```

The full updated file:

```tsx
import type { Metadata } from "next";
import "./globals.css";
import { GlobalContextProvider } from "./context/GlobalContext";
import { inter, jetbrainsMono, fraunces } from "./fonts";
import BackToTop from "@/components/BackToTop";

export const metadata: Metadata = {
  title: "Monkey Solutions",
  description: "Developed by Monkey Solutions AB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} ${fraunces.variable}`}
    >
      <head>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("ms_theme");document.documentElement.setAttribute("data-theme",t||"dark")}catch(e){}})()`,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <GlobalContextProvider>
          {children}
        </GlobalContextProvider>
        <BackToTop />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Build and manually verify the button appears**

```bash
npm run dev
```

Open `http://localhost:3000`. Scroll down past the hero section. The ghost orange-outline square should appear in the bottom-right corner. Clicking it should smooth-scroll back to the top. Scrolling back up should hide it.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: mount BackToTop in root layout"
```

---

## Task 3: Hamburger dropdown in `SiteHeader.tsx`

**Files:**
- Modify: `components/SiteHeader.tsx`

This task replaces the entire file. The changes are:

1. Extract nav items to a constant `NAV_ITEMS` (DRY — used in both desktop nav and mobile panel).
2. Add `useState` for `open`, `useRef` for the header element, `useEffect` for Escape + outside-click listeners.
3. Change the `<nav>` from inline `display: "flex"` to `className="hidden ms:flex items-center gap-8 flex-wrap"` so it hides on mobile.
4. Add a hamburger `<button>` that shows only on mobile (`className="ms:hidden"`).
5. Add a mobile dropdown panel below the inner `<div>` that animates open/closed via `maxHeight` + `opacity`.

- [ ] **Step 1: Replace `components/SiteHeader.tsx` with the full updated version**

```tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import StatusDot from "@/components/ui/StatusDot";

const NAV_ITEMS = [
  { num: "01", label: "about", href: "#about" },
  { num: "02", label: "work", href: "#work" },
  { num: "03", label: "experience", href: "#experience" },
  { num: "04", label: "skills", href: "#skills" },
  { num: "05", label: "services", href: "#services" },
  { num: "06", label: "contact", href: "#contact" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function handleOutside(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleOutside);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleOutside);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="header-bg sticky top-0 z-50"
      style={{
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--ms-border)",
      }}
    >
      {/* Main header row */}
      <div
        style={{
          maxWidth: "var(--content-max)",
          margin: "0 auto",
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 32,
        }}
      >
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" });
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 24,
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <span
            aria-hidden="true"
            className="logo-m-text"
            style={{
              width: 28,
              height: 28,
              borderRadius: "var(--radius-md)",
              background: "var(--ms-orange)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-mono)",
              fontWeight: 700,
            }}
          >
            M
          </span>
          <span style={{ display: "inline-flex", flexDirection: "column", lineHeight: 1.05 }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-mono)",
                fontWeight: 700,
                color: "var(--ms-fg)",
                letterSpacing: "0.3px",
              }}
            >
              monkey/solutions
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-label)",
                fontWeight: 400,
                color: "var(--ms-fg-faint)",
              }}
            >
              daniel_trochez.dev
            </span>
          </span>
        </a>

        {/* Desktop nav — hidden below 760px */}
        <nav className="hidden ms:flex items-center gap-8 flex-wrap">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.num}
              href={item.href}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-mono)",
                fontWeight: 400,
                color: "var(--ms-fg-soft)",
                textDecoration: "none",
                letterSpacing: "0.3px",
              }}
            >
              <span style={{ color: "var(--ms-orange-text)" }}>{item.num}</span>
              {item.label}
            </a>
          ))}
          <ThemeToggle />
          <a
            href="#contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "var(--ms-orange)",
              color: "#120a05",
              padding: "8px 16px",
              borderRadius: "var(--radius-md)",
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-mono)",
              fontWeight: 700,
              textDecoration: "none",
              transition: "opacity var(--anim-hover)",
            }}
          >
            <StatusDot />
            Hire me
          </a>
        </nav>

        {/* Hamburger button — visible only below 760px */}
        <button
          className="ms:hidden focus-ring"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav-panel"
          onClick={() => setOpen((v) => !v)}
          style={{ all: "unset", cursor: "pointer", padding: 4, display: "flex", flexDirection: "column", gap: 4 }}
        >
          {open ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <line x1="2" y1="2" x2="14" y2="14" stroke="var(--ms-fg-soft)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="14" y1="2" x2="2" y2="14" stroke="var(--ms-fg-soft)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <line x1="0" y1="3" x2="16" y2="3" stroke="var(--ms-fg-soft)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="0" y1="8" x2="11" y2="8" stroke="var(--ms-fg-soft)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="0" y1="13" x2="14" y2="13" stroke="var(--ms-fg-soft)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown panel — always in DOM, animated via maxHeight + opacity */}
      <div
        id="mobile-nav-panel"
        className="ms:hidden"
        aria-hidden={!open}
        style={{
          overflow: "hidden",
          maxHeight: open ? 500 : 0,
          opacity: open ? 1 : 0,
          transition: reducedMotion ? undefined : "max-height 150ms ease-out, opacity 150ms ease-out",
          borderBottom: open ? "1px solid var(--ms-border)" : undefined,
        }}
      >
        <div style={{ padding: "8px 0" }}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.num}
              href={item.href}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 32px",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-mono)",
                fontWeight: 400,
                color: "var(--ms-fg-soft)",
                textDecoration: "none",
                letterSpacing: "0.3px",
              }}
            >
              <span style={{ color: "var(--ms-orange-text)" }}>{item.num}</span>
              {item.label}
            </a>
          ))}

          {/* Divider */}
          <div style={{ height: 1, background: "var(--ms-border)", margin: "4px 32px" }} />

          {/* Bottom row: ThemeToggle + Hire me */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 32px",
            }}
          >
            <ThemeToggle />
            <a
              href="#contact"
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "var(--ms-orange)",
                color: "#120a05",
                padding: "8px 16px",
                borderRadius: "var(--radius-md)",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-mono)",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              <StatusDot />
              Hire me
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Build and lint**

```bash
npm run build && npm run lint
```

Expected: exits 0 for both, no TypeScript errors, no ESLint warnings.

- [ ] **Step 3: Manual verification checklist**

Start the dev server (`npm run dev`) and open `http://localhost:3000`.

**Desktop (> 760px):**
- [ ] Nav links, ThemeToggle, and Hire me button are visible — no hamburger icon shown.

**Mobile (resize browser to 500px wide):**
- [ ] Nav links are hidden. Hamburger icon (3 lines) visible on the right.
- [ ] Tapping hamburger opens the dropdown panel below the header with all 6 nav links, a divider, ThemeToggle, and Hire me button.
- [ ] Hamburger icon swaps to ✕ (X) when panel is open.
- [ ] Tapping a nav link closes the panel and scrolls to the section.
- [ ] Tapping Hire me closes the panel.
- [ ] Pressing `Escape` closes the panel.
- [ ] Tapping outside the header area closes the panel.
- [ ] Panel animates open (fade + slide) — or snaps if OS has Reduce Motion enabled.

- [ ] **Step 4: Commit**

```bash
git add components/SiteHeader.tsx
git commit -m "feat: hamburger dropdown nav for mobile viewports"
```
