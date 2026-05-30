---
phase: 1
slug: foundation-tech-debt
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-05-09
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Next.js built-in (no test framework configured) |
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
| 01-xx-01 | xx | 1 | FOUND-01 | — | No FOUC — theme applied before paint | manual | browser visual check | ✅ | ⬜ pending |
| 01-xx-02 | xx | 1 | FOUND-02 | — | Theme persists after reload | manual | browser reload check | ✅ | ⬜ pending |
| 01-xx-03 | xx | 1 | FOUND-03 | — | No fonts.googleapis.com requests | manual | DevTools Network check | ✅ | ⬜ pending |
| 01-xx-04 | xx | 1 | TD-02 | — | No self-HTTP round-trip in data loader | unit | `npm run build` (no runtime fetch) | ✅ | ⬜ pending |
| 01-xx-05 | xx | 1 | TD-03 | — | `/api/revalidate` rejects bare secrets | manual | curl test with/without Bearer | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements. No test framework installation needed — verification is via build success, lint, and manual browser/curl checks. All tasks in Plans 01–03 have `<automated>` verify commands (`npm run build` or `grep -c`). No MISSING verify references exist — Wave 0 is satisfied by the existing build toolchain.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| No FOUC on light theme | FOUND-01 | Requires browser with stored theme cookie | Open in browser that previously selected light; observe no dark flash |
| Theme persists after reload | FOUND-02 | Requires browser state | Toggle theme, reload page, verify setting retained |
| Self-hosted fonts only | FOUND-03 | Requires DevTools Network inspection | Load page, filter Network by font requests, verify no googleapis.com |
| Bearer token enforcement | TD-03 | Requires HTTP client | curl POST /api/revalidate with bare secret → 401; with Bearer prefix → 200 |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
