import type { Metadata } from "next";
import "./globals.css";
import { inter, jetbrainsMono, fraunces } from "./fonts";
import { THEME_SCRIPT } from "./themeScript";
import NotFoundContent from "@/components/NotFoundContent";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { hreflangCode } from "@/lib/i18n/config";
import { routes } from "@/lib/i18n/routes";

const sv = getDictionary("sv");
const en = getDictionary("en");

export const metadata: Metadata = {
  title: `${sv.notFound.title} | Monkey Solutions`,
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html
      lang="sv"
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
        <NotFoundContent
          title={sv.notFound.title}
          body={sv.notFound.body}
          links={[
            { href: routes.home.paths.sv, label: sv.notFound.homeLink },
            {
              href: routes.home.paths.en,
              label: en.notFound.homeLink,
              hrefLang: hreflangCode.en,
              lang: "en",
            },
          ]}
        />
      </body>
    </html>
  );
}
