# Milestones

## v1.0 Redesign Monkey Solutions Web (Shipped: 2026-05-21)

**Phases completed:** 6 phases, 18 plans, 38 tasks

**Key accomplishments:**

- One-liner:
- One-liner:
- One-liner:
- Sticky header with backdrop-blur backdrop, pill theme toggle, numbered nav, and pulsing hire CTA — full NAV-01/02/03 implementation
- StatusDot is a stub
- One-liner:
- One-liner:
- One-liner:
- Extended workExperience and education Sanity schemas and TypeScript types with company, current, and fieldOfStudy fields; fixed GlobalContext education singleton bug to use Education[] array via filter()
- ExperienceSection client component built with vertical timeline, education list, and hardcoded community sub-section; wired into app/page.tsx after WorkSection
- SkillsSection and ServicesSection server components built with hardcoded static data; .service-card hover CSS added to globals.css; both wired into app/page.tsx after ExperienceSection
- Resend SDK installed, POST /api/contact route created with plain-text email delivery, and Sanity profile schema extended atomically with three new optional footer CMS fields (availabilityStatus, orgNumber, readCvUrl)
- "use client" ContactSection with two-column layout — direct links + resume download card (left) and contact form with 3.5s green success state (right) — wired into page.tsx reading email/LinkedIn/GitHub from GlobalContext.profile
- "use client" FooterSection with clamp(80–240px) MONKEY/solutions. wordmark, 4-column meta grid consuming orgNumber/availabilityStatus/readCvUrl from GlobalContext, and hardcoded copyright/version bottom strip — page structure now complete
- Custom Tailwind breakpoints (ms:760px, compact:480px), .focus-ring and .sr-only utilities, and extended prefers-reduced-motion rule added to app/globals.css
- `ms:` breakpoint classes applied to HeroSection, AboutSection, ExperienceSection, SiteHeader; current-role dot wired to reduced-motion rule
- Inline grid conversions, focus rings, aria improvements, and reduced-motion hooks across ServicesSection, ContactSection, FooterSection, WorkSection, StatusDot, and TerminalCard — closes all Phase 6 requirements

---
