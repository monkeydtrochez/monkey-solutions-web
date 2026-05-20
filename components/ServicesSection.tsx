import { Badge } from "@/components/ui/badge";

const SERVICES = [
  {
    number: "01",
    title: "Full-Stack Web",
    description:
      "From landing page to full product. Modern fullstack frameworks, headless CMS, and whatever the project actually needs.",
    stack: ["Devops", "Development", "Headless CMS", "Design", "Integrations"],
  },
  {
    number: "02",
    title: "Dev advisory",
    description:
      "Code reviews, architecture calls, hiring loops. Sometimes the most useful thing is a second pair of eyes.",
    stack: ["Code audits", "Architecture reviews", "Hiring loops", "Consulting"],
  },
  {
    number: "03",
    title: "Backend & APIs",
    description:
      "Services built with best suited frameworks, typed from DB to client. Boring-by-choice, readable, tested.",
    stack: ["Performance", "Security", "Devops", "Architecture design", "Observability", "Monitoring", "Testing"],
  },
  {
    number: "04",
    title: "Mobile & iOS",
    description:
      "Native iOS apps and cross-platform mobile. Swift or React Native — whatever fits the product and the team.",
    stack: ["Swift", "SwiftUI", "React Native", "App Store", "Push notifications"],
  },
];

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
          <span style={{ color: "var(--ms-orange-text)", fontWeight: 600 }}>05</span>
          <span
            aria-hidden="true"
            style={{ width: 28, height: 1, background: "var(--ms-border-strong)" }}
          />
          <span style={{ textTransform: "uppercase" }}>SERVICES</span>
        </div>

        {/* Header: title left, subtitle right */}
        <div
          className="grid grid-cols-1 ms:grid-cols-2"
          style={{
            gap: 64,
            marginTop: 36,
            alignItems: "end",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: "var(--font-sans)",
              fontSize: "var(--text-h2)",
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: "-0.035em",
              color: "var(--ms-fg)",
            }}
          >
            A few of many ways we could be{" "}
            <em
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontWeight: 400,
                color: "var(--ms-fg)",
              }}
            >
              working
            </em>{" "}
            <strong style={{ fontWeight: 700, color: "var(--ms-orange-text)" }}>
              together.
            </strong>
          </h2>

          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-sans)",
              fontSize: "var(--text-body)",
              fontWeight: 400,
              lineHeight: 1.65,
              color: "var(--ms-fg-soft)",
            }}
          >
            Most engagements are 4–12 weeks, fixed scope or monthly retainer.
            I&apos;ll tell you honestly if your project isn&apos;t a fit for me.
          </p>
        </div>

        {/* Service cards — 2×2 grid */}
        <div
          className="grid grid-cols-1 ms:grid-cols-2"
          style={{
            marginTop: 48,
            gap: 16,
          }}
        >
          {SERVICES.map((service) => {
            return (
              <div
                key={service.number}
                className="service-card"
                style={{
                  position: "relative",
                  overflow: "hidden",
                  padding: 32,
                  background: "var(--ms-surface)",
                  borderRadius: "var(--radius-xl)",
                }}
              >
                {/* Decorative background number */}
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: -16,
                    right: 16,
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: "clamp(120px, 16vw, 200px)",
                    lineHeight: 0.85,
                    color: "var(--ms-bg-alt)",
                    userSelect: "none",
                    pointerEvents: "none",
                  }}
                >
                  {service.number}
                </span>

                {/* Card content */}
                <div style={{ position: "relative", zIndex: 1 }}>
                  {/* Kicker */}
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-mono)",
                      fontWeight: 400,
                      color: "var(--ms-fg-faint)",
                      marginBottom: 16,
                      letterSpacing: "0.5px",
                    }}
                  >
                    — service / {service.number}
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-sans)",
                      fontSize: "var(--text-h3)",
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      lineHeight: 1.15,
                      color: "var(--ms-fg)",
                    }}
                  >
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      marginTop: 12,
                      marginBottom: 0,
                      fontFamily: "var(--font-sans)",
                      fontSize: "var(--text-body)",
                      fontWeight: 400,
                      lineHeight: 1.6,
                      color: "var(--ms-fg-soft)",
                    }}
                  >
                    {service.description}
                  </p>

                  {/* Stack chips */}
                  <div style={{ marginTop: 24, display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {service.stack.map((chip) => (
                      <Badge key={chip} variant="outline">
                        {chip}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
