---
title: "Production voting activation and first owner ballot"
description: "Authorized activation succeeded; genuine Team Whatever ballot accounted and voting left open."
date: 2026-10-18
status: complete
reviewed: false
session: production-voting-activation-first-owner-ballot
tags:
  - Abbey Root
---

# Production voting activation and first owner ballot

## Authorization and result

Owner explicitly approved the pinned activation scope including failure closure, stated readiness to cast Team Whatever, requested ballot verification and leaving voting open after success. Activation and first-ballot acceptance completed successfully. **Production voting remains OPEN.** Failure closure was not needed.

## Verified change

- Preflight matched activation manifest SHA256 `0d0677d1b2ae7e0de5b699254b2b8a91931fbd4522f13888d7c8682aa6548531`, all package/source digests, released source commit `7da632ab1806e5dfbb01463446734ae22a04aa16`, remote main, account and prior closed Worker version.
- Before activation, production API and authoritative D1 accounting were zero across all four choices and voting was closed. Preview was exactly three ballots with its expected version. Both production secret binding names were verified without retrieving values.
- Deployed the prepared same-source production Worker with the sole configuration delta POLL_OPEN=false to true. Actual new version: **`4615a055-da18-45aa-ba39-7c00f0e07824`**.
- Independently inspected actual deployed settings: correct production D1 `a6d45ef4-32d4-4d7a-a501-c2c0788fbcd3`, exact HTTPS origin/hostname, limiter namespaces 2001/2002, POLL_OPEN=true and both existing secret bindings. No secret upload/rotation, schema migration, resource provisioning or code change.
- Verified open=true with zero results, then prompted the owner to submit once through the normal published page. No agent ballot or synthetic verification was used.

## First-ballot receipt

Owner selected Team Whatever under the approved scope and reported **“worked with no issues”** after the single-submission prompt. No request body/token, browser ID, IP or voter hash was captured. The raw owner-browser HTTP response was not captured; no HTTP status or accepted/duplicate fields are invented from the brief report.

Authoritative single-statement D1 accounting and the subsequent public API result establish the expected delta:

| State | Ballots | Butter | Salsa | Absolutely not | Whatever |
| --- | ---: | ---: | ---: | ---: | ---: |
| Before activation/submission window | 0 | 0 | 0 | 0 | 0 |
| First-ballot acceptance | 1 | 0 | 0 | 0 | 1 |

Every counter matched its grouped ballot count. Exactly one ballot was observed during acceptance with no competing ballot. This is the owner's genuine poll participation, retained under the owner-managed retention policy, not a disposable test ballot. No deletion, reset, counter subtraction, duplicate/replay test, retry under another identity or second deliberate submission occurred.

After waiting beyond the ten-second aggregate cache lifetime, public API showed open=true, total=1, Whatever=1 and other counts zero. A separate read-only browser visit to the actual published HTTPS site verified open choices for a fresh visitor, the same results and working Refresh. It sent no vote POST. The owner may remain locked out of resubmission in their already-voted browser as intended; the fresh visitor check did not cast another ballot.

Acceptance timestamps and the frozen first-ballot receipt are in `working/poll-activation/acceptance.json`. The ten-minute acceptance deadline was met. Later legitimate public ballots are ordinary operation and must not be reset to this historical one-vote snapshot.

## Final state and preservation

- Production remains **OPEN** on version `4615a055-da18-45aa-ba39-7c00f0e07824`; final observed total was one, Team Whatever one, all other options zero.
- Preview still has three ballots: Butter 1, Salsa 0, Absolutely not 1, Whatever 1, on unchanged version `3f2da025-703c-4b45-bbc9-a048f2dea6ff`. No preview submission or mutation.
- Actual public frontend HTTP/HTTPS index bytes still match the approved Pages release. Remote main remains `7da632ab1806e5dfbb01463446734ae22a04aa16`; no commit, push, workflow dispatch, public-site redeployment, DNS or hosted Pages change.
- Original tracked diff and Git index remain byte-identical. Current local operations README now records OPEN, the actual version, accepted ballot and the operator package. Historical committed production/close configs remain the closed release snapshot; deploying them would close voting. No Git history or reviewed source/configuration was silently rewritten.
- Existing localhost preview, read-only mobile preview and Mac tunnel are preserved. No restart or cleanup was performed.

## Evidence and ongoing operation

`working/poll-activation/` contains preflight, activation start/deadline, deploy log, actual version/binding verification, authoritative aggregate receipt, user report, post-cache API/D1 acceptance, real public-browser observation, final state and preservation/review records. Evidence retains no raw ballot identities, tokens or secret values. Only local documentation/evidence was updated after activation; no further commit is implied.

Use `working/poll-opening-scope/package/wrangler.closed.json` with the pinned compatible source for an authorized future close, preserving all ballots and the HMAC. Reopening after a future incident, database recovery, secret changes or deletion needs appropriate separate direction. Owner-managed retention and explicit local-only/unproven-hosted-recovery acceptance remain in force; no automatic closure/deletion or new monitoring automation was created.

Public poll: https://butterinthesalsa.com/
