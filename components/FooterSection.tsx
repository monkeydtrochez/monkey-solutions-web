"use client";
import { useContext } from "react";
import GlobalContext from "@/app/context/GlobalContext";

const labelStyle: React.CSSProperties = {
  fontSize: 10,
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  color: "var(--ms-fg-faint)",
  marginBottom: 12,
  fontFamily: "var(--font-mono)",
};

export default function FooterSection() {
  const ctx = useContext(GlobalContext);
  const profile = ctx?.profile;

  return (
    <footer
      style={{
        borderTop: "1px solid var(--ms-border)",
        padding: "48px var(--page-px) 32px",
        background: "var(--ms-bg)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--content-max)",
          margin: "0 auto",
        }}
      >
        {/* Giant wordmark */}
        <div
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 800,
            fontSize: "clamp(80px, 16vw, 240px)",
            letterSpacing: "-0.045em",
            lineHeight: 0.85,
            color: "var(--ms-fg)",
            marginBottom: 40,
          }}
        >
          MONKEY
          <br />
          <em
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontWeight: 300,
              color: "var(--ms-orange-text)",
            }}
          >
            solutions.
          </em>
        </div>

        {/* 4-column meta grid */}
        <div
          className="grid grid-cols-2 ms:grid-cols-4"
          style={{
            gap: 32,
            paddingTop: 32,
            borderTop: "1px solid var(--ms-border)",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--ms-fg-soft)",
          }}
        >
          {/* Column 1 — Studio */}
          <div>
            <div style={labelStyle}>STUDIO</div>
            <div style={{ lineHeight: 1.8, color: "var(--ms-fg)" }}>
              <div>Monkey Solutions</div>
              <div>Gothenburg, Sweden</div>
              <div>Org. {profile?.orgNumber ?? "xxxxxx-xxxx"}</div>
            </div>
          </div>

          {/* Column 2 — Navigate */}
          <div>
            <div style={labelStyle}>NAVIGATE</div>
            <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "/ about", href: "#about" },
                { label: "/ work", href: "#work" },
                { label: "/ experience", href: "#experience" },
                { label: "/ skills", href: "#skills" },
                { label: "/ services", href: "#services" },
                { label: "/ contact", href: "#contact" },
              ].map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  style={{
                    color: "var(--ms-fg)",
                    textDecoration: "none",
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                  }}
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>

          {/* Column 3 — Elsewhere */}
          <div>
            <div style={labelStyle}>ELSEWHERE</div>
            <div>
              {[
                { label: "LinkedIn", href: profile?.linkedInUrl ?? "#" },
                { label: "GitHub", href: profile?.githubUrl ?? "#" },
                ...(profile?.readCvUrl
                  ? [{ label: "Read.cv", href: profile.readCvUrl }]
                  : []),
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: "var(--ms-fg)",
                    textDecoration: "none",
                    marginBottom: 8,
                  }}
                >
                  <span>{label}</span>
                  <span style={{ color: "var(--ms-orange-text)" }}>↗</span>
                </a>
              ))}
            </div>
          </div>

          {/* Column 4 — Status */}
          <div>
            <div style={labelStyle}>STATUS</div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  position: "relative",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--ms-orange)",
                  flexShrink: 0,
                }}
              >
                <span
                  aria-hidden="true"
                  className="ms-pulse-anim"
                  style={{
                    position: "absolute",
                    inset: -3,
                    borderRadius: "50%",
                    background: "var(--ms-orange)",
                    opacity: 0.3,
                    animation: "ms-pulse var(--anim-pulse) infinite",
                  }}
                />
              </div>
              <span style={{ color: "var(--ms-fg)" }}>
                {profile?.availabilityStatus ?? "Available"}
              </span>
            </div>
            <div
              style={{
                color: "var(--ms-fg-soft)",
                marginTop: 8,
                lineHeight: 1.6,
              }}
            >
              Usually reply within 24h. / Based in CET (UTC+1).
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div
          style={{
            marginTop: 40,
            paddingTop: 20,
            borderTop: "1px solid var(--ms-border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--ms-fg-faint)",
          }}
        >
          <span>© 2026 Monkey Solutions · All rights reserved</span>
          <span>v2026.04 · Made in Göteborg</span>
        </div>
      </div>
    </footer>
  );
}
