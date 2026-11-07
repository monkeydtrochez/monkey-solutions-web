import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { inter, jetbrainsMono, fraunces } from "../fonts";
import { THEME_SCRIPT } from "../themeScript";
import { GlobalContextProvider } from "../context/GlobalContext";
import BackToTop from "@/components/BackToTop";
import SmoothScroll from "@/components/SmoothScroll";
import { isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import { loadSanityData } from "@/lib/api/sanityDataLoader";
import { normalizeSanityData } from "@/lib/content/normalize";

export const metadata: Metadata = {
  title: "Monkey Solutions",
  description: "Developed by Monkey Solutions AB",
};

export const dynamicParams = false;

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
