"use client";
import NotFoundContent from "@/components/NotFoundContent";
import { hreflangCode, otherLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { routes } from "@/lib/i18n/routes";

export default function NotFound() {
  const { lang, dict } = useI18n();
  const other = otherLocale(lang);
  return (
    <NotFoundContent
      title={dict.notFound.title}
      body={dict.notFound.body}
      links={[
        { href: routes.home.paths[lang], label: dict.notFound.homeLink },
        {
          href: routes.home.paths[other],
          label: getDictionary(other).notFound.homeLink,
          hrefLang: hreflangCode[other],
          lang: other,
        },
      ]}
    />
  );
}
