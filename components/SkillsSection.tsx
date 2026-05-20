"use client";
import { useContext } from "react";
import GlobalContext from "@/app/context/GlobalContext";

const CATEGORY_ORDER = ["Languages", "Frontend", "Backend & Infra", "Craft"];

export default function SkillsSection() {
  const ctx = useContext(GlobalContext);
  const profile = ctx?.profile;

  const categoryMap = new Map<string, { name: string; proficiency: number }[]>();
  for (const cat of CATEGORY_ORDER) categoryMap.set(cat, []);
  for (const skill of profile?.skillGroups ?? []) {
    const cat = skill.category ?? "Other";
    if (!categoryMap.has(cat)) categoryMap.set(cat, []);
    categoryMap.get(cat)!.push({ name: skill.name, proficiency: skill.proficiency ?? 8 });
  }
  const groups = Array.from(categoryMap.entries()).filter(([, skills]) => skills.length > 0);

  const personalitySkills = profile?.personalitySkills ?? [];

  return (
    <section
      id="skills"
      style={{ padding: "var(--section-py) var(--page-px)" }}
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
          <span style={{ color: "var(--ms-orange-text)", fontWeight: 600 }}>04</span>
          <span
            aria-hidden="true"
            style={{ width: 28, height: 1, background: "var(--ms-border-strong)" }}
          />
          <span style={{ textTransform: "uppercase" }}>SKILLS</span>
        </div>

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
          Tools I reach for{" "}
          <em
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontWeight: 400,
              color: "var(--ms-orange-text)",
            }}
          >
            without
          </em>{" "}
          <strong style={{ fontWeight: 700 }}>thinking.</strong>
        </h2>

        {/* ── 4-group 10-segment proficiency bars ── */}
        {groups.length > 0 && (
          <div
            className="grid grid-cols-1 ms:grid-cols-4"
            style={{ marginTop: 48, gap: 40, alignItems: "start" }}
          >
            {groups.map(([group, skills]) => (
              <div key={group}>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-mono)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    color: "var(--ms-fg)",
                    marginBottom: 20,
                    paddingBottom: 8,
                    borderBottom: "1px solid var(--ms-border)",
                  }}
                >
                  {group}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {skills.map(({ name, proficiency }) => (
                    <div
                      key={name}
                      role="img"
                      aria-label={`${name}: ${proficiency} out of 10`}
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "var(--text-body)",
                          fontWeight: 400,
                          color: "var(--ms-fg-soft)",
                          marginBottom: 6,
                        }}
                      >
                        {name}
                      </div>
                      <div style={{ display: "flex", gap: 3 }}>
                        {Array.from({ length: 10 }).map((_, i) => (
                          <div
                            key={i}
                            style={{
                              flex: 1,
                              height: 6,
                              borderRadius: "var(--radius-xs)",
                              background:
                                i < proficiency
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
        )}

        {/* ── Personality traits ── */}
        {personalitySkills.length > 0 && (
          <div
            style={{
              marginTop: 56,
              paddingTop: 48,
              borderTop: "1px solid var(--ms-border)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 16,
                marginBottom: 28,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-mono)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  color: "var(--ms-fg-faint)",
                }}
              >
                How I show up
              </span>
              <span
                aria-hidden="true"
                style={{ flex: 1, height: 1, background: "var(--ms-border)" }}
              />
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {personalitySkills.map((trait) => (
                <span
                  key={trait}
                  style={{
                    padding: "10px 20px",
                    border: "1px solid var(--ms-border)",
                    borderRadius: "var(--radius-pill)",
                    fontFamily: "var(--font-sans)",
                    fontSize: "var(--text-body)",
                    fontWeight: 400,
                    color: "var(--ms-fg-soft)",
                    background: "var(--ms-surface)",
                  }}
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
