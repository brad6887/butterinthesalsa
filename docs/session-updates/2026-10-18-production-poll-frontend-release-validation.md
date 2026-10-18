---
title: "Production poll frontend and release validation"
description: "Configure the production frontend artifact and gate publication on poll tests and artifact checks."
date: 2026-10-18
status: complete
reviewed: false
session: production-poll-frontend-release-validation
tags:
  - Abbey Root
---

# Production poll frontend and release validation

## Objective and Definition of Done

Fix both publication-path findings from the release readiness review on edge01 in `/home/bcooke/git/butterinthesalsa`: embed the correct public production settings and run poll tests plus meaningful artifact checks before publication. Validate the configured artifact and clean-install CI recipe, preserve the closed production deployment and all three preview votes, capture evidence and inspect the final diff. No commits, pushes, public release, Worker deployment, voting enablement, DNS or hosted Pages changes.

## Changes

- Added `site/poll.production.json` as the frontend source of truth for public production settings: API `https://butter-salsa-poll-production.butter-salsa.workers.dev` and widget `0x4AAAAAAFaOigIB5KHmUF-l`. These are public metadata, not Worker secrets.
- `ReunionPoll.astro` selects that file for production builds using `import.meta.env.PROD`. Local development still uses the explicit PUBLIC_POLL_API_URL and PUBLIC_TURNSTILE_SITE_KEY environment values. Ambient preview environment variables cannot redirect a production build. The separate disposable running preview was not changed.
- `npm run build` now builds Astro and checks the artifact. The dependency-free checker verifies one configured poll section, exact production API/widget values consistent with actual resource records, initially disabled voting controls, an existing nonempty local client module, no CNAME, and no known preview/localhost/test settings anywhere in generated HTML/JS/CSS. It fails with a nonzero exit code on rejection.
- Added nine artifact tests against copies of the actual compiled output: the valid artifact and rejection of an empty API, preview API, wrong key, missing poll, missing client module, missing client asset, injected preview setting and unexpected CNAME. Temporary mutated copies are removed.
- `npm run validate:release` is the shared release command: production build/artifact check, all 15 isolated poll tests and the nine artifact checks. `test:release` runs the test portions after a build. No hosted acceptance helper, remote migration or Worker deployment is part of this command.
- The existing Pages build job now caches both lockfiles, installs both dependency sets and runs the shared release command before artifact upload. Hosted Pages settings, deploy permissions, triggers and deploy job remain unchanged. No workflow run was dispatched; changes remain uncommitted.
- Abbey project `validation.commands` now names `cd site && npm run validate:release`. Abbey site build and publish dry-run use the artifact-checking build command. `abbey validate` checks project consistency; it does not execute this configured release test command, which was run explicitly.
- Updated operations guidance and the development environment example to explain the production/development distinction and release gate. Corrected the retained preparation checklist's preview invariant to three votes. No dependency or lockfile changes.

## Validation

All evidence is under `working/poll-release-validation/` on edge01.

- `release-validation.log`: production artifact checks passed; 15/15 poll tests and 9/9 artifact tests passed. Recovery test evidence uses a fresh directory, preserving old reports.
- `clean-ci.log`, `clean-ci.json`: copied source into a fresh temporary directory, excluding dependencies, private environment files, Wrangler state and previous output. Both `npm ci` installs and the full shared release command passed. The temporary checkout was removed. This demonstrates the local CI recipe, not a completed GitHub Actions run.
- `ambient-preview-rejection.log`: intentionally supplied localhost API and placeholder key through PUBLIC_* environment variables while building; the resulting artifact still contained the correct production settings and passed the checker.
- `closed-browser.json`: served the actual compiled artifact on a temporary loopback server and intercepted all production API/widget requests. A recorded closed production response and synthetic widget exercised correct public settings, disabled fieldset/radios/submit, all four zero results, manual refresh, zero POSTs and no browser errors. No hosted request or ballot was produced. The first browser harness used Playwright's `isDisabled()` on a fieldset, which does not report the DOM fieldset property as expected; corrected the assertion to inspect `fieldset.disabled` and verify every radio and submit button. The corrected check passed. Temporary server and browser were closed.
- API and site dependency audits both report zero vulnerabilities.
- Abbey site build, site validate, site publish --dry-run and project validate passed. No publication started. Final Git whitespace and Abbey review recorded separately.

## Live preservation

Read-only current checks confirm:

- Production remains open=false with zero ballots and all four zero counters. D1 `a6d45ef4-32d4-4d7a-a501-c2c0788fbcd3`; active Worker version remains `6d52882d-e06e-4e54-98fc-7c23c38b7f0c`.
- Preview retains three ballots: Butter 1, Salsa 0, Absolutely not 1, Whatever 1. Active preview Worker remains `3f2da025-703c-4b45-bbc9-a048f2dea6ff`. No POSTs to either hosted Worker were sent.
- Remote D1 aggregate/grouped ballot queries retain no voter hashes. Production and preview resource configurations, secrets, Worker source and migration remain unchanged.
- HTTP and HTTPS independently still serve the accepted splash SHA256 `55fef72d32f1265fa1e9d2fdca99a82396183f1f90d23cca6fe8100f595e5a00`.
- Existing preview PID 332757 and Mac port-4322 tunnel remain in place and serve HTTP 200. No restart or tunnel change.
- Before/after source/evidence hashes preserve all unrelated files and the original tracked `.gitignore`/index.astro changes. Only the six authorized existing files changed: project metadata, workflow source, site package scripts, poll component, development env example and operations guide. The active preview access log may append ordinary HTTP health-check lines. New files are the public settings, artifact checker/tests, this capture and scoped evidence.
- Scan for the actual private preview and production secret values is clean across candidate Git content and generated artifact. Private secret custody is unchanged.

## Definition of Done and remaining gates

Both publication-path findings are fixed and validated locally. Production voting remains closed. No commit, push, public release, hosted Pages change, DNS change or resource deployment occurred.

Human mobile-device and screen-reader acceptance, the recovery/retention decision, review of this exact candidate and separately authorized commit/publication remain outstanding. Independent off-host secret recovery and hosted database restoration remain unverified. The browser check used a mocked closed API and synthetic widget; it does not prove real production Turnstile voting or human accessibility. Opening voting still requires separate explicit authorization and an approved acceptance/accounting plan.
