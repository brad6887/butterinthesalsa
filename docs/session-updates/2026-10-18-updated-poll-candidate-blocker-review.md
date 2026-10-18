---
title: "Updated poll candidate blocker review"
description: "Build findings resolved; HTTP entry still fails the HTTPS-only poll contract."
date: 2026-10-18
status: complete
reviewed: false
session: updated-poll-candidate-blocker-review
tags:
  - Abbey Root
---

# Updated poll candidate blocker review

## Objective and Definition of Done

Review the updated uncommitted candidate and validation evidence on edge01 at `/home/bcooke/git/butterinthesalsa`, identify remaining blockers and capture evidence. Keep production voting closed and all three preview votes intact. No implementation fixes, commits, pushes, public release, Worker deployment, DNS or hosted Pages changes.

## Decision and findings

**Not ready for public release yet: one remaining code/release-path blocker was confirmed.** The previous production frontend settings and missing poll-validation findings are resolved. No further blocking defect was established in the unchanged ballot backend or the new shared release command.

### P1 — HTTP entry serves an unusable poll instead of reaching HTTPS

Relevant candidate locations: `site/src/pages/index.astro:14`, `site/src/scripts/reunion-poll.ts:30`, `site/src/scripts/reunion-poll.ts:55-59`, and the exact HTTPS origin in `site/poll-api/wrangler.production.json`.

The public HTTP entry currently returns HTTP 200 with zero redirects at `http://butterinthesalsa.com/`. The candidate has a canonical link but no redirect before poll initialization. The production API intentionally accepts only `https://butterinthesalsa.com`. A fresh read-only GET with Origin `http://butterinthesalsa.com` returns 403, Origin not allowed. Publishing the current artifact at that still-supported HTTP entry would therefore leave all result counts blank, including while voting is closed.

Reproduced using the exact compiled artifact served through browser interception at the HTTP canonical URL and the independently observed API rejection. Chromium reported isSecureContext=false and crypto.randomUUID undefined. The UI displayed “Voting needs browser storage. Enable it and reload; results remain available.” alongside unavailable results and four em dashes. Enabling storage cannot fix this HTTP-origin/secure-context failure. No POST was sent and no hosted resource was changed.

Before public release, make HTTP entry reach canonical HTTPS before poll initialization, using a reviewed site-level redirect or separately authorized hosting HTTPS enforcement. Preserve the existing HTTPS-only backend origin and hostname. Add a regression check for HTTP entry reaching HTTPS and loading the closed results. Do not treat the canonical tag or a successful HTTPS-only mocked browser check as proof of that behavior. No DNS or Pages setting was changed in this review.

Evidence: `working/poll-candidate-final-review/public-http-headers.txt`, `http-origin-headers.txt`, `http-origin-body.json`, and `http-artifact-reproduction.json`.

## Earlier findings resolved

- `poll.production.json` provides the actual public production API URL and widget key. The Astro component selects it during production builds while local development retains explicit preview settings. Inspected compiled output and reran the artifact checker successfully. Prior ambient-preview-variable rejection evidence demonstrates that production output does not inherit the local preview settings.
- Pages now installs both dependency sets and invokes the shared `validate:release` command before upload. Both lockfiles are cached. That command builds/checks the artifact and runs all 15 poll tests plus nine artifact tests; failures stop the command chain. Abbey project validation names the same release command, and the ordinary build checks its artifact.
- Reviewed normal and clean-install logs: 15/15 poll tests and 9/9 artifact checks passed. Clean rehearsal excluded private environment files and removed the temporary checkout. Both audits and Abbey build/site validation/publish dry run/project validation passed. Those earlier full checks were inspected, not needlessly repeated during this review. No live GitHub Actions run has occurred for this uncommitted candidate.
- Existing artifact checks cover wrong/empty settings, preview targets, missing poll/client/assets and CNAME, but they are static checks. They do not cover protocol entry or prove real production widget interaction. This limits their evidence; it does not invalidate the covered checks.

## Remaining acceptance and operational gates

1. A separate human mobile-device and screen-reader pass remains unconfirmed. Owner keyboard/navigation/zoom passes and automated viewport/axe checks remain supporting evidence. The new compiled-browser result is mocked and does not establish human accessibility.
2. Decide closure/deletion and private backup retention responsibilities, and explicitly resolve or accept recovery exposure before admitting real ballots. Independent off-host secret recovery and hosted database restore/cutover/atomicity remain unverified; the local restore rehearsal is not remote recovery evidence. No backup, export, secret rotation or restore was attempted.
3. Real open-production challenge/vote acceptance remains outside this closed review. Any future production ballot needs separate authorization and an accounting plan. Review the exact final source/artifact before separately authorizing commit/publication; opening voting remains another explicit gate.

## Current state and preservation

- Current read-only production results and D1 aggregates confirm open=false, zero ballots and all four zero counters. Worker version remains `6d52882d-e06e-4e54-98fc-7c23c38b7f0c`.
- Preview retains Butter 1, Salsa 0, Absolutely not 1, Whatever 1: three ballots, with matching aggregate/grouped counts. Worker version remains `3f2da025-703c-4b45-bbc9-a048f2dea6ff`.
- Worker source, shared constants, migration and actual production/close configurations match the provisioning digests. No configuration, resource, widget, secret or migration mutation occurred.
- Preview PID 332757 remains running. Edge01 and the existing Mac localhost:4322 tunnel return HTTP 200. Neither was restarted.
- `working/poll-candidate-final-review/` contains live GET/D1/version summaries, HTTP reproduction, the artifact check, reviewed source/artifact digests, before/after status/diff/hashes and final preservation/review records. D1 evidence retains no voter hashes or secrets.
- Only this review's evidence and Abbey capture were added. Existing implementation, static evidence and dirty tracked diff are preserved; the live preview access log can append HTTP health-check entries.

## Next step

Address HTTP-to-HTTPS entry and its regression coverage in a bounded implementation session, then finish the human acceptance and recovery/retention decisions. No release or voting approval is inferred from this review.
