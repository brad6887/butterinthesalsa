---
title: "Final hosted poll acceptance"
description: "Recovered interrupted acceptance, confirmed real token expiry and unchanged public splash."
date: 2026-10-18
status: pending
reviewed: false
session: final-hosted-poll-acceptance
tags:
  - Abbey Root
---

# Final hosted poll acceptance

## Objective

Recover the interrupted hosted preview acceptance without repeating completed tests or changing production.

## Definition of Done

- Determine expiration outcome, retain token-free evidence, verify preview totals and public state, inspect Git, and complete session capture.

## Summary

Acceptance is complete for the scoped hosted preview checks. The session capture was still a TODO template on recovery. The original browser tab and in-memory token survived; its timer completed during recovery, so no new token or vote was needed. The unused real token was held for 310425.7 ms and submitted with a fresh identity at 07:44:01 CDT. HTTP 400 returned the verification-failed-or-expired response. Final results at 07:44:13 remained Butter 1, Whatever 1, total 2.

## Accomplishments

- Recovered the surviving real-widget harness without reloading or restarting it. Tokens stayed in memory and out of evidence.
- Preserved existing valid-vote and consumed-token replay evidence; no unnecessary acceptance reruns.
- Independently rechecked remote preview D1: two ballots, grouped ballots and all counters agree; read-only queries report zero writes.
- Reviewed tracked diff, Worker implementation, configuration, operations notes and saved validation logs.

## Impact

The final missing hosted preview check passed. This is acceptance evidence, not production admission or publication approval.

## Validation

- `working/poll-review/hosted-recovered-expiration.json`: UI-transcribed recovered timing, HTTP 400 and final results. Original browser page remains open.
- `hosted-recovery-d1.json`: current remote totals and grouped ballots match exactly.
- `hosted-recovery-deployments.json`: preview Worker latest deployment remains version 3f2da025-703c-4b45-bbc9-a048f2dea6ff from 07:09:16 CDT; no recovery deployment.
- Existing `api-tests-final-acceptance.log`: seven passing test groups. Both final audit JSON files report zero vulnerabilities. Existing Worker bundle dry-run and Abbey build/validate/publication dry-run passed; not rerun.
- Existing hosted negative evidence covers CORS, malformed/invalid/oversized requests, nonempty invalid token and bounded location-scoped rate limiting.
- `hosted-recovery-public.json`: HTTP 200 and HTTPS 200 independently match published splash SHA256 55fef72d32f1265fa1e9d2fdca99a82396183f1f90d23cca6fe8100f595e5a00.
- Local HEAD and remote main both f6811482318348f2b17c92569d4d7ad0424001b1. Git diff whitespace check passed. Existing source changes remain uncommitted.
- D1 inventory contains only butter-salsa-preview; no production database was provisioned. Provider inventory labels D1 storage version as production; the resource name and binding identify this as preview.
- Initial recovery query mistakenly referenced poll_counts; it failed read-only with no such table. Corrected query used migration-defined totals table and passed.

## Lessons Learned

A browser-held token/timer can survive an agent exit. Inspect the retained tab before recreating tests. hosted-final-d1.json is historical initial-zero evidence, not the current final state. Same-browser duplicate UI alone does not prove a second Worker request; consumed-token replay under a fresh identity separately proves rejection.

## Next Steps

- Review the final implementation and acceptance evidence for release readiness.
- Production requires separate authorization, isolated production D1/widget/secrets and configuration, a zero-vote check, frontend build settings, and later release validation.
- Complete human mobile/keyboard/screen-reader acceptance as required by the operations checklist before release approval.
- The hosted preview is publicly reachable on workers.dev with localhost origin filtering; origin filtering is not access control. Add approved access control if a private hosted preview is required.

## Notes

No commits, pushes, production resources, DNS changes or public deployment were performed. Existing Astro loopback preview PID 332757 and local Worker processes were left running. The existing localhost:4322 SSH tunnel remained usable through the retained browser page; no tunnel was stopped or recreated. README earlier setup/acceptance snapshots are historical; this session capture is the current acceptance record. No broad documentation rewrite was made. Journal creation is optional under Abbey policy and was not requested.
