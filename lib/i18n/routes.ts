import { hreflangCode, locales, otherLocale, type Locale } from "./config";

export type PageKey =
  | "home"
  | "website"
  | "webshop"
  | "shopify"
  | "integrations"
  | "weddingWebsite"
  | "about";

type RouteEntry = { paths: Record<Locale, string>; live: Locale[] };

// The only place slugs are defined. A page is reachable in a language only
// when that language is listed in `live`.
export const routes: Record<PageKey, RouteEntry> = {
  home: { paths: { sv: "/", en: "/en" }, live: ["sv", "en"] },
  website: { paths: { sv: "/hemsida", en: "/en/website" }, live: [] },
  webshop: { paths: { sv: "/webshop", en: "/en/webshop" }, live: [] },
  shopify: { paths: { sv: "/shopify", en: "/en/shopify" }, live: [] },
  integrations: {
    paths: { sv: "/integrationer", en: "/en/integrations" },
    live: [],
  },
  weddingWebsite: {
    paths: { sv: "/brollopshemsida", en: "/en/wedding-website" },
    live: [],
  },
  about: { paths: { sv: "/om-mig", en: "/en/about" }, live: [] },
};

const pageKeys = Object.keys(routes) as PageKey[];

export function pathFor(key: PageKey, lang: Locale): string | null {
  const route = routes[key];
  return route.live.includes(lang) ? route.paths[lang] : null;
}

const slugOf = (path: string) => path.split("/").filter(Boolean).pop() ?? "";

export function pageKeyForSlug(lang: Locale, slug: string): PageKey | null {
  return (
    pageKeys.find(
      (key) =>
        key !== "home" &&
        routes[key].live.includes(lang) &&
        slugOf(routes[key].paths[lang]) === slug
    ) ?? null
  );
}

export function liveSlugs(lang: Locale): string[] {
  return pageKeys
    .filter((key) => key !== "home" && routes[key].live.includes(lang))
    .map((key) => slugOf(routes[key].paths[lang]));
}

export function livePages(): { key: PageKey; lang: Locale; path: string }[] {
  return pageKeys.flatMap((key) =>
    locales
      .filter((lang) => routes[key].live.includes(lang))
      .map((lang) => ({ key, lang, path: routes[key].paths[lang] }))
  );
}

export function languageAlternates(key: PageKey): Record<string, string> {
  const sv = pathFor(key, "sv");
  const en = pathFor(key, "en");
  if (sv === null || en === null) return {};
  return { [hreflangCode.sv]: sv, [hreflangCode.en]: en, "x-default": sv };
}

export function switchTarget(key: PageKey, lang: Locale): string {
  const other = otherLocale(lang);
  return pathFor(key, other) ?? routes.home.paths[other];
}

export function withHash(path: string, hash: string): string {
  if (!hash || hash === "#") return path;
  return path + (hash.startsWith("#") ? hash : `#${hash}`);
}
