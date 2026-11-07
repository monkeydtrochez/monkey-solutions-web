import type { Dictionary } from "./types";

export const en: Dictionary = {
  meta: {
    title: "Software developer in Gothenburg – web & backend | Monkey Solutions",
    description:
      "Gothenburg-based software developer building web apps, backends and integrations. Available for consulting assignments.",
    ogTagline: "Software that ships & lasts.",
  },
  common: {
    languageSwitch: "Svenska",
  },
  nav: {
    about: "about",
    work: "work",
    experience: "experience",
    skills: "skills",
    services: "services",
    contact: "contact",
  },
  header: {
    hireMe: "Hire me",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  hero: {
    status: "AVAILABLE",
    statusNote: "· freelance projects →",
    h1: {
      lead: "Software that",
      ships: "ships",
      amp: "&",
      lasts: "lasts.",
    },
    ctaProject: "Start a project →",
    ctaWork: "View work",
    stats: {
      years: { label: "years shipping" },
      tools: { label: "Tools and languages in stack" },
      ai: { label: "AI-first", sub: "Native with AI tools" },
    },
  },
  about: {
    kicker: "ABOUT",
    h2: {
      pre: "I build what teams",
      em: "wish",
      post: "they had time to build.",
    },
    fallbackParagraphs: [
      "Ten years in, I've worked on fintech dashboards used by traders, iOS apps used by students across Sweden, and e-commerce platforms processing real money. My best work hides the complexity — it just feels calm and obvious.",
      "I take product from ambiguous brief to shipped binary. Comfortable being the only developer in the room, or the new senior in a team of twenty.",
    ],
    locationFallback: "Göteborg, SE",
    facts: {
      location: "LOCATION",
      languages: "LANGUAGES",
      workingSince: "WORKING SINCE",
    },
    photoAlt: "Profile photo",
    sticker: "↓ hi, nice to meet you",
  },
  work: {
    kicker: "SELECTED WORK",
    h2: {
      pre: "Projects,",
      em: "actually",
      post: "shipped.",
    },
    filterAll: "all",
    empty: "No projects in this category.",
    expand: "Expand {title}",
    collapse: "Collapse {title}",
    overview: "OVERVIEW",
    client: "Client",
    year: "Year",
    visitSite: "Visit {title} site (opens in new tab)",
    coverAlt: "{title} cover",
    projectFallback: "Project",
    untitled: "UNTITLED",
    screenshot: "SCREENSHOT",
  },
  notFound: {
    title: "Page not found",
    body: "The page you are looking for does not exist or has moved.",
    homeLink: "Back to home",
  },
};
