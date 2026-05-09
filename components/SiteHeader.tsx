"use client";
import { ThemeToggle } from "@/components/ThemeToggle";
import StatusDot from "@/components/ui/StatusDot";

export default function SiteHeader() {
  return (
    <header
      className="header-bg sticky top-0 z-50"
      style={{
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--ms-border)",
      }}
    >
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
          href="#top"
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
          <span
            style={{
              display: "inline-flex",
              flexDirection: "column",
              lineHeight: 1.05,
            }}
          >
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

        {/* Right cluster: nav + theme toggle + hire CTA */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
            flexWrap: "wrap",
            overflow: "hidden",
          }}
        >
          {[
            { num: "01", label: "about", href: "#about" },
            { num: "02", label: "work", href: "#work" },
            { num: "03", label: "experience", href: "#experience" },
            { num: "04", label: "skills", href: "#skills" },
            { num: "05", label: "contact", href: "#contact" },
          ].map((item) => (
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
              <span style={{ color: "var(--ms-orange-text)" }}>
                {item.num}
              </span>
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
      </div>
    </header>
  );
}
