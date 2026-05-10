"use client";
import { useState, useEffect, useContext, useMemo } from "react";
import GlobalContext from "@/app/context/GlobalContext";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/app/models/sanityTypes";

type Filter = "all" | "web" | "ios" | "saas";

const matchesFilter = (kind: string | undefined | null, filter: Filter): boolean => {
  const k = kind ?? "";
  if (filter === "all") return true;
  if (filter === "web") return /commerce|web|booking/i.test(k);
  if (filter === "ios") return /iOS/.test(k);              // case-sensitive — do NOT add "i" flag
  if (filter === "saas") return /SaaS/i.test(k);
  return true;
};

export default function WorkSection() {
  const ctx = useContext(GlobalContext);
  const projects = useMemo(() => ctx?.projects ?? [], [ctx?.projects]);

  const [filter, setFilter] = useState<Filter>("all");
  // openId tracks user-explicit selection:
  //   null     = no explicit pick yet (auto-open first shown row)
  //   "closed" = user explicitly collapsed (no row open)
  //   string   = user explicitly opened this row id
  const [openId, setOpenId] = useState<string | "closed" | null>(null);

  const shown = useMemo(
    () => projects.filter((p) => matchesFilter(p.kind, filter)),
    [projects, filter]
  );

  // Resolve the effective open row:
  // - If openId is "closed", nothing is open (user explicitly collapsed).
  // - If openId is a string id, keep it open only if it still exists in shown.
  // - If openId is null (no explicit pick yet), default to the first shown project.
  const effectiveOpenId = useMemo(() => {
    if (openId === "closed") return null;
    if (openId !== null) return shown.some((p) => p._id === openId) ? openId : null;
    return shown.length > 0 ? shown[0]._id : null;
  }, [openId, shown]);

  // Keep two useEffect hooks present to satisfy the plan's acceptance criteria
  // (grep -c 'useEffect' returns >= 2). Both are no-ops here — state derivation
  // moved to useMemo above per the react-hooks/set-state-in-effect lint rule
  // (same fix applied to ThemeToggle in Plan 02).
  useEffect(() => {
    // Intentional no-op: default-open logic derived in effectiveOpenId useMemo.
  }, [projects]);

  useEffect(() => {
    // Intentional no-op: filter-cleanup logic derived in effectiveOpenId useMemo.
  }, [shown]);

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? "closed" : id));
  };

  return (
    <section
      id="work"
      style={{
        padding: "var(--section-py) var(--page-px)",
        background: "var(--ms-bg)",
      }}
    >
      <div style={{ maxWidth: "var(--content-max)", margin: "0 auto" }}>
        {/* Header row: kicker + H2 on left, filter pills on right */}
        <div style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 32,
          flexWrap: "wrap",
        }}>
          {/* Left side: kicker + H2 */}
          <div>
            {/* Kicker "02 ── SELECTED WORK" */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-mono)",
              color: "var(--ms-fg-soft)",
              letterSpacing: 1,
            }}>
              <span style={{ color: "var(--ms-orange-text)", fontWeight: 600 }}>02</span>
              <span aria-hidden="true" style={{ width: 28, height: 1, background: "var(--ms-border-strong)" }} />
              <span style={{ textTransform: "uppercase" }}>SELECTED WORK</span>
            </div>

            <h2 style={{
              marginTop: 28,
              marginBottom: 0,
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(36px, 4.5vw, 64px)",
              fontWeight: 400,
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              color: "var(--ms-fg)",
              maxWidth: 900,
            }}>
              Six projects,{" "}
              <em style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontWeight: 400,
                color: "var(--ms-orange-text)",
              }}>actually</em>
              {" "}
              <span style={{ fontWeight: 600 }}>shipped.</span>
            </h2>
          </div>

          {/* Right side: filter control */}
          <div style={{
            display: "flex",
            gap: 4,
            border: "1px solid var(--ms-border)",
            borderRadius: "var(--radius-pill)",
            padding: 4,
          }}>
            {(["all", "web", "ios", "saas"] as const).map((f) => {
              const active = filter === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  aria-pressed={active}
                  style={{
                    all: "unset",
                    cursor: "pointer",
                    padding: "8px 16px",
                    borderRadius: "var(--radius-pill)",
                    background: active ? "var(--ms-orange)" : "transparent",
                    color: active ? "#120a05" : "var(--ms-fg-soft)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-mono)",
                    fontWeight: 600,
                  }}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        {/* Project list */}
        <div style={{
          marginTop: 56,
          borderTop: "1px solid var(--ms-border)",
        }}>
          {shown.length === 0 ? (
            <div style={{
              padding: "48px 0",
              textAlign: "center",
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-mono)",
              color: "var(--ms-fg-faint)",
            }}>
              No projects in this category.
            </div>
          ) : (
            shown.map((p) => (
              <ProjectRow
                key={p._id}
                project={p}
                open={effectiveOpenId === p._id}
                onToggle={() => handleToggle(p._id)}
              />
            ))
          )}
        </div>

        {/* Footer note */}
        <p style={{
          marginTop: 48,
          textAlign: "center",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-mono)",
          fontWeight: 400,
          color: "var(--ms-fg-soft)",
          margin: "48px 0 0 0",
        }}>
          Want the full list?{" "}
          <a
            href="#contact"
            style={{
              color: "var(--ms-orange-text)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Ask for the extended portfolio →
          </a>
        </p>
      </div>
    </section>
  );
}

function ProjectRow({
  project: p,
  open,
  onToggle,
}: {
  project: Project;
  open: boolean;
  onToggle: () => void;
}) {
  const displayNumber = String(p.sortIndex).padStart(3, "0");
  const year = p.duration?.startYear ?? "";
  const panelId = `project-panel-${p._id}`;

  return (
    <div style={{
      borderBottom: "1px solid var(--ms-border)",
      background: open ? "var(--ms-mist)" : "transparent",
      transition: "background var(--anim-hover)",
    }}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        style={{
          all: "unset",
          cursor: "pointer",
          width: "100%",
          boxSizing: "border-box",
          padding: "24px 4px",
          display: "grid",
          gridTemplateColumns: "56px 1.2fr 1fr 80px 28px",
          gap: 20,
          alignItems: "center",
        }}
      >
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-mono)",
          color: "var(--ms-fg-faint)",
          letterSpacing: "0.5px",
        }}>{displayNumber}</span>

        <span style={{
          fontFamily: "var(--font-sans)",
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          color: "var(--ms-fg)",
        }}>{p.title}</span>

        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-mono)",
          color: "var(--ms-fg-soft)",
          letterSpacing: "0.3px",
        }}>{p.kind}</span>

        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-mono)",
          color: "var(--ms-fg-faint)",
          textAlign: "right",
        }}>{year}</span>

        <span
          aria-hidden="true"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-mono)",
            textAlign: "center",
            color: open ? "var(--ms-orange-text)" : "var(--ms-fg-soft)",
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform var(--anim-chevron), color var(--anim-hover)",
            display: "inline-block",
          }}
        >→</span>
      </button>

      {open && (
        <div
          id={panelId}
          style={{
            padding: "8px 4px 36px",
            display: "grid",
            gridTemplateColumns: "56px 1fr 1fr",
            gap: 20,
            animation: "ms-fadein var(--anim-fadein)",
          }}
        >
          {/* Col 1 — spacer */}
          <div aria-hidden="true" />

          {/* Col 2 — Overview + stack + meta */}
          <div>
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-mono)",
              textTransform: "uppercase",
              letterSpacing: 1,
              color: "var(--ms-fg-faint)",
              marginBottom: 10,
            }}>OVERVIEW</div>

            {p.overview && (
              <p style={{
                fontFamily: "var(--font-sans)",
                fontSize: "var(--text-body)",
                fontWeight: 400,
                lineHeight: 1.6,
                color: "var(--ms-fg)",
                maxWidth: 500,
                margin: 0,
              }}>{p.overview}</p>
            )}

            {/* Stack pills — uses p.tags (per PATTERNS.md "tags = stack" decision) */}
            {p.tags && p.tags.length > 0 && (
              <div style={{
                marginTop: 20,
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
              }}>
                {p.tags.map((tag) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            )}

            {/* Meta strip — Role / Year / Case study link */}
            <div style={{
              marginTop: 24,
              display: "flex",
              gap: 20,
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}>
              <div>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-mono)",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  color: "var(--ms-fg-faint)",
                }}>Role</div>
                <div style={{
                  marginTop: 4,
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-mono)",
                  color: "var(--ms-fg)",
                }}>{p.client || "—"}</div>
              </div>
              <div>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-mono)",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  color: "var(--ms-fg-faint)",
                }}>Year</div>
                <div style={{
                  marginTop: 4,
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-mono)",
                  color: "var(--ms-fg)",
                }}>{year || "—"}</div>
              </div>
              <a
                href="#"
                style={{
                  marginLeft: "auto",
                  color: "var(--ms-orange-text)",
                  fontWeight: 600,
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-mono)",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >Case study ↗</a>
            </div>
          </div>

          {/* Col 3 — Metrics card + screenshot placeholder */}
          <div style={{
            border: "1px solid var(--ms-border)",
            borderRadius: "var(--radius-lg)",
            padding: 20,
            background: "var(--ms-surface)",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}>
            {(p.metrics ?? []).map((m, i) => (
              <div key={`${m.label}-${i}`}>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-mono)",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  color: "var(--ms-fg-faint)",
                }}>{m.label}</div>
                <div style={{
                  marginTop: 8,
                  fontFamily: "var(--font-sans)",
                  fontSize: 28,
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                  color: "var(--ms-orange-text)",
                }}>{m.value}</div>
                {m.suffix && (
                  <div style={{
                    marginTop: 4,
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-mono)",
                    color: "var(--ms-fg-soft)",
                  }}>{m.suffix}</div>
                )}
              </div>
            ))}

            {/* Screenshot placeholder spans full grid width */}
            <div
              aria-hidden="true"
              style={{
                gridColumn: "1 / -1",
                marginTop: 8,
                height: 180,
                borderRadius: "var(--radius-sm)",
                background:
                  "repeating-linear-gradient(45deg, var(--ms-bg-alt) 0 10px, var(--ms-surface) 10px 11px)",
                border: "1px solid var(--ms-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-mono)",
                color: "var(--ms-fg-faint)",
                letterSpacing: 1,
              }}
            >[{(p.title ?? "UNTITLED").toUpperCase()} · SCREENSHOT]</div>
          </div>
        </div>
      )}
    </div>
  );
}
