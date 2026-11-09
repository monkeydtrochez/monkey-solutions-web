"use client";
import type { CSSProperties } from "react";
import { hreflangCode, otherLocale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { switchTarget, withHash, type PageKey } from "@/lib/i18n/routes";

// A plain link so it works without JS. On click it carries the current section
// anchor over (/#work → /en#work) by rewriting href before the browser follows it.
// `compact` shows the language code (EN/SV) where the desktop header is tight;
// the full language name stays the accessible name.
export default function LanguageSwitch({
  pageKey,
  tabIndex,
  compact = false,
}: {
  pageKey: PageKey;
  tabIndex?: number;
  compact?: boolean;
}) {
  const { lang, dict } = useI18n();
  const other = otherLocale(lang);
  const target = switchTarget(pageKey, lang);

  return (
    <a
      href={target}
      hrefLang={hreflangCode[other]}
      lang={other}
      tabIndex={tabIndex}
      aria-label={compact ? dict.common.languageSwitch : undefined}
      onClick={(e) => {
        e.currentTarget.href = withHash(target, window.location.hash);
      }}
      className="focus-ring"
      style={linkStyle}
    >
      {compact ? other.toUpperCase() : dict.common.languageSwitch}
    </a>
  );
}

const linkStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  fontFamily: "var(--font-mono)",
  fontSize: "var(--text-mono)",
  fontWeight: 400,
  color: "var(--ms-fg-soft)",
  textDecoration: "none",
  letterSpacing: "0.3px",
  whiteSpace: "nowrap",
};
