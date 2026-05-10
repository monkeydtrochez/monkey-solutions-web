"use client";
import { useContext } from "react";
import GlobalContext from "@/app/context/GlobalContext";
import StatusDot from "@/components/ui/StatusDot";
import TerminalCard from "@/components/TerminalCard";

type TrustStat = {
  number: string;
  accent?: "prefix" | "suffix";
  accentChar?: string;
  label: string;
  sub?: string;
};

const TRUST_STATS: TrustStat[] = [
  { number: "08", accent: "suffix", accentChar: "+", label: "years shipping" },
  { number: "40", accent: "suffix", accentChar: "+", label: "projects delivered" },
  { number: "07", label: "languages in stack" },
  { number: "100", accent: "suffix", accentChar: "%", label: "projects shipped", sub: "(on time)" },
];

export default function HeroSection() {
  const ctx = useContext(GlobalContext);
  const profile = ctx?.profile ?? null;
  const heroBio = profile?.heroBio?.trim();

  return (
    <section
      id="top"
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "calc(100vh - 61px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "64px 32px",
        background: "var(--ms-bg)",
      }}
    >
      {/* Decorative grid background */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, var(--ms-border) 0 1px, transparent 1px 64px), repeating-linear-gradient(90deg, var(--ms-border) 0 1px, transparent 1px 64px)",
          maskImage:
            "radial-gradient(ellipse at 70% 40%, #000 20%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 70% 40%, #000 20%, transparent 70%)",
          opacity: 0.5,
          pointerEvents: "none",
        }}
      />
      {/* Decorative orange glow blob */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: "-10%",
          top: "10%",
          width: 520,
          height: 520,
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--ms-orange) 13%, transparent) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: "var(--content-max)",
          margin: "0 auto",
        }}
      >
        <div
          className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr]"
          style={{
            gap: 64,
            alignItems: "end",
          }}
        >
          {/* Left column */}
          <div>
            {/* Status row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                marginBottom: 32,
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-mono)",
                fontWeight: 400,
                color: "var(--ms-fg-soft)",
              }}
            >
              <StatusDot />
              <span style={{ color: "var(--ms-orange-text)", fontWeight: 700 }}>
                AVAILABLE
              </span>
              <span>· freelance projects, Q2 2026 →</span>
            </div>

            {/* H1 */}
            <h1
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "var(--text-hero)",
                fontWeight: 400,
                lineHeight: "var(--lh-tight)",
                letterSpacing: "var(--tracking-tight)",
                color: "var(--ms-fg)",
                margin: 0,
              }}
            >
              Software that <span style={{ fontWeight: 700 }}>ships</span>{" "}
              <em
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: "var(--ms-orange-text)",
                }}
              >
                &amp;
              </em>{" "}
              <span style={{ fontWeight: 700 }}>lasts.</span>
            </h1>

            {/* Lede paragraph (D-02: render only if heroBio truthy) */}
            {heroBio && (
              <p
                style={{
                  marginTop: 32,
                  maxWidth: 520,
                  fontFamily: "var(--font-sans)",
                  fontSize: "var(--text-body-lg)",
                  fontWeight: 400,
                  lineHeight: 1.55,
                  color: "var(--ms-fg-soft)",
                }}
              >
                {heroBio}
              </p>
            )}

            {/* CTA row */}
            <div
              style={{
                marginTop: 32,
                display: "flex",
                gap: 32,
                flexWrap: "wrap",
              }}
            >
              <a
                href="#contact"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "var(--ms-orange)",
                  color: "#120a05",
                  padding: "16px 24px",
                  borderRadius: "var(--radius-lg)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-mono)",
                  fontWeight: 700,
                  textDecoration: "none",
                  transition: "opacity var(--anim-hover)",
                }}
              >
                Start a project →
              </a>
              <a
                href="#work"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  border: "1px solid var(--ms-border-strong)",
                  color: "var(--ms-fg)",
                  padding: "16px 24px",
                  borderRadius: "var(--radius-lg)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-mono)",
                  fontWeight: 700,
                  textDecoration: "none",
                  transition: "border-color var(--anim-hover)",
                }}
              >
                View work{" "}
                <span style={{ color: "var(--ms-orange-text)" }}>↓</span>
              </a>
            </div>
          </div>

          {/* Right column */}
          <div>
            <TerminalCard />
          </div>
        </div>

        {/* Trust strip */}
        <div
          className="grid grid-cols-2 md:grid-cols-4"
          style={{
            marginTop: 64,
            paddingTop: 32,
            borderTop: "1px solid var(--ms-border)",
            gap: 32,
          }}
        >
          {TRUST_STATS.map((stat) => (
            <div key={stat.label}>
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "var(--text-body-lg)",
                  fontWeight: 400,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  color: "var(--ms-fg)",
                }}
              >
                {stat.accent === "prefix" && stat.accentChar && (
                  <span style={{ color: "var(--ms-orange-text)" }}>
                    {stat.accentChar}
                  </span>
                )}
                {stat.number}
                {stat.accent === "suffix" && stat.accentChar && (
                  <span style={{ color: "var(--ms-orange-text)" }}>
                    {stat.accentChar}
                  </span>
                )}
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-label)",
                  fontWeight: 400,
                  color: "var(--ms-fg-soft)",
                  letterSpacing: "0.4px",
                }}
              >
                {stat.label}
                {stat.sub && (
                  <>
                    {" "}
                    <span style={{ color: "var(--ms-fg-faint)" }}>
                      {stat.sub}
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
