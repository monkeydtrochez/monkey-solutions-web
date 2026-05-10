import { Badge } from "@/components/ui/badge";

const SERVICES = [
  {
    number: "01.",
    title: "Full-Stack Web",
    description:
      "End-to-end product development — from API design to shipped UI. React, Next.js, Node, and whatever the project actually needs.",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind"],
  },
  {
    number: "02.",
    title: "iOS Development",
    description:
      "Native Swift and SwiftUI apps. I care about how they feel in your hand as much as what they do.",
    stack: ["Swift", "SwiftUI", "Xcode", "Core Data"],
  },
  {
    number: "03.",
    title: "Consulting & Rescue",
    description:
      "Inherited a mess? I audit, stabilise, and hand over a codebase you can confidently build on.",
    stack: ["Audit", "Refactor", "Docs", "CI"],
  },
  {
    number: "04.",
    title: "Design Systems",
    description:
      "Tokens, components, and the documentation that makes a team fast. I've built them from scratch and inherited them mid-project.",
    stack: ["Figma Tokens", "Tailwind", "shadcn", "Storybook"],
  },
] as const;

export default function ServicesSection() {
  return (
    <section
      id="services"
      style={{
        padding: "var(--section-py) var(--page-px)",
        background: "var(--ms-bg-alt)",
        borderTop: "1px solid var(--ms-border)",
        borderBottom: "1px solid var(--ms-border)",
      }}
    >
      <div style={{ maxWidth: "var(--content-max)", margin: "0 auto" }}>
        {/* Kicker row: 05 ── SERVICES */}
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
            05
          </span>
          <span
            aria-hidden="true"
            style={{
              width: 28,
              height: 1,
              background: "var(--ms-border-strong)",
            }}
          />
          <span style={{ textTransform: "uppercase" }}>SERVICES</span>
        </div>

        {/* H2 */}
        <h2
          style={{
            marginTop: 36,
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-h2)",
            fontWeight: 400,
            lineHeight: 1.02,
            letterSpacing: "-0.035em",
            color: "var(--ms-fg)",
            margin: 0,
            marginBlockStart: 36,
          }}
        >
          What I offer
        </h2>

        {/* 2x2 service card grid */}
        <div
          style={{
            marginTop: 48,
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 24,
          }}
        >
          {SERVICES.map((service) => (
            <div
              key={service.number}
              className="service-card"
              style={{
                position: "relative",
                overflow: "hidden",
                padding: 32,
                background: "var(--ms-surface)",
                borderRadius: "var(--radius-2xl)",
              }}
            >
              {/* Decorative giant Fraunces italic number */}
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: -8,
                  right: 16,
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "clamp(80px, 10vw, 140px)",
                  lineHeight: 0.85,
                  color: "var(--ms-border-strong)",
                  userSelect: "none",
                }}
              >
                {service.number}
              </span>

              {/* Card content */}
              <div style={{ position: "relative", zIndex: 1 }}>
                {/* Title */}
                <h3
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "var(--text-h3)",
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                    color: "var(--ms-fg)",
                    maxWidth: 280,
                    margin: 0,
                  }}
                >
                  {service.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    marginTop: 16,
                    fontFamily: "var(--font-sans)",
                    fontSize: "var(--text-body)",
                    fontWeight: 400,
                    lineHeight: 1.6,
                    color: "var(--ms-fg-soft)",
                    margin: 0,
                    marginBlockStart: 16,
                  }}
                >
                  {service.description}
                </p>

                {/* Stack chip row */}
                <div
                  style={{
                    marginTop: 24,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  {service.stack.map((chip) => (
                    <Badge key={chip} variant="outline" aria-hidden="true">
                      {chip}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
