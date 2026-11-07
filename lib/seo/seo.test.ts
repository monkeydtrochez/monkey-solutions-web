import { describe, expect, it } from "vitest";
import { buildPageMetadata } from "./metadata";
import { buildProfessionalServiceJsonLd } from "./jsonLd";
import { buildSitemap } from "./sitemap";
import type { Profile } from "@/app/models/sanityTypes";

const profile = {
  _id: "p",
  _type: "profile",
  title: "Profile",
  email: "daniel@monkeysolutions.se",
  mobile: "",
  linkedInUrl: "https://www.linkedin.com/in/daniel",
  githubUrl: "https://github.com/monkeydtrochez",
} as Profile;

describe("buildPageMetadata", () => {
  it("gives the Swedish home page a root canonical and three hreflang links", () => {
    const meta = buildPageMetadata({ key: "home", lang: "sv", title: "T", description: "D" });
    expect(meta.title).toEqual({ absolute: "T" });
    expect(meta.description).toBe("D");
    expect(meta.alternates?.canonical).toBe("/");
    expect(meta.alternates?.languages).toEqual({ "sv-SE": "/", en: "/en", "x-default": "/" });
    expect(meta.openGraph).toMatchObject({
      type: "website",
      siteName: "Monkey Solutions",
      url: "/",
      title: "T",
      description: "D",
      locale: "sv_SE",
      alternateLocale: ["en_GB"],
      images: [{ url: "/api/og/sv", width: 1200, height: 630 }],
    });
  });

  it("gives the English home page an /en canonical", () => {
    const meta = buildPageMetadata({ key: "home", lang: "en", title: "T", description: "D" });
    expect(meta.alternates?.canonical).toBe("/en");
    expect(meta.openGraph).toMatchObject({ url: "/en", locale: "en_GB", alternateLocale: ["sv_SE"] });
  });
});

describe("buildProfessionalServiceJsonLd", () => {
  it("omits telephone when there is no mobile and lists Instagram first", () => {
    const ld = buildProfessionalServiceJsonLd("sv", profile) as Record<string, unknown>;
    expect(ld["@type"]).toBe("ProfessionalService");
    expect(ld.url).toBe("https://monkeysolutions.se/");
    expect(ld.logo).toBe("https://monkeysolutions.se/logo.png");
    expect(ld.email).toBe("daniel@monkeysolutions.se");
    expect("telephone" in ld).toBe(false);
    expect("address" in ld).toBe(false);
    expect(ld.sameAs).toEqual([
      "https://www.instagram.com/_monkeysolutions/",
      "https://www.linkedin.com/in/daniel",
      "https://github.com/monkeydtrochez",
    ]);
    expect((ld.areaServed as unknown[])[0]).toEqual({ "@type": "City", name: "Göteborg" });
    expect(ld.inLanguage).toBe("sv-SE");
  });

  it("includes telephone when mobile is set and works without a profile", () => {
    const ld = buildProfessionalServiceJsonLd("en", { ...profile, mobile: "+46 70 000 00 00" });
    expect(ld).toMatchObject({ telephone: "+46 70 000 00 00", url: "https://monkeysolutions.se/en" });
    const bare = buildProfessionalServiceJsonLd("sv", null) as Record<string, unknown>;
    expect(bare.sameAs).toEqual(["https://www.instagram.com/_monkeysolutions/"]);
    expect("email" in bare).toBe(false);
  });
});

describe("buildSitemap", () => {
  it("lists each live page once per language with mutual absolute alternates", () => {
    const sitemap = buildSitemap();
    expect(sitemap.map((e) => e.url)).toEqual([
      "https://monkeysolutions.se/",
      "https://monkeysolutions.se/en",
    ]);
    for (const entry of sitemap) {
      expect(entry.alternates?.languages).toEqual({
        "sv-SE": "https://monkeysolutions.se/",
        en: "https://monkeysolutions.se/en",
        "x-default": "https://monkeysolutions.se/",
      });
    }
    expect(JSON.stringify(sitemap)).not.toMatch(/\/sv\b/);
  });
});
