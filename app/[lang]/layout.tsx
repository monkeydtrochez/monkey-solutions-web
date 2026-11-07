import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { inter, jetbrainsMono, fraunces } from "../fonts";
import { THEME_SCRIPT } from "../themeScript";
import { GlobalContextProvider } from "../context/GlobalContext";
import BackToTop from "@/components/BackToTop";
import SmoothScroll from "@/components/SmoothScroll";
import { isLocale, locales, SITE_URL } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import { loadSanityData } from "@/lib/api/sanityDataLoader";
import { normalizeSanityData } from "@/lib/content/normalize";
import { buildProfessionalServiceJsonLd } from "@/lib/seo/jsonLd";

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { meta } = getDictionary(lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: meta.title, template: "%s | Monkey Solutions" },
    description: meta.description,
  };
}

// No `dynamicParams = false` here: with it, on-demand revalidation (Sanity
// webhook → revalidatePath) regenerates /sv and /en as cached 404s
// (NoFallbackError). Unknown values never reach this layout through the proxy,
// and the isLocale guard below 404s any that do.
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const content = normalizeSanityData(await loadSanityData(lang));
  const jsonLd = buildProfessionalServiceJsonLd(lang, content.profile);

  return (
    <html
      lang={lang}
      data-theme="light"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} ${fraunces.variable}`}
    >
      <head>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
        />
      </head>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <I18nProvider lang={lang} dict={getDictionary(lang)}>
          <GlobalContextProvider initialData={content}>
            {children}
            <SmoothScroll />
            <BackToTop />
          </GlobalContextProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
