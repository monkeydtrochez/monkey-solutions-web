---
phase: 2
slug: header-hero
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-09
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — CLAUDE.md: "There are no tests configured" |
| **Config file** | none |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && npm run lint` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build && npm run lint`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 2-01-01 | 01 | 1 | NAV-01 | — | N/A | visual/manual | `npm run build` | ❌ W0 | ⬜ pending |
| 2-01-02 | 01 | 1 | NAV-02 | — | N/A | visual/manual | `npm run build` | ❌ W0 | ⬜ pending |
| 2-01-03 | 01 | 1 | NAV-03 | — | N/A | visual/manual | `npm run build` | ❌ W0 | ⬜ pending |
| 2-02-01 | 02 | 2 | HERO-01 | — | N/A | visual/manual | `npm run build` | ❌ W0 | ⬜ pending |
| 2-02-02 | 02 | 2 | HERO-02 | — | N/A | visual/manual | `npm run build` | ❌ W0 | ⬜ pending |
| 2-02-03 | 02 | 2 | HERO-03 | — | N/A | visual/manual | `npm run build` | ❌ W0 | ⬜ pending |
| 2-02-04 | 02 | 2 | HERO-04 | — | N/A | visual/manual | `npm run build` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

No test infrastructure to create — no testing framework configured and CLAUDE.md confirms this is intentional.

*Primary validation for this phase: `npm run build` succeeds and the page renders correctly at `localhost:3000`.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Sticky header with blurred background | NAV-01 | CSS backdrop-filter is browser-rendered | Open localhost:3000, scroll down, verify header sticks with visible blur |
| Hire CTA pulsing orange dot | NAV-02 | CSS animation (ms-pulse) | Inspect header CTA button for visible pulsing orange dot |
| Header backdrop-filter blur | NAV-03 | Visual browser effect | Verify header has semi-transparent blurred background on scroll |
| H1 with mixed weights + Fraunces italic | HERO-01 | Font rendering | Verify hero headline uses Fraunces italic for accent word |
| Terminal card blinking cursor | HERO-02 | CSS animation (ms-cursor) | Verify terminal status card has blinking cursor at end |
| Primary + secondary hero CTAs | HERO-03 | Visual layout | Verify two CTA buttons below hero headline |
| Trust strip with 4 stats | HERO-04 | Visual layout | Verify 4 stat items with orange accent characters below hero |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
