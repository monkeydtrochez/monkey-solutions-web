"use client";
import { useContext } from "react";
import Image from "next/image";
import GlobalContext from "@/app/context/GlobalContext";

export default function AboutSection() {
  const ctx = useContext(GlobalContext);
  const profile = ctx?.profile ?? null;

  const descriptionParagraphs =
    profile?.description && profile.description.length > 0
      ? profile.description
          .map((block) => block.children.map((span) => span.text).join(""))
          .filter(Boolean)
      : null;

  const paragraphs = descriptionParagraphs ?? [
    "Ten years in, I've worked on fintech dashboards used by traders, iOS apps used by students across Sweden, and e-commerce platforms processing real money. My best work hides the complexity — it just feels calm and obvious.",
    "I take product from ambiguous brief to shipped binary. Comfortable being the only developer in the room, or the new senior in a team of twenty.",
  ];

  const profilePictureUrl = profile?.profilePictureUrl ?? null;

  const location = profile?.location ?? "Göteborg, SE";
  const languagesValue = (profile?.languages ?? ["SV", "EN", "ES"]).join(" · ");

  return (
    <section
      id="about"
      style={{
        padding: "var(--section-py) var(--page-px)",
        background: "var(--ms-bg-alt)",
        borderTop: "1px solid var(--ms-border)",
        borderBottom: "1px solid var(--ms-border)",
      }}
    >
      <div style={{ maxWidth: "var(--content-max)", margin: "0 auto" }}>
        {/* Kicker row: 01 ── ABOUT */}
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
            01
          </span>
          <span
            aria-hidden="true"
            style={{
              width: 28,
              height: 1,
              background: "var(--ms-border-strong)",
            }}
          />
          <span style={{ textTransform: "uppercase" }}>ABOUT</span>
        </div>

        {/* Two-column grid */}
        <div
          className="grid grid-cols-1 ms:grid-cols-2"
          style={{
            gap: 72,
            marginTop: 36,
            alignItems: "start",
          }}
        >
          {/* Left column */}
          <div>
            {/* H2 with Fraunces italic accent */}
            <h2
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(36px, 4.5vw, 64px)",
                fontWeight: 400,
                letterSpacing: "-0.035em",
                lineHeight: 1.02,
                color: "var(--ms-fg)",
                margin: 0,
              }}
            >
              I build what teams{" "}
              <em
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: "var(--ms-orange-text)",
                }}
              >
                wish
              </em>{" "}
              they had time to build.
            </h2>

            {/* Body paragraphs */}
            <div
              style={{
                marginTop: 32,
                maxWidth: 520,
              }}
            >
              {paragraphs.map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "var(--text-body)",
                    fontWeight: 400,
                    lineHeight: 1.7,
                    color: "var(--ms-fg-soft)",
                    marginTop: i === 0 ? 0 : 16,
                    marginBottom: 0,
                  }}
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Facts row */}
            <div
              style={{
                marginTop: 36,
                display: "flex",
                flexWrap: "wrap",
                gap: 32,
              }}
            >
              {[
                { label: "LOCATION", value: location },
                { label: "LANGUAGES", value: languagesValue },
                { label: "WORKING SINCE", value: "2015" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-mono)",
                      fontWeight: 400,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      color: "var(--ms-fg-faint)",
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      fontFamily: "var(--font-sans)",
                      fontSize: "var(--text-body)",
                      fontWeight: 600,
                      color: "var(--ms-fg)",
                    }}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — Portrait placeholder + decorative offset border + sticker badge */}
          <div style={{ position: "relative" }}>
            {/* Decorative offset border */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                border: "1px solid var(--ms-border-strong)",
                transform: "translate(16px, 16px)",
                borderRadius: "var(--radius-sm)",
                pointerEvents: "none",
              }}
            />

            {/* Portrait (3:4) — Sanity image when available, striped placeholder otherwise */}
            <div
              style={{
                position: "relative",
                zIndex: 1,
                aspectRatio: "3 / 4",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--ms-border)",
                overflow: "hidden",
                ...(!profilePictureUrl && {
                  background:
                    "repeating-linear-gradient(45deg, var(--ms-bg-alt) 0 10px, var(--ms-surface) 10px 11px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }),
              }}
            >
              {profilePictureUrl ? (
                <Image
                  src={profilePictureUrl}
                  alt="Profile photo"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <span
                  aria-hidden="true"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: 64,
                    color: "var(--ms-fg-faint)",
                  }}
                >
                  DT
                </span>
              )}
            </div>

            {/* Sticker badge */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                bottom: -16,
                left: -16,
                background: "var(--ms-orange)",
                color: "#120a05",
                padding: "8px 16px",
                borderRadius: "var(--radius-md)",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-mono)",
                fontWeight: 600,
                letterSpacing: "0.5px",
                transform: "rotate(-3deg)",
                boxShadow: "var(--shadow-sticker)",
                zIndex: 2,
              }}
            >
              ↓ hi, nice to meet you
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
