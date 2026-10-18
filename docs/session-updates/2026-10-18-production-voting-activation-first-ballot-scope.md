---
title: "Production voting activation and first ballot scope"
description: "Prepared activation, one genuine owner ballot and accounting; execution awaits approval."
date: 2026-10-18
status: complete
reviewed: false
session: production-voting-activation-first-ballot-scope
tags:
  - Abbey Root
---

# Production voting activation and first ballot scope

## Approval status and definition of done

PREPARED ONLY. Owner requested a concrete scope and selected Team Whatever for the genuine first ballot and leaving voting open after success. Those selections are not activation approval. Production remains CLOSED. No Worker upload/deployment, vote submission, commit, push, Pages/DNS change, migration or data mutation occurred in this preparation.

Definition of done: pinned reviewed source and exact open/close configuration; owner ballot/accounting rules; activation/verification sequence; bounded failure closure; preview preservation and explicit exclusions. Preparation is complete. Actual opening and a production ballot await separate explicit approval of this scope.

## Exact proposed runtime change

- Cloudflare account: `66f376df57f4fb383fde1bbe8b29ffb1`.
- Worker: `butter-salsa-poll-production`; current closed version `6d52882d-e06e-4e54-98fc-7c23c38b7f0c`.
- Reviewed source: commit `7da632ab1806e5dfbb01463446734ae22a04aa16`; only `src/worker.js` and `src/poll.js` from that commit are bundled. No source edit.
- Sole configuration delta: **POLL_OPEN `false` → `true`**. Preserve production D1 `a6d45ef4-32d4-4d7a-a501-c2c0788fbcd3`, exact origin `https://butterinthesalsa.com`, hostname `butterinthesalsa.com`, workers.dev endpoint, disabled preview URLs/observability, compatibility date and limiter namespaces 2001/2002 with their existing limits.
- Preserve both already deployed production secrets, especially VOTER_HASH_SECRET. No upload, rotation or copying of secret values. Inspect binding names/custody without exposing values. Abort if required bindings are absent or incompatible.
- One same-source production Worker deploy with the prepared open config is proposed. It creates a new Worker version; record and inspect the actual version and settings. This is a newly requested Worker activation scope, separate from the earlier Pages-only release.
- Public frontend stays at the already released commit; it discovers open=true through its existing results requests. No frontend deployment, Git commit/push, workflow dispatch, DNS, Pages setting, route or Turnstile change.

## Reviewable operator package

Local custody on edge01: `working/poll-opening-scope/` in the original repository. `activation-manifest.json` pins source/config/migration digests, identities and ballot/end-state choices. Manifest SHA256: **`0d0677d1b2ae7e0de5b699254b2b8a91931fbd4522f13888d7c8682aa6548531`**. `config-change.diff` shows the one-line change. Manifest/package must still match before execution; any drift requires review.

`package/wrangler.open.json` and `package/wrangler.closed.json` share exactly the same source and resource settings except POLL_OPEN. Both bundle-only dry runs passed. This package contains no `.dev.vars`, database data or Worker secret values. Its migration copy is pinned reference material; no migration command is included.

After explicit approval only, the deployment forms from the original repository root would be:

```sh
/tmp/butter-approved-release-o4b4k6ej/checkout/site/poll-api/node_modules/.bin/wrangler deploy --config working/poll-opening-scope/package/wrangler.open.json
# Only for the bounded failure/closure conditions described below:
/tmp/butter-approved-release-o4b4k6ej/checkout/site/poll-api/node_modules/.bin/wrangler deploy --config working/poll-opening-scope/package/wrangler.closed.json
```

The installed Wrangler is 4.151.1. If the temporary CLI checkout is absent, stop and re-establish the same locked tooling before proceeding; do not substitute arbitrary versions/configuration. No command above was executed without `--dry-run` during preparation.

## Ballot accounting agreement

The owner will cast **one genuine Team Whatever vote**, option ID `whatever`, through the normal published page at https://butterinthesalsa.com/. The owner operates the browser and completes real production Turnstile. No synthetic token, injected verifier, direct SQL insert or agent-generated browser identity.

The vote is real poll participation and stays counted under the owner-managed retention policy. It is not a disposable smoke ballot. No deletion, counter subtraction, reset, identity replacement or secret rotation is authorized afterward. Closure never implies deletion.

Expected controlled acceptance window:

| Observation | Ballots | Butter | Salsa | Absolutely not | Whatever |
| --- | ---: | ---: | ---: | ---: | ---: |
| Verified baseline before activation | 0 | 0 | 0 | 0 | 0 |
| Immediately before owner submission | 0 | 0 | 0 | 0 | 0 |
| Owner accepted response and authoritative accounting | 1 | 0 | 0 | 0 | 1 |

Expected normal response: HTTP 200, accepted=true, duplicate=false, optionId=whatever. Capture only these response facts and timing, not request bodies, browser voter IDs, Turnstile tokens, raw IPs or voter hashes. Keep the same browser/profile/storage throughout; do not clear storage, change device or use a new identity to retry.

Only this one deliberate submission is proposed. No production duplicate/replay/expiry/rate-limit stress tests or second test ballot. Prior local/preview evidence covers those behaviors. If transport or response outcome is uncertain, do not automatically retry or create another identity; follow failure closure and reconcile the preserved data first.

The poll becomes globally open immediately when the flag changes. There is no reservation or private first-voter lock in the current design. Coordinate with the owner ready at the page, recheck zero just before submission, and use a short acceptance window. If another public ballot appears before first-vote validation completes, do not label it an owner test vote, remove it, or claim the owner was first. Close under the proposed failure authority, preserve every ballot and report the actual counts for owner review. After successful acceptance is recorded and public operation begins, subsequent legitimate votes are expected and are not by themselves a failure.

## Proposed execution and verification sequence

1. Obtain explicit activation approval and confirm the owner is ready to make the selected vote. Recheck remote main/source, package digests, approved account, actual Worker version/bindings, production zero baseline and preview exactly three. Stop for unexpected drift rather than adjusting resources/data.
2. Deploy the reviewed same-source Worker with the open config. Inspect actual provider version/configuration and both secret binding names; verify correct production DB/limits/origin and POLL_OPEN=true. Record new Worker version. No migration or secret upload.
3. Read production API from the exact approved origin; require open=true with the still-zero baseline. Open/reload the actual HTTPS page and confirm four readable results and functioning real verification. Allow normal visible polling/manual Refresh to discover the new state. Do not count a cached results response as authoritative ballot accounting.
4. Recheck D1 zero while the owner is ready. Owner selects **Team Whatever**, completes Turnstile and activates Make My Position Official once. Observe/capture the accepted response facts and UI confirmation. The agent does not click Submit or manufacture a vote.
5. Verify authoritative D1 ballots and every option counter/grouped count. With no competing ballot, require exactly one stored ballot, Whatever=1, other counts zero. Wait at least 12 seconds for the Worker's ten-second shared aggregate cache to expire, then refresh results and require total=1, Whatever=1 and open=true. A temporarily stale immediate UI result is expected; do not submit again to fix it.
6. Verify owner confirmation remains understandable, production is open, data/counters agree, both secret bindings and intended version/settings persist, and preview still has exactly three votes and the original version. Record acceptance before treating later public votes as ordinary operation.
7. **Successful end state: leave public voting OPEN**, with the genuine owner ballot counted. No automatic closure/deletion schedule. Record actual version, timestamps, ballot delta, final counters and any known limitations in a local Abbey session; no additional commit/push is implied.

## Authoritative read-only accounting query

Use the explicit production D1/config, never preview, and retain only aggregates:

```sql
SELECT t.option_id, t.count,
       (SELECT COUNT(*) FROM ballots b
        WHERE b.poll_id=t.poll_id AND b.option_id=t.option_id) AS ballots
FROM totals t
WHERE t.poll_id='salsa-crisis-v1'
ORDER BY t.option_id;
```

This single query compares all counters with grouped ballots in one statement. Require all four option rows and equal count/ballots per row, then sum the ballot column for the expected total. Supplement with migration/schema identity checks if baseline drift is suspected; do not read or log raw ballot rows. D1 is authoritative while shared API results may lag.

## Proposed failure-close authority

A future approval of this scope should include same-source closure if activation/acceptance fails. Stop ballot attempts and deploy the pinned closed config if the new version/bindings/origins differ, API/widget or acceptance fails, counts/response are ambiguous, a competing ballot disrupts the controlled window, or the owner cannot complete the vote within ten minutes of opening. If failure occurs before opening, leave the current closed version intact.

After closure, require GET open=false and record unchanged preserved D1 counts; prior accepted ballots, including an owner ballot with a lost response or any other real vote, remain stored. Do not delete, repair, restore or rerun migrations. Prefer the explicit closed source/config deploy rather than native rollback whose settings may reopen voting. Record the resulting closed version and incident evidence. Reopening after an unsuccessful acceptance needs further owner direction.

If the provider cannot execute closure or confirm its result, report the actual open/unknown state urgently; never claim voting closed without evidence. No DNS/Pages/route changes are an authorized fallback.

## Preservation and exclusions

Preview Worker/D1/widget remain untouched: version `3f2da025-703c-4b45-bbc9-a048f2dea6ff`, three ballots Butter 1 / Salsa 0 / Absolutely not 1 / Whatever 1. Preserve the original localhost preview, Mac tunnel and separate read-only Tailscale preview. Do not run historical hosted acceptance helpers; some write preview ballots.

No commits, pushes, Pages/site publication, DNS/Pages settings, extra resources, schema changes, data export/import/deletion, backup transfer, HMAC rotation, changed origin/hostname, limiter changes or additional deliberate ballots are in the activation scope. Existing owner acceptance of local-only recovery remains in force; no remote recovery guarantee is implied.

## Preparation evidence and current state

Current read-only API/D1 queries confirm production closed/zero and preview three; actual Worker versions match the closed/preview baseline. Source is copied from the clean released checkout and pinned to its commit. Open and closed bundle dry runs passed. The original checkout/index and actual tracked production configuration remain unchanged. Evidence: `working/poll-opening-scope/{baseline.json,production-baseline-db.json,preview-baseline-db.json,open-dry-run.log,closed-dry-run.log,activation-manifest.json,config-change.diff}`.

Scope preparation does not constitute activation approval. Nothing is open or voted by this task.
