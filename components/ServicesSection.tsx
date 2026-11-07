import { Badge } from "@/components/ui/badge";

import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { format } from "@/lib/i18n/format";

export default function ServicesSection({ lang }: { lang: Locale }) {
  const t = getDictionary(lang).services;
  const SERVICES = t.items.map((item, i) => ({
    ...item,
    number: String(i + 1).padStart(2, "0"),
  }));
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
          <span style={{ textTransform: "uppercase" }}>{t.kicker}</span>
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
            {t.h2.pre}{" "}
            <em
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontWeight: 400,
                color: "var(--ms-fg)",
              }}
            >
              {t.h2.em}
            </em>{" "}
            <strong style={{ fontWeight: 700, color: "var(--ms-orange-text)" }}>
              {t.h2.strong}
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
            {t.intro}
          </p>
        </div>

        {/* Service cards — 3-column grid */}
        <div
          className="grid grid-cols-1 ms:grid-cols-3"
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
                    {format(t.cardKicker, { n: service.number })}
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
