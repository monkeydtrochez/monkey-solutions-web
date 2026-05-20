"use client";
import { useContext } from "react";
import GlobalContext from "@/app/context/GlobalContext";
import { Badge } from "@/components/ui/badge";

export default function SkillsSection() {
  const ctx = useContext(GlobalContext);
  const profile = ctx?.profile;

  // Group professional skills by category, preserving insertion order
  const categoryMap = new Map<string, string[]>();
  for (const skill of profile?.skillGroups ?? []) {
    const cat = skill.category ?? "Other";
    if (!categoryMap.has(cat)) categoryMap.set(cat, []);
    categoryMap.get(cat)!.push(skill.name);
  }
  const techGroups = Array.from(categoryMap.entries());

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

        {/* ── Technical skill categories ── */}
        {techGroups.length > 0 && (
          <div
            style={{
              marginTop: 48,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: 40,
              alignItems: "start",
            }}
          >
            {techGroups.map(([group, skills]) => (
              <div key={group}>
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
                  {group}
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {skills.map((name) => (
                    <Badge key={name} variant="outline">
                      {name}
                    </Badge>
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
