---
title: "HTTPS poll candidate release review"
description: "Redirect blocker resolved; human acceptance and operational decisions remain."
date: 2026-10-18
status: complete
reviewed: false
session: https-poll-candidate-release-review
tags:
  - Abbey Root
---

# HTTPS poll candidate release review

## Objective and Definition of Done

Review the current uncommitted release candidate and HTTPS redirect evidence on edge01 in `/home/bcooke/git/butterinthesalsa`; identify remaining blockers, verify closed production and three preview votes, and capture the review. No implementation fixes, commits, pushes, public release, Worker deployment, voting enablement, DNS or hosted Pages changes.

## Decision

**No additional blocking code defect was established in the updated candidate. The HTTP entry blocker is resolved in the uncommitted site.** The prior production frontend configuration and release-validation findings remain resolved. Release is still pending human acceptance, operational decisions and explicit authorization; this review does not approve publication or opening voting.

## Redirect and startup review

- The canonical redirect is a classic synchronous inline script at the start of the head, ahead of the client module. Its exact HTTP/hostname guard limits it to `http://butterinthesalsa.com`; HTTPS and local previews are unaffected. Constructing the target from the existing URL preserves path/query/fragment, changes protocol and clears the HTTP port. `location.replace` avoids adding the insecure page to back history. No user-supplied host or destination is accepted.
- The actual TypeScript poll client returns before DOM, storage, observers or requests on canonical HTTP. This covers the period after redirect initiation but before navigation completes. Exact HTTPS-only API origin and production resource configuration are unchanged.
- The artifact gate requires the early inline script and rejects missing, deferred or late placement. Compiled-script tests check HTTP, path/query/fragment, HTTP port, HTTPS without a loop and unchanged local/unrelated hosts. A frontend test uses a root that throws on any access to verify no HTTP startup. Existing tests remain in the shared release command before Pages artifact upload.
- Inspected browser evidence records the exact compiled artifact moving from HTTP to HTTPS with its query and fragment intact, a secure context and available randomUUID. Widget and API initialization occurred only in the HTTPS document; closed controls, four zero counters and refresh passed with zero POSTs and zero page errors.
- That browser evidence intercepted both canonical documents and mocked closed API/widget responses. It establishes candidate browser behavior, not an already deployed redirect, server 301/HSTS enforcement, real production challenge success or human accessibility. JavaScript is required for this redirect and for the poll. Those are documented scope limits, not newly discovered code defects.

## Validation evidence assessed

Current source/artifact hashes exactly match `working/poll-https-entry/source-artifact-digests.json`. Worker/constants/migration and actual production/close configurations match the provisioning digests. Existing successful evidence therefore applies to this unchanged candidate:

- 16/16 poll tests, including the HTTP startup guard.
- 19/19 final compiled redirect and artifact checks. The shared release run initially contained 17 artifact checks; the final two test-only additions were run afterward as the full 19-check group. No claim of a single 35-check historical invocation.
- Compiled-browser HTTP-to-HTTPS regression, closed results and no submissions.
- Abbey site build, site validate, publish dry-run and project consistency checks.
- Earlier clean-install rehearsal and zero-vulnerability audits remain supporting evidence. No dependency changes followed them. No GitHub Actions run has been dispatched for this uncommitted candidate.

Reviewed source/tests/configuration and existing logs instead of repeatedly rebuilding or rerunning unchanged suites. Whitespace and final preservation/review checks are fresh.

## Remaining release gates

1. **Human accessibility acceptance:** separate mobile-device and screen-reader checks are still unconfirmed. Existing owner keyboard/navigation/zoom passes and automated axe/viewport results do not establish these missing checks. Exercise the real verification frame, labels, statuses, results and navigation without another preview vote.
2. **Operational decision before real ballots:** choose closure/deletion and private backup retention responsibilities, and resolve or explicitly accept the documented recovery exposure. Independent off-host secret recovery and hosted database restore/cutover behavior remain unverified; local restore success is not remote recovery acceptance. No new recovery operation or secret movement was performed.
3. **Release authorization and evidence:** review/pin the exact final source and frontend artifact under separately authorized commit/publication. Verify actual Actions build/deploy and served HTTP/HTTPS behavior after an approved release. A closed results-only release and opening production voting are distinct approvals. Any future production write acceptance requires a separately approved ballot/accounting plan.

These are acceptance/operational/authorization gates, not additional implementation defects inferred from hypothetical risks.

## Live state and preservation

Fresh read-only API and D1 aggregate/grouped queries confirm production open=false, zero ballots and four zero counters. Its active Worker remains `6d52882d-e06e-4e54-98fc-7c23c38b7f0c`.

Preview still has Butter 1, Salsa 0, Absolutely not 1, Whatever 1: all three ballots preserved with matching grouped counts. Its active Worker remains `3f2da025-703c-4b45-bbc9-a048f2dea6ff`.

HTTP and HTTPS separately continue serving the accepted public splash SHA256 `55fef72d32f1265fa1e9d2fdca99a82396183f1f90d23cca6fe8100f595e5a00`; the new redirect has not been released. Preview PID 332757 and existing Mac localhost:4322 tunnel remain running and return HTTP 200. No restart or tunnel change.

Review evidence lives under `working/poll-https-final-review/`: before/after status/diff/hashes, read-only live API/D1 evidence, active version/public splash summary, preservation and Abbey review. No voter hashes or secret values retained. All pre-existing source, static evidence and dirty tracked diff preserved; live preview access-log appends are expected. Only this review capture and its evidence were added.

## Suggested next step

Complete or explicitly resolve the remaining human acceptance and recovery/retention gates, then seek separate authorization for the concrete release. Keep production voting closed throughout. No commits, pushes, public release, DNS, hosted Pages or deployed Worker changes occurred during this review.
