"use client";
import { useState, useRef, useEffect, useCallback } from "react";
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
  const headerRef = useRef<HTMLElement>(null);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
  }, []);

  const handleOutside = useCallback((e: MouseEvent) => {
    if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleOutside);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleOutside);
    };
  }, [handleKey, handleOutside]);

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
            const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            window.scrollTo({ top: 0, behavior: reduced ? "instant" : "smooth" });
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

        {/* Desktop nav — hidden below 1200px */}
        <nav className="hidden desk:flex items-center gap-8">
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
            <StatusDot color="rgba(255,255,255,0.9)" />
            Hire me
          </a>
        </nav>

        {/* Hamburger button — visible only below 1200px */}
        <button
          className="desk:hidden focus-ring"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav-panel"
          onClick={() => setOpen((v) => !v)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, lineHeight: 0 }}
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
        className="desk:hidden mobile-nav-panel"
        aria-hidden={!open}
        style={{
          overflow: "hidden",
          maxHeight: open ? 500 : 0,
          opacity: open ? 1 : 0,
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
