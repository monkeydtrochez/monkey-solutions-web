const SKILL_GROUPS = [
  {
    group: "Languages",
    skills: [
      { name: "TypeScript", proficiency: 9 },
      { name: "Python", proficiency: 7 },
      { name: "Swift", proficiency: 7 },
      { name: "SQL", proficiency: 7 },
      { name: "Bash", proficiency: 5 },
    ],
  },
  {
    group: "Frontend",
    skills: [
      { name: "React / Next.js", proficiency: 9 },
      { name: "SwiftUI", proficiency: 8 },
      { name: "CSS / Tailwind", proficiency: 9 },
      { name: "Figma", proficiency: 7 },
    ],
  },
  {
    group: "Backend & Infra",
    skills: [
      { name: "Node / Express", proficiency: 8 },
      { name: "PostgreSQL", proficiency: 7 },
      { name: "Docker", proficiency: 6 },
      { name: "AWS", proficiency: 6 },
      { name: "Sanity CMS", proficiency: 8 },
    ],
  },
  {
    group: "Craft",
    skills: [
      { name: "Product thinking", proficiency: 9 },
      { name: "API design", proficiency: 8 },
      { name: "Performance", proficiency: 8 },
      { name: "Accessibility", proficiency: 7 },
    ],
  },
] as const;

export default function SkillsSection() {
  return (
    <section
      id="skills"
      style={{
        padding: "var(--section-py) var(--page-px)",
      }}
    >
      <div style={{ maxWidth: "var(--content-max)", margin: "0 auto" }}>
        {/* Kicker row: 04 ── SKILLS */}
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
            04
          </span>
          <span
            aria-hidden="true"
            style={{
              width: 28,
              height: 1,
              background: "var(--ms-border-strong)",
            }}
          />
          <span style={{ textTransform: "uppercase" }}>SKILLS</span>
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
          What I work with
        </h2>

        {/* 4-column skill groups grid */}
        <div
          style={{
            marginTop: 48,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 24,
          }}
        >
          {SKILL_GROUPS.map((group) => (
            <div key={group.group}>
              {/* Group header */}
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-mono)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  color: "var(--ms-fg)",
                  marginBottom: 16,
                  paddingBottom: 8,
                  borderBottom: "1px solid var(--ms-border)",
                }}
              >
                {group.group}
              </div>

              {/* Skill rows */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {group.skills.map((skill) => (
                  <div
                    key={skill.name}
                    role="img"
                    aria-label={`${skill.name}: ${skill.proficiency} out of 10`}
                  >
                    {/* Label row */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 4,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "var(--text-body)",
                          fontWeight: 400,
                          color: "var(--ms-fg-soft)",
                        }}
                      >
                        {skill.name}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "var(--text-mono)",
                          fontWeight: 400,
                          color: "var(--ms-fg-faint)",
                        }}
                      >
                        {skill.proficiency}/10
                      </span>
                    </div>

                    {/* 10-segment bar */}
                    <div
                      style={{
                        display: "flex",
                        gap: "var(--space-1)",
                        height: 8,
                        width: "100%",
                      }}
                    >
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          style={{
                            flex: 1,
                            height: 8,
                            borderRadius: "var(--radius-xs)",
                            background:
                              i < skill.proficiency
                                ? "var(--ms-orange)"
                                : "var(--ms-border-strong)",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
