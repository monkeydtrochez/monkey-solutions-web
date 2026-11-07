import { ImageResponse } from "next/og";
import { isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";

// Served from /api/og/<lang> so public page URLs never contain /sv.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const BG = "#0d0b09"; // --ms-bg (dark)
const ORANGE = "#ff6b1a"; // --ms-orange (dark)

export async function GET(_request: Request, { params }: RouteContext<"/api/og/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) return new Response("Not found", { status: 404 });
  const { ogTagline } = getDictionary(lang).meta;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 96,
          background: BG,
          color: ORANGE,
        }}
      >
        <div style={{ fontSize: 40, letterSpacing: 2 }}>monkey/solutions</div>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1, marginTop: 32 }}>
          {ogTagline}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
