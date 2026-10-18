---
title: "Canonical HTTPS entry before poll initialization"
description: "Redirect canonical HTTP entry before poll startup and cover the compiled artifact."
date: 2026-10-18
status: complete
reviewed: false
session: canonical-https-entry-before-poll
tags:
  - Abbey Root
---

# Canonical HTTPS entry before poll initialization

## Objective and Definition of Done

Fix canonical HTTP entry in the site before poll initialization, with regression coverage in the existing release gate. Keep voting closed and preserve all three preview votes, preview process/tunnel and unrelated dirty work. Validate the compiled navigation and closed results, release checks and Abbey workflow, then capture the session. No commits, pushes, public release, Worker deployment, DNS or hosted Pages changes.

## Changes

- Added a synchronous inline script immediately after the head charset. For HTTP on exactly `butterinthesalsa.com`, it uses `location.replace` to navigate to HTTPS, preserving path, query and fragment and clearing an explicit HTTP port. It runs before the compiled client module. HTTPS, localhost, loopback and unrelated hosts remain unchanged.
- The poll client returns before any DOM, observer, storage, API or widget initialization when on canonical HTTP, covering navigation still in progress. The backend continues to accept only the exact approved HTTPS origin; no HTTP origin was added.
- Artifact validation now requires the early synchronous inline redirect and rejects missing, deferred or late scripts. Added compiled-script navigation cases and an actual TypeScript client test proving no initialization while canonical HTTP navigation is pending. These run through the existing release command and CI job; no new deployment automation or dependency was introduced.
- Operations README explains the redirect and its scope. This is a JavaScript browser redirect in the candidate site, not a server 301 or a change to hosted HTTPS enforcement. Polling/voting still requires JavaScript. The existing published splash remains unchanged until a separately authorized release.

## Validation

Evidence directory on edge01: `working/poll-https-entry/`.

- Shared `npm run validate:release` passed: 16/16 poll tests, including the new HTTP startup guard, and the initial 17 compiled/artifact checks. After adding explicit late/deferred-script rejection cases, reran the artifact group alone: final 19/19 pass. No implementation changed after the shared gate; the final additions were regression tests and operations documentation. Together the candidate has 16 poll and 19 artifact/navigation checks.
- Seven compiled-script cases verify HTTP-to-HTTPS navigation, query/fragment preservation, a path with HTTP port, HTTPS without a loop, and unchanged localhost/loopback/unrelated hosts. Artifact mutations verify the redirect cannot be absent, deferred or after the client module.
- Browser regression served the exact compiled artifact through interception at canonical HTTP and HTTPS. Navigation reached `https://butterinthesalsa.com/?from=friend#reunion-poll`; secure context and crypto.randomUUID were available. All API/widget initialization occurred only in the HTTPS document. Closed fieldset/submit, four zero results and manual refresh worked; no POST or browser error occurred. API/widget responses were mocked using the recorded closed response and synthetic verifier. This was not hosted voting, real production Turnstile or human accessibility acceptance. Browser closed after the check.
- Abbey site build, site validate, publish --dry-run and project consistency validation passed. Git whitespace and final Abbey review recorded. No dependency changes; prior clean-install rehearsal/audits remain supporting evidence rather than fresh claims.
- Source diff/status and preservation digests are retained. Secret-value scan covers candidate files and compiled output without exposing values.

## Live preservation

Read-only live API/D1 checks confirm production open=false, zero ballots and all four zero counters. Production Worker remains `6d52882d-e06e-4e54-98fc-7c23c38b7f0c` with D1 `a6d45ef4-32d4-4d7a-a501-c2c0788fbcd3`.

Preview retains three ballots and matching grouped counts: Butter 1, Salsa 0, Absolutely not 1, Whatever 1. Preview Worker remains `3f2da025-703c-4b45-bbc9-a048f2dea6ff`. No hosted POST, resource mutation, migration, secret rotation or deployment occurred.

HTTP and HTTPS independently still serve the accepted public splash SHA256 `55fef72d32f1265fa1e9d2fdca99a82396183f1f90d23cca6fe8100f595e5a00`. Existing preview PID 332757 and the Mac localhost:4322 tunnel remain running and return HTTP 200; neither was restarted. Active preview access-log appends are expected from read-only health checks.

## Result and remaining gates

The HTTP entry blocker is fixed in the uncommitted site candidate and covered by the existing release gate. The running/public site has not received this change. No commit, push, public release, DNS or hosted Pages change occurred. Voting remains closed.

Human mobile-device and screen-reader acceptance, recovery/retention decisions, review of this exact candidate, and separately authorized commit/publication remain outstanding. Off-host secret recovery and hosted database restore remain unverified. Opening voting requires separate explicit approval and an approved production ballot/accounting plan.
