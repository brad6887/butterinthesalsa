---
title: "Poll database recovery rehearsal"
description: "Prove synthetic local D1 export and fresh restore with preserved schema, counters, migration ledger and duplicate behavior."
date: 2026-10-18
status: complete
reviewed: false
session: poll-database-recovery-rehearsal
tags:
  - Abbey Root
---

# Poll database recovery rehearsal

## Objective

Database recovery rehearsal ONLY on edge01 in /home/bcooke/git/butterinthesalsa. Use synthetic ballots in isolated temporary local D1. Preserve hosted preview Worker/D1 (recorded two preview votes), preview process, Mac tunnel and unrelated dirty work. No production provisioning, hosted database writes, commit, push, publication, DNS or Pages changes.

## Definition of Done

- Repeatable exports and two fresh restores preserve exact ballot rows, all counters, schema, trigger and migration ledger.
- Post-restore GET, duplicate recovery, new ballot trigger, constraints and practical failure/recovery checks pass.
- Exact local operator commands, verification evidence, rollback references and hosted limitations documented without tokens or credentials.
- Focused tests, Worker/template dry runs, Abbey build/validate/publish dry run, diff/status review and completed Abbey session capture.

## Summary

Completed the bounded local rehearsal at existing uncommitted HEAD f681148. Followed Abbey session startup and capture. Production remains unprovisioned and unapproved; local recovery is not hosted recovery acceptance. Planning status/NEXT still describe the historical splash release; their broad reconciliation is deferred in favor of this session capture and the current operations runbook.

## Accomplishments

- Added test/recovery.test.js to the existing poll API test suite. No dependency, frontend, Worker, migration or deployed-config changes.
- The test creates unique temporary source, two restore targets, collision/failure targets and a fresh recovery target, each with a local-only configuration and nil database UUID. Uses installed Wrangler 4.151.1 and Node 22.23.3. Removes all temporary databases and SQL dumps in finally.
- Applied current migration using Wrangler tracking; seeded four synthetic votes through the actual Worker with an injected synthetic verifier. Baseline Butter 2, Salsa 1, Absolutely not 0, Whatever 1.
- Two unchanged-source SQL exports are byte-identical within each run. Full dump includes d1_migrations. Importing into two empty databases and then applying migrations is compatible and a no-op. Ordered ballot rows, all totals, schema SQL, trigger and migration ledger match the source exactly; no double counting.
- Post-restore GET total is 4. Duplicate with changed requested choice returns original Butter without calling verification or changing data. Direct duplicate, invalid foreign key and negative counter writes reject without altering the snapshot. New synthetic ballot increments exactly once to total 5; close rejects a write and preserves rows/counters. Deliberate counter corruption is detected.
- Import to an already migrated target fails on migration-ledger uniqueness; malformed SQL import fails. Fresh isolated recovery from the unchanged backup succeeds. Source snapshot remains unchanged. No partial-import atomicity assumption and no live repair procedure.
- Expanded runbook with executable and underlying exact commands, SQL verification, failed-target disposal and future remote gates. Updated rollback record with reviewed migration digest and local evidence reference; resource/version/secret custody placeholders and UNPREPARED status remain.

## Validation

- Final npm test: 15/15 pass, zero failures. Machine-readable report are in working/poll-recovery/tests.log and report.json. Includes original API/frontend/production-close checks plus local recovery.
- Default Worker and production/close template bundle-only dry runs passed.
- Abbey site build, site validate and site publish --dry-run passed; no push/deployment started.
- Before-state status/tracked diff and preserved-file SHA256 evidence recorded. Final preservation verification covers Worker, migration, all existing Wrangler configurations, frontend files, index.astro and .gitignore.
- Existing edge01 preview PID 332757 remains running; edge01 and Mac localhost:4322 return HTTP 200. Neither process, disposable source copy nor tunnel was restarted.
- Hosted preview was not queried or written. Two preview votes remain the prior accepted state, not a newly audited remote count. Local tests provide no new hosted acceptance evidence.
- Earlier failed suite evidence is retained: first-suite-failure.log records an overly narrow expected error assertion (actual collision is d1_migrations.id uniqueness); unsupported-integrity-pragma.log records D1 rejecting PRAGMA integrity_check. Final test explicitly verifies that unsupported pragma boundary; application/schema/foreign-key integrity checks remain substantive.
- Final tracked diff is byte-identical to the before-state; git diff --check and all four scoped untracked-file whitespace checks pass. Abbey review accepts all changed session metadata; pre-existing historical metadata/backlog warnings remain outside scope.
- No credentials/tokens printed. Test secrets/identities are fixed synthetic fixtures. Existing tests announce loading .dev.vars but do not print values; new rehearsal configuration lives outside its directory and never reads hosted config or secret files.

## Evidence

working/poll-recovery/: commands.log (expanded local commands/results), report.json (schema, totals, migration/export digests, checks and temporary-store cleanup), tests.log, Worker/template dry-run logs, Abbey logs, before/after status, preservation verification and scoped session-files.diff. Only synthetic aggregate/schema data is retained; temporary ballot exports are removed.

Reviewed migration SHA256: a6ba4d3b5d708d6fa1024922c2597a2d715871a142930eb2aade66976df54f84. Export digest is run-specific in report.json because the migration ledger contains a timestamp.

## Limits and next gates

- Cloudflare remote export/import semantics, managed dump ordering/format, atomicity, blocking duration, Time Travel, large-data behavior, binding cutover, real-secret recovery and hosted Worker operation remain unproven.
- D1 rejects PRAGMA integrity_check (SQLITE_AUTH). No full SQLite page-level integrity claim.
- Future remote recovery needs separate approval and a newly provisioned isolated target, private backup custody and maintenance window. Preserve active data/binding/HMAC on failure; discard only an approved disposable target. Never restore over live ballots as code rollback.
- Screen-reader/mobile human checks, real production resources/configuration, secrets, compatible versions, release approval and publication remain outstanding.
- No commit, push, provisioning, hosted write, deployment, publication, DNS or Pages change occurred.
