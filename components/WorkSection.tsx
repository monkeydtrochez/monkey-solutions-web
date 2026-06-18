"use client";
import { useState, useContext, useMemo } from "react";
import Image from "next/image";
import GlobalContext from "@/app/context/GlobalContext";
import { Badge } from "@/components/ui/badge";
import RichText from "@/components/RichText";
import type { Project } from "@/app/models/sanityTypes";


export default function WorkSection() {
  const ctx = useContext(GlobalContext);
  const projects = useMemo(() => ctx?.projects ?? [], [ctx?.projects]);

  // Derive unique kind values from project data
  const filterOptions = useMemo(() => {
    const kinds = Array.from(
      new Set(projects.map((p) => p.kind).filter((k): k is string => Boolean(k)))
    );
    return ["all", ...kinds];
  }, [projects]);

  const [filter, setFilter] = useState("all");
  // openId tracks user-explicit selection:
  //   null     = no explicit pick yet (auto-open first shown row)
  //   "closed" = user explicitly collapsed (no row open)
  //   string   = user explicitly opened this row id
  const [openId, setOpenId] = useState<string | "closed" | null>(null);

  const shown = useMemo(
    () =>
      filter === "all"
        ? projects
        : projects.filter((p) => p.kind === filter),
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
              Projects,{" "}
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
            {filterOptions.map((f) => {
              const active = filter === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  aria-pressed={active}
                  className="focus-ring"
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
        aria-label={open ? `Collapse ${p.title}` : `Expand ${p.title}`}
        className="focus-ring"
        style={{
          all: "unset",
          cursor: "pointer",
          width: "100%",
          boxSizing: "border-box",
          display: "block",
        }}
      >
        {/* Mobile compact layout (visible below 480px, hidden at compact: and above) */}
        <span className="flex compact:hidden flex-col gap-1 w-full py-6 px-1">
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
          }}>
            {p.kind}{year ? ` · ${year}` : ""}
          </span>
        </span>

        {/* Desktop 5-column grid (hidden below 480px, shown at compact: and above) */}
        <span
          className="hidden compact:grid"
          style={{
            gridTemplateColumns: "56px 1.2fr 1fr 80px 28px",
            gap: 20,
            padding: "24px 4px",
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
        </span>
      </button>

      {open && (
        <div
          id={panelId}
          className="grid grid-cols-1 ms:grid-cols-[56px_1fr_1fr] gap-5"
          style={{
            padding: "8px 4px 36px",
            animation: "ms-fadein var(--anim-fadein)",
          }}
        >
          {/* Col 1 — spacer (desktop only) */}
          <div aria-hidden="true" className="hidden ms:block" />

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

            <RichText
              value={p.body}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "var(--text-body)",
                fontWeight: 400,
                lineHeight: 1.6,
                color: "var(--ms-fg)",
                maxWidth: 500,
              }}
            />

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

            {/* Meta strip — Client / Year / Case study link */}
            <div style={{
              marginTop: 24,
              display: "flex",
              gap: 20,
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}>
              {p.client?.trim() && (
                <div>
                  <div style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-mono)",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    color: "var(--ms-fg-faint)",
                  }}>Client</div>
                  <div style={{
                    marginTop: 4,
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-mono)",
                    color: "var(--ms-fg)",
                  }}>{p.client}</div>
                </div>
              )}
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
              {p.site && (
                <a
                  href={p.site}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${p.title} site (opens in new tab)`}
                  style={{
                    marginLeft: "auto",
                    color: "var(--ms-orange-text)",
                    display: "inline-flex",
                    alignItems: "center",
                    padding: 6,
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--ms-orange-dim)",
                    lineHeight: 1,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M1 13L13 1M13 1H5M13 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Col 3 — Metrics card + screenshot placeholder */}
          <div
            className="grid grid-cols-2 ms:grid-cols-3"
            style={{
              border: "1px solid var(--ms-border)",
              borderRadius: "var(--radius-lg)",
              padding: 20,
              background: "var(--ms-surface)",
              gap: 16,
            }}
          >
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

            {/* Cover image spans full grid width */}
            <div
              style={{
                gridColumn: "1 / -1",
                marginTop: 8,
                position: "relative",
                aspectRatio: "16 / 10",
                minHeight: 180,
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--ms-border)",
                overflow: "hidden",
                background: p.coverImageUrl
                  ? "var(--ms-bg)"
                  : "repeating-linear-gradient(45deg, var(--ms-bg-alt) 0 10px, var(--ms-surface) 10px 11px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {p.coverImageUrl ? (
                <Image
                  src={p.coverImageUrl}
                  alt={`${p.title ?? "Project"} cover`}
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              ) : (
                <span
                  aria-hidden="true"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-mono)",
                    color: "var(--ms-fg-faint)",
                    letterSpacing: 1,
                  }}
                >[{(p.title ?? "UNTITLED").toUpperCase()} · SCREENSHOT]</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
