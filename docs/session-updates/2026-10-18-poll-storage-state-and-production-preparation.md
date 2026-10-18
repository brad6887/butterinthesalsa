---
title: "Poll storage state and production preparation"
description: "Fix storage-denial state and prepare closed production and rollback templates without deployment."
date: 2026-10-18
status: complete
reviewed: false
session: poll-storage-state-and-production-preparation
tags:
  - Abbey Root
---

# Poll storage state and production preparation

## Objective

Fix the confirmed browser storage-state issue, reconcile the current operations runbook and prepare explicit production/emergency-close configurations and a rollback record. Preserve hosted preview, tunnel, ballots and unrelated dirty work. No commit, push, provisioning, deployment, publication or DNS change.

## Definition of Done

- Storage denial keeps choices/submission disabled after delayed results and refresh, without losing its explanation; voting errors/confirmation survive results refresh.
- Runbook states completed hosted acceptance and outstanding production/human gates without contradictory current-status snapshots.
- Separate closed production/close templates and a rollback record identify remaining provisioning/version placeholders and ballot-preserving operations.
- Meaningful regression and isolated local close checks, Worker/template dry runs, Abbey build/validate/publication dry run, whitespace/diff inspection and completed session capture.

## Summary

Completed the authorized bounded implementation/preparation session on edge01 in `/home/bcooke/git/butterinthesalsa`, starting at uncommitted HEAD `f681148`. Used `abbey session`, preserved before-state evidence, changed only the scoped frontend/runbook/test/config files and used `abbey session capture`. Production readiness is not release approval.

## Accomplishments

- Added explicit storage eligibility to `site/src/scripts/reunion-poll.ts`. Failed storage read/write leaves the fieldset and Submit disabled even when delayed GET succeeds; results remain usable. Storage recovery requires reload, as the notice says.
- Moved results success/failure announcements to the results note, made it a polite live status in `ReunionPoll.astro`, and retained voting eligibility, verification errors and recorded-vote confirmation during refresh. Closed state remains explicit and recovers on reopen.
- Rewrote `site/poll-api/README.md` around one current status: hosted acceptance complete, two preview votes, uploaded preview secret bindings, separate production gates and links to authoritative captures. Historical session evidence remains unchanged.
- Added `wrangler.production.example.json` and `wrangler.production-close.example.json`: proposed separate Worker/D1 names, exact HTTPS origin/domain, production-only limiter namespaces, production entry, disabled observability/preview URLs and POLL_OPEN=false. workers.dev stays enabled in the close template so closing can preserve results. Templates contain the nil DB UUID because production does not exist; do not deploy examples.
- Added `rollback.production.example.json`, an explicitly unprepared operator record, not a Wrangler config. It requires actual production resource/version/commit/schema digest/secret custody/restore-evidence references. No secret values. Runbook distinguishes close, code rollback, frontend withdrawal and data recovery, including native rollback's possible reopen window.
- Added meaningful client-state and config/close regression checks. `npm test` uses Node's built-in TypeScript stripping to exercise the actual client; no dependencies or lockfile changes.

## Validation

- `npm test`: 14 checks pass, including the original seven API/runtime groups, four nested client-state cases, production-template separation and isolated production-close preservation. D1 tests use nonpersistent local bindings and synthetic secrets; no remote votes.
- Client checks cover denied storage read/write, delayed GET, repeated successful/failed results refresh, reload after recovery, expiry/error/confirmation preservation and closed/reopened state. The same frontend tests fail against the saved original source, demonstrating regression sensitivity.
- Local close rehearsal records one synthetic ballot into isolated D1, closes with template settings, verifies new POST rejection, readable GET with open=false and unchanged ballot/counter count of one. It is not a hosted rollback or export/restore rehearsal.
- Default Worker, production-template and close-template bundle dry runs pass; no uploads/deployments.
- Abbey site build, site validate and site publish --dry-run pass. Default frontend remains unconfigured; no production public environment settings added. Whitespace checks include all session files, including untracked source. Final tracked Git whitespace check passes.
- Preserved-file SHA256 checks pass for Worker source/shared constants, migration, all four existing preview/local configs, index.astro and .gitignore. Existing dirty changes remain intact. Before archive and scoped diff are retained in `working/poll-fixes/`.
- Original edge01 preview PID 332757 remains running from `/tmp/butter-real-preview`; edge01 and Mac localhost:4322 both return HTTP 200. Neither preview copy nor tunnel was replaced/restarted during this session. The unchanged disposable preview still serves the earlier source; new frontend behavior is validated locally and is not claimed live there.
- No audit rerun: dependencies and lockfiles are unchanged; previous audit evidence remains historical. No successful hosted acceptance tests were repeated and no remote database writes were made.
- `abbey review` accepts changed session metadata; existing historical missing-tags/backlog warnings remain outside scope.

## Evidence

On edge01 under `working/poll-fixes/`: `tests.log`, `regression-before.log`, `worker-dry-run.log`, `production-dry-run.log`, `production-close-dry-run.log`, `abbey-build.log`, `abbey-validate.log`, `abbey-dry-run.log`, `abbey-review.log`, `session.diff`, `source-before.tar`, preserved-file hashes and before/after status. Source snapshots are token-free; no ignored environment or secret files were copied.

## Remaining gates

- Production resources, real D1 IDs, widget/site key, new server secrets, approved version IDs and recovery custody remain unprepared. Templates are concrete review artifacts, not provisioned deployment configurations.
- Complete private export/restore rehearsal before relying on database recovery; native version rollback has not been exercised. No production ballot may be used for smoke testing without a separate approved accounting plan.
- Owner-reported keyboard/arrow/200% zoom acceptance from the review remains recorded. Screen-reader use and a separate mobile-device check remain unconfirmed. The new live-status behavior has not received human screen-reader acceptance.
- Commit/push, provisioning, deployment, opening voting, Pages publication and DNS changes require separate authorization. No such action occurred here.
