---
phase: 4
slug: experience-skills-services
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-10
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none — CLAUDE.md explicitly states "There are no tests configured" |
| **Config file** | none |
| **Quick run command** | `npm run build && npm run lint` |
| **Full suite command** | `npm run build && npm run lint` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build && npm run lint`
- **After every plan wave:** Run `npm run build && npm run lint` + manual browser verification
- **Before `/gsd-verify-work`:** Build and lint must be green; all manual checks below must pass
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| Schema + GROQ updates | 01 | 1 | EXP-01, EXP-02 | — | N/A | lint + build | `npm run build && npm run lint` | ✅ | ⬜ pending |
| GlobalContext education fix | 01 | 1 | EXP-02 | — | N/A | lint + build | `npm run build && npm run lint` | ✅ | ⬜ pending |
| ExperienceSection component | 02 | 2 | EXP-01, EXP-02, EXP-03 | — | N/A | manual | Browser: timeline + education + community | ❌ W0 | ⬜ pending |
| SkillsSection component | 02 | 2 | SKILLS-01 | — | N/A | manual | Browser: 4 groups × 10-segment bars | ❌ W0 | ⬜ pending |
| ServicesSection component | 02 | 2 | SVC-01, SVC-02 | — | N/A | manual | Browser: 2×2 grid + hover border | ❌ W0 | ⬜ pending |
| app/page.tsx wiring | 03 | 3 | EXP-01 | — | N/A | lint + build | `npm run build && npm run lint` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

No test framework installation needed. CLAUDE.md confirms no tests exist and none should be added in Phase 4.

*Existing `npm run build && npm run lint` covers automated type and lint verification for all file changes.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Timeline renders 4 entries on vertical left-border line | EXP-01 | No test framework; visual layout | Start dev server, open /#experience, count timeline entries |
| Current role has orange pulse dot | EXP-01 | CSS animation, visual | Inspect `.ms-pulse` class on current-role dot |
| Education list shows degree, institution, years, fieldOfStudy detail | EXP-02 | Visual content rendering | Open /#experience, scroll to education, verify all fields show |
| Community sub-section shows 3 activity rows | EXP-03 | Visual content | Confirm "ALSO / COMMUNITY" heading + 3 rows below education |
| 4 skill groups, each with 10-segment bars | SKILLS-01 | Visual layout | Open /#skills, count groups and segments per bar |
| 2×2 service card grid shows giant Fraunces numbers | SVC-01, SVC-02 | Visual + CSS | Open /#services, hover each card to confirm orange border |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify (build/lint) or manual verification documented above
- [ ] Sampling continuity: lint+build runs after every wave
- [ ] Wave 0: N/A — no test framework required
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s for automated; manual checklist for UI
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
