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
  experience: {
    kicker: "EXPERIENCE + EDUCATION",
    h2: { pre: "Experience +", em: "Education" },
    community: "ALSO / COMMUNITY",
    present: "Present",
    current: "Current",
    engagements: { one: "{n} engagement", other: "{n} engagements" },
    expand: "Expand {name}",
    collapse: "Collapse {name}",
    employerFallback: "employer",
  },
  skills: {
    kicker: "SKILLS",
    h2: { pre: "Tools I reach for", em: "without", strong: "thinking." },
    traits: "How I show up",
    categories: {
      Languages: "Languages",
      Frontend: "Frontend",
      "Backend & Infra": "Backend & Infra",
      Craft: "Craft",
      Other: "Other",
    },
  },
  services: {
    kicker: "SERVICES",
    h2: { pre: "A few of many ways we could be", em: "working", strong: "together." },
    intro:
      "Most engagements are 4–12 weeks, fixed scope or monthly retainer. I'll tell you honestly if your project isn't a fit for me.",
    cardKicker: "— service / {n}",
    items: [
      {
        title: "Full-Stack Web",
        description:
          "From landing page to full product. Modern fullstack frameworks, headless CMS, and whatever the project actually needs.",
        stack: ["Devops", "Development", "Headless CMS", "Design", "Integrations"],
      },
      {
        title: "Dev advisory",
        description:
          "Code reviews, architecture calls, hiring loops. Sometimes the most useful thing is a second pair of eyes.",
        stack: ["Code audits", "Architecture reviews", "Hiring loops", "Consulting"],
      },
      {
        title: "Backend & APIs",
        description:
          "Services built with best suited frameworks, typed from DB to client. Boring-by-choice, readable, tested.",
        stack: ["Performance", "Security", "Devops", "Architecture design", "Observability", "Monitoring", "Testing"],
      },
    ],
  },
  contact: {
    kicker: "CONTACT",
    h2: { pre: "Let's", em: "build", post: "something." },
    lede: "Prefer brief? Then just say hello. Have a project in mind? Tell me what you're building, your timeline, and what matters most.",
    resume: {
      kicker: "◉ RESUME",
      description:
        "Prefer to read the traditional way? Grab a PDF copy — available in English and Swedish.",
      english: "English",
      swedish: "Svenska",
    },
    fields: {
      name: { label: "> name", placeholder: "Your name" },
      email: { label: "> email", placeholder: "you@company.com" },
      budget: { label: "> budget", placeholder: "10k · 50k · let's talk" },
      project: {
        label: "> project",
        placeholder: "What are we building? Timeline, constraints, the interesting bits...",
      },
    },
    sent: "✓ Message sent — talk soon!",
    orEmail: "Or email directly — whatever you prefer.",
    error: "Something went wrong — try again.",
    sentLive: "Message sent — I will be in touch soon.",
  },
  footer: {
    studio: "STUDIO",
    location: "Gothenburg, Sweden",
    orgNumber: "Org. {n}",
    elsewhere: "ELSEWHERE",
    status: "STATUS",
    availableFallback: "Available",
    reply: "Usually reply within 24h. / Based in CET (UTC+1).",
    rights: "All rights reserved",
    madeIn: "Made in Göteborg",
  },
  theme: {
    group: "Theme",
    dark: "dark",
    light: "light",
    toDark: "Switch to dark theme",
    toLight: "Switch to light theme",
  },
  backToTop: "Back to top",
  notFound: {
    title: "Page not found",
    body: "The page you are looking for does not exist or has moved.",
    homeLink: "Back to home",
  },
};
