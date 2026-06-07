"use client";
import { useContext } from "react";
import GlobalContext from "@/app/context/GlobalContext";

export default function ExperienceSection() {
  const ctx = useContext(GlobalContext);
  const workExperience = ctx?.workExperience ?? [];
  const education = ctx?.education ?? [];
  const communityWork = ctx?.profile?.communityWork ?? [];

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

        {/* ── Full-width experience timeline ── */}
        <div
          style={{
            position: "relative",
            marginTop: 48,
          }}
        >
          {/* Explicit vertical line — positioned so it aligns with dot centres */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 7,
              top: 8,
              bottom: 8,
              width: 1,
              background: "var(--ms-border)",
            }}
          />

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
                  paddingLeft: 32,
                  paddingBottom: isLast ? 0 : 48,
                }}
              >
                {/* Dot — current role: orange 16px pulsing; past role: grey 12px static */}
                {entry.current === true ? (
                  <div
                    aria-hidden="true"
                    className="ms-pulse-anim"
                    style={{
                      position: "absolute",
                      left: -1,
                      top: 2,
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
                      left: 1,
                      top: 4,
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: "var(--ms-border-strong)",
                      border: "2px solid var(--ms-bg-alt)",
                    }}
                  />
                )}

                {/* Entry: meta left, description right */}
                <div
                  className="grid grid-cols-1 ms:grid-cols-[220px_1fr]"
                  style={{
                    gap: 40,
                    alignItems: "start",
                  }}
                >
                  {/* Meta column */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {/* Company name + optional "Current" badge */}
                    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
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
                            padding: "3px 8px",
                            border: "1px solid var(--ms-orange-dim)",
                            borderRadius: "var(--radius-pill)",
                            fontFamily: "var(--font-mono)",
                            fontSize: 11,
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
                        marginTop: 2,
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        fontWeight: 400,
                        color: "var(--ms-fg-faint)",
                      }}
                    >
                      {entry.duration?.startYear ?? "?"}&ndash;{entry.duration?.endYear || "Present"}
                    </div>
                  </div>

                  {/* Description column */}
                  {text && (
                    <p
                      style={{
                        margin: 0,
                        paddingTop: 2,
                        fontFamily: "var(--font-sans)",
                        fontSize: "var(--text-body)",
                        fontWeight: 400,
                        lineHeight: 1.65,
                        color: "var(--ms-fg-soft)",
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

        {/* ── Education + Community row (below timeline) ── */}
        <div
          className="grid grid-cols-1 ms:grid-cols-2"
          style={{
            gap: 64,
            marginTop: 64,
            paddingTop: 48,
            borderTop: "1px solid var(--ms-border)",
            alignItems: "start",
          }}
        >
          {/* Education list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
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
                        marginTop: 6,
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
                  {entry.start}&ndash;{entry.end}
                </div>
              </div>
            ))}
          </div>

          {/* Community sub-section — from profile.communityWork */}
          {communityWork.length > 0 && (
            <div>
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

              {communityWork.map((row) => (
                <div
                  key={row._key}
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
                    {row.assignment}
                  </span>
                  {row.organisation && (
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        fontWeight: 400,
                        color: "var(--ms-fg-faint)",
                        textAlign: "right",
                      }}
                    >
                      {row.organisation}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
