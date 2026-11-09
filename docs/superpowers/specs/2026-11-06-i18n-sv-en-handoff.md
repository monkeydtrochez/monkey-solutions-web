# Developer handoff: monkeysolutions.se på svenska och engelska

Nov 6, 2026 · @Daniel Trochez

Bygg om monkey-solutions-web så att svenska är huvudspråket på `/` och engelska ligger på `/en`, med korrekt `lang`, hreflang och server-renderad text på båda språken. Bygger på repot `monkeydtrochez/monkey-solutions-web` (senaste commit 17f2e66, 18 juni 2026) och SEO-planen i första fliken.

## Mål och avgränsning

Målet är att Google ska se en svensk sajt för svenska sökningar, och en engelsk version för konsultuppdrag, utan att de konkurrerar med varandra.

Ingår:

- Språkrouting: svenska på roten, engelska under `/en`.
- All hårdkodad UI-text i `components/` flyttad till ordböcker för `sv` och `en`.
- Översättningsbara fält i Sanity, med engelska som reserv när svenska saknas.
- Metadata, `hreflang`, canonical, sitemap, robots och JSON-LD per språk.
- Server-renderad text (förutsättning, se Steg 0).
- En språkväxlare som länkar till samma sida på andra språket.

Ingår inte (egna steg i SEO-planen):

- Själva texterna på de nya tjänstesidorna (/hemsida, /webshop osv.). Routingen ska däremot vara förberedd för dem, se Routing.
- Google-företagsprofil, kataloger och Search Console.
- Ny design. Utseendet ska vara oförändrat, bara språket byts.

Regler från repots CLAUDE.md gäller, bland annat: inga AI-attributionsrader i commits, håll `app/models/sanityTypes.ts` i synk med `sanity/schemaTypes/`, och lägg nya färger i `globals.css`.

## URL-struktur

Svenska ligger utan prefix på roten och engelska under `/en`. Det gör att dagens adress monkeysolutions.se blir den svenska sidan, och varje sida har exakt en URL per språk.

| URL | Svarar med | Kommentar |
| --- | --- | --- |
| `/` | Svensk startsida, 200 | Internt omskriven till `/sv` av proxyn |
| `/en` | Engelsk startsida, 200 |  |
| `/sv`, `/sv/...` | 308 till samma sökväg utan `/sv` | Undviker dubbletter |
| `/hemsida`, `/webshop`, `/shopify`, `/integrationer`, `/brollopshemsida`, `/om-mig` | Svensk sida, 200 | Svenska slugs |
| `/en/website`, `/en/webshop`, `/en/shopify`, `/en/integrations`, `/en/wedding-website`, `/en/about` | Engelsk sida, 200 | Engelska slugs, samma sida på andra språket |
| `/api/*`, `/_next/*`, filer i `public/` | Oförändrat | Proxyn rör dem inte |

Tre regler:

1. Ingen automatisk omdirigering efter `Accept-Language` eller IP. Googlebot kommer oftast utan svensk språkinställning och måste kunna läsa `/` som svensk sida. Språkväxlaren är enda vägen mellan språken.
2. Inga cookies som styr språket. URL:en bestämmer alltid.
3. Ankarlänkarna (`#about`, `#work` osv.) behåller sina id:n på båda språken, bara menytexten översätts.

## Steg 0: rendera innehållet på servern

Gör detta först, annars syns ingen svensk Sanity-text i HTML:en och språkbytet ger nästan ingen SEO-effekt.

Idag hämtar `app/page.tsx` datan på servern, men `components/wrappers/DataHydrator.tsx` lägger in den i `GlobalContext` först i en `useEffect`. Den första HTML:en saknar därför bio, projekt och erfarenhet.

1. Flytta sorteringen och filtreringen ur `setSiteContentToContext` till en ren funktion, till exempel `lib/content/normalize.ts`, som tar `SanityApiResponse[]` och returnerar `{ profile, education, workExperience, projects }`.
2. Ge `GlobalContextProvider` en prop `initialData` och använd den som startvärde i `useState`.
3. Rendera providern i sidan (eller språklayouten) med datan från `loadSanityData(lang)`, inte i rotlayouten utan data.
4. Ta bort `DataHydrator`.
5. Ta bort `export const dynamic = "force-dynamic"` och låt sidorna cachas. Revalidering sker via webhooken, se Cache.

Klart när: `curl -s http://localhost:3000/ | grep` hittar en mening ur `heroBio` och titeln på ett projekt.

## Routing och filstruktur

Använd ett `[lang]`-segment i App Router och en proxy som skriver om svenska URL:er internt. Inget i18n-bibliotek behövs för två språk; välj next-intl bara om det visar sig spara mycket kod.

```text
app/
  [lang]/
    layout.tsx         # rotlayout: <html lang={lang}>, fonter, temascript, providers
    page.tsx           # startsidan
    [slug]/page.tsx    # tjänstesidor + om-mig, slug per språk
    not-found.tsx
  api/                 # oförändrat (contact, revalidate)
  sitemap.ts
  robots.ts
proxy.ts
lib/i18n/
  config.ts            # locales = ["sv", "en"], defaultLocale = "sv", isLocale()
  routes.ts            # pageKey -> { sv: "/hemsida", en: "/en/website" }
  dictionaries/sv.ts
  dictionaries/en.ts
  getDictionary.ts
```

Detaljer:

- `app/layout.tsx` försvinner; `app/[lang]/layout.tsx` blir rotlayout så att `<html lang>` kan sättas per språk. Flytta `globals.css`, fonterna, temascriptet, `SmoothScroll` och `BackToTop` dit.
- `generateStaticParams` returnerar `[{ lang: "sv" }, { lang: "en" }]`, och `export const dynamicParams = false`.
- I Next.js 16 är `params` ett Promise: `const { lang } = await params`.
- `[slug]/page.tsx` slår upp sluggen i `routes.ts` för aktuellt språk och anropar `notFound()` om den saknas. Sidor utan färdig text lämnas utanför `generateStaticParams` och sitemapen tills innehållet finns.
- `routes.ts` är enda stället där slugs står. Meny, språkväxlare, hreflang och sitemap läser alla därifrån.

Proxy (Next.js 16 döpte om `middleware.ts` till `proxy.ts`; kontrollera mot den installerade versionens dokumentation):

```ts
// proxy.ts
import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/sv" || pathname.startsWith("/sv/")) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.replace(/^\/sv/, "") || "/";
    return NextResponse.redirect(url, 308);
  }
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return NextResponse.next();
  }
  const url = req.nextUrl.clone();
  url.pathname = `/sv${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|.*\\..*).*)"],
};
```

## UI-texter: ordböcker

All text som står i komponenterna flyttas till två typade ordböcker, med svenska som källa och engelska tvingad att ha samma nycklar.

```ts
// lib/i18n/dictionaries/sv.ts
export const sv = {
  nav: { about: "om mig", work: "projekt", experience: "erfarenhet", skills: "kunskaper", services: "tjänster", contact: "kontakt" },
  services: { kicker: "TJÄNSTER", /* ... */ },
  contact: { /* rubriker, fält, felmeddelanden, tack-text */ },
  common: { languageSwitch: "English", backToTop: "Till toppen", /* ... */ },
} as const;

// lib/i18n/dictionaries/en.ts
import type { Dictionary } from "./types"; // Dictionary = DeepStringify<typeof sv>
export const en: Dictionary = { /* samma nycklar */ };
```

- De flesta komponenter är `"use client"`. Lägg en `I18nProvider` med `{ lang, dict }` i `app/[lang]/layout.tsx` och en hook `useI18n()`. Serverkomponenter anropar `getDictionary(lang)` direkt.
- Gå igenom alla filer i `components/`: `SiteHeader` (`NAV_ITEMS`), `HeroSection`, `AboutSection`, `WorkSection`, `ExperienceSection`, `SkillsSection`, `ServicesSection`, `ContactSection`, `FooterSection`, `TerminalCard`, `ThemeToggle`, `BackToTop`.
- Glöm inte `aria-label`, `alt`, `title`, placeholders, valideringsfel och statusmeddelanden i kontaktformuläret.
- Datum och siffror formateras med `Intl` och `sv-SE` respektive `en-GB`.
- CV-länken pekar på `resumeSvUrl` på svenska och `resumeEnUrl` på engelska.
- E-postmeddelandet som `app/api/contact/route.ts` skickar till Daniel får vara kvar som det är, men skicka med vilket språk förfrågan kom från.
- Svenska texter på startsidan (H1, ingress, tjänster) tas från SEO-planens tabell ”Sidstruktur”. Skriv dem inte fritt.

Klart när: `grep` efter engelska ord i `components/` bara hittar kod, inte synlig text.

## Sanity: svenska fält

Lägg till svenska syskonfält med suffixet `Sv` och låt de befintliga fälten vara de engelska. Då behövs ingen datamigrering, och sajten visar engelska tills den svenska texten är ifylld.

| Dokument | Fält som får en `Sv`-variant | Kommentar |
| --- | --- | --- |
| `profile` | `heroBio`, `description`, `availabilityStatus`, `location`, `languages`, `personalitySkills`, `communityWork[].assignment` | `skillGroups[].category` översätts i ordboken, inte i Sanity |
| `project` | `title`, `body`, `kind`, `metrics[].label`, `metrics[].suffix` | `client`, `site`, `tags` och bilder är gemensamma |
| `workExperience` | `title`, `description` | `company`, `duration` gemensamma |
| `education` | `title`, `fieldOfStudy` | `school` gemensam |

Så här:

1. Lägg till fälten i `sanity/schemaTypes/*.ts` direkt efter sitt engelska fält, med titel som ”Hero Bio (svenska)”. Gruppera gärna med `fieldsets` ”Svenska”.
2. Gör `loadSanityData(lang)` i `lib/api/sanityDataLoader.ts` språkberoende. För `sv` väljs fälten med `coalesce`, så att resten av koden ser samma fältnamn som idag:

```groq
"heroBio": coalesce(heroBioSv, heroBio),
"description": coalesce(descriptionSv, description),
```

3. TypeScript-typerna i `app/models/sanityTypes.ts` behåller sina fältnamn, eftersom GROQ-frågan redan väljer rätt språk. Lägg bara till `Sv`-fälten i Studio-schemat.
4. Deploya Studio (`cd sanity && npm run deploy`) och tala om för Daniel vilka fält som ska fyllas i.
5. Skapa inte svenska texter direkt i Sanity utan Daniels godkännande. Om utkast behövs: skriv dem till `docs/sanity-sv-drafts.md` så klistrar han in dem.

## SEO: metadata, hreflang, sitemap

Varje sida ska tala om sitt eget språk, peka canonical på sig själv och länka till sin motsvarighet på andra språket. Allt byggs med Next.js inbyggda `generateMetadata`, `sitemap.ts` och `robots.ts`.

**Metadata per sida** (`generateMetadata` i `app/[lang]/layout.tsx` och varje `page.tsx`):

- `metadataBase: new URL("https://monkeysolutions.se")`
- `title: { default, template: "%s | Monkey Solutions" }` och `description` från ordboken. Svenska texter från SEO-planens tabell ”Sidstruktur”.
- `alternates.canonical` = sidans egen URL på sitt språk.
- `alternates.languages` = `{ "sv-SE": "/hemsida", "en": "/en/website", "x-default": "/hemsida" }`, byggt från `routes.ts`. Det blir `<link rel="alternate" hreflang="...">` i `<head>`.
- `openGraph`: `locale: "sv_SE"` eller `"en_GB"`, `alternateLocale` = det andra, titel, beskrivning och en bild 1200×630.

**Sitemap** (`app/sitemap.ts`): en post per sida och språk, var och en med `alternates.languages` så att Google ser paren.

```ts
{ url: "https://monkeysolutions.se/hemsida",
  alternates: { languages: { "sv-SE": "https://monkeysolutions.se/hemsida", en: "https://monkeysolutions.se/en/website" } } }
```

**Robots** (`app/robots.ts`): tillåt allt, `sitemap: "https://monkeysolutions.se/sitemap.xml"`.

**JSON-LD** i `app/[lang]/layout.tsx`: `ProfessionalService` med `name: "Monkey Solutions"`, `url`, `logo`, `email`, `telephone`, `areaServed` (Göteborg, Mölndal, Partille, Kungälv, Lerum, Kungsbacka, Ale, Härryda), `sameAs` (Instagram, LinkedIn, GitHub), `inLanguage` = sidans språk och `availableLanguage: ["sv", "en"]`. Ingen gatuadress.

**Regler:**

- hreflang måste vara ömsesidig: om svenska sidan pekar på engelska måste engelska peka tillbaka.
- Peka aldrig canonical på andra språket.
- En sida som bara finns på ett språk får ingen hreflang till det andra och listas bara en gång i sitemapen.

## Språkväxlare och cache

**Språkväxlare** i `SiteHeader`, bredvid `ThemeToggle`, och i mobilmenyn:

- En vanlig `<a href>` (eller `next/link`) till samma sida på andra språket, hämtad ur `routes.ts`. Ingen JavaScript-knapp, så att Google kan följa länken.
- Texten skrivs på målspråket: ”English” på svenska sidor, ”Svenska” på engelska. Sätt `hreflang` och `lang` på länken.
- Saknar sidan motsvarighet länkar växlaren till startsidan på andra språket.
- Ankaret följer med om det finns (`/#work` till `/en#work`).

**Cache och revalidering:**

- Med `force-dynamic` borta byggs sidorna statiskt per språk (`generateStaticParams`).
- `app/api/revalidate/route.ts` anropar idag `revalidatePath("/")`, vilket bara täcker en sökväg. Byt till `revalidatePath("/", "layout")` så att alla sidor på båda språken byggs om när Sanity publicerar.
- Behåll `Authorization: Bearer <CRON_SECRET>`-kontrollen som den är.
- Uppdatera avsnittet om dataflödet i `CLAUDE.md`: det nämner `/api/sanity-data`, som inte längre finns, och ska beskriva språkroutingen.

## Acceptanskriterier

Allt nedan ska stämma mot `npm run build && npm run start` lokalt innan merge. Repot har inga tester, så verifiera med `curl` och webbläsaren.

- [ ] `npm run build` och `npm run lint` går igenom utan varningar.
- [ ] `curl -s localhost:3000/` innehåller `<html lang="sv"`, svensk `<title>` och en mening ur svenska `heroBio` (eller engelska som reserv).
- [ ] `curl -s localhost:3000/en` innehåller `<html lang="en"` och engelsk text.
- [ ] `curl -sI localhost:3000/sv` ger 308 till `/`.
- [ ] Båda startsidorna har `rel="canonical"` mot sig själva och tre `hreflang`-länkar (`sv-SE`, `en`, `x-default`) som pekar på varandra.
- [ ] `/sitemap.xml` listar varje sida en gång per språk, med `xhtml:link`-alternativ.
- [ ] `/robots.txt` pekar på sitemapen.
- [ ] `/api/contact` och `/api/revalidate` fungerar som förut.
- [ ] Språkväxlaren leder till rätt motsvarande sida, också i mobilmenyn.
- [ ] Ingen synlig engelsk text på svenska sidor, utöver Sanity-fält som ännu saknar svensk text.
- [ ] Utseendet är oförändrat i ljust och mörkt tema, desktop och mobil.
- [ ] JSON-LD validerar i Googles Rich Results Test efter deploy.
- [ ] `CLAUDE.md` beskriver den nya strukturen.

## Öppna frågor

Claude Code ska fråga Daniel om dessa i stället för att gissa. Bygg med platshållare tills svaret finns.

- Ska tjänstesidorna också finnas på engelska, eller bara startsidan och /en/about? (Påverkar `routes.ts` och sitemapen.)
- Är de engelska slugsen i URL-tabellen okej?
- Vem skriver svenska texter till Sanity-fälten: Daniel själv, eller utkast från Claude att granska?
- Telefonnummer och org.nr till JSON-LD och footern (idag står ”xxxxxx-xxxx”).
- Instagram-URL till `sameAs` och footern.
- Var hostas sajten? Proxyn och statisk cache fungerar på Vercel; annan plattform behöver kontrolleras.

## Prompt att starta med

```text
Läs fliken "Developer handoff: svenska + engelska" (bifogad) och CLAUDE.md.
Börja med Steg 0 och visa diffen innan du går vidare.
Ta sedan avsnitten i ordning: Routing, UI-texter, Sanity, SEO, Språkväxlare och cache.
Commit per avsnitt. Ställ de öppna frågorna innan du fyller i något som beror på dem.
Avsluta med att gå igenom acceptanskriterierna och rapportera vilka som är gröna.
```
