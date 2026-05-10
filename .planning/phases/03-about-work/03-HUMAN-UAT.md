---
status: partial
phase: 03-about-work
source: [03-VERIFICATION.md]
started: 2026-05-10T00:00:00.000Z
updated: 2026-05-10T00:00:00.000Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. About section visual rendering
expected: Left column shows kicker '01 ── ABOUT', H2 with 'wish' in Fraunces italic orange, two body paragraphs, and facts row. Right column shows striped 3:4 portrait placeholder with 'DT', offset decorative border, and rotated orange sticker reading '↓ hi, nice to meet you'.
result: [pending]

### 2. Work section accordion interaction: single-open constraint and default-open
expected: On first render, the first project row (lowest sortIndex from Sanity) is open. Clicking a closed row opens it and closes the previously open row. Clicking the open row's button collapses it.
result: [pending]

### 3. Filter control hides/shows projects by category
expected: Clicking 'web' shows only projects whose kind matches /commerce|web|booking/i. Clicking 'ios' shows only projects matching /iOS/ (case-sensitive). Clicking 'saas' shows /SaaS/i. If the currently-open row is excluded, it collapses.
result: [pending]

### 4. Header nav links #about and #work scroll to the respective sections
expected: Clicking '#about' and '#work' in SiteHeader smooth-scrolls to <section id='about'> and <section id='work'> respectively.
result: [pending]

## Summary

total: 4
passed: 0
issues: 0
pending: 4
skipped: 0
blocked: 0

## Gaps
