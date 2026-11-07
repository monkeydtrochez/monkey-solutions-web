import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/i18n/config";
import { languageAlternates, livePages } from "@/lib/i18n/routes";

const absolute = (path: string) => SITE_URL + path;

export function buildSitemap(): MetadataRoute.Sitemap {
  return livePages().map(({ key, path }) => {
    const languages = Object.fromEntries(
      Object.entries(languageAlternates(key)).map(([code, p]) => [code, absolute(p)])
    );
    return {
      url: absolute(path),
      ...(Object.keys(languages).length > 0 ? { alternates: { languages } } : {}),
    };
  });
}
