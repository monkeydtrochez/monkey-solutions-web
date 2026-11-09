export const locales = ["sv", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "sv";

export const isLocale = (v: string): v is Locale =>
  (locales as readonly string[]).includes(v);

export const otherLocale = (l: Locale): Locale => (l === "sv" ? "en" : "sv");

export const hreflangCode: Record<Locale, "sv-SE" | "en"> = {
  sv: "sv-SE",
  en: "en",
};

export const ogLocale: Record<Locale, "sv_SE" | "en_GB"> = {
  sv: "sv_SE",
  en: "en_GB",
};

export const intlLocale: Record<Locale, "sv-SE" | "en-GB"> = {
  sv: "sv-SE",
  en: "en-GB",
};

export const SITE_URL = "https://monkeysolutions.se";
