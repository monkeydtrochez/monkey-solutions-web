---
phase: 5
slug: contact-footer
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-17
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None configured (CLAUDE.md: "There are no tests configured.") |
| **Config file** | none |
| **Quick run command** | `npm run lint` |
| **Full suite command** | `npm run lint && npm run build` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run lint`
- **After every plan wave:** Run `npm run lint && npm run build`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 1 | CONTACT-03, FOOTER-01, FOOTER-02 | T-05-01 | RESEND_API_KEY never in `NEXT_PUBLIC_` env var | build | `npm run build` | ❌ W0 | ⬜ pending |
| 05-01-02 | 01 | 1 | CONTACT-01, CONTACT-02 | T-05-02 | Input validated before Resend call; no key exposure | build | `npm run lint && npm run build` | ❌ W0 | ⬜ pending |
| 05-02-01 | 02 | 2 | CONTACT-01, CONTACT-02, CONTACT-03, CONTACT-04 | — | N/A | manual + build | `npm run build` | ❌ W0 | ⬜ pending |
| 05-02-02 | 02 | 2 | CONTACT-01, CONTACT-02, CONTACT-03, CONTACT-04 | — | N/A | manual | — | ❌ W0 | ⬜ pending |
| 05-03-01 | 03 | 3 | FOOTER-01, FOOTER-02, FOOTER-03 | — | N/A | manual + build | `npm run build` | ❌ W0 | ⬜ pending |
| 05-03-02 | 03 | 3 | FOOTER-01, FOOTER-02, FOOTER-03 | — | N/A | manual | — | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `npm install resend` — must precede Wave 1 implementation (no test files exist; covered by plan 05-01 prerequisite step)
- [ ] Create `/public/resume_en.pdf` and `/public/resume_sv.pdf` placeholder stubs (covered by plan 05-01 Task 1)

*No automated test infrastructure exists — consistent with CLAUDE.md "There are no tests configured."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Contact form fields render and accept input | CONTACT-01 | No test infra | Open localhost:3000, scroll to contact section, verify name/email/budget/textarea are interactive |
| Success state shows #27c93f background + checkmark for 3.5s then resets | CONTACT-02 | Requires real browser + timer | Submit form with valid data; verify green success state appears and clears after ~3.5s |
| Download links trigger browser download for EN and SV PDFs | CONTACT-03 | Browser download behavior | Click both download cards; verify file download starts |
| Direct links show email, LinkedIn, GitHub with ↗ arrows | CONTACT-04 | Visual/DOM check | Inspect contact section left column; verify three links with correct hrefs |
| Footer renders MONKEY / solutions. wordmark with Fraunces italic | FOOTER-01 | Visual rendering | Scroll to footer; verify giant wordmark with italic accent on "solutions." |
| Footer 4-column meta grid shows studio address, nav links, Elsewhere, availability | FOOTER-02 | Visual layout | Inspect footer grid; confirm 4 columns render with correct content |
| Copyright/version strip shows aligned text on both sides | FOOTER-03 | Visual layout | Inspect footer bottom strip; verify left and right text alignment |
