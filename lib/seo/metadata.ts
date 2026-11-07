import type { Metadata } from "next";
import { ogLocale, otherLocale, type Locale } from "@/lib/i18n/config";
import { languageAlternates, pathFor, type PageKey } from "@/lib/i18n/routes";
import { BUSINESS_NAME } from "./business";

// Page titles already carry the brand suffix (SEO plan), so they are absolute.
// Next merges openGraph shallowly, so every page gets the full object.
export function buildPageMetadata({
  key,
  lang,
  title,
  description,
}: {
  key: PageKey;
  lang: Locale;
  title: string;
  description: string;
}): Metadata {
  const path = pathFor(key, lang) ?? undefined;
  const languages = languageAlternates(key);
  const bilingual = Object.keys(languages).length > 0;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path, languages },
    openGraph: {
      type: "website",
      siteName: BUSINESS_NAME,
      url: path,
      title,
      description,
      locale: ogLocale[lang],
      alternateLocale: bilingual ? [ogLocale[otherLocale(lang)]] : [],
      images: [{ url: `/api/og/${lang}`, width: 1200, height: 630 }],
    },
  };
}
