---
title: "Poll release readiness review after production provisioning"
description: "Review-only release findings and current closed production evidence."
date: 2026-10-18
status: complete
reviewed: false
session: poll-release-readiness-review-after-production
tags:
  - Abbey Root
---

# Poll release readiness review after production provisioning

## Objective and definition of done

Review the full uncommitted implementation and production evidence on edge01 at `/home/bcooke/git/butterinthesalsa`, HEAD f681148. Identify actionable release findings, verify the closed production baseline and preview preservation, distinguish unperformed acceptance from passing tests, and capture the review. Review completion does not authorize release. No implementation fixes, deployment, voting enablement, commits/pushes, DNS or Pages changes.

## Decision

Not ready to publish the configured public poll as-is. The closed backend is substantiated by code review and current read-only checks. No additional blocking defect was established in the ballot insertion, duplicate recovery, HMAC, SQL constraints, exact origin/hostname checks or emergency-close implementation. This is not a proof of security or acceptance of open production voting.

The two actionable release findings are in the publication path. The first is a required unfinished release preparation step, not an unauthorized change that should already have been made. Keep the backend closed while addressing these findings in a separately requested implementation session.

## Findings

1. **P1 — The actual Pages build produces an unconfigured poll.** `.github/workflows/pages.yml:27-32`; `site/src/components/ReunionPoll.astro:2-3`; `site/src/scripts/reunion-poll.ts:5-6`. Neither the workflow nor committed build configuration supplies PUBLIC_POLL_API_URL or PUBLIC_TURNSTILE_SITE_KEY. The current built `site/dist/index.html` has bare/empty data-api and data-site-key attributes; the client returns before initializing results. A push of the present candidate would display the new poll section but never load production results, even with voting deliberately closed. Before publication, explicitly wire the public production URL and public site key into the intended build, keeping all server secrets excluded. Produce and inspect the exact configured artifact while POLL_OPEN remains false. Confirm four readable zero counters and closed controls; reject localhost, preview targets and placeholders. Astro substitutes these values at build time, so backend provisioning cannot repair an already unconfigured frontend artifact.

2. **P2 — The publication checks do not establish poll release correctness.** `.github/workflows/pages.yml:27-32`; `.abbey/project.yml:17-20`. CI installs only the site dependencies and builds Astro; it never installs/runs the separate poll API suite. Artifact validation checks only a nonempty index and absent CNAME. Abbey validation commands also omit the poll suite, and route validation does not inspect poll settings. Consequently the concrete unconfigured artifact in finding 1 passes all existing publication checks, and future backend/client regression tests can fail without blocking the site job. Add a bounded poll validation gate using the existing 15-test suite with explicit poll-api working directory and separate dependency install/cache, plus assertions for the intended release artifact's API/widget target. Keep default intentionally disabled builds distinguishable from an explicitly configured poll release. No Worker auto-deployment or new framework is needed. Existing hosted acceptance helpers are not a substitute: several merely record pass=false without failing, some do not require limiter occurrence, and the token harness writes a preview ballot and can overwrite old evidence. They were reviewed but not rerun.

## Remaining acceptance and operational decisions

- **Human acceptance:** keyboard navigation, radio arrows, focus/navigation and 200% zoom have owner-reported passes. A separate mobile-device check and VoiceOver/screen-reader pass remain unconfirmed. Existing axe/viewport checks and synthetic widget tests do not close those gaps. Validate question/choice labels, real verification entry/exit, closed state, status announcements, results refresh and mobile layout without adding a vote.
- **Production scope:** GET/closed POST acceptance does not exercise production Siteverify or the open write path. Prior real preview token/expiry/replay acceptance and current isolated tests are supporting evidence, not a production vote. Do not open production or create a smoke ballot as part of this review. Any future production write acceptance needs an explicitly approved ballot/accounting plan.
- **Recovery:** local restore rehearsal is repeatable and passed again. Remote restore atomicity, cutover, blocking duration and secret-loss recovery remain untested. Both secrets have verified private local custody outside Git; no independently recoverable off-host copy has been verified. Before admitting real ballots, explicitly accept or resolve that recovery exposure and choose closure/deletion and backup retention responsibilities. No new backup/export or data operation was performed.
- **Release identity:** actual Worker version and source/config/migration digests are recorded, but source remains uncommitted and there is no released production frontend commit. Pin the final reviewed source and frontend artifact under separately granted commit/release approval. The current compatible closed Worker is a reference; there is no older production version to roll back to.
- **Minor documentation cleanup:** README's current-state section correctly records three preview votes and actual closed production resources, but the retained preparation checklist at line 146 still says “Preview remains two votes.” Its historical/procedural label reduces ambiguity, but update that current operational invariant to three before reuse. Preserve historical session captures unchanged.

These gaps are separate from authorization: passing review or tests never grants commit, publication or voting approval. A configured results-only release with voting closed and an open-voting launch are separate decisions.

## Review coverage and evidence

Read the complete tracked diff and all untracked implementation categories: Astro page/component and actual TypeScript client; Worker/shared constants; migration; every Wrangler config; production/close pair and rollback records; public widget metadata; package manifests/lock structure; API/runtime/frontend/production-close/recovery tests; all hosted/browser/local helpers; operations README; prior readiness, hosted acceptance, recovery and provisioning captures. Prior generated build/audit/dry-run logs were inspected rather than described as fresh runs.

Worker review confirmed parameterized SQL, bounded streamed JSON, exact action/hostname verification with timeout, server-only HMAC, immutable unique identity and atomic insert trigger. Origin filtering is not authentication; storage clearing bypasses best-effort repeat prevention as disclosed. Rate limiters are approximate and location-scoped, and GET traffic has no explicit application admission limiter. No new identity infrastructure is proposed. Client review confirmed storage eligibility survives delayed GET/refresh, separate voting/results statuses, stale-result messaging and bounded visibility-aware polling.

Fresh evidence under `working/poll-release-review/`:

- `tests.log`: 15 tests pass, zero failures. Synthetic local recovery writes to this review's separate directory and removes its temporary stores; no earlier evidence overwritten.
- `production-get.json`, `production-db.json`: live open=false, zero ballots, all four zero counters, tracked 0001 migration, grouped ballot/counter agreement and no foreign-key violations. Review sends no POSTs; rejected-POST evidence is from the immediately preceding provisioning session.
- `preview-get.json`, `preview-db.json`: all three votes preserved, Butter 1 / Salsa 0 / Absolutely not 1 / Whatever 1. Read-only D1 aggregate queries retain no voter hashes.
- `production-deployments.json`, `preview-deployments.json`: unchanged active versions 6d52882d-e06e-4e54-98fc-7c23c38b7f0c and 3f2da025-703c-4b45-bbc9-a048f2dea6ff respectively.
- Current Worker, poll constants, migration and actual production/close configs exactly match `working/poll-production/resumed/source-digests.json`. Inspected actual deployed version bindings: production D1 a6d45ef4-32d4-4d7a-a501-c2c0788fbcd3; namespaces 2001/2002; exact HTTPS origin and hostname; POLL_OPEN=false; both secret binding names. No secret values read into output.
- Release-scope scan for actual private preview and production secret values is clean. Private files remain outside candidate Git content; public widget keys and account/resource IDs are intentionally public metadata.
- `public-site.json`: HTTP and HTTPS independently return the accepted splash SHA256 55fef72d32f1265fa1e9d2fdca99a82396183f1f90d23cca6fe8100f595e5a00. No public poll content released.
- Preview PID 332757 remains running; edge01 and the existing Mac tunnel return HTTP 200. No process/tunnel restart.
- `before-status.txt`, `before.diff`, `before-hashes.json`, final preservation/status/review records: implementation, static existing evidence and dirty tracked diff preserved. The running preview naturally appended HTTP 200 access entries to `working/poll-review/hosted-human-preview.log` during read-only health checks; it was not rewritten or restarted. Only this review's evidence and Abbey capture are added.

Prior provisioning validation remains applicable to the unchanged source: API and site audits report zero vulnerabilities; Worker default/production/close bundle dry runs and Abbey build/validate/publish dry run passed. Those checks were not rerun gratuitously and do not validate a configured public production frontend.

## Bounded next session

Prepare the public build configuration and a meaningful poll/artifact gate without deploying or opening voting; complete mobile/screen-reader acceptance and record the recovery/retention decision. Re-review that exact candidate, then request separate commit/publication authorization. Opening voting remains a later explicit approval. No fixes were made during this review.

## Primary references

- Astro environment variables and build-time substitution: https://docs.astro.build/en/guides/environment-variables/
- Cloudflare versions capture code, bindings and compatibility: https://developers.cloudflare.com/workers/versions-and-deployments/
- Rollback constraints: https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/
- Turnstile hostname rules (widget hostname configuration includes subdomains; exact acceptance is additionally enforced by this Worker): https://developers.cloudflare.com/turnstile/additional-configuration/hostname-management/
