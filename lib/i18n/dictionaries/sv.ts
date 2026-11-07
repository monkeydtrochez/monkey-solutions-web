export const sv = {
  meta: {
    title: "Webbutvecklare i Göteborg – hemsidor & webshoppar | Monkey Solutions",
    description:
      "Jag bygger hemsidor, webshoppar och integrationer för småföretag och butiker i Göteborg. En person hela vägen. Skriv en rad!",
    ogTagline: "Hemsidor, webshoppar och systemen bakom. Från Göteborg.",
  },
  common: {
    languageSwitch: "English",
  },
  nav: {
    about: "om mig",
    work: "arbeten",
    experience: "erfarenhet",
    skills: "kompetens",
    services: "tjänster",
    contact: "kontakt",
  },
  header: {
    hireMe: "Anlita mig",
    openMenu: "Öppna menyn",
    closeMenu: "Stäng menyn",
  },
  hero: {
    status: "TILLGÄNGLIG",
    statusNote: "· frilansuppdrag →",
    h1: {
      lead: "Hemsidor,",
      ships: "webshoppar",
      amp: "och",
      lasts: "systemen bakom. Från Göteborg.",
    },
    ctaProject: "Starta ett projekt →",
    ctaWork: "Se arbeten",
    stats: {
      years: { label: "år i branschen" },
      tools: { label: "verktyg och språk i stacken" },
      ai: { label: "AI-först", sub: "Hemma i AI-verktygen" },
    },
  },
  about: {
    kicker: "OM MIG",
    h2: {
      pre: "Jag bygger det som team",
      em: "önskar",
      post: "att de hade tid att bygga.",
    },
    fallbackParagraphs: [
      "Under tio år har jag jobbat med fintech-dashboards för traders, iOS-appar för studenter i hela Sverige och e-handelsplattformar som hanterar riktiga pengar. Mitt bästa arbete döljer komplexiteten – det känns bara lugnt och självklart.",
      "Jag tar en produkt från otydlig brief till färdig leverans. Jag trivs lika bra som ensam utvecklare som ny senior i ett team på tjugo.",
    ],
    locationFallback: "Göteborg",
    facts: {
      location: "PLATS",
      languages: "SPRÅK",
      workingSince: "JOBBAT SEDAN",
    },
    photoAlt: "Profilfoto",
    sticker: "↓ hej, trevligt att träffas",
  },
  work: {
    kicker: "UTVALDA PROJEKT",
    h2: {
      pre: "Projekt som",
      em: "faktiskt",
      post: "levererats.",
    },
    filterAll: "alla",
    empty: "Inga projekt i den här kategorin.",
    expand: "Visa {title}",
    collapse: "Dölj {title}",
    overview: "ÖVERSIKT",
    client: "Kund",
    year: "År",
    visitSite: "Besök {title} (öppnas i ny flik)",
    coverAlt: "Omslagsbild för {title}",
    projectFallback: "Projekt",
    untitled: "NAMNLÖST",
    screenshot: "SKÄRMBILD",
  },
  experience: {
    kicker: "ERFARENHET + UTBILDNING",
    h2: { pre: "Erfarenhet +", em: "utbildning" },
    community: "ÄVEN / ENGAGEMANG",
    present: "Nu",
    current: "Nuvarande",
    engagements: { one: "{n} uppdrag", other: "{n} uppdrag" },
    expand: "Visa {name}",
    collapse: "Dölj {name}",
    employerFallback: "arbetsgivare",
  },
  skills: {
    kicker: "KOMPETENS",
    h2: { pre: "Verktyg jag tar till", em: "utan att", strong: "tänka." },
    traits: "Som kollega",
    categories: {
      Languages: "Språk",
      Frontend: "Frontend",
      "Backend & Infra": "Backend & infra",
      Craft: "Hantverk",
      Other: "Övrigt",
    },
  },
  services: {
    kicker: "TJÄNSTER",
    h2: { pre: "Några av många sätt vi kan", em: "jobba", strong: "tillsammans." },
    intro:
      "De flesta uppdrag tar 4–12 veckor, med fast omfattning eller löpande månadsavtal. Jag säger ärligt om ditt projekt inte passar mig.",
    cardKicker: "— tjänst / {n}",
    items: [
      {
        title: "Hemsida",
        description:
          "Känns hemsidan gammal eller långsam? Jag bygger en ny som är lätt att uppdatera och hittas på Google. Småföretag i Göteborg.",
        stack: ["Ny hemsida", "Enkel att uppdatera", "SEO", "Mobilanpassad"],
      },
      {
        title: "Webshop",
        description:
          "Vill du sälja på nätet? Jag bygger webbutiker för lokala butiker, kopplade till kassa, lager och frakt.",
        stack: ["E-handel", "Betalning", "Kassa & lager", "Frakt"],
      },
      {
        title: "Shopify",
        description:
          "Ny Shopify-butik, flytt från annan plattform eller något som inte fungerar som det ska. Jag hjälper dig.",
        stack: ["Ny butik", "Flytt", "Teman", "Appar", "Felsökning"],
      },
      {
        title: "Integrationer",
        description:
          "Jag kopplar ihop webshop, affärssystem, bokföring och lager så att order och kunder flyter av sig själva.",
        stack: ["API:er", "Affärssystem", "Bokföring", "Lager", "Automation"],
      },
      {
        title: "Bröllopshemsida",
        description:
          "En personlig bröllopshemsida med OSA, schema och vägbeskrivning. Byggd för er, inte för alla.",
        stack: ["OSA", "Schema", "Vägbeskrivning", "Egen domän"],
      },
    ],
  },
  notFound: {
    title: "Sidan finns inte",
    body: "Sidan du letar efter finns inte eller har flyttats.",
    homeLink: "Till startsidan",
  },
} as const;
