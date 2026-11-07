import type { Profile } from "@/app/models/sanityTypes";
import { hreflangCode, locales, SITE_URL, type Locale } from "@/lib/i18n/config";
import { routes } from "@/lib/i18n/routes";
import { AREA_SERVED, BUSINESS_NAME, INSTAGRAM_URL, LOGO_PATH } from "./business";

// Local business markup for the home page. No street address: the business
// serves customers at their location (areaServed) rather than at an office.
export function buildProfessionalServiceJsonLd(
  lang: Locale,
  profile: Profile | null
): Record<string, unknown> {
  const email = profile?.email?.trim();
  const telephone = profile?.mobile?.trim();
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: BUSINESS_NAME,
    url: SITE_URL + routes.home.paths[lang],
    logo: SITE_URL + LOGO_PATH,
    ...(email ? { email } : {}),
    ...(telephone ? { telephone } : {}),
    areaServed: AREA_SERVED.map((name) => ({ "@type": "City", name })),
    sameAs: [INSTAGRAM_URL, profile?.linkedInUrl, profile?.githubUrl].filter(
      (url): url is string => Boolean(url)
    ),
    inLanguage: hreflangCode[lang],
    availableLanguage: [...locales],
  };
}
