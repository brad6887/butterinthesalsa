---
title: "Closed poll production provisioning"
description: "Separate production Cloudflare resources deployed with voting closed and zero ballots."
date: 2026-10-18
status: complete
reviewed: false
session: closed-poll-production-provisioning
tags:
  - Abbey Root
---

# Closed poll production provisioning

## Objective and Definition of Done

Continue the authorized production provisioning with voting CLOSED. Reuse the empty production D1; preserve all three owner-confirmed preview votes, preview process/tunnel and unrelated dirty work. Complete separate migration/widget/secrets/configuration/deployment, closed acceptance, zero database checks, focused validation and recovery metadata. No opening voting, public release, commits/pushes, DNS or Pages changes.

## Review and authorization

Owner confirmed the third preview vote was theirs and explicitly authorized continuation. The earlier blocked session is historical and is preserved unchanged. Reran abbey session; reviewed Git status, prior diff/capture and production/close templates. Live inventories matched approved account 66f376df57f4fb383fde1bbe8b29ffb1, preview Worker/widget/D1 and the existing empty production D1. Verified preview total three before mutations. Read-only urllib request to preview received 403; curl with the approved origin successfully verified the expected counts. No preview vote requests were made.

## Production resources and deployed state

- D1: butter-salsa-production, a6d45ef4-32d4-4d7a-a501-c2c0788fbcd3, WNAM; reused, not recreated. Applied versioned 0001_poll.sql using explicit production config and Wrangler remote migration tracking. Migration SHA256 a6ba4d3b5d708d6fa1024922c2597a2d715871a142930eb2aade66976df54f84.
- Worker: butter-salsa-poll-production, https://butter-salsa-poll-production.butter-salsa.workers.dev. Initial closed upload d77b9103-880e-40a0-bc84-1ceb7d7ee0d2; final active version after secret upload 6d52882d-e06e-4e54-98fc-7c23c38b7f0c, deployed at 2026-10-18T14:09:28.727Z. Actual provider version metadata independently inspected.
- Production and emergency-close actual configs are identical: POLL_OPEN=false, workers_dev=true, preview_urls=false, observability=false, origin exactly https://butterinthesalsa.com and hostname butterinthesalsa.com. Limiters 2001 (5/60s) and 2002 (60/60s), separate from preview 1001/1002. No custom domain/routes configured.
- Turnstile managed widget 0x4AAAAAAFaOigIB5KHmUF-l, configured domains exactly [butterinthesalsa.com], no_clearance, separate from localhost preview. Worker checks the exact hostname. Public metadata only in production-widget.json; no frontend settings changed.
- Fresh production TURNSTILE_SECRET and random 32-byte VOTER_HASH_SECRET uploaded via private file; binding names independently verified. Compared production values with preview locally without emitting values and confirmed separation. Recovery custody edge01:/home/bcooke/.local/state/butter-salsa-production/worker-secrets.json; file 0600, directory 0700, outside repository. No secret values in Git or evidence. This is local operator custody, not a verified independent off-host backup or a tested secret-loss recovery procedure. Preserve HMAC across releases.

## Acceptance and validation

- Production GET with exact approved origin returned HTTP 200, open=false, all four choices and total zero. Two POST probes (well-formed synthetic identity/token and empty body) both returned HTTP 403 with Voting is closed. No challenge bypass or accepted production ballot. Preview origin against production returned 403.
- Remote D1 queried before/after probes: zero ballots, all four counters zero, expected schema and count_ballot trigger, migration ledger 0001 and no foreign-key violations. Query result snapshots match after probes. No preview/production ballot writes performed.
- Preview remote D1 still contains three ballots and counters Butter 1, Salsa 0, Absolutely not 1, Whatever 1. Provider Worker/widget metadata compared against preflight; no mutation intended or performed. Process/tunnel checked separately at final preservation.
- 15/15 tests pass, including local recovery in a new evidence directory. API and site dependency audits both report zero vulnerabilities. Default and actual production/close Worker bundle dry runs pass. Abbey site build, validate and publish --dry-run pass; no publication initiated. Existing frontend environment settings remain unchanged.
- Git whitespace and before/after tracked-diff checks, preserved-file digests, new-file whitespace and secret-value scan, final status and abbey review are recorded in working/poll-production/resumed. README is the only deliberate edit to a pre-existing implementation file; actual configs/widget/rollback and this capture are new. Example templates and prior sessions preserved.

## Evidence and recovery record

working/poll-production/resumed contains preflight inventories/status/diff/hashes; production and preview D1 aggregate/schema evidence; HTTP bodies/headers; acceptance.json; deployments.json; deployed-version.json; widget-verified.json; source-digests.json; tests/audits/build/validate/dry-run logs; final preservation/status/review. These retain no ballot hashes or secret values. Actual operator rollback record is site/poll-api/rollback.production.json. Source remains an uncommitted worktree based on f681148; no prior compatible production version or released production frontend exists. Do not select a preview version as rollback.

## Limits and next step

Closed API acceptance does not prove real production challenge/vote success, rate limits under load, secret-loss recovery, remote database restore/atomicity/downtime or public frontend acceptance. Remote recovery remains separately approved and requires voting closure/maintenance and private backup custody. Human screen-reader/mobile checks remain outstanding. Review these resources and the uncommitted implementation before separately authorizing any commit, push/public release or opening voting. No commit, push, public website release, voting enablement, DNS or Pages changes occurred.
