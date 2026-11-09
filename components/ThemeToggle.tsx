"use client";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

type Theme = "dark" | "light";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const saved = localStorage.getItem("ms_theme") as Theme | null;
    if (saved === "light" || saved === "dark") return saved;
  } catch {}
  return "light";
}

export function ThemeToggle() {
  const t = useI18n().dict.theme;
  // Always start with "light" so SSR and initial client render match.
  // The real saved preference is applied after mount to avoid hydration mismatch.
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    const saved = getInitialTheme();
    document.documentElement.dataset.theme = saved;
    // Use a scheduler to avoid calling setState synchronously in effect body
    const id = setTimeout(() => {
      setMounted(true);
      setTheme(saved);
    }, 0);
    return () => clearTimeout(id);
  }, []);

  function applyTheme(next: Theme) {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("ms_theme", next);
    } catch {}
    setTheme(next);
  }

  const buttonBase: React.CSSProperties = {
    borderRadius: "18px",
    padding: "8px 16px",
    fontFamily: "var(--font-mono)",
    fontSize: "var(--text-label)",
    fontWeight: 400,
    border: "none",
    cursor: "pointer",
    transition:
      "background-color var(--anim-hover), color var(--anim-hover)",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  };

  function styleFor(target: Theme): React.CSSProperties {
    const isActive = theme === target;
    return {
      ...buttonBase,
      background: isActive ? "var(--ms-fg)" : "transparent",
      color: isActive ? "var(--ms-bg)" : "var(--ms-fg-soft)",
    };
  }

  // Render a size-identical placeholder until mounted to prevent hydration mismatch.
  if (!mounted) {
    return <div style={{ width: 120, height: 40 }} aria-hidden />;
  }

  return (
    <div
      role="group"
      aria-label={t.group}
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: "20px",
        border: "1px solid var(--ms-border)",
        padding: 2,
      }}
    >
      <button
        type="button"
        onClick={() => applyTheme("dark")}
        aria-label={t.toDark}
        aria-pressed={theme === "dark"}
        style={styleFor("dark")}
      >
        <span aria-hidden="true">☾</span> {t.dark}
      </button>
      <button
        type="button"
        onClick={() => applyTheme("light")}
        aria-label={t.toLight}
        aria-pressed={theme === "light"}
        style={styleFor("light")}
      >
        <span aria-hidden="true">☀</span> {t.light}
      </button>
    </div>
  );
}
