"use client";
import { useState, useEffect, useContext } from "react";
import GlobalContext from "@/app/context/GlobalContext";
import { useI18n } from "@/lib/i18n/I18nProvider";

type FormState = { name: string; email: string; budget: string; project: string };
const EMPTY: FormState = { name: "", email: "", budget: "", project: "" };

export default function ContactSection() {
  const { lang, dict } = useI18n();
  const t = dict.contact;
  const ctx = useContext(GlobalContext);
  const profile = ctx?.profile;

  // Both resumes stay available; the one matching the page language comes first.
  const resumes = [
    { code: "en" as const, badge: "EN", label: t.resume.english, file: "resume_en.pdf", url: profile?.resumeEnUrl },
    { code: "sv" as const, badge: "SV", label: t.resume.swedish, file: "resume_sv.pdf", url: profile?.resumeSvUrl },
  ].sort((a, b) => Number(b.code === lang) - Number(a.code === lang));

  const [form, setForm] = useState<FormState>(EMPTY);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<"en" | "sv" | null>(null);

  useEffect(() => {
    if (!sent) return;
    const t = setTimeout(() => {
      setSent(false);
      setForm(EMPTY);
    }, 3500);
    return () => clearTimeout(t);
  }, [sent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, lang }),
      });
      if (!res.ok) throw new Error("non-2xx");
      setSent(true);
    } catch {
      setError(t.error);
    } finally {
      setSending(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: "8px 0",
    border: "none",
    borderBottom: "1.5px solid var(--ms-border-strong)",
    background: "transparent",
    fontFamily: "var(--font-sans)",
    fontSize: 16,
    color: "var(--ms-fg)",
    outline: "none",
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    resize: "vertical" as const,
    display: "block",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "var(--font-mono)",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: "1px",
    color: "var(--ms-fg-faint)",
    marginBottom: 8,
  };

  const fieldWrapperStyle: React.CSSProperties = {
    marginBottom: 24,
  };

  return (
    <section
      id="contact"
      style={{
        padding: "var(--section-py-contact) var(--page-px) 100px",
        background: "var(--ms-bg)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow — decorative */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-10%",
          top: "5%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(var(--ms-orange-dim) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Inner wrapper */}
      <div style={{ maxWidth: "var(--content-max)", margin: "0 auto" }}>
        {/* Two-column grid */}
        <div
          className="grid grid-cols-1 ms:grid-cols-[1fr_1.1fr]"
          style={{ gap: 80 }}
        >
          {/* ── LEFT COLUMN ── */}
          <div>
            {/* Kicker row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                letterSpacing: 1,
              }}
            >
              <span style={{ color: "var(--ms-orange-text)", fontWeight: 600 }}>06</span>
              <span
                aria-hidden="true"
                style={{
                  width: 28,
                  height: 1,
                  background: "var(--ms-border-strong)",
                }}
              />
              <span style={{ color: "var(--ms-fg-soft)", textTransform: "uppercase" }}>
                {t.kicker}
              </span>
            </div>

            {/* H2 */}
            <h2
              style={{
                marginTop: 24,
                fontSize: "clamp(48px, 7vw, 108px)",
                lineHeight: 0.9,
                fontWeight: 800,
                color: "var(--ms-fg)",
                fontFamily: "var(--font-sans)",
                letterSpacing: "-0.04em",
              }}
            >
              {t.h2.pre}
              <br />
              <em
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontWeight: 300,
                  color: "var(--ms-orange-text)",
                }}
              >
                {t.h2.em}
              </em>{" "}
              {t.h2.post}
            </h2>

            {/* Lede paragraph */}
            <p
              style={{
                marginTop: 24,
                fontSize: 17,
                lineHeight: 1.6,
                color: "var(--ms-fg-soft)",
                maxWidth: 460,
              }}
            >
              {t.lede}
            </p>

            {/* Direct links */}
            <div
              style={{
                marginTop: 40,
                display: "flex",
                flexDirection: "column",
                gap: 16,
                fontFamily: "var(--font-mono)",
                fontSize: 13,
              }}
            >
              {/* Email */}
              <a
                href={`mailto:${profile?.email ?? ""}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  textDecoration: "none",
                  color: "var(--ms-fg)",
                }}
              >
                <span aria-hidden="true" style={{ fontSize: 11, color: "var(--ms-fg-faint)" }}>
                  ✉
                </span>
                <span
                  style={{
                    borderBottom: "1px solid var(--ms-border-strong)",
                    paddingBottom: 2,
                  }}
                >
                  {profile?.email ?? "—"}
                </span>
                <span style={{ marginLeft: "auto", color: "var(--ms-orange-text)" }}>↗</span>
              </a>

              {/* LinkedIn */}
              <a
                href={profile?.linkedInUrl ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  textDecoration: "none",
                  color: "var(--ms-fg)",
                }}
              >
                <span aria-hidden="true" style={{ fontSize: 11, color: "var(--ms-fg-faint)" }}>
                  in
                </span>
                <span
                  style={{
                    borderBottom: "1px solid var(--ms-border-strong)",
                    paddingBottom: 2,
                  }}
                >
                  {profile?.linkedInUrl
                    ? (() => {
                        try {
                          const u = new URL(profile.linkedInUrl);
                          return (u.hostname + u.pathname).replace(/^www\./, "").replace(/\/$/, "");
                        } catch {
                          return profile.linkedInUrl;
                        }
                      })()
                    : "—"}
                </span>
                <span style={{ marginLeft: "auto", color: "var(--ms-orange-text)" }}>↗</span>
              </a>

              {/* GitHub */}
              <a
                href={profile?.githubUrl ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  textDecoration: "none",
                  color: "var(--ms-fg)",
                }}
              >
                <span aria-hidden="true" style={{ fontSize: 11, color: "var(--ms-fg-faint)" }}>
                  gh
                </span>
                <span
                  style={{
                    borderBottom: "1px solid var(--ms-border-strong)",
                    paddingBottom: 2,
                  }}
                >
                  {profile?.githubUrl
                    ? (() => {
                        try {
                          const u = new URL(profile.githubUrl);
                          return (u.hostname + u.pathname).replace(/^www\./, "").replace(/\/$/, "");
                        } catch {
                          return profile.githubUrl;
                        }
                      })()
                    : "—"}
                </span>
                <span style={{ marginLeft: "auto", color: "var(--ms-orange-text)" }}>↗</span>
              </a>
            </div>

            {/* Resume download card */}
            <div
              style={{
                marginTop: 56,
                padding: 24,
                border: "1px solid var(--ms-border-strong)",
                borderRadius: "var(--radius-xl)",
                background: "var(--ms-surface)",
              }}
            >
              {/* Card header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--ms-orange-text)",
                  }}
                >
                  {t.resume.kicker}
                </span>
                <span
                  aria-hidden="true"
                  style={{
                    flex: 1,
                    height: 1,
                    background: "var(--ms-border-strong)",
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "var(--ms-fg-faint)",
                  }}
                >
                  pdf · v2026.04
                </span>
              </div>

              {/* Description */}
              <p
                style={{
                  fontSize: 14,
                  color: "var(--ms-fg-soft)",
                  lineHeight: 1.5,
                  marginBottom: 16,
                }}
              >
                {t.resume.description}
              </p>

              {/* Download buttons grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
                  gap: 8,
                }}
              >
                {resumes.map((r) => (
                  <a
                    key={r.code}
                    href={r.url ? `${r.url}?dl=${r.file}` : `/${r.file}`}
                    download={r.file}
                    onMouseEnter={() => setHoveredCard(r.code)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className="resume-download-card"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 16,
                      padding: 16,
                      border: `1px solid ${hoveredCard === r.code ? "var(--ms-orange)" : "var(--ms-border-strong)"}`,
                      borderRadius: "var(--radius-lg)",
                      background: hoveredCard === r.code ? "var(--ms-mist)" : "var(--ms-bg)",
                      textDecoration: "none",
                      transition: "border-color var(--anim-hover), background var(--anim-hover)",
                    }}
                  >
                    {/* Language badge */}
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid var(--ms-orange)",
                        color: "var(--ms-orange-text)",
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        fontWeight: 700,
                        borderRadius: "var(--radius-sm)",
                        flexShrink: 0,
                      }}
                    >
                      {r.badge}
                    </div>
                    {/* Middle block */}
                    <div className="resume-download-text" style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: 14,
                          fontWeight: 600,
                          color: "var(--ms-fg)",
                        }}
                      >
                        {r.label}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 10,
                          color: "var(--ms-fg-faint)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {r.file}
                      </div>
                    </div>
                    {/* Arrow */}
                    <span style={{ color: "var(--ms-orange-text)" }}>↓</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN — Form card ── */}
          <form
            onSubmit={handleSubmit}
            style={{
              padding: 40,
              border: "1px solid var(--ms-border-strong)",
              borderRadius: "var(--radius-2xl)",
              background: "var(--ms-surface)",
              position: "relative",
            }}
          >
            {/* Card header — traffic-light dots */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 28,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: `hsl(var(--color-tl-red))`,
                  display: "inline-block",
                }}
              />
              <span
                aria-hidden="true"
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: `hsl(var(--color-tl-yellow))`,
                  display: "inline-block",
                }}
              />
              <span
                aria-hidden="true"
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: `hsl(var(--color-tl-green))`,
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  marginLeft: 8,
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--ms-fg-faint)",
                }}
              >
                ./new_project.sh
              </span>
            </div>

            {/* Name field */}
            <div style={fieldWrapperStyle}>
              <label htmlFor="field-name" style={labelStyle}>
                {t.fields.name.label}
              </label>
              <input
                id="field-name"
                type="text"
                placeholder={t.fields.name.placeholder}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                onFocus={(e) => (e.currentTarget.style.borderBottomColor = "var(--ms-orange)")}
                onBlur={(e) =>
                  (e.currentTarget.style.borderBottomColor = "var(--ms-border-strong)")
                }
                className="focus-ring"
                style={inputStyle}
              />
            </div>

            {/* Email field */}
            <div style={fieldWrapperStyle}>
              <label htmlFor="field-email" style={labelStyle}>
                {t.fields.email.label}
              </label>
              <input
                id="field-email"
                type="email"
                placeholder={t.fields.email.placeholder}
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                onFocus={(e) => (e.currentTarget.style.borderBottomColor = "var(--ms-orange)")}
                onBlur={(e) =>
                  (e.currentTarget.style.borderBottomColor = "var(--ms-border-strong)")
                }
                className="focus-ring"
                style={inputStyle}
              />
            </div>

            {/* Budget field — plain text input (D-05) */}
            <div style={fieldWrapperStyle}>
              <label htmlFor="field-budget" style={labelStyle}>
                {t.fields.budget.label}
              </label>
              <input
                id="field-budget"
                type="text"
                placeholder={t.fields.budget.placeholder}
                value={form.budget}
                onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
                onFocus={(e) => (e.currentTarget.style.borderBottomColor = "var(--ms-orange)")}
                onBlur={(e) =>
                  (e.currentTarget.style.borderBottomColor = "var(--ms-border-strong)")
                }
                className="focus-ring"
                style={inputStyle}
              />
            </div>

            {/* Project field — textarea */}
            <div style={fieldWrapperStyle}>
              <label htmlFor="field-project" style={labelStyle}>
                {t.fields.project.label}
              </label>
              <textarea
                id="field-project"
                rows={4}
                placeholder={t.fields.project.placeholder}
                value={form.project}
                onChange={(e) => setForm((f) => ({ ...f, project: e.target.value }))}
                onFocus={(e) => (e.currentTarget.style.borderBottomColor = "var(--ms-orange)")}
                onBlur={(e) =>
                  (e.currentTarget.style.borderBottomColor = "var(--ms-border-strong)")
                }
                className="focus-ring"
                style={textareaStyle}
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={sending}
              className="focus-ring"
              style={{
                marginTop: 8,
                width: "100%",
                padding: "16px 20px",
                border: "none",
                cursor: sending ? "not-allowed" : "pointer",
                background: sent ? "#27c93f" : "var(--ms-orange)",
                color: "var(--ms-bg)",
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.5px",
                borderRadius: "var(--radius-lg)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                transition: "background 0.2s",
              }}
            >
              {sent ? t.sent : "$ send_message →"}
            </button>

            {/* Sub-label below button */}
            <p
              style={{
                marginTop: 12,
                textAlign: "center",
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--ms-fg-faint)",
              }}
            >
              {t.orEmail}
            </p>

            {/* Error display */}
            {error && (
              <p
                style={{
                  marginTop: 8,
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--destructive)",
                  textAlign: "center",
                }}
              >
                {error}
              </p>
            )}

            {/* Accessible live region — always present in DOM; receives text when form is submitted */}
            <div
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="sr-only"
            >
              {sent ? t.sentLive : ""}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
