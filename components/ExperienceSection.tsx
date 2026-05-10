"use client";
import { useContext } from "react";
import GlobalContext from "@/app/context/GlobalContext";

const COMMUNITY = [
  { label: "Open source contributor", detail: "GitHub / @danmunro" },
  { label: "Tech speaker", detail: "GothenburgJS, 2023" },
  { label: "Mentor", detail: "Hack Your Future, SE" },
];

export default function ExperienceSection() {
  const ctx = useContext(GlobalContext);
  const workExperience = ctx?.workExperience ?? [];
  const education = ctx?.education ?? [];

  return (
    <section
      id="experience"
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
          <span style={{ color: "var(--ms-orange-text)", fontWeight: 600 }}>
            03
          </span>
          <span
            aria-hidden="true"
            style={{
              width: 28,
              height: 1,
              background: "var(--ms-border-strong)",
            }}
          />
          <span style={{ textTransform: "uppercase" }}>EXPERIENCE + EDUCATION</span>
        </div>

        {/* Section H2 with Fraunces italic accent on "Education" */}
        <h2
          style={{
            marginTop: 36,
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-h2)",
            fontWeight: 400,
            lineHeight: 1.02,
            letterSpacing: "-0.035em",
            color: "var(--ms-fg)",
          }}
        >
          Experience +{" "}
          <em
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontWeight: 400,
              color: "var(--ms-orange-text)",
            }}
          >
            Education
          </em>
        </h2>

        {/* Two-column grid: timeline (left) + education + community (right) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            marginTop: 36,
            alignItems: "start",
          }}
        >
          {/* ── Left column: Experience timeline ── */}
          <div
            style={{
              position: "relative",
              paddingLeft: 32,
              borderLeft: "1px solid var(--ms-border)",
            }}
          >
            {workExperience.map((entry, index) => {
              const isLast = index === workExperience.length - 1;

              // Compute plain text from blockContent (D-06) — no block renderer library
              const text = entry.description
                ?.map((block) => block.children?.map((c) => c.text).join(""))
                .filter(Boolean)
                .join(" ");

              return (
                <div
                  key={entry._id}
                  style={{
                    position: "relative",
                    paddingBottom: isLast ? 0 : 36,
                  }}
                >
                  {/* Dot — current role: orange 16px pulsing; past role: grey 12px static */}
                  {entry.current === true ? (
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        left: -8,
                        top: 4,
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        background: "var(--ms-orange)",
                        boxShadow: "0 0 0 4px var(--ms-orange-dim)",
                        animation: "ms-pulse var(--anim-pulse) infinite",
                      }}
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        left: -6,
                        top: 6,
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: "var(--ms-border-strong)",
                        border: "1px solid var(--ms-bg-alt)",
                      }}
                    />
                  )}

                  {/* Entry content */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                    }}
                  >
                    {/* Company name + optional "Current" badge */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: 16,
                          fontWeight: 600,
                          color: "var(--ms-fg)",
                        }}
                      >
                        {entry.company ?? ""}
                      </span>
                      {entry.current === true && (
                        <span
                          style={{
                            display: "inline-block",
                            marginLeft: 8,
                            padding: "4px 8px",
                            border: "1px solid var(--ms-orange-dim)",
                            borderRadius: "var(--radius-pill)",
                            fontFamily: "var(--font-mono)",
                            fontSize: 12,
                            fontWeight: 600,
                            textTransform: "uppercase",
                            color: "var(--ms-orange-text)",
                          }}
                        >
                          Current
                        </span>
                      )}
                    </div>

                    {/* Role title */}
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        fontWeight: 400,
                        color: "var(--ms-fg-soft)",
                      }}
                    >
                      {entry.title}
                    </div>

                    {/* Year range — use || for endYear so empty string falls back to "Present" */}
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        fontWeight: 400,
                        color: "var(--ms-fg-faint)",
                      }}
                    >
                      {entry.duration?.startYear ?? "?"}{" "}
                      &ndash;{" "}
                      {entry.duration?.endYear || "Present"}
                    </div>

                    {/* Description paragraph — rendered only when text is truthy */}
                    {text && (
                      <p
                        style={{
                          marginTop: 8,
                          fontFamily: "var(--font-sans)",
                          fontSize: "var(--text-body)",
                          fontWeight: 400,
                          lineHeight: 1.6,
                          color: "var(--ms-fg-soft)",
                          maxWidth: 480,
                        }}
                      >
                        {text}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Right column: Education list + Community sub-section ── */}
          <div>
            {/* Education list */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 24,
              }}
            >
              {education.map((entry) => (
                <div
                  key={entry._id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: 16,
                    alignItems: "start",
                  }}
                >
                  {/* Left: degree, institution, optional fieldOfStudy */}
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: 16,
                        fontWeight: 600,
                        color: "var(--ms-fg)",
                      }}
                    >
                      {entry.title}
                    </div>
                    <div
                      style={{
                        marginTop: 4,
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        fontWeight: 400,
                        color: "var(--ms-fg-soft)",
                      }}
                    >
                      {entry.school}
                    </div>
                    {entry.fieldOfStudy && (
                      <div
                        style={{
                          marginTop: 8,
                          fontFamily: "var(--font-mono)",
                          fontSize: 12,
                          fontWeight: 400,
                          color: "var(--ms-fg-faint)",
                        }}
                      >
                        {entry.fieldOfStudy}
                      </div>
                    )}
                  </div>

                  {/* Right: year range */}
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      fontWeight: 400,
                      color: "var(--ms-fg-faint)",
                      textAlign: "right",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {entry.start} &ndash; {entry.end}
                  </div>
                </div>
              ))}
            </div>

            {/* Community sub-section (D-12: 3 hardcoded rows) */}
            <div style={{ marginTop: 48 }}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  color: "var(--ms-fg-faint)",
                  marginBottom: 16,
                }}
              >
                ALSO / COMMUNITY
              </div>

              {COMMUNITY.map((row) => (
                <div
                  key={row.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    gap: 16,
                    padding: "12px 0",
                    borderBottom: "1px solid var(--ms-border)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      fontWeight: 400,
                      color: "var(--ms-fg-soft)",
                    }}
                  >
                    {row.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      fontWeight: 400,
                      color: "var(--ms-fg-faint)",
                      textAlign: "right",
                    }}
                  >
                    {row.detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
