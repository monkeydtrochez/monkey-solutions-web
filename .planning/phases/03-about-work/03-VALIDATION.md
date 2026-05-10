---
phase: 03
slug: about-work
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-10
---

# Phase 03 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None (no test suite configured — see CLAUDE.md) |
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
| 03-01-01 | 01 | 1 | ABOUT-01 | — | N/A | build | `npm run build` | ✅ | ⬜ pending |
| 03-01-02 | 01 | 1 | ABOUT-02 | — | N/A | build | `npm run build` | ✅ | ⬜ pending |
| 03-01-03 | 01 | 1 | ABOUT-03 | — | N/A | build | `npm run build` | ✅ | ⬜ pending |
| 03-02-01 | 02 | 1 | WORK-01 | — | N/A | build | `npm run build` | ✅ | ⬜ pending |
| 03-02-02 | 02 | 1 | WORK-02 | — | N/A | build | `npm run build` | ✅ | ⬜ pending |
| 03-02-03 | 02 | 1 | WORK-03 | — | N/A | build | `npm run build` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No new test framework setup needed.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| About section renders two-column layout | ABOUT-01 | No automated visual tests | Load localhost:3000, verify editorial text left + portrait placeholder right |
| Facts row shows location, languages, working-since | ABOUT-02 | No automated visual tests | Verify facts row beneath About copy |
| Project accordion opens/closes with only one open | WORK-01 | No automated interaction tests | Click project rows, verify single-open behavior |
| Expanded row shows overview, stack pills, metrics, screenshot | WORK-02 | No automated visual tests | Click a project row, verify expanded content |
| Category filter updates visible projects | WORK-03 | No automated interaction tests | Click filter buttons, verify row visibility updates |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
