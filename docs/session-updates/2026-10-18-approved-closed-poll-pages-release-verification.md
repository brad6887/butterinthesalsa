---
title: "Approved closed poll Pages release verification"
description: "Exact approved commit deployed through Pages with voting closed and preview preserved."
date: 2026-10-18
status: complete
reviewed: false
session: approved-closed-poll-pages-release-verification
tags:
  - Abbey Root
---

# Approved closed poll Pages release verification

## Authorization and definition of done

Owner explicitly approved the 58-file commit and public Pages release from a separate clean checkout, with voting CLOSED, all three preview votes preserved and deployment verified. Worker deployment, DNS and hosted Pages settings changes excluded. Definition of done achieved: exact manifest commit, successful Pages build/deploy, served-byte and live-browser checks, closed/zero production, preserved preview and original checkout, captured release evidence.

## Exact source release

- Repository: brad6887/butterinthesalsa, existing origin:main publication path.
- Approved manifest SHA256: `2a86cff6a83b374e8479406bdd79774149dd597e428cdb4c3569897a1275d0a5`.
- Parent/base: `f6811482318348f2b17c92569d4d7ad0424001b1`, matched live remote main before release.
- Commit: **`7da632ab1806e5dfbb01463446734ae22a04aa16`**, message `Add reunion poll frontend with closed production integration`.
- Exactly 58 approved paths: five modified and 53 added. Staged/committed path set, file modes and every file's bytes verified against the approved manifest before push. No extra file, deletion or rename.
- Separate release checkout: `/tmp/butter-approved-release-o4b4k6ej/checkout`, created from the original repository's committed base and pointed at the actual GitHub remote. Private environment files, runtime/evidence directories and dependencies were not copied. Checkout remains clean and is retained for verification/reconciliation.
- Clean dependency installs, shared release validation (16 poll and 19 artifact/navigation checks), Abbey build/site validate/publish dry run and whitespace checks passed. Three previously disclosed extra EOF blank-line warnings in historical helpers were preserved exactly; no source normalization or additional commit.
- Invoked actual `abbey site publish` from the clean committed checkout, with its confirmation satisfied by the owner's explicit authorization. It built/checked the artifact and pushed only HEAD:main. Remote main independently verified as the approved SHA.

Commit: https://github.com/brad6887/butterinthesalsa/commit/7da632ab1806e5dfbb01463446734ae22a04aa16

## Actual GitHub Actions deployment

Run **39141059046**, Butter in the Salsa Pages, head SHA exactly the approved commit. Actual API evidence shows completed/success, with both build and deploy jobs successful. The build includes both dependency installs and the shared production artifact/poll validation step; artifact upload and deploy-pages also succeeded. No manual workflow dispatch or Worker deployment.

Run: https://github.com/brad6887/butterinthesalsa/actions/runs/39141059046

## Served-content and browser verification

- Public site: https://butterinthesalsa.com/
- Independently fetched **all ten artifact files over HTTP and all ten over HTTPS**, including index, compiled JavaScript and eight image derivatives. Every SHA256 matches the approved clean-build artifact byte for byte. Receipts include URL, protocol, size, actual/expected digest and match result.
- Actual live browser navigated from HTTP to `https://butterinthesalsa.com/?release=7da632a#reunion-poll`, preserving query/fragment and reaching a secure context. No document/API/widget response mocking.
- Correct production API URL and public widget key present. Actual production GET displayed four `0 (0.0%)` results and “Voting is closed. Results remain available.” Choices and Submit remained disabled; Refresh returned the real zero results. No vote POST or browser page error occurred.
- This is the published JavaScript HTTP-to-HTTPS redirect, not a server 301/HSTS or DNS/settings change. No real voting/ballot acceptance is claimed.

## Final resource and preservation checks

- Production API and remote D1: **open=false, zero ballots, all four zero counters**. Worker remains `6d52882d-e06e-4e54-98fc-7c23c38b7f0c`; D1 remains `a6d45ef4-32d4-4d7a-a501-c2c0788fbcd3`. Both production/close configs remain CLOSED. No Worker, D1 schema, secret, widget, origin or limiter change.
- Preview API and remote D1: **three ballots preserved**, Butter 1, Salsa 0, Absolutely not 1, Whatever 1; grouped ballot/counter checks match. Worker remains `3f2da025-703c-4b45-bbc9-a048f2dea6ff`.
- Existing preview PID 332757 and read-only Tailscale PID 346833 remain running. Edge01 localhost:4322 and the original Mac tunnel return HTTP 200. Neither process nor tunnel restarted.
- Original `/home/bcooke/git/butterinthesalsa` remains at base f681148 with its prior dirty source and byte-identical Git index/tracked diff. This is intentional preservation; it is not the checkout that was committed/pushed. Its local origin/main reference was not refreshed or branch reset. Do not blindly recommit/push that old dirty checkout. Use the recorded release commit/clean checkout for future reconciliation.
- Only this post-release session capture and local evidence were added afterward. No second documentation commit or amendment. Actual deployed source/version mapping is recorded here without inventing a self-referential commit ID in the historical rollback record.

## Evidence custody

Original checkout `working/poll-approved-release/` contains preflight, checkout/commit receipts, staged patch, validation/commit/publish logs, artifact digests, actual Actions run/jobs JSON, HTTP/HTTPS served-file receipts, live browser result, read-only D1/API/version evidence, original diff/index receipt, final state and Abbey review/status. No secret values, voter hashes, token bodies or raw ballots retained. These are local evidence, not additional committed/public artifacts.

## Remaining boundary

Public Pages release is complete and verified **with voting closed**. Opening voting remains unauthorized. Any future production vote acceptance needs an explicit ballot/accounting plan. Owner-managed retention and explicit acceptance of local-only secret custody/unproven hosted recovery remain the selected policies. No DNS or hosted Pages settings change, Worker deployment, backup/restore, HMAC rotation, data deletion or additional commit occurred.
